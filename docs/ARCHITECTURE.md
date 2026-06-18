# ARCHITECTURE — HealthOX
_System design, data flows, and deployment topology_

---

## Core Design Principles

1. **Determinism first** — the health score engine runs in < 50ms with zero external
   dependencies. AI enhances; it never gates.
2. **India-specific data layer** — every lookup step has Indian-specific fallbacks
   before generic global sources.
3. **Defense in depth** — rate limiting, RLS, auth middleware, and internal secrets
   operate independently; no single failure exposes data.
4. **Offline-capable by default** — PWA + IndexedDB means core features work on
   2G Indian mobile networks.

---

## Scan-to-Score Data Flow
User: point camera at barcode

│

▼

BarcodeScanner (BarcodeDetector API)

→ barcode string extracted client-side

│

▼

GET /api/scan?barcode={value}

│

├─── Step 1: Supabase products table ──────────────── HIT → jump to SCORE

│      SELECT * FROM products WHERE barcode = $1

│      Cache hit: update last_scanned_at, scan_count

│

├─── Step 2: Open Food Facts API ──────────────────── HIT → normalise → store → SCORE

│      world.openfoodfacts.org/api/v2/product/{barcode}

│      in.openfoodfacts.org/api/v2/product/{barcode}  (Indian endpoint)

│

├─── Step 3: UPC Item DB ──────────────────────────── HIT → partial data → store → SCORE

│      api.upcitemdb.com/prod/trial/lookup?upc={barcode}

│

├─── Step 4: Tavily Web Search ────────────────────── HIT → extract → SCORE

│      Query: "{barcode} India food FSSAI nutrition"

│      Indian-specific: barcode-intelligence.ts maps prefix → brand name

│

├─── Step 5: Gemini AI Estimation ─────────────────── confidence: 'estimated'

│      Input: barcode prefix + inferred category

│      Output: estimated nutrition based on category averages

│

└─── Step 6: Category Default ─────────────────────── confidence: 'low'

Population average for inferred category

│

▼

POST /api/analyze (health engine + optional AI)

│

├── Health Engine (deterministic, sync, < 50ms)

│     scoreNutrition()   → nutrition penalties/bonuses vs ICMR RDA

│     scoreAdditives()   → INS code lookup against additives table

│     classifyNOVA()     → NOVA 1–4 classification

│     fssaiCheck()       → banned additive check

│     childSafety()      → if product is child-relevant

│     personalise()      → adjust for user profile if authenticated

│

└── Groq AI (optional, async, ~800ms)

llama-3.1-8b-instant

Input: product + profile + engine output

Output: summary, personalised warnings, positives, child note

FALLBACK: curated-alternatives.ts + flags[] from engine

│

▼

POST /api/scan-session  (write scan record to DB)

│

▼

Results page → 4 tabs

│

▼ (user action)

POST /api/log

→ food_logs insert

→ TanStack Query invalidate ['dashboard', 'streak']

→ Optimistic cache update on dashboard

---

## Background Scan Flow

For slow lookups (Tavily, AI estimation), the scan can be offloaded:
Client → POST /api/background-scan

→ INSERT pending_scans (status: 'pending')

→ Return job_id immediately
Client polls GET /api/scan-session?job={job_id} every 2s

→ ISSUE: must implement exponential backoff, not fixed polling

→ Max 10 attempts before client shows 'still processing' state
Background worker → polls pending_scans WHERE status = 'pending'

→ runs lookup chain

→ updates pending_scans (status: 'completed', result: {})

→ notifies via Supabase Realtime (preferred over polling)

**Note:** Replace fixed-interval polling with Supabase Realtime subscription
on `pending_scans` filtered by `user_id`. This eliminates the infinite polling
loop bug and reduces database load.

---

## Weekly Report Flow
Vercel Cron — Monday 9:00 AM IST (04:30 UTC)

→ POST /api/cron/weekly-report

→ Verify Authorization: Bearer {CRON_SECRET}

→ SELECT user_id FROM user_profiles WHERE unsubscribed = false

→ For each user (batch of 50 to avoid timeout):

→ call get_nutrition_summary(now-7d, now)

→ render @react-email WeeklyReportEmail template

→ POST to Resend API

→ log delivery status

→ Return { sent: N, failed: M }

---

## Auth Flow
User visits /dashboard (protected)

→ Next.js Middleware: getToken() check

→ No token → redirect /auth/signin
User clicks "Sign in with Google"

→ NextAuth Google OAuth flow

→ Callback: /api/auth/callback/google

→ NextAuth creates JWT session

→ NextAuth callback: upsert user_profiles row

→ POST /api/welcome-email (x-internal-secret header)

→ Resend welcome email
Session established → back to /dashboard

→ OnboardingGate checks: user_profiles.profile_completed

→ false → redirect /profile-setup (8-step flow)

→ true → show dashboard

---

## Community Contribution Flow
User: /contribute

→ Camera capture → Gemini vision OCR → pre-filled form

→ User reviews, corrects, submits

→ POST /api/products/submit (rate: 10/day)

→ INSERT community_products (status: 'pending')

→ Award contribution_in_progress badge candidate
Other users: /validate

→ GET pending community_products

→ User votes approve/reject

→ POST /api/products/correct (validates vote uniqueness)

→ INSERT product_validations

→ UPDATE community_products.validation_count / rejection_count
Promotion check (after each vote):

→ validation_count >= 3 AND rejection_count = 0

→ POST /api/community/promote (admin-only, or auto-trigger)

→ INSERT INTO products (from community_products data)

→ UPDATE community_products.status = 'approved'

→ UPDATE submitted_by user's contributions_count++

→ Badge engine: award 'Contributor' badge if threshold met

---

## Dependency Graph
Pages & Components

└── Hooks (useOffline, custom TanStack hooks)

└── API Routes (26 handlers)

│

├── lib/auth.ts              NextAuth config, requireAuth(), getSession()

├── lib/supabase.ts          Supabase anon client (NEXT_PUBLIC keys, safe client-side)

├── lib/supabaseAdmin.ts     Service role client — SERVER ONLY, never import in components

├── lib/rateLimit.ts         enforceRateLimit() → check_rate_limit() DB function

│

├── lib/scan-helpers.ts      orchestrateLookup() — 6-step lookup chain

│   ├── lib/openfoodfacts.ts    OFF + UPC Item DB + Tavily

│   ├── lib/gemini.ts           Gemini 2.5 Flash vision client

│   └── lib/barcode-intelligence.ts  Indian brand prefix map

│

├── lib/health-engine/

│   ├── index.ts             scoreProduct() entry point

│   ├── scorer.ts            scoreNutrition(), scoreAdditives(), classifyNOVA()

│   └── additives-db.ts      50+ additive records with INS codes

│

├── lib/fssai-checker.ts     checkFSSAICompliance() → fssai-rules.json

├── lib/child-safety-rules.ts evaluateChildSafety() → child-safety-rules.json

├── lib/icmr-rda.ts          getRDA(age, gender, activity) → icmr-rda.json

│

├── lib/groq.ts              Groq analysis client

├── lib/groq-ai.ts           Prompt builders for analysis / alternatives

│

├── lib/curated-alternatives.ts  30+ category alternative mappings

├── lib/shopping-links.ts        Marketplace URL builders + affiliate tags

├── lib/gamification.ts          8 badge definitions

├── lib/badge-engine.ts          checkAndAwardBadges()

│

├── lib/ocr/

│   └── indian-label-parser.ts  FSSAI format OCR parser

│

├── lib/offline-cache.ts     IndexedDB CRUD + sync queue

└── lib/api-auth.ts          x-internal-secret validation

---

## Security Architecture

| Layer | Mechanism | Protects |
|---|---|---|
| Network | Vercel HTTPS | Transit encryption |
| Auth | NextAuth JWT + Google OAuth | Session validity |
| Auth middleware | `middleware.ts` — 15+ protected prefixes | Unauthenticated route access |
| Database | Supabase RLS on all user tables | Cross-user data leakage |
| API auth | `requireAuth()` on every protected handler | Direct API calls bypassing middleware |
| Internal calls | `x-internal-secret` header | welcome-email, promote endpoints |
| Cron | `CRON_SECRET` Bearer token | Cron endpoint hijacking |
| Admin | `ADMIN_EMAILS` env var | Privilege escalation |
| Rate limiting | `rate_limits` table, per-user per-action | API abuse, AI cost overrun |
| Email | HMAC-signed unsubscribe tokens | Unsubscribe link forgery |
| Keys | `service_role` never in client bundle | Database superuser access |

---

## Deployment Topology
Vercel (Global Edge Network)

├── Next.js Application

│   ├── SSR Pages (dashboard, results, profile-setup)

│   ├── Static Pages (landing, signin)

│   ├── API Routes — 26 serverless functions

│   └── Edge Middleware — auth guard

│

├── Cron Job

│   └── Monday 04:30 UTC → POST /api/cron/weekly-report

│

└── Static Assets

├── public/sw.js (Service Worker)

└── public/manifest.json (PWA manifest)
Supabase (ap-south-1 — Mumbai region)

├── PostgreSQL 15 — 12 tables, RLS, functions

├── Auth — Google OAuth provider

├── Storage — product images, avatars

└── Realtime — pending_scans subscription (recommended)
External Services

├── Google Gemini 2.5 Flash — vision OCR

├── Groq (llama-3.1-8b-instant) — text analysis

├── Open Food Facts — global product catalog

├── UPC Item DB — barcode fallback

├── Tavily — Indian web search

├── Resend — transactional email

├── Google Analytics 4 — usage analytics (consent-gated)

└── Google OAuth 2.0 — authentication

**Region note:** Supabase project should be in `ap-south-1` (Mumbai) for minimum
latency from Indian users. Verify this in the Supabase dashboard.

---

## Known Architectural Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Groq overload | AI analysis fails | Deterministic engine always returns complete score |
| Gemini overload | Vision OCR fails | Fallback to `indian-label-parser.ts` deterministic OCR |
| OFF API rate limit | Lookup chain slows | UPC Item DB + Tavily as immediate fallbacks |
| Vercel serverless cold start | Scan feels slow | Pre-warm with `/api/scan` on app load (options request) |
| pending_scans polling loop | Excessive DB reads | Replace with Supabase Realtime subscription |
| Rate limit table growth | Query slowdown | Cron cleanup of rows older than 24h |
| Large git history (CSV files) | Slow clone | Resolved via `git filter-repo` |
