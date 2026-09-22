-- Create an admin users table to act as an allowlist
CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create a secure helper function to check admin status
-- SECURITY DEFINER allows the function to bypass RLS to prevent infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Allow admins to view the allowlist
CREATE POLICY "Allow admins to view admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin());
