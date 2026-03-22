import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get('barcode')

  if (!barcode) {
    return NextResponse.json({ success: false, error: 'No barcode' }, { status: 400 })
  }

  console.log('Scanning barcode:', barcode)

  try {
    const { data: cached } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single()

    if (cached) {
      console.log('Found in our DB')
      return NextResponse.json({ success: true, data: normaliseSupabase(cached), source: 'our_db' })
    }
  } catch (e) {
    console.log('Supabase check failed:', e)
  }

  console.log('Trying Open Food Facts...')
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      {
        headers: { 'User-Agent': 'NutriScan/1.0' },
        signal: AbortSignal.timeout(8000)
      }
    )
    const json = await res.json()
    console.log('OFF product status:', json.status)

    if (json.status === 1 && json.product) {
      console.log('Found on Open Food Facts:', json.product.product_name)
      const product = normaliseOFF(barcode, json.product)
      await cacheProduct(product, 'off')
      return NextResponse.json({ success: true, data: product, source: 'open_food_facts' })
    }
  } catch (e) {
    console.log('Open Food Facts error:', e)
  }

  if (process.env.BARCODE_LOOKUP_API_KEY) {
    try {
      const res = await fetch(
        `https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=${process.env.BARCODE_LOOKUP_API_KEY}`,
        { signal: AbortSignal.timeout(8000) }
      )
      const json = await res.json()
      if (json.products?.length > 0) {
        const product = normaliseBarcodeLookup(barcode, json.products[0])
        await cacheProduct(product, 'barcodelookup')
        return NextResponse.json({ success: true, data: product, source: 'barcode_lookup' })
      }
    } catch (e) {
      console.log('Barcode Lookup error:', e)
    }
  }

  console.log('Product not found anywhere')
  return NextResponse.json(
    { success: false, error: 'PRODUCT_NOT_FOUND', barcode },
    { status: 404 }
  )
}

function normaliseOFF(barcode: string, p: any) {
  const n = p.nutriments || {}
  return {
    id: '', barcode,
    name: p.product_name || p.product_name_en || 'Unknown Product',
    brand: p.brands,
    category: p.categories?.split(',')[0]?.trim(),
    country_of_origin: p.countries_tags?.includes('en:india') ? 'IN' : 'GLOBAL',
    image_url: p.image_url,
    nutrition: {
      calories: n['energy-kcal_100g'] || 0,
      protein: n.proteins_100g || 0,
      carbs: n.carbohydrates_100g || 0,
      fat: n.fat_100g || 0,
      sugar: n.sugars_100g,
      sodium: n.sodium_100g ? n.sodium_100g * 1000 : undefined,
      fiber: n.fiber_100g,
    },
    serving_size_g: p.serving_size ? parseFloat(p.serving_size) : undefined,
    ingredients_text: p.ingredients_text_en || p.ingredients_text,
    allergens: p.allergens_tags?.map((a: string) => a.replace('en:', '')) || [],
    additives: p.additives_tags?.map((a: string) => a.replace('en:', '').toUpperCase()) || [],
    source: 'off',
    created_at: new Date().toISOString(),
  }
}

function normaliseBarcodeLookup(barcode: string, p: any) {
  return {
    id: '', barcode,
    name: p.title || 'Unknown',
    brand: p.brand,
    category: p.category,
    country_of_origin: 'IN',
    image_url: p.images?.[0],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    ingredients_text: p.ingredients,
    allergens: [], additives: [],
    source: 'barcodelookup',
    created_at: new Date().toISOString(),
  }
}

function normaliseSupabase(p: any) {
  return {
    id: p.id, barcode: p.barcode, name: p.name, brand: p.brand,
    category: p.category, country_of_origin: p.country_of_origin,
    image_url: p.image_url,
    nutrition: {
      calories: p.calories_per_100g, protein: p.protein_per_100g,
      carbs: p.carbs_per_100g, fat: p.fat_per_100g,
      sugar: p.sugar_per_100g, sodium: p.sodium_per_100g,
    },
    serving_size_g: p.serving_size_g,
    ingredients_text: p.ingredients_text,
    allergens: p.allergens || [],
    additives: p.additives || [],
    source: p.source,
    created_at: p.created_at,
  }
}

async function cacheProduct(product: any, source: string) {
  const n = product.nutrition
  try {
    await supabaseAdmin.from('products').upsert({
      barcode: product.barcode, name: product.name, brand: product.brand,
      category: product.category, country_of_origin: product.country_of_origin,
      image_url: product.image_url,
      calories_per_100g: n.calories, protein_per_100g: n.protein,
      carbs_per_100g: n.carbs, fat_per_100g: n.fat,
      sugar_per_100g: n.sugar, sodium_per_100g: n.sodium,
      ingredients_text: product.ingredients_text,
      allergens: product.allergens, additives: product.additives,
      source,
    }, { onConflict: 'barcode' })
    console.log('Product cached successfully')
  } catch (e) {
    console.log('Cache failed:', e)
  }
}
