-- NutriScan: Fix food_logs table and RLS policies
-- Run this SQL in Supabase SQL Editor

-- Create food_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  barcode TEXT,
  quantity_g INTEGER NOT NULL,
  calories DECIMAL(10,1) NOT NULL,
  protein_g DECIMAL(10,1),
  carbs_g DECIMAL(10,1),
  fat_g DECIMAL(10,1),
  sodium_mg DECIMAL(10,1),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_logged_at ON food_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_food_logs_meal_type ON food_logs(meal_type);

-- Disable RLS for now (the API uses admin client)
ALTER TABLE food_logs DISABLE ROW LEVEL SECURITY;

-- Add a debug view to check recent logs
CREATE OR REPLACE VIEW recent_food_logs AS
SELECT 
  user_id,
  product_name,
  quantity_g,
  calories,
  meal_type,
  logged_at
FROM food_logs
ORDER BY logged_at DESC
LIMIT 100;

SELECT 'food_logs table ready!' AS status;