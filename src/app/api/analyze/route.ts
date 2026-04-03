import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'

const ProductSchema = z.object({
  barcode: z.string().optional(),
  name: z.string().min(1),
  brand: z.string().optional(),
  category: z.string().optional(),
  country_of_origin: z.string().optional(),
  image_url: z.string().optional(),
  nutrition: z.object({
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    sugar: z.number().optional(),
    sodium: z.number().optional(),
    fiber: z.number().optional(),
  }),
  ingredients_text: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  additives: z.array(z.string()).optional(),
})

const RequestSchema = z.object({
  product: ProductSchema,
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'You must be signed in to analyse products' },
        { status: 401 }
      )
    }

    const rateCheck = await checkRateLimit(userId, 'analyze')
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Analysis limit reached. Please wait ${rateCheck.resetIn} minutes.`, rateLimited: true },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid product data: ' + parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      )
    }

    const { product } = parsed.data

    // Check 7 day cache
    if (product.barcode) {
      const { data: cached } = await supabaseAdmin
        .from('products')
        .select('ai_analysis_json, ai_analyzed_at')
        .eq('barcode', product.barcode)
        .single()

      if (cached?.ai_analysis_json && cached?.ai_analyzed_at) {
        const age = Date.now() - new Date(cached.ai_analyzed_at).getTime()
        if (age < 7 * 24 * 60 * 60 * 1000) {
          console.log('Returning cached AI analysis')
          return NextResponse.json({ success: true, data: cached.ai_analysis_json, cached: true })
        }
      }
    }

    const prompt = buildPrompt(product)
    console.log('Calling Gemini AI for:', product.name)

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 8000 }
        })
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.log('Gemini error:', errText)
      return NextResponse.json(
        { success: false, error: 'AI service temporarily unavailable. Please try again.' },
        { status: 500 }
      )
    }

    const geminiData = await geminiRes.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'AI returned empty response. Please try again.' },
        { status: 500 }
      )
    }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let analysis
    try {
      analysis = JSON.parse(cleaned)
    } catch {
      console.log('JSON parse failed:', cleaned.slice(0, 300))
      return NextResponse.json(
        { success: false, error: 'AI returned invalid format. Please try again.' },
        { status: 500 }
      )
    }

    analysis.analyzed_at = new Date().toISOString()
    console.log(`Analysis done: ${product.name} → ${analysis.health_rating} (${analysis.health_score}/10)`)

    if (product.barcode) {
      await supabaseAdmin
        .from('products')
        .update({
          ai_health_rating: analysis.health_rating,
          ai_analysis_json: analysis,
          ai_analyzed_at: analysis.analyzed_at,
        })
        .eq('barcode', product.barcode)
    }

    return NextResponse.json({
      success: true,
      data: analysis,
      cached: false,
      remaining: rateCheck.remaining - 1,
    })

  } catch (err: any) {
    console.error('Analyze error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

function buildPrompt(product: any): string {
  const n = product.nutrition || {}

  // Calculate some derived metrics to help Gemini
  const caloriesPer100g = n.calories || 0
  const proteinPer100g = n.protein || 0
  const carbsPer100g = n.carbs || 0
  const fatPer100g = n.fat || 0
  const sugarPer100g = n.sugar ?? null
  const sodiumMgPer100g = n.sodium ?? null
  const fiberPer100g = n.fiber ?? null

  // Nutrient density score hints for Gemini
  const isHighCalorie = caloriesPer100g > 450
  const isHighSugar = sugarPer100g !== null && sugarPer100g > 15
  const isHighSodium = sodiumMgPer100g !== null && sodiumMgPer100g > 500
  const isHighFat = fatPer100g > 25
  const isHighProtein = proteinPer100g > 15
  const isHighFiber = fiberPer100g !== null && fiberPer100g > 5
  const hasGoodProteinRatio = proteinPer100g > 10 && caloriesPer100g < 400

  const ingredients = product.ingredients_text || 'Not provided'
  const additives = (product.additives || []).join(', ') || 'None listed'
  const allergens = (product.allergens || []).join(', ') || 'None listed'

  return `You are Dr. Neha Sharma, a certified nutritionist and food safety expert with 15 years of experience analysing Indian packaged foods against FSSAI regulations and WHO guidelines.

Your task is to give a PRECISE, ACCURATE, and DIFFERENTIATED health analysis of this specific food product. Do NOT give generic scores — every product must be scored based on its actual nutritional data and ingredients.

═══ PRODUCT DETAILS ═══
Name: ${product.name}
Brand: ${product.brand || 'Unknown'}
Category: ${product.category || 'Packaged food'}
Country: ${product.country_of_origin || 'India'}

═══ NUTRITIONAL DATA (per 100g) ═══
Calories: ${caloriesPer100g} kcal ${isHighCalorie ? '⚠ HIGH' : caloriesPer100g < 200 ? '✓ LOW' : ''}
Protein: ${proteinPer100g}g ${isHighProtein ? '✓ GOOD' : proteinPer100g < 3 ? '⚠ LOW' : ''}
Carbohydrates: ${carbsPer100g}g
Sugar: ${sugarPer100g !== null ? sugarPer100g + 'g ' + (isHighSugar ? '⚠ HIGH' : sugarPer100g < 5 ? '✓ LOW' : '') : 'Not listed'}
Total Fat: ${fatPer100g}g ${isHighFat ? '⚠ HIGH' : ''}
Sodium: ${sodiumMgPer100g !== null ? sodiumMgPer100g + 'mg ' + (isHighSodium ? '⚠ HIGH' : sodiumMgPer100g < 120 ? '✓ LOW' : '') : 'Not listed'}
Dietary Fiber: ${fiberPer100g !== null ? fiberPer100g + 'g ' + (isHighFiber ? '✓ GOOD' : '') : 'Not listed'}

═══ INGREDIENTS ═══
${ingredients}

═══ ADDITIVES DETECTED ═══
${additives}

═══ ALLERGENS ═══
${allergens}

═══ DERIVED ANALYSIS HINTS ═══
- High calorie density: ${isHighCalorie ? 'YES — penalise score' : 'No'}
- High sugar content: ${isHighSugar ? 'YES — penalise score significantly' : 'No'}
- High sodium: ${isHighSodium ? 'YES — penalise score' : 'No'}
- High fat: ${isHighFat ? 'YES — penalise score' : 'No'}
- Good protein ratio: ${hasGoodProteinRatio ? 'YES — reward score' : 'No'}
- High fiber: ${isHighFiber ? 'YES — reward score' : 'No'}

═══ SCORING GUIDE — FOLLOW THIS STRICTLY ═══

Score 8.5–10.0 (Healthy) — Award ONLY to:
Plain nuts, seeds, oats, dal, legumes, plain milk, fresh/dried fruit with no added sugar, whole grain products with minimal processing, products with protein > 15g AND sugar < 5g AND sodium < 200mg

Score 7.0–8.4 (Healthy) — Award to:
Multi-grain biscuits with moderate sugar, roasted snacks with good ingredients, products with good protein, low sugar AND low sodium. Examples: Digestive biscuits, roasted chana, oatmeal

Score 5.5–6.9 (Moderate-Good) — Award to:
Products with one concerning ingredient but otherwise decent nutrition. Moderate calorie, moderate sodium OR moderate sugar but not both. Examples: Regular atta biscuits, some breakfast cereals, fortified products

Score 4.0–5.4 (Moderate-Poor) — Award to:
Products with multiple concerning nutrients OR artificial additives OR high sodium/sugar. Examples: Most flavoured biscuits, instant soups, processed cheese

Score 2.5–3.9 (Unhealthy) — Award to:
Products with seriously concerning ingredients: very high sugar (>25g), very high sodium (>800mg), trans fats, multiple harmful additives like E621/MSG, TBHQ, BHA, BHT, artificial colours. Examples: Regular chips, instant noodles, cream biscuits, energy drinks

Score 1.0–2.4 (Very Unhealthy) — Award to:
Products that are nutritionally empty AND contain harmful additives: ultra-processed snacks, candy, soda, heavily fried foods with trans fats and multiple artificial additives

═══ INGREDIENT FLAGS — CHECK EACH ONE ═══
If present in ingredients, these MUST appear as warnings:
- E621 / Monosodium Glutamate (MSG) → severity: medium
- TBHQ (Tertiary Butylhydroquinone) → severity: high
- BHA / BHT → severity: high
- Trans fat / Partially hydrogenated oils → severity: high
- Sodium nitrite / Sodium nitrate → severity: high
- Artificial colours (E102, E110, E122, E124, E129, E133) → severity: medium
- High Fructose Corn Syrup → severity: high
- Carrageenan → severity: low
- Sodium benzoate → severity: medium
- Any sugar listed in first 3 ingredients → severity: medium

═══ REQUIRED OUTPUT ═══
Return ONLY this exact JSON structure — no markdown, no code fences, no extra text:

{
  "health_rating": "healthy" or "moderate" or "unhealthy",
  "health_score": <precise decimal between 1.0 and 10.0, NOT 3.5 for everything>,
  "summary": "<2-3 sentences specifically about THIS product for an Indian consumer. Mention the product name. Be specific about what makes it healthy or unhealthy. Do not give generic advice.>",
  "detailed_breakdown": {
    "calories": "<good/moderate/high with specific comment>",
    "protein": "<good/low/adequate with specific comment>",
    "sugar": "<good/moderate/high/not listed with specific comment>",
    "sodium": "<good/moderate/high/not listed with specific comment>",
    "fat": "<good/moderate/high with specific comment>",
    "fiber": "<good/low/not listed with specific comment>",
    "processing_level": "minimally_processed or moderately_processed or ultra_processed",
    "overall_nutrient_density": "high or medium or low"
  },
  "safe_consumption": {
    "amount": "<specific amount with units, e.g. '1 small pack (26g)' or '2 biscuits (30g)'>",
    "frequency": "<specific frequency e.g. 'Daily is fine' or '2-3 times per week' or 'Max once a week' or 'Avoid entirely'>",
    "notes": "<specific note relevant to this product, e.g. 'Pair with protein-rich food to balance blood sugar' or null>"
  },
  "ingredient_warnings": [
    {
      "ingredient": "<exact ingredient name>",
      "concern": "<specific health concern for Indian consumers>",
      "severity": "high" or "medium" or "low"
    }
  ],
  "positives": ["<specific positive about this product, not generic>"],
  "healthier_alternatives": ["<specific Indian alternative, not generic>"],
  "fssai_compliance": "compliant or concern or unknown",
  "diabetic_suitability": "suitable or consume_with_caution or avoid",
  "bp_suitability": "suitable or consume_with_caution or avoid",
  "child_suitability": "suitable or consume_with_caution or avoid"
}

CRITICAL RULES:
1. health_score MUST reflect the actual nutritional data — do NOT default to 3.5
2. Products with sugar > 20g per 100g CANNOT score above 5.0
3. Products with trans fat CANNOT score above 4.0
4. Products with sodium > 800mg per 100g CANNOT score above 4.5
5. Plain nuts/seeds/oats should score 8.0+
6. Chips/instant noodles/cream biscuits should score 2.5–4.0
7. The summary MUST mention the product name
8. healthier_alternatives MUST be specific Indian foods, not generic advice`
}