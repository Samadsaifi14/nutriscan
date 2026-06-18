# ARCHITECTURE — HealthOX System Design
_Data flows, dependency graph, deployment topology_

---

## Scan-to-Log Data Flow

```
User scans barcode
  → BarcodeScanner (BarcodeDetector API)
  → GET /api/scan?barcode=X
    → Lookup chain (in order):
      1. Supabase products table
      2. Open Food Facts REST API
      3. UPC Item DB REST API
      4. Tavily web search (Indian products)
      5. Gemini AI estimation
      6. Category-based default nutrition
  → POST /api/analyze
    → Local health engine:
      scoreProduct()
      ├── scoreNutrition()
      ├── scoreAdditives()
      ├── classifyNOVA()
      ├── FSSAI compliance check
      └── Child safety evaluation
    → Groq AI (llama-3.1-8b-instant):
      personalized insights, warnings, alternatives
    → Write scan_session to DB
    → Return results to client
  → Results page (4 tabs)
  → User taps Log Meal
    → POST /api/log
    → Write to food_logs
    → Dashboard + streak update
```

---

## Weekly Report Flow

```
Vercel Cron — Monday 9AM IST
  → POST /api/cron/weekly-report
    → Verify CRON_SECRET header
    → Query all users WHERE unsubscribed = false
    → For each user:
      → Call get_nutrition_summary(now-7d, now) via Supabase function
      → Render @react-email template with weekly stats
      → Send via Resend API
```

---

## Dependency Graph

```
Pages & Components
  └── Hooks (useOffline, TanStack Query)
      └── API Routes
          ├── lib/auth.ts              ← NextAuth + Supabase
          ├── lib/supabase.ts          ← Supabase client (anon)
          ├── lib/supabaseAdmin.ts     ← Supabase client (service role)
          ├── lib/rateLimit.ts         ← rate_limits table
          ├── lib/gemini.ts            ← Gemini API (vision)
          ├── lib/groq.ts              ← Groq API (analysis)
          ├── lib/openfoodfacts.ts     ← OFF API + UPC Item DB + Tavily
          ├── lib/scan-helpers.ts      ← Lookup chain orchestration
          ├── lib/health-engine/
          │     ├── scorer.ts          ← scoreProduct, scoreNutrition, scoreAdditives, classifyNOVA
          │     ├── additives-db.ts    ← 50+ additive records
          │     └── index.ts           ← Engine entry point
          ├── lib/fssai-checker.ts     ← FSSAI compliance rules
          ├── lib/child-safety-rules.ts
          ├── lib/icmr-rda.ts          ← Indian RDA lookup
          ├── lib/barcode-intelligence.ts ← 70+ Indian brand prefixes
          ├── lib/curated-alternatives.ts ← 30+ Indian category alternatives
          ├── lib/shopping-links.ts    ← Marketplace info + affiliate tags
          ├── lib/gamification.ts      ← 8 badge definitions
          ├── lib/ocr/
          │     └── indian-label-parser.ts ← FSSAI label OCR
          ├── lib/offline-cache.ts     ← IndexedDB
          └── lib/badge-engine.ts      ← Badge award logic
```

---

## Deployment Topology

```
Vercel (Edge + Serverless)
├── Next.js App
│   ├── React Frontend (SSR + Static)
│   ├── API Routes (26 handlers)
│   └── Middleware (auth guard on 15+ prefixes)
├── Cron Job (Mon 9AM — weekly-report)
└── Static Assets (PWA manifest + service worker)

External Services:
├── Supabase          — PostgreSQL + Auth + Storage
├── Google OAuth 2.0  — Authentication
├── Google Gemini     — Vision / OCR / AI estimation
├── Groq              — llama-3.1-8b-instant analysis
├── Open Food Facts   — Global product catalog
├── UPC Item DB       — Barcode fallback
├── Tavily            — Web search for Indian products
├── Resend            — Transactional email
├── Google Analytics 4 — Usage analytics
└── Sentry            — Error monitoring (optional)
```

---

## Security Layers

| Layer | Mechanism |
|---|---|
| Authentication | NextAuth v4 JWT + Google OAuth |
| Database | Supabase RLS on all user tables |
| API auth | `getServerSession` + `requireAuth()` on every protected route |
| Rate limiting | `rate_limits` table, sliding window, per-user per-action |
| Internal API calls | `x-internal-secret` header required |
| Cron protection | `CRON_SECRET` header verification |
| Admin routes | `ADMIN_EMAILS` env var check |
| Key hygiene | `service_role` key never exposed client-side |
