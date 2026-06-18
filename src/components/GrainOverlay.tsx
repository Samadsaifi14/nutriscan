"use client"

export default function GrainOverlay() {
  return (
    <div
      className="grain-overlay"
      style={{
        position: 'fixed',
        inset: '-200%',
        width: '400%',
        height: '400%',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.028,
        pointerEvents: 'none' as const,
        zIndex: 9999,
        animation: 'grainShift 0.5s steps(1) infinite',
      }}
    />
  )
}
