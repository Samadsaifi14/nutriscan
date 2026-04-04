import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get('barcode')

  if (!barcode || barcode.trim().length < 6) {
    return NextResponse.json(
      { success: false, error: 'Invalid barcode' },
      { status: 400 }
    )
  }

  console.log('Scanning barcode:', barcode)

  // Layer 1 — Check our Supabase cache
  try {
    const { data: cached } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('barcode', barcode)
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
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
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

  // Layer 3 — Not found anywhere
  console.log('Product not found for barcode:', barcode)
  return NextResponse.json({
    success: false,
    error: 'PRODUCT_NOT_FOUND',
    barcode,
    message: 'This product is not in our database yet. Use photo mode to read the nutrition label directly.',
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
    if (!isNaN(salt)) return Math.round(salt * 400) // salt * 0.4 = sodium, in mg
  }
  return null
}

function parseList(tags: any): string[] {
  if (!tags || !Array.isArray(tags)) return []
  return tags.map((t: string) => t.replace(/^en:/, '').replace(/-/g, ' ')).filter(Boolean)
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
    await supabaseAdmin.from('products').upsert({
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      country_of_origin: product.country_of_origin,
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
      allergens: product.allergens,
      additives: product.additives,
      source: product.source,
    }, { onConflict: 'barcode', ignoreDuplicates: false })
    console.log('Product cached successfully')
  } catch (e) {
    console.log('Cache failed:', e)
  }
}