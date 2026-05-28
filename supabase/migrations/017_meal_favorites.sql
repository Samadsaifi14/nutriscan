CREATE TABLE IF NOT EXISTS meal_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  barcode TEXT,
  calories_per_100g NUMERIC,
  protein_per_100g NUMERIC,
  carbs_per_100g NUMERIC,
  fat_per_100g NUMERIC,
  sodium_per_100g NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_name, barcode)
);

CREATE INDEX IF NOT EXISTS idx_meal_favorites_user ON meal_favorites (user_id);

ALTER TABLE meal_favorites ENABLE ROW LEVEL SECURITY;
