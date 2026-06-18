# PRD — HealthOX (BioYou / Nutriscan)
_Product Requirements Document_

---

## 1. Problem Statement

Indian consumers have no fast, trustworthy way to evaluate packaged food health impact in the context of Indian labeling standards (FSSAI), Indian dietary guidelines (ICMR RDA), and Indian market availability. Generic global tools miss Indian barcodes, Indian brand nuances, and culturally relevant alternatives.

---

## 2. Target Users

| Persona | Description |
|---|---|
| Health-conscious consumer | Adults 20–45 tracking diet and fitness |
| Parent | Checking child safety of packaged snacks/drinks |
| Dietary-restricted user | Diabetic, hypertensive, vegetarian/vegan |
| Fitness enthusiast | Macro-tracking, high-protein goals |

---

## 3. User Stories

### Core Scanning
- As a user, I can scan a product barcode and receive a health score (0–10) with A–F grading
- As a user, I can see ingredient-level analysis with harmful/safe/unknown tagging
- As a user, I can photograph a product to extract nutrition data via OCR
- As a user, I get personalized analysis based on my age, gender, activity level, and health conditions

### Nutrition Tracking
- As a user, I can log meals and track daily/weekly intake against ICMR RDA goals
- As a user, I can view a dashboard with calorie ring, macro breakdown, and logging streak
- As a user, I can save favorite meals and re-log them in one tap
- As a user, I receive a weekly nutrition summary email

### Discovery & Alternatives
- As a user, I can search for products across the database and Open Food Facts
- As a user, I see healthier Indian alternatives for any scanned product
- As a user, I can buy scanned products via Amazon, Flipkart, Blinkit, Instamart, BigBasket, Zepto, JioMart

### Community
- As a user, I can contribute missing product data (photo + label)
- As a user, I can validate community-submitted products
- As a user, I can submit corrections to incorrect product data
- As a user, I earn badges for contributions and consistent logging

### Sharing & PWA
- As a user, I can share results on WhatsApp, Twitter, Facebook
- As a user, the app works offline (PWA + IndexedDB)

---

## 4. India-Specific Requirements

- Indian barcode prefix detection (890 range)
- FSSAI compliance checking (banned additives, trans fat < 0.2g)
- Indian nutrition label OCR (FSSAI format: Energy kcal, Total Carbohydrate, Per 100g)
- ICMR RDA reference values for Indian demographic profiles
- 70+ Indian brand barcode prefix mappings
- Curated healthier alternatives for 30+ Indian product categories
- Indian marketplace shopping links with affiliate tags
- `en-IN` locale number and date formatting

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Mobile-first, LCP < 2.5s |
| Offline | PWA with service worker + IndexedDB caching |
| Reliability | Graceful AI degradation — deterministic engine always available |
| Security | RLS, rate limiting, no service_role key client-side |
| Accessibility | WCAG AA contrast, keyboard navigable |
| Theme | Dark/light system-default with manual override |
| Analytics | Google Analytics 4 with cookie consent gate |
| Monitoring | Sentry (optional) |

---

## 6. Key Metrics

| Metric | Description |
|---|---|
| Scan count | Total + daily active scans |
| User retention | D7, D30 login rates |
| Meal log rate | % of scans that lead to a food log |
| Community contributions | Products submitted + validated |
| Badge award rate | Gamification engagement |
| Weekly email open rate | Report engagement |

---

## 7. Out of Scope (v1)

- Direct e-commerce checkout (links only, no cart)
- Custom recipe builder
- Healthcare provider integration
- Paid subscription tier
