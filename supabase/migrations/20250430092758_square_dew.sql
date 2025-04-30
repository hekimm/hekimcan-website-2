/*
  # Add Footer Settings Table

  1. New Table
    - footer_settings
      - id (primary key)
      - about_text (text)
      - navigation_links (jsonb array)
      - social_links (jsonb)
      - copyright_text (text)
      - cta_text (text, optional)
      - created_at (timestamp)

  2. Security
    - Enable RLS
    - Public read access
    - Authenticated user management access
*/

-- Create footer_settings table
CREATE TABLE IF NOT EXISTS footer_settings (
  id SERIAL PRIMARY KEY,
  about_text TEXT NOT NULL,
  navigation_links JSONB[] NOT NULL DEFAULT '{}',
  social_links JSONB NOT NULL DEFAULT '{}',
  copyright_text TEXT NOT NULL,
  cta_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON footer_settings FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON footer_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only"
  ON footer_settings FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only"
  ON footer_settings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert default footer settings
INSERT INTO footer_settings (
  about_text,
  navigation_links,
  social_links,
  copyright_text
) VALUES (
  'Modern web teknolojileri ile yenilikçi çözümler geliştiriyorum. Kullanıcı deneyimini ön planda tutan, performanslı ve güvenli yazılımlar oluşturuyorum.',
  ARRAY[
    '{"label": "Gizlilik Politikası", "url": "/gizlilik"}',
    '{"label": "Kullanım Şartları", "url": "/sartlar"}'
  ]::jsonb[],
  '{
    "github": "https://github.com",
    "linkedin": "https://linkedin.com",
    "twitter": "https://twitter.com"
  }'::jsonb,
  '© 2024 Hekimcan AKTAŞ. Tüm hakları saklıdır.'
);