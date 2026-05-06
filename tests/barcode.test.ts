import { describe, it, expect } from 'vitest'
import { analyzeBarcode, KNOWN_INDIAN_BRANDS, INDIAN_PREFIXES } from '@/lib/barcode-intelligence'

describe('Indian Barcode Detection', () => {
  it('should detect 890 prefix as Indian', () => {
    const result = analyzeBarcode('8901234567890')
    expect(result.isIndian).toBe(true)
  })

  it('should NOT detect non-890 as Indian', () => {
    const result = analyzeBarcode('5001234567890')
    expect(result.isIndian).toBe(false)
  })

  it('should identify Britannia brand', () => {
    const result = analyzeBarcode('8901058123456')
    expect(result.brand).toBe('Britannia')
    expect(result.isKnownBrand).toBe(true)
  })

  it('should identify Parle brand', () => {
    const result = analyzeBarcode('8901063123456')
    expect(result.brand).toBe('Parle')
    expect(result.isKnownBrand).toBe(true)
  })

  it('should identify Patanjali', () => {
    const result = analyzeBarcode('8906002123456')
    expect(result.brand).toBe('Patanjali')
    expect(result.isKnownBrand).toBe(true)
  })

  it('should identify Amul', () => {
    const result = analyzeBarcode('8901764123456')
    expect(result.brand).toBe('Amul')
    expect(result.isKnownBrand).toBe(true)
  })

  it('should return search hint for known brand', () => {
    const result = analyzeBarcode('8901058123456')
    expect(result.searchHint).toContain('Britannia')
  })

  it('should return generic hint for unknown Indian brand', () => {
    const result = analyzeBarcode('8909999999999')
    expect(result.isIndian).toBe(true)
    expect(result.isKnownBrand).toBe(false)
    expect(result.searchHint).toContain('Indian food product')
  })

  it('should have 50+ brands in database', () => {
    const brandCount = Object.keys(KNOWN_INDIAN_BRANDS).length
    expect(brandCount).toBeGreaterThan(50)
  })

  it('should have 890 as only Indian prefix', () => {
    expect(INDIAN_PREFIXES).toContain('890')
    expect(INDIAN_PREFIXES.length).toBe(1)
  })
})

describe('Brand Categories', () => {
  it('should have Britannia from existing top tier', () => {
    expect(KNOWN_INDIAN_BRANDS['8901058']).toBe('Britannia')
  })

  it('should have regional brands', () => {
    expect(KNOWN_INDIAN_BRANDS['8901029']).toBe('Bajaj')
    expect(KNOWN_INDIAN_BRANDS['8901152']).toBe('Id')
  })

  it('should have FMCG brands', () => {
    expect(KNOWN_INDIAN_BRANDS['8901113']).toBe('Kellogg\'s India')
    expect(KNOWN_INDIAN_BRANDS['8901111']).toBe('Lijjat')
  })

  it('should have health food brands', () => {
    expect(KNOWN_INDIAN_BRANDS['8901419']).toBe('True Elements')
    expect(KNOWN_INDIAN_BRANDS['8901358']).toBe('24 Mantra')
    expect(KNOWN_INDIAN_BRANDS['8901375']).toBe('Organic India')
  })

  it('should have spice brands', () => {
    expect(KNOWN_INDIAN_BRANDS['8901099']).toBe('Everest')
    expect(KNOWN_INDIAN_BRANDS['8901101']).toBe('Catch')
  })
})