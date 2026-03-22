"use client"
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const navItems = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    href: '/scan',
    label: 'Scan',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4" fill={active ? 'currentColor' : 'none'}/>
      </svg>
    )
  },
  {
    href: '/scan-history',
    label: 'Products',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth={active ? "3" : "2"}/>
      </svg>
    )
  },
  {
    href: '/history',
    label: 'Meals',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14" strokeWidth={active ? "2.5" : "2"}/>
      </svg>
    )
  },
  {
    href: '/profile-setup',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (pathname === '/auth/signin' || pathname === '/' || status === 'unauthenticated') {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--card-border)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-1 py-2">

        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200"
              style={{
                color: active ? 'var(--brand)' : 'var(--muted)',
                background: active ? 'var(--brand)' + '15' : 'transparent',
              }}
            >
              {item.icon(active)}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}

        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200"
            style={{ color: 'var(--muted)' }}
          >
            {theme === 'dark' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
            <span className="text-xs font-medium">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
        )}

      </div>
    </nav>
  )
}
