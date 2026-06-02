import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ success: false, error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  // Escape PostgREST ilike wildcard characters so the user query is treated literally
  const safe = q.replace(/[%_\\]/g, (m) => `\\${m}`)
  const pattern = `%${safe}%`

  // Run both queries in parallel. We only select the columns we render so the
  // round-trip is small. We also set a 4-second timeout via AbortController so
  // the client never waits forever.
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

    return NextResponse.json({
      success: true,
      data: {
        products: productsRes.data || [],
        community: communityRes.data || [],
      },
    })
  } finally {
    clearTimeout(timeoutId)
  }
}
