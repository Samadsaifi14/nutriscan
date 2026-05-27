import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { scoreProduct, type NutritionPer100g } from '@/lib/health-engine'

// Background enrichment pipeline for low-confidence products.
// Called fire-and-forget after AI estimation or partial data returns.

async function tryOpenFoodFacts(barcode: string): Promise<any | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { headers: { 'User-Agent': 'HealthOX/1.0 (enrichment)' }, signal: AbortSignal.timeout(10000) }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (data.status !== 1 || !data.product) return null

    const p = data.product
    const n = p.nutriments || {}
    return {
      name: p.product_name || p.product_name_en || null,
      brand: p.brands || null,
      category: p.categories || null,
      image_url: p.image_front_url || p.image_url || null,
      calories: parseNum(n['energy-kcal_100g'] || n['energy-kcal']),
      protein: parseNum(n.proteins_100g || n.proteins),
      carbs: parseNum(n.carbohydrates_100g || n.carbohydrates),
      fat: parseNum(n.fat_100g || n.fat),
      sugar: parseNum(n.sugars_100g || n.sugars),
      sodium: parseSodium(n.sodium_100g || n.sodium, n.salt_100g),
      fiber: parseNum(n.fiber_100g || n.fiber),
      ingredients_text: p.ingredients_text || null,
      source: 'open_food_facts',
    }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { barcode, name, brand, confidence } = await req.json()

    if (!barcode) {
      return NextResponse.json({ error: 'Missing barcode' }, { status: 400 })
    }

    console.log(`🔍 Enriching: ${barcode} (${name || 'unknown'}, confidence: ${confidence})`)

    let enrichedData: any = null

    // Try Open Food Facts first (sometimes data appears after initial lookup)
    const offData = await tryOpenFoodFacts(barcode)
    if (offData && offData.name && offData.calories) {
      enrichedData = offData
      console.log(`✅ Enriched from OFF: ${offData.name}`)
    }

    if (enrichedData) {
      // Compute health score
      const nutrition: NutritionPer100g = {
        calories: enrichedData.calories || 0,
        protein: enrichedData.protein || 0,
        carbohydrates: enrichedData.carbs || 0,
        total_fat: enrichedData.fat || 0,
        sugar: enrichedData.sugar || 0,
        sodium: enrichedData.sodium || 0,
      }
      const scored = scoreProduct(nutrition, enrichedData.ingredients_text || '')

      // Update products table with enriched data
      await supabaseAdmin.from('products').upsert({
        barcode,
        name: enrichedData.name,
        brand: enrichedData.brand,
        category: enrichedData.category,
        country_of_origin: barcode.startsWith('890') ? 'India' : null,
        image_url: enrichedData.image_url,
        calories: enrichedData.calories,
        protein: enrichedData.protein,
        fat: enrichedData.fat,
        carbohydrates: enrichedData.carbs,
        sugar: enrichedData.sugar,
        fiber: enrichedData.fiber,
        sodium: enrichedData.sodium,
        ingredients_text: enrichedData.ingredients_text,
        health_score: Math.round(scored.score),
        health_grade: scored.grade,
        nova_group: scored.nova_group || 4,
        source: enrichedData.source,
        last_updated: new Date().toISOString(),
      }, { onConflict: 'barcode', ignoreDuplicates: false })

      console.log(`✅ Enriched product ${barcode} updated with score ${scored.score}/10`)
    } else {
      console.log(`❌ Could not enrich ${barcode} — no additional data found`)
    }

    return NextResponse.json({ success: true, enriched: !!enrichedData })
  } catch (err: any) {
    console.error('Enrich error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

function parseNum(val: any): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n * 10) / 10
}

function parseSodium(sodiumVal: any, saltVal: any): number | null {
  if (sodiumVal !== undefined && sodiumVal !== null && sodiumVal !== '') {
    const n = parseFloat(String(sodiumVal))
    if (!isNaN(n)) return Math.round(n * 1000)
  }
  if (saltVal !== undefined && saltVal !== null && saltVal !== '') {
    const salt = parseFloat(String(saltVal))
    if (!isNaN(salt)) return Math.round(salt * 1000 * 0.4)
  }
  return null
}
