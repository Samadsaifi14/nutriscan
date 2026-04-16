import crypto from 'crypto'

const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-dev-secret'

/**
 * Create a signed token containing the userId.
 * Token format: base64url(payload).base64url(hmac)
 * Expires after 30 days.
 */
export function createUnsubscribeToken(userId: string): string {
  const payload = JSON.stringify({
    userId,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  })
  const payloadB64 = Buffer.from(payload).toString('base64url')
  const hmac = crypto
    .createHmac('sha256', SECRET)
    .update(payloadB64)
    .digest('base64url')
  return `${payloadB64}.${hmac}`
}

/**
 * Verify a signed unsubscribe token.
 * Returns the userId if valid, or null if expired/tampered.
 */
export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const [payloadB64, hmac] = token.split('.')
    if (!payloadB64 || !hmac) return null

    const expectedHmac = crypto
      .createHmac('sha256', SECRET)
      .update(payloadB64)
      .digest('base64url')

    if (hmac !== expectedHmac) return null

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())

    if (payload.exp < Date.now()) return null

    return payload.userId || null
  } catch {
    return null
  }
}

/**
 * Build the two unsubscribe URLs (weekly-only and all emails).
 */
export function buildUnsubscribeUrls(
  userId: string,
  baseUrl: string
): { weeklyUrl: string; allUrl: string } {
  const token = createUnsubscribeToken(userId)
  return {
    weeklyUrl: `${baseUrl}/api/unsubscribe?token=${encodeURIComponent(token)}&type=weekly`,
    allUrl: `${baseUrl}/api/unsubscribe?token=${encodeURIComponent(token)}&type=all`,
  }
}