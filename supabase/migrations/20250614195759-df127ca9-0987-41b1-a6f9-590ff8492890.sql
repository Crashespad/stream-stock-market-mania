
-- Add social media and streaming links to the streamers table
ALTER TABLE public.streamers 
ADD COLUMN social_media_url TEXT,
ADD COLUMN streaming_url TEXT,
ADD COLUMN is_live BOOLEAN DEFAULT FALSE;

-- Update existing streamers with some example data
UPDATE public.streamers 
SET social_media_url = CASE 
  WHEN platform = 'twitch' THEN 'https://twitter.com/' || LOWER(REPLACE(name, ' ', ''))
  WHEN platform = 'youtube' THEN 'https://twitter.com/' || LOWER(REPLACE(name, ' ', ''))
END,
streaming_url = CASE 
  WHEN platform = 'twitch' THEN 'https://twitch.tv/' || LOWER(REPLACE(name, ' ', ''))
  WHEN platform = 'youtube' THEN 'https://youtube.com/@' || LOWER(REPLACE(name, ' ', ''))
END;
