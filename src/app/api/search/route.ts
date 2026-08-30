import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { estimateHealthScore, transformProductToCard } from '@/lib/frontend-transform'
import { escapeIlike } from '@/lib/utils'
import { enforceRateLimit } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OFF_FIELDS = [
  'code', 'product_name', 'brands', 'image_front_small_url', 'image_front_url',
  'nutriments', 'ingredients_text', 'categories',
].join(',')

function numberOrUndefined(value: unknown): number | undefined {
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) && number >= 0 ? number : undefined
}

function transformOpenFoodFactsProduct(item: any) {
  const n = item?.nutriments || {}
  const sodiumGrams = numberOrUndefined(n.sodium_100g)
  const nutrition = {
    calories: numberOrUndefined(n['energy-kcal_100g']),
    protein: numberOrUndefined(n.proteins_100g),
    carbohydrates: numberOrUndefined(n.carbohydrates_100g),
    total_fat: numberOrUndefined(n.fat_100g),
    saturated_fat: numberOrUndefined(n['saturated-fat_100g']),
    sugar: numberOrUndefined(n.sugars_100g),
    sodium: sodiumGrams !== undefined ? sodiumGrams * 1000 : undefined,
    fiber: numberOrUndefined(n.fiber_100g),
  }
  const healthScore = estimateHealthScore(nutrition) ?? 5
  return transformProductToCard({
    barcode: String(item?.code || ''),
    name: item?.product_name || 'Unnamed product',
    brand: item?.brands || '',
    image_url: item?.image_front_small_url || item?.image_front_url || null,
    health_score: healthScore,
  })
}

export async function GET(req: NextRequest) {
  const rate = await enforceRateLimit('anonymous', 'search', req)
  if ('response' in rate) return rate.response

  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ success: false, error: 'Enter at least 2 characters.' }, { status: 400 })
  }
  if (q.length > 80) {
    return NextResponse.json({ success: false, error: 'Search is too long.' }, { status: 400 })
  }

  const safe = escapeIlike(q)
  const pattern = `%${safe}%`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const dbPromise = supabaseAdmin
      .from('products')
      .select('barcode, name, brand, image_url, health_score')
      .or(`name.ilike.${pattern},brand.ilike.${pattern}`)
      .limit(15)
      .abortSignal(controller.signal)

    const offUrl = new URL('https://world.openfoodfacts.org/cgi/search.pl')
    offUrl.searchParams.set('search_terms', q)
    offUrl.searchParams.set('search_simple', '1')
    offUrl.searchParams.set('action', 'process')
    offUrl.searchParams.set('json', '1')
    offUrl.searchParams.set('page_size', '15')
    offUrl.searchParams.set('fields', OFF_FIELDS)
    const offPromise = fetch(offUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'NutriScan/1.0 (product research; contact via repository)' },
      next: { revalidate: 3600 },
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Open Food Facts returned ${response.status}`)
      return response.json()
    })

    const [dbResult, offResult] = await Promise.allSettled([dbPromise, offPromise])
    const databaseProducts = dbResult.status === 'fulfilled'
      ? (dbResult.value.data || []).map((product: any) => transformProductToCard(product))
      : []
    const offProducts = offResult.status === 'fulfilled'
      ? (offResult.value.products || []).filter((product: any) => product?.code && product?.product_name).map(transformOpenFoodFactsProduct)
      : []

    const seen = new Set<string>()
    const products = [...databaseProducts, ...offProducts].filter((item) => {
      const barcode = item.product.barcode
      if (!barcode || seen.has(barcode)) return false
      seen.add(barcode)
      return true
    }).slice(0, 20)

    return NextResponse.json({
      success: true,
      products,
      sources: { localDatabase: dbResult.status === 'fulfilled', openFoodFacts: offResult.status === 'fulfilled' },
      partial: dbResult.status === 'rejected' || offResult.status === 'rejected',
    }, { headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=300' } })
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json({ success: false, error: 'Search is temporarily unavailable. Please try again.' }, { status: 503 })
  } finally {
    clearTimeout(timeoutId)
  }
}
