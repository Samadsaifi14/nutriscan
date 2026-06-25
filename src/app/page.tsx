"use client"
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageShell from '@/components/PageShell'

const FEATURES = [
  { ic: '📊', t: 'Health Score', d: 'AI-powered 1-10 rating. Nutrition + processing + ingredients.' },
  { ic: '🧪', t: 'Additive Scanner', d: '120+ harmful additives detected with risk explanations.' },
  { ic: '🇮🇳', t: 'India-First DB', d: '50+ Indian brands. FSSAI & ICMR 2020 aligned.' },
]

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') return null
  if (session) return null

  return (
    <PageShell variant="no-header">
      <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--clay), var(--moss))' }} />
          <span style={{ fontSize: 18, color: 'var(--foreground)', fontWeight: 800, letterSpacing: '-0.04em' }}>Bio You</span>
        </div>
        <Link href="/auth/signin" style={{
          padding: '8px 16px', borderRadius: 24, background: 'var(--clay)', color: '#fff',
          fontSize: 13, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.01em',
        }}>Sign in</Link>
      </div>

      <div style={{
        minHeight: 260,
        background: 'radial-gradient(ellipse at 75% 20%, rgba(196,113,74,0.10) 0%, transparent 65%), var(--background)',
        padding: '16px 16px 24px',
        position: 'relative',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', right: 12, top: 12, width: 96, height: 160,
          opacity: 0.12, borderRadius: 20, border: '1.5px solid var(--clay)',
          transform: 'perspective(280px) rotateY(-18deg) rotateX(4deg)',
        }} />
        <div style={{
          padding: '4px 12px', borderRadius: 20, background: 'rgba(196,113,74,0.10)',
          color: 'var(--clay)', fontSize: 11, fontWeight: 600, width: 'fit-content', marginBottom: 10,
          border: '0.5px solid var(--border-2)',
        }}>AI-Powered Food Scanner</div>
        <h1 style={{
          fontSize: 26, fontWeight: 800, marginBottom: 8, lineHeight: 1.15,
          color: 'var(--foreground)', letterSpacing: '-0.04em',
        }}>
          Know every<br />
          <span style={{ color: 'var(--clay)' }}>ingredient.</span>
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.55, maxWidth: 200,
        }}>
          Scan any packaged food for instant health scores, additive alerts & personalised insights.
        </p>
        <Link href="/auth/signin" style={{
          height: 46, borderRadius: 24, background: 'var(--clay)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          maxWidth: 220, marginBottom: 14, fontSize: 14, fontWeight: 700,
          textDecoration: 'none', gap: 8,
        }}>
          <span>📷</span> Start Scanning
        </Link>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['✓ 120+ additives', '✓ Indian brands', '✓ FSSAI'].map(v => (
            <span key={v} style={{
              padding: '4px 10px', borderRadius: 20, background: 'var(--surface-3)',
              color: 'var(--sand)', fontSize: 11, fontWeight: 600,
              border: '0.5px solid var(--border-2)', whiteSpace: 'nowrap',
            }}>{v}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em' }}>WHY BIO YOU</span>
        </div>
        {FEATURES.map(f => (
          <div key={f.t} style={{
            background: 'var(--surface-2)', borderRadius: 12,
            border: '0.5px solid var(--border-2)', padding: 14,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: 'rgba(196,113,74,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}>{f.ic}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 14, color: 'var(--foreground)', fontWeight: 700 }}>{f.t}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{f.d}</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
