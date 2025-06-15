
-- Create a table to track games that streamers play
CREATE TABLE public.games (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to track what game each streamer played and when
CREATE TABLE public.streamer_games (
  id BIGSERIAL PRIMARY KEY,
  streamer_id BIGINT NOT NULL REFERENCES public.streamers(id) ON DELETE CASCADE,
  game_id BIGINT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_streamer_games_streamer_id ON public.streamer_games(streamer_id);
CREATE INDEX idx_streamer_games_game_id ON public.streamer_games(game_id);
CREATE INDEX idx_streamer_games_played_at ON public.streamer_games(played_at);

-- Create a table for funds (groups of streamers by game)
CREATE TABLE public.funds (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 20.00,
  change NUMERIC NOT NULL DEFAULT 0,
  change_percent NUMERIC NOT NULL DEFAULT 0,
  total_streamers INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  payout_threshold NUMERIC NOT NULL DEFAULT 100.00,
  has_paid_out BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for user fund portfolio
CREATE TABLE public.fund_portfolio (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fund_id BIGINT NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  shares INTEGER NOT NULL DEFAULT 0,
  avg_price NUMERIC NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, fund_id)
);

-- Create a table for fund transactions
CREATE TABLE public.fund_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fund_id BIGINT NOT NULL REFERENCES public.funds(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'payout')),
  shares INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streamer_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for games (public read access)
CREATE POLICY "Anyone can view games" ON public.games FOR SELECT USING (true);

-- Create RLS policies for streamer_games (public read access)
CREATE POLICY "Anyone can view streamer games" ON public.streamer_games FOR SELECT USING (true);

-- Create RLS policies for funds (public read access)
CREATE POLICY "Anyone can view funds" ON public.funds FOR SELECT USING (true);

-- Create RLS policies for fund_portfolio (users can only see their own)
CREATE POLICY "Users can view their own fund portfolio" ON public.fund_portfolio 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own fund portfolio" ON public.fund_portfolio 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own fund portfolio" ON public.fund_portfolio 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for fund_transactions (users can only see their own)
CREATE POLICY "Users can view their own fund transactions" ON public.fund_transactions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own fund transactions" ON public.fund_transactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert some sample games
INSERT INTO public.games (name) VALUES 
  ('Just Chatting'),
  ('League of Legends'),
  ('Fortnite'),
  ('Valorant'),
  ('Grand Theft Auto V'),
  ('Minecraft'),
  ('World of Warcraft'),
  ('Counter-Strike 2'),
  ('Apex Legends'),
  ('Call of Duty: Warzone');

-- Create a function to update fund prices based on streamer performance
CREATE OR REPLACE FUNCTION update_fund_prices()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  fund_record RECORD;
  avg_price_change NUMERIC;
  streamer_count INTEGER;
BEGIN
  FOR fund_record IN SELECT * FROM public.funds WHERE is_active = true AND has_paid_out = false
  LOOP
    -- Calculate average price change of streamers who played this game in last 24 hours
    SELECT 
      AVG(s.change_percent),
      COUNT(DISTINCT s.id)
    INTO avg_price_change, streamer_count
    FROM public.streamers s
    JOIN public.streamer_games sg ON s.id = sg.streamer_id
    WHERE sg.game_id = fund_record.game_id
      AND sg.played_at >= now() - INTERVAL '24 hours';

    -- Update fund price based on average streamer performance
    IF avg_price_change IS NOT NULL AND streamer_count > 0 THEN
      UPDATE public.funds 
      SET 
        price = GREATEST(1.0, fund_record.price * (1 + (avg_price_change / 100))),
        change = fund_record.price * (avg_price_change / 100),
        change_percent = avg_price_change,
        total_streamers = streamer_count,
        updated_at = now()
      WHERE id = fund_record.id;

      -- Check if fund hit payout threshold
      IF fund_record.price >= fund_record.payout_threshold THEN
        UPDATE public.funds 
        SET has_paid_out = true, is_active = false
        WHERE id = fund_record.id;
        
        -- Process payouts to fund holders
        INSERT INTO public.fund_transactions (user_id, fund_id, type, shares, price)
        SELECT 
          fp.user_id,
          fp.fund_id,
          'payout',
          fp.shares,
          fund_record.payout_threshold
        FROM public.fund_portfolio fp
        WHERE fp.fund_id = fund_record.id AND fp.shares > 0;
        
        -- Update user balances
        UPDATE public.balances
        SET balance = balance + (
          SELECT COALESCE(SUM(fp.shares * fund_record.payout_threshold), 0)
          FROM public.fund_portfolio fp
          WHERE fp.fund_id = fund_record.id AND fp.user_id = balances.user_id
        )
        WHERE user_id IN (
          SELECT DISTINCT user_id 
          FROM public.fund_portfolio 
          WHERE fund_id = fund_record.id AND shares > 0
        );
      END IF;
    END IF;
  END LOOP;
END;
$$;
