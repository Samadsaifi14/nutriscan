import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'

const LogSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  barcode: z.string().optional(),
  quantity_g: z.number().min(1, 'Quantity must be at least 1g').max(5000, 'Quantity seems too high'),
  calories_per_100g: z.number().min(0).max(10000),
  protein_per_100g: z.number().min(0).max(1000),
  carbs_per_100g: z.number().min(0).max(1000),
  fat_per_100g: z.number().min(0).max(1000),
  sodium_per_100g: z.number().min(0).max(100000).optional(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'You must be signed in to log meals' },
        { status: 401 }
      )
    }

    // Rate limit
    const rateCheck = await checkRateLimit(userId, 'log')
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please slow down.' },
        { status: 429 }
      )
    }

    // Validate body
    const body = await req.json()
    const parsed = LogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues.map(i => i.message).join(', ')
        },
        { status: 400 }
      )
    }

    const data = parsed.data
    const qty = data.quantity_g / 100

    const { data: log, error } = await supabaseAdmin
      .from('food_logs')
      .insert({
        user_id: userId,
        product_name: data.product_name,
        barcode: data.barcode,
        quantity_g: data.quantity_g,
        calories: +(data.calories_per_100g * qty).toFixed(1),
        protein_g: +(data.protein_per_100g * qty).toFixed(1),
        carbs_g: +(data.carbs_per_100g * qty).toFixed(1),
        fat_g: +(data.fat_per_100g * qty).toFixed(1),
        sodium_mg: data.sodium_per_100g
          ? +(data.sodium_per_100g * qty).toFixed(1)
          : null,
        meal_type: data.meal_type,
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

    console.log('Meal logged:', data.product_name, data.quantity_g + 'g')
    return NextResponse.json({ success: true, data: log })

  } catch (err: any) {
    console.error('Log route error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
