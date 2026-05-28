import type { Session } from 'next-auth'

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}

export function isAdminSession(session: Session | null): boolean {
  if (!session?.user?.email) return false
  return isAdminEmail(session.user.email)
}

export function requireAdmin(session: Session | null): { ok: true } | { ok: false; status: 403 } {
  if (!isAdminSession(session)) {
    return { ok: false, status: 403 }
  }
  return { ok: true }
}
