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

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [profileRes, logsRes] = await Promise.all([
      supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single(),
      supabaseAdmin
        .from('food_logs')
        .select('calories, protein_g, carbs_g, fat_g')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString()),
    ])

    const profile = profileRes.data
    const logs = logsRes.data || []

    const totals = logs.reduce(
      (acc: any, l: any) => ({
        calories: acc.calories + (l.calories || 0),
        protein: acc.protein + (l.protein_g || 0),
        carbs: acc.carbs + (l.carbs_g || 0),
        fat: acc.fat + (l.fat_g || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )

    return NextResponse.json({
      success: true,
      data: {
        totalCalories: Math.round(totals.calories),
        totalProtein: Math.round(totals.protein),
        totalCarbs: Math.round(totals.carbs),
        totalFat: Math.round(totals.fat),
        dailyCalorieGoal: profile?.daily_calorie_goal || 2000,
        mealCount: logs.length,
        profile,
      },
    })
  } catch (err: any) {
    console.error('Dashboard API error:', err.message)
    return NextResponse.json({ success: false, error: 'Failed to load dashboard' }, { status: 500 })
  }
}