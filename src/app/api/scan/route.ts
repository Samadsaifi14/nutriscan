import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── GET /api/scan?barcode=<code> ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const raw            = req.nextUrl.searchParams.get('barcode')
  const trimmedBarcode = raw?.trim()

  if (!trimmedBarcode || trimmedBarcode.length < 6) {
    return NextResponse.json({ success: false, error: 'Invalid barcode' }, { status: 400 })
  }

  console.log('Scanning barcode:', trimmedBarcode)

  // ── Layer 1: Supabase cache ───────────────────────────────────────────────
  try {
    const { data: cached } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('barcode', trimmedBarcode)
      .single()

    if (cached?.name) {
      console.log('Cache hit:', cached.name)
      return NextResponse.json({ success: true, source: 'cache', data: formatProduct(cached) })
    }
  } catch {
    // miss — continue to next layer
  }

  // ── Layer 2: Open Food Facts ──────────────────────────────────────────────
  try {
    console.log('Trying Open Food Facts...')
    const offRes = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${trimmedBarcode}.json`,
      { headers: { 'User-Agent': 'HealthOX/1.0 (healthox@example.com)' } }
    )

    if (offRes.ok) {
      const offData = await offRes.json()
      console.log('OFF status:', offData.status)

      if (offData.status === 1 && offData.product?.product_name) {
        const p = offData.product
        const n = p.nutriments || {}

        const product = {
          barcode:           trimmedBarcode,
          name:              p.product_name || p.product_name_en || p.abbreviated_product_name || 'Unknown Product',
          brand:             p.brands || null,
          category:          p.categories || null,
          country_of_origin: p.countries_tags?.[0]?.replace('en:', '') || null,
          image_url:         p.image_front_url || p.image_url || null,
          calories_per_100g: parseNum(n['energy-kcal_100g'] || n['energy-kcal']),
          protein_per_100g:  parseNum(n.proteins_100g  || n.proteins),
          carbs_per_100g:    parseNum(n.carbohydrates_100g || n.carbohydrates),
          fat_per_100g:      parseNum(n.fat_100g || n.fat),
          sugar_per_100g:    parseNum(n.sugars_100g || n.sugars),
          sodium_per_100g:   parseSodium(n.sodium_100g ?? n.sodium, n.salt_100g),
          fiber_per_100g:    parseNum(n.fiber_100g || n.fiber),
          serving_size_g:    parseNum(p.serving_quantity),
          ingredients_text:  p.ingredients_text || null,
          allergens:         parseList(p.allergens_tags),
          additives:         parseList(p.additives_tags),
          source:            'open_food_facts',
        }

        // Cache asynchronously — don't block the response
        cacheProduct(product)

        console.log('OFF hit:', product.name)
        return NextResponse.json({ success: true, source: 'open_food_facts', data: formatProduct(product) })
      }
    }
  } catch (e: unknown) {
    console.log('Open Food Facts failed:', (e as Error).message)
  }

  // ── Layer 3: UPC Item DB (good Indian coverage, free tier) ────────────────
  try {
    console.log('Trying UPC Item DB...')
    const upcRes = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${trimmedBarcode}`,
      { headers: { Accept: 'application/json' } }
    )

    if (upcRes.ok) {
      const upcData = await upcRes.json()
      const item    = upcData.items?.[0]

      if (item?.title) {
        const product = {
          barcode:           trimmedBarcode,
          name:              item.title,
          brand:             item.brand    || null,
          category:          item.category || null,
          country_of_origin: null,
          image_url:         item.images?.[0] || null,
          calories_per_100g: null,
          protein_per_100g:  null,
          carbs_per_100g:    null,
          fat_per_100g:      null,
          sugar_per_100g:    null,
          sodium_per_100g:   null,
          fiber_per_100g:    null,
          serving_size_g:    null,
          ingredients_text:  null,
          allergens:         [] as string[],
          additives:         [] as string[],
          source:            'upc_item_db',
        }

        cacheProduct(product)

        console.log('UPC DB hit:', product.name, '(no nutrition — photo mode recommended)')
        return NextResponse.json({
          success:          true,
          source:           'upc_item_db',
          data:             formatProduct(product),
          nutritionMissing: true,
          tip:              'Product found but nutrition data is unavailable. Use Photo Mode to read the label.',
        })
      }
    }
  } catch (e: unknown) {
    console.log('UPC Item DB failed:', (e as Error).message)
  }

  // ── Layer 4: Not found anywhere ───────────────────────────────────────────
  console.log('Product not found for barcode:', trimmedBarcode)
  return NextResponse.json({
    success: false,
    error:   'PRODUCT_NOT_FOUND',
    barcode: trimmedBarcode,
    message: 'This product is not in our database yet. Use Photo Mode to read the nutrition label directly.',
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseNum(val: unknown): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n * 10) / 10
}

function parseSodium(sodiumVal: unknown, saltVal: unknown): number | null {
  // OFF stores sodium in g/100g — convert to mg
  const s = parseNum(sodiumVal)
  if (s !== null) return Math.round(s * 1000)
  // Fallback: derive from salt (sodium ≈ salt × 0.4)
  const salt = parseNum(saltVal)
  if (salt !== null) return Math.round(salt * 1000 * 0.4)
  return null
}

function parseList(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  return (tags as string[])
    .map(t => t.replace(/^en:/, '').replace(/-/g, ' ').trim())
    .filter(Boolean)
}

function formatProduct(p: Record<string, unknown>) {
  return {
    id:               p.id,
    barcode:          p.barcode,
    name:             p.name             || 'Unknown Product',
    brand:            p.brand            || null,
    category:         p.category         || null,
    country_of_origin: p.country_of_origin || null,
    image_url:        p.image_url        || null,
    source:           p.source           || 'cache',
    nutrition: {
      calories: (p.calories_per_100g as number) ?? 0,
      protein:  (p.protein_per_100g  as number) ?? 0,
      carbs:    (p.carbs_per_100g    as number) ?? 0,
      fat:      (p.fat_per_100g      as number) ?? 0,
      sugar:    (p.sugar_per_100g    as number | null) ?? null,
      sodium:   (p.sodium_per_100g   as number | null) ?? null,
      fiber:    (p.fiber_per_100g    as number | null) ?? null,
    },
    serving_size_g:   p.serving_size_g   || null,
    ingredients_text: p.ingredients_text || null,
    allergens:        (p.allergens  as string[]) || [],
    additives:        (p.additives  as string[]) || [],
    ai_health_rating: p.ai_health_rating || null,
    ai_analysis:      p.ai_analysis_json || null,
  }
}

async function cacheProduct(product: Record<string, unknown>) {
  try {
    await supabaseAdmin.from('products').upsert({
      barcode:           product.barcode,
      name:              product.name,
      brand:             product.brand,
      category:          product.category,
      country_of_origin: product.country_of_origin,
      image_url:         product.image_url,
      calories_per_100g: product.calories_per_100g,
      protein_per_100g:  product.protein_per_100g,
      carbs_per_100g:    product.carbs_per_100g,
      fat_per_100g:      product.fat_per_100g,
      sugar_per_100g:    product.sugar_per_100g,
      sodium_per_100g:   product.sodium_per_100g,
      fiber_per_100g:    product.fiber_per_100g,
      serving_size_g:    product.serving_size_g,
      ingredients_text:  product.ingredients_text,
      allergens:         product.allergens,
      additives:         product.additives,
      source:            product.source,
    }, { onConflict: 'barcode', ignoreDuplicates: false })
    console.log('Product cached:', product.name)
  } catch (e: unknown) {
    console.log('Cache write failed:', (e as Error).message)
  }
}