import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { calculateBadges, type Badge } from '@/lib/gamification'

export async function awardBadges(userId: string): Promise<Badge[]> {
  // Fetch current counts
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('contributions_count, validated_count, badges')
    .eq('user_id', userId)
    .single()

  if (!profile) return []

  const contributions = profile.contributions_count || 0
  const validations = profile.validated_count || 0
  const currentBadges: Badge[] = profile.badges || []

  // Calculate what should be earned
  const earned = calculateBadges(contributions, validations)

  // Find new badges not already awarded
  const newBadges = earned.filter(b => !currentBadges.includes(b))

  if (newBadges.length === 0) return []

  // Merge and update
  const updatedBadges = [...new Set([...currentBadges, ...earned])]
  await supabaseAdmin
    .from('user_profiles')
    .update({ badges: updatedBadges })
    .eq('user_id', userId)

  console.log(`Badges awarded to ${userId}:`, newBadges)
  return newBadges
}
