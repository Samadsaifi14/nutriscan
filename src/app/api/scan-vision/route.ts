import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { performLocalOCR } from '@/lib/ocr'
import { lookupBarcode, scoreOFFProduct } from '@/lib/openfoodfacts'

const RequestSchema = z.object({
  imageBase64: z.string().min(100, 'Image data too small'),
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

    const { imageBase64 } = parsed.data

    // ─────────────────────────────────────────────────────────────────────────
    // Use client-side barcode detection via BarcodeDetector API (handled in scanner)
    // For now, just try to lookup any barcode passed from the scanner
    // The scanner extracts barcode before calling this API
    // ─────────────────────────────────────────────────────────────────────────
    
    return NextResponse.json({
      success: false,
      error: 'No barcode detected',
      tip: 'Please use the barcode scanner which has built-in detection.',
    })

  } catch (err: any) {
    console.error('Scan vision error:', err.message)
    return NextResponse.json(
      { success: false, error: FAILURE_REASONS.generic.message, tip: 'Try again with a clearer image.' },
      { status: 500 }
    )
  }
}