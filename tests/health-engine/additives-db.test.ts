import { describe, it, expect } from 'vitest'
import {
  detectAdditives,
  getAdditivesByRisk,
  getAdditivesByCategory,
  getCategoryWarnings,
  ADDITIVES_DB,
} from '@/lib/health-engine'

describe('ADDITIVES_DB', () => {
  it('should have 40+ entries', () => {
    expect(ADDITIVES_DB.length).toBeGreaterThan(40)
  })

  it('every entry should have a name, risk, and category', () => {
    for (const a of ADDITIVES_DB) {
      expect(a.name).toBeTruthy()
      expect(['safe', 'low', 'medium', 'high', 'critical']).toContain(a.risk)
      expect(a.category).toBeTruthy()
    }
  })

  it('should have at least 3 critical-risk additives', () => {
    const critical = ADDITIVES_DB.filter(a => a.risk === 'critical')
    expect(critical.length).toBeGreaterThanOrEqual(3)
  })

  it('should have at least 5 high-risk additives', () => {
    const high = ADDITIVES_DB.filter(a => a.risk === 'high')
    expect(high.length).toBeGreaterThanOrEqual(5)
  })
})

describe('detectAdditives', () => {
  it('should detect sodium benzoate by name', () => {
    const result = detectAdditives('Contains sodium benzoate as preservative')
    expect(result.some(a => a.name === 'Sodium Benzoate')).toBe(true)
  })

  it('should detect additives by INS code', () => {
    const result = detectAdditives('Contains INS 211 as preservative')
    expect(result.some(a => a.name === 'Sodium Benzoate')).toBe(true)
  })

  it('should detect additives by E code', () => {
    const result = detectAdditives('Contains E211 as preservative')
    expect(result.some(a => a.name === 'Sodium Benzoate')).toBe(true)
  })

  it('should detect multiple additives', () => {
    const result = detectAdditives('E211, E102, E621, E951')
    const names = result.map(a => a.name)
    expect(names).toContain('Sodium Benzoate')
    expect(names).toContain('Tartrazine')
    expect(names).toContain('Monosodium Glutamate')
    expect(names).toContain('Aspartame')
  })

  it('should detect trans fat aliases', () => {
    const result = detectAdditives('partially hydrogenated vegetable oil')
    expect(result.some(a => a.name === 'Trans Fat / Partially Hydrogenated Oil')).toBe(true)
  })

  it('should detect MSG', () => {
    const result = detectAdditives('flavour enhancer msg')
    expect(result.some(a => a.name === 'Monosodium Glutamate')).toBe(true)
  })

  it('should return empty for no ingredients', () => {
    expect(detectAdditives('')).toHaveLength(0)
    expect(detectAdditives(null as any)).toHaveLength(0)
    expect(detectAdditives(undefined as any)).toHaveLength(0)
  })

  it('should return empty for clean ingredients', () => {
    expect(detectAdditives('rice, dal, turmeric, salt, ghee')).toHaveLength(0)
  })

  it('should be case-insensitive', () => {
    const result = detectAdditives('SODIUM BENZOATE, TARTRAZINE')
    expect(result.length).toBeGreaterThanOrEqual(2)
  })
})

describe('getAdditivesByRisk', () => {
  it('should return all critical additives', () => {
    const result = getAdditivesByRisk('critical')
    expect(result.length).toBeGreaterThanOrEqual(3)
    result.forEach(a => expect(a.risk).toBe('critical'))
  })

  it('should return all safe additives', () => {
    const result = getAdditivesByRisk('safe')
    result.forEach(a => expect(a.risk).toBe('safe'))
  })

  it('should return empty for unknown risk level', () => {
    const result = getAdditivesByRisk('unknown' as any)
    expect(result).toHaveLength(0)
  })
})

describe('getAdditivesByCategory', () => {
  it('should return all color additives', () => {
    const result = getAdditivesByCategory('color')
    expect(result.length).toBeGreaterThanOrEqual(5)
    result.forEach(a => expect(a.category).toBe('color'))
  })

  it('should return all preservatives', () => {
    const result = getAdditivesByCategory('preservative')
    expect(result.length).toBeGreaterThanOrEqual(4)
    result.forEach(a => expect(a.category).toBe('preservative'))
  })
})

describe('getCategoryWarnings', () => {
  it('should return warnings for chips', () => {
    const result = getCategoryWarnings('chips')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(a => a.category === 'other' || a.category === 'flavor')).toBe(true)
  })

  it('should return warnings for cold_drink', () => {
    const result = getCategoryWarnings('cold_drink')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(a => a.name.includes('Phosphoric') || a.name.includes('Aspartame'))).toBe(true)
  })

  it('should return empty for rice category', () => {
    expect(getCategoryWarnings('rice')).toHaveLength(0)
  })

  it('should return empty for milk category', () => {
    expect(getCategoryWarnings('milk')).toHaveLength(0)
  })

  it('should return empty for unknown category', () => {
    expect(getCategoryWarnings('nonexistent_category_xyz')).toHaveLength(0)
  })

  it('should be case-insensitive', () => {
    const result = getCategoryWarnings('CHIPS')
    expect(result.length).toBeGreaterThan(0)
  })
})
