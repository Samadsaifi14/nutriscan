import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const EmailPrefsSchema = z.object({
  weekly_report_email: z.boolean(),
  email_unsubscribed: z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = EmailPrefsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid preferences: ' + parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      )
    }

    const { weekly_report_email, email_unsubscribed } = parsed.data

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        weekly_report_email,
        email_unsubscribed,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.log('Email prefs update error:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('Email preferences updated for user:', userId)
    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('Email prefs route error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}