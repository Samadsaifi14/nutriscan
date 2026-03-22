import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json()

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'No product provided' },
        { status: 400 }
      )
    }

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
    console.log('Calling Gemini AI directly...')

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8000,
          }
        })
      }
    )

    console.log('Gemini response status:', geminiRes.status)

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.log('Gemini error:', errText)
      return NextResponse.json(
        { success: false, error: 'Gemini API failed' },
        { status: 500 }
      )
    }

    const geminiData = await geminiRes.json()
    console.log('Gemini raw data:', JSON.stringify(geminiData).slice(0, 300))

    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.log('No text in response:', JSON.stringify(geminiData))
      return NextResponse.json(
        { success: false, error: 'Empty AI response' },
        { status: 500 }
      )
    }

    console.log('Gemini raw text:', text.slice(0, 200))

    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    let analysis
    try {
      analysis = JSON.parse(cleaned)
    } catch (e) {
      console.log('JSON parse failed. Text was:', cleaned.slice(0, 300))
      return NextResponse.json(
        { success: false, error: 'AI returned invalid format' },
        { status: 500 }
      )
    }

    analysis.analyzed_at = new Date().toISOString()
    console.log('Gemini analysis complete. Rating:', analysis.health_rating)

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

    return NextResponse.json({ success: true, data: analysis, cached: false })

  } catch (err: any) {
    console.error('Analyze error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
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
ADDITIVES: ${product.additives?.join(', ') || 'None listed'}
ALLERGENS: ${product.allergens?.join(', ') || 'None listed'}

Return exactly this JSON structure with no extra text:
{
  "health_rating": "unhealthy",
  "health_score": 3.5,
  "summary": "Example summary sentence one. Example sentence two.",
  "is_legitimate": true,
  "safe_consumption": {
    "amount": "1 small pack 26g",
    "frequency": "Max once a week",
    "notes": "Avoid if you have high blood pressure"
  },
  "ingredient_warnings": [
    {
      "ingredient": "Sodium",
      "concern": "High sodium content",
      "severity": "high"
    }
  ],
  "positives": ["Good source of energy", "Contains some protein"],
  "bmi_notes": null
}`
}
