export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  saturated_fat?: number
  sugar?: number
  sodium?: number
  fiber?: number
}

export interface Product {
  barcode: string
  name: string
  brand: string
  category: string
  country_of_origin?: string
  image_url?: string
  source: string
  nutrition: Nutrition
  serving_size_g?: number
  ingredients_text?: string
  allergens: string[]
  additives: string[]
}

export interface HarmfulIngredient {
  name: string
  reason: string
  severity: 'low' | 'medium' | 'high'
}

export interface Alternative {
  name: string
  brand: string
  image_url?: string
  health_score: number
  reason: string
}

export interface Analysis {
  health_rating: 'healthy' | 'moderate' | 'unhealthy'
  health_score: number
  confidence?: 'high' | 'medium' | 'low'
  summary: string
  health_score_breakdown?: {
    nutrition_score: number
    ingredient_safety_score: number
    processing_score: number
  }
  harmful_ingredients?: HarmfulIngredient[]
  healthier_alternatives?: Alternative[]
  positives?: string[]
  recommendations?: string[]
  personalizedWarnings?: string[]
}

export interface ScanResultPayload {
  version: 1
  product: Product
  analysis: Analysis
  quantity: number
  timestamp: string
  alternatives?: Alternative[]
}

export interface UserProfile {
  user_id: string
  email: string
  name?: string
  weight_kg?: number
  height_cm?: number
  bmi?: number
  is_diabetic?: boolean
  has_bp?: boolean
  is_vegetarian?: boolean
  is_vegan?: boolean
}

export function writeScanResult(payload: Omit<ScanResultPayload, 'version' | 'timestamp'>) {
  const data: ScanResultPayload = { ...payload, version: 1, timestamp: new Date().toISOString() }
  try {
    localStorage.setItem('hox_scan_result_v1', JSON.stringify(data))
    sessionStorage.setItem('hox_scan_result_v1', JSON.stringify(data))
  } catch {
    /* storage full or unavailable */
  }
}

export function readScanResult(): ScanResultPayload | null {
  try {
    const raw = sessionStorage.getItem('hox_scan_result_v1') ?? localStorage.getItem('hox_scan_result_v1')
    if (!raw) return null
    return JSON.parse(raw) as ScanResultPayload
  } catch {
    return null
  }
}
