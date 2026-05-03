-- NutriScan: Crowdsourcing for Indian Food Database
-- Run this in Supabase SQL Editor

-- Community products submitted by users
CREATE TABLE IF NOT EXISTS community_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barcode TEXT,
  name TEXT NOT NULL,
  brand TEXT,
  
  -- Photo URLs (stored in Supabase storage)
  front_label_url TEXT,
  nutrition_label_url TEXT,
  
  -- Extracted data
  ingredients_text TEXT,
  nutrition JSONB DEFAULT '{}'::jsonb,
  
  -- Source
  submitted_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Validation status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  validation_count INTEGER DEFAULT 0,
  approval_count INTEGER DEFAULT 0,
  rejection_count INTEGER DEFAULT 0,
  
  -- For approved products
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  
  -- Meta
  source TEXT DEFAULT 'community'
);

-- Product validations (community voting)
CREATE TABLE IF NOT EXISTS product_validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES community_products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject', 'flag')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(product_id, user_id)
);

-- Update user profiles with contribution tracking
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS contributions_count INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS validated_count INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_impact INTEGER DEFAULT 0;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_community_status ON community_products(status);
CREATE INDEX IF NOT EXISTS idx_community_barcode ON community_products(barcode);
CREATE INDEX IF NOT EXISTS idx_validations_product ON product_validations(product_id);

-- RLS
ALTER TABLE community_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_validations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view approved products" ON community_products 
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can submit" ON community_products 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view validations" ON product_validations 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can validate" ON product_validations 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

SELECT 'Crowdsourcing tables ready!' as status;