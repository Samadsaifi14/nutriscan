'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return
    const consented = localStorage.getItem('hox_cookie_consent')
    if (consented !== 'all') return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    window.gtag?.('config', GA_ID, { page_path: url })
  }, [pathname, searchParams])

  return null
}
