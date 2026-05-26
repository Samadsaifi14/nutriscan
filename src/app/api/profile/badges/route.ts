import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { calculateBadges, type Badge, BADGES } from '@/lib/gamification'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch current counts
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('contributions_count, validated_count, badges')
    .eq('user_id', userId)
    .single()

  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
  }

  const contributions = profile.contributions_count || 0
  const validations = profile.validated_count || 0
  const currentBadges: Badge[] = profile.badges || []

  // Calculate what should be earned
  const earned = calculateBadges(contributions, validations)

  // Find new badges not already awarded
  const newBadges = earned.filter(b => !currentBadges.includes(b))

  if (newBadges.length === 0) {
    return NextResponse.json({ success: true, newBadges: [], allBadges: earned })
  }

  // Merge and update
  const updatedBadges = [...new Set([...currentBadges, ...earned])]
  await supabaseAdmin
    .from('user_profiles')
    .update({ badges: updatedBadges })
    .eq('user_id', userId)

  const newBadgeInfo = newBadges.map(id => BADGES[id])

  return NextResponse.json({ success: true, newBadges: newBadgeInfo, allBadges: updatedBadges })
}
