import { supabaseAdmin } from '@/lib/supabaseAdmin'

const LIMITS: Record<string, { max: number; windowMinutes: number }> = {
  analyze:     { max: 20,  windowMinutes: 60 },
  scan:        { max: 100, windowMinutes: 60 },
  scan_vision: { max: 15,  windowMinutes: 60 },
  log:         { max: 60,  windowMinutes: 60 },
  default:     { max: 30,  windowMinutes: 60 },
}

const FAIL_OPEN: RateLimitResult  = { allowed: true,  remaining: 1, resetIn: 60 }
const FAIL_CLOSED: RateLimitResult = { allowed: false, remaining: 0, resetIn: 5  }

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

export async function checkRateLimit(
  userId: string,
  action: string
): Promise<RateLimitResult> {
  const config = LIMITS[action] ?? LIMITS.default
  const windowStart = new Date(Date.now() - config.windowMinutes * 60_000).toISOString()

  try {
    const { count, error: countError } = await supabaseAdmin
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', action)
      .gte('created_at', windowStart)

    if (countError) {
      console.error('Rate limit count error:', countError.message)
      return FAIL_OPEN
    }

    const used = count ?? 0
    const allowed = used < config.max

    if (allowed) {
      const { error: insertError } = await supabaseAdmin
        .from('rate_limits')
        .insert({ user_id: userId, action, created_at: new Date().toISOString() })

      if (insertError) {
        console.error('Rate limit insert error:', insertError.message)
      }
    }

    return {
      allowed,
      remaining: Math.max(0, config.max - used - (allowed ? 1 : 0)),
      resetIn: config.windowMinutes,
    }
  } catch (err) {
    console.error('Rate limit error:', err)
    return FAIL_CLOSED
  }
}