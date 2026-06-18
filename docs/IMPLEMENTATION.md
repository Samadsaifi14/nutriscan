# IMPLEMENTATION — HealthOX
_Project configuration, source map, and implementation patterns_

---

## Package Scripts

| Script | Command | When to use |
|---|---|---|
| `dev` | `next dev` | Local development |
| `build` | `next build` | Pre-deploy check; runs ESLint |
| `start` | `next start` | Test production build locally |
| `lint` | `next lint` | Before every commit |
| `test` | `vitest` | Development (watch mode) |
| `test:run` | `vitest run` | CI (single pass, exit code) |

---

## Configuration Files

| File | Purpose | Key settings |
|---|---|---|
| `next.config.mjs` | Next.js config | Image domains (Supabase, OFF, GCS), server components external packages |
| `tailwind.config.ts` | Tailwind config | Custom earthy color tokens, `shimmer` + `fadeIn` keyframes |
| `tsconfig.json` | TypeScript | `strict: true`, `@/*` alias, `bundler` module resolution |
| `vitest.config.ts` | Test config | jsdom environment, `@/` alias |
| `vercel.json` | Vercel config | Cron: `0 4 * * 1` (Monday 04:30 UTC = 10:00 IST) |
| `postcss.config.mjs` | PostCSS | tailwindcss + autoprefixer |
| `.eslintrc.json` | ESLint | next/core-web-vitals, no-any error |
| `public/sw.js` | Service Worker | Cache strategies by route pattern |
| `public/manifest.json` | PWA manifest | name, icons, theme_color, background_color |

---

## Source Map — Key Files

### Entry points
| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — all Providers, grain, cursor, BottomNav |
| `src/middleware.ts` | Auth guard — protects 15+ route prefixes |
| `src/app/page.tsx` | Landing page (`/`) |

### Health engine
| File | Purpose |
|---|---|
| `src/lib/health-engine/index.ts` | `scoreProduct()` — entry point, assembles all components |
| `src/lib/health-engine/scorer.ts` | `scoreNutrition()`, `scoreAdditives()`, `classifyNOVA()` |
| `src/lib/health-engine/additives-db.ts` | 50+ additive records with INS codes and risk levels |
| `src/lib/fssai-checker.ts` | `checkFSSAICompliance()` — banned additive list + trans fat |
| `src/lib/child-safety-rules.ts` | `evaluateChildSafety()` — age-group thresholds |
| `src/lib/icmr-rda.ts` | `getRDA(age, gender, activity)` — ICMR 2020 lookup |

### Scan pipeline
| File | Purpose |
|---|---|
| `src/lib/scan-helpers.ts` | `orchestrateLookup()` — 6-step lookup chain |
| `src/lib/openfoodfacts.ts` | OFF API, UPC Item DB, Tavily search clients |
| `src/lib/barcode-intelligence.ts` | 70+ Indian brand prefix mappings |
| `src/lib/gemini.ts` | Gemini 2.5 Flash client — vision + OCR |
| `src/lib/groq.ts` | Groq client initialisation |
| `src/lib/groq-ai.ts` | Prompt builders for analysis, alternatives, child safety |

### Indian data
| File | Purpose |
|---|---|
| `src/lib/curated-alternatives.ts` | 30+ Indian category → alternatives mappings |
| `src/lib/shopping-links.ts` | Marketplace URL builders + affiliate tag config |
| `src/lib/ocr/indian-label-parser.ts` | FSSAI format nutrition label OCR |
| `src/data/icmr-rda.json` | ICMR 2020 RDA values by demographic |
| `src/data/fssai-rules.json` | FSSAI banned + restricted additives |
| `src/data/child-safety-rules.json` | Age-group nutrient thresholds |

### Infrastructure
| File | Purpose |
|---|---|
| `src/lib/auth.ts` | NextAuth config, `requireAuth()`, Supabase session sync |
| `src/lib/supabase.ts` | Anon client — safe for client-side |
| `src/lib/supabaseAdmin.ts` | Service role client — server-only |
| `src/lib/rateLimit.ts` | `enforceRateLimit()` wrapping `check_rate_limit()` |
| `src/lib/offline-cache.ts` | IndexedDB product cache, brand data, sync queue |
| `src/lib/badge-engine.ts` | `checkAndAwardBadges()` — 8 badge types |
| `src/lib/gamification.ts` | Badge definitions (id, name, threshold, description) |
| `src/lib/api-auth.ts` | `validateInternalSecret()` — x-internal-secret check |
| `src/lib/admin.ts` | `requireAdmin()` — ADMIN_EMAILS check |

---

## API Route Implementation Pattern

Every API route follows this structure:
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/rateLimit'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const session = await requireAuth()

    // 2. Rate limit
    await enforceRateLimit(session.user.id, 'action_name', 20, 60)

    // 3. Parse + validate input
    const body = await req.json()
    if (!body.requiredField) {
      return NextResponse.json(
        { data: null, error: { code: 'VALIDATION_ERROR', message: 'requiredField is required' } },
        { status: 400 }
      )
    }

    // 4. Business logic
    const result = await doTheThing(body)

    // 5. Return
    return NextResponse.json({ data: result, error: null })

  } catch (err) {
    console.error('[example]', err)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    )
  }
}
```

---

## Supabase Query Pattern

Always use the admin client in API routes. Never use the anon client in API routes.
```typescript
// ✅ API route — use admin
import { supabaseAdmin } from '@/lib/supabaseAdmin'
const { data, error } = await supabaseAdmin.from('products').select('*').eq('barcode', barcode).single()

// ✅ Client component — use anon (via hook)
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
const supabase = createClientComponentClient()
```

Handle errors explicitly — never destructure and ignore:
```typescript
const { data, error } = await supabaseAdmin.from('products').insert(product)
if (error) throw new Error(`[products] insert failed: ${error.message}`)
```

---

## Auth Flow Implementation

```typescript
// src/lib/auth.ts — key patterns

// requireAuth(): throws if no session — use in every protected API route
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new UnauthorizedError()
  return session
}

// NextAuth callback — sync to Supabase on every sign-in
callbacks: {
  async signIn({ user }) {
    await supabaseAdmin.from('user_profiles').upsert({
      user_id: user.id,
      email: user.email,
      name: user.name,
    }, { onConflict: 'user_id' })
    return true
  }
}
```

---

## Offline Sync Implementation

```typescript
// src/lib/offline-cache.ts

// Sync queue pattern
export async function queueOfflineAction(action: OfflineAction) {
  const db = await openDB()
  await db.add('offline-queue', { ...action, queuedAt: Date.now() })
}

export async function drainOfflineQueue() {
  const db = await openDB()
  const queue = await db.getAll('offline-queue')
  for (const action of queue) {
    try {
      await fetch(action.url, { method: action.method, body: JSON.stringify(action.body) })
      await db.delete('offline-queue', action.id)
    } catch {
      // Keep in queue, retry next reconnect
    }
  }
}

// Call drainOfflineQueue() on 'online' event
window.addEventListener('online', drainOfflineQueue)
```

---

## Weekly Cron Implementation

`vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/weekly-report",
    "schedule": "30 4 * * 1"
  }]
}
```
Note: `30 4 * * 1` = 04:30 UTC = 10:00 IST (Monday morning).

Batching — prevents Vercel serverless 10s timeout:
```typescript
// Process users in batches of 50
const users = await supabaseAdmin.from('user_profiles').select('user_id').eq('unsubscribed', false)
const batches = chunk(users.data, 50)
for (const batch of batches) {
  await Promise.allSettled(batch.map(user => sendWeeklyReport(user.user_id)))
}
```

---

## Environment Setup (local dev)

```bash
# 1. Clone
git clone https://github.com/Samadsaifi14/nutriscan
cd nutriscan

# 2. Install
npm install

# 3. Copy env
cp .env.example .env.local
# Fill in all 16 variables

# 4. Supabase local (optional)
npx supabase start
npx supabase db push  # applies all migrations

# 5. Run
npm run dev
```

---

## Image Processing Pipeline

For community product submissions:
```
User photo → image-enhancer.ts → canvas-based processing:
  1. Auto-contrast (histogram equalisation)
  2. Sharpening (unsharp mask)
  3. JPEG compression at 85% quality
  4. Max 2048px on longest edge

→ Upload to Supabase Storage: products/{barcode}/front.jpg
→ Gemini Vision OCR: extracts ingredients + nutrition values
→ Pre-fills contribution form
→ User reviews and submits
```
