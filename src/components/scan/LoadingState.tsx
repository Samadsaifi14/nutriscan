// src/components/scan/LoadingState.tsx
"use client"

interface LoadingProductProps {
  status?: string
}

export function LoadingProduct({ status }: LoadingProductProps) {
  return (
    <div className="flex flex-col items-center py-12 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-[#2a3545] border-t-emerald-400 animate-spin" />
      <p className="text-sm text-[#7a8fa6]">{status || '🔍 Looking up product...'}</p>
    </div>
  )
}

export function LoadingAnalysis() {
  return (
    <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-6 mb-4">
      <div className="flex flex-col items-center gap-5">
        <div className="w-32 h-32 relative">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120"
            style={{ animation: 'spin 2s linear infinite' }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="#2a3545" strokeWidth="10" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#22c55e" strokeWidth="10"
              strokeLinecap="round" strokeDasharray="326" strokeDashoffset="244" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-emerald-400 text-center leading-tight px-2">
              Analysing…
            </span>
          </div>
        </div>
        <div className="space-y-3 w-full">
          {['Checking ingredients…', 'Detecting harmful additives…', 'Calculating health score…'].map((msg, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}>
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex-shrink-0" />
              <div className="h-2.5 rounded-full bg-[#2a3545] flex-grow" />
              <span className="text-[11px] text-[#7a8fa6] whitespace-nowrap">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
