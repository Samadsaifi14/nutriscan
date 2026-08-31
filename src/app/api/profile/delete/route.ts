import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { ANONYMOUS_USER_ID } from '@/lib/config'

export async function DELETE(req: NextRequest) {
  const userId = ANONYMOUS_USER_ID

  // Collect all user data for deletion
  const tables = ['user_profiles', 'food_logs']
  const errors: string[] = []

  for (const table of tables) {
    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq('user_id', userId)

    if (error) {
      errors.push(`${table}: ${error.message}`)
    }
  }

  if (errors.length > 0) {
    console.error('Deletion errors:', errors)
    return NextResponse.json({ success: false, error: errors.join('; ') }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function POST(req: NextRequest) {
  const userId = ANONYMOUS_USER_ID

  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
  }

  // Verify email matches
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('email')
    .eq('user_id', userId)
    .single()

  if (!profile || profile.email !== email) {
    return NextResponse.json({ success: false, error: 'Email does not match our records' }, { status: 400 })
  }

  // Collect all user data for deletion
  const tables = ['user_profiles', 'food_logs']
  const errors: string[] = []

  for (const table of tables) {
    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq('user_id', userId)

    if (error) {
      errors.push(`${table}: ${error.message}`)
    }
  }

  if (errors.length > 0) {
    console.error('Deletion errors:', errors)
    return NextResponse.json({ success: false, error: errors.join('; ') }, { status: 500 })
  }

  // Send confirmation email via Resend
  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deleted</title>
</head>
<body style="margin:0;padding:0;background:#F2EDE4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="background:white;border-radius:24px;padding:40px;box-shadow:0 4px 32px rgba(0,0,0,0.06);text-align:center;">
    <h2 style="font-size:24px;font-weight:900;color:#111827;margin:0 0 8px;">Account Deleted</h2>
    <p style="font-size:14px;color:#6b7280;margin:0 0 20px;">
      All your data has been permanently removed from NutriScan as requested.
    </p>
    <p style="font-size:13px;color:#374151;line-height:1.7;">
      If you did not request this deletion, please contact us immediately at samadlylives00@gmail.com.
    </p>
  </div>
</div>
</body>
</html>`

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'NutriScan <onboarding@resend.dev>',
          to: [email],
          subject: 'Your NutriScan account has been deleted',
          html,
        })
      })
    } catch (err: any) {
      console.error('Deletion confirmation email error:', err.message)
    }
  }

  return NextResponse.json({ success: true })
}
