import { supabaseAdmin } from '@/lib/supabaseAdmin'

const LIMITS = {
  analyze:    { max: 20, windowMinutes: 60    },
  scan:       { max: 50, windowMinutes: 1440 }, // 50/day
  log:        { max: 50, windowMinutes: 60    },
  analyze_ai: { max: 15, windowMinutes: 60    },
  enrich:     { max: 30, windowMinutes: 60    },
  search:     { max: 90, windowMinutes: 60    },
  ingredient_research: { max: 20, windowMinutes: 60 },
}

const localWindows = new Map<string, number[]>()

function checkLocalWindow(userId: string, action: keyof typeof LIMITS) {
  const limit = LIMITS[action]
  const now = Date.now()
  const cutoff = now - limit.windowMinutes * 60 * 1000
  const key = `${action}:${userId}`
  const recent = (localWindows.get(key) || []).filter((timestamp) => timestamp >= cutoff)
  const allowed = recent.length < limit.max
  if (allowed) recent.push(now)
  localWindows.set(key, recent)

  if (localWindows.size > 5000) {
    for (const [entryKey, timestamps] of localWindows) {
      if (!timestamps.some((timestamp) => timestamp >= cutoff)) localWindows.delete(entryKey)
    }
  }
  return { allowed, remaining: Math.max(0, limit.max - recent.length), resetIn: limit.windowMinutes }
}

export async function checkRateLimit(
  userId: string,
  action: keyof typeof LIMITS
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const limit       = LIMITS[action]
  const windowStart = new Date(Date.now() - limit.windowMinutes * 60 * 1000).toISOString()
  const now         = new Date().toISOString()

  const local = checkLocalWindow(userId, action)
  if (!local.allowed) return local

  try {
    const { count } = await supabaseAdmin
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', action)
      .gte('created_at', windowStart)

    const used      = count || 0
    const remaining = Math.max(0, limit.max - used)
    const allowed   = used < limit.max

    if (allowed) {
      const { error: insertError } = await supabaseAdmin
        .from('rate_limits')
        .insert({ user_id: userId, action, created_at: now })
      if (insertError) {
        console.error('Rate limit insert failed:', insertError.message)
      }
    }

    return { allowed, remaining, resetIn: limit.windowMinutes }
  } catch (e) {
    console.error('Rate limit check failed:', e)
    // The per-instance guard above still limits bursts if the shared store is down.
    return local
  }
}
