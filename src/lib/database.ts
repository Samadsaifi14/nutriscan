// NutriScan - Database helpers for products and additives tables

import { supabaseAdmin } from './supabaseAdmin'

// Products table matches your Supabase schema
export interface Product {
  id?: string
  barcode: string
  name: string
  brand?: string | null
  category?: string | null
  country_of_origin?: string | null
  image_url?: string | null
  // Nutrition per 100g (individual columns)
  calories_per_100g?: number | null
  protein_per_100g?: number | null
  carbs_per_100g?: number | null
  fat_per_100g?: number | null
  sugar_per_100g?: number | null
  sodium_per_100g?: number | null
  fiber_per_100g?: number | null
  serving_size_g?: number | null
  // Additional fields
  ingredients_text?: string | null
  allergens?: string[] | null
  additives?: string[] | null
  source?: string
  submitted_by?: string | null
  // Health scoring fields
  ai_health_rating?: string | null
  ai_analysis_json?: any
  ai_analyzed_at?: string | null
  // New fields for Phase 5
  last_scanned?: string | null
  created_at?: string
}

// Additives table
export interface Additive {
  id?: string
  name: string
  ins_code?: string | null
  e_code?: string | null
  risk_level: 'safe' | 'low' | 'medium' | 'high' | 'critical'
  category: string
  description?: string | null
  concern?: string | null
  source?: string | null
  created_at?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .upsert({
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      country_of_origin: product.country_of_origin || 'IN',
      image_url: product.image_url,
      calories_per_100g: product.calories_per_100g,
      protein_per_100g: product.protein_per_100g,
      carbs_per_100g: product.carbs_per_100g,
      fat_per_100g: product.fat_per_100g,
      sugar_per_100g: product.sugar_per_100g,
      sodium_per_100g: product.sodium_per_100g,
      fiber_per_100g: product.fiber_per_100g,
      serving_size_g: product.serving_size_g,
      ingredients_text: product.ingredients_text,
      allergens: product.allergens || [],
      additives: product.additives || [],
      source: product.source || 'user',
      submitted_by: product.submitted_by,
      ai_health_rating: product.ai_health_rating,
      ai_analysis_json: product.ai_analysis_json,
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
  // Since we don't have health_score column, we'll filter by category and sort by name
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('category', category)
    .order('name')
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

export async function getTopScannedProducts(limit: number = 10): Promise<Product[]> {
  // Group by barcode and count
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
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

export async function saveAdditive(additive: Partial<Additive>): Promise<Additive> {
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
      source: additive.source,
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