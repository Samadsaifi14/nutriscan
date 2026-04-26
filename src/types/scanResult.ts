// src/types/scanResult.ts

export interface Nutrition {
  calories: number
  protein:  number
  carbs:    number
  fat:      number
  sugar?:   number | null
  sodium?:  number | null
  fiber?:   number | null
}

export interface PhotoExtras {
  mrp?:              number | null
  fssai?:            string | null
  net_weight?:       number | null
  health_claims?:    string[] | null
  certifications?:   string[] | null
  variant?:          string | null
  confidence?:       string | null
  image_quality?:    string | null
  what_was_visible?: string | null
}

export interface Product {
  barcode?:           string
  name:               string
  brand?:             string | null
  category?:          string | null
  country_of_origin?: string | null
  image_url?:         string | null
  source?:            string
  nutrition:          Nutrition
  serving_size_g?:    number | null
  ingredients_text?:  string | null
  allergens?:         string[]
  additives?:         string[]
  _photo_extras?:     PhotoExtras
}

export interface HarmfulIngredient {
  name:                       string
  also_known_as?:             string[]
  found_in_product?:          boolean
  concern:                    string
  severity:                   'high' | 'medium' | 'low'
  scientific_source?:         string
  source_url?:                string
  global_safe_limit?:         string
  amount_in_this_product?:    string
  personalized_safe_limit?:   string
  percentage_of_daily_limit?: string
}

export interface IngredientWarning {
  ingredient: string
  concern:    string
  severity:   'high' | 'medium' | 'low'
}

export interface Alternative {
  name:          string
  reason?:       string
  availability?: string
  type?:         string
}

export interface Analysis {
  health_rating:    'healthy' | 'moderate' | 'unhealthy'
  health_score:     number
  confidence?:      'high' | 'medium' | 'low'
  summary:          string
  personalized?:    boolean
  analyzed_at:      string
  health_score_breakdown?: {
    nutrition_score:         number
    ingredient_safety_score: number
    processing_score:        number
    overall?:                number
  }
  safe_consumption?: {
    amount?:                string
    frequency?:             string
    notes?:                 string
    personalized_for_user?: string
  }
  harmful_ingredients?:    HarmfulIngredient[]
  ingredient_warnings?:    IngredientWarning[]
  long_term_risks?:        string[]
  positives?:              string[]
  healthier_alternatives?: Alternative[]
  detailed_breakdown?:     Record<string, string>
  diabetic_suitability?:   string
  bp_suitability?:         string
  child_suitability?:      string
  pregnancy_suitability?:  string
  fssai_compliance?:       string
  unreadable_fields?:      string[]
}

// Payload stored after scan
export interface ScanResultPayload {
  version:   1
  product:   Product
  analysis:  Analysis
  quantity:  number
  timestamp: string
}

export const SCAN_RESULT_KEY = 'hox_scan_result_v1'

// Use localStorage so data persists across page navigations on mobile
export function writeScanResult(payload: Omit<ScanResultPayload, 'version' | 'timestamp'>) {
  const full: ScanResultPayload = {
    version:   1,
    timestamp: new Date().toISOString(),
    ...payload,
  }
  try {
    localStorage.setItem(SCAN_RESULT_KEY, JSON.stringify(full))
  } catch {
    // localStorage full or unavailable — fallback to sessionStorage
    try {
      sessionStorage.setItem(SCAN_RESULT_KEY, JSON.stringify(full))
    } catch {
      // both unavailable — navigation will show empty state
    }
  }
}

export function readScanResult(): ScanResultPayload | null {
  try {
    // Try localStorage first
    let raw = localStorage.getItem(SCAN_RESULT_KEY)
    // Fallback to sessionStorage
    if (!raw) raw = sessionStorage.getItem(SCAN_RESULT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ScanResultPayload
    if (parsed.version !== 1) return null
    if (!parsed.product || !parsed.analysis) return null
    return parsed
  } catch {
    return null
  }
}