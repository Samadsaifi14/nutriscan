import { supabaseAdmin } from './supabaseAdmin'
import { scoreProduct, type NutritionPer100g } from './health-engine'
import { callGemini } from './gemini'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AIEstimate {
  name: string
  brand: string | null
  isIndian: boolean
  nutrition: { calories: number; protein: number; carbs: number; fat: number; saturated_fat: number | null; sugar: number | null; sodium: number | null; fiber: number | null }
  category: string | null
  ingredients_text: string | null
}

// ── Parsers ───────────────────────────────────────────────────────────────────

export function parseNum(val: any): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n * 10) / 10
}

export function parseSodium(sodiumVal: any, saltVal: any): number | null {
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

export function parseList(tags: any): string[] {
  if (!tags || !Array.isArray(tags)) return []
  return tags.map((t: string) => t.replace(/^en:/, '').replace(/-/g, ' ')).filter(Boolean)
}

export function extractNutrition(desc: string): {
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

// ── Product Formatting & Caching ──────────────────────────────────────────────

export function formatProduct(p: any) {
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
      calories:      p.calories_per_100g      ?? p.calories      ?? null,
      protein:       p.protein_per_100g       ?? p.protein       ?? null,
      carbs:         p.carbs_per_100g         ?? p.carbohydrates ?? null,
      fat:           p.fat_per_100g           ?? p.fat           ?? null,
      saturated_fat: p.saturated_fat_per_100g ?? p.saturated_fat ?? null,
      sugar:         p.sugar_per_100g         ?? p.sugar         ?? null,
      sodium:        p.sodium_per_100g        ?? p.sodium        ?? null,
      fiber:         p.fiber_per_100g         ?? p.fiber         ?? null,
    },
    serving_size_g: p.serving_size_g || null,
    ingredients_text: p.ingredients_text || null,
    allergens: p.allergens || [],
    additives: p.additives || [],
  }
}

export async function cacheProduct(product: any) {
  try {
    const nutrition: NutritionPer100g = {
      calories: product.calories_per_100g || 0,
      protein: product.protein_per_100g || 0,
      carbohydrates: product.carbs_per_100g || 0,
      total_fat: product.fat_per_100g || 0,
      saturated_fat: product.saturated_fat_per_100g || 0,
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
      saturated_fat: product.saturated_fat_per_100g,
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

export function detectHarmfulAdditives(ingredientsText: string): string[] {
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

// ── Web Search ────────────────────────────────────────────────────────────────

export async function searchIndianProductWeb(searchHint: string, brand: string | null): Promise<any | null> {
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

// ── AI Estimations ────────────────────────────────────────────────────────────

export async function getCategoryNutrition(category: string, barcode: string, brandHint: string | null): Promise<AIEstimate | null> {
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
    "saturated_fat": number per 100g or null,
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
        response_format: { type: 'json_object' },
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
        calories: parsed.nutrition?.calories ?? null,
        protein: parsed.nutrition?.protein ?? null,
        carbs: parsed.nutrition?.carbs ?? null,
        fat: parsed.nutrition?.fat ?? null,
        saturated_fat: parsed.nutrition?.saturated_fat ?? null,
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

export async function estimateNutritionFromName(
  productName: string,
  brand: string | null,
  category: string | null
): Promise<AIEstimate | null> {
  if (!productName) return null

  const prompt = `You are a food nutrition database. Estimate realistic nutrition per 100g for this product.

Product: "${productName}"
Brand: ${brand || 'Unknown'}
Category: ${category || 'Unknown'}
Country: India

Return ONLY valid JSON (no markdown, no code fences) with realistic typical values:
{
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "saturated_fat": number or null,
    "sugar": number or null,
    "sodium": number or null,
    "fiber": number or null
  },
  "ingredients_text": "typical ingredients for this product or null"
}`

  function parseNutritionResponse(text: string): { nutrition: AIEstimate['nutrition']; ingredients_text: string | null } | null {
    try {
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      const parsed = JSON.parse(cleaned)
      if (!parsed.nutrition) return null
      return {
        nutrition: {
          calories:      parsed.nutrition?.calories      ?? null,
          protein:       parsed.nutrition?.protein       ?? null,
          carbs:         parsed.nutrition?.carbs         ?? null,
          fat:           parsed.nutrition?.fat           ?? null,
          saturated_fat: parsed.nutrition?.saturated_fat ?? null,
          sugar:         parsed.nutrition?.sugar         ?? null,
          sodium:        parsed.nutrition?.sodium        ?? null,
          fiber:         parsed.nutrition?.fiber         ?? null,
        },
        ingredients_text: parsed.ingredients_text || null,
      }
    } catch {
      return null
    }
  }

  // Step 1 — Try Groq
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        }),
      })

      if (!response.ok) {
        console.error(`[NutritionAI] Groq returned ${response.status}`)
      } else {
        const data = await response.json()
        const content = data.choices?.[0]?.message?.content
        if (content) {
          const parsed = parseNutritionResponse(content)
          if (parsed) {
            console.log(`[NutritionAI] Groq estimated: "${productName}" → ${parsed.nutrition.calories ?? '?'}kcal`)
            return { name: productName, brand, isIndian: true, ...parsed, category }
          }
        }
        console.warn(`[NutritionAI] Groq response unparseable for: "${productName}"`)
      }
    } catch (err: any) {
      console.error('[NutritionAI] Groq threw:', err.message)
    }
  } else {
    console.warn('[NutritionAI] GROQ_API_KEY is not set')
  }

  // Step 2 — Try Gemini as fallback
  console.log('[NutritionAI] Groq failed, trying Gemini for:', productName)
  try {
    const geminiResult = await callGemini(prompt, undefined, {
      temperature: 0.2,
      maxTokens: 1000,
      timeoutMs: 15000,
      maxRetries: 1,
    })
    if (geminiResult?.text) {
      const parsed = parseNutritionResponse(geminiResult.text)
      if (parsed) {
        console.log(`[NutritionAI] Gemini estimated: "${productName}" → ${parsed.nutrition.calories ?? '?'}kcal`)
        return { name: productName, brand, isIndian: true, ...parsed, category }
      }
      console.warn(`[NutritionAI] Gemini response unparseable for: "${productName}"`)
    } else {
      console.warn('[NutritionAI] Gemini returned empty response')
    }
  } catch (err: any) {
    console.error('[NutritionAI] Gemini threw:', err.message)
  }

  // Step 3 — Both failed
  return null
}

export async function estimateProductWithAI(barcode: string, brandHint: string | null, isIndian: boolean): Promise<AIEstimate | null> {
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
    "saturated_fat": <number per 100g or null>,
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
        calories: parsed.nutrition?.calories ?? null,
        protein: parsed.nutrition?.protein ?? null,
        carbs: parsed.nutrition?.carbs ?? null,
        fat: parsed.nutrition?.fat ?? null,
        saturated_fat: parsed.nutrition?.saturated_fat ?? null,
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

export async function fillNutritionIfMissing(product: any): Promise<any> {
  const n = product.nutrition || {}
  if (n.calories || n.protein || n.carbs || n.fat) return product

  // Try AI first
  console.log('No nutrition found, calling AI for:', product.name)
  const estimate = await estimateNutritionFromName(product.name, product.brand, product.category)
  if (estimate) {
    return {
      ...product,
      source: product.source + '_with_ai_nutrition',
      nutrition: {
        calories:      estimate.nutrition.calories      ?? null,
        protein:       estimate.nutrition.protein       ?? null,
        carbs:         estimate.nutrition.carbs         ?? null,
        fat:           estimate.nutrition.fat           ?? null,
        saturated_fat: estimate.nutrition.saturated_fat ?? null,
        sugar:         estimate.nutrition.sugar         ?? null,
        sodium:        estimate.nutrition.sodium        ?? null,
        fiber:         estimate.nutrition.fiber         ?? null,
      },
      ingredients_text: estimate.ingredients_text || product.ingredients_text,
    }
  }

  // AI failed — fall back to static keyword estimation
  console.log('AI failed, trying static estimation for:', product.name)
  const staticNut = estimateStaticNutrition(product.name)
  return {
    ...product,
    source: product.source + '_with_static_nutrition',
    nutrition: {
      calories:      staticNut.calories,
      protein:       staticNut.protein,
      carbs:         staticNut.carbs,
      fat:           staticNut.fat,
      saturated_fat: null,
      sugar:         staticNut.sugar,
      sodium:        staticNut.sodium,
      fiber:         staticNut.fiber,
    },
    ingredients_text: product.ingredients_text,
  }
}

// ── Static Nutrition Estimation (no API key needed) ──────────────────────────

export interface NutritionInfo {
  calories: number; protein: number; carbs: number; fat: number
  sugar: number; sodium: number; fiber: number
}

const STATIC_NUTRITION_MAP: Array<{ keywords: string[]; nutrition: NutritionInfo }> = [
  { keywords: ['biscuit','cookie','cracker'],          nutrition: { calories:480, protein:6,   carbs:70, fat:20, sugar:25, sodium:300, fiber:2  } },
  { keywords: ['noodle','pasta','maggi','ramen'],       nutrition: { calories:380, protein:8,   carbs:70, fat:15, sugar:3,  sodium:800, fiber:2  } },
  { keywords: ['chip','crisp','namkeen','kurkure'],     nutrition: { calories:530, protein:5,   carbs:50, fat:35, sugar:2,  sodium:500, fiber:3  } },
  { keywords: ['bread','pav','bun','toast'],            nutrition: { calories:250, protein:8,   carbs:45, fat:3,  sugar:3,  sodium:400, fiber:4  } },
  { keywords: ['milk','dahi','yogurt','paneer','curd'], nutrition: { calories:65,  protein:3.5, carbs:5,  fat:3.5,sugar:5,  sodium:50,  fiber:0  } },
  { keywords: ['rice','biryani','pulao'],               nutrition: { calories:130, protein:2.5, carbs:28, fat:0.3,sugar:0,  sodium:0,   fiber:0.5} },
  { keywords: ['dal','lentil','rajma','chana','chole'], nutrition: { calories:115, protein:7,   carbs:18, fat:0.5,sugar:1,  sodium:10,  fiber:5  } },
  { keywords: ['chocolate','choco'],                   nutrition: { calories:550, protein:5,   carbs:60, fat:32, sugar:50, sodium:80,  fiber:3  } },
  { keywords: ['juice','drink','beverage','squash'],    nutrition: { calories:50,  protein:0.2, carbs:12, fat:0,  sugar:11, sodium:20,  fiber:0  } },
  { keywords: ['cola','soda','pepsi','coke','sprite'],  nutrition: { calories:42,  protein:0,   carbs:11, fat:0,  sugar:11, sodium:10,  fiber:0  } },
  { keywords: ['chips','fries','wafer'],                nutrition: { calories:510, protein:4,   carbs:55, fat:30, sugar:1,  sodium:450, fiber:3  } },
  { keywords: ['sauce','ketchup','chutney','pickle'],   nutrition: { calories:100, protein:1,   carbs:22, fat:0.5,sugar:18, sodium:900, fiber:1  } },
  { keywords: ['ghee','butter','oil'],                  nutrition: { calories:900, protein:0,   carbs:0,  fat:100,sugar:0,  sodium:10,  fiber:0  } },
  { keywords: ['sugar','jaggery','gur'],                nutrition: { calories:400, protein:0,   carbs:100,fat:0,  sugar:99, sodium:2,   fiber:0  } },
  { keywords: ['oats','oatmeal','granola','muesli'],    nutrition: { calories:370, protein:13,  carbs:65, fat:7,  sugar:1,  sodium:5,   fiber:10 } },
  { keywords: ['protein','whey','supplement'],          nutrition: { calories:380, protein:75,  carbs:10, fat:5,  sugar:5,  sodium:150, fiber:1  } },
  { keywords: ['tea','chai','coffee'],                  nutrition: { calories:5,   protein:0.3, carbs:0.7,fat:0.1,sugar:0,  sodium:5,   fiber:0  } },
  { keywords: ['bun','muffin','cake','pastry'],         nutrition: { calories:380, protein:5,   carbs:60, fat:15, sugar:30, sodium:300, fiber:1  } },
  { keywords: ['poha','upma','idli','dosa'],            nutrition: { calories:160, protein:3,   carbs:32, fat:2,  sugar:1,  sodium:200, fiber:1  } },
  { keywords: ['jam','jelly','spread','marmalade'],     nutrition: { calories:250, protein:0.5, carbs:65, fat:0,  sugar:60, sodium:30,  fiber:1  } },
  { keywords: ['corn','maize','popcorn'],               nutrition: { calories:380, protein:7,   carbs:75, fat:5,  sugar:1,  sodium:5,   fiber:5  } },
  { keywords: ['soybean','tofu','soy'],                 nutrition: { calories:170, protein:15,  carbs:9,  fat:9,  sugar:3,  sodium:10,  fiber:3  } },
  { keywords: ['flour','maida','atta','besan'],         nutrition: { calories:360, protein:10,  carbs:73, fat:2,  sugar:1,  sodium:2,   fiber:3  } },
  { keywords: ['honey'],                                nutrition: { calories:300, protein:0.3, carbs:82, fat:0,  sugar:80, sodium:4,   fiber:0  } },
  { keywords: ['almond','cashew','peanut','nut','walnut'], nutrition: { calories:580, protein:20, carbs:20, fat:50, sugar:4, sodium:5,  fiber:7  } },
  { keywords: ['banana','mango','apple','fruit'],       nutrition: { calories:70,  protein:0.8, carbs:17, fat:0.2,sugar:12, sodium:2,   fiber:2  } },
  { keywords: ['tomato','vegetable','sabzi','curry'],   nutrition: { calories:80,  protein:3,   carbs:12, fat:3,  sugar:5,  sodium:300, fiber:3  } },
  { keywords: ['egg','anda'],                           nutrition: { calories:155, protein:13,  carbs:1,  fat:11, sugar:0,  sodium:120, fiber:0  } },
  { keywords: ['chicken','mutton','fish','prawn','meat'], nutrition: { calories:165, protein:25, carbs:0, fat:7,  sugar:0,  sodium:70,  fiber:0  } },
  { keywords: ['cheese','paneer'],                      nutrition: { calories:350, protein:22,  carbs:3,  fat:28, sugar:1,  sodium:600, fiber:0  } },
]

const GENERIC_FALLBACK_NUTRITION: NutritionInfo = {
  calories: 200, protein: 5, carbs: 30, fat: 7, sugar: 5, sodium: 200, fiber: 2
}

export function estimateStaticNutrition(productName: string): NutritionInfo {
  const name = productName.toLowerCase()
  for (const entry of STATIC_NUTRITION_MAP) {
    if (entry.keywords.some(kw => name.includes(kw))) return entry.nutrition
  }
  return GENERIC_FALLBACK_NUTRITION
}
