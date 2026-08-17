import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ANONYMOUS_USER_ID } from '@/lib/config'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'
import { transformLogToCard } from '@/lib/frontend-transform'

// GET handler - retrieve meal history
export async function GET(req: NextRequest) {
  try {
    const userId = ANONYMOUS_USER_ID

    const { data: logs, error: logsError } = await supabaseAdmin
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(50)

    if (logsError) {
      console.error('Get logs error:', logsError.message)
      return NextResponse.json(
        { success: false, error: 'Failed to load meal history' },
        { status: 500 }
      )
    }

    // Fetch product data for all barcodes
    const barcodes = (logs || []).map((l) => l.barcode).filter(Boolean) as string[]
    const productMap = new Map<string, { brand: string | null; image_url: string | null; health_score: number | null }>()
    if (barcodes.length > 0) {
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('barcode, brand, image_url, health_score')
        .in('barcode', barcodes)
      for (const p of products || []) {
        productMap.set(p.barcode, p)
      }
    }

    const scans = (logs || []).map((log: any) => {
      const product = log.barcode ? productMap.get(log.barcode) : undefined
      return transformLogToCard(log, product ? { brand: product.brand, image_url: product.image_url, health_score: product.health_score } : undefined)
    })

    return NextResponse.json({ success: true, scans })
  } catch (err: any) {
    console.error('Get logs route error:', err.message)
    return NextResponse.json({ success: false, scans: [], error: err.message })
  }
}

// POST handler - log a meal
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
    const userId = ANONYMOUS_USER_ID

    console.log('=== MEAL LOG API ===')
    console.log('UserId:', userId)

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

    console.log('Inserting log with:', {
      user_id: userId,
      product_name: data.product_name,
      quantity_g: data.quantity_g,
      calories: +(data.calories_per_100g * qty).toFixed(1),
      meal_type: data.meal_type,
    })

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

    console.log('Meal logged successfully:', log)
    return NextResponse.json({ success: true, data: log })

  } catch (err: any) {
    console.error('Log route error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}