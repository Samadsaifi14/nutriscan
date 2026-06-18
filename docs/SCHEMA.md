# SCHEMA — HealthOX Database
_Supabase PostgreSQL — 12 tables, 19 migrations_

---

## Tables

### `products`
Core product catalog.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| barcode | TEXT UNIQUE | |
| name | TEXT | |
| brand | TEXT | |
| category | TEXT | |
| nutrition | JSONB | `{calories, protein, carbs, fat, sugar, sodium, fiber, saturated_fat}` |
| serving_size_g | NUMERIC | |
| ingredients_text | TEXT | Raw ingredient string |
| ingredients_tags | TEXT[] | Normalized tags |
| allergens | TEXT[] | |
| additives | TEXT[] | INS codes |
| health_score | NUMERIC | 0–10 |
| health_rating | TEXT | A–F |
| nutriscore | TEXT | |
| nova_group | INTEGER | 1–4 |
| nova_label | TEXT | |
| image_url | TEXT | |
| source | TEXT | `supabase`, `off`, `upc`, `ai`, `default` |
| country | TEXT | |
| fssai_license | TEXT | 14-digit |
| mrp | NUMERIC | |
| labels_tags | TEXT[] | |
| traces_tags | TEXT[] | |
| popularity | INTEGER DEFAULT 1 | |
| scan_count | INTEGER DEFAULT 1 | |
| ai_summary | TEXT | |
| ai_insights | JSONB | |
| ai_ingredients | JSONB | |
| ai_analyzed_at | TIMESTAMPTZ | |
| last_scanned_at | TIMESTAMPTZ DEFAULT now() | |
| created_at | TIMESTAMPTZ DEFAULT now() | |
| updated_at | TIMESTAMPTZ DEFAULT now() | |
| last_enriched_at | TIMESTAMPTZ | |
| enrich_job_status | TEXT DEFAULT 'idle' | `idle`, `pending`, `done`, `failed` |

---

### `additives`
Reference table of food additives.

| Column | Type |
|---|---|
| id | UUID PK |
| name | TEXT |
| ins_code | TEXT |
| risk | TEXT |
| category | TEXT |
| description | TEXT |
| created_at | TIMESTAMPTZ |

---

### `user_profiles`
Extended user data linked to `auth.users`.

| Column | Type | Notes |
|---|---|---|
| user_id | UUID PK | refs `auth.users` |
| name | TEXT | |
| email | TEXT | |
| age | INTEGER | |
| gender | TEXT | |
| height | NUMERIC | cm |
| weight | NUMERIC | kg |
| activity_level | TEXT | sedentary/moderate/active/very_active |
| dietary_preference | TEXT | |
| weight_goal | TEXT | lose/maintain/gain |
| health_conditions | TEXT[] | |
| allergies | TEXT[] | |
| daily_calorie_goal | INTEGER DEFAULT 2000 | |
| daily_protein_goal | NUMERIC | |
| daily_carbs_goal | NUMERIC | |
| daily_fat_goal | NUMERIC | |
| profile_completed | BOOLEAN DEFAULT false | |
| contributions_count | INTEGER DEFAULT 0 | |
| validated_count | INTEGER DEFAULT 0 | |
| badges | TEXT[] DEFAULT '{}' | |
| avatar_url | TEXT | |
| onboarding_step | INTEGER | |
| onboarding_data | JSONB | |
| unsubscribed | BOOLEAN DEFAULT false | |

---

### `community_products`
User-submitted products pending review.

| Column | Type |
|---|---|
| id | UUID PK |
| name | TEXT |
| brand | TEXT |
| barcode | TEXT |
| nutrition | JSONB |
| ingredients_text | TEXT |
| image_url | TEXT |
| front_label_url | TEXT |
| nutrition_label_url | TEXT |
| submitted_by | UUID refs `auth.users` |
| status | TEXT DEFAULT 'pending' |
| validation_count | INTEGER DEFAULT 0 |
| rejection_count | INTEGER DEFAULT 0 |
| validated_by | TEXT[] |
| rejected_by | TEXT[] |

---

### `product_validations`
Community voting on submitted products.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| product_id | UUID | refs `community_products` |
| user_id | UUID | refs `auth.users` |
| vote | TEXT | `approve` / `reject` |
| | | UNIQUE(product_id, user_id) |

---

### `scan_sessions`
History of all barcode scans per user.

| Column | Type |
|---|---|
| id | UUID PK |
| user_id | UUID refs `auth.users` |
| barcode | TEXT |
| product_name | TEXT |
| scan_type | TEXT |
| image_url | TEXT |
| health_score | NUMERIC |
| health_rating | TEXT |
| confidence | TEXT DEFAULT 'high' |
| status | TEXT DEFAULT 'completed' |

---

### `food_logs`
Meal tracking entries.

| Column | Type |
|---|---|
| id | UUID PK |
| user_id | UUID refs `auth.users` |
| product_id | UUID refs `products` |
| meal_type | TEXT |
| servings | NUMERIC DEFAULT 1 |
| calories | NUMERIC |
| protein | NUMERIC |
| carbs | NUMERIC |
| fat | NUMERIC |

---

### `pending_scans`
Background async scan queue.

| Column | Type |
|---|---|
| id | UUID PK |
| user_id | UUID refs `auth.users` |
| barcode | TEXT |
| status | TEXT DEFAULT 'pending' |

---

### `product_corrections`
Crowdsourced field-level product corrections.

| Column | Type |
|---|---|
| id | UUID PK |
| product_id | UUID refs `products` |
| user_id | UUID refs `auth.users` |
| field_name | TEXT |
| old_value | TEXT |
| new_value | TEXT |
| status | TEXT DEFAULT 'pending' |

---

### `rate_limits`
Per-user per-action request throttling.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| key | TEXT | `user_id:action` |
| action | TEXT | |
| window_start | TIMESTAMPTZ | |
| count | INTEGER DEFAULT 1 | |
| | | UNIQUE(key, window_start) |

---

### `meal_favorites`
Saved meals for quick re-logging.

| Column | Type |
|---|---|
| id | UUID PK |
| user_id | UUID refs `auth.users` |
| product_name | TEXT |
| barcode | TEXT |
| calories_per_100g | NUMERIC |
| protein_per_100g | NUMERIC |
| carbs_per_100g | NUMERIC |
| fat_per_100g | NUMERIC |

---

## Database Functions

```sql
-- Aggregate food_logs over date range
get_nutrition_summary(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)

-- Sliding window rate check
check_rate_limit(p_user_id UUID, p_action TEXT, p_max_count INT, p_window_minutes INT)
```

---

## Indexes

| Table | Index |
|---|---|
| `products` | `barcode` (UNIQUE), `category`, `health_score`, `last_scanned_at` |
| `food_logs` | `(user_id, logged_at)`, `(user_id, meal_type, logged_at)` |
| `scan_sessions` | `(user_id, scanned_at)`, `status` |
| `community_products` | `status`, `barcode` |
| `rate_limits` | `action`, `(window_start, action)` |

---

## Row-Level Security

RLS enabled on all user-facing tables: `user_profiles`, `community_products`, `product_validations`, `food_logs`, `meal_favorites`, `rate_limits`, `scan_sessions`, `product_corrections`, `pending_scans`. Policy: users can only read/write their own rows.
