"use client"

import { PLATFORM_INFO } from '@/lib/shopping-links'

interface ShoppingLinksProps {
  productName: string
  brand?: string
  compact?: boolean
}

export function ShoppingLinks({ productName, brand, compact }: ShoppingLinksProps) {
  const searchTerm = `${brand || ''} ${productName}`.trim()

  const links = [
    { platform: 'amazon' as const, url: `https://www.amazon.in/s?k=${encodeURIComponent(searchTerm)}&ref=as_li_ss_tl&tag=BioYou-21` },
    { platform: 'flipkart' as const, url: `https://www.flipkart.com/search?q=${encodeURIComponent(searchTerm)}` },
    { platform: 'blinkit' as const, url: `https://www.blinkit.com/search?q=${encodeURIComponent(searchTerm)}` },
    { platform: 'instamart' as const, url: `https://www.swiggy.com/instamart/search?q=${encodeURIComponent(searchTerm)}` },
  ]

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {links.map((link) => {
          const info = PLATFORM_INFO[link.platform]
          return (
            <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>
              <span>{info.icon}</span>
              <span style={{ color: 'var(--foreground)' }}>{info.name}</span>
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs" style={{ color: 'var(--muted-2)' }}>Buy Online</p>
      <div className="grid grid-cols-2 gap-2">
        {links.map((link) => {
          const info = PLATFORM_INFO[link.platform]
          return (
            <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
              <span className="text-lg">{info.icon}</span>
              <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{info.name}</span>
              {info.affiliate && <span className="ml-auto text-[9px]" style={{ color: 'var(--clay)' }}>★</span>}
            </a>
          )
        })}
      </div>
      <p className="text-[10px] mt-2" style={{ color: 'var(--muted-2)' }}>
        As an Amazon Associate, we earn from qualifying purchases.
      </p>
    </div>
  )
}
