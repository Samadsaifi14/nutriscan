-- Phase 7: Performance Optimizations - Add caching columns
-- Run this SQL in Supabase SQL Editor

-- Add caching columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS health_score DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS health_grade VARCHAR(1),
ADD COLUMN IF NOT EXISTS nutrition_score DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS additive_score DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS nova_group INTEGER,
ADD COLUMN IF NOT EXISTS local_analysis_json JSONB,
ADD COLUMN IF NOT EXISTS cached_at TIMESTAMPTZ;

-- Create index for faster cached lookups
CREATE INDEX IF NOT EXISTS idx_products_cached_at ON public.products(cached_at DESC) 
WHERE cached_at IS NOT NULL;

-- Add last_scanned if not exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS last_scanned TIMESTAMPTZ;

-- Enable auto-vacuum for better performance
ALTER TABLE public.products SET (autovacuum_enabled = true);

SELECT 'Phase 7 caching columns added!' AS status;