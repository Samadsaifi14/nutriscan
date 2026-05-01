// src/components/BottomNav.tsx
"use client"
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { Home, Clock, User, Scan } from 'lucide-react'
import dynamic from 'next/dynamic'

const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false }
)

const NAV_ITEMS_LEFT = [
  { href: '/dashboard',    label: 'Home',    icon: Home,  authRequired: true  },
]

const NAV_ITEMS_RIGHT = [
  { href: '/history',      label: 'History', icon: Clock, authRequired: true  },
  { href: '/profile-setup',label: 'Profile', icon: User,  authRequired: true  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [showScanner, setShowScanner] = useState(false)

  if (pathname?.startsWith('/auth')) return null

  if (!session) return null // Guest users see different nav (or no nav)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur-2xl border-t border-[#2a3545] safe-area-bottom">
        <div className="flex items-center justify-between max-w-lg mx-auto px-2 py-3">
          {/* Left items */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS_LEFT.map(item => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
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

          {/* Floating Scan Button (FAB) */}
          <button
            onClick={() => setShowScanner(true)}
            className="relative -top-6 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-4 border-[#0d1117]"
          >
            <Scan className="w-7 h-7 text-white" strokeWidth={2.5} />
            {/* Pulse ring animation */}
            <span className="absolute w-20 h-20 rounded-full bg-emerald-400/30 animate-ping" />
          </button>

          {/* Right items */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS_RIGHT.map(item => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
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
        </div>
      </nav>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner 
          onDetected={(barcode) => {
            setShowScanner(false)
            // Navigate to scan page with barcode
            window.location.href = `/scan?barcode=${barcode}`
          }} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </>
  )
}