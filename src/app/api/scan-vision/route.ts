import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'
import { performLocalOCR } from '@/lib/ocr'
import { lookupBarcode, scoreOFFProduct } from '@/lib/openfoodfacts'

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
    // Use Open Food Facts API (free, no key needed)
    // ─────────────────────────────────────────────────────────────────────────
    
    // First, try to get barcode from OCR result (already tried in step above)
    const ocrBarcode = ocrResult?.barcode
    
    // For barcode_only mode, we need a barcode to lookup
    if (mode === 'barcode_only' && !ocrBarcode) {
      return NextResponse.json({
        success: false,
        error: FAILURE_REASONS.no_barcode.message,
        tip: 'No barcode detected. Try capturing the barcode more clearly.',
      })
    }
    
    // Lookup in Open Food Facts
    const barcodeToLookup = ocrBarcode || (ocrResult?.rawText?.match(/\d{12,14}/)?.[0])
    
    if (barcodeToLookup) {
      console.log('Looking up barcode in OFF:', barcodeToLookup)
      const offProduct = await lookupBarcode(barcodeToLookup)
      
      if (offProduct) {
        console.log('OFF found product:', offProduct.name)
        
        // Score the product
        const scored = scoreOFFProduct(offProduct)
        
        return NextResponse.json({
          success: true,
          data: {
            barcode: offProduct.barcode,
            name: offProduct.name,
            brand: offProduct.brand,
            ingredients_text: offProduct.ingredients_text,
            nutrition_per_100g: offProduct.nutrition_per_100g,
            additives: offProduct.additives,
            allergens: [],
            fssai_number: null,
            mrp: null,
            confidence: 'high',
            image_issues: null,
            health_score: scored.health_score,
            health_grade: scored.health_grade,
            nova_group: scored.nova_group,
            _source: 'openfoodfacts',
          },
        })
      } else {
        console.log('OFF: Product not found for barcode:', barcodeToLookup)
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // If OFF lookup fails, return OCR result if we have any data
    // ─────────────────────────────────────────────────────────────────────────
    
    if (ocrResult) {
      return NextResponse.json({
        success: true,
        data: {
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
          confidence: ocrResult.confidence > 40 ? 'medium' : 'low',
          image_issues: ocrResult.warnings.length > 0 ? ocrResult.warnings.join('; ') : null,
          _local_ocr: true,
          _warning: 'Product not found in database. OCR data shown.',
        },
      })
    }

    // Everything failed
    return NextResponse.json({
      success: false,
      error: FAILURE_REASONS.generic.message,
      tip: FAILURE_REASONS.generic.tip,
    })

  } catch (err: any) {
    console.error('Scan vision error:', err.message)
    return NextResponse.json(
      { success: false, error: FAILURE_REASONS.generic.message, tip: 'Try again with a clearer image.' },
      { status: 500 }
    )
  }
}