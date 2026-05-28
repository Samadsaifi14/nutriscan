import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { scoreProduct, type NutritionPer100g } from '@/lib/health-engine/scorer'
import { getAuthSession, getUserId } from '@/lib/api-auth'
import { requireAdmin } from '@/lib/admin'

export async function POST(req: NextRequest) {
  const session = await getAuthSession()
  const userId = getUserId(session)

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const adminCheck = requireAdmin(session)
  if (!adminCheck.ok) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const { productId } = await req.json()

  if (!productId) {
    return NextResponse.json({ success: false, error: 'Missing productId' }, { status: 400 })
  }

  // Fetch the community product
  const { data: communityProduct, error: fetchError } = await supabaseAdmin
    .from('community_products')
    .select('*')
    .eq('id', productId)
    .single()

  if (fetchError || !communityProduct) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
  }

  if (communityProduct.status !== 'approved' && communityProduct.status !== 'pending') {
    return NextResponse.json({ success: false, error: `Product status is '${communityProduct.status}', cannot promote` }, { status: 400 })
  }

  const nutrition = communityProduct.nutrition as Record<string, any> || {}

  // Compute health score
  const nutritionInput: NutritionPer100g = {
    calories: parseFloat(nutrition.calories) || 0,
    protein: parseFloat(nutrition.protein) || 0,
    carbohydrates: parseFloat(nutrition.carbs) || 0,
    total_fat: parseFloat(nutrition.fat) || 0,
    sugar: parseFloat(nutrition.sugar) || 0,
    sodium: parseFloat(nutrition.sodium) ? (parseFloat(nutrition.sodium) / 1000) : 0,
  }
  const scored = scoreProduct(nutritionInput, communityProduct.ingredients_text || '')

  // Upsert into main products table
  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert({
      barcode: communityProduct.barcode,
      name: communityProduct.name,
      brand: communityProduct.brand,
      ingredients_text: communityProduct.ingredients_text,
      calories: parseFloat(nutrition.calories) || null,
      protein: parseFloat(nutrition.protein) || null,
      carbohydrates: parseFloat(nutrition.carbs) || null,
      fat: parseFloat(nutrition.fat) || null,
      sugar: parseFloat(nutrition.sugar) || null,
      fiber: parseFloat(nutrition.fiber) || null,
      sodium: parseFloat(nutrition.sodium) || null,
      health_score: Math.round(scored.score),
      health_grade: scored.grade,
      nova_group: scored.nova_group || 4,
      verified: true,
      source: 'community',
      last_updated: new Date().toISOString(),
    }, { onConflict: 'barcode', ignoreDuplicates: false })

  if (upsertError) {
    console.error('Promote upsert error:', upsertError.message)
    return NextResponse.json({ success: false, error: upsertError.message }, { status: 500 })
  }

  // Mark community product as promoted
  await supabaseAdmin
    .from('community_products')
    .update({ status: 'approved', verified_at: new Date().toISOString(), verified_by: userId })
    .eq('id', productId)

  // Notify the original submitter
  if (communityProduct.submitted_by && communityProduct.submitted_by !== userId) {
    const { data: submitter } = await supabaseAdmin
      .from('user_profiles')
      .select('notifications')
      .eq('user_id', communityProduct.submitted_by)
      .single()

    const existingNotifs: any[] = (submitter?.notifications as any[]) || []
    const notification = {
      id: crypto.randomUUID(),
      type: 'product_approved',
      title: 'Your product was approved! 🎉',
      message: `${communityProduct.name} has been verified and added to the database.`,
      productId,
      productName: communityProduct.name,
      createdAt: new Date().toISOString(),
      read: false,
    }

    await supabaseAdmin
      .from('user_profiles')
      .update({ notifications: [notification, ...existingNotifs] })
      .eq('user_id', communityProduct.submitted_by)
  }

  console.log('Promoted community product to main DB:', communityProduct.name)
  return NextResponse.json({ success: true, product: communityProduct.name })
}
