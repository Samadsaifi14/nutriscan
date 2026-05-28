import { createHmac, timingSafeEqual } from 'crypto'

const TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000 // 1 year

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is required for unsubscribe tokens')
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function createUnsubscribeUrl(
  userId: string,
  type: 'weekly' | 'all',
  baseUrl?: string
): string {
  const exp = Date.now() + TOKEN_TTL_MS
  const payload = `${userId}:${type}:${exp}`
  const sig = sign(payload)
  const appUrl = baseUrl || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const params = new URLSearchParams({ userId, type, exp: String(exp), sig })
  return `${appUrl}/api/unsubscribe?${params.toString()}`
}

export function verifyUnsubscribeToken(
  userId: string,
  type: string,
  exp: string,
  sig: string
): boolean {
  if (!userId || !type || !exp || !sig) return false
  const expNum = parseInt(exp, 10)
  if (isNaN(expNum) || Date.now() > expNum) return false
  const payload = `${userId}:${type}:${exp}`
  const expected = sign(payload)
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
