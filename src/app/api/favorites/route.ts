import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { transformLogToCard } from '@/lib/frontend-transform'

const FavoriteSchema = z.object({
  product_name: z.string().min(1),
  barcode: z.string().optional(),
  calories_per_100g: z.number().min(0).optional(),
  protein_per_100g: z.number().min(0).optional(),
  carbs_per_100g: z.number().min(0).optional(),
  fat_per_100g: z.number().min(0).optional(),
  sodium_per_100g: z.number().min(0).optional(),
})

export async function GET() {
  const auth = await requireAuth()
  if ('response' in auth) return auth.response

  const { data: favorites, error } = await supabaseAdmin
    .from('meal_favorites')
    .select('*')
    .eq('user_id', auth.userId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to load favorites' }, { status: 500 })
  }

  // Fetch product data for favorites with barcodes
  const barcodes = (favorites || []).map((f) => f.barcode).filter(Boolean) as string[]
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

  const items = (favorites || []).map((fav: any) => {
    const product = fav.barcode ? productMap.get(fav.barcode) : undefined
    return transformLogToCard(
      { product_name: fav.product_name, barcode: fav.barcode, brand: fav.brand, image_url: fav.image_url, health_score: fav.health_score },
      product ? { brand: product.brand, image_url: product.image_url, health_score: product.health_score } : undefined
    )
  })

  return NextResponse.json({ success: true, favorites: items })
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if ('response' in auth) return auth.response

  const parsed = FavoriteSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('meal_favorites')
    .upsert({ user_id: auth.userId, ...parsed.data }, { onConflict: 'user_id,product_name,barcode' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, data })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth()
  if ('response' in auth) return auth.response

  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('meal_favorites')
    .delete()
    .eq('id', id)
    .eq('user_id', auth.userId)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
