/*
  # Fix Education Table Policies

  1. Changes
    - Drop existing policies if they exist
    - Recreate policies with proper checks
    - Keep existing table structure
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON education;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON education;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON education;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON education;

-- Recreate policies
CREATE POLICY "Enable read access for all users"
  ON education FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON education FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only"
  ON education FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only"
  ON education FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert sample education data if not exists
INSERT INTO education (
  school,
  degree,
  field,
  start_date,
  end_date,
  current,
  location,
  description,
  achievements,
  order_number
) 
SELECT
  'Manisa Celal Bayar Üniversitesi',
  'Lisans',
  'Yazılım Mühendisliği',
  '2021-09-01'::date,
  NULL,
  true,
  'Manisa, Türkiye',
  'Yazılım Mühendisliği alanında lisans eğitimime devam ediyorum. Modern yazılım geliştirme teknolojileri, veri yapıları, algoritmalar ve yazılım mimarisi konularında kapsamlı eğitim alıyorum.',
  ARRAY['Bölüm birinciliği', '3.85 GPA', 'Akademik başarı bursu'],
  0
WHERE NOT EXISTS (
  SELECT 1 FROM education 
  WHERE school = 'Manisa Celal Bayar Üniversitesi' 
  AND field = 'Yazılım Mühendisliği'
);