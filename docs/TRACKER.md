# TRACKER — HealthOX Feature Status
_v1.0 · Updated June 2026_

---

## v1.0 — Implemented ✅

### Core Scan Engine
- [x] Barcode scanning — BarcodeDetector API with camera feed
- [x] 6-step product lookup chain: DB → OFF → UPC → Tavily → Gemini → Default
- [x] Deterministic health score engine (0–10, A–F, < 50ms)
- [x] Additive detection — 50+ INS codes, 3 risk levels
- [x] NOVA classification (groups 1–4)
- [x] FSSAI compliance checking — banned additives + trans fat < 0.2g
- [x] Child safety evaluation — age-group nutrient thresholds
- [x] ICMR RDA comparison — ICMR 2020, Indian demographics
- [x] Personalised analysis adjustments via user profile
- [x] Graceful AI degradation — deterministic result always returned

### AI Features
- [x] Gemini 2.5 Flash — product photo OCR, nutrition label extraction
- [x] Groq llama-3.1-8b-instant — ingredient classification, personalised warnings
- [x] Token budget management — prevents Gemini overload errors
- [x] Vision/text API separation — reduces per-call token usage

### India-Specific
- [x] 890-prefix Indian barcode detection
- [x] 70+ Indian brand prefix mappings (Amul, Haldiram's, Maggi, etc.)
- [x] Indian nutrition label OCR (FSSAI Per 100g format)
- [x] FSSAI compliance engine with 2024 banned additive list
- [x] Curated alternatives — 30+ Indian product categories
- [x] Indian shopping links — Amazon IN, Flipkart, Blinkit, Instamart, BigBasket, Zepto, JioMart
- [x] en-IN locale formatting

### Nutrition Tracking
- [x] Meal logging with custom serving sizes
- [x] Daily nutrition dashboard — calorie ring, macro breakdown
- [x] ICMR RDA progress visualisation
- [x] Meal history — date-grouped, meal-type filterable
- [x] Scan history — full product scan log
- [x] Meal favorites — save + one-tap relog
- [x] Consecutive logging streak

### User System
- [x] Google OAuth sign-in (NextAuth v4)
- [x] 8-step profile onboarding
- [x] OnboardingGate — redirects incomplete profiles
- [x] Badge/gamification system — 8 badge types
- [x] Avatar upload to Supabase Storage

### Community
- [x] Product contribution — camera capture + OCR pre-fill
- [x] Image enhancement pipeline for OCR quality
- [x] Community product validation — approve/reject voting
- [x] Vote deduplication — UNIQUE(product_id, user_id)
- [x] Product corrections — field-level crowdsourced edits
- [x] Community product search
- [x] Admin promote endpoint

### Email
- [x] Weekly nutrition report — Vercel Cron (Mon 10AM IST) + Resend
- [x] Welcome email on first sign-in
- [x] HMAC-signed unsubscribe tokens
- [x] One-click unsubscribe endpoint

### Infrastructure
- [x] PWA — service worker + Web App Manifest
- [x] Offline support — IndexedDB caching + offline sync queue
- [x] Dark/light theme — next-themes, system default, warm-dark palette
- [x] Rate limiting — per-user per-action, 8 action types
- [x] Row-level security — all user tables
- [x] Google Analytics 4 — cookie consent gate
- [x] Social sharing — WhatsApp, Twitter, Facebook, copy link
- [x] Error boundaries — global + per-route
- [x] Sentry — optional error monitoring
- [x] Internal secret guard — x-internal-secret on internal API calls
- [x] Admin endpoints — ADMIN_EMAILS guard

---

## v1.1 — High Priority Backlog 🔴

### Architecture
- [ ] **Replace pending_scans polling loop with Supabase Realtime subscription**
      Currently causes infinite polling bug. Subscribe to `pending_scans` filtered by `user_id`.
- [ ] **Rate limit table cleanup cron**
      Add `DELETE FROM rate_limits WHERE window_start < now() - interval '24 hours'` to weekly cron.
- [ ] **Community moderation thresholds documented and enforced**
      3 approvals + 0 rejections → auto-promote. 2 rejections → auto-reject. Implement as DB trigger.

### Security
- [ ] **Input validation library** — add Zod for schema validation on all POST/PUT routes
- [ ] **CSRF token** on non-GET routes beyond NextAuth's built-in protection
- [ ] **Content-Security-Policy headers** in `next.config.mjs`

### Testing
- [ ] **E2E tests** — Playwright: scan → log → dashboard flow
- [ ] **Integration tests** — lookup chain step transitions
- [ ] **Rate limit boundary tests** — verify 429 at correct threshold
- [ ] **CI pipeline** — GitHub Actions: lint + test on every PR to `dev`

---

## v1.2 — Medium Priority 🟡

### Product
- [ ] Barcode manual entry fallback — for damaged/unlabelled barcodes
- [ ] Product comparison mode — scan A, scan B, side-by-side nutrition + score
- [ ] Nutrition goal calculator — auto-compute ICMR-based daily goals from profile
- [ ] Push notifications — Web Push API for streak reminders (opt-in)
- [ ] Scan history export — CSV/PDF download

### Indian Market Expansion
- [ ] GS1 India DataKart integration — official Indian barcode registry
- [ ] Open Food Facts bulk import — monthly OFF India dataset import pipeline
- [ ] Regional product categories — expand beyond 30 to 60+ categories
- [ ] Hindi UI option — i18n architecture via `next-intl`

### Performance
- [ ] Edge caching — Vercel Edge Config for `/api/scan` on popular Indian products
- [ ] Image optimization — WebP conversion + CDN for community product photos
- [ ] Bundle analysis — `@next/bundle-analyzer` to enforce < 200KB initial JS

### Email
- [ ] Rich email template — product images, score rings rendered in email
- [ ] Daily digest option (opt-in) — in addition to weekly report

---

## v2.0 — Future Consideration 🟢

- [ ] Native Android/iOS app — React Native with shared business logic
- [ ] Hindi / regional language UI — Bengali, Tamil, Telugu, Marathi
- [ ] Family account — child profiles with automatic child-safety mode
- [ ] Restaurant food analysis — manual macro entry for unpackaged food
- [ ] Healthcare integration — share reports with nutritionist / doctor
- [ ] Premium tier — unlimited scans, detailed AI reports, export
- [ ] API for developers — public HealthOX API for Indian food data
- [ ] GS1 registration — contribute new Indian products to global barcode registry

---

## Known Issues

| Issue | Severity | Status | Notes |
|---|---|---|---|
| Infinite polling on pending_scans | High | Open | Replace with Supabase Realtime |
| Rate limit table unbounded growth | Medium | Open | Add cron cleanup |
| BarcodeDetector API — Firefox unsupported | Low | Mitigated | Fallback UI shown |
| Gemini overload under high concurrency | Medium | Mitigated | Token reduction + vision/text split |
| Large OFF CSV in git history | High | Resolved | Purged via `git filter-repo` |
| Google OAuth redirect_uri_mismatch | High | Resolved | Middleware placement fixed |

---

## Dependency Health

| Package | Version | Last checked | Status |
|---|---|---|---|
| `next` | 14.x | Jun 2026 | ✅ Current |
| `@supabase/supabase-js` | v2 | Jun 2026 | ✅ Current |
| `next-auth` | v4 | Jun 2026 | ⚠️ v5 available — evaluate migration |
| `@tanstack/react-query` | v5 | Jun 2026 | ✅ Current |
| `framer-motion` | latest | Jun 2026 | ✅ Current |
| `vitest` | latest | Jun 2026 | ✅ Current |
