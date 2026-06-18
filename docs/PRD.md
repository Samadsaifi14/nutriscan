# PRD — HealthOX
_Product Requirements Document · v1.0_

---

## 1. Vision

India has 1.4 billion people eating packaged food governed by FSSAI regulations, yet
no consumer product exists that makes those regulations legible. HealthOX is the first
AI-powered food intelligence platform built specifically for the Indian market —
combining deterministic nutritional science, FSSAI compliance, and Gemini Vision AI
into a sub-second scan experience.

The north star: a parent in Lucknow should be able to scan a children's biscuit packet
and know within 3 seconds whether it is safe, why, and what to buy instead.

---

## 2. Problem Statement

| Pain | Current Reality | HealthOX Solution |
|---|---|---|
| Can't read nutrition labels | FSSAI labels use Per 100g format, not serving size | OCR parser tuned to FSSAI label format |
| Global apps miss Indian products | OFF has < 20% Indian barcode coverage | 5-layer lookup chain with Indian-specific fallbacks |
| Western RDA doesn't apply | US/EU apps reference FDA/EFSA values | ICMR 2020 RDA by Indian demographic profile |
| Additives not explained | INS codes on labels are opaque | 50+ additives with plain-language risk explanations |
| No child-specific guidance | Generic adult scoring | Age-group-specific child safety evaluation |
| No alternatives in Indian context | "Try a healthier option" links to US Amazon | Curated Indian alternatives + live Blinkit/Zepto links |

---

## 3. Target Users

### Primary
**Health-conscious urban Indian, 25–45**
Tracks diet, reads labels, uses apps. Understands broad nutrition but can't parse
FSSAI-specific additive codes. Shops on Blinkit/Zepto. Uses WhatsApp heavily.

### Secondary
**Indian parent, 30–50**
Buying snacks and beverages for children under 12. Needs child-safety signals,
not generic adult scores. Primary trigger: ingredient concern, not macro tracking.

### Tertiary
**Fitness-focused individual, 20–35**
Macro tracking, protein goals, NOVA classification matters. Will use meal logging
and weekly reports consistently.

### Anti-persona
International user with no Indian market context. This product is not optimised
for them and should not dilute India-specific features to serve them.

---

## 4. User Stories

### Core Scanning
- As a user, I can scan a product barcode and receive a health score (0–10) with A–F grading in under 3 seconds
- As a user, I can photograph a nutrition label and have ingredients auto-extracted via OCR
- As a user, I see color-coded ingredient chips (green/amber/red) with plain-language risk explanations
- As a user, I get a NOVA processing classification (1–4) with a plain explanation
- As a user, I see FSSAI compliance status — specifically whether any banned additives are present
- As a user, I see a child safety evaluation when the product is relevant for under-12s
- As a user, I get personalized analysis based on my profile (age, gender, activity, health conditions)
- As a user, when AI is unavailable, I still get a complete deterministic score

### Discovery & Alternatives
- As a user, I see 3–5 healthier Indian alternatives for any scanned product
- As a user, I can buy any scanned product or its alternative directly from Amazon IN, Flipkart, Blinkit, Instamart, BigBasket, Zepto, or JioMart
- As a user, I can search the product database before scanning

### Nutrition Tracking
- As a user, I can log a scanned product as a meal with serving size
- As a user, I can view today's nutrition against my ICMR RDA goals on a dashboard
- As a user, I can view meal history grouped by date and meal type
- As a user, I can save a meal as a favorite and re-log it in one tap
- As a user, I can see my consecutive logging streak
- As a user, I receive a weekly nutrition summary email every Monday

### Community
- As a user, I can contribute a missing product by photographing it
- As a user, I can vote to validate or reject community-submitted products
- As a user, I can submit corrections to incorrect product data
- As a user, I earn badges for contributions, streak milestones, and scan counts
- As a user, community products I submit become part of the main database once validated

### Platform
- As a user, the app works fully offline after first load (PWA)
- As a user, meal logs and product submissions made offline sync automatically on reconnect
- As a user, I can share my scan result to WhatsApp, Twitter, or Facebook
- As a user, I can unsubscribe from weekly emails via a one-click signed link

---

## 5. India-Specific Requirements

These are non-negotiable. They define the product's right to exist in the Indian market.

| Requirement | Implementation |
|---|---|
| Indian barcode prefix detection | 890-prefix detection + 70+ brand mappings in `barcode-intelligence.ts` |
| FSSAI compliance checking | Banned additive list from `fssai-rules.json`, trans fat < 0.2g check |
| Indian nutrition label OCR | FSSAI format parser: Energy kcal, Total Carbohydrate, Per 100g |
| ICMR RDA reference | `icmr-rda.json` with values by age/gender/activity level (ICMR 2020) |
| Indian product alternatives | `curated-alternatives.ts` covering 30+ Indian product categories |
| Indian marketplace links | Amazon IN, Flipkart, Blinkit, Instamart, BigBasket, Zepto, JioMart |
| Child safety rules | Age-group thresholds from `child-safety-rules.json` |
| Locale | `en-IN` number formatting throughout |

---

## 6. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| Performance | First Contentful Paint | < 1.5s |
| Performance | Scan-to-score latency | < 3s (deterministic path) |
| Performance | Core Web Vitals | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| Reliability | AI fallback | Deterministic score always returned even if Gemini + Groq both fail |
| Reliability | Uptime | Vercel SLA (99.99%) |
| Offline | PWA coverage | Static assets + scan results cached; offline meal log queue |
| Security | Auth | RLS on all user tables; service_role never client-side |
| Security | Rate limiting | All analysis/AI endpoints rate-limited per-user |
| Accessibility | Colour contrast | WCAG AA minimum throughout |
| Accessibility | Motion | `prefers-reduced-motion` respected on all animations |
| Internationalisation | Locale | `en-IN` throughout; architecture supports future Hindi addition |

---

## 7. Community Moderation Rules

These thresholds are not currently documented — they must be codified:

| Event | Threshold | Action |
|---|---|---|
| Community product → main DB | 3 approve votes, 0 reject | Auto-promote via `/api/community/promote` |
| Community product → rejected | 2 reject votes | Status set to `rejected`, hidden from search |
| Product correction → applied | Admin review OR 5 community approvals | `status = approved`, field updated on products |
| User badge: Contributor | 5 approved submissions | Awarded by badge engine |
| User badge: Validator | 10 validation votes cast | Awarded by badge engine |

---

## 8. Key Metrics & Success Definition

| Metric | Definition | v1 Target |
|---|---|---|
| Activation | % of sign-ups who complete onboarding | > 60% |
| Scan depth | % of scans that view Ingredients tab | > 40% |
| Log rate | % of scans that result in a meal log | > 25% |
| D7 retention | Users who return within 7 days | > 30% |
| Community contribution rate | MAU who submit ≥ 1 product | > 5% |
| Email open rate | Weekly report opens | > 35% |
| Offline usage | Sessions initiated without network | Tracked via GA4 |

---

## 9. Out of Scope — v1

- Direct e-commerce checkout (affiliate links only)
- Custom recipe builder
- Healthcare provider / doctor integration
- Paid subscription tier
- Hindi / regional language UI
- Android/iOS native app (PWA covers mobile)
