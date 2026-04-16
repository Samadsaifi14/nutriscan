import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { buildUnsubscribeUrls } from '@/lib/tokens'

export async function POST(req: NextRequest) {
  try {
    // ✅ Only allow internal calls (from our own server during sign-in)
    const host = req.headers.get('host') || ''
    const origin = req.headers.get('origin') || ''
    const referer = req.headers.get('referer') || ''
    const expectedHost = new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000').host

    const internalSecret = req.headers.get('x-internal-secret')
    if (internalSecret !== process.env.NEXTAUTH_SECRET) {
      if (!host.includes(expectedHost) && !referer.includes(expectedHost) && !origin.includes(expectedHost)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
    }

    const { userId, email, name } = await req.json()

    if (!userId || !email) {
      return NextResponse.json({ success: false, error: 'Missing userId or email' }, { status: 400 })
    }

    console.log('Welcome email request for:', email)

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('welcome_email_sent, email_unsubscribed')
      .eq('user_id', userId)
      .single()

    if (profile?.welcome_email_sent) {
      console.log('Welcome email already sent to:', email)
      return NextResponse.json({ success: false, reason: 'already_sent' })
    }

    if (profile?.email_unsubscribed) {
      console.log('User unsubscribed:', email)
      return NextResponse.json({ success: false, reason: 'unsubscribed' })
    }

    const firstName = name?.split(' ')[0] || 'there'
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // ✅ Secure signed token URLs instead of raw userId
    const { weeklyUrl: unsubscribeWeeklyUrl, allUrl: unsubscribeAllUrl } = buildUnsubscribeUrls(userId, baseUrl)

    const html = buildWelcomeHTML(firstName, baseUrl, unsubscribeAllUrl, unsubscribeWeeklyUrl)

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.log('RESEND_API_KEY is not set')
      return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'HealthOX <onboarding@resend.dev>',
        to: [email],
        subject: `Welcome to HealthOX, ${firstName}! 🥗 Your journey to healthier eating starts now`,
        html,
      })
    })

    const data = await res.json()
    console.log('Resend response:', JSON.stringify(data))

    if (!res.ok) {
      console.log('Welcome email failed:', data)
      return NextResponse.json({ success: false, error: JSON.stringify(data) }, { status: 500 })
    }

    await supabaseAdmin
      .from('user_profiles')
      .update({ welcome_email_sent: true })
      .eq('user_id', userId)

    console.log('✅ Welcome email sent successfully to:', email)
    return NextResponse.json({ success: true, messageId: data.id })

  } catch (err: any) {
    console.error('Welcome email exception:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

function buildWelcomeHTML(
  firstName: string,
  baseUrl: string,
  unsubscribeAllUrl: string,
  unsubscribeWeeklyUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HealthOX</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- Logo Header -->
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#059669,#0ea5e9);margin-bottom:16px;box-shadow:0 8px 24px rgba(5,150,105,0.35);">
      <span style="font-size:36px;">🥗</span>
    </div>
    <h1 style="font-size:32px;font-weight:900;margin:0 0 4px;background:linear-gradient(135deg,#059669,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">HealthOX</h1>
    <p style="font-size:14px;color:#6b7280;margin:0;">AI-Powered Food Health Advisor</p>
  </div>

  <!-- Main Card -->
  <div style="background:white;border-radius:24px;padding:40px;box-shadow:0 4px 32px rgba(0,0,0,0.06);margin-bottom:20px;">

    <!-- Greeting -->
    <h2 style="font-size:28px;font-weight:900;color:#111827;margin:0 0 8px;">
      Welcome, ${firstName}! 🎉
    </h2>
    <p style="font-size:14px;color:#6b7280;margin:0 0 28px;">We are so glad you are here.</p>

    <p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px;">
      You have just taken a small but meaningful step towards understanding what goes into
      the food you eat every single day. At HealthOX, we believe that
      <strong>knowledge is the first step to better health</strong> — and you now have
      that knowledge at your fingertips.
    </p>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:28px 0;"></div>

    <!-- Our Mission -->
    <h3 style="font-size:17px;font-weight:800;color:#111827;margin:0 0 14px;">🌱 Why We Built HealthOX</h3>

    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 14px;">
      India is home to over 1.4 billion people, yet most of us eat packaged food every day
      without truly knowing what is inside it. Hidden sugars, artificial preservatives,
      excessive sodium, harmful additives — they quietly affect our health while we remain
      completely unaware.
    </p>

    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 28px;">
      We built HealthOX with one heartfelt intention — to make food transparency
      <strong>free, accessible, and easy for every Indian family</strong>. Just scan a product
      and instantly know if it is good for you, your children, or your parents — powered by
      Google Gemini AI and FSSAI standards.
    </p>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:0 0 28px;"></div>

    <!-- Features -->
    <h3 style="font-size:17px;font-weight:800;color:#111827;margin:0 0 16px;">✨ What you can do with HealthOX</h3>

    ${[
      { icon: '📷', title: 'Scan any packaged food', desc: 'Point your camera at a barcode or nutrition label. Works on all Indian products — even ones not in any database yet.' },
      { icon: '🤖', title: 'Instant AI health rating', desc: 'Gemini AI checks every ingredient, flags harmful additives like E621 and TBHQ, and gives you a clear 1–10 health score.' },
      { icon: '📊', title: 'Track your daily nutrition', desc: 'Log meals, monitor calories, and see your protein, carbs and fat breakdown. Your calorie goal is personalised based on your BMI.' },
      { icon: '📧', title: 'Weekly nutrition reports', desc: 'Every Monday morning you receive a detailed email showing your week — total calories, macros, and which products to watch out for.' },
      { icon: '🇮🇳', title: 'Help build India\'s food database', desc: 'When you scan a product not in our database, Gemini reads the label and adds it for every Indian family.' },
    ].map(f => `
      <div style="display:flex;align-items:flex-start;gap:14px;padding:16px;background:#f0fdf4;border-radius:14px;margin-bottom:10px;border:1px solid #d1fae5;">
        <span style="font-size:26px;flex-shrink:0;">${f.icon}</span>
        <div>
          <p style="font-size:14px;font-weight:700;color:#111827;margin:0 0 4px;">${f.title}</p>
          <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0;">${f.desc}</p>
        </div>
      </div>
    `).join('')}

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:28px 0;"></div>

    <!-- Quick tips -->
    <h3 style="font-size:17px;font-weight:800;color:#111827;margin:0 0 14px;">💡 3 things to do right now</h3>

    ${[
      { num: '1', text: 'Complete your health profile to get a personalised calorie goal based on your BMI, activity level and whether you want to lose, maintain or gain weight.' },
      { num: '2', text: 'Try scanning Parle-G, Maggi or Lay\'s to see the full AI analysis — you might be surprised by the score!' },
      { num: '3', text: 'Enable weekly reports in your Profile settings so every Monday you get a full nutrition summary in your inbox.' },
    ].map(tip => `
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
        <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#059669,#0ea5e9);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:white;font-size:13px;font-weight:900;">${tip.num}</div>
        <p style="font-size:13px;color:#374151;line-height:1.7;margin:4px 0 0;">${tip.text}</p>
      </div>
    `).join('')}

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:28px 0;"></div>

    <!-- Personal message -->
    <div style="background:linear-gradient(135deg,rgba(5,150,105,0.06),rgba(14,165,233,0.04));border-radius:16px;padding:20px;border:1px solid rgba(5,150,105,0.15);margin-bottom:28px;">
      <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 10px;">
        ${firstName}, every scan you make, every meal you log, every product you add to
        our database — it all adds up to something bigger. You are not just tracking
        your own health. You are helping build a healthier future for millions of
        Indian families.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;margin:0;">
        We are genuinely rooting for you. <strong>You have got this. 💚</strong>
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align:center;">
      <a href="${baseUrl}/scan"
        style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#059669,#0ea5e9);color:white;text-decoration:none;border-radius:14px;font-size:15px;font-weight:800;box-shadow:0 8px 24px rgba(5,150,105,0.35);">
        Start Scanning Now →
      </a>
      <p style="font-size:12px;color:#9ca3af;margin:12px 0 0;">
        Takes less than 30 seconds to get your first AI health rating
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:white;border-radius:20px;padding:20px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.04);text-align:center;">
    <p style="font-size:13px;color:#374151;font-weight:600;margin:0 0 4px;">Made with 💚 for a healthier India</p>
    <p style="font-size:12px;color:#9ca3af;margin:0 0 16px;">HealthOX — AI-Powered Food Health Advisor</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
      <a href="${unsubscribeWeeklyUrl}" style="font-size:11px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from weekly reports
      </a>
      <span style="color:#d1d5db;">·</span>
      <a href="${unsubscribeAllUrl}" style="font-size:11px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from all emails
      </a>
    </div>
  </div>

</div>
</body>
</html>
  `
}