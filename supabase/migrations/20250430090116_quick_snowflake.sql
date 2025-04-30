/*
  # Create Storage Bucket for Project Images

  1. Changes
    - Create project-images bucket
    - Set up public read access
    - Allow authenticated users to upload and delete images
    - Add file size and type restrictions
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES (
  'project-images',
  'project-images',
  true
);

-- Set up storage policies
-- Allow public access to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images'
  AND LENGTH(COALESCE(name, '')) <= 5 * 1024 * 1024  -- 5MB file size limit
  AND (LOWER(SUBSTRING(name FROM '\.([^\.]+)$')) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))  -- Only allow image files
);

-- Allow authenticated users to delete their uploaded images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');