# RULES — HealthOX Coding Standards
_Conventions, patterns, and non-negotiables_

---

## TypeScript

- **Strict mode on** in `tsconfig.json` — `strict: true`, no `any`
- Path alias `@/*` → `./src/*` — no relative `../../` imports
- No Prisma, Drizzle, or any ORM — raw Supabase JS SDK v2 only
- No global client state library — TanStack React Query v5 for all server state
- Interfaces and shared types exported from:
  - `src/types/index.ts` — shared domain types
  - `src/types/scanResult.ts` — scan + analysis response shapes
- Every API route handler has explicit request/response types

### Type patterns
```typescript
// API response shape — always use this
type ApiResponse = { data: T; error: null } | { data: null; error: ApiError }

// Never use inline object types for API responses
// ❌ return NextResponse.json({ product, score })
// ✅ return NextResponse.json<ApiResponse>({ data: result, error: null })
```

---

## ESLint

Config: `extends: ['next/core-web-vitals']`

| Rule | Level |
|---|---|
| `no-unused-vars` | warn |
| `no-console` | warn |
| `@typescript-eslint/no-explicit-any` | error |
| `@typescript-eslint/no-non-null-assertion` | warn |

ESLint runs inside `next build` — CI fails on errors, not warnings.
Run locally: `npm run lint` before every PR.

---

## Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Source files | kebab-case | `scan-helpers.ts`, `barcode-intelligence.ts` |
| Component files | PascalCase | `OverviewTab.tsx`, `IngredientChip.tsx` |
| Functions | camelCase | `scoreProduct()`, `classifyNOVA()`, `enforceRateLimit()` |
| API route dirs | kebab-case | `/api/scan-product-photo/`, `/api/background-scan/` |
| DB columns | snake_case | `health_score`, `last_scanned_at` |
| DB tables | snake_case | `user_profiles`, `scan_sessions` |
| Env vars | UPPER_SNAKE_CASE | `SUPABASE_SERVICE_ROLE_KEY` |
| CSS custom properties | kebab-case | `--clay`, `--bark-mid`, `--moss-light` |
| Tailwind classes | kebab-case (Tailwind standard) | `text-bark`, `bg-clay/10` |

---

## Component Exports

- `export default` for pages and layout components
- Named exports for utility functions, hooks, and types
- No redundant re-export of default as named
- One component per file (with the exception of small co-located subcomponents < 30 lines)

```typescript
// ✅ Correct
export default function OverviewTab() { ... }
export type { OverviewTabProps }

// ❌ Wrong — redundant named export
export default function OverviewTab() { ... }
export { OverviewTab }
```

---

## Security Non-Negotiables

These are hard rules. No exceptions.

1. `SUPABASE_SERVICE_ROLE_KEY` — server-only. Never import `supabaseAdmin.ts` in any file under `src/components/` or `src/app/` (client components).
2. Every protected API route calls `requireAuth()`. Middleware alone is not sufficient.
3. Internal API-to-API calls (welcome-email, promote) require `x-internal-secret` header.
4. Cron endpoint verifies `CRON_SECRET` as Bearer token before any processing.
5. Admin routes verify `ADMIN_EMAILS` env var after `requireAuth()`.
6. Rate limit every endpoint that calls Gemini or Groq — AI cost is a real attack vector.
7. HMAC-sign all unsubscribe tokens — never use raw user IDs in email links.
8. Never log session tokens, API keys, or user PII to console.
9. Input validation on every POST/PUT route before DB writes.

---

## Error Handling

Every API route:
```typescript
export async function POST(req: Request) {
  try {
    const session = await requireAuth()
    // ... logic
    return NextResponse.json<ApiResponse>({ data: result, error: null })
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json({ data: null, error: { code: 'RATE_LIMITED', message: '...' } }, { status: 429 })
    }
    console.error('[route-name]', err)
    return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } }, { status: 500 })
  }
}
```

Rules:
- Never return stack traces to the client
- Always log errors server-side with route context prefix: `[scan]`, `[analyze]`, etc.
- AI failures must not propagate — catch Gemini/Groq errors, return deterministic result with `ai_available: false` flag
- React error boundaries on all route segments, not just root

---

## Commit Convention

Format: `type(scope): imperative description`

| Prefix | Use |
|---|---|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `refactor` | Restructure without behaviour change |
| `perf` | Performance improvement |
| `chore` | Build, deps, config, tooling |
| `docs` | Documentation only |
| `test` | Tests only |
| `security` | Security fix or hardening |

Examples:
feat(scan): add 5-step lookup chain with Tavily fallback

fix(auth): resolve Google OAuth redirect_uri_mismatch on Vercel

refactor(dashboard): migrate to direct Supabase queries via TanStack Query

perf(gemini): reduce token budget to avoid overload errors

security(email): add HMAC-signed unsubscribe tokens

chore(git): purge large OFF CSV files from history via filter-repo

Scope options: `scan`, `analyze`, `dashboard`, `auth`, `email`, `pwa`, `engine`, `community`, `schema`, `deploy`

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production. Vercel auto-deploys. |
| `dev` | Integration branch. PRs merge here first. |
| `feat/*` | Feature branches off `dev` |
| `fix/*` | Bug fix branches off `main` (hotfix) or `dev` |

PRs to `main` require:
- `npm run lint` passing
- `npm run test:run` passing
- Manual smoke test of scan flow on Vercel preview

---

## Testing

Framework: Vitest + jsdom
tests/

├── health-engine/

│   ├── scorer.test.ts          scoreProduct(), scoreNutrition(), scoreAdditives(), classifyNOVA()

│   ├── alternatives.test.ts    curated-alternatives matching

│   └── additives-db.test.ts    additive database integrity + INS code uniqueness

├── barcode.test.ts              Indian prefix detection, 70+ brand mappings

├── groq-fallback.test.ts        Groq failure → deterministic fallback path

├── client-analysis.test.ts      Client-side analysis pipeline

├── profile.test.ts              User profile validation, RDA calculation

└── image-enhancer.test.ts       OCR image preprocessing

Test rules:
- Health engine tests must be exhaustive — this is the core product
- Every deterministic fallback path must have a test
- Mocking policy: mock all external APIs (Gemini, Groq, OFF), never mock the health engine
- Run: `npm run test:run` in CI, `npm run test` in development (watch mode)

Missing (add to backlog):
- E2E tests (Playwright) for scan → log → dashboard flow
- Integration tests for lookup chain step transitions
- Rate limit boundary tests
