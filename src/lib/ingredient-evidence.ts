import type { Additive } from '@/lib/health-engine/additives-db'

export type EvidenceLevel = 'information' | 'watch' | 'high_concern'

export interface IngredientEvidence {
  ingredientId: string
  title: string
  level: EvidenceLevel
  effect: string
  safeLimit: string
  sourceName: string
  sourceUrl: string
  note?: string
}

const EFSA = 'European Food Safety Authority'

const EVIDENCE: Record<string, Omit<IngredientEvidence, 'ingredientId'>> = {
  E150D: {
    title: 'Sulphite ammonia caramel', level: 'information',
    effect: 'EFSA’s refined exposure assessment found estimated exposure to caramel colours was generally below the group ADI; its assessment did not identify 4-MEI exposure from these colours as a safety concern.',
    safeLimit: 'Group ADI for caramel colours: 300 mg/kg body weight/day. The amount used in this product is not disclosed.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/121219',
  },
  PERMITTED_COLOUR: {
    title: 'Permitted food colours', level: 'information',
    effect: 'This is not a specific ingredient name. Safety and intake limits cannot be assessed until the label identifies the colour or INS/E number.',
    safeLimit: 'No single limit applies to an unspecified colour. Check the full label or manufacturer disclosure.',
    sourceName: 'Codex GSFA', sourceUrl: 'https://www.fao.org/gsfaonline/index.html?lang=en',
  },
  E249: {
    title: 'Potassium nitrite', level: 'watch',
    effect: 'High nitrite exposure can reduce the blood’s oxygen-carrying capacity. In processed meat, nitrite can also contribute to formation of nitrosamines under some conditions.',
    safeLimit: 'Group ADI for nitrites: 0.07 mg/kg body weight/day (as nitrite ion).',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170615',
  },
  E250: {
    title: 'Sodium nitrite', level: 'watch',
    effect: 'High nitrite exposure can reduce the blood’s oxygen-carrying capacity. In processed meat, nitrite can also contribute to formation of nitrosamines under some conditions.',
    safeLimit: 'Group ADI for nitrites: 0.07 mg/kg body weight/day (as nitrite ion).',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170615',
  },
  E251: {
    title: 'Sodium nitrate', level: 'watch',
    effect: 'Nitrate itself is less acutely toxic, but some is converted to nitrite in the body. Total exposure matters across food and drinking water.',
    safeLimit: 'Group ADI for nitrates: 3.7 mg/kg body weight/day (as nitrate ion).',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170615',
  },
  E252: {
    title: 'Potassium nitrate', level: 'watch',
    effect: 'Nitrate itself is less acutely toxic, but some is converted to nitrite in the body. Total exposure matters across food and drinking water.',
    safeLimit: 'Group ADI for nitrates: 3.7 mg/kg body weight/day (as nitrate ion).',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170615',
  },
  E620: {
    title: 'Glutamic acid', level: 'information',
    effect: 'EFSA found possible short-term effects such as headache, raised blood pressure and increased insulin at exposure above the group safe level.',
    safeLimit: 'Group ADI for glutamates (E620–E625): 30 mg/kg body weight/day, expressed as glutamic acid.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170712',
  },
  E621: {
    title: 'Monosodium glutamate (MSG)', level: 'information',
    effect: 'EFSA found possible short-term effects such as headache, raised blood pressure and increased insulin at exposure above the group safe level.',
    safeLimit: 'Group ADI for glutamates (E620–E625): 30 mg/kg body weight/day, expressed as glutamic acid.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170712',
  },
  E622: {
    title: 'Monopotassium glutamate', level: 'information',
    effect: 'EFSA found possible short-term effects such as headache, raised blood pressure and increased insulin at exposure above the group safe level.',
    safeLimit: 'Group ADI for glutamates (E620–E625): 30 mg/kg body weight/day, expressed as glutamic acid.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170712',
  },
  E623: {
    title: 'Calcium diglutamate', level: 'information',
    effect: 'EFSA found possible short-term effects such as headache, raised blood pressure and increased insulin at exposure above the group safe level.',
    safeLimit: 'Group ADI for glutamates (E620–E625): 30 mg/kg body weight/day, expressed as glutamic acid.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170712',
  },
  E624: {
    title: 'Monoammonium glutamate', level: 'information',
    effect: 'EFSA found possible short-term effects such as headache, raised blood pressure and increased insulin at exposure above the group safe level.',
    safeLimit: 'Group ADI for glutamates (E620–E625): 30 mg/kg body weight/day, expressed as glutamic acid.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170712',
  },
  E625: {
    title: 'Magnesium diglutamate', level: 'information',
    effect: 'EFSA found possible short-term effects such as headache, raised blood pressure and increased insulin at exposure above the group safe level.',
    safeLimit: 'Group ADI for glutamates (E620–E625): 30 mg/kg body weight/day, expressed as glutamic acid.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/170712',
  },
  E950: {
    title: 'Acesulfame K', level: 'information',
    effect: 'EFSA’s current assessment concludes the sweetener is safe within the acceptable daily intake.',
    safeLimit: 'ADI: 15 mg/kg body weight/day.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/topics/topic/aspartame',
  },
  E951: {
    title: 'Aspartame', level: 'watch',
    effect: 'People with phenylketonuria (PKU) must avoid or restrict phenylalanine from aspartame. EFSA considers it safe for the general population within the ADI.',
    safeLimit: 'ADI: 40 mg/kg body weight/day. This limit does not apply to people with PKU.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/efsajournal/pub/3496',
  },
  E171: {
    title: 'Titanium dioxide', level: 'high_concern',
    effect: 'EFSA could not rule out genotoxicity after consumption, so it no longer considers titanium dioxide safe as a food additive.',
    safeLimit: 'No acceptable daily intake could be established by EFSA.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive',
  },
  E338: {
    title: 'Phosphoric acid', level: 'watch',
    effect: 'Phosphates contribute to total phosphorus exposure. People with reduced kidney function may need individual clinical advice about phosphorus intake.',
    safeLimit: 'Group ADI for phosphates: 40 mg phosphorus/kg body weight/day. Product labels usually do not disclose the additive amount.',
    sourceName: EFSA, sourceUrl: 'https://www.efsa.europa.eu/en/press/news/190612',
  },
}

export function getIngredientEvidence(idOrName: string | null | undefined): IngredientEvidence | null {
  if (!idOrName) return null
  const normalized = idOrName.toUpperCase().replace(/\s+/g, '')
  const direct = EVIDENCE[normalized]
  if (direct) return { ingredientId: normalized, ...direct }
  const key = Object.keys(EVIDENCE).find((id) => idOrName.toLowerCase().includes(EVIDENCE[id]!.title.toLowerCase()))
  return key ? { ingredientId: key, ...EVIDENCE[key]! } : null
}

export function describeDetectedAdditive(additive: Additive) {
  const evidence = getIngredientEvidence(additive.id) || getIngredientEvidence(additive.name)
  return {
    name: additive.name,
    also_known_as: [additive.eNumber, additive.insCode].filter(Boolean).join(', ') || undefined,
    found_in_product: true,
    concern: evidence?.effect || additive.concern,
    reason: evidence?.effect || additive.concern,
    severity: evidence?.level === 'high_concern' ? 'high' : evidence?.level === 'watch' ? 'medium' : evidence?.level === 'information' ? 'low' : additive.risk === 'high' || additive.risk === 'harmful' ? 'high' : additive.risk === 'moderate' ? 'medium' : 'low',
    scientific_source: evidence?.sourceName || 'NutriScan additive reference',
    source_url: evidence?.sourceUrl || `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(additive.name)}`,
    global_safe_limit: evidence?.safeLimit || 'No verified numerical limit is available from this scan.',
    amount_in_this_product: 'Not disclosed on the product label',
    personalized_safe_limit: '',
    percentage_of_daily_limit: '',
  } as const
}
