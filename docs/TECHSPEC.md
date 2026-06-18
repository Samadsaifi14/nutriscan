# TECH SPEC — HealthOX
_Technical Specification · v1.0_

---

## Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 App Router | SSR, API routes, middleware, Vercel-native |
| Language | TypeScript (strict mode) | Correctness at scale; no `any` |
| Styling | Tailwind CSS v3 + CSS variables | Utility-first + theme tokens |
| Animation | Framer Motion | Declarative, performant, reduces-motion aware |
| State | TanStack React Query v5 | Server state, caching, optimistic updates |
| Database | Supabase PostgreSQL | Managed Postgres + RLS + Auth + Storage |
| ORM | None (raw Supabase JS SDK v2) | Sufficient complexity, avoids ORM overhead |
| Auth | NextAuth v4 + Google OAuth + JWT | Familiar, well-tested, Supabase-compatible |
| AI — Vision | Google Gemini 2.5 Flash | Best-in-class OCR on Indian food labels |
| AI — Analysis | Groq llama-3.1-8b-instant | Sub-second inference, low cost, fallback-safe |
| Email | Resend + @react-email | Reliable delivery, React template authoring |
| Deployment | Vercel | Zero-config Next.js, edge functions, cron |
| Testing | Vitest + jsdom | Fast unit tests, same syntax as Jest |
| Monitoring | Sentry (optional) | Error tracking in production |

---

## API Design

### Auth pattern
Every protected route calls `requireAuth()` which wraps `getServerSession()`.
Unauthorised requests receive `401 { error: 'Unauthorized' }`.
Admin routes additionally check `ADMIN_EMAILS` env var.

### Error contract
All API routes return a consistent error shape:
```typescript
// Success
{ data: T, error: null }

// Error
{ data: null, error: { code: string, message: string, details?: unknown } }
```

Error codes follow HTTP status semantics:
| Code | HTTP | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid session |
| `FORBIDDEN` | 403 | Authenticated but not permitted |
| `NOT_FOUND` | 404 | Resource does not exist |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `AI_UNAVAILABLE` | 503 | AI degraded, deterministic fallback used |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Route inventory

| Endpoint | Method | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `/api/auth/[...nextauth]` | ALL | — | — | NextAuth handler |
| `/api/scan` | GET | Required | 50/day | Product lookup chain |
| `/api/scan-vision` | POST | Required | 20/60min | Gemini photo analysis |
| `/api/scan-community` | POST | Required | 30/60min | Community product search |
| `/api/scan-product-photo` | POST | Required | 20/60min | Photo + nutrition label OCR |
| `/api/scan-session` | POST | Required | — | Create scan record |
| `/api/background-scan` | POST | Required | — | Async scan job creation |
| `/api/analyze` | POST | Required | 20/60min | Full analysis (engine + Groq) |
| `/api/analyze-ai` | GET | Required | 15/60min | AI-only Groq analysis |
| `/api/alternatives` | POST | Required | 30/60min | AI + curated alternatives |
| `/api/search` | GET | Required | — | DB + OFF product search |
| `/api/enrich` | POST | Required | 30/60min | AI enrichment of existing product |
| `/api/log` | GET | Required | — | Fetch user food logs |
| `/api/log` | POST | Required | 50/60min | Create food log entry |
| `/api/dashboard` | GET | Required | — | Dashboard aggregates |
| `/api/favorites` | GET/POST/DELETE | Required | — | Meal favorites CRUD |
| `/api/profile` | GET/PUT | Required | — | User profile |
| `/api/profile/badges` | GET | Required | — | Badge list |
| `/api/profile/email-prefs` | POST | Required | — | Email preferences |
| `/api/profile/delete` | DELETE | Required | — | Account deletion |
| `/api/profile/export` | GET | Required | — | Data export |
| `/api/profile/notifications` | POST | Required | — | Push notification prefs |
| `/api/streak` | GET | Required | — | Logging streak calculation |
| `/api/last-scan` | GET | Required | — | Last scanned product |
| `/api/ingredients-health` | GET | Required | — | Ingredient safety lookup |
| `/api/nutrients/summary` | GET | Required | — | Weekly nutrition aggregation |
| `/api/products/submit` | POST | Required | 10/day | Community product submission |
| `/api/products/correct` | POST | Required | 20/day | Product correction |
| `/api/community/promote` | POST | Admin | — | Promote community → main DB |
| `/api/admin/check` | GET | Admin | — | Admin status check |
| `/api/cron/weekly-report` | POST | CRON_SECRET | — | Monday 9AM weekly email |
| `/api/unsubscribe` | GET | — | — | HMAC-signed email unsubscribe |
| `/api/welcome-email` | POST | x-internal-secret | — | Triggered on first sign-in |

---

## Rate Limiting

Implementation: `check_rate_limit()` Supabase function + `rate_limits` table.
Sliding window per `{user_id}:{action}` key.

| Action | Limit | Window |
|---|---|---|
| `scan` | 50 | 24 hours |
| `analyze` | 20 | 60 minutes |
| `analyze_ai` | 15 | 60 minutes |
| `scan_vision` | 20 | 60 minutes |
| `enrich` | 30 | 60 minutes |
| `log` | 50 | 60 minutes |
| `submit` | 10 | 24 hours |
| `correct` | 20 | 24 hours |
| default | 60 | 60 minutes |

Rate-limited responses return `429` with:
```json
{ "data": null, "error": { "code": "RATE_LIMITED", "message": "Too many requests", "retryAfter": 1800 } }
```

---

## AI Pipeline

### Product Lookup Chain
GET /api/scan?barcode=8901234567890
Step 1: Supabase products table

→ Cache hit: return immediately, increment scan_count, update last_scanned_at

→ Miss: continue
Step 2: Open Food Facts REST API

→ https://world.openfoodfacts.org/api/v2/product/{barcode}

→ Indian products also checked: https://in.openfoodfacts.org/...

→ Hit: normalise to internal schema, store in products, continue to Step 6
Step 3: UPC Item DB

→ https://api.upcitemdb.com/prod/trial/lookup?upc={barcode}

→ Hit: partial data (name/brand only), store skeleton, continue to Step 6
Step 4: Tavily Web Search

→ Query: "{barcode} India food product FSSAI nutrition"

→ Extracts product name, brand from search snippets

→ Used for Indian products with no OFF/UPC coverage
Step 5: Gemini AI Estimation

→ Given barcode prefix (Indian brand mapping) + category estimation

→ Returns estimated nutrition based on category averages

→ Confidence set to 'estimated', source = 'ai'
Step 6: Category-based Default

→ Last resort. Uses barcode prefix to infer category

→ Returns population average nutrition for that category

→ Confidence = 'low', source = 'default'
After any step: POST /api/analyze to score the resolved product

### Caching Strategy

| Layer | TTL | Invalidation |
|---|---|---|
| Supabase products table | Permanent | Manual admin correction or community correction |
| PWA cache (scan/product APIs) | 30 days | Service worker cache update on app version bump |
| TanStack Query client cache | 5 minutes | Invalidated on scan, log, correction actions |
| IndexedDB product cache | 7 days | LRU eviction, manual clear in settings |

### Health Score Engine

Fully deterministic. Runs synchronously in < 50ms. No external calls.

```typescript
scoreProduct(product, userProfile?) → {
  score: number,        // 0–10
  rating: 'A'|'B'|'C'|'D'|'E'|'F',
  breakdown: {
    nutrition: number,  // -5 to +5
    additives: number,  // -3 to 0
    nova: number,       // -2 to 0
    fssai: number,      // -5 if banned additive present
    childSafety?: number
  },
  flags: string[],      // human-readable warnings
  confidence: string
}
```

Scoring weights:
- Nutrition component (50%): calories, saturated fat, sugar, sodium as penalties; protein, fiber as bonuses. All normalised per 100g against ICMR RDA.
- Additive component (30%): -1 per medium risk, -2 per high risk, -5 for any FSSAI-banned additive
- NOVA component (20%): NOVA 1 = 0, NOVA 2 = -0.5, NOVA 3 = -1.5, NOVA 4 = -3

### AI Enhancement Layer

Both AI calls are optional. Score is complete without them.

**Gemini 2.5 Flash** (vision):
- Input: base64 product image or nutrition label photo
- Output: extracted ingredient text, nutrition values in FSSAI format
- Fallback: deterministic OCR parser in `indian-label-parser.ts`
- Token budget: < 1000 tokens per call to avoid overload errors

**Groq llama-3.1-8b-instant** (analysis):
- Input: product data + user profile + health engine output
- Output: `{summary, personalizedWarnings[], positives[], childSafetyNote?, alternatives[]}`
- Fallback: curated alternatives from `curated-alternatives.ts`, generic warnings from flags[]
- Temperature: 0.3 (factual, consistent outputs)
- Max tokens: 800

---

## PWA Architecture

### Service Worker (`public/sw.js`)

| Resource type | Strategy | TTL |
|---|---|---|
| Static assets (JS/CSS/images/fonts) | Cache-first | App version |
| `/api/scan`, `/api/products/*` | Cache-first | 30 days |
| `/api/dashboard`, `/api/log` | Network-first (cache fallback) | 5 minutes |
| All other `/api/*` | Network-only | — |

### IndexedDB Stores (`lib/offline-cache.ts`)

| Store | Contents | TTL |
|---|---|---|
| `product-cache` | Recently scanned products (max 100) | 7 days LRU |
| `brand-data` | Indian brand prefix map | App version |
| `settings` | User preferences (theme, locale) | Permanent |
| `offline-queue` | Pending food_logs + product submissions | Until synced |

### Offline Sync
On reconnect: drain `offline-queue` in FIFO order via `/api/log` and `/api/products/submit`.
Conflict resolution: server wins. If product was deleted while offline, log is discarded.

---

## Performance Budgets

| Metric | Budget |
|---|---|
| JS bundle (initial) | < 200KB gzipped |
| CSS | < 30KB gzipped |
| First Contentful Paint | < 1.5s (3G) |
| Scan-to-score (cached product) | < 500ms |
| Scan-to-score (DB lookup) | < 2s |
| Scan-to-score (AI path) | < 5s (with streaming) |
| Lighthouse PWA score | > 90 |

---

## Environment Variables

| Variable | Required | Used In | Notes |
|---|---|---|---|
| `NEXTAUTH_URL` | Yes | `lib/auth.ts` | Full URL including protocol |
| `NEXTAUTH_SECRET` | Yes | `lib/auth.ts` | Min 32 chars, random |
| `GOOGLE_CLIENT_ID` | Yes | `lib/auth.ts` | |
| `GOOGLE_CLIENT_SECRET` | Yes | `lib/auth.ts` | |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `lib/supabase.ts` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | `lib/supabase.ts` | Safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | `lib/supabaseAdmin.ts` | Never client-side |
| `GEMINI_API_KEY` | Yes | `lib/gemini.ts` | |
| `GROQ_API_KEY` | Yes | `lib/groq.ts` | |
| `TAVILY_API_KEY` | Yes | `lib/openfoodfacts.ts` | |
| `RESEND_API_KEY` | Yes | email routes | |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | `Analytics.tsx` | Consent-gated |
| `CRON_SECRET` | Yes | `/api/cron/weekly-report` | |
| `INTERNAL_SECRET` | Yes | `lib/api-auth.ts` | API-to-API calls |
| `ADMIN_EMAILS` | Yes | `lib/admin.ts` | Comma-separated list |
| `OFF_USERNAME` | No | `lib/openfoodfacts.ts` | Increases OFF rate limits |
| `OFF_PASSWORD` | No | `lib/openfoodfacts.ts` | |
