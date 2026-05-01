import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callGeminiVision, callGeminiVisionWithUserToken, GeminiError } from '@/lib/gemini'
import { checkRateLimit } from '@/lib/rateLimit'
import { performLocalOCR } from '@/lib/ocr'

const RequestSchema = z.object({
  imageBase64: z.string().min(100, 'Image data too small'),
  mode: z.enum(['barcode_only', 'full_label']).optional().default('full_label'),
})

const FAILURE_REASONS = {
  no_barcode: {
    message: 'No barcode visible in the photo',
    tip:     'Make sure the barcode lines and number below are clearly visible. Try moving closer.',
  },
  blurry: {
    message: 'The image appears blurry',
    tip:     'Hold your phone steady and tap to focus before capturing.',
  },
  dark: {
    message: 'The image is too dark',
    tip:     'Move to a brighter area or turn on your flashlight.',
  },
  no_label: {
    message: 'No nutrition label found',
    tip:     'Point the camera at the back or side of the packet where the nutrition table is printed.',
  },
  generic: {
    message: 'Could not read the label',
    tip:     'Try a different angle, better lighting, or point at the nutrition label directly.',
  },
}

export async function POST(req: NextRequest) {
  try {
    const session         = await getServerSession(authOptions)
    const userId          = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', tip: 'Please sign in to scan.' },
        { status: 401 }
      )
    }

    const body   = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid image data', tip: 'Please try capturing again.' },
        { status: 400 }
      )
    }

    const { imageBase64, mode } = parsed.data

    // ─────────────────────────────────────────────────────────────────────────
    // Use Local OCR first for full_label mode (faster, free)
    // ─────────────────────────────────────────────────────────────────────────
    let ocrResult: any = null
    let ocrFailed = false

    // For barcode detection, always use AI (local OCR can't reliably detect barcodes)
    if (mode !== 'barcode_only') {
      try {
        console.log('Attempting local OCR...')
        ocrResult = await performLocalOCR(imageBase64)
        console.log('Local OCR success:', {
          barcode: ocrResult.barcode,
          name: ocrResult.parsed.name,
          confidence: ocrResult.confidence,
        })
      } catch (ocrErr: any) {
        console.warn('Local OCR failed, falling back to AI:', ocrErr.message)
        ocrFailed = true
      }

      // If local OCR succeeded AND found useful data (barcode OR name OR nutrition), use it
      if (ocrResult && !ocrFailed && (ocrResult.barcode || ocrResult.parsed.name || ocrResult.parsed.nutrition_per_100g)) {
        const response: Record<string, any> = {
          barcode: ocrResult.barcode,
          name: ocrResult.parsed.name || null,
          brand: ocrResult.parsed.brand || null,
          serving_size_g: ocrResult.parsed.serving_size_g || null,
          ingredients_text: ocrResult.parsed.ingredients_text || null,
          nutrition_per_100g: ocrResult.parsed.nutrition_per_100g || null,
          additives: ocrResult.parsed.additives || [],
          allergens: ocrResult.parsed.allergens || [],
          fssai_number: null,
          mrp: null,
          confidence: ocrResult.confidence > 60 ? 'high' : ocrResult.confidence > 40 ? 'medium' : 'low',
          image_issues: ocrResult.warnings.length > 0 ? ocrResult.warnings.join('; ') : null,
          _local_ocr: true,
          _raw_text: ocrResult.rawText.substring(0, 500),
        }

        if (ocrResult.warnings.length > 0) {
          response._warning = `Local OCR warnings: ${ocrResult.warnings.join('; ')}`
        }

        return NextResponse.json({ success: true, data: response })
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // AI Fallback (when local OCR fails or for barcode_only mode)
    // ─────────────────────────────────────────────────────────────────────────

    const prompt = mode === 'barcode_only'
      ? `Look at this image. Find the barcode — the parallel black vertical lines with a number printed below them.
Extract the exact number printed below the barcode lines. Do not guess — only return numbers you can clearly read.
Return ONLY this JSON, no markdown, no code fences:
{
  "barcode": "<exact digits printed below barcode, or null if not clearly visible>",
  "confidence": "high",
  "image_issues": null,
  "visible_elements": ["list what you can see in the image"]
}`
      : `You are a food label reader for Indian packaged food products.
Look at this image carefully and extract ALL visible text and numbers from the packaging.
Return ONLY valid JSON, no markdown, no code fences:
{
  "barcode": "<barcode number if visible, or null>",
  "name": "<product name>",
  "brand": "<brand name or null>",
  "serving_size_g": <number or null>,
  "ingredients_text": "<full ingredients list as text, or null>",
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
  "mrp": <price in rupees as number or null>,
  "confidence": "high",
  "image_issues": null
}`

    let text: string

    // Use API key directly (skip user OAuth token since we removed generative-language scope)
    const limit = await checkRateLimit(userId, 'scan')
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Daily scan limit reached.',
          tip: 'You have used your 25 free scans today. Try again tomorrow.',
        },
        { status: 429 }
      )
    }

    const result = await callGeminiVision(
      prompt, imageBase64,
      { temperature: 0.1, maxTokens: 2048 }
    )
    text = result.text
    console.log('scan-vision: used API key')

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let extracted: any
    try {
      extracted = JSON.parse(cleaned)
    } catch {
      console.error('Vision JSON parse failed. Raw:', cleaned.slice(0, 400))
      return NextResponse.json(
        { success: false, error: FAILURE_REASONS.generic.message, tip: FAILURE_REASONS.generic.tip },
        { status: 500 }
      )
    }

    if (extracted.image_issues && !extracted.barcode && !extracted.name) {
      const reason = FAILURE_REASONS[extracted.image_issues as keyof typeof FAILURE_REASONS]
        || FAILURE_REASONS.generic
      return NextResponse.json({
        success: false,
        error: reason.message,
        tip: reason.tip,
        image_issues: extracted.image_issues,
      })
    }

    if (extracted.confidence === 'low') {
      extracted._warning = 'Low confidence — some values may be inaccurate.'
    }

    // Mark as AI-generated
    extracted._ai_fallback = true

    console.log('Vision barcode:', extracted.barcode, '| name:', extracted.name, '| confidence:', extracted.confidence)
    return NextResponse.json({ success: true, data: extracted })

  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`Gemini Vision Error [${err.type}]:`, err.message)
      const isQuota = err.message.toLowerCase().includes('quota')
      if (err.type === 'unavailable') {
        return NextResponse.json(
          { success: false, error: 'AI is busy. Please wait 30 seconds and try again.', tip: 'Retry in a moment.' },
          { status: 503 }
        )
      }
      if (err.type === 'rate_limit') {
        return NextResponse.json(
          {
            success: false,
            error: isQuota ? 'Daily AI quota reached. Try again tomorrow.' : 'Too many requests. Wait a minute.',
            tip:   isQuota ? 'Check aistudio.google.com for quota details.' : 'Too many scans right now.',
          },
          { status: 429 }
        )
      }
      if (err.type === 'timeout') {
        return NextResponse.json(
          { success: false, error: 'AI timed out. Try a clearer photo.', tip: 'Ensure the label is well-lit and in focus.' },
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