/*
  # Initial Schema Setup for Portfolio Website

  1. New Tables
    - profil (Profile information)
    - projeler (Projects)
    - yetenekler (Skills)
    - deneyimler (Experiences)
    - iletisim (Contact messages)
  
  2. Security
    - Enable RLS on all tables
    - Public read access for most tables
    - Authenticated user access for admin operations
*/

-- Profil Tablosu
CREATE TABLE IF NOT EXISTS profil (
  id SERIAL PRIMARY KEY,
  isim TEXT NOT NULL,
  unvan TEXT NOT NULL,
  slogan TEXT NOT NULL,
  hakkimda TEXT NOT NULL,
  resim_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projeler Tablosu
CREATE TABLE IF NOT EXISTS projeler (
  id SERIAL PRIMARY KEY,
  baslik TEXT NOT NULL,
  aciklama TEXT NOT NULL,
  gorsel_url TEXT NOT NULL,
  canli_demo_url TEXT,
  github_url TEXT,
  teknolojiler TEXT[] NOT NULL DEFAULT '{}',
  one_cikan BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Yetenekler Tablosu
CREATE TABLE IF NOT EXISTS yetenekler (
  id SERIAL PRIMARY KEY,
  isim TEXT NOT NULL,
  seviye INTEGER NOT NULL CHECK (seviye >= 1 AND seviye <= 10),
  aciklama TEXT NOT NULL,
  ikon_url TEXT NOT NULL,
  kategori TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deneyimler Tablosu
CREATE TABLE IF NOT EXISTS deneyimler (
  id SERIAL PRIMARY KEY,
  sirket_adi TEXT NOT NULL,
  pozisyon TEXT NOT NULL,
  baslangic_tarihi DATE NOT NULL,
  bitis_tarihi DATE,
  devam_ediyor BOOLEAN DEFAULT FALSE,
  sorumluluklar TEXT NOT NULL,
  teknolojiler TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İletişim Tablosu
CREATE TABLE IF NOT EXISTS iletisim (
  id SERIAL PRIMARY KEY,
  isim TEXT NOT NULL,
  email TEXT NOT NULL,
  mesaj TEXT NOT NULL,
  okundu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profil ENABLE ROW LEVEL SECURITY;
ALTER TABLE projeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE yetenekler ENABLE ROW LEVEL SECURITY;
ALTER TABLE deneyimler ENABLE ROW LEVEL SECURITY;
ALTER TABLE iletisim ENABLE ROW LEVEL SECURITY;

-- Profil table policies
CREATE POLICY "profil_select_policy" ON profil
  FOR SELECT USING (true);

CREATE POLICY "profil_insert_policy" ON profil
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "profil_update_policy" ON profil
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "profil_delete_policy" ON profil
  FOR DELETE USING (auth.role() = 'authenticated');

-- Projeler table policies
CREATE POLICY "projeler_select_policy" ON projeler
  FOR SELECT USING (true);

CREATE POLICY "projeler_insert_policy" ON projeler
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "projeler_update_policy" ON projeler
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "projeler_delete_policy" ON projeler
  FOR DELETE USING (auth.role() = 'authenticated');

-- Yetenekler table policies
CREATE POLICY "yetenekler_select_policy" ON yetenekler
  FOR SELECT USING (true);

CREATE POLICY "yetenekler_insert_policy" ON yetenekler
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "yetenekler_update_policy" ON yetenekler
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "yetenekler_delete_policy" ON yetenekler
  FOR DELETE USING (auth.role() = 'authenticated');

-- Deneyimler table policies
CREATE POLICY "deneyimler_select_policy" ON deneyimler
  FOR SELECT USING (true);

CREATE POLICY "deneyimler_insert_policy" ON deneyimler
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "deneyimler_update_policy" ON deneyimler
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "deneyimler_delete_policy" ON deneyimler
  FOR DELETE USING (auth.role() = 'authenticated');

-- İletisim table policies
CREATE POLICY "iletisim_select_policy" ON iletisim
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "iletisim_insert_policy" ON iletisim
  FOR INSERT WITH CHECK (true);

CREATE POLICY "iletisim_update_policy" ON iletisim
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "iletisim_delete_policy" ON iletisim
  FOR DELETE USING (auth.role() = 'authenticated');