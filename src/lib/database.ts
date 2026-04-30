// NutriScan - Database helpers for products and additives tables

import { supabaseAdmin } from './supabaseAdmin'

export interface ProductNutrition {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  sugar?: number
  sodium?: number
  fiber?: number
  saturated_fat?: number
}

export interface Product {
  id?: string
  barcode: string
  name: string
  brand?: string | null
  category?: string | null
  country_of_origin?: string | null
  image_url?: string | null
  nutrition?: ProductNutrition
  ingredients_text?: string | null
  additives?: string[]
  allergens?: string[]
  health_score?: number
  health_grade?: string
  nutrition_score?: number
  additive_score?: number
  nova_group?: number
  scan_count?: number
  last_scanned?: string
}

export interface Additive {
  id?: string
  name: string
  ins_code?: string | null
  e_code?: string | null
  risk_level: 'safe' | 'low' | 'medium' | 'high' | 'critical'
  category: 'preservative' | 'color' | 'sweetener' | 'emulsifier' | 'flavor' | 'thickener' | 'antioxidant' | 'acidity' | 'other'
  description?: string | null
  concern?: string | null
  source_org?: string | null
  source_url?: string | null
  global_safe_limit?: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

export async function saveProduct(product: Product): Promise<Product> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .upsert({
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      country_of_origin: product.country_of_origin,
      image_url: product.image_url,
      nutrition: product.nutrition || {},
      ingredients_text: product.ingredients_text,
      additives: product.additives || [],
      allergens: product.allergens || [],
      health_score: product.health_score,
      health_grade: product.health_grade,
      nutrition_score: product.nutrition_score,
      additive_score: product.additive_score,
      nova_group: product.nova_group,
      last_scanned: new Date().toISOString(),
    }, { onConflict: 'barcode' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('barcode', barcode)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function getSimilarProducts(
  category: string,
  minScore: number,
  limit: number = 5
): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('category', category)
    .gt('health_score', minScore)
    .order('health_score', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getTopScannedProducts(limit: number = 10): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('scan_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getRecentlyScannedProducts(limit: number = 10): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('last_scanned', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDITIVES
// ─────────────────────────────────────────────────────────────────────────────

export async function getAdditiveByName(name: string): Promise<Additive | null> {
  const { data, error } = await supabaseAdmin
    .from('additives')
    .select('*')
    .ilike('name', `%${name}%`)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function getAdditivesByRisk(riskLevel: string): Promise<Additive[]> {
  const { data, error } = await supabaseAdmin
    .from('additives')
    .select('*')
    .eq('risk_level', riskLevel)
    .order('name')

  if (error) throw error
  return data || []
}

export async function getHarmfulAdditives(): Promise<Additive[]> {
  const { data, error } = await supabaseAdmin
    .from('additives')
    .select('*')
    .in('risk_level', ['high', 'critical'])
    .order('risk_level', { ascending: false })

  if (error) throw error
  return data || []
}

export async function searchAdditives(query: string): Promise<Additive[]> {
  const { data, error } = await supabaseAdmin
    .from('additives')
    .select('*')
    .or(`name.ilike.%${query}%,ins_code.ilike.%${query}%,e_code.ilike.%${query}%`)
    .limit(20)

  if (error) throw error
  return data || []
}

export async function saveAdditive(additive: Additive): Promise<Additive> {
  const { data, error } = await supabaseAdmin
    .from('additives')
    .upsert({
      name: additive.name,
      ins_code: additive.ins_code,
      e_code: additive.e_code,
      risk_level: additive.risk_level,
      category: additive.category,
      description: additive.description,
      concern: additive.concern,
      source_org: additive.source_org,
      source_url: additive.source_url,
      global_safe_limit: additive.global_safe_limit,
    }, { onConflict: 'name' })
    .select()
    .single()

  if (error) throw error
  return data
}

// ─────────────────────────────────────────────────────────────────────────────
// STATISTICS
// ─────────────────────────────────────────────────────────────────────────────

export async function getDatabaseStats() {
  const [products, additives] = await Promise.all([
    supabaseAdmin.from('products').select('count', { count: 'exact' }),
    supabaseAdmin.from('additives').select('count', { count: 'exact' }),
  ])

  return {
    totalProducts: products.count || 0,
    totalAdditives: additives.count || 0,
  }
}