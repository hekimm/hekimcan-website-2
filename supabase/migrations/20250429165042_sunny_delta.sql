/*
  # Add Social Media Links to Profile Table

  1. Changes
    - Add social media fields to profil table
    - Add email and location fields
  
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE profil
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS konum TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT;