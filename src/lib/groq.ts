// BioYou - Groq LLM for unified food analysis
// Combines summary + ingredient analysis + personalized warnings in one call

export interface UnifiedAnalysisRequest {
  product_name: string
  score: number
  grade: string
  nutrition: {
    calories?: number
    protein?: number
    sugar?: number
    sodium?: number
    carbs?: number
    fat?: number
    saturated_fat?: number
    fiber?: number
  }
  additives_found: string[]
  nova_group: number
  ingredients_text: string
  userProfile?: {
    is_diabetic?: boolean
    has_bp?: boolean
    has_heart_disease?: boolean
    has_cholesterol?: boolean
    is_vegetarian?: boolean
    is_vegan?: boolean
    is_jain?: boolean
    allergies?: string[]
  }
}

export interface UnifiedAnalysisResponse {
  summary: string
  recommendation: string
  concerns: string[]
  positives: string[]
  recommendations: string[]
  personalizedWarnings: string[]
  long_term_risks: string[]
  ingredients: Array<{
    ingredient: string
    status: 'safe' | 'concern' | 'harmful'
    concern?: string
    recommendation?: string
  }>
}

// Call Groq API directly using fetch
async function callGroq(prompt: string, maxTokens = 2000): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      console.error('Groq API error:', response.status, await response.text())
      return null
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || null
  } catch (err) {
    console.error('Groq fetch error:', err)
    return null
  }
}

export async function generateUnifiedAnalysis(req: UnifiedAnalysisRequest): Promise<UnifiedAnalysisResponse> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return getTemplateUnified(req)
  }

  const profileContext = buildProfileContext(req.userProfile)

  const prompt = `You are a friendly food health explainer and safety expert. Analyze this product in detail.

${profileContext}

Product: ${req.product_name}
Health Score: ${req.score}/10 (Grade: ${req.grade})
Nutrition per 100g: ${req.nutrition.calories || '?'}kcal, ${req.nutrition.protein || '?'}g protein, ${req.nutrition.carbs || '?'}g carbs, ${req.nutrition.fat || '?'}g fat, ${req.nutrition.sugar || '?'}g sugar, ${req.nutrition.sodium || '?'}mg sodium, ${req.nutrition.fiber || '?'}g fiber
Harmful ingredients detected: ${req.additives_found.length > 0 ? req.additives_found.join(', ') : 'None detected'}
Processing level: ${req.nova_group === 1 ? 'Minimal' : req.nova_group === 2 ? 'Processed ingredients' : req.nova_group === 3 ? 'Processed' : 'Ultra-processed'}
Ingredients list: ${req.ingredients_text || 'Not available'}

Respond in exactly this JSON format (no markdown, no code fences):
{
  "summary": "2-3 sentence simple explanation for average person including the product name",
  "recommendation": "short suggestion like 'Great choice!', 'Eat occasionally', 'Better alternatives available'",
  "concerns": ["list of health concerns about this product"],
  "positives": ["list of positive aspects"],
  "recommendations": ["actionable recommendations for the consumer"],
  "personalizedWarnings": ["warnings personalized to user's health conditions if applicable, otherwise empty array"],
  "long_term_risks": ["evidence-based long term risks from regular consumption"],
  "ingredients": [
    {
      "ingredient": "ingredient name",
      "status": "safe" or "concern" or "harmful",
      "concern": "specific concern if any",
      "recommendation": "recommendation if any"
    }
  ]
}`

  try {
    const content = await callGroq(prompt, 2000)

    if (content) {
      const parsed = JSON.parse(content)
      return {
        summary: parsed.summary || getTemplateUnified(req).summary,
        recommendation: parsed.recommendation || '',
        concerns: parsed.concerns || [],
        positives: parsed.positives || [],
        recommendations: parsed.recommendations || [],
        personalizedWarnings: parsed.personalizedWarnings || [],
        long_term_risks: parsed.long_term_risks || [],
        ingredients: parsed.ingredients || [],
      }
    }
  } catch (err) {
    console.warn('Groq unified analysis failed, using template:', err)
  }

  return getTemplateUnified(req)
}

function buildProfileContext(profile?: UnifiedAnalysisRequest['userProfile']): string {
  if (!profile) return ''
  const conditions: string[] = []
  if (profile.is_diabetic) conditions.push('- User has Diabetes - flag high sugar/sucrose products')
  if (profile.has_bp) conditions.push('- User has High Blood Pressure - flag high sodium products')
  if (profile.has_heart_disease) conditions.push('- User has Heart Disease - flag high saturated fat, trans fats')
  if (profile.has_cholesterol) conditions.push('- User has High Cholesterol - flag high fat content')
  if (profile.is_vegetarian) conditions.push('- User is Vegetarian - note any non-vegetarian ingredients')
  if (profile.is_vegan) conditions.push('- User is Vegan - flag all animal-derived ingredients')
  if (profile.is_jain) conditions.push('- User follows Jain diet - avoid root vegetables, fermented items')
  if (profile.allergies && profile.allergies.length > 0) {
    conditions.push(`- User has allergies: ${profile.allergies.join(', ')} - flag these ingredients`)
  }
  return conditions.length > 0
    ? `USER PROFILE (Personalize warnings based on):\n${conditions.join('\n')}\n`
    : ''
}

function getTemplateUnified(req: UnifiedAnalysisRequest): UnifiedAnalysisResponse {
  const grade = req.grade
  const name = req.product_name

  let summary: string
  let recommendation: string
  if (grade === 'A') {
    summary = `${name} is a great choice! It's healthy with good nutrition.`
    recommendation = 'Great choice! Enjoy freely.'
  } else if (grade === 'B') {
    summary = `${name} is a decent option. Enjoy in moderation.`
    recommendation = 'Good option. Eat occasionally.'
  } else if (grade === 'C') {
    summary = `${name} has some concerns. Consider alternatives.`
    recommendation = 'Limit consumption.'
  } else {
    summary = `${name} is not recommended. Look for healthier options.`
    recommendation = 'Better alternatives available.'
  }

  const positives = req.additives_found.length === 0
    ? ['No harmful additives detected']
    : ['Scored based on ingredient safety analysis']

  const long_term_risks = req.additives_found.length > 0
    ? [`Contains ${req.additives_found.length} potentially harmful additive(s)`]
    : ['See score breakdown for details']

  return {
    summary,
    recommendation,
    concerns: [],
    positives,
    recommendations: [recommendation],
    personalizedWarnings: [],
    long_term_risks,
    ingredients: [],
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Ingredient-list fallback (used when scanned product has no ingredients text)
// ───────────────────────────────────────────────────────────────────────────

export interface IngredientRequest {
  product_name?: string
  category?: string
  brand?: string
  nutrition?: { calories?: number; protein?: number; carbs?: number; fat?: number; sugar?: number; sodium?: number; fiber?: number }
}

const INDIAN_GROCERY_PLATFORMS = ['Amazon India', 'Flipkart', 'BigBasket', 'Blinkit', 'Zepto', 'Swiggy Instamart', 'JioMart']

/**
 * Generate a typical ingredient list for a product when the source DB is missing it.
 * Returns a comma-separated list (string) of ingredients — caller is responsible
 * for splitting. Returns empty string on failure or missing API key.
 */
export async function generateIngredientsViaGroq(req: IngredientRequest): Promise<string> {
  if (!process.env.GROQ_API_KEY) return ''
  const name = (req.product_name || '').trim() || 'this packaged food'
  const category = (req.category || '').trim()
  const brand = (req.brand || '').trim()

  const prompt = `You are an Indian food packaging expert. List the typical ingredients found on the label of the following Indian packaged product.

Product: ${name}
${brand ? `Brand: ${brand}\n` : ''}${category ? `Category: ${category}\n` : ''}
${req.nutrition ? `Nutrition (per 100g): ${req.nutrition.calories ?? '?'}kcal, ${req.nutrition.protein ?? '?'}g protein, ${req.nutrition.carbs ?? '?'}g carbs, ${req.nutrition.fat ?? '?'}g fat, ${req.nutrition.sugar ?? '?'}g sugar, ${req.nutrition.sodium ?? '?'}mg sodium\n` : ''}

Return ONLY a comma-separated list of typical ingredients (no markdown, no explanation, no numbering).
Example output: Refined wheat flour (maida), sugar, palm oil, salt, yeast, emulsifier (E481), acidity regulator (E500), preservative (E282)

The list should be specific to the Indian market and realistic for the named product. 8-15 ingredients is ideal.`

  try {
    const content = await callGroq(prompt, 600)
    if (!content) return ''
    return content
      .replace(/```[a-z]*\s*/gi, '')
      .replace(/```/g, '')
      .trim()
  } catch (err) {
    console.warn('Groq ingredient generation failed:', err)
    return ''
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Alternatives fallback (Groq, when dynamic + curated both fail)
// ───────────────────────────────────────────────────────────────────────────

export interface GroqAlternative {
  name: string
  brand?: string | null
  reason: string
  availability: string
  type: 'branded' | 'homemade' | 'whole_food'
  price_band?: string
  ingredients_summary?: string
  shopping_platforms?: string[]
}

export interface GroqAlternativesRequest {
  product_name: string
  brand?: string | null
  category?: string | null
  barcode?: string | null
  current_score?: number
  current_ingredients?: string | null
  current_nutrition?: { calories?: number; protein?: number; carbs?: number; fat?: number; sugar?: number; sodium?: number; fiber?: number }
  health_concerns?: string[]
}

/**
 * Generate healthier alternatives via Groq when the dynamic + curated tiers are empty.
 * Strict requirements enforced in prompt:
 *  1. Available in India (purchasable on Amazon India, Flipkart, BigBasket, Blinkit, Zepto, Swiggy Instamart, JioMart)
 *  2. Similar price band to the scanned product
 *  3. Healthier ingredient list (less sugar/sodium/trans fat, no harmful additives)
 *  4. Real Indian brands or homemade/whole-food options
 */
export async function generateAlternativesViaGroq(req: GroqAlternativesRequest): Promise<GroqAlternative[]> {
  if (!process.env.GROQ_API_KEY) return []

  const prompt = `You are an Indian nutrition expert helping users find healthier alternatives to packaged food products sold in India.

ORIGINAL PRODUCT:
Name: ${req.product_name}
${req.brand ? `Brand: ${req.brand}\n` : ''}${req.category ? `Category: ${req.category}\n` : ''}
${req.current_score != null ? `Health score: ${req.current_score}/10\n` : ''}
${req.current_nutrition ? `Nutrition (per 100g): ${req.current_nutrition.calories ?? '?'}kcal, protein ${req.current_nutrition.protein ?? '?'}g, carbs ${req.current_nutrition.carbs ?? '?'}g, fat ${req.current_nutrition.fat ?? '?'}g, sugar ${req.current_nutrition.sugar ?? '?'}g, sodium ${req.current_nutrition.sodium ?? '?'}mg\n` : ''}
${req.current_ingredients ? `Ingredients: ${req.current_ingredients}\n` : ''}
${req.health_concerns?.length ? `Health concerns: ${req.health_concerns.join('; ')}\n` : ''}

TASK: Suggest 4 healthier alternatives that meet ALL these criteria:
1. AVAILABILITY — must be available in India on at least 2 of these platforms: Amazon India, Flipkart, BigBasket, Blinkit, Zepto, Swiggy Instamart, JioMart (or be a whole-food / homemade option)
2. PRICE — must be in a similar price band to the original (within ±25% per serving)
3. INGREDIENTS — must have a healthier ingredient list than the original (e.g. less sugar, less sodium, no MSG, no trans fat, no artificial colours, no harmful additives, more whole grains/protein/fiber where applicable)
4. INDIAN MARKET — prefer real Indian brands (Yoga, True Elements, 24 Mantra, Organic Tattva, Soulfull, Saffola, Amul, Britannia NutriChoice, Tata Sampann, etc.) or whole-food/homemade options (fresh fruit, nuts, sprouts, dal-based snacks, homemade versions)

Return ONLY valid JSON (no markdown, no code fences) in this exact shape:
{
  "alternatives": [
    {
      "name": "specific product or recipe name",
      "brand": "brand name or null",
      "type": "branded" | "homemade" | "whole_food",
      "reason": "1-2 sentence nutritional reason it's healthier than the original",
      "ingredients_summary": "short comma-separated list highlighting the healthy parts, e.g. 'whole wheat, no maida, low sugar (3g), high fiber (6g)'",
      "price_band": "similar | lower | higher",
      "availability": "Amazon India, BigBasket",
      "shopping_platforms": ["Amazon India", "BigBasket"]
    }
  ]
}

Be specific with brand names and product names that an Indian consumer can actually buy. Do not invent fake brands.`

  try {
    const content = await callGroq(prompt, 1200)
    if (!content) return []
    const cleaned = content.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    if (!Array.isArray(parsed.alternatives)) return []

    return parsed.alternatives
      .filter((a: any) => a && typeof a.name === 'string' && a.name.trim())
      .slice(0, 4)
      .map((a: any) => ({
        name: String(a.name).trim(),
        brand: a.brand ? String(a.brand).trim() : null,
        reason: String(a.reason || 'A healthier Indian alternative').trim(),
        type: (['branded', 'homemade', 'whole_food'].includes(a.type) ? a.type : 'branded') as 'branded' | 'homemade' | 'whole_food',
        ingredients_summary: a.ingredients_summary ? String(a.ingredients_summary) : undefined,
        price_band: a.price_band ? String(a.price_band) : 'similar',
        availability: a.availability ? String(a.availability) : INDIAN_GROCERY_PLATFORMS.slice(0, 2).join(', '),
        shopping_platforms: Array.isArray(a.shopping_platforms) ? a.shopping_platforms.filter((p: any) => typeof p === 'string') : undefined,
      }))
  } catch (err) {
    console.warn('Groq alternatives generation failed:', err)
    return []
  }
}