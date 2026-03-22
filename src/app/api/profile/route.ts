import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { age, gender, weight_kg, height_cm, activity_level } = await req.json()

  // Calculate BMI
  const bmi = parseFloat((weight_kg / ((height_cm / 100) ** 2)).toFixed(1))

  // Calculate BMR using Mifflin-St Jeor equation
  let bmr = 0
  if (gender === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
  }

  // Multiply by activity level multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  const multiplier = activityMultipliers[activity_level] || 1.55

  // Maintenance calories
  let dailyCalorieGoal = Math.round(bmr * multiplier)

  // Adjust based on BMI
  if (bmi > 25) {
    // Overweight — reduce by 500 for weight loss
    dailyCalorieGoal = Math.round(dailyCalorieGoal * 0.85)
  } else if (bmi < 18.5) {
    // Underweight — increase by 300 for weight gain
    dailyCalorieGoal = Math.round(dailyCalorieGoal * 1.15)
  }

  // Keep within safe limits
  dailyCalorieGoal = Math.max(1200, Math.min(3500, dailyCalorieGoal))

  console.log(`BMI: ${bmi}, BMR: ${Math.round(bmr)}, Goal: ${dailyCalorieGoal}`)

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      age,
      gender,
      weight_kg,
      height_cm,
      activity_level,
      daily_calorie_goal: dailyCalorieGoal,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    bmi,
    dailyCalorieGoal,
  })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
