import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabaseAdmin
      .from('products')
      .upsert({
        barcode: body.barcode || `vision-${Date.now()}`,
        name: body.name || 'Unknown Product',
        brand: body.brand,
        country_of_origin: 'IN',
        calories_per_100g: body.nutrition_per_100g?.calories,
        protein_per_100g: body.nutrition_per_100g?.protein,
        carbs_per_100g: body.nutrition_per_100g?.carbs,
        fat_per_100g: body.nutrition_per_100g?.fat,
        sugar_per_100g: body.nutrition_per_100g?.sugar,
        sodium_per_100g: body.nutrition_per_100g?.sodium,
        fiber_per_100g: body.nutrition_per_100g?.fiber,
        serving_size_g: body.serving_size_g,
        ingredients_text: body.ingredients_text,
        additives: body.additives || [],
        allergens: body.allergens || [],
        source: 'gemini_vision',
        submitted_by: body.submitted_by,
      }, { onConflict: 'barcode', ignoreDuplicates: false })
      .select()
      .single()

    if (error) {
      console.log('Submit error:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('Product submitted:', data.name)
    return NextResponse.json({ success: true, data })

  } catch (err: any) {
    console.error('Submit error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Submit failed' },
      { status: 500 }
    )
  }
}