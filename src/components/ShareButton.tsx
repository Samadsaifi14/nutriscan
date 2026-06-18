"use client"

import { useState } from 'react'
import { generateShareContent } from '@/lib/share-generator'

interface ShareButtonProps {
  productName: string
  healthScore: number
  healthRating: string
}

export function ShareButton({ productName, healthScore, healthRating }: ShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  const content = generateShareContent(productName, healthScore, healthRating)

  const handleShare = async (platform: 'whatsapp' | 'twitter' | 'facebook' | 'copy') => {
    setShowOptions(false)
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(content.text)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content.text)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}`, '_blank')
        break
      case 'copy':
        await navigator.clipboard.writeText(content.text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          color: 'var(--muted)',
        }}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>

      {showOptions && (
        <div className="absolute right-0 top-full mt-2 w-40 rounded-xl shadow-xl z-50 overflow-hidden"
          style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
          {([
            { p: 'whatsapp', label: 'WhatsApp', icon: '💬' },
            { p: 'twitter', label: 'Twitter', icon: '🐦' },
            { p: 'facebook', label: 'Facebook', icon: '📘' },
            { p: 'copy', label: copied ? 'Copied! ✅' : 'Copy Text', icon: '📋', borderTop: true },
          ] as const).map(item => (
            <button key={item.p} onClick={() => handleShare(item.p as any)}
              className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors"
              style={{
                color: 'var(--foreground)',
                borderTop: 'borderTop' in item && item.borderTop ? '1px solid var(--card-border)' : undefined,
              }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
