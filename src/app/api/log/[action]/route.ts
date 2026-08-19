import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  const { action } = params
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  }

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ success: false, error: 'No ID provided' }, { status: 400 })
  }

  const { data: correction, error: fetchErr } = await supabaseAdmin
    .from('product_corrections')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !correction) {
    return NextResponse.json({ success: false, error: 'Correction not found' }, { status: 404 })
  }

  if (action === 'approve') {
    const n = correction.nutrition || {}
    const { error: applyErr } = await supabaseAdmin
      .from('products')
      .upsert({
        barcode: correction.barcode,
        name: correction.product_name,
        brand: correction.brand,
        ingredients_text: correction.ingredients_text,
        image_url: correction.image_url,
        serving_size_g: correction.serving_size_g,
        additives: correction.additives,
        allergens: correction.allergens,
        calories_per_100g: n.calories,
        protein_per_100g: n.protein,
        carbs_per_100g: n.carbs,
        fat_per_100g: n.fat,
        sugar_per_100g: n.sugar,
        sodium_per_100g: n.sodium,
        fiber_per_100g: n.fiber,
        source: correction.source || 'community_reviewed',
        last_updated: new Date().toISOString(),
      }, { onConflict: 'barcode', ignoreDuplicates: false })

    if (applyErr) {
      return NextResponse.json({ success: false, error: `Failed to apply to product: ${applyErr.message}` }, { status: 500 })
    }
  }

  const status = action === 'approve' ? 'approved' : 'rejected'
  const { error } = await supabaseAdmin
    .from('product_corrections')
    .update({ status, reviewed_by: 'admin', reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
