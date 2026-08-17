'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/PageShell'
import { Camera, Shield, Search } from 'lucide-react'

const FEATURES = [
  { icon: <Camera size={22} />, title: 'Health Score', desc: 'AI-powered 1-10 rating. Nutrition + processing + ingredients.' },
  { icon: <Shield size={22} />, title: 'Additive Scanner', desc: '120+ harmful additives detected with risk explanations.' },
  { icon: <Search size={22} />, title: 'India-First DB', desc: '50+ Indian brands. FSSAI & ICMR 2020 aligned.' },
]

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') return (
    <PageShell variant="no-header">
      <div style={{ height: '80dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--surface-3)', borderTopColor: 'var(--clay)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </PageShell>
  )
  if (session) return null

  return (
    <PageShell variant="no-header">
      <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 0 12px' }}>
        <div className="row--sm">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--clay), var(--moss))' }} />
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em' }}>HealthOX</span>
        </div>
        <Link href="/auth/signin" className="btn btn--primary btn--sm" style={{ textDecoration: 'none' }}>
          Sign in
        </Link>
      </div>

      <div style={{ margin: '24px 0', position: 'relative' }}>
        <div className="chip" style={{ marginBottom: 12, width: 'fit-content' }}>AI-Powered Food Scanner</div>
        <h1 className="text-hero" style={{ marginBottom: 8 }}>
          Know every<br />
          <span style={{ color: 'var(--clay)' }}>ingredient.</span>
        </h1>
        <p className="text-body" style={{ color: 'var(--muted)', marginBottom: 20, maxWidth: 240, lineHeight: 1.55 }}>
          Scan any packaged food for instant health scores, additive alerts & personalised insights.
        </p>
        <Link href="/auth/signin" className="btn btn--primary" style={{ textDecoration: 'none', width: 'fit-content', marginBottom: 16 }}>
          <Camera size={18} /> Start Scanning
        </Link>
        <div className="filter-row" style={{ gap: 6 }}>
          {['120+ additives', 'Indian brands', 'FSSAI'].map((v) => (
            <span key={v} className="chip chip--active" style={{ fontSize: 11 }}>{v}</span>
          ))}
        </div>
      </div>

      <div className="section-header" style={{ marginTop: 32 }}>
        <span className="section-header__title">WHY HEALTHOX</span>
      </div>
      <div className="stack--md">
        {FEATURES.map((f) => (
          <div key={f.title} className="card row--md" style={{ border: '1px solid var(--border-2)' }}>
            <div className="icon-btn" style={{ width: 44, height: 44, color: 'var(--clay)' }}>
              {f.icon}
            </div>
            <div className="stack--sm flex-1">
              <span className="text-sm" style={{ fontWeight: 700 }}>{f.title}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{f.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
