"use client"
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const FEATURES = [
  { ic: '\uD83D\uDCCA', t: 'Health Score', d: 'AI-powered 1-10 rating. Nutrition + processing + ingredients.' },
  { ic: '\uD83E\uDDEA', t: 'Additive Scanner', d: '120+ harmful additives detected with risk explanations.' },
  { ic: '\uD83C\uDDF3\uD83C\uDDF1', t: 'India-First DB', d: '50+ Indian brands. FSSAI & ICMR 2020 aligned.' },
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
    <div style={{ background: 'var(--background)', minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 72, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 14px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 18, height: 18, borderRadius: 6, background: 'linear-gradient(135deg, var(--clay), var(--moss))' }} />
          <span style={{ fontSize: 10, color: 'var(--foreground)', fontWeight: 800, letterSpacing: '-0.04em' }}>Bio You</span>
        </div>
        <Link href="/auth/signin" style={{
          padding: '4px 10px', borderRadius: 20, background: 'var(--clay)', color: '#fff',
          fontSize: 7.5, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.01em',
        }}>Sign in</Link>
      </div>

      <div style={{
        minHeight: 230,
        background: 'radial-gradient(ellipse at 75% 20%, rgba(196,113,74,0.10) 0%, transparent 65%), var(--background)',
        padding: '10px 14px 18px',
        position: 'relative',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', right: 10, top: 10, width: 72, height: 130,
          opacity: 0.12, borderRadius: 16, border: '1.5px solid var(--clay)',
          transform: 'perspective(280px) rotateY(-18deg) rotateX(4deg)',
        }} />
        <div style={{
          padding: '2px 7px', borderRadius: 20, background: 'rgba(196,113,74,0.10)',
          color: 'var(--clay)', fontSize: 6.5, fontWeight: 500, width: 'fit-content', marginBottom: 8,
          border: '0.5px solid var(--border-2)',
        }}>AI-Powered Food Scanner</div>
        <h1 style={{
          fontSize: 16, fontWeight: 800, marginBottom: 6, lineHeight: 1.2,
          color: 'var(--foreground)', letterSpacing: '-0.04em',
        }}>
          Know every<br />
          <span style={{ color: 'var(--clay)' }}>ingredient.</span>
        </h1>
        <p style={{
          fontSize: 7.5, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.55, maxWidth: 160,
        }}>
          Scan any packaged food for instant health scores, additive alerts &amp; personalised insights.
        </p>
        <Link href="/auth/signin" style={{
          height: 36, borderRadius: 20, background: 'var(--clay)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          maxWidth: 200, marginBottom: 10, fontSize: 8, fontWeight: 700,
          textDecoration: 'none', gap: 6,
        }}>
          <span>\uD83D\uDCF7</span> Start Scanning
        </Link>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['✓ 120+ additives', '✓ Indian brands', '✓ FSSAI'].map(v => (
            <span key={v} style={{
              padding: '2px 7px', borderRadius: 20, background: 'var(--surface-3)',
              color: 'var(--sand)', fontSize: 6.5, fontWeight: 500,
              border: '0.5px solid var(--border-2)', whiteSpace: 'nowrap',
            }}>{v}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, marginTop: 8 }}>
          <span style={{ fontSize: 6.5, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em' }}>WHY BIO YOU</span>
        </div>
        {FEATURES.map(f => (
          <div key={f.t} style={{
            background: 'var(--surface-2)', borderRadius: 10,
            border: '0.5px solid var(--border-2)', padding: 10,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: 'rgba(196,113,74,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>{f.ic}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 8.5, color: 'var(--foreground)', fontWeight: 700 }}>{f.t}</span>
              <span style={{ fontSize: 7, color: 'var(--muted)', lineHeight: 1.5 }}>{f.d}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '8px 14px 16px', borderTop: '0.5px solid var(--border)',
        textAlign: 'center', marginTop: 4, flexShrink: 0,
      }}>
        <span style={{ fontSize: 6.5, color: 'var(--muted)' }}>
          <a href="/legal/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          {' · '}
          <a href="/legal/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          {' · '}
          <a href="/legal/cookies" style={{ color: 'inherit', textDecoration: 'none' }}>Cookies</a>
          {' · v2.1.0'}
        </span>
      </div>
    </div>
  )
}
