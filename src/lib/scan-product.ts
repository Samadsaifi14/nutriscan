import { supabaseAdmin } from './supabaseAdmin'
import { analyzeBarcode, inferCategory } from './barcode-intelligence'
import { formatProduct, cacheProduct, searchIndianProductWeb, estimateProductWithAI, parseNum, parseSodium, parseList, extractNutrition } from './scan-helpers'
import { fillNutritionIfMissing, getCategoryNutrition } from './nutrition-helpers'

type Confidence = 'exact' | 'high' | 'estimated' | 'low' | 'none'

export interface ScanLookupResult {
  success: boolean
  product?: any
  source: string
  confidence: Confidence
  error?: string
  barcode?: string
  message?: string
  warning?: string
}

export async function lookupBarcode(barcode: string): Promise<ScanLookupResult> {
  const trimmedBarcode = barcode?.trim()
  if (!trimmedBarcode || trimmedBarcode.length < 6) {
    return { success: false, error: 'Invalid barcode', source: '', confidence: 'none', barcode }
  }

  let offFallback: any = null

  // Layer 1 â€” Supabase cache
  try {
    const { data: cached } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('barcode', trimmedBarcode)
      .single()

    if (cached && cached.name) {
      return { success: true, source: 'cache', confidence: 'exact', product: cached }
    }
  } catch { /* continue */ }

  // Layer 2 â€” Open Food Facts exact
  try {
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

        const hasNutrition = product.calories_per_100g || product.protein_per_100g || product.carbs_per_100g || product.fat_per_100g
        if (hasNutrition) {
          cacheProduct(product)
          return { success: true, source: 'open_food_facts', confidence: 'high', product }
        }

        const nameEstimate = await fillNutritionIfMissing(product.name, {})
        if (nameEstimate) {
          return {
            success: true,
            source: 'open_food_facts_with_ai_nutrition',
            confidence: 'estimated',
            product: {
              ...product,
              source: 'open_food_facts_with_ai_nutrition',
              calories_per_100g: nameEstimate.calories,
              protein_per_100g: nameEstimate.protein,
              carbs_per_100g: nameEstimate.carbohydrates,
              fat_per_100g: nameEstimate.fat,
              saturated_fat_per_100g: nameEstimate.saturated_fat,
              sugar_per_100g: nameEstimate.sugar,
              sodium_per_100g: nameEstimate.sodium,
              fiber_per_100g: nameEstimate.fiber,
            },
          }
        }
        offFallback = product
      }
    }
  } catch { /* continue */ }

  // Layer 3 â€” OFF keyword search
  try {
    const barcodeAnalysis = analyzeBarcode(trimmedBarcode)
    const searchBrand = barcodeAnalysis.brand
    const searchCategory = barcodeAnalysis.category || (searchBrand ? inferCategory(searchBrand, searchBrand) : null)

    if (searchBrand && searchCategory) {
      const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchBrand + ' ' + searchCategory)}&search_simple=1&action=process&json=1&page_size=5`
      const offSearchRes = await fetch(searchUrl, {
        headers: { 'User-Agent': 'BioYou/1.0 (BioYou@example.com)' },
      })

      if (offSearchRes.ok) {
        const searchData = await offSearchRes.json()
        const products: any[] = searchData.products || []

        if (products.length > 0) {
          const best = products[0]!
          const n = best.nutriments || {}

          const product: any = {
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

          const formatted = formatProduct(product)
          const estimated = await fillNutritionIfMissing(formatted.name, formatted.nutrition)
          if (estimated) {
            Object.assign(product, {
              calories_per_100g: estimated.calories,
              protein_per_100g: estimated.protein,
              carbs_per_100g: estimated.carbohydrates,
              fat_per_100g: estimated.fat,
              saturated_fat_per_100g: estimated.saturated_fat,
              sugar_per_100g: estimated.sugar,
              sodium_per_100g: estimated.sodium,
              fiber_per_100g: estimated.fiber,
              source: 'open_food_facts_search_with_ai_nutrition',
            })
          }
          cacheProduct(product)
          return { success: true, source: product.source, confidence: 'high', product }
        }
      }
    }
  } catch { /* continue */ }

  // Layer 4 â€” UPC Item DB
  try {
    const upcRes = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${trimmedBarcode}`)
    if (upcRes.ok) {
      const upcData = await upcRes.json()
      if (upcData.items && upcData.items.length > 0) {
        const item = upcData.items[0]!
        const desc = (item.description || '').toLowerCase()
        const nutrition = extractNutrition(desc)

        const product: any = {
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

        const formatted = formatProduct(product)
        const estimated = await fillNutritionIfMissing(formatted.name, formatted.nutrition)
        if (estimated) {
          Object.assign(product, {
            calories_per_100g: estimated.calories,
            protein_per_100g: estimated.protein,
            carbs_per_100g: estimated.carbohydrates,
            fat_per_100g: estimated.fat,
            saturated_fat_per_100g: estimated.saturated_fat,
            sugar_per_100g: estimated.sugar,
            sodium_per_100g: estimated.sodium,
            fiber_per_100g: estimated.fiber,
            source: 'upc_item_db_with_ai_nutrition',
          })
        }
        cacheProduct(product)
        return { success: true, source: product.source, confidence: 'estimated', product }
      }
    }
  } catch { /* continue */ }

  // Layer 5 â€” Indian web search
  const analysis = analyzeBarcode(trimmedBarcode)
  if (analysis.isIndian) {
    const webResult = await searchIndianProductWeb(analysis.searchHint, analysis.brand)
    if (webResult) {
      const formatted = formatProduct(webResult)
      const estimated = await fillNutritionIfMissing(formatted.name, formatted.nutrition)
      if (estimated) {
        webResult.calories_per_100g = estimated.calories
        webResult.protein_per_100g = estimated.protein
        webResult.carbs_per_100g = estimated.carbohydrates
        webResult.fat_per_100g = estimated.fat
        webResult.saturated_fat_per_100g = estimated.saturated_fat
        webResult.sugar_per_100g = estimated.sugar
        webResult.sodium_per_100g = estimated.sodium
        webResult.fiber_per_100g = estimated.fiber
        webResult.source = 'web_search_with_ai_nutrition'
      }
      return { success: true, source: webResult.source, confidence: 'estimated', product: webResult }
    }
  }

  // Layer 6 â€” community_products
  try {
    const { data: community } = await supabaseAdmin
      .from('community_products')
      .select('*')
      .eq('barcode', trimmedBarcode)
      .eq('status', 'approved')
      .single()

    if (community) {
      const nut = community.nutrition as Record<string, any> || {}
      const product = {
        barcode,
        name: community.name || 'Unknown Product',
        brand: community.brand || null,
        category: null,
        country_of_origin: 'India',
        image_url: community.front_label_url || null,
        calories_per_100g: parseFloat(nut.calories) || null,
        protein_per_100g: parseFloat(nut.protein) || null,
        carbs_per_100g: parseFloat(nut.carbs) || null,
        fat_per_100g: parseFloat(nut.fat) || null,
        saturated_fat_per_100g: null,
        sugar_per_100g: parseFloat(nut.sugar) || null,
        sodium_per_100g: parseFloat(nut.sodium) || null,
        fiber_per_100g: parseFloat(nut.fiber) || null,
        serving_size_g: null,
        ingredients_text: community.ingredients_text || null,
        allergens: [],
        additives: [],
        source: 'community',
      }
      cacheProduct(product)
      return { success: true, source: 'community', confidence: 'high', product }
    }
  } catch { /* continue */ }

  // Layer 7 â€” Category nutrition estimation
  try {
    const analysis7 = analyzeBarcode(trimmedBarcode)
    const cat = analysis7.category || (analysis7.brand ? inferCategory(analysis7.brand, analysis7.brand) : null)
    const categorySearchName = analysis7.brand || offFallback?.name || trimmedBarcode
    if (cat) {
      const groqResult = await getCategoryNutrition(categorySearchName, cat)
      if (groqResult) {
        const mergedName = offFallback?.name || `${cat} product`
        const mergedBrand = offFallback?.brand || analysis7.brand
        const mergedImage = offFallback?.image_url || null

        await supabaseAdmin.from('products').upsert({
          barcode: trimmedBarcode, name: mergedName, brand: mergedBrand,
          category: cat, country_of_origin: analysis7.isIndian ? 'India' : null,
          image_url: null, calories: groqResult.calories, protein: groqResult.protein,
          fat: groqResult.fat, carbohydrates: groqResult.carbohydrates,
          sugar: groqResult.sugar, fiber: groqResult.fiber, sodium: groqResult.sodium,
          ingredients_text: offFallback?.ingredients_text || null,
          health_score: null, health_grade: null, nova_group: 4,
          source: 'category_estimated', last_updated: new Date().toISOString(),
        }, { onConflict: 'barcode', ignoreDuplicates: false })

        const product = {
          barcode: trimmedBarcode, name: mergedName, brand: mergedBrand,
          category: cat, country_of_origin: analysis7.isIndian ? 'India' : null,
          image_url: mergedImage,
          source: offFallback ? 'open_food_facts_with_ai_nutrition' : 'category_estimated',
          calories_per_100g: groqResult.calories, protein_per_100g: groqResult.protein,
          carbs_per_100g: groqResult.carbohydrates, fat_per_100g: groqResult.fat,
          saturated_fat_per_100g: groqResult.saturated_fat,
          sugar_per_100g: groqResult.sugar, sodium_per_100g: groqResult.sodium,
          fiber_per_100g: groqResult.fiber, serving_size_g: null,
          ingredients_text: offFallback?.ingredients_text || null,
          allergens: offFallback?.allergens || [], additives: offFallback?.additives || [],
        }
        return { success: true, source: product.source, confidence: 'estimated', product }
      }
    }
  } catch { /* continue */ }

  // Layer 8 â€” AI estimation (Gemini)
  try {
    const aiResult = await estimateProductWithAI(trimmedBarcode, analysis.brand, analysis.isIndian)
    if (aiResult) {
      await supabaseAdmin.from('products').upsert({
        barcode: trimmedBarcode, name: aiResult.name, brand: aiResult.brand,
        category: aiResult.category, country_of_origin: aiResult.isIndian ? 'India' : null,
        image_url: null, calories: aiResult.nutrition.calories, protein: aiResult.nutrition.protein,
        fat: aiResult.nutrition.fat, carbohydrates: aiResult.nutrition.carbs,
        sugar: aiResult.nutrition.sugar, fiber: aiResult.nutrition.fiber,
        sodium: aiResult.nutrition.sodium, ingredients_text: aiResult.ingredients_text,
        health_score: null, health_grade: null, nova_group: 4,
        source: 'ai_estimated', last_updated: new Date().toISOString(),
      }, { onConflict: 'barcode', ignoreDuplicates: false })

      const mergedName = offFallback?.name || aiResult.name
      const mergedBrand = offFallback?.brand || aiResult.brand
      const mergedImage = offFallback?.image_url || null

      const product = {
        barcode: trimmedBarcode, name: mergedName, brand: mergedBrand,
        category: aiResult.category, country_of_origin: aiResult.isIndian ? 'India' : null,
        image_url: mergedImage,
        source: offFallback ? 'open_food_facts_with_ai_nutrition' : 'ai_estimated',
        calories_per_100g: aiResult.nutrition.calories, protein_per_100g: aiResult.nutrition.protein,
        carbs_per_100g: aiResult.nutrition.carbs, fat_per_100g: aiResult.nutrition.fat,
        saturated_fat_per_100g: aiResult.nutrition.saturated_fat,
        sugar_per_100g: aiResult.nutrition.sugar, sodium_per_100g: aiResult.nutrition.sodium,
        fiber_per_100g: aiResult.nutrition.fiber, serving_size_g: null,
        ingredients_text: aiResult.ingredients_text || null,
        allergens: offFallback?.allergens || [], additives: offFallback?.additives || [],
      }
      return { success: true, source: product.source, confidence: 'low', product }
    }
  } catch { /* continue */ }

  // Layer 9 â€” Static keyword nutrition from offFallback name
  if (offFallback?.name) {
    const estimated = await fillNutritionIfMissing(offFallback.name, {})
    if (estimated) {
      const product = {
        ...offFallback,
        calories_per_100g: estimated.calories, protein_per_100g: estimated.protein,
        carbs_per_100g: estimated.carbohydrates, fat_per_100g: estimated.fat,
        saturated_fat_per_100g: estimated.saturated_fat,
        sugar_per_100g: estimated.sugar, sodium_per_100g: estimated.sodium,
        fiber_per_100g: estimated.fiber,
      }
      cacheProduct(product)
      return { success: true, source: 'open_food_facts_with_static_nutrition', confidence: 'estimated', product }
    }
  }

  // Final â€” OFF metadata without AI
  if (offFallback) {
    cacheProduct(offFallback)
    return {
      success: true, source: 'open_food_facts', confidence: 'high', product: offFallback,
      warning: 'Product found but nutrition data unavailable.',
    }
  }

  return { success: false, error: 'PRODUCT_NOT_FOUND', source: '', confidence: 'none', barcode, message: 'This product is not in our database yet.' }
}

