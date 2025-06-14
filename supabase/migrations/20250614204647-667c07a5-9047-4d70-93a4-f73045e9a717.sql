
-- Create user analytics and dashboard tables
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  total_trades INTEGER DEFAULT 0,
  total_profit_loss NUMERIC DEFAULT 0,
  best_performing_streamer_id BIGINT REFERENCES streamers(id),
  worst_performing_streamer_id BIGINT REFERENCES streamers(id),
  portfolio_growth_percentage NUMERIC DEFAULT 0,
  risk_score NUMERIC DEFAULT 0,
  trading_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('price_alert', 'trade_executed', 'milestone', 'news', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price alerts table
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  streamer_id BIGINT REFERENCES streamers(id) NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below')),
  target_price NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create watchlist table
CREATE TABLE public.watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  streamer_id BIGINT REFERENCES streamers(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streamer_id)
);

-- Create leaderboard table
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  rank INTEGER,
  total_portfolio_value NUMERIC NOT NULL,
  profit_loss NUMERIC NOT NULL,
  profit_loss_percentage NUMERIC NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, period)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  criteria JSONB NOT NULL,
  reward_type TEXT CHECK (reward_type IN ('badge', 'cash', 'title')),
  reward_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create social features tables
CREATE TABLE public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users NOT NULL,
  following_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create trade sharing table
CREATE TABLE public.shared_trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  transaction_id BIGINT REFERENCES transactions(id) NOT NULL,
  caption TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create educational content table
CREATE TABLE public.educational_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'tutorial', 'tip')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  author_id UUID REFERENCES auth.users,
  published BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for all tables
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;

-- User analytics policies
CREATE POLICY "Users can view their own analytics" ON public.user_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own analytics" ON public.user_analytics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert analytics" ON public.user_analytics FOR INSERT WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Price alerts policies
CREATE POLICY "Users can manage their own price alerts" ON public.price_alerts FOR ALL USING (auth.uid() = user_id);

-- Watchlist policies
CREATE POLICY "Users can manage their own watchlist" ON public.watchlist FOR ALL USING (auth.uid() = user_id);

-- Leaderboard policies (public read)
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY "System can manage leaderboard" ON public.leaderboard FOR ALL USING (true);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admin can manage achievements" ON public.achievements FOR ALL USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can award achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- User follows policies
CREATE POLICY "Users can view all follows" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their own follows" ON public.user_follows FOR ALL USING (auth.uid() = follower_id);

-- Shared trades policies
CREATE POLICY "Anyone can view shared trades" ON public.shared_trades FOR SELECT USING (true);
CREATE POLICY "Users can manage their own shared trades" ON public.shared_trades FOR ALL USING (auth.uid() = user_id);

-- Educational content policies
CREATE POLICY "Anyone can view published content" ON public.educational_content FOR SELECT USING (published = true);
CREATE POLICY "Authors can manage their own content" ON public.educational_content FOR ALL USING (auth.uid() = author_id);

-- Insert some default achievements
INSERT INTO public.achievements (name, description, icon, criteria, reward_type, reward_value) VALUES
('First Trade', 'Complete your first trade', 'trophy', '{"trades_count": 1}', 'cash', 1000),
('Profit Maker', 'Make your first profit', 'dollar-sign', '{"profit": 1}', 'cash', 5000),
('High Roller', 'Have a portfolio worth over $100,000', 'trending-up', '{"portfolio_value": 100000}', 'cash', 10000),
('Day Trader', 'Complete 10 trades in one day', 'clock', '{"daily_trades": 10}', 'badge', null),
('Diamond Hands', 'Hold a position for 30 days', 'gem', '{"hold_days": 30}', 'badge', null);

-- Enable realtime for key tables
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.leaderboard REPLICA IDENTITY FULL;
ALTER TABLE public.shared_trades REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_trades;
