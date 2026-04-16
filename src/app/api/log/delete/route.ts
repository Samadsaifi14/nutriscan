import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await req.json()

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'No log ID provided' },
      { status: 400 }
    )
  }

  // Make sure the log belongs to this user before deleting
  const { error } = await supabaseAdmin
    .from('food_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.log('Delete error:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }

  console.log('Log deleted:', id)
  return NextResponse.json({ success: true })
}