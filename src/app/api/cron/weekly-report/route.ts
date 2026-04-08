import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  // Security — only Vercel cron can call this
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('Unauthorized cron attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('🕐 Running weekly report cron job...')

  // Get ALL users who want weekly reports and have NOT unsubscribed
  // Also handle users who have null values (newly created profiles)
  const { data: users, error: usersError } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, email, name, weekly_report_email, email_unsubscribed')
    .neq('email', null)
    .or('weekly_report_email.is.null,weekly_report_email.eq.true')
    .not('email_unsubscribed', 'eq', true)

  if (usersError) {
    console.log('Error fetching users:', usersError.message)
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }

  if (!users || users.length === 0) {
    console.log('No users to send weekly reports to')
    return NextResponse.json({ message: 'No users opted in' })
  }

  console.log(`📧 Sending weekly reports to ${users.length} users`)

  const results = []
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  for (const user of users) {
    try {
      // Skip if no email
      if (!user.email) {
        console.log('Skipping user with no email:', user.user_id)
        continue
      }

      // Get this week's food logs
      const { data: logs } = await supabaseAdmin
        .from('food_logs')
        .select('*')
        .eq('user_id', user.user_id)
        .gte('logged_at', weekAgo.toISOString())

      if (!logs || logs.length === 0) {
        console.log('No logs this week for:', user.email)
        continue
      }

      // Get worst products scanned this week
      const { data: worstProducts } = await supabaseAdmin
        .from('scan_sessions')
        .select('product_name, ai_health_rating, ai_health_score')
        .eq('user_id', user.user_id)
        .eq('ai_health_rating', 'unhealthy')
        .gte('scanned_at', weekAgo.toISOString())
        .order('ai_health_score', { ascending: true })
        .limit(3)

      // Calculate stats
      const totalCalories = Math.round(logs.reduce((s, l) => s + (l.calories || 0), 0))
      const avgDaily = Math.round(totalCalories / 7)
      const totalProtein = Math.round(logs.reduce((s, l) => s + (l.protein_g || 0), 0))
      const totalCarbs = Math.round(logs.reduce((s, l) => s + (l.carbs_g || 0), 0))
      const totalFat = Math.round(logs.reduce((s, l) => s + (l.fat_g || 0), 0))
      const daysLogged = new Set(logs.map((l: any) => l.logged_at.split('T')[0])).size
      const firstName = user.name?.split(' ')[0] || 'there'

      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const unsubscribeWeeklyUrl = `${baseUrl}/api/unsubscribe?userId=${user.user_id}&type=weekly`
      const unsubscribeAllUrl = `${baseUrl}/api/unsubscribe?userId=${user.user_id}&type=all`

      const html = buildWeeklyHTML({
        firstName,
        totalCalories,
        avgDaily,
        totalProtein,
        totalCarbs,
        totalFat,
        daysLogged,
        totalMeals: logs.length,
        worstProducts: worstProducts || [],
        unsubscribeWeeklyUrl,
        unsubscribeAllUrl,
        baseUrl,
      })

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'HealthOX <onboarding@resend.dev>',
          to: [user.email],
          subject: `${firstName}, here is your weekly HealthOX nutrition report 📊`,
          html,
        })
      })

      const resData = await res.json()

      if (res.ok) {
        console.log('✅ Weekly report sent to:', user.email)
        results.push({ email: user.email, status: 'sent', messageId: resData.id })
      } else {
        console.log('❌ Failed for:', user.email, JSON.stringify(resData))
        results.push({ email: user.email, status: 'failed', error: resData })
      }

    } catch (err: any) {
      console.log('❌ Exception for:', user.email, err.message)
      results.push({ email: user.email, status: 'error', error: err.message })
    }
  }

  const sent = results.filter(r => r.status === 'sent').length
  const failed = results.filter(r => r.status !== 'sent').length

  console.log(`✅ Weekly report done: ${sent} sent, ${failed} failed`)
  return NextResponse.json({ success: true, sent, failed, results })
}

function buildWeeklyHTML(data: {
  firstName: string
  totalCalories: number
  avgDaily: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  daysLogged: number
  totalMeals: number
  worstProducts: any[]
  unsubscribeWeeklyUrl: string
  unsubscribeAllUrl: string
  baseUrl: string
}): string {

  const calorieStatus = data.avgDaily < 1400
    ? { label: 'Below target', color: '#3b82f6', icon: '📉', advice: 'Try to eat a bit more to reach your daily calorie goal and maintain energy levels.' }
    : data.avgDaily > 2800
    ? { label: 'Above target', color: '#dc2626', icon: '📈', advice: 'Consider reducing portion sizes or switching high-calorie snacks for healthier options.' }
    : { label: 'On track', color: '#059669', icon: '✅', advice: 'Excellent work keeping your calories in a healthy range this week!' }

  const totalMacros = data.totalProtein + data.totalCarbs + data.totalFat

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HealthOX Weekly Report</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,#059669,#0ea5e9);margin-bottom:12px;box-shadow:0 6px 20px rgba(5,150,105,0.3);">
      <span style="font-size:30px;">🥗</span>
    </div>
    <h1 style="font-size:28px;font-weight:900;margin:0 0 4px;background:linear-gradient(135deg,#059669,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">HealthOX</h1>
    <p style="font-size:13px;color:#6b7280;margin:0;">Weekly Nutrition Report</p>
  </div>

  <!-- Main Card -->
  <div style="background:white;border-radius:24px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.06);margin-bottom:16px;">

    <h2 style="font-size:24px;font-weight:900;color:#111827;margin:0 0 4px;">
      Hey ${data.firstName}! 👋
    </h2>
    <p style="font-size:14px;color:#6b7280;margin:0 0 28px;">
      Here is how your nutrition looked this past week.
    </p>

    <!-- Status Banner -->
    <div style="padding:16px 20px;border-radius:14px;background:${calorieStatus.color}15;border:1px solid ${calorieStatus.color}30;margin-bottom:24px;display:flex;align-items:flex-start;gap:14px;">
      <div style="width:40px;height:40px;border-radius:10px;background:${calorieStatus.color};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">
        ${calorieStatus.icon}
      </div>
      <div>
        <p style="font-size:14px;font-weight:800;color:${calorieStatus.color};margin:0 0 4px;">${calorieStatus.label}</p>
        <p style="font-size:13px;color:#6b7280;margin:0;line-height:1.5;">${calorieStatus.advice}</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
      ${[
        { label: 'Total Calories', value: data.totalCalories.toLocaleString(), unit: 'kcal this week', color: '#059669' },
        { label: 'Daily Average', value: data.avgDaily.toLocaleString(), unit: 'kcal per day', color: '#0ea5e9' },
        { label: 'Days Logged', value: `${data.daysLogged}/7`, unit: 'days this week', color: '#8b5cf6' },
        { label: 'Total Meals', value: data.totalMeals.toString(), unit: 'meals logged', color: '#f59e0b' },
      ].map(s => `
        <div style="padding:16px;background:#f9fafb;border-radius:14px;text-align:center;border:1px solid #f3f4f6;">
          <p style="font-size:24px;font-weight:900;color:${s.color};margin:0 0 2px;">${s.value}</p>
          <p style="font-size:11px;color:#9ca3af;margin:0 0 2px;">${s.unit}</p>
          <p style="font-size:11px;font-weight:600;color:#374151;margin:0;">${s.label}</p>
        </div>
      `).join('')}
    </div>

    <!-- Macros -->
    <h3 style="font-size:15px;font-weight:800;color:#111827;margin:0 0 14px;">🥩 Weekly Macros Breakdown</h3>

    ${[
      { label: 'Protein', value: data.totalProtein, color: '#059669' },
      { label: 'Carbohydrates', value: data.totalCarbs, color: '#0ea5e9' },
      { label: 'Fat', value: data.totalFat, color: '#f59e0b' },
    ].map(m => {
      const pct = totalMacros > 0 ? Math.round((m.value / totalMacros) * 100) : 0
      return `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-size:13px;color:#374151;font-weight:600;">${m.label}</span>
            <span style="font-size:13px;font-weight:800;color:${m.color};">${m.value}g · ${pct}%</span>
          </div>
          <div style="height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:${m.color};border-radius:4px;transition:width 0.5s;"></div>
          </div>
        </div>
      `
    }).join('')}

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:24px 0;"></div>

    <!-- Worst products section -->
    ${data.worstProducts && data.worstProducts.length > 0 ? `
      <h3 style="font-size:15px;font-weight:800;color:#111827;margin:0 0 6px;">⚠️ Watch out for these</h3>
      <p style="font-size:13px;color:#6b7280;margin:0 0 14px;">These products you scanned this week scored poorly on health:</p>
      ${data.worstProducts.map((p: any) => `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fef2f2;border-radius:12px;margin-bottom:8px;border:1px solid #fecaca;">
          <span style="font-size:20px;flex-shrink:0;">❌</span>
          <div style="flex:1;">
            <p style="font-size:13px;font-weight:700;color:#111827;margin:0 0 2px;">${p.product_name}</p>
            <p style="font-size:12px;color:#dc2626;margin:0;">Health score: ${p.ai_health_score}/10</p>
          </div>
        </div>
      `).join('')}
      <div style="padding:14px;background:#f0fdf4;border-radius:12px;margin:12px 0 24px;border:1px solid #bbf7d0;">
        <p style="font-size:13px;font-weight:700;color:#059669;margin:0 0 6px;">💚 Healthier swaps to try</p>
        <p style="font-size:12px;color:#374151;margin:0;line-height:1.7;">
          Instead of packaged snacks try roasted chana, makhana, fox nuts, fresh fruit, or
          homemade snacks this week. Small swaps make a big difference over time!
        </p>
      </div>
      <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:0 0 24px;"></div>
    ` : ''}

    <!-- Encouragement message -->
    <div style="background:linear-gradient(135deg,rgba(5,150,105,0.06),rgba(14,165,233,0.04));border-radius:14px;padding:18px;margin-bottom:28px;border:1px solid rgba(5,150,105,0.15);">
      <p style="font-size:14px;color:#374151;line-height:1.8;margin:0;">
        ${data.daysLogged >= 5
          ? `🔥 Amazing consistency ${data.firstName}! You logged <strong>${data.daysLogged} out of 7 days</strong> this week. That kind of dedication is what creates lasting healthy habits. Keep it up!`
          : data.daysLogged >= 3
          ? `👍 Good progress ${data.firstName}! You logged <strong>${data.daysLogged} days</strong> this week. Try to aim for 5+ days next week — consistency is the key to lasting change.`
          : `🌱 Every journey starts somewhere, ${data.firstName}. You logged <strong>${data.daysLogged} day${data.daysLogged !== 1 ? 's' : ''}</strong> this week. Try scanning every meal next week — awareness alone can transform your health!`
        }
      </p>
    </div>

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