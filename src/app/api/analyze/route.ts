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
    // Auth check
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'You must be signed in to analyse products' },
        { status: 401 }
      )
    }

    // Rate limit check
    const rateCheck = await checkRateLimit(userId, 'analyze')
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `You have reached the analysis limit. Please wait ${rateCheck.resetIn} minutes before trying again.`,
          rateLimited: true,
        },
        { status: 429 }
      )
    }

    // Validate request body
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid product data: ' + parsed.error.issues.map(i => i.message).join(', ')
        },
        { status: 400 }
      )
    }

    const { product } = parsed.data

    // Check 7 day cache first
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
          return NextResponse.json({
            success: true,
            data: cached.ai_analysis_json,
            cached: true
          })
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
          generationConfig: { temperature: 0.3, maxOutputTokens: 8000 }
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
      console.log('JSON parse failed:', cleaned.slice(0, 200))
      return NextResponse.json(
        { success: false, error: 'AI returned invalid format. Please try again.' },
        { status: 500 }
      )
    }

    analysis.analyzed_at = new Date().toISOString()
    console.log('Analysis complete. Rating:', analysis.health_rating)

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
  return `You are a certified nutritionist and food safety expert for the Indian market.
Analyse this packaged food product and return ONLY valid JSON. No markdown, no code fences, just raw JSON.

PRODUCT:
Name: ${product.name}
Brand: ${product.brand || 'Unknown'}
Category: ${product.category || 'Packaged food'}
Country: ${product.country_of_origin || 'Unknown'}

NUTRITION PER 100g:
- Calories: ${n.calories || 0} kcal
- Protein: ${n.protein || 0}g
- Carbs: ${n.carbs || 0}g
- Sugar: ${n.sugar ?? 'N/A'}g
- Fat: ${n.fat || 0}g
- Sodium: ${n.sodium ? n.sodium + 'mg' : 'N/A'}
- Fiber: ${n.fiber ?? 'N/A'}g

INGREDIENTS: ${product.ingredients_text || 'Not available'}
ADDITIVES: ${(product.additives || []).join(', ') || 'None listed'}
ALLERGENS: ${(product.allergens || []).join(', ') || 'None listed'}

Return exactly this JSON structure with no extra text:
{
  "health_rating": "unhealthy",
  "health_score": 3.5,
  "summary": "Two sentence summary for an Indian consumer.",
  "is_legitimate": true,
  "safe_consumption": {
    "amount": "1 small pack 26g",
    "frequency": "Max once a week",
    "notes": "Avoid if you have high blood pressure"
  },
  "ingredient_warnings": [
    {
      "ingredient": "Sodium",
      "concern": "High sodium content increases blood pressure risk",
      "severity": "high"
    }
  ],
  "positives": ["Good source of quick energy", "Contains some protein"],
  "healthier_alternatives": ["Roasted chana", "Makhana", "Fresh fruit"],
  "bmi_notes": null
}

RULES:
- Flag E621 MSG, artificial colours, TBHQ, BHA, BHT
- Sodium above 500mg per 100g flag as high
- Sugar above 15g per 100g flag
- Trans fat any amount is high severity
- Apply FSSAI standards where relevant
- Always include 2-3 healthier_alternatives specific to Indian market`
}