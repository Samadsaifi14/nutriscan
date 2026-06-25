# HealthOX · Mobile Layout Dimension Map
> Single source of truth. All values are real mobile pixels (1x logical).
> Every number here corresponds to a CSS variable in `globals.css`.

---

## 1. Chrome / Shell

| Layer           | Height                          | CSS Variable          | Notes                                  |
|-----------------|---------------------------------|-----------------------|----------------------------------------|
| Status bar area | `env(safe-area-inset-top, 0px)` | `--safe-top`          | 47px iPhone 14 Pro, 20px older iPhones |
| TopBar          | **56px**                        | `--topbar-h`          | Fixed. Content starts below this.      |
| **Header total**| `safe-top + 56px`               | `--header-offset`     | Used as `padding-top` on `.page`       |
| BottomNav       | **64px**                        | `--nav-h`             | Fixed at bottom.                       |
| Home indicator  | `env(safe-area-inset-bottom, 0)`| `--safe-bottom`       | 34px on Face ID phones.                |
| **Footer total**| `64px + safe-bottom`            | `--footer-offset`     | Used as `padding-bottom` on `.page`    |
| **Content pb**  | `64px + safe-bottom + 24px`     | `--content-pb`        | Buffer so last card clears nav.        |
| FAB diameter    | **56px**                        | `--fab-size`          | Scan button circle.                    |
| FAB lift above nav | **18px**                     | `--fab-lift`          | FAB center at 46px from screen bottom + safe. |
| FAB bottom      | `64 - 18 + safe = 46px + safe`  | —                     | `fixed; bottom: calc(var(--nav-h) - var(--fab-lift) + var(--safe-bottom))` |

---

## 2. TopBar Internal Layout

```
|←16px→| [LEFT 36px] [────── TITLE flex:1 ──────] [RIGHT 36px] |←16px→|
         icon-btn                 17px/600              icon-btn
```

| Element       | Size             | Notes                                    |
|---------------|------------------|------------------------------------------|
| Padding X     | 16px             | `--page-px`                              |
| Icon button   | 36×36px          | `--icon-btn`                             |
| Title font    | 17px / semibold  | `--fs-h3` / `--fw-semi`                  |
| Back arrow    | 18px icon        | `ArrowLeft` from lucide-react            |
| Gap between   | 8px              | `--gap-sm`                               |

---

## 3. Bottom Navigation Internal Layout

```
|← 20% →|← 20% →|←────── 20% FAB gap ──────→|← 20% →|← 20% →|
   Home    Search          (FAB floats)         History  Profile
```

| Element         | Size         | Notes                                      |
|-----------------|--------------|--------------------------------------------|
| Slot height     | 64px         | `--nav-h`                                  |
| Icon            | 24×24px      | `size={22}` + `strokeWidth={1.8}`          |
| Label font      | 10px / medium| hard-coded in CSS                          |
| Icon→Label gap  | 3px          | `gap: 3px` in `.bottom-nav__slot`          |
| Active indicator| 20×2px       | Clay pill, `top: 8px` in slot              |

---

## 4. Page Gutter & Spacing

| Token         | Value  | Usage                                         |
|---------------|--------|-----------------------------------------------|
| `--page-px`   | 16px   | Left/right padding on all page content         |
| `--gap-xs`    | 4px    | Icon gaps, tight chip gaps                     |
| `--gap-sm`    | 8px    | Card internal gaps, chip rows, list items       |
| `--gap-md`    | 12px   | Section internal padding, form field gaps       |
| `--gap-lg`    | 16px   | Default padding, button padding                 |
| `--gap-xl`    | 24px   | Between sections (`section-header` top padding) |
| `--gap-2xl`   | 32px   | Large vertical gaps (hero sub-sections)         |
| `--gap-3xl`   | 48px   | Empty state padding                             |

---

## 5. Border Radius Scale

| Token     | Value  | Used on                                              |
|-----------|--------|------------------------------------------------------|
| `--r-xs`  | 4px    | Progress bars, skeleton loaders                       |
| `--r-sm`  | 8px    | Inputs, product thumbnails, icon buttons, small chips |
| `--r-md`  | 12px   | Cards (`.card`), product cards                        |
| `--r-lg`  | 16px   | Bottom sheets, modals                                 |
| `--r-xl`  | 24px   | Buttons (`.btn`), large chips, FAB ring               |
| `--r-2xl` | 32px   | Hero CTA button, phone frame                          |
| `--r-full`| 9999px | Circles, pills, toggles, score badges                 |

---

## 6. Typography Scale

| Token          | Size  | Weight | Line-height | Used for                          |
|----------------|-------|--------|-------------|-----------------------------------|
| `--fs-hero`    | 28px  | 800    | 1.15        | Landing page H1                    |
| `--fs-h1`      | 24px  | 700    | 1.15        | Section hero titles                |
| `--fs-h2`      | 20px  | 700    | 1.3         | Dashboard greeting, modal titles   |
| `--fs-h3`      | 17px  | 600    | 1.3         | TopBar title                       |
| `--fs-body-lg` | 16px  | 400    | 1.5         | Prominent body text                |
| `--fs-body`    | 14px  | 400    | 1.5         | Standard body, list items          |
| `--fs-sm`      | 13px  | 400    | 1.5         | Secondary body, card subtitles     |
| `--fs-xs`      | 12px  | 400    | 1.3         | Captions, chip labels, tab labels  |
| `--fs-2xs`     | 11px  | 500    | 1.3         | Section headers (UPPERCASE), badges|
| `--fs-mono`    | 13px  | 400    | 1.3         | Nutrition values (JetBrains Mono)  |

---

## 7. Component Sizes

### Score Rings
| Prop  | px   | CSS class  | Where used                    |
|-------|------|------------|-------------------------------|
| `xl`  | 96px | `.ring-xl` | Dashboard hero                |
| `lg`  | 72px | `.ring-lg` | Insights monthly card         |
| `md`  | 52px | `.ring-md` | Results sticky product header |
| `sm`  | 40px | `.ring-sm` | Scan history list row         |
| `xs`  | 32px | `.ring-xs` | Favorites grid                |

Ring stroke = 9% of diameter. So:
- 96px ring → 8.6px stroke
- 52px ring → 4.7px stroke
- 32px ring → 2.9px stroke

### Product Thumbnails
| Token       | px   | Where used                    |
|-------------|------|-------------------------------|
| `--thumb-xl`| 72px | Results sticky product header |
| `--thumb-lg`| 56px | Search expanded result        |
| `--thumb-md`| 44px | Standard list card (`.product-card`) |
| `--thumb-sm`| 36px | Compact list, admin queue     |

### Horizontal Scroll Cards
| Token                | Value | Notes                          |
|----------------------|-------|--------------------------------|
| `--scroll-card-w`    | 96px  | Width of each card             |
| `.scroll-card__thumb`| 52px  | Square product image inside    |
| Gap between cards    | 8px   | `--gap-sm` in `.h-scroll`      |
| Left padding         | 16px  | `--page-px` on `.h-scroll`     |

### Avatars
| Token     | px   | Font | Where used                     |
|-----------|------|------|--------------------------------|
| `--av-sm` | 28px | 11px | TopBar personal greeting        |
| `--av-md` | 36px | 14px | Leaderboard rows               |
| `--av-lg` | 48px | 18px | Profile page header            |
| `--av-xl` | 64px | 24px | My-rank card, large profile    |

### Buttons
| Class       | Height | Font  | Radius | Where used                    |
|-------------|--------|-------|--------|-------------------------------|
| `.btn`      | 48px   | 14px  | 24px   | Primary CTA (Start Scanning)  |
| `.btn--sm`  | 36px   | 13px  | 16px   | Form submit, "Continue →"     |
| `.btn--xs`  | 28px   | 12px  | 8px    | Admin approve/reject          |

### Inputs
| Class       | Height | Font  | Radius |
|-------------|--------|-------|--------|
| `.input`    | 48px   | 14px  | 8px    |
| `.input--sm`| 40px   | 13px  | 8px    |

### Tab Bars
| Element          | Size  | Notes                             |
|------------------|-------|-----------------------------------|
| Tab bar height   | 40px  | `.tab-bar`                        |
| Active underline | 2px   | Clay, `border-bottom`             |
| Font             | 12px  | `--fs-xs`                         |
| Sticky offset    | `var(--header-offset)` | Stays below TopBar |

### Toggle Switches
| Element    | Size      | Notes               |
|------------|-----------|---------------------|
| Track      | 44×26px   | `.toggle`           |
| Knob       | 20×20px   | `.toggle__knob`     |
| Knob offset| 3px gap   | off: left 3, on: right 3 |
| Travel     | 18px      | knob translateX     |

---

## 8. Scan Page (Full-Screen Override)

| Element        | Size / Position              | Notes                         |
|----------------|------------------------------|-------------------------------|
| Container      | `position: fixed; inset: 0`  | `.scan-overlay`, z-index 60   |
| Camera feed    | 100% inset                   | Behind all overlays           |
| Scan frame (barcode) | 280×140px          | Centered at `top: 50%, left: 50%`, `translate(-50%, -58%)` |
| Scan frame (photo)   | 280×280px          | Same anchor                   |
| Corner markers | 24×24px each                 | `.scan-corner` × 4            |
| Scan line      | 1.5px height                 | `.scan-line`, animated        |
| Top overlay    | `gradient to bottom → transparent` | 88px tall, holds back/title/flash |
| Bottom controls| `gradient to top → transparent`    | ~140px tall, mode pills + shutter |
| Mode pills     | 3 equal pills, 36px height   | Active = clay fill            |
| Shutter FAB    | 64px circle                  | Clay, centered                |
| Side icons     | 36px square, r-sm            | Gallery (left) / Settings (right) |

---

## 9. Z-Index Stack

| Layer            | z-index | Element                        |
|------------------|---------|--------------------------------|
| Page content     | 0       | Normal flow                    |
| Sticky tab bars  | 30      | `.tab-bar` (sticky within page)|
| BottomNav        | 40      | `.bottom-nav`                  |
| FAB scan button  | 45      | `.fab-scan`                    |
| TopBar           | 50      | `.topbar`                      |
| Scan overlay     | 60      | `.scan-overlay`                |
| Modals           | 70      | Bottom sheets, dialogs         |
| Toast / Snackbar | 80      | Notifications                  |
| Cookie banner    | 90      | Global overlay                 |
