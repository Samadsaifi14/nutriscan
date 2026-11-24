import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { transformLogToCard } from '@/lib/frontend-transform'

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_API_SECRET
  const supplied = req.headers.get('x-admin-secret')
  if (!expected || !supplied) return false
  const expectedBuffer = Buffer.from(expected)
  const suppliedBuffer = Buffer.from(supplied)
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer)
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: corrections, error } = await supabaseAdmin
    .from('product_corrections')
    .select('*')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Admin pending error:', error.message)
    return NextResponse.json({ error: 'Unable to load pending corrections' }, { status: 500 })
  }

  const barcodes = (corrections || []).map((c) => c.barcode).filter(Boolean) as string[]
  const productMap = new Map<string, { brand: string | null; image_url: string | null; health_score: number | null }>()
  if (barcodes.length > 0) {
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('barcode, brand, image_url, health_score')
      .in('barcode', barcodes)
    if (productsError) {
      console.error('Admin product lookup error:', productsError.message)
      return NextResponse.json({ error: 'Unable to load correction product details' }, { status: 500 })
    }
    for (const product of products || []) productMap.set(product.barcode, product)
  }

  const pending = (corrections || []).map((correction: any) => {
    const product = correction.barcode ? productMap.get(correction.barcode) : undefined
    return {
      id: correction.id,
      ...transformLogToCard(
        { product_name: correction.product_name, barcode: correction.barcode, brand: correction.brand, image_url: null, health_score: null },
        product ? { brand: product.brand, image_url: product.image_url, health_score: product.health_score } : undefined
      ),
    }
  })

  return NextResponse.json({ pending }, { headers: { 'Cache-Control': 'private, no-store' } })
}
