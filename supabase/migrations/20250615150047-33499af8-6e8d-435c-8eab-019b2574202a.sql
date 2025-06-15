
-- First, let's create some sample funds based on the existing games
-- Insert sample streamer-game relationships (this links streamers to games they've played recently)
INSERT INTO public.streamer_games (streamer_id, game_id, played_at)
SELECT 
  s.id,
  g.id,
  now() - INTERVAL '12 hours'
FROM public.streamers s
CROSS JOIN public.games g
WHERE s.id <= 5 AND g.id <= 5  -- Only create relationships for first 5 streamers and games
ON CONFLICT DO NOTHING;

-- Create sample funds for each game
INSERT INTO public.funds (game_id, name, description, price, change, change_percent, total_streamers, payout_threshold)
SELECT 
  g.id,
  g.name || ' Fund',
  'Invest in streamers playing ' || g.name,
  CASE 
    WHEN g.id = 1 THEN 45.50
    WHEN g.id = 2 THEN 82.30
    WHEN g.id = 3 THEN 67.80
    WHEN g.id = 4 THEN 91.20
    WHEN g.id = 5 THEN 38.90
    ELSE 50.00
  END as price,
  CASE 
    WHEN g.id = 1 THEN 2.50
    WHEN g.id = 2 THEN -1.20
    WHEN g.id = 3 THEN 5.80
    WHEN g.id = 4 THEN 8.40
    WHEN g.id = 5 THEN -0.90
    ELSE 0
  END as change,
  CASE 
    WHEN g.id = 1 THEN 5.8
    WHEN g.id = 2 THEN -1.4
    WHEN g.id = 3 THEN 9.3
    WHEN g.id = 4 THEN 10.1
    WHEN g.id = 5 THEN -2.3
    ELSE 0
  END as change_percent,
  (SELECT COUNT(*) FROM public.streamer_games sg WHERE sg.game_id = g.id AND sg.played_at >= now() - INTERVAL '24 hours') as total_streamers,
  100.00 as payout_threshold
FROM public.games g
WHERE g.id <= 5
ON CONFLICT DO NOTHING;

-- Update fund prices using the existing function
SELECT public.update_fund_prices();
