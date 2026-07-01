'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, Clock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'home', label: 'Home', icon: Home, href: '/dashboard', match: ['/dashboard', '/insights', '/leaderboard'] },
  { key: 'search', label: 'Search', icon: Search, href: '/search', match: ['/search'] },
  { key: 'scan-fab', label: '', icon: null, href: '', match: [] },
  { key: 'history', label: 'History', icon: Clock, href: '/scan-history', match: ['/scan-history', '/history', '/favorites'] },
  { key: 'profile', label: 'Profile', icon: User, href: '/profile', match: ['/profile', '/profile-setup', '/settings'] },
]

const HIDDEN_ON = ['/auth', '/signin', '/', '/legal']

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  if (HIDDEN_ON.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)))) {
    return null
  }

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map((tab) => {
        if (tab.key === 'scan-fab') {
          return <div key={tab.key} className="bottom-nav__fab" aria-hidden="true" />
        }
        const Icon = tab.icon!
        const active = tab.match.some((p) => pathname.startsWith(p))
        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.href)}
            className={cn('bottom-nav__slot', active && 'bottom-nav__slot--active')}
            aria-current={active ? 'page' : undefined}
          >
            {active && (
              <motion.span
                layoutId="nav-indicator"
                className="bottom-nav__indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              />
            )}
            <Icon size={20} className="bottom-nav__icon" strokeWidth={active ? 2.4 : 1.8} />
            <span className="bottom-nav__label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
