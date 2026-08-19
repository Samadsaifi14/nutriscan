-- Unify submissions under product_corrections, fix reviewed_by UUID crash
-- reviewed_by was UUID with FK to users — ANONYMOUS_USER_ID ('anonymous') always
-- threw a Postgres type error, silently breaking every approve/reject.

ALTER TABLE product_corrections
  ALTER COLUMN reviewed_by TYPE TEXT USING reviewed_by::text,
  DROP CONSTRAINT IF EXISTS product_corrections_reviewed_by_fkey;

ALTER TABLE product_corrections
  ADD COLUMN IF NOT EXISTS correction_type TEXT NOT NULL DEFAULT 'correction'
    CHECK (correction_type IN ('correction', 'new_product')),
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS serving_size_g NUMERIC,
  ADD COLUMN IF NOT EXISTS additives JSONB,
  ADD COLUMN IF NOT EXISTS allergens JSONB,
  ADD COLUMN IF NOT EXISTS source TEXT;
