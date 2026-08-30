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

export function getRateLimitKey(req: NextRequest, _userId: string | null): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const verifiedProxyIp = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
  const realIp = req.headers.get('x-real-ip')?.trim()
  const ip = verifiedProxyIp || realIp || forwarded || 'unknown'
  return `ip:${ip.slice(0, 80)}`
}

export async function enforceRateLimit(
  _userId: string,
  action: Parameters<typeof checkRateLimit>[1],
  req?: NextRequest
): Promise<{ ok: true } | { response: NextResponse }> {
  const key = req ? getRateLimitKey(req, _userId) : _userId
  const rateCheck = await checkRateLimit(key, action)
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
