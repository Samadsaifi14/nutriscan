-- NutriScan Phase 5: Database Improvements
-- Run this SQL in Supabase SQL Editor

-- ============================================
-- PRODUCTS TABLE - Store scanned products
-- ============================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(100),
  country_of_origin VARCHAR(100),
  image_url TEXT,
  
  -- Nutrition per 100g
  nutrition JSONB DEFAULT '{}'::jsonb,
  /* Contains:
    {
      calories: number,
      protein: number,
      carbs: number,
      fat: number,
      sugar: number,
      sodium: number,
      fiber: number,
      saturated_fat: number
    }
  */
  
  ingredients_text TEXT,
  additives JSONB DEFAULT '[]'::jsonb, -- Array of additive names
  allergens JSONB DEFAULT '[]'::jsonb, -- Array of allergens
  
  -- Health Score (calculated locally)
  health_score DECIMAL(3,1),
  health_grade VARCHAR(1),
  nutrition_score DECIMAL(3,1),
  additive_score DECIMAL(3,1),
  nova_group INTEGER,
  
  -- Metadata
  scan_count INTEGER DEFAULT 1,
  last_scanned TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Index for faster lookups
  CONSTRAINT unique_barcode UNIQUE (barcode)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_health_score ON products(health_score DESC);
CREATE INDEX IF NOT EXISTS idx_products_last_scanned ON products(last_scanned DESC);

-- ============================================
-- ADDITIVES TABLE - Store harmful additives
-- ============================================

CREATE TABLE IF NOT EXISTS additives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  ins_code VARCHAR(20),
  e_code VARCHAR(20),
  
  -- Risk classification
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('safe', 'low', 'medium', 'high', 'critical')),
  
  -- Category
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'preservative', 'color', 'sweetener', 'emulsifier', 
    'flavor', 'thickener', 'antioxidant', 'acidity', 'other'
  )),
  
  description TEXT,
  concern TEXT,
  
  -- Scientific sources
  source_org VARCHAR(50), -- WHO, FSSAI, EFSA, IARC
  source_url TEXT,
  global_safe_limit VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_additives_name ON additives(name);
CREATE INDEX IF NOT EXISTS idx_additives_risk ON additives(risk_level);
CREATE INDEX IF NOT EXISTS idx_additives_category ON additives(category);
CREATE INDEX IF NOT EXISTS idx_additives_ins_code ON additives(ins_code);

-- ============================================
-- POPULATE ADDITIVES FROM LOCAL DATABASE
-- ============================================

INSERT INTO additives (name, ins_code, e_code, risk_level, category, description, concern) VALUES
-- Preservatives
('Sodium Benzoate', 'INS 211', 'E211', 'high', 'preservative', 'Common preservative in soft drinks', 'Linked to hyperactivity in children; forms benzene with Vitamin C'),
('Potassium Sorbate', 'INS 202', 'E202', 'low', 'preservative', 'Widely used mold inhibitor', 'Generally recognized as safe'),
('Sodium Nitrite', 'INS 250', 'E250', 'critical', 'preservative', 'Used in cured meats', 'Forms nitrosamines - probable carcinogen'),
('BHA', 'INS 320', 'E320', 'high', 'antioxidant', 'Antioxidant preservative in fats', 'Possible carcinogen'),
('BHT', 'INS 321', 'E321', 'medium', 'antioxidant', 'Synthetic antioxidant', 'Potential endocrine disruptor'),
('TBHQ', 'INS 319', 'E319', 'medium', 'antioxidant', 'Preservative in fast food oils', 'High doses linked to vision disturbances'),
('Sodium Metabisulfite', 'INS 223', 'E223', 'medium', 'preservative', 'Sulfite in dried fruits', 'Can trigger allergic reactions'),

-- Artificial Colors
('Tartrazine', 'INS 102', 'E102', 'high', 'color', 'Bright yellow synthetic dye', 'Linked to hyperactivity, banned in several countries'),
('Sunset Yellow', 'INS 110', 'E110', 'high', 'color', 'Orange-yellow azo dye', 'Requires warning labels in EU'),
('Allura Red', 'INS 129', 'E129', 'high', 'color', 'Most widely used red dye', 'Linked to hyperactivity in children'),
('Erythrosine', 'INS 127', 'E127', 'critical', 'color', 'Pink/red dye in cherries', 'Thyroid tumor risk in animals'),

-- Artificial Sweeteners
('Aspartame', 'INS 951', 'E951', 'medium', 'sweetener', 'Low-calorie sweetener', 'Classified as possibly carcinogenic'),
('Acesulfame K', 'INS 950', 'E950', 'low', 'sweetener', 'Heat-stable artificial sweetener', 'Some animal studies suggest metabolic effects'),
('Sucralose', 'INS 955', 'E955', 'low', 'sweetener', 'Chlorinated sucrose derivative', 'May alter gut microbiome'),

-- Emulsifiers
('Carrageenan', 'INS 407', 'E407', 'medium', 'emulsifier', 'Seaweed-derived thickener', 'Degraded form is inflammatory'),
('Polysorbate 80', 'INS 433', 'E433', 'medium', 'emulsifier', 'Emulsifier in ice cream', 'May disrupt gut microbiota'),
('Xanthan Gum', 'INS 415', 'E415', 'safe', 'thickener', 'Fermentation-derived thickener', 'Generally safe'),

-- Flavor Enhancers
('Monosodium Glutamate', 'INS 621', 'E621', 'low', 'flavor', 'Umami flavor enhancer', 'FDA considers GRAS'),

-- Other High-Risk
('High Fructose Corn Syrup', NULL, NULL, 'high', 'other', 'Highly refined sweetener', 'Linked to obesity and fatty liver'),
('Trans Fat', NULL, NULL, 'critical', 'other', 'Artificially hardened fats', 'Strongly linked to cardiovascular disease'),
('Refined Flour', NULL, NULL, 'medium', 'other', 'Highly processed white flour', 'High glycemic, low fiber')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- ENABLE RLS (Row Level Security)
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE additives ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read, only service role can write
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Service role can manage products" ON products FOR ALL USING (auth.role() = 'service_role');

-- Additives: Anyone can read, only service role can write
CREATE POLICY "Additives are viewable by everyone" ON additives FOR SELECT USING (true);
CREATE POLICY "Service role can manage additives" ON additives FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- DONE!
-- ============================================

SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as products_count FROM products;
SELECT COUNT(*) as additives_count FROM additives;