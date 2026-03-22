import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'NutriScan <onboarding@resend.dev>',
      to: 'samadlylives00@gmail.com',
      subject: '🥗 NutriScan Test Email',
      html: '<h1 style="color:#16a34a;">NutriScan is working!</h1><p>Your weekly reports are set up correctly.</p>'
    })
  })

  const data = await res.json()
  console.log('Test email result:', data)
  return NextResponse.json(data)
}