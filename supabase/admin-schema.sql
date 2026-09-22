-- Create an admin users table to act as an allowlist
CREATE TABLE admin_users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admins to view the allowlist
CREATE POLICY "Allow admins to view admin_users"
ON admin_users
FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Update gallery_images policies to restrict INSERT/UPDATE/DELETE to admins only
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery images" ON gallery_images;
CREATE POLICY "Allow admins to insert gallery images" 
ON gallery_images
FOR INSERT 
TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Allow authenticated users to update gallery images" ON gallery_images;
CREATE POLICY "Allow admins to update gallery images" 
ON gallery_images
FOR UPDATE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Allow authenticated users to delete gallery images" ON gallery_images;
CREATE POLICY "Allow admins to delete gallery images" 
ON gallery_images
FOR DELETE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Update storage policies
DROP POLICY IF EXISTS "Allow authenticated users to manage gallery bucket" ON storage.objects;
CREATE POLICY "Allow admins to manage gallery bucket"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'gallery' AND EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
WITH CHECK (bucket_id = 'gallery' AND EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
