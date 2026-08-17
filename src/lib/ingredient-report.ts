import { detectAdditives } from '@/lib/health-engine'

export type IngredientStatus = 'information' | 'watch' | 'high_concern'

export interface IngredientReportItem {
  name: string
  plainLanguage: string
  status: IngredientStatus
  note: string
  evidence: 'label' | 'additive_database'
}

const COMMON_INGREDIENTS: Array<{ pattern: RegExp; plainLanguage: string; note: string }> = [
  { pattern: /\b(sugar|sucrose|glucose syrup|corn syrup|dextrose)\b/i, plainLanguage: 'Added sweetener', note: 'Adds sweetness and calories. Compare the product’s sugar value per serving.' },
  { pattern: /\b(salt|sodium chloride)\b/i, plainLanguage: 'Salt', note: 'Adds flavour and preserves food. Check sodium per serving if you are limiting salt.' },
  { pattern: /\b(wheat|maida|flour|semolina|suji)\b/i, plainLanguage: 'Grain or flour', note: 'Provides carbohydrate. Wheat and gluten can be an allergen for some people.' },
  { pattern: /\b(milk|whey|casein|butter|cheese|lactose)\b/i, plainLanguage: 'Milk ingredient', note: 'A dairy ingredient and a common allergen.' },
  { pattern: /\b(soy|soya)\b/i, plainLanguage: 'Soy ingredient', note: 'Often used for protein, oil, or texture. Soy is a common allergen.' },
  { pattern: /\b(palm oil|vegetable oil|sunflower oil|canola oil|soybean oil)\b/i, plainLanguage: 'Cooking oil', note: 'Provides fat and texture. The nutrition panel shows the total and saturated fat amount.' },
  { pattern: /\b(flavo?u?r)\b/i, plainLanguage: 'Flavouring', note: 'Used to create or strengthen taste. The label may not identify each flavour component.' },
  { pattern: /\b(colou?r)\b/i, plainLanguage: 'Colouring', note: 'Used to give or maintain colour. Look for the named colour or INS/E number on the label.' },
]

/** Splits a label list without breaking comma-separated text inside parentheses. */
export function splitIngredients(text: string | null | undefined): string[] {
  if (!text) return []
  const items: string[] = []
  let current = ''
  let depth = 0
  for (const char of text.replace(/\s+/g, ' ').trim()) {
    if (char === '(' || char === '[') depth += 1
    if (char === ')' || char === ']') depth = Math.max(0, depth - 1)
    if ((char === ',' || char === ';') && depth === 0) {
      if (current.trim()) items.push(current.trim())
      current = ''
    } else current += char
  }
  if (current.trim()) items.push(current.trim())
  return items
}

/**
 * Produces a cautious explanation of each label ingredient. It never infers a
 * product is safe from the absence of a database match.
 */
export function buildIngredientReport(text: string | null | undefined): IngredientReportItem[] {
  const additives = detectAdditives(text || '')
  return splitIngredients(text).map((name) => {
    const additive = additives.find((item) => {
      const aliases = [item.name, ...(item.aliases || [])]
      return aliases.some((alias) => new RegExp(`(?:^|\\b)${alias.replace(/\\\\s\*/g, '\\s*')}(?:\\b|$)`, 'i').test(name))
    })
    if (additive) {
      const status: IngredientStatus = additive.risk === 'harmful' || additive.risk === 'high'
        ? 'high_concern'
        : additive.risk === 'moderate' ? 'watch' : 'information'
      return {
        name,
        plainLanguage: additive.category.replace(/_/g, ' '),
        status,
        note: additive.concern,
        evidence: 'additive_database',
      }
    }
    const common = COMMON_INGREDIENTS.find((item) => item.pattern.test(name))
    return common
      ? { name, plainLanguage: common.plainLanguage, status: 'information', note: common.note, evidence: 'label' }
      : { name, plainLanguage: 'Listed ingredient', status: 'information', note: 'Shown exactly as declared on the product label. No safety conclusion is made from this scan alone.', evidence: 'label' }
  })
}
