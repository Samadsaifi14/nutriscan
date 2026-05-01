-- Phase 8: Background Scanning
-- Create table for pending background scans

-- Pending scans table - stores captured images for later processing
CREATE TABLE IF NOT EXISTS public.pending_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  barcode TEXT,
  image_data TEXT NOT NULL, -- Base64 image
  scan_type TEXT NOT NULL CHECK (scan_type IN ('barcode', 'photo')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  product_data JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pending_scans_user ON public.pending_scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pending_scans_status ON public.pending_scans(status) WHERE status = 'pending';

-- Disable RLS (will handle via API)
ALTER TABLE public.pending_scans DISABLE ROW LEVEL SECURITY;

-- Add last_scanned to products if not exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS last_scanned TIMESTAMPTZ;

SELECT 'Background scanning setup complete!' AS status;