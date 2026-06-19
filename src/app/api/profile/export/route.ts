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

  // Fetch profile
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Fetch food logs
  const { data: foodLogs } = await supabaseAdmin
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })

  const exportData = {
    exported_at: new Date().toISOString(),
    app: 'HealthOX',
    operator: 'Samad Saifi, New Delhi, Delhi, India',
    data: {
      profile: profile || null,
      food_logs: foodLogs || [],
    },
  }

  return NextResponse.json({ success: true, data: exportData })
}
