# DESIGN — HealthOX UI/UX System
_Design system, component tree, theme, and page inventory_

---

## Design Philosophy

HealthOX uses an **organic minimalism** aesthetic — warm earthy tones, editorial typography,
and tactile textures. The goal is a product that feels handcrafted and Indian-rooted,
not generic SaaS. Inspiration: Igloo Inc (3D spatial depth, grain texture) and
Maná Yerba Mate (earthy palette, editorial type hierarchy, slow animation).

---

## Typography

| Role | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Display / Headings | Syne | 800 | clamp(52px–80px hero, 38–58px sections) | letter-spacing: -0.04em |
| UI Labels / Nav | Syne | 600–700 | 13–18px | letter-spacing: -0.03em |
| Body copy | DM Sans | 300–400 | 15–17px | line-height: 1.7 |
| Eyebrows / Tags | DM Sans | 500 | 11px | letter-spacing: 0.12em, uppercase |
| Stat numbers | Syne | 700 | 30px | letter-spacing: -0.04em |

Import from Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
```

---

## Color Palette

No blue. No purple. No generic `emerald-500`. HealthOX uses a curated earthy system:

| Token | Hex | Usage |
|---|---|---|
| `--sand` | `#F2EDE4` | Page background |
| `--sand-dark` | `#E8E0D3` | Subtle surface, input backgrounds |
| `--cream` | `#FAF7F2` | Card backgrounds, light surfaces |
| `--bark` | `#2C1F0F` | Primary text, dark CTAs, nav |
| `--bark-mid` | `#4A3520` | Secondary text, muted labels |
| `--ink` | `#1A1208` | Headings, display text |
| `--moss` | `#3D5C2E` | Safe/healthy indicators, FSSAI green |
| `--moss-light` | `#6B8F52` | Fiber bars, secondary green |
| `--clay` | `#C4714A` | Primary brand accent, CTAs, score rings |
| `--clay-light` | `#E8956E` | Scan line glow, hover states |
| `--risk-red` | `#B43C28` | Harmful ingredients, bad score |

Tailwind config — replace `emerald` with custom tokens:
```js
// tailwind.config.ts
colors: {
  sand: { DEFAULT: '#F2EDE4', dark: '#E8E0D3' },
  bark: { DEFAULT: '#2C1F0F', mid: '#4A3520' },
  ink: '#1A1208',
  cream: '#FAF7F2',
  moss: { DEFAULT: '#3D5C2E', light: '#6B8F52' },
  clay: { DEFAULT: '#C4714A', light: '#E8956E' },
  risk: '#B43C28',
}
```

---

## Texture & Atmosphere

### Film grain overlay
A fixed SVG noise layer creates analogue depth — prevents the app from feeling purely digital.
```css
.grain {
  position: fixed;
  inset: -200%;
  width: 400%; height: 400%;
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.9'...");
  opacity: 0.028;
  pointer-events: none;
  z-index: 9000;
  animation: grainShift 0.5s steps(1) infinite;
}
@keyframes grainShift {
  /* 5-step random translate to animate grain */
}
```

### Radial ambient orbs
Soft radial gradients (12–15% opacity clay and moss) placed behind key sections to
create depth without being literal backgrounds. Never use these at > 20% opacity.

---

## Custom Cursor

Replace the default cursor with a two-part system:
- Small filled dot (10px, clay color, `mix-blend-mode: multiply`)
- Lagging ring (36px, 0.5px border-bark, follows with 0.12 lerp factor)

On hover over interactive elements: dot expands to 18px, ring to 52px.
```js
let rx = 0, ry = 0;
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
```
Set `cursor: none` on `body`. Set `cursor: none` on all interactive elements too.

---

## Animation System

### Principles
- All animations use `cubic-bezier(.16,1,.3,1)` (spring-out) — not ease-in-out
- Entry animations use `opacity + translateY(30px)` with `animation-fill-mode: forwards`
- Stagger delays: 0.1s, 0.2s, 0.3s between siblings
- Phone 3D float: `rotateY(-12deg) rotateX(5deg)`, 6s ease-in-out infinite
- Phone parallax: mouse position drives `rotateY` ±8deg, `rotateX` ±4deg in real time

### Keyframes
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.08); }
}
@keyframes grainShift { /* 5-step random offset */ }
@keyframes scanAnim {
  0%   { top: 10%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}
@keyframes logoPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.6); opacity: 0.6; }
}
```

### Scroll reveal
```css
.reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s; }
.reveal.visible { opacity: 1; transform: translateY(0); }
```
```js
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
```

---

## 3D Phone Mockup

The hero phone is a pure CSS 3D object — no image assets required:
```css
.phone-scene {
  transform-style: preserve-3d;
  animation: phoneFloat 6s ease-in-out infinite;
}
.phone-outer {
  background: #1A1208;
  border-radius: 40px;
  box-shadow:
    40px 60px 80px rgba(26,18,8,0.35),
    0 0 0 1px rgba(255,255,255,0.06),
    inset 0 1px 0 rgba(255,255,255,0.1);
}
```
The parent `<div>` wrapping the scene uses `perspective: 1200px`.

Floating tag pills orbit the phone with staggered `tagFloat` animations
(opacity 0→1 on load, then continuous vertical oscillation).

---

## Layout System

### Container
```css
.app-container { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
```

### Hero grid
Two-column: `grid-template-columns: 1fr 1fr`. Left = copy, right = 3D phone.

### Features grid
3-column: `grid-template-columns: repeat(3, 1fr)` with one `grid-column: span 2` card.

### Bento grid
4-column: `grid-template-columns: repeat(4, 1fr)` with mixed spans:
- Big dark card: `span 2 / span 2`
- Wide card: `span 2`
- Single cards: `span 1`

---

## Component Specifications

### Buttons
```css
.btn-primary {
  background: var(--bark); color: var(--cream);
  padding: 16px 32px; border-radius: 100px;
  /* Animated clay fill on hover via ::before scaleX(0→1) */
  transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
}
.btn-primary:hover { transform: translateY(-2px); }

.btn-light {
  background: var(--cream); color: var(--bark);
  /* On hover: clay background, white text */
}
```

### Feature cards
```css
.feature-card {
  background: var(--cream);
  border-radius: 24px; padding: 36px 32px;
  border: 1px solid rgba(44,31,15,0.07);
  transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.4s;
}
.feature-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(44,31,15,0.12); }
```

### Bento cards
```css
.bento-card {
  background: var(--cream); border-radius: 24px; padding: 28px;
  border: 1px solid rgba(44,31,15,0.07);
  transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
}
.bento-card:hover { transform: scale(1.02); }
/* Dark card variant: background: var(--bark) */
```

### Ingredient chips
```css
.chip-safe { background: rgba(61,92,46,0.10); color: #3D5C2E; }
.chip-warn { background: rgba(196,113,74,0.12); color: #C4714A; }
.chip-bad  { background: rgba(180,60,40,0.10); color: #B43C28; }
/* All chips: font-size 10–11px, padding 4px 10px, border-radius 100px */
```

### Health score ring
SVG circle with `stroke-dasharray` + animated `stroke-dashoffset`.
Color by grade: A = `--moss`, B = `--clay`, C = `--risk-red`.

### Marquee ticker
Duplicate content for seamless loop:
```css
.marquee-track { animation: marquee 20s linear infinite; width: max-content; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

---

## Navigation

Fixed, transparent nav. Items in 13px uppercase `DM Sans` with underline-slide hover.
Logo: Syne 800 with animated clay dot (pulse keyframe).
CTA: pill-shaped dark button → clay on hover.

---

## Page Inventory

| Route | Description | Key Visual Feature |
|---|---|---|
| `/` | Landing page | 3D floating phone, grain texture, bento grid |
| `/auth/signin` | Sign in | Minimal centered card on sand bg |
| `/scan` | Barcode scanner | Scanner frame with animated scan line |
| `/results` | Scan results | 4 tabs: Overview (score ring), Ingredients (chips), Nutrition (bars), Alternatives (cards) |
| `/dashboard` | User dashboard | Calorie ring (clay stroke), macro bars, meal list |
| `/profile-setup` | Onboarding | Multi-step with progress indicator |
| `/history` | Meal history | Date-grouped, filterable by meal type |
| `/scan-history` | Scan history | Product scan list with score badges |
| `/contribute` | Product contribution | Camera capture + OCR preview |
| `/validate` | Community validation | Card-swipe voting interface |
| `/correct-product` | Product correction | Framer Motion field transitions |
| `/favorites` | Saved meals | Quick-relog card grid |
| `/insights` | Weekly insights | Charts, summary, alerts |
| `/search` | Product search | DB + community results with filters |

---

## Dark Mode

Dark mode inverts to a warm-dark system — not cold grays:

| Token | Dark value |
|---|---|
| `--sand` | `#130E08` |
| `--sand-dark` | `#1C1510` |
| `--cream` | `#1E1710` |
| `--bark` | `#F2EDE4` |
| `--bark-mid` | `#B8A898` |
| `--ink` | `#FAF7F2` |

The clay, moss, and risk-red accents remain unchanged in dark mode.
Grain texture opacity increases to 0.035 in dark mode.
