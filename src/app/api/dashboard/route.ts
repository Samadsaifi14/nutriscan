import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's logs
    const { data: todayLogs } = await supabaseAdmin
      .from('food_logs')
      .select('calories, protein_g, carbs_g, fat_g')
      .eq('user_id', userId)
      .gte('logged_at', today.toISOString())
      .lt('logged_at', tomorrow.toISOString())

    // Calculate totals
    const totalCalories = todayLogs?.reduce((sum, log) => sum + (log.calories || 0), 0) || 0
    const totalProtein = todayLogs?.reduce((sum, log) => sum + (log.protein_g || 0), 0) || 0
    const totalCarbs = todayLogs?.reduce((sum, log) => sum + (log.carbs_g || 0), 0) || 0
    const totalFat = todayLogs?.reduce((sum, log) => sum + (log.fat_g || 0), 0) || 0

    // Get user's profile for daily goal
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('daily_calorie_goal')
      .eq('user_id', userId)
      .single()

    const dailyCalorieGoal = profile?.daily_calorie_goal || 2000
    const mealCount = todayLogs?.length || 0

    // Get profile info
    const { data: profileData } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get last 7 days for weekly stats
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { data: weekLogs } = await supabaseAdmin
      .from('food_logs')
      .select('calories, protein_g, carbs_g, fat_g, logged_at')
      .eq('user_id', userId)
      .gte('logged_at', weekAgo.toISOString())

    // Calculate weekly daily averages
    const daysWithLogs = new Set(weekLogs?.map(l => new Date(l.logged_at).toDateString()) || [])
    const daysCount = Math.max(daysWithLogs.size, 1)

    const weeklyAvg = {
      calories: Math.round((weekLogs?.reduce((s, l) => s + (l.calories || 0), 0) || 0) / daysCount),
      protein: Math.round((weekLogs?.reduce((s, l) => s + (l.protein_g || 0), 0) || 0) / daysCount),
      carbs: Math.round((weekLogs?.reduce((s, l) => s + (l.carbs_g || 0), 0) || 0) / daysCount),
      fat: Math.round((weekLogs?.reduce((s, l) => s + (l.fat_g || 0), 0) || 0) / daysCount),
    }

    // Generate insights
    const insights: string[] = []
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdayLogs = weekLogs?.filter(l => 
      new Date(l.logged_at).toDateString() === yesterday.toDateString()
    ) || []

    const yesterdayCals = yesterdayLogs.reduce((s, l) => s + (l.calories || 0), 0)

    if (totalCalories > dailyCalorieGoal) {
      insights.push(`⚠️ You've exceeded today's calorie goal by ${totalCalories - dailyCalorieGoal} kcal`)
    } else if (totalCalories > dailyCalorieGoal * 0.85) {
      insights.push(`📊 You're at ${Math.round((totalCalories / dailyCalorieGoal) * 100)}% of daily goal`)
    }

    if (yesterdayCals > totalCalories * 1.2 && totalCalories > 0) {
      insights.push(`📉 Your calorie intake is lower than yesterday - great progress!`)
    }

    if (weeklyAvg.calories > dailyCalorieGoal + 200) {
      insights.push(`📈 Weekly average (${weeklyAvg.calories} kcal) is above your goal`)
    }

    if (totalProtein < 30) {
      insights.push(`💪 Protein intake is low (${totalProtein}g) - consider adding more`)
    }

    if (weekLogs && weekLogs.length < 3) {
      insights.push(`📝 You've logged ${weekLogs.length} meals this week - keep tracking!`)
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        dailyCalorieGoal,
        mealCount,
        profile: profileData,
        weeklyStats: {
          average: weeklyAvg,
          totalLogs: weekLogs?.length || 0,
          daysTracked: daysCount,
        },
        insights,
      }
    })
  } catch (err: any) {
    console.error('Dashboard API error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}