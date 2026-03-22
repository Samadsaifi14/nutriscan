import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.userId) {
    return NextResponse.json(
      { success: false, error: 'You must be logged in' },
      { status: 401 }
    )
  }

  const body = await req.json()
  const qty = body.quantity_g / 100

  const { data, error } = await supabaseAdmin
    .from('food_logs')
    .insert({
      user_id: session.userId,
      product_name: body.product_name,
      barcode: body.barcode,
      quantity_g: body.quantity_g,
      calories: +(body.calories_per_100g * qty).toFixed(1),
      protein_g: +(body.protein_per_100g * qty).toFixed(1),
      carbs_g: +(body.carbs_per_100g * qty).toFixed(1),
      fat_g: +(body.fat_per_100g * qty).toFixed(1),
      sodium_mg: body.sodium_per_100g
        ? +(body.sodium_per_100g * qty).toFixed(1)
        : null,
      meal_type: body.meal_type,
      logged_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.log('Log error:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }

  console.log('Meal logged:', body.product_name, body.quantity_g + 'g')
  return NextResponse.json({ success: true, data })
}