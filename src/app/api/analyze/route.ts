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
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid product data: ' + parsed.error.issues.map(i => i.message).join(', ') },
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
          console.log('Returning cached AI analysis for:', product.name)
          return NextResponse.json({ success: true, data: cached.ai_analysis_json, cached: true })
        }
      }
    }
 
    const prompt = buildPrompt(normalizedProduct, profile)
    console.log('Calling Gemini AI for:', product.name)
 
    const { text, usage } = await callGemini(prompt, undefined, { maxTokens: 12000 })
 
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
    let analysis
    try {
      analysis = JSON.parse(cleaned)
    } catch {
      console.error('JSON parse failed. Raw:', cleaned.slice(0, 500))
      return NextResponse.json(
        { success: false, error: 'AI returned invalid format. Please try again.' },
        { status: 500 }
      )
    }
 
    analysis.analyzed_at = new Date().toISOString()
    analysis.personalized = !!profile
    console.log(`Analysis done: ${product.name} → ${analysis.health_rating} (${analysis.health_score}/10) | Tokens: ${usage.inputTokens}in/${usage.outputTokens}out`)
 
    if (product.barcode && !profile) {
      await supabaseAdmin
        .from('products')
        .update({
          ai_health_rating: analysis.health_rating,
          ai_analysis_json: analysis,
          ai_analyzed_at:   analysis.analyzed_at,
        })
        .eq('barcode', product.barcode)
    }
 
    return NextResponse.json({ success: true, data: analysis, cached: false })
 
  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`GeminiError [${err.type}]:`, err.message)
      switch (err.type) {
        case 'rate_limit': return NextResponse.json({ success: false, error: 'AI service is busy. Please wait a moment and try again.', rateLimited: true }, { status: 429 })
        case 'timeout':    return NextResponse.json({ success: false, error: 'AI analysis timed out. Please try again.' }, { status: 504 })
        case 'network':    return NextResponse.json({ success: false, error: 'Network error connecting to AI. Please try again.' }, { status: 502 })
        default:           return NextResponse.json({ success: false, error: 'AI service temporarily unavailable.' }, { status: 500 })
      }
    }
    console.error('Analyze error:', err.message)
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
 
function buildPrompt(product: any, userProfile?: any): string {
  const n = product.nutrition || {}
  const cal     = n.calories ?? 0
  const protein = n.protein  ?? 0
  const carbs   = n.carbs    ?? 0
  const fat     = n.fat      ?? 0
  const sugar   = n.sugar    ?? null
  const sodium  = n.sodium   ?? null
  const fiber   = n.fiber    ?? null
 
  const ingredients = product.ingredients_text || 'Not provided'
  const additives   = (product.additives || []).join(', ') || 'None listed'
  const allergens   = (product.allergens || []).join(', ') || 'None listed'
 
  const userSection = userProfile ? `
═══ USER HEALTH PROFILE ═══
Age: ${userProfile.age || 'Unknown'}
BMI: ${userProfile.bmi || 'Unknown'} ${userProfile.bmi ? (userProfile.bmi < 18.5 ? '(Underweight)' : userProfile.bmi < 25 ? '(Normal)' : userProfile.bmi < 30 ? '(Overweight)' : '(Obese)') : ''}
Gender: ${userProfile.gender || 'Unknown'}
Weight Goal: ${userProfile.weight_goal || 'maintain'}
Diabetic: ${userProfile.is_diabetic ? 'YES — flag sugar/carb concerns prominently' : 'No'}
High Blood Pressure: ${userProfile.has_bp ? 'YES — flag sodium concerns prominently' : 'No'}
Vegetarian: ${userProfile.is_vegetarian ? 'YES' : 'No'}
Calculate ALL safe consumption limits specific to this person's age, BMI, and health conditions.
` : `
═══ USER PROFILE ═══
No profile — provide general limits for an average Indian adult.
`
 
  return `You are Dr. Neha Sharma, a certified Indian nutritionist and food safety expert. Analyse this packaged food product for an Indian consumer using FSSAI, WHO, ICMR, and international food safety guidelines.
 
${userSection}
 
═══ PRODUCT ═══
Name: ${product.name}
Brand: ${product.brand || 'Unknown'}
Category: ${product.category || 'Packaged food'}
Country: ${product.country_of_origin || 'India'}
 
═══ NUTRITION (per 100g) ═══
Calories:  ${cal}     kcal ${cal > 450 ? '⚠ HIGH'    : cal < 200 ? '✓ LOW' : ''}
Protein:   ${protein} g    ${protein > 15 ? '✓ GOOD' : protein < 3 ? '⚠ LOW' : ''}
Carbs:     ${carbs}   g
Sugar:     ${sugar  !== null ? sugar  + 'g ' + (sugar  > 15 ? '⚠ HIGH' : sugar < 5 ? '✓ LOW' : '')         : 'Not listed'}
Fat:       ${fat}     g    ${fat > 25 ? '⚠ HIGH' : ''}
Sodium:    ${sodium !== null ? sodium + 'mg ' + (sodium > 500 ? '⚠ HIGH' : sodium < 120 ? '✓ LOW' : '')     : 'Not listed'}
Fiber:     ${fiber  !== null ? fiber  + 'g ' + (fiber  > 5  ? '✓ GOOD' : '')                                : 'Not listed'}
 
═══ INGREDIENTS ═══
${ingredients}
 
═══ ADDITIVES ═══
${additives}
 
═══ ALLERGENS ═══
${allergens}
 
═══ SCORING RULES — FOLLOW EXACTLY ═══
8.5–10  → Plain nuts/seeds/oats/dal/legumes/plain milk, minimal processing, protein>15g AND sugar<5g AND sodium<200mg
7.0–8.4 → Multi-grain, roasted snacks with good ingredients, good protein + low sugar + low sodium
5.5–6.9 → One concern but otherwise decent
4.0–5.4 → Multiple concerns OR artificial additives OR high sodium/sugar
2.5–3.9 → Sugar>25g OR sodium>800mg OR trans fats OR multiple harmful additives
1.0–2.4 → Nutritionally empty AND harmful additives
 
MANDATORY OVERRIDES:
- Chips/namkeen/fried snacks with sodium>800mg per 100g → score MUST be 2.5–4.0
- Any trans fat present → score CANNOT exceed 4.0
- Sugar>20g per 100g → score CANNOT exceed 5.0
- Instant noodles/cream biscuits → score MUST be 2.5–4.0
 
═══ HARMFUL SUBSTANCES — CHECK EVERY ONE ═══
Flag if ACTUALLY present in the ingredients text:
- MSG/E621 → WHO/FSSAI — excitotoxin, headaches
- TBHQ/E319 → National Toxicology Program — cancer risk (animal studies)
- BHA/E320 → IARC Group 2B — endocrine disruptor
- BHT/E321 → EFSA — possible carcinogen
- Sodium Benzoate/E211 → WHO — forms benzene with Vitamin C
- Carrageenan/E407 → gut inflammation
- Sodium Nitrite/E250 → IARC Group 1 carcinogen
- Tartrazine/E102 → EFSA 2009 — hyperactivity in children
- Sunset Yellow/E110 → EFSA — hyperactivity, allergic reactions
- HFCS — obesity, insulin resistance, fatty liver
- Trans fat/Partially Hydrogenated Oils → WHO — heart disease
- Potassium Bromate/E924 → IARC Group 2B
- Aspartame/E951 → IARC 2023 Group 2B
- Maida/Refined Wheat Flour → ICMR — high glycaemic index
- High sodium (>400mg/100g) — cardiovascular risk
- High sugar (>10g/100g) — diabetes, obesity risk
 
═══ REQUIRED OUTPUT — RAW JSON ONLY, NO MARKDOWN ═══
{
  "health_rating": "healthy" or "moderate" or "unhealthy",
  "health_score": <decimal 1.0–10.0 following rules above>,
  "health_score_breakdown": {
    "nutrition_score": <1–10>,
    "ingredient_safety_score": <1–10>,
    "processing_score": <1–10, 10=minimal processing>,
    "overall": <weighted average>
  },
  "summary": "<2–3 sentences about THIS specific product for Indian consumer. MUST name the product.>",
  "detailed_breakdown": {
    "calories": "<specific comment>",
    "protein": "<specific comment>",
    "sugar": "<specific comment>",
    "sodium": "<specific comment>",
    "fat": "<specific comment>",
    "fiber": "<specific comment>",
    "processing_level": "minimally_processed or moderately_processed or ultra_processed",
    "overall_nutrient_density": "high or medium or low"
  },
  "safe_consumption": {
    "amount": "<specific amount e.g. '15–20g (about 10 chips)'>",
    "frequency": "<specific e.g. 'Once a week maximum'>",
    "notes": "<general note for Indian adults>",
    "personalized_for_user": "<advice specific to this user's profile, or null>"
  },
  "harmful_ingredients": [
    {
      "name": "<exact name from label>",
      "also_known_as": ["<other names>"],
      "found_in_product": true,
      "concern": "<specific health concern backed by science, 1–2 sentences>",
      "severity": "high or medium or low",
      "scientific_source": "<organisation or study>",
      "source_url": "<real URL to health authority>",
      "global_safe_limit": "<e.g. WHO: max 2000mg sodium/day for adults>",
      "amount_in_this_product": "<e.g. 826mg sodium per 100g>",
      "personalized_safe_limit": "<limit specific to this user's age and BMI>",
      "percentage_of_daily_limit": "<e.g. 41% of daily sodium limit per 100g>"
    }
  ],
  "ingredient_warnings": [
    { "ingredient": "<name>", "concern": "<concern>", "severity": "high or medium or low" }
  ],
  "long_term_risks": [
    "<Evidence-based health consequence of eating THIS product regularly. Be specific to its actual ingredients and nutrition. Minimum 3, maximum 5. Example: 'The 826mg sodium per 100g — 41% of the daily WHO limit in a single small pack — significantly elevates blood pressure and cardiovascular disease risk with regular consumption, especially for Indians who already consume excess sodium in their diet.'>"
  ],
  "positives": ["<specific positive about this product, or empty array []>"],
  "healthier_alternatives": [
    {
      "name": "<specific product/food available in Indian markets>",
      "reason": "<specific reason why it is healthier>",
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
 
ABSOLUTE RULES:
1. Return ONLY raw JSON — no backticks, no markdown, no "here is the analysis"
2. long_term_risks MUST have 3–5 SPECIFIC risks tied to THIS product's actual data
3. harmful_ingredients MUST only list substances ACTUALLY in this product's ingredients
4. healthier_alternatives MUST have 4–5 options available in India
5. health_score MUST follow the mandatory overrides above
6. summary MUST mention the product name`
}