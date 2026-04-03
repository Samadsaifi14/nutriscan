import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const RequestSchema = z.object({
  imageBase64: z.string().min(100, 'Image data is too small — please try again'),
  mode: z.enum(['barcode_only', 'full_label']).optional().default('full_label'),
})

const FAILURE_REASONS = {
  no_barcode: {
    message: 'No barcode visible in the photo',
    tip: 'Make sure the barcode lines and the number below them are clearly visible. Try moving closer.',
  },
  blurry: {
    message: 'The image appears blurry',
    tip: 'Hold your phone steady and tap the screen to focus before capturing.',
  },
  dark: {
    message: 'The image is too dark',
    tip: 'Move to a brighter area or turn on your flashlight.',
  },
  no_label: {
    message: 'No nutrition label found',
    tip: 'Point the camera at the back or side of the packet where the nutrition table is printed.',
  },
  generic: {
    message: 'Could not read the label',
    tip: 'Try a different angle, better lighting, or use manual barcode entry instead.',
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image data',
          tip: 'Please try capturing the image again.',
        },
        { status: 400 }
      )
    }

    const { imageBase64, mode } = parsed.data

    const prompt = mode === 'barcode_only'
      ? `Look at this image carefully. Find the barcode — the parallel black vertical lines with numbers printed below them.

Your task: Extract the exact barcode number printed below the barcode lines.

Also assess image quality and return this JSON only, no markdown:
{
  "barcode": "<exact number below barcode lines, or null if not clearly visible>",
  "confidence": "high" or "medium" or "low",
  "image_issues": null or "blurry" or "dark" or "no_barcode" or "no_label",
  "visible_elements": ["describe what you can see in the image"]
}`
      : `You are a food label reader for Indian packaged food products.
Examine this image carefully and extract ALL visible information from the packaging.

Also assess image quality. Return ONLY valid JSON, no markdown, no code fences:
{
  "barcode": "<barcode number if visible, or null>",
  "name": "<product name>",
  "brand": "<brand name>",
  "serving_size_g": <number or null>,
  "ingredients_text": "<full ingredients list or null>",
  "nutrition_per_100g": {
    "calories": <number or null>,
    "protein": <number or null>,
    "carbs": <number or null>,
    "fat": <number or null>,
    "sugar": <number or null>,
    "sodium": <number or null>,
    "fiber": <number or null>
  },
  "additives": ["<additive name>"],
  "allergens": ["<allergen>"],
  "fssai_number": "<14-digit FSSAI number or null>",
  "mrp": <price in rupees or null>,
  "confidence": "high" or "medium" or "low",
  "image_issues": null or "blurry" or "dark" or "no_barcode" or "no_label"
}`

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
            ]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
        })
      }
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.text()
      console.log('Gemini Vision error:', err)
      return NextResponse.json(
        {
          success: false,
          error: FAILURE_REASONS.generic.message,
          tip: FAILURE_REASONS.generic.tip,
        },
        { status: 500 }
      )
    }

    const geminiData = await geminiRes.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: FAILURE_REASONS.generic.message,
          tip: FAILURE_REASONS.generic.tip,
        },
        { status: 500 }
      )
    }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let extracted: any
    try {
      extracted = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: FAILURE_REASONS.generic.message,
          tip: FAILURE_REASONS.generic.tip,
        },
        { status: 500 }
      )
    }

    // Give specific failure reason based on image issues
    if (extracted.image_issues && (!extracted.barcode && !extracted.name)) {
      const reason = FAILURE_REASONS[extracted.image_issues as keyof typeof FAILURE_REASONS]
        || FAILURE_REASONS.generic

      return NextResponse.json({
        success: false,
        error: reason.message,
        tip: reason.tip,
        image_issues: extracted.image_issues,
      })
    }

    // Low confidence warning
    if (extracted.confidence === 'low') {
      extracted._warning = 'Low confidence — some values may be inaccurate. Please verify before logging.'
    }

    console.log('Vision extracted barcode:', extracted.barcode)
    console.log('Vision extracted name:', extracted.name)
    console.log('Vision confidence:', extracted.confidence)

    return NextResponse.json({ success: true, data: extracted })

  } catch (err: any) {
    console.error('Vision error:', err.message)
    return NextResponse.json(
      {
        success: false,
        error: FAILURE_REASONS.generic.message,
        tip: FAILURE_REASONS.generic.tip,
      },
      { status: 500 }
    )
  }
}