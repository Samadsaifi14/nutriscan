import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callGemini, GeminiError } from '@/lib/gemini'
import { formatProduct } from '@/lib/scan-helpers'
import { runUnifiedAnalysis, toUnifiedInput } from '@/lib/analysis-runner'

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

    // Accept both FormData and JSON body for backward compat
    let imageBase64: string | null = null
    let barcode: string | null = null

    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const imageFile = formData.get('image') as File | Blob | null
      if (imageFile) {
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        imageBase64 = buffer.toString('base64')
      }
      const barcodeField = formData.get('barcode')
      if (barcodeField && typeof barcodeField === 'string') barcode = barcodeField
    } else {
      const body = await req.json()
      imageBase64 = body.imageBase64 || null
      barcode = body.barcode || null
    }

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    console.log('Scanning product photo with Gemini...')

    const prompt = `You are an expert Indian food product analyst and nutritionist specializing in Indian packaged foods.

A user has taken a photo of a packaged food product (likely Indian). Your job is to extract ALL possible information from this image — front of pack, back of pack, nutrition label, ingredients list, barcode number, brand name, everything visible.

IMPORTANT: Indian product labels often have text in both Hindi and English. Read the English text primarily, but use Hindi text as backup if English is unclear.

Look carefully at:
1. Product name and brand (usually large text on front, may be in Hindi and English)
2. Barcode number (the 12-13 digit number printed below the parallel lines, starts with 890 for Indian products)
3. Nutrition facts table (per 100g values — Indian labels show "per 100g" or "per 100 ml")
4. Ingredients list (may be in small print, often in English with Hindi translation)
5. Allergen information (look for "Contains:" or allergen icons)
6. FSSAI license number (14-digit number, always present on Indian food products)
7. MRP (Maximum Retail Price in ₹ rupees, usually near barcode or bottom)
8. Net weight / serving size (in grams or ml)
9. Any health claims on the packaging (e.g., "No added sugar", "High protein", "Natural")
10. Additives and preservatives mentioned (E-numbers, chemical names)
11. Veg/Non-veg mark (green dot = veg, red dot = non-veg)
12. Manufacturing date and expiry date if visible

Return ONLY valid JSON with no markdown, no code fences, no extra text:
{
  "found": true,
  "barcode": "<barcode number if visible, or null>",
  "name": "<full product name in English>",
  "brand": "<brand name in English>",
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
  "ingredients_text": "<full ingredients list as written on pack in English, or null>",
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

    // Map Gemini output to product shape for analysis
    const nut = extracted.nutrition_per_100g || {}
    const productForAnalysis = {
      name: extracted.name || 'Unknown Product',
      brand: extracted.brand || null,
      barcode: extracted.barcode || barcode || null,
      category: null,
      calories_per_100g: nut.calories ?? null,
      protein_per_100g: nut.protein ?? null,
      carbs_per_100g: nut.carbs ?? null,
      fat_per_100g: nut.fat ?? null,
      saturated_fat_per_100g: nut.saturated_fat ?? null,
      sugar_per_100g: nut.sugar ?? null,
      sodium_per_100g: nut.sodium ?? null,
      fiber_per_100g: nut.fiber ?? null,
      serving_size_g: extracted.serving_size_g ?? null,
      ingredients_text: extracted.ingredients_text || null,
      allergens: extracted.allergens || [],
      additives: extracted.additives || [],
      image_url: null,
    }

    const product = formatProduct(productForAnalysis)
    const analysis = await runUnifiedAnalysis(toUnifiedInput(productForAnalysis), { userId })
    const dyn = (analysis as any).dynamic_alternatives
    const curatedAlts = (analysis as any).curated_alternatives || []
    const dynamicAlts = (dyn?.products || []).map((p: any) => ({
      name: p.name,
      brand: p.brand || '',
      image_url: p.image_url || undefined,
      health_score: p.score,
      grade: p.grade,
      reason: dyn.why_better?.[0]?.improvement || `Healthier alternative — score ${p.score}/10`,
    }))
    const seen = new Set(dynamicAlts.map((a: any) => a.name.toLowerCase()))
    const mergedAlts = [
      ...curatedAlts.filter((a: any) => !seen.has(a.name.toLowerCase())),
      ...dynamicAlts,
    ]

    return NextResponse.json({
      success: true,
      product,
      analysis,
      alternatives: mergedAlts,
      source: 'photo_scan',
      confidence: extracted.confidence === 'high' ? 'high' : extracted.confidence === 'medium' ? 'estimated' : 'low',
      photoDetails: {
        barcode: extracted.barcode,
        variant: extracted.variant,
        net_weight_g: extracted.net_weight_g,
        mrp_rupees: extracted.mrp_rupees,
        fssai_number: extracted.fssai_number,
        health_claims: extracted.health_claims,
        certifications: extracted.certifications,
        image_quality: extracted.image_quality,
        what_was_visible: extracted.what_was_visible,
      },
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
