/*
  # Add certifications table

  1. New Tables
    - `certifications`
      - `id` (integer, primary key)
      - `title` (text, not null) - Name/title of the certification
      - `issuer` (text, not null) - Organization that issued the certification
      - `issue_date` (date, not null) - When the certification was issued
      - `expiry_date` (date) - When the certification expires (if applicable)
      - `credential_id` (text) - Unique identifier for the certification
      - `credential_url` (text) - URL to verify the certification
      - `description` (text) - Additional details about the certification
      - `active` (boolean) - Whether the certification is currently active
      - `created_at` (timestamptz) - When the record was created

  2. Security
    - Enable RLS on `certifications` table
    - Add policies for:
      - Public read access
      - Authenticated users can create/update/delete certifications
*/

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_id text,
  credential_url text,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access"
  ON certifications
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create certifications"
  ON certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update certifications"
  ON certifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete certifications"
  ON certifications
  FOR DELETE
  TO authenticated
  USING (true);