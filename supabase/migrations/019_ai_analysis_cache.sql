-- NutriScan: Add AI analysis cache columns to products table
-- Run this in Supabase SQL Editor

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS ai_analysis_json JSONB,
ADD COLUMN IF NOT EXISTS ai_health_rating TEXT,
ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMPTZ;

-- Index for fast cache lookups on AI-analyzed products
CREATE INDEX IF NOT EXISTS idx_products_ai_analyzed_at
  ON public.products(ai_analyzed_at DESC)
  WHERE ai_analyzed_at IS NOT NULL;

SELECT 'AI analysis cache columns added!' AS status;
