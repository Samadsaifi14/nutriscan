import { supabaseAdmin } from '@/lib/supabaseAdmin'

const LIMITS = {
  analyze: { max: 20, windowMinutes: 60 },
  scan: { max: 50, windowMinutes: 1440 },
  log: { max: 50, windowMinutes: 60 },
  analyze_ai: { max: 15, windowMinutes: 60 },
  enrich: { max: 30, windowMinutes: 60 },
  search: { max: 90, windowMinutes: 60 },
  ingredient_research: { max: 20, windowMinutes: 60 },
} as const

export type RateLimitAction = keyof typeof LIMITS

export async function checkRateLimit(
  userId: string,
  action: RateLimitAction
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const limit = LIMITS[action]
  const { data, error } = await supabaseAdmin.rpc('consume_rate_limit', {
    p_user_id: userId,
    p_action: action,
    p_max_requests: limit.max,
    p_window_seconds: limit.windowMinutes * 60,
  })

  // Fail closed. A database outage must not silently disable abuse protection.
  if (error || !data) {
    console.error('Atomic rate limit check failed:', error?.message || 'empty RPC response')
    return { allowed: false, remaining: 0, resetIn: limit.windowMinutes }
  }

  const result = Array.isArray(data) ? data[0] : data
  if (typeof result?.allowed !== 'boolean') {
    console.error('Atomic rate limit RPC returned an invalid response')
    return { allowed: false, remaining: 0, resetIn: limit.windowMinutes }
  }

  return {
    allowed: result.allowed,
    remaining: Number(result.remaining ?? 0),
    resetIn: Math.max(1, Math.ceil(Number(result.reset_in_seconds ?? limit.windowMinutes * 60) / 60)),
  }
}
