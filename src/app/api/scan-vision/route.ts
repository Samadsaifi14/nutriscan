import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callGemini, GeminiError } from '@/lib/gemini'

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
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', tip: 'Please sign in to scan product labels.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid image data', tip: 'Please try capturing the image again.' },
        { status: 400 }
      )
    }

    const { imageBase64, mode } = parsed.data

    const prompt = mode === 'barcode_only'
      ? `Find the barcode in this image. Extract the exact number printed below the barcode lines.
Return ONLY this JSON, no markdown:
{
  "barcode": "<exact number or null if not clearly visible>",
  "confidence": "high"|"medium"|"low",
  "image_issues": null|"blurry"|"dark"|"no_barcode"|"no_label",
  "visible_elements": ["<what you can see>"]
}`
      : `You are a food label reader for Indian packaged food products.
Extract ALL visible information from this packaging image.
Return ONLY valid JSON, no markdown:
{
  "barcode": "<barcode number or null>",
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
  "confidence": "high"|"medium"|"low",
  "image_issues": null|"blurry"|"dark"|"no_barcode"|"no_label"
}`

    const { text } = await callGemini(prompt, imageBase64, {
      temperature: 0.1,
      maxTokens: 1024,  // was 8192 — vision JSON response is always small
    })

    if (!text) {
      return NextResponse.json(
        { success: false, error: FAILURE_REASONS.generic.message, tip: FAILURE_REASONS.generic.tip },
        { status: 500 }
      )
    }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let extracted: any
    try {
      extracted = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { success: false, error: FAILURE_REASONS.generic.message, tip: FAILURE_REASONS.generic.tip },
        { status: 500 }
      )
    }

    if (extracted.image_issues && !extracted.barcode && !extracted.name) {
      const reason = FAILURE_REASONS[extracted.image_issues as keyof typeof FAILURE_REASONS] || FAILURE_REASONS.generic
      return NextResponse.json({
        success: false,
        error: reason.message,
        tip: reason.tip,
        image_issues: extracted.image_issues,
      })
    }

    if (extracted.confidence === 'low') {
      extracted._warning = 'Low confidence — some values may be inaccurate. Please verify before logging.'
    }

    console.log('Vision barcode:', extracted.barcode, '| name:', extracted.name, '| confidence:', extracted.confidence)
    return NextResponse.json({ success: true, data: extracted })

  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`Gemini Vision Error [${err.type}]:`, err.message)
      const isQuota = err.message.toLowerCase().includes('quota')
      if (err.type === 'unavailable') {
        return NextResponse.json(
          { success: false, error: 'Gemini AI is busy. Please wait 30 seconds and try again.', tip: 'Retry in a moment.' },
          { status: 503 }
        )
      }
      if (err.type === 'rate_limit') {
        return NextResponse.json(
          {
            success: false,
            error: isQuota ? 'Daily AI quota reached. Try again tomorrow.' : 'Too many requests. Wait a minute.',
            tip: isQuota ? 'Upgrade your Gemini API plan at aistudio.google.com' : 'Too many scans right now.',
          },
          { status: 429 }
        )
      }
      if (err.type === 'timeout') {
        return NextResponse.json(
          { success: false, error: 'AI timed out. Try a clearer photo.', tip: 'Ensure label is clearly visible and well-lit.' },
          { status: 504 }
        )
      }
    }
    console.error('Vision error:', err.message)
    return NextResponse.json(
      { success: false, error: FAILURE_REASONS.generic.message, tip: FAILURE_REASONS.generic.tip },
      { status: 500 }
    )
  }
}