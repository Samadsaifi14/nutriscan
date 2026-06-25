"use client"
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import PageShell from '@/components/PageShell'

const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false, loading: () => null }
)

export default function ScanPage() {
  const router = useRouter()
  const [mode, setMode] = useState('barcode')
  const [scanning, setScanning] = useState(true)

  const handleDetected = useCallback((barcode: string) => {
    if (!barcode || !scanning) return
    setScanning(false)
    router.push(`/results?barcode=${encodeURIComponent(barcode)}`)
  }, [router, scanning])

  return (
    <PageShell variant="fullscreen">
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg,#0f0d0b 0,#0f0d0b 1px,#0b0908 1px,#0b0908 22px),repeating-linear-gradient(90deg,#0f0d0b 0,#0f0d0b 1px,#0b0908 1px,#0b0908 22px)',
      }} />

      {mode === 'barcode' && scanning && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <BarcodeScanner onDetected={handleDetected} onClose={() => router.back()} />
        </div>
      )}

      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: mode === 'barcode' ? 168 : 170,
        height: mode === 'barcode' ? 90 : 168,
      }}>
        {[[0,0,'10px 0 0 0'],[1,0,'0 10px 0 0'],[0,1,'0 0 0 10px'],[1,1,'0 0 10px 0']].map(([r,b,br], i) => (
          <div key={i} style={{
            position: 'absolute',
            right: r ? 0 : undefined, left: r ? undefined : 0,
            bottom: b ? 0 : undefined, top: b ? undefined : 0,
            width: 16, height: 16,
            border: '2px solid var(--clay)',
            borderRadius: br as string,
          }} />
        ))}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '40%', height: 1.5,
          background: 'linear-gradient(90deg,transparent,var(--clay),transparent)',
          animation: 'scanline 2s ease-in-out infinite',
        }} />
      </div>

      <div style={{
        position: 'absolute', top: '55%', left: '50%', transform: 'translateX(-50%)',
        marginTop: mode === 'photo' ? 80 : 40,
        textAlign: 'center', whiteSpace: 'nowrap',
      }}>
        <span style={{ fontSize: 13, color: 'var(--sand)' }}>
          {mode === 'barcode' ? 'Point at barcode' : mode === 'photo' ? 'Frame the product label' : 'Enter barcode manually'}
        </span>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: 'linear-gradient(to bottom,rgba(8,6,4,0.9),transparent)',
        paddingBottom: 20,
      }}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
          <button onClick={() => router.back()} style={{
            padding: '6px 12px', borderRadius: 20, background: 'rgba(0,0,0,0.55)',
            color: 'var(--sand)', fontSize: 12, border: 'none', cursor: 'pointer',
          }}>
            ← Back
          </button>
          <span style={{ fontSize: 15, color: '#fff', fontWeight: 700 }}>Scan Product</span>
          <div style={{
            padding: '6px 12px', borderRadius: 20, background: 'rgba(0,0,0,0.55)',
            color: 'var(--sand)', fontSize: 12,
          }}>
            ⚡ Flash
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top,rgba(8,6,4,0.96),transparent)',
        padding: '24px 14px 20px',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
      }}>
        <div style={{
          display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 16,
          background: 'rgba(0,0,0,0.55)', borderRadius: 24, padding: 4,
          border: '0.5px solid var(--border-2)',
        }}>
          {['Barcode','Photo','Manual'].map(m => (
            <button key={m} onClick={() => setMode(m.toLowerCase())} style={{
              flex: 1, padding: '8px 0', borderRadius: 20,
              background: mode === m.toLowerCase() ? 'var(--clay)' : 'transparent',
              border: 'none', cursor: 'pointer',
              color: mode === m.toLowerCase() ? '#fff' : 'var(--sand)',
              fontSize: 13, fontWeight: 600,
            }}>
              {m}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
          }}>
            <span>\uD83D\uDDBC\uFE0F</span>
          </div>
          <div style={{
            width: 58, height: 58, borderRadius: '50%',
            background: 'var(--clay)',
            border: '4px solid rgba(196,113,74,0.27)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            <span>\uD83D\uDCF7</span>
          </div>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
          }}>
            <span>⚙️</span>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
