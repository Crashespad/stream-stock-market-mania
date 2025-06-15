
-- Add API configuration table
CREATE TABLE public.api_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL UNIQUE CHECK (service IN ('youtube', 'twitch')),
  client_id TEXT,
  client_secret TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for API configs (admin only)
ALTER TABLE public.api_configs ENABLE ROW LEVEL SECURITY;

-- Add external_id column to streamers for API mapping
ALTER TABLE public.streamers 
ADD COLUMN external_id TEXT,
ADD COLUMN last_updated TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create unique index for external_id per platform
CREATE UNIQUE INDEX idx_streamers_external_platform ON public.streamers(external_id, platform) WHERE external_id IS NOT NULL;

-- Update existing streamers with mock external IDs
UPDATE public.streamers 
SET external_id = CASE 
  WHEN platform = 'twitch' THEN LOWER(REPLACE(name, ' ', ''))
  WHEN platform = 'youtube' THEN 'UC' || UPPER(SUBSTR(MD5(name), 1, 22))
END;
