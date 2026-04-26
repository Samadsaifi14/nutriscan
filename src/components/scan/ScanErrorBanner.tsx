// src/components/scan/ScanErrorBanner.tsx
"use client"

interface ScanErrorBannerProps {
  error:         string
  onDismiss:     () => void
  onRetry:       () => void
  onPhotoMode:   () => void
}

export function ScanErrorBanner({ error, onDismiss, onRetry, onPhotoMode }: ScanErrorBannerProps) {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-4">
      <p className="text-sm text-red-400 font-medium mb-3">❌ {error}</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={onDismiss}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#1e242d] border border-[#2a3545] text-[#7a8fa6] hover:border-red-500/30 transition-colors">
          Dismiss
        </button>
        <button onClick={onRetry}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#1e242d] border border-[#2a3545] text-[#f0f4f8] hover:border-emerald-500/30 transition-colors">
          🔄 Try Again
        </button>
        <button onClick={onPhotoMode}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#1e242d] border border-[#2a3545] text-[#f0f4f8] hover:border-emerald-500/30 transition-colors">
          📷 Photo Mode
        </button>
      </div>
    </div>
  )
}

interface AnalysisErrorBannerProps {
  error:   string
  onRetry: () => void
}

export function AnalysisErrorBanner({ error, onRetry }: AnalysisErrorBannerProps) {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <p className="flex-1 text-sm font-medium text-red-400">{error}</p>
        <button onClick={onRetry}
          className="flex-shrink-0 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl hover:bg-red-500/20 transition-colors">
          Retry
        </button>
      </div>
    </div>
  )
}