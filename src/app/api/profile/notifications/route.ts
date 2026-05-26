import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('notifications')
    .eq('user_id', userId)
    .single()

  const notifications = (profile?.notifications as any[]) || []
  return NextResponse.json({ success: true, data: notifications })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { notificationId } = await req.json()

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('notifications')
    .eq('user_id', userId)
    .single()

  const notifications: any[] = (profile?.notifications as any[]) || []
  const updated = notifications.filter((n: any) => n.id !== notificationId)

  await supabaseAdmin
    .from('user_profiles')
    .update({ notifications: updated })
    .eq('user_id', userId)

  return NextResponse.json({ success: true })
}
