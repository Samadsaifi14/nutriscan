export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Product {
  id?: string
  barcode: string
  name: string
  brand?: string | null
  category?: string | null
  country_of_origin?: string | null
  image_url?: string | null
  source?: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    sugar?: number | null
    sodium?: number | null
    fiber?: number | null
  }
  serving_size_g?: number | null
  ingredients_text?: string | null
  allergens: string[]
  additives: string[]
  ai_health_rating?: string | null
  ai_analysis?: any
  created_at?: string
}

export interface UserProfile {
  user_id: string
  email: string
  name?: string | null
  avatar_url?: string | null
  age?: number | null
  gender?: string | null
  weight_kg?: number | null
  height_cm?: number | null
  bmi?: number | null
  activity_level?: string | null
  weight_goal?: string | null
  daily_calorie_goal?: number | null
  is_diabetic: boolean
  has_bp: boolean
  is_vegetarian: boolean
  is_vegan?: boolean
  profile_completed: boolean
  weekly_report_email: boolean
  email_unsubscribed: boolean
}

export interface FoodLog {
  id: string
  user_id: string
  product_name: string
  barcode?: string | null
  quantity_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  sodium_mg?: number | null
  meal_type: MealType
  logged_at: string
}

export interface AnalysisResult {
  health_rating: 'healthy' | 'moderate' | 'unhealthy'
  health_score: number
  health_score_breakdown: {
    nutrition_score: number
    ingredient_safety_score: number
    processing_score: number
    overall: number
  }
  summary: string
  detailed_breakdown: Record<string, string>
  safe_consumption: {
    amount: string
    frequency: string
    notes?: string | null
    personalized_for_user?: string | null
  }
  harmful_ingredients: Array<{
    name: string
    concern: string
    severity: 'high' | 'medium' | 'low'
  }>
  positives: string[]
  long_term_risks: string[]
  healthier_alternatives: Array<{
    name: string
    reason: string
  }>
  analyzed_at: string
  personalized: boolean
}