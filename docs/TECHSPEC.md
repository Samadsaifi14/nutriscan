# TECH SPEC — HealthOX
_Technical Specification_

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router (React 18, TypeScript strict) |
| Styling | Tailwind CSS v3 + CSS variables + Framer Motion |
| State | TanStack React Query v5 (no client state lib) |
| Database | Supabase PostgreSQL (raw JS SDK v2, no ORM) |
| Auth | NextAuth v4 — Google OAuth + JWT sessions |
| AI (Vision) | Google Gemini 2.5 Flash |
| AI (Analysis) | Groq — llama-3.1-8b-instant |
| Email | Resend + @react-email |
| Deployment | Vercel (serverless + edge) |
| Testing | Vitest + jsdom |

---

## API Routes (26 endpoints)

| Endpoint | Method | Auth | Rate Limited | Description |
|---|---|---|---|---|
| `/api/auth/[...nextauth]` | ALL | No | No | NextAuth handler |
| `/api/scan` | GET | Yes | 50/day | Product lookup chain |
| `/api/scan-vision` | POST | Yes | Yes | Gemini photo analysis |
| `/api/scan-community` | POST | Yes | Yes | Community product search |
| `/api/scan-product-photo` | POST | Yes | Yes | Photo + nutrition label OCR |
| `/api/scan-session` | POST | Yes | No | Create scan record |
| `/api/background-scan` | POST | Yes | No | Async scan processing |
| `/api/analyze` | POST | Yes | 20/60min | Full analysis (engine + Groq) |
| `/api/analyze-ai` | GET | Yes | 15/60min | AI-only analysis |
| `/api/alternatives` | POST | Yes | Yes | AI + curated alternatives |
| `/api/search` | GET | Yes | No | Product search |
| `/api/enrich` | POST | Yes | 30/60min | AI enrich existing product |
| `/api/log` | GET/POST | Yes | 50/60min | Meal log CRUD |
| `/api/dashboard` | GET | Yes | No | Dashboard aggregates |
| `/api/favorites` | GET/POST/DELETE | Yes | No | Meal favorites CRUD |
| `/api/profile` | GET/PUT | Yes | No | User profile |
| `/api/profile/badges` | GET | Yes | No | Badge list |
| `/api/profile/photo` | POST | Yes | No | Avatar upload |
| `/api/streak` | GET | Yes | No | Logging streak |
| `/api/last-scan` | GET | Yes | No | Last scanned product |
| `/api/ingredients-health` | GET | Yes | No | Ingredient safety check |
| `/api/nutrients/summary` | GET | Yes | No | Weekly nutrition summary |
| `/api/products/submit` | POST | Yes | Yes | Community product submission |
| `/api/products/correct` | POST | Yes | Yes | Product correction |
| `/api/community/promote` | POST | Admin | No | Promote to main DB |
| `/api/admin/check` | GET | Admin | No | Admin check |
| `/api/cron/weekly-report` | POST | CRON_SECRET | No | Weekly email |
| `/api/unsubscribe` | GET | No | No | Email unsubscribe |
| `/api/welcome-email` | POST | Internal | No | Welcome email on signup |

---

## Rate Limits

| Action | Limit |
|---|---|
| `analyze` | 20 req / 60 min |
| `scan` | 50 req / day |
| `log` | 50 req / 60 min |
| `analyze_ai` | 15 req / 60 min |
| `enrich` | 30 req / 60 min |
| default | 60 req / 60 min |

---

## AI Pipeline

### Product Lookup Chain (deterministic fallback order)
Local Supabase DB

→ Open Food Facts API

→ UPC Item DB API

→ Tavily Web Search (Indian products)

→ Gemini AI Estimation

→ Category-based Default Nutrition

### Health Score Engine (fully deterministic)
- Nutrition scoring — calorie/fat/sugar/sodium penalties; protein/fiber bonuses
- Additive detection — 50+ additives, INS codes, 3 risk levels
- NOVA classification — 1 (minimally processed) to 4 (ultra-processed)
- FSSAI compliance — banned/restricted additives, trans fat < 0.2g
- Child safety evaluation — age-group-specific nutrient limits
- ICMR RDA comparison — Indian demographic reference values

### AI Enhancement (Gemini + Groq, fallback-safe)
- Gemini 2.5 Flash: product photo OCR, nutrition label extraction, ingredient text parsing
- Groq llama-3.1-8b-instant: ingredient classification, personalized warnings, alternatives generation, child safety narrative

---

## PWA & Offline

| Layer | Strategy |
|---|---|
| Static assets (JS/CSS/images) | Cache-first |
| Scan/product APIs | Cache-first, 30-day TTL |
| Other APIs | Network-first |
| Offline queue | Meal logs + product submissions stored in IndexedDB, sync on reconnect |

---

## Environment Variables

| Variable | Used In |
|---|---|
| `NEXTAUTH_URL` | `lib/auth.ts` |
| `NEXTAUTH_SECRET` | `lib/auth.ts` |
| `GOOGLE_CLIENT_ID` | `lib/auth.ts` |
| `GOOGLE_CLIENT_SECRET` | `lib/auth.ts` |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabaseAdmin.ts` |
| `GEMINI_API_KEY` | `lib/gemini.ts` |
| `GROQ_API_KEY` | `lib/groq.ts` |
| `TAVILY_API_KEY` | `lib/openfoodfacts.ts` |
| `RESEND_API_KEY` | email routes |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `Analytics.tsx` |
| `CRON_SECRET` | `/api/cron/weekly-report` |
| `INTERNAL_SECRET` | `lib/api-auth.ts` |
| `ADMIN_EMAILS` | `lib/admin.ts` |
| `OFF_USERNAME` / `OFF_PASSWORD` | `lib/openfoodfacts.ts` |
