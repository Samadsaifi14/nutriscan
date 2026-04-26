// src/components/scan/ScanHeader.tsx
"use client"

interface ScanHeaderProps {
  isGuest: boolean
}

export function ScanHeader({ isGuest }: ScanHeaderProps) {
  return (
    <div className="px-5 pt-12 pb-6 border-b border-[#2a3545]">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-[#f0f4f8] tracking-tight">
          health<span className="text-emerald-400">OX</span> Scanner
        </h1>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-400 font-medium">AI Ready</span>
        </div>
      </div>
      <p className="text-sm text-[#7a8fa6]">
        {isGuest
          ? 'Guest mode — sign in to save and track your meals'
          : 'Scan barcodes or take a product photo for instant AI health ratings'}
      </p>
      {isGuest && (
        <div className="mt-3 px-4 py-2.5 bg-[#1e242d] border border-[#2a3545] rounded-xl">
          <p className="text-xs text-[#7a8fa6]">
            👤 Guest mode.{' '}
            <a href="/auth/signin" className="text-emerald-400 underline font-medium">Sign in</a>
            {' '}to save history and track calories.
          </p>
        </div>
      )}
    </div>
  )
}