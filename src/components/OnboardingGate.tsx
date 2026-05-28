"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

const SKIP_PREFIXES = ['/auth', '/legal', '/profile-setup', '/api']

export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated' || !session) return
    if (SKIP_PREFIXES.some((p) => pathname?.startsWith(p))) return

    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
        const profile = d?.data ?? d?.profile
        if (d?.success && profile && !profile.profile_completed) {
          router.replace('/profile-setup')
        }
      })
      .catch(() => {})
  }, [status, session, pathname, router])

  return <>{children}</>
}
