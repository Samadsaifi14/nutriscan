// src/components/BottomNav.tsx
"use client"
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Home, Clock, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Home',    icon: Home,  authRequired: true  },
  { href: '/history',      label: 'History', icon: Clock, authRequired: true  },
  { href: '/profile-setup',label: 'Profile', icon: User,  authRequired: true  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname?.startsWith('/auth')) return null
  if (!session) return null // No nav for guests

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0d1117]/95 backdrop-blur-2xl border-t border-[#2a3545] safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-4 py-3">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 px-5 py-2 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-[#7a8fa6] hover:text-white hover:bg-[#1a2030]'
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