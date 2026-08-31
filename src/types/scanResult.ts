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
  also_known_as?: string
  reason: string
  concern?: string
  severity: 'low' | 'medium' | 'high'
  scientific_source?: string
  source_url?: string
  global_safe_limit?: string
  personalized_safe_limit?: string
  amount_in_this_product?: string
  percentage_of_daily_limit?: string
}

export interface AiIngredient {
  ingredient: string
  status: 'safe' | 'concern' | 'harmful'
  concern?: string
  recommendation?: string
}

export interface IngredientWarning {
  ingredient: string
  concern: string
  reason?: string
  severity?: 'low' | 'medium' | 'high'
}

export interface IngredientReportItem {
  name: string
  plainLanguage: string
  status: 'information' | 'watch' | 'high_concern'
  note: string
  evidence: 'label' | 'additive_database'
  sourceName?: string
  sourceUrl?: string
  safeLimit?: string
}

export interface Alternative {
  name: string
  brand: string
  image_url?: string
  health_score: number
  grade?: string
  reason: string
  price?: string
  mrp?: number
  shopping_url?: string
  availability?: string
  nutrition_comparison?: {
    sugar?: { current: number; alternative: number; reduction: string }
    sodium?: { current: number; alternative: number; reduction: string }
    calories?: { current: number; alternative: number; reduction: string }
    protein?: { current: number; alternative: number; increase: string }
  }
}

export interface Analysis {
  health_rating: 'healthy' | 'moderate' | 'unhealthy'
  health_score: number
  confidence?: 'high' | 'medium' | 'low'
  summary: string
  recommendation?: string
  health_score_breakdown?: {
    nutrition_score: number
    ingredient_safety_score: number
    processing_score: number
    overall?: number
  }
  detailed_breakdown?: {
    calories?: string
    protein?: string
    sugar?: string
    sodium?: string
    fat?: string
    fiber?: string
    processing_level?: string
    overall_nutrient_density?: string
  }
  safe_consumption?: {
    amount?: string | null
    frequency?: string
    notes?: string
    personalized_for_user?: string | null
  }
  harmful_ingredients?: HarmfulIngredient[]
  ingredient_warnings?: IngredientWarning[]
  ai_ingredients?: AiIngredient[]
  ingredient_report?: IngredientReportItem[]
  healthier_alternatives?: Alternative[]
  positives?: string[]
  recommendations?: string[]
  personalizedWarnings?: string[]
  long_term_risks?: string[]
  concerns?: string[]
  fssai_compliance?: string
  diabetic_suitability?: string
  bp_suitability?: string
  child_suitability?: string
  pregnancy_suitability?: string
  analyzed_at?: string
  personalized?: boolean
  scoring_method?: string
}

export interface FoodPreferences {
  spice_level?: 'mild' | 'medium' | 'spicy'
  cuisine_preferences?: string[]
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
  age?: number
  gender?: string
  weight_kg?: number
  height_cm?: number
  bmi?: number
  weight_goal?: string
  activity_level?: string
  is_diabetic?: boolean
  has_bp?: boolean
  has_heart_disease?: boolean
  has_cholesterol?: boolean
  is_vegetarian?: boolean
  is_vegan?: boolean
  is_jain?: boolean
  has_thyroid?: boolean
  has_kidney_disease?: boolean
  has_pcod?: boolean
  is_pregnant?: boolean
  is_lactating?: boolean
  ethnicity?: string
  region?: string
  allergies?: string[]
  food_preferences?: FoodPreferences
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
