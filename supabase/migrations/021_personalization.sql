-- BioYou — Personalization expansion
-- Adds ethnicity, region, additional medical conditions, and food preferences

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS ethnicity TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS has_thyroid BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_kidney_disease BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_pcod BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_pregnant BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_lactating BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS food_preferences JSONB DEFAULT '{}';
