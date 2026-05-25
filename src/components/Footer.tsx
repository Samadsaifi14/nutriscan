"use client"

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#0d0f12] border-t border-[#2a3545] px-5 py-8 mt-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          <Link href="/legal/privacy" className="text-xs text-[#7a8fa6] hover:text-emerald-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="text-xs text-[#7a8fa6] hover:text-emerald-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/legal/disclaimer" className="text-xs text-[#7a8fa6] hover:text-emerald-400 transition-colors">
            Medical Disclaimer
          </Link>
          <Link href="/legal/cookies" className="text-xs text-[#7a8fa6] hover:text-emerald-400 transition-colors">
            Cookie Policy
          </Link>
        </div>
        <p className="text-[10px] text-[#4a5a6a]">
          &copy; {new Date().getFullYear()} HealthOX. All rights reserved.
        </p>
        <p className="text-[10px] text-[#4a5a6a] mt-1">
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </footer>
  )
}
