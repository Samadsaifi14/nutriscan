import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/api-auth'
import { isAdminSession } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { transformLogToCard } from '@/lib/frontend-transform'

export async function GET() {
  const session = await getAuthSession()
  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ pending: [] })
  }

  // Query pending corrections joined with product info
  const { data: corrections, error } = await supabaseAdmin
    .from('product_corrections')
    .select('*')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Admin pending error:', error.message)
    return NextResponse.json({ pending: [] })
  }

  // Fetch product data for corrections that have a barcode
  const barcodes = (corrections || []).map((c) => c.barcode).filter(Boolean) as string[]
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

  const pending = (corrections || []).map((c: any) => {
    const product = c.barcode ? productMap.get(c.barcode) : undefined
    return {
      id: c.id,
      ...transformLogToCard(
        { product_name: c.product_name, barcode: c.barcode, brand: c.brand, image_url: null, health_score: null },
        product ? { brand: product.brand, image_url: product.image_url, health_score: product.health_score } : undefined
      ),
    }
  })

  return NextResponse.json({ pending })
}
