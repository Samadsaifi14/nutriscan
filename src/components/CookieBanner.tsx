"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'hox_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) setVisible(true)
  }, [])

  function acceptAll() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all')
    setVisible(false)
  }

  function rejectAnalytics() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 pb-2">
      <div className="max-w-md mx-auto rounded-2xl p-4 shadow-2xl"
        style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
        <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
          We use cookies and Google Analytics to improve your experience.
          Essential cookies are always active. Analytics cookies are optional.
        </p>
        <div className="flex items-center gap-2">
          <button onClick={acceptAll}
            className="flex-1 px-3 py-2 rounded-xl text-white text-xs font-bold transition-colors"
            style={{ background: 'var(--clay)' }}>
            Accept All
          </button>
          <button onClick={rejectAnalytics}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
            style={{ background: 'color-mix(in oklab, var(--card), black 10%)', color: 'var(--muted)' }}>
            Reject Analytics
          </button>
          <Link href="/legal/cookies"
            className="px-3 py-2 text-xs underline flex-shrink-0"
            style={{ color: 'var(--clay)' }}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
