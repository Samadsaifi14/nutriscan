import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { ANONYMOUS_USER_ID } from '@/lib/config'

export async function POST(req: NextRequest) {
  try {
    const userId = ANONYMOUS_USER_ID
    const body = await req.json()

    // Save product
    const { data: product, error } = await supabaseAdmin
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
        source: body._source || 'openfoodfacts',
        health_score: body.health_score,
        health_grade: body.health_grade,
        last_scanned: new Date().toISOString(),
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

    // Create scan session for "last result" feature
    await supabaseAdmin
      .from('scan_sessions')
      .insert({
        user_id: userId,
        barcode: body.barcode || product.barcode,
        product_name: body.name || product.name,
        product_image: body.image_url || null,
        ai_health_rating: body.health_grade || 'moderate',
        ai_health_score: body.health_score || 5,
        scanned_at: new Date().toISOString(),
      })

    console.log('Product submitted:', product.name)
    return NextResponse.json({ success: true, data: product })

  } catch (err: any) {
    console.error('Submit error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Submit failed' },
      { status: 500 }
    )
  }
}