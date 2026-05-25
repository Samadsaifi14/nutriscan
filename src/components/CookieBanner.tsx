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
      <div className="max-w-md mx-auto bg-[#1a1f28] border border-[#2a3545] rounded-2xl p-4 shadow-2xl">
        <p className="text-xs text-[#c8d6e0] leading-relaxed mb-3">
          We use cookies and Google Analytics to improve your experience. 
          Essential cookies are always active. Analytics cookies are optional.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={acceptAll}
            className="flex-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={rejectAnalytics}
            className="flex-1 px-3 py-2 rounded-xl bg-[#252c38] hover:bg-[#2a3545] text-[#c8d6e0] text-xs font-bold transition-colors"
          >
            Reject Analytics
          </button>
          <Link
            href="/legal/cookies"
            className="px-3 py-2 text-xs text-emerald-400 hover:text-emerald-300 underline flex-shrink-0"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
