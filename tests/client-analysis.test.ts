// tests/client-analysis.test.ts
import { describe, it, expect } from 'vitest'
import { buildLocalAnalysis } from '@/lib/client-analysis'

describe('buildLocalAnalysis', () => {
  it('returns a complete analysis with real health_score for a known product', () => {
    const result = buildLocalAnalysis({
      name: 'Maggi Noodles',
      brand: 'Maggi',
      category: 'instant noodles',
      ingredients_text: 'Wheat flour, palm oil, salt, msg',
      nutrition: { calories: 436, protein: 9, carbs: 60, fat: 15, sugar: 3, sodium: 1100, fiber: 3, saturated_fat: 6 },
    })
    expect(result.health_score).toBeGreaterThan(0)
    expect(result.health_score).toBeLessThanOrEqual(10)
    expect(result.health_score).not.toBe(5) // should be a real score, not placeholder
    expect(result.health_rating).toMatch(/healthy|moderate|unhealthy/)
    expect(result.health_score_breakdown).toBeTruthy()
    expect(result.health_score_breakdown.nutrition_score).toBeGreaterThan(0)
    expect(result.health_score_breakdown.ingredient_safety_score).toBeGreaterThan(0)
    expect(result.health_score_breakdown.processing_score).toBeGreaterThan(0)
    expect(result.summary).toBeTruthy()
    expect(result.summary).toContain('Maggi')
    expect(Array.isArray(result.harmful_ingredients)).toBe(true)
    expect(Array.isArray(result.positives)).toBe(true)
    expect(Array.isArray(result.long_term_risks)).toBe(true)
    expect(result.scoring_method).toBe('local_only')
    expect(result.detailed_breakdown).toBeTruthy()
  })

  it('returns healthy rating for a clearly healthy product', () => {
    const result = buildLocalAnalysis({
      name: 'Greek Yogurt',
      ingredients_text: 'Pasteurised milk, live cultures',
      nutrition: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, sugar: 3.2, sodium: 36, fiber: 0, saturated_fat: 0.1 },
    })
    expect(result.health_rating).toBe('healthy')
    expect(result.health_score).toBeGreaterThan(5)
  })

  it('returns unhealthy rating for a junk product', () => {
    const result = buildLocalAnalysis({
      name: 'Candy Bar',
      ingredients_text: 'Sugar, hydrogenated oil, artificial colors, msg, palm oil',
      nutrition: { calories: 500, protein: 2, carbs: 70, fat: 25, sugar: 50, sodium: 200, fiber: 0, saturated_fat: 15 },
    })
    expect(result.health_rating).toBe('unhealthy')
    expect(result.health_score).toBeLessThan(5)
    expect(result.harmful_ingredients.length).toBeGreaterThan(0)
  })

  it('handles empty nutrition gracefully (returns baseline score, not 5 placeholder)', () => {
    const result = buildLocalAnalysis({
      name: 'Unknown Product',
      ingredients_text: '',
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    })
    expect(result.health_score).toBeGreaterThan(0)
    expect(result.health_score).toBeLessThanOrEqual(10)
    expect(result.summary).toBeTruthy()
  })

  it('detects high sodium and adds long-term risk', () => {
    const result = buildLocalAnalysis({
      name: 'Salty Snack',
      ingredients_text: 'Salt, wheat flour, palm oil',
      nutrition: { calories: 500, protein: 5, carbs: 50, fat: 25, sugar: 0, sodium: 1500, fiber: 0 },
    })
    const riskHasSodium = result.long_term_risks.some(r => r.toLowerCase().includes('sodium'))
    expect(riskHasSodium).toBe(true)
  })

  it('detects high sugar and adds long-term risk', () => {
    const result = buildLocalAnalysis({
      name: 'Sugary Drink',
      ingredients_text: 'Water, sugar, artificial flavor',
      nutrition: { calories: 200, protein: 0, carbs: 50, fat: 0, sugar: 45, sodium: 10, fiber: 0 },
    })
    const riskHasSugar = result.long_term_risks.some(r => r.toLowerCase().includes('sugar'))
    expect(riskHasSugar).toBe(true)
  })

  it('detects high saturated fat and adds long-term risk', () => {
    const result = buildLocalAnalysis({
      name: 'Cheese Burger',
      ingredients_text: 'Beef, cheese, bread',
      nutrition: { calories: 350, protein: 20, carbs: 30, fat: 20, sugar: 5, sodium: 800, fiber: 1, saturated_fat: 8 },
    })
    const riskHasSatFat = result.long_term_risks.some(r => r.toLowerCase().includes('saturated'))
    expect(riskHasSatFat).toBe(true)
  })

  it('adds positive points for high protein', () => {
    const result = buildLocalAnalysis({
      name: 'Protein Bar',
      ingredients_text: 'Whey protein, oats, almonds',
      nutrition: { calories: 200, protein: 20, carbs: 15, fat: 8, sugar: 5, sodium: 100, fiber: 4 },
    })
    const hasProteinPositive = result.positives.some(p => p.toLowerCase().includes('protein'))
    expect(hasProteinPositive).toBe(true)
  })

  it('adds positive points for high fiber', () => {
    const result = buildLocalAnalysis({
      name: 'Whole Wheat Bread',
      ingredients_text: 'Whole wheat flour, yeast, salt',
      nutrition: { calories: 250, protein: 9, carbs: 45, fat: 3, sugar: 5, sodium: 400, fiber: 6 },
    })
    const hasFiberPositive = result.positives.some(p => p.toLowerCase().includes('fiber'))
    expect(hasFiberPositive).toBe(true)
  })
})
