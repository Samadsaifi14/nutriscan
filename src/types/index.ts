export interface Product {
  id: string
  barcode: string
  name: string
  brand?: string
  category?: string
  country_of_origin?: string
  image_url?: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    sugar?: number
    sodium?: number
    fiber?: number
  }
  serving_size_g?: number
  ingredients_text?: string
  allergens: string[]
  additives: string[]
  source?: string
  ai_health_rating?: string
  ai_analysis?: any
  created_at?: string
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

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