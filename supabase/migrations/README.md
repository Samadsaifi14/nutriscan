# Supabase migrations

Apply migrations in filename order (lexicographic).

**Note:** Two files share prefix `001_`. On a fresh database, run in this order:

1. `001_create_products_and_additives.sql`
2. `001_create_additives_policies_v2.sql`
3. `002` through `014` (numeric order)
4. `015_rate_limits.sql`
5. `016_product_corrections_rls.sql`
6. `017_meal_favorites.sql`

Use the Supabase CLI or SQL editor: `supabase db push` or run each file manually.
