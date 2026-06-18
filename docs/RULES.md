# RULES — HealthOX Coding Standards
_Conventions, naming, security, and commit practices_

---

## TypeScript

- Strict mode enabled in `tsconfig.json` — no `any` types
- Path alias: `@/*` maps to `./src/*`
- Shared interfaces exported from `src/types/index.ts` and `src/types/scanResult.ts`
- No Prisma/Drizzle — raw Supabase JS SDK queries only
- No client-side state library — TanStack React Query v5 for all server state

---

## ESLint

Config: `next/core-web-vitals`

| Rule | Level |
|---|---|
| `no-unused-vars` | warn |
| `no-console` | warn |

ESLint runs as part of `next build` — build fails on errors.

---

## Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Files | kebab-case | `scan-helpers.ts`, `floating-scan-button.tsx` |
| Components | PascalCase | `OverviewTab`, `IngredientChip` |
| Functions | camelCase | `scoreProduct`, `classifyNOVA` |
| API routes | kebab-case dir | `/api/scan-product-photo` |
| DB columns | snake_case | `health_score`, `scan_count` |
| DB tables | PascalCase | `products`, `user_profiles` |
| Env vars | UPPER_SNAKE_CASE | `GEMINI_API_KEY` |

---

## Component Exports

- Use `export default` for page and layout components
- Named exports for utility functions and types
- No redundant re-exports of default exports as named

---

## Security Rules

1. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
2. All protected routes must call `requireAuth()` — never rely on middleware alone
3. Internal API-to-API calls must include `x-internal-secret` header
4. Cron endpoints must verify `CRON_SECRET` header before processing
5. Admin endpoints must check `ADMIN_EMAILS` env var
6. Rate limit all analysis, scoring, and AI endpoints
7. Use `supabaseAdmin` (service role) only in server-side API routes

---

## Commit Convention

Format: `type: imperative mood description`

| Prefix | Use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code restructure (no behavior change) |
| `chore:` | Build, deps, config |
| `docs:` | Documentation only |
| `test:` | Tests only |

Examples:
```
feat: add barcode intelligence for Indian brands
fix: resolve Gemini overloaded error with token reduction
refactor: migrate dashboard to direct Supabase queries
chore: purge large CSV files from git history
```

---

## Testing

- Framework: Vitest + jsdom
- Test files: 8 files in `/tests/`
- Run: `npm run test:run` (single pass), `npm run test` (watch)
- Test coverage targets: health engine, barcode detection, groq fallback, client analysis

---

## Error Handling

- Every API route must have a top-level try/catch returning structured JSON errors
- Global `ErrorBoundary` wraps the app for React render errors
- Per-route error boundaries on critical pages
- AI calls must have deterministic fallbacks — never let AI failure break the scan flow
- Log errors to Sentry in production (when configured)
