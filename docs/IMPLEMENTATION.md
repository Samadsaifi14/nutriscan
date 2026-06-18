# IMPLEMENTATION — HealthOX
_Project configuration, key files, and implementation details_

---

## Scripts (`package.json`)

| Script | Command |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `next lint` |
| `test` | `vitest` (watch) |
| `test:run` | `vitest run` (single pass) |

---

## Configuration Files

| File | Purpose |
|---|---|
| `next.config.mjs` | Image domains (Supabase, OFF), server component external packages |
| `tailwind.config.ts` | Custom emerald shades, `shimmer` and `fadeIn` keyframe animations |
| `tsconfig.json` | Strict mode, `@/*` alias, bundler module resolution |
| `vitest.config.ts` | jsdom environment, `@/` alias |
| `vercel.json` | Cron job — Monday 9AM weekly report |
| `postcss.config.mjs` | tailwindcss + autoprefixer |
| `.eslintrc.json` | next/core-web-vitals, no-unused-vars warn, no-console warn |
| `public/sw.js` | Service Worker (cache-first static, network-first API) |
| `public/manifest.json` | PWA manifest |

---

## Key Source Files

| File | Purpose |
|---|---|
| `src/lib/health-engine/scorer.ts` | Core scoring: `scoreProduct`, `scoreNutrition`, `scoreAdditives`, `classifyNOVA` |
| `src/lib/health-engine/additives-db.ts` | 50+ additives with INS codes and risk levels |
| `src/lib/health-engine/index.ts` | Engine entry point |
| `src/lib/scan-helpers.ts` | Product lookup orchestration (DB→OFF→UPC→Tavily→AI→Default) |
| `src/lib/fssai-checker.ts` | FSSAI banned/restricted additive rules + trans fat check |
| `src/lib/child-safety-rules.ts` | Age-group specific nutrient limit evaluation |
| `src/lib/icmr-rda.ts` | ICMR Indian RDA lookup by age/gender/activity |
| `src/lib/barcode-intelligence.ts` | 70+ Indian brand barcode prefix mappings |
| `src/lib/curated-alternatives.ts` | Healthier alternatives for 30+ Indian product categories |
| `src/lib/shopping-links.ts` | Shopping platform URLs + affiliate tags |
| `src/lib/gamification.ts` | 8 badge definitions and award logic |
| `src/lib/offline-cache.ts` | IndexedDB product cache, brand data, offline queue |
| `src/lib/ocr/indian-label-parser.ts` | FSSAI format nutrition label OCR |
| `src/lib/rateLimit.ts` | Sliding-window rate limiting engine |
| `src/lib/gemini.ts` | Gemini 2.5 Flash vision API client |
| `src/lib/groq.ts` | Groq llama-3.1-8b-instant client |
| `src/lib/auth.ts` | NextAuth config + Supabase session sync |
| `src/lib/supabase.ts` | Supabase anon client (client-side safe) |
| `src/lib/supabaseAdmin.ts` | Supabase service role client (server-only) |

---

## Data Files

| File | Contents |
|---|---|
| `src/data/icmr-rda.json` | Indian RDA values by demographic |
| `src/data/fssai-rules.json` | FSSAI banned and restricted additives list |
| `src/data/child-safety-rules.json` | Per-age-group nutrient thresholds |

---

## Test Files

| File | Covers |
|---|---|
| `tests/health-engine/scorer.test.ts` | Nutrition + additive scoring |
| `tests/health-engine/alternatives.test.ts` | Curated alternatives matching |
| `tests/health-engine/additives-db.test.ts` | Additive database integrity |
| `tests/barcode.test.ts` | Indian barcode prefix detection |
| `tests/groq-fallback.test.ts` | Groq failure + deterministic fallback |
| `tests/client-analysis.test.ts` | Client-side analysis pipeline |
| `tests/profile.test.ts` | User profile validation |
| `tests/image-enhancer.test.ts` | OCR image preprocessing |

---

## Auth Flow

```
User visits protected page
  → Next.js Middleware checks session
  → If no session → redirect /auth/signin
  → Google OAuth popup
  → NextAuth callback
  → Supabase user_profiles upsert
  → Welcome email via /api/welcome-email (x-internal-secret)
  → OnboardingGate checks profile_completed
  → If false → redirect /profile-setup
  → Multi-step onboarding (8 steps)
  → profile_completed = true → app access
```

---

## Offline Architecture

```
Service Worker (public/sw.js)
├── Cache-first: static assets (JS, CSS, images)
├── Cache-first (30-day TTL): /api/scan, /api/products/*
└── Network-first: all other API routes

IndexedDB (lib/offline-cache.ts)
├── product-cache: recently scanned products
├── brand-data: Indian brand prefix map
├── settings: user preferences
└── offline-queue: pending food_logs + product submissions (sync on reconnect)
```
