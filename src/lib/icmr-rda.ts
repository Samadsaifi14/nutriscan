/**
 * lib/icmr-rda.ts
 *
 * ICMR 2020 RDA lookup utility for Indian users.
 * Use in:
 *   - /api/analyze/route.ts  → buildRDAPromptSection() for personalised Gemini analysis
 *   - Dashboard              → getDailyPct() for "% of your daily X" display
 */

import rdaData from '@/data/icmr-rda.json'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  age:      number
  gender:   'male' | 'female'
  activity: 'sedentary' | 'moderate' | 'heavy'
  state?:   'pregnancy_t1' | 'pregnancy_t2' | 'pregnancy_t3' | 'lactation_0_6' | 'lactation_6_12'
}

export interface RDAProfile {
  calories:      number
  protein_g:     number
  fat_g:         number
  carbs_g:       number
  fiber_g:       number
  iron_mg?:      number
  calcium_mg?:   number
  vitamin_d_iu?: number
  source_bracket: string  // e.g. "adult female 19-29 moderate"
}

export interface DailyPercentages {
  calories: number | null
  protein:  number | null
  carbs:    number | null
  fat:      number | null
  sugar:    number | null
  sodium:   number | null
  fiber:    number | null
}

// ── Main lookup ───────────────────────────────────────────────────────────────

export function getICMRProfile(user: UserProfile): RDAProfile {
  const { age, gender, activity, state } = user

  if (state) {
    const base = getAdultProfile(age, gender, activity)
    return mergeSpecialState(base, state)
  }

  if (age < 19) return getChildProfile(age, gender)

  return getAdultProfile(age, gender, activity)
}

// ── Daily % calculation ───────────────────────────────────────────────────────

export function getDailyPct(
  nutrition: {
    calories?: number
    protein?:  number
    carbs?:    number
    fat?:      number
    sugar?:    number | null
    sodium?:   number | null
    fiber?:    number | null
  },
  rda: RDAProfile,
  quantityG: number = 100
): DailyPercentages {
  const scale     = quantityG / 100
  const sodiumRDA = 2000   // ICMR/WHO daily sodium limit in mg
  const sugarRDA  = 50     // ICMR free sugar limit in g

  function pct(val: number | null | undefined, rdaVal: number | undefined): number | null {
    if (val == null || !rdaVal) return null
    return Math.round((val * scale / rdaVal) * 100)
  }

  return {
    calories: pct(nutrition.calories, rda.calories),
    protein:  pct(nutrition.protein,  rda.protein_g),
    carbs:    pct(nutrition.carbs,    rda.carbs_g),
    fat:      pct(nutrition.fat,      rda.fat_g),
    sugar:    nutrition.sugar  != null ? Math.round((nutrition.sugar  * scale / sugarRDA)  * 100) : null,
    sodium:   nutrition.sodium != null ? Math.round((nutrition.sodium * scale / sodiumRDA) * 100) : null,
    fiber:    pct(nutrition.fiber, rda.fiber_g),
  }
}

// ── Build Gemini prompt section ───────────────────────────────────────────────

export function buildRDAPromptSection(user: UserProfile, rda: RDAProfile): string {
  return [
    `USER ICMR 2020 RDA PROFILE (${rda.source_bracket}):`,
    `Energy: ${rda.calories} kcal | Protein: ${rda.protein_g}g | Fat: ${rda.fat_g}g | Carbs: ${rda.carbs_g}g | Fiber: ${rda.fiber_g}g`,
    rda.iron_mg    ? `Iron: ${rda.iron_mg}mg/day`       : '',
    rda.calcium_mg ? `Calcium: ${rda.calcium_mg}mg/day` : '',
    'Daily sodium limit: 2000mg (ICMR). Free sugar limit: 50g/day.',
    'IMPORTANT: Use these ICMR 2020 values (not generic WHO/US values) for all daily % calculations and safe consumption advice.',
  ].filter(Boolean).join('\n')
}

// ── Internal helpers ──────────────────────────────────────────────────────────

type MacroRow = { calories: number; protein_g: number; fat_g: number; carbs_g: number; fiber_g: number }
type GenderData = Record<string, Record<string, MacroRow>>

function getAdultProfile(
  age:      number,
  gender:   'male' | 'female',
  activity: 'sedentary' | 'moderate' | 'heavy'
): RDAProfile {
  const genderData = rdaData.adults[gender] as GenderData
  const bracket    = getAdultBracket(age)
  const bracketData = genderData[bracket]

  // 'heavy' not available for 60+ brackets — fall back to moderate, then sedentary
  const activityData: MacroRow =
    bracketData[activity] ??
    bracketData['moderate'] ??
    bracketData['sedentary']

  // Micronutrients
  const microKey =
    age >= 60        ? 'adult_60_plus'
    : gender === 'female' ? 'adult_female_19_to_59'
    : 'adult_male_19_to_59'

  const micro = rdaData.micronutrients[microKey as keyof typeof rdaData.micronutrients] as Record<string, number>

  return {
    ...activityData,
    iron_mg:        micro?.iron_mg,
    calcium_mg:     micro?.calcium_mg,
    vitamin_d_iu:   micro?.vitamin_d_iu,
    source_bracket: `adult ${gender} ${bracket.replace(/_/g, '-').replace('to', '–')} ${activity}`,
  }
}

function getAdultBracket(age: number): string {
  if (age < 30)  return '19_to_29'
  if (age < 60)  return '30_to_59'
  if (age < 70)  return '60_to_69'
  return '70_plus'
}

function getChildProfile(age: number, gender: 'male' | 'female'): RDAProfile {
  const c = rdaData.children

  let data: Record<string, number>
  let bracket: string

  if      (age <= 3)  { data = c['1_to_3']          as Record<string, number>; bracket = '1–3'   }
  else if (age <= 6)  { data = c['4_to_6']          as Record<string, number>; bracket = '4–6'   }
  else if (age <= 9)  { data = c['7_to_9']          as Record<string, number>; bracket = '7–9'   }
  else if (age <= 12) {
    data    = (gender === 'female' ? c['girls_10_to_12'] : c['boys_10_to_12']) as Record<string, number>
    bracket = '10–12'
  }
  else if (age <= 15) {
    data    = (gender === 'female' ? c['girls_13_to_15'] : c['boys_13_to_15']) as Record<string, number>
    bracket = '13–15'
  }
  else {
    data    = (gender === 'female' ? c['girls_16_to_18'] : c['boys_16_to_18']) as Record<string, number>
    bracket = '16–18'
  }

  return {
    calories:       data.calories   ?? 0,
    protein_g:      data.protein_g  ?? 0,
    fat_g:          data.fat_g      ?? 0,
    carbs_g:        data.carbs_g    ?? 0,
    fiber_g:        data.fiber_g    ?? 0,
    iron_mg:        data.iron_mg,
    calcium_mg:     data.calcium_mg,
    vitamin_d_iu:   data.vitamin_d_iu,
    source_bracket: `child ${gender} ${bracket}`,
  }
}

function mergeSpecialState(base: RDAProfile, state: UserProfile['state']): RDAProfile {
  const sp = rdaData.special_states
  type SpecialRow = { extra_calories?: number; protein_g?: number; calcium_mg?: number; iron_mg?: number }

  let extra: SpecialRow = {}
  let label  = base.source_bracket

  switch (state) {
    case 'pregnancy_t1': extra = sp.pregnancy.trimester_1 as SpecialRow; label += ' (pregnancy T1)'; break
    case 'pregnancy_t2': extra = sp.pregnancy.trimester_2 as SpecialRow; label += ' (pregnancy T2)'; break
    case 'pregnancy_t3': extra = sp.pregnancy.trimester_3 as SpecialRow; label += ' (pregnancy T3)'; break
    case 'lactation_0_6':  extra = sp.lactation['0_to_6_months']  as SpecialRow; label += ' (lactation 0–6m)';  break
    case 'lactation_6_12': extra = sp.lactation['6_to_12_months'] as SpecialRow; label += ' (lactation 6–12m)'; break
  }

  return {
    calories:       base.calories  + (extra.extra_calories ?? 0),
    protein_g:      extra.protein_g  ?? base.protein_g,
    fat_g:          base.fat_g,
    carbs_g:        base.carbs_g,
    fiber_g:        base.fiber_g,
    iron_mg:        extra.iron_mg    ?? base.iron_mg,
    calcium_mg:     extra.calcium_mg ?? base.calcium_mg,
    vitamin_d_iu:   base.vitamin_d_iu,
    source_bracket: label,
  }
}