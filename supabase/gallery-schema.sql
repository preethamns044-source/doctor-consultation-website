-- Create the gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url text NOT NULL,
    title text,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public access to view gallery images
CREATE POLICY "Allow public viewing of gallery images" 
ON public.gallery_images
FOR SELECT 
TO public 
USING (true);

-- Policy: Allow authenticated admins to insert gallery images
CREATE POLICY "Allow admins to insert gallery images" 
ON public.gallery_images
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

-- Policy: Allow authenticated admins to update gallery images
CREATE POLICY "Allow admins to update gallery images" 
ON public.gallery_images
FOR UPDATE 
TO authenticated 
USING (public.is_admin());

-- Policy: Allow authenticated admins to delete gallery images
CREATE POLICY "Allow admins to delete gallery images" 
ON public.gallery_images
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- Create a storage bucket for the gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow public to view (read) images from the gallery bucket
CREATE POLICY "Allow public viewing of gallery bucket" 
ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'gallery');

-- Storage Policy: Allow admins to manage gallery bucket
CREATE POLICY "Allow admins to manage gallery bucket"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'gallery' AND public.is_admin())
WITH CHECK (bucket_id = 'gallery' AND public.is_admin());
