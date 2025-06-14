
-- Create a table for contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('feature_suggestion', 'bug_report', 'general_feedback', 'support_request')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - making submissions readable by admins only
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to INSERT contact submissions
CREATE POLICY "Anyone can create contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that prevents users from viewing submissions (admin only access)
CREATE POLICY "No public access to view submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (false);
