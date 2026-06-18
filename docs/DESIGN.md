# DESIGN — HealthOX UI/UX System
_Design system, component specifications, and page inventory_

---

## Design Philosophy

HealthOX uses **organic minimalism** — warm earthy tones, editorial typography,
film grain texture, and 3D spatial depth. The aesthetic is grounded in Indian
materials culture (clay, bark, moss, sand) rather than generic tech-startup
palettes (electric blue, emerald green, purple gradients).

References: Igloo Inc (3D depth, grain, spatial composition), Maná Yerba Mate
(earthy palette, editorial type, slow deliberate animation).

The product should feel **handcrafted and Indian**, not generated.

---

## Typography

| Role | Font | Weight | Size | Tracking |
|---|---|---|---|---|
| Hero display | Syne | 800 | clamp(52px, 5.5vw, 80px) | -0.04em |
| Section headings | Syne | 800 | clamp(38px, 4vw, 58px) | -0.04em |
| Card titles | Syne | 700 | 18–22px | -0.03em |
| Navigation logo | Syne | 800 | 18px | -0.03em |
| Body copy | DM Sans | 300 | 15–17px | normal |
| UI labels / nav links | DM Sans | 500 | 13px | 0.04em |
| Eyebrows / tags | DM Sans | 500 | 11px | 0.12em (uppercase) |
| Stat numbers | Syne | 700 | 30px | -0.04em |
| Nutrient values | DM Sans | 500 | 10–12px | normal |

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
```

---

## Color System

Replace all Tailwind `emerald` usage with this custom token system.
These are CSS custom properties defined in `globals.css`:

```css
:root {
  /* Backgrounds */
  --sand:       #F2EDE4;   /* Page background */
  --sand-dark:  #E8E0D3;   /* Input backgrounds, subtle surface */
  --cream:      #FAF7F2;   /* Card backgrounds */

  /* Text */
  --ink:        #1A1208;   /* Display headings */
  --bark:       #2C1F0F;   /* Primary text, dark CTAs */
  --bark-mid:   #4A3520;   /* Secondary text, muted labels */

  /* Brand accents */
  --moss:       #3D5C2E;   /* Safe/healthy, FSSAI, A-grade */
  --moss-light: #6B8F52;   /* Fiber bars, secondary green */
  --clay:       #C4714A;   /* Primary brand accent, CTAs */
  --clay-light: #E8956E;   /* Hover states, scan line glow */

  /* Semantic */
  --risk-red:   #B43C28;   /* Harmful ingredients, banned additives */
  --warn-amber: #C47A1A;   /* Medium-risk additives, B/C grade */
}

/* Dark mode — warm dark, not cold */
.dark {
  --sand:       #130E08;
  --sand-dark:  #1C1510;
  --cream:      #1E1710;
  --ink:        #FAF7F2;
  --bark:       #F2EDE4;
  --bark-mid:   #B8A898;
  /* clay, moss, risk-red unchanged in dark mode */
}
```

Tailwind config:
```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      sand:     { DEFAULT: '#F2EDE4', dark: '#E8E0D3' },
      bark:     { DEFAULT: '#2C1F0F', mid: '#4A3520' },
      ink:      '#1A1208',
      cream:    '#FAF7F2',
      moss:     { DEFAULT: '#3D5C2E', light: '#6B8F52' },
      clay:     { DEFAULT: '#C4714A', light: '#E8956E' },
      risk:     '#B43C28',
      warn:     '#C47A1A',
    }
  }
}
```

---

## Spacing Scale

Use Tailwind's default 4px base scale. Custom additions:

| Token | Value | Usage |
|---|---|---|
| Page padding | 48px | Left/right padding on all sections |
| Section vertical | 120px | Top/bottom padding per section |
| Card padding | 36px 32px | Feature cards |
| Bento padding | 28px | Bento grid cards |
| Gap — feature grid | 20px | Between feature cards |
| Gap — bento grid | 16px | Between bento cells |
| Nav height | 80px | Used as padding-top on hero |

---

## Z-Index System

| Layer | Z-index | Elements |
|---|---|---|
| Grain texture | 9000 | `.grain` fixed overlay |
| Cursor ring | 9998 | `.cursor-ring` |
| Cursor dot | 9999 | `.cursor` |
| Navigation | 100 | `nav` |
| Floating tags | 10 | Phone mockup orbit tags |
| Page content | 2 | Hero copy, feature cards |
| Background orbs | 1 | Ambient radial gradients |

---

## Texture & Atmosphere

### Film grain
Fixed SVG feTurbulence layer at 2.8% opacity (3.5% in dark mode).
Animates through 5 random translate positions at `steps(1)` — creates analogue noise.
Never remove this — it is the single largest differentiator from AI-generated aesthetics.

### Ambient orbs
Radial gradient blobs (clay 12%, moss 8%) placed behind key sections.
Max opacity: 20%. Never use as literal backgrounds.
Use `animation: breathe` (scale 1→1.08, 6–8s ease-in-out infinite) for life.

### Line weight
All borders: `0.5px solid rgba(44,31,15,0.07)` in light mode.
Never use `1px` solid borders on cards — they look digital and harsh.

---

## Custom Cursor

Two-part cursor replaces the system default.
Set `cursor: none` on `body` and all interactive elements.

```css
.cursor {
  width: 10px; height: 10px;
  background: var(--clay);
  border-radius: 50%;
  mix-blend-mode: multiply;
  transition: width 0.2s, height 0.2s;
}
.cursor-ring {
  width: 36px; height: 36px;
  border: 1px solid var(--bark-mid);
  border-radius: 50%;
  opacity: 0.5;
  /* Follows mouse with 0.12 lerp — never instant */
}
```

On hover over any interactive element: dot → 18px, ring → 52px.

```js
// Lerp-based ring follow
let rx = 0, ry = 0;
(function tick() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.cssText = `left:${rx}px;top:${ry}px`;
  requestAnimationFrame(tick);
})();
```

---

## Animation System

### Easing
All animations use `cubic-bezier(.16,1,.3,1)` — a spring-out curve.
Never use `ease-in-out` for entry animations (it feels mechanical).
`cubic-bezier(.34,1.56,.64,1)` for button hover states (slight overshoot).

### Motion reduction
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .grain { animation: none; }
  .phone-scene { animation: none; transform: rotateY(-12deg) rotateX(5deg); }
}
```

### Scroll reveal
```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.9s cubic-bezier(.16,1,.3,1),
              transform 0.9s cubic-bezier(.16,1,.3,1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: 0.1s; }
.reveal-d2 { transition-delay: 0.2s; }
.reveal-d3 { transition-delay: 0.3s; }
```

IntersectionObserver threshold: 0.15.

### 3D Phone Mockup
```css
.phone-scene {
  transform-style: preserve-3d;
  animation: phoneFloat 6s ease-in-out infinite;
}
@keyframes phoneFloat {
  0%,100% { transform: rotateY(-12deg) rotateX(5deg) translateY(0); }
  50%      { transform: rotateY(-8deg) rotateX(3deg) translateY(-20px); }
}
```

Mouse parallax: update `rotateY` ±8deg and `rotateX` ±4deg on mousemove.
Parent must have `perspective: 1200px`.

---

## Component Library

### Feature cards
border-radius: 24px

padding: 36px 32px

background: var(--cream)

border: 0.5px solid rgba(44,31,15,0.07)

hover: translateY(-8px) + box-shadow 0 24px 60px rgba(44,31,15,0.12)

transition: 0.4s cubic-bezier(.34,1.56,.64,1)

### Bento cards
border-radius: 24px

padding: 28px

hover: scale(1.02)

Dark variant: background: var(--bark)

### Buttons
Primary: background bark, color cream, radius 100px, padding 16px 32px

hover: clay fill sweeps left-to-right via ::before scaleX

hover: translateY(-2px)
Light: background cream, color bark, radius 100px

hover: clay background, white text, scale(1.04)
Ghost: color bark-mid, text only with → suffix

hover: color bark, gap increases (→ shifts right)

### Ingredient chips
Safe:    background rgba(61,92,46,0.10)  color #3D5C2E

Warning: background rgba(196,113,74,0.12) color #C4714A

Harmful: background rgba(180,60,40,0.10)  color #B43C28

Banned:  background rgba(180,60,40,0.18)  color #B43C28  font-weight 600
All: font-size 10–11px, padding 4px 10px, border-radius 100px

### Health score ring
SVG circle with animated `stroke-dashoffset`.
A (8–10): stroke var(--moss)

B (6–8):  stroke var(--clay)

C (4–6):  stroke var(--warn-amber)

D–F (<4): stroke var(--risk-red)

### Nutrient bars
height: 5px, border-radius: 100px

Protein: var(--moss)

Carbs:   var(--clay)

Fat:     var(--risk-red)

Fiber:   var(--moss-light)

Sugar:   var(--warn-amber)

### Eyebrow labels
font: DM Sans 500, 11px, uppercase, letter-spacing 0.12em

background: rgba(61,92,46,0.10)  color: var(--moss)  [default]

border-radius: 100px, padding: 6px 14px

### Floating orbit tags (phone mockup)
background: white, border-radius: 100px, padding 8px 14px

box-shadow: 0 8px 30px rgba(44,31,15,0.15)

Staggered tagFloat animations with opacity 0→1 on load

### Marquee ticker
Duplicate content 2× for seamless loop.
`animation: marquee 20s linear infinite`
Pause on hover: `animation-play-state: paused`

---

## Layout Grids

### Hero
`grid-template-columns: 1fr 1fr` — copy left, 3D phone right.
`min-height: 100vh`, `padding-top: 80px` (nav height).

### Features
`grid-template-columns: repeat(3, 1fr)` with one `grid-column: span 2` card.

### Bento
`grid-template-columns: repeat(4, 1fr)`:
- Dark anchor card: `grid-column: span 2; grid-row: span 2`
- Wide card: `grid-column: span 2`
- Single cells: `grid-column: span 1`

### CTA strip
`display: flex; justify-content: space-between; align-items: center`
`margin: 0 48px; border-radius: 32px; padding: 80px`

---

## Component Tree
RootLayout

└── Providers

├── SessionProvider (NextAuth)

├── QueryClientProvider (TanStack v5)

├── ThemeProvider (next-themes, class-based, system default)

├── Analytics (GA4 — consent-gated via CookieBanner)

├── OnboardingGate → profile_completed=false → /profile-setup

├── {children}

├── BottomNav (mobile: Scan / Dashboard / History / Profile)

├── FloatingScanButton (FAB, clay gradient, /scan)

├── ErrorBoundary (global React error boundary)

├── ServiceWorkerRegister

├── Footer

└── CookieBanner (GA consent gate)

---

## Page Inventory

| Route | Key Visual | Notes |
|---|---|---|
| `/` | 3D phone, grain, bento | Landing — organic earthy aesthetic |
| `/auth/signin` | Minimal centered card | Google OAuth, no distractions |
| `/scan` | Scanner frame + animated scan line | BarcodeDetector API |
| `/results` | Score ring, ingredient chips, nutrient bars | 4 tabs |
| `/dashboard` | Calorie ring (clay), macro bars, streak | TanStack Query |
| `/profile-setup` | Multi-step with Syne progress numerals | 8 steps |
| `/history` | Date-group headers, meal-type filter pills | |
| `/scan-history` | Product list + score badges | |
| `/contribute` | Camera capture, OCR preview, enhancement | |
| `/validate` | Card-swipe voting interface | |
| `/correct-product` | Framer Motion field transitions | |
| `/favorites` | Quick-relog card grid | |
| `/insights` | Weekly chart, nutrient alerts | |
| `/search` | DB + community results, filter sidebar | |
