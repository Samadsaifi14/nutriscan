import { supabaseAdmin } from '@/lib/supabaseAdmin'

const LIMITS = {
  analyze: { max: 20, windowMinutes: 60 },
  scan: { max: 100, windowMinutes: 60 },
  log: { max: 50, windowMinutes: 60 },
}

export async function checkRateLimit(
  userId: string,
  action: keyof typeof LIMITS
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const limit = LIMITS[action]
  const windowStart = new Date(Date.now() - limit.windowMinutes * 60 * 1000).toISOString()
  const now = new Date().toISOString()

  try {
    const { count } = await supabaseAdmin
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', action)
      .gte('created_at', windowStart)

    const used = count || 0
    const remaining = Math.max(0, limit.max - used)
    const allowed = used < limit.max

    if (allowed) {
      const { error: insertError } = await supabaseAdmin
        .from('rate_limits')
        .insert({
          user_id: userId,
          action,
          created_at: now,
        })

      if (insertError) {
        console.error('Rate limit insert failed (possible race):', insertError.message)
      }
    }

    return {
      allowed,
      remaining,
      resetIn: limit.windowMinutes,
    }
  } catch (e) {
    console.error('Rate limit check failed:', e)
    return { allowed: false, remaining: 0, resetIn: 5 }
  }
}
