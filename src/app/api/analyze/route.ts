import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

    // Pre-validation
    if (!body.product) {
      return NextResponse.json({ success: false, error: 'No product data provided' }, { status: 400 })
    }
    if (!body.product.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Product name is missing' }, { status: 400 })
    }
    if (!body.product.nutrition || typeof body.product.nutrition !== 'object') {
      return NextResponse.json({ success: false, error: 'Nutrition data is missing' }, { status: 400 })
    }

    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(' | ')
      console.error('Zod validation failed:', issues)
      return NextResponse.json({ success: false, error: 'Invalid product data', details: issues }, { status: 400 })
    }

    const { product, userProfile } = parsed.data

    // Fetch user profile from DB if not passed
    let profile = userProfile
    if (userId && !profile) {
      const { data: dbProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('age, weight_kg, height_cm, weight_goal, is_diabetic, has_bp, is_vegetarian, gender')
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

    // Cache check — only for barcode scans without personalization
    if (product.barcode && !profile) {
      const { data: cached } = await supabaseAdmin
        .from('products')
        .select('ai_analysis_json, ai_analyzed_at')
        .eq('barcode', product.barcode)
        .single()

      if (cached?.ai_analysis_json && cached?.ai_analyzed_at) {
        const ageMs = Date.now() - new Date(cached.ai_analyzed_at).getTime()
        if (ageMs < 7 * 24 * 60 * 60 * 1000) {
          console.log('Returning cached AI analysis for', product.name)
          return NextResponse.json({ success: true, data: cached.ai_analysis_json, cached: true })
        }
      }
    }

    const prompt = buildPrompt(product, profile)
    console.log(`Calling Gemini for: ${product.name} | prompt: ${prompt.length} chars`)

    const { text, usage } = await callGemini(prompt)
    console.log('Gemini raw (first 300):', text.slice(0, 300))

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let analysis: any
    try {
      analysis = JSON.parse(cleaned)
    } catch {
      console.error('JSON parse failed. Raw:', cleaned.slice(0, 400))
      return NextResponse.json(
        { success: false, error: 'AI returned invalid format. Please try again.' },
        { status: 500 }
      )
    }

    analysis.analyzed_at = new Date().toISOString()
    analysis.personalized = !!profile
    console.log(`✅ ${product.name} → ${analysis.health_rating} (${analysis.health_score}/10) | tokens: ${usage.inputTokens}in/${usage.outputTokens}out`)

    // Cache result for non-personalized barcode scans
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

    return NextResponse.json({ success: true, data: analysis, cached: false })

  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`GeminiError [${err.type}] status=${err.statusCode}:`, err.message)
      const isQuota = err.message.toLowerCase().includes('quota')
      switch (err.type) {
        case 'unavailable':
          return NextResponse.json(
            { success: false, error: 'Gemini AI is busy right now. Please wait 30 seconds and try again.', retryAfter: 30 },
            { status: 503 }
          )
        case 'rate_limit':
          return NextResponse.json(
            {
              success: false,
              error: isQuota
                ? 'Daily AI quota reached. Please try again tomorrow.'
                : 'Too many requests. Please wait a minute and try again.',
              rateLimited: true,
              retryAfter: isQuota ? 86400 : 60,
            },
            { status: 429 }
          )
        case 'timeout':
          return NextResponse.json(
            { success: false, error: 'AI analysis timed out. Please try again.' },
            { status: 504 }
          )
        case 'network':
          return NextResponse.json(
            { success: false, error: 'Network error reaching AI service. Please try again.' },
            { status: 502 }
          )
        default:
          return NextResponse.json(
            { success: false, error: 'AI service temporarily unavailable. Please try again.' },
            { status: 500 }
          )
      }
    }
    console.error('Analyze error:', err.message)
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

// ─── OPTIMIZED PROMPT ──────────────────────────────────────────────────────────
// Reduced from ~4000 tokens to ~1400 tokens. Same output schema, tighter instructions.
function buildPrompt(product: any, userProfile?: any): string {
  const n = product.nutrition || {}
  const cal = n.calories ?? 0
  const pro = n.protein ?? 0
  const fat = n.fat ?? 0
  const sugar = n.sugar ?? null
  const sodium = n.sodium ?? null
  const fiber = n.fiber ?? null

  // Pre-compute flags to shorten prompt text
  const flags = [
    cal > 450 ? 'HIGH_CAL' : cal < 200 ? 'LOW_CAL' : null,
    pro > 15 ? 'HIGH_PROTEIN' : pro < 3 ? 'LOW_PROTEIN' : null,
    sugar !== null ? (sugar > 15 ? 'HIGH_SUGAR' : sugar < 5 ? 'LOW_SUGAR' : null) : 'SUGAR_UNKNOWN',
    fat > 25 ? 'HIGH_FAT' : null,
    sodium !== null ? (sodium > 500 ? 'HIGH_SODIUM' : sodium < 120 ? 'LOW_SODIUM' : null) : 'SODIUM_UNKNOWN',
    fiber !== null && fiber > 5 ? 'HIGH_FIBER' : null,
  ].filter(Boolean).join(', ')

  const userSection = userProfile
    ? `USER: age=${userProfile.age || '?'}, BMI=${userProfile.bmi || '?'}, gender=${userProfile.gender || '?'}, goal=${userProfile.weight_goal || 'maintain'}, diabetic=${userProfile.is_diabetic ? 'YES' : 'no'}, highBP=${userProfile.has_bp ? 'YES' : 'no'}, vegetarian=${userProfile.is_vegetarian ? 'yes' : 'no'}`
    : `USER: no profile — use general Indian adult guidelines`

  return `You are a certified Indian nutritionist and food safety expert. Analyze this packaged food against FSSAI, WHO, and ICMR guidelines.

${userSection}

PRODUCT: ${product.name} | Brand: ${product.brand || 'Unknown'} | Category: ${product.category || 'Packaged food'}

NUTRITION per 100g:
cal=${cal}kcal, protein=${pro}g, carbs=${n.carbs ?? 0}g, fat=${fat}g, sugar=${sugar ?? 'NL'}g, sodium=${sodium ?? 'NL'}mg, fiber=${fiber ?? 'NL'}g
FLAGS: ${flags || 'none'}

INGREDIENTS: ${product.ingredients_text || 'Not provided'}
ADDITIVES: ${(product.additives || []).join(', ') || 'none'}
ALLERGENS: ${(product.allergens || []).join(', ') || 'none'}

SCORING RULES (strictly follow):
- 8.5–10: Plain nuts/seeds/oats/dal/legumes/whole grain, protein>15 AND sugar<5 AND sodium<200
- 7–8.4: Multi-grain, roasted snacks, good protein + low sugar + low sodium
- 5.5–6.9: One concern (moderate sodium OR sugar, not both)
- 4–5.4: Multiple concerns OR artificial additives OR high sodium/sugar
- 2.5–3.9: Very high sugar>25g OR sodium>800mg OR trans fats OR multiple harmful additives
- 1–2.4: Ultra-processed, nutritionally empty, candy/soda/fried
- Trans fat present → max score 4.0
- Sugar>20g → max score 5.0
- Sodium>800mg → max score 4.5
- Chips/instant noodles/cream biscuits → score must be 2.5–4.0

HARMFUL INGREDIENTS to detect (flag only if actually present in ingredients text):
MSG/E621, TBHQ/E319, BHA/E320, BHT/E321, Sodium Benzoate/E211, Carrageenan/E407, Sodium Nitrite/E250, Tartrazine/E102, Sunset Yellow/E110, Carmoisine/E122, Ponceau 4R/E124, Allura Red/E129, HFCS, Partially Hydrogenated Oils/Trans Fat, Acesulfame K/E950, Aspartame/E951, Sucralose/E955, Refined Palm Oil, Maida/Refined Wheat Flour

For each harmful ingredient found, include: exact name, concern (1 sentence, scientific basis), severity (high/medium/low), source org (WHO/FSSAI/IARC/EFSA), real source URL, global safe limit, amount in product, personalized limit for this user, % of daily limit.

PERSONALIZATION adjustments for safe limits:
- Age<18: reduce adult limit by 50%; Age>60: reduce by 25%
- BMI>30: reduce sugar+fat limits 30%; BMI 25-30: reduce sugar 20%
- Diabetic: sugar from product <5g/serving, sodium halved
- High BP: sodium from product <200mg/serving

HEALTHIER ALTERNATIVES: 4–5 specific Indian substitutes (branded or homemade), directly replacing this product category, with clear nutritional reason.

RETURN ONLY this JSON (no markdown, no code fences):
{
  "health_rating": "healthy"|"moderate"|"unhealthy",
  "health_score": <1.0–10.0 decimal, NOT a generic 3.5>,
  "health_score_breakdown": {
    "nutrition_score": <1–10>,
    "ingredient_safety_score": <1–10>,
    "processing_score": <1–10>,
    "overall": <weighted average>
  },
  "summary": "<2–3 sentences mentioning the product name, for an Indian consumer>",
  "detailed_breakdown": {
    "calories": "<comment>",
    "protein": "<comment>",
    "sugar": "<comment>",
    "sodium": "<comment>",
    "fat": "<comment>",
    "fiber": "<comment>",
    "processing_level": "minimally_processed"|"moderately_processed"|"ultra_processed",
    "overall_nutrient_density": "high"|"medium"|"low"
  },
  "safe_consumption": {
    "amount": "<e.g. 1 small pack (26g)>",
    "frequency": "<e.g. Max once a week>",
    "notes": "<or null>",
    "personalized_for_user": "<specific advice using their BMI/age/conditions or null>"
  },
  "harmful_ingredients": [
    {
      "name": "<exact label name>",
      "also_known_as": ["<aliases>"],
      "found_in_product": true,
      "concern": "<1–2 sentences, science-backed>",
      "severity": "high"|"medium"|"low",
      "scientific_source": "<org + year>",
      "source_url": "<real URL>",
      "global_safe_limit": "<WHO/FSSAI limit>",
      "amount_in_this_product": "<e.g. 680mg per 100g>",
      "personalized_safe_limit": "<e.g. max 1 serving/day for your BMI>",
      "percentage_of_daily_limit": "<e.g. 34% of daily limit>"
    }
  ],
  "ingredient_warnings": [
    { "ingredient": "<name>", "concern": "<concern>", "severity": "high"|"medium"|"low" }
  ],
  "positives": ["<specific positive about THIS product>"],
  "long_term_risks": ["<3–5 specific evidence-based risks from regular consumption of THIS product>"],
  "healthier_alternatives": [
    {
      "name": "<specific Indian food or brand>",
      "reason": "<nutritional reason>",
      "availability": "widely_available"|"supermarket"|"homemade",
      "type": "branded"|"homemade"|"whole_food"
    }
  ],
  "fssai_compliance": "compliant"|"concern"|"unknown",
  "diabetic_suitability": "suitable"|"consume_with_caution"|"avoid",
  "bp_suitability": "suitable"|"consume_with_caution"|"avoid",
  "child_suitability": "suitable"|"consume_with_caution"|"avoid",
  "pregnancy_suitability": "suitable"|"consume_with_caution"|"avoid"
}`
}