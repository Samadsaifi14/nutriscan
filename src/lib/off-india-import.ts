// lib/off-india-import.ts
// Import Open Food Facts data and pre-compute health scores
import { createClient } from '@supabase/supabase-js'
import { scoreProduct, type NutritionPer100g } from './health-engine'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch from Open Food Facts
export async function fetchFromOFF(barcode: string): Promise<any | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { headers: { 'User-Agent': 'BioYou/1.0 (contact@bioyou.app)' } }
    )
    
    if (!res.ok) return null
    
    const data = await res.json()
    
    if (data.status !== 1 || !data.product) return null
    
    const p = data.product
    const nutriments = p.nutriments || {}
    
    return {
      barcode,
      name: p.product_name || p.product_name_en || 'Unknown',
      brand: p.brands || null,
      category: p.categories || null,
      calories: normalizeNum(nutriments['energy-kcal_100g'] || nutriments['energy-kcal']),
      protein: normalizeNum(nutriments.proteins_100g || nutriments.proteins),
      fat: normalizeNum(nutriments.fat_100g || nutriments.fat),
      saturated_fat: normalizeNum(nutriments['saturated-fat_100g'] || nutriments['saturated-fat']),
      carbohydrates: normalizeNum(nutriments.carbohydrates_100g || nutriments.carbohydrates),
      sugar: normalizeNum(nutriments.sugars_100g || nutriments.sugars),
      fiber: normalizeNum(nutriments.fiber_100g || nutriments.fiber),
      sodium: normalizeNum(nutriments.sodium_100g || nutriments.sodium),
      ingredients_text: p.ingredients_text || p.ingredients_text_en || null,
      nova_group: p.nova_group || p['nova-group'] || 4,
      image_url: p.image_front_url || p.image_url || null,
      source: 'open_food_facts',
    }
  } catch (err) {
    console.error('OFF fetch error:', err)
    return null
  }
}

function normalizeNum(val: any): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n * 10) / 10
}

// Pre-compute health score and detect additives/ingredients
function computeHealthScore(product: any) {
  const nutrition: NutritionPer100g = {
    calories: product.calories || 0,
    protein: product.protein || 0,
    carbohydrates: product.carbohydrates || 0,
    total_fat: product.fat || 0,
    sugar: product.sugar || 0,
    sodium: product.sodium || 0,
  }
  
  const result = scoreProduct(nutrition, product.ingredients_text || '')
  
  // Detect harmful additives from ingredients text
  const harmfulAdditives = detectHarmfulAdditives(product.ingredients_text || '')
  
  // Detect allergens
  const allergens = detectAllergens(product.ingredients_text || '')
  
  return {
    health_score: Math.round(result.score),
    health_grade: result.grade,
    nova_group: product.nova_group,
    detected_additives: harmfulAdditives,
    detected_allergens: allergens,
  }
}

function detectHarmfulAdditives(ingredientsText: string): string[] {
  const harmful = [
    'sodium benzoate', 'potassium sorbate', 'sodium nitrite', 'sodium nitrate',
    'bha', 'bht', 'tbhq', 'tartrazine', 'sunset yellow', 'allura red',
    'erythrosine', 'carmine', 'aspartame', 'acesulfame', 'sucralose',
    'carrageenan', 'polysorbate', 'msg', 'monosodium glutamate',
    'high fructose corn syrup', 'maltodextrin', 'trans fat', 
    'hydrogenated oil', 'partially hydrogenated',
  ]
  
  if (!ingredientsText) return []
  
  const lower = ingredientsText.toLowerCase()
  return harmful.filter(additive => lower.includes(additive))
}

function detectAllergens(ingredientsText: string): string[] {
  const allergens = ['milk', 'dairy', 'lactose', 'wheat', 'gluten', 'soy', 'soya', 
    'peanut', 'tree nut', 'almond', 'cashew', 'sesame', 'egg', 'fish', 'shellfish']
  
  if (!ingredientsText) return []
  
  const lower = ingredientsText.toLowerCase()
  return allergens.filter(allergen => lower.includes(allergen))
}

// Save to Supabase with pre-computed health score
export async function saveProductToSupabase(barcode: string, productData: any): Promise<boolean> {
  try {
    const healthData = computeHealthScore(productData)
    
    const { error } = await supabase.from('products').upsert({
      barcode,
      name: productData.name,
      brand: productData.brand,
      category: productData.category,
      calories: productData.calories,
      protein: productData.protein,
      fat: productData.fat,
      saturated_fat: productData.saturated_fat,
      carbohydrates: productData.carbohydrates,
      sugar: productData.sugar,
      fiber: productData.fiber,
      sodium: productData.sodium,
      ingredients_text: productData.ingredients_text,
      ...healthData,
      image_url: productData.image_url,
      source: productData.source,
      last_updated: new Date().toISOString(),
    }, { onConflict: 'barcode' })
    
    if (error) {
      console.error('Save error:', error)
      return false
    }
    
    return true
  } catch (err) {
    console.error('Save exception:', err)
    return false
  }
}

// Main lookup: Check cache first, then OFF, then save with health score
export async function lookupWithCache(barcode: string): Promise<any | null> {
  // 1. Check cache
  const { data: cached } = await supabase
    .from('products')
    .select('*')
    .eq('barcode', barcode)
    .single()
  
  if (cached) {
    // Update scan count
    await supabase.from('products').update({ 
      scan_count: (cached.scan_count || 0) + 1 
    }).eq('barcode', barcode)
    
    return { ...cached, source: 'cache' }
  }
  
  // 2. Fetch from OFF
  const offProduct = await fetchFromOFF(barcode)
  if (!offProduct) return null
  
  // 3. Save to cache with health score
  await saveProductToSupabase(barcode, offProduct)
  
  // 4. Return with computed scores
  const healthData = computeHealthScore(offProduct)
  
  return {
    ...offProduct,
    ...healthData,
    source: 'open_food_facts',
  }
}

// Batch import for seeding (call from API or script)
export async function seedProductsFromOFF(barcodes: string[]): Promise<{
  imported: number
  failed: number
}> {
  let imported = 0
  let failed = 0
  
  for (const barcode of barcodes) {
    try {
      const product = await fetchFromOFF(barcode)
      if (product) {
        await saveProductToSupabase(barcode, product)
        imported++
      } else {
        failed++
      }
    } catch (e) {
      failed++
    }
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 200))
  }
  
  return { imported, failed }
}