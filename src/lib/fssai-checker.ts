/**
 * lib/fssai-checker.ts
 *
 * Server-side utility. Import in /api/analyze/route.ts.
 * Cross-references extracted ingredients + nutrition against fssai-rules.json.
 * Returns violations array to be merged into the Gemini analysis response.
 */

import fssaiRules from '@/data/fssai-rules.json'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FSSAIViolation {
  type:       'banned' | 'restricted' | 'trans_fat' | 'high_sugar' | 'high_sodium' | 'combination'
  ingredient: string
  e_code?:    string
  regulation: string
  concern:    string
  severity:   'high' | 'medium' | 'low'
  limit?:     string
}

interface ProductInput {
  ingredients_text?: string | null
  additives?:        string[]
  nutrition?: {
    fat?:    number | null
    sugar?:  number | null
    sodium?: number | null
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export function checkFSSAICompliance(product: ProductInput): FSSAIViolation[] {
  const violations: FSSAIViolation[] = []

  const ingredientsLower = (product.ingredients_text ?? '').toLowerCase()
  const additivesUpper   = (product.additives ?? []).map(a => a.toUpperCase())

  // ── 1. Banned additives ───────────────────────────────────────────────────
  for (const banned of fssaiRules.banned_additives) {
    if (isPresent(banned, ingredientsLower, additivesUpper)) {
      violations.push({
        type:       'banned',
        ingredient: banned.name,
        e_code:     banned.code,
        regulation: banned.regulation,
        concern:    banned.reason,
        severity:   banned.severity as 'high' | 'medium' | 'low',
      })
    }
  }

  // ── 2. Restricted additives ───────────────────────────────────────────────
  for (const restricted of fssaiRules.restricted_additives) {
    if (isPresent(restricted, ingredientsLower, additivesUpper)) {
      violations.push({
        type:       'restricted',
        ingredient: restricted.name,
        e_code:     restricted.code,
        regulation: restricted.regulation,
        concern:    restricted.concern,
        severity:   restricted.severity as 'high' | 'medium' | 'low',
        limit:      restricted.max_limit_mg_per_kg
          ? `Max ${restricted.max_limit_mg_per_kg} mg/kg`
          : undefined,
      })

      // Special: E211 (Sodium Benzoate) + Vitamin C → benzene formation
      if ('red_flag_combination' in restricted && restricted.red_flag_combination) {
        const hasCombo = restricted.red_flag_combination.some(
          (combo: string) => ingredientsLower.includes(combo.toLowerCase())
        )
        if (hasCombo) {
          violations.push({
            type:       'combination',
            ingredient: `${restricted.name} + Ascorbic Acid / Vitamin C`,
            e_code:     restricted.code,
            regulation: 'FSSAI FSS Act 2006; WHO warning on benzene formation',
            concern:    'Sodium Benzoate (E211) reacts with Vitamin C (ascorbic acid) to form benzene, a known carcinogen. This combination in the same product is a critical red flag.',
            severity:   'high',
          })
        }
      }
    }
  }

  // ── 3. Trans fat / hydrogenated oils ─────────────────────────────────────
  const transFatRules   = fssaiRules.trans_fat_rules
  const hasTransFatRisk = transFatRules.high_risk_ingredients.some(
    risk => ingredientsLower.includes(risk.toLowerCase())
  )
  if (hasTransFatRisk) {
    violations.push({
      type:       'trans_fat',
      ingredient: 'Partially Hydrogenated Oil / Vanaspati',
      regulation: transFatRules.regulation,
      concern:    `Product contains ingredients associated with trans fats. FSSAI limits trans fat to max ${transFatRules.limit.max_percent_of_total_fat}% of total fat (effective Jan 2022). Trans fats raise LDL, lower HDL, and significantly increase cardiovascular disease risk.`,
      severity:   'high',
    })
  }

  // ── 4. High sugar ─────────────────────────────────────────────────────────
  const sugarRules = fssaiRules.sugar_rules
  if (
    product.nutrition?.sugar != null &&
    product.nutrition.sugar > sugarRules.high_sugar_threshold_per_100g
  ) {
    violations.push({
      type:       'high_sugar',
      ingredient: 'Added Sugar',
      regulation: sugarRules.regulation,
      concern:    `Sugar content (${product.nutrition.sugar}g/100g) exceeds FSSAI high-sugar threshold of ${sugarRules.high_sugar_threshold_per_100g}g/100g. FSSAI requires prominent sugar content display on label for such products.`,
      severity:   'medium',
      limit:      `${sugarRules.high_sugar_threshold_per_100g}g per 100g`,
    })
  }

  // ── 5. High sodium ────────────────────────────────────────────────────────
  const sodiumRules = fssaiRules.salt_sodium_rules
  if (
    product.nutrition?.sodium != null &&
    product.nutrition.sodium > sodiumRules.high_sodium_threshold_mg_per_100g
  ) {
    const dailyPct = Math.round(
      (product.nutrition.sodium / sodiumRules.icmr_daily_limit_mg) * 100
    )
    violations.push({
      type:       'high_sodium',
      ingredient: 'Sodium / Salt',
      regulation: sodiumRules.regulation,
      concern:    `Sodium (${product.nutrition.sodium}mg/100g) is high. A 100g serving contributes ~${dailyPct}% of ICMR's recommended daily sodium limit (${sodiumRules.icmr_daily_limit_mg}mg). Indian diets are already high in sodium — pickles, papads, and processed foods make it easy to exceed limits.`,
      severity:   'medium',
      limit:      `${sodiumRules.high_sodium_threshold_mg_per_100g}mg per 100g`,
    })
  }

  return deduplicateViolations(violations)
}

// ── Build Gemini prompt injection string ──────────────────────────────────────

export function buildFSSAIPromptSection(violations: FSSAIViolation[]): string {
  if (violations.length === 0) {
    return 'FSSAI SERVER CHECK: No violations detected by server-side rule check.'
  }

  const lines = violations.map(v => {
    const sev   = v.severity.toUpperCase()
    const limit = v.limit ? ` | Limit: ${v.limit}` : ''
    return `- [${sev}] ${v.ingredient}${v.e_code ? ` (${v.e_code})` : ''}: ${v.concern} | Regulation: ${v.regulation}${limit}`
  })

  return [
    'FSSAI SERVER-VERIFIED VIOLATIONS (must be reflected in your analysis):',
    ...lines,
    'For each violation above, include it in harmful_ingredients with found_in_product: true and cite the regulation in scientific_source.',
  ].join('\n')
}

// ── isPresent helper ──────────────────────────────────────────────────────────

function isPresent(
  additive: { code: string; name: string; also_known_as?: string[] },
  ingredientsLower: string,
  additivesUpper: string[]
): boolean {
  // Check E-code in additives array (handles "E211", "INS211", "INS 211")
  const numericCode = additive.code.replace('E', '')
  if (
    additivesUpper.some(a =>
      a.includes(additive.code) ||
      a.includes(`INS${numericCode}`) ||
      a.includes(`INS ${numericCode}`)
    )
  ) return true

  // Check name directly in ingredients text
  if (ingredientsLower.includes(additive.name.toLowerCase())) return true

  // Check all aliases
  if (additive.also_known_as) {
    for (const alias of additive.also_known_as) {
      if (ingredientsLower.includes(alias.toLowerCase())) return true
    }
  }

  return false
}

// ── Deduplicate ───────────────────────────────────────────────────────────────

function deduplicateViolations(violations: FSSAIViolation[]): FSSAIViolation[] {
  const seen = new Set<string>()
  return violations.filter(v => {
    const key = `${v.type}:${v.ingredient}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}