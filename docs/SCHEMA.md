# SCHEMA — HealthOX Database
_Supabase PostgreSQL · 12 tables · 19 migrations_

---

## Design Principles

1. **UUID everywhere** — all primary keys are UUIDs, never sequential integers exposed to clients
2. **JSONB for flexible nutrition** — nutrition data varies by product; JSONB avoids nullable column explosion
3. **Row-level security on all user tables** — Supabase RLS, not application-layer filtering
4. **Soft deletes not used** — hard deletes with audit via scan_sessions/food_logs history
5. **Timestamps always UTC** — TIMESTAMPTZ on every created_at/updated_at

---

## Tables

### `products`
Canonical product catalog. Populated from all 5 lookup chain sources.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| barcode | TEXT | UNIQUE, NOT NULL | |
| name | TEXT | NOT NULL | |
| brand | TEXT | | |
| category | TEXT | | Maps to curated-alternatives categories |
| nutrition | JSONB | | `{calories, protein, carbs, fat, sugar, sodium, fiber, saturated_fat}` all in g/kcal per 100g |
| serving_size_g | NUMERIC | | |
| ingredients_text | TEXT | | Raw string from label / OCR |
| ingredients_tags | TEXT[] | | Normalised lowercase tags |
| allergens | TEXT[] | | |
| additives | TEXT[] | | INS codes e.g. `['INS 211', 'INS 330']` |
| health_score | NUMERIC | CHECK (0 <= health_score <= 10) | Deterministic engine output |
| health_rating | TEXT | CHECK IN ('A','B','C','D','E','F') | |
| nutriscore | TEXT | | European Nutri-Score if available |
| nova_group | INTEGER | CHECK IN (1,2,3,4) | |
| nova_label | TEXT | | Human-readable NOVA description |
| image_url | TEXT | | |
| source | TEXT | DEFAULT 'supabase' | `supabase`, `off`, `upc`, `tavily`, `ai`, `default` |
| country | TEXT | DEFAULT 'IN' | |
| fssai_license | TEXT | | 14-digit, validated format |
| mrp | NUMERIC | | INR |
| labels_tags | TEXT[] | | e.g. `['vegetarian', 'gluten-free']` |
| traces_tags | TEXT[] | | Allergen traces |
| popularity | INTEGER | DEFAULT 1 | Incremented on each scan |
| scan_count | INTEGER | DEFAULT 1 | |
| ai_summary | TEXT | | Groq-generated 2–3 sentence summary |
| ai_insights | JSONB | | `{warnings[], positives[], childSafety, personalized}` |
| ai_ingredients | JSONB | | `[{name, risk, explanation}]` |
| ai_analyzed_at | TIMESTAMPTZ | | |
| last_scanned_at | TIMESTAMPTZ | DEFAULT now() | |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |
| last_enriched_at | TIMESTAMPTZ | | |
| enrich_job_status | TEXT | DEFAULT 'idle' | `idle`, `pending`, `processing`, `done`, `failed` |

**Indexes:**
```sql
CREATE UNIQUE INDEX products_barcode_idx ON products(barcode);
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_health_score_idx ON products(health_score);
CREATE INDEX products_last_scanned_idx ON products(last_scanned_at DESC);
CREATE INDEX products_source_idx ON products(source);
```

---

### `additives`
Reference table. Populated once from `fssai-rules.json` + manual curation.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT NOT NULL | e.g. "Sodium Benzoate" |
| ins_code | TEXT UNIQUE | e.g. "INS 211" |
| risk | TEXT | `low`, `medium`, `high`, `banned` |
| category | TEXT | `preservative`, `colour`, `sweetener`, `emulsifier`, etc. |
| description | TEXT | Plain-language explanation for consumers |
| fssai_status | TEXT | `permitted`, `restricted`, `banned` |
| created_at | TIMESTAMPTZ | |

---

### `user_profiles`
One row per authenticated user. Created on first sign-in via trigger.

| Column | Type | Notes |
|---|---|---|
| user_id | UUID PK | refs `auth.users(id)` ON DELETE CASCADE |
| name | TEXT | |
| email | TEXT | |
| age | INTEGER | CHECK (age > 0 AND age < 120) |
| gender | TEXT | CHECK IN ('male','female','other','prefer_not_to_say') |
| height | NUMERIC | cm |
| weight | NUMERIC | kg |
| activity_level | TEXT | `sedentary`, `lightly_active`, `moderately_active`, `very_active`, `extra_active` |
| dietary_preference | TEXT | `none`, `vegetarian`, `vegan`, `jain`, `halal`, `keto`, `diabetic` |
| weight_goal | TEXT | `lose`, `maintain`, `gain` |
| health_conditions | TEXT[] | `['diabetes', 'hypertension', 'high_cholesterol', 'celiac', 'lactose_intolerant']` |
| allergies | TEXT[] | |
| daily_calorie_goal | INTEGER | DEFAULT 2000 |
| daily_protein_goal | NUMERIC | g |
| daily_carbs_goal | NUMERIC | g |
| daily_fat_goal | NUMERIC | g |
| profile_completed | BOOLEAN | DEFAULT false |
| contributions_count | INTEGER | DEFAULT 0 |
| validated_count | INTEGER | DEFAULT 0 |
| badges | TEXT[] | DEFAULT '{}' |
| avatar_url | TEXT | |
| onboarding_step | INTEGER | DEFAULT 0 |
| onboarding_data | JSONB | Stores partial onboarding progress |
| unsubscribed | BOOLEAN | DEFAULT false |
| unsubscribe_token | TEXT | UNIQUE, HMAC-signed |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

---

### `community_products`
User-submitted products awaiting promotion to `products`.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT NOT NULL | |
| brand | TEXT | |
| barcode | TEXT | |
| nutrition | JSONB | Same shape as products.nutrition |
| ingredients_text | TEXT | |
| image_url | TEXT | Supabase Storage URL |
| front_label_url | TEXT | |
| nutrition_label_url | TEXT | |
| submitted_by | UUID | refs `auth.users` ON DELETE SET NULL |
| status | TEXT | DEFAULT 'pending' · `pending`, `approved`, `rejected` |
| validation_count | INTEGER | DEFAULT 0 |
| rejection_count | INTEGER | DEFAULT 0 |
| validated_by | TEXT[] | user_ids who approved |
| rejected_by | TEXT[] | user_ids who rejected |
| created_at | TIMESTAMPTZ | DEFAULT now() |

**Promotion threshold:** 3 approvals, 0 rejections → eligible for `/api/community/promote`.

---

### `product_validations`
One vote per user per product. Prevents duplicate voting.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| product_id | UUID | refs `community_products` ON DELETE CASCADE |
| user_id | UUID | refs `auth.users` ON DELETE CASCADE |
| vote | TEXT | CHECK IN ('approve', 'reject') |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| | | UNIQUE(product_id, user_id) |

---

### `scan_sessions`
Immutable log of every scan event.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID | refs `auth.users` ON DELETE CASCADE |
| barcode | TEXT NOT NULL | |
| product_name | TEXT | |
| scan_type | TEXT | `barcode`, `vision`, `manual`, `community` |
| image_url | TEXT | For vision scans |
| health_score | NUMERIC | Score at time of scan (products table may update) |
| health_rating | TEXT | |
| confidence | TEXT | DEFAULT 'high' · `high`, `medium`, `low`, `estimated` |
| source | TEXT | Which lookup chain step resolved the product |
| status | TEXT | DEFAULT 'completed' · `completed`, `failed`, `pending` |
| scanned_at | TIMESTAMPTZ | DEFAULT now() |

**Note:** `health_score` is denormalised here intentionally — products can be re-scored
after enrichment, but this preserves what the user actually saw.

---

### `food_logs`
Meal tracking entries. Each row = one product logged once.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID | refs `auth.users` ON DELETE CASCADE |
| product_id | UUID | refs `products` ON DELETE SET NULL (log survives product deletion) |
| product_name | TEXT | Denormalised — survives product deletion |
| meal_type | TEXT | CHECK IN ('breakfast','lunch','dinner','snack') |
| servings | NUMERIC | DEFAULT 1 · CHECK > 0 |
| calories | NUMERIC | Computed: nutrition.calories * (serving_size_g * servings / 100) |
| protein | NUMERIC | |
| carbs | NUMERIC | |
| fat | NUMERIC | |
| logged_at | TIMESTAMPTZ | DEFAULT now() |

**Indexes:**
```sql
CREATE INDEX food_logs_user_date_idx ON food_logs(user_id, logged_at DESC);
CREATE INDEX food_logs_user_meal_idx ON food_logs(user_id, meal_type, logged_at DESC);
```

---

### `pending_scans`
Queue for background processing. Worker polls this table.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID | refs `auth.users` |
| barcode | TEXT NOT NULL | |
| status | TEXT | DEFAULT 'pending' · `pending`, `processing`, `completed`, `failed` |
| attempts | INTEGER | DEFAULT 0 · max 3 before status → failed |
| result | JSONB | Populated on completion |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

---

### `product_corrections`
Field-level crowdsourced corrections.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| product_id | UUID | refs `products` ON DELETE CASCADE |
| user_id | UUID | refs `auth.users` ON DELETE SET NULL |
| field_name | TEXT | e.g. `'nutrition.protein'`, `'name'`, `'ingredients_text'` |
| old_value | TEXT | |
| new_value | TEXT | |
| status | TEXT | DEFAULT 'pending' · `pending`, `approved`, `rejected` |
| reviewed_by | UUID | Admin user_id |
| created_at | TIMESTAMPTZ | DEFAULT now() |

---

### `rate_limits`
Sliding-window rate limiting store.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| key | TEXT | `{user_id}:{action}` |
| action | TEXT | |
| window_start | TIMESTAMPTZ | |
| count | INTEGER | DEFAULT 1 |
| | | UNIQUE(key, window_start) |

**Cleanup:** Rows older than 24h should be purged. Add to weekly cron or pg_cron.

---

### `meal_favorites`
Saved meals for one-tap re-logging.

| Column | Type |
|---|---|
| id | UUID PK |
| user_id | UUID refs `auth.users` ON DELETE CASCADE |
| product_id | UUID refs `products` ON DELETE SET NULL |
| product_name | TEXT (denormalised) |
| barcode | TEXT |
| calories_per_100g | NUMERIC |
| protein_per_100g | NUMERIC |
| carbs_per_100g | NUMERIC |
| fat_per_100g | NUMERIC |
| created_at | TIMESTAMPTZ DEFAULT now() |

---

## Database Functions

```sql
-- Aggregate food_logs for a user over a date range
-- Returns: {total_calories, total_protein, total_carbs, total_fat,
--           avg_health_score, meal_count, top_categories[]}
CREATE FUNCTION get_nutrition_summary(
  p_user_id UUID,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
) RETURNS JSONB

-- Sliding window rate check. Returns TRUE if under limit.
CREATE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_action TEXT,
  p_max_count INTEGER,
  p_window_minutes INTEGER
) RETURNS BOOLEAN
```

---

## Row-Level Security Summary

| Table | Read Policy | Write Policy |
|---|---|---|
| `products` | Public | Service role only |
| `additives` | Public | Service role only |
| `user_profiles` | Own row | Own row |
| `community_products` | Public (status=approved) | Own submissions |
| `product_validations` | Own rows | Own rows, 1 per product |
| `scan_sessions` | Own rows | Own rows |
| `food_logs` | Own rows | Own rows |
| `pending_scans` | Own rows | Own rows |
| `product_corrections` | Own rows | Own rows |
| `rate_limits` | Own rows | Service role only |
| `meal_favorites` | Own rows | Own rows |

---

## Migration Strategy

- Migrations are forward-only, named `{NNN}_{description}.sql`
- Breaking changes (column drops, type changes) require a transition migration:
  1. Add new column
  2. Deploy code that writes to both
  3. Backfill
  4. Deploy code that reads new column only
  5. Drop old column
- Never rename a column directly — use add/backfill/drop pattern
- All migrations tested against a Supabase local dev instance before production
