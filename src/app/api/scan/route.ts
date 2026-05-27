import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { analyzeBarcode, inferCategory } from '@/lib/barcode-intelligence'
import { scoreProduct, type NutritionPer100g } from '@/lib/health-engine'
import { lookupWithCache } from '@/lib/off-india-import'
import { callGemini } from '@/lib/gemini'

type Confidence = 'exact' | 'high' | 'estimated' | 'low' | 'none'

export async function GET(req: NextRequest) {
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
      { headers: { 'User-Agent': 'HealthOX/1.0 (healthox@example.com)' } }
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
        headers: { 'User-Agent': 'HealthOX/1.0 (healthox@example.com)' },
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

// ─── Groq Category Nutrition ────────────────────────────────────────────────

async function getCategoryNutrition(category: string, barcode: string, brandHint: string | null): Promise<AIEstimate | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  try {
    const prompt = `You are a food database. Give me typical nutrition for a ${category} product.
Brand: ${brandHint || 'Unknown'}
Return ONLY valid JSON (no markdown, no code fences):
{
  "name": "typical ${category} product name",
  "brand": "${brandHint || 'null'}",
  "nutrition": {
    "calories": number per 100g,
    "protein": number per 100g,
    "carbs": number per 100g,
    "fat": number per 100g,
    "sugar": number per 100g or null,
    "sodium": number mg per 100g or null,
    "fiber": number per 100g or null
  },
  "ingredients_text": "typical comma-separated ingredients for this category or null"
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 500,
      }),
    })

    if (!response.ok) return null
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      name: parsed.name || `${category} product`,
      brand: parsed.brand || brandHint,
      isIndian: true,
      nutrition: {
        calories: parsed.nutrition?.calories ?? 0,
        protein: parsed.nutrition?.protein ?? 0,
        carbs: parsed.nutrition?.carbs ?? 0,
        fat: parsed.nutrition?.fat ?? 0,
        sugar: parsed.nutrition?.sugar ?? null,
        sodium: parsed.nutrition?.sodium ?? null,
        fiber: parsed.nutrition?.fiber ?? null,
      },
      category: category,
      ingredients_text: parsed.ingredients_text || null,
    }
  } catch (err: any) {
    console.log('Groq category nutrition error:', err.message)
    return null
  }
}

// ─── AI Estimation ──────────────────────────────────────────────────────────

interface AIEstimate {
  name: string
  brand: string | null
  isIndian: boolean
  nutrition: { calories: number; protein: number; carbs: number; fat: number; sugar: number | null; sodium: number | null; fiber: number | null }
  category: string | null
  ingredients_text: string | null
}

async function estimateProductWithAI(barcode: string, brandHint: string | null, isIndian: boolean): Promise<AIEstimate | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.log('No Gemini API key for AI estimation')
    return null
  }

  try {
    const prompt = `You are a food product database. A barcode was scanned and no database has information on it.

Barcode: ${barcode}
Brand hint: ${brandHint || 'Unknown'}
Country prefix: ${isIndian ? '890 (India)' : 'International'}
Barcode prefix analysis: ${barcode.substring(0, 4)}...

Based on the barcode prefix pattern and country, estimate the MOST LIKELY product this could be.
- If a brand is known from the barcode prefix, suggest their most common product
- Be specific, not generic
- Provide realistic nutrition estimates for this type of product
- If this is an Indian 890 barcode with a known brand prefix, be confident in your estimate

Return ONLY valid JSON (no markdown, no code fences):
{
  "name": "specific product name",
  "brand": "brand name or null",
  "isIndian": true,
  "category": "product category like biscuits, noodles, chips, bread, etc.",
  "nutrition": {
    "calories": <number per 100g>,
    "protein": <number per 100g>,
    "carbs": <number per 100g>,
    "fat": <number per 100g>,
    "sugar": <number per 100g or null>,
    "sodium": <number mg per 100g or null>,
    "fiber": <number per 100g or null>
  },
  "ingredients_text": "comma-separated list of likely ingredients or null"
}`

    const result = await callGemini(prompt, undefined, { temperature: 0.2, maxTokens: 1000, timeoutMs: 20000, maxRetries: 0 })
    if (!result?.text) return null

    const cleaned = result.text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      name: parsed.name || 'Unknown Product',
      brand: parsed.brand || brandHint,
      isIndian: parsed.isIndian ?? isIndian,
      nutrition: {
        calories: parsed.nutrition?.calories ?? 0,
        protein: parsed.nutrition?.protein ?? 0,
        carbs: parsed.nutrition?.carbs ?? 0,
        fat: parsed.nutrition?.fat ?? 0,
        sugar: parsed.nutrition?.sugar ?? null,
        sodium: parsed.nutrition?.sodium ?? null,
        fiber: parsed.nutrition?.fiber ?? null,
      },
      category: parsed.category || null,
      ingredients_text: parsed.ingredients_text || null,
    }
  } catch (err: any) {
    console.log('AI estimation error:', err.message)
    return null
  }
}

// ─── Helper functions (unchanged from original) ─────────────────────────────

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
  const result: any = { calories: null, protein: null, carbs: null, fat: null, sugar: null }

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
    const nutrition: NutritionPer100g = {
      calories: product.calories_per_100g || 0,
      protein: product.protein_per_100g || 0,
      carbohydrates: product.carbs_per_100g || 0,
      total_fat: product.fat_per_100g || 0,
      sugar: product.sugar_per_100g || 0,
      sodium: product.sodium_per_100g || 0,
    }

    const result = scoreProduct(nutrition, product.ingredients_text || '')
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
    const searchQuery = brand
      ? `${brand} ${searchHint.split(' ').slice(2).join(' ')} nutrition ingredients site:bigbasket.com OR site:blinkit.com`
      : `${searchHint} nutrition ingredients site:bigbasket.com OR site:blinkit.com`

    console.log('Tavily search query:', searchQuery)

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    const relevantResult = data.results.find((r: any) =>
      r.url?.includes('bigbasket') ||
      r.url?.includes('blinkit') ||
      r.url?.includes('amazon.in')
    )

    if (relevantResult) {
      console.log('Found web result:', relevantResult.title)
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
