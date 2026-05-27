import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ingredients, nutrition, barcode, productName, category, brand } = body

    if (!ingredients && !productName) {
      return NextResponse.json({ success: false, error: 'No product data' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'AI not configured' }, { status: 503 })
    }

    const n = nutrition || {}
    const prompt = buildUnifiedPrompt({
      ingredients: ingredients || '',
      nutrition: n,
      productName: productName || 'Unknown product',
      category: category || null,
      brand: brand || null,
    })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.15,
        max_tokens: 1200,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq error:', response.status, errText)
      return NextResponse.json({ success: false, error: 'AI unavailable' }, { status: 503 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json({ success: false, error: 'Empty AI response' }, { status: 500 })
    }

    // Strip markdown fences if present
    const cleaned = content
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    let parsed: any
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse Groq response:', cleaned.slice(0, 300))
      return NextResponse.json({ success: false, error: 'AI returned invalid JSON' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (err: any) {
    console.error('analyze-ai error:', err.message)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

function buildUnifiedPrompt({
  ingredients,
  nutrition,
  productName,
  category,
  brand,
}: {
  ingredients: string
  nutrition: Record<string, any>
  productName: string
  category: string | null
  brand: string | null
}): string {
  const cal = nutrition.calories ?? 'unknown'
  const pro = nutrition.protein ?? 'unknown'
  const carbs = nutrition.carbs ?? 'unknown'
  const fat = nutrition.fat ?? 'unknown'
  const sugar = nutrition.sugar ?? 'unknown'
  const sodium = nutrition.sodium ?? 'unknown'
  const fiber = nutrition.fiber ?? 'unknown'

  return `You are a certified Indian food safety expert and nutritionist. Analyze this packaged food product against FSSAI, WHO, and ICMR 2020 guidelines.

PRODUCT: ${productName}
Brand: ${brand || 'Unknown'}
Category: ${category || 'Packaged food'}

NUTRITION per 100g:
Calories: ${cal} kcal | Protein: ${pro}g | Carbs: ${carbs}g | Fat: ${fat}g
Sugar: ${sugar}g | Sodium: ${sodium}mg | Fiber: ${fiber}g

INGREDIENTS: ${ingredients || 'Not available'}

Your task — return ONE JSON object with ALL of the following. No markdown. No code fences. Only raw JSON.

{
  "summary": "<2-3 sentences about this product for an Indian consumer, mention product name>",

  "ingredients": [
    {
      "ingredient": "<name>",
      "status": "harmful|concern|safe",
      "reason": "<1 sentence why>"
    }
  ],

  "harmful_ingredients": [
    {
      "name": "<exact ingredient name>",
      "also_known_as": ["<alias1>", "<alias2>"],
      "found_in_product": true,
      "concern": "<1-2 sentences, science-backed>",
      "severity": "high|medium|low",
      "scientific_source": "<org + year e.g. WHO 2023>",
      "source_url": "<real URL>",
      "global_safe_limit": "<e.g. 5mg/kg body weight/day>",
      "amount_in_this_product": "<estimate or unknown>",
      "personalized_safe_limit": "<general adult limit>",
      "percentage_of_daily_limit": "<estimate or unknown>"
    }
  ],

  "positives": ["<specific positive 1>", "<specific positive 2>"],

  "personalizedWarnings": [
    "<warning relevant to general Indian adult health>"
  ],

  "recommendations": [
    "<actionable recommendation 1>",
    "<actionable recommendation 2>"
  ],

  "alternatives": [
    {
      "name": "<specific Indian brand or whole food>",
      "brand": "<brand name or null>",
      "score": <estimated health score 1-10>,
      "reason": "<why this is healthier, 1 sentence>",
      "nutrition_per_100g": {
        "calories": <number or null>,
        "protein": <number or null>,
        "sugar": <number or null>,
        "fiber": <number or null>
      },
      "availability": "<widely available in India>",
      "type": "branded|whole_food|homemade"
    }
  ],

  "nova_group": <1|2|3|4>,
  "nova_label": "<minimally_processed|processed_ingredients|processed_food|ultra_processed>",
  "processing_level": "minimally_processed|moderately_processed|ultra_processed",

  "fssai_compliance": "compliant|concern|unknown",
  "diabetic_suitability": "suitable|consume_with_caution|avoid",
  "bp_suitability": "suitable|consume_with_caution|avoid",
  "child_suitability": "suitable|consume_with_caution|avoid"
}

Rules:
- Only flag ingredients that ACTUALLY appear in the ingredients text above
- Alternatives must be real Indian products or foods, not invented
- Keep all text concise — no paragraph essays
- If ingredients text is empty, base harmful_ingredients on nutrition flags only
- Harmful ingredients list: MSG, TBHQ, BHA, BHT, Sodium Benzoate, Carrageenan, Tartrazine, Sunset Yellow, Allura Red, Aspartame, Acesulfame K, Sucralose, HFCS, Partially Hydrogenated Oils, Sodium Nitrite, Maida`
}

// Simple GET for quick ingredient check
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const ingredients = url.searchParams.get('ingredients')?.split(',') || []

  if (ingredients.length === 0) {
    return NextResponse.json(
      { success: false, error: 'No ingredients provided' },
      { status: 400 }
    )
  }

  const { quickIngredientCheck } = await import('@/lib/groq-ai')
  const result = await quickIngredientCheck(ingredients)

  return NextResponse.json({
    success: true,
    data: Object.fromEntries(result)
  })
}
