import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const {
    age,
    gender,
    weight_kg,
    height_cm,
    activity_level,
    weight_goal,
    is_diabetic,
    has_bp,
    is_vegetarian,
  } = await req.json()

  // ── Calculate BMI ──────────────────────────────────────────
  const heightM = height_cm > 0 ? height_cm / 100 : 0
  if (!heightM) {
    return NextResponse.json({ success: false, error: 'Height must be greater than 0' }, { status: 400 })
  }
  const bmi = parseFloat((weight_kg / (heightM * heightM)).toFixed(1))

  // ── Calculate BMR using Mifflin-St Jeor ───────────────────
  let bmr = 0
  if (gender === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
  }

  // ── Activity multiplier ────────────────────────────────────
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  const tdee = Math.round(bmr * (multipliers[activity_level] || 1.55))

  // ── Adjust for weight goal ─────────────────────────────────
  let dailyCalorieGoal = tdee

  if (weight_goal === 'lose') {
    // Deficit of 500 kcal/day = ~0.5kg/week loss
    dailyCalorieGoal = tdee - 500
  } else if (weight_goal === 'gain') {
    // Surplus of 300 kcal/day = lean muscle gain
    dailyCalorieGoal = tdee + 300
  }
  // 'maintain' = tdee as-is

  // ── Safety clamp ───────────────────────────────────────────
  dailyCalorieGoal = Math.max(1200, Math.min(4000, dailyCalorieGoal))

  console.log(`BMI: ${bmi} | BMR: ${Math.round(bmr)} | TDEE: ${tdee} | Goal: ${dailyCalorieGoal} | Weight goal: ${weight_goal}`)

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      age,
      gender,
      weight_kg,
      height_cm,
      activity_level,
      weight_goal,
      daily_calorie_goal: dailyCalorieGoal,
      target_calories: dailyCalorieGoal,
      is_diabetic: is_diabetic || false,
      has_bp: has_bp || false,
      is_vegetarian: is_vegetarian || false,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.log('Profile update error:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    bmi,
    bmr: Math.round(bmr),
    tdee,
    dailyCalorieGoal,
    weight_goal,
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

