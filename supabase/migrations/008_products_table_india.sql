-- NutriScan: Products table optimized for India-first lookup
-- Run this in Supabase SQL Editor

-- Drop old products table if exists (backup first)
-- ALTER TABLE IF EXISTS products RENAME TO products_old;

-- Create new products table with all needed fields
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barcode TEXT UNIQUE NOT NULL,
  name TEXT,
  brand TEXT,
  category TEXT,
  
  -- Nutrition per 100g
  calories DECIMAL,
  protein DECIMAL,
  fat DECIMAL,
  saturated_fat DECIMAL,
  carbohydrates DECIMAL,
  sugar DECIMAL,
  fiber DECIMAL,
  sodium DECIMAL,
  
  -- Raw text
  ingredients_text TEXT,
  
  -- Computed by health engine (pre-scored)
  health_score INTEGER,
  health_grade TEXT,
  nova_group INTEGER,
  detected_additives JSONB DEFAULT '[]'::jsonb,
  detected_allergens JSONB DEFAULT '[]'::jsonb,
  
  -- Meta
  source TEXT DEFAULT 'open_food_facts',
  image_url TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  scan_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  
  -- India specific
  fssai_license TEXT,
  mrp DECIMAL,
  country TEXT DEFAULT 'India',
  
  -- For tracking
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_health_score ON products(health_score);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read products
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- Policy: Service role can insert/update
CREATE POLICY "Service role can manage products" ON products FOR ALL USING (auth.role() = 'service_role');

-- Add columns to existing products table if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS health_grade TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS detected_additives JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS detected_allergens JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'open_food_facts';
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS scan_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

SELECT 'Products table ready!' as status;