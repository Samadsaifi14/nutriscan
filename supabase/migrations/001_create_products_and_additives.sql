-- NutriScan Phase 5: Database Improvements
-- Run this SQL in Supabase SQL Editor

-- ============================================
-- ADD NEW COLUMNS TO EXISTING PRODUCTS TABLE
-- ============================================

-- Add missing columns to products table (if they don't exist)
ALTER TABLE products ADD COLUMN IF NOT EXISTS health_score DECIMAL(3,1);
ALTER TABLE products ADD COLUMN IF NOT EXISTS health_grade VARCHAR(1);
ALTER TABLE products ADD COLUMN IF NOT EXISTS nutrition_score DECIMAL(3,1);
ALTER TABLE products ADD COLUMN IF NOT EXISTS additive_score DECIMAL(3,1);
ALTER TABLE products ADD COLUMN IF NOT EXISTS nova_group INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS nutrition JSONB DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients_text TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS additives JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS allergens JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_scanned TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- CREATE ADDITIVES TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS additives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  ins_code VARCHAR(20),
  e_code VARCHAR(20),
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('safe', 'low', 'medium', 'high', 'critical')),
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'preservative', 'color', 'sweetener', 'emulsifier', 
    'flavor', 'thickener', 'antioxidant', 'acidity', 'other'
  )),
  description TEXT,
  concern TEXT,
  source_org VARCHAR(50),
  source_url TEXT,
  global_safe_limit VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for additives
CREATE INDEX IF NOT EXISTS idx_additives_name ON additives(name);
CREATE INDEX IF NOT EXISTS idx_additives_risk ON additives(risk_level);
CREATE INDEX IF NOT EXISTS idx_additives_category ON additives(category);
CREATE INDEX IF NOT EXISTS idx_additives_ins_code ON additives(ins_code);

-- ============================================
-- POPULATE ADDITIVES FROM LOCAL DATABASE
-- ============================================

INSERT INTO additives (name, ins_code, e_code, risk_level, category, description, concern) VALUES
-- Preservatives
('Sodium Benzoate', 'INS 211', 'E211', 'high', 'preservative', 'Common preservative in soft drinks', 'Linked to hyperactivity in children'),
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
-- ENABLE RLS ON ADDITIVES
-- ============================================

ALTER TABLE additives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Additives are viewable by everyone" ON additives FOR SELECT USING (true);
CREATE POLICY "Service role can manage additives" ON additives FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- DONE!
-- ============================================

SELECT 'Database update complete!' as status;
SELECT COUNT(*) as additives_count FROM additives;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position;
