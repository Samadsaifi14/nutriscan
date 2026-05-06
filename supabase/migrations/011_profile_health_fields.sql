-- Migration: Add health conditions and allergies to user_profiles
-- Date: 2026-05-07

-- Add new columns for health conditions
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS has_heart_disease BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_cholesterol BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_jain BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS allergies TEXT[] DEFAULT '{}';

-- Update policy to allow updating these fields
-- (Existing policies should already allow updates, but let's ensure)