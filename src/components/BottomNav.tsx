"use client"
import Link            from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { id: 'home',    ic: '⌂', l: 'Home',    href: '/dashboard'   },
  { id: 'search',  ic: '⊙', l: 'Search',  href: '/search'       },
  { id: 'scan',    ic: '',  l: '',         href: '/scan'         },
  { id: 'history', ic: '◷', l: 'History', href: '/scan-history' },
  { id: 'profile', ic: '◎', l: 'Profile', href: '/profile'      },
] as const

const PATH_TO_TAB: Record<string, string> = {
  '/dashboard':    'home',
  '/insights':     'home',
  '/leaderboard':  'home',
  '/search':       'search',
  '/scan':         'scan',
  '/scan-history': 'history',
  '/history':      'history',
  '/favorites':    'history',
  '/profile-setup':'profile',
  '/profile':      'profile',
  '/settings':     'profile',
}

function getActiveTab(pathname: string | null): string {
  if (!pathname) return 'home'
  for (const [prefix, tab] of Object.entries(PATH_TO_TAB)) {
    if (pathname.startsWith(prefix)) return tab
  }
  return 'home'
}

const HIDDEN_PATHS = ['/auth', '/signin', '/', '/legal']

export default function BottomNav() {
  const pathname  = usePathname()
  const activeTab = getActiveTab(pathname)

  if (!pathname || HIDDEN_PATHS.some(p => pathname.startsWith(p))) return null

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      background: 'var(--surface)',
      borderTop: '0.5px solid var(--border-2)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 50,
    }}>
      {TABS.map(t => {
        const on = activeTab === t.id

        if (t.id === 'scan') {
          return (
            <Link
              key="scan"
              href="/scan"
              aria-label="Scan food"
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                height: '100%',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: 10,
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--clay) 0%, var(--clay-dim) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 3px var(--bg), 0 0 0 5px color-mix(in srgb, var(--clay) 27%, transparent)',
                fontSize: 18,
              }}>
                <span>📷</span>
              </div>
            </Link>
          )
        }

        return (
          <Link
            key={t.id}
            href={t.href}
            aria-label={t.l}
            aria-current={on ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              paddingTop: on ? 0 : 4,
              textDecoration: 'none',
            }}
          >
            {on && <div style={{ width: 18, height: 2, borderRadius: 2, background: 'var(--clay)', marginBottom: 2 }} />}
            <span style={{ fontSize: 13, color: on ? 'var(--clay)' : 'var(--muted)' }}>
              {t.ic}
            </span>
            <span style={{
              fontSize: 6,
              color: on ? 'var(--clay)' : 'var(--muted)',
              fontWeight: on ? 600 : 400,
            }}>
              {t.l}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
