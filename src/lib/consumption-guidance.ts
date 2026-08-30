import type { UnifiedProductInput } from '@/lib/analysis-runner'

const DAILY_VALUES = {
  sugar: 50,
  sodium: 2300,
  saturated_fat: 20,
}
function finitePositive(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function buildConsumptionGuidance(product: UnifiedProductInput, score: number, personalized = false) {
  const n = product.nutrition
  const candidates: number[] = []

  // A practical portion screen at 20% of the adult Daily Value. This is not a
  // toxicology limit and is intentionally described as such in the UI.
  if (finitePositive(n.sugar)) candidates.push((DAILY_VALUES.sugar * 0.2 * 100) / n.sugar)
  if (finitePositive(n.sodium)) candidates.push((DAILY_VALUES.sodium * 0.2 * 100) / n.sodium)
  if (finitePositive(n.saturated_fat)) candidates.push((DAILY_VALUES.saturated_fat * 0.2 * 100) / n.saturated_fat)

  const calculated = candidates.length ? Math.min(...candidates) : null
  const labelServing = finitePositive(product.serving_size_g) ? product.serving_size_g : null
  const suggested = calculated && labelServing ? Math.min(calculated, labelServing) : calculated || labelServing
  const rounded = suggested ? Math.max(10, Math.min(250, Math.round(suggested / 5) * 5)) : null
  const frequency = score >= 7 ? 'Regularly, as part of a balanced diet' : score >= 4 ? 'Occasionally' : 'Infrequently'

  return {
    amount: rounded ? `About ${rounded} g or ml-equivalent at a time` : 'Use the serving size printed on the pack',
    frequency,
    notes: rounded
      ? 'Practical portion guide based on keeping sugar, sodium and saturated fat near 20% of adult Daily Values. It is not a medical or toxicology limit.'
      : 'The label does not provide enough quantified nutrition to calculate a responsible portion guide.',
    personalized_for_user: personalized ? 'Also consider your clinician’s advice and personal health goals.' : null,
  }
}
