/*
  # Remove skill levels and update schema

  1. Changes
    - Remove 'seviye' column from yetenekler table
    - Add default categories
  
  2. Security
    - Maintain existing RLS policies
*/

-- Remove seviye column from yetenekler table
ALTER TABLE yetenekler DROP COLUMN IF EXISTS seviye;

-- Insert default categories if they don't exist
INSERT INTO yetenekler (isim, aciklama, ikon_url, kategori)
VALUES 
  ('JavaScript', 'Modern web uygulamaları geliştirme', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'Frontend'),
  ('React', 'Kullanıcı arayüzü geliştirme', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 'Frontend'),
  ('Node.js', 'Sunucu tarafı uygulama geliştirme', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', 'Backend'),
  ('PostgreSQL', 'Veritabanı yönetimi', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', 'Database')
ON CONFLICT DO NOTHING;