"use client"

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] px-5 py-8 mt-8 bg-[color-mix(in_oklab,var(--background),black_6%)] dark:bg-[color-mix(in_oklab,var(--background),white_3%)]">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          <Link href="/legal/privacy" className="text-xs text-[var(--muted-2)] hover:text-[var(--brand)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="text-xs text-[var(--muted-2)] hover:text-[var(--brand)] transition-colors">
            Terms of Service
          </Link>
          <Link href="/legal/disclaimer" className="text-xs text-[var(--muted-2)] hover:text-[var(--brand)] transition-colors">
            Medical Disclaimer
          </Link>
          <Link href="/legal/cookies" className="text-xs text-[var(--muted-2)] hover:text-[var(--brand)] transition-colors">
            Cookie Policy
          </Link>
        </div>
        <p className="text-[10px] text-[var(--muted-2)]">
          &copy; {new Date().getFullYear()} BioYou. All rights reserved.
        </p>
        <p className="text-[10px] text-[var(--muted-2)] mt-1">
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </footer>
  )
}
