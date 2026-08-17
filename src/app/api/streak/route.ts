import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { ANONYMOUS_USER_ID } from '@/lib/config'

export async function GET(req: NextRequest) {
  const userId = ANONYMOUS_USER_ID

  try {
    const since = new Date()
    since.setDate(since.getDate() - 90)

    const { data: logs } = await supabaseAdmin
      .from('food_logs')
      .select('logged_at')
      .eq('user_id', userId)
      .gte('logged_at', since.toISOString())
      .order('logged_at', { ascending: false })

    if (!logs || logs.length === 0) {
      return NextResponse.json({ success: true, streak: 0, longest: 0, loggedToday: false, lastLoggedAt: null })
    }

    const dates = [
      ...new Set(logs.map(l => new Date(l.logged_at).toLocaleDateString('en-CA')))
    ].sort().reverse()

    const today     = new Date().toLocaleDateString('en-CA')
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA')

    if (dates[0] !== today && dates[0] !== yesterday) {
      return NextResponse.json({
        success: true,
        streak: 0,
        longest: calcLongest(dates),
        loggedToday: false,
        lastLoggedAt: logs[0]!.logged_at,
      })
    }

    let streak = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]!)
      const curr = new Date(dates[i]!)
      const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000)
      if (diff === 1) { streak++ } else { break }
    }

    return NextResponse.json({
      success: true,
      streak,
      longest: calcLongest(dates),
      lastLoggedAt: logs[0]!.logged_at,
      loggedToday: dates[0] === today,
    })
  } catch (err: any) {
    console.error('Streak error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

function calcLongest(dates: string[]): number {
  if (!dates.length) return 0
  let max = 1, cur = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]!)
      const curr = new Date(dates[i]!)
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000)
    if (diff === 1) { cur++; max = Math.max(max, cur) } else { cur = 1 }
  }
  return max
}

