// src/components/scan/ScanHeader.tsx
"use client"

interface ScanHeaderProps {
  isGuest: boolean
}

export function ScanHeader({ isGuest }: ScanHeaderProps) {
  return (
    <div className="px-5 pt-12 pb-6 border-b border-[var(--border)]">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
          health<span className="text-[var(--clay)]">OX</span> Scanner
        </h1>
        <div className="flex items-center gap-1.5 bg-[var(--clay)]/10 border border-[var(--clay)]/20 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] animate-pulse" />
          <span className="text-[11px] text-[var(--clay)] font-medium">AI Ready</span>
        </div>
      </div>
      <p className="text-sm text-[var(--muted-2)]">
        {isGuest
          ? 'Guest mode — sign in to save and track your meals'
          : 'Scan barcodes or take a product photo for instant AI health ratings'}
      </p>
      {isGuest && (
        <div className="mt-3 px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <p className="text-xs text-[var(--muted-2)]">
            👤 Guest mode.{' '}
            <a href="/auth/signin" className="text-[var(--clay)] underline font-medium">Sign in</a>
            {' '}to save history and track calories.
          </p>
        </div>
      )}
    </div>
  )
}