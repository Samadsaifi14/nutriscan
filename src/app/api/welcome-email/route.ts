import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const { userId, email, name } = await req.json()

  if (!userId || !email) {
    return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 })
  }

  // Check if welcome email already sent
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('welcome_email_sent')
    .eq('user_id', userId)
    .single()

  if (profile?.welcome_email_sent) {
    console.log('Welcome email already sent to:', email)
    return NextResponse.json({ success: false, reason: 'already_sent' })
  }

  const firstName = name?.split(' ')[0] || 'there'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:56px;margin-bottom:8px;">🥗</div>
      <h1 style="font-size:28px;font-weight:800;color:#16a34a;margin:0;">NutriScan</h1>
      <p style="font-size:14px;color:#6b7280;margin:4px 0 0;">AI-Powered Food Health Advisor</p>
    </div>

    <!-- Main card -->
    <div style="background:white;border-radius:20px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.06);margin-bottom:24px;">

      <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px;">
        Welcome, ${firstName}! 🎉
      </h2>

      <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">
        We are so glad you joined NutriScan. You have taken a meaningful step towards 
        understanding what goes into your food and making healthier choices for yourself 
        and your family.
      </p>

      <!-- Divider -->
      <div style="height:1px;background:#f3f4f6;margin:24px 0;"></div>

      <!-- Our initiative -->
      <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">
        🌱 Our Initiative
      </h3>

      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 16px;">
        India has over 1.4 billion people, yet most of us have no idea what is actually 
        inside the packaged food we eat every day. Hidden sugars, artificial additives, 
        excessive sodium — these quietly affect our health without us even knowing.
      </p>

      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 16px;">
        <strong>NutriScan was built with one simple mission:</strong> to make food transparency 
        accessible to every Indian. No medical degree required. No confusing labels. 
        Just scan, and instantly know if what you are about to eat is good for you.
      </p>

      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 24px;">
        We use <strong>Gemini AI</strong> to analyse ingredients against FSSAI standards, 
        flag harmful additives, and give you personalised advice based on your own health 
        profile. We are building a crowdsourced database of Indian products so that 
        every family across the country can make informed food choices.
      </p>

      <!-- Divider -->
      <div style="height:1px;background:#f3f4f6;margin:0 0 24px;"></div>

      <!-- What you can do -->
      <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 16px;">
        ✨ What you can do with NutriScan
      </h3>

      <div style="display:flex;flex-direction:column;gap:12px;">

        <div style="display:flex;align-items:flex-start;gap:12px;padding:14px;background:#f0fdf4;border-radius:12px;">
          <span style="font-size:24px;flex-shrink:0;">📷</span>
          <div>
            <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 2px;">Scan any packaged food</p>
            <p style="font-size:13px;color:#6b7280;margin:0;">Point your camera at a barcode or nutrition label and get an instant AI health rating</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:12px;padding:14px;background:#f0fdf4;border-radius:12px;">
          <span style="font-size:24px;flex-shrink:0;">🤖</span>
          <div>
            <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 2px;">Get AI-powered analysis</p>
            <p style="font-size:13px;color:#6b7280;margin:0;">Gemini AI checks ingredients, flags harmful additives, and gives you safe consumption advice</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:12px;padding:14px;background:#f0fdf4;border-radius:12px;">
          <span style="font-size:24px;flex-shrink:0;">📊</span>
          <div>
            <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 2px;">Track your nutrition</p>
            <p style="font-size:13px;color:#6b7280;margin:0;">Log meals, monitor your daily calorie intake, and get a personalised goal based on your BMI</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:12px;padding:14px;background:#f0fdf4;border-radius:12px;">
          <span style="font-size:24px;flex-shrink:0;">🇮🇳</span>
          <div>
            <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 2px;">Help build India's food database</p>
            <p style="font-size:13px;color:#6b7280;margin:0;">When you scan a product not in our database, Gemini reads the label and adds it for everyone in India</p>
          </div>
        </div>

      </div>

      <!-- Divider -->
      <div style="height:1px;background:#f3f4f6;margin:24px 0;"></div>

      <!-- Personal message -->
      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px;">
        We believe that <strong>informed people make healthier choices</strong>. Every scan 
        you make, every product you add, helps build a healthier India — one packet at a time.
      </p>

      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 24px;">
        Thank you for being part of this journey, ${firstName}. We are rooting for you. 💚
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;">
        
          href="${process.env.NEXTAUTH_URL}/scan"
          style="display:inline-block;padding:14px 32px;background:#16a34a;color:white;text-decoration:none;border-radius:12px;font-size:15px;font-weight:700;"
        >
          Start Scanning Now →
        </a>
      </div>

    </div>

    <!-- Tips card -->
    <div style="background:white;border-radius:20px;padding:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);margin-bottom:24px;">
      <h3 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 14px;">
        💡 Quick Tips to Get Started
      </h3>
      <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;">
        <li style="font-size:13px;color:#374151;padding-left:20px;position:relative;">
          <span style="position:absolute;left:0;">1️⃣</span>
          Complete your profile to get a personalised calorie goal based on your BMI
        </li>
        <li style="font-size:13px;color:#374151;padding-left:20px;position:relative;">
          <span style="position:absolute;left:0;">2️⃣</span>
          Try scanning Parle-G, Maggi or Lay's to see the AI analysis in action
        </li>
        <li style="font-size:13px;color:#374151;padding-left:20px;position:relative;">
          <span style="position:absolute;left:0;">3️⃣</span>
          Use Photo Mode if the barcode does not scan — Gemini reads the nutrition label directly
        </li>
        <li style="font-size:13px;color:#374151;padding-left:20px;position:relative;">
          <span style="position:absolute;left:0;">4️⃣</span>
          You will receive a weekly nutrition report every Monday morning
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align:center;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">
        Made with 💚 for a healthier India
      </p>
      <p style="font-size:12px;color:#9ca3af;margin:4px 0 0;">
        NutriScan — AI-Powered Food Health Advisor
      </p>
    </div>

  </div>

</body>
</html>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'NutriScan <onboarding@resend.dev>',
        to: email,
        subject: `Welcome to NutriScan, ${firstName}! 🥗 Your journey to healthier eating starts now`,
        html
      })
    })

    const data = await res.json()

    if (!res.ok) {
      console.log('Welcome email send failed:', data)
      return NextResponse.json({ success: false, error: data }, { status: 500 })
    }

    // Mark welcome email as sent so we never send it again
    await supabaseAdmin
      .from('user_profiles')
      .update({ welcome_email_sent: true })
      .eq('user_id', userId)

    console.log('Welcome email sent to:', email)
    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.log('Welcome email error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}