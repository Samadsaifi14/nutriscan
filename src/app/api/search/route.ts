import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { transformProductToCard } from '@/lib/frontend-transform'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ success: false, error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  const safe = q.replace(/[%_\\]/g, (m) => `\\${m}`)
  const pattern = `%${safe}%`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4000)

  try {
    const [productsRes, communityRes] = await Promise.all([
      supabaseAdmin
        .from('products')
        .select('barcode, name, brand, image_url, health_score')
        .or(`name.ilike.${pattern},brand.ilike.${pattern}`)
        .limit(15)
        .abortSignal(controller.signal),
      supabaseAdmin
        .from('community_products')
        .select('barcode, name, brand, status')
        .or(`name.ilike.${pattern},brand.ilike.${pattern}`)
        .in('status', ['approved', 'pending'])
        .limit(10)
        .abortSignal(controller.signal),
    ])

    const products = (productsRes.data || []).map((p: any) => transformProductToCard(p))

    return NextResponse.json({
      success: true,
      products,
      community: communityRes.data || [],
    })
  } finally {
    clearTimeout(timeoutId)
  }
}
