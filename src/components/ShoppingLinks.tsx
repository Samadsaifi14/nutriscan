import { ExternalLink } from 'lucide-react'

interface ShoppingLinksProps {
  productName: string
  variant?: 'compact' | 'grid'
}

const AMAZON_TAG = 'healthox-21'

function buildLinks(productName: string) {
  const q = encodeURIComponent(productName)
  return [
    { name: 'Amazon', href: `https://www.amazon.in/s?k=${q}&tag=${AMAZON_TAG}`, color: '#E49030' },
    { name: 'Flipkart', href: `https://www.flipkart.com/search?q=${q}`, color: '#4A6B3A' },
    { name: 'Blinkit', href: `https://blinkit.com/s/?q=${q}`, color: '#D4853B' },
    { name: 'Instamart', href: `https://www.swiggy.com/instamart/search?custom_back=true&query=${q}`, color: '#C04028' },
  ]
}

export function ShoppingLinks({ productName, variant = 'grid' }: ShoppingLinksProps) {
  const links = buildLinks(productName)

  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {links.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="chip"
            style={{ flexShrink: 0 }}
          >
            {l.name}
            <ExternalLink size={11} />
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className="grid-2">
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="card card--sm row--sm"
          style={{ justifyContent: 'space-between' }}
        >
          <span className="row--sm">
            <span
              aria-hidden="true"
              style={{ width: 8, height: 8, borderRadius: 9999, background: l.color }}
            />
            <span className="text-sm" style={{ fontWeight: 600 }}>{l.name}</span>
          </span>
          <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
        </a>
      ))}
    </div>
  )
}
