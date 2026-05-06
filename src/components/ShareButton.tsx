"use client"

import { useState } from 'react'
import { generateShareContent, ShareContent } from '@/lib/share-generator'

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
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content.text)}`
        window.open(whatsappUrl, '_blank')
        break
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.text)}`
        window.open(twitterUrl, '_blank')
        break
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}`
        window.open(facebookUrl, '_blank')
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
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e242d] border border-[#2a3545] text-[#7a8fa6] hover:text-[#f0f4f8] hover:border-emerald-500/30 transition-all text-xs font-bold"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>

      {showOptions && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-[#161a20] border border-[#2a3545] rounded-xl shadow-xl z-50 overflow-hidden">
          <button
            onClick={() => handleShare('whatsapp')}
            className="w-full px-4 py-2.5 text-left text-sm text-[#f0f4f8] hover:bg-[#1e242d] flex items-center gap-2"
          >
            <span className="text-lg">💬</span> WhatsApp
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="w-full px-4 py-2.5 text-left text-sm text-[#f0f4f8] hover:bg-[#1e242d] flex items-center gap-2"
          >
            <span className="text-lg">🐦</span> Twitter
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="w-full px-4 py-2.5 text-left text-sm text-[#f0f4f8] hover:bg-[#1e242d] flex items-center gap-2"
          >
            <span className="text-lg">📘</span> Facebook
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="w-full px-4 py-2.5 text-left text-sm text-[#f0f4f8] hover:bg-[#1e242d] flex items-center gap-2 border-t border-[#2a3545]"
          >
            <span className="text-lg">📋</span>
            {copied ? 'Copied! ✅' : 'Copy Text'}
          </button>
        </div>
      )}
    </div>
  )
}