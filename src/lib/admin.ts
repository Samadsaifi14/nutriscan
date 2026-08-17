export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(_email: string | null | undefined): boolean {
  return false
}

export function isAdminSession(_session: any): boolean {
  return false
}

export function requireAdmin(_session: any): { ok: true } | { ok: false; status: 403 } {
  return { ok: true }
}
