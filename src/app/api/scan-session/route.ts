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

  const { barcode, product_name, product_image, ai_health_rating, ai_health_score } = await req.json()

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const { data: existing } = await supabaseAdmin
    .from('scan_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('barcode', barcode)
    .gte('scanned_at', yesterday.toISOString())
    .single()

  if (existing) {
    const { error: updateError } = await supabaseAdmin
      .from('scan_sessions')
      .update({
        ai_health_rating,
        ai_health_score,
        scanned_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .eq('user_id', userId)

    if (updateError) {
      console.log('Scan session update error:', updateError.message)
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, action: 'updated' })
  }

  const { error } = await supabaseAdmin
    .from('scan_sessions')
    .insert({
      user_id: userId,
      barcode,
      product_name,
      product_image,
      ai_health_rating,
      ai_health_score,
    })

  if (error) {
    console.log('Scan session error:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, action: 'created' })
}

