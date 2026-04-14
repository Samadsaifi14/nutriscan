import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
 
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
 
  const { data } = await supabaseAdmin
    .from('scan_sessions')
    .select('product_name, product_image, ai_health_rating, ai_health_score, scanned_at')
    .eq('user_id', userId)
    .order('scanned_at', { ascending: false })
    .limit(1)
    .single()
 
  return NextResponse.json({ success: true, data: data || null })
}