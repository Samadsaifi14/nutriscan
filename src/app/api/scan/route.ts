import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { analyzeBarcode, inferCategory } from '@/lib/barcode-intelligence'
import { requireAuth, enforceRateLimit } from '@/lib/api-auth'
import {
  parseNum, parseSodium, parseList, extractNutrition,
  formatProduct, cacheProduct,
  searchIndianProductWeb,
  getCategoryNutrition, estimateProductWithAI, type AIEstimate,
} from '@/lib/scan-helpers'

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

        // Cache it for future
        cacheProduct(product)

        console.log('Found on Open Food Facts:', product.name)
        return NextResponse.json({
          success: true,
          source: 'open_food_facts',
          confidence: 'high' as Confidence,
          data: formatProduct(product),
        })
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

          cacheProduct(product)
          console.log('Found via OFF keyword search:', product.name)
          return NextResponse.json({
            success: true,
            source: 'open_food_facts_search',
            confidence: 'high' as Confidence,
            data: formatProduct(product),
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

        cacheProduct(product)

        console.log('Found on UPC Item DB:', product.name)
        return NextResponse.json({
          success: true,
          source: 'upc_item_db',
          confidence: 'estimated' as Confidence,
          data: formatProduct(product),
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
      cacheProduct(webResult)
      return NextResponse.json({
        success: true,
        source: 'web_search',
        confidence: 'estimated' as Confidence,
        data: formatProduct(webResult),
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

  // Layer 7 — Groq category nutrition profile (free, fast fallback before Gemini)
  try {
    const analysis7 = analyzeBarcode(trimmedBarcode)
    const cat = analysis7.category || (analysis7.brand ? inferCategory(analysis7.brand, analysis7.brand) : null)
    if (cat) {
      console.log(`Trying Groq category nutrition for: ${cat}`)
      const groqResult = await getCategoryNutrition(cat, trimmedBarcode, analysis7.brand)
      if (groqResult) {
        await supabaseAdmin.from('products').upsert({
          barcode: trimmedBarcode,
          name: groqResult.name,
          brand: groqResult.brand,
          category: cat,
          country_of_origin: analysis7.isIndian ? 'India' : null,
          image_url: null,
          calories: groqResult.nutrition.calories,
          protein: groqResult.nutrition.protein,
          fat: groqResult.nutrition.fat,
          carbohydrates: groqResult.nutrition.carbs,
          sugar: groqResult.nutrition.sugar,
          fiber: groqResult.nutrition.fiber,
          sodium: groqResult.nutrition.sodium,
          ingredients_text: groqResult.ingredients_text,
          health_score: null,
          health_grade: null,
          nova_group: 4,
          source: 'groq_category_estimated',
          last_updated: new Date().toISOString(),
        }, { onConflict: 'barcode', ignoreDuplicates: false })

        fetch(`${req.nextUrl.origin}/api/enrich`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode: trimmedBarcode, name: groqResult.name, brand: groqResult.brand, confidence: 'estimated' }),
        }).catch(() => {})

        console.log('Groq category estimated:', groqResult.name)
        return NextResponse.json({
          success: true,
          source: 'groq_category_estimated',
          confidence: 'estimated' as Confidence,
          data: {
            barcode: trimmedBarcode,
            name: groqResult.name,
            brand: groqResult.brand,
            category: cat,
            country_of_origin: analysis7.isIndian ? 'India' : null,
            image_url: null,
            source: 'groq_category_estimated',
            nutrition: {
              calories: groqResult.nutrition.calories || 0,
              protein: groqResult.nutrition.protein || 0,
              carbs: groqResult.nutrition.carbs || 0,
              fat: groqResult.nutrition.fat || 0,
              saturated_fat: groqResult.nutrition.saturated_fat || null,
              sugar: groqResult.nutrition.sugar || null,
              sodium: groqResult.nutrition.sodium || null,
              fiber: groqResult.nutrition.fiber || null,
            },
            serving_size_g: null,
            ingredients_text: groqResult.ingredients_text || null,
            allergens: [],
            additives: [],
          },
        })
      }
    }
  } catch (e) {
    console.log('Groq category nutrition failed:', e)
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

      console.log('AI estimated product:', aiResult.name)
      return NextResponse.json({
        success: true,
        source: 'ai_estimated',
        confidence: 'low' as Confidence,
        data: {
          barcode: trimmedBarcode,
          name: aiResult.name,
          brand: aiResult.brand,
          category: aiResult.category,
          country_of_origin: aiResult.isIndian ? 'India' : null,
          image_url: null,
          source: 'ai_estimated',
          nutrition: {
            calories: aiResult.nutrition.calories || 0,
            protein: aiResult.nutrition.protein || 0,
            carbs: aiResult.nutrition.carbs || 0,
            fat: aiResult.nutrition.fat || 0,
            saturated_fat: aiResult.nutrition.saturated_fat || null,
            sugar: aiResult.nutrition.sugar || null,
            sodium: aiResult.nutrition.sodium || null,
            fiber: aiResult.nutrition.fiber || null,
          },
          serving_size_g: null,
          ingredients_text: aiResult.ingredients_text || null,
          allergens: [],
          additives: [],
        },
      })
    }
  } catch (e) {
    console.log('AI estimation failed:', e)
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
