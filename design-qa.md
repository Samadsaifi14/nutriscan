# Design QA — Signal Studio redesign

Date: 2026-08-31

## Visual source and implementation

- Selected source: `docs/redesign-2026-08-31/selected-option-2.png`
- Implemented state: `/results`, Coca-Cola “Original Taste”, Ingredients tab selected
- Requested viewport: 390 × 844 CSS px
- Captured browser image: 375 × 811 px after browser chrome/scrollbar allocation
- Source image: 853 × 1844 px, normalized to 375 × 811 px for comparison
- Implementation capture: `docs/redesign-2026-08-31/results-ingredients-390x844.jpg`
- Combined comparison: `docs/redesign-2026-08-31/design-qa-comparison-final.png`

## Comparison history

### Pass 1

- P1: the central scan action could overlap the sticky safer-choice CTA and intercept its click.
- Fix: lifted the scan action independently of the CTA, then retested the CTA from Ingredients to Alternatives.
- P2: the result header used the product name in the top bar and the hero was substantially taller than the selected visual.
- Fix: restored the NutriScan title and tightened the score, verdict, summary, tabs, and evidence-panel spacing.

### Pass 2

- P2: long live toxicology copy pushed the product amount below the first viewport.
- Fix: clamped the promoted summary to three lines while retaining the complete explanation in the detailed ingredient guide below.

### Final comparison

- No P0, P1, or P2 visual issues remain.
- The information hierarchy, carbon-black surfaces, orange score/status language, ingredient evidence panel, green comparison action, and bottom navigation match the selected direction.
- Accepted P3 differences are content-driven: live data returns a score of 4.9 and four alternatives, while the concept image shows 4.3 and five; the live additive name is longer and therefore wraps. These differences preserve truthful production data.

## Functional verification

- Landing primary action and persistent navigation work.
- Search returns products for `coca` and opens the result flow.
- Scanner fallback renders when live camera scanning is unavailable.
- Overview, Nutrition, Ingredients, and Alternatives tabs work.
- Ingredient amount, reference limit, explanation, and external evidence link render.
- “Compare 4 safer choices” opens four populated alternatives.
- Amazon result and alternative URLs include affiliate tag `BioYou-21`.
- Browser error log was empty after the final production render and interaction pass.
- `npm test -- --run`: 13 files, 141 tests passed.
- `npm run build`: passed, including lint and TypeScript validation.

final result: passed
