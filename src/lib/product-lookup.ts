// Multi-layer product lookup with India-first architecture
import { analyzeBarcode, type BarcodeAnalysis } from './barcode-intelligence'
import { createClient } from '@supabase/supabase-js'
import { scoreProduct, type NutritionPer100g } from './health-engine'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface ProductData {
  barcode: string
  name: string
  brand: string | null
  image_url: string | null
  ingredients_text: string | null
  nutrition_per_100g: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number
    sodium?: number
    fiber?: number
  }
  additives: string[]
  nova_group: number
  source: string
}

export interface LookupResult {
  product: ProductData | null
  source: string
  barcodeAnalysis: BarcodeAnalysis
}

export async function lookupProduct(barcode: string): Promise<LookupResult> {
  const analysis = analyzeBarcode(barcode)
  
  // Layer 1: Check our Supabase cache first (fastest)
  const cached = await lookupSupabaseCache(barcode)
  if (cached) {
    return { product: cached, source: 'cache', barcodeAnalysis: analysis }
  }
  
  // Layer 2: Open Food Facts (global)
  const offResult = await lookupOpenFoodFacts(barcode)
  if (offResult) {
    // Cache for next time
    await cacheProduct(offResult)
    return { product: offResult, source: 'openfoodfacts', barcodeAnalysis: analysis }
  }
  
  // Layer 3: UPC Item DB (US products that may ship to India)
  const upcResult = await lookupUPCItemDB(barcode)
  if (upcResult) {
    await cacheProduct(upcResult)
    return { product: upcResult, source: 'upcitemdb', barcodeAnalysis: analysis }
  }
  
  // Layer 4: Indian products - try web search
  if (analysis.isIndian) {
    const webSearchResult = await lookupIndianProductWeb(analysis)
    if (webSearchResult) {
      await cacheProduct(webSearchResult)
      return { product: webSearchResult, source: 'web_search', barcodeAnalysis: analysis }
    }
  }
  
  // Layer 5: Not found - return null
  return { product: null, source: 'not_found', barcodeAnalysis: analysis }
}

// Layer 1: Supabase cache lookup
async function lookupSupabaseCache(barcode: string): Promise<ProductData | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single()
    
    if (error || !data) return null
    
    return {
      barcode: data.barcode,
      name: data.name || data.product_name || 'Unknown',
      brand: data.brand,
      image_url: data.image_url,
      ingredients_text: data.ingredients_text,
      nutrition_per_100g: data.nutrition || {},
      additives: data.additives || [],
      nova_group: data.nova_group || 4,
      source: 'cached',
    }
  } catch (err) {
    return null
  }
}

// Cache product to Supabase
async function cacheProduct(product: ProductData): Promise<void> {
  try {
    await supabase.from('products').upsert({
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      image_url: product.image_url,
      ingredients_text: product.ingredients_text,
      nutrition: product.nutrition_per_100g,
      additives: product.additives,
      nova_group: product.nova_group,
      last_scanned: new Date().toISOString(),
    }, { onConflict: 'barcode' })
  } catch (err) {
    console.error('Cache error:', err)
  }
}

// Layer 2: Open Food Facts
async function lookupOpenFoodFacts(barcode: string): Promise<ProductData | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    
    if (!res.ok) return null
    
    const data = await res.json()
    
    if (data.status !== 1 || !data.product) return null
    
    const p = data.product
    const nutrition = p.nutriments || {}
    const servingSize = parseServingSize(p.serving_size)
    
    const normalizeNutrient = (val: number | undefined) => {
      if (!val) return undefined
      if (servingSize && p.serving_size) {
        return Math.round((val / servingSize) * 100)
      }
      return val
    }
    
    const nutritionPer100g = {
      calories: normalizeNutrient(nutrition['energy-kcal_100g'] || nutrition['energy-kcal']),
      protein: normalizeNutrient(nutrition['proteins_100g'] || nutrition.proteins),
      carbs: normalizeNutrient(nutrition['carbohydrates_100g'] || nutrition.carbohydrates),
      fat: normalizeNutrient(nutrition['fat_100g'] || nutrition.fat),
      sugar: normalizeNutrient(nutrition['sugars_100g'] || nutrition.sugars),
      sodium: normalizeNutrient(nutrition['sodium_100g'] || nutrition.sodium),
      fiber: normalizeNutrient(nutrition['fiber_100g'] || nutrition.fiber),
    }
    
    const additives: string[] = []
    if (p.additives_tags) {
      p.additives_tags.forEach((tag: string) => {
        const name = tag.replace(/^en:/, '').replace(/-/g, ' ')
        if (name && name.length > 2) {
          additives.push(name)
        }
      })
    }
    
    const novaGroup = p.nova_group || p['nova-group'] || 4
    
    return {
      barcode,
      name: p.product_name || p.product_name_en || 'Unknown Product',
      brand: p.brands || null,
      image_url: p.image_url || p.image_small_url || null,
      ingredients_text: p.ingredients_text || p.ingredients_text_en || null,
      nutrition_per_100g: nutritionPer100g,
      additives: additives.slice(0, 20),
      nova_group: typeof novaGroup === 'number' ? novaGroup : 4,
      source: 'openfoodfacts',
    }
  } catch (err) {
    console.error('OFF lookup error:', err)
    return null
  }
}

// Layer 3: UPC Item DB (US products)
async function lookupUPCItemDB(barcode: string): Promise<ProductData | null> {
  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`)
    
    if (!res.ok) return null
    
    const data = await res.json()
    
    if (!data.items || data.items.length === 0) return null
    
    const item = data.items[0]
    
    let nutrition: any = {}
    
    if (item.description) {
      const desc = item.description.toLowerCase()
      
      const energyMatch = desc.match(/energy\s*(\d+)\s*kcal/i)
      if (energyMatch) nutrition.calories = parseInt(energyMatch[1])
      
      const proteinMatch = desc.match(/protein\s*(\d+(?:\.\d+)?)\s*g/i)
      if (proteinMatch) nutrition.protein = parseFloat(proteinMatch[1])
      
      const carbsMatch = desc.match(/carbohydrate[s]?\s*(\d+(?:\.\d+)?)\s*g/i)
      if (carbsMatch) nutrition.carbs = parseFloat(carbsMatch[1])
      
      const fatMatch = desc.match(/total\s*fat\s*(\d+(?:\.\d+)?)\s*g/i)
      if (fatMatch) nutrition.fat = parseFloat(fatMatch[1])
      
      const sugarMatch = desc.match(/sugar[s]?\s*(\d+(?:\.\d+)?)\s*g/i)
      if (sugarMatch) nutrition.sugar = parseFloat(sugarMatch[1])
    }
    
    return {
      barcode,
      name: item.title || 'Unknown Product',
      brand: item.brand || null,
      image_url: item.images?.[0] || null,
      ingredients_text: null,
      nutrition_per_100g: nutrition,
      additives: [],
      nova_group: 4,
      source: 'upcitemdb',
    }
  } catch (err) {
    console.error('UPC lookup error:', err)
    return null
  }
}

// Layer 4: Web search for Indian products
// Uses Tavily API to search Indian e-commerce sites
async function lookupIndianProductWeb(analysis: BarcodeAnalysis): Promise<ProductData | null> {
  const tavilyKey = process.env.TAVILY_API_KEY
  
  if (!tavilyKey) {
    console.log('No Tavily API key - skipping web search')
    return null
  }
  
  try {
    // Search on BigBasket, Blinkit for the product
    const searchQuery = analysis.searchHint
    
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: searchQuery,
        max_results: 3,
        include_answer: true,
        include_raw_content: false,
      }),
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    
    if (!data.results || data.results.length === 0) return null
    
    // Try to extract product info from search results
    // Look for results from bigbasket, blinkit, amazon.in
    const relevantResult = data.results.find((r: any) => 
      r.url?.includes('bigbasket') || 
      r.url?.includes('blinkit') || 
      r.url?.includes('amazon.in')
    )
    
    if (!relevantResult) return null
    
    // Parse the result - we can't get full nutrition from search
    // But we can get brand and basic info
    return {
      barcode: '',
      name: relevantResult.title || analysis.searchHint,
      brand: analysis.brand,
      image_url: null,
      ingredients_text: null,
      nutrition_per_100g: {},
      additives: [],
      nova_group: 4,
      source: 'web_search',
    }
  } catch (err) {
    console.error('Web search error:', err)
    return null
  }
}

function parseServingSize(servingSize: string | number | undefined): number | null {
  if (!servingSize) return null
  
  const str = String(servingSize)
  const match = str.match(/(\d+)/)
  
  if (match) {
    const num = parseInt(match[1]!, 10)
    if (str.toLowerCase().includes('g')) return num
    if (str.toLowerCase().includes('ml')) return num
  }
  
  return null
}

export function scoreOFFProduct(product: ProductData) {
  const nutrition: NutritionPer100g = {
    calories: product.nutrition_per_100g.calories || 0,
    protein: product.nutrition_per_100g.protein || 0,
    carbohydrates: product.nutrition_per_100g.carbs || 0,
    total_fat: product.nutrition_per_100g.fat || 0,
    sugar: product.nutrition_per_100g.sugar || 0,
    sodium: product.nutrition_per_100g.sodium || 0,
  }
  
  const result = scoreProduct(nutrition, product.ingredients_text || '')
  
  return {
    ...product,
    health_score: result.score,
    health_grade: result.grade,
  }
}