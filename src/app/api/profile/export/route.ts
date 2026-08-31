import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { ANONYMOUS_USER_ID } from '@/lib/config'

export async function GET(req: NextRequest) {
  const userId = ANONYMOUS_USER_ID

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
    app: 'NutriScan',
    operator: 'Samad Saifi, New Delhi, Delhi, India',
    data: {
      profile: profile || null,
      food_logs: foodLogs || [],
    },
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="healthox-export-${Date.now()}.json"`,
    },
  })
}
