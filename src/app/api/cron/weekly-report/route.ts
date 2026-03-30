import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('Running weekly report cron...')

  // Only get users who WANT weekly reports and have NOT unsubscribed
  const { data: users } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, email, name')
    .eq('weekly_report_email', true)
    .eq('email_unsubscribed', false)

  if (!users || users.length === 0) {
    return NextResponse.json({ message: 'No users opted in for weekly reports' })
  }

  console.log(`Sending weekly reports to ${users.length} users`)
  const results = []

  for (const user of users) {
    try {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const { data: logs } = await supabaseAdmin
        .from('food_logs')
        .select('*')
        .eq('user_id', user.user_id)
        .gte('logged_at', weekAgo.toISOString())

      if (!logs || logs.length === 0) {
        console.log('No logs for:', user.email)
        continue
      }

      const totalCalories = Math.round(logs.reduce((s, l) => s + (l.calories || 0), 0))
      const avgDaily = Math.round(totalCalories / 7)
      const totalProtein = Math.round(logs.reduce((s, l) => s + (l.protein_g || 0), 0))
      const totalCarbs = Math.round(logs.reduce((s, l) => s + (l.carbs_g || 0), 0))
      const totalFat = Math.round(logs.reduce((s, l) => s + (l.fat_g || 0), 0))
      const daysLogged = new Set(logs.map((l: any) => l.logged_at.split('T')[0])).size
      const firstName = user.name?.split(' ')[0] || 'there'

      const baseUrl = process.env.NEXTAUTH_URL
      const unsubscribeWeeklyUrl = `${baseUrl}/api/unsubscribe?userId=${user.user_id}&type=weekly`
      const unsubscribeAllUrl = `${baseUrl}/api/unsubscribe?userId=${user.user_id}&type=all`

      const html = buildWeeklyReportHTML({
        firstName,
        totalCalories,
        avgDaily,
        totalProtein,
        totalCarbs,
        totalFat,
        daysLogged,
        totalMeals: logs.length,
        unsubscribeWeeklyUrl,
        unsubscribeAllUrl,
        baseUrl: baseUrl || '',
      })

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'HealthOX <onboarding@resend.dev>',
          to: user.email,
          subject: `${firstName}, here is your weekly HealthOX nutrition report 📊`,
          html
        })
      })

      if (res.ok) {
        console.log('Weekly report sent to:', user.email)
        results.push({ email: user.email, status: 'sent' })
      } else {
        const err = await res.json()
        console.log('Failed for:', user.email, err)
        results.push({ email: user.email, status: 'failed' })
      }
    } catch (err: any) {
      console.log('Error for:', user.user_id, err.message)
      results.push({ email: user.email, status: 'error' })
    }
  }

  return NextResponse.json({ success: true, results })
}

function buildWeeklyReportHTML(data: {
  firstName: string
  totalCalories: number
  avgDaily: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  daysLogged: number
  totalMeals: number
  unsubscribeWeeklyUrl: string
  unsubscribeAllUrl: string
  baseUrl: string
}): string {
  const calorieStatus = data.avgDaily < 1500
    ? { label: 'Below target', color: '#3b82f6', advice: 'Try to eat a bit more to reach your daily calorie goal.' }
    : data.avgDaily > 2500
    ? { label: 'Above target', color: '#dc2626', advice: 'Consider reducing portion sizes or high-calorie snacks.' }
    : { label: 'On track', color: '#059669', advice: 'Excellent work keeping your calories in a healthy range!' }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#059669,#0ea5e9);margin-bottom:12px;">
      <span style="font-size:30px;">🥗</span>
    </div>
    <h1 style="font-size:28px;font-weight:900;margin:0;background:linear-gradient(135deg,#059669,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">HealthOX</h1>
    <p style="font-size:13px;color:#6b7280;margin:4px 0 0;">Weekly Nutrition Report</p>
  </div>

  <!-- Main card -->
  <div style="background:white;border-radius:24px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.06);margin-bottom:16px;">

    <h2 style="font-size:22px;font-weight:900;color:#111827;margin:0 0 4px;">
      Hey ${data.firstName}! 👋
    </h2>
    <p style="font-size:14px;color:#6b7280;margin:0 0 28px;">
      Here is how your nutrition looked this past week.
    </p>

    <!-- Status banner -->
    <div style="padding:16px 20px;border-radius:16px;background:${calorieStatus.color}15;border:1px solid ${calorieStatus.color}30;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <div style="width:36px;height:36px;border-radius:10px;background:${calorieStatus.color};display:flex;align-items:center;justify-content:center;color:white;font-size:18px;flex-shrink:0;">
        ${data.avgDaily < 1500 ? '📉' : data.avgDaily > 2500 ? '📈' : '✅'}
      </div>
      <div>
        <p style="font-size:13px;font-weight:800;color:${calorieStatus.color};margin:0 0 2px;">${calorieStatus.label}</p>
        <p style="font-size:12px;color:#6b7280;margin:0;">${calorieStatus.advice}</p>
      </div>
    </div>

    <!-- Stats grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
      ${[
        { label: 'Total Calories', value: data.totalCalories, unit: 'kcal this week', color: '#059669' },
        { label: 'Daily Average', value: data.avgDaily, unit: 'kcal per day', color: '#0ea5e9' },
        { label: 'Days Logged', value: `${data.daysLogged}/7`, unit: 'days this week', color: '#8b5cf6' },
        { label: 'Total Meals', value: data.totalMeals, unit: 'meals logged', color: '#f59e0b' },
      ].map(s => `
        <div style="padding:16px;background:#f9fafb;border-radius:14px;text-align:center;">
          <p style="font-size:26px;font-weight:900;color:${s.color};margin:0 0 2px;">${s.value}</p>
          <p style="font-size:11px;color:#6b7280;margin:0;">${s.unit}</p>
          <p style="font-size:11px;font-weight:600;color:#374151;margin:2px 0 0;">${s.label}</p>
        </div>
      `).join('')}
    </div>

    <!-- Macros -->
    <h3 style="font-size:15px;font-weight:800;color:#111827;margin:0 0 14px;">🥩 Weekly Macros</h3>
    ${[
      { label: 'Protein', value: data.totalProtein, color: '#059669', pct: Math.round((data.totalProtein / (data.totalProtein + data.totalCarbs + data.totalFat)) * 100) || 0 },
      { label: 'Carbohydrates', value: data.totalCarbs, color: '#0ea5e9', pct: Math.round((data.totalCarbs / (data.totalProtein + data.totalCarbs + data.totalFat)) * 100) || 0 },
      { label: 'Fat', value: data.totalFat, color: '#f59e0b', pct: Math.round((data.totalFat / (data.totalProtein + data.totalCarbs + data.totalFat)) * 100) || 0 },
    ].map(m => `
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;color:#374151;font-weight:600;">${m.label}</span>
          <span style="font-size:13px;font-weight:800;color:${m.color};">${m.value}g · ${m.pct}%</span>
        </div>
        <div style="height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${m.pct}%;background:${m.color};border-radius:4px;"></div>
        </div>
      </div>
    `).join('')}

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:24px 0;"></div>

    <!-- Encouragement -->
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px;">
      ${data.daysLogged >= 5
        ? `Amazing consistency, ${data.firstName}! You logged ${data.daysLogged} out of 7 days. That kind of dedication is what creates lasting healthy habits. Keep it up! 💪`
        : data.daysLogged >= 3
        ? `Good progress, ${data.firstName}! You logged ${data.daysLogged} days this week. Try to aim for 5 or more days next week — consistency is the key to lasting change.`
        : `Every journey starts somewhere, ${data.firstName}. You logged ${data.daysLogged} day${data.daysLogged !== 1 ? 's' : ''} this week. Try scanning every meal next week — awareness alone can transform your health!`
      }
    </p>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${data.baseUrl}/scan"
        style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#059669,#0ea5e9);color:white;text-decoration:none;border-radius:14px;font-size:14px;font-weight:800;box-shadow:0 8px 20px rgba(5,150,105,0.3);">
        Scan This Week's Meals →
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:white;border-radius:20px;padding:20px 24px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
    <p style="font-size:13px;color:#374151;font-weight:600;margin:0 0 4px;">Made with 💚 for a healthier India</p>
    <p style="font-size:12px;color:#9ca3af;margin:0 0 16px;">HealthOX — AI-Powered Food Health Advisor</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
      <a href="${data.unsubscribeWeeklyUrl}" style="font-size:11px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from weekly reports
      </a>
      <span style="color:#d1d5db;font-size:11px;">·</span>
      <a href="${data.unsubscribeAllUrl}" style="font-size:11px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from all emails
      </a>
    </div>
  </div>

</div>
</body>
</html>
  `
}