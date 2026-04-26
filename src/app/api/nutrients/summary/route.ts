import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const RDA = {
  calories: 2000,
  protein:  50,
  carbs:    300,
  fat:      65,
  fiber:    25,
  sodium:   2000,
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [logsResult, profileResult] = await Promise.all([
      supabaseAdmin
        .from('food_logs')
        .select('calories, protein_g, carbs_g, fat_g, sodium_mg, logged_at')
        .eq('user_id', userId)
        .gte('logged_at', sevenDaysAgo),
      supabaseAdmin
        .from('user_profiles')
        .select('daily_calorie_goal')
        .eq('user_id', userId)
        .single(),
    ])

    const logs    = logsResult.data || []
    const profile = profileResult.data

    if (logs.length === 0) {
      return NextResponse.json({ success: true, data: null, message: 'No logs in past 7 days' })
    }

    const distinctDays = new Set(
      logs.map(l => new Date(l.logged_at).toLocaleDateString('en-CA'))
    ).size
    const divisor = Math.max(distinctDays, 1)

    const totals = logs.reduce(
      (acc, l) => ({
        calories: acc.calories + (l.calories   || 0),
        protein:  acc.protein  + (l.protein_g  || 0),
        carbs:    acc.carbs    + (l.carbs_g    || 0),
        fat:      acc.fat      + (l.fat_g      || 0),
        sodium:   acc.sodium   + (l.sodium_mg  || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 }
    )

    const avg = {
      calories: Math.round(totals.calories / divisor),
      protein:  Math.round((totals.protein  / divisor) * 10) / 10,
      carbs:    Math.round((totals.carbs    / divisor) * 10) / 10,
      fat:      Math.round((totals.fat      / divisor) * 10) / 10,
      sodium:   Math.round(totals.sodium    / divisor),
    }

    const calorieGoal = profile?.daily_calorie_goal || RDA.calories

    const alerts: Array<{
      nutrient: string
      type: 'deficient' | 'excess'
      avg: number
      rda: number
      message: string
      severity: 'high' | 'medium'
    }> = []

    if (avg.protein < RDA.protein * 0.7) {
      alerts.push({
        nutrient: 'Protein',
        type: 'deficient',
        avg: avg.protein,
        rda: RDA.protein,
        message: `You're averaging only ${avg.protein}g/day (need ${RDA.protein}g). Low protein causes muscle loss, fatigue, and weakened immunity.`,
        severity: avg.protein < RDA.protein * 0.5 ? 'high' : 'medium',
      })
    }

    if (avg.calories < calorieGoal * 0.7) {
      alerts.push({
        nutrient: 'Calories',
        type: 'deficient',
        avg: avg.calories,
        rda: calorieGoal,
        message: `You're eating only ${avg.calories} kcal/day vs your goal of ${calorieGoal} kcal. Under-eating can cause fatigue and nutrient deficiencies.`,
        severity: 'medium',
      })
    }

    if (avg.calories > calorieGoal * 1.2) {
      alerts.push({
        nutrient: 'Calories',
        type: 'excess',
        avg: avg.calories,
        rda: calorieGoal,
        message: `You're averaging ${avg.calories} kcal/day, ${Math.round(avg.calories - calorieGoal)} kcal above your goal. This may lead to gradual weight gain.`,
        severity: 'medium',
      })
    }

    if (avg.sodium > RDA.sodium * 1.2) {
      alerts.push({
        nutrient: 'Sodium',
        type: 'excess',
        avg: avg.sodium,
        rda: RDA.sodium,
        message: `Your sodium intake (${avg.sodium}mg/day) exceeds WHO's limit of ${RDA.sodium}mg. High sodium raises blood pressure and cardiovascular risk.`,
        severity: avg.sodium > RDA.sodium * 1.5 ? 'high' : 'medium',
      })
    }

    if (avg.fat > RDA.fat * 1.3) {
      alerts.push({
        nutrient: 'Fat',
        type: 'excess',
        avg: avg.fat,
        rda: RDA.fat,
        message: `High fat intake (${avg.fat}g/day vs ${RDA.fat}g recommended) — particularly saturated fats — increases cardiovascular risk.`,
        severity: 'medium',
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        avg,
        rda: { ...RDA, calories: calorieGoal },
        alerts,
        daysTracked: distinctDays,
        totalLogs: logs.length,
      },
    })
  } catch (err: any) {
    console.error('Nutrients summary error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

