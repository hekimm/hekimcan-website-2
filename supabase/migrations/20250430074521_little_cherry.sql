/*
  # Add Education and Certifications Tables

  1. New Tables
    - education (Academic education history)
    - certifications (Professional certifications and courses)
  
  2. Security
    - Enable RLS
    - Public read access
    - Authenticated user management access
*/

-- Education Table
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

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  credential_url TEXT,
  credential_id TEXT,
  description TEXT,
  logo_url TEXT,
  order_number INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Policies for education
CREATE POLICY "Enable read access for all users" ON education
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON education
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON education
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON education
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for certifications
CREATE POLICY "Enable read access for all users" ON certifications
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON certifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON certifications
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON certifications
  FOR DELETE USING (auth.role() = 'authenticated');