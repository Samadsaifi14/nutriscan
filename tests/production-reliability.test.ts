import { describe, expect, it } from 'vitest'
import { getIngredientEvidence } from '@/lib/ingredient-evidence'
import { buildConsumptionGuidance } from '@/lib/consumption-guidance'
import { findCuratedAlternatives } from '@/lib/curated-alternatives'
import { getAmazonLink } from '@/lib/shopping-links'

describe('production result reliability', () => {
  it('matches free-form beverage categories to relevant alternatives', () => {
    const results = findCuratedAlternatives('Original Taste', 'Beverages, Carbonated drinks, Colas', 4.3)
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((item) => /water|nimbu|soda/i.test(item.name))).toBe(true)
    expect(results.some((item) => /salad|nuts/i.test(item.name))).toBe(false)
  })

  it('does not invent unrelated like-for-like alternatives', () => {
    expect(findCuratedAlternatives('Unknown Product', 'Unmapped category', 2)).toEqual([])
  })

  it('uses official source-linked evidence for evaluated additives', () => {
    const aspartame = getIngredientEvidence('E951')
    expect(aspartame?.safeLimit).toContain('40 mg/kg')
    expect(aspartame?.sourceUrl).toContain('efsa.europa.eu')
    expect(aspartame?.effect).toContain('phenylketonuria')
  })

  it('provides a bounded practical portion instead of unlimited guidance', () => {
    const guidance = buildConsumptionGuidance({
      name: 'Cola',
      nutrition: { calories: 42, protein: 0, carbs: 10.6, fat: 0, sugar: 10.6, sodium: 10 },
      serving_size_g: 330,
    }, 4.3)
    expect(guidance.amount).toBe('About 95 g or ml-equivalent at a time')
    expect(guidance.frequency).toBe('Occasionally')
    expect(guidance.notes).toContain('not a medical or toxicology limit')
  })

  it('keeps the configured Amazon Associates tag on search URLs', () => {
    const url = new URL(getAmazonLink('whole wheat noodles'))
    expect(url.hostname).toBe('www.amazon.in')
    expect(url.searchParams.get('tag')).toBe('BioYou-21')
    expect(url.searchParams.get('k')).toBe('whole wheat noodles')
  })
})
