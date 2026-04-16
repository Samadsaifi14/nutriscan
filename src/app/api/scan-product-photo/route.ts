import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callGemini, GeminiError } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', tip: 'Please sign in to scan product photos.' },
        { status: 401 }
      )
    }

    const { imageBase64 } = await req.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    console.log('Scanning product photo with Gemini...')

    const prompt = `You are an expert Indian food product analyst and nutritionist.

A user has taken a photo of a packaged food product. Your job is to extract ALL possible information from this image — front of pack, back of pack, nutrition label, ingredients list, barcode number, brand name, everything visible.

Look carefully at:
1. Product name and brand (usually large text on front)
2. Barcode number (the number printed below the parallel lines)
3. Nutrition facts table (per 100g values)
4. Ingredients list
5. Allergen information
6. FSSAI license number (14-digit number)
7. MRP (Maximum Retail Price in rupees)
8. Net weight / serving size
9. Any health claims on the packaging
10. Additives and preservatives mentioned

Return ONLY valid JSON with no markdown, no code fences, no extra text:
{
  "found": true,
  "barcode": "<barcode number if visible, or null>",
  "name": "<full product name>",
  "brand": "<brand name>",
  "variant": "<flavour or variant if mentioned, or null>",
  "net_weight_g": <number or null>,
  "serving_size_g": <number or null>,
  "mrp_rupees": <number or null>,
  "fssai_number": "<14-digit number or null>",
  "country_of_origin": "<country or null>",
  "nutrition_per_100g": {
    "calories": <number or null>,
    "protein": <number or null>,
    "carbs": <number or null>,
    "fat": <number or null>,
    "sugar": <number or null>,
    "sodium": <number or null>,
    "fiber": <number or null>,
    "saturated_fat": <number or null>,
    "trans_fat": <number or null>
  },
  "ingredients_text": "<full ingredients list as written on pack, or null>",
  "allergens": ["<allergen>"],
  "additives": ["<E-number or additive name>"],
  "health_claims": ["<any health claims on the pack>"],
  "certifications": ["<veg/non-veg mark, organic, ISO, etc>"],
  "confidence": "high" or "medium" or "low",
  "image_quality": "good" or "blurry" or "partial" or "dark",
  "what_was_visible": "<describe what parts of the product were visible in the photo>"
}

If the image does not show a food product at all, return:
{
  "found": false,
  "error": "No food product visible in the image"
}

IMPORTANT: Extract whatever is visible. Even if only partial information is available, return what you can see. Do not make up or guess values — use null for anything not clearly visible.`

    const { text } = await callGemini(prompt, imageBase64, {
      temperature: 0.1,
      maxTokens: 8192,
    })

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'AI returned no response. Please try again.' },
        { status: 500 }
      )
    }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let extracted: any
    try {
      extracted = JSON.parse(cleaned)
    } catch {
      console.log('Parse failed:', cleaned.slice(0, 300))
      return NextResponse.json(
        { success: false, error: 'Could not read the product. Please try again.' },
        { status: 500 }
      )
    }

    if (!extracted.found) {
      return NextResponse.json({
        success: false,
        error: 'No food product found in the image',
        tip: 'Make sure the food product is clearly visible and takes up most of the frame.',
      })
    }

    console.log('Photo scan success:', extracted.name, '| Confidence:', extracted.confidence)

    return NextResponse.json({
      success: true,
      data: extracted,
      message: extracted.confidence === 'low'
        ? 'Some values may be inaccurate due to image quality. Please verify before logging.'
        : null,
    })

  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`Gemini Photo Error [${err.type}]:`, err.message)
      if (err.type === 'unavailable') {
        return NextResponse.json({ success: false, error: 'Gemini AI is temporarily overloaded. Please wait 30 seconds and try again.' }, { status: 503 })
      }
      if (err.type === 'timeout') {
        return NextResponse.json({ success: false, error: 'AI timed out reading the photo. Please try again.' }, { status: 504 })
      }
      if (err.type === 'rate_limit') {
        return NextResponse.json({ success: false, error: 'AI rate limit reached. Please wait a moment.' }, { status: 429 })
      }
    } else {
      console.error('Photo scan error:', err.message)
    }
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}