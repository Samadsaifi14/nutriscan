# NutriScan Full Code Dump

Generated for AI context sharing. Includes root config/docs + src + scripts + public.

## FILE: .env.local.example

`$lang

# â”€â”€ NextAuth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# â”€â”€ Google OAuth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# â”€â”€ Supabase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# â”€â”€ Gemini AI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
GEMINI_API_KEY=your-gemini-api-key

# â”€â”€ Email (Resend) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
RESEND_API_KEY=re_your_resend_api_key

# â”€â”€ Security â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CRON_SECRET=your-random-secret-string

# â”€â”€ Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## FILE: .eslintrc.json

`$lang
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off"
  }
}
```

## FILE: .gitignore

`$lang
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
#products open food facts
*.csv
*.gz
off_full.csvAS
```

## FILE: next.config.mjs

`$lang
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.openfoodfacts.org' },
      { protocol: 'https', hostname: 'images.openfoodfacts.org' },
      { protocol: 'https', hostname: 'static.openfoodfacts.org' },
      { protocol: 'https', hostname: 'world.openfoodfacts.org' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "connect-src 'self' https://generativelanguage.googleapis.com https://www.google-analytics.com https://analytics.google.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self'",
              "style-src 'self' 'unsafe-inline'",
            ].join('; '),
          },
        ],
      },
    ]
  },
  output: 'standalone',
}

export default nextConfig
```

## FILE: package.json

`$lang
{
  "name": "healthox",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "@auth/supabase-adapter": "^1.11.1",
    "@google/generative-ai": "^0.24.1",
    "@supabase/supabase-js": "^2.99.3",
    "@tanstack/react-query": "^5.94.5",
    "axios": "^1.13.6",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "dotenv": "^17.4.2",
    "lucide-react": "^0.577.0",
    "next": "^16.2.3",
    "next-auth": "^4.24.13",
    "next-themes": "^0.4.6",
    "quagga": "^0.6.16",
    "react": "^18",
    "react-dom": "^18",
    "react-hot-toast": "^2.6.0",
    "recharts": "^3.8.0",
    "resend": "^6.9.4",
    "tailwind-merge": "^3.5.0",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^20.19.39",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^10.2.0",
    "eslint-config-next": "^16.2.3",
    "jsdom": "^24.1.3",
    "postcss": "^8",
    "puppeteer": "^24.40.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5",
    "vitest": "^3.2.4"
  }
}
```

## FILE: postcss.config.mjs

`$lang
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

## FILE: PROJECT_CONTEXT_MASTER.md

`$lang
# NutriScan Master Project Context

This document is the single-source project context for future AI chats.  
Use it as the first message context when starting a new thread.

## 1) Project Identity

- Product name in code/UI: **NutriScan** (also appears as **HealthOX** in several files/strings).
- Purpose: scan packaged foods (barcode/photo), analyze health impact with Gemini AI, log meals, track nutrition, and send weekly email reports.
- Target style: mobile-first, consumer nutrition guidance, India-focused recommendations (FSSAI/ICMR/WHO references).

## 2) Tech Stack

- Framework: Next.js App Router (`next` 16) + React 18 + TypeScript.
- Auth/session: NextAuth (Google provider).
- Database/backend service: Supabase (client + service-role admin usage).
- AI: Google Gemini API wrapper in `src/lib/gemini.ts`.
- Styling: Tailwind + custom CSS variables.
- State/data fetching: TanStack React Query.
- Analytics: Google Analytics helper.
- Email: Resend API.
- Tests: Vitest + Testing Library; very limited coverage.
- Deployment assumptions: Vercel (cron endpoint configured in `vercel.json`).

## 3) High-Level Architecture

```mermaid
flowchart TD
  User[User] --> AppUI[NextAppUI]
  AppUI --> ApiRoutes[NextApiRoutes]
  ApiRoutes --> SupabaseDB[SupabaseDB]
  ApiRoutes --> GeminiAPI[GeminiAPI]
  ApiRoutes --> ExternalAPIs[OpenFoodFacts_UPC]
  ApiRoutes --> ResendAPI[ResendEmail]
  VercelCron[VercelCron] --> ApiRoutes
```

## 4) Runtime Entrypoints

- App shell: `src/app/layout.tsx` (providers, error boundary, bottom nav, service worker register).
- Root route: `src/app/page.tsx` redirects to sign-in.
- Main app pages:
  - `src/app/auth/signin/page.tsx`
  - `src/app/scan/page.tsx`
  - `src/app/dashboard/page.tsx`
  - `src/app/history/page.tsx`
  - `src/app/scan-history/page.tsx`
  - `src/app/profile-setup/page.tsx`
- API entrypoints: all `src/app/api/**/route.ts`.
- Scheduled job: `GET /api/cron/weekly-report` (called by Vercel cron).

## 5) Core User Flows

### Scan + Analyze Flow

1. User scans barcode/photo in `src/app/scan/page.tsx`.
2. Barcode lookup hits `GET /api/scan`:
   - cache (`products` table) -> Open Food Facts -> UPC Item DB fallback.
3. Product is analyzed via `POST /api/analyze`:
   - validates payload with Zod.
   - optional user profile personalization.
   - calls Gemini wrapper.
   - optionally caches AI analysis in `products`.
4. If logged in, scan summary is stored through `POST /api/scan-session`.

### Vision/Product-Photo Flow

- `POST /api/scan-vision` and `POST /api/scan-product-photo` extract data from images via Gemini.
- Extracted products may be persisted via `POST /api/products/submit`.

### Meal Logging + Dashboard Flow

1. Scan page sends meal logs to `POST /api/log`.
2. Dashboard page reads profile API + direct Supabase meal logs query.
3. Dashboard widgets call:
   - `/api/streak`
   - `/api/nutrients/summary`
   - `/api/last-scan`

### Email Flow

- New-user sign-in callback triggers `/api/welcome-email`.
- Weekly digest cron aggregates user data and sends emails via Resend.
- Unsubscribe links point to `/api/unsubscribe?userId=...&type=...`.

## 6) Data Model (Inferred from Usage)

The app strongly assumes these tables/columns exist:

- `user_profiles`:
  - identity + profile (`user_id`, `email`, `name`, health fields)
  - preferences (`weekly_report_email`, `email_unsubscribed`, `welcome_email_sent`)
- `products`:
  - barcode/product metadata and nutrition
  - AI fields (`ai_health_rating`, `ai_analysis_json`, `ai_analyzed_at`)
- `food_logs`:
  - per-user meal entries (`quantity_g`, calories/macros, `meal_type`, `logged_at`)
- `scan_sessions`:
  - recent scan snapshots and AI score/rating
- `rate_limits`:
  - request tracking per `user_id` + `action` + timestamp

## 7) Environment Contract

From `.env.local.example` and code usage:

- Auth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, Google OAuth vars.
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- AI: `GEMINI_API_KEY`.
- Email: `RESEND_API_KEY`.
- Cron security: `CRON_SECRET`.
- Analytics: `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

Notes:
- Code also references Open Food Facts contribution credentials (`OFF_USERNAME`, `OFF_PASSWORD`) in product submit/scripting paths, but these are not listed in `.env.local.example`.

## 8) File-by-File Map (Authored Files)

### Root / Config

- `package.json`: scripts + dependency manifest.
- `README.md`: default Next.js boilerplate; not project-specific.
- `.env.local.example`: environment template.
- `.gitignore`: ignore patterns for local/build/env/data outputs.
- `.eslintrc.json`: relaxed rule set (many safety rules disabled).
- `next.config.mjs`: image domains + security headers + standalone output.
- `postcss.config.mjs`: Tailwind PostCSS plugin.
- `tailwind.config.ts`: theme/tailwind scanning config.
- `tsconfig.json`: strict TS with alias config.
- `vercel.json`: weekly cron schedule.
- `vitest.config.ts`: Vitest + jsdom + setup mapping.

### App Pages

- `src/app/layout.tsx`: global metadata/layout/providers/nav.
- `src/app/page.tsx`: redirect to sign-in.
- `src/app/dashboard/page.tsx`: dashboard composition + daily totals.
- `src/app/history/page.tsx`: meal history by date/meal filter.
- `src/app/scan/page.tsx`: main scanner/analyzer orchestration (very large component).
- `src/app/scan-history/page.tsx`: list of previously scanned items.
- `src/app/profile-setup/page.tsx`: profile and email preferences wizard.
- `src/app/auth/signin/page.tsx`: sign-in + guest mode.
- `src/app/privacy/page.tsx`: privacy static page.
- `src/app/terms/page.tsx`: terms static page.
- `src/app/globals.css`: global theme/layout/animation styles.

### API Routes

- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth config + profile upsert + welcome-email trigger.
- `src/app/api/scan/route.ts`: barcode data retrieval with multi-source fallback.
- `src/app/api/analyze/route.ts`: AI nutrition risk analysis pipeline.
- `src/app/api/analyze/analyze.test.ts`: tests for analyze behavior.
- `src/app/api/scan-product-photo/route.ts`: full product extraction from image.
- `src/app/api/scan-vision/route.ts`: label/vision extraction for not-found products.
- `src/app/api/products/submit/route.ts`: persist extracted product + optional OFF sync.
- `src/app/api/profile/route.ts`: profile read/write and metric calculations.
- `src/app/api/profile/email-prefs/route.ts`: save email preference flags.
- `src/app/api/log/route.ts`: create food log entry.
- `src/app/api/log/delete/route.ts`: delete food log entry.
- `src/app/api/scan-session/route.ts`: save/update recent scan records.
- `src/app/api/last-scan/route.ts`: fetch latest scanned item.
- `src/app/api/streak/route.ts`: compute current/longest logging streak.
- `src/app/api/nutrients/summary/route.ts`: weekly nutrient summary and alerts.
- `src/app/api/welcome-email/route.ts`: onboarding email send endpoint.
- `src/app/api/unsubscribe/route.ts`: unsubscribe HTML + preference updates.
- `src/app/api/cron/weekly-report/route.ts`: scheduled weekly nutrition report sender.

### Components

- `src/components/Providers.tsx`: session/query/theme/toast providers.
- `src/components/BottomNav.tsx`: mobile nav with auth-aware links.
- `src/components/ErrorBoundary.tsx`: app-level React boundary.
- `src/components/ServiceWorkerRegister.tsx`: SW registration.
- `src/components/Skeleton.tsx`: loading placeholders.
- `src/components/Analytics.tsx`: GA integration.

Dashboard widgets:
- `src/components/dashboard/CalorieRing.tsx`
- `src/components/dashboard/WeeklyChart.tsx`
- `src/components/dashboard/RecentScans.tsx`
- `src/components/dashboard/MealStreak.tsx`
- `src/components/dashboard/NutrientAlerts.tsx`
- `src/components/dashboard/LastScanned.tsx`

Scanner widgets:
- `src/components/scanner/BarcodeScanner.tsx`
- `src/components/scanner/AnalysisCard.tsx`

### Lib / Types / Test Setup

- `src/lib/supabase.ts`: browser Supabase client.
- `src/lib/supabaseAdmin.ts`: server privileged Supabase client.
- `src/lib/gemini.ts`: Gemini API wrapper + retry/error mapping.
- `src/lib/rateLimit.ts`: DB-backed request limiter.
- `src/lib/analytics.ts`: analytics helper/events.
- `src/types/index.ts`: shared TS domain types.
- `src/test/setup.ts`: test environment setup.

### Scripts / Public Assets

- `scripts/import-off-india.ts`: import OFF dataset file into Supabase.
- `scripts/scrape-indian-products.ts`: scrape + persist products from OFF.
- `public/manifest.json`: PWA metadata.
- `public/sw.js`: service worker cache logic.
- `public/icon.svg`: app icon asset.

## 9) Current Gaps, Risks, and Missing Pieces

### Correctness Risks (High)

- `src/app/history/page.tsx` uses `totalMeals` but never defines it (runtime error risk).
- `src/app/dashboard/page.tsx` imports default exports from files that export named functions (`CalorieRing`, `WeeklyChart`, `RecentScans`) and passes mismatched props to `RecentScans`.

### Security/Trust Risks

- Unsubscribe endpoint uses raw `userId` query params without signed token validation.
- Several routes rely on permissive logging (`console.log`) with potentially sensitive operational context.
- CSP still permits `'unsafe-inline'` and `'unsafe-eval'` scripts.
- Mixed client-side direct DB access vs server API access increases attack surface and inconsistency.

### Reliability/Scalability Risks

- `checkRateLimit` is count-then-insert, which is not atomic (race condition under concurrency).
- Weekly report cron sends emails in serial loop; may hit timeouts as users grow.
- AI JSON parsing is brittle; structured-output safeguards are limited.
- Scan page is monolithic and state-heavy; hard to maintain and test.

### Product/Data Quality Risks

- Health scoring and nutrient thresholds are heavily prompt-based and may drift per model behavior.
- RDA assumptions in nutrient summary are static defaults and not deeply personalized.
- Client can submit nutrient values when logging meals; route validates ranges but not source authenticity.

### Engineering Process Risks

- Very limited tests (primarily analyze route scenarios).
- Lint safeguards are intentionally relaxed (`any`, unused vars, hook deps disabled).
- README lacks project-specific onboarding, architecture, and runbook.

## 10) Optimization Backlog (Priority Order)

1. Fix dashboard/history correctness issues (export/import/prop mismatches and undefined variable).
2. Standardize data access: move user data reads behind server API routes where possible.
3. Replace non-atomic rate limiting with transactional/DB-native strategy.
4. Refactor `src/app/scan/page.tsx` into feature hooks/components (scan, analyze, logging, UI tabs).
5. Add integration tests for critical API routes (`scan`, `log`, `profile`, `cron`, `unsubscribe`).
6. Harden unsubscribe links with signed expiring tokens.
7. Reduce verbose production logs and centralize error logging.
8. Improve README with architecture diagram, env setup, DB schema assumptions, and troubleshooting.
9. Add observability metrics around AI failures, latency, and parse errors.
10. Improve weekly report throughput (batching/parallelism with retry limits).

## 11) Quick Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`

## 12) Reusable Starter Context for New AI Chats

Paste this block at the top of a new chat:

```text
Project: NutriScan (Next.js App Router + TypeScript).
Goal: AI-powered food scanner (barcode/photo), Gemini health analysis, meal logging, dashboard tracking, and weekly email reports.

Key architecture:
- Frontend pages in src/app/*
- API routes in src/app/api/*/route.ts
- Supabase clients in src/lib/supabase.ts and src/lib/supabaseAdmin.ts
- Gemini wrapper in src/lib/gemini.ts

Critical known issues:
- src/app/history/page.tsx references totalMeals without definition.
- src/app/dashboard/page.tsx likely has import/export and prop mismatches with dashboard components.
- Rate limiter in src/lib/rateLimit.ts is non-atomic.
- Unsubscribe endpoint uses userId query params without signed tokens.

When editing:
- Keep auth/session behavior intact.
- Preserve API contracts used by scan page and dashboard widgets.
- Prefer incremental refactors with tests for affected routes/components.

Use PROJECT_CONTEXT_MASTER.md as source of truth for full file map and optimization backlog.
```

## 13) Excluded from Deep Code Reasoning

Generated/vendor artifacts should not be treated as authored project logic:

- `node_modules/`
- `.next/`
- `out/`
- `build/`
- `coverage/`
- `.vercel/`
- generated cache/artifact files (e.g., tsbuildinfo, local exports)

```

## FILE: public/icon.svg

`$lang
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#16a34a"/>
  <text y="75" x="50" text-anchor="middle" font-size="65">ðŸ¥—</text>
</svg>
```

## FILE: public/manifest.json

`$lang
{
  "name": "NutriScan â€” AI Food Health Advisor",
  "short_name": "NutriScan",
  "description": "Scan any packaged food and get an instant AI health rating",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#f0fdf4",
  "theme_color": "#059669",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "maskable any"
    }
  ],
  "categories": ["health", "food", "fitness"]
}
```

## FILE: public/sw.js

`$lang
const CACHE_NAME = 'nutriscan-v1'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/scan',
  '/history',
  '/profile-setup',
]

// Install â€” cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate â€” clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch â€” network-first for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return

  // API calls â€” always try network, fall back to nothing (fail gracefully)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ success: false, error: 'You are offline. Please check your connection and try again.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      })
    )
    return
  }

  // Static assets and pages â€” cache-first, update in background
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      }).catch(() => cached)
      return cached || networkFetch
    })
  )
})
```

## FILE: README.md

`$lang
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
```

## FILE: scripts/import-off-india.ts

`$lang
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import * as fs from 'fs'
import * as readline from 'readline'
import { createClient } from '@supabase/supabase-js'
 
// Load env manually for script context
const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY!
 
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env')
  process.exit(1)
}
 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
 
function parseNum(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null
  const n = parseFloat(val)
  return isNaN(n) ? null : Math.round(n * 10) / 10
}
 
function parseSodium(sodiumVal: string | undefined, saltVal: string | undefined): number | null {
  if (sodiumVal && sodiumVal.trim()) {
    const n = parseFloat(sodiumVal)
    if (!isNaN(n)) return Math.round(n * 1000) // g â†’ mg
  }
  if (saltVal && saltVal.trim()) {
    const s = parseFloat(saltVal)
    if (!isNaN(s)) return Math.round(s * 400) // salt g â†’ sodium mg
  }
  return null
}
 
async function batchUpsert(rows: any[]) {
  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'barcode', ignoreDuplicates: true })
  if (error) console.error('Batch upsert error:', error.message)
}
 
async function main() {
  const CSV_PATH = 'C:/Users/hp/Desktop/nutriscan/off_full.csv'
  if (!fs.existsSync(CSV_PATH)) {
    console.error('off_full.csv not found in project root. Download and extract it first.')
    process.exit(1)
  }
 
  console.log('Starting OFF India import...')
 
  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })
 
  let headers: string[] = []
  let batch: any[]      = []
  let total             = 0
  let imported          = 0
  let lineNum           = 0
  const BATCH_SIZE      = 100
 
  for await (const line of rl) {
    lineNum++
 
    if (lineNum === 1) {
      headers = line.split('\t')
      continue
    }
 
    const cols = line.split('\t')
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = cols[i] || '' })
 
    total++
 
    // Filter: India only
    const countries = (row['countries_en'] || '').toLowerCase()
    const ctags     = (row['countries_tags'] || '').toLowerCase()
    if (!countries.includes('india') && !ctags.includes('en:india')) continue
 
    // Must have a barcode and name
    const barcode = (row['code'] || '').trim()
    const name    = (row['product_name'] || row['product_name_en'] || '').trim()
    if (!barcode || barcode.length < 6 || !name) continue
 
    const product = {
      barcode,
      name,
      brand:             row['brands']              || null,
      category:          row['categories_en']       || null,
      country_of_origin: 'India',
      image_url:         row['image_front_url']     || null,
      calories_per_100g: parseNum(row['energy-kcal_100g'] || row['energy-kcal']),
      protein_per_100g:  parseNum(row['proteins_100g']),
      carbs_per_100g:    parseNum(row['carbohydrates_100g']),
      fat_per_100g:      parseNum(row['fat_100g']),
      sugar_per_100g:    parseNum(row['sugars_100g']),
      sodium_per_100g:   parseSodium(row['sodium_100g'], row['salt_100g']),
      fiber_per_100g:    parseNum(row['fiber_100g']),
      serving_size_g:    parseNum(row['serving_quantity']),
      ingredients_text:  row['ingredients_text'] || null,
      allergens:         row['allergens_tags']
        ? row['allergens_tags'].split(',').map((t: string) => t.replace('en:', '').trim()).filter(Boolean)
        : [],
      additives:         row['additives_tags']
        ? row['additives_tags'].split(',').map((t: string) => t.replace('en:', '').trim()).filter(Boolean)
        : [],
      source: 'open_food_facts',
    }
 
    batch.push(product)
    imported++
 
    if (batch.length >= BATCH_SIZE) {
      await batchUpsert(batch)
      console.log(`Imported ${imported} Indian products so far...`)
      batch = []
      // Small delay to not hammer Supabase
      await new Promise(r => setTimeout(r, 200))
    }
 
    if (lineNum % 100000 === 0) {
      console.log(`Processed ${lineNum.toLocaleString()} total lines, ${imported} Indian products found`)
    }
  }
 
  // Final batch
  if (batch.length > 0) await batchUpsert(batch)
 
  console.log('â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•')
  console.log(`DONE. Total lines: ${total.toLocaleString()}`)
  console.log(`Indian products imported: ${imported.toLocaleString()}`)
  console.log('â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•')
}
 
main().catch(console.error)
```

## FILE: scripts/scrape-indian-products.ts

`$lang
import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' })

import { createClient } from '@supabase/supabase-js'
 
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase     = createClient(SUPABASE_URL, SUPABASE_KEY)
 
// â”€â”€ Top Indian packaged food categories to scrape from OFF â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const INDIAN_CATEGORIES = [
  'chips-and-crisps',
  'biscuits-and-cakes',
  'instant-noodles',
  'breakfast-cereals',
  'chocolates',
  'namkeen',
  'health-drinks',
  'juices',
  'dairy-products',
  'snacks',
  'sweets',
  'sauces-and-condiments',
  'masala-and-spices',
  'instant-foods',
  'energy-drinks',
  'packaged-water',
  'protein-bars',
  'bread',
  'cookies',
  'popcorn',
]
 
function parseNum(val: any): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n * 10) / 10
}
 
function parseSodiumFromOFF(nutriments: any): number | null {
  const sodium = nutriments?.['sodium_100g']
  if (sodium != null) return Math.round(parseFloat(sodium) * 1000)
  const salt = nutriments?.['salt_100g']
  if (salt != null) return Math.round(parseFloat(salt) * 400)
  return null
}
 
// â”€â”€ Fetch products from Open Food Facts API by category + country â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchOFFCategory(category: string, page = 1): Promise<any[]> {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl` +
      `?action=process` +
      `&tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}` +
      `&tagtype_1=countries&tag_contains_1=contains&tag_1=India` +
      `&json=1&page_size=100&page=${page}` +
      `&fields=code,product_name,brands,categories_tags,image_front_url,` +
      `nutriments,ingredients_text,allergens_tags,additives_tags,serving_quantity`
 
    const res = await fetch(url, {
      headers: { 'User-Agent': 'HealthOX/1.0 (healthox@example.com)' },
    })
 
    if (!res.ok) return []
    const data = await res.json()
    return data.products || []
  } catch (e: any) {
    console.log(`OFF fetch error for ${category}:`, e.message)
    return []
  }
}
 
// â”€â”€ Transform OFF product to our DB schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function transformOFFProduct(p: any): any | null {
  const barcode = (p.code || '').trim()
  const name    = (p.product_name || '').trim()
  if (!barcode || barcode.length < 6 || !name) return null
 
  const n = p.nutriments || {}
  return {
    barcode,
    name,
    brand:             p.brands || null,
    category:          p.categories_tags?.[0]?.replace('en:', '') || null,
    country_of_origin: 'India',
    image_url:         p.image_front_url || null,
    calories_per_100g: parseNum(n['energy-kcal_100g'] ?? n['energy-kcal']),
    protein_per_100g:  parseNum(n['proteins_100g']),
    carbs_per_100g:    parseNum(n['carbohydrates_100g']),
    fat_per_100g:      parseNum(n['fat_100g']),
    sugar_per_100g:    parseNum(n['sugars_100g']),
    sodium_per_100g:   parseSodiumFromOFF(n),
    fiber_per_100g:    parseNum(n['fiber_100g']),
    serving_size_g:    parseNum(p.serving_quantity),
    ingredients_text:  p.ingredients_text || null,
    allergens:         (p.allergens_tags || []).map((t: string) => t.replace('en:', '').replace(/-/g, ' ')),
    additives:         (p.additives_tags || []).map((t: string) => t.replace('en:', '')),
    source:            'open_food_facts',
  }
}
 
// â”€â”€ Upsert a batch into Supabase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function upsertBatch(products: any[]) {
  if (!products.length) return
  const { error } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'barcode', ignoreDuplicates: true })
  if (error) console.error('Upsert error:', error.message)
}
 
// â”€â”€ Main scraper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function main() {
  let totalImported = 0
 
  console.log('Starting Indian product scraper...')
  console.log(`Scraping ${INDIAN_CATEGORIES.length} categories from Open Food Facts\n`)
 
  for (const category of INDIAN_CATEGORIES) {
    console.log(`\nâ”€â”€ Category: ${category}`)
    let categoryTotal = 0
 
    for (let page = 1; page <= 5; page++) {
      const products = await fetchOFFCategory(category, page)
      if (!products.length) break
 
      const transformed = products
        .map(transformOFFProduct)
        .filter(Boolean) as any[]
 
      if (transformed.length > 0) {
        await upsertBatch(transformed)
        categoryTotal   += transformed.length
        totalImported   += transformed.length
        console.log(`  Page ${page}: ${transformed.length} products imported (${products.length} fetched)`)
      }
 
      // Polite delay between pages
      await new Promise(r => setTimeout(r, 500))
 
      if (products.length < 100) break
    }
 
    console.log(`  Total for ${category}: ${categoryTotal}`)
    // Delay between categories
    await new Promise(r => setTimeout(r, 1000))
  }
 
  console.log('\nâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•')
  console.log(`SCRAPING COMPLETE`)
  console.log(`Total products imported: ${totalImported.toLocaleString()}`)
  console.log('â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•')
  console.log('\nNext step: Run the OFF bulk import for even more coverage.')
  console.log('Download: https://world.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz')
}
 
main().catch(console.error)
```

## FILE: src/app/api/analyze/analyze.test.ts

`$lang
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
    }),
  },
}))

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 19, resetIn: 60 }),
}))

vi.mock('@/lib/gemini', () => ({
  callGemini: vi.fn().mockResolvedValue({
    text: JSON.stringify({
      health_rating: 'moderate',
      health_score: 5.5,
      health_score_breakdown: {
        nutrition_score: 6,
        ingredient_safety_score: 5,
        processing_score: 5.5,
        overall: 5.5,
      },
      summary: 'This product is moderately healthy.',
      detailed_breakdown: {},
      safe_consumption: { amount: '1 pack', frequency: 'Occasionally', notes: null, personalized_for_user: null },
      harmful_ingredients: [],
      ingredient_warnings: [],
      positives: [],
      long_term_risks: [],
      healthier_alternatives: [],
      fssai_compliance: 'compliant',
      diabetic_suitability: 'consume_with_caution',
      bp_suitability: 'suitable',
      child_suitability: 'consume_with_caution',
      pregnancy_suitability: 'suitable',
    }),
    usage: { inputTokens: 500, outputTokens: 800 },
  }),
  GeminiError: class extends Error {
    constructor(public type: string, message: string) {
      super(message)
      this.name = 'GeminiError'
    }
  },
}))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
}))

describe('Analyze API â€” Schema Validation', () => {
  it('accepts valid product with all required fields', () => {
    const validProduct = {
      barcode: '8901234567890',
      name: 'Parle-G Biscuits',
      brand: 'Parle',
      nutrition: {
        calories: 450,
        protein: 6,
        carbs: 70,
        fat: 15,
        sugar: 25,
        sodium: 400,
        fiber: 2,
      },
    }
    expect(validProduct.name).toBeTruthy()
    expect(validProduct.nutrition.calories).toBeGreaterThanOrEqual(0)
  })

  it('handles null optional fields (nullâ†’undefined normalization)', () => {
    const productFromScan = {
      barcode: '8901234567890',
      name: 'Test Product',
      brand: null,
      category: null,
      image_url: null,
      nutrition: { calories: 100, protein: 5, carbs: 20, fat: 3 },
      ingredients_text: null,
      allergens: [],
      additives: [],
    }
    const normalized = {
      ...productFromScan,
      brand: productFromScan.brand ?? undefined,
      category: productFromScan.category ?? undefined,
      image_url: productFromScan.image_url ?? undefined,
      ingredients_text: productFromScan.ingredients_text ?? undefined,
      allergens: productFromScan.allergens ?? undefined,
      additives: productFromScan.additives ?? undefined,
    }
    expect(normalized.brand).toBeUndefined()
    expect(normalized.ingredients_text).toBeUndefined()
  })

  it('rejects negative calories', () => {
    const invalidProduct = {
      name: 'Test',
      nutrition: { calories: -5, protein: 0, carbs: 0, fat: 0 },
    }
    expect(invalidProduct.nutrition.calories).toBeLessThan(0)
  })
})

describe('Analyze API â€” Rate Limiting', () => {
  it('allows request when under rate limit', async () => {
    const { checkRateLimit } = await import('@/lib/rateLimit')
    const result = await checkRateLimit('user-123', 'analyze')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBeGreaterThan(0)
  })
})

describe('Analyze API â€” Gemini Response Parsing', () => {
  it('parses valid Gemini JSON response', () => {
    const geminiOutput = JSON.stringify({
      health_rating: 'unhealthy',
      health_score: 2.8,
      health_score_breakdown: {
        nutrition_score: 3,
        ingredient_safety_score: 2,
        processing_score: 3,
        overall: 2.8,
      },
      summary: 'This product is very unhealthy.',
      detailed_breakdown: { calories: 'high', protein: 'low', sugar: 'high', sodium: 'high', fat: 'high', fiber: 'not listed' },
      safe_consumption: { amount: 'Avoid', frequency: 'Never', notes: null, personalized_for_user: null },
      harmful_ingredients: [],
      ingredient_warnings: [],
      positives: [],
      long_term_risks: ['High sugar increases type 2 diabetes risk'],
      healthier_alternatives: [],
      fssai_compliance: 'concern',
      diabetic_suitability: 'avoid',
      bp_suitability: 'avoid',
      child_suitability: 'avoid',
      pregnancy_suitability: 'avoid',
    })
    const parsed = JSON.parse(geminiOutput)
    expect(parsed.health_score).toBe(2.8)
    expect(parsed.health_rating).toBe('unhealthy')
    expect(parsed.long_term_risks).toHaveLength(1)
  })

  it('strips markdown code fences from Gemini output', () => {
    const rawOutput = '```json\n{"health_score": 5.0}\n```'
    const cleaned = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    expect(parsed.health_score).toBe(5.0)
  })

  it('handles empty harmful_ingredients array gracefully', () => {
    const response = {
      health_rating: 'healthy',
      health_score: 8.5,
      harmful_ingredients: [],
    }
    expect(response.harmful_ingredients.length).toBe(0)
  })
})
```

## FILE: src/app/api/analyze/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'
import { callGemini, GeminiError } from '@/lib/gemini'
 
const ProductSchema = z.object({
  barcode: z.string().optional(),
  name: z.string().min(1),
  brand: z.string().optional(),
  category: z.string().optional(),
  country_of_origin: z.string().optional(),
  image_url: z.string().optional(),
  nutrition: z.object({
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    sugar: z.number().optional(),
    sodium: z.number().optional(),
    fiber: z.number().optional(),
  }),
  ingredients_text: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  additives: z.array(z.string()).optional(),
})
 
const RequestSchema = z.object({
  product: ProductSchema,
  userProfile: z.object({
    age: z.number().optional(),
    bmi: z.number().optional(),
    weight_goal: z.string().optional(),
    is_diabetic: z.boolean().optional(),
    has_bp: z.boolean().optional(),
    is_vegetarian: z.boolean().optional(),
    gender: z.string().optional(),
  }).optional(),
})
 
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId
 
    const rateLimitKey = userId || req.headers.get('x-forwarded-for') || 'anonymous'
    const rateCheck = await checkRateLimit(rateLimitKey, 'analyze')
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Analysis limit reached. Please wait ${rateCheck.resetIn} minutes.`, rateLimited: true },
        { status: 429 }
      )
    }
 
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid product data: ' + parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      )
    }
 
    const { product, userProfile } = parsed.data
 
    const normalizedProduct = {
      ...product,
      brand: product.brand ?? undefined,
      category: product.category ?? undefined,
      country_of_origin: product.country_of_origin ?? undefined,
      image_url: product.image_url ?? undefined,
      ingredients_text: product.ingredients_text ?? undefined,
      allergens: product.allergens ?? undefined,
      additives: product.additives ?? undefined,
    }
 
    let profile = userProfile
    if (userId && !profile) {
      const { data: dbProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('age, weight_kg, height_cm, weight_goal, is_diabetic, has_bp, is_vegetarian, gender, daily_calorie_goal')
        .eq('user_id', userId)
        .single()
      if (dbProfile) {
        let bmi = null
        if (dbProfile.weight_kg && dbProfile.height_cm) {
          const h = dbProfile.height_cm / 100
          bmi = parseFloat((dbProfile.weight_kg / (h * h)).toFixed(1))
        }
        profile = {
          age: dbProfile.age || undefined,
          bmi: bmi || undefined,
          weight_goal: dbProfile.weight_goal || undefined,
          is_diabetic: dbProfile.is_diabetic || false,
          has_bp: dbProfile.has_bp || false,
          is_vegetarian: dbProfile.is_vegetarian || false,
          gender: dbProfile.gender || undefined,
        }
      }
    }
 
    if (product.barcode && !profile) {
      const { data: cached } = await supabaseAdmin
        .from('products')
        .select('ai_analysis_json, ai_analyzed_at')
        .eq('barcode', product.barcode)
        .single()
      if (cached?.ai_analysis_json && cached?.ai_analyzed_at) {
        const age = Date.now() - new Date(cached.ai_analyzed_at).getTime()
        if (age < 7 * 24 * 60 * 60 * 1000) {
          console.log('Returning cached AI analysis for:', product.name)
          return NextResponse.json({ success: true, data: cached.ai_analysis_json, cached: true })
        }
      }
    }
 
    const prompt = buildPrompt(normalizedProduct, profile)
    console.log('Calling Gemini AI for:', product.name)
 
    const { text, usage } = await callGemini(prompt, undefined, { maxTokens: 12000 })
 
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
    let analysis
    try {
      analysis = JSON.parse(cleaned)
    } catch {
      console.error('JSON parse failed. Raw:', cleaned.slice(0, 500))
      return NextResponse.json(
        { success: false, error: 'AI returned invalid format. Please try again.' },
        { status: 500 }
      )
    }
 
    analysis.analyzed_at = new Date().toISOString()
    analysis.personalized = !!profile
    console.log(`Analysis done: ${product.name} â†’ ${analysis.health_rating} (${analysis.health_score}/10) | Tokens: ${usage.inputTokens}in/${usage.outputTokens}out`)
 
    if (product.barcode && !profile) {
      await supabaseAdmin
        .from('products')
        .update({
          ai_health_rating: analysis.health_rating,
          ai_analysis_json: analysis,
          ai_analyzed_at:   analysis.analyzed_at,
        })
        .eq('barcode', product.barcode)
    }
 
    return NextResponse.json({ success: true, data: analysis, cached: false })
 
  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`GeminiError [${err.type}]:`, err.message)
      switch (err.type) {
        case 'rate_limit': return NextResponse.json({ success: false, error: 'AI service is busy. Please wait a moment and try again.', rateLimited: true }, { status: 429 })
        case 'timeout':    return NextResponse.json({ success: false, error: 'AI analysis timed out. Please try again.' }, { status: 504 })
        case 'network':    return NextResponse.json({ success: false, error: 'Network error connecting to AI. Please try again.' }, { status: 502 })
        default:           return NextResponse.json({ success: false, error: 'AI service temporarily unavailable.' }, { status: 500 })
      }
    }
    console.error('Analyze error:', err.message)
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
 
function buildPrompt(product: any, userProfile?: any): string {
  const n = product.nutrition || {}
  const cal     = n.calories ?? 0
  const protein = n.protein  ?? 0
  const carbs   = n.carbs    ?? 0
  const fat     = n.fat      ?? 0
  const sugar   = n.sugar    ?? null
  const sodium  = n.sodium   ?? null
  const fiber   = n.fiber    ?? null
 
  const ingredients = product.ingredients_text || 'Not provided'
  const additives   = (product.additives || []).join(', ') || 'None listed'
  const allergens   = (product.allergens || []).join(', ') || 'None listed'
 
  const userSection = userProfile ? `
â•â•â• USER HEALTH PROFILE â•â•â•
Age: ${userProfile.age || 'Unknown'}
BMI: ${userProfile.bmi || 'Unknown'} ${userProfile.bmi ? (userProfile.bmi < 18.5 ? '(Underweight)' : userProfile.bmi < 25 ? '(Normal)' : userProfile.bmi < 30 ? '(Overweight)' : '(Obese)') : ''}
Gender: ${userProfile.gender || 'Unknown'}
Weight Goal: ${userProfile.weight_goal || 'maintain'}
Diabetic: ${userProfile.is_diabetic ? 'YES â€” flag sugar/carb concerns prominently' : 'No'}
High Blood Pressure: ${userProfile.has_bp ? 'YES â€” flag sodium concerns prominently' : 'No'}
Vegetarian: ${userProfile.is_vegetarian ? 'YES' : 'No'}
Calculate ALL safe consumption limits specific to this person's age, BMI, and health conditions.
` : `
â•â•â• USER PROFILE â•â•â•
No profile â€” provide general limits for an average Indian adult.
`
 
  return `You are Dr. Neha Sharma, a certified Indian nutritionist and food safety expert. Analyse this packaged food product for an Indian consumer using FSSAI, WHO, ICMR, and international food safety guidelines.
 
${userSection}
 
â•â•â• PRODUCT â•â•â•
Name: ${product.name}
Brand: ${product.brand || 'Unknown'}
Category: ${product.category || 'Packaged food'}
Country: ${product.country_of_origin || 'India'}
 
â•â•â• NUTRITION (per 100g) â•â•â•
Calories:  ${cal}     kcal ${cal > 450 ? 'âš  HIGH'    : cal < 200 ? 'âœ“ LOW' : ''}
Protein:   ${protein} g    ${protein > 15 ? 'âœ“ GOOD' : protein < 3 ? 'âš  LOW' : ''}
Carbs:     ${carbs}   g
Sugar:     ${sugar  !== null ? sugar  + 'g ' + (sugar  > 15 ? 'âš  HIGH' : sugar < 5 ? 'âœ“ LOW' : '')         : 'Not listed'}
Fat:       ${fat}     g    ${fat > 25 ? 'âš  HIGH' : ''}
Sodium:    ${sodium !== null ? sodium + 'mg ' + (sodium > 500 ? 'âš  HIGH' : sodium < 120 ? 'âœ“ LOW' : '')     : 'Not listed'}
Fiber:     ${fiber  !== null ? fiber  + 'g ' + (fiber  > 5  ? 'âœ“ GOOD' : '')                                : 'Not listed'}
 
â•â•â• INGREDIENTS â•â•â•
${ingredients}
 
â•â•â• ADDITIVES â•â•â•
${additives}
 
â•â•â• ALLERGENS â•â•â•
${allergens}
 
â•â•â• SCORING RULES â€” FOLLOW EXACTLY â•â•â•
8.5â€“10  â†’ Plain nuts/seeds/oats/dal/legumes/plain milk, minimal processing, protein>15g AND sugar<5g AND sodium<200mg
7.0â€“8.4 â†’ Multi-grain, roasted snacks with good ingredients, good protein + low sugar + low sodium
5.5â€“6.9 â†’ One concern but otherwise decent
4.0â€“5.4 â†’ Multiple concerns OR artificial additives OR high sodium/sugar
2.5â€“3.9 â†’ Sugar>25g OR sodium>800mg OR trans fats OR multiple harmful additives
1.0â€“2.4 â†’ Nutritionally empty AND harmful additives
 
MANDATORY OVERRIDES:
- Chips/namkeen/fried snacks with sodium>800mg per 100g â†’ score MUST be 2.5â€“4.0
- Any trans fat present â†’ score CANNOT exceed 4.0
- Sugar>20g per 100g â†’ score CANNOT exceed 5.0
- Instant noodles/cream biscuits â†’ score MUST be 2.5â€“4.0
 
â•â•â• HARMFUL SUBSTANCES â€” CHECK EVERY ONE â•â•â•
Flag if ACTUALLY present in the ingredients text:
- MSG/E621 â†’ WHO/FSSAI â€” excitotoxin, headaches
- TBHQ/E319 â†’ National Toxicology Program â€” cancer risk (animal studies)
- BHA/E320 â†’ IARC Group 2B â€” endocrine disruptor
- BHT/E321 â†’ EFSA â€” possible carcinogen
- Sodium Benzoate/E211 â†’ WHO â€” forms benzene with Vitamin C
- Carrageenan/E407 â†’ gut inflammation
- Sodium Nitrite/E250 â†’ IARC Group 1 carcinogen
- Tartrazine/E102 â†’ EFSA 2009 â€” hyperactivity in children
- Sunset Yellow/E110 â†’ EFSA â€” hyperactivity, allergic reactions
- HFCS â€” obesity, insulin resistance, fatty liver
- Trans fat/Partially Hydrogenated Oils â†’ WHO â€” heart disease
- Potassium Bromate/E924 â†’ IARC Group 2B
- Aspartame/E951 â†’ IARC 2023 Group 2B
- Maida/Refined Wheat Flour â†’ ICMR â€” high glycaemic index
- High sodium (>400mg/100g) â€” cardiovascular risk
- High sugar (>10g/100g) â€” diabetes, obesity risk
 
â•â•â• REQUIRED OUTPUT â€” RAW JSON ONLY, NO MARKDOWN â•â•â•
{
  "health_rating": "healthy" or "moderate" or "unhealthy",
  "health_score": <decimal 1.0â€“10.0 following rules above>,
  "health_score_breakdown": {
    "nutrition_score": <1â€“10>,
    "ingredient_safety_score": <1â€“10>,
    "processing_score": <1â€“10, 10=minimal processing>,
    "overall": <weighted average>
  },
  "summary": "<2â€“3 sentences about THIS specific product for Indian consumer. MUST name the product.>",
  "detailed_breakdown": {
    "calories": "<specific comment>",
    "protein": "<specific comment>",
    "sugar": "<specific comment>",
    "sodium": "<specific comment>",
    "fat": "<specific comment>",
    "fiber": "<specific comment>",
    "processing_level": "minimally_processed or moderately_processed or ultra_processed",
    "overall_nutrient_density": "high or medium or low"
  },
  "safe_consumption": {
    "amount": "<specific amount e.g. '15â€“20g (about 10 chips)'>",
    "frequency": "<specific e.g. 'Once a week maximum'>",
    "notes": "<general note for Indian adults>",
    "personalized_for_user": "<advice specific to this user's profile, or null>"
  },
  "harmful_ingredients": [
    {
      "name": "<exact name from label>",
      "also_known_as": ["<other names>"],
      "found_in_product": true,
      "concern": "<specific health concern backed by science, 1â€“2 sentences>",
      "severity": "high or medium or low",
      "scientific_source": "<organisation or study>",
      "source_url": "<real URL to health authority>",
      "global_safe_limit": "<e.g. WHO: max 2000mg sodium/day for adults>",
      "amount_in_this_product": "<e.g. 826mg sodium per 100g>",
      "personalized_safe_limit": "<limit specific to this user's age and BMI>",
      "percentage_of_daily_limit": "<e.g. 41% of daily sodium limit per 100g>"
    }
  ],
  "ingredient_warnings": [
    { "ingredient": "<name>", "concern": "<concern>", "severity": "high or medium or low" }
  ],
  "long_term_risks": [
    "<Evidence-based health consequence of eating THIS product regularly. Be specific to its actual ingredients and nutrition. Minimum 3, maximum 5. Example: 'The 826mg sodium per 100g â€” 41% of the daily WHO limit in a single small pack â€” significantly elevates blood pressure and cardiovascular disease risk with regular consumption, especially for Indians who already consume excess sodium in their diet.'>"
  ],
  "positives": ["<specific positive about this product, or empty array []>"],
  "healthier_alternatives": [
    {
      "name": "<specific product/food available in Indian markets>",
      "reason": "<specific reason why it is healthier>",
      "availability": "widely_available or supermarket or homemade",
      "type": "branded or homemade or whole_food"
    }
  ],
  "fssai_compliance": "compliant or concern or unknown",
  "diabetic_suitability": "suitable or consume_with_caution or avoid",
  "bp_suitability": "suitable or consume_with_caution or avoid",
  "child_suitability": "suitable or consume_with_caution or avoid",
  "pregnancy_suitability": "suitable or consume_with_caution or avoid"
}
 
ABSOLUTE RULES:
1. Return ONLY raw JSON â€” no backticks, no markdown, no "here is the analysis"
2. long_term_risks MUST have 3â€“5 SPECIFIC risks tied to THIS product's actual data
3. harmful_ingredients MUST only list substances ACTUALLY in this product's ingredients
4. healthier_alternatives MUST have 4â€“5 options available in India
5. health_score MUST follow the mandatory overrides above
6. summary MUST mention the product name`
}
```

## FILE: src/app/api/auth/[...nextauth]/route.ts

`$lang
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false

        const { data: existing } = await supabaseAdmin
          .from('user_profiles')
          .select('user_id, welcome_email_sent')
          .eq('user_id', user.id)
          .single()

        const isNewUser = !existing

        const { error } = await supabaseAdmin
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            email: user.email,
            name: user.name,
            avatar_url: user.image,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })

        if (error) {
          console.error('Supabase upsert error:', error.message)
          return false
        }

        if (isNewUser) {
          console.log('New user â€” sending welcome email to:', user.email)
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          fetch(`${baseUrl}/api/welcome-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              email: user.email,
              name: user.name,
            })
          }).catch(err => console.log('Welcome email trigger error:', err.message))
        }

        return true
      } catch (err) {
        console.error('SignIn error:', err)
        return false
      }
    },

    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.userId = token.sub ?? ""
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
}
```

## FILE: src/app/api/cron/weekly-report/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { buildUnsubscribeUrls } from '@/lib/tokens'

export async function GET(req: NextRequest) {
  // Security â€” only Vercel cron can call this
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('Unauthorized cron attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('ðŸ• Running weekly report cron job...')

  // Get ALL users who want weekly reports and have NOT unsubscribed
  // Also handle users who have null values (newly created profiles)
  const { data: users, error: usersError } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, email, name, weekly_report_email, email_unsubscribed')
    .neq('email', null)
    .or('weekly_report_email.is.null,weekly_report_email.eq.true')
    .not('email_unsubscribed', 'eq', true)

  if (usersError) {
    console.log('Error fetching users:', usersError.message)
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }

  if (!users || users.length === 0) {
    console.log('No users to send weekly reports to')
    return NextResponse.json({ message: 'No users opted in' })
  }

  console.log(`ðŸ“§ Sending weekly reports to ${users.length} users`)

  const results = []
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  for (const user of users) {
    try {
      // Skip if no email
      if (!user.email) {
        console.log('Skipping user with no email:', user.user_id)
        continue
      }

      // Get this week's food logs
      const { data: logs } = await supabaseAdmin
        .from('food_logs')
        .select('*')
        .eq('user_id', user.user_id)
        .gte('logged_at', weekAgo.toISOString())

      if (!logs || logs.length === 0) {
        console.log('No logs this week for:', user.email)
        continue
      }

      // Get worst products scanned this week
      const { data: worstProducts } = await supabaseAdmin
        .from('scan_sessions')
        .select('product_name, ai_health_rating, ai_health_score')
        .eq('user_id', user.user_id)
        .eq('ai_health_rating', 'unhealthy')
        .gte('scanned_at', weekAgo.toISOString())
        .order('ai_health_score', { ascending: true })
        .limit(3)

      // Calculate stats
      const totalCalories = Math.round(logs.reduce((s, l) => s + (l.calories || 0), 0))
      const avgDaily = Math.round(totalCalories / 7)
      const totalProtein = Math.round(logs.reduce((s, l) => s + (l.protein_g || 0), 0))
      const totalCarbs = Math.round(logs.reduce((s, l) => s + (l.carbs_g || 0), 0))
      const totalFat = Math.round(logs.reduce((s, l) => s + (l.fat_g || 0), 0))
      const daysLogged = new Set(logs.map((l: any) => l.logged_at.split('T')[0])).size
      const firstName = user.name?.split(' ')[0] || 'there'

      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

      // âœ… Token-based unsubscribe URLs (no plain userId in query string)
      const { weeklyUrl: unsubscribeWeeklyUrl, allUrl: unsubscribeAllUrl } = buildUnsubscribeUrls(user.user_id, baseUrl)

      const html = buildWeeklyHTML({
        firstName,
        totalCalories,
        avgDaily,
        totalProtein,
        totalCarbs,
        totalFat,
        daysLogged,
        totalMeals: logs.length,
        worstProducts: worstProducts || [],
        unsubscribeWeeklyUrl,
        unsubscribeAllUrl,
        baseUrl,
      })

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'HealthOX <onboarding@resend.dev>',
          to: [user.email],
          subject: `${firstName}, here is your weekly HealthOX nutrition report ðŸ“Š`,
          html,
        })
      })

      const resData = await res.json()

      if (res.ok) {
        console.log('âœ… Weekly report sent to:', user.email)
        results.push({ email: user.email, status: 'sent', messageId: resData.id })
      } else {
        console.log('âŒ Failed for:', user.email, JSON.stringify(resData))
        results.push({ email: user.email, status: 'failed', error: resData })
      }

    } catch (err: any) {
      console.log('âŒ Exception for:', user.email, err.message)
      results.push({ email: user.email, status: 'error', error: err.message })
    }
  }

  const sent = results.filter(r => r.status === 'sent').length
  const failed = results.filter(r => r.status !== 'sent').length

  console.log(`âœ… Weekly report done: ${sent} sent, ${failed} failed`)
  return NextResponse.json({ success: true, sent, failed, results })
}

function buildWeeklyHTML(data: {
  firstName: string
  totalCalories: number
  avgDaily: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  daysLogged: number
  totalMeals: number
  worstProducts: any[]
  unsubscribeWeeklyUrl: string
  unsubscribeAllUrl: string
  baseUrl: string
}): string {

  const calorieStatus = data.avgDaily < 1400
    ? { label: 'Below target', color: '#3b82f6', icon: 'ðŸ“‰', advice: 'Try to eat a bit more to reach your daily calorie goal and maintain energy levels.' }
    : data.avgDaily > 2800
    ? { label: 'Above target', color: '#dc2626', icon: 'ðŸ“ˆ', advice: 'Consider reducing portion sizes or switching high-calorie snacks for healthier options.' }
    : { label: 'On track', color: '#059669', icon: 'âœ…', advice: 'Excellent work keeping your calories in a healthy range this week!' }

  const totalMacros = data.totalProtein + data.totalCarbs + data.totalFat

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HealthOX Weekly Report</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,#059669,#0ea5e9);margin-bottom:12px;box-shadow:0 6px 20px rgba(5,150,105,0.3);">
      <span style="font-size:30px;">ðŸ¥—</span>
    </div>
    <h1 style="font-size:28px;font-weight:900;margin:0 0 4px;background:linear-gradient(135deg,#059669,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">HealthOX</h1>
    <p style="font-size:13px;color:#6b7280;margin:0;">Weekly Nutrition Report</p>
  </div>

  <!-- Main Card -->
  <div style="background:white;border-radius:24px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.06);margin-bottom:16px;">

    <h2 style="font-size:24px;font-weight:900;color:#111827;margin:0 0 4px;">
      Hey ${data.firstName}! ðŸ‘‹
    </h2>
    <p style="font-size:14px;color:#6b7280;margin:0 0 28px;">
      Here is how your nutrition looked this past week.
    </p>

    <!-- Status Banner -->
    <div style="padding:16px 20px;border-radius:14px;background:${calorieStatus.color}15;border:1px solid ${calorieStatus.color}30;margin-bottom:24px;display:flex;align-items:flex-start;gap:14px;">
      <div style="width:40px;height:40px;border-radius:10px;background:${calorieStatus.color};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">
        ${calorieStatus.icon}
      </div>
      <div>
        <p style="font-size:14px;font-weight:800;color:${calorieStatus.color};margin:0 0 4px;">${calorieStatus.label}</p>
        <p style="font-size:13px;color:#6b7280;margin:0;line-height:1.5;">${calorieStatus.advice}</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
      ${[
        { label: 'Total Calories', value: data.totalCalories.toLocaleString(), unit: 'kcal this week', color: '#059669' },
        { label: 'Daily Average', value: data.avgDaily.toLocaleString(), unit: 'kcal per day', color: '#0ea5e9' },
        { label: 'Days Logged', value: `${data.daysLogged}/7`, unit: 'days this week', color: '#8b5cf6' },
        { label: 'Total Meals', value: data.totalMeals.toString(), unit: 'meals logged', color: '#f59e0b' },
      ].map(s => `
        <div style="padding:16px;background:#f9fafb;border-radius:14px;text-align:center;border:1px solid #f3f4f6;">
          <p style="font-size:24px;font-weight:900;color:${s.color};margin:0 0 2px;">${s.value}</p>
          <p style="font-size:11px;color:#9ca3af;margin:0 0 2px;">${s.unit}</p>
          <p style="font-size:11px;font-weight:600;color:#374151;margin:0;">${s.label}</p>
        </div>
      `).join('')}
    </div>

    <!-- Macros -->
    <h3 style="font-size:15px;font-weight:800;color:#111827;margin:0 0 14px;">ðŸ¥© Weekly Macros Breakdown</h3>

    ${[
      { label: 'Protein', value: data.totalProtein, color: '#059669' },
      { label: 'Carbohydrates', value: data.totalCarbs, color: '#0ea5e9' },
      { label: 'Fat', value: data.totalFat, color: '#f59e0b' },
    ].map(m => {
      const pct = totalMacros > 0 ? Math.round((m.value / totalMacros) * 100) : 0
      return `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-size:13px;color:#374151;font-weight:600;">${m.label}</span>
            <span style="font-size:13px;font-weight:800;color:${m.color};">${m.value}g Â· ${pct}%</span>
          </div>
          <div style="height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:${m.color};border-radius:4px;transition:width 0.5s;"></div>
          </div>
        </div>
      `
    }).join('')}

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:24px 0;"></div>

    <!-- Worst products section -->
    ${data.worstProducts && data.worstProducts.length > 0 ? `
      <h3 style="font-size:15px;font-weight:800;color:#111827;margin:0 0 6px;">âš ï¸ Watch out for these</h3>
      <p style="font-size:13px;color:#6b7280;margin:0 0 14px;">These products you scanned this week scored poorly on health:</p>
      ${data.worstProducts.map((p: any) => `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fef2f2;border-radius:12px;margin-bottom:8px;border:1px solid #fecaca;">
          <span style="font-size:20px;flex-shrink:0;">âŒ</span>
          <div style="flex:1;">
            <p style="font-size:13px;font-weight:700;color:#111827;margin:0 0 2px;">${p.product_name}</p>
            <p style="font-size:12px;color:#dc2626;margin:0;">Health score: ${p.ai_health_score}/10</p>
          </div>
        </div>
      `).join('')}
      <div style="padding:14px;background:#f0fdf4;border-radius:12px;margin:12px 0 24px;border:1px solid #bbf7d0;">
        <p style="font-size:13px;font-weight:700;color:#059669;margin:0 0 6px;">ðŸ’š Healthier swaps to try</p>
        <p style="font-size:12px;color:#374151;margin:0;line-height:1.7;">
          Instead of packaged snacks try roasted chana, makhana, fox nuts, fresh fruit, or
          homemade snacks this week. Small swaps make a big difference over time!
        </p>
      </div>
      <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:0 0 24px;"></div>
    ` : ''}

    <!-- Encouragement message -->
    <div style="background:linear-gradient(135deg,rgba(5,150,105,0.06),rgba(14,165,233,0.04));border-radius:14px;padding:18px;margin-bottom:28px;border:1px solid rgba(5,150,105,0.15);">
      <p style="font-size:14px;color:#374151;line-height:1.8;margin:0;">
        ${data.daysLogged >= 5
          ? `ðŸ”¥ Amazing consistency ${data.firstName}! You logged <strong>${data.daysLogged} out of 7 days</strong> this week. That kind of dedication is what creates lasting healthy habits. Keep it up!`
          : data.daysLogged >= 3
          ? `ðŸ‘ Good progress ${data.firstName}! You logged <strong>${data.daysLogged} days</strong> this week. Try to aim for 5+ days next week â€” consistency is the key to lasting change.`
          : `ðŸŒ± Every journey starts somewhere, ${data.firstName}. You logged <strong>${data.daysLogged} day${data.daysLogged !== 1 ? 's' : ''}</strong> this week. Try scanning every meal next week â€” awareness alone can transform your health!`
        }
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${data.baseUrl}/scan"
        style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#059669,#0ea5e9);color:white;text-decoration:none;border-radius:14px;font-size:14px;font-weight:800;box-shadow:0 8px 20px rgba(5,150,105,0.3);">
        Scan This Week's Meals â†’
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:white;border-radius:20px;padding:20px 24px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
    <p style="font-size:13px;color:#374151;font-weight:600;margin:0 0 4px;">Made with ðŸ’š for a healthier India</p>
    <p style="font-size:12px;color:#9ca3af;margin:0 0 16px;">HealthOX â€” AI-Powered Food Health Advisor</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
      <a href="${data.unsubscribeWeeklyUrl}" style="font-size:11px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from weekly reports
      </a>
      <span style="color:#d1d5db;font-size:11px;">Â·</span>
      <a href="${data.unsubscribeAllUrl}" style="font-size:11px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from all emails
      </a>
    </div>
  </div>

</div>
</body>
</html>
  `
}
```

## FILE: src/app/api/dashboard/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [profileRes, logsRes] = await Promise.all([
      supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single(),
      supabaseAdmin
        .from('food_logs')
        .select('calories, protein_g, carbs_g, fat_g')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString()),
    ])

    const profile = profileRes.data
    const logs = logsRes.data || []

    const totals = logs.reduce(
      (acc: any, l: any) => ({
        calories: acc.calories + (l.calories || 0),
        protein: acc.protein + (l.protein_g || 0),
        carbs: acc.carbs + (l.carbs_g || 0),
        fat: acc.fat + (l.fat_g || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )

    return NextResponse.json({
      success: true,
      data: {
        totalCalories: Math.round(totals.calories),
        totalProtein: Math.round(totals.protein),
        totalCarbs: Math.round(totals.carbs),
        totalFat: Math.round(totals.fat),
        dailyCalorieGoal: profile?.daily_calorie_goal || 2000,
        mealCount: logs.length,
        profile,
      },
    })
  } catch (err: any) {
    console.error('Dashboard API error:', err.message)
    return NextResponse.json({ success: false, error: 'Failed to load dashboard' }, { status: 500 })
  }
}
```

## FILE: src/app/api/last-scan/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
 
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
 
  const { data } = await supabaseAdmin
    .from('scan_sessions')
    .select('product_name, product_image, ai_health_rating, ai_health_score, scanned_at')
    .eq('user_id', userId)
    .order('scanned_at', { ascending: false })
    .limit(1)
    .single()
 
  return NextResponse.json({ success: true, data: data || null })
}
```

## FILE: src/app/api/log/delete/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await req.json()

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'No log ID provided' },
      { status: 400 }
    )
  }

  // Make sure the log belongs to this user before deleting
  const { error } = await supabaseAdmin
    .from('food_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.log('Delete error:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }

  console.log('Log deleted:', id)
  return NextResponse.json({ success: true })
}
```

## FILE: src/app/api/log/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'

const LogSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  barcode: z.string().optional(),
  quantity_g: z.number().min(1, 'Quantity must be at least 1g').max(5000, 'Quantity seems too high'),
  calories_per_100g: z.number().min(0).max(10000),
  protein_per_100g: z.number().min(0).max(1000),
  carbs_per_100g: z.number().min(0).max(1000),
  fat_per_100g: z.number().min(0).max(1000),
  sodium_per_100g: z.number().min(0).max(100000).optional(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'You must be signed in to log meals' },
        { status: 401 }
      )
    }

    // Rate limit
    const rateCheck = await checkRateLimit(userId, 'log')
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please slow down.' },
        { status: 429 }
      )
    }

    // Validate body
    const body = await req.json()
    const parsed = LogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues.map(i => i.message).join(', ')
        },
        { status: 400 }
      )
    }

    const data = parsed.data
    const qty = data.quantity_g / 100

    const { data: log, error } = await supabaseAdmin
      .from('food_logs')
      .insert({
        user_id: userId,
        product_name: data.product_name,
        barcode: data.barcode,
        quantity_g: data.quantity_g,
        calories: +(data.calories_per_100g * qty).toFixed(1),
        protein_g: +(data.protein_per_100g * qty).toFixed(1),
        carbs_g: +(data.carbs_per_100g * qty).toFixed(1),
        fat_g: +(data.fat_per_100g * qty).toFixed(1),
        sodium_mg: data.sodium_per_100g
          ? +(data.sodium_per_100g * qty).toFixed(1)
          : null,
        meal_type: data.meal_type,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.log('Log error:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('Meal logged:', data.product_name, data.quantity_g + 'g')
    return NextResponse.json({ success: true, data: log })

  } catch (err: any) {
    console.error('Log route error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
```

## FILE: src/app/api/nutrients/summary/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
 
const RDA = { calories: 2000, protein: 50, carbs: 300, fat: 65, sodium: 2000 }
 
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
 
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
 
    const [logsResult, profileResult] = await Promise.all([
      supabaseAdmin
        .from('food_logs')
        .select('calories, protein_g, carbs_g, fat_g, sodium_mg, logged_at')
        .eq('user_id', userId)
        .gte('logged_at', sevenDaysAgo),
      supabaseAdmin
        .from('user_profiles')
        .select('daily_calorie_goal')
        .eq('user_id', userId)
        .single(),
    ])
 
    const logs    = logsResult.data || []
    const profile = profileResult.data
 
    if (logs.length === 0) {
      return NextResponse.json({ success: true, data: null, message: 'No logs in past 7 days' })
    }
 
    const distinctDays = new Set(logs.map(l => new Date(l.logged_at).toLocaleDateString('en-CA'))).size
    const divisor      = Math.max(distinctDays, 1)
 
    const totals = logs.reduce((acc, l) => ({
      calories: acc.calories + (l.calories   || 0),
      protein:  acc.protein  + (l.protein_g  || 0),
      carbs:    acc.carbs    + (l.carbs_g    || 0),
      fat:      acc.fat      + (l.fat_g      || 0),
      sodium:   acc.sodium   + (l.sodium_mg  || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 })
 
    const avg = {
      calories: Math.round(totals.calories / divisor),
      protein:  Math.round((totals.protein  / divisor) * 10) / 10,
      carbs:    Math.round((totals.carbs    / divisor) * 10) / 10,
      fat:      Math.round((totals.fat      / divisor) * 10) / 10,
      sodium:   Math.round(totals.sodium    / divisor),
    }
 
    const calorieGoal = profile?.daily_calorie_goal || RDA.calories
    const alerts: Array<{ nutrient: string; type: 'deficient' | 'excess'; avg: number; rda: number; message: string; severity: 'high' | 'medium' }> = []
 
    if (avg.protein < RDA.protein * 0.7) {
      alerts.push({
        nutrient: 'Protein', type: 'deficient', avg: avg.protein, rda: RDA.protein,
        message: `Averaging only ${avg.protein}g/day (need ${RDA.protein}g). Low protein causes muscle loss, fatigue, and weakened immunity.`,
        severity: avg.protein < RDA.protein * 0.5 ? 'high' : 'medium',
      })
    }
    if (avg.calories < calorieGoal * 0.7) {
      alerts.push({
        nutrient: 'Calories', type: 'deficient', avg: avg.calories, rda: calorieGoal,
        message: `Only ${avg.calories} kcal/day vs your goal of ${calorieGoal} kcal. Under-eating causes fatigue and nutrient deficiencies.`,
        severity: 'medium',
      })
    }
    if (avg.calories > calorieGoal * 1.2) {
      alerts.push({
        nutrient: 'Calories', type: 'excess', avg: avg.calories, rda: calorieGoal,
        message: `Averaging ${avg.calories} kcal/day, ${Math.round(avg.calories - calorieGoal)} kcal above your goal. This may cause gradual weight gain.`,
        severity: 'medium',
      })
    }
    if (avg.sodium > RDA.sodium * 1.2) {
      alerts.push({
        nutrient: 'Sodium', type: 'excess', avg: avg.sodium, rda: RDA.sodium,
        message: `Sodium intake (${avg.sodium}mg/day) exceeds WHO's ${RDA.sodium}mg limit. High sodium raises blood pressure and cardiovascular risk.`,
        severity: avg.sodium > RDA.sodium * 1.5 ? 'high' : 'medium',
      })
    }
    if (avg.fat > RDA.fat * 1.3) {
      alerts.push({
        nutrient: 'Fat', type: 'excess', avg: avg.fat, rda: RDA.fat,
        message: `High fat intake (${avg.fat}g/day vs ${RDA.fat}g recommended). Elevated saturated fat increases cardiovascular risk.`,
        severity: 'medium',
      })
    }
 
    return NextResponse.json({
      success: true,
      data: { avg, rda: { ...RDA, calories: calorieGoal }, alerts, daysTracked: distinctDays, totalLogs: logs.length },
    })
  } catch (err: any) {
    console.error('Nutrients summary error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
```

## FILE: src/app/api/products/submit/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// â”€â”€ Silently contribute a new product to Open Food Facts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function contributeToOpenFoodFacts(product: {
  barcode?: string
  name?: string
  brand?: string
  ingredients_text?: string
  serving_size_g?: number
  nutrition_per_100g?: {
    calories?: number | null
    protein?: number | null
    carbs?: number | null
    fat?: number | null
    sugar?: number | null
    sodium?: number | null
    fiber?: number | null
  }
}) {
  try {
    if (!product.barcode || product.barcode.startsWith('vision-')) return

    const form = new URLSearchParams()
    form.append('code',         product.barcode)
    form.append('product_name', product.name  || '')
    form.append('brands',       product.brand || '')
    form.append('countries',    'India')
    form.append('lang',         'en')

    const n = product.nutrition_per_100g
    if (n) {
      if (n.calories != null) form.append('nutriment_energy-kcal_100g',  String(n.calories))
      if (n.protein  != null) form.append('nutriment_proteins_100g',     String(n.protein))
      if (n.carbs    != null) form.append('nutriment_carbohydrates_100g', String(n.carbs))
      if (n.fat      != null) form.append('nutriment_fat_100g',          String(n.fat))
      if (n.sugar    != null) form.append('nutriment_sugars_100g',       String(n.sugar))
      // OFF expects sodium in g/100g; we store in mg â€” convert
      if (n.sodium   != null) form.append('nutriment_sodium_100g',       String(n.sodium / 1000))
      if (n.fiber    != null) form.append('nutriment_fiber_100g',        String(n.fiber))
    }

    if (product.ingredients_text) form.append('ingredients_text', product.ingredients_text)
    if (product.serving_size_g)   form.append('serving_quantity',  String(product.serving_size_g))

    // Credentials â€” register free at world.openfoodfacts.org/cgi/session.pl
    form.append('user_id',  process.env.OFF_USERNAME || 'healthox-app')
    form.append('password', process.env.OFF_PASSWORD || '')

    const res = await fetch('https://world.openfoodfacts.org/cgi/product_jqm2.pl', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':   'HealthOX/1.0 (healthox@example.com)',
      },
      body: form.toString(),
    })

    const result = await res.json()
    if (result.status === 1) {
      console.log('âœ… Contributed to OFF:', product.name, product.barcode)
    } else {
      console.log('OFF contribution:', result.status_verbose)
    }
  } catch (e: unknown) {
    // Non-critical â€” never fail the main request
    console.log('OFF contribution failed (non-critical):', (e as Error).message)
  }
}

// â”€â”€ POST /api/products/submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId  = (session as { userId?: string } | null)?.userId

    const body = await req.json()

    // Vision scans without a real barcode get a time-stamped key
    const barcode = (body.barcode as string | undefined)?.trim() || `vision-${Date.now()}`

    // â”€â”€ Build upsert payload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const payload: Record<string, unknown> = {
      barcode,
      name:              body.name              || 'Unknown Product',
      brand:             body.brand             || null,
      category:          body.category          || null,
      country_of_origin: body.country_of_origin || 'India',
      image_url:         body.image_url         || null,
      ingredients_text:  body.ingredients_text  || null,
      additives:         Array.isArray(body.additives) ? body.additives : [],
      allergens:         Array.isArray(body.allergens) ? body.allergens : [],
      serving_size_g:    body.serving_size_g    || null,
      source:            'gemini_vision',
    }

    // Nutrition fields
    const n = body.nutrition_per_100g
    if (n && typeof n === 'object') {
      payload.calories_per_100g = n.calories ?? null
      payload.protein_per_100g  = n.protein  ?? null
      payload.carbs_per_100g    = n.carbs    ?? null
      payload.fat_per_100g      = n.fat      ?? null
      payload.sugar_per_100g    = n.sugar    ?? null
      payload.sodium_per_100g   = n.sodium   ?? null
      payload.fiber_per_100g    = n.fiber    ?? null
    }

    // â”€â”€ Award contribution point (fire-and-forget, no race condition) â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (userId) {
      payload.scanned_by = userId
      supabaseAdmin
        .rpc('increment_contributions', { uid: userId })
        .then(({ error }) => {
          if (error) {
            // Fallback: read â†’ write if the RPC doesn't exist yet
            supabaseAdmin
              .from('user_profiles')
              .select('contributions')
              .eq('user_id', userId)
              .single()
              .then(({ data }) => {
                supabaseAdmin
                  .from('user_profiles')
                  .update({ contributions: (data?.contributions || 0) + 1 })
                  .eq('user_id', userId)
                  .then(() => console.log('Contribution point awarded:', userId))
              })
          }
        })
    }

    // â”€â”€ Upsert into Supabase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const { data, error } = await supabaseAdmin
      .from('products')
      .upsert(payload, { onConflict: 'barcode', ignoreDuplicates: false })
      .select()
      .single()

    if (error) {
      console.error('Submit error:', error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log('Product saved to DB:', data.name)

    // Contribute to OFF in background (never blocks the response)
    if (!barcode.startsWith('vision-') && body.name) {
      contributeToOpenFoodFacts(body).catch(() => {})
    }

    return NextResponse.json({ success: true, data })

  } catch (err: unknown) {
    console.error('Submit route error:', (err as Error).message)
    return NextResponse.json({ success: false, error: 'Submit failed' }, { status: 500 })
  }
}
```

## FILE: src/app/api/profile/email-prefs/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const EmailPrefsSchema = z.object({
  weekly_report_email: z.boolean(),
  email_unsubscribed: z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = EmailPrefsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid preferences: ' + parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      )
    }

    const { weekly_report_email, email_unsubscribed } = parsed.data

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        weekly_report_email,
        email_unsubscribed,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.log('Email prefs update error:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('Email preferences updated for user:', userId)
    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('Email prefs route error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
```

## FILE: src/app/api/profile/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const {
    age,
    gender,
    weight_kg,
    height_cm,
    activity_level,
    weight_goal,
    is_diabetic,
    has_bp,
    is_vegetarian,
  } = await req.json()

  // â”€â”€ Calculate BMI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const heightM = height_cm > 0 ? height_cm / 100 : 0
  if (!heightM) {
    return NextResponse.json({ success: false, error: 'Height must be greater than 0' }, { status: 400 })
  }
  const bmi = parseFloat((weight_kg / (heightM * heightM)).toFixed(1))

  // â”€â”€ Calculate BMR using Mifflin-St Jeor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let bmr = 0
  if (gender === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
  }

  // â”€â”€ Activity multiplier â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  const tdee = Math.round(bmr * (multipliers[activity_level] || 1.55))

  // â”€â”€ Adjust for weight goal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let dailyCalorieGoal = tdee

  if (weight_goal === 'lose') {
    // Deficit of 500 kcal/day = ~0.5kg/week loss
    dailyCalorieGoal = tdee - 500
  } else if (weight_goal === 'gain') {
    // Surplus of 300 kcal/day = lean muscle gain
    dailyCalorieGoal = tdee + 300
  }
  // 'maintain' = tdee as-is

  // â”€â”€ Safety clamp â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  dailyCalorieGoal = Math.max(1200, Math.min(4000, dailyCalorieGoal))

  console.log(`BMI: ${bmi} | BMR: ${Math.round(bmr)} | TDEE: ${tdee} | Goal: ${dailyCalorieGoal} | Weight goal: ${weight_goal}`)

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      age,
      gender,
      weight_kg,
      height_cm,
      activity_level,
      weight_goal,
      daily_calorie_goal: dailyCalorieGoal,
      target_calories: dailyCalorieGoal,
      is_diabetic: is_diabetic || false,
      has_bp: has_bp || false,
      is_vegetarian: is_vegetarian || false,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.log('Profile update error:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    bmi,
    bmr: Math.round(bmr),
    tdee,
    dailyCalorieGoal,
    weight_goal,
  })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
```

## FILE: src/app/api/scan/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// â”€â”€ GET /api/scan?barcode=<code> â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  const raw            = req.nextUrl.searchParams.get('barcode')
  const trimmedBarcode = raw?.trim()

  if (!trimmedBarcode || trimmedBarcode.length < 6) {
    return NextResponse.json({ success: false, error: 'Invalid barcode' }, { status: 400 })
  }

  console.log('Scanning barcode:', trimmedBarcode)

  // â”€â”€ Layer 1: Supabase cache â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  try {
    const { data: cached } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('barcode', trimmedBarcode)
      .single()

    if (cached?.name) {
      console.log('Cache hit:', cached.name)
      return NextResponse.json({ success: true, source: 'cache', data: formatProduct(cached) })
    }
  } catch {
    // miss â€” continue to next layer
  }

  // â”€â”€ Layer 2: Open Food Facts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  try {
    console.log('Trying Open Food Facts...')
    const offRes = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${trimmedBarcode}.json`,
      { headers: { 'User-Agent': 'HealthOX/1.0 (healthox@example.com)' } }
    )

    if (offRes.ok) {
      const offData = await offRes.json()
      console.log('OFF status:', offData.status)

      if (offData.status === 1 && offData.product?.product_name) {
        const p = offData.product
        const n = p.nutriments || {}

        const product = {
          barcode:           trimmedBarcode,
          name:              p.product_name || p.product_name_en || p.abbreviated_product_name || 'Unknown Product',
          brand:             p.brands || null,
          category:          p.categories || null,
          country_of_origin: p.countries_tags?.[0]?.replace('en:', '') || null,
          image_url:         p.image_front_url || p.image_url || null,
          calories_per_100g: parseNum(n['energy-kcal_100g'] || n['energy-kcal']),
          protein_per_100g:  parseNum(n.proteins_100g  || n.proteins),
          carbs_per_100g:    parseNum(n.carbohydrates_100g || n.carbohydrates),
          fat_per_100g:      parseNum(n.fat_100g || n.fat),
          sugar_per_100g:    parseNum(n.sugars_100g || n.sugars),
          sodium_per_100g:   parseSodium(n.sodium_100g ?? n.sodium, n.salt_100g),
          fiber_per_100g:    parseNum(n.fiber_100g || n.fiber),
          serving_size_g:    parseNum(p.serving_quantity),
          ingredients_text:  p.ingredients_text || null,
          allergens:         parseList(p.allergens_tags),
          additives:         parseList(p.additives_tags),
          source:            'open_food_facts',
        }

        // Cache asynchronously â€” don't block the response
        cacheProduct(product)

        console.log('OFF hit:', product.name)
        return NextResponse.json({ success: true, source: 'open_food_facts', data: formatProduct(product) })
      }
    }
  } catch (e: unknown) {
    console.log('Open Food Facts failed:', (e as Error).message)
  }

  // â”€â”€ Layer 3: UPC Item DB (good Indian coverage, free tier) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  try {
    console.log('Trying UPC Item DB...')
    const upcRes = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${trimmedBarcode}`,
      { headers: { Accept: 'application/json' } }
    )

    if (upcRes.ok) {
      const upcData = await upcRes.json()
      const item    = upcData.items?.[0]

      if (item?.title) {
        const product = {
          barcode:           trimmedBarcode,
          name:              item.title,
          brand:             item.brand    || null,
          category:          item.category || null,
          country_of_origin: null,
          image_url:         item.images?.[0] || null,
          calories_per_100g: null,
          protein_per_100g:  null,
          carbs_per_100g:    null,
          fat_per_100g:      null,
          sugar_per_100g:    null,
          sodium_per_100g:   null,
          fiber_per_100g:    null,
          serving_size_g:    null,
          ingredients_text:  null,
          allergens:         [] as string[],
          additives:         [] as string[],
          source:            'upc_item_db',
        }

        cacheProduct(product)

        console.log('UPC DB hit:', product.name, '(no nutrition â€” photo mode recommended)')
        return NextResponse.json({
          success:          true,
          source:           'upc_item_db',
          data:             formatProduct(product),
          nutritionMissing: true,
          tip:              'Product found but nutrition data is unavailable. Use Photo Mode to read the label.',
        })
      }
    }
  } catch (e: unknown) {
    console.log('UPC Item DB failed:', (e as Error).message)
  }

  // â”€â”€ Layer 4: Not found anywhere â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log('Product not found for barcode:', trimmedBarcode)
  return NextResponse.json({
    success: false,
    error:   'PRODUCT_NOT_FOUND',
    barcode: trimmedBarcode,
    message: 'This product is not in our database yet. Use Photo Mode to read the nutrition label directly.',
  })
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function parseNum(val: unknown): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n * 10) / 10
}

function parseSodium(sodiumVal: unknown, saltVal: unknown): number | null {
  // OFF stores sodium in g/100g â€” convert to mg
  const s = parseNum(sodiumVal)
  if (s !== null) return Math.round(s * 1000)
  // Fallback: derive from salt (sodium â‰ˆ salt Ã— 0.4)
  const salt = parseNum(saltVal)
  if (salt !== null) return Math.round(salt * 1000 * 0.4)
  return null
}

function parseList(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  return (tags as string[])
    .map(t => t.replace(/^en:/, '').replace(/-/g, ' ').trim())
    .filter(Boolean)
}

function formatProduct(p: Record<string, unknown>) {
  return {
    id:               p.id,
    barcode:          p.barcode,
    name:             p.name             || 'Unknown Product',
    brand:            p.brand            || null,
    category:         p.category         || null,
    country_of_origin: p.country_of_origin || null,
    image_url:        p.image_url        || null,
    source:           p.source           || 'cache',
    nutrition: {
      calories: (p.calories_per_100g as number) ?? 0,
      protein:  (p.protein_per_100g  as number) ?? 0,
      carbs:    (p.carbs_per_100g    as number) ?? 0,
      fat:      (p.fat_per_100g      as number) ?? 0,
      sugar:    (p.sugar_per_100g    as number | null) ?? null,
      sodium:   (p.sodium_per_100g   as number | null) ?? null,
      fiber:    (p.fiber_per_100g    as number | null) ?? null,
    },
    serving_size_g:   p.serving_size_g   || null,
    ingredients_text: p.ingredients_text || null,
    allergens:        (p.allergens  as string[]) || [],
    additives:        (p.additives  as string[]) || [],
    ai_health_rating: p.ai_health_rating || null,
    ai_analysis:      p.ai_analysis_json || null,
  }
}

async function cacheProduct(product: Record<string, unknown>) {
  try {
    await supabaseAdmin.from('products').upsert({
      barcode:           product.barcode,
      name:              product.name,
      brand:             product.brand,
      category:          product.category,
      country_of_origin: product.country_of_origin,
      image_url:         product.image_url,
      calories_per_100g: product.calories_per_100g,
      protein_per_100g:  product.protein_per_100g,
      carbs_per_100g:    product.carbs_per_100g,
      fat_per_100g:      product.fat_per_100g,
      sugar_per_100g:    product.sugar_per_100g,
      sodium_per_100g:   product.sodium_per_100g,
      fiber_per_100g:    product.fiber_per_100g,
      serving_size_g:    product.serving_size_g,
      ingredients_text:  product.ingredients_text,
      allergens:         product.allergens,
      additives:         product.additives,
      source:            product.source,
    }, { onConflict: 'barcode', ignoreDuplicates: false })
    console.log('Product cached:', product.name)
  } catch (e: unknown) {
    console.log('Cache write failed:', (e as Error).message)
  }
}
```

## FILE: src/app/api/scan-product-photo/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callGemini, GeminiError } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', tip: 'Please sign in to scan product photos.' },
        { status: 401 }
      )
    }

    const { imageBase64 } = await req.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    console.log('Scanning product photo with Gemini...')

    const prompt = `You are an expert Indian food product analyst and nutritionist.

A user has taken a photo of a packaged food product. Your job is to extract ALL possible information from this image â€” front of pack, back of pack, nutrition label, ingredients list, barcode number, brand name, everything visible.

Look carefully at:
1. Product name and brand (usually large text on front)
2. Barcode number (the number printed below the parallel lines)
3. Nutrition facts table (per 100g values)
4. Ingredients list
5. Allergen information
6. FSSAI license number (14-digit number)
7. MRP (Maximum Retail Price in rupees)
8. Net weight / serving size
9. Any health claims on the packaging
10. Additives and preservatives mentioned

Return ONLY valid JSON with no markdown, no code fences, no extra text:
{
  "found": true,
  "barcode": "<barcode number if visible, or null>",
  "name": "<full product name>",
  "brand": "<brand name>",
  "variant": "<flavour or variant if mentioned, or null>",
  "net_weight_g": <number or null>,
  "serving_size_g": <number or null>,
  "mrp_rupees": <number or null>,
  "fssai_number": "<14-digit number or null>",
  "country_of_origin": "<country or null>",
  "nutrition_per_100g": {
    "calories": <number or null>,
    "protein": <number or null>,
    "carbs": <number or null>,
    "fat": <number or null>,
    "sugar": <number or null>,
    "sodium": <number or null>,
    "fiber": <number or null>,
    "saturated_fat": <number or null>,
    "trans_fat": <number or null>
  },
  "ingredients_text": "<full ingredients list as written on pack, or null>",
  "allergens": ["<allergen>"],
  "additives": ["<E-number or additive name>"],
  "health_claims": ["<any health claims on the pack>"],
  "certifications": ["<veg/non-veg mark, organic, ISO, etc>"],
  "confidence": "high" or "medium" or "low",
  "image_quality": "good" or "blurry" or "partial" or "dark",
  "what_was_visible": "<describe what parts of the product were visible in the photo>"
}

If the image does not show a food product at all, return:
{
  "found": false,
  "error": "No food product visible in the image"
}

IMPORTANT: Extract whatever is visible. Even if only partial information is available, return what you can see. Do not make up or guess values â€” use null for anything not clearly visible.`

    const { text } = await callGemini(prompt, imageBase64, {
      temperature: 0.1,
      maxTokens: 8192,
    })

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'AI returned no response. Please try again.' },
        { status: 500 }
      )
    }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let extracted: any
    try {
      extracted = JSON.parse(cleaned)
    } catch {
      console.log('Parse failed:', cleaned.slice(0, 300))
      return NextResponse.json(
        { success: false, error: 'Could not read the product. Please try again.' },
        { status: 500 }
      )
    }

    if (!extracted.found) {
      return NextResponse.json({
        success: false,
        error: 'No food product found in the image',
        tip: 'Make sure the food product is clearly visible and takes up most of the frame.',
      })
    }

    console.log('Photo scan success:', extracted.name, '| Confidence:', extracted.confidence)

    return NextResponse.json({
      success: true,
      data: extracted,
      message: extracted.confidence === 'low'
        ? 'Some values may be inaccurate due to image quality. Please verify before logging.'
        : null,
    })

  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`Gemini Photo Error [${err.type}]:`, err.message)
      if (err.type === 'unavailable') {
        return NextResponse.json({ success: false, error: 'Gemini AI is temporarily overloaded. Please wait 30 seconds and try again.' }, { status: 503 })
      }
      if (err.type === 'timeout') {
        return NextResponse.json({ success: false, error: 'AI timed out reading the photo. Please try again.' }, { status: 504 })
      }
      if (err.type === 'rate_limit') {
        return NextResponse.json({ success: false, error: 'AI rate limit reached. Please wait a moment.' }, { status: 429 })
      }
    } else {
      console.error('Photo scan error:', err.message)
    }
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
```

## FILE: src/app/api/scan-session/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { barcode, product_name, product_image, ai_health_rating, ai_health_score } = await req.json()

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const { data: existing } = await supabaseAdmin
    .from('scan_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('barcode', barcode)
    .gte('scanned_at', yesterday.toISOString())
    .single()

  if (existing) {
    const { error: updateError } = await supabaseAdmin
      .from('scan_sessions')
      .update({
        ai_health_rating,
        ai_health_score,
        scanned_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .eq('user_id', userId)

    if (updateError) {
      console.log('Scan session update error:', updateError.message)
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, action: 'updated' })
  }

  const { error } = await supabaseAdmin
    .from('scan_sessions')
    .insert({
      user_id: userId,
      barcode,
      product_name,
      product_image,
      ai_health_rating,
      ai_health_score,
    })

  if (error) {
    console.log('Scan session error:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, action: 'created' })
}
```

## FILE: src/app/api/scan-vision/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callGemini, GeminiError } from '@/lib/gemini'

const RequestSchema = z.object({
  imageBase64: z.string().min(100, 'Image data is too small â€” please try again'),
  mode: z.enum(['barcode_only', 'full_label']).optional().default('full_label'),
})

const FAILURE_REASONS = {
  no_barcode: {
    message: 'No barcode visible in the photo',
    tip: 'Make sure the barcode lines and the number below them are clearly visible. Try moving closer.',
  },
  blurry: {
    message: 'The image appears blurry',
    tip: 'Hold your phone steady and tap the screen to focus before capturing.',
  },
  dark: {
    message: 'The image is too dark',
    tip: 'Move to a brighter area or turn on your flashlight.',
  },
  no_label: {
    message: 'No nutrition label found',
    tip: 'Point the camera at the back or side of the packet where the nutrition table is printed.',
  },
  generic: {
    message: 'Could not read the label',
    tip: 'Try a different angle, better lighting, or use manual barcode entry instead.',
  },
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', tip: 'Please sign in to scan product labels.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image data',
          tip: 'Please try capturing the image again.',
        },
        { status: 400 }
      )
    }

    const { imageBase64, mode } = parsed.data

    const prompt = mode === 'barcode_only'
      ? `Look at this image carefully. Find the barcode â€” the parallel black vertical lines with numbers printed below them.

Your task: Extract the exact barcode number printed below the barcode lines.

Also assess image quality and return this JSON only, no markdown:
{
  "barcode": "<exact number below barcode lines, or null if not clearly visible>",
  "confidence": "high" or "medium" or "low",
  "image_issues": null or "blurry" or "dark" or "no_barcode" or "no_label",
  "visible_elements": ["describe what you can see in the image"]
}`
      : `You are a food label reader for Indian packaged food products.
Examine this image carefully and extract ALL visible information from the packaging.

Also assess image quality. Return ONLY valid JSON, no markdown, no code fences:
{
  "barcode": "<barcode number if visible, or null>",
  "name": "<product name>",
  "brand": "<brand name>",
  "serving_size_g": <number or null>,
  "ingredients_text": "<full ingredients list or null>",
  "nutrition_per_100g": {
    "calories": <number or null>,
    "protein": <number or null>,
    "carbs": <number or null>,
    "fat": <number or null>,
    "sugar": <number or null>,
    "sodium": <number or null>,
    "fiber": <number or null>
  },
  "additives": ["<additive name>"],
  "allergens": ["<allergen>"],
  "fssai_number": "<14-digit FSSAI number or null>",
  "mrp": <price in rupees or null>,
  "confidence": "high" or "medium" or "low",
  "image_issues": null or "blurry" or "dark" or "no_barcode" or "no_label"
}`

    const { text } = await callGemini(prompt, imageBase64, {
      temperature: 0.1,
      maxTokens: 8192,
      model: 'gemini-1.5-flash',
    })

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: FAILURE_REASONS.generic.message,
          tip: FAILURE_REASONS.generic.tip,
        },
        { status: 500 }
      )
    }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let extracted: any
    try {
      extracted = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: FAILURE_REASONS.generic.message,
          tip: FAILURE_REASONS.generic.tip,
        },
        { status: 500 }
      )
    }

    // Give specific failure reason based on image issues
    if (extracted.image_issues && (!extracted.barcode && !extracted.name)) {
      const reason = FAILURE_REASONS[extracted.image_issues as keyof typeof FAILURE_REASONS]
        || FAILURE_REASONS.generic

      return NextResponse.json({
        success: false,
        error: reason.message,
        tip: reason.tip,
        image_issues: extracted.image_issues,
      })
    }

    // Low confidence warning
    if (extracted.confidence === 'low') {
      extracted._warning = 'Low confidence â€” some values may be inaccurate. Please verify before logging.'
    }

    console.log('Vision extracted barcode:', extracted.barcode)
    console.log('Vision extracted name:', extracted.name)
    console.log('Vision confidence:', extracted.confidence)

    return NextResponse.json({ success: true, data: extracted })

  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`Gemini Vision Error [${err.type}]:`, err.message)
      if (err.type === 'unavailable') {
        return NextResponse.json(
          { success: false, error: 'Gemini AI is temporarily overloaded. Please wait 30 seconds and try again.', tip: 'This is a temporary issue â€” just retry in a moment.' },
          { status: 503 }
        )
      }
      if (err.type === 'timeout') {
        return NextResponse.json(
          { success: false, error: 'AI timed out. Try a clearer photo.', tip: 'Make sure the label is clearly visible and well-lit.' },
          { status: 504 }
        )
      }
      if (err.type === 'rate_limit') {
        return NextResponse.json(
          { success: false, error: 'AI rate limit reached. Please wait a moment.', tip: 'Too many requests right now.' },
          { status: 429 }
        )
      }
    }
    console.error('Vision error:', err.message)
    return NextResponse.json(
      {
        success: false,
        error: FAILURE_REASONS.generic.message,
        tip: FAILURE_REASONS.generic.tip,
      },
      { status: 500 }
    )
  }
}
```

## FILE: src/app/api/streak/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
 
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
 
  try {
    const since = new Date()
    since.setDate(since.getDate() - 90)
 
    const { data: logs } = await supabaseAdmin
      .from('food_logs')
      .select('logged_at')
      .eq('user_id', userId)
      .gte('logged_at', since.toISOString())
      .order('logged_at', { ascending: false })
 
    if (!logs || logs.length === 0) {
      return NextResponse.json({ success: true, streak: 0, longest: 0, lastLoggedAt: null, loggedToday: false })
    }
 
    const dates = [...new Set(logs.map(l => new Date(l.logged_at).toLocaleDateString('en-CA')))].sort().reverse()
    const today     = new Date().toLocaleDateString('en-CA')
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA')
 
    if (dates[0] !== today && dates[0] !== yesterday) {
      return NextResponse.json({ success: true, streak: 0, longest: calcLongest(dates), lastLoggedAt: logs[0].logged_at, loggedToday: false })
    }
 
    let streak = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000)
      if (diff === 1) { streak++ } else { break }
    }
 
    return NextResponse.json({
      success: true,
      streak,
      longest: calcLongest(dates),
      lastLoggedAt: logs[0].logged_at,
      loggedToday: dates[0] === today,
    })
  } catch (err: any) {
    console.error('Streak error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
 
function calcLongest(dates: string[]): number {
  if (!dates.length) return 0
  let max = 1, cur = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000)
    if (diff === 1) { cur++; max = Math.max(max, cur) } else { cur = 1 }
  }
  return max
}
```

## FILE: src/app/api/unsubscribe/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { verifyUnsubscribeToken } from '@/lib/tokens'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const type = req.nextUrl.searchParams.get('type') || 'all'

  if (!token) {
    return new NextResponse(
      buildHTML('Invalid or missing unsubscribe link.', false),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const userId = verifyUnsubscribeToken(token)
  if (!userId) {
    return new NextResponse(
      buildHTML('This unsubscribe link has expired or is invalid. Please use the latest email link.', false),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  try {
    const updates: Record<string, any> = {}

    if (type === 'weekly') {
      updates.weekly_report_email = false
    } else {
      updates.email_unsubscribed = true
      updates.weekly_report_email = false
    }

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)

    if (error) throw error

    const message =
      type === 'weekly'
        ? 'You have been unsubscribed from weekly nutrition reports. You will still receive important account emails.'
        : 'You have been unsubscribed from all HealthOX emails.'

    return new NextResponse(buildHTML(message, true), {
      headers: { 'Content-Type': 'text/html' },
    })

  } catch {
    return new NextResponse(
      buildHTML('Something went wrong. Please try again.', false),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}

function buildHTML(message: string, success: boolean): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HealthOX â€” Unsubscribe</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:400px;margin:0 auto;padding:32px 16px;text-align:center;">
    <div style="font-size:56px;margin-bottom:16px;">${success ? 'âœ…' : 'âŒ'}</div>
    <div style="background:white;border-radius:20px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <h1 style="font-size:20px;font-weight:800;color:#111827;margin:0 0 12px;">
        ${success ? 'Unsubscribed Successfully' : 'Something Went Wrong'}
      </h1>
      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0 0 24px;">
        ${message}
      </p>
      <a href="${baseUrl}/dashboard"
        style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#059669,#0ea5e9);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:700;">
        Go to HealthOX â†’
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;margin-top:20px;">
      Made with ðŸ’š for a healthier India
    </p>
  </div>
</body>
</html>
  `
}
```

## FILE: src/app/api/welcome-email/route.ts

`$lang
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { buildUnsubscribeUrls } from '@/lib/tokens'

export async function POST(req: NextRequest) {
  try {
    // âœ… Only allow internal calls (from our own server during sign-in)
    const host = req.headers.get('host') || ''
    const origin = req.headers.get('origin') || ''
    const referer = req.headers.get('referer') || ''
    const expectedHost = new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000').host

    const internalSecret = req.headers.get('x-internal-secret')
    if (internalSecret !== process.env.NEXTAUTH_SECRET) {
      if (!host.includes(expectedHost) && !referer.includes(expectedHost) && !origin.includes(expectedHost)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
    }

    const { userId, email, name } = await req.json()

    if (!userId || !email) {
      return NextResponse.json({ success: false, error: 'Missing userId or email' }, { status: 400 })
    }

    console.log('Welcome email request for:', email)

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('welcome_email_sent, email_unsubscribed')
      .eq('user_id', userId)
      .single()

    if (profile?.welcome_email_sent) {
      console.log('Welcome email already sent to:', email)
      return NextResponse.json({ success: false, reason: 'already_sent' })
    }

    if (profile?.email_unsubscribed) {
      console.log('User unsubscribed:', email)
      return NextResponse.json({ success: false, reason: 'unsubscribed' })
    }

    const firstName = name?.split(' ')[0] || 'there'
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // âœ… Secure signed token URLs instead of raw userId
    const { weeklyUrl: unsubscribeWeeklyUrl, allUrl: unsubscribeAllUrl } = buildUnsubscribeUrls(userId, baseUrl)

    const html = buildWelcomeHTML(firstName, baseUrl, unsubscribeAllUrl, unsubscribeWeeklyUrl)

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.log('RESEND_API_KEY is not set')
      return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'HealthOX <onboarding@resend.dev>',
        to: [email],
        subject: `Welcome to HealthOX, ${firstName}! ðŸ¥— Your journey to healthier eating starts now`,
        html,
      })
    })

    const data = await res.json()
    console.log('Resend response:', JSON.stringify(data))

    if (!res.ok) {
      console.log('Welcome email failed:', data)
      return NextResponse.json({ success: false, error: JSON.stringify(data) }, { status: 500 })
    }

    await supabaseAdmin
      .from('user_profiles')
      .update({ welcome_email_sent: true })
      .eq('user_id', userId)

    console.log('âœ… Welcome email sent successfully to:', email)
    return NextResponse.json({ success: true, messageId: data.id })

  } catch (err: any) {
    console.error('Welcome email exception:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

function buildWelcomeHTML(
  firstName: string,
  baseUrl: string,
  unsubscribeAllUrl: string,
  unsubscribeWeeklyUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HealthOX</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- Logo Header -->
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#059669,#0ea5e9);margin-bottom:16px;box-shadow:0 8px 24px rgba(5,150,105,0.35);">
      <span style="font-size:36px;">ðŸ¥—</span>
    </div>
    <h1 style="font-size:32px;font-weight:900;margin:0 0 4px;background:linear-gradient(135deg,#059669,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">HealthOX</h1>
    <p style="font-size:14px;color:#6b7280;margin:0;">AI-Powered Food Health Advisor</p>
  </div>

  <!-- Main Card -->
  <div style="background:white;border-radius:24px;padding:40px;box-shadow:0 4px 32px rgba(0,0,0,0.06);margin-bottom:20px;">

    <!-- Greeting -->
    <h2 style="font-size:28px;font-weight:900;color:#111827;margin:0 0 8px;">
      Welcome, ${firstName}! ðŸŽ‰
    </h2>
    <p style="font-size:14px;color:#6b7280;margin:0 0 28px;">We are so glad you are here.</p>

    <p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px;">
      You have just taken a small but meaningful step towards understanding what goes into
      the food you eat every single day. At HealthOX, we believe that
      <strong>knowledge is the first step to better health</strong> â€” and you now have
      that knowledge at your fingertips.
    </p>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:28px 0;"></div>

    <!-- Our Mission -->
    <h3 style="font-size:17px;font-weight:800;color:#111827;margin:0 0 14px;">ðŸŒ± Why We Built HealthOX</h3>

    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 14px;">
      India is home to over 1.4 billion people, yet most of us eat packaged food every day
      without truly knowing what is inside it. Hidden sugars, artificial preservatives,
      excessive sodium, harmful additives â€” they quietly affect our health while we remain
      completely unaware.
    </p>

    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 28px;">
      We built HealthOX with one heartfelt intention â€” to make food transparency
      <strong>free, accessible, and easy for every Indian family</strong>. Just scan a product
      and instantly know if it is good for you, your children, or your parents â€” powered by
      Google Gemini AI and FSSAI standards.
    </p>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:0 0 28px;"></div>

    <!-- Features -->
    <h3 style="font-size:17px;font-weight:800;color:#111827;margin:0 0 16px;">âœ¨ What you can do with HealthOX</h3>

    ${[
      { icon: 'ðŸ“·', title: 'Scan any packaged food', desc: 'Point your camera at a barcode or nutrition label. Works on all Indian products â€” even ones not in any database yet.' },
      { icon: 'ðŸ¤–', title: 'Instant AI health rating', desc: 'Gemini AI checks every ingredient, flags harmful additives like E621 and TBHQ, and gives you a clear 1â€“10 health score.' },
      { icon: 'ðŸ“Š', title: 'Track your daily nutrition', desc: 'Log meals, monitor calories, and see your protein, carbs and fat breakdown. Your calorie goal is personalised based on your BMI.' },
      { icon: 'ðŸ“§', title: 'Weekly nutrition reports', desc: 'Every Monday morning you receive a detailed email showing your week â€” total calories, macros, and which products to watch out for.' },
      { icon: 'ðŸ‡®ðŸ‡³', title: 'Help build India\'s food database', desc: 'When you scan a product not in our database, Gemini reads the label and adds it for every Indian family.' },
    ].map(f => `
      <div style="display:flex;align-items:flex-start;gap:14px;padding:16px;background:#f0fdf4;border-radius:14px;margin-bottom:10px;border:1px solid #d1fae5;">
        <span style="font-size:26px;flex-shrink:0;">${f.icon}</span>
        <div>
          <p style="font-size:14px;font-weight:700;color:#111827;margin:0 0 4px;">${f.title}</p>
          <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0;">${f.desc}</p>
        </div>
      </div>
    `).join('')}

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:28px 0;"></div>

    <!-- Quick tips -->
    <h3 style="font-size:17px;font-weight:800;color:#111827;margin:0 0 14px;">ðŸ’¡ 3 things to do right now</h3>

    ${[
      { num: '1', text: 'Complete your health profile to get a personalised calorie goal based on your BMI, activity level and whether you want to lose, maintain or gain weight.' },
      { num: '2', text: 'Try scanning Parle-G, Maggi or Lay\'s to see the full AI analysis â€” you might be surprised by the score!' },
      { num: '3', text: 'Enable weekly reports in your Profile settings so every Monday you get a full nutrition summary in your inbox.' },
    ].map(tip => `
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
        <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#059669,#0ea5e9);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:white;font-size:13px;font-weight:900;">${tip.num}</div>
        <p style="font-size:13px;color:#374151;line-height:1.7;margin:4px 0 0;">${tip.text}</p>
      </div>
    `).join('')}

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:28px 0;"></div>

    <!-- Personal message -->
    <div style="background:linear-gradient(135deg,rgba(5,150,105,0.06),rgba(14,165,233,0.04));border-radius:16px;padding:20px;border:1px solid rgba(5,150,105,0.15);margin-bottom:28px;">
      <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 10px;">
        ${firstName}, every scan you make, every meal you log, every product you add to
        our database â€” it all adds up to something bigger. You are not just tracking
        your own health. You are helping build a healthier future for millions of
        Indian families.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;margin:0;">
        We are genuinely rooting for you. <strong>You have got this. ðŸ’š</strong>
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align:center;">
      <a href="${baseUrl}/scan"
        style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#059669,#0ea5e9);color:white;text-decoration:none;border-radius:14px;font-size:15px;font-weight:800;box-shadow:0 8px 24px rgba(5,150,105,0.35);">
        Start Scanning Now â†’
      </a>
      <p style="font-size:12px;color:#9ca3af;margin:12px 0 0;">
        Takes less than 30 seconds to get your first AI health rating
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:white;border-radius:20px;padding:20px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.04);text-align:center;">
    <p style="font-size:13px;color:#374151;font-weight:600;margin:0 0 4px;">Made with ðŸ’š for a healthier India</p>
    <p style="font-size:12px;color:#9ca3af;margin:0 0 16px;">HealthOX â€” AI-Powered Food Health Advisor</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
      <a href="${unsubscribeWeeklyUrl}" style="font-size:11px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from weekly reports
      </a>
      <span style="color:#d1d5db;">Â·</span>
      <a href="${unsubscribeAllUrl}" style="font-size:11px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from all emails
      </a>
    </div>
  </div>

</div>
</body>
</html>
  `
}
```

## FILE: src/app/auth/signin/page.tsx

`$lang
"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function SignInPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  async function handleSignIn() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const features = [
    { icon: 'ðŸ“·', title: 'Smart Scanning', desc: 'Camera or photo mode for any Indian product' },
    { icon: 'ðŸ¤–', title: 'Gemini AI', desc: 'Instant health ratings and ingredient warnings' },
    { icon: 'ðŸ“Š', title: 'Track Macros', desc: 'Personalised calorie goals based on your BMI' },
    { icon: 'ðŸ‡®ðŸ‡³', title: 'Made for India', desc: 'FSSAI standards, Indian product database' },
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 right-0 h-72 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-20 w-72 h-72 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center p-6 max-w-sm mx-auto w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #059669, #0ea5e9)',
              boxShadow: '0 8px 32px rgba(5,150,105,0.35)',
            }}
          >
            <span className="text-4xl">ðŸ¥—</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2"
            style={{
              background: 'linear-gradient(135deg, #059669, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            HealthOX
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Your AI-powered food health advisor.<br />
            Know what you eat. Live better.
          </p>
        </div>

        {/* Sign in card */}
        <div className="w-full bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)] mb-4">

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Get started for free</h2>
            <p className="text-xs text-[var(--muted)]">No credit card required Â· Always free</p>
          </div>

          {/* Google sign in */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-2xl font-bold text-sm transition-all duration-200 relative overflow-hidden group mb-3"
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #059669, #0ea5e9)',
              color: 'white',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(5,150,105,0.35)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Signing you in...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" fillOpacity="0.9"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" fillOpacity="0.9"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" fillOpacity="0.9"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" fillOpacity="0.9"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Guest mode */}
          <div className="relative flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[var(--card-border)]" />
            <span className="text-xs text-[var(--muted)] font-medium">or</span>
            <div className="flex-1 h-px bg-[var(--card-border)]" />
          </div>

          <button
            onClick={() => router.push('/scan')}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl font-bold text-sm border-2 transition-all"
            style={{
              borderColor: 'var(--card-border)',
              color: 'var(--foreground)',
              background: 'var(--card)',
            }}
          >
            <span className="text-lg">ðŸ‘¤</span>
            Continue as Guest
          </button>

          <div className="mt-3 p-3 rounded-xl text-center"
            style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--foreground)]">Guest mode:</strong> You can scan products and get AI health ratings without signing in. Sign in to save meal history, track calories and receive weekly reports.
            </p>
          </div>

          <p className="text-xs text-center text-[var(--muted)] mt-4">
            By signing in you agree to our terms of service
          </p>
        </div>

        {/* Features grid */}
        <div className="w-full grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={f.title} className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--card-border)]">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-xs font-bold text-[var(--foreground)] mb-1">{f.title}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="mt-6 flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <span>{theme === 'dark' ? 'â˜€ï¸' : 'ðŸŒ™'}</span>
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
        )}

      </div>

      <div className="text-center pb-6 relative">
        <p className="text-xs text-[var(--muted)]">Made with ðŸ’š for a healthier India</p>
      </div>
    </div>
  )
}
```

## FILE: src/app/dashboard/page.tsx

`$lang
"use client"
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Scan, Plus, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import CalorieRing from '@/components/dashboard/CalorieRing'
import WeeklyChart from '@/components/dashboard/WeeklyChart'
import RecentScans from '@/components/dashboard/RecentScans'
import MealStreak from '@/components/dashboard/MealStreak'
import NutrientAlerts from '@/components/dashboard/NutrientAlerts'
import LastScanned from '@/components/dashboard/LastScanned'
import { SkeletonDashboard } from '@/components/Skeleton'
import { event, AnalyticsEvents } from '@/lib/analytics'
// âœ… No supabase import â€” data fetching belongs in the API route

interface DashboardData {
  totalCalories:    number
  totalProtein:     number
  totalCarbs:       number
  totalFat:         number
  dailyCalorieGoal: number
  mealCount:        number
  profile:          any
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  const userId = (session as any)?.userId

  // âœ… Single API call â€” no direct Supabase access from the client
  const { data, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      const res = await fetch('/api/dashboard')
      if (!res.ok) throw new Error('Failed to load dashboard')
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (userId) {
      event(AnalyticsEvents.VIEW_ANALYSIS, { page: 'dashboard', user_id: userId })
    }
  }, [userId])

  if (status === 'loading' || isLoading) return <SkeletonDashboard />

  const isNewUser = !data?.profile?.profile_completed
  const hasNoLogs = (data?.mealCount ?? 0) === 0
  const userName  = session?.user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-4 pt-14 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%), radial-gradient(circle at 20% 80%, white 0%, transparent 50%)' }}
        />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-2xl font-black text-white mt-0.5">
              {isNewUser ? `Welcome, ${userName}! ðŸ‘‹` : `Hello, ${userName} ðŸ‘‹`}
            </h1>
            {isNewUser && (
              <p className="text-emerald-100 text-sm mt-1">Let&apos;s set up your health profile</p>
            )}
          </div>
          <button
            onClick={() => refetch()}
            title="Refresh data"
            className="mt-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Refresh dashboard"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-12 pb-8 space-y-4">

        {/* Profile Setup CTA */}
        {isNewUser && (
          <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Complete your profile</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Get personalised health scores and calorie goals
              </p>
            </div>
            <button
              onClick={() => router.push('/profile-setup')}
              className="flex-shrink-0 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors"
            >
              Set Up
            </button>
          </div>
        )}

        {/* Calorie Ring */}
        <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          {hasNoLogs ? (
            <EmptyCalorieState onScan={() => router.push('/scan')} />
          ) : (
            <>
              <CalorieRing
                consumed={data?.totalCalories ?? 0}
                goal={data?.dailyCalorieGoal ?? 2000}
              />
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <MacroPill label="Protein" value={data?.totalProtein ?? 0} unit="g" color="text-blue-500" />
                <MacroPill label="Carbs"   value={data?.totalCarbs   ?? 0} unit="g" color="text-amber-500" />
                <MacroPill label="Fat"     value={data?.totalFat     ?? 0} unit="g" color="text-rose-500" />
              </div>
            </>
          )}
        </div>

        {/* Meal Streak */}
        <MealStreak />

        {/* Last Scanned */}
        <LastScanned />

        {/* Nutrient Alerts */}
        {!hasNoLogs && <NutrientAlerts />}

        {/* Weekly Chart */}
        {hasNoLogs ? <EmptyWeeklyState /> : <WeeklyChart userId={userId} />}

        {/* Recent Meals */}
        {hasNoLogs ? <EmptyMealsState onScan={() => router.push('/scan')} /> : <RecentScans userId={userId} />}

      </div>
    </div>
  )
}

function MacroPill({ label, value, unit, color }: {
  label: string; value: number; unit: string; color: string
}) {
  return (
    <div className="text-center">
      <p className={`text-lg font-black tabular-nums ${color}`}>
        {value}<span className="text-xs font-medium">{unit}</span>
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
    </div>
  )
}

function EmptyCalorieState({ onScan }: { onScan: () => void }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="w-20 h-20 rounded-full border-4 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-gray-300 dark:text-gray-600" />
      </div>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">No meals logged today</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Scan a product to start tracking</p>
      <button
        onClick={onScan}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
      >
        <Scan className="w-4 h-4" /> Scan a Product
      </button>
    </div>
  )
}

function EmptyWeeklyState() {
  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Weekly Overview</p>
      <div className="flex items-end justify-between gap-1 h-24 opacity-30">
        {[42, 28, 55, 35, 62, 20, 48].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t-md" style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
        Log meals to see your weekly trend
      </p>
    </div>
  )
}

function EmptyMealsState({ onScan }: { onScan: () => void }) {
  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Today&apos;s Meals</p>
      <div className="flex flex-col items-center py-8 text-center">
        <p className="text-2xl mb-3">ðŸ¥—</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your plate is empty</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Scan a product and log it to see it here
        </p>
        <button
          onClick={onScan}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <Scan className="w-4 h-4" /> Start scanning
        </button>
      </div>
    </div>
  )
}
```

## FILE: src/app/favicon.ico

`$lang
         (  F          (  n  00     (-  –           ¾F  (                                                           $   ]   º   º   ]   $                                           ò   ÿ   ÿ   ÿ   ÿ   ò                               8   à   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   à   8                  â   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   â              ¡   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ¡       #   ô   ÿ   ÿOOOÿ®®®ÿ«««ÿ«««ÿ«««ÿ«««ÿ­­­ÿgggÿ   ÿ   ÿ   ô   #   Y   ÿ   ÿ   ÿÿíííÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýýýÿ555ÿ   ÿ   ÿ   ÿ   Y   »   ÿ   ÿ   ÿ   ÿkkkÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿŽŽŽÿ   ÿ   ÿ   ÿ   ÿ   »   »   ÿ   ÿ   ÿ   ÿ			ÿÍÍÍÿÿÿÿÿÿÿÿÿäääÿÿ   ÿ   ÿ   ÿ   ÿ   »   Y   ÿ   ÿ   ÿ   ÿ   ÿJJJÿýýýÿÿÿÿÿkkkÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Y   #   ô   ÿ   ÿ   ÿ   ÿÿ¶¶¶ÿÕÕÕÿ			ÿ   ÿ   ÿ   ÿ   ÿ   ô   #       ¡   ÿ   ÿ   ÿ   ÿ   ÿ111ÿDDDÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ¡              â   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   â                  8   à   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   à   8                               ò   ÿ   ÿ   ÿ   ÿ   ò                                           $   ]   º   º   ]   $                                                                                                                                                                                                                                                                                    (       @                                                                               ,   U      è   è      U   ,                                                                                      *   …   Ò   ù   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ù   Ò   …   *                                                                      –   ó   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ó   –                                                          Q   á   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   á   Q                                               r   û   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   û   r                                       r   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   r                               O   û   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   û   O                          ä   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ã                      —   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   —               (   õ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ô   '           †   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ888ÿ‹‹‹ÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿˆˆˆÿ‰‰‰ÿ___ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   †          Ô   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿîîîÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿSSSÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Ô      +   ú   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿhhhÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ®®®ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ú   +   T   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿËËËÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿôôôÿ,,,ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   T   ‚   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿGGGÿýýýÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ      é   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ­­­ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿäääÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   é   é   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ+++ÿóóóÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿjjjÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   é      ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ‹‹‹ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÌÌÌÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ‚   T   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿãããÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýýýÿIIIÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   T   +   ú   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿhhhÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ¯¯¯ÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ú   +      Ô   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿËËËÿÿÿÿÿÿÿÿÿôôôÿ,,,ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Ô          †   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿGGGÿýýýÿÿÿÿÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   †           '   ô   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ±±±ÿìììÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   õ   (               —   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ333ÿ___ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   —                      ã   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ä                          O   û   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   û   O                               r   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   r                                       r   û   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   û   r                                               Q   á   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   á   Q                                                          –   ó   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ó   –                                                                      *   …   Ò   ù   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ù   Ò   …   *                                                                                      ,   U      è   è      U   ,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               (   0   `           -                                                                                             	   (   L   j   ³   ø   ÷   ³   j   K   (   	                                                                                                                                          V       Ø   ø   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ø   Ø       U                                                                                                                      %   ‹   á   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   á   ‹   &                                                                                                      ‹   ï   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ï   ‹                                                                                          Q   Ü   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Ü   R                                                                              Š   þ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   þ   Š                                                                     ­   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ­                                                             ¸   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ¸                                                     ®   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ®                                              Š   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Š                                       P   ý   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ý   O                                  ß   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ß                              ‹   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ‹                       #   ñ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ñ   #                   Œ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ‹                  ä   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ$$$ÿhhhÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿeeeÿPPPÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ä              U   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿëëëÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿsssÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   U           ¡   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿeeeÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÌÌÌÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ¡       	   Ú   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿÉÉÉÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýýýÿHHHÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Ú   	   (   ù   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿEEEÿüüüÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ®®®ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ø   (   K   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿªªªÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿôôôÿ,,,ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   L   j   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ)))ÿòòòÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿŒŒŒÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   j   ´   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿˆˆˆÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿãããÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ³   ø   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿáááÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿiiiÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ø   ø   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿeeeÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿËËËÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ø   ³   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿÉÉÉÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýýýÿHHHÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ´   j   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿEEEÿüüüÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ®®®ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   j   L   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿªªªÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿôôôÿ,,,ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   K   (   ø   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ)))ÿòòòÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿŒŒŒÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ù   (   	   Ú   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿˆˆˆÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿãããÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Ú   	       ¡   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿáááÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿiiiÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ¡           U   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿeeeÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÌÌÌÿÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   U              ä   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿÿÉÉÉÿÿÿÿÿÿÿÿÿýýýÿHHHÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ä                  ‹   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿEEEÿüüüÿÿÿÿÿ®®®ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Œ                   #   ñ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ¬¬¬ÿûûûÿ,,,ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ñ   #                       ‹   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ222ÿ}}}ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ‹                              ß   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ß                                  O   ý   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ý   P                                       Š   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Š                                              ®   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ®                                                     ¸   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ¸                                                             ­   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ­                                                                     Š   þ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   þ   Š                                                                              R   Ü   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   Ü   Q                                                                                          ‹   ï   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ï   ‹                                                                                                      &   ‹   á   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   á   ‹   %                                                                                                                      U       Ø   ø   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ÿ   ø   Ø       V                                                                                                                                          	   (   K   j   ³   ÷   ø   ³   j   L   (   	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ‰PNG

   
IHDR         \r¨f   sRGB ®Îé   8eXIfMM *    ‡i                                D"8s  IDATxí]	°Õ™n”]<QVA–èÄh$	ÊNŒŽ13*ˆq°ÂdªÄ©I¡ˆ˜D“L2“ª(Î(Ô˜2ÖÄ™ÑG	‹Áq_@å±ˆà†ŠxÈ›ï»Ð¾{o÷½½ÓýýUß{}»OŸå;çÿûôùÏ9ÝÂ‘d®(Dg Ð8	èôN º]€î@ hx¥?v 
ÀNà3à=`;ð6ð.ð&°àuâà  ±”6‰P©Ð½€Á@ÿÃ RÓ PùiZqÊ^DNãà€wp¼
Ø¼ÐXÐhÐ˜Hg@ÀÌ
:Ùâ|ð5` p"@À'¼É²™s{
ëpü*ð2ÀÞ…Ä d Ò¯Œ–È|(0ø
0 à“>Kò
³xX¬6 IJÈ ¤C|?$KENØ}Ï“|ŠÂòµáàöh $	2 Ù|/§Â . Nz ’#¼ÃW€eÀ
à5€ã
’ˆÜ¶ˆúà;Ày •¾ ñgàs©h^  IÄÈ DL(¢;¸8 ÒHjg€cH|x 1 ËR"Œa€ïôÓ• GÁÙ@…è9`/`%0è
HÄ@jð½~,° ÛK
Ÿ,t).ÎèI‘ˆDèT¦Oû)~º°Vìu$b èª›
ÐU%¥7“ƒ¨›ù _É$b 8Aç×À€ßøJö3` 510wQñ?¤øvrðÑá:ü2þKÄ@ ¤øv*{%#í‚AZ€å’^(õÏ=ñ³g \ãÀWƒÛ€É!:àß,`à6ýÏ643:@’c.FÙŸ¤ðùä€u?Ð<'áÝ€ƒ€”_Üvp: É8Q¾›
IñÅ·
p{3ÎóÐkHÈ¢ŒG¡ž¼•®cñÑ¼
<62&‹
×2uCÁÿàÚòæ•­ßâ¤Tø3Ú
½ê
€›…;î¼”ªd/~m€½.ø’XÆ@{äw.°ð«d]G•Ú {lKÜàEbœÿý(P©RuMüTÛC›ÒÚÃ
Àdäï])¿Œ_Lmà=Äû=@bœÍ÷K€ÛGUkÙ^œUÓØÆØÖøš)1€È»gÕT¢ÂŠ¯°m`9Ú\Ú®³ÀQþÍ@ØÊÔýâ°–6ð:ÚžÕ^›w¬òï¸E—D¤Á ç	ü5°àºëÄFÐ,ßÜ
ðX"Òd€mð<€nB~òì@´¸÷µt×tx‹»
ü;ÚfÞ>ñ“ªíI8µˆ»¿8Ó¸C1Ûª$B¸•§e†©Ý+þ’jl«ÜEZÃÇ& ©ÊS:â:Š6°möë´ÿ\G1¥ç`¢¨Å!“nl»lÃÆŠÉ^€Q`í·@OcÙSÆÄ@e¸Í·º¹ç¤qbªp•ÿãS†Ä@upšº±FÀD@å¿Ð“¿º†¦Ðæ2@#À¹ÆõL3 £A’”$H2Ç _hž¶FH#rq(íÿOàDƒò¤¬ˆ¨àrunGOWaêbŠ &–SgDñ3ÀEDçto§*Ç¤šú¡Ä9kŠÝ~)¿•¡,$Â x¿RŸ1˜vàK áÀ9€DäU(ðw®&LEÒäê©»€S)¹é3ÐY8x8 $.i€(íŒÄK¬Å€YœŽìðaÈ]­—´À4”ôÇ€	c‰“®Å@3¸fà€ó•4Æ Æ¢„ÿ
Ð/*bàüþ Çþ˜$!I€~‡Ø7ÉB*-1`	o Ÿ º	‘$»àÇ¡D‹¾‰”L‰ˆûàòß êJ"’äÀOQ¢Ë)•ö2@#Ðx4‰"$e ¨ø·Iö8’àOiˆ8ø"Ý ¼GäÞ8[xÄt<ñ.´´7&‚m&ØŽR^‹³tq÷ Ø•á.¾§ÅYÅ-2È ½d§ ûã*_Üà&d|j\™W¼b ãôGùö«â*gœ¯ £‘é‡ÄF4ã"IñŠØƒ´/ b1q€NÈðãÀY€Dˆp¼ŒÛ9îãpÑ}w\¯ ó‘Ô¤£“Ó1 j`€èOûŸî­xK=€ÑHñ÷ ÷A“ˆ1
Ÿ#¾
D:U8jÀõýtù©ë$b bžA||ØU¼Q¿ü26%ªÌ)1 Šè…_
Àê¢³!~DÙàºæ• ¿à+b >A´Ü:]ÑE$ˆ£50òGDhRÑtèÐÁéÝ»wRÉ)ðPÇ ‘èn$‘ 3ÜÖë@bS§Nu–,Yâ´jÕÊ²œç:»¡ôÜ;ÀáÀßó@£`Ç|ã–-[)“'OVýÙÕ†©sFxÚ®“âÛ¥øn}Í›7¯ üü³~ýúÆºº:»ŒÀQ—©J_¤ÎUKj8–q0xðàÆ;v4 Ìž=[õhW=¾	Ýë	¤&·!e5Ë8hÑ¢EãÝwß]¤üüñá‡6öïß_õiW}þSZÚ?	¿/`Ÿ;vlã¾}ûŽ2 <±hÑ" »À§ÐAî¹‘¸ÜÕX,ã mÛ¶+V¬(©ü<¹wïÞÆ#F¨^íª×;“ÖþaHðc ûà”)SÊ*¿{aùòåpÊØc89(Ñ^€žþö4Ž&E¦ÛoÃ†
®žWü/· uÆ=±^€žþ*?{k^·_EíÇÅúúz¹íªgö† UI-‹è{WU*
œ:pû9.tÚ·o(/Ýºus>ûì3ç‰'ž^Rg€ßäÚžGâÌI_D®‘»žåÜ~~½ ¹­{
øúÙ?N0‘7½SêØ.Æ×¸ÿ~?}/y]nA;êØ£‹³ã2 ]ñFOB2C?·_I­÷œ”[Ð:°:Ú=#ÀOzKé-ã ˆÛÏ£ï%å´®Ý?jÐþIÀ®†PÛ¯¤æ{NÊ-hUÝÿt•:™œƒ˜øõ ,â ·ŸG×KÊ-hUÛç¢cƒhP7 ÿÎ¡Â˜Á@µn?¿\Ó-¸k×.¹ýˆ2ã:õú ð`ÙáF„Û=ý-á V·_ÉG¿ç¤Ü‚Vé Ýõ}¢0 WIù­ªøFºýÊ­öóèsM‡rZÕ8pJ¸QÜ*@OK8ëöó³
rZ¥ÔÝ–a, ßûwË ØSéW^y¥Ÿ‡¾.· 5íat7ÔØÝ¤üÖTv#Ý~7n­àA"¸üòËÕ+´£WøèpMÂÅ/ªhK8ˆÒíçgä´F/^„·«ÅŒÀM{e ì¨èR›|ú)qØë7Ýt“æ?8'àµ€KùíP~ºýî¹çž°ú\õýrÚÑ> Ç·Uk ØeP÷ß|ë^xÇéöó³
‹/V/Àüvòô™¯ôå„ä¢*×pâvûù ¹­Ð¾ÊŸ]JûË}óˆk8(•ˆÎÅÇÀÄ‰Ñ£GÇ—€OÌmÚ´q,X oúð”òe.â˜^ ¡QxÐÓßp’tûùõä4^_ƒN—{à†¾øÅyÄ2 †s¤ÛÏÏ Ð-Ø¹sgµsÛÌÐiêv‘”Z
8
!~PJ?Œc€«ýîºë®À›|Æ] ®Ü½{·³zõê¸“Rüµ1pnãÔàzïí¥º¼tlpû9³fÍrºvíjTæ®¿þzß4*OÊLã‹~•øÑçžÔ•3˜ƒ4Ý~~¯r­;ÔmêxYŒ+üÀ€€¡¤íöó3 r­;Ômêx“4à÷Å:7]ÕqLš4)U·Ÿ!rú1”êuê6¿ìÕ$Í
À7›®èÀ8ºwïîÌ™3Ç¸|5Ï>?î\zé¥ÍOë·œëÍ†× ðø,ïE›ÅÀŒ3œš•©2¹¹å–[œººº2Wu:E¾‚´›¼^p.H1cJºtû]}õÕB˜uéÔSOu®ºŠ»ÉIc€Ož¥òÄ%ƒ 
 ÆAZ«ýüüü®kµ ‘ºD?Ç5 Þ@Q×À
 ÿé3Àwê+®¸"ýŒT™ÎSÀžUÞ¥à13Àî?ûâ5 M'Ý‹úŸ>pûþZµj•~fjÈ
×ˆ×¡Ô‚n©¦±>× ðÿi5D¤[bf íÕ~a‹'·`Xc¹Ÿã -¼1ók¢›½ÿÄI«ýüÞ÷ý®kµ QºÅ¯|ókßMËé(92È@’t°ÉíçÇÝ‚X-èL×“a€úN4€“qÜž'$f0@·
@V„nA›Ü˜Yá½L9:â|/^sÇ ú—	¨Ó)0`êj¿°T\wÝuZ-–ÄèîÂ¨\ 	@Ñ:¦±cítûùœ{È-èÇRb×û1%× ôI,Y%T‘ÛÝ~‡‹rú1”ØõÂCŸ€,¼$–´*Ë€é«ýÊf<à¹0zþŽ¥èhÕFü„û¦ ·Ÿ«ý|â€¯8Z-èCRü—¹Tg× ÐHRf€‹glYí–ª¹sçÊ-–Äp÷Ó'+ŽÃèî¶mµ_Ø’gÍÍ–îçC¿{ ô	òÃ’”ÈªÛÏÎ™3gÊ-èGR|×¹7`G€Þñ¥¡˜ƒ0U·Ÿ_ÙµZÐ¡Ø¯ŸD )À±ó\>¬»ýÊ—üÐ¹ýŠõz N–¤Ä@ÖÝ~~´Ê-èÇP¬×{rs€¿´@¬<—Žœ›|.]ºÔ¸|”Îm|gûõëç¬_¿Þyå•WâKD1—bàM½”¢%¡s\“·Ÿ¥rú1Ëõnì\–Æ’„"-É Ý`.4æÛ~%3™àI}[0A²$µ“= -Ò>BH"G®Û^r„­<ÂEBGÝi Ú%”˜’9Ì@^Ý~~
@«ýŠüú1Üì€†@’ tû-[¶ÌèÏ{%@CÙ$ðmAgüøñÎš5kÊ†Ñ…ÈøœŠ/åŒOÿˆlßäÓ¿„áBÐ@.X°À±uäp¥Oüî6œ—x²9MPn¿`ß·o_§¾¾^nÁ`t…
¥§(úª»™ƒ\rûùsÆAÒyóæéÛ‚þT…¡@h
ƒE0lØ0çÎ;ïtÚµÓ˜kÆ¸N ¡¡ÁYµjUà
S#ì|^ã½º- |¢ÝpÃ
N—.…­ØÞ¥`×^{­zLñ6ƒƒ4 ŸÄ›†bç¨öe—]&"ªd€sÎœ9UÞ¥àU0ð!
ÀÁ*nPÐ*`—ÿæ›oÖ¨v•¼¹Ái8GåþÔÿhh ØmœŠÍËÀäÉ“sÏ=×{JÇU0ÀÕ‚óçÏwZ·æþ’ˆø”ƒ€ì›ö8bEzôèá,Y²Dïþ![CŸ>}œ7:k×®
“noÆÀfö >jvR?#b€ƒXˆ(¶üFÃAT¾FÕÕióêˆ[Á{ì°zvÄç>º¡C‡Êía+[0B2Dµœ=€íG~ë(
øÄºñÆÕõ‚LO×\sÜ‚>"8|‹`[)
&Lp8ø'‰–öäŒ”Óí4 oGeÎ#£ÛÀlÙ’_\“DÍ€Ü‚‘2ZØl¢Üi´9ŽŒ
täÈ‘9f Þ¢Ë-¿œ¼‹=€‡YÌyˆn?uQã¯}XÍ¬ÍsAïi >=ŒÐ1æ=RÉí+à +
­Ü‚¡¸.2 šŠKì«·ßôéÓCÆ¢Ûƒ20hÐ ‡Ë«%53À5@…MA¹%˜¦×Ì£ãÈí‚¼·j[õä9Î;¸û _(¯ú§¿µ0ÀÕ~rûÕÂ\¸{ômÁPüÜÿ®x#TT9¾™n?¾Êí—N# á•×¥&î}× ¬¯)
ÝTVL¯!¸ßÔjÁªë`ïp
 ß8@RrûUAVŒAå¬šÜ=¸ã-Þå€÷pLHª`@n¿*ÈŠ1¨Ü‚U“Ëõ?}w
 ]ìH2@·ß´iÓ†V°¸ [Ë¯%àôÿ‚ëß5 8±)Ð­
T`€›|rZbZ-¸.Ö!da+@× ðÎçßžó€Zígf[0p½¼æ†ô žä¤ I´Égr¸$· o%PÇ_rCy
ÀVœ|ß½ ÿ¥à"mòYšÎÊ-è[ lÚÄk xAã ø“Û¯9]¢[pÒ¤IåÈ¨¬pP“ÇÏk ŠºFeÙÌÈígHEødƒnAm"Z–$Žõ5}„›‚zå8üéô2røX›|– ÅàSÜ»w¯³råJƒs™JÖ~T›fþz{ ÌÍ« ÷xÐj?jµàQ•EÝnò ðjsÀùÁ|GxÐ·ý<dXt(·àQ•EÝ.¬p¯47 Üð)÷¢þ;…Ïysµ_«V­D‡…È-XTiÔí¢ý?› †~¼è–œÿÛÏî ·`Qý=Vô?šòú^à
€‚¹ºý–.]ª|XÞ
ômÁB~€¿?ŠÆøJõ ÞD —·äüÜ~Ùh rê‘óÿ©ÛERªÀ…AÝ€óŠBæìÝ~wÜq‡Ó¾}ûœ•<›Å•[Ð¹5ûdóÚ-Õ`˜5 ?KqÝ~l4’ì0@·à)§œ’/I‚®(¼œà‡Ø‹ü…¥nÎê9¹ý²Y³4èœ!˜CÙˆ2×—*w9ÀÀGKÝõsî&Ÿrûe³¦súé¶? 6Ù8JÊ |(òuwOä´d°&K)‡nA¾Ê?RšÒn@7,·º8Á=‘õÿrûe½†•nÁM›69k×òM7óÂéý·J•´R€]†e¥nÊê9¹ý²Z³Ååâ /?áž“o>ŒÒó•¾¤”rzrÒÀ óó`åöóV{ö»uëæ4448«V­Êra÷ p³ îõQRZ”<{ädK.F9•½#~Tâ¾ûîs.¾øâìN%*Ë 
ÀðáÃuë8G&“²¥ì/W:*x%á{Ã}@¦
 »‚lõõõNc#çAIòÀÀ±Ç›õiÞ÷£Ë*?ëØ¯À0}€g€ãùC"Ä€pÛ¯³€Šßû¨4è–’Ò(bÀ8€_QùY” €áîr7'€—ˆ`·ÿî ùj ¸6à… *Œ©3ÀWögƒä"¨àl¢
¡Âˆ1:ì±Sg}%È  	¹¥P?÷„þ‹1`›£¯ÉYÐ ãâŽ"‹‚Dª0b@¤Æ Ýö”Ÿ9¬¦Àðý¾[tá‰F1À‡ôp`kÐ\UÓ`œÜRø·A#W81 e`)RÛZMŠÕö ÷€[uæ‰F0ð	rq.ÀÕ¥Ú #^ð=C"Ä€9P'«R~f½– ï
pn€zdC"Òe ¦§?³\K€÷½¨@&$b }jzú3Ûµö x/{èÄ1 Ra€#ÿ|÷çÆŸUK­= &Ä^€æTM¹n‘2À9ÿ5)?s¦Àû{O'ó‡DˆDà’ßo [kMÕoK0¿xÿŒ ÜTd‚_@]b ræ ÆGÃÄ¶À´; «€¯ò‡DˆDàêÜ1ÀgaRÛ`ÚÜ'`0ˆÂ  ‰>\ë/ù„ñ½fÐùƒøñ÷„ŽÅ€ˆß!fn÷Z¢|bŸ†ÜðU .t®åà¤ŸÑÀÚrª9Å+€›ý‘­€±î	ýb rnEŒDk”= æé8àÀÙü!b RžClã€PÞEÙ`¼ÜŒK†'~ß@‰ Ë}*°!`ø@Á¢6 Lô
 ;À	$b@DÃÀ?#šÈgÞFý
àµV”ˆ1ŽvýÇ;ÃEsôÝQ¹›ÇÌ=É®ö4¿ ßb@TÅÀn„þ!¹ò3q¼0^ÊV€ã c ‰µ1ðÜ¶´¶[ýïŠëÀM¹=8IˆÝ‰Õ1@Ú…@Cu··`N¸oÀã WJÄ€Æ WúÑåÇe÷±Iœ¯ n¦¹Nàmà¯€¸ÆÜ´ô_d(Ä4`EÜ…IÂ °¯œ"ÌµË1 *3ð+\þEå Ñ\MâÀÍ)g	rÁ¦
»Œè¿8š>õ¿pô?vIÒ °0€Ç€~ü!b ˆ­øÅ$'Ó%"I¿“¿ŽRýÀi1 Ž0°‡? S~&Ô Ór…ä’Æ€¤{ nô_˜ÄÀÈÌLà?’ÎT€eäÔÆŽÀ7ùC"rÎÀOQ~"qIË ° O 8?$b §Ü‹rÿ#@×_â’v¼JÌ™‚£/¹é3ð'dá/ÈÖ÷W[¤¤›ço'Nü
ðlóú-2Î Ûüå@jÊO~Óî0”À2` HÄ@ÆØ„òÐ+–ª¤ÝpOB® ÞuOè¿È(lãS€Ô•Ÿü¦9Èô½ò~ðcß:x/èXd„.ðù°Æ”ò˜d ÈÉVày@F $H2Å •Ÿïü+M*•i€Ül8O@F $H2Á •Ÿå®2­4& r´
POÀ´Ö¢üÔÂ€ûä7NùYS
 ó¶ øÀYƒ1`ðã;ÿJS3n² g['‘@W@"la`32Ên?'ûHB2p
îhÄm€mu ‰“×j@F@˜ÜV ²­Z!¦¿xIä”ÉÿH®y™Ñ±)üù>ÀåZ!6 ºà”aÎ`äþ‚¦ÌdDV$9f€ëù	pM¿6»I¨!LG:\LdrwPyË~ýPá§%Ôæ•L3Æá7çTKÑÄAm€mo|³6©Ÿ	3Ðé-Òh J3¿¼?Ž67 á¶yr¶”"€ûþàgÈÎ4. $±1À÷ý_¼[*Š¸&¸¤˜S/õdq´Îìãä‰ÁCÞâh Š3¿¼>Š6Å¶%±€¶Èã\€#´RZq¦
ð=lK|Å”XÆÀXäWSˆe j5 /¡ýÐÓ$±˜:äýv@½‚ †€Î8Ð×
d„1(‡z2~Fà)´ùö3¢ôÍ‹ÁÞÀl€®C¿† ëùâè#´‰›í=².\Lt? %Ñ N$9b %Ê:àþƒ2ùä€u	 É1|-˜	ldòÁ÷œœt $b À@?ü¥·@† »FàcÔïÏ^€D”d€[9ýà zÙà€ŠÏ:
HÄ@ ¾ŒP2v )~ ¦®@•àüïŸz5°Ç|€úÒ¿R«ÖµªàÁ|`# W39Ø‚ºá<î"-±0Àï\<ìdÒå€uÀoGLz 1œGp°à—e’å€¯d‹ .øj
HÄ@jôFÊ3€•@ c{s<ÿùJ&	É@‹÷ëöb¸ÙÀw‹  ²§ ©nÁµàvðœ²û< ‰ˆ€ˆˆ,M;œû*p>p!0hHüà{=•ž»ðüxà]IÄÈ DLh™èÚâ<'¡Œh8Ç@V Á#ïã˜Jÿ°àfû IŒÈ ÄHn…¨ûãWŸ}àNÆt[uò$Ÿ¢°›§å þ
@’ 2 	’]&)Ž† #€3ˆ“,	=%¯TôÕÀkÀ&à  I‰€”ˆ÷I¶®Ó³ð Ù[8	è	´L–]È]tïTðgõÀ6à-@b2 U†OVºã:
 
A?€¯
} .iî|	àxCœÂ÷rvßw; ÎÀ#ê>éi 8_b82 †WP€ìÑõè Ž {'n¯áÓ8ðz;€Æ¤yÝŽsŸ œÃ@¥¦¼P¡·o|ÂSùih $3ðÿ@ß¹jìŠá    IEND®B`‚
```

## FILE: src/app/fonts/GeistMonoVF.woff

`$lang
wOFF    	    î$                        GDEF  ñø  À  Œ‘$GPOS  ô¸  Æ  ¬2p€@GSUB €  ô  
„Õ#cOS/2  c<   R   `â?STAT t   q   ¸øäÔëavar è   .   .@
@cmap  c  ì  ::šfvar  w´   \   ~‘w¡glyf  €  WØ  ¬ÄóÕ"\gvar  x  yå  Ð:Ì
-Fhead  _œ   5   6.©²¥hhea  c       $Chmtx  _Ô  E  ¾V±ýUloca  Yx  !  t@Ðmaxp  YX        b ÿname  i|    àÔTÂpost  kœ    ·“öþx¤|`GÖÿÎ"ƒ-Ë’ I¨X@HB
HPA P_!	!÷&÷Ç±ŸíôÄ‰¯·Ú—ê8×ÒËµT;¹/ñuÇgûr)×Kz¿hõ;³-6rrß%†…Ÿfß{óæ½7ïÍÌÂ¤3£ÓëÐ•
=£`TÌBFÇ”0åLSÏø˜.†	ÔE®Ã©âœŽr¸:r9'×ò\òîÀWø$ý£(Ü©?ºNt¥ð+Tó—›Ê–,i5”-)»©lßM7ùýKüKÊÊü7ùûàÍS{ûMË¥_W<<µkýúhõÓÎ¼êèúõ;ü†%Me\Y{™‡Ó¯ÐvÃgø7å.«.ƒË2ëg1Jè3äÐr
§5èïì85úøã£×¡ÌRáaöØ”‡Ý5u5Êd¦§É=ŠÒŒp?Ã¨9L%ó ÅS¼€a(.oŸOñäö:Àfñ=WÏAG;}J†o¤xñé6Æ“p…ÂÀüŠ™•ÿaÚ¾púE"ŸÓŽ²-èÈ ~œœŠCjNñê9zûíßþ}sërçnfñüÿ³Ÿ¡R4"Ü¼™8Ð°l¦€1Šš¶çåæ(•œ_9Îär6X8 ª™ùnû%•ÑºñÉ[^EU==áC‡ì¡P×Îì±Õ	[ÈªLô&Ö
úÜžÖ7P«Çån~ac™~øœ[db‹³ÁåN:•ÅÂ•ÊÜœ¼<‡ÝåÖãÓû|ó‹/ÏK¨›{­ÖÞÆ–á¬ñœ+WfÇïÚ¶ýîøžMÊîþÀÄøþÀèÐ¼‹®`°î0}¬£,iìmÌƒ)ð|†•p“(„³
½ §s˜¶×1HFgÅ5"Î°XvÐ_:£%ÚÃê£zS;âG×tw_“8‚2¶m›ìéa
ýÏ–-·^wÅ•‡¦^ž„–1—ÈHxN øØ	Ëä®˜ù£–	^Í¹m
Žé¨UxâºsØ¢«#èêdÎðÂ¼5@s!¶ úý@¸õ
÷£åB{lðÏƒÄúÁí±~
$={™‡RàùŒF†‘â:F-Ã÷R\
íSáÚžÒ—|ìï2|Å‹gÚƒ5²ÇŽ}ìÁ”ò‰|a‹a|½ìIâ`¡åå†lSUîg©Žý¬ÛPÊ:Ní°=;Ï>ØàäÕã9]Ë‡¾
ïï³GíÂ·Òm¡Úìømkí‘m­}þùíË‹ïÙ°æèrÞ½>]ï&z_	rƒÞ3ˆÞÝêrüÎ­D
Ûl6´W¸ÜÅW
ÛmÂm3>T	2š.àC.7„i5W.ºÒË;Û[.\r0?®é÷¹{+*ûëº«Ø£Ÿô§ç/íÏ¾ëâmGâ{×*ƒÄŸ\Kš…oI§¾P‰ue&qSŒ_¿âùOn¯›$¼R”[ÂYEé4#£¿‡¶×Ðö"¾‘âÅ"c”xôßÈX.¤˜¨$†JÏîïêÚ?°ôè`Ü×<R]=Òìê«ü>JoÛ5€ŒÂËÙË®^stÅ¥+”m½—÷öìuL´ð¶U_øWDÔyœƒc,x7’J
ÚUëÄ¡êˆÁ0Ùb1*ánƒMyÐ„Á ÜÎ0i¢×²­p/™‡BÜ‹à¥ÁðBwÇbÂƒ±X6:(ìb­S§ðŒ/ôU™yÐæuZ=;\ý€Ï'~{1P„®rjˆüý÷Ý‡½ï>¡k5N½ŒçEÜWÝì¼HñÃ§´)¾‡â0Ï¥Ä5³í)}:ÿQ|#Å‹gÚƒoV²Ç0N|ó.&•œdžCŒuú-$à9
{¦³&¨'=,¯ˆDº#±/lÈömŽÌŠñè”`Ýy5Ðïe»1Í&©ï?žP¦¸Ž¹óò‚uD¯0ÞÈ§P©9oé×	ï ãº÷ZÅ±>†<ÂIa%ZÚ!üËŽïÃ|¼’Oü
óñ‚í=	Û+Ùÿ•˜èü+cUèz1ØN-¯Ä±–´Á4[ˆìÓ×cšÒ½Î*òÒxÉñÒ\F¼NÿÞ*°BÆ0ëæi	ÇBÔ`^XCø¢í_Œ~ÝB˜=S»ÛÒrZ|Up×Î<h=x06o”Ý9u-Hü(Û5åÏ§qßBÒœ² gn¢Ã(Ô\h—ƒÐø;,?å×w@fÒ÷1(³Íópš›… @[Â¡ð~>š#AûuÒüÊŠvãtàÄFA%C‹Ö”éG‚kŽÛKJV,oëU$d’Š¼p\²³'A'e4þÈægƒ,ºÈç»ˆçñ»»Çjíq“÷ìØ];/·¿ûâwÅøöý‰Ä ßÄþv¥\ {V?Œqê«ßƒqê«)è€O¦Äs«ßˆqê«Œ‚öYù
'F0ÄÙ/ÜstvPˆò÷ÏÑöäTáœ*H!Gˆ €÷cÝ1åçkß…“£(C+Ë„¿š¨¯O´¶&êê­>·ÛçklôíDèÞ;îøð‰”PÆïÞ¾í®8ÿ•ë}õ«‡®ý*{'ÉRngÁstnRn§æšÝŠlòz7EÆa``h×.ö˜cY °Ì!ü­ëhkë ic$Z. ¥Z±í„€ˆJÖ¨æ¶€ÿŽ¿øŠ+.>^‹ý­#ÐÖÆo]µf[?åÁcñ¸|,VOÖ°Š´¥·.}aŽ‘ø…ðw×…Œ‘Å>•2ç2¥³•ª</O§ãÊ\¡S[Vw–Ïë(5#êyž–¯‚FúúÂ²Ç¶®¨ë«Qd¦y;^xÒ^-¼‚¶|þA˜ñÛ<<Þ£’½3¦Àó§ß¡þ2I8ø‰§6©¾¨“æˆR§
ðyVG:•˜ÓaÝèJY¬±]RÆUµÝöú §ŒŽU4­ïêœôÏ+ËÛkÛ{K:C£«jü›»²}›º”Îˆ¥ Þhª·éòìÎæ„Ã³º]i˜[ÆJ}NAó ×=R‡ýØFëŽ„Ô¯
ÿ<œæN6Z$H=ò&#£sXÂiNxeRûR†èÁ_Z`Ì3èrrU®«uJ
Q©œnQ	ÌMˆ;Û·;àß½òJ{¤|ElõK÷»›cllKâ)T¿Ø×¶²‘7x­­a„†Üê¢÷	«4Oª &ìƒCèwìüßÅØxe—Ú€Œ+à¥Bœ—(: <)¶[A´=ÕˆWÊqÚW/è¦ûŒ9Îd‰ÁöÇúº»ûbû·dß°ì##âu÷
@“Ü‹eX;g)~˜âP%¤ÂIü¥øŠ«i{JŸÆß8‰¿ßHñbJ¿Fì£„³
ƒ.´ýÃ´}aJ¾4‡¢¹¨Š¬¦haÏO<“ÿLâì˜’·±7Ly’Æ5Kj'µUÀËoLïíOoŒwŒGÂ}ØŽ©±_…I²nêçŒíŽY½Rü0Æ©þ(¾‡àTÉt¨þ@>;à)?ƒ)dÃKC<±ò+_YþÄ3+¿ñåhZ&¼ŠÊ„›…'üžÄic>Ø+¹–=¹üæ›—ÿ&†Œèá	Ô*$„—7n‹yïžíÅS÷â{(Žû‚ô!NÇˆömÌÈ N… I³£CÂ•è´°}UÈˆ±¥ƒ±©×±
ö˜Î~¹œI8õ/Šï¡¸†ÔˆA»Ñ(ðºìHÅ!f4ÓËú¯¾ú™”yeY.\Räbe™ë:á­RZS¢ó¦
ÆÉ˜4etžìÛêíß³ä6¥r™x¾wÿ~<FÖh…ß¢Rá5´­ÝçL“ÐÅýºJê¯žy0ž?ýÁqÝyLÂ!nà¹á:ÒëÈÏSE^¨‚œ»zy	l/×I±ÖuRà:x'x¥(—„ƒ¼.´ýÚ^#¶§øFŠ'­¤ë…`³kX—Ð5,“¸F×D.£k"\ÒšËnŠ›È
©Ï13Á“êÀƒ´~ã’ðK(n’ç¨¸}7mOcÆ×RœÆŒï 8õ'Œï¦8µwÌw?åKõ†ñë$œ¬å¹¦ßÿ+e8¦vÆ2ÜnœVªÊ±äŠé¥#WÉ-å’n9UØdö×ôÞïõ¸Z2Æ²¶.]—¥6f;Pvúú /lºÍYå¨Î0µW¢jS PW«êß¾ê¬&3Â6x:"æöê}ºÕh® cNd9
2ÞŒm!§PŽŸ¡xÁ[©Ûçžª½îM9~œâê9èhŸ“ãQ¼˜Ò©a»ØR‚ãZþ™Ùö
–¶/œƒ~‘ˆ3iÌ"À£ û\¦šiãL¨Ÿ$m:nvuØ”bP`T.×ÌH¸ü7t„,
ôqšÍRbHÖv„ûzºÛ†Ë8}Éü¡EÝ­‘nó‚®Æ«¯¼R_ˆ†L‹Uõ?‡¯¼òpóEc–Á±Š:Õh„z†³óºÛ`Ìx~óæ‡C½ìPW´0kA}™±‚EÁ`°ŸÄ½~Ü·cà%zQþr•¸$s^‘B“óŒ˜Nåsc
Á5n÷š ¿'Ú^2›ƒuu¶~Xc0Ù;.åùK;ú×'&kÇ|Þ±:†Ô×À§tU,_R ÚTYooöz7‡›Þ…£ŽðÐPØÎU_2šÑ±ohh_GÕ`³²Á3™HLú=Ê±I<>˜6Ÿ{‰Ý¹™”xþ¢Ü$ÊBqý§òög(®ËãÇ)®É º³>_Ò<*ãÅLZÙHýûVXC,—*t1·3h6‡êÛ£=¢1»I˜òôÛêúëÆ¼¾±ÚÉÄø:ày\çƒû°­æ!«xÅx¯ä‰ùsÔŽìgH€º¦¦vÍ%ûåÈÔwæ”„Ø»xÖ²¿ž‹˜œ~ÖeòHå’[Î^ ¼ý²ç'~é»tYÎžouü]¬?ÃÁÍ~ïÆp¤°+20a{7´n¸êŽáù‘E{Ž_>_ø—G_ßÏ×Ð%-ý‹'zÇÃÃ	¬÷vÉ–tLirUk˜õ:
v)Ã?657oè
®oö¥
„ÌxîÅƒWD}þ¾tdU6Õ¶o¤€©­T…ÇÐáîhô.ñ8z×9u“
ÏWÊñßQ\7OŽ?Kqµ25®™—š¾öe9þÅ‹iû¨Šøü”tŠ$¾^Àó }ó;ÊjžÀ53ÝOÉÂ˜#WªµTËý5ùú×Ëümè)ÁÏîéŽXŒS/°
Æö ·î-eÊ˜ê¤•N'1É s`LÀ&\Ôßžð/]äoGs†“Íž5ícšþ½«:,È¬	ööuÜf	Õ(­V'Vio»¨»û¢¶/h&&QfU¿ËÕ_µdpp	ô‹È}÷I2Çp¡øiŠçžª½nJ†+æQ¼d¡¼ýqŠk¦äøc/qFñ[
Ÿ8¦ü4ÉþGÚAå¨LxÕõ9t„Z"ÂäçÒYÃÅ1+‡¬ábþâPW…½>=3ÞÆOðîÆ¶(ý%¶µeÓ¸p/òE»û»„g`Ì$
&_¤’Ë¹SQ*„îdb_Žì;Ÿè¥kúÏK5ÊršƒÕa¿Ht^BtKp
Ù£ ;âÒ°^ÈÌó¿E¯útQ{¬fêH„Õˆ¶Jé¦ôrºäøŠëD>)ø«KSã WJúÚäøc/žiyÈ ¥c:$9Á¤¦W$ñßg%Å÷½Dø/%¾Hp
ñã‘Ùe¼w³é‡Ez>ØöL:*þ­2ˆº	°G"”&«^„¦ê”ë(žÏž¡¼tKg÷`+e{P*•«r¹8Ø-¿<³ú{kEÛ©E%¯
?ÿhÓµ˜ÇôÇ´æ9-Õ<c$—§5ÏiRC, ý!ý—âR+^z$&¦À#mÒ_z ÜM†›5EºÃS'ØFA¡ºÃ¼~ŸTgJ4%æSæÒXTÎât½Fý¥Û:9±àÖ©4çHòúke¯¹åÂ íkk‘U&‘|ý©”±ˆ:ÓÑqÉŽ£LúdíQ¤/ðV×4(Ó´ÔµzøR}ž^Ã—ÄwV³“mv´û»â«…Ûl.öØ„ï!¾Ã‹?`ž0\lðÌ¡<“½t)pÈœhçÍ-=@óª¡-c¢ƒvGûº„§A7˜¶×‰ßÔÁ%ž¯”pÐ%ð¤x©2uû"Àá
í×‰íaœõçìw¤’••ùàÀ“EšËV,oïaœÛÌCÌ]J¬Å_x%þõ^ÈJºÄ¥+<0_RŠ&¥¶bò¹vbb-î¦‹ûô7¢›JF†Ÿ¡¸nZŽ§¸šaRÒÑžJçZåøc/ž&öÊÞ€ç-SF÷>æì-úýˆy"EŸÙÒ©“)»Z®"†äˆé€÷ášÈó^ã\5‘þ2ÍCñTÅÐ/»­Ön»£»¢¢Ûa±Ù,f›ÍŒ:*8£Uy^DÅ'ÉøºõñøzÔ
¯R|»³`Y9â2Œâd­æLIåO/›¡ðGWÛí«£õ2xTÛ×¬é0™µ¬f—Ò×Ö½/Ý×]ì0d
õU=ÚÚ:Z=ËïØ?íËï˜ð›0„úøÍŸé_P­ËdåI‡
fmÖ;5†3ÔwVvþ	mÛûÃ€ÉÔQž_Gó3
ŽbÂ­Í§Ü55zšp"F!Ë*f58Rê¨F¹¸?dŽVÃ·?†æÏOooÚ¸¡ÜUÄ_‹®v?
³Ö•l -Zæ­ž 3¶´–Cê·ˆo
À%ž_.áxÍOCñÒWIÜ…ëÁ&ÏPÏÛf!j Û,Ü»«<i£ó»üÞÖ¼ææèˆ¹v¼¥eÜ9tA ¡ÑSèvÆM;µ¥ÝÍqù%¹é‹*!T‡+ª{ê”¶›©¨L»`‘µ¹&8 ²a°ÌŸ¾Øà’Ïggp“(3ÅõoËÛŸ¡¸Íà•IíKYÒ÷(|ÑCÍV™=57Uy)›¼Á"î°èòÄtŠº—ûüKœCaÔ4înëhmµEªk{ëÀé¼† »Ü£f=+ª]iê´ú˜»%^Ó_ÜTaó– 4€P‰ËXçÓ·TéèR/ã¼ñf2Ÿ/•v?Dû@â|^åÜ
7¢“BeW„Í˜zÏÌIÉ›bæ^:ÃyçPhG?ÿSÌø}9%Ð¦£(N3"„ë¢¼Ý1².õ}³„ƒ¾
Œ„W&á¥v)ÿ™~}¶žsÞ>çÜ£‹yw“¿‹ï_”ïÈX¿
Oõ„:‘wêËTm@[¢c”Ä&8¸PüÅ>Në>’ãÇ)®†ö©èk™Ï5ÈñÇ(^Lé×°…¬†à8Cýúl{KÛÎÁ·èc¢3|1‚Î ÂÛœ+ñío'ž„ÓBúÑÔÐ&GÌ· MiCš)\N"G‰µëB¡IhB[„/¢Ç§Þ@áaà‰ïÃ<5³ó0ÅÏP\7-ÇcœÎÃ)èhO%ËNöptn‡BLx¹[~ÝÕ+}rùW¾²e#ö¹ç„O…wNž$÷àx¯a²I6îvsdGt¼k}EEóµ%Ï&þç‰—²¼Î`T­µ³ó…ôéÞ*+–ßeÉ'}ªfdøŠëX9~œâj“’ŽöLj¼HAú:_”¬&yOgõ£Û„ Q!Ê£^8DjÒÓ)%rV¥Æó‘?Nq
Ñ=ÙÓÁgG/O™“—1©óË2)ì…Ø8SHÏÚÎ-òeW˜„’—À1X×?ú8jó6úŽ©·Ž.ßQæ$Z›¢åG­Îªc[5,~›ÛöjUßØÖÂƒVWÄÜå0VMxœ_ÜOóì8QüÅLÊöùŠÔíu¬?Nqu
:t\)þÅ‹)1ßÁ8ñãÛfÛ+XÚ¾0}jdÏ!ƒ-ý|ëž/¬ª¯_ñèø¨"oØêõÁ†žh´'ƒ¤•ÖÐÔÑÊš~w¼Á5Þ¸=ÆoÞ„æ]Gt*š
ÅÏP¼à=Š'µÏ<U{Ý»rü8ÅÕsÐÑ¾ Ç£x1¥SÃÖ`Îœ<:Û^ÁÒö…sÐ/\Vë¦˜ÅW4Â—Ýr‹ðÓO>élcýSOéK#ì±ˆ¼ÎEÍ©ë\ÀIû8õ)ŠËêÜ>øR{n›,Å½¯é_Û?+®r…_Èå¡{%'è^	÷¦|
ýYº†nZÄÈÖ)_ ë”\Ò:èÓ7)Ùz›HçIBG­•`üE‚—ÊñçJænO×d(nœ®ÉÐµ—§ñß_"÷-“×C'h=ÄMËçBÀ‘’àÉæŒkh{“1žOpV3Ÿ¥1Ó„d>ŠÛ›i{jg¯#ø»ÄÎ£­èyö|6wð³·]®ÙXÙæ¬[[VZlPv.7¶t¤/Ô¤çp´`ž·²®:¦ÓèÐÖ†J‹==—ã
òçÕ{ºÚve¤{Y“Ùhk®àòÕór4Ú\"Ç—@ŽcìsøY"‡t¬L^	þyx8ŒÅ‚åUUå–ª*Úº¸·gñâžÞÅ­»½©Én÷ÐgPð¼ÁÒõÁblËx7ŸœU—…ÓÂÌ¥ýPÆ’ãp§b»†à8{Œç…¿’qPa}]ø@<Gëæ“IÏÃZñÌC<ÿŒðåP˜Âçuðß±oÆ$ßì÷l1nW,ù3¾Å„«1	Å²7y mµhK¸hq[-úº°n ·EÛxt½f€ýt@ûÌ™3{n-.ºœ`£æ ÷PeT˜­óPÍhLØC×^S=O›Í·ÑS7üýë_ÿ;[*$¬Þ<©¿Üß‚äçÐxŠçöR?ZQ> ;KŽŸ6Qà3¹Øáó9®ß›¸{â“X,
—ô‰›&„gà
­nÂgÊñU¸I¼b`ÜÉždì´–;¿‚±$?¡rKÕÎë»:cóVD`s«»<Ñ·TZ‚6ß*®ì˜ôwljá‡7f^Òíˆ{”îvƒÏZí+Ah¡wUYu£RYßk«å]>K½Ð5àð-u1çž^¦Vp8¡›èGÂ®˜°K<;s†˜î·(C[¼5GVHDÇ“î~UxÒª8®*Í£ˆúä¤YÁf£^ol‚†EÂNªkÐ3Â§ö\¯ÙŒ|[…±Ú¿UxqóŒjEµ’XïÅvº\²Só ”‹sø\µ$›Çåx
K5hCìY«²µ¥“/7²@r›`õÐ³åÅØvˆïHÏ$À÷jü]:£ß»eú#g½D6ð
¡bÂ+1,ë6°ojƒLg˜Ò±a:Y³g¹ðßW`º
ô\éƒ<¿Þ—S *0>¹ä–o/~-ËSäÕ9AÈÁ»Ð£S×“œÜm~ÖM6“†Ïö3‹x=òÒXÏÏÉžÚìâ/
.åc+WÃË‹…ƒ_ˆÅ¾$ïüºDbøU‰kOÚ×Kp_ì’ŽÀjÚÜÒ¢^*%> éXM¦{Âå›hˆœÎX=Œùæ’ªpeãdðwÚû-Ê·4ÙŸZÇ†±¾qÆ1
wÀKœçËáõe¤	
è‘Xìæ£Gan€ðˆ×¿ÿÇë|nÅpÎs"$ŽaïIþ¢Ùôw!/ûY"Ï»Ã"@ÈdñAw>³$È"§‡”±ØÐ=÷$“åA:Ùùy…è	«à^ÅLïP,¶
÷Lÿ°"1Ó)†9ïÜtÊÙâçN)¦	²+ùbúÌ:˜ZšÛ$³ }“©ÛyÅ;¯:Õß?PW‡œ¢’„îX³jßÞ€SØ¢x"½R ç–ÍgÐ£ÔóYéwÜþ¹f3…8g±CØ~nÆ¿Ô¿!.Ÿ'ó¼â¢R¶ðÃXŽ¢½µib¨xéääÒíw8­V‚½¤#«·òmí8NžFò¬“L˜Š’´¢ÀCË¥ÍpzeÄ²cûö—¾‹yNœ@|KKoI‰HsÛäÚÍxZ¸ÿsKG¨
H‹g©hHÐgªðs›†¤ú„£§åh”UÀ¼H{˜<˜“Èâ[É9óV>{\{Ùäß‘Nzöáª#äy³‰‘ýW£.^´³jÃ()zÓˆ“ÅqŸèéË´ãÙ³²9'yÌ»é„¿e_½xìO ®"ÜÑül¾:ÇÈçæ~Þ‰<w„Û5Ââqm\'é\EÏJp3k}¹Xº]±Ìš¾Z1r„›ª–Øv4.Ü	:ÿ­ƒ–öª·Á¢q<¡ïÐwâ·]çÇ#Šè€º’Ïö—$«VML¬¾#ûã£xunnµÅ\“SmÎ¾ïÉ§î¿ÿ©'ïcOÂ _Ï¿ßtéÚÉK=Mû&'÷’¾ÔÀ›Z:£	ó&gä ™†×¡V¨g–±¸_©¼mÉ=á>ïÖ¾“±ý½<ß‹fVi×DÀ€ú6Äü¾vI?½@³˜Ñ'ë‡<Pì:OI¶hu`7t`$±¶·Í<GQÍë:Â<üPW°_R®¨ ?ý<ùhšnì^Í?˜2ÐÌcÐºeð,Ä‘Ó`éZò¬¡ŠÓºa4äL4îÄž&ã½\£f21š‘¯Ý¯-\]ùf,öäÊgVþ@|‰¢¡!»Ý.üá#}Aþ#dX)ìÇ~µÀë+<#{Æ&fÜFàëv‰ëæn—Ë«T)-À^<âæÔ\ø¹›-ùeý†¶&S~VQFN¡u„ë)YT˜qÉ ï²i‹
´°X¡œ7¦R(²ô™
¤œº.ôXh*“Ä;zF|fcB¥à2ÇŸ«½EÓYU“i°dß±âËf6Ûä­
SÇó”
æ“ÞäyŠÌ+(E6‹>‚yêûc·Ž½58†KzücÂ/â_E§JjÓ˜: ß"£OhË28ô7 ùõä4Ž“%r,ã¤ó©v†FòÓŸè] Ó.4tV‘H~TŒ§´ÎÙéVÁ[•H—>ù;s}5:"Œþ¿™éM¼oöL:Ù¢{çd–~GoÄbÉNÀCþ}ÞxV–#I4Rf>¤o¡ääzÇÎK‘þàõ)·ÊB[XXs|"UŒ•ž¯†ï½G#ž]FKç~ÞŒhè3ìÞ‰N–Ûç²òëyá‘9Í™æ¤iNZœ¤k/¥ ïÍdÏä*a?†Ù©ÏOD&7(t¨ÊduP#¥’P	~:`†oÝ-sÌîmqXXµÚÙUÝ¶ÆÓ²1h•[U¶N+‚ò)Ûlµä—î*É¯®DÞ½Ñ<Î³Õ~CËÖ®è6¿­×^­ªŠÖÛ{mÒaÞ#Ìgô	­óºÁ5ó!~6±¡/Ð3¾vìcdml¬½óÎ\¯×~õÕ¬¦?àð¦ux‚‘
Îb»ù¯•œ±üë¢¯
#Ùg O¨
m­àYMÄ(äá±Ämð:Ü7Éúb#^%ü» i:­Í±ëÜ®óºDæ»ŠB,SAxáö´>‡öÈ.œØ@Ú#{UŠ7ày|‚î‘_Y9I±n0Ã5§¶Ì¤ªCõü—*v‡jyžÍšzåùH­…½ç„Ó]Ûï^‰D^¡kfâø?”|Ý”â,á³Çg™yb¶Ìö°šÏª×,½ié‡0§ÂE¹ôK…'á
->O‘«ð¡x¥{¯
¶TÔSL¶õJŠu§lå‰TêØ¹ç/JU„ššCmP°Õ¸½ŽOÚ¸jŸXnA¡¡‹VfÄ"i–›¹ÊŽP?BF½ÙX2¯5Ò¬ò§/Êèkìâ÷bàßdfvœÝ*¸ÅüŸWð¯®!7¡/ƒÀ×
;A'¤-^'¾¬+#¸Pü4Åµ¿#9þ8Ž‘šTõöÑ­H½K çE};…oQ¨L“Ü‹iÞI÷KD]àúN“ªÞ.¨/(I³¢Õü³†ù­oæÐN<þÿ	Ógèè¾™ÔW³5›¿öÕMüîÉKçó À0ºîîF‹…Ûfú¦äý Oú‹}{C·ËP”çñØVGPíÔ²õNlk›9†VCëwø?Žîà?Åw‚œxmuŸÞ%ñ”Úë½˜F ?»©Iz>ý)úõO‡Ñs‘ˆÐ8»>ªIcQþ9{aßÇºÌVñÑÞúùëó3ûB¡}ýâû@lÕªØðªUÃÃÃþM›üä…Ã1ñÅŽ}zæMöA–?(é ÖççMRG3ª{jùVg]ÈÂó¨Lœžö®»á†à€¹£æzQ»#Aö. CksGRmþ½Oy!¾ÍóKvî„1mDÏaãj|å•9ƒÓr•ÉüXUS´RMÝœÿ"<?<ü32´‘ˆø.¾Ä|§ç;ò8 ;Ÿ†›H“L«VJN1"ÉÅŠýÂú‘ÕåRÏXžçÅ^•<À™é¹g Þ
à‹ô[5¹Žs'ŠþÐ–]»¶¼‚¬]]]‡±š§GúGºkjjk§µ8¹_—DÎ0¸çûD*·ÿˆôõ¡"žO"„Žc»'Qžµâ>dJô8w
©Òoº)v®`‘ˆ\4Zƒkæ¬ÁSÈ:oÞçy1ä¢…|ÓèâÅ£×?^__ÝÔ”fä¯³U×7FªÁŸ­ÁÛf9($ÇO£ZQJ´ßÃ€I8‹Žb&]ìÖõ‘1yz.|™œ?a|ð½-½/E
ž›C+ðrð¿àçâ{sâYÝ®0äÍ®HV<gOü7ÿ”NÞM&}â1#¯k|Í[‘Ð÷ý"‰>­½Aöó+o¡{€r„PîÊ{ãaÌ1ÿŸÿÌX3îòŠ¤}‰IÂy"Éç|Yæ…¦çqYæ$þ^@óÈŸ½ƒ¬¶”x©•“£­—å'óªÇkkÇÛÚµµ‰6á.žÏ¾ùftÐëmt{½îŒÖ½cc{[É;[
CQ¹uÍâÅkV/Y²Zò‹‰Ñh'®ÍEæTœÛí”X|³eÓê_òû.Y~àÔ¥Í--Ío÷:z†¦ÞxñÅ³Í÷×TUÕˆ6Z€ÏfŠçÅ
ŒyŽ3ã:Ð<=³)F©%|Fö„opßØÔåÿY¡)Êâƒmá„ ˆ'Ê³šš6&à|¦;Ú
ç3Ÿjy~ìUX#³>Ö•rýŒúSÝ?ã`æîîà¡CÂQ±<‹¡Dl8Ñí¬·»N°E<3×~ŽäuòNR'ëdu²›ÔÉ:ðg®“7·—)oÏZê›_Vx  l¾oéÐ­±ØÉÕ/®þ…øbSSŸZ,æ—îËW«óï{©[x=wúôid’ú!Í‘ÀµœqÈjd·Nœ¤¹\s©isuq[¡Ý^œWeUÔèË\¢–¢|[^ÚM)l¢‚]˜¡Ó¦!T>T–Yºh!Bº¼aáÅ9Nq"Æ,µÉ$9ƒ¬$6ÇoÜšÃ7éÒµ™×­ÃÇmÚ=þˆÙ,„ùa!>O=ü	ÏßK‘2F^A·¤JÓðüGÏ÷§¬‡ÏÍ“Ó,‰M´€Î8Ði?Ž,ÃAo ²4'ò
{Džè°8¿ g–Òé©%1EwÅo¼1þ/ÎÂúîÔµÏŠcNÛ+p”e.NŠÙ»‰&›¹ÕaÝôf‰Ä×¤z™ž4BâùÊNAïJ:oÄ2A¸?€ï/”îŸ#ÍÅ`r"Ô:/Á{˜4–=Ÿb2ÅóD4g~ŒæÌÅŒÜèÙdr†onã_Š..½,•¥×DÞJiÔ4|ŒæƒÅÒ9HúÛŒô—¥_eÄ+({¦®`X'àßê*çâä_)Q‰U™=y9 …——ûŒ‘Ë‡‡/}å—l‹T9OÂQ±}ÌÆ7¹&ïL$îœtmŠò|÷þž}ûzöw‹ëÇÍd
‚ÔKa7³®\a‘.ÐiuÀACøÑì¦¬…×,(*lil	é®I[P ãŒ7?0ªµYè'%E_XhÏÐåB˜kªñJ#Ã†X
ñÏsO”¨q|C/uóœA_&Äx~=ëšúYOP\‘2Z"è!¼DŒCZÛ¨£³¸[—òùs·;·Ü’ü³ˆ½¨µrÈ‹š';Ú˜õ+ªmm\e»Éå²÷TTFí
Û8Wù
‘l×RŸcÀµP5Ôáâk]•As]a­¾ª©¡>„ŒþÊ
?ç¬ì¬ñ;²ƒLé7¸ÏüU#­•ÿa‹Ï·5Ýêómé±wY,áúú°ÅÒe_Ù/üµ?{ìîmð›rñ#Û¶Ý=ÆŒŽ…ŽŽ²ú4MÃ¾%íg¯n“ÎÍJ¡âÇ—ZjsC±Wð£(™‘¼:ë”gpPÚ³Ã²Š5èd£5/µ-øTìuO:›ŠÂÁÈèÂxÆ5Ûº&Ý¦¡èÄj”¨½»64WÕ›;zÂÊu»&|îžkýd%Ï ª[rM,ÉuC•SRÔCûæ)]‹+ÂµÞh¨½=¤Š§ï^Õ±Æ=40²º}G${c\éon	ÔøJyW“»©¡^9¸¬vÄÓ>¥Y¸¦7°ÔÁ°dÏëfÄƒÌF­@—w X"‹½÷í^ô²`å¿ýâ…ï$ýŠ‘îåÏŠ‹c´B~BþÏk}óâªÞ–Ð`¨*ªNÔ¢ÝÂoõÙyãõµMþM¡l{¼YÙìEºG*Íè0/|’m«kÙêÜìgXª£¦Jä–lÀT;)y~ør÷ÞUñ
yñE¾ÆæáV£ÞNzü[Ãáá@]ÔV®Ë¾ã›{²e¬o~umàª•iM=¬z¶ùøxoxþë_¤¿Ô†˜·x°RÉærO]¾KØ‡^¹jÏèí(x-ßûmá·$Ù9~ÖÖ)Ù9u?z¸!EäÔÈ>ÿqk[¼—mír¯ðûW¸»ZÙÞxÛÖ®ðÈ`oïàH¸9Ðáñttx²ë—¢«59ê¾V÷˜Ã1æníSçhVGKêù@[k8ÜÚ@žF‡×ëhô@œ•dƒõÓ×éúi`ÀÊY5Ì
‹!úº9n¿3*V#þ5®…•öñx´_’ÏƒNÞíu€O¤Àóçh_0GûÂóðFŒã^§À5©ñýmLÕ_ŠçÎA'oŽöº9äÌŸ£}AŠö´¿Ìø€[?çoÉýa›Ï·­§¿×‡­Öp=yÏŽß½•Û­wÇyØF#Ávä@ˆÌÓAØn¼ÞŸ]BòBÞßgÒpœifã|ÎÌÔŠ-œ
²u,ºÎ_MTáyÛ Pá0(&>/÷^×{+¼ÐB{‡¾HgÌ/3«¼ª°ÛÙ^WS\Ê¡Ÿ
Ý¸"¿ª¦ÖÇ›fŽO»&ªs5¦<hÆ)<-õ\¨D“S¡mbÈVS%ì%uµôÒ&ÉUÏ4ÏÊ•&jIÁ˜Ê(i¥qt@áckËÊ*«
ESA¡™õ)Ãµ
!®Œ«1µ˜…ßËeÍn«Uä-E%•M†±@“VáöÚJìzMzw;DD–önƒìIIÞ¾ÿ‹¼Ì5>Û‡ÄgöadÎ‘ø\ÝB×Í1DÌ¼${Ñ0¹LÙlOÍœ
n2K9U©,äèŽ9l6ß¦rGíH9Ý½âË_F?‘Ô	|Ô˜ÏIÊ§e.>¦Ï«ßrL£ÏRå¹"þàÂš›µÝzIGåL}*[ "â?‘s.‹DÓZæU•VT”æ³¼e'¾µ(KŸëêä|Vá_I¶ê¯Wèk8c:ÿµ¦ÕY™}kGM”QŠrÑ±+ƒ9ÛÍ´ÉdÃ!@2µ%ÏòÏ©d
÷[MÅ%Ž†PI±ÉÚïãªlF£­Š+4
Å—ð×$[]æÆÌkI­ß_[bÍÈj4¹Z›L%z«U_bú©¾PWR¢+Ô£q 9çõaäÿÞÓ…Çã?éÙÃsÓÔÛHÊQ$}Wã¾Ÿ”õ}Ùß÷ûÍ¨…G>Ÿ?}N]ô|–³Q›>&ÓIû¡—[\‡éö?éôYÓó(ÇßùŸ™õG"M¶þïŽ‹û¦Óo£§Ñ—Òp¶#üçw®¢!t9`À~Œ±[;‚Ûii»[álÒCË¡ØåÐî|o.½÷Nh÷ º°<À~B±ÐaÀt€=†±»¦§Ñãè2Àòé½·@»Çp»Úî`c¬`ÿ¿´ï€ªØ¾gî–Ò·¥n²-›¶©[’Mï
nBªDä)‘þEŸÏ×í¾bW¬ð·ák‚Ø{CÑç³¾÷ìÝ${÷;3³7Ù%Äòû s÷–sÎœ93s¦9ƒ9p)xáaf¿„£ï™-Ð:“øÞ¼y--ò‹Šòi8ãæò[Á»~é²
–-]_)µ´IR[‹”³âåÏiæÿ zÉfÝ=¥yŒ!}¢t@ø4Ã-ü|žïmOÿ2c	[fjþ}Ü‹ôs‘þ®A_þPµ Ï·+DØ…2¸•ácÂúˆVêBMüz²­b}¿¡îA$ÑóÚî«™U”ž\-¤ïƒÿCy¤ÓžAÝ´YF>²Òi5ØxÕæÌ†Ò¼ÆØJ­Å”’mT%¸Ò­Ysü–l»Åœ“	¾Ò¾ÒÚ5u%.ÁhñZõ&[mnÝÜŠ"‡ÃUhwñ¾íMÐ òñ_ÏTíýV©’pu¨šÑòùgäu?òjâžÝz~¢vøäø~\Ígyyòrò’&8ÃrÆ§ø°	9û¼
ßqyÙ‹´ñ…L\5f{ƒ+;—
,E>&®ú
—Š°emùCE6G•/G[A¯rÃr¦3™r.ì“¥Àì•»`¹$I|¼¼ôšŸ‡`g+Ð<¨þ
‡eÿøðˆ\IRé•â1L"ÔÞh+©›Úcá€2 mMÔ¾o¤¨ÍòÄ0¨ä‰DÈÁ›qy8Žæ1ÄQ³ZÎà15Ëð±·5CßÝU!(À¨8žêÌéxª(/P©"ãò	xbD|ñá˜œ×ðxÕ;Æ~®n“ÇClW‚Z¡Á¿ï>l”š(‚j!Ô#>1sâ-†=!C>—1Å›Æ‡m’›z¡‚ÿÝ›ª_ŒŸ­jõZú<FÉÉïXxRøP|îd¶@,T¼Fòª_¦çë$¼&jl–'¡3Ñ«/(pæLI©æÞ†ö‚}¬!1É”`ÈsÊ÷‚ß`²bÙJ6Õx;F³­&ƒ)ÙB}Fþ2x“x±HØ©Blýmñà†¼ã+Ù­X#ÛåÍ”Â=®¬&¯·)ËÕã>¶¿­ºÉëk¬nÛ–õô¡uÓ¼’ªtè…ôª’n4q’ ¯l°qál˜½¨i¨4$qÑÄ
ØN],ê­Â¨ÊFÜÂÕ˜rü%¨D‰[¥í%Â•êàªˆ¸ƒ	Oõ–	xÙHßåp¸kóJq"7¬|…/Ù·—…Bñ(ÉQeïû…ìýCŒ6ÎZâ»—0þJÚr„T˜y~
X²§|)‰ÜúÙÚûPüs•{ü	HvàØË¤K¢P<,
^ü¦'Ä;Ð¨ùåw?S¥pµô‘ôqOÇ$ÔâÉÅxªtÐ÷t p)¾·’JlÇè×¥LR•ªï%üî&‡¯ž2YÖ«’D=íw0[¦<¤½.Âf“q(Z´þêð—–Z¸¶mWÛûð@ŒÜ¶ï4ìŠÉ‡=³ÔœÝB äù M·ÜHüêÂh!–ùEO¡­÷Êl¶–«Ûp’8Ô)]]¥Õ­­«¥@æŒÑ11q
'‹SqZðw˜O+ù´‰Yb ›%ý\Ü9±sO·üL÷KbñÄ3ci˜¸x%óé¤x_¨_Ë½•á©/—H=âù(Ÿâe0*ˆˆƒ5áÓQüÇÞW²÷´À¶qÇ»ÙÞÑÚÒÑa¾ï•áÁæ›ÍáÎÅ÷ß;ùƒgûHx½¶"†Y­h?pz,9'^gÈôU‚–òeUš~(Š¾ÑÑ/meg8ß{Ï±¡Ìf8~p	âÛ9~=ö?LFSÈú•ÖŒ.@T$ Eb}Öf+[ŸýÞ{Î3(	Âl’l“ÅãOšqß`ûht4ÑåÎÉŽk®lŸ5½k¤n…/ÕãÊÉè…„ù–d‡3ËÓØÙ®YµÍ½¸2·¦Ìœêçrh.ÁxÜªx,íˆû!.Ë/Pf#*&Eá–/GàR¸‚æåÊp‹{¨©É/¨®É?R?ÕùÕ{.l‡—ÈS4å½>z4šÏä3Ñ•,“Ö©½¯qÓ¦FwC£»iÓ¦&wcüåÔºS­##Vú3<Lew-¤ÀýðV¨íÅ1Š-ª¯Z4To=z”éfV×¦×´;NRì#:¦–Uø•U>÷w
-›äã‰"¿5Ó–æüÅë¨vx¹Ãry&Æ¹A‡¶s)4ìÊ•ÁÂËXF›XÅ+¬
•ÑaÀùköf%-£„•Ñà±
gbm
•Ñ&À2ŠP†ÊØ+£±Ôò£.¢|Ãy‰eMU^â
blK²ß?{I­öy…Å©r›ÇiÖG”Y/£fe”¡U¥u+4jOJ”u˜_O@>ùˆÃ¹Y’äH¶…œB³Ó
]uÕÝxÂ@ÝêêæÓªRËí–ž$%JÍÒlSF½¬®§*q÷¤­ª23¥9*ú ý·Ë£Ëx1N–ñÏ0/ÖªX.Üfô2aB‡ òÞØeP ¿ RhÏm ¾„NåÛJø¼:ù·!@Š§¾å¨À·Ê·îà>Å4¢°¿uÃr›„ï5Â7¤nÒi}r:Ã½E˜x7ÄGý&Á/k¬&s©.ÃŸæÏX\šZcÕ›ÝúŒŠt¿ÎWoùÆ`ŒKHÈËñ—ú
Æ˜ÄD¼³”¤²xoÞDB{Yh‡­I2Ùýý[Û6Ì»¡ÍÅP¼ý<ùEùÅóüå¿—Ãx“Ú5%íåv+b
ùÞvùù™í~iðZøá3ôjNèÔlpnËÒZUÕjÁþLy3íÎ4÷—/ÅžLïdO¦—ödÄ<Ï¢POf‘;p9c|ßñø<FÏÃ#¦C]
ÆC—‚Ù˜`¸¿¹ÑçmÂ(Üa/•Hžé"õ…‹<y¢4-~>fºåñÆ§ÅøùQ·‚åÙg‡ÄER Žóô+„¹+Ã¬-¿zöY°ÈoÆ‡$ª @¸-ø+Ø'zØ^m¶á¶û»ï¿¿–Ãó²K.àã3„¹ƒÃèÐjC¼é~
t&¼  °?x qv™ñ£I0í‡¤Ý»kÅÑ—dÏËøýüþgþ}e‚9ýnH’?¾iâBž¦=ÂÿàUÑÏxaV®{ èy¢_
Y[°#x%Ü	`=Y„mÁóÌGk_ðW„0Þf+)Ùµ¥#!"5
ÃH«ñT¢uÝà Ò!ƒwsî®ƒ7Å*³M‰Ø*$š´wç>þ¦»›ØÞ¬8,g<ZÁàÎA¸[8Ü€/[Dí9ow7>ø(¼}¸âÍÀñ#Á4ý'”¦ÙJªp“Ç–ˆiûõ_Îùõ¿Dÿ_ä®ØÛN¥ñ¿˜ÆåJ™l2ÙÍV¤›àÃ,ßÑ»wß¹æê«Crþ.}tâïe“òž­H­ï	ZÈØMí‰ÞºzÍ.û1çQyä1ŒûkÔóë°ÏAˆGCyù>ÿ
Ÿ­äÔ[¨ŒN•xÿô¸$ÇÕÈ£ã!‹-âßÈã¨¯V#h/ƒûÂÂàN%!¸¯nƒ;u®K˜C¢áuŒgÝ…4žu=¬¢¼4l®ÄYf2`SËàá=«/ºhu»‚þèõ×¥–7G„9p?ÃV9=h¶f‚nÛ³gc0×"ÌoŒB:Ãˆ±øoƒp¶_*î€Æî¡Ö[ó˜ªï\ Â¹Âîo¾é¦g ÂžäÜ…ÍsæŒ‡|bËdVhOš°ÑCõg˜a™Fã©©ÃÚ´,±$ª³qxÞ”â	~%ŸÙ‘žÿllìÈH“qÿ+]Èžy(x#)¨»õØves[dñ‡Oýüº³óš™þ;EË‡Ò½?Â,ì7?ƒyE'´ZÉÞ`ŠÐW'¸_8‚7©ìÊX²ÙSv‚´TÒÈÀñ#Õ†tüèWÊRÏù¥C!8X–T#vOjÄy¨Yg'Ÿ DmfãŸÍªaän5ÙKBã®…ìu³;„;/x“úß"A¸½ì4‘œCÊCcM hlœ¡¥x¥
žÇÊ{oy°×Û-ÔÑÒº·¯t®W•Ú7.¬x0ÐÝ… äÙ@‘?ñ™$Ô†0ôÉÏ
ËÏ±Õ[ŒËâ•ªx8„q>N´l¼÷ø<>Ñ<ßâ6üLO†šðñ#|Ûõ©ôÑôùXe>D¹FÌ†|8¦§arä‘ÐVäs13ÑŸ‘ÿ0q
Óh¨†ùhÑÐHE=}v&eì}:•wPNµ)ô€ÃçZØhS™o™¤^fBí¨œuy{<ƒ…ÝÃŒ†
ÐÊßÉòaJ|çaý0K{äø]Ø¢èÀz?)s‘N °!ÿÓc'ÎmÊŠ3©Ô¡¤ì3} æ“LÇ%‰ÆãÀ|ú/Ã™6o55_¶S‘Âø]Ê¤©çÝ6)kÐDL…	TÁwÅ{‰'T‡GmPŒ™lüšì
tÑðÊÅ1¿è»~øú¹×õ žcòôžTžZG™V«CYš¦•Ÿñ[† Š}×Œ}HÃT8dÖ#;©xÂËcx:u“é$fyb-EÎSHÃ'ª?Ž¯8i2Ož÷\â”8
€ú^‡}JúPÃó~¬ã‘áC‹öáy?*IOI’üàáÃÐòðÃÓç!WMR†¤ÃË’ü°Šø@EÉËcoH\ö<?€§:où8?šD
üý)B/«?Kšš	UhBAˆ¦i¾=ISáfŠ'ë$)Õÿ&o¿ûz>c‰ŽC$ŸLîB4Ër¹gòydõ$UÓ´9ñYõ¼±»¦?Db×‡OLÀré¸%ÆtÍ´y
ïìÍ?5^í­ßüÅKè|™Pôy¯‡+tºUü/b| ˆ< CaŸü¿ùÜ¹|™~>„‰I[ºwÃ°ëzN$²çyÛ±ÜIºéThx/ŒÒ
=ðçiÄ”ò»zí	F“QTZ(Qf{àß%·Èû”	¼âÝ­þZ¬i	&Â8êœÛ‰G‘*š)žq²UÎªr gøú¾_Ä\Ü+ö\×;½âåÓÉêoDyš·Q“¥r«®B¨}ñE[LF¬p†·/¶Eý¯Ð^ÿíb^•'"çÿQEUÇïUd}k·ŒúLÕò)uËØƒ4L©.…qÞ,Î k•ú‰:‹ê.õt9¨ö~D~5×Øk\ÝNUÔC@ó#<Å$Ãü‡	U&Ëø©6ÀÊ² .’7Á¹B®Àë&¸èâ»cîî|øqüë§·Ó×TÂó‡×º0Î–«wŒ÷ò§qÐøÂêÔqEƒLï(}¡”F“H¢*Þïš|SYä”g>f» uvò[ƒ””´)|ÁdúâIäêIØ½¾Â„°•™|\91æ9ÃWQ\…†xCbª¹/­¶4§À˜hÒ…/º$êâ-éÞPžƒ)ÙjS–Yèo×5Xe·¤•u}ršUËù¿Û´Aä/Å¦p–¿ÿÞçdËLÎéI™1‰&Û],»T‰˜œBWˆ{ž’|C\2ÞÇé]ù“ïã3Óöò&ÔQ9LŠX˜ˆò>1ü½ŽÞÛïU1PR¬üü7!QŸªÞÇjŠ**1)%ËËŠÆa\nü9ÓNîår:€å²•É‰• ­qºP~z¾ÏpoÓfeaoZfüdÈwéãð>9ÎÿSÊ" Dxþ>'
Ô¬ÒìS§êxšFþ;sÙÁ/(#+—hZJRb­	¢ðßà°&3äßIš+Õ|_H¨’Ð¹¼‚Xå\xù3xYÎ%ÖÀäðÄ
pYHô‡t“ùÓ¸ù6_‡\)%”h¤-rExijoè5§†—èüP)£Þ%y¬?¼+ø*¬J„Na€ÍÙùj%Œ*QÃãQ¬h™ÿÅÆyÉv"?ö0FáŒzTøE±Y w–›´š‚:GJv´Ø–¤ŠIHÍP‰j*qø›aÁ½Î½çT‰ê•§GÅ—›ÿ«áÅœœW Ñ¦›Í…ZM¦9Æ³´ºz©'Ù`¯¢b`Ñ¢Kº<KªN9Eª¬˜·³uÙg\¸-³ÉYü%ï$¥tK{zûúziú·a£VFÌl7aî¤Or;úV)¼Ì1;“MµD»êÏê(ž[‘ãp7åº{‹z›FçK9v|,í*èÕŠ÷MtÐ ¿,MLÖëLñf¯µ"ì^þ’¶MÓôèÊ+Çô|¿÷±ÖÒ'Zât'(…DcANimZŸ9uºæáu#_<ø5-Y¯cŠÅ^5èòÖ„kZþ!ÔÐ>Èù?†eõE¸“í)üÉjÀ`;vÒºËëôIë:¤DVKVO#+î‰z«þ'¨jEØ?±9ÐªÏ¬¦gÎ‘ŸÚTÎ¨²§g×ÌŠŸÍàÙªKØºöF:óágVGá¥›´a$IÎÄZ¸öb¡[lQX¢XëóåÁyx•7Ã/½8õ”çÛ
åK†ÏÙn@XMý)6¡L#Íów®ÖÉ·Z­¢q"ìöKqIø˜2Ø-9[ÏllýÕªÖuÕö:§¥D;+®ÜYZck)I¶ë`–¶=I›”’™?·L:ÍSØëñ7˜wØãÓSÒ³“Ì©¥úžkFÖÙ¾ðú5[[ÝÅEÞ…¾³»
ÓìÞ÷üåÃKçïj_{ÓÐà¶ZGýÍƒYe•õVw
ßá~A‰ìB‘P9µÿŒïÌC•Ášy¯×iÒã/ó<M‹OŸÄi&½ÑôÔ†Ú¬Ò
“9®´ÛU27+!¶±ì†Äxq-cþ©vó ÛQ•pG¡?§£TSžm±—@rjLáP]icažÙïK-•rTjÿPIÎÜ¬g“û
¢*×ÛW»Ò3$£þµÌº‡Ï×[l…„”ØS*íPÛø–­
=ÊÎköÿŽóÎ[ÿZGK'”ž¾xñé8lÙ¸ JCg‘üžD‘[…
¡9r7Tè
ß´CÃÎªPl÷Âöý˜ÆN­U/ÐJž†š–ŽgQqa¡oq…kq“¶?ªÕo.I7zËºdççÚ+—zÊ¸««O/œçÖWäXÍI‰¹Þì¼zƒÞc/iuäÎuk\eIYzCzr¬® ºÈáK4Öä5X¡6Û’—ë4[´˜g*Ì³ÞÐ‘ÊÜ%ò}'A¾xAgçýý»;;w÷7¯./_ÝÌÏœl_VÐåq¶ª›5%v–UG©¶9zQMÌ’[FFnYÂ¯Íí.\´»½}÷¢…¶·oYÝ´ºÜÑìRç¹æÍ3¯¤PÝ6@ýn	¯OîgqÑUì³¿Ÿ[>åÌÊšÍ0å“áýMM››ÙÕ3ä™ü[¹ÐS•Þê¯Ë/Ûž‘‘V\üzÓYÍM?kÂ¿æ³š*<=žAú‡70mr´†‡/5êuìœ“øËÊ~,¶ÃÜü…î¿7¯l›Ùœúýœ:sò¶ÔB"¬&õäp¤ÇNî[Ží+¥þ0 	5k³Fj65ÊÇ++{þõ¯@eå·•hÿ,ÿêåk©XZ^ŽwKåkùZ\ É>~FSÝ÷Z¤jÎÍmÎÉa×L—+“¸€¿â×vWV–‹„7àJØLÞævÈgÆâ¡ò¶|ÕÉ¿Âo“·Q'ßu7ò@îb²qMq¾H8¦Eìé	³5  C/·wà_
B-á?ê~à2tÇÆÒ3‚„>
‡c»n5’t5œ+ogóIøué1¸Èóì1PªWQhhïõ“N¢êTÌwHó7¬œÅY¦K¤Qp©Þï‘žzã9}glëƒ3žy¦Å—™é³ZÙUŸ’¢×¥¤è0	ø_À_Ê1’tI¾ävKyyôš?ÇSPàöäxx?$;Ø@P{ÑÔmD+e†ì.X×ørýú°u­V’LÎb˜
-'»ÚÄð˜óÄfó]w™KO<™y×]™eðÛóå©%©×“¢Ð
ÖîÇ!ÜÎ¤eäÀY"Ÿ-Z0Ä‘ªÀ!øF–Z?ò}T^þq9•q3}y_|„/X½R±ö–¯wÅ2ë'$êœ!Jª«¨…)œ.Ü¶-ù#ï‡ååùàXÅÈÉoÉoOT±ö»/œÞÆD‹NÔ‰HBô¢`ßUWIÛäƒP#åå¸(è«å?ÃrÈD¦G}ù|—, 5Uð[æ7[òÔbR³`E>Á õ˜˜Ü˜™ýÅ ¸ä¡RUAÞW_ÕÖÖÒM¶GÖÖnÆò#I[€BpÈkƒ#GÎú‡ôô³ —r@7ñæ•óÊŽy¥er
Õh#Ÿhs{†2=«¼ß-ýli9[~ŠåûÜ%%òû¬œ·àú\:9‹ÙH±æý>½Ùµ³f:æ—œ(îšá¨_æ›Hð’L’Á½Ž²¸¢éz‘JüDÝˆ¯LèïW‹¼^åï‹ížoùm6¿ÕZIÿ¾pïðÜçÙîÞ±Ã½ýo`ôÏöŸqþµîíºÃ
kœÊ¡åPÄÖ)Ý¼§l¦Ÿ6UH"N›B±ÌêèH=«E3¤-ê,-i¶eÍï™3˜[1ÒÖº¶Ínœ
E
RFkË‚U…5g´ÑÕËÎêumOGvJ‰Õ^R`2–¶z*•ùOmÐ4:jË¬yYú”Êž*ß@1ó©‚{O¼¡ý8ZspË9ãLgÉ³¬šgËWÀÒÙòíÇ6UWoê[²Ë¸(±§¢\ÊÉ‘ÊkçÇ/Ô_°žîèîºéÌ7mY§éìæ~rôªÏ:ŸëA#ö	0îT¡ŒÆ|Ríe!Ÿ‰>V²Ší®Šq4æ•v%/‰oZZÑ¹¾zVtià…£gÔÄ8I¼0)»)ß7¨_žÐ¾¶žŽÍÔ[<ÕåÑ•ýE%CU	Ö¸ùŒÒÁŠcGGraV^åë¦¾-Ü7®â—u«JJ
?õß211÷î•õÜ~° WÖÑÑCd÷Ê* ÃÔ'«ü5[ïH	ÒLy”åŽ”Íø
mn2ÍÜüô´Ùímžƒ¥
UU¤9PtŽü=²ŠÐ÷™«\ù•}UÓ
·ü!Iêv„ùrjd}Lî×7ì´OqÊ=&b_ÿÍé–yÍãšhš×oI¿y€äË9–â	<ÓŒZf^³<W¥[—0^„t0¯
±V!ßžl·wž´÷i2ÒE	#s_ ö¬õœyŠ&fvù)þ¦ååQ+b›]¿M5ñ{¯U›*áF9þœ¥5Mttt‡ÞæOñ
¹‹:´yE¿}vr\ZqGÉ`«¡ODÅ)jÃÌ¡^ñ8êÉ
HÈëè
ð'y9Ö)ç£Ç¥7&×«I*ÉŒhƒY«z^—í$S¶ƒAÂt×@&I…ÓÛ±úN—Ø¸m»ÐG4ðšj79¼ô®úçþéªwÕ‡æû~=óÙ’ÆqÃçHØ=£ùbÈdN	ÇãÊœ¥Ü)gÂ\I¢àãQ6(–k,’~-…Î»È'Q$7Ü†[ACßÜkæ®QPH®LàJŽ†in<$x˜
PhÞ¬]™8W&Ì)\ÂÅs8eå£O«ƒ Ì§sY(ghDY—eÒÄüa¥A³.æôž]Ã»VKÓpBÔéÚ J‹å+â@Åð®žÓcÖÍ»W’¸Ìíˆ“~âÚ5íwÖ(±‘¤3%8KzV¾=dcÓK¢á?¨ƒ<´o©Ì…°Ì1…í7ÐÌü	–&ÒŒéiRk¥½Ð•˜ÎïsStézv›•Ÿ¨K
½†Â,sZ²¯¤kEFÚ¬d“¯XZñš5+Ùä-‘VuÉ)¦òbi%ËIøy»“ê ž¶?lRC;Ÿ´a»”¹™^ðŽÒ©e·C—ùb\
oÁf£C+‹
~/ÝÌ’¾£ñm„¹ðnè¬…§¦o†wõÄŒÐC{wC¥Ì|á÷¤ncû~"F¦È‰>ðÆNÙ™ÈGÞ8*õ­kp8rózRRz
rêŽºœü¾ääÞ<sNWg6gg›¡ÝîH7×
õæy­ùù­y>W¡'—ÝyŠŠ<s\6«\6^p@Ýî&·uÁµðrDÐQÛ4“‘Y™°¿•Í-Öi‹Ñº¨>ª³©P[„w
xwi'sékl`·ÛñV`§G0?ÃjÚ›Û„¬tæ%þÝõïÃØñã;Hk`ÿ‰”žfq'‡Ikèücî«’ýÿùzâ=Mú‡DpÉ}âs1nâóÐÙV‹”EæDQÄKË}÷aIÝ}ï½pŽlïƒxˆGoTŸÉŸQÿÚŒ~[ø˜@ä>¼ŠæÝÔ}Î¼•ÝB²ü›Ò~ONuÐrnÅv¾|&ÙhlvÙd&&6¡DgL°Íõ”(6šŽx4šæ
íöê¢8rÙyú£×¹z=ù…]¥*M^³ Ý%ª3ë]š–-Ã¥1½(ëü›cæä÷å}íYéªöâ%5ÙåY¢ÊÞV\:§PÍmR™ŸGv’BÄÁˆ¼¸Pÿp^_ºOÑueûc©­Csæô´Ð³z­ò5ÄXì7t†ü*g²9 6×oÿÞ³cgþ/.•k–Â¥NgyFF¹Ó”–fJNII–ÏìSrjj²)5-¥æWWI‰ärI%%]®9e……¥%EE¥`å/øÇ9¥…E¥ô“ hÙüÇ|Æs|¨ÞÔ
!¾gØcjœá½0Ã{Ø¶@Þ½ 2üþ’"§(-9gfM†•nwQ	¾‹OI1ñŸ¼ªªÊí­ªòC ,=ƒMCóÛÛúš]yy…®ü<<ô¤­}þPSã`sa.mƒMMƒƒMÍšóò\·GB©$÷){Æ< ¶C*_þœ–^ù1I"säÏ‡!NþlZ¿Â¶3Yx‚!´›ü+Øw…µGJ^2/r/kßWVŸ%±/Â7°1Û5ÖÇÊ„1J¢È?ŸÃÿ”îÉx¤LŠX1I%­Y	H`¡wÃŒé|zÅ«ÀKŒq¼SpH™¨Ö`¿¼³vÉÍ>ø+ìè”Ïeˆ£Eþ[Ob3;Â"#|µ˜Ë±eRÇtM4;yÅdÕàƒ–úø¸³SÞYõÉÍ¨õé‡ï„XÄÂÉ[®¤ãÆX‹ÉF®[»J7¯½îúµ[ä§¶¬…ë¶l¹î†mÛ8ÞÎà7ðŠ¨£x›<hÀëñá2ÑgÐî¼à‚;nÛµë¶ë‡Ï‡±ó‡o¿mx—¬Ù5|Æ”$\Má9ìÅf²UüÏt:Î9aóÄþØÁ‰coP¥ª€¨bS<q½Ñ­‹³­Éj1V—\–Ò”»¡Ìó’ñ±¢Ì˜Ùx‚sœ#Ï-¥õîl‹cvœ½ §ÕcÞ»â#Yvn"MHÈÓžOG‹–‹ÃÖ ¿$Iw²Yÿµò?`¥¼ù¿Òtœzá¡šaYvààëRà8^»öZ+=cøIâeîlÌ³+ó½í±(½sl'¡uRSÚ&p:ëŽz§ü*8«WVV®¬þ¿›o¹éæ¯%[•Ý^m“Ê—ùýË|;o¾éF´žF[i-1Ê¨
o},Ïîfä Ió(èÝ§7Üxóð×>J´\²UÛíU6)çÆ›næ´“ØXe	kŸX«Žõeô¡|:¼%ÉÙ .“ätø;Ê‡Á›ñÒ¢Ào¤Ý£D0iÍð"¤8ïHò0YríµXŸv
Â¢/|ò	÷å„øqÌÞ#áñ9ÕZØ-ï†£]ç@ýµd“8w`¼­aã(›HÁé#~9;ï8ˆŠt	.\‡ÑÑ1<AÚýH;l~ñ€m/bn¿”	Dê~¸ wø•ÒWG~%òÓIúT’ä77nïð0yD>òÁòA‰vZy¨¬¬ä2»XH‚'É}´|°
Hóâk¯=*IðÕƒ[×Ñó£°.f1ýôUð”iúé ‘ˆÈñëMÌ¨.9pP>¾‘£‰HIq}$Æ)
ÔG)úh:«œªŒ àZhØ,%a¦ý;pYÂõ2çp›°N*LïA¹×wÀØÛp;»£°³¯VÎ«)ÔdeÖØ
ßÀrÌÿÍŠž)Ç´•’Ã!8“–*™òIJä°é Üá“{0çî%Ýð
ÓH>C™Ç¤õØQ<pú¯Ý¼ùZîâàWð¤¨c ´‚2Ô‹ù÷kï‡«W@¸¡‹´“-BüôÙ™ãçvvžÛÝE¯]]­;ººw´µíèîÚÑŠ<‡áeþà|w8!ÿ¯w‰ß¿Ôë]êïjÛ®ÝÞÖé^ä¯\ìÆívþEn*—Œ¥Ûè‹™íS¢`Â6Ã&äâl»W¨p´#	}Ø‡^†z5œÖ©rúè¨—]üûæ8Gˆ_mÁ^þÃ®á÷xµâÑ¶ì
ÿ-IHÉ•¯IÎÑÍkâ¼³ãŠn²ÒÑßú5Ð`˜mËÿ=Ë­öÃ¯’ge™¬y¿)G[²Öª7™²à÷ê
í,¯<a‡”ôÙP¬©ÐúoÎŒ6géÏŽ+ÑÏò4¥˜ÍÆÜg
™©)ù
¦Ü¤˜²S­Æ´$Ûúo´è·§¦ÆÜ¢*×VB}²AoŽ–Çb´%ñq^øƒ1O§Ï\ëŽ/‘K‹ÎN1ÂvR©®å”˜Û[j¿*Ö»"Éš™j\_šdÈãc,æt“+±‹¡=*°oÏÀ­·ì¿u`Ïžh€ùò?”_ÞFEQ}ƒmAL°@>Øûá;YK÷=&4ÀÃä"ÕnQ>F~+Q‹tïIÔS‡9.ùuù8ê-’bß/Å¼þ¹H ¬…&¿¢_À6¶îºqâšbÓ(â£7Þ@ÊÚÈßæ}Ž¤ã`<h#y`t6"ÓBt¢‰ÎÂù Ûòýä4¥|%d0Ø2¤SÀøQ#GÑDH
 Æ—|üFhgt‚Ñd\:5wAÕ8=Ãä[áÒÀÏÈ/qà
ÁW 6'4²}o;;áÒ~Nƒ~¿˜¢á	£!~˜ÓOá€Æâ—Êz…¿7LñßNÊ…B>˜²@_üDLøó*æÛ*&ý…ó¼L`q	ø~9Âã2Ð$ø´œç×ëd¶’cl-²__ÒÐBŽíœöîFó’!þãº¿$Ç0.ýƒ4.}Çù^€Uäð$NR¯÷³|N¿!ý”_>6±æ'°dq‹” µ×Î_¹’ÃÌG˜c†»†v¾G/YLŽ­\yþù(éfë½g8~yvãÂÉó‰ðé€EÂÏ?­›©§¯öxœNIÉÉI4öŒ¡”½À@÷¿aü!É“3!è¦)V ßš¤ÓÅåŠnðämºcŒN/ºEw>YŸ0«¶¼:!!vv†£¢–ï…#`Ù¯Ì‡Ý1ò—dßãMæÁQ­ŠÍd)zˆï¿Íƒ5Á7hKÓ¬ì·®¬+ß:Ô¿„áðïX6ÌÜV$h‡+„Y4õMa‹Ýl±Dñh¥wgæ&e)Yéž|k¾7Õ•öz¦=Û”ŽV…Æ(‡–£4'5/…Ò{!X»ž!´ÿ×‡t4Ëªb½!«Ù–›“•S˜þ\¾#¥$5g–+Ù¯Õ–Ç(çº~_BCäÓ†¾'Œ,¿“§TE¤)øw²²r·Oš„uôŽá~Ma9ömfGæ*³0!Y™&2Hi"êé3¯ì9‰>+eŸu'<ë#Ê=
!zý¡:hâÏ¼üâs²p’:ª”C|NeÏ¬,1ø4ú¬”|N§ÏJ¾ás{frgÏ–ùÑFŸyà³=÷ÃZÜGÈÈxdzr¸n€ÛfØ_Ææ]ß”´_Ñtâér»~ÞÜüót%‰n%†nÙ°á–!~Çû‘¾+_bµú¥n÷²ºúeeeËê#hv´]°páííôÚ†¬ý?ˆQAÒ   9 d  x            xÁÝ0  À4Î¶mÛ¶ýfÛ¶m³mÛ¶mß bÿ cÀ°l ÛÀ!pÜÏÀ§ ~P9èŒ
¦‹‚uÁ–àZð(xãÃì°0,kÃæ°ì‡ÁIp¼ _…iÃœaÑ°bX7lvW…‡Â'áÄP\”eEQYT5EmÐ(4
-B;Ðt=BïÐ/Ìpj\×Ç1Ü	÷Ã£ð|¿À_$†$&éIsÒŽ¬ 'È+š–Ö§1Ú‰ö£èzƒ>¡è–›•e5YSÖ†õ`ÓØ"¶ŽmaØvƒ=aØ.xr^œWæõyŒwâãø¾oã‡ø9~‹@(‘PdyEIÑAô#ÄqHœ·Ä3ñI©dB™Væ”EeEYW¶”d9BN‘äùFþPDE*¹Ê¬ò«Òªºj¬v©w:¹Î¬óëÒººn¬'è9ú‚‰o*šº¦¥é`ú˜fŠY`Ö˜Mf¹eSÚ¬¶ -kkÚ¦¶Ýd¯Ø?N¸ø.·+î*»ú.æ:¹~nœ›å–¹}î”»æ>¸?^øŒ>¯/é«ún~ƒ?ãoø'þƒÿåŒšFm¢ÑhB4'Zý#€è¢  ÖvÏ¹?xµÍAmÛ¶mÛ¶mÛ¶mÛÆîõtÓçMß1ýÊôQ2D…2¢ö¨7Ž&£ùh5úˆÓàì¸0.«ãžx(žˆçâ•x+>ˆÏâ›ø)þHƒ ÉMŠ“ò¤%I¦’…d-ÙIŽ’»ä%ùJãÑd”P‹Ö¥-iW:Ž¥3éRº‘î¥'éU–„!f0`¹YqVžÕfÍYgÖŸÍfËÙf¶Ÿ=fïÙož„#npà¹yq^™×ç­yw>˜ç³ùr¾™šðDEQS´]Åh±XœÅ]ñRAJ}¥«2_Ù«œTž+ï•ï2ŽDRJG‚,-«Ë‘r¢Ü.¯ËŸª§V›ªcÕíê{MÓ<­¦6^›®-ÖVk×õtz~½­>S¿nd6Ê}…ÆQã¬ñÒLaæ6‹š%ÍŠf]sª¹Ð\i~¶<+·UÜªmu¶Z+­­ÖAëµÚ…íÒvu»«=Ðžoï¶¯Û÷íöO'žƒéøNM§¡3ÔYêu>º)\p+»=Ýî}÷¹Ç¼’^E¯®×Ôkë-÷NÇÅ2ÆZÆvÆ®ú‰üÐ/í7öúýÓþeÿ¶ÿÔÿ8Aæ hÐ3XœIX>lÎ
ï†?£ÌQÇhdt=z½~B"H„ŠBY¨	M¡#ô…‘0ÂZØ	Gáb†Òýo åÈ €öjÛ¶1F†kŒ’­mÛ¶mÛ¶mÛ¶m÷Þ«T§Ò–Êå+×©¼«JÚ*-ª<#:—ˆ;Ä3âñ‹LMf%ó“%ÉÊ¤@6!{+ÈgTrŠ¢:PÃ¨3tÆÿ§UºÝ‰Go£/Ñ¿‚iÇ`¦0‹˜uÌ.æóƒMÍæfË²ˆÇ®b±—ØGì;ö—‘«È™\?n7‰[ÁàîðÉù¬|Qžãý¼Í×á‡ñøü/!µS(.‚,´	³„KbF±°Hˆ~‰Ä.âqœ¸JÜ&žï‰ß@rPp@q€@Ðt }À°
ì—À#)³•Òi…´M:"]’>Hä¼2kÉ#ämòù•’[¡”zÊ0e›rIy§æWƒj?u—zMý¡•Ô\­…6JÛ¦=Óóê@o OÐ?ø†øsûu'ÿ§ ˜xììœJjêzááK‘ä‘Ê9$"-"}"Ó"7"/¢Ù£\´NtHt_ôN,g¬Al]ìMÄÅ§ÅiŠ†nØF-c„1ÇØaœ1¿ÌÜ&aö1—˜[ÌV~K·ªYm¬aÖ"ë‰Þnd_°_Ù?œÜNIGwj8]œ	Îç˜›ÌÍï2nwœ»ÌÝãsï¸_¼òžìÅ½:^+¯Ÿ7Å[áíó.yÏ’R&qI`2˜„!€.¬;Áp\÷Á3ð|¿ ”(;*Š*"€LTuCsÐ1tÝCïÐ7\‡1Âp/<Â“ð,¼¯Â›ð.|ŸÂ—ð-ü¿ÂŸð¯DÊDÎ‘hðÖDw   xc`d```46òÓ9Ïoó•™ù<R—„ÐŠ
ÿOýçä®bþä²30DBS¿   x­ÔŒ$yÇñªÛ¶*kLº»®ÏkÔî¹öl38Û¶m›áÙ¶£sp6¿=ù%yéKuz‘É'ÿWõŸ.¹9[Ç¶v´¯†r„ð"„À¿¿ äùéÄ®ðrhÄ&hUò0Åð]EþýBýy¼<” ó²Ìˆ0ˆ)–ø«¡5âÃ9öq]y˜Ÿ¥1B»½ïÊñàcŠÙ¯c«¡
æE6’Ø(O>æ)æ²+ÚC§ý-½¿g¢Ö­]1;FHæ0 XŽ@†Z9þÏ%+\
chk,‡•–ž» ;bÙj[
A–åêÏ³ÏDÄ½L"4¿k¥Ùÿœ‡vÍ‡ØÕh@%B£}˜'Ii„MÌ÷#T>#Ò†añ1Ž3?€n¡3àa¦ý.šõYÊkàj¶%˜ƒQÌÀt›½tšïãÆÌõºÈ˜ŠFldT ÀöÆ*iÃ ò$BóØcÒ¢¸)BLHˆ@¹ù­ÖC:ë·¡+”—£I¡!VaÌØ»"€í‘ÄÚQ†j7÷lX¦¨Îî×¬csP…)Ò¨Xg{¦¾àZ97ÉÍ¸·®ÆœSx¯sdI©sJÙŽNš˜¦ÎŽ¯àÌ’R÷ÄÈ¯Ç{…÷ºÕffOâ‘x—|s#Ä}©÷eï²Œ›|cùOáx\‡1ì+QÇnÀ÷û_å›ov€bÜ‚K°öÆm8wàf<†³p;ŽÁæØ÷â0Óã\+¿Vo¹<‡ëp‡¾Ã¹\«¡²Ýq®Ë	¥Î\ŸpëæzT1[øÿ>€îÌ}«xt²-õçÔ_}ê?33ÔöØóL~2ñ<o¨_Ã‰8
'ãÃÌ1ó®–¢Ý˜† …˜#u¸Ÿ‚kì ˆ|)‚‡å¨F!JG0˜ríÕ‡!4ª?i9Z1…X€´±Ëâ”`Ô óû±ªPˆ.´jmHuBÇÏCÇ¢R'õè–jÕ1œÏœó$PŽ	”ªW+1,ý_ÔúEŠ3ã\c—õ÷'£8Žs-àœåbü„k×q6nÆwÆx»âJüÂ^×ºœ‡¿‹92ó÷:GÞÌäÛLüâ|ï|ÌzSóh¿o   xc`d``žñ_…!…{ÇÿSÿx¸«€"(€Y
 ¬ixc`aÚÌ8•ƒ©‹)‚ÁB3Æ11r2 …Lÿ×þ†ñÃ‚œ}0(üøÏ<ã¿
C
óF&†é 9&!¦c@J ÑT7  xlÐ€1ÐdòŸmO“ÙÉ^ÝóÕ¶mÛ¶mÛ¶mÛv»·¨m·;Í™ß(Næ!„$ññx‹7Nø‚½!l/*vÈåCÐP´{á\8Çâ¢¸<®‚‡âix&¾Š_IAR¬Ô@: –ÎKÄž8O¢'ÙI4YD6Cä88C è DB4€‚P
šA+è}`ÌƒE°
vÁ>8Çá<€'ð
>¸“™<F^*‘¿È¿¨7
¤2U¨ž†ÑHZ–¦Ýé :n¤›énz€avÌ)¬kÊ°%l#ÛÁö°gì…")¶Š›â©*²’K)¯4WÚèBu¹tWUgU§¶W_sÄ%îÌ½y0ßÅ÷ñ#ü¿Ì¯…
#aa~aÁë&ÿÔ4MÈP†
¢åh+öÅyq.€KàŠ¸z‚ÄüTòO‘8+Ý'ˆØÇ‰Ð4\!Tƒ(ˆ… 4´„ŽÐ¦Ã\X+a+ì…ƒ	÷Á/á½ òp!qXþ,ÿ¤^ÔŸSš A$Hô¦ÃÓIø
‰Z¬›.$6°íl{š"á‘F¢µNŸ á$$š«¯U-Eb'ßËóãü¢è+$ìÃ¼…Ä¤D	¼eëldJ*-·¶EƒQÿ4NÚOí—öÎZÄfÍf
B"ÿ*ˆ§x:Š§3Ê2¯ÿƒäò×¨ø·ùtbÍR(éëiÙfb‰6ï7¯×8K ÅÛâbq´Ø˜îˆÑ“2­ß*æÒæbæ¢f;³‹é¡é¦é¢h?aÚoÚlšhJØÛ85îBq³3
vâëlÐ¿_PJa{Þ,_ºý¿¯r€B[¢è>3Ù¶mÛ¶mÛ¶ëûgÛ¶m×³²mÛvo_ïâ ³‚€hvØ [c›l‡ýdGí4€gó^ˆwx/âå¼š×â^Y›÷ñn
ó=¾Ïðßü ö£~Ü/úe€×§_õëà×ý&øCìOÁŸ @ þ¿ún]ç+>µùy¿øö|÷>Í;Þüã¤Ÿö³ï=~ü! ²¬ÖÆòÚf;n³­­•³ò–Ûv[F+i,Ÿe²Ìö“í·-»ÍÂEh"•$$%iÈJrS€‚§"•©B
êÓ„öt +Ýèc•,¿U¶?­Œ'fó˜ÏRV²…­ìåþâ0Ç8Í.q‡{Üç±¤@
«pŠ¬(Šel©U´ß-ºe³¶Ó6Ù.[fs=¡ÍSYkaØ|Om‹ìWo<‰³9–ÓÓX8•³–†ž™,Ap‚À'$áˆM4b“Œ¤%é‰BQJS‚’”§”í¥-iJsZÐJ‚Lfs˜Îlæ²ˆõ¬b
kùŸø™_XÁ®q™+Üâªíã¦‚+°‚*˜¢rWÑ	ÊL0…`Ì"Ïb"°„°,$ËˆÌrâ°X¬#.‰Îj’°ƒDl#»HÊNR³ŸTì#’‰ßÉÌdàG²sˆ\%ÇÉÇIòr‚üœ¢g)Ây
sŽb\¤,7(Ãu*p›ª< :¨ÆCjò„:<§6Ï¨ÅS) 
å4ÑNah­4SÚ*4­‚6
E'E ‡¢Ñ“¾ŠMÅ¥Ÿâ©¤`‰ÙNNŽP—4V@OæÉ=“§ðDžÒÓz*Oêá=‚GöèÃ£z8ëÑ<¢GQ
ÕTUVwuSOõRouQWõQ}µT•WUT%USuÕRmÕQ]ÕS+µV[µQ;µWguRGõP_õÓMÔL-Õ2­Ðr­Ô*­ÓZ­ÑfíÐNMÒdíÒXmÒFmÑVmÓzmÐvÍÒ-Ñj
ÐnýC{ôOíÕ¿´OU4NU5^ÿÖ~ýG?è¿úQÿÓOú¿~Ö@ý¢AúUƒõ›†ê
ÓŸ®¿4BHÎnº(žÎŠH<6ÑK1è­˜ÖÌš[#kbM­±-·–ËVÚ=×3;o'í´µ‹vÉ.Ø);cçì°í±_ìg[gklƒ­Öáîßèv@úF³ÌqY«jµ¬¶Õ°šVÏê[5«nu¬®5°†P¼—o§ù'xLÍ%T%P…áÿÞûÜww‹$a}-¤à–yéhC2­hOô@qíkºiß±}€:ó‡ñ1dl‰‘%;Ú©=ÿíxédDöQÁŽ`‹K9È˜Ã´™C9òŸdœüïo>)sûjóW6Ì?ÙRd‘Y¶HöPgÛd/!;$û(±²Ÿˆ]‘”Ù59HÂË!ªìµ&`ïåEö§%ä<rŒ“ãd¹&9Aë–“DÜœœzºÍÈiRnIÎzêoÉÙOÞ“sž¼/ç>ùTÎ#ËËùä¸¹€<÷™^¦™gÌc!dÛJá9Š…eæ>Á+3s…Ã’ÂÉ{‹~²"—¬¬Ló˜dt¥T	ã®ª®"Yµ´¢E­j™öOÏhºùœO-üÊ=SµpÔn~ìs‚g¨L5t£5¡°NƒVµ®Í(ÿ}æ6LÌHð-
7jÉ8/3¾A‘9rõ¾Ì‡;u_-œUY‘áàÔ.¨¤|ìÒ-æ!³uú•,Þ²ÓßÁðªRdóî“~Îþ5uhÙ]-Ñ
Ï[
üà‹cªn§Gæ:làŸ½ö¤¾%«KŸùC¾‰	¯Â¡–¨ºŠƒÎïú8ï£D°ÿoÏD¯÷0[Õ»¼êß™“ùÎ`,UêWL•èd„¬ö\ö;Š<º÷èä›¯EKÕWÛíÛU¢’û3ÃHñ<à´¨µ1;b%ñ	Ã*Ø   xl„Ã‚  gv³m·¶mÙXÛÊ}Bã¤{­sö9ûÜ{3C ÿöë$	ügéC×0+4pÞqŽ§‘#˜~ð‹&'8‘P'9™·„Ñì®rÝ©ÜpšÓáLÂ‰à³³œíç:ÏùDºÀ…Dq“[Üæ+w\äb—íR—ãrWëJW¹šgÄï×D‹Á$p—{´òÀC9ÎE.‘ÈG’H6Ìp#H1’|3ÊhcH5Ö8ãM ‡&òˆ6›d²)¦šF:¦›a¦Yd’Å{³¹lŽ¹d›Ç+ó-°Ð"‹-±Ô2Ë­°Ò*«­±Ö:ë]çz7¸ÑMnv‹[ÝævŠhw‡;é¤‹w¹›º9K1%üzÝã^JmPÞQFŸ0hý6Ûb«m”SÁÛí°Ó.»í¡Ò^û¨â	CŒ0j?Ã8èÕ;â(5Ž¹Z÷{Àƒ<§ŽzyØ#Œy”ßÁAAQ  ÁÝŠ à> €›®ú8A`&F‰
UÊ[œ¨q&Î“IÛvì’²Ç•·}D¤:rL†ºšN9wá’,9W®Ý¸%O»;.î=PôÈŸ xÀª    ¸sÿdÛ¶mÛÚ¾íê5ª× Q“f-Zµi×¡S—n=zõé7`Ða#F7aÒ”i3fÍ™·`Ñ’e+V­Y·aÓ–m;víA“}9vâÔ™s.]¹vãÖ{=yöâÕ›w>}	}‹ˆŠ‰KHJIËÈÊÉ+(*)«¨ªùñëïŸ x@Œ  6›ÚX£¶mÛ6ÎÅ£úØ^’ø(S®B¥*ÕjÔªS¯A£&ÍZ´JJIËÈÊÉ+(*iÓ®C§.ÝzôêÓoÀ !ÃFŒ3nÂ¤)ÓfÌš3oÁ¢%ËV¬Z³nÃ¦-ÛvìÚ³ïÀ¡#ÇNœ:sîÂ¥+×ñå&’‘Štd"¹ÈG!ŠQrëÎ½ž<{ñê‡Ÿ~ùí¿þyóîÃ§ÿÁƒ®  @á³³ìš‘Ÿ#¾G³í®ÿkÛ¶mgÛ¶íÖ÷­¥›/®s=_ùæ7ºÉÍnq«ÛÜîwºËÝîq¯ûÜïzÈÃñ¨Ç2ØC
3ÜFe´1Æg¼	&šd²)¦šfºfše63™ÎlæPÅŠX@!C„3ÕÆ1‹%æšg¾Zd±%–2ƒFšXn“™ÂJV³˜¥–[a¥UV[c­uÖÛ`£M6ÛÂ0#4ÓB+mTPI/}Œe¥¶Úf»vÚe·=öÚg¿:ä°#ŽzÜžô”§=ãYÏyÞ^ô’—½âU¯yÝÞô–·½ã]ïyß>ô‘}âSŸùÜ,d"„E¤/‰&ØW¾f/bÐ7¾õïýàG?ù™zï¿úÍïþ ”T¦ñž´38æ3—’I¢Œ5³ŒD²ýI&”î/&0êoÿø×þ'.¬    ~=»»»›î~Ìû°	
N¢wÂ‚E,Y¶bÕšu6mÙ¶c×ž}9vâÔ™s.]EÏµ·îÜ{ðèÉ³¯Þ¼ûðéË·	I)iY9yE%eU5õèÆ8ÚÑ‰Yôã7F1‰Acs
M-ÿd“Gw£0€öoM\¶üŽ<#÷››ÒãôzS°³Kà=JÚ¯_3£€DNL/b¾ymQ[Ö8Ìžbù"­,ô»ÎbiÍž…G¡5‹¼(”ÿì…ëÇnöü'oÅ:J…ëÊ0…¥+¶QÛO‰8j
^ø-®Êp*“—wø|AmÆ{°ö~Y\Œ5ö‹*”ÅºäâýúÁ“ˆí-çPµ9¤6p˜úÁZÚy|·?ëöºŽ}TmÁÇôí
áD¸Y*á‡QÖ9¬ÈºÒ¬ýA‡^ól“…žˆ³ç@d©uFÍá’â/µøÁ®Ðj_UÚ3gLkMxýz»\kiC¦bfpƒ¿¥yct¼QëÞÐºßnb?ôà—†;jxW6ü~·öe,?;//Ò~(ð€&fo˜Þx4^6ÏÛê]vƒÈ
Ng¤÷Ÿ:\î&I·oÓ3LoòŽzT`?ÿí}ÜåŽvh ÆPi—×@Nu¨´fŸûåê¸½0bÇ-nº¹é¦ÒZø¡~XqŸîÖ©Þ™êƒYëÑ¬õ»²Aè$rK¨Ÿ-‰®F¢[’¸&%!(Ëß'U¾4\Ò…
&à‚Þ{
¯Š £ÐÔ79‚íÆ|¼ƒëËcËW
}£wIýz#‚rHPþýåDá7‚€p
t(’5Ô¡ÖäÊÈ@$RPÆëPŽ !F’/PNêicªÃØS¾9dcftÊÔº™‚1C3‚ñ•½jõZÀøJ0¾k0¾ë0Nàƒ`ü¨Â¸P0.*0E~KŽ-F’Øœu\¨t„IžÓÅÕR"E‰ê•B+£ÒùÞ*—G™aÚ L„éƒ°ê Ì„iƒ0}¦ÂÊA˜6ƒ ÿôl:+’é¶PÞQªI ’
Ê-a"ìš·¤é–¦»í™:ø”åY­Tÿ³U×èmD…;Ué²‘ÇP>¬¼CšpÞ¼ûƒ`ÿw†QzÇ“£%>i–ïÇKü<ÎßÇù÷x§þïÄûãë{aœ{üÒÿc°-:ôÒ`5è¤
¥1h¥M˜±`Å&Í ;œ¸pKgÐ¢C/Í¢FÌ˜°`•fÓ;6i*6Œ¤›tÂŒ»t·4N¦g›Ìƒ¬	›l—ì&lr9‹\.é
ZtèeÄj‘ö£Œ­ô	3¬2NºÑƒî8pâÂ-ƒA‹½Œ‹1cÂ‚UÆMìØd¬Ø0baÒ	3ì2,Ü2:™<v™=FY3vÙ<nÙ-zÌØåØrV¹<VÜ‡«›¯·nžÒ·zøò’ÎšüdØûÉœf,X±aÇ×“a5™Ztè1`Ä„Y>Ôa^Ë­ã0Þ~6=qÍö~›Q/—–ËìxTxlÍ‘%J©O¿+âW:rÚ'ü (ÃÐzÁÉ‹U»ßQ¦kƒèžT¥ùfÛlÏ›­x®Ï>æÝóy-D	Cåš Ú º ú` †DŸÖ¯… Úð; z  ògÆ`û¼ßŠrM¸+òMüƒ&qÏtl¤ˆ!UÄÇ]Ãí']Ó|×ð¢®•0fÂ›:×iN§L%§¢›uKš×^È¼ÊÖ”çV÷ˆÏ÷q¡7ï”ë´*ª’	#ñ”ñnýù^ÔM^•”G"›r…é“.Oà7.÷øÿ)ïw‰u¾)×}õ#sÝ—ÙÿOi%©?÷ºÖûXŠ²íMVxµL`r»˜lÃ°ÏÐÓöàpªEG‘Zìò7óBE¾ï&gÔ:¤ÐsV="s&ë¦³^ýCz_{¨RÐ{©sNìl#„n€&ô9¸ g`„8t¡/Át¤
si¯¦I,{—««E)Û‚ÖÒðËƒù:ë‹»Ôc®™Ÿ„wË	L¾å²VÈ{éGMÒ\#rüƒ’x¸”†HäûËOº¦Wƒ
ñ£&±h6’>¢žòªÒYì”	\¿å:ñ}ëúU©´º{Fûç¨›G]¨¨n7»é,(x5”>•—y¥TLQ°™úË¡ÊÆ@ozôÓÑ”ÛÓ)Ö.–¬Uñp‡ÿù@ÔÿíÐ©%£v¬Iž7a)¬ª©¡ò™Ä¶ù#õüx¼”?{]zG÷B¶›Ü|ÝtWÎT¦é·ËËöš£iUfPqÒ±l¢1W´-Œ@8_".úfy/+e‘.À8›)Z†‡Cˆû!–²z¼ßÓËCÿTÙj¿ƒœ(©ÝÁ¡„¤´Ÿ9P<R’ªÙž`À¬‹^—èg!8#Fh‚6è\¦±”y¼R4÷²Ä0þ9^Ô~„øç(_WosàÎ@—¯³á¾>ÌKËó:fÓ¤aTQî|õ]{R˜óM[8ºëFÙY	¿Ý}p¿I4æ âM¶{~ªÎð†w—> Ç ôOÔåKZí’“ö
E=ÁçwqÑ@³À9è³µÆY¶C4‘ayW`w™ÝQ‘íž£Bº4A™txÐ¯C´ëJ·¢9çÁyRÄé§¹ê{6àÆ¿¬>‰ÿ »Ð«   x%Ì±Aa á/?  À@z À@0Þƒ2IîcEÌut¯ûÃÉ†Ü©Ý ~]I
OROƒ,ISù¿5Ó"/ÒN‡²"Ýô(ÒÏ€Ú‚3ú»3® UP´x$ƒÜ0 @ã†×¤mÛ¶­§Ù¶mÛ¶mÛ¶mÛöö  F °Á8'øþ¤™@NPT5A3Ð	ôÃÀˆaQX	Ö‚Í`g8 ®‡{þøY¥CyQT
5E]Ð 4ÝÅWÆµqÜÄãðlü™Ä#9HQRƒ4%H?2šL'KÈ²<$ï( 	hZš“–§ÕicÚžŽ£ÛèEz¾¢b™Yw6„MdsÙJ¶•ò¢x±½vÞBï
OÆ›ó.| Ë¿!O¤ÙE1QÌKÄ†?^OÄkñC
U&”éd.Y\–“
ä9U.’ëä.yS~TXYG¥PéUqUEUSU/5LU§Ô5õX½×…ty]]7Öt_=LOÖ‹ôF½O×ôMýH¿Ö_2¾élú›af¬™i˜åf³ÙoN›K‘Z‘E‘'‘>ôÓOê·ð»øGmRÛÂv·Ãìd»È®·ûìi{Ë¾´/]×Ó
uÝ\·Òmuƒ,Aý`F°4Øœ
nOƒ!
E5L¦s…uÃ–áo–àÊn   `m'{É*øŒQÛ¶mÛ6jÛ¶mÛ¶m[{˜éËÍä–q›¸[Üsî3÷‹7ùÁü:~Œ¿Äß!Ð´=Á 0ŒÓÀp%¦rÌü˜wB!¡·0\/ÌþŠiÄÌ"uÑ§‰ÄO0	Ì ,kÂ°
ì‡À1p\7Àíðü ÿ Ô(PnÔu@}Ð4ÍA[Ðt]fo¡g¸.‡káf¸î‰‡â±x&^€×àï$ÉDÑHv’”"ÕH#ÒŽL&Èö.yI¾Òä”§
µhnZœV¡
hsÚŽv¥é:Î‘’IyÙîìi¢´\Ú+}>È‰äŒ²-O“7Ê/•DJz%[Â	;*ý”ìUå£šFµÕRj_uú"3Ð•ÝÌÀ"¶VpvðFH	Õ
­	káŠá.áÑámìµðŸHž„%#Ó"‹#‹£™£u¢¢ý¢“¢«¢¯ØŸZjÍ×FiKµ5Úfí¼v[Oª‡ôBl¸­ÙîúNö‘Ö0ZFGcžqÅÌ`Ö3'±×-‰5âö°–Y¿lÃîo?sÒ;ùœÎ g¦³ßyæâê®çvuºÝ—žîÕóú¼ŸÇâ?ôÿý'à¦† €fÛ¶]gÌ:k·‡ï¿Ë¶mÛ¶mÛ¶më‡\Ë®÷jxj,©qHC|êø¥_ÖHšZê†ššöŸîÐÓV×ÎÒºžúÔúºúû†1Æ°ñÒŸš²›*™ê˜6šÎ™‹™ÛšG™ßXXuMKGËË:ËkZki+g%ƒ2C…¡r‚ 0Ô¢í„SÃ¥aöÂµáæp'¸¼¾TU›‘Ò™€lEŽ WÐähf´ ZM ÓÐwX,7V«Ž!˜†-Àvã…ñæx/|>_ƒïÆOá·ñGD*"#QŠ€/ÁMˆ~êQÄTb±šØF"‘)É|¤–tÝÉ“ä
ý”¡Xª)Õ‘N­¥.ÓyhžnB¤×Ð§˜ÌÄ´gÆ0+™Û¶6Á6Ç¶ËvßžÝŽÚ{7ûJûcG‡×ÑÉ±Â	¹r¸n»ó¹k{Š{ZyÞ{›ùŸGýÈßÔ?(P&0!ðšõ²mÙìv{Š½Ã¾
f6
ö®	^äÒqÕ¹6Ühî"oâgó/CµCÓBÃÅÃ}ÂËÂ;ÂÇÂ—##U"ÎH­H×ÈøÈÊÈþ(íË³Æ"±¦±a±ñTq]|±àê	-…Âda£p^x%æQ±¶¸L<*>‘ÊK@ê$R/“öÉäâre™–ýr]¹›<^^!—ŸÊO“2'Ozú5H¥ÎÊ°ƒ8¨:¨û‚Ñ`Øv3à¹’EÑ*5•iÊe½rB9‘Èš Á„’èùŸCÔ3Õ§Ñ¼{WXKÖ`U'µZ­ÜJ€„˜d8±w<÷¿arÚœsÞ}ßðº­F÷ÎÓæ¼û¼/›ÓÜãïI¾ƒ1`Y!„$Z­ÔêÞSØƒ%Ùwüï7¥¯Nu¥S'Ÿº‹f)$¢ Â(ˆFÖ2hË_¶–lŠ‚&e:ŸV„Œ_¼>P7Ó!EùÄü+2½±ñ“Ÿ(Í¾,ôå¡ï,¢”Ä,¢•Y¤)³Æ4Ñá×å^zÁÛ¥¶Ùb*‰fô¼Þ×H<i±(‰7{Àä­Ëû†Šì"¢šcUì±ÞµÜµj/~ZÑÊ÷g¹™TÏCËÔÍ›i±ÊÏÀ_¹VÃÎÉYnÙŸ™@™ŒL-?õ·æþ.ÂPŠ	Õj¹\VO³Ù¼¦i+ôLNNzðò2åžššr––—9%.0ªUH)—ãî‡[eJ’¤‡“*ž™™I&•ØF
‚àv†>ùÒÆöÃ‡·Õ`PMÂ—d1,Â0<ÇZ-ˆÒk55îž;ôT*5=íg´ƒÅÅE¿ÿ“¿…0ºƒ
Û0–ÃFáBqâj€ªï?}út¿NyF¯uJ™e0…3îaYKß­[·†TÚ˜ŸŸß-WôD×a?uÌøžÕí:¸+½`J+K¢ÓÅ žM3áÉ®½X…A“Ed€}GûûÄÄgÃ´ÎN£#1Î9GZªíçL8Û>V{Ë(ÂPò
¹R6R)å¬Ð~º¼|ªÄ‘G8ÎÏ¢ lk~^ñn ‹
°e³ `<eƒfë9*ÎOp0<=ÝF«2¯õõ¼×¡eAdIè87Éøýíð[|>Ë&æE›Í&òx3ýèÑ£4
…æhŽ+—ÛÒšÍ0TÄ±˜"…Õ–á%Ì2·öóˆnÀK›eƒ‡Ó­uó¯Ö­)-†©5—þf«zÞZîØZ:o­tl=û]ô=ýÊ}Û¥‰]IŽ‰¯²—ï@ë÷	÷‚Åk§nŽû¬h{Ù.:VªZ*•tÎê»öÁôÒ£šUq`Vt¥ÓzX$ê˜„ë
Œ§íá°=ýø±£Lãÿû³•“n~M¯6ÎÂ`Œ9+§®ù¿ýÑd èßAYÝ^/Þ[ZZJ«ŒiÄšAÕºÌOEÍý}3:5Õ:Ó„¡"$
šV]^®6ßE¶ÌÌxQ6‹}&j‚ÀÝ¸Á5ß5hY\4QOO&óYkw?„¾Göb(œÑ(Æ†½†¶¬ºY0¸@,&[ŠÅ¡a€&b€åP]KÅÄ`TN‚Ø„1÷÷e*6H„«&å–¼Ï6Î(Ï8Píx@¬¼\XÐuAPó•F•¡À°	©šÚÝ„™6òÈ1dï-¤R¢(S‡¹Ê›²¡ÞU6toÑIß.5Îy‘
èÞã-a¨
3"h‘¡K©t4d¥+ét…æ¼‘MœÔhZUiÀ]¥„lÖx€6q/ànª¥w[t(´·W®5ä&»+Ã„B°Ñ@g½¿£¤Ÿ~úé
‰Ê.ÜýY­FhÅBÕL³Ö+ˆçâ#½·¤²[E–0(’A‡iÚlÖi›Íí>§ã~„¡"ä”’IlÄb„<œLJŠL³Ù,«ÐB,&$œÙÑÑ›WW%iuõñÍÑÑ,4;$É¡ÐÅýýb½’%N„xÑ’4TöÊ¸ÏÕd…>è=èµ,»òtƒ«)ôƒ©þ²»Îî,™zí@Ø‡3hæ!bw5!"hìô"ZœF]­÷·0º÷xÛC‚Ò
u°0á©!€¸h^VW
×ÄÄ0L£¡È<EÇ@9—Œ]lÂ¥k%íƒ™0}´°° @´rþ¡¡q`•^‡ŒÔ›\â#3Ÿ¶cä|M'¯[BCEÈôðµÒŠvÇhÒúmUde6 „…à7„»R“
PTFEß[hã¹Ñ	VÒ¢_p™³E5ˆ–—ËšrŠÊ>|˜à´7NAƒŸxzºmôÃßiô,i™„Ñß€ën^Àƒv®ÿÿÞl|ùeæè¨¡ÐÇ?WûZÓµý1†ÿÖ·Ì¾>ˆ<`®ÿê:"ç§åÜ ìH?SÅßeü
þÆ7¼»K>Î (ÛgPû„m’|EùÔü‘ù‡”OÑgè3øþ‡Ìç…ñ|!«p—œú'Mqþ“‚þ@ÂªIä”³M9ý	úŸ`t§
B‹â;Û»çTÚ¢9ÜzºëS>ð« ÷IŽàÕ«WUUEéWVÆƒu³•¹wï¨4×Z£Ïµ½â-úƒ®_Y/ïv»EÎíÆÔÜå•a¨E,)TÕH©"‘Ø€"R·@üo©s³ÃÍÂèuÄ2²s~£„Ä!biŠMKS‰¤kÕ@”…D¡ü*¬n5\£ _F]0Í\ŒÀÐ²szÐŽÎ6ÁÚ<CöA0ƒÞ_z¼Ò‚k_Qv€•¡X ³i{®æÞ…«XÒ1¤¾_sïÆW»ôºÐz#»%Œqiwmñÿü—ÿò_þÏâZòðð0¹¶–èòÚ‰i~ñE£ñÅ¦yBÔ^Yù8Ã[Q¹"ÛæwP?,µmÏÏC%•êé6a±išˆœR œBamm­ B4cPÐ)êúõVÕaÀFÑtœ¡(d4dÛl´_		SS²eyÙïÏd&&Îéo<ŠÑ$j:t˜&ªŠ¸s%CÓŒ¤“dds„ÐA9rëÖÁ/K!0Æ"
˜zp¶Y­)qK9{œÙ^]]•y¡qB%çç:0Tà#|JŒŒP§ŸfOO¡bð‘{sstÿàààÉÉ	|ñz½ŸûJÌ>~À”J6+Ìgµ•‡†7œuÐHÁI+À$Xù]¦‘žd²çwO#¿½ð^4ÒÎSŸ Œ>&\îâb±¨ÓûÉ““ìàÐ$®¯»ãããAn}¼[+/ò,Òu8
™áí Hd~Wa:¥á"/BqXê:ã÷KÏW×2•ÉÉâ¨Ä499·FµZ­Tôª&3ét2™”yÎoÁŠ¥“¬ä:ñ7ßUŠÖHKåBwüe„¡"4Í°¼ãùÂjÑ`‚°—+!¯Çëä±®×ÕìÐxLÐ3ËËËk»é¼û/”eÖG¡Jél–¾–ÓiW èw»<—tƒ·y‡á$Â"UÊåNr%]7ÓEµ®ß¼9(T3Ïîß¿ÿø€æLèK[Dñéò¶ÊoÞ¼9ºd†6ªd
‹ÍÑ3?ö(¿¿¹“S«F\2ëZéø%Â¡f06¤×ë²±‰ŽòÏö:r›Nr¬Òò¿å˜µ³¤lÅ_.Óî€¯Ñ¨×¿xž-@)Õ¡°=£££•ß®×ÿ°‘ÚÚÚòùÔ·LäOÏÊM; W2%{0Ô“"¹‘QX8ÑýùGƒp£‹•3+ yŽ¹X,ãœ(¨·ü¼ttPÔõFÜIÌb'u‡TY‘LÉ(u¾G+ÂPº‰õ)ãƒ^ìN$ãÈ.
&çe<$Î7¼Õ./í½Ú²ˆÎ÷Þ2è
jšË˜Ilá¤dÞËÖf¹:šŸGuäƒì =(Õ²õ¬s³Ž’Žq^„ãóë¥ÄWŽ½ý¦µY÷ü¤åì×ÂKÑ
‹°PáohëÃŠŒ××?·hw(ãžàÉ)ò§èï£¿ÿùkÏf°éÙ¬ë¨'…˜áìÓa®¶>	½’IR|çx6Ã¿AerëoTxªBFI¡Të]Áÿú_'~sBÀ ·Exº¸­Í˜ó‚‚X½%£©„m%3ŸúÇ¥s:« ,£¯Ï¡/¯ð#ŠêÐ
m¿G‰£»?I:ƒ
‘È®6<º–|â7²£ö|åÓ!Lt.+Ü´y½?ƒ> ŸNûŸšð¡³O÷¾Tí.s!ÂÈ&¤ƒ‡‡.šCœ—Íç].Ï©‚Îdê,“Qº{ívóÂP
y)0èÁÚAÌí¤67½àÊ |¡”8‹Y·¹dº'
ÉüžÆG@Píí)¡‚“g9Žó^ùk×
;÷îÝÛÁ×®aèU;+–«U™Þ†"óN*ŸÁät*è+ú«®^×yKâèóWˆS¼;F‘ˆu‰Nœ.½ŽNtLDŒL¦™è­mf§˜0ÕiŸt«%ÞÑ£sÀ^QR'üR—Gé%¬¼5ZjµvŠU±ÝVðb´AðûC:ŒÜÿæëÝþhù+Ð2Es$×@G£ÎÚáâ’•oÔÔ”BMÓjÈŽøíƒ=ÑhT?{#
æ¹Ãl¥³¼ u¢M:ÎY¾šwŽr8Ù¶¼U¬õ}L%µ¼¬LQ:ð•žYY96œWÀ­V·$U>Jd\N®¬¬p1/F^”²ºlQ(õwj6muÝº‰t]^¶MDøZ¦Xf\‘‰‰ÎO_æx°û.ÿj—u€ÌË}ª—ú”º÷éêd5˜ ï°’¿¿æà©ibòPf£^)¿xž¢Üc×õF•ÒxžÇÁàÔÌ³e««§GGV'¥BX¶§¸¸ßS¯÷P¹g+“p¼udÆÅºªz½‡`kìªU:.V´³l®êi3á›	7Ð“34ò°ÚÖãà(V>.ÂÑKªaa»€JÇ©=Æ¢–0ãÜaºD9‚}õÃ±Vk6UÄ|\‰HÔïÜÏ–(Ñ¹£Ìzx–"f½lš>ˆ|]éõúä1S.©Gj©I÷‹{´g q_õ¤ ÒŽ¾kh+8ç§ù1Âè[¡hÀ„°¶ŽË¥"Ø”ÅRÙ ³VJCKZ‚Ä±ßßS9g_8B>ØÌ€€Ô…%Ïf‡‡G£a‰ÛŒ—ÂÉ_üâ›yªgxx¸‡.B÷†¡X-Nb“q,ƒeû¤Ä–ˆì¬².ˆY·øåë£B}”
¤¬ÂõB67uâ<YÀŽ¡l¦
ÌÈpªÕâî²Ø"°?ÊÀ€–è+å³,U»¢H'¸ŽJöù²ËË€¬	ašµOÑÈ¦öw`Ø"¢‰ô¹$c£Â0× ÞÉë)·Ã©¥v‡_>›Ãét:lVß@+¼“¬B>B6®ðâÅ‹<£À(xï¾‚gb²}aCEÂ  Á‡ŽÈYd+†aT²{Û«ëë’´òbu{¯‘Z__O®Á?ü0¼oÅË8-
(!8‹A[%š¬Ä‚3ÿ¦†Ø½!üÀð¡ÓTêôÝkmEãß²à¡…?^(a‹Å‚KÙ£½½pxk{ç(ËîííZBßþö·¯M‹èo­ð ŒþBhÌ#èÌ`ÌÇÔà!²v¯ÙYSWs¹\±f:4]æ)HNAd‹æàPÝDÀ(¨òcZtÛ²È×\é1¬tlyqñùÿz¸w* ²ªÞ-ž—£cJ±øü'?ùÉ‹¢kzzÚUTÄ‡õPÝ^]A¸¦ó²¾dá³hò<+ÛÆœùõŸýìg/5à²óUzã£x‡ÃaÁ˜5A¦¯<Ëaïø5øV/­\'Ôo!Ô/Vê¼ÏWÂßS«ºÌñÂx‰hy/ùJ]gAŒMxËéågv•êž‰kKÊ¬hä­Ž2M?ÿ`¯d•¹" RµÛßÔÔXi©ðTÜ¦©ÍóÖi}C#žëþ:izsTã=ûÕÞ³__ˆÈ_iƒQŸNBÍAê¿¯O !wäŠ3€µ‰Q
ÉÏ¹½¯
‚èE±½­I’¦ FœU¾w(3AØØ8óÏ#¡k:}›ÏNê|8Š†Á6Oƒ²ûB¡t:]¨³¾p¸ÏK×2$þ «òR4edá°ËoÜQT§—eìµÉöGn²Åš¢ððÑ#åZ­ª×oßèÃéE(;›{9ØÁÉîÖêýùE
Ö’‹‹O€kÈ-„^°¤l¦7pn0_ŠÛÍFƒ 8EA˜öÈöˆk¨@§
[$¢tÔ¹îï )ípÀ=ï~¾3ü¯#àÓš†~Mü‰˜B¿Žg§-tz|òª¯¶ý ÊúÊFâ•©—«K?ýåJíôÅƒ÷Ÿçßµk×$CqÕj™z\žçˆ’ÞßÈ”H€">~ó”hnE¦öwOâÀS¬¬NH*çõ±p d	.‡UÐ«ªÈG¯æ²ó2‡	»ª‰W·(nÜ wçhIò¶‰‚¹?÷çrÌG}øé×®D"‘ýýýŠ5öÑG1
ì¿Pè8ãe«¹z‘›¢ßÔ<\ËÎO Dà¾(Fþ(ñ†[ÙÒÞƒ¬t Éè©Œ&_¥=Ã{RgYM"auÊWÃê8O;œ!pæmÏÃ^?ûÖQ9€sŽ9Aùl³¬òÙ›ã²]æ³œ[oFjŽm1¢w³Ç»’`µ

M®)¨:×”IÙÿõdØ RægÙ=]ßSx ©á‘8Ý’In{Uß6ÿ¥œgpw÷NqUÿ¨±»TdôXF
y¶T4º!ù<óÅh4¥ÈôïCTÆBÇ{½R/i)]Ì8€0TØqoÀ
va	üìÞ^)›¢$IÜ8v
ËÔÐÓ§	çæ~:›=¡!ù±¹™•¤¬B¯Nâ8»"S““m+ðwagIËØå3Ž ì<ã!ïíÛƒƒßýæo}òÉï ãâ»ßý$üD±{½—×åý_Ã±/ž¬¬…]²Z­Ož$9.©X\öºÑi}?B¬„†…µÕõÍÍÝ£\.{ªÖ4(ÀuWlb —¯mw“ðöv)Ng——sql2²Eè{X*Î9àKˆ¡ÃYÈãï„{£Á¾PÐtÜxR§=p±¸öŒBCCCYÅ%+È"Á9~ˆ²…"øA…oùÖ·ó•çl$ÇæÆÎzê4—mšÎú¤x°®Röìs†$çŸI•ñ‰á+Ñ ÇãÖcƒø¶‘rÑ$ó	2× ÃžµQ Ù…CN½/üÀ¿Ù´¹9w‹“*œ­óNxÀóIâjs¿º§hãå:º`h‰ŽFçýñÐrZ}>†wÜê«Ü××B=¬H’À,ÒUÐ$ªŽ\	s¡<X©ù¹¿g[È ÿ+{´Ç(ƒ„.ˆ¶‚”·Òètý
€˜›ÏmåsË6d‰ø-°¡v¿-ìèé´ùëæ%½~éèï®#øôE†/™SoÛé?º¼ÓÈ©à)¿m·sïÞíß„¹ÿ6BèÆn·ó42ôjeu%M{Æo4Œ­aâük…ã-8Î­ã‚	³°CN½0áóÏ_Luvú[©Áx+Q({öQ	± =H@À,òòÖÍÁè )äöŽöv(¶P¤xjˆb8DÏ1e00ËŒ³¿¿ßÉìd5$Ø·Ú=ý!ðôãâ…kµ°4–=«Ž.³Þ‰	¾¨¯<üïŸß»VVÖÖRÅÃ}°~ŽÔ“ä‹5"L&ÔŠÛd›%ØõÁý8cáQ¥§}7?ú:¸kÇM(ÛÛ…£ˆiÓ7¯ß:HŠ18<vãÖÄô´Füïr^Ó¸âšéÁ@­/²FC¡hÁ
¾šŸU‰ìÐXiåõú¾÷_Ÿüîå]ÆÞÄÄÈXÌ+z—û‚Žž‘‘ñqM³õÃDœ¶³³£2Ê,ýõnúâLµ‚xKœÚ¹ÿ n_Øêˆ¼"äØââòüÂ‹õÃ"q××æŸ<ƒ<ÿhùe¡Iñþ¹YÊ*ÐJoÃ`E» Ed0g†áŒ‰U¨²þWØ›>·Ú¡ãÃý“³z6«ªÇà6‡„lVjµ¦bH©q”QXàeüô©‚¡·”ªèµJÃ”$Ô%M\Mþ%r¼å°{ªçFîl+äºØ*ÙKß-“ù§þg n§X«°4„C€ÊQIî³ s‹œYS…ñ«”AºžÑË%P}7¨QV‹ûÄçÕÁxl<OÇ=´`·÷*àÍ³ÌÑq®X©$& ¸êÒkd ¹+j¹Ô”ØæHÉÝ
Ó3ŽŽm„À#9? {Eª¢ª•zC7&¨z­F,àSƒw¹€ªl"÷¦”3:ÄBõ6Yhv‰'5:HYî¼÷Ÿ‹bô—ˆÄ#L‘¬
Åàfaà'0a_+œl¾8<>>Î«8000¤UßÀ@­¸»æÀº.‡T.—ÊušEá|{Y>4=µ¢©­·zàAO__¤>û#`p4ÃCl—${c¾f
‹ÖÂÖ–‚WŠ€ÈŸ‚ð.¨ÕºnÆ‰¶óq¥­çÏŸƒ44À‚sšð¥ŒîžSOìâëóù M:%KhâƒjRfÖ×žžS¨óðåË—ðP°G’*M‡z–w5ÓÓ“oPäx´eØÅ&&h¨MbÞ“\LÁgüHM’áãhÒ[ôz‹mãÛu=›Eís\Ž€DFY¨ÔÚx¢HN2ÕÅ>º€_ØLlÇº¯\nh 4°)sœvÐS¡>1!¥€ôAlõRÙæe™•Å—{Ûk°ªT¡{/,5›LL:G-ïòSpÛÊìÂáõ.p­#¼ûø"×»ÌKw^µµò“\dEv“1EF÷>ç²£hUÜT€]¿'‰W^Jž…3²‹oh1”oäÃÜSÐIˆÚD Â-B9J
„OÐ?ÇCÞ¡èß$þZI—nšÛúCëæpjkoô)¨Öôau
&l;»ær_ßSóê¾B$ñG e4á	û~.6oÚ¥à•à=œÙ*gnJª
º'cÚøÌµ~ŽÐáffØ\÷ö±åuÅNBV“‘ˆ üA°·yŸÖ.çÇw±¥¹.’žê·\À;æ¶ù|e¡Â>œD3O›ûo9×<ìä†°1Ùq|æ2}àÎTMuòßºû$rü‡ >ÌÙÀ†Ú†Gz(¸AçiA&ë9+Ii05Ð' ò&iº3¢¹{hÓ ÿÁCNÙ¹"-ôs•CÈÏ
×IÞ»–Yx’Ñ]ÃWÕ3bÀÜÌ¤ŽOëê*HÉfZ®×ús¸x‡h=OËYš­ŒÕ*dãÂ8wX,Ó°:Ô)WÁwã½îðŽ¸å.cmÃšþÖÞípW=9ô-€àQ Î"àwºG®\9=½r%êt0Z†¡Â)¨ º­`rYXˆØ­ßƒC¿l¡:{.ãö ]ø¿Hô¤LÊÉÎêâÓ§6Û“'k;Å—Ïž={Ydúoß¾Ý'i»°·,4á~*nŸˆØØÆ1˜\ë”w¢fHBvŒá¸¿:œëódZÏ_ÂüüŠ½í®wÕõ®ÕÅÎe§ÓÚTL¹B9›-KÅ¢zúpMfÖž½ÒÓÄi‰B	K’7gá	é–ÌŒNLB+Ø›o¿/Üžgê¿XÃ8ÂPò‚Ï\¶ÏžUs¹ª_Uý
Gb,èòZ¼?¸yÿlww·JÈår†B‡
G‚,¨}MmqdÜ…K* ï’-¨¿5#R!­cå¶.'@u³]Ÿo‹.²Íè"ÑÅŽ”¦¶ËÍKœþV™jé SÍÎ|ÌuXñ%Z…»PºF$¡•ïë³7ò›¼7Êy(gåJ¥lZü~¯ƒ¥ µOÏ ³C&¤¿^-—Ô²î{(×c”Û6m^©¡iZ6‹¦ße7Ë™ÍMåZžÐ«ÅblÕuÑ,ÎBÓ7ª•rÍÔkàP„#NÉ†atðÐê²‡‚)ävA!î:ô„ñ¬îb…W7n’ø|¡ Ñ7ÎÎÎØ	F¸ÁÐ-’t”aâ8…MC¶­åL7D;ÜfnmM±‹ˆbˆ]ë÷Y›N³T%_Á¼›‡_G!§¤åt¶æºÅè6áN<~c¨Ýö²~vVw¿Ä®«WÝx–™I§‹5™#1µöö†4‹®GŠ‚Œ{§ jðƒIƒ­™fYXZBíú}’Uá‰Å9è¥µ7næÐM¤ºÈÍâXõdq/¡Žn¼æpa¨ˆe0…©N‘þÍû¡sŸŒA/!¥Ó³gnx–9è%ÏŽax–	Á³oÜçŠU×¡\¿¾¸È]¿¾²´t÷…!ÿ»HË˜ü;æáÌLzóË‡ŠÏxñòèðÐédÙîÜ1ž=]R¸Wu{JÆSS	njiijzjê×ü¯äY‡ÖÀùýDïð?¢{!d›ùOÛ·ÿ)C?òÿåŸyÿÝÞú.\4ÿvá¹øGÂêÕ½§ü³Vß¿}ÿÙ!z\+«Yï!Øo«ÈÑŠ8 Ô¶™êÎ†p³f£!´Ãôþ|ª50I¹¬îÀ¹¯æØÝf2ÇeŒäÆt¿hµ²	Ž©4hŽ6|ƒ1jµï„Pa.Ö­åò†‘?^ýòË/_L÷ÔÍâYQì6ÈÏ×jµ
Ÿ‚((rDðù¢€´+^K=>'øRýdî©m«ý4
½^•YG[Xœ¸ü¿‰‰»ÄõùDA@Aÿé3ëÂ‚Dè1+ü¿æÞ°$ë¯j–ZÌ’™ØA'™ì$;;3ü™™qÏRÛ3»ÇÌÌÌ÷ñÎÎì†Áq3[¶˜¥ôÿW;òdàø*)«Õê.®W¯Þû½WØZÁòEƒÌäH7u‘I9Žß¢V%z˜+×%%º*·ÓˆXí
Ïë‰³T05}Çi–³Y‹Ê“z¢1e®“AÄËÕëz3æb1­ËÂJÝü»¹—ü››þÉ¿»©ýõô¯s=Mž>\výºÓÚ_èõêjnv~·¥ 9Q¬ŽIî?xðxÓÜ—ke¿r…Ôß°Wc)P«õþý±SB®ª	ßó=ßóÕ¯iüãÇSÁ7N «›–‚®äèJóV‚ëCazÿÄÎ ¶WR=SÁq4ºµ±¶Vkeˆ1ù^˜*ÂŽ­ÝX2µ¿¶3f<
ž=ínliÒ9„0Å'¿"L{¬o<Ïæº‚kæ
Ô?HT3D^æ(g¦b­:cÜ¾môìjBà’ÿàVØlx‘§<gªR‘î¾×óòö€ÆŸ;¼ï·r9KZ¶%þá€×¡*‚ØÚ*Î¾¦H~Xãz
Cã*©DXN<@}1®¿)¿»üt+´ÝPË„.o&ïj¼Úcå#\5Ë“S bÓm„³³…‡ÆÃµ‚¼w¶Ü[œž¼JnDøä‘í·MÅVWÈ¹Žœ#G{NkËN³EÿäA¦
ÝèÙ
“sòjðþ¹ý‘˜pã¹æó>B‰Eí<Ï#ª—Ó§óç*ÅéâUö^3CuÑòÁ•ÌDÜ!~tó#–@3×f{ÐÆîÁc{ÎÝž•Ñ¤‹K¡¬GÐí¡u”¥m•têÈN‡>».XÖ˜ŽgMpŸ=ëø®5Á;9yd©‡­¢Þ²ÕÑfåç-Ý=f~øðÒ4`bÓ—Ì_ùµ¿ö×~å¾Ÿ-!„ŒëåÆvQ„ÌôÆ7ýñ‰	‚™¤BüÉ¿ûwÿî‰€ïÌ@OƒËñ
åÜ0äG…Â¹so~ÖJ—p”Gàl¹ÿÌ×¾v¶ÿc+]f|<sêO%UU%Ê'§NU×0vÖªŸµÒul,f‡Ù¼„ÌfÛ|pq“Øž<Î–°Æ”²6Æœ¯úøqµµÆ´ærmŽÕ:UÔQë¢Ð¬µ6Rß&âëÓÓé´wdÌHÔÓÓSCI’Céd›µ‘©©‘æ”ÿZkÊ‡æXkz´Æ Wn¶F»d—Û8ê7ôvûØPî'ÜÌ0
"¿¨úÂ/¨ElU´°€Rß´är§NÝØ+r­‚ôçÏ9
uÈ(NN¯f³Ws(@À`«z½–7,~4Šn[waŸ‡dcÕd’OçÎLØ Pƒ@j-Ee:—Ê]ÇN«c€è’Üî¡–T~²‹•ÃÍ%Pê˜KAû~¢c%E÷nšM<áù\®e!_Ñ#.0a»XR`(e
Ê²æ£(¤FºËfqZ–²x
Ý9l!Ù§­©”˜
™‘¤èRÊ±³³_Î·Œ¸†Ün©cÚÅ£h([½T¼|Þ}dÁå>7SÌ×Ž»¬õºÉ(²DaMn…ÛE!#‚^Á\
ó¬ý>}þB§³ˆÆ2År­ÚRìöre·ô0Cré Tãd§;,»Oc“zÚ-as{E3aEëéëqÙÌBÄ
ª·žWF!=(’óççÂ|a7[p¢Ý–Ÿ<Fÿ,<~ªÑû÷{òò !#EpØÅ\ÙfrÍ!ôÎ;QaM7(ä6ßûoÿí¿½·™Ã+
©D¸
QæÝ¬un­•ˆ2‚v6‘2ÚQs9a§bKèŠ?`¡E¹úBüG³Kwï.É—¯]»<¯ÎMzcOî?Žù&I·MÀÈH#“Zë™èa’¡‘HàÆvt` yÝPXÄª`©¦lcœô+Efðð¡Ãn;u°š OR-gìö‡—^zi XË@„—˜lN×;³TJƒy>¶²C$d°ÙúÎ¤#Ôæó±¡ÓkªtwÁŒÄª°ùÆíŠ•?ÕÕ
½Á¾€9âR¼ýý™·ß~{½¬Œ<Û9ðA‚,	\f•>Â,Ðïß¿Ûìc
wå¹î&½µaZºW¥¢¸æé¦pâÄ„86fÔ9pd\Ý88+-k[*i«U×ŸKâ:èDŒ—; dA¢vle/l/ßÜlŠÊïßs¾TI—+Y“Š	„"6E²wÁ+‡9c{›ž9Ãb˜µÆÈÛ«£.\$Ô©Q‘(^$wk«¿¬ÿÂûÒW%]’tM:ÐÀÈ?÷Ý›ßý¹0wK×Ãòýû7o²>n™?@("!/$™-`*•LUTŸD÷ã`7÷¶Ö×?Ëx³?;ØßÛÙÚX_ßOz½¾`OïÀ B”|†UçÞþ€Íq¸]]ÙÙMí&K[Š:tvÂc>ËÔ³Ÿw¸=®Á±ññ‰_Wòùtjc}uuéÝŸ)“Ïe:Øá¥;qéòù€½Z-6ˆô$¤…ù¥¥+ƒù¼öËæåÚKnËãÕŒ),6· £íë__ÊFŒöG›-n»iõ³uúJ_ø©¡»üX.7VzÇû=ßãy§$Üú)íïøÀlýû3Õ5ŸoÍó•ÊwŒ¯x
ãÿ^£““ëˆg÷±1á[ìŸ×_ŠÅ†.þó˜öWìa5øÓÊÝÁÁûÊO²·þÒvro¹-‹‹Øë:¬.°í™Õ®Í?ë+Ã
C½;Haê½{÷,–{÷Þ›Bj,%íY—Gû©&Óç——ùõ.)±…@f¹eYp8Ž­·ÂÜýû®Þ; òvÙŒuÙY‰nmŒ—>´šß-Œo±Ò„ŒÇŽwü/0*Îèç…‰ÑßíÁÂê[ñN_hÖW{.óJÞ
ÞýöâÂj,‘aÖîagmñÛßþvµúíf^ŸÈÅvãæº­}¾—PDB†¡ýLëw£èä³¬›/nm]ü¬!oRÕ•òßé5@9üú
øå·4±›…
`Qf«ËæñùÖ×7×¶?ºý`óÉ–.puÐŽ'x&@a'=Š¾öe»K[³Íë’I»š¼6Ù<ÞÐþÍÇV³ó ¨aûå,±á1ÉB%©]¨FØ(—ª¹ƒímŸÏÎ‡/ž8M¼¡8Ý*_Ú‚­Ìf®n‚¬ýÌ Ü¯º|6©&ûÜ ¼Û
;[™í´nëGÃöé!› Ga£~PlƒG2úW[ŠÛEx*r¼À}+pÔåI ‰	²FÜØÓ»éå$3 çj:ÀšzñDbHÜ/€ÉP  ÂÇÞ
ñÉ;ï¼óxïÕW÷Öp±š~õÕ´fiÂâM6…«q|-â¼8²ÀÊûâE7ÉEÑRn÷ñîÖ1HˆäŽÇ
Øàaš R6/ð”­äæêéÞ¼¨<WÚ‘'wûš¡œERîYá<™î'¢ù&KE´¬ ç?ïŸ
L™®‰ùÁæóþJóyiáèùÚv =æÝ4`.…ÂÔÔÒ£ÅG»f6×ÒqºX˜Òxl³sÊô4©,/‡áŽÅù5ü®ª>xà95åw«ÕW/U«>_õ–(ÞÒ$ðW Uƒ4}éªÏç{é¥zýÒ¥0éR½þYhóÏÆ°ûÛR)÷n
l5þ‡ÚååÿUî~2Ÿ÷gË;}};î—•w„—Ýµ‹‰÷4*ŠaŠ"±OL3QdñØWÄO2k[_ßî~¶jb¸¿"‚‚s#»³Õ×¯6Ò ;»ÛÛ{øHA*
Àa¥ýšˆ¿D<Vä™zÞO†Fy#‚ž~óTywwdÈ)ä!1?LSš>ÄE–ªÁ^ Y$'7>»ÝÉ«CÖfÇñ},êPÀ\­Õmv‡XgÄ´Þô¢§Z$^” §‘å<>Œ1“{uu„Áè0ÌÈ?ÓÈožg{W6ÄøØ¾g9(š½™üóOÖœêÚ±­n/“ÉìüÃ§ƒÀàÒ?ÜLÆõƒÎÅUguÑùƒ®£Vä;­×¥³ê’åt¥./€Ø™ÌÄD"‘*I-aÉ¾ÆOOW…7ìtgwggÃn_\t‚Õ$˜Mžf™,.òR[Rl—nVý™êõRéÌ™Ç·š.i~I#*LþØ¼åÐWÝ°X>¬écgòLOý’ =Lþò|g·ŒmÆñ¬m÷
ÇÃôÐ>’ ®óC¢JúcfÒ|Ë>ÈærG.ä‰ÃN{ºm„Ïø×x3YlKKÍ„"v~tÇwzøiT¾`îÝáo™o}º¶öZ›kà­[yÚÈƒpå´Eµ’Í'iÏÞ^Ï±cž'õzX½±O‚X(‚dB€,#¼	,
n(õÜVÂ¬„2”Ùh9èNOÏŽÖ£—ª¢Ý
Y¼Û.VKº>ìuLo]t¿y$÷eÿ|)5]jaI’ºá~V`D‹lÉ]Ç$XNëoúS‰8:ð’Ð
ö¸êÛ ðèVÍãrË©Ÿ˜b(ýÉÁ¹ƒTv '×³#qm8îùn%L"üY 2ÿÈvCºýþûò%31_"3­~ñ£_zŸ•y×ãÞÞÝá8Þœ;NNØëÝönËfH8Íø×zïOž” uÒØ
°tX	ðåŽÀ«¥ÕÆbé}òÁÛo«D/ÕgŽ¥ë6ò¬L‰Õ‡+¢:bßŽÿ`xM¤„ÕäH7Å(vJ‰Vð`Ë1&&ð"ÆÔ ãy«YÑòiîô©SAôlp"(ç<uÊ© A)"ðð\ìU² Þ\¼x,IºÀ8TÐu‹ÊÊo1¾þúë£|ŸÆž¸•‹^«=“Ë›þÌéÓ¥ˆUº”yÿŸý³öþæéÓ›¬3Û9©|#b¾Ð£08ß…èÌ£ÖL{§…<íx±±åÎ¼@“_ûÚ¤ƒ:f­ÓÆ´uò(feùÍúü~R½téâ(LIF/VØ^6`7Ó«©f ŸW¹g$Il·-öôOMM2:×”Ä.B¥ºŸß—ÙµÀ‰eß»èÎÜqÛÔì­¶õyI³¼ˆ\«øë­Š…ý±xhêÜpobÜP#õèÑ¸éôé‰Óf"%†M("–V²+­ñu…É	‰ÓAZ{€Qž]:B;«{™Ìjp[æNq«;«³Ê‚¢ÈÅáGvV›•43çYö¸²¶2½T­©,ck+33™N²›-ñâ`Ë¶ÑåÚnvð6çtU’£$½´Ä¼N$+ÕxØ.[ú ™Œ1ŒmA'‡¾£«Ô’aˆ.ÇÂãDÓfÍg$Ÿ,8]¢ápHPÛxYä‹
ShfÎ
è/CgB-æ†‡´âû¨$ä¨ÍI"ç”]OW³Ä³@²òÔ%'EÏ¬E/l¡1/ ½™Ñãj25=é¢ÌpèºOM§“UJM°ƒ4Qª§Ó:Šbƒn„ÁîEfnGó5a¢Ì‡y”ä@ût;6n¾ÄVÏTÊõh*WnD|rSPCŸ>¥Ž«W¯:rþý¿ÿ÷˜¤Ì¦¾ŠjÁñ “LÃjÑs‘1~	p»7å›ÿ8„ve9j
ù<¾ÞsÅëdNùå••Æ‹¿ì—½èæ$Å¬1“ø´¨â‚wºYª	´Ü ›>„Ò–”¢5‹¬ÜÛßÎ"›L[7LR p»@Ëú¼ OMÅlº¢xÉ¡s¹äÊ—¾¤„ÝL’É°¨?~¬[ýh2»‡Ñ~H>vÓ„6UzÌe ¨ûûí£pOû1Eç Ÿyt!µˆ$5­4¥°‰m÷‰ÃA
‘–åé˜õ+_¹þÂ…+£è ü¤iô+_ùŠuoyé	¾á­î1&ÍeµÖïî1+xéË_Þ¸¹Ú½°ãB3D£Buˆþ l¢¾6-1)„“EŽÍ %°•9•Á® ½ÓÝ ~}f¦\B³”ÊúÒÛ¢33´úâ‹UM¶Zrx1b¹Ð+ešd
“†o‹ïíÈglvO"›+ÐëS#ŽfV½C,}»»}ž…Ä™3‰Y“’	„d&"šýæ—I`å›žæyÃ;‘‘§¾ñQîn*£WdÑæ8__fË-=­n=jôåi£A5)Á!$vÂòÒÚÂÚ¸\«‹‹Å"‹ŒÜµËø+	Å„ V·–,J6¯ßR¯Ã6G*ÄV–x§ëÓÐý~Œêx"•Íõu÷Ä0 §~¯Ó9ú=aàpñZ¿ßæ®§3Oß”h(
ýÔå/|ù¯}š)À˜æþSçg^¸v“ŒbüÛÊ“»÷]äÓLŽýbâ›w¹Üâ‹ñøAô0ºá÷A/l>§Ææmú‹–O2ª(JŠÍ> ³­×oy’AÊÍÝ{ÐžÅ=l6?—ž·€ô…íGÞÙž,/ÛlËâDúío%&ÄêÔö;¥4ü){wGkúÔ¾û–†‚››Á¡å´™Ìnÿ®û‡\×¼ÞµÇ®r7ÓêæŒ	K#pÌ£4É?'Wßkqã:ŸaR,}â‡þE™’ïÙ,ƒ·ãÒý”L$ LhJbÈw5º·7o><Cú‚ûl££	MÀa˜^½:ßÝÊPŠv½Ýœ±$l7/_¾ùl2ÊÀ@<~œT‡ï •>4u¡*»`•ö¯w¥ZÉZåYxå‘¦ù*³Â©¾÷^õ“¸Ëç±—¡‡ªúðƒµ•Õµ¥-ˆÖ!&uJéGÆêúZ€Òzýùlfs§# Ç9bÖNàrš½ti°¹¸œlâ›–k“pg@Ç$³Zª†ÉåÀÔJ£ãÞ”ïúšk§×ÃÞiÆÎ<ªÚ(ufOkò`âXâ„
íéÙ¨ÅJ&øéHPk‹›$RÛ÷=š|j^ÊÚÔäJy»ÿeóÝÞÍ/Ÿ6WBR¯0õÕ½÷Mqc1†lfXS¸¥É7n¼s3F>"ó‰Ý|çÆ°ãöÂ¾NÜ§±{?í&úþÂíù‰ºÛÌ†Á!ÁÿãW*Ü…$þ~Š8Ï^»víœOQêÈá¹3SçÌÙ<p~êÌ¹éi÷/öZj[Ì³NÍÒ;óâ…v½®´½¹÷XBS˜ð#A3q»åJ,N´\dc6þ€mîtˆ»!|XhÄ!ˆ`¨õ`/¾µ´µ½µ½É@K/,N—Ãë%Ûƒ#Û°½—U¥WÜØD tX/ž?&L½Îî­#?PCÌôN,fúö÷ûZ»+%µ†Y¿ˆB‡©Ë¥1êîN´–23óh—šœL”xÒw…Ò©Ð…© „y¯wc£C½;ùÞóôöâÆ0…ƒ}EäÅ]Ðéõ/•}\î–©Ø£ëªi’ÁK|½,Î÷U²}“L³`!´‚EˆÙSõôhñ£
?¾T 
JçDQÈ!+Tp'S†äeÊ¬q‡T*Inv	…Jã 	ÔT v*Ê&™T*Ùj­aDúêéïÞÀ[Ø8¨¨àÐ±(%‰Å?‰âÒòü×€ˆõ²5|EÒDÛ–t¢2ù`60²6
d<¿di©õjD¨êLaç¾µZ$jSè©’âê­[K>µmÓ|
c	ø¶Ð3Cìmee2ér!©ž`¶_…ûì ™›y‰y§¾ã•‘›mbBRDA€^¹iÀ*#§\Qc0%ÛV4údukoâë¦õªôs?0VÔŽ}éÂO"!f«X”z¡åq4÷³Ü(gA{¢;Ñ…÷ße³Èž®Ü¼[æ|¨]ˆ¢=ÍÍ¹Â+Ü>2(æöW–Ë{àb"[á…ùÂwú†_x¹¶[ý›U!•ó’ÉW‘@Ž#õ7pöì3–<¿Œ2í²šï=È6-†­F>oø #õš¸Ý@¯×DÙ¡
ÐÜ¤Ø~ŽN&T-å°`¦©èdø¤CÞÚÃ”²§9¢r’I6Î¨Õ9n~Ú(g.„¤ƒ&TdJåÔíÛ·÷ïÔt2U2$;0w àe†•V	IË^?³ô²ÑÌÉðkýpéªÐ’ftmƒ‹#\Ûï³«³Ë'­­•'Ígá~sò–ìÝ$ë^òCëòBñçfÇÂ ’PœÜu|¡ 2¯öªj¾·‘™+™_z¨ˆ>Þxðp¿\cf»U24GC/æ¶›^8Ý˜óýGX¹reg%j „i
nÁ*8ÕbzÊÅe@Lˆ©o8óõzNøs…àÅ­rH‡zQ¿Âö»©\ØòàIâYá%™§Ç=ƒHÈ”Ëƒ`*E×6‚>RÊï/ƒ<%…,cr†èêßY-ìµ™AZnTˆ›Mæ¿°¸È´vUFaÃÖ[»
7V¯aL_¦ ˜Ê"‚ÑöÇO¢€eOžîísÙndh—	£‰I]#Òoª!iI5I7\ô4µ%˜	"µF½<G=q¶]hX‡8²@Agž¼xC²¨d³L/„Iæ.¾&Í›ã[MÆ ü¸Æ—±„@}£ùîï"‘Kó¾ôàC4HóœøææŠ
ÂœÐ9IŠéœ‰×>rˆëäÜ¬Êó
"RY–ðZDÿ%I2I\µÿÖ¾® Þ©èû·n¥ˆ¥MÕo!©”v)GÈëzÄû rªM’,‰1o$€eÃKâhò$q¡ýÝÈÍ@ó†Q£ ß•â£nÌ9¯öãäZOÃÖ´ŸÙÁ`ÞÉ@=ÞÅ3tlq,>ñ·F×7£ûÛ§¿×íZj"B@O›8½¿è@C˜?êcbÛÒ0uˆmÛu­‹Ð
$ó“ü)íúxÂŽxž@þÃH-ÚÝ~ŽÑØu†2d4ö#ŠH?˜Y³joò›t ¡µ5fÿ_ÛÐ9ëVaÅ„UìHj÷áýT;dS©­÷?Ä…Ýå’¡cH§íZ˜gc.¬ÖâuêÄíM™ó@{XìícÊ÷7ÏEMþâžìÍ¥B!\%ªÇgÔà$«ÕéóJ’‘J&cÉ\ÎbIioÚ$d!`¥ÂÓ®Ôá“·ZEm 
b,Æd.-içïEé!ä¥NéÑPñdÝ„ÓoÆªïÇìò™I*aF0!rThÊäÍh°2Œ77çZ‰FØ…Š ]°ÞcÕ0»P'Ë<f…Ñ€´‹ÄQ­†:µ¢”ú}‘ašk<¥|¢˜‹vLNÄ €Ü%ž>SÃo)Ï+X³ÍåÇï`úPÙB¥RH””P~®«¦ƒPò×™w¶NMIŠV$/1ƒæIn]R-v !ˆˆ:a
¬H¦Š
ï#£°½iØV o˜]|‚í¿£þŸÔÛó×:í½s³tŠ^®`ÐèDv»ëáQ ž²Â	Ô(¥‰}ˆ.reÞb+ÙK•’¹!Š&›µÑ(}ÎFú´±Òš¯J^dó±ÓrR&S…—›Ìþ>
r÷ä8snw.<ˆÛVŠ_,¶;| SÁ<Ïc›ÂãYhíÏ[p×Þ0/ŽŽ
âŽülïýÉ¶}ýµç—kt*C¬½l´º\Ö“YùlÚŠ`Amv«öñB
(äçé»ù™çWzP»M¨@Bó``ª9(ò:µZA¶tÀ¥êXð¸FµÒUÁ>T|ŽþùiYê¶-šƒúËª9vãUe¬|%v(ËaóáÖj®É”«aùc³“›s¨aØ˜jOãûú6cž1*G“òB§‚Ïù½fÁ@Z† Û<§õëq˜UEžŠHØ"£
o ÖWl Í”N»Tç¹#rÓªÇŸ ”ü1BˆÒ©šF1›ÐH„‹p¥b9 ÄÆ,H†Y64¯m$Ë®?^'…#uJê’,FQ–ê„6Pš¾íLMÄöG¬eà•Êt¤CF·ky4Õjè9pø[%+.Çþ
¤‚þ×‰Ä¥×"ãZ"ZSVmfºÁfuÁ®¬}³Èð^†hv8ðnõ&&¯ÜÕÿ‚PòÏ>µ
f>±
ˆÓë)äêV/n¡ãys>¾_—„æ¬YûÔ–	~RË|Êà˜¿ò?Ø\á^£ávJ¤Š[UÂ›†,;<‹$³×æŸÛ‚ÁOjÁOemžô—%?ó©-{í“[öóÑž‘ÿÑVþ<DæxtvÈ÷3éÐs[þâ'¶üç§R,‘¯jû~rû›|½`œY0}zûö|bû†`d@Þ7þ‡Û°œMVœÍV~~3õ|R3•±€†¹¸.ÌÛ•LÒÃŽàH£ÆŒÃTÌ.•0S"+ÚŸ±oå	ã-T’‡ÊQµ5‹ÊK<mëÌ¨Z‘+™Œl·×j³˜ìR%CX«“V.ž¶—q“ÛçSmV+œÇhjnª×j•¥¡P]ë¦ÂçÚðÜa…yAq’âÎÖ›„s¹ÇOßø$eV;füµxýa+Gxd¤Øl0 •åÏÁIü òý!‚Ð{·vr„™°Y‰(+Ê`!ÅÝm`È€×PÊÍÍ~®	1ù¼ªPcTsÓ‡L§a´ÙÛ#8"’~î‘üœ]»—˜‹¤è]“Ý9Rt“/å²\²É¶²[.y‰\";ò·Ä°ÎÏX¡Q»O!º³ŸA<g?=üQ”åÇ!T"6c2=>‘è‰­"d`+%VôE`Nf
s¤[gÖÉæ*á,¬÷3ñß¨#7u»HÌ¸¥†‘¦žŽ"LB*WT_OOÀ¦(ÍÂ5
)dÛ*sWŽ×¡À6—õJ­]ÌR„7„†UL 
»EPíßÄð œ{pœiçÜø¥3±9£RÐx›?žpGÒ¯!ÿÅÜìó)Œÿ“(Œvö¿“¢ÌÍ>ˆø?‰ˆ´÷›?Ôö0Aë­ý*g‡Kæ¨ÁlMaTŠiš­*Õ4S2A¶‰‰×Èc0	!ž4"ÈmNÝÎ7;ÍÜì´	Z£>—B‹1ˆªÓ­Š¡òb
eÐ93(rHNÁÎÃ‹+è#4ªÀ5YEÕ!ì3•PDBþŒ¼±áp°¨ý9ØÝeQ;ÆèYŸÁ†48ÿÄ
ûGÔ0)„Eÿû×}"Ø,¨¹öJÔ^ÑL[[G4­ÀüµÜ¼IÞúŽ@èw4S °³Ó z“Ò–‘JëMb³Í™Z/²$4¥õ"¹ysÎÔz¥ð¿àÝÓŒæ3jÜ~÷ÇÂÔ9á¾ô•×®“ˆf?J¨SS;¹¹9rÝøÂìwÞz{V³„;Õê.Ù+×H4FÚ%+´Jö·ˆ@Þ&ÛÛŸP²S¬díwÙ/CÉ"dŽûÊ—¾rÌköã„ZWš¹ÜÃ‡dEãÞúÎ[×¯köÆÉ²uÉ*‡|¹2§X°J%Ò¹ªaeZµ˜aqÙ”F¥8Üå|Ú”T&E0–Là:
è¶;A1Ü./®µ¡Ù º¤|6“8ØÚòzË‰b©˜Ë—@¸j5šÐ†˜Ã²^;¥ÔÁu@Q*†advV [ÝÏâº]ûŸ ‘)^u Ø RµØØ•ÊÓ±±Xra›iö™„L”^³Z¯i³vA¶xÁÝ=8ª'<Qá½ÇFUä#òa>óàÞ½oÊjf!EÃC4Å®2ê`"áEðÈ²‡}»‰Á8¤ˆHÔÔ;e•³[ðDm-gí”"ÎÛ·o¾÷a©Ò@@”«/^ž™ùf·Ý=W$°»ç@»´n›MÂa5Ö¨Ï7Çac¦ÑÃÃ¹Öï¡ˆ„Ì“ÀÜ<ÁÝ.9…‚Øæ¨É¤ÓÜ±”
ð²ÓÅWðCÉ½àŸ¡˜ør4°¨ñ‰ÁÐÞŸ_†Tb}p©Ò3òÔöVlÛ÷Ø[j­6=c÷z——-íKµ9î[üŸ¬Iûÿ›ê¿¦ö·¹øæ´ñGéÔÔWÉÃ¿¿ˆR1<†‡ŸœíãHajÓ;>šmc\¸Ýi•±öüsÁëýÂøé³§_õù^eŸÁG‚šÆ3·š˜Hx½÷îÍÏº^ø>wõåË…mïÙbåÅ™sÜ„‡ìvJ9J&%—k×ìjçf^åKïÝ¼{ó½ÒO;÷S×_ÿÚë?}þüO³Ï™TjFãÐ…aN"ú|wf}‚[H^ýÚÕÑô†*·Üã}ôÝ‚mñiÐýp1ZÔ8¬„aDuþùù³–
1µ¶DÏN¼÷Mñ½÷
è…xö©1…z¹5+QàW£ÄIu¸+q®ó3Bž}ÌÆ’!f~Ó‰Tè¦óøEŒºFÓÏŽÀ&²'î¡OõÄéd—Å+aÂçx\wkaèôMg7`ÿÙhh'Ohj9gZÓNŽUÆêÚÜ3}£^ôm×	ÐNäÇr~P	PƒX"åÐ(|ZÛ‡¥ønµšæd*®èÞ&$@æ“ô iü „¼NÅ–Ì’ÓBaO¤ÎJžJÄZ.Pý9er’œ!„<aÑNÐœ¬Ê¾@°i#‡½èž{ò„lÂëN¥Ö¥œŠím¶SÿrÇû>+{Ï`<<R¬}b]OCtx¸½,›U±ÑB‘‡E ³†óóx'ÞêóÃ(Ï	…ª6È*¶·½³¶„Ô]£ãñxFW½´8¾`oï^³ž¶þ¡^ŸE"90qÂqš‰°
‚Éáñh]í>GdmŽtpcÁÁ–Œ,51l•Ü33nr;.
sOñùas–!¹‰
›ûœú`+]…•B-ÃˆO´%µÂRÀ^ æt4,DÓfRÐœ
¯7—3—×Ëæ\Îëm8N;4g1Y¯'‹’3¹xÞeÊax8+ñ˜ÙTÝbÕdŽÅ+é­´Fº¸
Ù|sÓq6-]³!ŽHOõÒ²ögŽõ¡ÌÇæÆ$¬¡’¬Ýñ9×&<›•šý`ðRmg´íVÃ¿¾5Ü»Ò™ü<›|­62w$ÿl²h´V›çÙ$ÑÞl—¥óko|G›ÅÏsüFt0 ½ù±¶lá%0Õ¤°½=+n=~ï½ÇIs]_ *,{Ô9µfòô«Üï1Õj'çÕ›Nwµ”¼^lRr“ìñÜ‰UÃhlÕh­—ÚVE·××š?‡±DÚÁ8}+Öv~N8HÆwa!±OD”$Ê‰‚n%çÝò„ï¸é“g.„¤` 7ìê
%¨ÊºªÑ±¸hå›NÄ[3Ëçu;òÍÍO3÷¹ E¡z=”zz½î ¥î)˜AO
¸)Õ“SS‘1²¿óèÑ“f¦¤Y€9qiOßî„;Ñ}}oI(Å™mÍV¼$µ¿cáìóûB *‰oîô†¢Xe<È&˜ýý ÃÙJ‹Ðª¨f7z•3™{™Þ3D!âáe³jïzìn79n”SkOžÞ†ºè^ŒúÏžK¥ó5Qu0tyï©Á¾¾µ,’ËÖX(uÍ>Õ€ü¨´‡ç
*ðš·Vª5d·kèym&µg'ghdSôÄ¬
àÖS<N¯Zö'>ö[ÑL×lÔ\Äo]ãèM~mÍfƒjËïO$ž›æ,941;»\DBzy—M5¸J>“t8H¥žÈˆ!›Þt¦De­7 $>HR/Ör†²ŒƒÉB›,=®‰.p½fûÃo{Ð(ð&•éè ìËîSEÔKZïa<gÆ6QÜ@#zÜn>¢§N	s¶wŒ¦Þ±^çV4ÝrjœHªÚtP=x Ž\Qhœ•-V"¦c¼Ÿ½ÓðúS;Ë;)mž«qÎTX½µZ8ëýÌI«‰” !Ö¹Î®‘±ig\¤½ÍEnnn ìî°ÏÃÍMª98bp&‡?Ô³e+ŒäÎŸ±†-*¥Kpù… Ëcúú}„µ|¹œ[cWëº
ãß‰ >²OL›æØ<¬[åí‡6[ã`»Í9¾ÿaô0UˆeJ•`ÐåÞÄŠÓ]VØÙ"ôú|=ìÓ70`Ôi„L¾XÌgØU¡nh*÷`!Ïq‚L)Ì‘9ë™ó'ÇcW‹î÷„ügVVÃH¤‹Å`Ÿ	èÀ¤¡sÃVE±³«!)‹²º]Á`¥”‰R‡Ñß¿};â,í<Ú>hØl·Ë
KM¤=Ïvä¥{æ{³ŽãcgÆf¹Û3Ï9’/žÿ<½w>Ì?\v/Ó™Ûá.®X0jÚ7Åüš{Ò½¦}“tÿŽQ„ÑˆßOÃ–áÎïÊ`ë÷&Îœ‹Ù,µX¨öÍÿêÆ_(6›Á~=éÃ(ÿÔ<KÏ¿ÄÉ}`f¶ÒFâQ2Çær·˜VY[asôèÛySþÛÎêù/Ÿ¯jáÞ|`»Ã›wN^‘Lg
¼£0äÙ[©ir>_0¹\JA‹ð±¼Å;wô†ƒ½á¶;\|ä5~eÏ3¦¼QN&KªÅ¢j¼×’½yl…fDmˆÌsf'7ÊÁQ™§e™ÊrYØ9ÛÏß:ÛO¢<A7ËÍE61W®L‚Íº¨™;íä;2Gùb#ªdÆ;7o>²Ùe³µh´†w¼^ªÞî½ u£=hÞæNÒÅQÐE^;yw²C-?ÿ³Ýù5ÈOè?yNÕë]<<\ô¶?´`’sˆóÖýýþ™™þýÛ·á­C¸¢9Än+G"M0ÂL€}ð¾)­}ôÑÒÂ·@ôÍOºÝÑè‚»™Å<|ÔH5Ã·£4ÝºVúàƒ…ÂÕ«Šé´&æ0Q!ÆÒ×ØÞ¦tGóz¡P
SìŽsp´æ
 ñHa"ÍwÊxôìLÇ_’¢èÄÉÄEz"A‹Û››[1ÎžHØ5™Â8'Ë“jDÁ®ÜMx¥M ¸Ïd*C‹Õ©ªŽCïŽòDUçf™‹ K—³ÙˆtáÍæ£ÑÿüŸµ.Þ¸º±¡š+ê•’)
Ù  šCÐ×¸`—É9‘†½°° io˜èeJ ’7ÖK˜cÀä¥>°kkÚ8Œ+MëB§­ÑpàS)¬l€ÁØÈù5\¬e,’R$Ñ$®¦ëùˆH™ sçÏû„â.@(>ßÇ¬6± ÄÄÆIù¼»‚nw}º¼ËËmzœeô8Û¦Ç¹Ü;ï ÐtïÞƒLXåEÃ¨TÄvöüùˆã!9ÜÛ
<ý7{ÝîÄÚ
B¼R‰³ÏÕ„Û½Q°÷!8°Åp²+{aci‰qþÎ™™Ë/^U$¢JéÃ÷n‚6ÛA›³e+¶2[YÙ:Õkúæ±Í$³Ó;1óm˜	hœùn‰™šH&‹Ådo2Ñ£Iwz‘¬
C½êv_½êñ\Õ¯¾ kÒ®äGdtå'fWÑ„4%ìì»©ã_P™à #D yª!<~l·ƒè¶»ïHìFFÂtddÎÚ±1$,‹G’;†m½Î
!›A)šj£¯ïààCZçÚ3¥“Ö¯ù5aî×üßÂÂ×¯½öê×57K¹üúºÝÎbµÑ¨–ÊGiÿý¿æþþß'_4þ˜ñuîí_jJßÜ<×
âr­­õôD£¤V#¯µ¬ E<–åö×éO½Æd}aúÚOá›æ­ÖjÕB¡+"#ØíGòÃüÃÜ?þÇGþVú¯ñ‹ÆŸ0þýÅƒo@W«„ÒNæ.¥Õ*VÑcÚãnr’Lø£™:â"(3ÞäûüÛš©#-²ZçÉ³¾¬È¬Ä“wÞ}»+S¡ÙÒÀâbß-ÕÈk¯^ïë›7Ñ¦¬qRÇvn£…VÛÖ*¿ð­Ÿ¯d®\Étd¬Ïˆlí­Õë×^þB}tqqT³3‘7¸æßþþ£‘ÔÓ®Ã,äQaJ)‹sj¢Q³-/Æ0g±üYõ{®4â¡sbhÄ¾ž?ö–xÔÛ±ûvØüÎ¿mŒŒl°¨y;C¨P¬ÕœÎ“CÉùc×Ãæ×~Ôá¼ßÉ¢æ8Îïç8QÌdüþ±1ûH×1ô[¿ðºèëÆ—¡Ù†äçÂäçžÓôÕ×^#ØBˆüZ³YÉ„É|RKtvlžù‡ÿ0LY|ë_}ÑømÆ×é¿zë‹ÆŸ2~›æ-4“½=˜
Lv¦N×ýª_¦,~ù'¿üÕý‰/‘¼Aþ†æ¥„
¥5¥(††b(iÝ£Bÿî;ïf³íQQlŽ
Ù µW_{õòåîQñ?ùæÅöx[½÷z£Fer¶ñ-ò‘ð·_}uQ[mù:©S
Hi¡‘ºFW+í­­ÍÞlÍv£²6=9f[¥ûê—¾"°EÀÔ³·JùLYí­ô¾ûÞ;¼ÄŸ>
_ñv–žØNõÉjGžŒêa¥ÞJ9“	;{r¹ž`OëÜ¶¸ø5;+ïqÏ‘™.ÜË5š9_º$ËIŸ/yÝÃ&KUO(Óì¬>Ç­÷|yÚÿ³¥:Z©Ìf—ks6â®]M^#©qçj<þá‡‰Ä‡~ô¡$iÒÊ(ù(éz¡½R
µ½ÃØŸ}—÷vôþO4û³©0áãQJ¶{qŸL©+µ¿è>™NWZ±•ÖDÇqgíí¤é?ÀnÂÖ^ƒI§†îQI•åÑJeeE×WV6¶4çÕ`aÑ:µE¶¦¬‹…àUbµ{”gôFL]ŸóêÀò²­ÖHôÆ{5rÜ7Uñ\(Þ¸ò=¡uûH^ë²HhÏÄÕÕ0]]·¶ú¹Cü:3ò\Ë5ª•6—Ñ
,£XFµn?¬³.–°22²Âb['èni«:Ô´õ
NÔX²Fèþý‹m=¡»EQ;”´õM;>«iú¹ó_ù[+§N­°x’äå˜%p?KBÑhˆÅNžû8ÊùÄŠámµÑõ÷’¿F¼««ƒƒ,jÞVk¡rEç3K†æmåñö¿K‘ÿIŸ;—J±¨y¹£%•Ëì »²Óº½nÏRØ÷Ãêš0K·ÍÍyû'Œ¦7Ç|c›éQÛòa‰“å° (Ö™´R™·úr§ÖÖO
ä|ƒÝrÞNÿÛæÞú…o½†Å’f?žÓ­«Noÿ‰?æ®¿öêkd–­GšÍ[£9o[3øîéüqêíˆÿÎ[ïD®ŠD4wŽ±OùÎÚSbìS¹“É¯ûuaŠÈ½öúõ×H„¼Áž7óD:‹Ç˜§6ï!‘W“gNO'cwoî¯Ý¿y÷ÑúN4+fW/ï–™êƒåÃ\¥eæîò£ûwâéÄáÖÚÓÛ7Þÿ¦öj‹†ÇbÉLŒ×žIA¿™H_C×å þôº\Øå9íîæµ×»ËÔ^
>]~üÞg¦&úûú‡û‚ˆ¼ÜfçH0ƒÑQŸD™/›Ûç÷¸=pd:8<2qg
ôk¯RÖŠS0,Y)¥öÞÑ¦‘™
×vÍ´¤Õ²¹Í>S“®ìdš×«¸^Ú‰•;rç;„"ríÌùLJ_ÛNdòñµÅžlìä*õ€,»ñtÁZHÄáîˆ˜.§êx°pßá^2jÅl*WUl#fA/döÐŽ5ÎÐS‡{kËOk)—Ø^[Y¸ëÖíÌíkµ.µp÷uò™ë|Í \sžÃýÐ…Ó#ýLw<ÒVûðÅÓ¾ö)•±ûö€.\[[êýïŸ€?Ðñ¡ „‰/MV›U€¤ÍV*•+¥tì"G¸ºÙÚ|zggbxtçÁÂÊÆÆæÆæ^23K´4öÂ¹‚Î1ç„Ì®Àd²ù~·7ÐÛßßÛ7 5Â5¬ÑÌîîô°ªïà)\Ÿö=÷úì©!¿¿É/0/Ëp:Ìó|aäp®vâe|)µ¯K¸.n³ëD‘¹G8ÙSN›ãÁ“÷–w…rµ”Ú^ÙØMåË† szb?–©ÁbwÙ¤2ÜŸSÉ3>žÍ&K’Ýëvš$ZÊŒ$rD±˜¤†^8ÜÝŠæk¤QÍ¥7pîèA¦Mío+wh×Ø ç(©åžÙÉæõçñ#GC_<¸öµ¯Ùýþ‘Ó°¾­¸¶»¿=výå^~å•/_š¹téÜÄØøäÄè N*¹ì.Ûa±ªUª—Jc&öö³^  ,õ”Qqx}Þ–È?Ô7
3†ÓSç.Îœ?wþÅ/ \ûÒ•«cÚ56Y¼¾ÑI6KB¶æŒ9ºvôŽáz4ôœÙ³×š=#éÎ—öTÊí­]WrI@0S´Ã³wl/áÅ-àó™Í»p9U…
…ƒƒ‚¦Ù;¸C5÷^(´‹ŸgQõxT57ÎêRÜ!Í'PVoÐçVexÆ<ÅðßÜÌQÑêpÛe=_n(Vð¤C¬Ž[>n:Ñs@a‚ †Ód±ÂôÃ­Äbýý~·Ýfe/1Ïn7žaäã¸ÎŠèPœ6õéH<ÿ3J÷_ÙH
… îôûÜ½SgÏaè»ú˜ÉòéÁ€Ý€h§¦ª>Xb÷<f,g½˜[(Áæ	¸Äz¹Jd€º¾×,ÒJ1W2ŒÞé3gûm
xc¬Ú´Ù–_ MnG|yxK«ç(LY‚åm¡§';ÜŽ•#² Úà¬RxìY"ÓE8b«IÊÎ[¶Ó¼ü_“8£ªù\V’db4!^”É,Ö6w÷¶¶÷Ejb@a§ZoR±PÖË)P¨’7ü±x,ž‚‰KhÃ4WÙªÄÜ)@²ÂP†!³8d™HÀ9†|ÁlE¯”Ë££Všˆ,)X°3[©ðØh¯GÉœäê-—c«`­¸¸Ã£^™èè7È ’cÄå Fñá¤¼lu…`Ëq‚ÙÅ3‰†žÆ9ûôÏ¸ŒëÀttƒ¹v]Í`}¤«ÞI&à·ñG…)À¡à‘í7“ÅwÌ¿9¼bÐ!Û+õÌþýjûéJ]æíÁu-861qfæ«?øã?þ½gánpÈ)Cxàœ&UÒ½¿ôÒ•¸mð¹žÞSç¦Æz0’M²Õ7v–Š§øzÆNMúlf«#Ð;äsÃAŸ¿ÿÔ¯kañ¡ë²öªßewœX \ÍkŽÑ¢ç¯2Œ„µ¸;¬Á›8pñéêÜ›oCup?PTúáÊŠÍ&ó¤Q¯Ñ(ôRÛë0Æ~º€ððîÏìŸ›ØßÒ^-Çv–Ú¤i¥y]®¶¦Çh¯£
[ê@˜¬!\O5U5øw´m³fl.“žÐ¡¤&»ÛJÊù’ÎpwÐkgž02É¬®8¬P]Æ—–lÚL Ñ¬dòD…;ôØý±U2€íÅL¢jqªŠ"
F­Ú0MfÒ©Øþ¸r>Ëò™l¡¢WÁ²)6(¼ÁÁÁ„6#*ÍêŒ#²Pµ<‚dí7G´\>¹~](÷6Õî==>èsZEëU ¿Ç§Jø¼2±º™^¶tFF7¹l¶¥¥8ÄêPôl2“¯Í‹voæÞ•U,ÎžÁÑ>§ITT·TüüÙÉ³élê,8
,0m¦¡›gøœCfä“9“\´8¬_ÞøÖ;ßEøàÞý{·ïÜ´Wd+Û{;;Û{‡`1Òå*„Ózƒá£U©Èön»ÌdóùB.?’fnW’{à;¶6VpPïòSÆ+ÝºùÁ»ï¾÷Ñ{o/÷{–µk),0É\å™6Î¹f{§¯O¿Ðè4zi¬ý¥¹ì=Óy“£>oUy¤…²eÛZ¨¿I(ù;¸c
0xð3ª¾Æl_%Ÿ××?Ô?ê¢ªªI’¬=Ã€»à X°e©¤…ŽË…ä ¦ nÙÜ×±†¦0Œk©DD˜Är´¢ÚPjÅî²Dx›Ó.GøÜÆ“íÈp”=UmÁÔ#“Â;Æ‘¬nç¨
$»Ç«Ö@³g¯UêUæ#€·pf³á¶ÓjI—,,ƒÉôó²¬PÐõ|^'œÕÉ<¾àk‰äÌ¹šÙ‡µÊÂkJôÓa¨²*º˜`­`p‘óf¿×Ö„™SÚ&à&Ef¼PoÈ.?BÝ[Ë›jMÊ\âAš;–Pˆ„¼l
 z0vþÌ@Åbi$c[OÖ’Õì–ÃÕ;šŒÆ3{£NS£,]13f"S){P Fzçé“'	 uû¸F±dHœKrø‚Á+¡³3§Bö…Åïüü/ÝÉ–Â4hûìä§B´_~ðÀíC/¾pùtÐÞØÓ^Î¦aÓ”J¬¬1ÂF¢¤³+0<ºpëýêµFCºñäñnþñ;oUì§Ïœ¬oÅ`»¼•åP‡€¼E˜Z,¤zP«é•Š^¯W‹ÙŸø¾a‹lñzÂ4S
û.ž[‰á—áÒŒ¹pÿÿ­À¤§#±kKd¬×à˜íÚë}”Ëƒ¯¿Ž&ªáÏYÒ,LMà ô­·4ê°üiÒöRóñæ_ft£.Ãqç£xQá+ÊÌNpf¹
@X;Û~©eÖp×zº˜bNÉ—>ZÁßR¥hÅ}¼xˆùÁ Å›fÇ nW“ÃjÔ‰¤ÔuÑ.ÓH¨V%¼‡ïê6Ñ<R©ñV‚ý&m:!<¨Jf`RLåäÖvM‰œ9ï¦IÖV9è‚“ÑG·–ÑwñbC±©–nD
%4>199ÒoQ00{§‚4žQä¤"sfäÔµk^/S×¯_?Óïj`(JÙ
VèjÕà™ÕrµšÀ¸ßˆçt^µyì&›Óe·û†ú^ï©µžHˆ‰šì?ÕnéßJ(ùCl¼	*rS¶bd@6‰èÀuˆh$6¾j„1ê<Xžñ§‘A&Ã9:n¼¡ýÏÓ½2‘C(bH"•½§O‰A… a³7m$‰01æ_®×‘RÓ]cÓ92€Šv¨ßíš“­ÇÙ•ÕlÍœ¬½–][Éfë5æèO2G(i=ìf/TÛ	ðH€e;ç€x0{¢"IUŒ–_›_;Ÿ0ƒd Ÿ£2[Îmð—§<.½ÜÑ~ÃÀ¤uƒôV°HbÄÛå>´ E,Â¡0k1ˆ±›0$OG*'ÂZ&l2H¢d(Ì?VOˆò‚ÈãøwBÛy
I°n‹n›hâ#fÅ®G)T"5MóyìzB·—tƒ‡î¨'w…4-Ê[^yúzO–¾“z³½Ýeç
½X;@Cðü‰’kfäb¥öy»JÍw
ì=.° •àIK÷êšó¨°5½]ÎŽnDBüåå¤áÌïK¶LÆ&V*bii©ä*\Z˜¦Rß¤ÁàŸñ«!G>ZâHŒÒX¡T*-–"‹x„Òoâ±?CHÇâä`Ëa}ËŠkv—Í7à+n–%«UÒá÷Åv©WªK½_p†Nê
8,*¡t’¤–67K¦?ˆ¹úàé~Åfƒ«™é4éÆí
fýÍ"hü¡]=nïÆ ­dÎ­ÍŸðÀ„µ K1¡,ÞéÆ%úü,—éê&‹\¢r|ÒÏñ¾hÆ!Óüfÿèr˜V?ì:æèÿAÆ–±Á!,O¦ÅµžÉµ¡ÇaþºµúaóéŸji–ñê·àdxä•[·ˆ™ãÌ&f¯ˆ½<O0	/ù€-óIfä#iáëÆWµëä_0^>ÜÓ(EŸÞøEÊð‹7žFKÆ=p¾Àå­=]¼wO;e
]M6  É,˜VÉ  @Ô¨•!²(×XR5-L~D#3LûûÃ=¯»NÙj]õy¼^Ìv\‚Çü¸wYÊ›ŸNgÉ½pÞcÏÈ•YÎA*íS|Ú§ðÚ¬¤IK(ßú˜5i£A3)Â¤0KÜhG[\ÕF,‚,·ÿjXYœSÈ5yA Xóèên?:š:1ñô©)TÚ3ïCš¦>Å÷ýr¹§´¯â+ó$†˜T†_}ø.Ë˜~’T;¡ë l˜˜à¹žis¹·lšÖæ,HŽ§ÇÎ„³‡‡ŸjÄJ*UKq<ƒD‰ÏYÏJÙšS>!Ã
Û7ÉæéÆÓ§âÂ®RRv´ùf‘{ÊûæýRª…í”ÐÃ¼ÏW0yiÁT0<x‚;[wJÎZVn÷ÂkhÙëƒÄë!mâÒ-’àqÀä®­®3æÜtföÍDÏfcÖºšxº;à.n;S}æD„s’³7iy»ì
îF&Ó‡e&&Äê±L¬¾'$ÁÓïÄ”•ÃJvEß^‰‘Y![ÝV?|"érGˆYã˜«¡7)¬ôçgyE)—#¤¦qè5ÜGÿ!žð"<ØŸËõs*„~*G«™xr|ÐN3ÌNŠÚ†Fã‡ªÍ	’Dt=â¬Ye¨û;Ã}hÄùAÁb
i¦ *”VŸŒV™ù¶•ãn¡¬Í;Gä7â{;›H:+2ç<ý½Îù#/›¿aø…GòNFíg>jTRØÆ. W{úvâœ=m¿èÈ¸´¿0¹›r°Ûjëk=fO».¦ï¥íÎŒã‚68@¸vhn´…¶cÑã0P…Õ£èpˆ:• i1…FFB&v­’Áâ@ëçjšÝ3W÷Jx÷žiµáo&‘KÁT*Èñ’åá­En}“àVüN‡
UÆ³z%{8<9¨èQð87v“ypi©\M›ór¤\È­Ã
ÑÓdwø>§Ãeæ"žZ;1v>\Ÿ…+$“‰$@ùK5E©erzõâÅaSùà|ÚÝÚáÄsjDNRÕû×só.~¶Oh’®^fÙÈª-t
M~ªÏe&éÕÍd¾ÒˆxŒj±[F©¢Å¬û{ÜUœ?–…°ÆÌuÞl®ñf•UÇ†A’ÉNOù¹êÞÛ©r®É©l¦ÊiV6_X$”#
#âE™!‚GÍMï2·¶JåÚüX
(5
öƒóx‹kÎ;…'§¼\ná.$õœYV“bT	th®øÓÇOÙZæ—Ì‹Ø@¯¥5n~¡àÔ¹h¶ÀNE=úpÁí±+b‰yâ\y€ù Ù€ºbÒ;àµ0nzÏM'b¹Æœm?%Z}“¬•)FLD1–ý}ˆé\0=N¥zzÀ -±²×–}¦öèö{ï}ø$^0àS9Í€˜#HÌ.Ðy8JcVÇS—.^6W³«’Ý%–5ÄÜÞó·	Ù« c–-]'¼ÅkŸO¬ÞþÓMôŸñ‘üBÇG2F1ä#y£n+§Óå'¶ÉIkãIƒyˆD-ƒd·ÏG»»ÁÒðp)~tØäd¼uŒÎc€þõõˆ\NxœjX1×«Í£Ì?f{á)é6l6mz	—0ÝÙ:(ýüâ°'™ô°¨©n4q™'Ê0PbY/ç œ-†ù|~h¨‰`,—+Ñ~øáƒh—:‡¥O69¾ð…rÙjmFMÍ fJ‡OÑ>šd:lØ2a¾ÑÈåš»#ëðSÌ:Æp™:–FF2CSzk4¸O	;Ó)-ÌãLCðó¤®ñþË€.4ý#BË4ÔÖª›yž7$vˆgÙ6KŽ7øl6MŽÏAýµ„³v
ÚèðªN#¸@gRñ³3£r-“D€UU=Ìæ7)UUÍ~¿B$Iñ°€!K-™PÓÙÛ„ƒ_WÙÌðæî~ðAÜÖÎ®¯33˜í]èG Cf•’ÙéRO6Ë¼)tjúÌÅ™W.ã½“—™éŒfé·’Z9“ÜßÇP¨…QŸˆ¿¼³°p­¶œ(UÐÎ”îï 	†Iû|ä¡ö¹/Žù¹°~Èh
'´Ì5MÔ>ü¢%ÇÑ9-ð¤—dQ#íÃZÂ²®êzç<FÓ³<õ„yÃØ÷Ó½»î@Éïïûý`üþ©%OÐBíÿ¥Rr°åïÓaGíZCo}„­m;ö‡ÝôâÕ½^·¿Òï¦Ô}Zó=c_Až¹žëaY¿{òœ,Ô÷ß}×=‹³©ÎŽ-í9xj@pÍü¾?ÞËË¹Â¤í+',ÜÛË¾H´=-³ÀÞ™gTö–l2é:{³Ë6PÆ±n`€ª¢&©,äÏ3šQÓä#Õ9ñ^YY©V5ùHã,³WêuAÐä:foë<ËLš¨a|Ãt§T),†ªÌ‚7þ¬é¥Ó6ãòëaffþøÔŒÕ+sªošC‹…‘JéN•Ü»7§±ý†¹ðúeÃvú%ÌÌÌqïÖã3D41X³‹b}¡¾p—ãC{ÝÊüwãÙßƒôûí&‹Ò åèž'`&Ì¦¿Á9ŠG‹Ä©ÚMawû'½.Úùiî²ßkw€‚#ŠØqC"{˜`³&Qõûƒ^+“=ÂºLfÇP­í‚ÃÆô¬Á›R¯ÑZ" 9$Iä|tõÁJkY£ÁÉöæOvÉuÖ³Ÿ´Ëb9ÁŒbâ†A¡7€¨l†YC¥r|”'a\µZåß øö“$i»GDB‚n)er…:±Aà›ˆ›ÏmIra-èèš»My™<9¸]—)%z{÷¾>¾ÂÉ **6ðÛZPî;¦»énÙpgÞ51õar–„É—±Óc”¨›©¾íMˆHšäÞ¼¼Ý×›ÌÚ\;Z£oa—žÿU­‘A3;‘01æ@¥+DÄ í	ôx“Ü$‰ƒyî«lE·êðRHæ#„¾ÁY]Ö°ÿAŒÀIü9{ô~‚¸/œ;ã!ñ‡´7™Ðh|£¯Þhvy*“’½¨a¯cUÛN”ìvGsæµZ`^¬¡Ã_‹Ðòe8Ä!»CV’__[ÍæœŸ¹®]cŒÂðp»SmìŸÛf#’?ˆàÎf‰~°¿ÝŒœ·ˆ ¨B˜ŠÀ¦ÚœûéZ†7@þ&† "í¶‚ZHW.gÓ	ëéÍ›6Ç	\¦RìÛŸ1ÁÀðÿ ŒÿÜ½s÷4¥óc†?¦S9ƒn	sÓßîœGdí>"Ìïº=âyÂþ‰EsßÊè¶x›°¤ƒ0Bdˆ¬>3,qýa¨qÛ¤?Œ³È‰ª™;™ŒÅrÙ{ÙbÉhÜ%r+ŒcÈðBÝ¸SÕ²´d±./[-å²Eû&[­Uë¿æ)žI
›ÍÃ¸uãF»”?Üö¯0®²`µ©ÖÑ.]9åWõª‰Ýñº|å•™ZÛy´ðp³Ê¶h4Ì\c˜ÌÂw3gIµÒÐì­lf}ç/\ÄŠXÞ^x¨×kÌ{Œ(—VoÝøöãT$žþ€©VY¿}ûîzYöL½øÒËç²6ÎäÏ
ƒêœú‚úþ»D§V‡`ÐË“6=±t÷Îí§âŸ¹¬uŸVïµ3ášàÃüÍf'ÆN;kéuøèÖÂ’‘fÎ0
†Ìê÷æ!¬°d!öTÕÇ×*–à™óçóx’cž¦í p»é­êíVü#„‚®A:ø²° òÌ‡ÂCûßdë«
¤êJ5è„îì°r(gêeÔ´\Ì¿§X(‹Øµ–ö—ï¾ý³?û³oß]Þ/…',-¯â§•e°ä_»v~4 0y~`ôüµ¯}-42:ìøèH(¤½ü_ýÊ—%Í"H¢ A 	"ólbˆ‹XÓ™¬¬A3R€À9ßôrDÑY´ª½¡töÌv£Dg"ÎdjÔÆ£ £$éÐ¶¿ÕñhÜ]³-±°¸€ö]X\‚Hqéþ?ó3?óÁýæÉ…[J±
š·‘­ZÀ³¡TÈ¨&ªÌÖ&VñZ äâ; ·ëñrØût?žAæé8“r|÷wâ¹ðÈÓ½ãû§z=LTañ`ûÇÙ=AÆ÷{ì†jj0•„Ó•¨fóW€1˜.‘9µ¡Ì1uËG`Åho4ÛI/CQÖófÖJ:ÁËì¬#™6ÅA |æM„
UÊ1OÍû ‰™6oãZ–i˜Ðˆƒ2b©àÖ¤ü®ÖÜVšÞ¦¼KfØ¹ú+6Ûü¬ÒôYøÂž&3\œð›7OØé´6G¼ˆ];Ó+/êõÊ‹u‹¥®=ëvÃôö»'¼[½s§ªuy·èN3‹ôLˆ]hOOX!™XNSø&šŒd³s¦a¥D÷@Òš¨1rùòÉw¡gÜÜÜmä½ýZX?\pH{)Í”)•ÆÆMçÌ;¸­Ÿ:{.á¾êÒNÔEæ¥Þý€yÔžÅ!›j
ý•ë¯\¼(ŠZ¹ûm‡Ã³¿½3è+©…¡Ý8åUÒš)ÛõCO#uf§#ažü0á>>áýb9›þ×?éÀÑ÷öŸü×™sš•ž={xxî}ð €¥¶ÕHªîÜÄ]¸{A…[
KµBµ I{{’t"5Õ@`y¾2ÇÇ©fÙù?ê}T{ìûÑ±rX‹ÅD¢	)t¹ÌfC³šÆÏÝ~\0
ïžW'0Á‡Íj12-d&zf&ŒéšL{œjÛzª
ŒŸž:}z||ìÔyøcWKuÁd‘xTrðL<•^µkvZ×Aj‚m`¼ADE	[9‘«æ£+WRª
p•B*ºzûÃï>ØÜLÀì(/¹Î^¸ræ”ËÊK}SögÚ;ˆJšï¿ïÙÙñÜŒÇoj·2©ñÌ,O“%ÒéKpþaØéW¥ZhµVónu¿ý’û¥Þ^æ<àòe[áð6úÚosÒ½Â½5~^
Õšo“Î‰Ú/
«…‡@þHÂo1‘
Zó´:»ã°ÂÊ²“’M—“"àAã; g_öpyaù0Ë+|V/UÏNu†˜^ ¾pA9Pgã¼Nºslî"!ûlåy).“KÞG…E/õËaå,9hfÈrDNåž‘89ëåºÍ76=æ³mÛ=MÒgBvvãÄÍæS3Ãú7ŽHˆ‚nÜULZžY†DèÒ¸¦,\¿®(ä¥—4~ä"B/ÜÕ>~ª²!mì-ô‚)'Kd\,¿=ý>y_í‘änw>ã6[¡0>µ1‡Z‰¶ KsÊØï›š|û6¥/ŽŽÍ=?Ÿ„¹oGÝQ2N–DåúÂKä%q/Dî’G»ºë­]]3pGaÖöª+ù²>´íÜu§î\ aLº°éÙmÿsôƒµ¡©5Píòôtù:ÑÇw¯\üZ4eã,Ž›™	Óííf”?ØîçXlÛL¶mõ¤qºÜbÂ™ž—PÀ&ÁÐ0ßúÖ<é¶"/j„‚^hs]þÍˆ4R©÷÷×5i?c%–n7ªï¼SÕ¤éÚM¯wkë$M!
3b·:¾Üœ.³ºµµ¹Yñî6pã¥—È—¾t2_—c…‚+“Œ†½ü8¥IÅÚkÊUuÎŠß/'ú^si'ÞVW·¶@J%~íTEÕ¤Ú•+×®‰".¦on¡¨'ß0-˜‚Üf)rWœ“JZ“ô¯Ð}ÿ+ÜÑÿkò­m·vÒÛÔS&šg’tÍÄ­Äb+ÜD08ŠÍ¤BÓ-¿É;A¯û%î¤Ç¨q¿œ@Ó»<gzòd` <0ðä‰¡)L=Çæ…{ÎäõF£hÔë5Úòw_çd>'	-Š#ç­«÷ˆ¸j=7b½/‰LPÜÎ-X†¦‡ÄéÜÂºu¨™çÈóCÆ»H|¶D€È£¥lÝf­V²œ`•
…²Å\,ç•z9o0‘m®X¶˜H=[‘¬
ÉVë6NÏUy›EÉt«
m¸bQ,å|Ñ\V•FN—mõRNäm|=;wMÏÖe	„6£š«r6³”¯”-õbQW,Å‚¢š‹µœÞP•J>Ë›X!ˆlãó9	É˜
åAÎ*•
fE-Ëå<(ª©ÔÈVD+(VžØ4Mç	à˜EbÈVUª/Kákf“
ê+2—X¼Å PÃÀBºËKu^·W+•(WÏ×%‰¯WKƒ’b%Öó5B¥J…É’kÚ5I×"¨ÌÏ›hjpµ§"Elv…zÕ¬Rƒ˜ë"Å»ŠÙ"Ô
å‹UŽ–‹…'Kœ\5Â=EäPãç×Ê–‚X-Utp­Û²Ûã«è†tm¦‹‰øö;+ÕýDûGgæ!á¾üW-Â-üäþþ<ýþNþ—ÉŽÏ“öSý>öÐ¿žžÆ_úóì¡xòDëz¦õ³FÿÛ÷·~Å_ã«?÷<ÉÐnéáA—zÀ¾‘ÞOü'¤]ÌSGÓ'³iü¤hO'zp"v$?K€)D¡'ý¸¼
ž0E~r†Ô¥ë$_jÍAÿZP5
qîIŸx‹æì´o›Š™®¶ä=«q†µ
|#yâlÁa2…î§FâÇOíyØS6[2ÙÆ:5sÇï,ãný.ˆe<SGiünÈ³‡Ë;wNÊ¸FWžp|½1©É<o±¸\ÍÉþ~¢KdKãa\iž|«Qç¹'+£xKh4 A·
Ø¢K:é÷à-‡Íæp†ã„¥ªÅäu¤³U"ÚéXiÎjWx^‡@IçyÅn×,@WXTžÔy›M™³êØÚÉÍX/ÚTh²ubŸEeÎ
;‡¸©h´_®@Õ÷t[±To4ê¥¢ÍJhS;ß~ÒZƒ%¶ÙÜ´Þ‘ej­s§…SeT^–Õ®ùgQ±™¤°9ÔëÀ´ãÒ$Œ¥¿Èi(Œ½@ù|ÞŠæAÀ^D‚Ñr  #j`ó‘/”	'¤QÓA€¬rCÔªµž¬×%—¨pRð:2³{ž÷“}7ó~¢ÆNXü[± %O®ª×»½]…ÍU>?pæˆH}Â¡&--åó€x¶ß¸Ô9‹Sí5@Ð9Fs9›UÏ¤Ø¾±ÖÐüVÉHf€FCGYlFƒ«­´jB=º'ðaG?–ùJÉdç|;%^óïgò';ëBª‰'Ð•Uò±ýý“öCV‚ßº•HÂ©E*›Ï
®pš×%¡}¹
1)µb
?¨V¬`^¦¶ÇÆÞŽööz!}bLj^½š£„» ZTôÔH7Uhm¤ÞlªbOX¿Sµ Qˆ*iÎ¢Ñ#;§ž¶åœÙ„¾1‘JRšSí¤”yL•FiÓjŽ0'<–9•w
L¿üòËÓnž?É}`ØÍ»}²ß’kóAcƒ-[lÕìh!h/k¶NM‘üÆÂÂFÞŒh™š´à+ÃaÌG„¦ëÞ0H]ÄÄ°a-dÔÜ_°St ×>Šµÿh»F   xÉC`Pà™ùq©m·—Ú¼Ô¶mÛ¶mÛ6nµc'§8¹mOÕìÛýD åá øPB_WIePß6BÛÌh¶FØ1˜fg`¹]‰µv=vØ]¸gà…}…wö
í/üemyV¶UYÏ6àP;‚#ìhŽ³8ÉNå;›sì|.²ë¹Ånçv»›»í>´GyÔç){–ì%^±×yÛÞç}ûˆì>µoøÆ¾ç'û…_l#l4£m"Ólsdóí…!ÕTÛVmT{µ·ÔÉvQÛMÝm/
5Hƒ<ÕP;\ÃíH²³µ ÔJÝ„t[·}y¤Ç žé™çWzéÞƒúª¯6R‘6JQþQ¬MR’ÍP‚Êþ×LG{Am±™™™¯>Bpt_8ãg63‰¥öÃªzj‡ÞRé/˜ éº†(UšÏNKÙÙì²
¥T^É®KÌ2zþgÊì&ý‡éW¼8ö–-¼TŒ§|Z
'ñ„’¿G-*¼ª£ÞÕÍˆ2
D/vuÏËtæøƒ[oÓÝ“?àY¬2¸þ1ftz&z qª°;:
!÷O7¨†zÄ­ÄLÄ+úGê¼}6³“þH
U°ŽRÉibw*ml®#zèÎ&šê ™F¥Î?ç>h~¨ð|±Jé6ÑÃT|GµÔŠ{Ô~%°g[‰7ý^gü¿Žsú'±Áu*þ(›µ³àÆÙ¢Uœ8A™r¸-ô!²|¥{Ï£öégÙïîI¬½£ÛÌ“ÊÜÓ7Q“)AÜ8Jý
PŽúWìz§Ãœú^
7ÕI2§ãŠžò¦Xéµ
‹— û£¯ÂîüNR»RÁºG°)„:AÜÓ	·Dz/lþÌÙ¿ò_â~uŠü×:….ãe„;ø
ÿ9±‚Þ„ìëß±GåxL“p\G†¿žµ'=­v×O+™Q\>3ËÌÌÌN"333333sb:fæË13ëfZò«ìT÷t¿¦¯jzÓÉã¸³¬ ×¾õÄNæã)k]7³³¦/[áõüÖu^/lôâ^/Z0Ãëe‹z½¢uEÐËæ{
]]D€#JmyÝ«mçñÚ±õø6úõè¶Ž6FZ áB&%dø”÷ÁQFL9µ:3jÊTgFfn¯¼¾ø~M¡vl­ç5^µÌ ^åMëqðç81F½¿™H“™Ëxæ³œY¬d;‹ÙÉûlâCöúúý|‘wù2ßfßåç|‰_J|O‘–ð7}O?ÓýÛŸEn¤;N‹Ý	î]åvOèj÷”{Z7ºçÜKºÙ½å¾¡;Ü·Üwõ²û¾û¥^wœöD½£þúj40ú´>Æ}‚QÆ(c”1ÊeŒ2F£ŒQÆ(c”1ÊQ`DFQ`DFQ`DF½ QŠJêÈâJÞd$ŽŒ›é€ÛåÚ(µž9ßí]
nÛCÑp¨¢Zƒ€uÀÑÀ‰ÀÙ\Í­Àý<o±÷Ïðu~ü)!Äoö¨Ô¢©Z¢-…ó+éX RƒKˆ±ß¹=~Í"‹4zkF°Ø–æ8Ëi$©©«þ±·¸¤ð'Ëy-Í)	9ü…ÄÙ]@ÆjŽèz,K°ê»+<Ý3áÌGSø¦ÿn·ú¬eê’¬³œñîÌì_,Rn‘A.éý‹œ•NÌûˆ9Ò^Gjr{zb‰U5C_iþØ4^4f¯ò¾XîÒ‹N%‹ës=¢UËµJ«µFkµ^´Q[´UÛ´]»´[G«MíêÐé:Cgê,­st¾.Öeº\WèJ]«ëuƒnÔMºU·évÝ¡»t·îÑýz@ê!=¬Çõ”žÑ³zKïê=½¯ô‘öë³ú²¾¢¯êkúº¾AkîxP”±Û$þGy®lPy.Ü~æõ&‡bïïó½¿ÿ"Üº‚ÄâÚàRÊÖ€Fj²å-m
µå“Õ©Sí›ï{°GîÊÜzô$Ø½r{rß-ÿUî»áv3 ˆ¾ú!èWPu£Ÿódîåü,RÑ^±-Ûéí,dÏö2ô/‡<w¨÷g`ì®Îô½¬>ÔiVtuüÍŠ]Ár{âÏÛ·!áƒYÑÕÄs€AöÆ£-bVúÚu9<Ý†úî]MýóëÝžÊ?ad/5«!Íp®ùiÏæ·¸=Ý[¾Ø}›bñR³ââ0 ÅrºýZ`„ùîÛe#ŠcÍJ(Vþûæsæc-gI¨©ü)ÐjþØtî´n‹L7 KrÇV¾è­!¸²o[îìžiIé‡•·“îyÅ¥d½ÞG‚ÚP.!ænÑ|&D^Ë»·ßvüZÝÔ½Ç¶³~OÉç˜ÿC8ìL-,±³ËèGÄýúW¡h4K<M:…,pÜÍopDQ!ª‚¨&êO&
¢7Ž¢—,÷™å¦ž¾4ú3„f¦3”™,g"«ÙÊ|¶s<«8‘SÙÅé\@ñ'ñ/p;/ñðäiþF?Tà—JTÍ?U«þüOµD¥‘"ýŸÐz€ã‰â8¾ÿ¶ófçÍÕ¶ÔfPµÔ6‚2(‚2¨íµmÛ¶m÷÷îvrLþI>ùÎzçnxj²âë$Ÿçe¾ƒ–@ßÀ7ŒÓÈ2ä„¤Áº*Þ™ËdÜ ëD›ÿªò:¼uó E#’×é,ºHº;ºˆÔI÷¾)_¨\ª”Ðt#UM7’:ªt‘qŒvºW<5@ŠŒ£×Íô€ç*hŒq”šáyjH×©%]4…æ¨S4uEÝSïh
í P`©HºÎˆøe‡JQÊ(T£NÔ‚4ª_ô's(zÿ¿NòýHõ(žR nÝ—ÆÌWæuÎÐ!@áž gDÑú»÷6ö}Iu?îZácŽð½„¯ qôºë¶è}ü„ßésüNêèü.ó™L„~¡?YÏæÐl©ãg€b	ë*ùu,žëD~« Ý`º
ë ³¤BÖÁ7º
mƒzË¿xÅõ¸™ÿ‹›¡`Èd2…LSƒ;p7Ó„»¡`ZI…ÌÉü‰ÌM°]vÌÓËt&˜fž™Ò¨-æœ9’à†ía™OvÔ1/’×‰T÷"d8‹çIç“Â4;‡KØ9á–ÌWæc×Ø<Ìî@ãði‚öO²7Ð8<#y]üsž9Äx—<3ò|¸÷;üþVQòþÈ\ÜüÜ½»ëÛöÇ¿6ÌÞ‘e‰Ã_Ïäœ$“EÖÎžÍ[žµmÛ¶m{žm›×¶íû®mÛ¶ºkêô*¿ZÔ×õ¯v'Ýqw°ðÁ ²[­×1ÜO´¦Æ8ößÓ…»ƒòá>>SxžÏþ2HIÉlááKy`Že˜[¥2O‰ªEœÜ;‹A*wªõ*]Ìï€…¹7üuË
Îó-·Kn@KœWÏG%‘¯‹D¹yÀbÇüÒÖqkê1j#wå†ò7Ÿ³Lr&òrá6çÂÔÉÎûºXmQ®šõ
¶¬úõºø¶¾ž•1.âÚŽžV%#“œE®‹ý2ŸÓ&&i!¬ˆN×VÉ}"yûscø™ë½W/õPP^šdûøŠ„!—ÜnŠ¶¶¶¡¼€BRæoZEéi`u²ò–OZJ/öëš­‹¦Åso¯.Ü”[%kÜ¢YÍ%+”zU…°;óöñùÚ{¢¿pìN\{åZ½>vŠîP¯eô7ëä©ÎsžW¯u_«©Œþáne®ŸÑ`CÕ­,õZÔÉyz¬×-x$¬&ùEÓ5¸IÇVÃ2lŠU¼$ª^U÷¹Ô¿ ¹Ï©~”è7K¼k9û°U¸2¨È^è×¸ãÙåü!¢<\™}L½ó³nÇŒ•:ôÍÏ„÷ƒ„n•Êº}ÜÝ³|ßÏìöq;!S	ì¨Úûf’9]wæW™¼õ†øœÝ1Ž!¼ä~_Ûf¿ì=î=·Ogé1Ó2ÛÒy_MãôõÖ›<F!ëê­®½²eRÏÉÀq½Jÿh«ûÏædžpžÏé$9Û€¾‰Fr– ý„t®Ã–™1®L4€C¢ieû÷«Ì"õ~Ù'{â1ÈlñÞ7.Ý“Y Þ¦L‡ä`I­Ü¼g ãq§rgÂ\¨{«6uÓW;T³?Fë’þL½^éÛ­Wa½	é—Ô–¾8YÍ,Ä`¤-9YÁpËHÎHm;Öi@'i¡o±³ž
×—nÎó‘¼®Z^w`wËÐ#Ù)^Õ³j•¿lqÌÇ |Ow¬‹ßÔÝèøz`›Î½m¿ü|çùšë\8åŸ€ÖÉéåœç•Ù£”›€”°WH|ðmáz>þ]©ŸjÉ÷fØúŽ~÷ÔÆ09LX$ Ë`†ËYMß·qãIž¥†1¦Œ:ö}ò-šþf0Ü+…(w+fšÑœ%jC˜‚š¥“­­âj»ø·?p²Ú¹¸ïk–ëH~ôÜ,Ð‘ŒIö…»Ò,ó€‘ÉÉì®îŒñúJ`—ghìö•DòÀwc€ŒÆWCêÒæë;üHæ«åä]ØHÞ…]èC=Ö°¿¶ÖŽßò;*ù¤¶Ö‰påØŸ;xQ¦Üä™bZ™~Ì·cÂV3Ìg›iÆ°ÃŒ7ãÙc&›)ìÅÈ7í~>)e&SÂž`ÅR¦ÙI|NIëfÖ”°aæP	ûEIûGI;»¤Í‘Ú}}NGôð;|lŒåúžÇ	gœ‡õÌO|ä‡±ã§=ÿÈ²ü +>Ù2üXò[{ÕxÉº˜†ªš ª‰¢êâU“Dõ‰çŸH<åù§ÂÕ<ÿÌòñ»i³d7Õ' ­§ïûÖÊäÜ•Ë¹ËÊ¹«!ç®Žœ»ºzâBžqŸÁà14b„Zûw†µüEmßCÍÒéj—ë§U$ýþ…Œ¨¡cóðód^…_ ~y? üJôÿ¾øð¼`ÎÛo-Ãï¤ôW¢úðká¿ÿø½ðŸ…°\NC„‘™ª¡)30aÁž<0Î#ÔÖ¿
¶Ó¹ŸûYo*µ/óÜÌ²!•Ü´tÁQ-ú‹¡Ÿó‹P3ýE¨ºô£¶+¥&p ü ˜Ì–)Ð¿€Zöàdàbÿ[ø€0y‡Xþ{¬Xïl6Y/e½YáÕó€Æ1Ê0N¿G"† F"Í…» Mb|¼ˆ|f²Fõ-C-Ù›mÎýÞÇ2Ð~=¦ú¢ï-¥”ºZ
§¼ª‘¨ºÆ|½hc~  xŒÒl	Äá™ÿ>Õæ©¶mÛmÎ.ÎUz¶mÛ¶mÛ¶m“=ûååûe6Y< Bùš“ëêZ‘³“›Í#- Ò¾zwÖíœX1
{
¶¯ž†‹†ÛûÒðÔðèP12Ô•Æ¼‰Ñá4Ž­Ø¾b·Zqb0'?þˆh „ÁA"¥ãÄ"ñH@"’ìžóÛYž Ïóyž/ÈóÂ‚</4ÈóÂƒ</$ÈóüAžø×óR&'g7ÃQÓÓs‹8aý¥Éiœ6»Ñ“8gvaz—üg¯úCop{ÛÂÒÌ<îÙt£ùõñÈ¦›–•ã)µ¯¨•xO­Âj
¡Ö2T­c¼ZÏå7Ý|jSæmºùâ¦,@J·!ª¹ß@˜[Ç­Ç­W5„"Ì=òÃ§FjÆ¹+J+Þ]ÑZ	îŠÑJtW¬V’»â´’Ý¯•â®­T(:R@
ªœCœ§œ÷<‘ž*ÏÆzmåÙÃ›êòîæ½ pAàºÀc÷B<!%!=¡žÐäÐ²Ð8¿\KÛÓ¸á1<…çð^Ã[xá|ƒhô1”w0’±Ld*—gsXÀV°†
la‡8ÁU¹6×ç,—¸wànÜ‹ûñ ÆcxOá<ñ2^Åx‹îvà#|‚Ïð¾Â7ø?àüÎÌiñ–ji–cEVfUVgMÖf]ÖgC6f+Úª¶¦­k3¶¡ÍÚ¢mf[Ùv¶“íf{q°"‡Êa²¯ì'ûË0ˆÃµ’#äHiÝe9Jö”½doÙG&e9ZŽ‘cå89Ç™Í2sX®æ²BÍc¥šÏ*8,`5Û`,dZÄZµ˜uj	ëÕR6€l—é”.f·VôJO±_«Qš¤ÆL¶hµJ–LÈ ˆAzeP†dXFdTÆà˜ßbø-ô=[¬bqj¨Å«a– †[¢aIj¤%«Q–¢F[*h]Ò-=Ò+}Ò/2(Cò¹|!_ÊWòµ|#ßÊwò½ü :™’%+H…T‚˜†Áx,‡å‘ä!(D%ªPôa#X«au¬u°>f±%¶Ç®8'àDœ„“q
NÅi8gàLœ…‹p5®Áî?ü§¶ÊÆ¶;ã¿ùÎ}¶mÛ¶ÍÚFXÛ¶mÛ6blïÖîÚuœº“É?÷ík&7ß¸ƒ=3ó_PA%UTSC#-üÈ_V°ŽÖÇÙˆ˜V…UZ•U[ÕZÕ[ƒ5j¶æjžækj‘k‰ªU£ZÕ©^
jT“šÕ’õÈzfC³1ÙXÚÒ=¶ÃPH_šwŠ‰Ð7IzbôOsú!Ñ²~ÙÚ„.¾QÚg|P’‰®8ŒcøÇ\G!ºáµä,º»×%\j£l´wÙh¬¦1ZÚÖ¶mì©ÁÃ˜‘ü¡_’”ç%¥Œ*™˜ã>b6…w.mèÎj¶{F'ú»3½Ìh&Û_dZéÝý;°ZÖHµÊ0
öaƒhKWY²,ì²P›Ü»méÝ&Í¯ÖêÝ“¨n4Æäè:Dçåt/YšÅà’F˜UXcðb-¹Úz',è2Z4sZ“³Yk™¶8
FÚ‚aÚ²ËR_Ñ•‘,g#Gs&·ó4¿ò»oÔímÝ©ò¸“Ýé¯±dší4.°Lã‘Ê"‡	ñ
;új²ëËœ&"-Ò¤ÐEšêšENSpM)î4—®pšá¸];5i{ò˜•bÍŒ(íÜ~ #™ÈLæ³TC)D]E
#áXtåXî497ù{4Ò§‘ï¤v‹vªk^p*êäí42çËtz`Q§ í¥3ËÎÄ#GŒþg<Ó#Æøü]{vÊûœÀ¢ÎKyŸò:+bœ1¼Nú2”±Le¶.Jû’äyixnÑeeº9wqô£¯{,duì¢C9–ã9ó¹œë¹ûcë¼Îû±u>á+]C-Ð– «)¤÷õDÕN7Sˆœ‹º'ª(êŠôseÊéªÀr]G7¤¾Ü”ª½%å|k`¹nj·èŽÀ2Ýåø©ëïÆÑéò¨åZäQnŒŽÜóº3&}a0#ÏT=”|ï
ŸûÕýáó@ø<XšîÃH•]c_.Ð"­ÐJ÷Ù3fYôL>
ý®oé²V;Î3q¼—Ç¡•üàWPóù´ïË9¹èéš«¸šk¸–ë¸>,ó·$¡ÂT­–Vt«<››¸™[¸•Û¸;¸“»¸›{l¹­°•¶ÊVÛ[kël½m°¶É6ÛÛjÛl»VkÖjÖkƒ6j“6g£²ÑÙÌ¸p“J÷mb\µ­¹öÐÿ\«ó·i÷;7Ç/N«ª†b˜U`tÇè!5'yä/J¶rXÈW¡YÓÄu±¶Óü‡Qˆ=x/-ÿ&áôxMŠµA Dÿìân9^”@Žf¸“¡\DDŽ³dô#Dˆ5Ìq¾Ø	Xî†eJxÔiÐbÀ†>˜À7[®.å0Ÿvq_X7—£¦çrüIÚ’Ëiër ú“          	À À ÕUÕUê«ê«    ÍÍšš&f&f3333@ @   
```

## FILE: src/app/fonts/GeistVF.woff

`$lang
wOFF    Ü    æ€                        GDEF  à  ·  èk@ˆðGPOS  ãÈ  Ð  >˜À¥GSUB  û˜     
Ç$2|OS/2  Y   R   `=æ_¾STAT 8   q   ¸øäÔëavar ¬   .   .@
@cmap  Yl  Ç  T.¢ºfvar  lD   \   ~‘w¡glyf  €  L¿  ’hN™¤Ygvar  l   sp  ÄÒ=Žâhead  T0   5   6,c²hhea  Xø       $ý	¶hmtx  Th    :íÃ¡Dloca  N`  Í   Qcu&maxp  N@        1 ãname  _4    ˆÄ†ý3post  a@    ZvQ8x”š\[GðgWXÂS-pì€,LGÑ«D<‹6¦Ûø\cÇŽKï¸]¿K÷÷ÅiWIqª/N ×œ«)ÎÕ4Œˆá\“ÓãÛÝ÷´¿‡óR¾DòŸÙ™ÙÙÙÝÙ}@ ´Ì£[5«@:X‘fH‚(„* ‡1Ô¨Ñ[¬:“Õb&?-z“ÕD~šõÒ§…ý$ßäß›83JZêèW›ÅŠnÿŒR'ï5tw—
Ý†{
ûî½·¨¨»¨Û`(º·¨«|Ý[VvïºòèïižöîÚ°Á•rÂ‘âÚ°a{‘±;×`2”òL«Ö¯*ßM¾“—×fH1`Ðà;ð8èH Ô‚Lf£Î„4¤ßŽ «R|³²ýr×.<îÍûíoQ4ê˜Ÿ—ÚiöûÅ  >ŸÃ˜
ÿ¾£Êgà°*Ÿ†ï+øÎ'á^Uù)xDÁG8ŸƒI|>?Çe®ÁÑïþ?ÁåÏÂ	…žQÎgaŒIqÒ|—Ä)ÂIœŒzþ¿•Æ+Ô¤AÑÿÄgP¡x5ˆ­âÙÁuèË/ñ¸ðaã¤ÀB×,>
Ôè ÀÃDW\1 M–Ìý2­Ödf?MÆØlkV¼‰¤B˜ïKÇ¹ë÷&Ôd¢¶á½;ÄP_}}õøx¼ÐÐpß}x¼³'µÂ¬][¿v½P“Sü1*Î·æØþEm!È˜?‹Œß„( {|¼5+;›X‹ÔÅÇ›b´Zý²ˆKf¶-’G¡ÜîÝ{F¶÷yìƒ¹¹ƒöö öe?¾.¤õè–-¶íÛ®­ó8nlm½ÁÞåÑî¼‹Å‘égã,åZc*|~)óXêÌ5øüZUÏ4<­Ð³‡óÓ(œŽ‹á=$†þÊ#h2É‘µtüýÈ/~úà{¨uß¾½·ÞŠÇ=þØ³Âm·Ý~»÷=`öX{fO/ûw›dðI¾`XNýóý›|¤’MdÄÃ¿`-mGoZ`ÝîD·/°Š˜Í¢k	ÓÃÿï@/‰?@â´YÌ“†û£9@|¼JžcSð”
ŸTù4Ü¢à×q>	w©òÓðžªž)ø®‚oâ|n—8™c<N¹<Çúþïçò³°žÌÆôü&Ë~š•f³1“|Ô™‹0‰­4Š°Í-(äfA‹ð2¿’¾ü’õ+»—	ÛÊÖ¨o8ØYØ]°Dt.ÎiÉ©¹wfå¶²*‡Yµýèæv	9Ã.×pøâ¾‚Ä=PŠ»-ÔÌ>M4ð#IIèñú$	|²ø\rc²øoÞŒcUæ<m²m&«1ÔdŽÂ&¸ßU{ çÚQ}[P—gÛÖŒÚÂNú=ººDX¾.;¤ûè†
®ýö°ÖÙøð^áÛÎœµ¹â¥×$ùò”Å*N^7Ÿ1>O«òixNæ)Ôo™kð9¤àò{¸üi©Ð3Âù¼Hçãã¤ÿ1¯! ÃEQð!—ë`ï¦ÃËÛÂ×ÕÔ
dfÖµ¦ãß ƒý†6$ˆO„ôz´gOŸ¶¼¾ö&·û†Úì®|!yð;õÓNàc5B×Y:«É@éB-¡¦ÐH6\ždôb²Ç“,–'“á‰‰A­Þ<ÔC7%?X
€ßÄãò~L4”’¶ˆ¼Ã‰sòÆ%¸ÚãÑcì×à'¼Ý×è}G@q‚œ³#,®)r\Ÿ€1É/ø%ÕMý¢¾xh3y-™?«‰`ùŸÎÖŒ<äË„™®tyþZhÌçEÂC|zþ
ÊÁð ÍÎ'çÿÆx; üJÁOC2ãAÔ'…ž©ù1Ž ÐRÍçsóf<v>þÆýÄøâyæÿü‘ÕŒrùÙùçXŸËIøãqºÂzHØØ[É€Ðÿ` ¯U•Ú«=¶GHñ–*mcK—3Ý»J˜^Ö¾•ù—'ï
wÂ˜Ì|ÅûbŒ·Èë£%Y2itzkT<"žA‰CŸuÐq¿­/nB}ÓÌŽÔŽé+”çÈÝ0ÆÆ%…ê“9™p–ç˜žØÑÊ9F–`O+Éö$\§žé,QŽ¯­Ì5š x@¶Å9³u’Æ˜Æ[XÞkq‘‹Â%‹¡(+NüC²‹¶p@÷Sã²šPy½²„‡Ó	 1iHÒízÿ½]žßmûÍ½àA’ºñÞSô
¼_w‘v‹i;D'"v£nÏ·ÅGh›x3iÓëý‰7*ÏúX!O*Œ©ðçñ$ú)—×– …žQ.?OI{ôü0¾•ù£Wz´ˆf‘ÕÂ¶ÐŽÄ;x£¥ŒžÇ qól&nz¼•EE­ï)­y=zŽ¬GÁ`àë‘b¯°f)Ö%z¨®îPoýì«ÎÉ®®ÊÉªi}dëÖ£mmG·n}¤U°ßÐÚz£C*høùë·KŽ‡ÆTø4¼¨à{8Ÿ„ªòSðUþ1üGÁG8Ÿƒã$~Æ_"}Ö@8˜¤ê<ó«{Ž›½ï6}ð%ÝÇozW|i¸£ÜY8êÛü?VÀê{UY«ƒ´¸v& Ä§Q‘ø
j[vºj­YC55ƒYYCNyGÈ³v³º§Ûš'¸nt7ÜX[{cƒûFâ‡\ë‘ôõU`¾¾›BMÀë=˜¯ÛRP°¥îQªohp?ú(·¬+·¯Ï?AƒöòÒ2ñ×•C×4ªk§%SR`õ•t’¢;&È;o¹eçÄUÏi^*léØŽ3¼y,Ïã1p0“x˜bŒ‰.ÒdŽ·™-‘ÙÙ£ñlÅz2.5•¥-ùµ‘®ŒŒ+#ÑóèÐú#ßr.¹¡×|]„ì{ñ=Š8èÌd(¨Ñø…AK#ùÉ•ñÚ2§vYs˜_NáIjuÕW?ó
Ïê)Mu¥àÅ…¥z=%Q|m-+,*Ÿ>Ÿ{Xž¶ÊkŸÆTø|—¯Ä/™Óµï¿l=Ê'ùTKâ”&Uy¶hÌâM¾¦b_Ä"u©X.©"£1W¤Ù]¥mÓ¥7äÖ4®jiº“r7T¹¶”û·i“Yeu†Úº–¡Ô’-U!…›ª´Vg|^¶)sµ^ŸY™ßaÉë/Ó&—Ç[bVÃ#
ê­…í™ÄGæó½SîÓSá30*óXê»Ìé9åG *òÓpH–OáòRþÍ×äxœÎßÆl‹Q¿È–-§/M:–#:5.’Æ€¬ó;Iü4jÍ-Î¢­®[oÍt&ôzú‘.pÆ–ïÁžÍgS´ikKK{scABI5Bk&W—ŠKÝËÑJ'²ó<4Ñ¢Œ¤Ä…àxðVAðŽ²>È2Ä×^V\:À9ë[¯‹>£œÄB)a³,OúÌ9ëóÓÌ‡Z£^<álÜYÁ ¬îÚROw³§ÛSzmCHÉ.7zCÌðtuyèOZ<PÝLóeH^‹Á˜
ÿîSåÓð ‚ïá|Q•Ÿ‚_¨òá5á|ŽÐµ‘ðÕr_W«÷6B«§ÿ¶éÉ÷¶PØÈ+rArK—…¯0%DÄYM–Äã’å*a	ÈŽ
	×—,
Jµš"‡û'p¿žà~…“
G9Ÿ¥5 v¿q;­}äÚ™ô]·Kœßâ«) @’ÓìVÔ äEj
‘>t°çÐÁîç7Þ}÷ÒäçØÍÞ¬!vY;¿ò¸mƒ1>‚|ç“H¯*?…Ìÿ• ¸]ªK5Ì«pêò›ì?öLïäÇýÏ?ß‹zQYÒ¢ÅÄ¡ñŸ ÷{½/àíH-òyÿñãýŸ{P:"Ž!—Ø!þ“Ú¦²Ìöy­˜„1>
7)øÎ'áUù)8¬à£œÏÂ&Þ7T¿íDF2yÙXW¢ëÄƒèOâÍèVqy^!´x?¤ùÇä™þd?_…1>í
¾‡óÓð³›v½\ÐDê2)£ei!.ºýöWáËk[õzï±ƒì·œíSl[$Ãså–}Í-õÕu?¼HKvíÚ¦¦:ºkoí«éÿ†¢é¦TZD6%¾'
²>Ý.÷õŒ©ð8À÷$âƒÌ©Ïÿ‘îÃÈÇ
Rþì´„J+¤EoÌØ»Ùwî.àh²N¾'P›L–é¾[¶yŒ©ði0*øÎ'Á¬ÊOÃ>U=S¡à#œÏA¬ÄçSÑ<.srÏBÆ¸ü(—Ÿ…@“ï0Ò3ü7:ÁËåÚ·-o[çºòô.W'û6’û‹…'wàµóAÖ—ï^y¡äÊ{
êãüž‚ËïaœßSp>Â9¹§P½'¾?RÜ^Ëï
?CK`LåÎë2½Ãâ|7çŸÁ)Êåûª'NÖÌÏØþŠ3ùeùŒÝ /0ùtYO¬êYá2WÛŸ?¢º.^FaªkÍe¸U1·©Ýd»cª¹wbüZ™Sùkq¦ü»¼¿²]?æ÷èp7¾Ï·Oûeâ	ê¿ÌÁÖ€´ùs8Gƒ‰Vš|6[V<»äci¨§»¢EÞ#¥ÃƒUÇÒÒ²­»ù…ââìÒÀÖà-}#KƒõÚ [j@ÀF{+á‰¬¤¬´@—Ý^b*/KOÓÕ¶oí7,Ø‰PV¶8œ‰•Éñ«'ÆÄ%²Ü”}y—øøËµ3ðš
ÇøÓ.På3ê|z’Op>9 .?µEÉq>×ëã©8Gs?/¢6…ü%ÎÏÂ¨‚Ÿâzfijåš$ö+ J ’Æ_*<lñÊÐa‹:ùBÂnóSœcôFþdÀÆŸmÎÌh²ÿ9òÓíí!;×oñÏkÏµU$îJL‰Ê·!×¦üüUŽá|ñz¿†
KyP›~gãÍ5…Eõ(nIœ#ÕZdXUj·®Ö¹:¶n|:¥<U›+Óc#é‚b¦LM¥}¯Ð´Ï^º¯ù*¡9mµ®ºí¯qUË)7é¯C¬¢+šYG—nÅa˜VÓŠW 'Rãôž,Ç@NÎ€£¨®¶,£".Î‘˜žìÆãbl&1&ìµ»‡Û;†ÒZZé”Äâª!ñ‹â‘£&øå/½ô}gSAÁ¦jr½¸eqµ­º±‘|¯kíûšH7’šò´Yyƒƒ…ùÚüætyÌ4,'ŽÉ¹(í¥JÎr®dK}áüÂP•ŸVò	®ÿ4Lðù¨õÅÎ£8Ã“MÐ,ŸÝyÿ~×ŸÝoÏnŽ\šˆ¶œâ²˜˜Ò´Š¦¦Š@)b©	¢7Ï”áNo),lMêhöÙ~”­/3ÛŸàEô'ãv±ôCoÂ_ãªòz÷~™øÓûÄ—zÂç ŽÅ&6—B$JwoÒ)Toææ•™#›>…2—‹'ÿT¸wÝ²=?´7œaƒìøVQÁHµÓÝXålhpâº%o;²Æß¹tÏÄÍþâtÑöúúíEµÛ³›®-vwuÖµv¬YÓÁãîOr)¢qWŸaoÕô	TŸrÜ‰wHÜOÈuÊÉyñ\KrJPáÓÃJþç“›Õ¸Žæ”ªþ©ÝJùg8Ÿå<Hå±ÈúÚh`iÓˆd›ÿåWÆhCúòÈÆÒ¦ð¥AË–/ÉXñ%QóžO1¬+:ú"cCBBtºœ%Á ðýmîûìeŸ¢ý‚á¶á°ãtl P/«%ƒÙéÞ¢—Oñ:R·ß\Q!ÔB2ŠÿÂ×W:ï«¸,Ý	r^táE$Ha‘0Ë·ëV¶#*'Ç2’ŸÙ|n|ÐY´¤eiQ~µkYSVùP~Þ@YNk˜ûº‘${<"‹¬£®ÞþP|Eª6!!/Ï³:³tGMÍŽÒ¬dAëBAIîìlwRwcc7é—ì]GÞöÀõ j|¦GO÷+¸&Bæü_x^!?Áùi8¡àÇ¸ž¹! ¿g¼ÄE&Èž×áÿ¯èœAMâ“Úo"”é¯ùFa@à&çÉX/“ž0ût¨Ù²A¾¸…€ ¶2¡S°å”¹²»¼…KŠ7µ‹£BW»J|UÊ¼œ®ƒì\D²Å¦¦©@m•rîû¢:òÜf–úÄjë·äçH¯°Z­ þ/‹ù»,¶§
àëÁaò3,â²€Ã¼3lüØïÎãwy›3ñ >Ÿ~EâÀ«°1ù:åê¶)GÔ¶BÏÔŸ%=ç¨cøçs¯Iòó©0ÁõÄ0=_œ¤mþ€HÝÃÛÌ>)ÛžF°6§X.}g˜Ïç‡áiÆ?’|Jcñ`|ŒÄ# ’d—|ec2-J
[$UY\KVèq¬÷íŠ<ŸDrŸë9“
œ‡+øôŸy¼±Añ<‹œÍ:=‰;Â›ÿtªÿÉAš'i(ê?â—6Ý)éš¦mØ˜NIçÙù—Ø˜ºçS¨.ÊåóìË|LÏI6¶Æ[ÃÙåÉ¬Ûs’šŸaÁ=ÞÿêäcÌt"ïñ0&qT…ÇeNöm8 Ù„sœc|._Z»ˆüšÇì)-Y¡Ã–Þ3üg@¶Ž¶”ŠäNHþj¢p4$Ð˜DJü#¥IÀgV»à›»V¸8¥,ÁÑ¼$$P(Ï©Orlq¶h!+7.'šäð­~I%¦²×¤µ•)R^UkOO ÂêºXGªx‚ÏßhiþFªÌßZM@Pgis‡_\K”Þ¶Ø^±¹•N¸W}•xBŽ“4GæäÚ¬]WrºV€/~Ô&—?Ï*äOqùY¯¾f>.¡5šCñ”L£æ1
jŠ2	
Ž†—ºîŠ3Ð‡føè•=àõÈ2b#˜ž=_QIÅmý¬ªnh¨¦å­\þÉeóPGÇ­mùþ¸ŒÅàÒ•u-ç¼Nå|‚óÉÍ *?µTõ£
~ŒËÏHûH áYl	ƒòÙ™zoÑ?šÅ´æ?¨ôG{ßTï¶Âþ)nv
çšïâhŸ¿pÝãcl&~éÁäËDîPÝèBM±Ž1î:ÞYä"÷1®ÄÊŒÅJs»©öØØò4¶U›WT³ÏåÚWsµÅ$^:E}Ki))iIáöäºŸî9Ì™õWóD6äV÷eföUç¸¯ò ‹ËU›åXµÊ‘…Ç/š$;æ¸7Om<ÛrÚ³³Úl,§†±Ö×'G(9)7iÙåâY¬y°¸8£2QêRQgx ®{¾<6Öžê ýúò2Z®–Låi·z[NIÝ¡ã{q=ƒ`A‹Þ·V8ýüÊr³,	Ö•teÐ”—¸£ò’Äã¾yWOs-’Öo9çlWð‰Í§P;œŸæçCô>éïj^¹)ŸkñK6åS-Ó}6¿{iN±>7·¦%n¸«cãÒ–Å¥Y¶œ«²3Zãv´¦4Xµ™¶Øøˆ•ú€¥«’ªÚÖ:µÉYI¦F½97¹ª‘ú%Û§þ.–çÚS*œô£–Ÿ!©¿œ_hUùéOáòÒºõ /îìL•F«]þ¼ÓL;¨|žEhEFÐ¯|-wÛz
×Z…j”Ûaul³—”$×¤¤Õ§'''ª-æ<£€óz³R³Ë»üBý2<¶â¶T÷Õ¹‰ÉQ5 dÌ5%¬*N{ŽËÆ¬²Ú›î|¡¾ý‡þÏo‚!Æ%¼‹ÒÄ?•U`­÷¦('s‚†·£{W¸T_F\ÑÚF›V¨@ÅÎóJ5¾œÐ\MbÂöÒOàx(Ÿ¥úeNb+ç‰©’Ÿ»^®È|ŠÃè¾äYøðÈÄ®Å~Ú%Ør‹«÷Ò6{à†.´F|¥¶º¡xgnÒ•VÝ²:Žz9^‡+9«í×*ŸîUò	Î'‡Õå§¶«qº&ß®àÇ¸üßSqãòQ¦Bþçgá ‚ŸâzfRÌ"è?p†¥1EtüèG¿Æa¢½à¡2¬Î»òù‘¼n_Û¾½G†¯¹fˆÈW çèÛ;ƒ‹#Ä&kÇúd”b‰* Tø4¼§àœOÂiUù)˜“Öö·ˆa¬&$ÛºÍ¢¡E¡iîXÏ]·õ>s¼çÐá^‚ðë¯‹ÿçÞ|Sê/Y_5¤M@3=ÛLÒ,:é
W®ôz¥ã¾ïw¼\`u¸BÃ3±?ëÓãI	Ô¹=õÅ,çÇ1Nò`
(øç“í *?Õ§ä§8Ÿ-‘Æ)—||‚Ã>ÏÊEõâóèAñ¨Y¬Ðv§ Þídzdyª?Eöó¸
'ëZ‹R~‚ËŸ–û%?ÏòÃpË—Õ±_^Ÿ†Õ$ïþƒ£a%˜Õï®å?úT\YßyÅ•µK³X—Ó˜òe·Õâs›qLÎ*ÅM5ñG¶Kû™%÷Ÿøs%§ó¸TùŒ[OJ>Áùd›ºüT¯’ã|®ÙÇS±Ž–9Ç±
ùKœŸ…ü×3[Š;Éhãï$#¯¼ïËÌèuæ
‘‚Ë/0¬Ãá(Š*Íª©«u:÷ÕÖî­IItzgvä–ºm­VòÚ¼¦i+¯Ñ´¬År\¯ÂI\û@•ÏôªóéA%Ÿà|r“ºüÔ.%?ÆùÜà÷ÿ‰8Zæ4®Õ
ùKœŸ…ï*ø)®g¶‰ÿ ü\ñ·ª‚ ø[U"€è9å3`&ŒÉ¼	S.ŸÆädîüšs2wVÊg"ßÈlè¤3`8½QxoÕ{6A@ÛËÑ÷¼y*ÏF.+b©Á¯ñ{êÏàeÕ;ÈË#¢‚Ÿ¹ŽÊÏ‹ü‰Ê¿!é‘ï* àg”ËwŸEòûø\q?qù5øRy~Áyáü*ÈyíGôwH ¶Q+•‘ï^¦>’t™UÏ<¤oêûîåPÝ[.Ã‡ªëóeåzÈüI‘cñÕy¹Y=o/ËyHï©naëåIªN"#çYÌÿÿGÈUÀÅ‘,ýé™
D°Ý%H”eY\VXÁeY`Í ‹Çõr„³èÉÓÈs÷—‹»û“Óçï$ßù=Í¹+ÃW]#ì†—_€žîê®îªêªî­\~–ÕÊ/ˆ¨ÿ¹Tõ«ùïh>@’H1ÊN'»ùGAëÁ“œ±¯ÑWƒÚÍ Ç£™ÙÍ5ÏŽÕ+=KÄE5M-‹-Ž3eæÄ.¬±ûŠºÒSÓSÈ¸=¿À¾$%Ãâ4¸ËëöÄ/©2óXò*
l&ã‚¥FS2Ž!Æ0Á?Šy[ò^>0ÐeåæfÙòòld|¸½mx¸­}Øïu:¼>»Ã§åá~Ãkù="žÉ$Ë'}F5ÃÇ¢¥ŒDŸž¼
0‹ÓDÁ,Â‡ç$ˆÖ¤7ààdÌEëëü
ÒGüÁåmÅ~4lY©‚Û r,¡áYi?ô@/µ~)êúVE×?PsgÈ›Â´[¤¶$®¥Ðú›ÒoER!Ê„±·¡n3ÐØ‚z®Ô5cýfò=ik»#”œb=â¼:A6ßƒú	*¾Òk¶À--lxEgž-wa)¹½OœzCäMÒÛEÌI´&@Þš:zî{ß;Ç¯’s+SfxÎDžÓ£sbÈNÜ”½Z9æ¸ ‡`®„ŸDä˜å³ Ì
€¿~†ÿéÙ=ä{¢Ø±›äî^¼[zu·dÛCVí!ë¤Ÿb† þ•~Êþrø|‡¶Â¡Å€:ÑOTJK¬W	”>ÝÛ,ô/ØØUF‹…¡Í_ÐjcÃ1þàD-í&•baã¾Î$W¸<ÆWg©Ì+ªZIH!éÞ‚³ ÆÑ^XB=~šh\âérUzP@­¼57f$ dF`“·K'ŠdäR†ûV1à¸Vr}áÔOlÁeç¸äÛŒVk/]Û*”
¬Ö|C¹ÐRINHTdfddV4ùß©Í9×-Ï7Îó5{HÇi­(’ïì‘îÑ&—MìÌzïD™Tdö9Ê‰˜"Mª¬(NV«¿|Ù*¡˜Ü#JoäÆÔÖ4ÑœL>hNH–Æ6…¦`D
h}ìÀç"|V°åðÜªéÕ:C‰Ý€fñ±¢tµˆc Y×èˆHGœÉaC:‰Q8Kñ‘2mæý!Q~|O—9=vùÊ‡‡~þã¡WË‹©É ?¾™Ü9uDñã±=ÎÍAœ›qkdœ8ð—‚s³šÀ¬Ÿ#.°¥ðž>µmûé‘‘ÓÛÅÀ±gCÃþž<JƒÍ×¬9Ø,ÿ¦öpeeØ.ÿf³ªâÎ¯K‘¯\x¶#.™«óÊ'Kxr)«„›õw6Á7V1~™Ø,;aõw®,æ_¶í½÷mÙõï2‰0_ànœwŒê»aâ]ðÃlSüÜLÄ©Où…¢ø³3g`%ŽÂJ”³¿çÎ1iÀu.ŸÑu´¼˜˜„Ò§dí¼8•Iz{IƒœÁCÕ Ô‰6á›QötcôNÎ£å…2lå”%š¨áôizNŒ¤L)êò·i/‘i
*‡nQ¼¹Ë¸š*Œé`ßÚ¢ZŒf£‚^¿ù´}Ÿ&âéNØGØþQº®6øôé#¶‹hzù9ö™§Jv”.EþjQ”âg‘…Aé“æÜ'nÐhË·[º´›yä‘Y”)Õ£‹9D°°˜[H.Fâ«ämu­
±Ê:%3¤F·’ç¥Ï¬|;ù¹4FîÒáŠÜLÉfhxoÔé!NÍC¹ói-Q¨:«¦ašåXÄkÄ,ŒýÇÓSvõÈÉ=»RÓŽïÿŒ¸Y>Ê®“á¯ïG 	£ïP`¤gß×I3ÈËì¾DÅ*k'©±ÖÇs«7u:‘“@*ˆ[z"éëûzF‡ú ãcDÜÿõðÉ]B~2ã[p7£NÛñlI‰ÊE{EËÝZˆõ˜Âðhã^ÃuX&û$¶Tñâ¬ê ƒX¦“·$I‹6°ðÒ?£-Š=gÀœº›0÷%40GY_*n~ëÆú¾ûÈð)0¸ÜG¨tÇÜ™@<Ëãƒ*~uÌhÍ´
V3vë²£zŠýþé1¿9ì¸j’›O·€Q«æ-@ƒÉáüÕÕuQó´B>‡7ÆFòàvz´¹Â¥ü?‘MT`[eã¡ÞÁÍí
l¶f3ÒùM6a[‚ÛËiws Sž5
3U
}\¡ƒ@H_«IôÐãçkÂFz«ž ÅŸº`áój%—I½ÓN˜0ÆZÍpÎÏ64X%™øEµížìjóÄèhÜò¥ßYº"ndtüLoïÓŸÞø{öÃSS¤ÛétJ/}’‘žžñ	±¬—.ƒmû!6<òm
ú•÷åûŸ™_¼×ÃÜa“
£‹e2sf„½T¶ºÓRW–•¶Òžj(vXj{­m+3ÜiæN#›†¸øt³AÌ¦‘ô!1#!N0¤$©{üèÿâ¹£z7+0œýµK»ùF[aòÃmÿ#òÏŠFš[:uöå°ïÜª»ïèx«Â0ì;ÿœËcm|ž|ªã³pÿÙ?ÓG}üËç‚Ý¿"ÚE›¡Æ(iûØ	¤cViDgêò@'.2]·ñya0:aWÅ²¢-¹éâ3ÒU3µU¤þ&rJê;­¢õËhÕ^Ú-WùÒxŠÈ@žžÈ †>;??€çrÆ%ªÃ½Yß“á­¢Œ²bÀ¿`–;£ú‡ë¿Dr%˜ÿÝƒ:vVÍ…‡g+>£OÎpÎd·‚s¾FË¼[ËÄÙ1Í¯¼gêñÛçûùm êkâ8*ã£ýWp½0Þkµ=*N&,	Â©).n˜? –â¿Îc`„_„mÙÙY~—MtVÖ—åðÆ¤òö¢ÆmµA{(/§©ÐÞVHòBö$[nöåtì@÷ÊÔâ|REW¬Î |aÒŽ['ª;Ûö¶‚‚6»³½ðžj1oBûm™ùvwô×6,uyÔÏnïð·
lîÿ”äú|%W_½´²Òù•¯ð&\¥¡¡<ÐÊ³fþì?ùÖÌœï©w(whg­d—tgåM¡L)×ëàùßµê=vvöCþ:-þ¶âÎ‚Ò÷E(H>þºr*Æìbv«ñ7öVIœÒ*ä.‰3Dò±WÊñW‘w´Ö‘Ñ’
·Œ[lð7·duV¬¬¥ç/ii,¡”¯z§4Tì$›áNäQél³¿ð¹—C¡—#0p<÷H4ŽÜ$ãÿ.‰ÂjåÿÞåÀm	LBoŠŽÅÅº²²Ïð—,}œˆ”¶ï|}çâ¯ì”6Ž¿2NI3¸’üWú˜ýÅ8üòO~CxŠW±rîŽ<µÇ¢PCŸÐXVÑXAX±·ÒU\nˆÝN·kHc÷žõqbÈ]\h+pÒIH^f†-så‚ÚPg  zq|\‡¯™*2ð&»ßÀ]ÉÓî¤ÿZG_ÙC¼€|†û5iR•…7Qn—ÏšO§Wþ_ö*2láMz1ôÏÇ‰ñbHèIÇ¤ô¹61lR4š¼iF`Œ9‚çtÝ(³¤¢Ò‘¾ÒK®¤¯YÖ–WQ›•Lâú?
jw¿ûyÓ¬œôÎÝÇ½‹Ýr_¹H›”¾Æ~4>È{‘|e>@;)%í”JgÉéz™h]š9+EYûDíŸ¼Ï›´˜ÜÊî×ôsèÇéƒ6ˆu`m¯ÑÆ]ÚÝ4´ÜÈ· } ‡<•‹8[5œóî¼?Ãÿ«SÁ)ByúˆÌ#â&çÆ–`ÀýþþÆÆý]ìw—¸aƒØ³aCO^OOzõMMTË¿©Šì‡ïÿâ8ëï
q,ÙÚ,âMóÅÙ·Åµî µn{c6¥d5Û˜ön=z4Ðek(>ÂÐ~ÎS3ÐÑâlWTœ}üs*
‘ã”ŽLNÂ¢úÈ£(\¾—_¡oŽãxœ7Íg#²ðÒ©/sO1Ë(ÃPH]aŒ³Ù„,¤1œ#âÿDéÔÁh¢&'C/ó§4ÊØ‡†£BY0Ëãl™Ã)ífÌ­¼…?¥òÅê#.ÓÖŒ‘«ëü¢“¾ðâ‹/|™ä677>Ì›éíêìm)..)¹›"æ#qqµ~¸8M
‡EŽPOû5zr,­C¯òäÉžó©…B‘´ä³yá÷ CVò$¹Í¹G]Ca£2ÿ&nyDü¬Ë?å1zn=zÒ"ñª¸ÔÃEÚ=_¿JÖ1*fFÑ"æfwÞ›Nlñ0 –'”N¾,ü·7ôÙ–A_ƒUz6½
Í¦/ÇÉ0öÙQ2Ìä—åL¹(ï
±Ç´7ÞˆÛ4à©Äl
ßà¹3RŠÆµòÜY|@!Eâ_ÿÆEaMyù®FÅüÂó³ò¼ÃXa¿RâZëL\k˜Ç‚ÀügýîwÄ£OÃ%(½£Q“})Xçxf5&1†e
fµz½n…ü÷k.Øøgºÿ’µ‡žÝWQSSñn»«­{ê­§žz¾âæâ‚‚b”I°iˆ¶p¶90Ð©ŠBáaÖdKªZ3F}eµ­ô<ÓòD¨sI/HCH'–•í|¢·µð‰µš,)hraÎU=€dÔËTìs–d²}äfU(m--Ã‡¥3,|dÁÊ Ø3Øâv8=à—SÙÿà¿Í›"ãØI9ŽMˆc½r›
:‹qìÉ:Û)[qÓh×’Ui‡ÒV.éÝôQ|zãSÿÄ~XûyNNÖ37¥šL©7=Ó"½H={ö,É’ùÐ0—i\.Ë{X¤Z3µ Õ4ì,ZQ·Ìé\‘’š›,g¬öø—×,O+L1|[G&H£À/‰K5I6w¯NX¿„Ô”é)])Ñ05nÞ¤·¦„2žLËRg–$|}+îòõåÕ!›Mºœ‹aû àÒµã:žÿ¥R…žwz™ü\Ç¿3à^•Ç›æŽYÉßæãQ.‘FMsŠd:õ³éÌx#ä- ³6Ò%‘·Í)áÑqG‹5äH;›¡Ÿ„Ÿ¤”BoÝäº©·JØ¥² ÖGßæõ"èE˜iµƒ‰i¯ÚÔâ½ZcSY†m•±
h!òOJß@¿'¢0C<òÛË›þw<+ÀJD;
@í¶Ynƒ†[F[öŒvfx#{&!ýÍ¿½KóoßÛ©>qxóÈÿ(¹BÚw‰Ž¬Ïiû4ßí.Íw{¯ñÚw^ÆÈw‚`•¿íòùç‡ñœã²©«Ô\qþfˆ¹s˜QÌG.rÆÝÎè¯x"×•ù•íßûV{Feþ•ÒûÎn»gs0¸ÉcïvHÐt[ÕŽãýýÇwTmƒÚr°­w_}ý¾Þ¶ƒ-T=A¼nœr£Ù`rfšÜ˜‚hN…n˜à¦Â˜ÿQ’™¸dÑñiËÜ%y¾\ó‹¥&[3¥—*oé3Ù2ÒRÉý«ÓCËËRýR“¼¤©çÞ‹÷_&5Õð¨hóˆÔB³,«WK ¨ÛØAB[€"ef‡È{Røxïƒ±ÿÓœ}&Ã4U7ÏÜë]š“ýu“/ì©Í§•¤k
œdÖ]nóe¬+*¬·ÔgAãÖüüVWé„Õ“s,˜ä­ruy–»<´Ä“°Ù—•d”-#¤ƒÌêü¼j«;¿©X¹ÓôÀ˜¶¨ß%ÎBò»øê‘¯¿ªÄ¢"±ªª§¨¨§*)|r|üÔ ŒŒŸSÿÁÁC~ÿ¡Áƒ~N½ï"p‹V@A½Â´ÝûÊÜâä‘O%ÛóáH‹¹Jø§1F€ùh1©&Kð¦¼Ò~ÑwÙò` Ô·$÷Õ‰æ-Þ¬îÖ¡pç!Å·_¼Ý·¢À‘åkhÆl½´t¨ÊÛÖëØ’O•»hôQËR3;v+³q×åúczšZGóÛJ}>Gsc 96¼xïæíðµC½ë/jKÚŽ©®¨ñW­¢îroY©#fÍØ¦þú®DÓ’MíþQ—rç¿‚8ñ`k,n"%8f0òcéûdÝ`_Ÿ(Mÿ¨¼(åÒ½Å¾	çÆí†vmÜÚhÑ"Áñ]µ0+ZúzÛÆÁrTz(#)u¸¢qGeí®jEuOKko£ÒgIEöš›vVËc¬Tæh¢¶£„T›½,â¯ôîÝÞžŽ¯ò…×	&ãö` ¨‚}Ôoo-Ì	Ú“Žÿ`ïýöw,,*ùÁ÷em`Ú&ªh¸=Øo­êi†,3“&/CÆðK­¿»òbi#ùäË—õýš¾FÛ$ýý´¨[¥x÷“Ç¹IÖÔKCèXJSÄçW.ª·óµÍe›6•5×òíaXÕ®þ
tù›šüì'É1âoÝhJ6vÔúúÎ~_m‡1Ù´±Õ?â õõµÁ`m}=*÷•VT”úÊ#ær¹&qšZk¸ôÓLçÈ'&’âjKÃÃdé²M†í•5ãM‡üvMK~NÐaoÊÎ%Ñ@¬-ç[?1øƒÕãA8Ý»þÇ=Oš²ƒNG[aA«ÃÊUó+ŒpnšÃÛ¹ç§‡9^ˆç"Ë3Ù3Ë;¸§‡uÊÜÛÓ:å.î¿Ó#:å¥Ü_té¸¹7të{ |H§ÜË}¢[ßÇýK·~Ù,:	XŽ\ë”;HœN¹¿	sð› ðûw:zü&ÌÁoÂü&ÌÁoÂ¿œ Ùñˆï¾K™ßš“›»¥çéŽ9l:¿cêÍ­óÚu¼£#?À; Å[3ÏX÷tr@:ôKÅÄSªyÄeÀX›ž¼û{> t$æñIñˆãû÷§õðùƒOàýŒfô£>Ä÷åL¿ðù#‰=ûà¹ëü…†ÃÃ÷Ÿ$³çeð>ßú^týÏ¾€¡0«Ì· _8äc*¥ 8Aî[Xñª•_Î}
Ž3ñ¹ä¯ÚýÄ{,Îå—wÎ¼Í#7rœú^ Þ°=Ëp²Â;eí4p
}Nn?>Ó>ŸœTÛÃcºÒþ‡Ø>Ÿ<ˆí]•þJ¹ýº™öä•ˆþ“å÷#3ï‹ÉSïKúG‘? ‹5þ£½Ï‚öÚøáÍØ¿[íŸæè¯‘ßžÀ·^³L¿hú]2@¾i`ÉI2öt¼zˆ\	e(»O®áÆzN¹¶}‡Ôc™K++…zýØ¶Tm‹õ*ÉUPæ†²ûµ²
rÊ<Pv—Üïô4q’+ ÌÕ¶	ëù°^tÛ2,cKôÿ¥}@GÖð¾Y°S%!Ô»(’ÒjA¢ƒ¬@¸Ûà†+v\/ç\*éÉõ»”ÏÆé¾ôÿÿÒî.‰óßï–Þs©WÓ{wÎ¬ÿÙ-^c§}?hgË¼÷æÍÛÙ)oÞ¼ñAúI¿I'õU’§é‹{Ô¸u!-‹ŽÿM‹ü$,Ì<»Ðd6KgˆTÖ7†Bƒ
õƒ•1avÀòT>”
í>ó“¤?d†ff?:Htæjüu‘k×’¢2e3ªƒ ¿L<S‚óA+pÔoy+é#§vcÔ´î´X
EÖ"‹CÝ î¨âš~£ÅŠ_Ã™>M¾S[dr8ØhK}ÐÝh)Ðxòb”>M˜~)É«¢óqú>SJ¿ªw£Tn±””Ûôúb§M_lG
ª9ðl‡ÅáwÖ»€3‡,l‘Õi0—TÛ
uV]~Z	_Snªœ‘Yã´ò’Ïý04Ã"tö—p«h‰SpÿPyyÃ
¸¢T“±Nì;œa(¿•Pƒq¬˜ßé}%c«/ë§i
é%³×kÖZsj-Oü>;ÇªqV[µ^¨¬²zs¹ÃîÏ)úGl$g–³Þí­w0Âið#}$¯”Êôžü‰$S¯C¥
]Xk¶4U–6g×e˜tz·6-×g´W[;£v§Ãfö ¸­ÀWÎ­¬_ÕôáÂcåì…:G}ICWÌçr••;]>R.š ’ö’Ô'®Öê«Ca]k\uSG¬<q{?-«<´¡ˆþ, [v§ÞÖtK^åõO»½N£©-žm2:½ÝµŽÒ2»½¬ÔQlµKð
WÕ¬,¯)PW0y³rªœ‘†˜Ýdõz­&ûC½Î`Ðé-ŒRfÆ£x3¼ÜR~A|dŠƒæìzµYç¨sü&"«ò:³³Éç.ðZlXnÀYÕWk¨¨°üf¯®zÄçpú%¡ÑöªŽ)ŸaGW°ÍuŸÉuWµ<c‹xdDÄÃàbÁ+]ˆ‡S8ª#‡Ì=6xÀ˜ª~ü?Åª¾£7ÂEAa*­´M§â¥±2Þä¦4ôq™saö0cK5ñ1üG×PŽç*†Ùì Nç–…Æj*Ç†÷°Gz¾ÁõnOêÔaI_$=ÇxÒs}Â Tï“çJò™1	žÔâu©uu°‰Žqx“ì«£×MÕ ’ºO¹ÒTóU¬Š7AaxÌóæ›îMá¶12žÄxÎžNKíš"õŸ.Q±/MÕ;ÚÂ›Üo¾é·=Ž3ˆ?*Ùv+©øÕ!ÅÀOCÒÿÀözrf×ÌéÆ>NÖµ7ŒT8¿×4?3”;Ï¦wz-\s|Žªieuxq¬¤.d.ŽrÇRëT(œ–ƒZ‡ÂSY|ÍìÕij"‹¯SïáIæ+ø“-ÏUÉ&éÛ|†ê²òªbŸéI½ÏPÆóeÆr=Cq`œž ;,ðÒ6%¼Ž×IüêÔõHóöíÍá¦æpËöí-áæ&Ø³¢a…}Í»t%:,ÐC+ü=µF$¤&Õõ‹ûèk„¿:tˆÌ'ÿ'öÏ“ü¶"µ­ ŸðÖ·Ÿ×þ6ÜŸ%¶Ý¯TäŠ¸dÎF€OâlªøìFNõsÝâ_»Ñ‡x2
˜0Žûk•Jo?ŽÏzv ÇÒòø
3ÁŒâô™ùŠÕ Ý6[‘ÞjÕ«¬EEV‹¾ÈJÊ&†}žÄeM eS`|°<U6Ÿ‡'Ò<äÉˆT69	ÓF…Ì¨/•M>@Ê¦ ›ñÑ´qþ³¥hÒ3U8qÕ®UðÒÄââ–Î²iüÌWå(t¿õ–ka©£ýY™EÙ¿¦YJiöj§
.ÿ	5;¡üÓ4–MŸ¯ÂDc˜^¦Ú¥]o½å,wÔc¢z‹D8ÅgªL—LµÊ‘Ój%Ûyýf„ÆZRºWÖ¶®­)®ò9íÉb9ª!·ÎTî5$›0@›½;jb}k™"OSe=ŠËú\EYÿ„™€¥ij"Û¯Reýì„8ÃÒZ1 qñ¿!žHÅM"·2î+qÄ9Ž]¦ˆcCÇŸŠ;~7JÃW8n3Á{^,Î{l	ÜÀ»kR 3#:,v Î]µÅM•½åÍËb–„¥–wèýñPpÝÆ÷2ŠMy…e-µ…¹}†3Ð¸
Ó‰Ë«äÍR…¿×\>„
ÁKâ““ñ¥ðà“bRLJ<0L…YÏ†´¹j†¸ä’õp;Üþ¤Øô$ñyìÄ0.j;G(pxy¾":~·J#5–,»á5(Jú‹fs ØŸûÍ-¾¹9áßŒmlz½õvè{½·Úl)7ÐÜŸ	™-áRDådÀéÐôpZ’ÏÑ„¥îM§#©IýcH47ó‘œDX‘ðf•†1]L½¿y€+e…SÒO­uÃ2èÄé©qz’Ö	ïÙƒ?ìÎÉšN†‘å”™‚‘&¿ðaØ³çãíè/äó'ï÷ràYŽ¬¥!¦c{{î½·–Á³¢O,Ÿ³  kòÙÀ½Ð&xŽQ˜ýÐÈV˜<›*W€üññzvû"÷¢2^z¯[žížqÈ?ü<úÂ±iy‚ÅlTŠ§–Að¿ÞÍF…Éã©oà÷°ÞÆßÀ
¸=KüPI|½NøÊ”¹gyÈ=)'2³„ÁKs aF!|¦yXƒlR’×¶<\ãçéÔ£á×Þw#ÇÕDÓáêépø<Ü:ä©o¼>úŸE‡áŸªß˜|í´.bÞÁpQÊÍ¶Kåy\±gûo°Ñ=bÂwuãL¦ò8ïâ<®…Ë¦ò¸ªˆÜ2eÉºsyüº0c|üŽUW]•’ñ§ðëÃÇ^b¦ãPiK–Sø3Á2Ç³K¿jÕ**w/ë=,®9BÇ{#Ì^Ü@¨¥î¡
ßç M°E&Ïà°ÔÿL Ì³Ò3&m¤±ÿ3Ž?BqÒ~)ã0{1NŽŒCž=ˆŸ=š¦ÆÏ”òõÈtÂ»ð*n+ˆ½;Ð¼ÐçŒJjÁ=!î1yè	®Û·òâ‹WZI…‡®ë¸î`< xV‚Çlóp¸ÖÝ¡öíë$PÌt˜^Jò¯
Z)[tx¤},ÒH_““fê)8­æuµhk·ø
¨ºï‘èaØÓøÞÙÙù€¬‹á%â3['["E":oT©<žIÞ`´°ÁŒxó‚Aƒ…­Ìˆ·TõÂñÞ£jn˜c2ˆÒ™ 6ã7 &ÖE¬ŸMŒ[¹³Ö´ycb“sbw­ÇwœS@ßês6|±žDûîÝñøFlÐ½
ûn_1„½†©ú<CVÇWÕ½‡ž>ö3ø°š‹ÄÞ8Mßx9@h’Lÿ·ˆ‡!²A<¼xi*_A® Lá©Ž|7žªï´xÊ~?F™B ãWÝ;…
5‚ ~,ã2Iï0Iö²h/ž„¬4è›RT6|’þá7ùr§^¦F;÷é²îŽxXô1ÕÒêª¤Â°Cý};¤è%T*®ß[¯ËoÏkñùZòÚ‡÷
ï!ar<‘O&Ça<¹ÍdÒšL…÷¦ÎPÔßßUW¼8¼oùÈ-ÃÃ·Œ,ß7Üá{.„{0.,Å Fc¡Æ$Ÿ•ù sF&Æ´Ñ¶\^79Tÿ³ŒÀºÅµêÖ¬ŽëÉšQ»8²òæåºŠù×ÜÌqó+îø1¹A’sÔÚq^ò©_ÌŒM2ÓÀìØ\,[Ïó¥pA)Åð»ž?qWÊŸ	›ÅËˆMï5¬d‡]Ï§îoA,xrRºøQS;ži
ÿJ^ç>éQé²öúÅgÙµñ–þÈ\_E-›S°œ¯êöòËêÃñÌ™ê9ùHoÐ,­-]Ó@Ûùýûóv7Z‹ÂÞ²F;I\»é¢§7-¹iÕÂ­|ØŸá«¯HV6¯kð¹gö¾™_¢3{4öÇ—Ý5Ö¿«ÑÛr(ØUæª¶ù»|UíSó*É|\	‘½;(Gêj]„Ó©È6tÔî¡Œç+Tºk·Ô&ÜöÅ=á¸§¹g¯s.8Íó–»Ì+fÇZóïŒø[Û´þB¯Ó[®·ä÷·,©
ÆË;ºZÕ}‘'+WdÄ6:WúLÖn]ÁëØa8
—”;Ý¥nKµ—Iß
Ÿñ “”-vÈÿçž»ñ•xk*×-^¼n2Jìá*I;þKøÝÂD™ÙÓ¼y¨W"þO¶²{"…~+_‘Ç¯¨O_ ª#ˆ¥c¾Ç_á÷EWû[Ôó3Ú¢æ Q©L,t—–úœ±!®ªiaÈ_[Ó´ÎßVUT{ío^F^IÄ]Ú¨)äœÁ6WIWXåå[5Æ¢ì‚òÚ€›ÏÕÖ•šìPï¶•–xÌör5]óñ9[úë¿wÍ‡._²^¨S|r]çvMýøpx ì®LT1/VŽY«¥µ*!=”fQöv×5õ›YZ‡—ÛzfûÒÝAGƒ·¤Á)Mt”JíOy•¤øöI¥kë÷­Ä¬”wŒÁÚ¿)kô·7·´lnm%!×ÇMýFú¹Z«±-ÚPÚe2**^mÙÒÚrFþµni©æú9n‘ôÃÐéóš¼ê±ÑÑ_k
{f:¥Lè‡òçø!ÌÍë×E#¥?€3¿Ç[&³•ÎÀJÖŒ(­‡é¢)[—l¥ó@ýíÖºó:ÄËc±P,¾	±Äb1t@|Ä	÷ÂPU¾'h¿	.€~t7õw—ü“k[KJZ½^Z|>‹tÀô
çø¬V>¨¾	õ3Ob»`„DÚçCýÇ÷vt9Âé¢ËÏ”Ç'£Ì¾8	t€Ž9"NMc5B‚¯ýxmj­þë
"‘/‰«àq±VÉïH­%p
;k²Í˜Z:¤Ä?Š£´y½ì›Ä†YOÇôÓWÃÔž].LG)-¶´Ñáh,/'á¤jj±€Dñ:§Óns8l—•
×UZÚÅqB)ª>±ý˜ üµ2à¯•’L*B[™,FO½Ccs:Xå
t>vŸÙ|ÇæÊÉÇî³Xî¸Ã‚ŸÍ¿-_‡©º&åO¬gjoPÀR•äÀ³qN­ÂX?”Š?IÀ—½ï>ðÃØ«ÀN>û”Ã•â±M÷Ý/éè1ONÌ“šÚ7ÓÉKšJL$Ìõ™qË#G‡>Âf½âSP!ÞÅ·RãŽ‹¶àwa£º¬Èwy‡¼x}\ý­®ÄÑ–ÉŠÄéÝ‰KvÔA&‚ôÈD×~“ý‡ßû]«yÚ…6uþh ‘ö¨ÃµÛcGÌþùYÜYÌq‡ø'þ_,(@çØcö©_ÃYÜ®]ÜYaX½+|ÖYá]i“n@]¬Ë!D­¢ýè‡oå‰Ç?p(ÖuìgñºÃ’5½ÿ+¥›u}ï¾¸XÿÈáÏï˜sþüq]_Þüê†þ@ ¿¡fQÎ@ÁE#â…°:×<?Í/Ï¾eîå9¢jêÎMçvõµ«Öœ­ÿê íôçhN[O¼“ojº	Š:”ZÛÅCø“¸‰ÁUÙY®æÒÊDÑî¬ùñµ3g'Ÿ?´±.ÛƒÊÄwK9¿°p¸èâ!x2ÛRh›k«f,\ì«É±çtˆ*UŠ::ôÅ¶±*Ñ»ËÃ»zjÝ(ù>í.k~¨ÿ²ù”­ÖþÒ:§o¶Fê¤”ï¢ÔªW:™.&ÉôéD‚”ÓG¸9Ng{ä‘GhØ.>‹²'?“(œk®-/‹™æÊi¡üøñŽÔù[HÉ@ÊÙÔîKk“M”¥Œ@Úü?mó»[Åo†ÜÖîù6ãŸæc±ym&ÄM>ÕÚƒô´Škà*“mò2R“¹û*:O¸óNvë>]GJ§ÕI– Ä”+ÛE›–ªtUK£-Ëª2F²[ËmQ‡*=C}÷DzQÔ7ˆ9;†ê2…m¾/ˆ—«K*lQç,Wa±¡#¸¨M3—] õWk"ÕL.}7œreäZø/q™t\ŸZùšðºÀ*–GÝA5ÊDšimˆ „WE'ÒˆNÐTpe‚0¥ÿ”¢AH¤ô£p/|š6Žö__ã3ù}Ô–“Y€é×[UÅU*€‘âšÐ|5¥÷-JapHVôÂ…›¼ÛkQÜŸâ]Þ1Y¢BŽû…Ÿ	)
Q¦lß+Ï Ph˜ÓuM×.å‹n hÔÆÓ_#Ñu¹4..]“„‹ÄmpP¬ÞvgÖó}”ÊÆ_¦à8—&à †»èýÑGçK€”ß 2QåB¦(q /*ÅÄgë²Ö÷œ7z^¯p
N/¥Ž›K‹¼\Œ®ÑózÖg­KNÍ¯S™_Y2ÒÂ¬€œÊAA€+„'øP¼•¦ÓïÂ;ŒA² mÀÚ9¨ËR0„ð[R¹OŽÒ*â Á¯KÏ7‹m1—_£Î7iŒ†D{¬Ä¯Ï3ÓÇÖ²ü™3òô9ø­f•NËÃæâEE‘ 0üŠÝª#Ú‚ÌYE:>(Œ¿ù»èÒ§s§` Õ_“—bÀÐjZ’ÎûÆ¢®*Ô³Òf1ê¥3}oMpÄ˜tb™ˆu°J<ãÂÂÑÔ×Y°M0jÚÊ{BjÇ/GG’]Y]I4!¾þïY±Åð™ã=©×¬ÃÃCÅ¨˜ŽqËFÛw¢lò¸¥Á["HêÖX­kü]~ü«ß`¶¬­ÇÆŽ2/Ï{áÆHÄ]Öi2u–
z**z
ÕÑ: —uÑêúÎpEEb%%1ˆ–x£ ¡`0R˜ã«a'Ýoo¯Ó¦Ôij›ªÓÔXÖ˜ÑÙìWû
V¶	«Ò~G`6 ¹’ú_šŒ“·âKÙþx+ÑÝeàò‹÷5’Ö@stã×“»Ñ¬×^ÐöI¬€@ÁIjÏ¡Ç6Ö	2¯*¯©#ÿmD‘µÂƒZŽ}ÊÎ:ö)Ýß¾$°˜2ËIÅ•Åáž{àq‡;D×\Èlÿ‰øÉ\Ù†¾ã(¿ëP]©î¾1±£{$ñ èÄw¤ž-¼)³R;Kl¬"èFG}8ºù:¤3#ÔÑæ#5Kâñ[š±Â5ù‘5œJÕ:6ÇY˜Øv¬ðÐ^_¯'YæOT¦©ÊÜå>6ÝÒäSÍÞ<;>Z©bë‚{2º4â[âÝs¬Æ´9ƒuî*+›æl¯¨ìô§Óú¥÷Ë¢|º®Ò¹«ì€¹o.Ï7Ì™Û]ÐpÅ²¥%éìLÎ–ü».ôGì¦ÃŒ¬£BOS{8ª¥¢sœßµf„ùŽ84hò›¡ö&GþY\.‹t@ÿi¢&Í°ÓŸT$üþDE áså>Žó•sb}@#ãÒ#)ŠaÔÏi2Þ, –õL\Zß¾d_ðÿ‘«âš]Üäv7y)çâÓ?*ƒ0œºPfæÇçZ>§tæ8ØÈ6€†ŒcW-/îI&Ñ‚)33&×{¸ÿZÐ!ÜÎþñxž:ÑÎ’¸2ôú½ÇÑ†y˜lÈ—ŠC¨i¤8èB_=óÆÃ¸§ã¸£h7ÑéF Jü4	ü	Í±ur-úÁ£4SúiËç¥€àqp¶è‹Â³îÄ€‹Ež¡éQ>•zm\õÂªiI”Mé“g%)Í;ÅëÍséll:†	ž”äÂ½ ˆmÙðlTô¥ôeì?iz¤¬ÉšmÜU*SgÏP
:>Ni¸—$“â%_thífó°lÿ£b›¦äNy¾-Ãù62ÒjáRç;ên³ÈôÜ=<¯§!›•¯çr’3Ú»íEélvAQHßR2â^Ð	X23Mö™³œea¡X[vÛ\™³œåÞ6Î|×ðD7ÆìÆõ³‹A©UH|qF…«Ãëñ1A¸.Ï€eâƒ0"î|W8§Q§Öá*È%Í54?¼ÿMaòp)b'&ìp¸Îi¾¶¢X¦âC€³É=w,Jù;T{¤é¤aðxÝîFøWðÔŽÄb#µwßtÃš›nþRpÔ8µ¡jI4º„ÿÙM7Þp3ÃL§=ÕšâÈ#/|)m ¬v<EÈ&M“®>¾iÍ
7~ÉKD«G­ÓYã¼7ÜxÓ‰on¤íW#æVrvV€âbø")j÷ü*)ÃŸ±|N…ßœGvf×©ƒðF(Ùÿ¼™×¢Á‰	ú­"~ãrÐô_ØŸ‡Œ¿	ý_ezžt5ìÇá °š&Ð6aòœŸÀ~Éø)Ø<	<<Z'fÂuâ‹ûñ¶Ìbq~5¹'—j‹ÙèiFEíy6W^È£å½õüv<%Þi+ö?²â¶s\¼Y€…û÷‹7“´òaºGzçÄ?«—’àÄžÃÉ$|±ÿ‘3'÷’ü<ŽÊI]óÔñÛ`Ó´ºæQô<Ê’âªV×°¨D÷:GQ×LKw›ÇÅâšæ™	hÜ–ÌÇ²ÿÇä^4˜‚C˜Æd
Ž×x ¨ý€Ø…ÛÐ7ÿ€[È…}ó’#ç¥À…%”©Áú	ñ¡mI
÷ÎÏÁœN
Rå1E	ÔþK<·EÅ^ÒïÿoV_‘š†Ç…N?‡à#0òÈ~ñ*˜?±}û>dâ`3zç÷%ä=ŽËM–ù¢«v6î=54Þ6<|ÛêÕ$Ìºyõ¨änotõÍC¢x?t?{%¡y—tw_2†'mëŸ7ï¢®®‹æÍïÂ¼åâ<¦ã4þMæûòcbL	`8&Æ42mLÓË,b†fDò–äIóðÒˆ–„Z2_¨S§áXÇeQ>	iì8ÄX5¢ÔÐUÙµ…†Ø`êŠÜçÌjÎÊ‹1acË,ñ`»º
.±Í*µˆ¿ÊiÎJoCêB¯Þk—BEÙµçx
Ž</|Ö¦ÊiXŠm³`§º-£ýeGV™©xOaL7«i Èm6ÔxÍ†ÐÂbN“[{žÕdÐ•]™Ù<SÕ­N°r^JŸ­n‡+m£)[üã¬šü¼f8jé5ÞyMyY5â9EÙn›^oOŸ-þÙãrÕm32›/4”Y­¦3rkŠ9¹Î€wÑyLº¼1›²·€_í[pË-î¿eÁ¾} 	šÄÅåó‰}•±­?ƒ0&Øàv¸êØã’—êŠ³vtHŠë£Câ5âÕÓñ€mWˆ+©S¦ÝãÇÑ+2nž€™ä%~¸é$U@*á?ˆŠKdi¼ˆae(lïäÊ£|èDžòËßCÌièÎ`m”-ø=äO¾N™›|^¥°Sü¥ÙôtÌ¤ òp˜rŠâo¾Eõê0›èÕ?"x´8tPÖ]hˆ±s`áÂÛ.D—-[&åÃ0ã†@H²Žž>×9ƒM˜²äÎhzœÚ16Ø—ŠKñ$ºüwSþSÎ%8!xŽÁûïÊ8=½áZtàS™Þ|hÄôÔ4-Ž¿ÓŒçÆ1ÝóGF¦ÃÐååž-@ß`zedäüóóOçþ”~Xwì}µ_ö¸JdÔÀ¼…¾þn_Æ#çñà#¿¨(_:P¹ÇG%y€&•þ(z™Ñ“ô•Žu'xùÒž_P0«@a—j¹Ú¬‚B6Ì†ËÐ²œœÜ™&{U-Þƒ/Óäª®'4Ç †î?¡WÊ?G÷·O½‡Y-­ÙCjéõÕFyçºmõÒ>bcäcn<þ6±q£vÂ+œ#µÑM}ÉÕô]Ñx\^>OÙ$9¡÷r´ÓÖJ}j¾µ&34Ã¬×›¬åFwƒ½¢¢>øj™£P[¨)ÐèÌ5~Tá-
§hù™¿aZ…˜–¼¡r/Â%ÁBµÕa™Úmð™rgqÀàé+1fçÈ›
s&ððœ-çÿLX*î†³;Rem"xýI 	‹FbãL¾ÚC®¨|†˜ßáþEæÉo¶ËlÆªr³
™tZ£Q«3Zä[Á²x‹Ò¦ß¾›9yÎêi÷ï*Ë=¾ÞÓòŠï?˜vOÖƒ+¿UzOË!¾ÿ˜ÞÓ²„ï?¡÷´àûOé=}WøþKzOåï¿RÊß¥÷Tøþ›ïú§åír*G;®´I
¤l’n$ß¯Â„i™fÄ€ÒSÈYJsQ¼ÚŽ×|‹ùGÖ·Úx0Ìÿç¡çá     `  _            xÁÀ <  ÐZ«Ö¶\[gÛ¶mÛ¶mÛ¶mßý6Ï¶}Ÿm¾'ÂÀìs…•ÂVá pVøAøG¸/¼B„1·ØQ\(®wŠGÅ‹â/âk1DŒ(jƒæ 3èFƒé`1Xvƒ‡ B**U”êJ-¥®Ò@i¬tRúO
‘ „Ì
‹ÃÊ°>l
»ÃÁp<\wÃãð/x¾„0EVdG.-7—ûË£åéòby½|Uþ*Ç)‚B•@)¬”W†+“•ËÊs%M­®ŽV§«‹Õõêcõ½¡¦ 9¨%ê†£Éh>ZÎ¢Ð?è>zBP‚´†Z[­§6V[©mÕjgµ´ÇZ˜–„!¶pn\×Ç­qw<OÆóñj|ÿoãç8
§D<’Ÿ”&ÕIcÒž,%É^r’\%Ûä9ùLbHÅ”Ñ‚´,­I›ÒŽ´/I§Ò…t-}HßÒ0š¤CÝÒsëÅõÊz}½µþfä4ŠºFK£«±ÜØlÜ6³±ÙÞìm7'›óÍÕæv3ÄL°+¯5ÐkÍ´–Z­½ÖI+Áìúvk»»=ÔžhÏµWÚ[íƒöYû'û?û¡ýÖNr c9%ªNC§»3ØïÌvv:$º–›Û-îöt—ºÝ½îI÷ªû‡{Ûžáåô:z‹½Ÿ¼§ÞG/ÊKókûÍýÎ~´?ÝÿÅîg0Ì+È³ö¬7Î&³ùl5ÛÎ³óì'v›…°¸ÁsòÊ¼3ïÏGóé|1_ÏóËü7~“?äoyXP<¨ÔZYÁ Ø8  ÐÝl#ªS7IûgÛ¶mÛ¶mÛ¶mÛ¶mïÞ«v &yà¸^o0.L		t`&˜–‚5`Øöà¸nàx>P,”DQˆr¡b¨ª‡Z¡nh‡f¡;8.NŠ³á|¸®…;àxÞàø)Fê‘QdÙB.‘[äy%Å’J)% e“
I½¤AÒ2é˜ôBrŒ\M"o÷ÈäJ¨4QÚ(=”Êå•š^-¦vR7h‰5K«¦õÒæiË´CÚ=¥Žt]÷ô,z½‡>@?¥ÿ1RÄˆ1JÝŒ~Æ(cšq€Æ¢é©N9-E«Ñ.t]C·Ðcô½F_ÐôšÙÌZf/sŽyÊ|dÅµ«‚UÇeM²Y_¬?vb;µì
v{}ÍIë4q8œ+Î77¥ËÝ2n7·Ÿ;ÌàÎqÏ¹·ÜwžçÕòúy'¼_~j¿?ÈŸç_	Ò<èì	NW‚Á›à‹ÏR3™y,+ÀÊ°¬	ëÀú°l
[ÀÖ°g<.OÊÓrÂ)x&ž‹â¥x%Þ€wàø¾€oàøþ€±ER‘^¨Â™DQLTµD1C¬wBf	›…KÂ]Qì(ßÿkD]¢	ÑœhM´#:]‰þ0tÅP @“Ù¶mVÏømÿíp6ƒÙ¶mÛ^8Û¶m›ç|$Yˆ$µISÒ“L%+Éqr•<%¿i:š‹–¢ui_º—¤§éMúœ~e)X³†l<;È.³§ì;ÏÀð
Üåš·ä]ùP>“oä»ùyþ’ä¿E&‘G„
E[Ñ[LÅq+•UÌò­æÖPë±]Óîjßt*9àltÓ¹ÍÝåîE÷¯—ÆËáóˆ^Ko¥wÚ{ëgò¥?Õ¿ÚSƒÃÁÇ„ÃŽaïpd¸=<>¿F¢RQ5ÖF£‡ÑçXÇãáñÜx{|6‘#!Se6YAÚdcÙSN”kåaùY¥P®j¬º«…ê¤z¨¾ë:Ÿ®¦ëê–º»¨ÇëÅz§>®ïêÏÉÉ"ÉúÉßP Ê €ÆÐ†ÂlXÛá0œ‡»ð¾›4&Ÿ©`´élfšåf»9hNš÷˜K AÄúØ[bGì‰}q(ŽÅ©8—âZÜŠ{q?žÅ«ø´FŠì?éŒà±   xc`d```46žRi\Ïoó•™ù<R—‚ÐŠBÿïüWáTb^ä²30D<c    x­•¬lI†«OÏ³mkÞ]LæÙ6gŸmÛ¶mÛÖ¶mÛ¶½{÷kdrrßÜìS’/w5NWwUõ–ô‘?E‚CRä|ÑÏ¢gd@ð˜ÄSr/c ‹JÜô§>¼ÀÜ.èÃhfüO°·HšQ•—öp«þ/þTÆþEÐSZ&Ù ’´ÊÀ0) '¢Ÿ¥àCøJâ™òÓHts'À'´ aÖHÃ”ÜÂX)q7Hçóæ ï³ù\‚YR
Ð”e,„ÜÉ™[yŸOAu£ÄÿàžÔØøy,¼§£îöþ8?gMž)¼_$!E"Ãñ¯ÄÎ}í%‰ Š¦¢—g=´„ºçÚ$ˆ¥X¦Ì…Ö|{óZ§ÿ ?KH8L?ý7oS´F‹¢o«o¥‹Š¤ÿ&èÂ>]Ò¿1ªJg ºä$^|+5ø•)µ$·Qý°»'OL-’„§.4	
2ž
sžõR7#ASIœ7Å¥¨®y.A{ö/¦¢ŠÔcâ•»pþÆ%í¼Á×óEå–!:¨y|«£ºÞwlãß•¢ê=icÞÐÞ7þâ[Ò‡ä®#F–Á.¸ƒ;Ü+ÕÕ©fóeyr:{²Â2i§+KpíÔ·‘»±}(½-ÔË?ÒÒÖ³û€Cœ²µ¥,ß Ý–þLöØ Q°ß.xÃ¯ÛA»7ú‘´‹,—–‘Ö¾†}À0µò›ÚªsI	mêäIilÚÁ—ÄÏƒRÊ~ûe¾ó$í½Œä¹e/¶$Ê·ÙÇÿŒ¬±çkÊõ¥ Þ>÷\'	î±5#ÎK= -Æ=4–D’„ç8óŸE[$ó"‘¬ñP¼­¦Ýú2¶‰7+	CÌhëúøßHÿ
;i›\hèð9­í›“ûº0ãaß>úÜëHœCû0¶Íåe¶=.–M¬Y¿ûór6qÐmäZÿKµÏþ#ñ}>L£=Úa ´u3‰]NìwoøPCCHƒ84€zÐJúv]_âº†ÜPº@k=¡,1µF®R”UÃÐ°^j©èpèˆÝØÆÀyÎ“?Er‘&Ù²K“ÈõÒDž“˜ú9À4§ÿŽÔ1µ%n¼*Ü3àÝô_ÕûUïH-yž~kã¬åmè[’kÍøYWôV´&Ú[EÉ	¥ÔN‰C)5š=F££3LñlpyjcF;ä%ö™ãúb%fP]=#°ß‰=à=–È îÀÞ…½“lÒ$ù¦}$»ÞÆ¼	%n+WICÝŠ~?‡žÇy×ñÝ?ÙsßÌF‚ŽH´tÕ.jÙÜê@ÛÔ‹÷à(<'W§©)Y˜;š>5ÀÖRPŸ:µuÏhuÖVñ6OÒ·O`çnÎ	Ö³Ïâ± õd¹Ò“X¼Fúi‘X¤kž·5.®£è, º>öHaoÛ§=»=‡Bwª©MÊ´ÒÎê4c_ã»:öð@P
H-¬+œB†¾pæL¨éõ|Yà•@o…j)LñÌ„¢°ÆAKÈ#™û<ËwÿDosq"±ÿ Ìž¯   xc`d``žñ_…!…3áÿÊœJ@ÀÌ ‘™Æxc`a
aœÀÀÊÀÁÔÅÁÀÀà
¡ãŒ9ÀB¦ÿŒOÃøaAÎ>~31Ïø¯ÂÂ|‘Ma:HŽIˆéR`` ¦Ù5  xdÏ°1ðÍå«mßlòîÚ¶mÛ¶mÛ¶mÛÖ¸¶mãš>#XŽ~Dd™/ÍOj¢ÌˆñÑäß4Œ¢Ó ÊJùimIDF‘WåDe1DL3ÄñÂJcåµê[û­CÖ9ëŽ„Œ)ãÊÄÒ+ý2·\(×Ëƒòâ"59‘ùQ %Ñ-Ñ½1s±+±{qÇp7ð/ð.~Q[Ù£í%öaû“ýƒ“rj¶Y³—³qN.À¥¸÷çñ¼7ñ.ÞÏ‡U•BiU[5QóÕbµAmW»ÕõL[:ºN ëÔÚÖu9ÝL·¸âÄuÚ9/×³Ó³×sØsÜsÉsÕ[À7$›Ì–([Šli×Núîþ²\—ˆ˜²QZF[Dr‘EäÅEQ-PY<¶R†êÏX×%Éè2v ÞNOˆ4p
¹Çè¢Z z`æ`V`öà@ þ:â9Þ=ÛÃŒþýÑþÎI8%§eÔçàüú^<,‚>¹Ñ×T
Õ4£_¯¶©êq¨>Q8}+£ã4Ôïðìñòó\0úü¾>F3[R£Ÿhôâ¿^§(çï,z\mýÛ‹jP•°ûÀ½â^uOþýÇ79@ç•EatŸïÄImÛ¶mÛ6Æ¶mÛ¶mÛV’¾÷W1ÚØcÏì»ŽµtçUM¬PÕ rÕrÜròr*ÿJÅ®Ê¦üJÁh€ð- ˆLúÕ¶ŒœY~¾úã»;,sÃ´pwén‡à»†mÂæa³ ¤OwApcpEpN°)˜©ïBÊÝ)-’+ø”ÄäißŸýù€ÏÇ@üY1ë0*ÀšÚ­ö¬N×ƒzYïêk%ø@ìcùíã}¦/ô¥ü³ÁÿQ.þU.ô×ýMÛ?ôÏýKÿÚ¿õˆïøÉúOOóð}^àEàE^æUü¾çWIãïü%çÁ/àÉžêÁo·~Œö ¦	:^3t½žÓÙ:A+µJÓt»Æh‰Fk¦ÆjœîÓÝºW“t¢6uhD3:Ò‰^üø_ÅX&1™™,f)ËXÅF¶q$Gq<'pšÖj–ÖéQ-W%ò,Ïñ
oð1Ÿð
ß³›t²Èg%&‹²h‹·ºÖÈÚZ;ël]¬—VëR­ÑÃ®‰ºV·ê:Ý¦Ët®ÊužmÒÑzDç{´.Òƒê¯ªÒ³:GS<Fýl³ŽQµT[M&'†$bI¤õiCsZÒŠÁôg iÊtæ2‹Ù,dŽîd³9ˆYbuxœ‡x”§yŒ§x†y7y›wH&…T^§ˆ
J)3(×]T[sklM­™u5·îÄóQ<LOR—çiÀK4äeêñy•&¼F[Þ§5ïÒŽhÁ[tås:ó)Ýù’n|A¾£7ß2Œ!d(ñýØÅHÒC&ãÈf¹Œ'‡‰ä1…ýL£©0ƒbæSÅ<*YdÆr‹a¥Å±ÂbYm	¬³Z¬µ$ÖX"[¬›­>›¬GXµ–`M8ÜZsˆµà0kÅ1Ö“¬'sºõæLëËÖ‡h¡'_Ó…ÏMë­6[­¡ãæI.U¸{¬G©ZéÊP¶òµO¹JÓ^åÕ‰q@ @ÿ››T«é½j+YÅ¶mÛ\Ç™8Ûåú^äwäŸ>©òF‘B%J•ÉW Ü)²½ðÒ+¯½÷Ág_|õÍw©ÒdH—)Kž\9ŠU¨4lÄŒy–,Z¶bÝš˜sdÀ¶-»âölØ´oÖ´9«ª«q¢Ö©:gÞôÎzç\ht©É•f×ZÜhu«Í:ýÔå—n¿C4ÄC¢gá»Ç!ÁÓð8ÄB’hHöüApL`    Ð_ ‚r  @“	ÀÆl  zü¶Žº¦–†¡„‘ž°˜ƒ•“³£µ­½¥™…¹©±»·‡§¯—Ÿ›‹«¤”¼‚¬œ²Š´Œ¢’ªZ ûÿr
 xLÎ%TDaà;ó?]··Ž»Óp-h&o&mO$
.ýÉô@C#‘~ÈTtå"í ò
±|B ­ˆ!DŒ#O[ÿzlÌc•vPÄ.íá´ŠŒÓaŒË1ùçÄ¿Éwy"rM<y¤y¢MÍ/´…vy§m„´L;Èj/í"¢³´‡¼®Òµ´B‡PÖ*†§ût=§£é%CV¯è82zK'Ð®Ït}§SN#eRt¦–ï¦ƒšGélÍ“t®æe:_ó&]@ÆlÑEdÍ6]ªyß…’A †¿£L1¶7…µ½qqÝ8·Èu=¿ôÏÖoùHGÏ¹è=91-w¸É]nû<å…Þ‡¢æÆDþ…¬¥Ó­(‰Æú;f¾SóA?â:Ž—Ew¹Ï®,˜wÝ§Rø•ôvMéf¸×‰þ­œúÏ‘³f.Sù‰«ÙoM¾'Æ¶È„«
¢ŒJ¼mZÿßýÇèsäØ«èóF¬Î{Ùâ¥ûY²þÒù?ÐûÔvW¸å“,ZOÿ¥ºócg|—£·´çärWâ0äGr3ý™ÉõH5“
c‰QýB\ˆ×©ÈÉFs“ÞÌLðüÇ¤|uGÔ°ÿÙÉ™þžJ,û(;wBVr,ŠÐQÏE1kØCy@çí´3Òh}*¾Òá
”dx;z™¼ÉR¯ Ñké~;Á»xl„5B$  Ä’]ÜwgÝ]¾ƒ?zž€ýw¸þÜës´¾™$xÙÃEþ³`è9„92`Ù±Éf–ØeƒQþñÀ²-¶³Ív>gÅ9¶“»ì¶Ç	’ü´×>ûpÐ!R;BÚQN9ãœß\8æ¸dœtŠ¬ÓÎsÖ9çyCž‚†°j”"—\±Æ1ãl²Ç>%¾S¦bÂ¤)ª¦yÇ3fÍQ3oÁ¢%êÜZæŽu^Y±jÍº
ÁÃ¢  @Ñ{?+ëyìÉÆØv~/Ûú„Ö}Hûìu®sXïz7¸ÑMl`#ŸÝÌ·¸•MnãÛÝáœó.¸è’Ë®0hÈ°£ÆŒ›0iÊ´³ît—»Ýã^÷¹ßô‡=âQyÜæ˜#gÞŠä-Z¢L‰§Ì³À_¡bÙ
‹V•O,QµF†uj6lÚ²Í2+ü°c×ž}	8rL—4iÓqBË©3OzŠ§=ãYÂžó<W]ó¯‰ó¢—¼L×+Äé1`Hß«^ã#ž“àIR^÷†7I{‹·üö¶wX%ã]ïyßdû)3&ÿ	‚ì( `?·,6SÛ¶mÛ¶VÅS‰T…JUQ%ªÕ¨U¥Q¯êcXƒÆ(×šµhÕ¦]‡N]ºõèÕ§ß€AC†5fÜ„IS¦Í˜5gÞ‚EK–­XµfÝ†M[¶íØµgßCGŽÄdL9$RgÎ]¸tåÚ[wî=xôäÙ‹WoÞ}øô%#+'¯àÛ_þ	‚Ã€  `½Ô¶mÛ¶í·öŸàÕ&…P¥P*TªR­F­:õ4jÒ¬E«6í:têÒ­G¯>ý2lÄ¨1ã&Lš2mÆ¬9ó,Z²lÅª5ë6lÚ²mÇ®=û:rìÄ©3ç.\ºríÆ­;÷<zòìÅ«7ï>|úòíÇ¯ˆ¨˜¸„¤”´Œ¬œ‚à!]   èýn¶íZGÜG¶m?Û¶ÍßxFö*åwÎIOQëiÖ°–u¬gÙÄf¶°Õ3žõœç½àE/yÙ+^õš×½áMoyÛ;Þõž÷}àCùØ'>õ™ÏM1Õ4Óáfò—f™mŽ¹æ™o…Yl‰¥–Yn…•VYmµÖYoƒ6Ùl‹­¶±Šlc;½Ì¥•Ý´0M&Ëlg>«Ùo‡vÙm½öÙï +	äƒ,a)G8Æ>8ä°ƒ†1jÌ¸	“Ž8Ê³„!J7=Œ1Î<Óá˜ãN8é”ÓÎ8Ë‘E¹äø‚<R}é+Žò•¦|íßúŽ4FYà{?øÑO~&
–óÄØI!»ØA9e”ÒÉqÚ8H	u~¡†jÚ©úO\D @\ÞâîÐ‡|Ð‡àô»œ»áÎ5íªBMZ„DÄ$¤dä”´éÐ¥GŸCFŒ™0eÆœKV¬yâ™=òÊï|ðÉßüðËŸå
c{Ó[ÞöŽw½ç}øÐG>ö‰O}æs=(Ñî•+P©X©BEÊTøÂ—¾òµo|ëÿºËó¿Q	ãWöä¸¤\ïíÈD	gýë½7‚›]lö(iý™™yï^}õÌŒF#E“?‹ð¶R÷jÔîrÃŒç£p›fU¹…åºÜ©×Ó8Ë«¬ÝÞêq¯Ê&Í2µkÄ<K÷Q{TeÚˆ„Ô$9øG	Ò$œ¦Ko&QÌËøqC3¦7Çìì’rrsÈÂ³¤Á®Ä~ñò6­¦/s~±|g´ÄJK^I,›¼X©i7Å°CÃ2Ìé;§«$>ÓrÅ{iÖ6J¼GõÀ‰ØúÁÀj;¿Lvëó7ínVí¶HÛfô!/.>áøOñŽ+>%ëôÓ“å¥éóÎ‚äÅgû‰ÏÓ\‰˜P|N™óÏµ?Çv?çíþêó*ß­Åç´iñ%/øåqÁñ—«\UªÎkñåºJïÕôë£S|M&.fá‹ohúäíz~t‰s¹.Ê¬x?|ÉÚvz->¹®kÃžò1`L›¢ñBB,;8Óå!Ö¹Zk"ÃÅ²¯šäåòPæRÝ4žáïÁ§‚(:‹›îô†Ž”ÆW7ú¢îÄåñÂÉW‘ÄE8,Ï¿ŒµXÿ"ÑÝ‰îFêcøR_ž¸?ÔÜŸëòK]~­çúFÏõ[ý\Éö;}=O¶OÆ³ðÇåõªÈ×gŸc ÒaóHF).gŠæ‘
šGvl+nŠ0QÇë¦0_i]cÎ/Â	Äš»Æú­®aMÖ§]ÃÄSw^lº®±¼‰œîígŸ¼;Ê±`Žæ‘Ó•ùEþŠ—´<î#.÷‘Woõ‘€iy¢àPûH,vlÝ
ûˆûKµï#¥öªKô‘Šã«añDÍÏº~«/š®4ÃþaÁ‰–ûG«­ÔbÇ-úGKý£åþñÀ=ÎêáÐ?¸<
úÇÓ°â™ûÇóiÿˆÑ?â“þáöZ¤Ý3§)%ÀøðTÍî‰«T·æEÚ—ˆ‰]Q˜ˆ	Á[&1I»}cÂ¡O˜\ˆ"…Èa!ò´©"…Èa!rXˆ<"…HQt°¦|­0>tTk†…£.ÒzCc½ÿ2;i&Jw«“Ö´ÖµÈyV®7™Ãû!9Ãã!1Ê_ã¢Ôg¶º|Ðå“^ÜóIóÒÿÎÿÃ&¹MÝýxw]äëô¬ù±¡½Û4@” Å4ÀÀ {¿
:ˆ3À>z `ˆø:{=pÁ”h‚ìëM mÐ=Ð}0À¼>F`_g öÚûuæÐ.è>ØçKÀì¨ßí‰üž‘?pAøC	"_d€tAÄÇðÏQO"Á^#e€&(A‹é€	B[6è Î û<.è> nBÇÐØë9˜€¦m€&(Á¾îÚÐ]Ðûºúü1}Økì×™C» ú`Ÿ/°£~×çY Ö	<þÐ‘'2Aô@ÄÇˆ›ÌÄ{½ï¥ÛÛUJÒ
Q¤4
h/DÏsAôÁ ÁŒÁ9˜p¾$dºh‚´@t@ô@ü¬ª²ë€ÁY¹S4‘©¹aæ¡SgÍ¦RÝ•mEÌïÉ_ç¿V÷j×
T¾Þ4]À.§|ŽÚ 3Þç§ØÍ¬Ëq=íòb<£¤4Ïð
Ð%h6è€.è>0=~F€´à·AtAôAÌožÞlÔîGëJ¥ªè§å/ÿßõÛS~‰,Ã°¦oT•—+ú½šdeQîhxQ«m~”çª(ò7ýïáT=fEºÅ7Wå"ÿÓªºÉ1ï×½:øËëu¿¥ªR¼.×bÆÌ^ìhÂƒs0#ÄÙ {.`wA~•‰µ¸*T]ãàèpþ80íÿÐí§î?
Ý§‡-]+×Û¼Pwi¦:ËÂÇ6MOló]÷½]«lX°âa1ÑŠèèEÒV%	#²Á90Ã(
WÏ¥UU>´o8yàMHWÝ;€É“©û[Á°e_sã²å¶l6c$\õÑsfbƒ3À 	Z }‘íSæéZUªi+¤M¼ê.‹7Cù$.{:}‡Ý}|Ø—6Ï…¯ßa/±M’T”/D÷Í](ÈxÔt…ãtÈe½ÚÁoÀn8‡ßœP«7ÜëìiÄCôÆôõž•ÛÛq÷
N#ø¢)3¾N‹6	Æ †cú¨Ì¶™&fH÷ìÿ‚ÝQ‘åÌP!½^Ÿ¿þ­}7ótÅ`ÀŒýÙm‘f¯c:ÏÕo†âÓ¦*_«ÿ¬Ëœ x%Ì±Aa á/?  À@z À@0Þƒ2IîcEÌut¯ûÃÉ†Ü©Ý ~]I
OROƒ,ISù¿5Ó"/ÒN‡²"Ýô(ÒÏ€Ú‚3ú»3® UP´xƒ «@ @/ë¯Zkß¶mÛ¶mÛ¶mÛ¶mÛ¶ÍÀ ðo 1#GÀ?Ä¬à?H
2ƒ‚ <¨Zƒž`8˜
ƒà%““éËŒff2Ë™­Ìaæ
ó‹UØl%¶!ÛíÏŽcç²kØÝìIö—’+ÃÍãÖp»¸Ü5î	÷‰/Ãwá'òóùõü^þ4“ÎDÁâi…ÚBK¡»0SX.lÎ
·…—Âw1óŠµÄb7qˆ8I<.YR<)”K*!U“šH¥}r¹º<Z~ª¤Wò*¥•šÊaå‚rOy£üR5µŽÚQí¯ŽUg«+Õ[êõ›&iŽ–@K§åÑæj«µÚyí3 
Àô°
lûÀQp\·Àóð.|
"%@éPkÔ
GSÑz´F7Ñsô‹ØÆñq{ÜÆ3ñr¼Æñüÿ!ˆ$ÉB
“Š¤>iKz“dY®S=‘žQ/ —×ëémõ>ú(}†¾Ü(lŒ5.Œ&kf\³¥ÙÓ<k¥²ºXC­iÖrk‡uÒºe½¶ÚìöÇu;™œ‚N§žÓÖ¹KMZŠÖ Íi:œN£Kéz˜^¢èG—sM7«[Ä­ìvu»Ý-î!÷‚{Ïƒ^coŠ·ØÛäðÎû¾_Ñoà·÷ûùcý9þjÿÿ;#µ#+"¿‚$Aæ PP!ØìÎ·‚Á·hýèèèþè…è½è›0^˜6Ì–k…-Ãáðpj¸$ÜžßÇ˜˜‹ûK<@±
  móÛIÛ»Ù¶½ÇÙ¶mÛ¶mÛ¶m{ÿ› èFƒY`%ØŽƒGà#L
3ÃüPœÂ
p?<ïÂ7ð7J‡ò"	uECÐd´mDÐyt½A¿qzœ+8Â¥pcÜ÷Æcð\¼ïÆ§ðMüÿ iHn"’€”$5HsÒô'ãÈ\²†ËÆ•äªrc¸Ü*nw{Îàe>âKóíùÛüÁª„!ÂaŽ°BØ#œ®ÄÌ"[Š]ÅUâ	ñ‘”V¤†ÒéšôDVä@,_’ïÉoäJ ŒVN¨ÙÕjêrÓÊk½´¹Ú)íšöCõæz;½—>LŸ¢?Ñ?IŒvÆNã¢ñÀøaf7kšMÍæ@s›•Ýr­"V%«­ÕÇZj´ž[Ÿív›·ãv)»†½Ð^k?q’;²ÓÀéì,s¹ÀÕÝ¶nO÷ —ÎËåñží1o¸·×Ïá—ògé/hÌö·Ã¡¶	{„CÂIáÂðQø1J5VE÷beccb«c_ãuãÝãÇJ¢|â i@KÐj´	mC{Ñt]B7Ñô½M_Ðo,%ËÆ3e#Ø¶‡`WØö†ýg (… €žmÛ¶½ÜÖw?¯ÕÎ¶mÛ¶mÛ¶mÛö{ßARä%Au 	Ž` æµ`8
®ƒÇàøþ2©™LLN¦ SœiÇŒdN²EY™Ç>ç’sm¸ƒÜ	î	ŸˆÏÇ—ãóÍùnüBþ¬G()T°0B˜#œn¯Å´b>±œÈˆ½Å=R^©´TS
JDj%õ–vK¥² Ï×ÊåËòSùL	óÀRP†l
‡Á™p9<Âw(ÊŒ
£JˆCQÔ	DÐAtSÉ¦´R†*”=ÊÓ€88ìüÊZÎî¾þ©#Z¤A¤KdDdQ4I´B´~´_ôD¬TlZì•ŠÕéêÓxþx¿øÊøþø…ø}-·VQ3´öÚm½vY{£·Ô×èûôk†lt5¦+ÆWS3[)¬ÖSë‹ÔÎbW²5»½=Á>`Ÿwò9œÓÀ™å\q>áÌ¸ f°‡ãx=Þ‡Ïâgnb7Ÿ[ÃÅn3·“;`Òžô&ÃÉd2Ÿl#gÉò›üö2y¼Êô4¯‘××›áí÷Þúåü:¾é·ù©Ëéÿ 9hZÖ¡
5h=Úšv§ƒéx:›.§›é~zšþãÜ=àšÈÚ†ïkZ2é„Ð‚Xh**®Ê
º®.¶ÅººnsŸ-Oï½2‰x—·÷ú½½÷ïm{×íËã¢¢"
RRI 	^Þk8HÜdä.£ùñŸÓ®sÎÕÎdö­ÐÛÜÛ†·OwÃ§ÐG ôÁ¤àè£A
@A5 ¨•?ú"Æõª¾^ ç›çjÙoý–|KïoÈôÂ øÏÿY€ÅîüïÀ"©AÞX'Ç‚ý}´ë‡"&¬MŠ©«“bò
ê4–’b™
Ú¶SŠ-Ö-ÅVÛ/Å²„uX+²½u æÔÿú_ÿüŸ“ûáC”ðÃ‡³ßƒÿ"òŽ§²rpP jjÆ»{·×¡Õ ½zQ…7
²£ð7á?‘[Þyæ7d=úg}²'zàÓOæÿüöz€Â`3ëw>yòd|äÁÈ8þöúYÆl6§üCCþ~È‹`T°+sT>Ã+•JÛ
ƒ“+tYYÙààT„«éèè˜šrlvZ7ïß¿¿»çä©“ø{³Öé¾{÷®‡êí¥ðCPßÛ«‡-bEYà•lf)Kåí†#Íål 8rÄ’õ|üñÇ‹ƒô¯(è€Úp
—ŠgžLšM©àÌ½¯¿þúÞt0m6ON¹ƒðDè<PC*“·ìÙ³g«"nß¾í§Øµ²T41Úú={¿úz^kë¹víÚ‰uàËOv¶nR‚MècóyÈåìÆèäÄàG}4àëþžžž]5Õ²þ¢9c°­~qÊm¥óYNXNŠÉ	3I1“DEåÂfCfCfb£A·ÛŒ²LMM
Š‚Gø6?8fœŒÁA‡É©ªØ¾}{¥ÊéùÁ~àQõöª 
Ÿè±QÓ8ÌžGqkGÀ#¶æÃÇú	ãqÈð
××Éß›Â œÂ‹[
y<žÐÇnÚ´‰]º{w	Ÿf‹åÙî”G)*:çpAÉâCÃÿîßý»áxggëdx>‘(í—(¼A.£Èú–ù‡ðëìc:æ¬ƒ‚¬½ÿ9kûqe¤Œr},
p
}G…ã„Z¡¿ˆÖ¬Ó ­Ø°ìæu: A5ëtJ‚j×iJ‚fÖiiñÚ«DŠ£DT<Zn½d~½ä	¤'‘nN,¥€jÜÖ Ï-üåW4J3·²0??NäÔ
­[>»ÊAPÐRe›ô^/ØpUè”¬C—ÍPâuÇ­®©Q»ïÜql6$£ÑñG“í…Ë×¢+”iSížcÇŽí®ÝÄÏÝ¿÷K¿|å€
^ú´Æ*­Å’ÆÙ|‰Æ²v6ŸšøžÖØ;±VœâÕV¯Y-ë÷‹xõ'ÎUEg‚P¨¾þ†ÖÙÜ,.ÝÕŸN°"ûè£<46NLÜ R8
Ž`Ër{›^
Ï<™*×ÇÃ.Tã¾À
(´áðÔÍ§¦‚0>Æee7Ñ+q+Ž¶B#¨-Fc.—Àì9²ËÔ¿%Gµ‘”é;:oÝ‹¡Ö8»Ã’ýò¦N×Ù©”éM&5mB•Íô›2^÷}­L»Qs4%gg
	Æ™þ­?-Îm¥»ÝJXJŠ•–bJÂTRŒ',(Åâ„)ì<²óÈ¶Åò(Ë|<ìœ|bÑÇÂÁG(ÌGóá¤Â ‡'&&¦¼áðØXÆQš‰8(x{9§*PšmVðßGqNäDqÆ³y¢
Ûôy”(,û_¼ý`ÅÐvVi«!3ñ—:Z‹ZE·{·¶`•ÙP´½<áuÝC±Þ€nÊuo…Vk4–¥"Ó€×šž¨
o ;4ñk4cc?".¤	A`¸`s0J›MÙopöönwüqKËÇ»·‹«I‹hµ&:9]“(¼qH¢]eh¼øZ­±‚eyë®rWÿåî©Ó
~‡Óà`Gÿ*õ”ú¢dgAûT²
d
d+ölXøç{Ð.|«¸ì0|$–m‡÷¤|†a‘-A{)ÓlÀ¬„I1Š°E)F¦’baÂ4R,OX­K¦/°-È¶!3ÅVÅ3¥ËËËgggçBQp}|&Cå<¸¤æT:Ûo¢ü.ç™3»«ÀéDöÞV…Uõ)”Ö†Fq•lV´ZÁ–´«·ØnTªOµ%¬
Y2
v¨qzÄ¹%ó†O	ðßÈTS¦_ƒ­®þá%O»8“—½"@\ ¾w¿¤þR?O•0a<²o®@àÙU¥¸ªéÐà`?-ªl6'èðTOÄúp’5 +mg†°c -ezÂ…r•È*‘©ÙÿùC+Ÿ|âzüxÌüËÕ¤3jçžCÁÐÕ«–ÖÖT
L´<ÿøÙ^Õ`
u«ÚýóhÃìlyù­Ê§"üÒÑ
vï~­óWk¼ùæâb³Ib—€ý·Žîü/Sƒ?‰ö4cMå  b¿o4NN¶ŠÕÌ`57p´_ålûÑššæÄâj±ø·–Œ0†%°¶aPKèOÂ&¥˜‚°¸‹¶X`-Èv!+g?Wp9ö”Jsd5‡ÒÔêàÿ‘z~ppp:00à_¹QîÜýé§;v|X¼uó‹/¾Ø±cGnôâ`þ¦YP×ÚÊ%ÐO&¶³(x êc¢ÕËÆÂ~çÔÔ”ÓN«-‹:v?@•ýÀ
>ñm¼ÝíÇQÐmA-½EÑÇ·o;êU¢{œRYêv¡
ÞUgÉObÏ&ó–ÖWQ=¿ÚjfTÇù¼]ô“ÅJzöY`þkÔË_ÏƒeŸ„É>µUÍvlVKØˆSÆK1a“„IÛ¸{i-êi,ózË¢Él6›DWzêñãÇKÄy£ÑÈÇƒ³w¿úê«»³AÔã×Ÿ/½FÙ¾yylaa!&7V·îÝ»·µÚ˜O·Ÿ|óÍ7On7ÂVáúO'An­×vÒgM¡ÏW‘\EÒ’ ð‚d˜.7™‰'OÈm2•Sá¸'ž‡ýc8ñc¾0DpæR)ÉìÔ£ÿ+ºTssV«;žØŠcöCy›h¯ËÁ?ŒciyjŸéP0ØÝ}õ*¹ƒÁÊw
«|––3¸(Î4[ mÝFSU»ELôÇzztÉè«£<;º@á-îè‚ßëõúDo«­­åðƒ¸—ìrJ¦4Tb<#ðÞ´R*½^G¹ÓTÓ¶oß¾¶QEˆ^‹ííea3>Ÿ˜Ÿ›¹sçŽÀ[rs·±ÉõØ±
(h©ÃÖÒþL}}}ÆŸNû=~?Þi–8™uW@…ŽD(Â&“é[Z
Pìz(M3UÕ_V©l­­6goƒ²§çñG©,Næ7=¦í™ðÓ¹ñLá5=3i”óMÆIªxZ¦ûÚ´p2Ä’iÖÝžtÃ¿9#Û7[tâœ$x‹m×/¼Ð}ôŒ¥&¹k“y‹¦£‰TÉ0öj†ÆjQcpdïÞ_ºR+5G‚—DÝÁú¾9¼ßºýÈ9ûÄd1CPTYÕÕÕ¬ghÈ·ô³*µœ¥²¹ÜJT`S
Ì"¼+¡´áì¸\Žzç¶Ö:tô¥ŽGŽ~ñöÈ¨wçÉwïÞ½ ÎS;çP0éå••å¸ÀN=ø68‚=«©q”Ä¼£âê÷BSén®","ÅR„ñö@á
°k%‘¦n~v{n!‹ªUE³¬èÝf2é•€³²®Z‘WÕ‘Q§Ïƒ—¼B_
‰•¥)t;Àé¬V‹^«å){Y&Ç«L¢¨æóK¡…Ðb,NÉ.ÙJ$zõÊñí–äØØ˜‹µ2áp8m°µ¿tüøÌÜ²Övðõ×_?·¿rûÃ‡wn·Ànl‚âTÚÚýA5—q‹“ÃÃgƒKi{Y:âó<À }l!%3m²ÕWY´l±Žð»´[BÇFI1š°
)¦ß NŽ0SBö*²F6F¿7<#^s¼–Å5ïý÷ÀÖšÐÃ!\Q,< ÒÎ·TFæ–#±Œ]ff4°¢±VTzjq)µo ÆÁ:u¯üñ£cP{ðø•÷Þ{ïí3z{l‘¯¬¬4žèíÝ¿ÿüÙëtÂYvþ‹¯(¼ ³QztüöW+æ¿ "¸¬>»‰îYY* ðŽ¥h¼X&î´¦èèXöµ÷cWéÐß.õ£RâhwÀë¥’h$Ì ÅÊk’bå„m.°mÈZ™—³,Ë¢œf¢k¾‚/²êùR¹Œƒ=_ƒÊäúÍùqy›UÁ›7o¢Ôš­*°
hq•ZA¦ÝŽBØ®h­’}ž—é«„·NXVŠY6(WOØ×RLµAVÂîK±$aù»Œì
d-RRrá/ï¼wvÖµÏÊåòLÔçó‡Ý¥Â,¹Lr	5½_¥Ç”Vž^z½oÚÑ"%Õ-»wïnß±£­­µ¾Â¨R©”J-¦mÒÂ4
½ÑˆöÃ’Í$‰¬ ËçÜÚ\‰gÄÑÉ¥FNF˜™ÏÜŒÖ8oWßù[¼ì7;¿óÛü‘è!ö}ëi¼B¼mf ¢z¸P9yOÑÁ4–øÏøßÞ¯‘ýö‰-ï4ýùT½ô+Zè†ëbù,Þèe¾SÈT(žñâ¨šÕû¡ˆ–mHk	¥¤©‚Ð½ÏÒêµ(^SÍh^xÙ™``Y Z@½9šúY=ýç§,GàïÃwàïRÖS¨'(+ùû‚Î\‡ÿÙ¿=Y @©`¾X°Ž?x €	|`àÛÊ¼ìw÷%>øõ_ÏÃ¯
ààþì/™…	²»Uâô`VCØŠ“¶]Šåk+02£˜÷TXÍÈ˜íLàË@ˆè€ƒCÿX~¡þuå*Ûù|Ù#”ìôXãV¸*a?	3I1a\IO@NQ÷ï‹q;ÈZf29äÑ(zib˜	K½„AÉOŽ(7Š©:u «d£t
Gé¼èÊÑ=”¯º‡Cèã0J…J/0•Ä‰ó›ˆRé4mEñÄ•c29@û0‡ÆenÕIÜ¥’‹‰¥ÀŒâ…n&nG©†{5/eý*	[‘bjÂxÂ$3×Nê¯ý—¿FýuvÍf®=Ñž‹=ÑƒlšžžÛ3Hç`i[ó°aRlš°%)6C˜NŠ
fbf•bc„•‰¬è¬éifqnú‰Å”!™ÅñÀ72‹0YÈ*æVâ©¬bÿægó‰Ã…|bìÞgëùDh.äãbŠ¶KlÉº\«¹D‰Êäs#Í2ÂÂRLI˜FŠñ„¥Xœ0%a’g’*©óCšœ
±`#LúœaLâœ_§Ñoœ3pÄF‰ÚÙmÏÍú¤2hÂÂ$cw74?×OxÖçÚ	cÁNHhUÑœ’:°®>w½¥ÖícÂä„ËeR”KsqF·€îü±§€=ýŸÏrù*w#ÿ²WÎ?¥ï#ý@¤;†Qf-ùòìà-†Ž-gð
Ä¼^ßRBYV¦ç¨TRô§c¾[·nM/‹±‰†Î-‡–,íííLž±ëdtbT^ Ö*ÕÈd Zk-cž‘Ç®n•,íó1¶ŽsW¢QÎvø^W^ïí=½§¥E­Ö+Œ´5îóù:/â.zy'¼,ôÕ1¬L¦T„11âOÄ•â•Ùß¾sçNÈ¥R)ÐBJPí¬aSžðhkvî,ÄqJ"¯§ÑÖÊbš!T'MË	¥¤©iÃš7:!Mù
ÛjX£Å~+¡µHŸ‰Æ”…h¬BºÖ<¡eÏÒ¿ƒô íŠ¦q°T¤Ì,‹<¹u›hdar2‘ME#Y
ž¯GBþQœxWD©ÇE S(4|>ŸŸšˆ)ªÚ÷f²2…âÅFÅÒ£©@‚&[.£F\ÕLÞÁ2ÐùpÓ˜'	uV3ŸŽ¹FÇ@&‡TÊ®N¤y³9‰µk9™d’aÂ¥+#ž}ùÝSnÂÖ~îr4Â4¼tõR™ZF§ªS¯·¡¥ëÜê2‘E0yá-[_ÄöÂÙvå™=~¬YatS–¶Ófàáxò—L2´,‚i1™TâÅ&ø\:—¯Ó'üžÅpd1É™êæ8”NÆB!#&<êZZ-¢Ý^P©Öìõa à Øžàw÷î½IŸGŒ\…~Ì{Æ‘Œ{C0‡1€­ÃAÝt9 ]3ä3Ž°^	Ë“CCÛ…+W®ø|—.]¾pñÜ«§OŸ~õÜÅ&n2–¦c¸7Ž5[¡+Èç
™{ÅsGšƒÕ\ëãÊZ$syDG 6šÂ¹LáºgÜ5etd'n6ÂTÖùÜ¾ÅÌ£5’ÉDÑ²”\U‹½1Ã<ÊßKfoÔšEƒ–77ì9÷î;‘e}CÊ¸«Á‹¼óö5À9¡¯’f‰ˆré'ãX0ÈÕ<x°­±±’ï‡¢UÇÁ<‰ÀÎI­É
BåÅtÍBZ‡´¤^ó†õ*M>K_^›³>–FùÐB¥¦ÂlžžÆ0L	%þRÄ§PTS‹âœ‘$©š¾é Ô	š¡ÉeàëVeç-‰âµ0ÆlÞk¯y<îÀ¼>†ŸcºúC¢ÄêÅySP'S ¤2•Ëá¼m7pÉœ¹y®ŽÌéµzíž9Qï-M¡ß§‘ŸA®pONºá'ö}VPˆ'°qÿ·ø¯^õÿä1¼$h)*Ÿfç€‚× ™Í,ÄÌeòXpÑ;3cŽç±ÇùxdÁ#æe‚Êjµ>]“àúÔù†ÍiE]D–H|›Që!oW
Áüta:šu[ÂY¥Q»³ã•‹³*Q1ÄU
›;/^¼x¶³Ãl™¼á0öøpª¦­ú1ÕôÈ0`À­9 éèâ¼·T ¯¡r‚jŸÑ=ðïÿý¿ÿz±lß>G! êâYìk&K­ƒÁ[7]1¾Öæ,ÅšŒ±™[[a×ÅÆZ«®luûX6ï=yáÂ…wßîÞ¬[^¼xaÝ’nsçÕwà˜˜ÓÛXÅ?©°ƒÄfÆ?g±´¸, è‰Šõ'äÏyÂüë¨[bö9O(ÖŸH>ç	åúæç<‘X¢üOü>ñ› Ðñf`Kkkë®vë/Gë#×ëô:Ž6W?^ª×æÅÈËx>‘¯²²©0:~¿Jc4::~ÂlUò</cNöž;w®÷tÏ+GOÛÛ²ÁV¯Íárò©„JAÉ5ú2+^–e¼Šg–Z—Få7¤!Ã'x  ñëô1„ë¬Y#2lmyb"ê×j9§“ƒ)4v¶­­­¡B ‹@µµ9QýÎwß}ã
ÜÑ¨ïÚ5\Àkg?ûì³¯¾ØŸï?þÇµz¯a½ïÀŽ•§½íY¦ÐÎ¸x<'nßtZ¦5Ep9§µXÌêÌ’KÜÁKbŠËD3t.ˆ"—o5áAV:4m§¼#eR	š[ãaPÙp,€¾£c‡"_~÷j×6…8>_`§ ¼\pú|—/_>°­<ø“–íG±×G·C·ÐWO¥hsSSS]å|4N§2#GÙkÐ"Vó‚¦Í¦câ¢$+ŽºÈäˆo_
Ý’ˆP­45ÊJSžÐ†bÊ“ý"R»tÉ)¹éYúKHY¤í.üŒ³à¬«Jÿgš‰Ý'ÏŸ?ù3ÎÆA¡^&‹Åàç˜‘&   ,è.=¼3áö`¾w†lQ´#bb_ çœ!;äœ®¥¥EOõ[|èu9òÊ‰'&''ãÚVt‰Ä¸Og“yÑ’	²¥GŸ|òÉã?î~šÁáÒiN92òxx&0©L©–Ý›(ÁIÞ*i¬Ò‡ŽXôwzOœ:uµÊºïwÞ‰Â­ T«E‹¼Äïh/õXh!Ù›C…9W U×ˆ.$‡ü[-fk.ùR(YÇ#¤nR¾ˆj7¤„>‘¢Ò=+P†Pƒ4jz–òHU"Z@|£Yi$üzQé)m)®[±JGàÿ"¥A7üŸby’ÜySºP¶©M¤Ê0­ÇT8®º|÷¥*•»!c7ÙluuuGàoˆÿØ_?ÊbŠ®®®C]G”Ê#õ7ŠZR“–Ú×Z*¢Õ¥´ðÞÎëÖé¯-q~ƒ‚ wÈ
Ôfc¿÷ò^Kn×ôÛ‚ÀüRi(§E"ã$Y·%r©„Y	{ö}FMœãÄƒŠGî±±EÃ("X÷J¢_Ãú|^ôžÞüàâÅ8¬öˆÀž}e ‘#+ëDië.ÂöIe8XÂÌ…r›‘mFfàV\QÎd2â¦ö.¹ÝYp	²è¼©

=4øzŽº–ÆÆF=zêâÑ£FØ/ÈtªdŠ{zk½ MÜÈÈÄÈ˜+031:1æ¹&ñ2LveöæßŠt2¼¯Á,JÛ‰$íŒob*`§ÓxZ"+QTBÜÎñC5£É×s
•AÏ±Ã/îï|±cxÂ,(ÓÆ6ü„
“ªØ~lU%mŒJ¥ÑR¦Cõ Çx©PMÈ§ï£šøú±[»ÇÄOîþõwÍÚVuáÈƒñûO<î5]-èÂ•àÒ·X=öDwÃâë9Ó}ðÀÑ#D&uMkz]r÷TÓ¡Jš¸‡-Ü(Ù'r¬Ž¼U&µz«ÍS2‡BuRúŒ)°õ’kïÙ¨ãÁQ-d¨ç‘G}<»úöÑõgGkSºf1‹cÝß¤|ÞÈyôs6×´µÕèìÒB{ÓRGÁ‹u ÓRÅ2øƒ^ýÇhsLccŒD¨Y4Ÿ®~~(`Á`c~LFJ|†<H>QŒ1Nb†¯4È1ÔÀˆ¸ë¸@^Çi8X±8†ÀPûºHŒz\Ò·ØÖ:+M•„š¥i9¡~iš ´¼@‰Ý<"Òº{÷`%‹&(»ÎMOOÏÃ€çœžÁÓŒ™0ÜþŽj( –õà¬žÙtÈö4iÐþÊE”R;Š	å´–:@ïõºšæP\ëùÕZþb5qPÜ?Šô¯r­%ogiEš/d¿N";UÐÈÝ¿*äšÂ<ÌôÜ¢ïÑðÎ‹Ó1ÜJh››Ça·ÖŸOÙY9	T æÝ‡bt<¿nnâ íÄ1YË)¼hr3äºV¸„Ê_»rùò¹S'OŸ>qòòå‹—|¹©©æKÇ›»Ê•*%®D­:—Šåsp°.pw¹í éã±§ù"´C.÷ô´ËåšžvÏ=À®~_!•
 ·H¥À#Š›è¼qr±ƒTu» ¹ã„Êææf›Âãø¼
MÇÙýÛš÷tvvîiÞvèî‰¾24‰òïi2@ÖÒZµê‘q¹¬Š8Í©zÎûÃþpx‰3wœ:å(’žÙ¬7ª2+À¡§)£âŒíçôô2O’Óèg>YMf1í6ãqVx¹žúü»fÈ™nÓúŠ Òcˆ É-ŠU¹ÏÕ–W¢Ñå¥{û^+ó'Ê®]ÛÒUžãY
29µs(I8h™¼¨[“žmÝn<¹÷hÚ;::53¶ªDálÎ¸—ì&„7)y´¯¿qéêÕ·._¾zéâªª8!h”J;ƒ¢øôÓOoMÌJè±GkvJr/Z[L×l¡–‚»²–iIÍ~5·¢Æ³Ã*ùr0–¤–NgU5¿"¾—4<
úÐ7M¬@@è3æSËÑ94×ÎhFi¶ZMj¥Ünà5šJ”k,
úçCáåx‹.¾yµ«A"´…KàÖÓ´¿úá/¤©ê]'qË½v´ýÀiL+¾lƒ“BßVqå–‰MA%£á…hŠCa0Ñè<&E3ò²šú†Ú2-×_r² ¹¹“^a)f l›+ß Î2Âlö²÷íâò±HÈ‹YÞ‡wïŽN£ñÎñJjÑžèÒâÇ˜R4-ÿ£û÷ïs¸*“±«ó9HÇñZ‰§ÎnAéN.,'Å|î?_¬¸lêßÚå‹×¾ð›ññ+—.}ð‡øû—_;ƒWw¾ñºõøÅ3gŽwÔàÇ‡÷Š‹Ê¿%P£Q»:
ø£‹‹‘ådzqÉ^~êÔ©®}fûP^n•‡¦îþïÿý¿ÿÏ>àGÁÚ"®d
sê(~—gx8ˆ¾)ÑO
ìäz?ŽÕà‹ÅbøöÑû¼÷žÕ÷Þ{>¸$ôñ¦&æh7z?£TbWxã·­À,Ö%Q·l5:üfýZÍÓ
J¯šk>nµÁÞ³¾ç»Äg‚€a[­¼Å™œ€Øcˆã†xCì’8{(Îg3â’¹6ÖX`ÛÖ="¼po{â<êEŸoS•©ÊÀAH¸.‹ùÑaå´Ö¬î·xÑÿÂÉ8XÇb@|æLØM¥‚Ð!&Q2Ö]'Ožl«S*zk‹±dÏkÉÉ\:¤ö¼œP4Ý´aÙí„NHSÓ†5×ê’¦¡†bJ$ZAh
Ò’Ñª«.YFè&¤ß|÷xzÀÍÞüBƒ‚ ßâó¿rHÿ§¿ÏÂ¬Rù«J%ÑUkÚYK,*‡|ú‘¯TÁÛËàœí×æ¯µæ÷òö¾˜®< ¾ØG)•Ýð××
ð7úKN«FÉ÷wKÉB·!­$t\š²„ªŸ¡…˜I–ÿÔ£»;pGíûœ†»¤ #@C¿&sæ÷~û7/|˜‡_úP¾€	@×äÖ°ö
cdr>	¬bº5<qÅ}7µì@™PLî†Q³©ªÜ¢ŒåßoZ¼øÞ[gjà¼Àã¶îì¬®Årq•òFÉÊ'oÇœ—´UR¡~iª&´Fš2„Ú
Tâ
!º™ŽÜŒ,±ƒmÐ1,0ù3½Ýð]êÕÓì·”Ã]Åù
,‘ÜÚi©ë	ÕSžØ‘Ú×XÑwD‡…ëè…ë?9Ý(Î¹€ì’È¶IŒ
z¥¬èDÜ]z"2;SYi„oÏJ„C"Ÿ‘©¨o€cZÄ(q .0ÕFž.:ø†’uNÞ}”ÎÛd	5KS+¡riZ¶aÍµ„ÎJSÅ†íÆ	-_£Åž¡HKtEXí3%çâ„U>ËŽ#;¬A&^¥¶ˆ'jSY´Å\F-.ŠÙÕ9r˜J‚\n§ftÇÁŒÐ<ŠÜ F
á%œÓåh(X=KsãKóê%<L[R×'sõ@P•Íq*íjQ4ML6‹gi[4\Ö…&/ÌU–FCÌ‘ø¼KJ^9BË¤i¡2ijÞ°æ:Bg¤©rÃv„ZÖh±_@è¤¥9RÂ6I×KZQ ~£ñgøÖ¢KdLª~¥”1Eß,¼‘¨à¸hTü‚Df~¿¹¡ð?ãr=ë‚—F¯Iç¾Òo~¥ßÑ`É¹µ¦pn-}¾}Îù»þ„¦ð„”V(“>—È’|¬bÃLðÒËJd‚³k™`EI&X±6_aiê%è†Hx0$Çzþ`ƒlHŽoàs¡o¸7à‡ÝXÅÔólæ‘åé
4]m°ƒ"Ð%•ùž…@ÞäºUúFÚüO‘^@ú·K©>éU¤ÿ¶”Þ†)ÒßE:ø”¾…ôm¤mœ/Úl–-
)øÌ’ç^O0Sá‹¦þ_gÿØV‘íãs»ºdI–eKî-néÕ„	, °”]êR¶ðÞòz¾R»ÿ×{oßöÊ.?ØÂ–^–„¸ÅNâÞmÙ–,ëÊV/ÿÏHr7yeì+]ÍÜ©wÊ™s>çŒZ-qIB-qx‡Ò`F–µ©Hh1l®­­•Öe`™¹1°é¨Ê2a%QÖv³‰Î
º·kDQTë8Ng«ª%­¼n[]MM¥½Ðh4ŒZ#¦âÒmØ«V8È^YV1,ÇSipH6Kˆ,¤-yp$•J¤dMž˜Ž$’ŒÍÄlî£üÿ2B
ã¨XP|O€êñq€Bè*Í¦ÒŒ‹eÒ ôøÒfH±,ioO[£¦è
A`P|µESÔ VíÜY´¿EÅŠ¬FI¨­­Q|
J=òìFô0€Â?ìñ)«ŠešPˆ*xÊ"vžs¡xÚ¥º8À›¢ªpû÷»‹0mY*²
fcS@£NQä°tèDª¬ü<½à‚ñ‚<Û ªåvîœ{c‰®ÒÕ DkçFž£5âÂm|¬ƒ€k>=vsÔM6­®±¬ÆÓÍËýÂ@\DD‹P'¶ñƒ–šÓL„O½˜þ6BI²Ïë	ƒkõù)>p!µÈM:C(£ùrÕË9oÏÉ4¡¤A¯‡+,„„®°°¯§ç“·1jyªž:-3Pó/BoðüEwãW\y_†óx~þç‰ÇóìK/}û%òe™œö^´
4ÅS0àqòä©”ámR´ÎÍÆ
,m”"´¡ª[‚oqÁwß
¾l%÷Z8ü¾Åw¹·‚·`Œþßvò·ØÊcäOÉŸ2•/#ÓäÇÌ¡CÇ`ØnZx‘ý­“m…?‘ÿjUOìy¤¹'¤WÇ•©“!U¡€}­"8 =¨Î÷_5äiÓÑ°„Åõë×zGñ=Þ’"·”€Ó±8†N~ÝŸdòJËÊfgçÂÉl¹T§Ö­*.’äD.MÒ/ï11ÑèóÏ)‘¦ ñH¶ÂB›jF~¢;î}`fvQël8ÁËñ·¸
îpƒ“F*G}=5Js¤Þ©Y„ñƒÁ .^¢ª}½3Q—ã^P©#ÑµeÓJÖëM¼©V_¹Ò8:JG!¹ÍM.¼¬ýðÃ¦iH¢Æwì ÍÞi7t§_&+\é}ˆY¸3©æ'¦ü‹QN˜™[\IÇ¥7ª€yƒb
°o*£Ñ]¸šn|~¾¤8OÃEÂµµ…š5¹¸ô¾¸^¯7øŒû|¹Ñ”—+¯¾MþÇ9JUÌýƒÜ†Yó¶3ÿŸôÐ%0Âáž=M÷†qÀ³tÍ šômCLŽ´X:/}ÞÑÏ“ÑLŠ¸¹ýûIâå¼±Ñ	ð5ºtéä—NÕÚÆˆ#Ó¯ï8éæÎk(|yãxŸ¤=úˆ|vKûfÿaê_ÿµtƒÀ:?ð<4Å'eª’6¶ÿüi»Œº1þ_…ø[ÙåiÚì£þ-ûWæ4ÍÌéžé8/š¹cwÛ¥‹ÓäZ¦!CnŒŠYÓØ°ïps+¾t›ý8q‘? ßá^úJ#ÆËwdñøñãGoz.ùy™qè_Þ°Â±H,‡¢ûîò8V–Åýç[	Ã°+ÿ,ËÓÎ:a˜È¼æÆ}Q³Š˜ªîþ.™à9YÃñ‰$¹èÏÛŸçwU«"]Ø‚ê}€<î«. Ct1„ÊlFS}{ÁÔÉ“Sh‰>•$ëBâ$™‚6òAh#_À@¹ ÙÉÁS§^Ym)1ÓRKh©£ä¯å³+sãøÛc¾Ï,…«bÒ™ôüÉ'1rAfé´›J‰äëÇ6åª/öŠ½š£³sKQîçŸ?Ùd'ò–[:I¹ÌiFÞÅ„ædiÛnŒèCµ¯¬¥eÕXksNÕV0Ê¿·¸@>"]ìE	ªÓç÷=¥PuÝS.ö9%¯[¨’,nƒ­ˆA^×c•IÆPÄ/ŒŸâ¨£e{ˆSˆÁ¥ÃXŽÅ²º÷BË1ßËäK.žEÆÐ	Ó6,'ÒÔð[Èžœ:Kó'4-Þj~Ù
—kzZöIÖO.º%‘–Šúv§åGÞ¤ÞÖ¶¢Îóø‘]­±Š¶HX¦ü¡XÚ­Â
]ªÝX¢—•À©®ŸU'UxšzÎ|•[5‹»×É®h#íEnÔÊ©cü{ßÿ‚_“Ïn™#©;=³¿´×}AÎ¿†x_œóÂàBÎüGýR|˜³}JH¥Â5TÎÕ!*Ó`îÙ*sÇX4:vÇk5„­ÕVMoïwÄû Eé‹¢;G¶Î{£Å–ÂÖ/Æ›	ƒ‹R:»¶MMµŽ
L=;Á@§?ìØWÛP×n%
¶,])†‹^}µhÿþ(g}då¢Torö³×^{
šæDÞ»wvöeÜ0íYž§N!•9«þ©¡a{AÚ?‘1f1áOÛìCƒ“þ>"#ˆQ³
n3 
%Ô*CÎìÛÈÜ\Tæ““w¥6ãÚüšCÍç/‡ò²óù¡Ëç›ÖäóÔTãJ:±¥¥ëY£ùûQàF”¹I§sÒ½¡tqŽ½pq4Ðƒ¾Õ'£Ÿ]`ØX`äúð8$C%%,-9:77‚òô²V#J,ÁÍe,@p(J'.*Ï>±¿€É ˆ™‚ýO<«Å‚òŒ)Žò‚]Û¶í"
H‹”g~ÖhÄõ¥¥Ør:(J·n÷f>œ.»Ÿ~—î§·\·VâìËQÔN®¿Ÿ{÷üÅ¶öËï½úê«è
×.öá» »‚ïb‘’y•`7£·È’¥ö/ê-â+NþèQþÌÍ·ÜrSóNì(`Ño0’wSØu†TË²pîÜÒd áb4ù²t½íwÞ9ßÝû
Éè”c^y°ŒÚ3óZFrÉåà ô>v¾í_Û>ù¼ý“sßýÜg}°]ðÞþå¯þê_~ôªLÉ]Æm`ìtÐ¯¡F:HQ!ÒZ†à¢÷p›?vªe55Ûï<óì‹/>{æÎ=¦TjÏSÇÈ_¿`î|Bªû&G5ÆVŸ:@æÎ›³"ö3Ø~ùÝ˜qrðóÏñûÂë¯¿~a´£sa«Q$ó&­ZÃ¹UãPY,Q…©Öâøøž}žôõÍ$	]Xã;îýú×¿~ïº#Îª+ò¾`Äu«ŠñÚ»fÙ­Åã9ÜtEð]¼Ë?þà'{oþìòå^LqW>þøúŽèËÃ'³xGg¹T4Žq”R¦uÑMw?Sgðªïß·oÞU]UYÙÒG}426ÓFß$ˆÌ-M.Ä]</‰<+Ã
FÆkûär»{u/tpeÎ£sËÖ³íˆ¬²Z¿`Ò3ÆvìPz°võ	åÃwìÿèßþíß>'œÌ¨Õ®-'ÜLÞ÷ä¬pTëÔú+W¯t
¤Å©è\o×§œAÛÝ­å>ü+(á¨~›òÁ…Ò²$åWÂåK2›§FRššè•Ùr×–ìO'nò/ä•üJÁ]÷ÞuøpSýö§Økºo}K'>ú”¾ä¾Y þÂ/ˆXÄñÜø%Yzóíspo¿)³—b1j¥¯^tÛ˜-íK(í¯Bšÿ3Û=ChÁ©‰‰ñ	o\#*ƒÃ£à€öõ
¯5ê³m£Yš¹¹Äò„ê-ù¶B‡³´¬¢²ÊënþÏ¬ýlw9*FË†|SóÑ‚âX¡½zç¡æ›÷o6´m£½Ýá,ÚÖ„k÷®YÏÜôÔµ« œÚÚ¹þQ–ÓP7A›}Gž}‹¡4´ÚCè¡í/wñÇm5‰?8%4=ðÄÏ|åË_AÛ>‹ðßéó»xäõÎù5ŸÝHM×ö×Ývƒ½àßÉG¾vŒt‘.ákÿ…=!ðºÛ¶ýMn÷”Ã>\øÓ?½°nGòòŸ‘mò€Ù¶qgÂœ&”˜D*²‚§’©|Z¾Mê>”[×Z¨Ë<ñD`“•ºc45÷ZCuæî~:wkyî.„qF*Ø×Ç®Õ§}šêÁìgÎØWuá_Dó¾ùæ²:üê¾©‘Ö]¨ë4ò¯Êîµ*ùäØ1òyM8öªù? e?»F;On–pvüíßv|ý²{"Ûé}ôQïÚ‡iF[Û+È~\„°@ÁŸeËA™Ÿ½ñº¹êï¥þ7¯§š,ŸQOò°ž’Œl£,ƒé)°1[¯^6¿c>4ƒÁNÇº#ôá­—.Ày¾`á*€y^dŒã•aœnzê)[ƒP5p£ku¯ËîÕšé¾¥ßŠ_sr¹ÆÏåðñ{¼³ó	EÊQ\/^ú¬óÝÎ_m»2é÷882ãk€ýÕÄü“WŠê™
PUn!ß,‘…¹yÿ/«öü‚éÏ¯õ)­h!ÙØÖÙ«dg5f¯~töh|žyLSKKŠÏãijª)k¨?t¸º¤°¨¤ñLûÇv”é}ÈmN]D·~OŸÞ]Jn‹DWè0ŠÐùÖ<ƒ!¥øg—DIR©áT<ËÈÆ›-|h åó–F|²µ»%·CµZÇ,ÇÓFg–›Û"Áìö@{€Ò…WÚ•qHv4i—N¦™/¡)llôùH¥Ç´÷Ä‰?ýô£øÚ“çQ0T™GaÂ¸	kyD‹Ý)Õ$4IZƒŠM0\Â•w°¦P“!šÓcS›Íkx!æ2BTrÏ!gÙÆÆ’VÏô¾ÂòÇ
|ˆj£tW$£Yù‘u•¿½‘Ÿèi<e³-XÚ™D8Ô{çaXÝÀp‰a<Ô­™âËHc‰,n÷”ïŸ0ñâyZ€lœCˆs8kÁ`*%«z{ÆŽÏ/}ÞO¹ˆ²
-dêë5’>™ÃXWÎªI<´~„wwÓ«µ8Š•kvöñÇýþ½§NÜC‡xk¾ä‡øŒâê ½S}þù­;°R²¬Ì9B¯3¢Ÿöß;6p[ðC»"¥±eDÌ&9Žuå‰óëž(ÍíœTu£?eÇ¾ÿý±W¦Ÿçþ°»ûñ-¾Êþt´Žü1øŽ£wýjúÀ	òñw ÷džyæ8ÄÝñé_½kUŠÄÈ|³,ôr¯Z{˜Àäm.öyÁtŸë…›Ão´çüÏ3?zFæ.|úégøê?¼¥g‰8«é„¾´¤ØçqU$…y”Kc:æ^i€%ï›ší©QÐäWgãñÙë¸Ž›wí¥Æ¾¬Pñr¨Õ°å­`‚È-5ÆÒÒm +ªìšx"©7U"ƒ‰7²T*q¬ ¹Ç®Zi¤H-@Dù”Êû”¢pe˜s$Ï·jŠQw#…l£êX$iM»uƒ]«ñ¬ü»f[Ù0q5,/·Fë;ÿàS½pù² ?ÿäXƒ€¿+=Ëy|ÐÃ=‹{öòÌJ³s´¹7Ê…âˆGSÇstÜ¬¬ƒ•ü#´ÛTÂ[oùýW®ôzò^–8íæãüËytõÏÏWTüèGõ»vÕVxˆF¡›và ÍîóÏ9þe²ÞNð“@#m¥ËùttÓ†:ï&OËäéVƒçž¢©»ïrRå>Šù9i«ßÀõ›­+˜BÊÉY©…vëPÜ3îfgmkø2ynéÜ9Z+jQÉª)²qž_'$ÓšetÎYáJ
CÖöqsÄ²é¬3“y³Æ6¦3AÓ¹eóÊ9Gýï‡ÿ––¸ºµÃl#2à•›îib?×lNù:MáÌæµ—ÍÊK¶ÌiÌÙ#+WT“QYÈè!ŒûX:U,R›yšžMÆt2IÍåñG€Ð^œ&… >ÉôÅ‹¯¨*,?Låñ§n#gÉŸeþÎšŸ:~ÆÇM·Þ	å¬;oµó›vŒäVÙ‹&}žÉd‚(Åv
˜€…»wËL2¹iwÞNkôâr¶çèX»Y%D¼³¡,ohÖÏ™©­S3ÍñC”Æ ï_ ¿1bÒKÉà|‰w|_¥
‹ÈóÏGÈ½²ÕTfQeÔÐ5šíûÀ°½iw“F³F~nYÇs¤ÝFø8*“¤ÛÅvƒ š<ãùI&‹ûHˆI‘	â¢·a¬•­ã9
íC‚þªu½¤»uM¢ÌCž£äeÖó¼„/Æþs¢†@­
CbU“r/%úñÇQªñÑt®ê­g1éj€ë»ô›ò+×¸£ä³{×&ÏÚ›šŽ’ßÓIf3Á§¼"3’u<JZ×q6DºÝ´š‡y&‰JæÊÕ˜“‹å£LCY'„(Îh¿éLq¡ÑDÒ¥ê™Kè+** ºÌÇ¨Ø‹uio…Çl±_÷ÐCàsÒY²
-—r©vÚ¹ylæZáÞDe+ã`¨l™dÌ[äD9’Mþ:¿nËaŒNm_œ/Z<+Ó1³ºYÚ’ÞÏ	¡Úá¦%iºýƒö®C#	…À{ï™ÓÓ¼I¡'öL>ð@é.ðÞw•NzAEyÕ< I£¥hØ­r]7bÉ¬œ¨_’IbyÄ*Ë®©æ<ÂrÊ”'´w¬C>8¡ºZð
ùdc¨b}±ŠÑ	òñÐÎšš§¦ãÚ›o¾ymñÈ‘Eb—­VÖ‚éØªxÇå,—w-ËÃeY½‹™çW	xú‰ÉÖÌÍÛóT…%¶Ú‡g½ƒc²IÒSUŠ$_ŠLÃåËÊï;31£Ëiehg&Îœ> ¦Ca!EŠØ—4ÈââÄŠI‡j«U%sŠÝ®äÊyóJyÈJI2å”'Â]l0LàòE.2ÆZt±¥1¤7—»ü
Z cHyú«‡+%œ!U6õieÉP¹ëpzîØUÙTYÙ”)Êj­FŠ/¢O,.’íåQ6Êv»i»Ý¼y†ÖgQ)#lëýä÷[ú7/¯GQç3e´Êt…[¯IdÚ¿ïéºÖõÖßêñz{Þø§zâðYÛ"ºƒÛ¬U¤zÈÓ|è`CÃÁ¯ÜŠ<ÿ²ð•£¥¥GíVò·øû5Òb£ËåŠFY}Z”k/!„Z‹e6û2x–ÕsÖÌO?Xkà³À8‰µ
±††¹nb÷C­Ä¸íÌ™éé]·{Æ§§·xæ™gNlÃ¶UL'c¼†Ò‚óó²:VY°'¦/+s“ÎÖ}È«[äÎ¯/§Sš :µš¸©~Á€†jÞ/e÷õÌºHÂ%ŠC¢¬Æ¹gš˜LdÉ•5Æ_KÕmOAe%«n+î£ê¶!0Žð~û´!ª”‹â™õúd{åÄ'†ÁYüøÊ°¬>zôèÍ÷ÎÍíµ¸8½>‘pgiäÜCá’Å¶«!]ÊllF\|~cOÏE¹°ýÈµ
£Õ¦n¿žÎU:Z=55ŒXIOŠc\:ŒTÒ;u@®¸WmŽÞOù|Ñ8Û?61Þ_Th%þ!˜ÍfcÚ+W´ìGýGÿG,ÛßOíc‰~œ?à´pZðamlä8zÉLc£›o
õ‘—‰«äÁTÓž}ÛkËÊkJw¥¾üåTúØÑ”åÁ‡¬éLŠ$Î…áæÀ(œW–à”y™‡emW×Ü½4š®®\YŸ^¶¬0ôÉ§W‡æCÉt'¶D‰ùÁ+Ÿ|Ô9…¨ny

“`ëMú2:˜Uö©)×çW‚¡ðÜ°¥¶¢Äi/ÈÏË«:ÀüÑzE°ýØYÙhÓhÙ°gÈÇÛJí5Çîzèñç¾|Cí°;ä³ÕQV¼mçž7½……®‡bb¸ÿzG§™ÜHml•ŸWA×öÂ¤VZïí½Ús­çc‰ršØóN“‹o„«n5¥¿q3§©=kØO=û@ìÑ]ð×¤Žª¶w­áèQ\¨î“?üÃOn¸Ëú»[‰‹,àÏõ_ÚnÍËBlË-×ÊÎ…Ò`y‘>Š¬ÛI|N_Ñ1òò¦hãŽ‚y€€üXI{u_AhšE¥Yj	ŽÎ_ª±ïgiô´b.^'÷½o<K§R1Éu”zAÎ
¿€6†È)³•Îè|ìf¦¦ZuhZÓoý’(þÒ/‰YÝ€¯Ð<Øºî
©ýýýþõ)d¦ådLìZŸ”ª´ttt5¹U®`=m§¹7Þ˜[‡×?'»×ö‰õq—Þº¸OI
m-²
ß_á	6Sžàè÷¾7úEtðë²{BØ©ùµ_Ó|1ü¤Ì0ÌÄ[É!wß˜'xcû ›ô<±‡ÍA3uD¸µŒä™˜+Y‹qlƒVìúexè­1kUÕÊ±Ö­W­ºÿ+{'Z¾õ¶fé©nãŸrôD7ÒÐªŸ~šì}A$/Èn0Õ[×Û<gv×›ÑÄ‰àüÌ0PòŸýàßûúæç#Ô†>¬âOuS)Æøü<ƒ)Aºxñýv…F’†(íï£š.wOG‰!#º0èt÷åÖº€†ØE…@¥;¨Œ¢¦â¦›Tªè Î¤mçé'žxâÞ=ÕÕ$¤S'šw4í,ä]’P¸³iGó‰S²éÔÝÍ62õ)=ÇkŠØšï^F?Ü”³?Y²Ôa¬W[à¸ÐüH8‰ƒý\ÿç\F®’†¤+Qˆ¹Ë…f–ùø,VZzµvOcuymÉáƒ{vìÚu‘ÉYò{äOÈŸ©~é×~ã7~ë·{_åQò7ì/‹èènY“æÔÚ„á‡ï@šæÒAÃðîÛ‚f'é	¶uƒæØRÖ¬q7ôÃú¥ÎNIèèÈhœù‡ŒÆÞ«X¼e|AºVe(6×	àô‰ÉÉúúªâjsõH•ÇÖ"äï
5CCÍÅÜòòy–²›£v¤Ì…¶ü"|±àÂè(KâAïê×;‡Ñ’ÅQÜŽãé3Ö»1áÓœÈ%#Bkq\ÁJ±sg¥Ž0ÑyŸ¯¸Øiá“}ØôŒ¸ÖÝIð…¢S«ß5Jj{p‘×í-Ù¯M$´…;p»£PËÍÍfmŠh¡2Æ’Z"Ñ¨O¤Ò®â„ÿ£Ïh[ŒÌDµØSS5v¢+Ø†¥nß“´æ]§;ý¥í}K³ãTënv!¦ÅJ[Èô¼î)jkß'¾›9¹A_~V­Ï{¡ŽRI˜ÆV¾\š]å`¡#
•„eM°©¿l‰¬•òÓ§öZˆ÷st«Ï½Ä²wù+;ap¢Ã&(EÒétO™Š55!¸Ø+:1‘HIV§“Îªß’ÅüG°$&‚9™Ä­Ëvø5FuLS†gNùº;T)Áj‘×ã½öé'‹‹Ó¢g óÚd„¥ÖP‹´•&f9Â©Ø) 4Ë“iÿ@_^†’àÉç"‹œ¥œîo>ñ¥¯þÆo9’$‡dcAS­ÓafJtµAÓ¥I†¡:‘$ª}§Nm8i¢É ×ttù9¸%êD °@ÚÄ¦Æ‡lEyl°ŠÉ¡!åÓ'9’€mºxxqh?#XË(r–×;PÖrkžÆ¥áÔbšgÁkaÙÖ¦<
<^§ÂÐóéÊ,–2À	¦¤ùÁ/ûæÕ%Í°Å÷¥ûï?Ã'Ô‘ãH:¯¾þ&*ðµ¦'1Í ÷†GèI}çû‡ü.M|1Š„”†E®VÂàÊ¬½LV£rhÊ'§'—ªüQ2œOî&*oôÓGïÔûð]ªÑm¤~”üŸz²ç!j5Ý³Iº7¥”¾+*ÁçëºØÕ>9ð£‚09N‚r‹1
Ž£æ’G•¡M&YXÄÀT
.ƒÆ¬TÅ¢_{îh•Û.¡fÏé‡”Ðý÷ßyæþ‡î;óå‡xà;÷W‘»Ž”_°µ®3ÐÃ{''eÝ¹sf“DGŸÞxˆ–ÚºàÃ~Ïle™žíì¸ÞëYZ
PZÈÇÑyñÀ Õ}r$DA8•H»Ìœ ¦‡žñW¯ÎÆà)†‘õ—¦Rfp·*òÄÐ =D…¬u:šî¸maA,Â¹£gÎÜrøèmlÙQÁâm¥
êN>öØc_ÚYLnFÒº|³ÖeŒ
µAÍ}Îjå ¼NÄ²þˆ#6äÒeljqo8]¨¨š¢ÓÓÑ‰‰"9Ãýûev÷q	§]þI4êpÜD% V™‹_>wNfß_ž CÇ…¶_D3ØËÊ¬øâÓ©$E	z'ñJ¤¬è¾ú”­àIpŸ—šÃý|ŠöX-ˆo"0’%/Þ¥åÕ€ÉKŒ@@•Ë—<15¿ê˜]:­+F“ëÒ~¿û@1Æ‘,Zuî»ç…oûÛOùËÏ¼ôÒKÏÝ½¯.ßƒ/¼ðÂé}NLìÅûî~î¹çîÙG¾S‰$¨ìT„!<ëÒ²<ab©4Ç$až¾àÎ 1ÎqàÎ;’“`ctL&
r-öUÂàÂ¸4;£SqÑÞØPY™—µ
(¦b¸¨¨)ÅR"ÅC™×ž¦¯Ý
ÌS¤¤ÐTY¤Óé4<P‘.Vc1ÊÆk¡”¶*{`æÒøµkî&›”~ôácïœg:GPÓ”¶pÔ«w6Z‚xïÆŠ}ÔöçýjÉmH\]S·½BÛÛå–=ŸˆÄ‘xl|J6îª1¤º±ú]™Oh«vír¯·ŠK$jLœ0gÉØÇ›yý»
j#´U›
ólÆgÃ¦·
ÓeÃæ·
ÓgÃ¦¶
ãnŸ*¦Ü ÞÄ7M)–$ù›ÃœÙ°Èú0a5M×C6É°³éñû¢6Iß8Å/híVaÜ†šÝ(ÅÛrûÁj]_Ÿî¿°ÒãÔññ/Xî«CŽ–ÿÂ’¯¦bsr£e?Ë™*ËòÂ5êŒ|”¡Ÿê·¹Ð¬wnîÃð{âEB×ÿ˜‹†3Ùp{E‰3ÔÀ/- ZÀ•©+ŸC'<÷Y6oUò¾â_ÿë[økàoÚÂ_íþùðnáOó·ð×Ãß°…¿ùÊ©ƒxëthy6r	¹²ÀÞý
7Â”¦Ü9ªH•ÛcñÿÁ w%¿Ì§;)•_ÞbÆÉBó)ÚÚÂÍ3ÄP½Q!¶Mq}Œ$Wâ„ÛJ_îN„–4)dßqÿœÈ­UªÉöM¡A¦‡\E¨Gi'ƒ›Bf–Ì!TP´¤pSèPCÚšN*D»)´DÃP_¾¾^e“>B„îS›÷¯ý+š7H'ç—/ŸÝðk‹8c_€ƒ)ø¢´ü
­KÙ¹e>ÇsÔ;“L»œéd"Åv=OH`Ð©ÆæºD f„l$BÅï2IŸ%i7Æ±EâhPÆÆ`BK&¯èÝŒNp
:ƒ© V˜Ô4)ï´8C>˜¢v í=›EËÁÕõzŒ6h·%b±ÜkèÅ2B\ÂR$îï§- ”WH’Ä¾"
$c€HI‡Q°Ó¿k#{„ö5ÃqFÐ
y$46‚é@V¡L*¥\½þ²6îõùcÄü£áI0ç™uØwµÊEét«+§²8JF-QÓ(v‡£¼¦"?Ÿ¶•Óëtj¢¬J"™p©“ñdšÅó6[v~o'@ç©üáÑ 1‚LÕA ÜèhaÜ$íb#á˜‹aX¼
Ø¶(´mTo0¦4f”K×*¤	(§¤ŒmE+£æäm‡YËQúF-IjådU¦ÂÂTŠUQN½š~š
tŠo)bxQ¤M£†oT@*¶ˆB/ ¥ìR1$0ÏAóé‹(svvqdv„ý¸_e	’E9µHTƒ³}Ñ@t0=¦
ç}˜ŒèÉÊŽ)kÍ)É‘¡™(=(.º02œL†B#×¯ÌÀö6HÏù@•AÔQß%b@Ð¸90µæ\<ÃìBˆJ.uØjè[NmÈ+H‘ÒR{±Ýn5[ÑóÔjR šœ—$#*gÓÔšM<.kggÍ:‰:QÈ!îÏq¥Ap™UÂ’tI¡†Ä|c!ìk]z†èè;áC`ô† .aÐØ„ui„5à
#^—J¢ÀÚÑÑÀKKB££nF-¸ª%½Î\h	Åñœ%ùF³5s‚ƒÄhò‡ECòsŠ/¼K‰EAÂØØŠq£µiÉR¦ÇcÍt¯bó	!¬µ¬F–B!ì6­¼ã,-•“õåfÉçf%‡ã,
ÌÎÊ¬7®Z£³úCßRiÔ.Åv±áPÄeg2]0|,ÒJæÞ@zªœï,)JÐ¤$1I˜j[ ½ ÅRŽù%"™Ps“D––ÜDr±‚Nåª
ùÝV“
Ÿ´Ò£2XQç|ƒ
÷’!÷Vê*jGŸ¤9Žu©XŽyžRò6‹AÄ€
9éˆâCSø”H:½jãûtÁ°cÓ)Á\ê(Ò Ï?walZú:R‹¨Ç"jž¤Ñ©øR«óI¹0üÏjG	}N“ym>É•:,zvQYL‹ã*z3Zµ@G½ÖJK?j4r1™¥X+š”G’,‹—†”V^ÚÊ,Ú<Ý*çÁRÕ¶mä¶cI’<æVÏÌ¤Á-ðYFã‡ä§ä§üÞóØ‹®p”i<U61ðn2QhdCD‘>'<"í=OþçñVWú,bà2×A:dö„r ZúÙpK‘@„Qìè˜Áø’ùŽŽXi©[Ð(Ê‰ûdr ^·ÞÊ'ÐZtnïÂ0·º¹…:ZÁÏ^6'1àuëÙìäã5kšánçårçQòç-TáûåõÖ2cŸMe=!|3^s|jÚ+sÞ©/3­yþYìêa¤úî“·.¢¸
JË•W;²ä(¬(¯®¾õÖÖ
ö£{:Û‘&E~ÇBø¦©¶p	¶»\k!› $oçÙ¼[OÞD‘ô¬©Òdùþá¡ijÐr²¸Ÿ¼ûn®.wäæÄJ6‰}¿(Š‹×ÎÆ1áÙ‰Ñ«Øøut\l»t‰eq¼@?±Ú<[%¨ã.±¢ãô¶‚b‡9Ï@%å­•Ð„îƒˆ<b>ð•'±‰æÍõG ï»íöÛ`
xÌ{Ë-^ðÃ
ûö7Vä‹1Š$I3Œ[—LÄB1FÔ;kkQåõ˜Ûv
zawoÖI‘Ñþ Ué+&}9ÚÚYÆà"*‰¡* èÆRˆ»úá¿]¸ú=ÉÐûá‡½EEËÚµCXZ©:øà®ª;¤Ë’’‰> ËqQi¹ƒãëƒs7Ôs"ÊyÐ¥5‘áˆ&ÌÏO™êMnËd·¢tOš"Ãš¢D¢H31Ap”ì½fÉ««Ôá<ËµÞàèùQ÷:k¢N¼ÛÍ]û›×†ÈßË¿§^È3*Î#7•€~ü½ìs%9Ù’Á3	Â«×kÅ÷YwÆn…›óùòóÝäÀ1òÈgÌWKŽ‘ï“ÿÃÚ”'`ˆˆ±Cöô¯äŸ2'à¼%»aÑæÂ7·{÷Èˆ{ã4í´-_Ÿû5QñÊúpÁb#cŸ›yì«äärx>ÚºáXÊ-*pÜPû`75p9 ë%RA
lÖ€ÖÕ&Le; ?Ù^fÂPÜ4âŒé3#Ñ€‘xuãHd£¤M&ŒD1@žë	ªe©%òºè ÜýÁp\¦pädCPˆ¹ÁØÑÕZä8nqfˆžÄ1ƒhüÌ¼wjë¾‰ÉÉ—*0Ea¾ýSVG4¤€«›|÷Ý}×©˜3“ÒÐ“…gÀkµ¦"§lvªY¶¦fsýšË²¹¡’Ã\drçózº:0ñ$lh°}‘ëÊcÊÎb+cuæ[ìS»×D§îºû>dB(¡h,›u¶(€Ð—N…§'ä¼‰©…¥P¿0Ò…Õ9²Àó¹öû2aÈ#´}êù”$ð<˜¾rásŒn¯w¬£ûBW÷•¶6¢ Êt¦ÖÓt”«Ó1NÐiœTíŒM¼Ë
+áZcq¡Õh±ÕöiŸ›¼zµ'î8øø“J0®/Ùv £ýÄÝ÷Áßˆ¤ÖQzzÈºqßÎú
+B!'Ò&[*ÅUFsù†æ[}»+3 I»·ž 6´»eô0Ò»&žjyÕáÆÙAa%%ÊÂˆÁ<1„'òŽ­îÿ?ÑÂìÌ<ÑÂ¼IV{ßáŒ¶BG['ä]Ã³ÜÚ;ë.µuüøgm~º@ƒ»LÆÒÅ‹+î³O}­N¬‘4F›CYb5æ¢r¸p¸Â®!V¹h¨ïzïàÜXQiUUUYaY%¾JK¦‡†ÜkqØ¤Žç'£?ñ``T‘ï¨Å{÷“w{÷cÄØw²e5­œyë|óÍN:c0ÕYëgŸùêWŸÁÃn&&æZÿ¾ÍZcUp"F0'Ò;6¹~}ô:ÜÐÄÄ¾èvD&–¤YµÉVä˜öx•(Õ±fw6éd]2Î0î±ÔÝÅ²îZ•wnz’…izçU9n‡ÛUQ±‹~p8ŠH±\íóàH.Ž9ª X3¨ù·Þ|ûB8cc¬(í¿åÈp\×—‚\.¦Vd~Œö^ë¹Þ×w½‡ÞõŽŽ£¼Z¶«{‰eŒñ¤ÌêšvºòXŽD©íOG‘Í¤fÓ„–—e§®Áyãq/ýžÙ”¿ë(Üþº††ºýônW>—)ï‘#·ì—D¥‡/¼ýæ[(¯ie@åtŽ.¡.|åÝ
ëÊ¿Úýêë-ÌvLUcwéî{[˜×OËë¨™å'¸ïs¯3]ÛMe_dïeN¿î"kS$Gôô7¾+)ƒ÷|ížAXúî¦gèCÙg”gîyfõMYöŽNù,75ãÂ<Ïèt	Êßý¢'<Ìê´Ì+öMæ¯pvg3ábyŠ·…KoýÈŒ~/ñ.þ¼œäLŸ­ÍJþ(W§8N>!}ä
³Àû£ºM…X.ª½B~E¦!YZÃ–£#Õ·ÐÑu¥}žÎ*Q™/·N
$Üj¬d¢É$*$"µ¨³]‰eÎÄB_koŸ@,n`ÊZ.3QÕá‹³ég_!ëkv†ÓÆE0ª5„SæbàÞF7`D"Êg)x+`¡èmB_:ÑÆ<@TH„iBD¯(4ŠF£HJ Õ…(XcsL‰eS"¦†ÆDi£Ñ.ðöLL0:B:Ä\O¥(5†Oªu½ÎVx©L
Ý€Ó¶à’ÉšsSçÚéÕŽßfæ‡«l•Ê‰ÕT~è^m—×äÂî#hW6¸e”Ž¼·£©Î¼õ>ª³ô<:Ä§Ë\bG¡oä¸O®]û„Ë}áI`gqµ2>z+ù€tãïÕ£Áà#/¾øH¦G<ö³¸Z7Ì 6Ž³a*@"-Œmî¢÷|ë[ß"ã·ÝóÊ†§×gÙŠÉùáo}ëaO»hÚë%^Z†éìR>øã?þ‡÷ÈŸÈD+3‹Ìj@	j¥¢"h„ÐÖò‘Äe†î»c+:ó&ŠÎ'+ƒŽéŒvA[ÁB$¯<H¬ÎbÝG²(ÅBa~I ·"6‡r&¨NæÈ‚ õbj}ÙŒ_~lâÒ„ä(ŸpË¸pë.ôŒö÷wvNNo£ %7ÖyÞÝ¶í]ðZEP÷Þ£\"tœðCƒÞEã¿ÿ{÷2W
!Ûx…B'FGñ­(<etðÔ “40 ­žë:"C:,±±ÜÒâ¬3õ/R;º/ºUCA‰ñŠÕpÛ˜–Ú•}  ²¯à{·vLå÷û%¬3ÔïÝ[¯Ç]ùéÓåä ’“«Öð‰`‚D]ªãµ6éãÇÝ*[rŽ*¼¬Œ%[nO+q„{ÿ÷¥UÌlŸffè––P
¾îöÛ÷å¶´ÿóX+ûuæúuYÈÆt«iŒl\ÄË@‹¡DÁÜ~ûšýz
ÉàÈHÞ‰ã)&u<‘»zäÈUÂÈ-5IV·á •qL–žQ½Í¼}ûíd¬†Q¥¨CA²û«çÑ~½Œ”—–]¡iMk³pYÇ—Åˆ˜ÞÖ`õö\g8]ùöíåºŽ´˜ŒI¦Ø½Ä²x:žJªª©é
iŠŠ5¡ÑnS, Ñ‹ÔÖ 0¹\xºicð{mV,/|ÁcÂ3O,Uõ6%jvV:Í €´ZàLZ½ÊbOÇÒŒšÉÏK$ŒÆ”Ï—2‰ÙnŽÎ{b2ÇR¢.$˜(.|¬ÖõWêš­.»u]9ƒ‡®ö€’Üº®¢™'KóóKroÞº®ÕUT¥Õ´J­QÛùDL}Ãz!Œ–lI¼Q-³ýø†üo*)›ÅSò˜4¶6ZkE]CM]E¥U©yòmNS\YÛ o£/¼¢vû®]»œð^à0Æçƒ&ÆX@~æó$:*j!Mt²^uu‰6í*Œâ0ªŠkvÙ aØTn¼½ÇU£­”€³õúQ+p½%E¥vlÕtõè˜7”6SjbÒÆØ-M»«¬Åšú½Íw?ðàñ]
ÅN{Ùž];·Á5îØÑTo·j¾©¹yïÎmNÌùe;ŽÞ£cgî<Ötø¤©^¼5å{ï òöÇŽÂ  ¤oµ¨Ü…‚ÖX`cVoÍ“€Ä[åEüLE$¹¶¸dÿvÀRª¥Év€˜¯‘âm»`¯bodw)ð†ý ÎŒD%¨ìdg±_$9K9H!°ŽBZ/45pP¬öË)FsýJÏ@—1ŠD~ytÂv,ÆCÑaOvm–ª½ªÒ	¢b
lZ—Ž£T¥íºöæ;íþVPƒlë˜Õ—«S@ì$µ_Ri3¥§Ü:#„(7²¬:ùµä» ¤Ó¿?%Âihºü~ü1¼ÿÞY²«±zwa`öÀ€œÙ×~èÞùÒWGxáq¬oAË€I%271±àÒ-M
Œú¿Ã$¨!üg<‹²íÌ­ûÛ&Å’ƒgÎèÂcW)hîBß¬Pä^ápPJ£Uhm}ýõžŒ:ý	™8{¨·ß“šš±ï|ÜbÝÿ,ë.þ9âüâÜ²ˆ~xéòÄ|²ººÚŸOëðÖì
v|ÆóSý}m8èéÁ>éêô<¬DÌÏw~ÐO`^@”|UŒÂ ½óT³rY½xCãÑ”¤3éÓI"ª’1Á(1®¢DœpVÀnª-jfÑ%8=“NÅ™ŒZ×L\ÔÀú†:2?6ã¾Å…ùþ¯ªTc9è˜ƒ¤À˜º>‚_mÍñzx>`jØçÃ<væH]íÍ æ<òÕGà>Q/€gU5{üñÇâÄ‘ë’i^´2SŒs'ÂŠ/@T)…eºÒ?ôzG0„®yüX4´A` 6¯Á¢çemiçÇ–o>*•f±¡b–z±Œ;‰iêÉª™¬ÃX¦^NÆP³¯Æì¿ÜÏ$£ápM•édU5áp”a[
/õˆ¼«Iÿ%Â½½¾^wõª'¸KÉ•,+° …Ì„´F¿yÕ±
Ü ¢R"‰DD	…?½0®0Î¦&'£Œÿìã¥PxI™h)gŸÛŒL*´ Ô$È¤‰ˆ¶=¯ÐbµÀ†/ÉÎ¼_ËZr)+e‰r§y°ÙÕ	Ž]Ñg/E§Îs?î÷xü¢„·¶æ{
xqÑ+ò0+OÒ“¾´huXÅˆOfÓéà•ÄNCSÅç#Nè`Ã&Ù5âhEYv–AßÄPDd"‰`k	Ö×¿¨"ZãŸtX1_Ì†Ã´›6™b¦äü¤J•«ÅÓTëf«ZÀÝ¨‚ÈQð?§¤_/Ì	káÖ#·5u(°­«·R|ÛjñÃ±°²…1(ŸÚ7é6¯”<Ëz½Í»Â‚hÔ`
ÌKKfŽ~Ó‹Då? ÿ{…~½~t4ö_
‡/Áõ‰bŸÇjõÿ=B–õÆv–eÔÆXŽklŒq±¶Ÿ
Ì³C×®
]0îuŠIÑy³É^^Wç´›ˆÑ@ØµŽ3€8VÁ¶§–Ñ”Tè:§"Cdª“øGFüòVšEy«ü¢'1uü?¹•M=‰9î÷7žÆ-ð==<é¥ÖˆÏœ#ûåW6ðkixöðké3¹ç~o“e>¼ ^?4ÍÏ"&|÷¡Æ1½‹ùˆlÐ_¶uFŸÄ³2Âº‘ˆÝ‡öÌ4ŽåËü	YŽóðò9­	58ê„Œ6{Æüü[ãÞ‹ ~¸ äz¿/ÄK-`S‘™ÞÏÞ~ã7Þþ¬w&!.¹à&·Qéƒ¬íèíí‡1¾ÞÞŽwCy0³å5
ûÀ³Ý×P3¶ýwêë' ¡+Ü³§°bÍ’ší{©É#lÅ¥e%Î,Šô³Vý`™Ñ
2SR"kkªJŠ¡°¤ª¦Æ½ÂËÆEÕžÐ?éPÎ~µ¨C8$äÕ@n'“¥b‘™¸AÆ7M$m0¤Ó†(1ÀÏÐB2Ã/Éøbù¥
Üz&¬¨Á§Á@o?® £èÊð°¬-/7(ÊöíÃä_Ü¥îá‡‹‹¥††S§$©I"wâÉÔB;>Þm0\¹¢(}d¹äöÜZÖÂùæÍöá,¬Âº_¡›/\­ª¨
J’ºY|" qµ®³¶T)ö÷‹ÿéÏgopÆseE}}ÅzÎóÙŸóL22gŒÊ§Ê¨u«<:,é\±Á±…c‘ ©î ;üþX93ÊT±c<3úÞÐx‹}œ×“ñkv¿i¡cÁ˜0í2.˜w“Ò’Ü‡Q~ó¦tÙë8—àö·±å¬IE”p2L/zï/YŒº<_ô/]ÓÖ1"£WZLg®ÜXx>gsuÝ
.EâÌ…/\ ¶Ã®ey¥‰øÒìXQ™S F÷.w_óLÁÍÌSm
+K"KAŠlœ%‚ç¼š»¬‰”Jk¡*NU:è›÷ùC‘x²uŸ¥¤Ä".”Ç¹£ÎÅª5ÎWä%ây»o½ãŽ‘‰ECÅM>úèý‡Šêš;v¸ÎF9$VfãKkÙ`ü]]=£Þ`Üe…‰ã©¾OúÓŸ^›‰–’Šr‡ÍÀçæ¢;—uö˜œ‹+ÛjÍL(81ùõÛæðN¢š)ž•¾cfSL
Ý`%ÞÔi2Í¦e‰ò}²úz¾Q ŸÇæUöw>öµY%ø‡Þ;g10‹JÎ(€D‚j¶›•þë·Ö¡Ã.`§w”«eI¡#(ÄbY
ïÙe»·˜ËÑð¦D`øâçZ=IÌONLÀä47’"övº‰ý ~û}aKmÕÄèbeÖOOû½­Ž"cÂ»Ti^Ÿ‚Í/°2òô‡ßïpdíQ]K0±Ö=ÊäØÈØDPko¼çá¥¨ÎÙx|„3Þ¿¢£ì³Šrÿý=ùøãwï*Ußs÷^'&9=o~ª7ÓÐJ,í*‰fýq†YZ"¼Þ V›NÃ¬õM«l3¤Ö[$¸q„Î)#× Uym`äw” Ôƒ¸!mY%(—Äˆš¼"L'²j:®)¿§I;Âfs¸ƒÑ:AŒ:µ,Wt¢1;•#Gb¦‡‡]ë¡nRd•-5q	áxS+2Y\„Tðüôl“}rf·½]à·tõNÿû§y°EËÓh1­{§KTÈÛ%Å"$¯êÁ2·¸X^žQQ¬ÀÙUj/ˆF¯Ê16V·ûV´Ü­»ëî-þáØ‰cô‚XE{™bof‡®|€’¸$ˆ‡{há`k¦bÕ¶/ÖsRÌÃXH0«{Ò›)nð38µç/s˜ÙÀLâZÁžàlØ,AŸâvxŽ¥t
•âûç·o#’Òc¤ªø§î¬†~~2ÎRXR&¿G—ñêbQQQÃ”;(’C#M“cÕõŽ¤2=752Ç0#ž¹‘kˆL‡„¶3Jô´û“I»‹>ÍP¨²‰ 9¥¡o.?Ø~þ|’\v7*€»(
>á"GÕÞã·_ájoƒ>Ø#O<õLsó£÷ß÷äKTŽŽ1­«0ÕÒraèH)HÎ\¹ržî}&ÃJ,LhçkŽÂÎ7ir¯œ‚VC¥€ó9·ÖªXãvû…‘5­e®>uªš^«æµ¾%«b`âÑk-ü1¸V("/Ç‰|()ßV (¼¢Ø.o%©Âsl·@X<ÃÚÚÖ?A2y¯›-#v™Ìädê
Ùó©-…Ì²ÍÓzµåå	_<ó!ê„}Ž<¶f_i¾XˆÇÈò¹¹ù›5+
Äœ Ì¹Ååï	sÓÄ’Jµ8uõ£n>}úðöfCýr8?d õƒû˜ß>©zŸ¬rqKÁ÷xl\ÎQvKCC½ÜúOm¶OW&º	™9!mß>	º÷ý÷ÝËœ9\„¨@8™p˜!Ycùª…Ñj¸ùÐ2¢&½‰W–njêtÖúÝd}L`·¾¾h”$d©zt¡ŠgÇhLDc1s´ÞÙ9Ôtb®?¿ˆkhàð—K®¾Æpé‘*
½²Æ¡èêgtê|Vï\Ñº)ÎÙlÓó<fêJý5U#éFŽ¹&ŽŽ³“ÑèŸ}Pç|ðY'9uêì:»ÀËv›8‘ƒ+òŠœÇî±»D§âTº›
œs´|*'UúÂà"äP*‹,úüÓW»9)
=àéYß‚?$©û®NúI,ò/Íx1Ð‚+aƒò‚|cž†¿L°p
›N^˜qÂ”Uë8È|½È§<«U‚ö\Çg@ã*óó	È-,(J˜Å^ ¶Y /C“ýŸ|¢(óÀÒjP"™Ž…”•0Tÿ€ñÍ¨âM§)NÔ›œPz±bM1ìÇ"ïK§Y’ÍòK	´?h˜(æÞÜáeÙn4Pæ–«7:26í_S¹"Gqq¡
•Ë³ÙDPÞ…y¸…ÙÙ8,¸:ç¼sÁÕB.-.ú×±HŒ‡gG±öÌ¡(¢Ê\%ªu¥P­;)€ãv‰d§‹e‚Y0È+²2\´w~öYtvì
Ä=H®U­451LI©BJá‘N¯Aèý¥­¸œc¨qÂàùì3YÂ©í5…jn+Ä,çlnnv2qßè|‚!’üN}ò]Öh1ÈW¦Id³d×±ooj°O÷÷>>¬àåñ€
Y
l¶ò˜w”Û¬vN”ØY¨¶ï8v7(Û»õÂFUïxÈP¢_'5ò¿%’¨?gPGy‰Dt‰‰þ	¿¿ÄòuXÏ!Æººm `jšîõukNÛk „ ÇÑ@Þª''ooo_ï05IÏ]éîž—1sÉøSy2“JœÍ·•˜M&Ir?ûÈópßþöc‘ß”[Ä{ï½÷ž{”—1ä¦Öu:}Î6°°À•E¯ ÅÖàŸíØÑáÖˆKåÍh÷“|,·À6½ßä^Ýæ¯µ:ÃqÛB‰Èï$ø“	¼a›~…9JþÿC‚?yãL‚Ðç{ãú>Gdvœ”PC»j~z¶“e›š®}¸©‰¥Ÿ‚ v11¬±ù_JSÁöa;;YnRù.¥#È=ÔÚå…{ÒÏ>›†UL˜¾`¾FwÑ~ýu÷êù[Rí^Ž:p2çŽÆ¦:§‘S‚õ2”7mßÛháÛ._êr9 6C9né@÷Çã†ºí$M¹]=£Šmç®ÝXµ#ãè3uÚúL”Wq©=2Q¶m÷Áæ}
yÂØÅó—Æsí]O>õÌý;
ÑO`Î‚jÏ¹J8M^|¤»G­³äç©8rd»!â¹ráüÏºæ‰©®ù°{ížµf¿(bq/È/b}#Tå¶ÄôB7ºGÚÍi\L^Ukü¼“{‹ÀCyöY0p«žx„šš;$ËX!fÚWïÃ:ÐbEyÙ¾ñ›ÈåwËÍP£g¼™ w<Ÿý¬m`bÔÇÌÄ0¦á‰…‘²»îä‘íU…jðÏÕ…UÛœ<é(¯ªÅ0«­*w8Hhª¿óCP$vöO…dí•Þþá	j™8·Uûoh¥(mFÉTXdM¡IãÊÓ˜lØÊÛLOÜ‚ßÿÄ/ýîqò2ý3ýîK/<
£UO¿ðs¿þë¿þs/ÀV­[ Ú;Í0.éd2•"sq <Ô$Mðš3³¥á´ZžI¡…RD
Ù¶~Ñ.Ò5ã ÁÂžãŠÁ­²ÇØÜ_îÇ:Yýæ~ïÃÿö÷Ýîß_nÈm©64Óix³Ï¿¾öÚ¿þÃ_üÅ?¼Ü"Nužûíân<yMˆÜ~ÄQŽÆ«-§-‡†£¡h³‰	4Øò7ó%ˆp_úÍ“Ä
ö_¿ÉüýîÿûMjÙÐ¤¿ýË¿üË¿};þ.ùú‡owFö
®_zMc¶þ7Ú½`m»k&EuñX­XÅÿÂ?ÁS0êÅssÅD%KYt®ÁÐ*
LfI¡Ò–mïNp˜+¯§}˜çf+¨a.ìÖ‡2„•‰äÎh¶‘ÀÆP…ÆeÝ¬amÜÂå2I™B¡H´Lª¬´“(ÊYQ »Z¨BRy%nV>.Öjü“*3²%5çIãón-âTUUÚ(—'FN
\ÿÞÔÕîùº-Ûüï~ N­  Ê¢È§RñÕÌ¬U&Œ½Ïö’MÒy¾»£Ã¬šð#wu;¥fgÔO³`"¸¸ÙžÍ>}ùr[ïÒÕîU;nÕT›¿ÀÚq¥Ã:Šƒï×”¤[æhAdý,ŠBVË¤Õdm^e
¦áNqÖS™ÒÝ¤É”.ó±é½¨Àu³Aú^òÜëO¹._R¾©™ñkÝŒ:6påüÅK==ss]˜ð-àlŸwäÒšú†ºÚššê:¬ØõÚp’WëDŽ'Ñ Ö¹³aaÐèF*þùD8Î‰ÄR0ù§‡x6ä-\ÊF–¦/_ø¸stÔ\XX’,¥Ûwïoª3ë9±¸Á¸FÓ×‰vÑõþèGx±Ì¹ë×Ï‘^™e¶¹±¶ÛÝ*‰ä¸õRØéTØÅæ))áL$lcdC5¤F¥º~a**h,Ò°#‘l,uÒEÿÅ‰EåûS’#‘Mc…‹\ìì¨Xáá³FÆì0‡|¾pS>úñè<?ã'Ûe•T0
=?2Š8#p”œ^‰Sèk÷ÍÏ§ùù%%TW[2E'íÓN%	Ï“ä†<	Ëð<Í—ÏÅa{â¸2nÐ_öµéç™IÖn¯ þ™L–4Oú<b±Ìrž
tkÔµêAUûeÂ3—CFÉlŸœ$ESS™,“+8}\p²„éëC?áŠð”‹é«qk>Û³'ût#Šn]]Ì®v7YOù0ÌÄÄåËšq
â¶À¶ ×}‘å­·*+ß½O¼ð·Û=²‹´oÄQÊ÷lëµ¾LšB†™™)¬ígÈ U×„)&æzßYÍOÅçûéÊD”._f˜Ý»«ªÏ®/ä²XPÐÇôeÊD+Dj€×Äb{ö|öY“‚
ÁŸÖˆ´“]îÕóËëÛx•ûBÌ«CCÁÿüßþ
&ùææDs³,vi4Í0Úäf‹ÅÓÇ± ¸	¬íß{ï§>M-yÿ“Ì_ºd»tI÷ŽƒÓ¾×½îB3pnéã—È›2_Kj+*Zeß¯“o|CÆy†üëäõwÞiÝ0~Õ7IçUÌœU[Îºƒ¹YwÛÆÐ«4î”›½™Æ­Ì…Z–Ë2ÀœCQhYZøÞ^24t–ß§üú7¾á"ß„ªsÛmg×ja¡ôÌ¥…ëqRÓSyÑ«ón•’xÌ~2y™hà÷‚ªOó f¸
±úú`°–T¬JŸºùf­±ŽWöï§¥{_}ç™e%Ö%b‰__@^2¿/¯N¤Y=¿œ<iÏdµô—½ÿ¾Xå^?#§º:¶®˜“ÕìÀÌÌ [ëpÔºµÈÏç;ìó?*XÍÜ¶ÿmÌ{—.½·±ÅA“„›Ý6 ãî­T\´±ó0°dF™W4J©æ1ñt°r£«×/]±-âuÝ¶mºëTsÍÄ0<e¡¨”þŸüKÿöÛ¶O´H÷6üàgÍ¹ùêm¤ÿ•‚WÕcäV2ÌðÔ4nº{zñ¹ D3a“Ðâ†úãÞæÄ…A»^Çß?%°Ê˜&üÃÌ.ü`vé5ø4××á³Éé Iã q–ÙÁk×\¬ofF<¯tº„tx‰tv¹H§,äiÔ¤»×…Eˆ-¯(r	
ÛkI ì"~YØ±c;Qk],³}‡‹mt8\¬¥®Î…®uËðÖÛQÀ¶‚µ(â3‘ãa,¸¡þ¸ŸšÄOJÙgˆÒÛ§(åJ?~-†3?”ÞIa¦Ÿ&Ú?N#ŒRŽÑà"y2›g²ºXÁàbqx»›ç‚i‰Øe!K|«‹ØdÖP\ÂÌ¬—0¼‹¨eÁƒ¹'w3³;V\lÈçE•ÜëwÌú`ðý÷ß2¶¹ù@þ#½J… ¤÷ÝwŸBÏÛØ#x†eFÔÉ›üyIfÆ<òùyN‚?ž_‹¤xÑ‡ø×ˆ(»ØŽ';ÜôlÅÿ#<Otø}×ëw¹×ŸN1 ßŠWÂæþžºYpÍŽ¦—3ˆ>çN¹7¥Í?”MûŸaß’¦-üŸlÚ§ßxÃM6=½ç¯ö	¡÷fžîûzñà7¶“k4­ô+Ü‰ËÜ?õpAcÐÈÜ£ÐcösêqõøºÙ?Cã_æ<ó´Â¨Ç×r	Ç¿u#c£ÑÍ)'+nà^ééoëŸR_¾Æ-?5uxÃSÂ²½ Òïnm!w»[×#Ÿ9îê@Ú-3TµF}ä ·mmf0‰yëÜèH_/çF+ètf³Nç–§-sìjTÜ0Aèõ&^ïÆX½}#£çÞbh¬d’FÄ]ã.GÙ£§4V2I#ê7œv¡O¨¸ñÉù`„å'†gƒîÇåéÓ€o–C±1œÌàÞx2Þ*%áÌPYëO+ÆÇù§ûú¦8XðM\pj*È™Â‘\$LÍtó,')¼Oð:^Ê/‘RÑ`[>·!…³~%\ðÎÌpBlaaÞ;ãñÀ;€Q^w¡ÕjË”!ßf£fO"!ê°!­Vw!ð.Õ°+„Î`É7J,”ÁÊ*m¼»pÁ¯x¨›¢°àúWààÑ
»]ZXpoî7~Ž™¶05
Sp}Ý*+ró;;9·èioŸœD«‰Š¿¼¦ªJqc*@?Ý²>ÆB",97
8;óAnÑç÷——#†øÞ{³³Ÿ\¾œ‹±;§Ÿe3œgrf>ÜÚ¢B"Ý}}0Ïà™wÛL|jq‰rºô#€µX\LÁdr·ä‡­FäèÆŒhC>s1u&Á­÷úY<«Ø4x~²¨âÓdÁë]Ý)à"ÄåàøX{„èZc£×º§çÝV³ `%êTÄçÁ+˜ÑêaýËÊÑé4¨ì:Ñ~ó=»·ïÝYjs[c¼¤Y¢5Zóíp¶E¸µéÐ	_ÉýÌ´qM/3Ñ½ÞVI¹)¦›IvCäëq–lx’9©/Ä_àÕÁ‘ Z%åú äq~å8='íØ±Ã‘öz7ž­÷¿2gëÝda cÕª÷fÿíÿuÿïQÿßÜìÿSêÿ¥µþÒZ’Þú²âÍ)
RÕfÿ+Ôß¼Ù_¹ÑùÆÍþ}Ô¿æÒn³/õ¯ƒÿ:T‹ì¸ÅŸ™÷:ïÁtkvæ»!¦f¦œïJôl…)G:›)'N\¥œ¶gåK=Y®åôë´b‹n-l"&nL–3oÅæ·ˆë!°l"FÈÿL6HxÊì …ñsî{oÊÍË6çlÛc¶mcÈ¶mÛ˜s
¹!ý­8õíìþv%+¡’’$ùõV¡¶TaYÅT«¨Ö!V=µÁvê„]ÔhÓTœ®Ù8WËp…Žã	Tè”®Ò_×}|¨'ø”$õÌ–rQ,îrXÁU°šëcCÂÁ¦ðH¤ã±8Þãq¢'ã4ÏÄ9ž‹¼×x
®÷FÜì-¸Ã;p·÷á!Â#>Ž§|Ïú,ž÷E¼âxÇwð¾ïãC?Â~¯ý?ø~ögüêtÌó/%ýÇ•ŒÒQE£)6‹flºDìýäèýé§Å4ú±˜ŸU±š~SlÂm±÷Ç~<‡ñXçÿZ\£ïñküSBVH*L•¦‹øéRdF¾R
9
â·$‹äãžîÑJ-ˆþ)ˆdêeÑdÕáŸ¹î¸»»»»»;{øìXá°ÅáÉê¹á<V¸ë¸»4R·z’s’î$}ª&¢wHn%ÏUÀ5Êv+OynøKF¨(ù•ÓL­ü&ù
ø›üñ™ÌOcA
½6EU@,›+Ñp€ïj‰p=yê’è|íû(ÁcOék½™-…F U¶V\Rî+bBú¾]gÞàEÑÈá’r×ø“+5\½µ•Ÿ”Q¥‰cA
]æøxCþ½çä
 ÚPdúó5F£ÕWƒÜäñMÔ¤ê8.S.3ƒn%ŠLŠ“¸¾\ÖMå¡b^€ŠÜèb*IÏM }%üD™Ž^.u?)iKÔ:ûgMR®ßøº•Ê ÛÕFæöp©º»‚zŽáso­"~ ¹ð‡¢¡g ŸhªŸÑ[‰R•Šp>ÄÌ'/†}_cü”£ÿV›Àt·+ìFP¯Btó¹¸îÄ¹¤73ÐÉ ×•¾Ôº˜z+ûþª¥ôô¥ÖÃ-Ìfùèð5`÷$s†Ó?Œp±„››´™þ!óþÑvúƒÞ|÷~è”lÿ¥CÌë{ZÆjüßÛ1vßèãI‹ß°·PWå*º±eÚUüMáÈ]ße·zõÄ—¸pì‰ú£ÂÝ&æ‹÷	ö
ûõáÍãyyÜÿ©ŠiòÞ®FíŽø£>.A¯IÆ—$ýáõSLx iÔ‡á÷Hnå{©+ùP4 Ñ—¾¤‹AïŸê¸¤<ÑuÖ*õÇ‡OZÉ.ýR›ÐÇ}sàŒ†sOgò<‘{fÀ9êšàŸtÿÎy~÷aíñzò†ŒúÍ x”“l6Y@Ï}óæÓÚv­è·Q;MmÛm´¶mÛvÔ8‹°q6\»¶gogíÝwrÏ33ƒ zÁ¤¦çstwÃp/Ç“
ì"|°2í\Ò«sVªófnº WŸ›ª.*ÈS,ÞtQŽ<Ñ°?•Á`q»Z{9÷G÷4v÷“»zºÈôG GcüÙ.‚„áŽä(í9Žå8¢œPtgl$vGü'	&¡8apëÒ¶ww¦ìÛsòž‹÷,ì­ÆÒˆäÏHN÷³Ïì7ùˆÌBÔ‡I%¤R®'È Þ’y™ÿ˜¼…¨/ þÇøCÿiÜª¿.Þgæñÿ·þw{ÓQ‡¼¯£^Õ¹ÏzcQÅóÓýtÜÕ~þ‘yóç=õ|ïÃŸïäñ÷IË¬ÌÉ‚,Éòïkª1µu«=s8Ú»€èˆ%Ìæ:*_]­c])Gáp'b9…SÕ(–h’Ô¹”¨ËK
êfÚq¹‡±<¤8<¬XS,O*–Ë‹Š#mÒ¦î•^õ’‹ä"¬\*—ª/“ËpåJ¹+·Êíê»ånm¹OîS?(º‹<#Ï¨Ÿ“çÔc2†#2¡ž’)ŒLË4Ö¿sØ¿sHæež€óˆ,Ê"Ö¿¿+Ë²Œ1Ç˜c°&×äâ˜2SFÐÔ˜ÄÜ`nÐöQ3ŠØË‚¾ÅwDýÓ7º¡’T ÎMåU7õÏ0¢ñ™iþ…n¿=7ða¨Ð§<Tÿí¿‚çÿ{§q:gp&gq6çp.çq>Q”PA3-´ÒF;ñò­¸ „äyY^‘WåêAÉ£² ðïý¯½Ùº„ì5ËQ®‹h”w!
ª¯/®m{‡Ùö¶>ÍyÏkãÝ4›æÒ|ú4}™¾J?E!nÈ~¹ã®TïF•ÆfvßH}ÇïsÓsy~áE¥1’ý‘^ŒQŽqœœä§9ÃYÎqž\ä—¹ÂU®qÜâ6w¸Ë=îó€‡<æ	OyÆs^ð’Yn
&³‚•¬b5kXËF6±™-leÛÙÁNv±›}ìç ù8ŸÍˆÚW#R²7o½:ž·³½Âz¼Ãÿñ]þŸïñ}~Àù?æG²ÍÂnŒrŒãœà$§8ÍÎrŽó\à"—¸Ì®rëÜà·¹Ã]îqŸ<ä…éø‘?ñþÉ¿ø7ÿáÿå±NxÊ3žó‚—ÌrS0±÷ŠX,§D¼”e,g…ÒJV±š5¬å5ÙQa1]Ëëx=oà¼‰7óÞÊÛx·±îÉO0ÝËûx?àƒ|ˆó>Ê6šO›ÙÂV¶±ìd»Ù«Ÿ>ñ~pó	s~FÍgípÄ•~Ð«XÏ+ÜïŽìèæ7ü4›w£ã8'8É)Ns†³œã<¸È%.s…«\ã:7¸Åmîp—{ÜçyÌžòŒç¼à%³ÜL,f+YÅjÖ°–lb3[ØÊ6¶³ƒìb7ûØÏòq>›M1’}™^QŽqœœä§9ÃYÎqž\ä—¹ÂU®qÜâ6w¸Ë=îó€‡<æ	OyÆs^ð’Yn
&³‚•¬b5kXË{²ï"R£x›ÙÂV¶±ìd»ÙÇ~póÙÜøùj “%‰Áu¶•<Û¶mÛ¶mÛ¶u¶µ8kÛ<Ûyé®ySÓc—Åß¤ä/´ikAŽÉø•:†Ò9œ¥ãKâVÖ<¢Ý?îþA»uÜ“÷@ßªÈû$ž¡ôG8~DOÀõüEßâ
Áâv¶‡À­”õè7¸›~ÃçØÞ’°}êm¾2!ü&<FúÆâý|‚u\Ýgy^oI„Jô›Oã§©>øý5œöSõD äh"‚,ô‘7y´z	VzßÄ­>n¯yND$?(	ÖÐ9C|r=í‚V†¹&Cúˆ9cæE7Jâ‡±–o9Pí
ë%NI»ü“ve¶'AK~Ë5|­ÏF«(‰±GÑ70‚õ¬ƒq.çò’}¼aœ3¤pßQÖ:Cð	Ÿòñ#N3a?ÎÍí*ŽüaJÀÖËSM€Yf%À
Qõ’Ès
1ò€â`2·ž€MŽö<:‡mtÌ…Ì·}”ƒiìD@|\¯²/)^ªõ‰µ(.½á1Š€gä3£äÇK&~ôpÌ?Ü¥øæÀçÉ;J²#„1gÞQ¾ÌÓ¼×Æ/ÇyýÆ…ÃMð´Èú,rfWg«ä)%Ág*ŸöúB\áÕ\Â Âüqâ"ªV’N÷•dÈ¢(\Gßà;2çØþ†o£XW‹"à'“þv*„?„3© ÿy’1Ú=PòBçFúÓo”yÁ~Ò†·«¼á½jÞ>Ô!ÄâYg
¾£õ«Ïéo-ø0ÿ•£$í¼ÅQ¦|¬£B¬%ÏCìAø„ŠÅ–û”ŽYð¾[óÊÁf–±Q.Îa]SŒ¾ú¸=¬÷H?Â]{üá«Ü¤÷=ÊsšáÇ±6Zåv½ø;Âx>+Qð¶álO¢oÔ¸ô·•Qqq…«=–
qÝ¹Fèí·Xëmêòpu^Ò76cÓ1VûÖÂK<Î;’‡:wžSsu¸Ÿ¾âíÌ½½Ý‘à;V¾9ÝPÃ(eÁ‰NêÇ{ˆ±/½ÞŒ¬÷V®2eÐ•4X€«º“é—¤;/yÈë,Û¶÷_›cÛ¶mÛ¶mÛ¶móh+wyjpOõ úf&S^Ò×$€|ü
	üeð'”C;GtEôÇ´³½a ¦a%b
Îc*.â:vâ&³q€9|øÍËÒ|›å”ïY‘UøsVc=iÄvü;(eÙ™}ô¼?‡³G*
9ZiÄqœÈÆœÌÅlÎ¥ÜÂÜ®ŒànÑ:ÆËzv•×¸7”Å¼Å;\Â'Êò‚Õ+´:ü–+fN3®v:8¸¦`uàZg´3šë
¶®‡ƒ‰Ù
m™qT<äã¸¶ÏxxN±•éxo!Š·•,¼ƒu‚ÏtŽ/à+|‡Bø~­þ7ø<üUqñ7%bÛŽ‡Â(†[x<[x2Qu‘…zhM” MÑJwk´C6:(…ÐQ‰¢º"Ã¡tÛ‚[%\[„Ò1
£µ]ÈÃX%ã0>&(ÙöžKÇ4,@±	¬T¢Xƒíºw(¹Ø‰Há #Ž#8¯§qIß^ÆUäã®#†›¸¥ooã!âxD	¦Q{ÓA’ÌV“Ãò˜äOÕ?Åçò¾€|¾È×t¿Î·ð¾Ãwã»üq~É_"Å_Qo7þ–¿Ó·¿çïõôüü3ÿ¬§aaõEXDMQUSŒÅ²KèW+É’ˆ³K©/ÍÒÈ¥>òÇJ¬²
« “ÕX]ßÖdm¸¬Ã:l%#ë±>¢lÀj±	¢¶›ylÆfº›³9"¶¡9¶¡e²[Ã·%Íc[¶EÀvl‡RÓˆ²3;ƒìÂ.jº²;Èì=Ù{±—îÞì£§ýÙ_÷ Ð=ƒ@æ`¶ÅyÊ¡ð9ŒÃÕÈ†nÙÐ=ŽãðC[ê<NàDm¯ó$b2bœÂ©Hpg"ÉYœ«{ç!Ÿó9_÷.BJ^«YÊåºWp…ú•\‰8Wqµî5\ƒ$µi!äz®W³ÏÜ‚å)9Ü«~÷ë>Àˆò "ÎC<¤þ0«?Â#jŽñòyœÇÕŸà	„<ÉSjNó4¢Ôf¦æÏ©9ÏóHñ/ Î‹¼¨§—x		Y¿¬þ*¯"ü¿Ò“ø;ø!ež-ž-~yä˜GNyõ2ÂÁl[`ã¦=4í®¬ç!´5Ö5ó¡™wÍ<Í¼‹×å<4çŽœâ[%ÄwJži¥ÝœãïÍ¹kÎCsîšó4sžnÎ=sž2çžýùšj×vÞ¸ÙvÍvh¶]³šm×l§›mÏT»¶ÿÆ1U‘péŽ`‘b±lf;Ól²}Nýy%a¶fÛ—í[È2Õ¾TºðÍv`¶}³˜í¨ÙÎ5Û1³4Û1³ý”ÙÎ’íwáó=	˜ðÀ„‡&<4á	ÿ3³šíÀlçší˜Ù~ÊlGÌv`¶3Ív”åY¶zÇå¼*BN[Àãæ<4ç)sž#ç
Õ4b#ü”å<4ç.›IxhÂ]žfÂ™p×„§Ø^žCvc78ìNS-É®I¦-éiæ™¶§§qÐ=§Ì³kž=y¦f8õž5Õž©Nq¬T‡¦Ú5Ï®yŽÈóœ*Ï¾yÌsÒ<ò¼XýR.Å¹Lž}óÈó*Ý«å90ÏQó3ÏyNÊóFär“TûÜ&Õ>wp¢ÜÉúÕvq|s˜sßœ'ÌyhÎ}åQ„&<iÂ“ð“jNIxøOí½™0ÃèÛvRÛæo›õö»Œâ\8;xÞÌLn¯ZxÃÂ+O¿mÛ.ØvÞ¶«zƒšÞ fá1¥AOiPV51AÜæÕ.¡}}ŠÑÑ!ã
Ô¢_£_CJÑþ‰þ	EÂDÐq#²nDßˆ¹MB-„ÐñA©ÄGœpŠs\à‹\å×¹É.·™à>xÈ#®ð˜§<ã97ø‚/ùŠ¯¹Ã7|ÏüÄÏÜå~åwþàOþâÆøŽKLsšcþæ?žð?ûÌ°É</¸Ç?0Éo¼b`Ž×ló†3Œò–³|Ë¿¼dwœ2®ìI‡Hý±Q³ n#éÖè¹­ˆÆ2üŠ“eÊÕn’çeff333:ÌÌÌ¸afŽ“efffæ¾’:ZGï®®¯t¾Û4Ó3ši{1LþZ.A(mî5÷™ûÍæAÝ<lª›®fŒk¦˜f¦™å¯“¥æ5ó:¥¹Ç¶´ú#˜ÁZ`/OñððHÈ™R9wTî¹²eÍˆ={In©©‚ cL€…–'8nhYNuÜHýF>—×šÓ$á`9h¬smªõó\V3å“7W®@9¼¬i@×¾ú´R¾ÛqkÍ?ê¸úÛ·U¿Ž)"Õ†¤Ó®XÏ,3ÈqõW™xîzÒÎO™þÄ2cˆ#ˆÙŽø^@~uíK?›ñýÄ0ñw˜€p¾y´‘vÒA:J'û¤'Ý¥‡ô–>Ò_Øû¼Œ³÷p™,SešÌ²wf™/d‰,“å²BVêÿù¬“
²Q6ÉVÙ&Ûe‡ì”½rÀÞSåY{w”—äeyE^•×äMyÇÞáäùT>“Ï¹®ô,“T¼*Þ
)Isé®ªV‘yàu÷
½Ó½?¢K¢³dXE{G;z½¶V‘½ å¤Š\%·Ø\Wo‰·VåçØ6Õ±ï²LÕ2ÈŽg·MÉ )É7*²ûžÕz°ŠÝ»)ûP= YµA¶Ê~yFÞñcÍ·õ²†@ì±Øê¬+²n2@ª
r›)Jž©z†û9iÙ´Õµ¢‘;§Ó4³–:9gº:÷¹6Æ)7t<F¹Ë«œëüÉÊQ»êâ³€YÊÊ£€ÙÊßûœïm#×Ò2uîÕÌ†ÀråK¿B¹œú×ó”ÏR. æþkÞ@‰ßF>¢ocbµc£Ò2†iÆª äø+Y×°®Ö%²2±"uõ}BN¼wN-Wi™”³HËv¿´Mkq­¶¸½’ü%·>ÎÍµý™ÜeLÁPãäRŽ,*pgQÕ/ù_n¢·pWë;î
ºWp'MéBuºÑ‹æôamÆJºéóèLvp€¥âIÖò´;$(9|!yr?É9RABRI
$K.†RÆ¼aÞ›äæ¼ºPR…Þ
ïÍ¤`Ù`EÕ%Á[¬B_…K•DáÍáü+X=‚U¸|¸Z°c¸šýüo
‚Ó¬à„¤V…ËwW¨0x8øBhBðƒã
-°ŸáËÂ7ü_
~üEãÍþ|ã¡HšÊ…®
]Aw…š‡êSÇ¼	y³Jªð]áê'¨y¸cF†G¥ËÎSçµ3´>M‡Ã³ÂKþ?Ù9Wè…TìÎÚ¹sÇß?6nÌÉñ¤·Ý=\R…Ÿ
¿â•÷ªeRø“ðw)E_ðª•Dá?"¡èðß¹Å×éègô‡’)R¼ütÙú‘«’ª½"Òü¸¢7E:F
#"³¢EVW´~*vóÌ ÈæÈ^ý<y.òEä½4ýÍ‹†2èì¼§ò^ù·¢Þ5Þm%VM¯ñ	ê5È“.;_;7oŽ·ºÄÚí=QREÇDÛ«zFùŸÓ¢¢«ìÚ±ÇÈûN<g^)=OØ<7ÇäøÝ^òÞ! 7º_³mús;$y»òlçïP^èüÊÿ®*Ç²;ûQS—9Þ:æÇ{4ó-ÇS•ë å‹ýªïM8WÅË>Ø§|9ðŒÍd©Ë< N
7šƒÊÝ€"m³—þÞkärŽhN}×ïý®µ¢„cû-Ž*ßé2ïp™Žfö:)Ÿœ‰FÚ¯FšS˜”˜…òmÀ~åA®ÍCÊÝÔ¯V¾KÛÔHÛÔHsJ§Ž>?dýàGí]kÕ¹ÚM>»òZê·×ºc1:Qßñ.Ë7E¥ê£”z—ßò4†itTG¤‘káQmñJu4rNguNRG#ç<¦½¾ªŽFÎy"1>u4rÎë˜ñ&|_~äœ'µÎy&èõläcG­]Æ>ƒE~²&y\Vêq9OG0WÞEÀm£«ŸïEŠ€g”ÏM­z›"Ù®ý-M8öŒØk‹g-³øD3»3ò¼:ëÜ8_Ðš[uLmäœÕù`/É'@ù.r@´]³ÎÎ\ÊÚÈÕ{E{è
r:6:¬ã¯&ÿ*5Ñ'HÌ­é¨{[Z ½ÆìL¢+€…–ùìïªáÑèœ9ŒÎNs† Ï%Fjçžg#uZ/iía`òÑÈÉohòûî'4òGöEô?zÖÿî;°Qj®rŠcø`†ö—ãf<S¹œÉ£©~3GùLÍ·YO'æm9ô°HýfÊ_¨?Jù-`±{âÎ=e#×S{uNWg³œó†:³Ô™e#ç¼©N¶¶î‡ÌWÎ×ÌŽ6r™o©ÓÌêÀËÊžóßV>[ýK€w”Ï€pô·ˆ'Ð8˜þ¶:—* † îÃ>Ô×ˆÜ!÷mŸ‰SšÊ®\fK¨rªè.ôm¾ZÒÓÞ×¤.^ð`Uâz“(^(x*qæ-ð^1ž¢ü¬ã÷µþ*é–ä®éo5Áçˆ!Áw§I3>¡ûêYp9etü,Æ0…su¯ûBÝå¾H÷·/ÑíËXÎ
.×÷†+õáV^ã¡žî<×—‹ävZéò ¹_ P’šÒÝãáÒ@2‚QÁ¦™Š”ÍP*žX‚£2¹¤xÑµ…¤Û7c¹EÆd(ÕeQÆÒV6f,3–ç2–¾ÚƒkSk?GÀ¸«„5zn7:^kY:þÈr “}®|¬ùSä·äÝx“Ï°Y³
4« øÄ²q¿¬ÓV«ok­×Z´­%.k£f}íøSåw¦­†ž¾î/Cï W^/èß4‰«Fÿ"‘­×NŽ»jnK–ËÏ¥ŠO-ý’¼jLy{›®¶-íîîû•ò!Ç_*?åøÛb¼Å²œâø;Ÿƒ©Ñ£†*ÒCÀ|d>ó¥ù™ùÕüÆýÏ#¾_¸¨	zgè	Œ f +€íÀ1à•ä/Ú/ öøtOªÐ×“A*`—‰3D&ÙUàÆÖ]Ç^ÇqåŽ{*?ä¸—òÇ½•·;î£¼Ûq_å]Ž»)vÜOùIÇý•·8 ÜÄqa1H1¨r„«èÑïN¥¼îä)Áp]Á=ô¹E#·Ê¾/DëäSžj™w¤8¦µG©£‘s~H«}ŠìÑ¶}ó™Ëy]WÆ¾Ó[¿¹À²9Ùù?[)ß!Ä©† æªR7yu=¢WW~!ºOjQÖö¬÷ï³×ý)Ûü5ÿÃb½ÄNålíågc××6«¤Z6#ÝHWÛ–KåøgŸ“Y²Û}û®f]àø—=Ÿœœß"MS³ä,wN·›ß{¦er~_ëñËSÎ~Õù}S!ŸÑ~Ê"œImb~ðç‚ñ£)Ä“:ôoÀm€+À6¸‘ÒuµÇñàä|C6ß>YiÿµÿÝ…üìwm¤x•”peé…¿µ/“ÉdÒqÒxw<Ó¶m¤·ôØ|Û¶mÛ¶mÛH2Ñ`×_©Ô}~©SßÚëî³þóßÚÈ´ºÈØÌÙeUdï¸nÏ™Jà÷ßÉD„(16"‡^ä’çÝ
)¢˜JéMú2žŒiËg¥ØvFEUŠ3L[žâ‰…Óæ¦h]¸¸,¥­•ÍLiiÅâ…)Q5­*¥;ª*¤ôE÷sìÿyNH¤½U¼‡ùDóÉæ7ìa>«‡ùìæ7èa>£‡ùÌÿ‘ï·nÝŽ{r[}ýN»r«kÃŽÛmÃ#ëw_WÏSn×ñÂŽ»ÔïÈkÿUßIÓ‚~±Ëî
;óÝ®;ïµ-{l·óz:÷Øcè0™ëpe¹ŽP¡ëH¥\G©¿ëht£É®c5×uœ*öØ«n­Üc¯]÷PÝž~7mÈC®Íš4444ˆ
ƒ&½+zò‚Ëå—*.T\¨(¸BPqpE ’àŠA¥Á•€zãB"hFÐlú21Z=+ú@ô•hK¬O¬Âµ±ãŸ¯‹ÿ%~RüÄ’ÄêÄÞ‰ã—%^K’,N~”lÍÈÉèßµž$Šôcšh¥S(ª¤²”£|«Ÿ6Ñê¯Á©ñš¬éš­ùZ¤
+U–kµê´^Ûkgí®½õí§ƒt˜ŽÒq:Mçè"]¡ët›îÑCzBÏé½¡wô>ÑWúN?©Eí†E-iY–k…VjýlÛÂúÛ`n£m¼M¶éVf5¶ÚÖÛÎ¶·íg‡ÙqvšeçÙEv™]e×ÙMv›Ýe÷ÙCö˜=eÏÙKöš½eïÙGö™}eßÙOÖbíö[Ä"ñHf$;’)Œ”"5"ÎvÎqÎuÎsNuNsNwÎÀ8“óg9Ç8Ç:ÇaÏ®'p!âDç$çdçg‚s˜s¸s‘s„s¤s”s´Sçlë\ì\â\ê\æ\î\á\ID©)˜FiªëhMs£é®c5ÃÏÓL-Æ4^³\'h¶ëDÍq¤¹®“5i‰SîT8•ï«
©Ú©qj¥ŸkÒ|gS†i¸"-rF8ëåN¶“ï¬pV:«œÕÎg-Qßµ¡ÖË6r·¥
³\Ë!b[ÙpËóºµ°|¯ým¤x`£¬Ðë@ßã"¯ƒlŒ{lc­Äëg¥H?:?9?;MN³Óâüâ´:mN;²EÎbg‰SîT8•N•SíÔ8/8/:/9/;¯8¯:¯9¯;o8o:mN»ÓŒ"I'±F‚||¶±9[°[ÓŸe8#É(F3†±Œc<3˜G‹YÆrV°’µlÃNìË~ÂñœÀ™\Ãµ\ÇõÜÀÜÄÍÜÂ­ÜÆ}<Î¼Â[¼Çû|Ä'|Ê7|Ëw|Ï4ÓJ‡²”§m¦þþ?ê'ý¬&5«E¿¨Umj÷=Èµ<Ë·+´"+¶+µÉ6Õ¦Ùt›a3m–Í¶9v·Ýc÷Ú}v¿=`ÚCö°=bŸÛÖdÖIœŒ,úGììôw ´«“ëwu„øÃü_ƒ}k?ÃB.édbä†´©NõÏñVÐoPw*NÌU¼ÕÝ3²‰RÇ¶ÊV>rï_SþÒ9Ä8ŒÃ5\#¬;ð=ÍÖD¼{¾ý†‘IDÔîèÝÕy'­ÓýFÌ¨´_)¦x¶ëû#‡™,a=»»Ï"Ÿ>lÆ@ëCÄÊô³õ
µÉþj³mj‹mj"jýŒ8Ù–êJnš–Ø,ÍoÞíc];ß¢VâVçIÄßœ\p%¬×0®	gêþåL­i+ÊïªQ;Åó­6!f§ïÐï`ÈzY)¤÷IaH?ªˆâ½@¿ð^aç¸
chpWw9ÃØ.-ý7÷ÙlÅp*ˆtŸ¯uÏ©Îõ-Õ»~ƒˆªSNÈäRjˆZ­WØD"¡NÂì
¢döÄ $üØŸH¨v%÷Ã¬yö9åxçJ”ö=Ž }'cˆk¸íŸÖ¾:ô¿á‡ê	ýe¬LëÅdpÇr\˜'r’ß÷c¨0œq(-ŸKœS9Ó9ƒ39+Ü9}¥?± Cv·=BúëÌÙœÃ¹œÇù\À…\ÄÅ\Â¥\Æå\Á•Z¬%*W…*U¥jÕ¨VKµLËµB+µJ«µFkm‘-¶%VnViUVm5Öfí‘d˜ƒ»§cÿ0
ÿÓÄ»ñßN·ŽôYöof”Ï£0ÒWØÏÕäs‘ãdBèa¼Å§iëÎt&ðy83>œI›*jÔz9aï2®¡õ5ž×ëxMŠµA Dÿìân9^”@Žf¸“¡\DDŽ³dô#Dˆ5Ìq¾Ø	Xî†eJxÔiÐbÀ†>˜À7[®.å0Ÿvq_X7—£¦çrüIÚ’Ëiër ú“          	À À ÕUÕUê«ê«    ÍÍšš&f&f3333@ @   
```

## FILE: src/app/globals.css

`$lang
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #f0fdf4;
    --foreground: #0f172a;
    --card: #ffffff;
    --card-border: #e2e8f0;
    --muted: #64748b;
    --brand: #059669;
    --brand-light: #d1fae5;
    --brand-dark: #047857;
  }

  .dark {
    --background: #0a0f1e;
    --foreground: #f1f5f9;
    --card: #111827;
    --card-border: #1e293b;
    --muted: #94a3b8;
    --brand: #10b981;
    --brand-light: #064e3b;
    --brand-dark: #34d399;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
    transition: background-color 0.3s, color 0.3s;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  .dark ::-webkit-scrollbar-thumb { background: #334155; }
}

@layer utilities {
  .shimmer {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .dark .shimmer {
    background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
    background-size: 200% 100%;
  }
  .glass {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .gradient-brand {
    background: linear-gradient(135deg, #059669 0%, #0ea5e9 100%);
  }
  .gradient-card {
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  }
  .dark .gradient-card {
    background: linear-gradient(135deg, #111827 0%, #0f1f17 100%);
  }
  .text-gradient {
    background: linear-gradient(135deg, #059669, #0ea5e9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(5, 150, 105, 0); }
}

.animate-fade-in-up { animation: fadeInUp 0.4s ease-out both; }
.animate-fade-in { animation: fadeIn 0.3s ease-out both; }
.animate-scale-in { animation: scaleIn 0.3s ease-out both; }
.animate-pulse-glow { animation: pulse-glow 2s infinite; }

.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.2s; }
.stagger-5 { animation-delay: 0.25s; }
```

## FILE: src/app/history/page.tsx

`$lang
"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const mealEmoji: Record<string, string> = {
  breakfast: 'ðŸŒ…',
  lunch: 'â˜€ï¸',
  dinner: 'ðŸŒ™',
  snack: 'ðŸŽ',
}

const mealColors: Record<string, string> = {
  breakfast: 'from-orange-500/10 to-amber-500/5',
  lunch: 'from-yellow-500/10 to-orange-500/5',
  dinner: 'from-blue-500/10 to-indigo-500/5',
  snack: 'from-green-500/10 to-emerald-500/5',
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const userId = (session as any)?.userId

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status])

  const { data: logs, isLoading } = useQuery({
    queryKey: ['meal-history', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(50)
      return data || []
    },
    enabled: !!userId,
  })

  const filtered = filter === 'all' ? logs || [] : (logs || []).filter((l: any) => l.meal_type === filter)

  const grouped = filtered.reduce((acc: any, log: any) => {
    const logDate = new Date(log.logged_at)
    logDate.setHours(0, 0, 0, 0)
    const date = logDate.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'short'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(log)
    return acc
  }, {})

  const totalCalories = (logs || []).reduce((s: number, l: any) => s + (l.calories || 0), 0)
  const totalMeals = (logs || []).length  // âœ… Fixed: was never defined before

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)' }}
      >
        <h1 className="text-2xl font-black text-white mb-1">Meal History</h1>
        <p className="text-emerald-100 text-sm">Your last 50 logged meals</p>

        {!isLoading && logs && logs.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Total Meals', value: totalMeals, unit: 'logged' },
              { label: 'Total Calories', value: Math.round(totalCalories), unit: 'kcal' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/15 rounded-2xl p-3 border border-white/20">
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-emerald-100">{stat.unit}</p>
                <p className="text-xs text-emerald-200">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto">

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: filter === f
                  ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                  : 'var(--card)',
                color: filter === f ? 'white' : 'var(--muted)',
                border: filter === f ? 'none' : '1px solid var(--card-border)',
                boxShadow: filter === f ? '0 4px 12px rgba(5,150,105,0.3)' : 'none',
              }}
            >
              {f === 'all' ? 'All meals' : `${mealEmoji[f]} ${f}`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-[var(--card)] rounded-2xl animate-pulse" />
            ))}
          </div>

        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">ðŸ½ï¸</div>
            <p className="font-bold text-[var(--foreground)] mb-2">No meals logged yet</p>
            <p className="text-sm text-[var(--muted)] mb-6">Start tracking your nutrition today</p>
            <button
              onClick={() => router.push('/scan')}
              className="px-6 py-3 rounded-2xl text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #059669, #0ea5e9)' }}
            >
              Scan your first meal
            </button>
          </div>

        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, dateLogs]: [string, any]) => {
              const dayCalories = dateLogs.reduce((s: number, l: any) => s + (l.calories || 0), 0)
              return (
                <div key={date}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide">{date}</p>
                    <p className="text-xs font-bold text-[var(--brand)]">{Math.round(dayCalories)} kcal</p>
                  </div>
                  <div className="space-y-2">
                    {dateLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className={`flex items-center gap-3 p-4 bg-[var(--card)] rounded-2xl border border-[var(--card-border)] hover:border-emerald-200 dark:hover:border-emerald-800 transition-all`}
                      >
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br ${mealColors[log.meal_type] || 'from-gray-100 to-gray-50'} flex-shrink-0`}>
                          {mealEmoji[log.meal_type] || 'ðŸ½ï¸'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[var(--foreground)] truncate">{log.product_name}</p>
                          <p className="text-xs text-[var(--muted)] mt-0.5 capitalize">
                            {log.quantity_g}g Â· {log.meal_type}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            {Math.round(log.calories || 0)}
                          </p>
                          <p className="text-xs text-[var(--muted)]">kcal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
```

## FILE: src/app/layout.tsx

`$lang
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import BottomNav from '@/components/BottomNav'
import ErrorBoundary from '@/components/ErrorBoundary'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'NutriScan â€” AI Food Health Advisor',
    template: '%s | NutriScan',
  },
  description: 'Scan any packaged food and get an instant AI health rating powered by Gemini. Detect harmful ingredients, get healthier alternatives, and track your meals.',
  keywords: ['food scanner', 'nutrition analyzer', 'AI health', 'food labels', 'harmful ingredients', 'calorie tracker', 'India FSSAI', 'Gemini AI'],
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NutriScan',
  },
  openGraph: {
    title: 'NutriScan â€” AI Food Health Advisor',
    description: 'Scan any packaged food and get an instant AI health rating',
    type: 'website',
    siteName: 'NutriScan',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <main className="pb-20 min-h-screen">
              {children}
            </main>
            <BottomNav />
            <ServiceWorkerRegister />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
```

## FILE: src/app/page.tsx

`$lang
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/auth/signin')
}
```

## FILE: src/app/privacy/page.tsx

`$lang
export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
 
      <h2>1. What We Collect</h2>
      <p>HealthOX collects the following information when you use our app:</p>
      <ul>
        <li>Your Google account name and email (for sign-in only)</li>
        <li>Food products you scan (barcode and product name)</li>
        <li>Meals you log (product name, quantity, meal type)</li>
        <li>Optional health profile information (age, weight, height, health conditions) that you provide voluntarily</li>
      </ul>
 
      <h2>2. How We Use Your Data</h2>
      <ul>
        <li>To provide personalised AI health analysis of food products</li>
        <li>To calculate your daily calorie and nutrition tracking</li>
        <li>To send weekly health summary emails (only if you opt in)</li>
        <li>We do NOT sell your data to any third party</li>
        <li>We do NOT use your data for advertising</li>
      </ul>
 
      <h2>3. Third-Party Services</h2>
      <p>We use the following trusted third-party services:</p>
      <ul>
        <li><strong>Google OAuth</strong> â€” for sign-in</li>
        <li><strong>Supabase</strong> â€” for secure data storage (servers in your region)</li>
        <li><strong>Google Gemini AI</strong> â€” for food health analysis (product data only, no personal data sent)</li>
        <li><strong>Resend</strong> â€” for sending emails</li>
        <li><strong>Open Food Facts</strong> â€” for product nutrition data</li>
      </ul>
 
      <h2>4. Your Rights</h2>
      <p>You can:</p>
      <ul>
        <li>Delete your account and all data at any time from your Profile page</li>
        <li>Unsubscribe from all emails at any time</li>
        <li>Request a copy of your data by emailing us</li>
      </ul>
 
      <h2>5. Data Retention</h2>
      <p>We retain your data as long as your account is active. When you delete your account, all personal data is permanently deleted within 30 days.</p>
 
      <h2>6. Health Disclaimer</h2>
      <p>HealthOX provides AI-generated food health information for educational purposes only. This is NOT medical advice. Always consult a qualified nutritionist or doctor for medical decisions. AI analysis may contain errors.</p>
 
      <h2>7. Contact</h2>
      <p>For privacy concerns: healthox.app@gmail.com</p>
    </div>
  )
}
```

## FILE: src/app/profile-setup/page.tsx

`$lang
"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: 'ðŸª‘' },
  { value: 'light', label: 'Lightly Active', desc: 'Light exercise 1â€“3 days/week', icon: 'ðŸš¶' },
  { value: 'moderate', label: 'Moderately Active', desc: 'Exercise 3â€“5 days/week', icon: 'ðŸƒ' },
  { value: 'active', label: 'Very Active', desc: 'Hard exercise 6â€“7 days/week', icon: 'âš¡' },
  { value: 'very_active', label: 'Extra Active', desc: 'Very hard exercise daily', icon: 'ðŸ”¥' },
]

const weightGoalOptions = [
  {
    value: 'lose',
    label: 'Lose Weight',
    desc: 'Calorie deficit of 500 kcal/day Â· ~0.5 kg/week loss',
    icon: 'ðŸ“‰',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.3)',
  },
  {
    value: 'maintain',
    label: 'Maintain Weight',
    desc: 'Stay at your current weight with balanced nutrition',
    icon: 'âš–ï¸',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    border: 'rgba(5,150,105,0.3)',
  },
  {
    value: 'gain',
    label: 'Gain Weight',
    desc: 'Calorie surplus of 300 kcal/day Â· lean muscle gain',
    icon: 'ðŸ“ˆ',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
  },
]

export default function ProfileSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [emailPrefs, setEmailPrefs] = useState({
    weekly_report_email: true,
    email_unsubscribed: false,
  })

  const [form, setForm] = useState({
    age: '',
    gender: '',
    weight_kg: '',
    height_cm: '',
    activity_level: 'moderate',
    weight_goal: 'maintain',
    is_diabetic: false,
    has_bp: false,
    is_vegetarian: false,
  })

  // Load existing profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile')
        const json = await res.json()
        if (json.success && json.data) {
          const d = json.data
          setEmailPrefs({
            weekly_report_email: d.weekly_report_email ?? true,
            email_unsubscribed: d.email_unsubscribed ?? false,
          })
          if (d.profile_completed) {
            setForm(prev => ({
              ...prev,
              age: d.age?.toString() || '',
              gender: d.gender || '',
              weight_kg: d.weight_kg?.toString() || '',
              height_cm: d.height_cm?.toString() || '',
              activity_level: d.activity_level || 'moderate',
              weight_goal: d.weight_goal || 'maintain',
              is_diabetic: d.is_diabetic || false,
              has_bp: d.has_bp || false,
              is_vegetarian: d.is_vegetarian || false,
            }))
          }
        }
      } catch (e) {
        console.log('Failed to load profile:', e)
      }
    }
    if (session) loadProfile()
  }, [session])

  function getBMIInfo(bmi: number) {
    if (bmi < 18.5) return {
      label: 'Underweight', color: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
      advice: 'Focus on nutritious calorie-dense foods to reach a healthy weight.',
    }
    if (bmi < 25) return {
      label: 'Normal weight', color: '#059669',
      bg: 'rgba(5,150,105,0.08)',
      advice: 'Great work! Maintain your balanced diet and active lifestyle.',
    }
    if (bmi < 30) return {
      label: 'Overweight', color: '#d97706',
      bg: 'rgba(217,119,6,0.08)',
      advice: 'Consider reducing processed foods and increasing physical activity.',
    }
    return {
      label: 'Obese', color: '#dc2626',
      bg: 'rgba(220,38,38,0.08)',
      advice: 'Consult a healthcare provider for a personalised weight management plan.',
    }
  }

  function getGoalLabel(goal: string) {
    return weightGoalOptions.find(g => g.value === goal)?.label || 'Maintain Weight'
  }

  async function handleSubmit() {
    if (!form.age || !form.gender || !form.weight_kg || !form.height_cm) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(form.age),
          gender: form.gender,
          weight_kg: parseFloat(form.weight_kg),
          height_cm: parseFloat(form.height_cm),
          activity_level: form.activity_level,
          weight_goal: form.weight_goal,
          is_diabetic: form.is_diabetic,
          has_bp: form.has_bp,
          is_vegetarian: form.is_vegetarian,
        })
      })
      const json = await res.json()
      if (json.success) {
        setResult(json)
        setStep(4)
        toast.success('Profile saved!')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
    setLoading(false)
  }

  async function saveEmailPrefs(newPrefs: typeof emailPrefs) {
    setSavingPrefs(true)
    try {
      const res = await fetch('/api/profile/email-prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs)
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Email preferences saved')
      } else {
        toast.error('Failed to save preferences')
      }
    } catch {
      toast.error('Network error')
    }
    setSavingPrefs(false)
  }

  const gradientStyle = {
    background: 'linear-gradient(135deg, #059669, #0ea5e9)',
  }

  const textGradientStyle = {
    background: 'linear-gradient(135deg, #059669, #0ea5e9)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center p-5 py-10">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
            style={gradientStyle}
          >
            <span className="text-2xl">ðŸ¥—</span>
          </div>
          <h1 className="text-2xl font-black mb-1" style={textGradientStyle}>HealthOX</h1>
          <p className="text-sm text-[var(--muted)]">
            {step === 4 ? 'Your profile is ready!' : `Step ${step} of 3`}
          </p>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: step >= s
                    ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                    : 'var(--card-border)'
                }}
              />
            ))}
          </div>
        )}

        {/* â•â•â• STEP 1 â€” Basic Info â•â•â• */}
        {step === 1 && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Basic Information</h2>
            <p className="text-xs text-[var(--muted)] mb-6">Used to calculate your BMI and personalised calorie goal</p>

            <div className="space-y-4">

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 22"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--card-border)] focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm outline-none transition-colors"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'male', label: 'ðŸ‘¨ Male' },
                    { value: 'female', label: 'ðŸ‘© Female' },
                  ].map(g => (
                    <button
                      key={g.value}
                      onClick={() => setForm({ ...form, gender: g.value })}
                      className="py-3.5 rounded-2xl border-2 text-sm font-bold transition-all"
                      style={{
                        borderColor: form.gender === g.value ? '#059669' : 'var(--card-border)',
                        background: form.gender === g.value
                          ? 'linear-gradient(135deg, rgba(5,150,105,0.1), rgba(14,165,233,0.05))'
                          : 'var(--card)',
                        color: form.gender === g.value ? '#059669' : 'var(--muted)',
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height + Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 170"
                    value={form.height_cm}
                    onChange={e => setForm({ ...form, height_cm: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--card-border)] focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 65"
                    value={form.weight_kg}
                    onChange={e => setForm({ ...form, weight_kg: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--card-border)] focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm outline-none transition-colors"
                  />
                </div>
              </div>

            </div>

            <button
              onClick={() => {
                if (!form.age || !form.gender || !form.weight_kg || !form.height_cm) {
                  toast.error('Please fill in all fields')
                  return
                }
                setStep(2)
              }}
              className="w-full mt-6 py-4 rounded-2xl text-white text-sm font-bold"
              style={{ ...gradientStyle, boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}
            >
              Continue â†’
            </button>
          </div>
        )}

        {/* â•â•â• STEP 2 â€” Weight Goal â•â•â• */}
        {step === 2 && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Your Goal</h2>
            <p className="text-xs text-[var(--muted)] mb-6">
              This sets your calorie target â€” we will calculate the exact amount based on your body data
            </p>

            <div className="space-y-3 mb-6">
              {weightGoalOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, weight_goal: opt.value })}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all"
                  style={{
                    borderColor: form.weight_goal === opt.value ? opt.border : 'var(--card-border)',
                    background: form.weight_goal === opt.value ? opt.bg : 'transparent',
                  }}
                >
                  <span className="text-3xl flex-shrink-0">{opt.icon}</span>
                  <div className="flex-1">
                    <p
                      className="text-sm font-bold mb-1"
                      style={{ color: form.weight_goal === opt.value ? opt.color : 'var(--foreground)' }}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">{opt.desc}</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: form.weight_goal === opt.value ? opt.color : 'var(--card-border)',
                      background: form.weight_goal === opt.value ? opt.color : 'transparent',
                    }}
                  >
                    {form.weight_goal === opt.value && (
                      <span className="text-white text-xs font-bold">âœ“</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Preview of what this means */}
            <div
              className="p-3 rounded-xl mb-6 text-xs text-[var(--muted)] leading-relaxed"
              style={{ background: 'var(--card-border)', opacity: 0.8 }}
            >
              {form.weight_goal === 'lose' && 'ðŸ“‰ We will set your calorie goal 500 kcal below your maintenance level, which leads to safe and steady weight loss of about 0.5 kg per week.'}
              {form.weight_goal === 'maintain' && 'âš–ï¸ We will match your calorie goal exactly to your energy needs so your weight stays stable while you stay nourished.'}
              {form.weight_goal === 'gain' && 'ðŸ“ˆ We will set your calorie goal 300 kcal above your maintenance level, which supports lean muscle gain without excessive fat.'}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[var(--card-border)] text-[var(--muted)] text-sm font-bold"
              >
                â† Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl text-white text-sm font-bold"
                style={{ ...gradientStyle, boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}
              >
                Continue â†’
              </button>
            </div>
          </div>
        )}

        {/* â•â•â• STEP 3 â€” Activity & Health â•â•â• */}
        {step === 3 && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Activity & Health</h2>
            <p className="text-xs text-[var(--muted)] mb-6">Helps us fine-tune your calorie target</p>

            {/* Activity level */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-[var(--foreground)] mb-3">Activity Level</label>
              <div className="space-y-2">
                {activityOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, activity_level: opt.value })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all"
                    style={{
                      borderColor: form.activity_level === opt.value ? '#059669' : 'var(--card-border)',
                      background: form.activity_level === opt.value
                        ? 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(14,165,233,0.04))'
                        : 'transparent',
                    }}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p
                        className="text-sm font-bold"
                        style={{ color: form.activity_level === opt.value ? '#059669' : 'var(--foreground)' }}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{opt.desc}</p>
                    </div>
                    {form.activity_level === opt.value && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                        style={{ background: '#059669' }}
                      >
                        âœ“
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Health conditions */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[var(--foreground)] mb-3">
                Health Conditions{' '}
                <span className="text-[var(--muted)] font-normal">(optional)</span>
              </label>
              <div className="space-y-2">
                {[
                  { key: 'is_diabetic', label: 'ðŸ©¸ Diabetic', desc: 'We will flag high sugar products' },
                  { key: 'has_bp', label: 'ðŸ’Š High Blood Pressure', desc: 'We will flag high sodium products' },
                  { key: 'is_vegetarian', label: 'ðŸ¥¦ Vegetarian', desc: 'We will note non-veg ingredients' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setForm({ ...form, [item.key]: !form[item.key as keyof typeof form] })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: form[item.key as keyof typeof form] ? '#059669' : 'var(--card-border)',
                      background: form[item.key as keyof typeof form] ? 'rgba(5,150,105,0.05)' : 'transparent',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 text-white transition-all"
                      style={{
                        borderColor: form[item.key as keyof typeof form] ? '#059669' : 'var(--card-border)',
                        background: form[item.key as keyof typeof form] ? '#059669' : 'transparent',
                        fontSize: '11px',
                      }}
                    >
                      {form[item.key as keyof typeof form] ? 'âœ“' : ''}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{item.label}</p>
                      <p className="text-xs text-[var(--muted)]">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[var(--card-border)] text-[var(--muted)] text-sm font-bold"
              >
                â† Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl text-white text-sm font-bold transition-all"
                style={{
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #059669, #0ea5e9)',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(5,150,105,0.3)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Calculating...' : 'Get My Goals â†’'}
              </button>
            </div>
          </div>
        )}

        {/* â•â•â• STEP 4 â€” Results â•â•â• */}
        {step === 4 && result && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)]">

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">ðŸŽ¯</div>
              <h2 className="text-xl font-black text-[var(--foreground)] mb-1">Your Personal Goals</h2>
              <p className="text-xs text-[var(--muted)]">Calculated just for your body and goal</p>
            </div>

            {/* BMI */}
            {(() => {
              const info = getBMIInfo(result.bmi)
              return (
                <div
                  className="rounded-2xl p-5 mb-4 text-center"
                  style={{ background: info.bg, border: `1px solid ${info.bg}` }}
                >
                  <p className="text-xs text-[var(--muted)] mb-1">Your BMI</p>
                  <p className="text-5xl font-black mb-2" style={{ color: info.color }}>
                    {result.bmi}
                  </p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                    style={{ background: info.color }}
                  >
                    {info.label}
                  </span>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{info.advice}</p>
                </div>
              )
            })()}

            {/* Calorie breakdown */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(14,165,233,0.04))',
                border: '1px solid rgba(5,150,105,0.2)',
              }}
            >
              <p className="text-xs text-[var(--muted)] text-center mb-3">Daily Calorie Goal</p>
              <p className="text-5xl font-black text-center mb-1" style={textGradientStyle}>
                {result.dailyCalorieGoal}
              </p>
              <p className="text-xs text-[var(--muted)] text-center mb-4">kcal per day</p>

              {/* Breakdown */}
              <div className="space-y-2 border-t border-[var(--card-border)] pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">Base Metabolic Rate</span>
                  <span className="text-xs font-bold text-[var(--foreground)]">{result.bmr} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">With Activity Level</span>
                  <span className="text-xs font-bold text-[var(--foreground)]">{result.tdee} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">Goal Adjustment</span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: result.weight_goal === 'lose'
                        ? '#3b82f6'
                        : result.weight_goal === 'gain'
                        ? '#f59e0b'
                        : '#059669'
                    }}
                  >
                    {result.weight_goal === 'lose' ? 'âˆ’ 500 kcal (deficit)' : result.weight_goal === 'gain' ? '+ 300 kcal (surplus)' : 'No change'}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center pt-2 border-t border-[var(--card-border)]"
                >
                  <span className="text-xs font-bold text-[var(--foreground)]">Your Daily Target</span>
                  <span className="text-sm font-black" style={{ color: '#059669' }}>
                    {result.dailyCalorieGoal} kcal
                  </span>
                </div>
              </div>
            </div>

            {/* Goal badge */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-6"
              style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}
            >
              <span className="text-xl">
                {result.weight_goal === 'lose' ? 'ðŸ“‰' : result.weight_goal === 'gain' ? 'ðŸ“ˆ' : 'âš–ï¸'}
              </span>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">Goal: {getGoalLabel(result.weight_goal)}</p>
                <p className="text-xs text-[var(--muted)]">
                  {result.weight_goal === 'lose'
                    ? 'Expected loss: ~0.5 kg per week at this calorie level'
                    : result.weight_goal === 'gain'
                    ? 'Expected gain: ~0.3 kg per week at this calorie level'
                    : 'Calorie matched to maintain your current weight'}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 rounded-2xl text-white text-sm font-bold"
              style={{ ...gradientStyle, boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}
            >
              Start Tracking with HealthOX â†’
            </button>
          </div>
        )}

        {/* â•â•â• EMAIL PREFERENCES â•â•â• */}
        <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)] mt-4">

          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(5,150,105,0.1)' }}
            >
              ðŸ“§
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">Email Preferences</h3>
              <p className="text-xs text-[var(--muted)]">Control which emails you receive</p>
            </div>
          </div>

          <div className="h-px bg-[var(--card-border)] mb-5" />

          <div className="space-y-4">

            {/* Weekly reports */}
            <div
              className="flex items-start gap-4 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                  ? 'rgba(5,150,105,0.3)'
                  : 'var(--card-border)',
                background: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                  ? 'rgba(5,150,105,0.04)'
                  : 'transparent',
              }}
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--foreground)] mb-1">ðŸ“Š Weekly Nutrition Reports</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Every Monday morning â€” your weekly calorie summary, macros, and insights delivered to your inbox
                </p>
              </div>
              <button
                onClick={() => {
                  if (emailPrefs.email_unsubscribed) {
                    toast.error('Re-subscribe from all emails first')
                    return
                  }
                  const newPrefs = { ...emailPrefs, weekly_report_email: !emailPrefs.weekly_report_email }
                  setEmailPrefs(newPrefs)
                  saveEmailPrefs(newPrefs)
                }}
                disabled={savingPrefs || emailPrefs.email_unsubscribed}
                className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 disabled:opacity-50"
                style={{
                  background: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                    ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                    : '#e5e7eb',
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{
                    left: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed ? '26px' : '2px',
                  }}
                />
              </button>
            </div>

            {/* Unsubscribe all */}
            <div
              className="flex items-start gap-4 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: emailPrefs.email_unsubscribed ? '#dc2626' : 'var(--card-border)',
                background: emailPrefs.email_unsubscribed ? 'rgba(220,38,38,0.04)' : 'transparent',
              }}
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--foreground)] mb-1">ðŸš« Unsubscribe from All Emails</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Stop all HealthOX emails. You can re-enable anytime by toggling this off.
                </p>
              </div>
              <button
                onClick={() => {
                  const newPrefs = {
                    email_unsubscribed: !emailPrefs.email_unsubscribed,
                    weekly_report_email: emailPrefs.email_unsubscribed ? true : false,
                  }
                  setEmailPrefs(newPrefs)
                  saveEmailPrefs(newPrefs)
                }}
                disabled={savingPrefs}
                className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 disabled:opacity-50"
                style={{ background: emailPrefs.email_unsubscribed ? '#dc2626' : '#e5e7eb' }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{ left: emailPrefs.email_unsubscribed ? '26px' : '2px' }}
                />
              </button>
            </div>

            {/* Warning */}
            {emailPrefs.email_unsubscribed && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <span className="flex-shrink-0">âš ï¸</span>
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                  You are unsubscribed from all HealthOX emails. Toggle off above to re-enable.
                </p>
              </div>
            )}

            {/* Status */}
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs font-bold text-[var(--foreground)] mb-2">Current Status</p>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted)]">Weekly reports</span>
                  <span className={`text-xs font-bold ${emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed ? 'text-emerald-600' : 'text-red-500'}`}>
                    {emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed ? 'âœ“ On' : 'âœ— Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted)]">All emails</span>
                  <span className={`text-xs font-bold ${!emailPrefs.email_unsubscribed ? 'text-emerald-600' : 'text-red-500'}`}>
                    {!emailPrefs.email_unsubscribed ? 'âœ“ Subscribed' : 'âœ— Unsubscribed'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col gap-3 mt-4">
          {step < 4 && (
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 rounded-2xl text-xs text-[var(--muted)] border border-[var(--card-border)] bg-[var(--card)] hover:text-[var(--foreground)] transition-colors"
            >
              â† Back to Dashboard
            </button>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="w-full py-3 rounded-2xl text-xs font-bold border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            ðŸšª Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}
```

## FILE: src/app/scan/page.tsx

`$lang
"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { event, AnalyticsEvents } from '@/lib/analytics'

const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false }
)

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Nutrition {
  calories: number
  protein:  number
  carbs:    number
  fat:      number
  sugar?:   number | null
  sodium?:  number | null
  fiber?:   number | null
}

interface PhotoExtras {
  mrp?:            number | null
  fssai?:          string | null
  net_weight?:     number | null
  health_claims?:  string[] | null
  certifications?: string[] | null
  variant?:        string | null
  confidence?:     string | null
  image_quality?:  string | null
  what_was_visible?: string | null
}

interface Product {
  barcode?:         string
  name:             string
  brand?:           string | null
  category?:        string | null
  country_of_origin?: string | null
  image_url?:       string | null
  source?:          string
  nutrition:        Nutrition
  serving_size_g?:  number | null
  ingredients_text?: string | null
  allergens?:       string[]
  additives?:       string[]
  _photo_extras?:   PhotoExtras
}

interface HarmfulIngredient {
  name:                     string
  also_known_as?:           string[]
  found_in_product?:        boolean
  concern:                  string
  severity:                 'high' | 'medium' | 'low'
  scientific_source?:       string
  source_url?:              string
  global_safe_limit?:       string
  amount_in_this_product?:  string
  personalized_safe_limit?: string
  percentage_of_daily_limit?: string
}

interface IngredientWarning {
  ingredient: string
  concern:    string
  severity:   'high' | 'medium' | 'low'
}

interface Alternative {
  name:          string
  reason?:       string
  availability?: string
  type?:         string
}

interface Analysis {
  health_rating:    'healthy' | 'moderate' | 'unhealthy'
  health_score:     number
  summary:          string
  personalized?:    boolean
  analyzed_at:      string
  health_score_breakdown?: {
    nutrition_score:         number
    ingredient_safety_score: number
    processing_score:        number
  }
  safe_consumption?: {
    amount?:                string
    frequency?:             string
    notes?:                 string
    personalized_for_user?: string
  }
  harmful_ingredients?:   HarmfulIngredient[]
  ingredient_warnings?:   IngredientWarning[]
  long_term_risks?:       string[]
  positives?:             string[]
  healthier_alternatives?: Alternative[]
  detailed_breakdown?:    Record<string, string>
  diabetic_suitability?:  string
  bp_suitability?:        string
  child_suitability?:     string
  pregnancy_suitability?: string
  fssai_compliance?:      string
}

// â”€â”€ Colour helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ratingColors: Record<string, string> = {
  healthy:   '#059669',
  moderate:  '#d97706',
  unhealthy: '#dc2626',
}
const ratingEmoji: Record<string, string> = {
  healthy:   'âœ…',
  moderate:  'âš ï¸',
  unhealthy: 'âŒ',
}
const ratingBg: Record<string, string> = {
  healthy:   'rgba(5,150,105,0.08)',
  moderate:  'rgba(217,119,6,0.08)',
  unhealthy: 'rgba(220,38,38,0.08)',
}

function scoreColor(s: number) {
  if (s >= 7.5) return '#059669'
  if (s >= 5.5) return '#d97706'
  if (s >= 3.5) return '#f97316'
  return '#dc2626'
}

const severityBorderColor = { high: 'rgba(220,38,38,0.3)', medium: 'rgba(217,119,6,0.3)', low: 'rgba(156,163,175,0.3)' }
const severityBg          = { high: 'rgba(220,38,38,0.08)', medium: 'rgba(217,119,6,0.08)', low: 'rgba(156,163,175,0.06)' }
const severityDotColor    = { high: '#dc2626', medium: '#d97706', low: '#6b7280' }
const severityDotEmoji    = { high: 'ðŸ”´', medium: 'ðŸŸ¡', low: 'ðŸŸ¢' }

const suitabilityColor = (v: string) =>
  v === 'suitable' ? '#059669' : v === 'consume_with_caution' ? '#d97706' : '#dc2626'
const suitabilityBg = (v: string) =>
  v === 'suitable' ? 'rgba(5,150,105,0.1)' : v === 'consume_with_caution' ? 'rgba(217,119,6,0.1)' : 'rgba(220,38,38,0.1)'
const suitabilityIcon = (v: string) =>
  v === 'suitable' ? 'âœ“' : v === 'consume_with_caution' ? 'âš ' : 'âœ—'

// â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function HealthScoreRing({ score, rating }: { score: number; rating: string }) {
  const color        = scoreColor(score)
  const radius       = 36
  const circumference = 2 * Math.PI * radius
  const progress     = (Math.min(Math.max(score, 0), 10) / 10) * circumference
  const gap          = circumference - progress

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${gap}`}
            style={{ transition: 'stroke-dasharray 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{score}</span>
          <span className="text-xs text-[var(--muted)]">/10</span>
        </div>
      </div>
      <span className="text-sm font-bold capitalize mt-1" style={{ color }}>
        {ratingEmoji[rating]} {rating}
      </span>
    </div>
  )
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[var(--muted)]">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score * 10}%`, background: color }}
        />
      </div>
    </div>
  )
}

// â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ScanPage() {
  const { data: session, status } = useSession()
  const isGuest = status === 'unauthenticated'

  const [showScanner,     setShowScanner]     = useState(false)
  const [showPhotoMode,   setShowPhotoMode]   = useState(false)
  const [product,         setProduct]         = useState<Product | null>(null)
  const [analysis,        setAnalysis]        = useState<Analysis | null>(null)
  const [loadingProduct,  setLoadingProduct]  = useState(false)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingPhoto,    setLoadingPhoto]    = useState(false)
  const [error,           setError]           = useState<string | null>(null)
  const [analysisError,   setAnalysisError]   = useState<string | null>(null)
  const [showVisionMode,  setShowVisionMode]  = useState(false)
  const [notFoundBarcode, setNotFoundBarcode] = useState<string | null>(null)
  const [visionStatus,    setVisionStatus]    = useState('')
  const [photoStatus,     setPhotoStatus]     = useState('')
  const [quantity,        setQuantity]        = useState(100)
  const [loggedMeal,      setLoggedMeal]      = useState<string | null>(null)
  const [activeTab,       setActiveTab]       = useState<'overview' | 'ingredients' | 'alternatives'>('overview')
  const [debugLog,        setDebugLog]        = useState<string[]>([])
  const [showDisclaimer,  setShowDisclaimer]  = useState(false)

  // Show disclaimer once per device
  useEffect(() => {
    if (!localStorage.getItem('hox_disclaimer')) {
      setShowDisclaimer(true)
      localStorage.setItem('hox_disclaimer', '1')
    }
  }, [])

  function debug(msg: string) {
    setDebugLog(prev => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  function resetScan() {
    setProduct(null)
    setAnalysis(null)
    setAnalysisError(null)
    setError(null)
    setShowVisionMode(false)
    setNotFoundBarcode(null)
    setLoggedMeal(null)
    setActiveTab('overview')
    setQuantity(100)
  }

  // â”€â”€ AI analysis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function runAnalysis(productData: Product) {
    setLoadingAnalysis(true)
    setAnalysisError(null)
    setAnalysis(null)

    try {
      debug('Sending to AI analysis...')
      debug(`Product: name="${productData.name}", nutrition keys=${Object.keys(productData.nutrition).join(',')}`)

      const res = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            barcode:           productData.barcode,
            name:              productData.name,
            brand:             productData.brand             ?? undefined,
            category:          productData.category          ?? undefined,
            country_of_origin: productData.country_of_origin ?? undefined,
            image_url:         productData.image_url         ?? undefined,
            nutrition: {
              calories: productData.nutrition?.calories ?? 0,
              protein:  productData.nutrition?.protein  ?? 0,
              carbs:    productData.nutrition?.carbs    ?? 0,
              fat:      productData.nutrition?.fat      ?? 0,
              sugar:    productData.nutrition?.sugar    ?? undefined,
              sodium:   productData.nutrition?.sodium   ?? undefined,
              fiber:    productData.nutrition?.fiber    ?? undefined,
            },
            ingredients_text: productData.ingredients_text ?? undefined,
            allergens:        productData.allergens         ?? [],
            additives:        productData.additives         ?? [],
          },
        }),
      })

      const text = await res.text()
      let json: { success: boolean; data?: Analysis; error?: string; details?: string }
      try {
        json = JSON.parse(text)
      } catch {
        debug(`ERROR: non-JSON response (${res.status}): ${text.slice(0, 200)}`)
        const msg = 'Server returned an invalid response. Check server logs.'
        setAnalysisError(msg)
        toast.error(msg)
        return
      }

      debug(`Analyze API: status=${res.status}, success=${json.success}`)

      if (!res.ok) {
        const errMsg = json.error || json.details || `Server error (${res.status})`
        debug(`ERROR: ${errMsg}`)
        setAnalysisError(errMsg)
        toast.error(errMsg)
        return
      }

      if (json.success && json.data) {
        const data = json.data
        debug(`Analysis: rating=${data.health_rating}, score=${data.health_score}`)
        debug(`  harmful_ingredients: ${data.harmful_ingredients?.length || 0}`)
        debug(`  alternatives: ${data.healthier_alternatives?.length || 0}`)

        setAnalysis(data)

        event(AnalyticsEvents.VIEW_ANALYSIS, {
          product_name:  productData.name,
          health_rating: data.health_rating,
          health_score:  data.health_score,
          source:        productData.source || 'unknown',
        })

        if (!isGuest && productData.barcode) {
          fetch('/api/scan-session', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              barcode:          productData.barcode,
              product_name:     productData.name,
              product_image:    productData.image_url,
              ai_health_rating: data.health_rating,
              ai_health_score:  data.health_score,
            }),
          }).catch(console.error)
        }
      } else {
        const errMsg = json.error || 'AI analysis failed. Please try again.'
        const detail = json.details ? ` â€” ${json.details}` : ''
        debug(`ERROR: ${errMsg}${detail}`)
        setAnalysisError(errMsg + detail)
        toast.error(errMsg)
      }
    } catch (e: unknown) {
      const msg = (e instanceof Error) ? e.message : String(e)
      debug(`FATAL: ${msg}`)
      setAnalysisError('Analysis failed: ' + msg)
      toast.error('Analysis failed: ' + msg)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  // â”€â”€ Barcode detected â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function handleBarcode(barcode: string) {
    setShowScanner(false)
    resetScan()
    setLoadingProduct(true)

    event(AnalyticsEvents.SCAN_BARCODE, { barcode })

    try {
      const res  = await fetch(`/api/scan?barcode=${barcode}`)
      const json = await res.json()
      setLoadingProduct(false)
      debug(`Scan API: success=${json.success}, source=${json.source}`)

      if (!json.success && json.error === 'PRODUCT_NOT_FOUND') {
        setNotFoundBarcode(barcode)
        setShowVisionMode(true)
        return
      }
      if (!json.success) {
        setError(json.message || 'Something went wrong. Please try again.')
        return
      }

      setProduct(json.data)
      setQuantity(json.data.serving_size_g || 100)
      debug(`Product: ${json.data.name}`)

      // Use cached AI analysis if already stored, otherwise run fresh
      if (json.data.ai_analysis) {
        setAnalysis(json.data.ai_analysis)
      } else {
        await runAnalysis(json.data)
      }
    } catch (e: unknown) {
      setLoadingProduct(false)
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
      setError(
        isOffline
          ? 'You appear to be offline. Check your connection and try again.'
          : 'Network error. Please check your connection and try again.'
      )
    }
  }

  // â”€â”€ Product photo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function handleProductPhoto(imageBase64: string) {
    setShowPhotoMode(false)
    resetScan()
    setLoadingPhoto(true)
    setPhotoStatus('ðŸ¤– Gemini is reading the product...')

    event(AnalyticsEvents.SCAN_PHOTO, {})

    try {
      const res  = await fetch('/api/scan-product-photo', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageBase64 }),
      })
      const json = await res.json()

      if (!json.success) {
        setLoadingPhoto(false)
        setError(
          res.status === 401
            ? 'Please sign in to scan product photos.'
            : json.error || 'Could not read the product. Try better lighting or a clearer angle.'
        )
        return
      }

      const extracted = json.data
      setPhotoStatus('âœ… Product identified! Running AI analysis...')
      if (json.message) toast.success(json.message)

      // If barcode extracted, try DB first
      if (extracted.barcode) {
        const scanRes  = await fetch(`/api/scan?barcode=${extracted.barcode}`)
        const scanJson = await scanRes.json()
        if (scanJson.success) {
          setLoadingPhoto(false)
          setProduct(scanJson.data)
          setQuantity(scanJson.data.serving_size_g || 100)
          await runAnalysis(scanJson.data)
          return
        }
      }

      const photoProduct: Product = {
        barcode:          extracted.barcode || `photo-${Date.now()}`,
        name:             extracted.name    || 'Unknown Product',
        brand:            extracted.brand   || null,
        category:         null,
        country_of_origin: extracted.country_of_origin || null,
        image_url:        null,
        source:           'gemini_photo',
        nutrition: {
          calories: extracted.nutrition_per_100g?.calories ?? 0,
          protein:  extracted.nutrition_per_100g?.protein  ?? 0,
          carbs:    extracted.nutrition_per_100g?.carbs    ?? 0,
          fat:      extracted.nutrition_per_100g?.fat      ?? 0,
          sugar:    extracted.nutrition_per_100g?.sugar    ?? null,
          sodium:   extracted.nutrition_per_100g?.sodium   ?? null,
          fiber:    extracted.nutrition_per_100g?.fiber    ?? null,
        },
        serving_size_g:   extracted.serving_size_g   || null,
        ingredients_text: extracted.ingredients_text || null,
        allergens:        extracted.allergens         || [],
        additives:        extracted.additives         || [],
        _photo_extras: {
          mrp:             extracted.mrp_rupees,
          fssai:           extracted.fssai_number,
          net_weight:      extracted.net_weight_g,
          health_claims:   extracted.health_claims,
          certifications:  extracted.certifications,
          variant:         extracted.variant,
          confidence:      extracted.confidence,
          image_quality:   extracted.image_quality,
          what_was_visible: extracted.what_was_visible,
        },
      }

      setProduct(photoProduct)
      setQuantity(extracted.serving_size_g || 100)

      // Save to DB for future scans (fire-and-forget)
      fetch('/api/products/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode:          photoProduct.barcode,
          name:             photoProduct.name,
          brand:            photoProduct.brand,
          ingredients_text: photoProduct.ingredients_text,
          allergens:        photoProduct.allergens,
          additives:        photoProduct.additives,
          nutrition_per_100g: extracted.nutrition_per_100g,
          source:           'gemini_photo',
        }),
      }).catch(() => {})

      await runAnalysis(photoProduct)
      setLoadingPhoto(false)

    } catch (e: unknown) {
      console.error('Photo scan error:', e)
      setLoadingPhoto(false)
      setError('Something went wrong. Please try again.')
    }
  }

  // â”€â”€ Vision label capture (not-found flow) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function handleVisionCapture(imageBase64: string) {
    setVisionStatus('ðŸ¤– Gemini is reading the label...')

    try {
      const res  = await fetch('/api/scan-vision', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageBase64, mode: 'full_label' }),
      })
      const json = await res.json()

      if (!json.success || !json.data) {
        setVisionStatus(`âŒ ${json.error || 'Could not read label'}`)
        toast.error(json.tip || 'Try better lighting or use manual barcode entry')
        if (res.status === 401) toast.error('Please sign in to scan product labels')
        return
      }

      const extracted = json.data
      setVisionStatus('âœ… Label read! Looking up product...')

      if (extracted.barcode) {
        setShowVisionMode(false)
        setLoadingProduct(true)
        const scanRes  = await fetch(`/api/scan?barcode=${extracted.barcode}`)
        const scanJson = await scanRes.json()
        setLoadingProduct(false)
        if (scanJson.success) {
          setProduct(scanJson.data)
          setQuantity(scanJson.data.serving_size_g || 100)
          await runAnalysis(scanJson.data)
          return
        }
      }

      setVisionStatus('ðŸ’¾ Saving product to Indian database...')
      const submitRes  = await fetch('/api/products/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extracted,
          barcode: extracted.barcode || notFoundBarcode || `vision-${Date.now()}`,
        }),
      })
      const submitJson = await submitRes.json()

      if (submitJson.success) {
        setShowVisionMode(false)
        const visionProduct: Product = {
          barcode:         submitJson.data.barcode,
          name:            submitJson.data.name || extracted.name,
          brand:           submitJson.data.brand,
          source:          'gemini_vision',
          nutrition: {
            calories: submitJson.data.calories_per_100g ?? 0,
            protein:  submitJson.data.protein_per_100g  ?? 0,
            carbs:    submitJson.data.carbs_per_100g    ?? 0,
            fat:      submitJson.data.fat_per_100g      ?? 0,
            sugar:    submitJson.data.sugar_per_100g    ?? null,
            sodium:   submitJson.data.sodium_per_100g   ?? null,
          },
          ingredients_text: submitJson.data.ingredients_text,
          allergens:        submitJson.data.allergens || [],
          additives:        submitJson.data.additives || [],
        }
        setProduct(visionProduct)
        await runAnalysis(visionProduct)
      }
    } catch {
      setVisionStatus('âŒ Something went wrong. Please try again.')
    }
  }

  // â”€â”€ Meal logging â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function handleLogMeal(mealType: string) {
    if (!product) return
    if (isGuest) {
      toast.error('Please sign in to log meals and track calories')
      return
    }

    try {
      const res  = await fetch('/api/log', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name:      product.name,
          barcode:           product.barcode || null,
          quantity_g:        quantity,
          calories_per_100g: product.nutrition?.calories || 0,
          protein_per_100g:  product.nutrition?.protein  || 0,
          carbs_per_100g:    product.nutrition?.carbs    || 0,
          fat_per_100g:      product.nutrition?.fat      || 0,
          sodium_per_100g:   product.nutrition?.sodium   || 0,
          meal_type:         mealType,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setLoggedMeal(mealType)
        toast.success(`âœ… Logged ${quantity}g as ${mealType}!`)
        event(AnalyticsEvents.LOG_MEAL, {
          product_name: product.name,
          meal_type:    mealType,
          quantity_g:   quantity,
          calories:     Math.round((product.nutrition?.calories || 0) * quantity / 100),
        })
      } else {
        toast.error(json.error || 'Failed to log. Make sure you are signed in.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
  }

  // â”€â”€ Derived values â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const gradStyle    = { background: 'linear-gradient(135deg, #059669, #0ea5e9)' }
  const harmfulCount = analysis?.harmful_ingredients?.filter(h => h.found_in_product !== false).length || 0
  const highSevCount = analysis?.harmful_ingredients?.filter(h => h.severity === 'high' && h.found_in_product !== false).length || 0

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* â”€â”€ Health disclaimer (once per device) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end p-4">
          <div className="bg-[var(--card)] rounded-2xl p-6 w-full max-w-sm mx-auto shadow-2xl">
            <p className="text-2xl mb-3 text-center">âš•ï¸</p>
            <h3 className="text-base font-bold text-[var(--foreground)] text-center mb-2">Health Disclaimer</h3>
            <p className="text-sm text-[var(--muted)] text-center leading-relaxed mb-5">
              HealthOX provides AI-generated food health information for{' '}
              <strong>educational purposes only.</strong>{' '}
              This is <strong>not medical advice.</strong> Consult a nutritionist or doctor before making dietary changes.
            </p>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full py-3 text-white font-bold rounded-xl text-sm"
              style={gradStyle}
            >
              I Understand â€” Continue
            </button>
          </div>
        </div>
      )}

      {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="px-5 pt-12 pb-6" style={gradStyle}>
        <h1 className="text-2xl font-black text-white mb-1">HealthOX Scanner</h1>
        <p className="text-emerald-100 text-sm">
          {isGuest
            ? 'Guest mode â€” sign in to save and track your meals'
            : 'Scan barcodes or take a product photo for instant AI health ratings'}
        </p>
        {isGuest && (
          <div className="mt-3 px-3 py-2 bg-white/20 rounded-xl border border-white/30">
            <p className="text-white text-xs">
              ðŸ‘¤ You are in guest mode.{' '}
              <a href="/auth/signin" className="underline font-bold">Sign in</a>
              {' '}to save history and track calories.
            </p>
          </div>
        )}
      </div>

      <div className="px-4 py-5 max-w-lg mx-auto">

        {/* â”€â”€ Scan mode buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => { setShowScanner(true); resetScan() }}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
            style={{ ...gradStyle, boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}
          >
            <span className="text-3xl">ðŸ“·</span>
            <span>Scan Barcode</span>
            <span className="text-xs opacity-80 font-normal">Point at barcode</span>
          </button>

          <button
            onClick={() => { setShowPhotoMode(true); resetScan() }}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl font-bold text-sm transition-all active:scale-95 border-2"
            style={{
              borderColor: 'rgba(5,150,105,0.3)',
              background:  'rgba(5,150,105,0.06)',
              color:       '#059669',
            }}
          >
            <span className="text-3xl">ðŸ–¼ï¸</span>
            <span>Photo Mode</span>
            <span className="text-xs opacity-70 font-normal">Snap the whole product</span>
          </button>
        </div>

        {/* â”€â”€ Loading: product lookup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {(loadingProduct || loadingPhoto) && (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
            <p className="text-sm text-[var(--muted)]">
              {loadingPhoto ? photoStatus : 'ðŸ” Looking up product...'}
            </p>
          </div>
        )}

        {/* â”€â”€ Loading: AI analysis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {loadingAnalysis && (
          <div className="rounded-2xl p-6 bg-[var(--card)] border border-[var(--card-border)] shadow-sm mb-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-36 h-36 relative">
                <svg className="w-full h-full -rotate-90 animate-spin" viewBox="0 0 120 120"
                  style={{ animationDuration: '2s' }}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10"
                    className="text-gray-100 dark:text-gray-800" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#10b981" strokeWidth="10"
                    strokeLinecap="round" strokeDasharray="326" strokeDashoffset="244" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-emerald-500 text-center leading-tight px-2">
                    Analysing...
                  </span>
                </div>
              </div>
              <div className="space-y-2.5 w-full">
                {['Checking ingredients...', 'Detecting harmful additives...', 'Calculating health score...'].map((msg, i) => (
                  <div key={i} className="flex items-center gap-2.5 animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}>
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0" />
                    <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 flex-grow" />
                    <span className="text-xs text-gray-400 whitespace-nowrap">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* â”€â”€ Analysis error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {analysisError && !loadingAnalysis && (
          <div className="rounded-2xl p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">âš ï¸</span>
              <p className="flex-1 text-sm font-semibold text-red-700 dark:text-red-400">{analysisError}</p>
              <button
                onClick={() => product && runAnalysis(product)}
                className="flex-shrink-0 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400
                  text-xs font-semibold rounded-xl hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* â”€â”€ Scan error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {error && (
          <div className="p-4 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 mb-4">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">âŒ {error}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setError(null)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700
                  dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-200 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={() => { setError(null); setShowScanner(true) }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-gray-800
                  text-[var(--foreground)] border border-[var(--card-border)] hover:bg-gray-50 transition-colors"
              >
                ðŸ”„ Try Again
              </button>
              <button
                onClick={() => { setError(null); setShowPhotoMode(true) }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-gray-800
                  text-[var(--foreground)] border border-[var(--card-border)] hover:bg-gray-50 transition-colors"
              >
                ðŸ“· Photo Mode
              </button>
            </div>
          </div>
        )}

        {/* â”€â”€ Vision mode (product not found) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {showVisionMode && (
          <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] mb-4">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">ðŸ‡®ðŸ‡³</span>
              <div>
                <p className="text-sm font-bold text-[var(--foreground)]">Product not in database</p>
                <p className="text-xs text-[var(--muted)]">
                  Barcode <span className="font-mono text-[var(--foreground)]">{notFoundBarcode}</span> was not found.
                  Take a photo of the nutrition label to add it to our Indian database.
                </p>
              </div>
            </div>
            {visionStatus && (
              <div className="p-3 rounded-xl text-xs mb-3"
                style={{ background: 'rgba(5,150,105,0.08)', color: '#059669' }}>
                {visionStatus}
              </div>
            )}
            <VisionCapture onCapture={handleVisionCapture} />
          </div>
        )}

        {/* â”€â”€ Product card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {product && !loadingProduct && !loadingPhoto && (
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--card-border)] shadow-sm mb-4 overflow-hidden">

            {product.image_url && (
              <div className="relative w-full h-48 bg-gray-50 dark:bg-slate-800">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 520px) 100vw, 520px"
                />
              </div>
            )}

            <div className="p-5">

              {/* Source badge */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {product.source === 'gemini_vision' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400"
                    style={{ background: 'rgba(245,158,11,0.1)' }}>
                    ðŸ‡®ðŸ‡³ Added to Indian DB
                  </span>
                )}
                {product.source === 'gemini_photo' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-sky-700 dark:text-sky-400"
                    style={{ background: 'rgba(14,165,233,0.1)' }}>
                    ðŸ“¸ Read from photo
                  </span>
                )}
                {product.source === 'cache' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400"
                    style={{ background: 'rgba(5,150,105,0.1)' }}>
                    âœ… In our database
                  </span>
                )}
                {product.source === 'open_food_facts' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-purple-700 dark:text-purple-400"
                    style={{ background: 'rgba(139,92,246,0.1)' }}>
                    ðŸŒ Open Food Facts
                  </span>
                )}
                {product.source === 'upc_item_db' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-blue-700 dark:text-blue-400"
                    style={{ background: 'rgba(59,130,246,0.1)' }}>
                    ðŸ” UPC Database
                  </span>
                )}
              </div>

              <h2 className="text-xl font-black text-[var(--foreground)] mb-1">{product.name}</h2>
              {product.brand && (
                <p className="text-sm text-[var(--muted)] mb-4">{product.brand}</p>
              )}

              {/* Photo extras (MRP, FSSAI, etc.) */}
              {product._photo_extras && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {product._photo_extras.mrp && (
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <p className="text-xs text-[var(--muted)]">MRP</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">â‚¹{product._photo_extras.mrp}</p>
                    </div>
                  )}
                  {product._photo_extras.net_weight && (
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <p className="text-xs text-[var(--muted)]">Net Weight</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">{product._photo_extras.net_weight}g</p>
                    </div>
                  )}
                  {product._photo_extras.fssai && (
                    <div className="col-span-2 p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <p className="text-xs text-[var(--muted)]">FSSAI License</p>
                      <p className="text-xs font-mono text-[var(--foreground)]">{product._photo_extras.fssai}</p>
                    </div>
                  )}
                  {product._photo_extras.certifications && product._photo_extras.certifications.length > 0 && (
                    <div className="col-span-2 p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <p className="text-xs text-[var(--muted)] mb-1">Certifications</p>
                      <div className="flex gap-1 flex-wrap">
                        {product._photo_extras.certifications.map((c, i) => (
                          <span key={i}
                            className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Macros grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Calories', value: Math.round(product.nutrition?.calories || 0), unit: 'kcal' },
                  { label: 'Protein',  value: product.nutrition?.protein ?? 0,              unit: 'g'    },
                  { label: 'Carbs',    value: product.nutrition?.carbs   ?? 0,              unit: 'g'    },
                  { label: 'Fat',      value: product.nutrition?.fat     ?? 0,              unit: 'g'    },
                ].map(item => (
                  <div key={item.label} className="rounded-xl p-2 text-center"
                    style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.1)' }}>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{item.value}</p>
                    <p className="text-xs text-[var(--muted)]">{item.unit}</p>
                    <p className="text-xs text-[var(--muted)]">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Sugar / sodium / fiber row */}
              {(product.nutrition?.sugar != null || product.nutrition?.sodium != null || product.nutrition?.fiber != null) && (
                <div className="flex gap-3 mb-4 flex-wrap">
                  {product.nutrition?.sugar  != null && (
                    <div className="text-xs text-[var(--muted)]">
                      Sugar: <span className="font-bold text-[var(--foreground)]">{product.nutrition.sugar}g</span>
                    </div>
                  )}
                  {product.nutrition?.sodium != null && (
                    <div className="text-xs text-[var(--muted)]">
                      Sodium: <span className="font-bold text-[var(--foreground)]">{product.nutrition.sodium}mg</span>
                    </div>
                  )}
                  {product.nutrition?.fiber  != null && (
                    <div className="text-xs text-[var(--muted)]">
                      Fiber: <span className="font-bold text-[var(--foreground)]">{product.nutrition.fiber}g</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-[var(--muted)] mb-4">Per 100g Â· Source: {product.source}</p>

              {/* Quantity selector */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[var(--foreground)] mb-2">
                  How much did you eat?
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(10, q - 10))}
                    className="w-10 h-10 rounded-xl border-2 border-[var(--card-border)] flex items-center justify-center
                      text-lg font-bold text-[var(--foreground)] hover:border-emerald-400 transition-colors"
                  >âˆ’</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center py-2.5 rounded-xl border-2 border-[var(--card-border)]
                      focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm font-bold outline-none"
                  />
                  <button
                    onClick={() => setQuantity(q => Math.min(2000, q + 10))}
                    className="w-10 h-10 rounded-xl border-2 border-[var(--card-border)] flex items-center justify-center
                      text-lg font-bold text-[var(--foreground)] hover:border-emerald-400 transition-colors"
                  >+</button>
                  <span className="text-sm font-bold text-[var(--muted)]">g</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1.5 text-center">
                  = {Math.round((product.nutrition?.calories || 0) * quantity / 100)} kcal total
                </p>
              </div>

              {/* Meal log buttons */}
              {loggedMeal ? (
                <div className="p-3 rounded-xl text-center text-sm font-bold text-emerald-700 dark:text-emerald-400"
                  style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}>
                  âœ… Logged {quantity}g as {loggedMeal}!
                  <button
                    onClick={() => setLoggedMeal(null)}
                    className="block mx-auto mt-1 text-xs font-normal text-[var(--muted)] underline"
                  >
                    Log again with different meal type
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)] mb-2">Log as:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'breakfast', icon: 'ðŸŒ…' },
                      { type: 'lunch',     icon: 'â˜€ï¸' },
                      { type: 'dinner',    icon: 'ðŸŒ™' },
                      { type: 'snack',     icon: 'ðŸŽ' },
                    ].map(m => (
                      <button
                        key={m.type}
                        onClick={() => handleLogMeal(m.type)}
                        className="py-2.5 rounded-xl text-xs font-bold capitalize transition-all active:scale-95 border-2"
                        style={{
                          borderColor: 'rgba(5,150,105,0.3)',
                          background:  'rgba(5,150,105,0.06)',
                          color:       '#059669',
                        }}
                      >
                        {m.icon} {m.type}
                      </button>
                    ))}
                  </div>
                  {isGuest && (
                    <p className="text-xs text-center text-[var(--muted)] mt-2">
                      <a href="/auth/signin" className="text-emerald-600 underline font-bold">Sign in</a> to save meal logs
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            AI ANALYSIS CARD
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {analysis && (
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--card-border)] shadow-sm mb-4 overflow-hidden">

            {/* Header with score ring */}
            <div className="p-5 border-b border-[var(--card-border)]"
              style={{ background: ratingBg[analysis.health_rating] || 'rgba(107,114,128,0.04)' }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-[var(--muted)] mb-1">ðŸ¤– AI Health Analysis</p>
                  <p className="text-sm text-[var(--foreground)] leading-relaxed">{analysis.summary}</p>
                  {analysis.personalized && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
                      âœ¨ Personalised for your profile
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <HealthScoreRing score={Number(analysis.health_score) || 0} rating={analysis.health_rating} />
                </div>
              </div>
            </div>

            {/* Score breakdown bars */}
            {analysis.health_score_breakdown && (
              <div className="px-5 py-4 border-b border-[var(--card-border)]">
                <p className="text-xs font-bold text-[var(--foreground)] mb-3">ðŸ“Š Score Breakdown</p>
                <div className="space-y-2">
                  <ScoreBar label="Nutrition Quality"  score={analysis.health_score_breakdown.nutrition_score}         color="#059669" />
                  <ScoreBar label="Ingredient Safety"  score={analysis.health_score_breakdown.ingredient_safety_score}
                    color={scoreColor(analysis.health_score_breakdown.ingredient_safety_score)} />
                  <ScoreBar label="Processing Level"   score={analysis.health_score_breakdown.processing_score}        color="#0ea5e9" />
                </div>
              </div>
            )}

            {/* Harmful count banner */}
            {harmfulCount > 0 && (
              <div className="px-5 py-3 border-b border-[var(--card-border)]"
                style={{ background: highSevCount > 0 ? 'rgba(220,38,38,0.06)' : 'rgba(217,119,6,0.06)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{highSevCount > 0 ? 'ðŸš¨' : 'âš ï¸'}</span>
                  <div>
                    <p className="text-xs font-bold"
                      style={{ color: highSevCount > 0 ? '#dc2626' : '#d97706' }}>
                      {harmfulCount} harmful ingredient{harmfulCount > 1 ? 's' : ''} detected
                      {highSevCount > 0 ? ` Â· ${highSevCount} high severity` : ''}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      Tap &quot;Ingredients&quot; tab below for detailed scientific analysis
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-[var(--card-border)]">
              {[
                { key: 'overview',      label: 'ðŸ“‹ Overview' },
                { key: 'ingredients',   label: `ðŸ§ª Ingredients${harmfulCount > 0 ? ` (${harmfulCount})` : ''}` },
                { key: 'alternatives',  label: 'ðŸ¥— Alternatives' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className="flex-1 py-2.5 text-xs font-bold transition-all"
                  style={{
                    color:        activeTab === tab.key ? '#059669' : 'var(--muted)',
                    borderBottom: activeTab === tab.key ? '2px solid #059669' : '2px solid transparent',
                    background:   activeTab === tab.key ? 'rgba(5,150,105,0.04)' : 'transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* â”€â”€ OVERVIEW TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {activeTab === 'overview' && (
              <div className="p-5 space-y-4">

                {/* Suitability badges */}
                {[analysis.diabetic_suitability, analysis.bp_suitability, analysis.child_suitability, analysis.pregnancy_suitability].some(Boolean) && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">ðŸ‘¤ Suitability</p>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { key: 'diabetic_suitability', label: 'ðŸ©¸ Diabetic'  },
                        { key: 'bp_suitability',       label: 'ðŸ’Š BP'        },
                        { key: 'child_suitability',    label: 'ðŸ‘¶ Children'  },
                        { key: 'pregnancy_suitability',label: 'ðŸ¤° Pregnancy' },
                      ].map(item => {
                        const val = analysis[item.key as keyof Analysis] as string | undefined
                        if (!val) return null
                        return (
                          <span key={item.key} className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: suitabilityBg(val), color: suitabilityColor(val) }}>
                            {item.label} {suitabilityIcon(val)}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Safe consumption */}
                {analysis.safe_consumption && (
                  <div className="p-4 rounded-xl"
                    style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-3">âœ… Safe Consumption</p>
                    <div className="space-y-1.5">
                      {analysis.safe_consumption.amount && (
                        <p className="text-xs text-[var(--foreground)]">
                          <strong>Amount:</strong> {analysis.safe_consumption.amount}
                        </p>
                      )}
                      {analysis.safe_consumption.frequency && (
                        <p className="text-xs text-[var(--foreground)]">
                          <strong>Frequency:</strong> {analysis.safe_consumption.frequency}
                        </p>
                      )}
                      {analysis.safe_consumption.notes && (
                        <p className="text-xs text-[var(--muted)] pt-1 border-t border-[var(--card-border)]">
                          ðŸ’¡ {analysis.safe_consumption.notes}
                        </p>
                      )}
                      {analysis.safe_consumption.personalized_for_user && (
                        <div className="pt-2 border-t border-[var(--card-border)]">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1"
                            style={{ background: 'rgba(5,150,105,0.15)', color: '#059669' }}>
                            âœ¨ Your personalised limit
                          </span>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            {analysis.safe_consumption.personalized_for_user}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Positives */}
                {analysis.positives && analysis.positives.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">ðŸ‘ What is good</p>
                    <div className="space-y-1">
                      {analysis.positives.map((p, i) => (
                        <div key={i} className="text-xs text-[var(--foreground)] px-3 py-2 rounded-lg flex items-start gap-2"
                          style={{ background: 'rgba(5,150,105,0.06)' }}>
                          <span className="text-emerald-500 flex-shrink-0">â€¢</span> {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Long-term risks */}
                {analysis.long_term_risks && analysis.long_term_risks.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">â³ Long-Term Risks</p>
                    <div className="space-y-1">
                      {analysis.long_term_risks.map((risk, i) => (
                        <div key={i} className="text-xs text-[var(--foreground)] px-3 py-2 rounded-lg flex items-start gap-2"
                          style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.1)' }}>
                          <span className="text-red-400 flex-shrink-0 mt-0.5">âš </span> {risk}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed breakdown */}
                {analysis.detailed_breakdown && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">ðŸ“Š Detailed Breakdown</p>
                    <div className="space-y-2">
                      {(['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber'] as const).map(key => {
                        const val = analysis.detailed_breakdown![key]
                        if (!val) return null
                        const lower  = val.toLowerCase()
                        const isGood = lower.startsWith('good') || lower.startsWith('low')
                        const isBad  = lower.startsWith('high') || lower.startsWith('very high')
                        return (
                          <div key={key} className="flex items-start gap-2 py-1.5 border-b border-[var(--card-border)] last:border-0">
                            <span className="text-xs flex-shrink-0 w-14 font-bold text-[var(--muted)] capitalize">{key}</span>
                            <span className="text-xs"
                              style={{ color: isGood ? '#059669' : isBad ? '#dc2626' : 'var(--foreground)' }}>
                              {val}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* FSSAI compliance */}
                {analysis.fssai_compliance && analysis.fssai_compliance !== 'unknown' && (
                  <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium ${
                    analysis.fssai_compliance === 'compliant'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                    style={{
                      background: analysis.fssai_compliance === 'compliant' ? 'rgba(5,150,105,0.06)' : 'rgba(217,119,6,0.06)',
                      border:     analysis.fssai_compliance === 'compliant' ? '1px solid rgba(5,150,105,0.15)' : '1px solid rgba(217,119,6,0.15)',
                    }}>
                    ðŸ›¡ï¸ FSSAI:{' '}
                    {analysis.fssai_compliance === 'compliant'
                      ? 'No compliance concerns detected'
                      : 'Possible FSSAI compliance concern'}
                  </div>
                )}

                <p className="text-xs text-[var(--muted)]">
                  Analysed by Gemini AI Â· {new Date(analysis.analyzed_at).toLocaleDateString()}
                  {analysis.personalized && ' Â· Personalised analysis'}
                </p>
              </div>
            )}

            {/* â”€â”€ INGREDIENTS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {activeTab === 'ingredients' && (
              <div className="p-5 space-y-4">

                {harmfulCount > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs font-bold text-[var(--foreground)]">ðŸš¨ Harmful Ingredients Found</p>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: '#dc2626' }}>
                        {harmfulCount}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(analysis.harmful_ingredients || [])
                        .filter(h => h.found_in_product !== false)
                        .sort((a, b) => {
                          const order = { high: 0, medium: 1, low: 2 }
                          return order[a.severity] - order[b.severity]
                        })
                        .map((h, i) => (
                          <div key={i} className="rounded-2xl overflow-hidden border"
                            style={{ borderColor: severityBorderColor[h.severity] }}>

                            <div className="px-4 py-3 flex items-center justify-between"
                              style={{ background: severityBg[h.severity] }}>
                              <div className="flex items-center gap-2">
                                <span className="text-base">{severityDotEmoji[h.severity]}</span>
                                <div>
                                  <p className="text-sm font-black text-[var(--foreground)]">{h.name}</p>
                                  {h.also_known_as && h.also_known_as.length > 0 && (
                                    <p className="text-xs text-[var(--muted)]">
                                      Also: {h.also_known_as.slice(0, 2).join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize text-white"
                                style={{ background: severityDotColor[h.severity] }}>
                                {h.severity} risk
                              </span>
                            </div>

                            <div className="px-4 py-3 border-b border-[var(--card-border)]">
                              <p className="text-xs text-[var(--foreground)] leading-relaxed">{h.concern}</p>
                            </div>

                            {h.amount_in_this_product && (
                              <div className="px-4 py-2 border-b border-[var(--card-border)] bg-gray-50 dark:bg-slate-800/50">
                                <p className="text-xs text-[var(--muted)]">
                                  ðŸ“Š <span className="font-bold text-[var(--foreground)]">{h.amount_in_this_product}</span>
                                  {h.percentage_of_daily_limit && ` Â· ${h.percentage_of_daily_limit}`}
                                </p>
                              </div>
                            )}

                            <div className="px-4 py-3 border-b border-[var(--card-border)]">
                              {h.global_safe_limit && (
                                <div className="mb-2">
                                  <p className="text-xs font-bold text-[var(--muted)] mb-0.5">ðŸŒ Global Safe Limit</p>
                                  <p className="text-xs text-[var(--foreground)]">{h.global_safe_limit}</p>
                                </div>
                              )}
                              {h.personalized_safe_limit && (
                                <div className="pt-2 border-t border-[var(--card-border)]">
                                  <p className="text-xs font-bold mb-0.5" style={{ color: '#059669' }}>
                                    âœ¨ Your personalised limit
                                  </p>
                                  <p className="text-xs text-[var(--foreground)]">{h.personalized_safe_limit}</p>
                                </div>
                              )}
                            </div>

                            {h.scientific_source && (
                              <div className="px-4 py-2.5" style={{ background: 'rgba(14,165,233,0.04)' }}>
                                <p className="text-xs text-[var(--muted)] mb-1">ðŸ“š Scientific Source</p>
                                <p className="text-xs font-bold text-[var(--foreground)] mb-1">{h.scientific_source}</p>
                                {h.source_url && (
                                  <a href={h.source_url} target="_blank" rel="noopener noreferrer"
                                    className="text-xs underline break-all" style={{ color: '#0ea5e9' }}>
                                    {h.source_url}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">âœ…</div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      No harmful ingredients detected
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      This product does not contain any of the 20+ harmful substances we screen for
                    </p>
                  </div>
                )}

                {/* Ingredient warnings (minor) */}
                {analysis.ingredient_warnings && analysis.ingredient_warnings.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">âš ï¸ Other Ingredient Notes</p>
                    <div className="space-y-2">
                      {analysis.ingredient_warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl border-l-4"
                          style={{
                            background:   severityBg[w.severity],
                            borderColor:  severityDotColor[w.severity],
                          }}>
                          <span className="text-sm flex-shrink-0">{severityDotEmoji[w.severity]}</span>
                          <div>
                            <p className="text-xs font-bold text-[var(--foreground)]">{w.ingredient}</p>
                            <p className="text-xs text-[var(--muted)]">{w.concern}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl text-xs text-[var(--muted)] leading-relaxed"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--card-border)' }}>
                  â„¹ï¸ Analysis based on WHO, FSSAI, ICMR and EFSA guidelines. Sources are provided for verification.
                  This is informational â€” consult a healthcare professional for medical advice.
                </div>
              </div>
            )}

            {/* â”€â”€ ALTERNATIVES TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {activeTab === 'alternatives' && (
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)] mb-1">ðŸ¥— Healthier Alternatives</p>
                  <p className="text-xs text-[var(--muted)] mb-3">
                    Specific Indian alternatives that are better for your health
                  </p>

                  {analysis.healthier_alternatives && analysis.healthier_alternatives.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.healthier_alternatives.map((alt, i) => {
                        const typeColors: Record<string, string> = {
                          branded:    'rgba(139,92,246,0.1)',
                          homemade:   'rgba(5,150,105,0.1)',
                          whole_food: 'rgba(14,165,233,0.1)',
                        }
                        const typeLabels: Record<string, string> = {
                          branded:    'ðŸ·ï¸ Brand',
                          homemade:   'ðŸ  Homemade',
                          whole_food: 'ðŸŒ¾ Whole food',
                        }
                        return (
                          <div key={i} className="p-4 rounded-2xl border border-[var(--card-border)]"
                            style={{ background: 'rgba(5,150,105,0.03)' }}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                  style={{ background: 'rgba(5,150,105,0.1)' }}>
                                  {alt.type === 'homemade' ? 'ðŸ ' : alt.type === 'whole_food' ? 'ðŸŒ¾' : 'âœ…'}
                                </div>
                                <p className="text-sm font-bold text-[var(--foreground)]">{alt.name}</p>
                              </div>
                              {alt.type && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                                  style={{
                                    background: typeColors[alt.type] || 'rgba(0,0,0,0.06)',
                                    color: 'var(--foreground)',
                                  }}>
                                  {typeLabels[alt.type] || alt.type}
                                </span>
                              )}
                            </div>
                            {alt.reason && (
                              <p className="text-xs text-[var(--muted)] leading-relaxed ml-10">{alt.reason}</p>
                            )}
                            {alt.availability && (
                              <p className="text-xs ml-10 mt-1" style={{ color: '#059669' }}>
                                ðŸ“ {alt.availability.replace(/_/g, ' ')}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-[var(--muted)] text-sm">
                      No alternatives available for this product
                    </div>
                  )}
                </div>

                {analysis.health_rating !== 'healthy' && (
                  <div className="p-4 rounded-2xl"
                    style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">ðŸ’š Why switch?</p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Switching to healthier alternatives even 2â€“3 times a week can significantly reduce your
                      intake of harmful additives and improve your overall nutrition. Small changes add up.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* â”€â”€ Debug log â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {debugLog.length > 0 && (
          <details className="mt-2 mb-6 p-3 rounded-xl bg-gray-900 text-green-400 text-xs font-mono">
            <summary className="cursor-pointer font-bold text-green-300 mb-2 select-none">
              ðŸ”§ Debug Log ({debugLog.length} entries)
            </summary>
            <div className="space-y-0.5">
              {debugLog.map((line, i) => <div key={i} className="break-all">{line}</div>)}
            </div>
          </details>
        )}

      </div>{/* /max-w-lg */}

      {/* â”€â”€ Modals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showScanner && (
        <BarcodeScanner
          onDetected={handleBarcode}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showPhotoMode && (
        <ProductPhotoCapture
          onCapture={handleProductPhoto}
          onClose={() => setShowPhotoMode(false)}
        />
      )}

    </div>
  )
}

// â”€â”€â”€ Vision Label Capture â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function VisionCapture({ onCapture }: { onCapture: (b64: string) => void }) {
  const [stream,   setStream]   = useState<MediaStream | null>(null)
  const [videoEl,  setVideoEl]  = useState<HTMLVideoElement | null>(null)
  const [active,   setActive]   = useState(false)

  async function start() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(s)
      setActive(true)
    } catch {
      toast.error('Camera access denied')
    }
  }

  function stop() {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setActive(false)
  }

  function capture() {
    if (!videoEl) return
    const canvas = document.createElement('canvas')
    canvas.width  = videoEl.videoWidth
    canvas.height = videoEl.videoHeight
    canvas.getContext('2d')?.drawImage(videoEl, 0, 0)
    const b64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    stop()
    onCapture(b64)
  }

  return (
    <div>
      {!active ? (
        <button onClick={start}
          className="w-full py-3 rounded-xl text-white text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
          ðŸ“¸ Open Camera â€” Read Nutrition Label
        </button>
      ) : (
        <div>
          <video
            ref={el => { if (el && stream) { el.srcObject = stream; el.play(); setVideoEl(el) } }}
            className="w-full rounded-xl mb-2 bg-black"
            muted playsInline
          />
          <div className="flex gap-2">
            <button onClick={capture}
              className="flex-1 py-3 rounded-xl text-white text-sm font-bold"
              style={{ background: '#16a34a' }}>
              ðŸ“¸ Capture
            </button>
            <button onClick={stop}
              className="px-4 py-3 rounded-xl text-sm bg-gray-100 dark:bg-slate-700 text-[var(--foreground)]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// â”€â”€â”€ Full Product Photo Capture Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProductPhotoCapture({
  onCapture,
  onClose,
}: {
  onCapture: (b64: string) => void
  onClose: () => void
}) {
  const [stream,         setStream]         = useState<MediaStream | null>(null)
  const [videoEl,        setVideoEl]        = useState<HTMLVideoElement | null>(null)
  const [cameraStarted,  setCameraStarted]  = useState(false)
  const [capturing,      setCapturing]      = useState(false)

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      setStream(s)
      setCameraStarted(true)
    } catch {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true })
        setStream(s)
        setCameraStarted(true)
      } catch {
        toast.error('Camera access denied. Please allow camera permission.')
      }
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setCameraStarted(false)
  }

  function handleCapture() {
    if (!videoEl) return
    setCapturing(true)
    const canvas = document.createElement('canvas')
    canvas.width  = videoEl.videoWidth
    canvas.height = videoEl.videoHeight
    canvas.getContext('2d')?.drawImage(videoEl, 0, 0)
    const b64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]
    stopCamera()
    onCapture(b64)
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-2xl overflow-hidden w-full max-w-md">

        <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--card-border)]">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)]">ðŸ–¼ï¸ Product Photo Mode</h2>
            <p className="text-xs text-[var(--muted)]">Take a photo of the whole product</p>
          </div>
          <button onClick={() => { stopCamera(); onClose() }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-[var(--muted)]">
            âœ•
          </button>
        </div>

        {!cameraStarted ? (
          <div className="p-6">
            <p className="text-sm font-bold text-[var(--foreground)] mb-3">Gemini AI will read and extract:</p>
            <div className="space-y-2 mb-5">
              {[
                'ðŸ“¦ Product name and brand',
                'ðŸ”¢ Barcode number',
                'ðŸ“Š Full nutrition facts per 100g',
                'ðŸ§ª Ingredients and additives',
                'âš ï¸ Allergen information',
                'ðŸ’° MRP and net weight',
                'ðŸ·ï¸ FSSAI license number',
                'ðŸŒ¿ Veg/Non-veg certification',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#059669' }} />
                  <p className="text-xs text-[var(--muted)]">{item}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl mb-5 text-xs leading-relaxed"
              style={{ background: 'rgba(5,150,105,0.06)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>
              ðŸ’¡ <strong>Tip:</strong> Photograph the back or side where the nutrition table and ingredients are printed. Good lighting is important!
            </div>

            <button onClick={startCamera}
              className="w-full py-4 rounded-2xl text-white text-sm font-bold"
              style={{
                background:  'linear-gradient(135deg, #059669, #0ea5e9)',
                boxShadow:   '0 8px 24px rgba(5,150,105,0.3)',
              }}>
              ðŸ“· Open Camera
            </button>
          </div>
        ) : (
          <div>
            <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
              <video
                ref={el => {
                  if (el && stream) { el.srcObject = stream; el.play(); setVideoEl(el) }
                }}
                className="w-full h-full object-cover"
                muted playsInline
              />
              {/* Corner guides */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
              </div>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                  Point at product label or nutrition table
                </span>
              </div>
            </div>

            <div className="p-4">
              <button
                onClick={handleCapture}
                disabled={capturing}
                className="w-full py-4 rounded-2xl text-white text-base font-bold transition-all"
                style={{
                  background: capturing ? '#9ca3af' : 'linear-gradient(135deg, #059669, #0ea5e9)',
                  boxShadow:  capturing ? 'none' : '0 0 0 4px rgba(5,150,105,0.2), 0 8px 24px rgba(5,150,105,0.4)',
                  cursor:     capturing ? 'not-allowed' : 'pointer',
                }}
              >
                {capturing ? 'â³ Processing...' : 'ðŸ“¸ Capture Product'}
              </button>
              <p className="text-xs text-center text-[var(--muted)] mt-2">
                Gemini AI will read everything visible on the product
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

## FILE: src/app/scan-history/page.tsx

`$lang
"use client"
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const ratingConfig: Record<string, {
  label: string
  color: string
  bg: string
  emoji: string
}> = {
  healthy: {
    label: 'Healthy',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    emoji: 'âœ…'
  },
  moderate: {
    label: 'Moderate',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    emoji: 'âš ï¸'
  },
  unhealthy: {
    label: 'Unhealthy',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    emoji: 'âŒ'
  },
}

export default function ScanHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userId = (session as any)?.userId

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status])

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['scan-history', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('scan_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false })
        .limit(50)
      if (error) {
        console.log('Scan history error:', error.message)
        return []
      }
      return data || []
    },
    enabled: !!userId,
  })

  const stats = {
    healthy: sessions?.filter(s => s.ai_health_rating === 'healthy').length || 0,
    moderate: sessions?.filter(s => s.ai_health_rating === 'moderate').length || 0,
    unhealthy: sessions?.filter(s => s.ai_health_rating === 'unhealthy').length || 0,
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">ðŸ” My Scanned Products</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Products you have personally scanned and their health ratings
          </p>
        </div>

        {!isLoading && sessions && sessions.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { key: 'healthy', label: 'Healthy', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
                { key: 'moderate', label: 'Moderate', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { key: 'unhealthy', label: 'Unhealthy', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
              ].map(item => (
                <div key={item.key} className={`${item.bg} rounded-xl p-3 text-center`}>
                  <p className={`text-2xl font-bold ${item.color}`}>
                    {stats[item.key as keyof typeof stats]}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card)] border border-[var(--card-border)] rounded-xl mb-4 text-sm text-[var(--muted)]">
              ðŸ“Š You have scanned{' '}
              <strong className="text-[var(--foreground)]">{sessions.length} products</strong> total
            </div>
          </>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-20 bg-[var(--card)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sessions?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">ðŸ”</div>
            <p className="text-[var(--foreground)] font-medium mb-2">No products scanned yet</p>
            <p className="text-sm text-[var(--muted)] mb-6">
              Scan a food product to see its AI health rating here
            </p>
            <button
              onClick={() => router.push('/scan')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm"
            >
              Scan your first product
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions?.map((s: any) => {
              const rating = ratingConfig[s.ai_health_rating] || ratingConfig.moderate
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 bg-[var(--card)] rounded-xl border border-[var(--card-border)] hover:border-green-200 dark:hover:border-green-800 transition-colors"
                >
                  <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                    {s.product_image ? (
                      <div className="relative w-14 h-14">
                        <Image
                          src={s.product_image}
                          alt={s.product_name}
                          fill
                          className="object-contain"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <span className="text-2xl">ðŸ·ï¸</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                      {s.product_name || 'Unknown Product'}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{s.barcode}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {new Date(s.scanned_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {s.ai_health_rating && (
                    <div className={`flex-shrink-0 px-3 py-2 rounded-xl text-center ${rating.bg}`}>
                      <div className="text-lg">{rating.emoji}</div>
                      <div className={`text-xs font-bold ${rating.color}`}>
                        {s.ai_health_score ? `${s.ai_health_score}/10` : rating.label}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
```

## FILE: src/app/terms/page.tsx

`$lang
export default function TermsOfService() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p><strong>Last updated:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
 
      <h2>1. Acceptance</h2>
      <p>By using HealthOX, you agree to these terms. If you do not agree, do not use the app.</p>
 
      <h2>2. What HealthOX Is</h2>
      <p>HealthOX is an AI-powered food health information tool. It provides health ratings and ingredient analysis for educational purposes. It is NOT a medical device or medical service.</p>
 
      <h2>3. Health Disclaimer â€” Please Read</h2>
      <p>The health scores, ingredient warnings, and consumption recommendations provided by HealthOX are generated by AI and are for general informational purposes only. They:</p>
      <ul>
        <li>Are NOT a substitute for professional medical or nutritional advice</li>
        <li>May contain errors or inaccuracies</li>
        <li>Should NOT be used to make medical decisions</li>
        <li>Are based on publicly available nutritional data which may not always be accurate</li>
      </ul>
      <p>Always consult a qualified healthcare professional before making dietary changes, especially if you have diabetes, high blood pressure, or other health conditions.</p>
 
      <h2>4. User Responsibilities</h2>
      <ul>
        <li>You are responsible for the accuracy of your health profile information</li>
        <li>You must be 13 years or older to use this app</li>
        <li>Do not misuse or attempt to abuse the AI analysis system</li>
      </ul>
 
      <h2>5. Limitation of Liability</h2>
      <p>HealthOX is provided "as is." We are not liable for any health decisions made based on our AI analysis. Use at your own discretion.</p>
 
      <h2>6. Intellectual Property</h2>
      <p>The HealthOX app, its design, and codebase are owned by the HealthOX team. Product data is sourced from Open Food Facts (ODbL license) and other public sources.</p>
 
      <h2>7. Changes to Terms</h2>
      <p>We may update these terms. Continued use of the app means you accept the updated terms.</p>
 
      <h2>8. Contact</h2>
      <p>Questions: healthox.app@gmail.com</p>
    </div>
  )
}
```

## FILE: src/components/Analytics.tsx

`$lang
"use client"
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageView } from '@/lib/analytics'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

    // Load GA4 script if not already loaded
    if (!window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }
      window.gtag('js', new Date())
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false,
      })
    }

    pageView(url)
  }, [pathname, searchParams])

  return null
}
```

## FILE: src/components/BottomNav.tsx

`$lang
"use client"
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const navItems = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    href: '/scan',
    label: 'Scan',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4" fill={active ? 'currentColor' : 'none'}/>
      </svg>
    )
  },
  {
    href: '/history',
    label: 'Meals',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14" strokeWidth={active ? '2.5' : '2'}/>
      </svg>
    )
  },
  {
    href: '/profile-setup',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (
    pathname === '/auth/signin' ||
    pathname === '/' ||
    status === 'unauthenticated'
  ) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'var(--card)',
        borderTop: '1px solid var(--card-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">

        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200 relative"
              style={{
                color: active ? 'var(--brand)' : 'var(--muted)',
                background: active
                  ? 'linear-gradient(135deg, rgba(5,150,105,0.12), rgba(14,165,233,0.08))'
                  : 'transparent',
                minWidth: '56px',
              }}
            >
              {active && (
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    border: '1px solid rgba(5,150,105,0.2)',
                  }}
                />
              )}
              {item.icon(active)}
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          )
        })}

        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200"
            style={{ color: 'var(--muted)', minWidth: '56px' }}
          >
            {theme === 'dark' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
            <span className="text-xs font-semibold">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
        )}

      </div>
    </nav>
  )
}
```

## FILE: src/components/dashboard/CalorieRing.tsx

`$lang
"use client"

interface CalorieRingProps {
  consumed: number
  goal: number
}

export function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const percentage = Math.min(Math.round((consumed / goal) * 100), 100)
  const remaining = Math.max(goal - consumed, 0)

  // SVG circle math
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage > 100) return '#ef4444' // red - over
    if (percentage > 85) return '#f59e0b'  // amber - close
    return '#059669'                        // green - good
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-100 dark:text-gray-800"
          />
          {/* Progress circle */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-black text-[var(--foreground)] tabular-nums">{consumed}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">of {goal} kcal</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div className="w-2 h-2 rounded-full" style={{ background: getColor() }} />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {consumed > goal
            ? `${consumed - goal} kcal over goal`
            : `${remaining} kcal remaining`}
        </p>
      </div>
    </div>
  )
}

export default CalorieRing
```

## FILE: src/components/dashboard/LastScanned.tsx

`$lang
"use client"
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Scan, Clock, ChevronRight } from 'lucide-react'

interface ScanSession {
  product_name: string
  product_image: string | null
  ai_health_rating: string | null
  ai_health_score: number | null
  scanned_at: string
}

const ratingTextColor: Record<string, string> = {
  healthy:   'text-emerald-500',
  moderate:  'text-amber-500',
  unhealthy: 'text-red-500',
}

const ratingBgColor: Record<string, string> = {
  healthy:   'bg-emerald-50 dark:bg-emerald-900/20',
  moderate:  'bg-amber-50 dark:bg-amber-900/20',
  unhealthy: 'bg-red-50 dark:bg-red-900/20',
}

const ratingBadge: Record<string, string> = {
  healthy:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  moderate:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  unhealthy: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs  < 24) return `${hrs}h ago`
  return `${days}d ago`
}

export function LastScanned() {
  const router = useRouter()

  const { data, isLoading } = useQuery<ScanSession | null>({
    queryKey: ['lastScan'],
    queryFn: async () => {
      const res = await fetch('/api/last-scan')
      if (!res.ok) return null
      const json = await res.json()
      return json.success ? json.data : null
    },
    staleTime: 1000 * 60 * 3,
  })

  if (isLoading) return (
    <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse h-20" />
  )

  // Empty state â€” first scan CTA
  if (!data) return (
    <button
      onClick={() => router.push('/scan')}
      className="w-full rounded-2xl p-4 bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700
        flex items-center gap-3 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors group"
    >
      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
        <Scan className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Scan your first product</p>
        <p className="text-xs text-gray-400">Tap to open scanner</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors" />
    </button>
  )

  const rating = data.ai_health_rating ?? 'moderate'

  return (
    <button
      onClick={() => router.push('/scan')}
      className="w-full rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm
        flex items-center gap-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group text-left"
    >
      {/* Product image or icon fallback */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${ratingBgColor[rating]}`}>
        {data.product_image
          ? <img src={data.product_image} alt={data.product_name} className="w-12 h-12 object-cover" />
          : <span className="text-xl">ðŸ“¦</span>}
      </div>

      {/* Name + rating badge + score */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">Last scanned</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
          {data.product_name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {data.ai_health_rating && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ratingBadge[rating]}`}>
              {data.ai_health_rating.toUpperCase()}
            </span>
          )}
          {data.ai_health_score !== null && (
            <span className={`text-xs font-bold tabular-nums ${ratingTextColor[rating]}`}>
              {data.ai_health_score.toFixed(1)}/10
            </span>
          )}
          <span className="text-gray-200 dark:text-gray-700">Â·</span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {timeAgo(data.scanned_at)}
          </div>
        </div>
      </div>

      {/* Scan again CTA */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Scan again</span>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors" />
      </div>
    </button>
  )
}

export default LastScanned
```

## FILE: src/components/dashboard/MealStreak.tsx

`$lang
"use client"
import { useQuery } from '@tanstack/react-query'
import { Flame, Trophy } from 'lucide-react'

export function MealStreak() {
  const { data, isLoading } = useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const res = await fetch('/api/streak')
      if (!res.ok) return null
      const json = await res.json()
      return json.success ? json : null
    },
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) return (
    <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse h-24" />
  )

  const streak     = data?.streak     ?? 0
  const longest    = data?.longest    ?? 0
  const loggedToday = data?.loggedToday ?? false

  const flameColor = streak === 0 ? 'text-gray-300 dark:text-gray-600'
    : streak >= 7  ? 'text-orange-500'
    : streak >= 3  ? 'text-amber-500'
    : 'text-yellow-500'

  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between">

        {/* Left â€” flame + streak count */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            streak > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <Flame className={`w-5 h-5 ${flameColor}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Logging Streak</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100 tabular-nums">
                {streak}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                day{streak !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Right â€” logged today badge + best streak */}
        <div className="flex flex-col items-end gap-1">
          {loggedToday ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
              âœ“ Logged today
            </span>
          ) : (
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
              Log today!
            </span>
          )}
          {longest > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Trophy className="w-3 h-3" />
              Best: {longest} day{longest !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Milestone banner â€” only at 7+ days */}
      {streak >= 7 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <span className="text-lg">
            {streak >= 30 ? 'ðŸ†' : streak >= 14 ? 'ðŸ¥‡' : 'ðŸ”¥'}
          </span>
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {streak >= 30
              ? `${streak}-day legend! Incredible consistency.`
              : streak >= 14
              ? `${streak}-day streak! You're on fire!`
              : `7-day streak! Great habit building!`}
          </p>
        </div>
      )}
    </div>
  )
}

export default MealStreak
```

## FILE: src/components/dashboard/NutrientAlerts.tsx

`$lang
"use client"
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react'

interface Alert {
  nutrient: string
  type: 'deficient' | 'excess'
  avg: number
  rda: number
  message: string
  severity: 'high' | 'medium'
}

interface SummaryData {
  avg: { calories: number; protein: number; carbs: number; fat: number; sodium: number }
  rda: { calories: number; protein: number; carbs: number; fat: number; sodium: number }
  alerts: Alert[]
  daysTracked: number
}

export function NutrientAlerts() {
  const [expanded, setExpanded] = useState(false)

  const { data, isLoading } = useQuery<SummaryData | null>({
    queryKey: ['nutrientAlerts'],
    queryFn: async () => {
      const res = await fetch('/api/nutrients/summary')
      if (!res.ok) return null
      const json = await res.json()
      return json.success ? json.data : null
    },
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) return (
    <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse h-20" />
  )

  if (!data) return null

  const highAlerts = data.alerts.filter(a => a.severity === 'high')
  const allAlerts  = [...highAlerts, ...data.alerts.filter(a => a.severity === 'medium')]

  // All-clear state
  if (allAlerts.length === 0) return (
    <div className="rounded-2xl p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex items-center gap-3">
      <span className="text-2xl">âœ…</span>
      <div>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          Nutrient Balance Looks Good!
        </p>
        <p className="text-xs text-emerald-600/70 dark:text-emerald-500">
          Based on your last {data.daysTracked} day{data.daysTracked !== 1 ? 's' : ''} of tracking
        </p>
      </div>
    </div>
  )

  return (
    <div className={`rounded-2xl bg-white dark:bg-gray-900 border shadow-sm overflow-hidden ${
      highAlerts.length > 0
        ? 'border-red-100 dark:border-red-900/40'
        : 'border-amber-100 dark:border-amber-900/40'
    }`}>

      {/* Collapsible header */}
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(x => !x)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            highAlerts.length > 0
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-amber-50 dark:bg-amber-900/20'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${
              highAlerts.length > 0 ? 'text-red-500' : 'text-amber-500'
            }`} />
          </div>
          <div>
            <p className={`text-sm font-bold ${
              highAlerts.length > 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {allAlerts.length} Nutrient Alert{allAlerts.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {data.daysTracked}-day average Â· Tap to view
            </p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {/* Expanded alert list */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-3">
          {allAlerts.map((alert, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 flex items-start gap-3 border ${
                alert.severity === 'high'
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                  : 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {alert.type === 'deficient'
                  ? <TrendingDown className={`w-4 h-4 ${alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                  : <TrendingUp   className={`w-4 h-4 ${alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {alert.nutrient}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                    alert.type === 'deficient'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {alert.type === 'deficient' ? 'Too Low' : 'Too High'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NutrientAlerts
```

## FILE: src/components/dashboard/RecentScans.tsx

`$lang
"use client"
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface FoodLog {
  id: string
  product_name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  meal_type: string
  logged_at: string
  quantity_g: number
}

interface RecentScansProps {
  userId: string
}

const mealEmoji: Record<string, string> = {
  breakfast: 'ðŸŒ…',
  lunch: 'â˜€ï¸',
  dinner: 'ðŸŒ™',
  snack: 'ðŸ¿',
}

const mealColors: Record<string, string> = {
  breakfast: 'bg-orange-50 dark:bg-orange-900/20',
  lunch: 'bg-yellow-50 dark:bg-yellow-900/20',
  dinner: 'bg-blue-50 dark:bg-blue-900/20',
  snack: 'bg-green-50 dark:bg-green-900/20',
}

export function RecentScans({ userId }: RecentScansProps) {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: meals, isLoading } = useQuery({
    queryKey: ['recentMeals', userId],
    queryFn: async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('food_logs')
        .select('id, product_name, calories, protein_g, carbs_g, fat_g, meal_type, logged_at, quantity_g')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString())
        .order('logged_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return (data || []) as FoodLog[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  })

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}" from your meal history?`)) return

    setDeletingId(id)
    try {
      const res = await fetch('/api/log/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (json.success) {
        // Optimistically remove from cache
        queryClient.setQueryData<FoodLog[]>(['recentMeals', userId], old =>
          (old || []).filter(m => m.id !== id)
        )
        // Invalidate weekly chart too since calories changed
        queryClient.invalidateQueries({ queryKey: ['weeklyChart', userId] })
        toast.success('Meal removed')
      } else {
        toast.error('Failed to delete. Try again.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="h-24 flex items-center justify-center">
          <p className="text-xs text-gray-400 animate-pulse">Loading meals...</p>
        </div>
      </div>
    )
  }

  if (!meals || meals.length === 0) {
    return (
      <div className="rounded-2xl p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
        <div className="text-4xl mb-3">ðŸ½ï¸</div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          No meals logged today
        </p>
        <p className="text-xs text-gray-400">
          Scan a product and log it to see your meals here
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
          ðŸ• Today's Meals
        </p>
        <span className="text-xs text-gray-400">
          {meals.length} meal{meals.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {meals.map(meal => (
          <div
            key={meal.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              deletingId === meal.id
                ? 'opacity-50 bg-red-50 dark:bg-red-900/20'
                : 'bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            {/* Meal type icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
              mealColors[meal.meal_type] || 'bg-gray-100 dark:bg-gray-700'
            }`}>
              {mealEmoji[meal.meal_type] || 'ðŸ½ï¸'}
            </div>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                {meal.product_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {meal.quantity_g}g Â· <span className="capitalize">{meal.meal_type}</span>
              </p>
              {/* Macros row */}
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] text-blue-500 font-medium">P {Math.round(meal.protein_g)}g</span>
                <span className="text-[10px] text-yellow-500 font-medium">C {Math.round(meal.carbs_g)}g</span>
                <span className="text-[10px] text-red-400 font-medium">F {Math.round(meal.fat_g)}g</span>
              </div>
            </div>

            {/* Calories */}
            <div className="text-right flex-shrink-0 mr-1">
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {Math.round(meal.calories)}
              </p>
              <p className="text-[10px] text-gray-400">kcal</p>
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(meal.id, meal.product_name)}
              disabled={deletingId === meal.id}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-800 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === meal.id ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
                  <path d="M21 12a9 9 0 00-9-9"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentScans
```

## FILE: src/components/dashboard/WeeklyChart.tsx

`$lang
"use client"
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface WeeklyChartProps {
  userId: string
}

export function WeeklyChart({ userId }: WeeklyChartProps) {
  const { data: weekData, isLoading } = useQuery({
    queryKey: ['weeklyChart', userId],
    queryFn: async () => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 6)
      weekAgo.setHours(0, 0, 0, 0)

      const { data: logs, error } = await supabase
        .from('food_logs')
        .select('calories, logged_at')
        .eq('user_id', userId)
        .gte('logged_at', weekAgo.toISOString())

      if (error) throw error

      // Build a map keyed by YYYY-MM-DD, initialized to 0
      const dayMap: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        d.setHours(0, 0, 0, 0)
        dayMap[d.toLocaleDateString('en-CA')] = 0
      }

      // Aggregate calories per day
      logs?.forEach(log => {
        const key = new Date(log.logged_at).toLocaleDateString('en-CA')
        if (key in dayMap) dayMap[key] += log.calories || 0
      })

      // Convert to array with short weekday labels
      return Object.entries(dayMap).map(([date, calories]) => ({
        label: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
        calories: Math.round(calories),
      }))
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })

  const maxCal = Math.max(...(weekData || []).map(d => d.calories), 1)

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="h-32 flex items-center justify-center">
          <p className="text-xs text-gray-400 animate-pulse">Loading chart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Weekly Overview</p>

      <div className="flex items-end justify-between gap-1 h-24">
        {(weekData || []).map((d, i) => {
          const heightPct = d.calories > 0
            ? Math.max((d.calories / maxCal) * 100, 4)
            : 0

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400 tabular-nums">
                {d.calories > 0 ? d.calories : ''}
              </span>
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${heightPct}%`,
                  background: d.calories > 0
                    ? 'linear-gradient(to top, #059669, #34d399)'
                    : '#e5e7eb',
                  minHeight: d.calories > 0 ? '4px' : '0',
                }}
              />
              <span className="text-[10px] text-gray-400 font-medium">{d.label}</span>
            </div>
          )
        })}
      </div>

      {weekData?.every(d => d.calories === 0) && (
        <p className="text-center text-xs text-gray-400 mt-2">No meals logged this week yet</p>
      )}
    </div>
  )
}

export default WeeklyChart
```

## FILE: src/components/ErrorBoundary.tsx

`$lang
"use client"
import { Component, ReactNode } from 'react'
import { event, AnalyticsEvents } from '@/lib/analytics'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo)

    // Send crash event to analytics
    event(AnalyticsEvents.SCAN_ERROR, {
      error_message: error.message,
      error_name: error.name,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
          <div className="max-w-sm w-full text-center">
            <div className="text-6xl mb-4">ðŸ˜µ</div>
            <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--muted)] mb-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <p className="text-xs text-[var(--muted)] mb-6">
              This error has been reported. Try refreshing or go back.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.href = '/dashboard'
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-[var(--foreground)] rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
```

## FILE: src/components/Providers.tsx

`$lang
"use client"
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Analytics from './Analytics'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Analytics />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500,
              },
              success: { iconTheme: { primary: '#16a34a', secondary: 'white' } },
              error: { iconTheme: { primary: '#dc2626', secondary: 'white' } },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
```

## FILE: src/components/scanner/AnalysisCard.tsx

`$lang
"use client"
import { useState } from 'react'
import {
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp,
  ExternalLink, Leaf, Shield, TrendingDown, Heart, Baby,
  Droplets, ShoppingBag, Clock, Activity, Info, Zap, Star
} from 'lucide-react'
 
export interface AnalysisData {
  health_rating: 'healthy' | 'moderate' | 'unhealthy'
  health_score: number
  health_score_breakdown?: {
    nutrition_score: number
    ingredient_safety_score: number
    processing_score: number
    overall: number
  }
  summary: string
  detailed_breakdown?: {
    calories?: string
    protein?: string
    sugar?: string
    sodium?: string
    fat?: string
    fiber?: string
    processing_level?: string
    overall_nutrient_density?: string
  }
  safe_consumption?: {
    amount?: string
    frequency?: string
    notes?: string
    personalized_for_user?: string
  }
  harmful_ingredients?: Array<{
    name: string
    also_known_as?: string[]
    found_in_product?: boolean
    concern: string
    severity: 'high' | 'medium' | 'low'
    scientific_source?: string
    source_url?: string
    global_safe_limit?: string
    amount_in_this_product?: string
    personalized_safe_limit?: string
    percentage_of_daily_limit?: string
  }>
  ingredient_warnings?: Array<{
    ingredient: string
    concern: string
    severity: 'high' | 'medium' | 'low'
  }>
  long_term_risks?: string[]
  positives?: string[]
  healthier_alternatives?: Array<{
    name: string
    reason: string
    availability?: string
    type?: string
  }>
  fssai_compliance?: string
  diabetic_suitability?: string
  bp_suitability?: string
  child_suitability?: string
  pregnancy_suitability?: string
  personalized?: boolean
  analyzed_at?: string
}
 
function getScoreColor(score: number) {
  if (score >= 7.5) return '#10b981'
  if (score >= 5.5) return '#f59e0b'
  if (score >= 3.5) return '#f97316'
  return '#ef4444'
}
 
function getSeverityStyles(severity: string) {
  switch (severity) {
    case 'high': return {
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
      card: 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10',
      icon: 'text-red-500',
    }
    case 'medium': return {
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
      card: 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10',
      icon: 'text-amber-500',
    }
    default: return {
      badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
      card: 'border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/10',
      icon: 'text-yellow-500',
    }
  }
}
 
function getSuitabilityConfig(value?: string) {
  switch (value) {
    case 'suitable':             return { icon: CheckCircle,  color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40', label: 'Safe' }
    case 'consume_with_caution': return { icon: AlertTriangle, color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40',   label: 'Caution' }
    case 'avoid':                return { icon: XCircle,       color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40',             label: 'Avoid' }
    default:                     return { icon: Info,          color: 'text-gray-400',    bg: 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700',            label: 'Unknown' }
  }
}
 
function clamp(score: number) { return Math.min(Math.max(score / 10, 0), 1) }
 
function ScoreRing({ score, rating }: { score: number; rating: string }) {
  const radius = 52
  const circ   = 2 * Math.PI * radius
  const offset = circ * (1 - clamp(score))
  const color  = getScoreColor(score)
  const gradMap: Record<string, string> = {
    healthy: 'from-emerald-500 to-teal-400',
    moderate: 'from-amber-500 to-yellow-400',
    unhealthy: 'from-red-500 to-orange-500',
  }
  const label = rating === 'healthy' ? 'Healthy' : rating === 'moderate' ? 'Moderate' : 'Unhealthy'
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="10"
            className="text-gray-100 dark:text-gray-800" />
          <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-3xl font-black tabular-nums leading-none" style={{ color }}>
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">/ 10</span>
        </div>
      </div>
      <span className={`px-5 py-1.5 rounded-full text-sm font-bold text-white shadow-sm bg-gradient-to-r ${gradMap[rating] || gradMap.moderate}`}>
        {label}
      </span>
    </div>
  )
}
 
function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = getScoreColor(score)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{score.toFixed(1)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${clamp(score) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
 
function HarmfulCard({ item }: { item: NonNullable<AnalysisData['harmful_ingredients']>[0] }) {
  const [open, setOpen] = useState(false)
  const s = getSeverityStyles(item.severity)
  return (
    <div className={`rounded-xl border overflow-hidden ${s.card}`}>
      <button className="w-full flex items-start gap-3 p-3 text-left" onClick={() => setOpen(x => !x)}>
        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${s.icon}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${s.badge}`}>
              {item.severity} risk
            </span>
          </div>
          {item.also_known_as && item.also_known_as.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">Also: {item.also_known_as.slice(0, 3).join(', ')}</p>
          )}
          <p className={`text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>
            {item.concern}
          </p>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-3 pb-3 pt-2 space-y-2.5 border-t border-black/5 dark:border-white/5">
          <div className="grid grid-cols-2 gap-2">
            {item.amount_in_this_product && (
              <div className="bg-white/70 dark:bg-black/20 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">In this product</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.amount_in_this_product}</p>
              </div>
            )}
            {item.global_safe_limit && (
              <div className="bg-white/70 dark:bg-black/20 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Daily safe limit</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.global_safe_limit}</p>
              </div>
            )}
            {item.percentage_of_daily_limit && (
              <div className="bg-white/70 dark:bg-black/20 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">% of daily limit</p>
                <p className="text-xs font-bold text-red-600 dark:text-red-400">{item.percentage_of_daily_limit}</p>
              </div>
            )}
            {item.personalized_safe_limit && (
              <div className="bg-white/70 dark:bg-black/20 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Your safe limit</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.personalized_safe_limit}</p>
              </div>
            )}
          </div>
          {(item.scientific_source || item.source_url) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Shield className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-400">{item.scientific_source}</span>
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  <ExternalLink className="w-3 h-3" /> Source
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
 
export default function AnalysisCard({ analysis, productName }: { analysis: AnalysisData; productName: string }) {
  if (!analysis) return null
 
  const score    = Number(analysis.health_score) || 0
  const rating   = analysis.health_rating || 'moderate'
  const harmful  = (analysis.harmful_ingredients || []).filter(h => h.found_in_product !== false)
  const highRisk = harmful.filter(h => h.severity === 'high')
 
  const longTermRisks: string[] = analysis.long_term_risks?.length
    ? analysis.long_term_risks
    : harmful.filter(h => h.severity === 'high').map(h => h.concern).slice(0, 4)
 
  const alternatives = analysis.healthier_alternatives || []
  const positives    = analysis.positives || []
  const warnings     = analysis.ingredient_warnings || []
 
  const suitability = [
    { label: 'Diabetic',  value: analysis.diabetic_suitability  },
    { label: 'High BP',   value: analysis.bp_suitability        },
    { label: 'Children',  value: analysis.child_suitability     },
    { label: 'Pregnancy', value: analysis.pregnancy_suitability },
  ]
 
  return (
    <div className="space-y-3">
 
      {/* SCORE + SUMMARY */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className={`px-4 py-2.5 flex items-center gap-2 text-xs font-semibold
          ${rating === 'healthy'   ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
          : rating === 'unhealthy' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          :                          'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'}`}>
          <Star className="w-3.5 h-3.5" />
          AI Health Analysis {analysis.personalized ? 'Â· Personalised' : 'Â· General'}
        </div>
        <div className="p-5 flex flex-col items-center gap-4">
          <ScoreRing score={score} rating={rating} />
          {analysis.personalized && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400
              bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1 rounded-full">
              <Zap className="w-3 h-3" /> Based on your health profile
            </div>
          )}
          {analysis.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              {analysis.summary}
            </p>
          )}
        </div>
        {analysis.health_score_breakdown && (
          <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Score Breakdown</p>
            <ScoreBar label="Nutrition Quality" score={analysis.health_score_breakdown.nutrition_score ?? 0} />
            <ScoreBar label="Ingredient Safety" score={analysis.health_score_breakdown.ingredient_safety_score ?? 0} />
            <ScoreBar label="Processing Level"  score={analysis.health_score_breakdown.processing_score ?? 0} />
          </div>
        )}
      </div>
 
      {/* SUITABILITY GRID */}
      {suitability.some(s => s.value && s.value !== 'unknown') && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Who Should Be Careful</p>
          <div className="grid grid-cols-2 gap-2">
            {suitability.map(({ label, value }) => {
              if (!value || value === 'unknown') return null
              const cfg = getSuitabilityConfig(value)
              const StatusIcon = cfg.icon
              return (
                <div key={label} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${cfg.bg}`}>
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-none">{label}</p>
                    <p className={`text-xs font-bold mt-0.5 ${cfg.color}`}>{cfg.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
 
      {/* HARMFUL INGREDIENTS */}
      {harmful.length > 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/40 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {harmful.length} Harmful Ingredient{harmful.length !== 1 ? 's' : ''} Found
            </p>
            {highRisk.length > 0 && (
              <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                {highRisk.length} HIGH
              </span>
            )}
          </div>
          <div className="space-y-2">
            {harmful.map((item, i) => <HarmfulCard key={i} item={item} />)}
          </div>
        </div>
      )}
 
      {/* INGREDIENT WARNINGS (fallback) */}
      {warnings.length > 0 && harmful.length === 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-amber-100 dark:border-amber-900/30 shadow-sm">
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> Ingredient Warnings
          </p>
          <div className="space-y-2.5">
            {warnings.map((w, i) => {
              const s = getSeverityStyles(w.severity)
              return (
                <div key={i} className={`rounded-xl border p-3 ${s.card}`}>
                  <div className="flex items-start gap-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 capitalize ${s.badge}`}>{w.severity}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{w.ingredient}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{w.concern}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
 
      {/* LONG-TERM HEALTH RISKS */}
      {longTermRisks.length > 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-900/30 shadow-sm">
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4" />
            Health Risks of Regular Consumption
          </p>
          <ul className="space-y-2.5">
            {longTermRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-orange-400 dark:text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
 
      {/* WHAT'S GOOD */}
      {positives.length > 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4" /> What's Good About This
          </p>
          <ul className="space-y-2">
            {positives.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <Leaf className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
 
      {/* SAFE CONSUMPTION */}
      {analysis.safe_consumption && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-emerald-500" /> Safe Consumption Guide
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {analysis.safe_consumption.amount && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Safe Amount</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{analysis.safe_consumption.amount}</p>
              </div>
            )}
            {analysis.safe_consumption.frequency && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Frequency</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{analysis.safe_consumption.frequency}</p>
              </div>
            )}
          </div>
          {(analysis.safe_consumption.personalized_for_user || analysis.safe_consumption.notes) && (
            <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              ðŸ’¡ {analysis.safe_consumption.personalized_for_user || analysis.safe_consumption.notes}
            </p>
          )}
        </div>
      )}
 
      {/* HEALTHIER ALTERNATIVES */}
      {alternatives.length > 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-emerald-500" /> Healthier Alternatives
          </p>
          <div className="space-y-2.5">
            {alternatives.map((alt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl
                bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{alt.name}</p>
                    {alt.availability && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40
                        text-emerald-700 dark:text-emerald-400 capitalize font-medium">
                        {alt.availability.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{alt.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* FSSAI */}
      {analysis.fssai_compliance && (
        <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium
          ${analysis.fssai_compliance === 'compliant'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40'
            : analysis.fssai_compliance === 'concern'
            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'}`}>
          <Shield className="w-4 h-4 flex-shrink-0" />
          FSSAI: {analysis.fssai_compliance === 'compliant' ? 'No compliance concerns detected'
            : analysis.fssai_compliance === 'concern' ? 'Possible FSSAI compliance concern'
            : 'Compliance status unknown'}
        </div>
      )}
 
    </div>
  )
}
```

## FILE: src/components/scanner/BarcodeScanner.tsx

`$lang
"use client"
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mountedRef = useRef(true)

  const [status, setStatus] = useState('Starting camera...')
  const [failureTip, setFailureTip] = useState<string | null>(null)
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [manualBarcode, setManualBarcode] = useState('')
  const [tab, setTab] = useState<'photo' | 'manual'>('photo')
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    startCamera()

    const pulseTimer = setTimeout(() => {
      if (mountedRef.current) setPulse(true)
    }, 2000)

    return () => {
      mountedRef.current = false
      stopCamera()
      clearTimeout(pulseTimer)
    }
  }, [])

  async function startCamera() {
    let s: MediaStream | null = null
    let front = false
    try {
      s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 } }
      })
    } catch {
      try {
        s = await navigator.mediaDevices.getUserMedia({ video: true })
        front = true
      } catch {
        if (mountedRef.current) setStatus('Camera denied. Use manual entry.')
        return
      }
    }

    if (!mountedRef.current) {
      s?.getTracks().forEach(t => t.stop())
      return
    }

    streamRef.current = s
    setIsFrontCamera(front)

    if (videoRef.current) {
      videoRef.current.srcObject = s
      try { await videoRef.current.play() } catch {}
    }

    setStatus('Point camera at barcode or label, then tap Capture')
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  // âœ… UPDATED HANDLE CAPTURE
  async function handleCapture() {
    if (!videoRef.current || isCapturing) return
    setIsCapturing(true)
    setPulse(false)
    setFailureTip(null)
    setStatus('ðŸ“¸ Capturing...')

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) { setIsCapturing(false); return }

    if (isFrontCamera) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(videoRef.current, 0, 0)
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1]

    setStatus('ðŸ¤– Gemini is reading the barcode...')

    try {
      const res = await fetch('/api/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mode: 'barcode_only' })
      })
      const json = await res.json()

      if (json.success && json.data?.barcode) {
        setStatus(`âœ… Found barcode: ${json.data.barcode}`)
        stopCamera()
        onDetected(json.data.barcode)
        return
      }

      setStatus('ðŸ” Trying full label extraction...')
      const res2 = await fetch('/api/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mode: 'full_label' })
      })
      const json2 = await res2.json()

      if (json2.success && json2.data?.barcode) {
        setStatus(`âœ… Found barcode: ${json2.data.barcode}`)
        stopCamera()
        onDetected(json2.data.barcode)
        return
      }

      if (json2.success && json2.data?.name) {
        setStatus('ðŸ’¾ Saving from label data...')
        const submitRes = await fetch('/api/products/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json2.data)
        })
        const submitJson = await submitRes.json()

        if (submitJson.success) {
          stopCamera()
          onDetected(submitJson.data.barcode)
          return
        }
      }

      const failureMessage = json2.error || json.error || 'Could not read the label'
      const tipMessage = json2.tip || json.tip || 'Try manual entry below'

      setStatus(`âŒ ${failureMessage}`)
      setFailureTip(tipMessage)
      setPulse(true)
      toast.error(failureMessage)

    } catch {
      setStatus('âŒ Something went wrong. Try again.')
      setFailureTip('Check your internet connection and try again.')
      setPulse(true)
    }

    setIsCapturing(false)
  }

  function handleManualSubmit() {
    const code = manualBarcode.trim()
    if (code.length < 8) {
      toast.error('Please enter at least 8 digits')
      return
    }
    stopCamera()
    onDetected(code)
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-2xl overflow-hidden w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--card-border)]">
          <h2 className="text-base font-bold">ðŸ“· Scan Food Product</h2>
          <button onClick={() => { stopCamera(); onClose() }}>âœ•</button>
        </div>

        {tab === 'photo' && (
          <>
            <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                  {status}
                </span>
              </div>
            </div>

            {/* âœ… FAILURE TIP UI */}
            {failureTip && !isCapturing && (
              <div className="px-4 py-2 bg-amber-50 border-b">
                <p className="text-xs text-center">ðŸ’¡ {failureTip}</p>
              </div>
            )}

            <div className="p-4">
              <button onClick={handleCapture} className="w-full py-4 bg-green-600 text-white rounded-xl">
                ðŸ“¸ Capture & Read
              </button>
            </div>
          </>
        )}

        {tab === 'manual' && (
          <div className="p-5">
            <input
              value={manualBarcode}
              onChange={e => setManualBarcode(e.target.value)}
              placeholder="Enter barcode"
              className="w-full p-3 border"
            />
            <button onClick={handleManualSubmit}>Submit</button>
          </div>
        )}

      </div>
    </div>
  )
}
```

## FILE: src/components/ServiceWorkerRegister.tsx

`$lang
"use client"
import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope)
        })
        .catch((error) => {
          console.error('SW registration failed:', error)
        })
    }
  }, [])

  return null
}
```

## FILE: src/components/Skeleton.tsx

`$lang
export function SkeletonCard() {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] animate-pulse">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/3 mb-4" />
      <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2" />
    </div>
  )
}

export function SkeletonRing() {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] flex flex-col items-center animate-pulse">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2 mb-5" />
      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3 mt-4" />
    </div>
  )
}

export function SkeletonMealItem() {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl animate-pulse">
      <div className="w-11 h-11 rounded-2xl bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2" />
      </div>
      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-14" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="px-5 pt-12 pb-8 animate-pulse"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)' }}>
        <div className="h-4 bg-white/20 rounded-full w-32 mb-2" />
        <div className="h-8 bg-white/20 rounded-full w-40 mb-1" />
        <div className="h-3 bg-white/10 rounded-full w-48 mb-5" />
        <div className="h-16 bg-white/10 rounded-2xl" />
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--card-border)] animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-full mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SkeletonRing />
          <SkeletonCard />
        </div>
        <SkeletonCard />
        <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-1/3 animate-pulse" />
          <SkeletonMealItem />
          <SkeletonMealItem />
          <SkeletonMealItem />
        </div>
      </div>
    </div>
  )
}
```

## FILE: src/lib/analytics.ts

`$lang
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function pageView(url: string): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

export function event(
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  window.gtag?.('event', action, params)
}

export const AnalyticsEvents = {
  SCAN_BARCODE: 'scan_barcode',
  SCAN_PHOTO: 'scan_photo',
  SCAN_VISION: 'scan_vision',
  LOG_MEAL: 'log_meal',
  VIEW_ANALYSIS: 'view_analysis',
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
  PROFILE_COMPLETE: 'profile_complete',
  SHARE_PRODUCT: 'share_product',
  SCAN_ERROR: 'scan_error',
} as const
```

## FILE: src/lib/auth.ts

`$lang
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false

        const { data: existing } = await supabaseAdmin
          .from('user_profiles')
          .select('user_id, welcome_email_sent')
          .eq('user_id', user.id)
          .single()

        const isNewUser = !existing

        const { error } = await supabaseAdmin
          .from('user_profiles')
          .upsert(
            {
              user_id: user.id,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )

        if (error) {
          console.error('Supabase upsert error:', error.message)
          return false
        }

        if (isNewUser) {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          fetch(`${baseUrl}/api/welcome-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              email: user.email,
              name: user.name,
            }),
          }).catch((err) =>
            console.log('Welcome email trigger error:', err.message)
          )
        }

        return true
      } catch (err) {
        console.error('SignIn error:', err)
        return false
      }
    },

    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.userId = token.sub ?? ''
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
}
```

## FILE: src/lib/gemini.ts

`$lang
export class GeminiError extends Error {
  constructor(
    public type: 'rate_limit' | 'timeout' | 'network' | 'api_error' | 'unavailable' | 'invalid_response',
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

interface GeminiConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  timeoutMs?: number
  maxRetries?: number
}

const DEFAULTS: Required<Omit<GeminiConfig, 'model'>> = {
  temperature: 0.15,
  maxTokens: 10000,
  timeoutMs: 20000,
  maxRetries: 3,
}

const MODEL = 'gemini-2.5-flash'
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new GeminiError('api_error', 'GEMINI_API_KEY is not configured')
  return key
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } catch (err: any) {
    if (err.name === 'AbortError') throw new GeminiError('timeout', `Gemini request timed out after ${timeoutMs / 1000}s`)
    throw new GeminiError('network', `Network error: ${err.message}`)
  } finally {
    clearTimeout(timer)
  }
}

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err: any) {
      lastError = err
      if (err instanceof GeminiError) {
        const retryable = ['rate_limit', 'network', 'unavailable'].includes(err.type)
        if (retryable && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000
          console.log(`Gemini ${err.type} â€” retry ${attempt + 1}/${maxRetries} in ${delay}ms`)
          await new Promise(r => setTimeout(r, delay))
          continue
        }
      }
      throw err
    }
  }
  throw lastError
}

function handleGeminiResponse(res: Response, body?: string): string {
  if (res.status === 429) throw new GeminiError('rate_limit', 'Gemini rate limit exceeded', 429)
  if (res.status === 503) throw new GeminiError('unavailable', 'Gemini is temporarily overloaded. Please try again.', 503)
  if (res.status === 504) throw new GeminiError('timeout', 'Gemini request timed out', 504)
  if (!res.ok) throw new GeminiError('api_error', `Gemini API error ${res.status}: ${body || ''}`, res.status)
  return body || ''
}

export async function callGemini(
  prompt: string,
  imageBase64?: string,
  config?: GeminiConfig
): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
  const { temperature, maxTokens, timeoutMs, maxRetries } = { ...DEFAULTS, ...config }
  const apiKey = getApiKey()
  const model = config?.model || MODEL

  return retryWithBackoff(async () => {
    const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`

    const parts: any[] = [{ text: prompt }]
    if (imageBase64) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } })
    }

    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    }, timeoutMs)

    const body = await res.text()
    handleGeminiResponse(res, body)

    let data: any
    try {
      data = JSON.parse(body)
    } catch {
      throw new GeminiError('invalid_response', 'Gemini returned invalid JSON')
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new GeminiError('invalid_response', 'Gemini returned empty response')

    const usage = {
      inputTokens: data.usageMetadata?.promptTokenCount || 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
    }

    console.log(`Gemini [${model}] tokens â€” in: ${usage.inputTokens}, out: ${usage.outputTokens}`)
    return { text, usage }
  }, maxRetries)
}

export async function streamGemini(
  prompt: string,
  onChunk: (text: string) => void,
  imageBase64?: string,
  config?: GeminiConfig
): Promise<{ usage: { inputTokens: number; outputTokens: number } }> {
  const { temperature, maxTokens, timeoutMs, maxRetries } = { ...DEFAULTS, ...config }
  const apiKey = getApiKey()
  const model = config?.model || MODEL

  return retryWithBackoff(async () => {
    const url = `${BASE_URL}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`

    const parts: any[] = [{ text: prompt }]
    if (imageBase64) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } })
    }

    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    }, timeoutMs)

    const body = await res.text()
    handleGeminiResponse(res, body)

    if (!res.body) throw new GeminiError('api_error', 'No response body from Gemini')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let usage = { inputTokens: 0, outputTokens: 0 }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const dataStr = trimmed.slice(6)
        if (dataStr === '[DONE]') continue

        try {
          const json = JSON.parse(dataStr)
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) onChunk(text)

          if (json.usageMetadata) {
            usage = {
              inputTokens: json.usageMetadata.promptTokenCount || 0,
              outputTokens: json.usageMetadata.candidatesTokenCount || 0,
            }
          }
        } catch {
          // skip malformed SSE chunks
        }
      }
    }

    console.log(`Gemini stream [${model}] tokens â€” in: ${usage.inputTokens}, out: ${usage.outputTokens}`)
    return { usage }
  }, maxRetries)
}
```

## FILE: src/lib/rateLimit.ts

`$lang
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const LIMITS = {
  analyze: { max: 20, windowMinutes: 60 },
  scan: { max: 100, windowMinutes: 60 },
  log: { max: 50, windowMinutes: 60 },
}

export async function checkRateLimit(
  userId: string,
  action: keyof typeof LIMITS
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const limit = LIMITS[action]
  const windowStart = new Date(Date.now() - limit.windowMinutes * 60 * 1000).toISOString()
  const now = new Date().toISOString()

  try {
    const { count } = await supabaseAdmin
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', action)
      .gte('created_at', windowStart)

    const used = count || 0
    const remaining = Math.max(0, limit.max - used)
    const allowed = used < limit.max

    if (allowed) {
      const { error: insertError } = await supabaseAdmin
        .from('rate_limits')
        .insert({
          user_id: userId,
          action,
          created_at: now,
        })

      if (insertError) {
        console.error('Rate limit insert failed (possible race):', insertError.message)
      }
    }

    return {
      allowed,
      remaining,
      resetIn: limit.windowMinutes,
    }
  } catch (e) {
    console.error('Rate limit check failed:', e)
    return { allowed: false, remaining: 0, resetIn: 5 }
  }
}
```

## FILE: src/lib/supabase.ts

`$lang
import { createClient } from '@supabase/supabase-js'

// Frontend client â€” safe to use in components
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## FILE: src/lib/supabaseAdmin.ts

`$lang
import { createClient } from '@supabase/supabase-js'

// Backend only client â€” never import this in components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

## FILE: src/lib/tokens.ts

`$lang
import crypto from 'crypto'

const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me'

/**
 * Creates a signed token for unsubscribe links.
 * Token = base64(userId:expiry:signature)
 */
export function createUnsubscribeToken(userId: string): string {
  // Token valid for 30 days
  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000
  const payload = `${userId}:${expiry}`
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex')
  const token = Buffer.from(`${payload}:${signature}`).toString('base64url')
  return token
}

/**
 * Verifies an unsubscribe token and returns the userId if valid.
 * Returns null if invalid or expired.
 */
export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length !== 3) return null

    const [userId, expiryStr, signature] = parts
    const expiry = parseInt(expiryStr, 10)

    // Check expiry
    if (Date.now() > expiry) return null

    // Verify signature
    const payload = `${userId}:${expiryStr}`
    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(payload)
      .digest('hex')

    if (signature !== expectedSig) return null

    return userId
  } catch {
    return null
  }
}

/**
 * Helper to build signed unsubscribe URLs
 */
export function buildUnsubscribeUrls(
  userId: string,
  baseUrl: string
): { weeklyUrl: string; allUrl: string } {
  const token = createUnsubscribeToken(userId)
  return {
    weeklyUrl: `${baseUrl}/api/unsubscribe?token=${token}&type=weekly`,
    allUrl: `${baseUrl}/api/unsubscribe?token=${token}&type=all`,
  }
}
```

## FILE: src/test/setup.ts

`$lang
import '@testing-library/jest-dom'
```

## FILE: src/types/index.ts

`$lang
export interface Product {
  id: string
  barcode: string
  name: string
  brand?: string
  category?: string
  country_of_origin?: string
  image_url?: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    sugar?: number
    sodium?: number
    fiber?: number
  }
  serving_size_g?: number
  ingredients_text?: string
  allergens: string[]
  additives: string[]
  source?: string
  ai_health_rating?: string
  ai_analysis?: any
  created_at?: string
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface UserProfile {
  user_id: string
  email: string
  name?: string
  weight_kg?: number
  height_cm?: number
  bmi?: number
  is_diabetic?: boolean
  has_bp?: boolean
  is_vegetarian?: boolean
  is_vegan?: boolean
}
```

## FILE: src/types/next-auth.d.ts

`$lang
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    userId: string
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: string
  }
}
```

## FILE: tailwind.config.ts

`$lang
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
```

## FILE: tsconfig.json

`$lang
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## FILE: vercel.json

`$lang
{
  "crons": [
    {
      "path": "/api/cron/weekly-report",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

## FILE: vitest.config.ts

`$lang
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

