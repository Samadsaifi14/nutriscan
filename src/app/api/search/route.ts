import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if ('response' in auth) return auth.response

  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ success: false, error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  const safe = q.replace(/[%_]/g, '')
  const pattern = `%${safe}%`

  const [productsRes, communityRes] = await Promise.all([
    supabaseAdmin
      .from('products')
      .select('barcode, name, brand, image_url, health_score')
      .or(`name.ilike."${pattern}",brand.ilike."${pattern}"`)
      .limit(15),
    supabaseAdmin
      .from('community_products')
      .select('barcode, name, brand, status')
      .or(`name.ilike."${pattern}",brand.ilike."${pattern}"`)
      .in('status', ['approved', 'pending'])
      .limit(10),
  ])

  return NextResponse.json({
    success: true,
    data: {
      products: productsRes.data || [],
      community: communityRes.data || [],
    },
  })
}
