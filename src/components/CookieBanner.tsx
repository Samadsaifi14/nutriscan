'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const KEY = 'hox_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  function choose(value: 'all' | 'essential') {
    localStorage.setItem(KEY, value)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong"
          style={{
            position: 'fixed', left: 12, right: 12,
            bottom: 'calc(var(--footer-offset) + 12px)',
            zIndex: 90, maxWidth: 456, margin: '0 auto',
            borderRadius: 16, padding: 16,
          }}
        >
          <p className="text-sm" style={{ color: 'var(--sand)', marginBottom: 12 }}>
            We use cookies to improve your experience and measure how the app is used. Read our{' '}
            <Link href="/legal/cookies" style={{ color: 'var(--clay)', textDecoration: 'underline' }}>
              cookie policy
            </Link>
            .
          </p>
          <div className="row--sm">
            <button className="btn btn--secondary btn--sm flex-1" onClick={() => choose('essential')}>
              Essential only
            </button>
            <button className="btn btn--primary btn--sm flex-1" onClick={() => choose('all')}>
              Accept all
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
