import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      // Allow unauthenticated access to leaderboard but return empty
      return NextResponse.json({ success: true, leaderboard: [] })
    }

    const { data, error } = await supabaseAdmin.rpc('get_leaderboard', { limit_count: 10 })

    if (error) {
      console.error('Leaderboard error:', error.message)
      return NextResponse.json({ success: true, leaderboard: [] })
    }

    const leaderboard = (data || []).map((row: any) => ({
      name: row.display_name || 'Unknown',
      score: Math.round((row.avg_score || 0) * 10) / 10,
    }))

    return NextResponse.json({ success: true, leaderboard })
  } catch (err: any) {
    console.error('Leaderboard API error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
