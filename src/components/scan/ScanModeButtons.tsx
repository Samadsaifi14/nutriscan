// src/components/scan/ScanModeButtons.tsx
"use client"

interface ScanModeButtonsProps {
  onBarcode:   () => void
  onPhotoMode: () => void
  onCaptureLater?: () => void
}

export function ScanModeButtons({ onBarcode, onPhotoMode, onCaptureLater }: ScanModeButtonsProps) {
  return (
    <div className="space-y-3 mb-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onBarcode}
          className="flex flex-col items-center gap-2 py-6 rounded-2xl bg-[var(--clay)] hover:bg-[var(--clay)] text-white font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-[var(--clay)]/20"
        >
          <span className="text-3xl">📷</span>
          <span>Scan Barcode</span>
          <span className="text-[11px] text-[var(--cream)] font-normal">Point at barcode</span>
        </button>
        <button
          onClick={onPhotoMode}
          className="flex flex-col items-center gap-2 py-6 rounded-2xl bg-[#1e242d] border border-[var(--clay)]/30 hover:border-[var(--clay)]/60 hover:bg-[#252c38] text-[var(--clay)] font-semibold text-sm transition-all active:scale-95"
        >
          <span className="text-3xl">🖼️</span>
          <span>Photo Mode</span>
          <span className="text-[11px] text-[#7a8fa6] font-normal">Snap the whole product</span>
        </button>
      </div>
      
      {onCaptureLater && (
        <button
          onClick={onCaptureLater}
          className="w-full flex flex-col items-center gap-2 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/20 text-amber-400 font-semibold text-sm transition-all active:scale-95"
        >
          <span className="text-2xl">📸</span>
          <span>Capture & Scan Later</span>
          <span className="text-[11px] text-amber-400/70 font-normal">Quick capture, process in background</span>
        </button>
      )}
    </div>
  )
}