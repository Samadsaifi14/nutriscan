"use client"
import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Camera, Clock, User } from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  home:    <Home    size={22} strokeWidth={1.8} />,
  search:  <Search  size={22} strokeWidth={1.8} />,
  history: <Clock   size={22} strokeWidth={1.8} />,
  profile: <User    size={22} strokeWidth={1.8} />,
}

const TABS = [
  { id: 'home',    l: 'Home',    href: '/dashboard'   },
  { id: 'search',  l: 'Search',  href: '/search'       },
  { id: 'scan',    l: '',        href: '/scan'         },
  { id: 'history', l: 'History', href: '/scan-history' },
  { id: 'profile', l: 'Profile', href: '/profile'      },
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
    <nav className="bottom-nav">
      {TABS.map(t => {
        const on = activeTab === t.id

        if (t.id === 'scan') {
          return (
            <Link key="scan" href="/scan" aria-label="Scan food" className="bottom-nav__slot--scan">
              <div className="bottom-nav__fab">
                <Camera size={22} strokeWidth={1.8} color="var(--cream)" />
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
            className={`bottom-nav__slot${on ? ' bottom-nav__slot--active' : ''}`}
          >
            {on && <div className="bottom-nav__indicator" />}
            <span className="bottom-nav__icon" style={{ color: on ? 'var(--clay)' : 'var(--muted)' }}>
              {ICONS[t.id]}
            </span>
            <span className={`bottom-nav__label${on ? ' bottom-nav__label--active' : ''}`} style={{ color: on ? 'var(--clay)' : 'var(--muted)' }}>
              {t.l}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
