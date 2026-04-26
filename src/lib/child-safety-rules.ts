// src/lib/child-safety-rules.ts

import rules from '@/data/child-safety-rules.json'

type AgeGroup = 'toddler' | 'preschool' | 'school' | 'adolescent'
type BmiTier  = 'underweight' | 'normal' | 'overweight' | 'obese'
type Suitability = 'suitable' | 'consume_with_caution' | 'avoid'

export interface ChildProfile {
  age: number
  bmi?: number
}

export interface ProductNutrition {
  sugar_per_100g?:  number | null
  sodium_per_100g?: number | null
}

export interface ProductAdditives {
  additives?:        string[]
  ingredients_text?: string
}

export interface ChildSafetyResult {
  suitability:     Suitability
  prompt_section:  string
  daily_limits: {
    sugar_g:          number
    sodium_mg:        number
    saturated_fat_g:  number
    calories:         number
  }
  additives_to_avoid: string[]
  age_group:   AgeGroup
  bmi_tier:    BmiTier
}

function getAgeGroup(age: number): AgeGroup {
  if (age <= 3)  return 'toddler'
  if (age <= 6)  return 'preschool'
  if (age <= 12) return 'school'
  return 'adolescent'
}

function getBmiTier(bmi?: number): BmiTier {
  if (!bmi || bmi < 16)   return 'underweight'
  if (bmi < 23)            return 'normal'
  if (bmi < 27.5)          return 'overweight'
  return 'obese'
}

function containsAdditive(
  target: string,
  additives: string[],
  ingredients_text?: string
): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[-\s]/g, '')
  const normTarget = norm(target)
  if (additives.some(a => norm(a).includes(normTarget))) return true
  if (ingredients_text && norm(ingredients_text).includes(normTarget)) return true
  return false
}

export function evaluateChildSafety(
  child: ChildProfile,
  nutrition: ProductNutrition,
  product: ProductAdditives,
  processing_level?: string
): ChildSafetyResult {
  const ageGroup = getAgeGroup(child.age)
  const bmiTier  = getBmiTier(child.bmi)

  const baseLimits = (rules.base_limits_per_day as any)[ageGroup]
  const multipliers = (rules.bmi_multipliers as any)[bmiTier]

  const adjustedLimits = {
    sugar_g:         Math.round(baseLimits.sugar_g         * multipliers.sugar_multiplier),
    sodium_mg:       Math.round(baseLimits.sodium_mg       * multipliers.sodium_multiplier),
    saturated_fat_g: baseLimits.saturated_fat_g,
    calories:        Math.round(baseLimits.calories        * multipliers.calorie_multiplier),
  }

  const additivesToAvoid: string[] = baseLimits.additives_to_avoid || []
  const overrideRules = rules.suitability_override_rules

  // Check force_avoid conditions
  let suitability: Suitability = 'suitable'

  const sugarPer100  = nutrition.sugar_per_100g  ?? null
  const sodiumPer100 = nutrition.sodium_per_100g ?? null

  const foundBadAdditive = overrideRules.force_avoid_if.contains_additives.some(a =>
    containsAdditive(a, product.additives || [], product.ingredients_text)
  )

  if (
    foundBadAdditive ||
    (sugarPer100  !== null && sugarPer100  > overrideRules.force_avoid_if.sugar_per_100g_gt)  ||
    (sodiumPer100 !== null && sodiumPer100 > overrideRules.force_avoid_if.sodium_per_100g_gt)
  ) {
    suitability = 'avoid'
  } else if (
    (sugarPer100  !== null && sugarPer100  > overrideRules.force_caution_if.sugar_per_100g_gt)  ||
    (sodiumPer100 !== null && sodiumPer100 > overrideRules.force_caution_if.sodium_per_100g_gt) ||
    (processing_level && (overrideRules.force_caution_if.processing_level as string[]).includes(processing_level))
  ) {
    suitability = 'consume_with_caution'
  }

  const prompt_section = buildChildPromptSection(
    ageGroup, bmiTier, adjustedLimits, additivesToAvoid, suitability, child.age
  )

  return {
    suitability,
    prompt_section,
    daily_limits: adjustedLimits,
    additives_to_avoid: additivesToAvoid,
    age_group: ageGroup,
    bmi_tier:  bmiTier,
  }
}

function buildChildPromptSection(
  ageGroup: AgeGroup,
  bmiTier: BmiTier,
  limits: { sugar_g: number; sodium_mg: number; saturated_fat_g: number; calories: number },
  additivesToAvoid: string[],
  deterministic_suitability: Suitability,
  age: number
): string {
  return `
CHILD SAFETY RULES (age ${age}, ${ageGroup} group, BMI tier: ${bmiTier}):
- Daily sugar limit for this child: ${limits.sugar_g}g/day
- Daily sodium limit: ${limits.sodium_mg}mg/day
- Daily saturated fat limit: ${limits.saturated_fat_g}g/day
- Daily calorie ceiling: ${limits.calories} kcal
- Additives strictly to avoid for this age group: ${additivesToAvoid.join(', ')}
- child_suitability MUST be set to "${deterministic_suitability}" — this is a hard override based on ICMR/WHO child nutrition rules.
- In your safe_consumption advice, reference the child-specific daily limits above explicitly.
- Flag any additives from the avoid list as HIGH severity in harmful_ingredients.
`.trim()
}

/**
 * Post-processes Gemini output to enforce deterministic child suitability.
 * Overrides whatever Gemini returned with the rules-based value.
 */
export function enforceChildSuitability<T extends { child_suitability?: string }>(
  analysis: T,
  result: ChildSafetyResult
): T {
  return { ...analysis, child_suitability: result.suitability }
}