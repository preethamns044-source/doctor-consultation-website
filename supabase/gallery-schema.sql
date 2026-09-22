-- Create the gallery_images table
CREATE TABLE gallery_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url text NOT NULL,
    title text,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public access to view gallery images
CREATE POLICY "Allow public viewing of gallery images" 
ON gallery_images
FOR SELECT 
TO public 
USING (true);

-- Policy: Allow authenticated users (owners/admins) to insert, update, delete
CREATE POLICY "Allow authenticated users to insert gallery images" 
ON gallery_images
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update gallery images" 
ON gallery_images
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to delete gallery images" 
ON gallery_images
FOR DELETE 
TO authenticated 
USING (true);

-- Create a storage bucket for the gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true);

-- Enable Row Level Security (RLS) on the storage.objects table
-- Note: Supabase enables this by default, but policies need to be added

-- Storage Policy: Allow public to view (read) images from the gallery bucket
CREATE POLICY "Allow public viewing of gallery bucket" 
ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'gallery');

-- Storage Policy: Allow authenticated users to upload, update, delete images in the gallery bucket
CREATE POLICY "Allow authenticated users to manage gallery bucket"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');
