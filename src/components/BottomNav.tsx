// src/components/BottomNav.tsx
"use client"
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Home, Clock, User, Star } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Home',    icon: Home,  },
  { href: '/results',     label: 'Results', icon: Star,  },
  { href: '/history',      label: 'History', icon: Clock, },
  { href: '/profile-setup',label: 'Profile', icon: User,  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname?.startsWith('/auth')) return null
  if (!session) return null // No nav for guests

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[color-mix(in_oklab,var(--background),black_10%)]/90 dark:bg-[color-mix(in_oklab,var(--background),white_5%)]/85 backdrop-blur-2xl border-t border-[var(--card-border)] safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-3">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive
                  ? 'text-[var(--foreground)] bg-[color-mix(in_oklab,var(--brand),transparent_88%)] border border-[color-mix(in_oklab,var(--brand),transparent_70%)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[color-mix(in_oklab,var(--card),transparent_35%)]'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}