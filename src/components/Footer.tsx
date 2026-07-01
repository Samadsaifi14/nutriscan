import Link from 'next/link'

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
  { label: 'Disclaimer', href: '/legal/disclaimer' },
  { label: 'Cookies', href: '/legal/cookies' },
]

export function Footer() {
  return (
    <footer style={{ padding: '32px 16px 16px', textAlign: 'center' }}>
      <div className="row--sm" style={{ justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        {LEGAL_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-2xs"
            style={{ color: 'var(--muted)', textDecoration: 'none' }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <p className="text-2xs" style={{ color: 'var(--muted)' }}>
        &copy; {new Date().getFullYear()} HealthOX. Not medical advice.
      </p>
    </footer>
  )
}
