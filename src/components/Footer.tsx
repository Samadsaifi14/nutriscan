"use client"

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="px-3 py-5"
      style={{
        borderTop: '0.5px solid var(--card-border)',
        background: 'color-mix(in oklab, var(--background), black 6%)',
      }}>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
        {[
          { href: '/legal/privacy', label: 'Privacy' },
          { href: '/legal/terms', label: 'Terms' },
          { href: '/legal/disclaimer', label: 'Disclaimer' },
          { href: '/legal/cookies', label: 'Cookies' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="text-[10px] transition-colors" style={{ color: 'var(--muted-2)' }}>
            {item.label}
          </Link>
        ))}
      </div>
      <p className="text-[9px]" style={{ color: 'var(--muted-2)' }}>
        &copy; {new Date().getFullYear()} Bio You
      </p>
    </footer>
  )
}
