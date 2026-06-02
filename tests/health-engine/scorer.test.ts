import { describe, it, expect } from 'vitest'
import { scoreNutrition, scoreAdditives, classifyNOVA, scoreProduct, type NutritionPer100g } from '@/lib/health-engine'

describe('scoreNutrition', () => {
  it('should give baseline 5 for empty nutrition', () => {
    const result = scoreNutrition({})
    expect(result.score).toBe(5)
    expect(result.breakdown).toHaveLength(0)
  })

  it('should penalize high sugar (over 22.5g)', () => {
    const result = scoreNutrition({ sugar: 30 })
    expect(result.score).toBeLessThan(5)
    expect(result.breakdown.some(b => b.factor === 'sugar' && b.impact === 'critical')).toBe(true)
  })

  it('should penalize high sugar (12.5-22.5g)', () => {
    const result = scoreNutrition({ sugar: 15 })
    expect(result.breakdown.some(b => b.factor === 'sugar' && b.impact === 'negative')).toBe(true)
  })

  it('should reward low sugar (under 5g)', () => {
    const result = scoreNutrition({ sugar: 2 })
    expect(result.breakdown.some(b => b.factor === 'sugar' && b.impact === 'positive')).toBe(true)
  })

  it('should penalize high sodium (over 600mg)', () => {
    const result = scoreNutrition({ sodium: 800 })
    expect(result.score).toBeLessThan(5)
    expect(result.breakdown.some(b => b.factor === 'sodium' && b.impact === 'critical')).toBe(true)
  })

  it('should penalize moderate sodium (150-400mg)', () => {
    const result = scoreNutrition({ sodium: 250 })
    expect(result.breakdown.some(b => b.factor === 'sodium' && b.impact === 'warning')).toBe(true)
  })

  it('should reward low sodium', () => {
    const result = scoreNutrition({ sodium: 50 })
    expect(result.breakdown.some(b => b.factor === 'sodium' && b.impact === 'positive')).toBe(true)
  })

  it('should penalize high saturated fat (over 10g)', () => {
    const result = scoreNutrition({ saturated_fat: 15 })
    expect(result.breakdown.some(b => b.factor === 'sat_fat' && b.impact === 'critical')).toBe(true)
  })

  it('should penalize moderate saturated fat (1.5-5g)', () => {
    const result = scoreNutrition({ saturated_fat: 3 })
    expect(result.breakdown.some(b => b.factor === 'sat_fat' && b.impact === 'warning')).toBe(true)
  })

  it('should reward low saturated fat', () => {
    const result = scoreNutrition({ saturated_fat: 0.5 })
    expect(result.breakdown.some(b => b.factor === 'sat_fat' && b.impact === 'positive')).toBe(true)
  })

  it('should reward high protein (over 10g)', () => {
    const result = scoreNutrition({ protein: 12 })
    expect(result.breakdown.some(b => b.factor === 'protein' && b.impact === 'positive')).toBe(true)
  })

  it('should reward moderate protein (5-10g)', () => {
    const result = scoreNutrition({ protein: 7 })
    expect(result.breakdown.some(b => b.factor === 'protein')).toBe(true)
  })

  it('should reward high fiber (over 6g)', () => {
    const result = scoreNutrition({ fiber: 8 })
    expect(result.breakdown.some(b => b.factor === 'fiber' && b.impact === 'positive')).toBe(true)
  })

  it('should reward moderate fiber (3-6g)', () => {
    const result = scoreNutrition({ fiber: 4 })
    expect(result.breakdown.some(b => b.factor === 'fiber')).toBe(true)
  })

  it('should penalize high calories (over 400)', () => {
    const result = scoreNutrition({ calories: 500 })
    expect(result.breakdown.some(b => b.factor === 'calories' && b.impact === 'warning')).toBe(true)
  })

  it('should reward low calories (under 100)', () => {
    const result = scoreNutrition({ calories: 50 })
    expect(result.breakdown.some(b => b.factor === 'calories' && b.impact === 'positive')).toBe(true)
  })

  it('should clamp score between 0 and 10', () => {
    const result = scoreNutrition({
      sugar: 50,
      sodium: 2000,
      saturated_fat: 30,
      calories: 600,
    })
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(10)
  })

  it('should give a perfect score for ideal nutrition', () => {
    const result = scoreNutrition({
      sugar: 0,
      sodium: 0,
      saturated_fat: 0,
      protein: 20,
      fiber: 10,
      calories: 50,
    })
    expect(result.score).toBeGreaterThan(8)
  })

  it('should handle undefined values gracefully', () => {
    const result = scoreNutrition({
      calories: undefined as any,
      protein: undefined as any,
      sugar: undefined as any,
    })
    expect(result.score).toBe(5)
    expect(result.breakdown).toHaveLength(0)
  })
})

describe('classifyNOVA', () => {
  it('should return 4 for ultra-processed keywords', () => {
    expect(classifyNOVA('water, sugar, maltodextrin, artificial flavor')).toBe(4)
    expect(classifyNOVA('xanthan gum, carrageenan, emulsifier')).toBe(4)
    expect(classifyNOVA('high fructose corn syrup, modified starch')).toBe(4)
  })

  it('should return 3 for processed foods', () => {
    expect(classifyNOVA('water, sugar, salt, vinegar')).toBe(3)
  })

  it('should return 3 when ingredient count exceeds 4', () => {
    expect(classifyNOVA('a, b, c, d, e')).toBe(3)
  })

  it('should return 4 when ingredient count exceeds 8', () => {
    expect(classifyNOVA('a, b, c, d, e, f, g, h, i')).toBe(4)
  })

  it('should return 2 for minimally processed', () => {
    expect(classifyNOVA('pea, water')).toBe(2)
  })

  it('should return 1 for single ingredient', () => {
    expect(classifyNOVA('chickpea')).toBe(1)
  })

  it('should return 3 for empty string (default)', () => {
    expect(classifyNOVA('')).toBe(3)
  })

  it('should return 3 for undefined/null', () => {
    expect(classifyNOVA(null as any)).toBe(3)
    expect(classifyNOVA(undefined as any)).toBe(3)
  })
})

describe('scoreAdditives', () => {
  it('should detect known additives', () => {
    const result = scoreAdditives('Contains sodium benzoate, tartrazine and sugar')
    expect(result.detected.length).toBeGreaterThanOrEqual(2)
    expect(result.detected.some(a => a.name === 'Sodium Benzoate')).toBe(true)
    expect(result.detected.some(a => a.name === 'Tartrazine')).toBe(true)
  })

  it('should give bonus for clean ingredients', () => {
    const result = scoreAdditives('rice, dal, salt')
    expect(result.score).toBe(10)
    expect(result.breakdown.some(b => b.factor === 'additives_clean')).toBe(true)
  })

  it('should penalize critical-risk additives heavily', () => {
    const result = scoreAdditives('Contains sodium nitrite')
    const critical = result.detected.find(a => a.risk === 'critical')
    expect(critical).toBeDefined()
    expect(result.score).toBeLessThan(10)
  })

  it('should return empty array for empty ingredient text', () => {
    const result = scoreAdditives('')
    expect(result.detected).toHaveLength(0)
    expect(result.score).toBe(10)
  })

  it('should not duplicate detected additives', () => {
    const result = scoreAdditives('sodium benzoate, sodium benzoate')
    const count = result.detected.filter(a => a.name === 'Sodium Benzoate').length
    expect(count).toBe(1)
  })
})

describe('scoreProduct', () => {
  it('should return grade A for excellent nutrition and clean ingredients', () => {
    const nutrition: NutritionPer100g = {
      calories: 50,
      protein: 15,
      fiber: 8,
      sugar: 2,
      sodium: 20,
      saturated_fat: 0.5,
    }
    const result = scoreProduct(nutrition, 'chickpea, water, salt')
    expect(result.grade).toBe('A')
    expect(result.score).toBeGreaterThanOrEqual(8)
    expect(result.nova_group).toBeLessThanOrEqual(3)
  })

  it('should return grade F for junk food', () => {
    const nutrition: NutritionPer100g = {
      calories: 550,
      protein: 2,
      sugar: 35,
      sodium: 900,
      saturated_fat: 15,
      fiber: 0,
    }
    const result = scoreProduct(nutrition, 'maida, sugar, palm oil, high fructose corn syrup, artificial flavor, tartrazine, sodium benzoate')
    expect(result.grade).toBe('F')
    expect(result.score).toBeLessThanOrEqual(3.5)
  })

  it('should include all breakdown sections', () => {
    const result = scoreProduct({ sugar: 10, sodium: 200 }, '')
    const factors = result.breakdown.map(b => b.factor)
    expect(factors).toContain('nova')
    expect(result.breakdown.length).toBeGreaterThan(2)
  })

  it('should include summary text', () => {
    const result = scoreProduct({}, '')
    expect(result.summary).toBeTruthy()
    expect(result.summary).toContain('Score:')
  })

  it('should reference critical additives in summary', () => {
    const result = scoreProduct({}, 'sodium nitrite')
    expect(result.summary.toLowerCase()).toContain('sodium nitrite')
  })

  it('should have consistent scoring range', () => {
    for (const sugar of [0, 5, 15, 30]) {
      for (const sodium of [50, 300, 700]) {
        const result = scoreProduct({ sugar, sodium }, '')
        expect(result.score).toBeGreaterThanOrEqual(1)
        expect(result.score).toBeLessThanOrEqual(10)
        expect(['A', 'B', 'C', 'D', 'F']).toContain(result.grade)
      }
    }
  })
})
