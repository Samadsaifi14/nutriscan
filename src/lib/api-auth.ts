import { NextRequest, NextResponse } from 'next/server'
import { ANONYMOUS_USER_ID } from '@/lib/config'
import { checkRateLimit } from '@/lib/rateLimit'

export type AuthSession = { userId: string }

export async function getAuthSession(): Promise<AuthSession> {
  return { userId: ANONYMOUS_USER_ID }
}

export function getUserId(_session: AuthSession | null): string {
  return ANONYMOUS_USER_ID
}

export async function requireAuth(): Promise<
  { session: AuthSession; userId: string } | { response: NextResponse }
> {
  return { session: { userId: ANONYMOUS_USER_ID }, userId: ANONYMOUS_USER_ID }
}

export function getRateLimitKey(_req: NextRequest, _userId: string | null): string {
  return ANONYMOUS_USER_ID
}

export async function enforceRateLimit(
  userId: string,
  action: Parameters<typeof checkRateLimit>[1]
): Promise<{ ok: true } | { response: NextResponse }> {
  const rateCheck = await checkRateLimit(userId, action)
  if (!rateCheck.allowed) {
    return {
      response: NextResponse.json(
        { success: false, error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetIn * 60) } }
      ),
    }
  }
  return { ok: true }
}

export function verifyInternalSecret(req: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET || process.env.CRON_SECRET
  if (!secret) return false
  const header = req.headers.get('x-internal-secret')
  return header === secret
}

export async function requireAuthOrInternal(
  _req: NextRequest
): Promise<{ userId: string } | { response: NextResponse }> {
  return { userId: ANONYMOUS_USER_ID }
}
