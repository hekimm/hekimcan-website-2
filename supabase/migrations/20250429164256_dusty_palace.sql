/*
  # Remove skill levels and update schema

  1. Changes
    - Remove seviye (level) column from yetenekler table
    - Add example skills with CDN icons
  
  2. Data
    - Add sample skills with proper CDN icon URLs
    - Include different categories for organization
*/

-- Remove seviye column from yetenekler table
ALTER TABLE yetenekler DROP COLUMN IF EXISTS seviye;

-- Insert example skills with CDN icons if they don't exist
INSERT INTO yetenekler (isim, aciklama, ikon_url, kategori)
VALUES 
  ('JavaScript', 'Modern web uygulamaları geliştirme', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'Frontend'),
  ('TypeScript', 'Tip güvenli JavaScript geliştirme', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 'Frontend'),
  ('React', 'Modern kullanıcı arayüzü geliştirme', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 'Frontend'),
  ('Next.js', 'React tabanlı full-stack geliştirme', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', 'Frontend'),
  ('Node.js', 'Sunucu tarafı JavaScript geliştirme', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', 'Backend'),
  ('PostgreSQL', 'İlişkisel veritabanı yönetimi', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', 'Database'),
  ('Docker', 'Konteyner tabanlı uygulama dağıtımı', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', 'DevOps'),
  ('Git', 'Versiyon kontrol sistemi', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 'Tools')
ON CONFLICT DO NOTHING;