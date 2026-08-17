'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { GA_MEASUREMENT_ID } from '@/lib/config'

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
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
    const consented = localStorage.getItem('hox_cookie_consent')
    if (consented !== 'all') return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    window.gtag?.('config', GA_MEASUREMENT_ID, { page_path: url })
  }, [pathname, searchParams])

  return null
}
