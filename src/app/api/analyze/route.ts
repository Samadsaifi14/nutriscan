import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'
import { callGemini, GeminiError } from '@/lib/gemini'

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
  userProfile: z.object({
    age: z.number().optional(),
    bmi: z.number().optional(),
    weight_goal: z.string().optional(),
    is_diabetic: z.boolean().optional(),
    has_bp: z.boolean().optional(),
    is_vegetarian: z.boolean().optional(),
    gender: z.string().optional(),
  }).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    const rateLimitKey = userId || req.headers.get('x-forwarded-for') || 'anonymous'

    const rateCheck = await checkRateLimit(rateLimitKey, 'analyze')
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Analysis limit reached. Please wait ${rateCheck.resetIn} minutes.`, rateLimited: true },
        { status: 429 }
      )
    }

    const body = await req.json()

    // ── DIAGNOSTIC: Log exactly what we receive ───────────────────────────────
    console.log('Analyze API — raw body keys:', Object.keys(body))
    console.log('Analyze API — product keys:', Object.keys(body.product || {}))
    console.log('Analyze API — nutrition:', JSON.stringify(body.product?.nutrition))

    // ── PRE-VALIDATION: Catch common issues before Zod ───────────────────────
    if (!body.product) {
      console.error('PRE-VALID FAIL: body.product is missing')
      return NextResponse.json(
        { success: false, error: 'No product data provided', details: 'body.product is missing' },
        { status: 400 }
      )
    }
    if (!body.product.name || typeof body.product.name !== 'string' || body.product.name.trim() === '') {
      console.error('PRE-VALID FAIL: product.name is empty or invalid:', body.product.name)
      return NextResponse.json(
        { success: false, error: 'Product name is missing', details: `product.name = "${body.product.name}"` },
        { status: 400 }
      )
    }
    if (!body.product.nutrition || typeof body.product.nutrition !== 'object') {
      console.error('PRE-VALID FAIL: product.nutrition is missing or not an object')
      return NextResponse.json(
        { success: false, error: 'Nutrition data is missing', details: 'product.nutrition is missing' },
        { status: 400 }
      )
    }

    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      const issueSummary = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(' | ')
      console.error('Zod validation FAILED:', issueSummary)
      console.error('Zod raw data:', JSON.stringify(body, null, 2))
      return NextResponse.json(
        { success: false, error: 'Invalid product data', details: issueSummary },
        { status: 400 }
      )
    }

    const { product, userProfile } = parsed.data

    const normalizedProduct = {
      ...product,
      brand: product.brand ?? undefined,
      category: product.category ?? undefined,
      country_of_origin: product.country_of_origin ?? undefined,
      image_url: product.image_url ?? undefined,
      ingredients_text: product.ingredients_text ?? undefined,
      allergens: product.allergens ?? undefined,
      additives: product.additives ?? undefined,
    }

    let profile = userProfile
    if (userId && !profile) {
      const { data: dbProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('age, weight_kg, height_cm, weight_goal, is_diabetic, has_bp, is_vegetarian, gender, daily_calorie_goal')
        .eq('user_id', userId)
        .single()

      if (dbProfile) {
        let bmi = null
        if (dbProfile.weight_kg && dbProfile.height_cm) {
          const h = dbProfile.height_cm / 100
          bmi = parseFloat((dbProfile.weight_kg / (h * h)).toFixed(1))
        }
        profile = {
          age: dbProfile.age || undefined,
          bmi: bmi || undefined,
          weight_goal: dbProfile.weight_goal || undefined,
          is_diabetic: dbProfile.is_diabetic || false,
          has_bp: dbProfile.has_bp || false,
          is_vegetarian: dbProfile.is_vegetarian || false,
          gender: dbProfile.gender || undefined,
        }
      }
    }

    if (product.barcode && !profile) {
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

    const prompt = buildPrompt(normalizedProduct, profile)
    console.log('Calling Gemini AI for:', product.name)
    console.log('Prompt length:', prompt.length, 'chars')

    const { text, usage } = await callGemini(prompt)
    console.log('Gemini raw response (first 500 chars):', text.slice(0, 500))

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
    console.log('Cleaned JSON length:', cleaned.length, 'chars')

    let analysis
    try {
      analysis = JSON.parse(cleaned)
      console.log('JSON parsed OK — keys:', Object.keys(analysis))
    } catch {
      console.error('JSON parse FAILED. Raw response:', cleaned.slice(0, 500))
      return NextResponse.json(
        { success: false, error: 'AI returned invalid format. Please try again.', details: cleaned.slice(0, 200) },
        { status: 500 }
      )
    }

    analysis.analyzed_at = new Date().toISOString()
    analysis.personalized = !!profile
    console.log(`✅ Analysis done: ${product.name} → ${analysis.health_rating} (${analysis.health_score}/10) | Tokens: ${usage.inputTokens}in/${usage.outputTokens}out`)
    console.log(`  harmful_ingredients: ${analysis.harmful_ingredients?.length || 0}`)
    console.log(`  healthier_alternatives: ${analysis.healthier_alternatives?.length || 0}`)
    console.log(`  summary: ${analysis.summary?.slice(0, 100)}...`)

    if (product.barcode && !profile) {
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
    })

  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`GeminiError [${err.type}]:`, err.message)
      switch (err.type) {
        case 'unavailable':
          return NextResponse.json(
            { success: false, error: 'Gemini AI is temporarily overloaded. Please wait 30 seconds and try again.', details: 'This is a temporary issue on our end.' },
            { status: 503 }
          )
        case 'rate_limit':
          return NextResponse.json(
            { success: false, error: 'AI service is busy. Please wait a moment and try again.', rateLimited: true },
            { status: 429 }
          )
        case 'timeout':
          return NextResponse.json(
            { success: false, error: 'AI analysis timed out. Please try again.' },
            { status: 504 }
          )
        case 'network':
          return NextResponse.json(
            { success: false, error: 'Network error connecting to AI service. Please try again.' },
            { status: 502 }
          )
        case 'invalid_response':
          return NextResponse.json(
            { success: false, error: 'AI returned an unexpected response. Please try again.' },
            { status: 500 }
          )
        default:
          return NextResponse.json(
            { success: false, error: 'AI service temporarily unavailable. Please try again.' },
            { status: 500 }
          )
      }
    }

    console.error('Analyze error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

function buildPrompt(product: any, userProfile?: any): string {
  const n = product.nutrition || {}

  const caloriesPer100g = n.calories || 0
  const proteinPer100g = n.protein || 0
  const carbsPer100g = n.carbs || 0
  const fatPer100g = n.fat || 0
  const sugarPer100g = n.sugar ?? null
  const sodiumMgPer100g = n.sodium ?? null
  const fiberPer100g = n.fiber ?? null

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

  const userSection = userProfile ? `
═══ USER HEALTH PROFILE (personalise all recommendations for this person) ═══
Age: ${userProfile.age || 'Unknown'}
BMI: ${userProfile.bmi || 'Unknown'} ${userProfile.bmi ? (userProfile.bmi < 18.5 ? '(Underweight)' : userProfile.bmi < 25 ? '(Normal)' : userProfile.bmi < 30 ? '(Overweight)' : '(Obese)') : ''}
Gender: ${userProfile.gender || 'Unknown'}
Weight Goal: ${userProfile.weight_goal || 'maintain'}
Diabetic: ${userProfile.is_diabetic ? 'YES — flag any sugar/carb concerns prominently' : 'No'}
High Blood Pressure: ${userProfile.has_bp ? 'YES — flag any sodium concerns prominently' : 'No'}
Vegetarian: ${userProfile.is_vegetarian ? 'YES' : 'No'}

Based on this profile, calculate safe consumption limits that are SPECIFIC to this person's age, BMI and health conditions.
` : `
═══ USER PROFILE ═══
No profile available — provide general safe consumption limits for an average Indian adult.
`

  return `You are Dr. Neha Sharma, a certified nutritionist and food safety expert with 15 years of experience analysing Indian packaged foods against FSSAI, WHO, ICMR and international food safety guidelines.

Your task is to give a PRECISE, ACCURATE, PERSONALISED, and EVIDENCE-BASED health analysis of this specific food product. Every score, every warning, every recommendation must be grounded in actual nutritional data and scientific evidence.

${userSection}

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

═══ SCORING GUIDE — FOLLOW THIS STRICTLY ═══

Score 8.5–10.0 (Healthy) — ONLY for:
Plain nuts, seeds, oats, dal, legumes, plain milk, whole grain products with minimal processing, protein > 15g AND sugar < 5g AND sodium < 200mg

Score 7.0–8.4 (Healthy) — For:
Multi-grain products with moderate sugar, roasted snacks with good ingredients, good protein + low sugar + low sodium. Examples: Digestive biscuits, roasted chana, oatmeal

Score 5.5–6.9 (Moderate) — For:
One concerning ingredient but otherwise decent. Moderate calorie, moderate sodium OR moderate sugar but not both.

Score 4.0–5.4 (Moderate-Poor) — For:
Multiple concerning nutrients OR artificial additives OR high sodium/sugar. Examples: Flavoured biscuits, instant soups

Score 2.5–3.9 (Unhealthy) — For:
Very high sugar >25g, very high sodium >800mg, trans fats, multiple harmful additives. Examples: Regular chips, instant noodles, cream biscuits

Score 1.0–2.4 (Very Unhealthy) — For:
Nutritionally empty AND harmful additives: ultra-processed snacks, candy, soda, heavily fried foods

═══ HARMFUL INGREDIENTS DATABASE — CHECK EACH ONE IN THE INGREDIENTS LIST ═══

For EVERY harmful substance found in the ingredients, you MUST include it in harmful_ingredients with:
- The exact name as it appears on the label
- Scientific evidence from WHO, FSSAI, ICMR, PubMed, or major health authorities
- A valid source URL (use real URLs from WHO, FSSAI, or well-known health institutions)
- The safe daily limit
- A personalised safe limit for THIS user based on their age and BMI

SUBSTANCES TO DETECT AND FLAG:

ADDITIVES:
- E621 / MSG / Monosodium Glutamate → Source: WHO, FSSAI; concern: excitotoxin, may trigger headaches, high sodium contribution
- TBHQ (E319) → Source: National Toxicology Program USA; concern: linked to cancer in animal studies, oxidative stress
- BHA (E320) → Source: IARC Group 2B possible carcinogen; concern: endocrine disruptor
- BHT (E321) → Source: EFSA; concern: possible carcinogen, liver enzyme disruption
- Sodium Benzoate (E211) → Source: WHO; concern: forms benzene with Vitamin C, possible carcinogen
- Carrageenan (E407) → Source: Cornucopia Institute; concern: gut inflammation
- Sodium Nitrite (E250) → Source: IARC Group 1 carcinogen when processed; concern: forms nitrosamines
- Artificial colours E102/Tartrazine → Source: EFSA 2009; concern: hyperactivity in children, allergic reactions
- E110/Sunset Yellow → Source: EFSA; concern: hyperactivity, allergic reactions
- E122/Carmoisine → Source: EFSA; concern: hyperactivity in children
- E124/Ponceau 4R → Source: EFSA; concern: hyperactivity, banned in USA
- E129/Allura Red → Source: EFSA; concern: hyperactivity in children
- High Fructose Corn Syrup / HFCS → Source: American Journal of Clinical Nutrition; concern: obesity, insulin resistance, fatty liver
- Partially Hydrogenated Oils / Trans Fat → Source: WHO; concern: increases LDL cholesterol, heart disease risk, WHO recommends elimination
- Potassium Bromate (E924) → Source: IARC Group 2B; concern: possible carcinogen, banned in EU and India but check
- Acesulfame K (E950) → Source: EFSA; concern: possible effects on gut microbiome
- Aspartame (E951) → Source: IARC 2023 classified possible carcinogen Group 2B; concern: phenylketonuria risk
- Sucralose (E955) → Source: Journal of Toxicology 2023; concern: possible gut microbiome disruption
- Refined Palm Oil → Source: WHO; concern: high saturated fat, environmental concern
- Maida/Refined Wheat Flour → Source: ICMR; concern: high glycaemic index, spikes blood sugar

NUTRIENTS OF CONCERN:
- Sugar > 10g per 100g → Source: WHO recommends < 10% of daily calories from free sugars
- Sodium > 400mg per 100g → Source: WHO recommends < 2000mg sodium per day
- Saturated fat > 5g per 100g → Source: American Heart Association
- Trans fat any amount → Source: WHO global elimination target

═══ PERSONALISED SAFE LIMITS CALCULATION ═══

For each harmful ingredient found, calculate a safe daily limit specifically for this user:

Age adjustments:
- Children (< 18): Reduce adult safe limit by 50%
- Adults (18-60): Use standard WHO/FSSAI limits
- Senior (> 60): Reduce adult safe limit by 25%

BMI adjustments:
- BMI > 30 (Obese): Reduce sugar and fat limits by 30%
- BMI 25-30 (Overweight): Reduce sugar limits by 20%
- BMI < 18.5 (Underweight): Standard limits apply

Health condition adjustments:
- Diabetic: Sugar from this product should be < 5g per serving. Sodium limit halved.
- High BP: Sodium from this product should be < 200mg per serving.

═══ HEALTHIER ALTERNATIVES ═══

Provide 4-5 specific Indian alternatives that:
1. Are easily available in Indian markets
2. Directly substitute this product category
3. Have better nutritional profiles
4. Include both branded and homemade options where possible
5. Are specific to the product (not generic "eat more vegetables")

═══ REQUIRED JSON OUTPUT ═══
Return ONLY this JSON — no markdown, no code fences, no extra text:

{
  "health_rating": "healthy" or "moderate" or "unhealthy",
  "health_score": <precise decimal 1.0-10.0, NOT generic 3.5>,
  "health_score_breakdown": {
    "nutrition_score": <1-10, based purely on macros>,
    "ingredient_safety_score": <1-10, based on additives and harmful ingredients>,
    "processing_score": <1-10, 10 = minimally processed, 1 = ultra processed>,
    "overall": <weighted average>
  },
  "summary": "<2-3 sentences specifically about THIS product for an Indian consumer. Mention the product name. Be specific.>",
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
    "amount": "<specific amount with units e.g. '1 small pack (26g)' or '2 biscuits (30g)'>",
    "frequency": "<specific frequency e.g. 'Daily is fine' or '2-3 times per week' or 'Max once a week' or 'Avoid entirely'>",
    "notes": "<personalised note based on user profile or null>",
    "personalized_for_user": "<if user profile available: specific advice like 'Given your BMI of X and diabetic condition, limit to 1 biscuit per day' or null>"
  },
  "harmful_ingredients": [
    {
      "name": "<exact name as on label>",
      "also_known_as": ["<other names this ingredient goes by>"],
      "found_in_product": true,
      "concern": "<specific health concern, 1-2 sentences, backed by science>",
      "severity": "high" or "medium" or "low",
      "scientific_source": "<name of the organisation or study e.g. WHO 2015, IARC 2023, EFSA 2009, FSSAI regulation>",
      "source_url": "<real URL to the source e.g. https://www.who.int/news-room/fact-sheets/detail/salt-reduction>",
      "global_safe_limit": "<e.g. WHO recommends max 2000mg sodium per day for adults>",
      "amount_in_this_product": "<e.g. This product contains 680mg sodium per 100g>",
      "personalized_safe_limit": "<e.g. For your age and BMI, max 1 serving (30g) per day = 204mg sodium from this product>",
      "percentage_of_daily_limit": "<e.g. 100g of this product = 34% of your daily sodium limit>"
    }
  ],
  "ingredient_warnings": [
    {
      "ingredient": "<exact ingredient name>",
      "concern": "<specific health concern>",
      "severity": "high" or "medium" or "low"
    }
  ],
  "positives": ["<specific positive about THIS product, not generic>"],
  "long_term_risks": [
    "<specific, evidence-based health consequence of consuming this product regularly>"
  ],
  "healthier_alternatives": [
    {
      "name": "<specific product or food name>",
      "reason": "<why it is better, specific nutritional reason>",
      "availability": "widely_available or supermarket or homemade",
      "type": "branded or homemade or whole_food"
    }
  ],
  "fssai_compliance": "compliant or concern or unknown",
  "diabetic_suitability": "suitable or consume_with_caution or avoid",
  "bp_suitability": "suitable or consume_with_caution or avoid",
  "child_suitability": "suitable or consume_with_caution or avoid",
  "pregnancy_suitability": "suitable or consume_with_caution or avoid"
}

LONG-TERM RISKS RULES:
- Provide 3-5 specific, evidence-based long-term health consequences of consuming THIS product regularly
- Each risk must be tied to the actual harmful ingredients or nutritional profile found in THIS specific product
- Base risks only on actual ingredients_text and nutrition data provided
- If the product is healthy (score > 7), risks can be minimal — reference over-consumption only
- Do NOT fabricate risks. Only include risks with scientific backing
- Write in plain language an Indian consumer can understand
- Example good risk: "Regular consumption of Sodium Benzoate (E211) combined with Vitamin C can form benzene, a known carcinogen linked to increased cancer risk with long-term exposure."
- Example bad risk: "May cause health issues." — NEVER write this

CRITICAL RULES — VIOLATING THESE IS NOT ACCEPTABLE:
1. health_score MUST be based on actual nutrition data — NOT a default 3.5
2. Sugar > 20g per 100g → score CANNOT exceed 5.0
3. Trans fat present → score CANNOT exceed 4.0
4. Sodium > 800mg per 100g → score CANNOT exceed 4.5
5. Plain nuts/seeds/oats → score MUST be 8.0+
6. Chips/instant noodles/cream biscuits → score MUST be 2.5-4.0
7. summary MUST mention the product name
8. source_url MUST be a real URL to a real health organisation
9. harmful_ingredients MUST only list ingredients actually present in this product's ingredient list
10. healthier_alternatives MUST be specific Indian foods or brands, never generic
11. personalized_safe_limit MUST account for the user's actual age and BMI if provided`
}