'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import { motion } from 'framer-motion'

const HIDDEN_ON = ['/scan', '/auth', '/signin', '/']

export function FloatingScanButton() {
  const pathname = usePathname()
  const router = useRouter()

  if (HIDDEN_ON.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)))) {
    return null
  }

  return (
    <motion.button
      onClick={() => router.push('/scan')}
      aria-label="Scan a product"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.88, rotateX: 12 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      style={{
        position: 'fixed',
        bottom: 'calc(var(--nav-h) - var(--fab-lift) + var(--safe-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 45,
        width: 56,
        height: 56,
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(155deg, #E49B52 0%, #D4853B 55%, #A5611F 100%)',
        boxShadow: '0 6px 24px var(--clay-glow), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <Camera size={24} color="#17110A" strokeWidth={2.2} />
    </motion.button>
  )
}
