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
      calories: p.calories_per_100g ?? null,
      protein: p.protein_per_100g ?? null,
      carbs: p.carbs_per_100g ?? null,
      fat: p.fat_per_100g ?? null,
      saturated_fat: p.saturated_fat_per_100g ?? null,
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
        calories: parsed.nutrition?.calories ?? 0,
        protein: parsed.nutrition?.protein ?? 0,
        carbs: parsed.nutrition?.carbs ?? 0,
        fat: parsed.nutrition?.fat ?? 0,
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
