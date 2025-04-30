/*
  # Add Contact Information to Footer Settings

  1. Changes
    - Add contact fields to footer_settings table
    - Update existing records with default contact info
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add contact information fields
ALTER TABLE footer_settings
ADD COLUMN contact_address TEXT,
ADD COLUMN contact_email TEXT,
ADD COLUMN contact_phone TEXT;

-- Update existing records with default contact info
UPDATE footer_settings
SET 
  contact_address = 'İstanbul, Türkiye',
  contact_email = 'info@example.com',
  contact_phone = '+90 555 123 4567'
WHERE contact_address IS NULL;