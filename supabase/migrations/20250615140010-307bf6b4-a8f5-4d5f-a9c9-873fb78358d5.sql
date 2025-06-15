
-- Create balances management table for financial controls
CREATE TABLE public.balance_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('credit', 'debit', 'bonus', 'penalty', 'correction')),
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS on balance_adjustments
ALTER TABLE public.balance_adjustments ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage balance adjustments
CREATE POLICY "Admins can manage balance adjustments"
ON public.balance_adjustments
FOR ALL
TO authenticated
USING (public.has_admin_role(auth.uid(), 'admin'));

-- Create users management view for admins (fixed enum issue)
CREATE OR REPLACE VIEW public.admin_users_view AS
SELECT 
  au.id,
  au.email,
  au.created_at as registered_at,
  au.last_sign_in_at,
  au.email_confirmed_at,
  p.username,
  p.avatar_url,
  b.balance,
  ur.role,
  CASE WHEN au.banned_until > NOW() THEN true ELSE false END as is_banned
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.balances b ON au.id = b.user_id
LEFT JOIN public.user_roles ur ON au.id = ur.user_id;

-- Create user ban/suspension table
CREATE TABLE public.user_suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  suspended_by UUID REFERENCES auth.users(id) NOT NULL,
  reason TEXT NOT NULL,
  suspended_until TIMESTAMP WITH TIME ZONE,
  is_permanent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  lifted_at TIMESTAMP WITH TIME ZONE,
  lifted_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on user_suspensions
ALTER TABLE public.user_suspensions ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage suspensions
CREATE POLICY "Admins can manage user suspensions"
ON public.user_suspensions
FOR ALL
TO authenticated
USING (public.has_admin_role(auth.uid(), 'admin') OR public.has_admin_role(auth.uid(), 'mod'));

-- Add trigger to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_logs (user_id, action, target_type, target_id, details)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for logging
CREATE TRIGGER log_balance_adjustments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.balance_adjustments
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

CREATE TRIGGER log_user_suspensions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_suspensions
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

CREATE TRIGGER log_user_roles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();
