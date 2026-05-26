import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { analyzeBarcode } from '@/lib/barcode-intelligence'
import { scoreProduct, type NutritionPer100g } from '@/lib/health-engine'
import { lookupWithCache } from '@/lib/off-india-import'

export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get('barcode')

  const trimmedBarcode = barcode?.trim()
  if (!trimmedBarcode || trimmedBarcode.length < 6) {
    return NextResponse.json(
      { success: false, error: 'Invalid barcode' },
      { status: 400 }
    )
  }

  console.log('Scanning barcode:', trimmedBarcode)

  // Layer 1 — Check our Supabase cache
  try {
    const { data: cached } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('barcode', trimmedBarcode)
      .single()

    if (cached && cached.name) {
      console.log('Found in our DB:', cached.name)
      return NextResponse.json({
        success: true,
        source: 'cache',
        data: formatProduct(cached),
      })
    }
  } catch (e) {
    console.log('Supabase check failed:', e)
  }

  // Layer 2 — Open Food Facts
  try {
    console.log('Trying Open Food Facts...')
      const offRes = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${trimmedBarcode}.json`,
      { headers: { 'User-Agent': 'HealthOX/1.0 (healthox@example.com)' } }
    )

    if (offRes.ok) {
      const offData = await offRes.json()
      console.log('OFF status:', offData.status)

      if (offData.status === 1 && offData.product) {
        const p = offData.product
        const nutriments = p.nutriments || {}

        const product = {
          barcode,
          name: p.product_name || p.product_name_en || p.abbreviated_product_name || 'Unknown Product',
          brand: p.brands || null,
          category: p.categories || null,
          country_of_origin: p.countries_tags?.[0]?.replace('en:', '') || null,
          image_url: p.image_front_url || p.image_url || null,
          calories_per_100g: parseNum(nutriments['energy-kcal_100g'] || nutriments['energy-kcal']),
          protein_per_100g: parseNum(nutriments.proteins_100g || nutriments.proteins),
          carbs_per_100g: parseNum(nutriments.carbohydrates_100g || nutriments.carbohydrates),
          fat_per_100g: parseNum(nutriments.fat_100g || nutriments.fat),
          sugar_per_100g: parseNum(nutriments.sugars_100g || nutriments.sugars),
          sodium_per_100g: parseSodium(nutriments.sodium_100g || nutriments.sodium, nutriments.salt_100g),
          fiber_per_100g: parseNum(nutriments.fiber_100g || nutriments.fiber),
          serving_size_g: parseNum(p.serving_quantity),
          ingredients_text: p.ingredients_text || null,
          allergens: parseList(p.allergens_tags),
          additives: parseList(p.additives_tags),
          source: 'open_food_facts',
        }

        // Cache it for future
        cacheProduct(product)

        console.log('Found on Open Food Facts:', product.name)
        return NextResponse.json({
          success: true,
          source: 'open_food_facts',
          data: formatProduct(product),
        })
      }
    }
  } catch (e) {
    console.log('Open Food Facts failed:', e)
  }

  // Layer 3 — UPC Item DB (for US products that may ship to India)
  try {
    console.log('Trying UPC Item DB...')
    const upcRes = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${trimmedBarcode}`)
    
    if (upcRes.ok) {
      const upcData = await upcRes.json()
      
      if (upcData.items && upcData.items.length > 0) {
        const item = upcData.items[0]
        
        // Try to extract nutrition from description
        const desc = (item.description || '').toLowerCase()
        const nutrition = extractNutrition(desc)
        
        const product = {
          barcode,
          name: item.title || 'Unknown Product',
          brand: item.brand || null,
          category: null,
          country_of_origin: null,
          image_url: item.images?.[0] || null,
          calories_per_100g: nutrition.calories,
          protein_per_100g: nutrition.protein,
          carbs_per_100g: nutrition.carbs,
          fat_per_100g: nutrition.fat,
          sugar_per_100g: nutrition.sugar,
          sodium_per_100g: null,
          fiber_per_100g: null,
          serving_size_g: null,
          ingredients_text: null,
          allergens: [],
          additives: [],
          source: 'upc_item_db',
        }
        
        cacheProduct(product)
        
        console.log('Found on UPC Item DB:', product.name)
        return NextResponse.json({
          success: true,
          source: 'upc_item_db',
          data: formatProduct(product),
        })
      }
    }
  } catch (e) {
    console.log('UPC Item DB failed:', e)
  }

  // Layer 4 — Indian products: detect and try web search
  const analysis = analyzeBarcode(trimmedBarcode)
  if (analysis.isIndian) {
    console.log('Detected Indian barcode, trying web search for:', analysis.searchHint)
    
    const webResult = await searchIndianProductWeb(analysis.searchHint, analysis.brand)
    if (webResult) {
      cacheProduct(webResult)
      return NextResponse.json({
        success: true,
        source: 'web_search',
        data: formatProduct(webResult),
      })
    }
  }

  // Layer 5 — Check community_products (approved ones)
  try {
    console.log('Trying community_products...')
    const { data: community } = await supabaseAdmin
      .from('community_products')
      .select('*')
      .eq('barcode', trimmedBarcode)
      .eq('status', 'approved')
      .single()

    if (community) {
      const nutrition = community.nutrition as Record<string, any> || {}
      const product = {
        barcode,
        name: community.name || 'Unknown Product',
        brand: community.brand || null,
        category: null,
        country_of_origin: 'India',
        image_url: community.front_label_url || null,
        calories_per_100g: parseFloat(nutrition.calories) || null,
        protein_per_100g: parseFloat(nutrition.protein) || null,
        carbs_per_100g: parseFloat(nutrition.carbs) || null,
        fat_per_100g: parseFloat(nutrition.fat) || null,
        sugar_per_100g: parseFloat(nutrition.sugar) || null,
        sodium_per_100g: parseFloat(nutrition.sodium) || null,
        fiber_per_100g: parseFloat(nutrition.fiber) || null,
        serving_size_g: null,
        ingredients_text: community.ingredients_text || null,
        allergens: [],
        additives: [],
        source: 'community',
      }
      cacheProduct(product)
      console.log('Found in community products:', product.name)
      return NextResponse.json({
        success: true,
        source: 'community',
        data: formatProduct(product),
      })
    }
  } catch (e) {
    console.log('Community products check failed:', e)
  }

  // Layer 6 — Not found anywhere
  console.log('Product not found for barcode:', barcode)
  return NextResponse.json({
    success: false,
    error: 'PRODUCT_NOT_FOUND',
    barcode,
    message: 'This product is not in our database yet. Contribute it and help others!',
  })
}

function parseNum(val: any): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n * 10) / 10
}

function parseSodium(sodiumVal: any, saltVal: any): number | null {
  if (sodiumVal !== undefined && sodiumVal !== null && sodiumVal !== '') {
    const n = parseFloat(String(sodiumVal))
    if (!isNaN(n)) return Math.round(n * 1000) // convert g to mg
  }
  if (saltVal !== undefined && saltVal !== null && saltVal !== '') {
    const salt = parseFloat(String(saltVal))
    if (!isNaN(salt)) return Math.round(salt * 1000 * 0.4) // salt (g) → sodium (mg): multiply by 0.4
  }
  return null
}

function parseList(tags: any): string[] {
  if (!tags || !Array.isArray(tags)) return []
  return tags.map((t: string) => t.replace(/^en:/, '').replace(/-/g, ' ')).filter(Boolean)
}

function extractNutrition(desc: string): {
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  sugar: number | null
} {
  const result: {
    calories: number | null
    protein: number | null
    carbs: number | null
    fat: number | null
    sugar: number | null
  } = { calories: null, protein: null, carbs: null, fat: null, sugar: null }
  
  const energyMatch = desc.match(/energy\s*(\d+)\s*kcal/i)
  if (energyMatch) result.calories = parseInt(energyMatch[1], 10)
  
  const proteinMatch = desc.match(/protein\s*(\d+(?:\.\d+)?)\s*g/i)
  if (proteinMatch) result.protein = parseFloat(proteinMatch[1])
  
  const carbsMatch = desc.match(/carbohydrate[s]?\s*(\d+(?:\.\d+)?)\s*g/i)
  if (carbsMatch) result.carbs = parseFloat(carbsMatch[1])
  
  const fatMatch = desc.match(/total\s*fat\s*(\d+(?:\.\d+)?)\s*g/i)
  if (fatMatch) result.fat = parseFloat(fatMatch[1])
  
  const sugarMatch = desc.match(/sugar[s]?\s*(\d+(?:\.\d+)?)\s*g/i)
  if (sugarMatch) result.sugar = parseFloat(sugarMatch[1])
  
  return result
}

function formatProduct(p: any) {
  return {
    id: p.id,
    barcode: p.barcode,
    name: p.name || 'Unknown Product',
    brand: p.brand || null,
    category: p.category || null,
    country_of_origin: p.country_of_origin || null,
    image_url: p.image_url || null,
    source: p.source || 'cache',
    nutrition: {
      calories: p.calories_per_100g ?? 0,
      protein: p.protein_per_100g ?? 0,
      carbs: p.carbs_per_100g ?? 0,
      fat: p.fat_per_100g ?? 0,
      sugar: p.sugar_per_100g ?? null,
      sodium: p.sodium_per_100g ?? null,
      fiber: p.fiber_per_100g ?? null,
    },
    serving_size_g: p.serving_size_g || null,
    ingredients_text: p.ingredients_text || null,
    allergens: p.allergens || [],
    additives: p.additives || [],
  }
}

async function cacheProduct(product: any) {
  try {
    // Compute health score
    const nutrition: NutritionPer100g = {
      calories: product.calories_per_100g || 0,
      protein: product.protein_per_100g || 0,
      carbohydrates: product.carbs_per_100g || 0,
      total_fat: product.fat_per_100g || 0,
      sugar: product.sugar_per_100g || 0,
      sodium: product.sodium_per_100g || 0,
    }
    
    const result = scoreProduct(nutrition, product.ingredients_text || '')
    
    // Detect harmful additives
    const harmfulAdditives = detectHarmfulAdditives(product.ingredients_text || '')
    
    await supabaseAdmin.from('products').upsert({
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      country_of_origin: product.country_of_origin,
      image_url: product.image_url,
      calories: product.calories_per_100g,
      protein: product.protein_per_100g,
      fat: product.fat_per_100g,
      saturated_fat: null,
      carbohydrates: product.carbs_per_100g,
      sugar: product.sugar_per_100g,
      fiber: product.fiber_per_100g,
      sodium: product.sodium_per_100g,
      ingredients_text: product.ingredients_text,
      health_score: Math.round(result.score),
      health_grade: result.grade,
      nova_group: result.nova_group || 4,
      detected_additives: harmfulAdditives,
      source: product.source,
      last_updated: new Date().toISOString(),
    }, { onConflict: 'barcode', ignoreDuplicates: false })
    console.log('Product cached with health score:', result.score)
  } catch (e) {
    console.log('Cache failed:', e)
  }
}

function detectHarmfulAdditives(ingredientsText: string): string[] {
  const harmful = [
    'sodium benzoate', 'potassium sorbate', 'sodium nitrite', 'sodium nitrate',
    'bha', 'bht', 'tbhq', 'tartrazine', 'sunset yellow', 'allura red',
    'erythrosine', 'aspartame', 'acesulfame', 'sucralose',
    'carrageenan', 'polysorbate', 'msg', 'monosodium glutamate',
    'high fructose corn syrup', 'maltodextrin', 'trans fat', 
    'hydrogenated oil', 'partially hydrogenated',
  ]
  
  if (!ingredientsText) return []
  const lower = ingredientsText.toLowerCase()
  return harmful.filter(additive => lower.includes(additive))
}

async function searchIndianProductWeb(searchHint: string, brand: string | null): Promise<any | null> {
  const tavilyKey = process.env.TAVILY_API_KEY
  
  if (!tavilyKey) {
    console.log('No Tavily API key')
    return null
  }
  
  try {
    // Search for product on Indian e-commerce sites
    const searchQuery = brand 
      ? `${brand} ${searchHint.split(' ').slice(2).join(' ')} nutrition ingredients site:bigbasket.com OR site:blinkit.com`
      : `${searchHint} nutrition ingredients site:bigbasket.com OR site:blinkit.com`
    
    console.log('Tavily search query:', searchQuery)
    
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: searchQuery,
        max_results: 5,
        include_answer: true,
        include_raw_content: false,
      }),
    })
    
    if (!response.ok) {
      console.log('Tavily API error:', response.status)
      return null
    }
    
    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
      console.log('No web search results')
      return null
    }
    
    // Try to find a relevant result from Indian e-commerce
    const relevantResult = data.results.find((r: any) => 
      r.url?.includes('bigbasket') || 
      r.url?.includes('blinkit') ||
      r.url?.includes('amazon.in')
    )
    
    if (relevantResult) {
      console.log('Found web result:', relevantResult.title)
      
      // We can only get basic info from search - not full nutrition
      // The user will need to use photo mode for exact nutrition
      return {
        barcode: '',
        name: relevantResult.title || searchHint,
        brand: brand,
        category: null,
        country_of_origin: 'India',
        image_url: null,
        calories_per_100g: null,
        protein_per_100g: null,
        carbs_per_100g: null,
        fat_per_100g: null,
        sugar_per_100g: null,
        sodium_per_100g: null,
        fiber_per_100g: null,
        serving_size_g: null,
        ingredients_text: null,
        allergens: [],
        additives: [],
        source: 'web_search',
        web_url: relevantResult.url,
      }
    }
    
    return null
  } catch (err) {
    console.log('Web search error:', err)
    return null
  }
}