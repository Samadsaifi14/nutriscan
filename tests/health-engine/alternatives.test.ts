import { describe, it, expect } from 'vitest'
import { findHealthierAlternatives, ALTERNATIVES_DB } from '@/lib/health-engine/alternatives'

describe('ALTERNATIVES_DB', () => {
  it('should have entries', () => {
    expect(ALTERNATIVES_DB.length).toBeGreaterThan(0)
  })

  it('every alternative should have a name, reason, and availability', () => {
    for (const alt of ALTERNATIVES_DB) {
      expect(alt.name).toBeTruthy()
      expect(alt.reason).toBeTruthy()
      expect(['widely_available', 'supermarket', 'homemade']).toContain(alt.availability)
      expect(['branded', 'homemade', 'whole_food']).toContain(alt.type)
      expect(alt.category_match.length).toBeGreaterThan(0)
    }
  })
})

describe('findHealthierAlternatives', () => {
  it('should return alternatives for chips', () => {
    const result = findHealthierAlternatives('Lays Potato Chips', 'chips', 3)
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(a => a.name.toLowerCase().includes('makhana') || a.name.toLowerCase().includes('chana'))).toBe(true)
  })

  it('should return no alternatives for very high score (already healthy)', () => {
    const result = findHealthierAlternatives('Apple', 'fruit', 9)
    expect(result).toHaveLength(0)
  })

  it('should return alternatives for biscuits', () => {
    const result = findHealthierAlternatives('Parle-G Biscuits', 'biscuits', 4)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return alternatives for soft drinks', () => {
    const result = findHealthierAlternatives('Coca Cola', 'soft drink', 2)
    expect(result.some(a => a.name.toLowerCase().includes('coconut') || a.name.toLowerCase().includes('buttermilk'))).toBe(true)
  })

  it('should return alternatives for instant noodles', () => {
    const result = findHealthierAlternatives('Maggi Noodles', 'instant noodles', 3)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should limit results to 4', () => {
    const result = findHealthierAlternatives('Any product', 'chips', 1)
    expect(result.length).toBeLessThanOrEqual(4)
  })

  it('should filter by score suitability', () => {
    const highScore = findHealthierAlternatives('Product', 'chips', 6)
    const lowScore = findHealthierAlternatives('Product', 'chips', 2)
    // Higher score products should get fewer (or different) alternatives since some require min_score_needed
    expect(lowScore.length).toBeGreaterThanOrEqual(highScore.length)
  })
})
