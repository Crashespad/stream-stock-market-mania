
-- Add a check to ensure streamers have at least 100 followers to be listed
-- We'll use a trigger instead of a check constraint for better flexibility
CREATE OR REPLACE FUNCTION validate_streamer_followers()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.followers < 100 THEN
    RAISE EXCEPTION 'Streamers must have at least 100 followers to be listed on the platform';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
DROP TRIGGER IF EXISTS validate_followers_on_insert ON streamers;
CREATE TRIGGER validate_followers_on_insert
  BEFORE INSERT ON streamers
  FOR EACH ROW
  EXECUTE FUNCTION validate_streamer_followers();

-- Create trigger for UPDATE operations
DROP TRIGGER IF EXISTS validate_followers_on_update ON streamers;
CREATE TRIGGER validate_followers_on_update
  BEFORE UPDATE ON streamers
  FOR EACH ROW
  EXECUTE FUNCTION validate_streamer_followers();

-- Update any existing streamers that don't meet the requirement
-- (This will remove streamers with less than 100 followers)
DELETE FROM streamers WHERE followers < 100;
