# Supabase migrations

Apply every SQL migration in the explicit order below. Do not infer ordering from the numeric prefixes alone: this repository contains two `001_` files and two `016_` files.

1. `001_create_products_and_additives.sql`
2. `001_create_additives_policies_v2.sql`
3. `002_create_additives_table.sql`
4. `003_add_caching_columns.sql`
5. `004_background_scanning.sql`
6. `005_fix_food_logs.sql`
7. `006_fix_user_profiles.sql`
8. `007_expand_indian_additives.sql`
9. `008_products_table_india.sql`
10. `009_crowdsourcing.sql`
11. `010_crowdsourcing_functions.sql`
12. `011_profile_health_fields.sql`
13. `012_product_corrections.sql`
14. `013_parental_consent_and_deletion.sql`
15. `015_rate_limits.sql`
16. `016_atomic_rate_limits.sql`
17. `016_product_corrections_rls.sql`
18. `017_meal_favorites.sql`
19. `019_ai_analysis_cache.sql`
20. `020_get_user_daily_stats.sql`
21. `021_personalization.sql`
22. `022_fix_leaderboard.sql`
23. `023_unify_submissions_and_fix_reviewed_by.sql`

The gaps at 014 and 018 are intentional in the current repository; do not create placeholder migrations to fill them.

## Applying migrations

Use the Supabase CLI or SQL editor. Review the target project and migration history before applying changes to a live database. For CLI-managed projects, use `supabase db push` only after confirming the local migration history matches the remote database.

## Deployment prerequisites for the mobile/security update

- Apply `016_atomic_rate_limits.sql` after `015_rate_limits.sql`; the application rate limiter calls its `consume_rate_limit` RPC.
- Configure `ADMIN_API_SECRET` in Vercel for the admin pending-corrections endpoint.
- Configure `CRON_SECRET` for the weekly report cron endpoint.
- General user authentication is not complete in this codebase yet. The NextAuth route and shared session helper are placeholders; do not treat the current anonymous-user behavior as authenticated or deploy user-private features as secure until that work is completed.
