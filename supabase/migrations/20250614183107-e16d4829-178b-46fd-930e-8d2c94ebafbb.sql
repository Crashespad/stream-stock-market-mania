
-- Update handle_new_user function to grant 20 million starting balance
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.balances (user_id, balance)
  VALUES (new.id, 20000000);
  
  RETURN new;
END;
$$;

-- Add user_id to streamers table to allow claiming
ALTER TABLE public.streamers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE;

-- Add RLS policy to allow claiming
CREATE POLICY "Allow users to claim an unclaimed streamer"
ON public.streamers
FOR UPDATE
TO authenticated
USING (user_id IS NULL)
WITH CHECK (user_id = auth.uid());
