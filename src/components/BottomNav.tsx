"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: '\u2302' },
  { href: '/search', label: 'Search', icon: '\u2299' },
  { href: '/scan', label: '', icon: '\uD83D\uDCF7', fab: true },
  { href: '/scan-history', label: 'History', icon: '\u25F7' },
  { href: '/profile-setup', label: 'Profile', icon: '\u25CE' },
]

export default function BottomNav() {
  const pathname = usePathname()
  if (pathname?.startsWith('/auth') || pathname === '/' || pathname?.startsWith('/legal')) return null

  return (
    <div className="safe-area-bottom" style={{
      height: 56,
      background: 'var(--surface)',
      borderTop: '0.5px solid var(--border-2)',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      zIndex: 50,
    }}>
      {NAV_ITEMS.map(t => {
        const isActive = pathname === t.href || (t.href === '/dashboard' && pathname === '/dashboard')
        if (t.fab) {
          return (
            <Link key="fab" href="/scan" style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', height: '100%', alignItems: 'center' }}>
              <div style={{
                position: 'absolute',
                bottom: 10,
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'var(--clay)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 3px var(--background), 0 0 0 5px rgba(196,113,74,0.27)',
                fontSize: 22,
              }}>
                <span>\uD83D\uDCF7</span>
              </div>
            </Link>
          )
        }
        const on = isActive
        return (
          <Link key={t.href} href={t.href} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            paddingTop: on ? 0 : 4,
            textDecoration: 'none',
          }}>
            {on && <div style={{ width: 18, height: 2, borderRadius: 2, background: 'var(--clay)', marginBottom: 2 }} />}
            <span style={{ fontSize: 18, color: on ? 'var(--clay)' : 'var(--muted)', lineHeight: 1.35 }}>{t.icon}</span>
            {t.label && <span style={{ fontSize: 8, color: on ? 'var(--clay)' : 'var(--muted)', fontWeight: on ? 600 : 400 }}>{t.label}</span>}
          </Link>
        )
      })}
    </div>
  )
}
