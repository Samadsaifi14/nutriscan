-- NutriScan: Fix user_profiles table and ensure all columns exist
-- Run this SQL in Supabase SQL Editor

-- Ensure user_profiles table exists with all required columns
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  age INTEGER,
  gender TEXT,
  weight_kg DECIMAL(5,1),
  height_cm INTEGER,
  activity_level TEXT,
  weight_goal TEXT,
  daily_calorie_goal INTEGER DEFAULT 2000,
  target_calories INTEGER DEFAULT 2000,
  bmi DECIMAL(4,1),
  is_diabetic BOOLEAN DEFAULT false,
  has_bp BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  profile_completed BOOLEAN DEFAULT false,
  welcome_email_sent BOOLEAN DEFAULT false,
  email_unsubscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Upsert function to easily update profile
CREATE OR REPLACE FUNCTION update_user_profile(
  p_user_id TEXT,
  p_email TEXT,
  p_name TEXT,
  p_avatar_url TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, name, avatar_url, created_at, updated_at)
  VALUES (p_user_id, p_email, p_name, p_avatar_url, NOW(), NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    email = COALESCE(p_email, user_profiles.email),
    name = COALESCE(p_name, user_profiles.name),
    avatar_url = COALESCE(p_avatar_url, user_profiles.avatar_url),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

SELECT 'user_profiles table ready!' AS status;