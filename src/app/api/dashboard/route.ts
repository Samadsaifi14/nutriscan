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
      }
    })
  } catch (err: any) {
    console.error('Dashboard API error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}