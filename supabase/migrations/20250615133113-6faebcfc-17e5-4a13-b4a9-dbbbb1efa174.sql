
-- Create enum for admin roles
CREATE TYPE public.admin_role AS ENUM ('admin', 'mod', 'streamer');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role admin_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id UUID, _role admin_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user has any admin role
CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_admin_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update API configs table RLS to allow admin access
DROP POLICY IF EXISTS "Admin only access" ON public.api_configs;
CREATE POLICY "Admin and mod access to api_configs"
ON public.api_configs
FOR ALL
TO authenticated
USING (
  public.has_admin_role(auth.uid(), 'admin') OR 
  public.has_admin_role(auth.uid(), 'mod')
);

-- Update streamers table to allow admin management
ALTER TABLE public.streamers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view streamers"
ON public.streamers
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Admins can manage all streamers"
ON public.streamers
FOR ALL
TO authenticated
USING (
  public.has_admin_role(auth.uid(), 'admin') OR 
  public.has_admin_role(auth.uid(), 'mod')
);

CREATE POLICY "Streamers can manage their own streamers"
ON public.streamers
FOR ALL
TO authenticated
USING (
  public.has_admin_role(auth.uid(), 'streamer') AND 
  user_id = auth.uid()
);

-- Create admin logs table for tracking actions
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs"
ON public.admin_logs
FOR SELECT
TO authenticated
USING (public.has_admin_role(auth.uid(), 'admin'));

-- Insert initial admin user (you'll need to update this with your actual user ID)
-- INSERT INTO public.user_roles (user_id, role, created_by) 
-- VALUES ('your-user-id-here', 'admin', 'your-user-id-here');
