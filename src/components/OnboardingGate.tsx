'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'

const SKIP_PATHS = ['/auth', '/legal', '/profile-setup', '/api']

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!session?.user || !pathname) return
    if (SKIP_PATHS.some((p) => pathname.startsWith(p))) return

    const profile = (session.user as Record<string, unknown>).profile as Record<string, unknown> | undefined
    const name = profile?.name ?? session.user.name
    if (!name) {
      router.replace('/profile-setup')
    }
  }, [session, pathname, router])

  return <>{children}</>
}
