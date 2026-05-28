import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'

export type AuthSession = Session & { userId?: string }

export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions)
  return session as AuthSession | null
}

export function getUserId(session: AuthSession | null): string | null {
  return session?.userId || null
}

export async function requireAuth(): Promise<
  { session: AuthSession; userId: string } | { response: NextResponse }
> {
  const session = await getAuthSession()
  const userId = getUserId(session)
  if (!session || !userId) {
    return {
      response: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { session, userId }
}

export function getRateLimitKey(req: NextRequest, userId: string | null): string {
  return userId || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous'
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

/** Internal server-to-server calls (welcome email from signIn, cron). */
export function verifyInternalSecret(req: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET || process.env.CRON_SECRET
  if (!secret) return false
  const header = req.headers.get('x-internal-secret')
  return header === secret
}

export async function requireAuthOrInternal(
  req: NextRequest
): Promise<{ userId: string } | { response: NextResponse }> {
  if (verifyInternalSecret(req)) {
    const body = await req.clone().json().catch(() => ({}))
    const userId = body?.userId
    if (!userId) {
      return {
        response: NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 }),
      }
    }
    return { userId }
  }
  const auth = await requireAuth()
  if ('response' in auth) return auth
  return { userId: auth.userId }
}
