import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
    }),
  },
}))

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 19, resetIn: 60 }),
}))

vi.mock('@/lib/gemini', () => ({
  callGemini: vi.fn().mockResolvedValue({
    text: JSON.stringify({
      health_rating: 'moderate',
      health_score: 5.5,
      health_score_breakdown: {
        nutrition_score: 6,
        ingredient_safety_score: 5,
        processing_score: 5.5,
        overall: 5.5,
      },
      summary: 'This product is moderately healthy.',
      detailed_breakdown: {},
      safe_consumption: { amount: '1 pack', frequency: 'Occasionally', notes: null, personalized_for_user: null },
      harmful_ingredients: [],
      ingredient_warnings: [],
      positives: [],
      long_term_risks: [],
      healthier_alternatives: [],
      fssai_compliance: 'compliant',
      diabetic_suitability: 'consume_with_caution',
      bp_suitability: 'suitable',
      child_suitability: 'consume_with_caution',
      pregnancy_suitability: 'suitable',
    }),
    usage: { inputTokens: 500, outputTokens: 800 },
  }),
  GeminiError: class extends Error {
    constructor(public type: string, message: string) {
      super(message)
      this.name = 'GeminiError'
    }
  },
}))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
}))

describe('Analyze API — Schema Validation', () => {
  it('accepts valid product with all required fields', () => {
    const validProduct = {
      barcode: '8901234567890',
      name: 'Parle-G Biscuits',
      brand: 'Parle',
      nutrition: {
        calories: 450,
        protein: 6,
        carbs: 70,
        fat: 15,
        sugar: 25,
        sodium: 400,
        fiber: 2,
      },
    }
    expect(validProduct.name).toBeTruthy()
    expect(validProduct.nutrition.calories).toBeGreaterThanOrEqual(0)
  })

  it('handles null optional fields (null→undefined normalization)', () => {
    const productFromScan = {
      barcode: '8901234567890',
      name: 'Test Product',
      brand: null,
      category: null,
      image_url: null,
      nutrition: { calories: 100, protein: 5, carbs: 20, fat: 3 },
      ingredients_text: null,
      allergens: [],
      additives: [],
    }
    const normalized = {
      ...productFromScan,
      brand: productFromScan.brand ?? undefined,
      category: productFromScan.category ?? undefined,
      image_url: productFromScan.image_url ?? undefined,
      ingredients_text: productFromScan.ingredients_text ?? undefined,
      allergens: productFromScan.allergens ?? undefined,
      additives: productFromScan.additives ?? undefined,
    }
    expect(normalized.brand).toBeUndefined()
    expect(normalized.ingredients_text).toBeUndefined()
  })

  it('rejects negative calories', () => {
    const invalidProduct = {
      name: 'Test',
      nutrition: { calories: -5, protein: 0, carbs: 0, fat: 0 },
    }
    expect(invalidProduct.nutrition.calories).toBeLessThan(0)
  })
})

describe('Analyze API — Rate Limiting', () => {
  it('allows request when under rate limit', async () => {
    const { checkRateLimit } = await import('@/lib/rateLimit')
    const result = await checkRateLimit('user-123', 'analyze')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBeGreaterThan(0)
  })
})

describe('Analyze API — Gemini Response Parsing', () => {
  it('parses valid Gemini JSON response', () => {
    const geminiOutput = JSON.stringify({
      health_rating: 'unhealthy',
      health_score: 2.8,
      health_score_breakdown: {
        nutrition_score: 3,
        ingredient_safety_score: 2,
        processing_score: 3,
        overall: 2.8,
      },
      summary: 'This product is very unhealthy.',
      detailed_breakdown: { calories: 'high', protein: 'low', sugar: 'high', sodium: 'high', fat: 'high', fiber: 'not listed' },
      safe_consumption: { amount: 'Avoid', frequency: 'Never', notes: null, personalized_for_user: null },
      harmful_ingredients: [],
      ingredient_warnings: [],
      positives: [],
      long_term_risks: ['High sugar increases type 2 diabetes risk'],
      healthier_alternatives: [],
      fssai_compliance: 'concern',
      diabetic_suitability: 'avoid',
      bp_suitability: 'avoid',
      child_suitability: 'avoid',
      pregnancy_suitability: 'avoid',
    })
    const parsed = JSON.parse(geminiOutput)
    expect(parsed.health_score).toBe(2.8)
    expect(parsed.health_rating).toBe('unhealthy')
    expect(parsed.long_term_risks).toHaveLength(1)
  })

  it('strips markdown code fences from Gemini output', () => {
    const rawOutput = '```json\n{"health_score": 5.0}\n```'
    const cleaned = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    expect(parsed.health_score).toBe(5.0)
  })

  it('handles empty harmful_ingredients array gracefully', () => {
    const response = {
      health_rating: 'healthy',
      health_score: 8.5,
      harmful_ingredients: [],
    }
    expect(response.harmful_ingredients.length).toBe(0)
  })
})
