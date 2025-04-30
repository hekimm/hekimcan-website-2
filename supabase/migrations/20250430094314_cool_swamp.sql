-- Drop certifications table if it exists
DROP TABLE IF EXISTS certifications;

-- Create education table with updated fields
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  school TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  order_number INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- Create policies with safety checks
DO $$ 
BEGIN
  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'education' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
      ON education FOR SELECT
      USING (true);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'education' 
    AND policyname = 'Enable insert for authenticated users only'
  ) THEN
    CREATE POLICY "Enable insert for authenticated users only"
      ON education FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'education' 
    AND policyname = 'Enable update for authenticated users only'
  ) THEN
    CREATE POLICY "Enable update for authenticated users only"
      ON education FOR UPDATE
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'education' 
    AND policyname = 'Enable delete for authenticated users only'
  ) THEN
    CREATE POLICY "Enable delete for authenticated users only"
      ON education FOR DELETE
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Insert sample education data if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM education 
    WHERE school = 'Manisa Celal Bayar Üniversitesi' 
    AND field = 'Yazılım Mühendisliği'
  ) THEN
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
    ) VALUES (
      'Manisa Celal Bayar Üniversitesi',
      'Lisans',
      'Yazılım Mühendisliği',
      '2021-09-01',
      NULL,
      true,
      'Manisa, Türkiye',
      'Yazılım Mühendisliği alanında lisans eğitimime devam ediyorum. Modern yazılım geliştirme teknolojileri, veri yapıları, algoritmalar ve yazılım mimarisi konularında kapsamlı eğitim alıyorum.',
      ARRAY['Bölüm birinciliği', '3.85 GPA', 'Akademik başarı bursu'],
      0
    );
  END IF;
END $$;