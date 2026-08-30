import { ExternalLink } from 'lucide-react'
import { getAllShoppingLinks } from '@/lib/shopping-links'

interface ShoppingLinksProps {
  productName: string
  variant?: 'compact' | 'grid'
}

function buildLinks(productName: string) {
  const colors = { amazon: 'var(--amber)', flipkart: 'var(--moss)', blinkit: 'var(--clay)', instamart: 'var(--rust)' }
  return getAllShoppingLinks(productName)
    .filter((link) => link.platform in colors)
    .map((link) => ({ name: link.platform === 'instamart' ? 'Instamart' : link.platform[0]!.toUpperCase() + link.platform.slice(1), href: link.url, color: colors[link.platform as keyof typeof colors] }))
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
