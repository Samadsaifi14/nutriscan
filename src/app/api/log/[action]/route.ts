import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminSession } from '@/lib/admin'

export async function POST(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const userId = (session as any)?.userId

  const { action } = params
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  }

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ success: false, error: 'No ID provided' }, { status: 400 })
  }

  const status = action === 'approve' ? 'approved' : 'rejected'
  const { error } = await supabaseAdmin
    .from('product_corrections')
    .update({ status, reviewed_by: userId, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
