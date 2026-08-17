import { describe, expect, it } from 'vitest'
import { buildIngredientReport, splitIngredients } from '@/lib/ingredient-report'

describe('ingredient report', () => {
  it('keeps nested ingredient groups intact', () => {
    expect(splitIngredients('Wheat flour, seasoning (salt, sugar, INS 621), palm oil')).toEqual([
      'Wheat flour', 'seasoning (salt, sugar, INS 621)', 'palm oil',
    ])
  })

  it('explains every declared ingredient without calling unmatched items safe', () => {
    const report = buildIngredientReport('rice extract, sodium benzoate, salt')
    expect(report).toHaveLength(3)
    expect(report[0]?.note).toContain('No safety conclusion')
    expect(report[1]?.status).toBe('watch')
    expect(report[2]?.plainLanguage).toBe('Salt')
  })
})
