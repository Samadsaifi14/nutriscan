// src/lib/client-analysis.ts
// Build a complete analysis object from product data using the local health engine.
// This runs in the browser so the results page can populate the Overview/Nutrition
// tabs instantly without waiting for /api/analyze to complete (or when it fails).

import { scoreProduct, type NutritionPer100g } from '@/lib/health-engine'

export interface ClientAnalysisInput {
  name: string
  brand?: string | null
  category?: string | null
  ingredients_text?: string | null
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    saturated_fat?: number | null
    sugar?: number | null
    sodium?: number | null
    fiber?: number | null
  }
}

export interface ClientAnalysisOutput {
  health_score: number
  health_rating: 'healthy' | 'moderate' | 'unhealthy'
  health_score_breakdown: {
    nutrition_score: number
    ingredient_safety_score: number
    processing_score: number
    overall: number
  }
  summary: string
  harmful_ingredients: Array<{
    name: string
    concern: string
    severity: 'high' | 'medium' | 'low'
    found_in_product: boolean
  }>
  positives: string[]
  long_term_risks: string[]
  nova_group: number
  nova_label: string
  analyzed_at: string
  personalized: boolean
  scoring_method: 'local_only' | 'hybrid'
  data_quality: 'verified' | 'estimated'
  recommendation: string
  detailed_breakdown: Record<string, string>
}

function ratingFor(score: number): 'healthy' | 'moderate' | 'unhealthy' {
  if (score >= 6.5) return 'healthy'
  if (score >= 4.5) return 'moderate'
  return 'unhealthy'
}

function recommendationFor(grade: string): string {
  if (grade === 'A') return 'Great choice! Enjoy freely.'
  if (grade === 'B') return 'Good option. Eat occasionally.'
  if (grade === 'C') return 'Limit consumption.'
  return 'Better alternatives available.'
}

export function buildLocalAnalysis(input: ClientAnalysisInput): ClientAnalysisOutput {
  const nutrition: NutritionPer100g = {
    calories: input.nutrition.calories || 0,
    protein: input.nutrition.protein || 0,
    carbohydrates: input.nutrition.carbs || 0,
    total_fat: input.nutrition.fat || 0,
    saturated_fat: input.nutrition.saturated_fat ?? undefined,
    sugar: input.nutrition.sugar ?? undefined,
    sodium: input.nutrition.sodium ?? undefined,
    fiber: input.nutrition.fiber ?? undefined,
  }

  const result = scoreProduct(nutrition, input.ingredients_text || '')
  const score = Math.round(result.score * 10) / 10
  const rating = ratingFor(result.score)
  const grade = result.grade

  const summary = `${input.name} scored ${score}/10 (${result.label}). ${
    result.detected_additives.length > 0
      ? `Detected ${result.detected_additives.length} potentially harmful additive(s).`
      : 'No harmful additives detected.'
  }`

  const harmful_ingredients = result.detected_additives.map(a => ({
    name: a.name,
    concern: a.concern || a.description || 'Potentially harmful additive',
    severity: (a.risk === 'critical' || a.risk === 'high' ? 'high' : a.risk === 'medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    found_in_product: true,
  }))

  const positives: string[] = []
  if (harmful_ingredients.length === 0) positives.push('No harmful additives detected')
  if ((input.nutrition.fiber || 0) >= 3) positives.push(`Good source of fiber (${input.nutrition.fiber}g/100g)`)
  if ((input.nutrition.protein || 0) >= 10) positives.push(`High in protein (${input.nutrition.protein}g/100g)`)
  if (result.nova_group <= 2) positives.push(`Minimally processed (NOVA ${result.nova_group})`)
  if (positives.length === 0) positives.push(`Local scoring: ${score}/10 (${grade})`)

  const long_term_risks: string[] = []
  if (harmful_ingredients.length > 0) {
    long_term_risks.push(`Contains ${harmful_ingredients.length} potentially harmful additive(s)`)
  }
  if ((input.nutrition.sugar || 0) > 22.5) {
    long_term_risks.push(`Very high sugar content (${input.nutrition.sugar}g/100g) — risk of metabolic issues with regular consumption`)
  }
  if ((input.nutrition.sodium || 0) > 600) {
    long_term_risks.push(`High sodium (${input.nutrition.sodium}mg/100g) — risk of high blood pressure with regular consumption`)
  }
  if ((input.nutrition.saturated_fat || 0) > 5) {
    long_term_risks.push(`High saturated fat (${input.nutrition.saturated_fat}g/100g) — risk of cardiovascular issues`)
  }
  if (long_term_risks.length === 0) {
    long_term_risks.push('See score breakdown for details')
  }

  const detailed_breakdown: Record<string, string> = {
    calories: `${Math.round(input.nutrition.calories || 0)} kcal/100g`,
    protein: `${input.nutrition.protein || 0}g/100g`,
    sugar: input.nutrition.sugar != null ? `${input.nutrition.sugar}g/100g` : 'Not listed',
    sodium: input.nutrition.sodium != null ? `${input.nutrition.sodium}mg/100g` : 'Not listed',
    fat: `${input.nutrition.fat || 0}g/100g (${input.nutrition.saturated_fat != null ? `${input.nutrition.saturated_fat}g saturated` : 'saturated fat not listed'})`,
    fiber: input.nutrition.fiber != null ? `${input.nutrition.fiber}g/100g` : 'Not listed',
    processing_level: result.nova_label.toLowerCase(),
    overall_nutrient_density: result.score >= 7 ? 'high' : result.score >= 5 ? 'medium' : 'low',
  }

  return {
    health_score: score,
    health_rating: rating,
    health_score_breakdown: {
      nutrition_score: result.nutrition_score,
      ingredient_safety_score: result.additive_score,
      processing_score: result.nova_score,
      overall: result.score,
    },
    summary,
    harmful_ingredients,
    positives,
    long_term_risks,
    nova_group: result.nova_group,
    nova_label: result.nova_label,
    analyzed_at: new Date().toISOString(),
    personalized: false,
    scoring_method: 'local_only',
    data_quality: 'verified',
    recommendation: recommendationFor(grade),
    detailed_breakdown,
  }
}
