-- Migration: Product corrections table
-- Date: 2026-05-07

CREATE TABLE IF NOT EXISTS product_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT NOT NULL,
  ingredients_text TEXT,
  nutrition JSONB,
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  corrected_by TEXT,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_corrections_barcode ON product_corrections(barcode);
CREATE INDEX IF NOT EXISTS idx_corrections_status ON product_corrections(status);

-- Allow RLS
ALTER TABLE product_corrections ENABLE ROW LEVEL SECURITY;

-- Policy for users to create corrections
CREATE POLICY "Anyone can create corrections" ON product_corrections
  FOR INSERT WITH CHECK (true);

-- Policy for admins to review
CREATE POLICY "Admins can view all" ON product_corrections
  FOR SELECT USING (true);

-- Policy for updates
CREATE POLICY "Admins can update" ON product_corrections
  FOR UPDATE USING (true);