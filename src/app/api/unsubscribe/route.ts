import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const type = req.nextUrl.searchParams.get('type') || 'all'

  if (!userId) {
    return new NextResponse(buildHTML('Invalid unsubscribe link.', false), {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  try {
    const updates: any = {}

    if (type === 'weekly') {
      updates.weekly_report_email = false
    } else {
      updates.email_unsubscribed = true
      updates.weekly_report_email = false
    }

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)

    if (error) throw error

    const message = type === 'weekly'
      ? 'You have been unsubscribed from weekly nutrition reports. You will still receive important account emails.'
      : 'You have been unsubscribed from all HealthOX emails.'

    return new NextResponse(buildHTML(message, true), {
      headers: { 'Content-Type': 'text/html' }
    })

  } catch (err) {
    return new NextResponse(buildHTML('Something went wrong. Please try again.', false), {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

function buildHTML(message: string, success: boolean): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HealthOX — Unsubscribe</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:400px;margin:0 auto;padding:32px 16px;text-align:center;">
    <div style="font-size:56px;margin-bottom:16px;">${success ? '✅' : '❌'}</div>
    <div style="background:white;border-radius:20px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <h1 style="font-size:20px;font-weight:800;color:#111827;margin:0 0 12px;">
        ${success ? 'Unsubscribed Successfully' : 'Something Went Wrong'}
      </h1>
      <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0 0 24px;">
        ${message}
      </p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard"
        style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#059669,#0ea5e9);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:700;">
        Go to HealthOX →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;margin-top:20px;">
      Made with 💚 for a healthier India
    </p>
  </div>
</body>
</html>
  `
}