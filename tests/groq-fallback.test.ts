import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { generateIngredientsViaGroq, generateAlternativesViaGroq } from '@/lib/groq'

const originalFetch = globalThis.fetch

describe('generateIngredientsViaGroq', () => {
  beforeEach(() => {
    process.env.GROQ_API_KEY = 'test-key'
  })

  afterEach(() => {
    delete process.env.GROQ_API_KEY
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('returns empty string when GROQ_API_KEY is missing', async () => {
    delete process.env.GROQ_API_KEY
    const out = await generateIngredientsViaGroq({ product_name: 'Maggi Noodles' })
    expect(out).toBe('')
  })

  it('returns empty string when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network')) as any
    const out = await generateIngredientsViaGroq({ product_name: 'Maggi Noodles' })
    expect(out).toBe('')
  })

  it('returns empty string when API responds with non-OK status', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, text: () => Promise.resolve('') } as any)
    const out = await generateIngredientsViaGroq({ product_name: 'Maggi Noodles' })
    expect(out).toBe('')
  })

  it('strips markdown code fences from the response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: '```json\nwheat flour, sugar, palm oil\n```' } }] }),
    } as any)

    const out = await generateIngredientsViaGroq({ product_name: 'Cookies' })
    expect(out).toBe('wheat flour, sugar, palm oil')
  })

  it('includes product name, brand, category, and nutrition in the prompt', async () => {
    let capturedBody = ''
    globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init: any) => {
      capturedBody = init.body
      return {
        ok: true,
        json: () => Promise.resolve({ choices: [{ message: { content: 'wheat flour, sugar' } }] }),
      }
    }) as any

    await generateIngredientsViaGroq({
      product_name: 'Maggi 2-Minute Noodles',
      brand: 'Maggi',
      category: 'instant noodles',
      nutrition: { calories: 436, protein: 9, sodium: 1100 },
    })

    expect(capturedBody).toContain('Maggi 2-Minute Noodles')
    expect(capturedBody).toContain('Maggi')
    expect(capturedBody).toContain('instant noodles')
    expect(capturedBody).toContain('1100')
  })
})

describe('generateAlternativesViaGroq', () => {
  beforeEach(() => {
    process.env.GROQ_API_KEY = 'test-key'
  })

  afterEach(() => {
    delete process.env.GROQ_API_KEY
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('returns [] when GROQ_API_KEY is missing', async () => {
    delete process.env.GROQ_API_KEY
    const out = await generateAlternativesViaGroq({ product_name: 'Maggi Noodles' })
    expect(out).toEqual([])
  })

  it('returns [] when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network')) as any
    const out = await generateAlternativesViaGroq({ product_name: 'Maggi Noodles' })
    expect(out).toEqual([])
  })

  it('returns [] when API returns non-OK', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429, text: () => Promise.resolve('') } as any)
    const out = await generateAlternativesViaGroq({ product_name: 'Maggi Noodles' })
    expect(out).toEqual([])
  })

  it('returns [] when JSON cannot be parsed', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'not json' } }] }),
    } as any)
    const out = await generateAlternativesViaGroq({ product_name: 'Maggi Noodles' })
    expect(out).toEqual([])
  })

  it('parses valid JSON and normalises fields', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              alternatives: [
                {
                  name: 'Yoga Atta Noodles',
                  brand: 'Yoga',
                  type: 'branded',
                  reason: '64% less fat, no MSG, whole wheat',
                  ingredients_summary: 'whole wheat, no maida, low sodium',
                  price_band: 'similar',
                  availability: 'Amazon India, BigBasket',
                  shopping_platforms: ['Amazon India', 'BigBasket'],
                },
                {
                  name: 'Sprouts Chaat',
                  brand: null,
                  type: 'homemade',
                  reason: 'High protein, low fat, fresh',
                  ingredients_summary: 'moong sprouts, onion, tomato, lemon',
                  price_band: 'lower',
                  availability: 'Homemade',
                  shopping_platforms: [],
                },
              ],
            }),
          },
        }],
      }),
    } as any)

    const out = await generateAlternativesViaGroq({
      product_name: 'Maggi Noodles',
      brand: 'Maggi',
      category: 'instant noodles',
      current_score: 3,
    })

    expect(out).toHaveLength(2)
    expect(out[0].name).toBe('Yoga Atta Noodles')
    expect(out[0].brand).toBe('Yoga')
    expect(out[0].type).toBe('branded')
    expect(out[0].price_band).toBe('similar')
    expect(out[0].availability).toContain('Amazon India')
    expect(out[0].shopping_platforms).toEqual(['Amazon India', 'BigBasket'])
    expect(out[1].type).toBe('homemade')
    expect(out[1].brand).toBeNull()
  })

  it('limits to 4 alternatives', async () => {
    const many = Array.from({ length: 8 }, (_, i) => ({ name: `Alt ${i}`, reason: 'ok', type: 'branded' }))
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: JSON.stringify({ alternatives: many }) } }] }),
    } as any)

    const out = await generateAlternativesViaGroq({ product_name: 'X' })
    expect(out).toHaveLength(4)
  })

  it('filters out alternatives missing a name', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              alternatives: [
                { name: 'Good Alt', reason: 'yes' },
                { name: '', reason: 'no name' },
                { reason: 'no name field' },
                { name: '   ', reason: 'whitespace' },
                { name: 'Another Good', reason: 'ok' },
              ],
            }),
          },
        }],
      }),
    } as any)

    const out = await generateAlternativesViaGroq({ product_name: 'X' })
    expect(out).toHaveLength(2)
    expect(out.map(a => a.name)).toEqual(['Good Alt', 'Another Good'])
  })

  it('falls back to default type and platforms when missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              alternatives: [
                { name: 'Whole Food A', reason: 'ok' },
              ],
            }),
          },
        }],
      }),
    } as any)

    const out = await generateAlternativesViaGroq({ product_name: 'X' })
    expect(out[0].type).toBe('branded')
    expect(out[0].availability).toBeTruthy()
  })

  it('the prompt mentions availability, price, ingredients, and Indian platforms', async () => {
    let capturedBody = ''
    globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init: any) => {
      capturedBody = init.body
      return {
        ok: true,
        json: () => Promise.resolve({ choices: [{ message: { content: '[]' } }] }),
      }
    }) as any

    await generateAlternativesViaGroq({
      product_name: 'Maggi Noodles',
      brand: 'Maggi',
      category: 'instant noodles',
      current_score: 3,
    })

    expect(capturedBody).toContain('AVAILABILITY')
    expect(capturedBody).toContain('PRICE')
    expect(capturedBody).toContain('INGREDIENTS')
    expect(capturedBody).toContain('INDIAN MARKET')
    expect(capturedBody).toContain('Amazon India')
    expect(capturedBody).toContain('BigBasket')
    expect(capturedBody).toContain('Blinkit')
  })
})
