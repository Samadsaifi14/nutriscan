import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabaseAdmin
      .from('product_corrections')
      .insert({
        correction_type: 'new_product',
        product_name: body.name || 'Unknown Product',
        brand: body.brand || null,
        barcode: body.barcode || `pending-${Date.now()}`,
        ingredients_text: body.ingredients_text || null,
        nutrition: body.nutrition_per_100g || null,
        image_url: body.image_url || null,
        serving_size_g: body.serving_size_g || null,
        additives: body.additives || [],
        allergens: body.allergens || [],
        source: body._source || 'user_submitted',
        status: 'pending_review',
        corrected_by: 'anonymous',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data, message: 'Submitted for review' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Submit failed' }, { status: 500 })
  }
}
