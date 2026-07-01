'use client'

import { useState } from 'react'
import { Share2, Link2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [open, setOpen] = useState(false)

  const options = [
    {
      label: 'WhatsApp',
      glyph: 'W',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
    },
    {
      label: 'Twitter',
      glyph: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Facebook',
      glyph: 'F',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div style={{ position: 'relative' }}>
      <button className="icon-btn" aria-label="Share" onClick={() => setOpen((o) => !o)}>
        <Share2 size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 69 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong"
              style={{
                position: 'absolute', right: 0, top: 48, zIndex: 70,
                borderRadius: 14, padding: 8, minWidth: 180,
              }}
            >
              <div className="row--sm" style={{ justifyContent: 'space-between', padding: '4px 8px 8px' }}>
                <span className="text-2xs" style={{ color: 'var(--sand)' }}>Share result</span>
                <button onClick={() => setOpen(false)} aria-label="Close" style={{ color: 'var(--muted)' }}>
                  <X size={14} />
                </button>
              </div>
              {options.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="row--md"
                  style={{ padding: '10px 8px', borderRadius: 10, color: 'var(--cream)' }}
                  onClick={() => setOpen(false)}
                >
                  <span
                    className="text-xs"
                    style={{
                      width: 26, height: 26, borderRadius: 8, background: 'var(--surface-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                    }}
                  >
                    {opt.glyph}
                  </span>
                  <span className="text-sm">{opt.label}</span>
                </a>
              ))}
              <button
                className="row--md"
                style={{ padding: '10px 8px', borderRadius: 10, width: '100%' }}
                onClick={() => {
                  navigator.clipboard.writeText(url)
                  toast.success('Link copied')
                  setOpen(false)
                }}
              >
                <span
                  className="text-xs"
                  style={{
                    width: 26, height: 26, borderRadius: 8, background: 'var(--surface-3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Link2 size={13} />
                </span>
                <span className="text-sm">Copy link</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
