"use client"

import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Clock, User } from 'lucide-react'

interface NavTab {
  id:    string
  href:  string
  icon:  React.ReactNode
  label: string
}

const TABS: NavTab[] = [
  { id: 'home',    href: '/dashboard',   icon: <Home   size={20} strokeWidth={1.8} />, label: 'Home'    },
  { id: 'search',  href: '/search',       icon: <Search size={20} strokeWidth={1.8} />, label: 'Search'  },
  { id: 'scan',    href: '/scan',         icon: null,                                    label: ''       },
  { id: 'history', href: '/scan-history', icon: <Clock  size={20} strokeWidth={1.8} />, label: 'History' },
  { id: 'profile', href: '/profile',       icon: <User   size={20} strokeWidth={1.8} />, label: 'Profile' },
]

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
  '/profile':     'profile',
  '/settings':    'profile',
}

function getActiveTab(pathname: string): string {
  for (const [prefix, tab] of Object.entries(PATH_TO_TAB)) {
    if (pathname.startsWith(prefix)) return tab
  }
  return 'home'
}

const HIDDEN_PATHS = ['/auth', '/signin', '/', '/legal']

export default function BottomNav() {
  const pathname  = usePathname()
  const activeTab = getActiveTab(pathname)

  if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map(tab => {
        if (tab.id === 'scan') {
          return (
            <Link
              key="scan"
              href="/scan"
              className="bottom-nav__slot bottom-nav__slot--fab"
              aria-label="Scan food"
            >
              <div className="bottom-nav__fab-ring" aria-hidden="true">
              <span>📷</span>
            </div>
            </Link>
          )
        }

        const on = activeTab === tab.id
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`bottom-nav__slot ${on ? 'bottom-nav__slot--active' : ''}`}
            aria-label={tab.label}
            aria-current={on ? 'page' : undefined}
          >
            {on && <div className="bottom-nav__pill" />}
            <span className="bottom-nav__icon">{tab.icon}</span>
            <span className="bottom-nav__label">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
