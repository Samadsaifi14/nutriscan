import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  // Security check — only Vercel can call this
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('Running weekly report cron job...')

  // Get all users who want weekly reports
  const { data: users } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, email, name')
    .eq('weekly_report_email', true)

  if (!users || users.length === 0) {
    return NextResponse.json({ message: 'No users to report' })
  }

  console.log(`Sending reports to ${users.length} users`)

  const results = []

  for (const user of users) {
    try {
      // Get this user's logs from the past 7 days
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const { data: logs } = await supabaseAdmin
        .from('food_logs')
        .select('*')
        .eq('user_id', user.user_id)
        .gte('logged_at', weekAgo.toISOString())

      if (!logs || logs.length === 0) {
        console.log(`No logs for ${user.email} this week`)
        continue
      }

      // Calculate summary
      const totalCalories = Math.round(logs.reduce((s, l) => s + (l.calories || 0), 0))
      const avgDaily = Math.round(totalCalories / 7)
      const totalProtein = Math.round(logs.reduce((s, l) => s + (l.protein_g || 0), 0))
      const totalCarbs = Math.round(logs.reduce((s, l) => s + (l.carbs_g || 0), 0))
      const totalFat = Math.round(logs.reduce((s, l) => s + (l.fat_g || 0), 0))
      const daysLogged = new Set(logs.map((l: any) => l.logged_at.split('T')[0])).size

      // Send email
      const html = buildEmailHTML({
        name: user.name || 'there',
        totalCalories,
        avgDaily,
        totalProtein,
        totalCarbs,
        totalFat,
        daysLogged,
        totalMeals: logs.length
      })

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'NutriScan <onboarding@resend.dev>',
          to: user.email,
          subject: '🥗 Your Weekly NutriScan Report',
          html
        })
      })

      if (res.ok) {
        console.log('Report sent to:', user.email)
        results.push({ email: user.email, status: 'sent' })
      } else {
        const err = await res.json()
        console.log('Failed for:', user.email, err)
        results.push({ email: user.email, status: 'failed' })
      }
    } catch (err: any) {
      console.log('Error for user:', user.email, err.message)
      results.push({ email: user.email, status: 'error' })
    }
  }

  return NextResponse.json({ success: true, results })
}

function buildEmailHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f0fdf4;">
      <div style="background:white;border-radius:16px;padding:32px;">

        <h1 style="color:#16a34a;margin-bottom:4px;">🥗 Weekly NutriScan Report</h1>
        <p style="color:#6b7280;margin-bottom:24px;">Hello ${data.name}! Here's your nutrition summary for this week.</p>

        <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin-bottom:16px;">
          <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Total Calories This Week</p>
          <p style="font-size:32px;font-weight:700;color:#111827;margin:0;">${data.totalCalories} kcal</p>
        </div>

        <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin-bottom:16px;">
          <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Average Daily Calories</p>
          <p style="font-size:32px;font-weight:700;color:#16a34a;margin:0;">${data.avgDaily} kcal/day</p>
        </div>

        <table style="width:100%;margin-bottom:20px;">
          <tr>
            <td style="padding:16px;background:#f9fafb;border-radius:8px;text-align:center;">
              <div style="font-size:22px;font-weight:700;color:#111827;">${data.totalProtein}g</div>
              <div style="font-size:12px;color:#6b7280;">Protein</div>
            </td>
            <td style="width:8px;"></td>
            <td style="padding:16px;background:#f9fafb;border-radius:8px;text-align:center;">
              <div style="font-size:22px;font-weight:700;color:#111827;">${data.totalCarbs}g</div>
              <div style="font-size:12px;color:#6b7280;">Carbs</div>
            </td>
            <td style="width:8px;"></td>
            <td style="padding:16px;background:#f9fafb;border-radius:8px;text-align:center;">
              <div style="font-size:22px;font-weight:700;color:#111827;">${data.totalFat}g</div>
              <div style="font-size:12px;color:#6b7280;">Fat</div>
            </td>
          </tr>
        </table>

        <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="margin:0;font-size:14px;color:#374151;">
            📅 You logged meals on <strong>${data.daysLogged} out of 7 days</strong>
            with a total of <strong>${data.totalMeals} meals</strong> tracked this week.
          </p>
        </div>

        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:20px;">
          NutriScan — AI Powered Food Health Advisor
        </p>
      </div>
    </body>
    </html>
  `
}