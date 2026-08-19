import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { transformLogToCard, computeStreak, computeTrend } from '@/lib/frontend-transform'
import { ANONYMOUS_USER_ID } from '@/lib/config'

export async function GET(req: NextRequest) {
  try {
    const userId = ANONYMOUS_USER_ID

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const fourteenDaysAgo = new Date(today)
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    // Run all queries in parallel
    const [dailyStatsResult, recentLogsResult, totalCountResult, currentWeekResult, priorWeekResult] = await Promise.all([
      supabaseAdmin.rpc('get_user_daily_stats', { uid: userId, since_date: thirtyDaysAgo.toISOString().split('T')[0]! }),
      supabaseAdmin
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(10),
      supabaseAdmin
        .from('food_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseAdmin
        .from('food_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('logged_at', sevenDaysAgo.toISOString()),
      supabaseAdmin
        .from('food_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('logged_at', fourteenDaysAgo.toISOString())
        .lt('logged_at', sevenDaysAgo.toISOString()),
    ])

    const dailyStats: { log_date: string; scan_count: number; avg_score: number }[] = dailyStatsResult.data || []
    const recentLogsRaw = recentLogsResult.data || []
    const totalScans = totalCountResult.count || 0
    const thisWeek = currentWeekResult.count || 0

    // Fetch product data for recent logs by barcode
    const barcodes = recentLogsRaw.map((l) => l.barcode).filter(Boolean) as string[]
    const productMap = new Map<string, { brand: string | null; image_url: string | null; health_score: number | null }>()
    if (barcodes.length > 0) {
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('barcode, brand, image_url, health_score')
        .in('barcode', barcodes)
      for (const p of products || []) {
        productMap.set(p.barcode, p)
      }
    }

    // Compute streak from daily stats
    const streak = computeStreak(dailyStats)

    // Compute overallScore = average of recent daily averages
    const recentDays = dailyStats.filter((d) => d.avg_score > 0)
    const overallScore = recentDays.length > 0
      ? Math.round((recentDays.reduce((s, d) => s + d.avg_score, 0) / recentDays.length) * 10) / 10
      : 7

    // Compute weekly averages for trend
    const currentWeekStats = dailyStats.filter((d) => {
      const date = new Date(d.log_date + 'T00:00:00')
      return date >= sevenDaysAgo
    })
    const priorWeekStats = dailyStats.filter((d) => {
      const date = new Date(d.log_date + 'T00:00:00')
      return date >= fourteenDaysAgo && date < sevenDaysAgo
    })

    const currentWeekAvg = currentWeekStats.length > 0
      ? currentWeekStats.reduce((s, d) => s + d.avg_score, 0) / currentWeekStats.length
      : 0
    const priorWeekAvg = priorWeekStats.length > 0
      ? priorWeekStats.reduce((s, d) => s + d.avg_score, 0) / priorWeekStats.length
      : null

    const trend = computeTrend(currentWeekAvg, priorWeekAvg)

    // Best week = highest avg daily score across any calendar week in the stats
    const weekBuckets = new Map<number, { total: number; count: number }>()
    for (const d of dailyStats) {
      const dayNum = Math.floor(new Date(d.log_date + 'T00:00:00').getTime() / 86_400_000)
      const weekKey = Math.floor(dayNum / 7)
      const bucket = weekBuckets.get(weekKey) || { total: 0, count: 0 }
      bucket.total += d.avg_score
      bucket.count += 1
      weekBuckets.set(weekKey, bucket)
    }
    let bestWeek = 0
    for (const { total, count } of weekBuckets.values()) {
      const avg = total / count
      if (avg > bestWeek) bestWeek = Math.round(avg * 10) / 10
    }

    // Transform recent logs into product/analysis CardItem shape
    const recentScans = recentLogsRaw.map((log: any) => {
      const product = log.barcode ? productMap.get(log.barcode) : undefined
      return transformLogToCard(log, product ? { brand: product.brand, image_url: product.image_url, health_score: product.health_score } : undefined)
    })

    const avgScore = overallScore

    // Real 7-day breakdown (Mon..Sun) from daily stats
    const weeklyBreakdown = [0, 0, 0, 0, 0, 0, 0]
    for (const d of dailyStats) {
      const date = new Date(d.log_date + 'T00:00:00')
      if (date >= sevenDaysAgo) {
        const wd = date.getDay() // 0=Sun..6=Sat
        const idx = wd === 0 ? 6 : wd - 1 // Mon=0..Sun=6
        weeklyBreakdown[idx] = (weeklyBreakdown[idx] ?? 0) + d.scan_count
      }
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const monthLabel = monthNames[today.getMonth()] || ''

    return NextResponse.json({
      success: true,
      overallScore,
      streak,
      totalScans,
      avgScore,
      thisWeek,
      weeklyBreakdown,
      recentScans,
      bestWeek,
      trend,
      monthLabel,
    })
  } catch (err: any) {
    console.error('Dashboard API error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
