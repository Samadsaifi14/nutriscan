# NutriScan — Signal Studio design system

This document describes the production UI shipped in the 2026-08-31 redesign. It replaces the former HealthOX organic-minimalism direction while preserving all existing product flows, data sources, routes, scoring, authentication, and affiliate behavior.

## Product principles

1. Evidence before decoration. Results lead with the score, product identity, risk verdict, amount, reference limit, and linked source.
2. Fast mobile decisions. The primary flow is scan → understand → compare, with one clear action at each stage.
3. Honest uncertainty. Undisclosed quantities say so; an ADI is presented as a population-level reference rather than a personal prescription.
4. Functional clarity. Buttons, tabs, links, inputs, focus states, loading states, and empty states must work without relying on color alone.
5. Restrained character. Carbon-black surfaces, safety orange, signal green, compact typography, and hairline separators create a precise lab-console feel without gradients or decorative clutter.

## Foundation

| Token | Value | Purpose |
|---|---:|---|
| `--bg` | `#050505` | App background |
| `--surface-2` | `#101010` | Cards and controls |
| `--cream` | `#f7f5ef` | Primary text |
| `--sand` | `#a6a3a0` | Supporting text |
| `--clay` | `#ff6b24` | Brand, active state, scan action |
| `--moss` | `#82d85a` | Safer-choice action and positive status |
| `--rust` | `#ff5a47` | High concern |
| `--amber` | `#ff9d2e` | Watch state |
| `--cobalt` | `#4d7dff` | Evidence and external-source links |

Typography uses the locally bundled Geist Sans and Geist Mono files. Display text is tightly tracked and high weight; measurements and scores use the mono face. No third-party font request is needed.

Spacing is based on a compact 4–8 px rhythm. Touch targets remain at least 44 px. Cards use 14–26 px radii; primary actions use a pill radius. Borders are one-pixel neutral separators with semantic color reserved for status and action.

## Core shell

- Maximum app width: 520 px on mobile-first routes and 560 px from 760 px upward.
- Fixed top bar: 64 px plus safe-area inset.
- Fixed bottom navigation: 72 px plus safe-area inset.
- The scan action is a 64 px orange floating button centered in the bottom navigation.
- Result tabs stay visible below the top bar and use a visible orange active rule.
- Content accounts for the top bar, bottom bar, floating action, and device safe areas.

## Signature components

### Health score ring

The ring pairs a numeric score with a textual risk verdict. The visible label includes an accessible description such as “Health score 4.9 out of 10, moderate.” Orange is the default review state; positive and harmful states use the semantic tokens.

### Ingredient evidence panel

The highest concern is promoted into a structured panel:

- Why it matters: a concise, plain-language summary.
- Amount in this product: exact amount when known, otherwise an explicit disclosure that the label does not provide it.
- Reference limit: a regulatory or toxicology benchmark with the proper scope caveat.
- Evidence: an external link to the named source.

Additional concerns remain available in a disclosure control, and the full label explanation follows below. The summary is visually clamped to keep the amount visible; the complete explanation remains in the detailed ingredient guide.

### Safer-choice action

The green sticky action opens the Alternatives tab. It remains above the bottom navigation and does not conflict with the orange scanner button. Alternative cards include score deltas and real purchase links when available.

### Inputs and states

Search, barcode entry, profile setup, scanner fallbacks, empty states, loading skeletons, and error alerts all share the same surfaces, borders, typography, and focus treatment. Lucide icons are used instead of emojis or handmade icon artwork.

## Route behavior retained

| Route | Primary task |
|---|---|
| `/` | Explain the product and start scanning |
| `/scan` | Scan a barcode, upload a product image, or enter an EAN-13 |
| `/results` | Review overview, nutrition, ingredient evidence, and alternatives |
| `/search` | Search products and open a result |
| `/dashboard` | Review personal nutrition and recent activity |
| `/scan-history` | Reopen previous scans |
| `/favorites` | Reopen saved products |
| `/profile` and `/profile-setup` | Manage personalization inputs |
| `/contribute` and `/correct-product` | Improve product data |

## Responsive and accessible behavior

- Layouts remain single-column and thumb-friendly on phones.
- Text and controls reflow at 380 px without horizontal scrolling.
- Keyboard focus is a two-pixel cobalt outline with offset.
- Reduced-motion preferences collapse transitions and animations.
- Status is expressed with text and icons as well as color.
- External evidence and commerce links use descriptive labels and safe new-tab attributes.

## Inspiration and provenance

The selected direction is stored in `docs/redesign-2026-08-31/selected-option-2.png`; the implementation was built from that visual rather than copying another product. Reference research informed interaction patterns and component discipline:

- [Astryx](https://github.com/facebook/astryx) — high-density mobile health presentation; 12,624 GitHub stars when reviewed.
- [shadcn/ui](https://github.com/shadcn-ui/ui) — composable component APIs and visible state patterns; 122,574 stars.
- [Radix Primitives](https://github.com/radix-ui/primitives) — accessible interaction primitives; 19,224 stars.
- [Carbon Design System](https://github.com/carbon-design-system/carbon) — enterprise token and status discipline; 9,394 stars.
- [Razorpay Blade](https://github.com/razorpay/blade) — India-focused design-system maturity; 648 stars.
- [Yuka](https://yuka.io/en/) and [Oura](https://ouraring.com/) — consumer-health hierarchy and approachable explanation patterns.

Repository metrics were recorded on 2026-08-31 and are intentionally snapshots, not live badges.

## Release checks

Before shipping a visual change:

1. Run `npm test -- --run`.
2. Run `npm run build`.
3. Verify the primary mobile journeys in a production preview.
4. Check browser errors, ingredient evidence links, alternatives rendering, and the Amazon affiliate tag.
5. Compare the selected visual and implementation at the same viewport and record the result in `design-qa.md`.
