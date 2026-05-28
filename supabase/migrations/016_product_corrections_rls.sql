-- Tighten product_corrections RLS: API-only via service role

DROP POLICY IF EXISTS "Anyone can create corrections" ON product_corrections;
DROP POLICY IF EXISTS "Admins can view all" ON product_corrections;
DROP POLICY IF EXISTS "Admins can update" ON product_corrections;

-- No permissive policies: authenticated/anon clients cannot access directly.
-- All reads/writes go through Next.js API routes using supabaseAdmin.
