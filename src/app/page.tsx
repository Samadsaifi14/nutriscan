'use client'

import Link from 'next/link'
import { PageShell } from '@/components/PageShell'
import { Camera, Shield, Search } from 'lucide-react'

const FEATURES = [
  { icon: <Camera size={22} />, title: 'Health Score', desc: 'AI-powered 1-10 rating. Nutrition + processing + ingredients.' },
  { icon: <Shield size={22} />, title: 'Additive Scanner', desc: '120+ harmful additives detected with risk explanations.' },
  { icon: <Search size={22} />, title: 'India-First DB', desc: '50+ Indian brands. FSSAI & ICMR 2020 aligned.' },
]

export default function Home() {
  return (
    <PageShell variant="no-header">
      <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 0 12px' }}>
        <div className="row--sm">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--clay), var(--moss))' }} />
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em' }}>HealthOX</span>
        </div>
      </div>

      <div style={{ margin: '24px 0', position: 'relative' }}>
        <div className="chip" style={{ marginBottom: 12, width: 'fit-content' }}>AI-Powered Food Scanner</div>
        <h1 className="text-hero" style={{ marginBottom: 8 }}>
          Know every<br />
          <span style={{ color: 'var(--clay)' }}>bite.</span>
        </h1>
        <p className="text-body" style={{ color: 'var(--sand)', maxWidth: 320 }}>
          Scan Indian food products. Get instant health scores, additive warnings, and better alternatives.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="btn btn--primary btn--full"
        style={{ textDecoration: 'none', marginBottom: 16, textAlign: 'center' }}
      >
        Get Started
      </Link>

      <div className="stack--sm" style={{ marginTop: 8 }}>
        {FEATURES.map((f) => (
          <div key={f.title} className="card card--sm row--md" style={{ alignItems: 'flex-start' }}>
            <div className="icon-btn" style={{ width: 36, height: 36, color: 'var(--clay)' }}>{f.icon}</div>
            <div className="stack--xs flex-1">
              <span className="text-sm" style={{ fontWeight: 700 }}>{f.title}</span>
              <span className="text-xs" style={{ color: 'var(--sand)' }}>{f.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-3xs" style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 32 }}>
        Built for India. Not a substitute for medical advice.
      </p>
    </PageShell>
  )
}
