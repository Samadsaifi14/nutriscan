# TRACKER — HealthOX Feature Status
_Implementation status and improvement backlog_

---

## Implemented Features ✅

### Core Scanning
- [x] Barcode scanning via BarcodeDetector API
- [x] Product lookup chain: DB → OFF → UPC → Tavily → Gemini AI → Category default
- [x] Health score engine (deterministic, 0–10, A–F grading)
- [x] Additive detection (50+ additives, INS codes, 3 risk levels)
- [x] NOVA classification (groups 1–4)
- [x] FSSAI compliance checking (banned additives, trans fat limit)
- [x] Child safety evaluation (age-group nutrient limits)
- [x] ICMR RDA comparison for Indian demographics
- [x] Indian barcode prefix intelligence (70+ brands)

### AI Features
- [x] Groq AI analysis (ingredient classification, personalized warnings)
- [x] Gemini vision analysis (product photos + nutrition label OCR)
- [x] Healthier product alternatives (AI-generated + curated)
- [x] Graceful AI degradation (deterministic fallback always active)

### Nutrition Tracking
- [x] Meal logging with servings
- [x] Daily/weekly nutrition dashboard
- [x] Calorie ring visualization
- [x] Meal history (date-grouped, meal-type filterable)
- [x] Scan history
- [x] Favorites (save + quick re-log)
- [x] Logging streak tracking

### User System
- [x] Google OAuth sign-in (NextAuth v4)
- [x] Multi-step profile setup / onboarding (8 steps)
- [x] Badge / gamification system (8 badge types)
- [x] Avatar upload

### Community
- [x] Community product contribution (photos + OCR)
- [x] Community product validation (voting)
- [x] Product corrections (crowdsourced field-level)
- [x] Community product search

### India-Specific
- [x] Indian shopping links (Amazon, Flipkart, Blinkit, Instamart, BigBasket, Zepto, JioMart)
- [x] Indian nutrition label OCR (FSSAI format)
- [x] Curated alternatives for 30+ Indian product categories
- [x] FSSAI compliance engine
- [x] en-IN locale formatting

### Infrastructure
- [x] PWA (service worker + manifest)
- [x] Offline support (IndexedDB caching + sync queue)
- [x] Dark/light theme (next-themes, system default)
- [x] Rate limiting (per-user per-action)
- [x] Weekly email reports (Vercel Cron + Resend)
- [x] Welcome email on signup
- [x] Email unsubscribe (HMAC-signed tokens)
- [x] Google Analytics 4 with cookie consent
- [x] Social sharing (WhatsApp, Twitter, Facebook, copy link)
- [x] Admin endpoints
- [x] Error boundaries (global + per-route)
- [x] Sentry error monitoring (optional/configured)

---

## Backlog / Improvements 🔲

### Security & Reliability
- [ ] CSRF protection beyond NextAuth default
- [ ] CORS headers (if multi-origin API use needed)
- [ ] Migration rollback strategy (currently forward-only)

### Testing
- [ ] End-to-end tests (Playwright/Cypress) — only unit tests exist today
- [ ] Integration tests for scan chain and AI fallback paths
- [ ] CI test run on pull requests

### Next.js Features
- [ ] Server Actions (config present but unused — migrate form handlers)

### Product Features
- [ ] Barcode manual entry fallback (for damaged barcodes)
- [ ] Nutrition comparison mode (A vs B product)
- [ ] Push notifications for streak reminders (Web Push API)
- [ ] Bulk scan history export (CSV/PDF)
- [ ] Product request form (request a missing product without contributing full data)

### Indian Market
- [ ] GS1 India DataKart integration for official barcode data
- [ ] Bulk import pipeline for Open Food Facts Indian product dataset
- [ ] Hindi / regional language UI option

### Performance
- [ ] Image optimization pipeline for community-submitted product photos
- [ ] Edge caching for `/api/scan` on Vercel Edge Config

---

## Known Issues

| Issue | Status | Priority |
|---|---|---|
| Gemini API overload errors under high load | Mitigated (token reduction + vision/text split) | Medium |
| BarcodeDetector API not supported on Firefox | Fallback UI shown | Low |
| Large barcode CSV previously committed to git | Resolved via `git filter-repo` | Done |
