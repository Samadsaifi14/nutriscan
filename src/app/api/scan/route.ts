import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { analyzeBarcode, inferCategory } from '@/lib/barcode-intelligence'
import { requireAuth, enforceRateLimit } from '@/lib/api-auth'
import {
  parseNum, parseSodium, parseList, extractNutrition,
  formatProduct, cacheProduct,
  searchIndianProductWeb,
  estimateProductWithAI,
} from '@/lib/scan-helpers'
import { fillNutritionIfMissing, getCategoryNutrition } from '@/lib/nutrition-helpers'
import { lookupBarcode, computeAnalysisResult } from '@/lib/scan-product'

type Confidence = 'exact' | 'high' | 'estimated' | 'low' | 'none'

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if ('response' in auth) return auth.response

  const rate = await enforceRateLimit(auth.userId, 'scan')
  if ('response' in rate) return rate.response

  const barcode = req.nextUrl.searchParams.get('barcode')

  const trimmedBarcode = barcode?.trim()
  if (!trimmedBarcode || trimmedBarcode.length < 6) {
    return NextResponse.json(
      { success: false, error: 'Invalid barcode', confidence: 'none' as Confidence },
      { status: 400 }
    )
  }

  console.log('Scanning barcode:', trimmedBarcode)

  // Track OFF products that have metadata but no nutrition data
  let offFallback: any = null

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
        confidence: 'exact' as Confidence,
        data: formatProduct(cached),
      })
    }
  } catch (e) {
    console.log('Supabase check failed:', e)
  }

  // Layer 2 — Open Food Facts exact barcode lookup
  try {
    console.log('Trying Open Food Facts...')
    const offRes = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${trimmedBarcode}.json`,
      { headers: { 'User-Agent': 'BioYou/1.0 (BioYou@example.com)' } }
    )

    if (offRes.ok) {
      const offData = await offRes.json()

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
          saturated_fat_per_100g: parseNum(nutriments['saturated-fat_100g'] || nutriments.saturated_fat),
          sugar_per_100g: parseNum(nutriments.sugars_100g || nutriments.sugars),
          sodium_per_100g: parseSodium(nutriments.sodium_100g || nutriments.sodium, nutriments.salt_100g),
          fiber_per_100g: parseNum(nutriments.fiber_100g || nutriments.fiber),
          serving_size_g: parseNum(p.serving_quantity),
          ingredients_text: p.ingredients_text || null,
          allergens: parseList(p.allergens_tags),
          additives: parseList(p.additives_tags),
          source: 'open_food_facts',
        }

        // Check if OFF has actual nutrition data
        const hasNutrition = product.calories_per_100g || product.protein_per_100g || product.carbs_per_100g || product.fat_per_100g

        if (hasNutrition) {
          cacheProduct(product)
          console.log('Found on Open Food Facts:', product.name)
          return NextResponse.json({
            success: true,
            source: 'open_food_facts',
            confidence: 'high' as Confidence,
            data: formatProduct(product),
          })
        }

        // OFF has metadata but no nutrition — try AI estimation with the product name
        console.log('OFF has product but no nutrition data, estimating via AI:', product.name)
        const nameEstimate = await fillNutritionIfMissing(product.name, {})
        if (nameEstimate) {
          console.log('AI nutrition estimated from product name:', product.name)
          return NextResponse.json({
            success: true,
            source: 'open_food_facts_with_ai_nutrition',
            confidence: 'estimated' as Confidence,
            data: {
              ...product,
              source: 'open_food_facts_with_ai_nutrition',
              nutrition: {
                calories:      nameEstimate.calories ?? null,
                protein:       nameEstimate.protein ?? null,
                carbs:         nameEstimate.carbohydrates ?? null,
                fat:           nameEstimate.fat ?? null,
                saturated_fat: nameEstimate.saturated_fat ?? null,
                sugar:         nameEstimate.sugar ?? null,
                sodium:        nameEstimate.sodium ?? null,
                fiber:         nameEstimate.fiber ?? null,
              },
              serving_size_g: product.serving_size_g,
              ingredients_text: product.ingredients_text,
              allergens: product.allergens || [],
              additives: product.additives || [],
            },
          })
        }

        // AI estimation failed — save as fallback for later layers
        console.log('AI name estimation failed, will try other layers:', product.name)
        offFallback = product
      }
    }
  } catch (e) {
    console.log('Open Food Facts failed:', e)
  }

  // Layer 3 — OFF keyword search by brand+category
  try {
    const barcodeAnalysis = analyzeBarcode(trimmedBarcode)
    const searchBrand = barcodeAnalysis.brand
    const searchCategory = barcodeAnalysis.category || (searchBrand ? inferCategory(searchBrand, searchBrand) : null)

    if (searchBrand && searchCategory) {
      console.log(`Trying OFF keyword search: ${searchBrand} ${searchCategory}`)
      const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchBrand + ' ' + searchCategory)}&search_simple=1&action=process&json=1&page_size=5`
      const offSearchRes = await fetch(searchUrl, {
        headers: { 'User-Agent': 'BioYou/1.0 (BioYou@example.com)' },
      })

      if (offSearchRes.ok) {
        const searchData = await offSearchRes.json()
        const products: any[] = searchData.products || []

        if (products.length > 0) {
          const best = products[0]
          const n = best.nutriments || {}

          const product = {
            barcode: trimmedBarcode,
            name: best.product_name || best.product_name_en || `${searchBrand} ${searchCategory}`,
            brand: best.brands || searchBrand,
            category: best.categories || searchCategory,
            country_of_origin: best.countries_tags?.[0]?.replace('en:', '') || null,
            image_url: best.image_front_url || best.image_url || null,
            calories_per_100g: parseNum(n['energy-kcal_100g'] || n['energy-kcal']),
            protein_per_100g: parseNum(n.proteins_100g || n.proteins),
            carbs_per_100g: parseNum(n.carbohydrates_100g || n.carbohydrates),
            fat_per_100g: parseNum(n.fat_100g || n.fat),
            saturated_fat_per_100g: parseNum(n['saturated-fat_100g'] || n.saturated_fat),
            sugar_per_100g: parseNum(n.sugars_100g || n.sugars),
            sodium_per_100g: parseSodium(n.sodium_100g || n.sodium, n.salt_100g),
            fiber_per_100g: parseNum(n.fiber_100g || n.fiber),
            serving_size_g: parseNum(best.serving_quantity),
            ingredients_text: best.ingredients_text || null,
            allergens: parseList(best.allergens_tags),
            additives: parseList(best.additives_tags),
            source: 'open_food_facts_search',
          }

          const formatted3 = formatProduct(product)
          const estimated3 = await fillNutritionIfMissing(formatted3.name, formatted3.nutrition)
          if (estimated3) {
            formatted3.nutrition = {
              calories:      estimated3.calories ?? null,
              protein:       estimated3.protein ?? null,
              carbs:         estimated3.carbohydrates ?? null,
              fat:           estimated3.fat ?? null,
              saturated_fat: estimated3.saturated_fat ?? null,
              sugar:         estimated3.sugar ?? null,
              sodium:        estimated3.sodium ?? null,
              fiber:         estimated3.fiber ?? null,
            }
            formatted3.source = 'open_food_facts_search_with_ai_nutrition'
          }
          cacheProduct({
            ...product,
            calories_per_100g:      formatted3.nutrition.calories,
            protein_per_100g:       formatted3.nutrition.protein,
            carbs_per_100g:         formatted3.nutrition.carbs,
            fat_per_100g:           formatted3.nutrition.fat,
            saturated_fat_per_100g: formatted3.nutrition.saturated_fat,
            sugar_per_100g:         formatted3.nutrition.sugar,
            sodium_per_100g:        formatted3.nutrition.sodium,
            fiber_per_100g:         formatted3.nutrition.fiber,
          })
          console.log('Found via OFF keyword search:', product.name)
          return NextResponse.json({
            success: true,
            source: formatted3.source,
            confidence: 'high' as Confidence,
            data: formatted3,
          })
        }
      }
    }
  } catch (e) {
    console.log('OFF keyword search failed:', e)
  }

  // Layer 4 — UPC Item DB (for US products that may ship to India)
  try {
    console.log('Trying UPC Item DB...')
    const upcRes = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${trimmedBarcode}`)

    if (upcRes.ok) {
      const upcData = await upcRes.json()

      if (upcData.items && upcData.items.length > 0) {
        const item = upcData.items[0]

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
          saturated_fat_per_100g: null,
          sugar_per_100g: nutrition.sugar,
          sodium_per_100g: null,
          fiber_per_100g: null,
          serving_size_g: null,
          ingredients_text: null,
          allergens: [],
          additives: [],
          source: 'upc_item_db',
        }

        const formatted4 = formatProduct(product)
        const estimated4 = await fillNutritionIfMissing(formatted4.name, formatted4.nutrition)
        if (estimated4) {
          formatted4.nutrition = {
            calories:      estimated4.calories ?? null,
            protein:       estimated4.protein ?? null,
            carbs:         estimated4.carbohydrates ?? null,
            fat:           estimated4.fat ?? null,
            saturated_fat: estimated4.saturated_fat ?? null,
            sugar:         estimated4.sugar ?? null,
            sodium:        estimated4.sodium ?? null,
            fiber:         estimated4.fiber ?? null,
          }
          formatted4.source = 'upc_item_db_with_ai_nutrition'
        }
        cacheProduct({
          ...product,
          calories_per_100g:      formatted4.nutrition.calories,
          protein_per_100g:       formatted4.nutrition.protein,
          carbs_per_100g:         formatted4.nutrition.carbs,
          fat_per_100g:           formatted4.nutrition.fat,
          saturated_fat_per_100g: formatted4.nutrition.saturated_fat,
          sugar_per_100g:         formatted4.nutrition.sugar,
          sodium_per_100g:        formatted4.nutrition.sodium,
          fiber_per_100g:         formatted4.nutrition.fiber,
        })
        console.log('Found on UPC Item DB:', product.name)
        return NextResponse.json({
          success: true,
          source: formatted4.source,
          confidence: 'estimated' as Confidence,
          data: formatted4,
        })
      }
    }
  } catch (e) {
    console.log('UPC Item DB failed:', e)
  }

  // Layer 5 — Indian products: detect and try web search
  const analysis = analyzeBarcode(trimmedBarcode)
  if (analysis.isIndian) {
    console.log('Detected Indian barcode, trying web search for:', analysis.searchHint)

    const webResult = await searchIndianProductWeb(analysis.searchHint, analysis.brand)
    if (webResult) {
      const formatted5 = formatProduct(webResult)
      const estimated5 = await fillNutritionIfMissing(formatted5.name, formatted5.nutrition)
      if (estimated5) {
        formatted5.nutrition = {
          calories:      estimated5.calories ?? null,
          protein:       estimated5.protein ?? null,
          carbs:         estimated5.carbohydrates ?? null,
          fat:           estimated5.fat ?? null,
          saturated_fat: estimated5.saturated_fat ?? null,
          sugar:         estimated5.sugar ?? null,
          sodium:        estimated5.sodium ?? null,
          fiber:         estimated5.fiber ?? null,
        }
        formatted5.source = 'web_search_with_ai_nutrition'
      }
      console.log('Found via web search:', webResult.name)
      return NextResponse.json({
        success: true,
        source: formatted5.source,
        confidence: 'estimated' as Confidence,
        data: formatted5,
      })
    }
  }

  // Layer 6 — Check community_products (approved ones)
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
        saturated_fat_per_100g: null,
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
        confidence: 'high' as Confidence,
        data: formatProduct(product),
      })
    }
  } catch (e) {
    console.log('Community products check failed:', e)
  }

  // Layer 7 — Category nutrition estimation (Groq → Gemini → static)
  try {
    const analysis7 = analyzeBarcode(trimmedBarcode)
    const cat = analysis7.category || (analysis7.brand ? inferCategory(analysis7.brand, analysis7.brand) : null)
    const categorySearchName = analysis7.brand || offFallback?.name || trimmedBarcode
    if (cat) {
      console.log(`Trying category nutrition for: ${cat}`)
      const groqResult = await getCategoryNutrition(categorySearchName, cat)
      if (groqResult) {
        const mergedName7 = offFallback?.name || `${cat} product`
        const mergedBrand7 = offFallback?.brand || analysis7.brand
        const mergedImage7 = offFallback?.image_url || null
        await supabaseAdmin.from('products').upsert({
          barcode: trimmedBarcode,
          name: mergedName7,
          brand: mergedBrand7,
          category: cat,
          country_of_origin: analysis7.isIndian ? 'India' : null,
          image_url: null,
          calories: groqResult.calories,
          protein: groqResult.protein,
          fat: groqResult.fat,
          carbohydrates: groqResult.carbohydrates,
          sugar: groqResult.sugar,
          fiber: groqResult.fiber,
          sodium: groqResult.sodium,
          ingredients_text: offFallback?.ingredients_text || null,
          health_score: null,
          health_grade: null,
          nova_group: 4,
          source: 'category_estimated',
          last_updated: new Date().toISOString(),
        }, { onConflict: 'barcode', ignoreDuplicates: false })

        fetch(`${req.nextUrl.origin}/api/enrich`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode: trimmedBarcode, name: mergedName7, brand: mergedBrand7, confidence: 'estimated' }),
        }).catch(() => {})

        console.log('Category estimated:', mergedName7)
        return NextResponse.json({
          success: true,
          source: offFallback ? 'open_food_facts_with_ai_nutrition' : 'category_estimated',
          confidence: 'estimated' as Confidence,
          data: {
            barcode: trimmedBarcode,
            name: mergedName7,
            brand: mergedBrand7,
            category: cat,
            country_of_origin: analysis7.isIndian ? 'India' : null,
            image_url: mergedImage7,
            source: offFallback ? 'open_food_facts_with_ai_nutrition' : 'category_estimated',
            nutrition: {
              calories:      groqResult.calories ?? null,
              protein:       groqResult.protein ?? null,
              carbs:         groqResult.carbohydrates ?? null,
              fat:           groqResult.fat ?? null,
              saturated_fat: groqResult.saturated_fat ?? null,
              sugar:         groqResult.sugar ?? null,
              sodium:        groqResult.sodium ?? null,
              fiber:         groqResult.fiber ?? null,
            },
            serving_size_g: null,
            ingredients_text: offFallback?.ingredients_text || null,
            allergens: offFallback?.allergens || [],
            additives: offFallback?.additives || [],
          },
        })
      }
    }
  } catch (e) {
    console.log('Category nutrition failed:', e)
  }

  // Layer 8 — AI estimation using Gemini
  // This guarantees every barcode returns something useful
  console.log('Trying AI estimation for barcode:', trimmedBarcode)
  try {
    const aiResult = await estimateProductWithAI(trimmedBarcode, analysis.brand, analysis.isIndian)

    if (aiResult) {
      // Cache the AI-estimated product for future lookups
      await supabaseAdmin.from('products').upsert({
        barcode: trimmedBarcode,
        name: aiResult.name,
        brand: aiResult.brand,
        category: aiResult.category,
        country_of_origin: aiResult.isIndian ? 'India' : null,
        image_url: null,
        calories: aiResult.nutrition.calories,
        protein: aiResult.nutrition.protein,
        fat: aiResult.nutrition.fat,
        carbohydrates: aiResult.nutrition.carbs,
        sugar: aiResult.nutrition.sugar,
        fiber: aiResult.nutrition.fiber,
        sodium: aiResult.nutrition.sodium,
        ingredients_text: aiResult.ingredients_text,
        health_score: null,
        health_grade: null,
        nova_group: 4,
        source: 'ai_estimated',
        last_updated: new Date().toISOString(),
      }, { onConflict: 'barcode', ignoreDuplicates: false })

      // Fire background enrichment
      fetch(`${req.nextUrl.origin}/api/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: trimmedBarcode, name: aiResult.name, brand: aiResult.brand, confidence: 'low' }),
      }).catch(() => {})

      const mergedName8 = offFallback?.name || aiResult.name
      const mergedBrand8 = offFallback?.brand || aiResult.brand
      const mergedImage8 = offFallback?.image_url || null
      console.log('AI estimated product:', mergedName8)
      return NextResponse.json({
        success: true,
        source: offFallback ? 'open_food_facts_with_ai_nutrition' : 'ai_estimated',
        confidence: 'low' as Confidence,
        data: {
          barcode: trimmedBarcode,
          name: mergedName8,
          brand: mergedBrand8,
          category: aiResult.category,
          country_of_origin: aiResult.isIndian ? 'India' : null,
          image_url: mergedImage8,
          source: offFallback ? 'open_food_facts_with_ai_nutrition' : 'ai_estimated',
           nutrition: {
            calories: aiResult.nutrition.calories ?? null,
            protein: aiResult.nutrition.protein ?? null,
            carbs: aiResult.nutrition.carbs ?? null,
            fat: aiResult.nutrition.fat ?? null,
            saturated_fat: aiResult.nutrition.saturated_fat ?? null,
            sugar: aiResult.nutrition.sugar ?? null,
            sodium: aiResult.nutrition.sodium ?? null,
            fiber: aiResult.nutrition.fiber ?? null,
          },
          serving_size_g: null,
          ingredients_text: aiResult.ingredients_text || null,
          allergens: offFallback?.allergens || [],
          additives: offFallback?.additives || [],
        },
      })
    }
  } catch (e) {
    console.log('AI estimation failed:', e)
  }

  // Layer 9 — Static keyword-based nutrition estimation (no API key needed, no offFallback gate)
  if (offFallback?.name) {
    const estimated9 = await fillNutritionIfMissing(offFallback.name, {})
    if (estimated9) {
      console.log('[Scan] Using static nutrition for:', offFallback.name)
      const merged = {
        ...offFallback,
        calories_per_100g:      estimated9.calories,
        protein_per_100g:       estimated9.protein,
        carbs_per_100g:         estimated9.carbohydrates,
        fat_per_100g:           estimated9.fat,
        saturated_fat_per_100g: estimated9.saturated_fat,
        sugar_per_100g:         estimated9.sugar,
        sodium_per_100g:        estimated9.sodium,
        fiber_per_100g:         estimated9.fiber,
      }
      cacheProduct(merged)
      return NextResponse.json({
        success: true,
        source: 'open_food_facts_with_static_nutrition',
        confidence: 'estimated' as Confidence,
        data: formatProduct(merged),
      })
    }
  }

  // Final — If OFF had metadata but no AI layer succeeded, return it anyway
  if (offFallback) {
    console.log('Returning OFF metadata without AI nutrition:', offFallback.name)
    cacheProduct(offFallback)
    return NextResponse.json({
      success: true,
      source: 'open_food_facts',
      confidence: 'high' as Confidence,
      data: formatProduct(offFallback),
      warning: 'Product found but nutrition data unavailable. Try contributing the nutrition info.'
    })
  }

  // Final — Not found anywhere
  console.log('Product not found for barcode:', barcode)
  return NextResponse.json({
    success: false,
    error: 'PRODUCT_NOT_FOUND',
    confidence: 'none' as Confidence,
    barcode,
    message: 'This product is not in our database yet. Contribute it and help others!',
  })
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if ('response' in auth) return auth.response

  const rate = await enforceRateLimit(auth.userId, 'scan')
  if ('response' in rate) return rate.response

  try {
    const { barcode } = await req.json()
    if (!barcode || typeof barcode !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing barcode' }, { status: 400 })
    }

    const result = await lookupBarcode(barcode)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        barcode: result.barcode,
        message: result.message,
      }, { status: 404 })
    }

    // Fire background enrichment for estimated/low confidence scans
    if (result.confidence === 'estimated' || result.confidence === 'low') {
      fetch(`${req.nextUrl.origin}/api/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, name: result.product.name, brand: result.product.brand, confidence: result.confidence }),
      }).catch(() => {})
    }

    const product = formatProduct(result.product)
    const { analysis, alternatives } = await computeAnalysisResult(result.product)

    return NextResponse.json({
      success: true,
      product,
      analysis,
      alternatives,
      source: result.source,
      confidence: result.confidence,
    })
  } catch (err: any) {
    console.error('Scan POST error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
