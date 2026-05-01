-- NutriScan Phase 5: Create Additives Table
-- Run this SQL in Supabase SQL Editor

-- Create additives table
CREATE TABLE IF NOT EXISTS public.additives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  ins_code VARCHAR(20),
  e_code VARCHAR(20),
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('safe', 'low', 'medium', 'high', 'critical')),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  concern TEXT,
  source VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_additives_name ON public.additives(name);
CREATE INDEX IF NOT EXISTS idx_additives_risk ON public.additives(risk_level);
CREATE INDEX IF NOT EXISTS idx_additives_category ON public.additives(category);

-- Disable RLS (your existing tables have it disabled)
ALTER TABLE public.additives DISABLE ROW LEVEL SECURITY;

-- Seed initial harmful additives data
INSERT INTO public.additives (name, ins_code, e_code, risk_level, category, description, concern, source) VALUES
-- Preservatives
('Sodium Benzoate', 'INS 211', 'E211', 'high', 'preservative', 'Common preservative in soft drinks', 'Linked to hyperactivity in children', 'WHO'),
('Potassium Sorbate', 'INS 202', 'E202', 'low', 'preservative', 'Widely used mold inhibitor', 'Generally recognized as safe', 'FDA'),
('Sodium Nitrite', 'INS 250', 'E250', 'critical', 'preservative', 'Used in cured meats', 'Forms nitrosamines - probable carcinogen', 'IARC'),
('BHA', 'INS 320', 'E320', 'high', 'antioxidant', 'Antioxidant preservative in fats', 'Possible carcinogen', 'NTP'),
('BHT', 'INS 321', 'E321', 'medium', 'antioxidant', 'Synthetic antioxidant', 'Potential endocrine disruptor', 'EFSA'),
('TBHQ', 'INS 319', 'E319', 'medium', 'antioxidant', 'Preservative in fast food oils', 'High doses linked to vision disturbances', 'FDA'),
('Sodium Metabisulfite', 'INS 223', 'E223', 'medium', 'preservative', 'Sulfite in dried fruits', 'Can trigger allergic reactions', 'WHO'),

-- Artificial Colors
('Tartrazine', 'INS 102', 'E102', 'high', 'color', 'Bright yellow synthetic dye', 'Linked to hyperactivity, banned in several countries', 'EU'),
('Sunset Yellow', 'INS 110', 'E110', 'high', 'color', 'Orange-yellow azo dye', 'Requires warning labels in EU', 'EU'),
('Allura Red', 'INS 129', 'E129', 'high', 'color', 'Most widely used red dye', 'Linked to hyperactivity in children', 'UK'),
('Erythrosine', 'INS 127', 'E127', 'critical', 'color', 'Pink/red dye in cherries', 'Thyroid tumor risk in animals', 'FDA'),

-- Artificial Sweeteners
('Aspartame', 'INS 951', 'E951', 'medium', 'sweetener', 'Low-calorie sweetener', 'Classified as possibly carcinogenic', 'IARC'),
('Acesulfame K', 'INS 950', 'E950', 'low', 'sweetener', 'Heat-stable artificial sweetener', 'Some animal studies suggest metabolic effects', 'FDA'),
('Sucralose', 'INS 955', 'E955', 'low', 'sweetener', 'Chlorinated sucrose derivative', 'May alter gut microbiome', 'EFSA'),

-- Emulsifiers
('Carrageenan', 'INS 407', 'E407', 'medium', 'emulsifier', 'Seaweed-derived thickener', 'Degraded form is inflammatory', 'FDA'),
('Polysorbate 80', 'INS 433', 'E433', 'medium', 'emulsifier', 'Emulsifier in ice cream', 'May disrupt gut microbiota', 'EFSA'),

-- Flavor Enhancers
('Monosodium Glutamate', 'INS 621', 'E621', 'low', 'flavor', 'Umami flavor enhancer', 'FDA considers GRAS', 'FDA'),

-- Other High-Risk
('High Fructose Corn Syrup', NULL, NULL, 'high', 'other', 'Highly refined sweetener', 'Linked to obesity and fatty liver', 'WHO'),
('Trans Fat', NULL, NULL, 'critical', 'other', 'Artificially hardened fats', 'Strongly linked to cardiovascular disease', 'WHO')
ON CONFLICT (name) DO NOTHING;

-- Verify
SELECT 'Additives table created with ' || COUNT(*) || ' initial records' FROM public.additives;