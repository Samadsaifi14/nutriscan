"use client"

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t px-5 py-8 mt-8"
      style={{
        borderColor: 'var(--card-border)',
        background: 'color-mix(in oklab, var(--background), black 6%)',
      }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          {[
            { href: '/legal/privacy', label: 'Privacy Policy' },
            { href: '/legal/terms', label: 'Terms of Service' },
            { href: '/legal/disclaimer', label: 'Medical Disclaimer' },
            { href: '/legal/cookies', label: 'Cookie Policy' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="text-xs transition-colors"
              style={{ color: 'var(--muted-2)' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <p className="text-[10px]" style={{ color: 'var(--muted-2)' }}>
          &copy; {new Date().getFullYear()} Bio You. All rights reserved.
        </p>
        <p className="text-[10px] mt-1" style={{ color: 'var(--muted-2)' }}>
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </footer>
  )
}
