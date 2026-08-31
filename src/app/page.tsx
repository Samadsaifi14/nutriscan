'use client'

import Link from 'next/link'
import { PageShell } from '@/components/PageShell'
import { ArrowRight, Database, FlaskConical, ScanLine, Shield } from 'lucide-react'

const FEATURES = [
  { icon: ScanLine, number: '01', title: 'Scan the pack', desc: 'Use the barcode or photograph the product label.' },
  { icon: FlaskConical, number: '02', title: 'See what matters', desc: 'Nutrition, processing, and ingredient evidence in plain language.' },
  { icon: Shield, number: '03', title: 'Choose better', desc: 'Compare safer alternatives and keep the evidence close.' },
]

export default function Home() {
  return (
    <PageShell variant="no-header">
      <header className="landing-wordmark">
        <span>NutriScan</span>
        <span className="landing-wordmark__meta"><Database size={14} /> India-first food intelligence</span>
      </header>

      <section className="landing-hero">
        <div className="landing-kicker"><span /> Scan · understand · choose</div>
        <h1 className="text-hero">A clearer read<br />on every <span className="text-clay">label.</span></h1>
        <p className="landing-copy">Turn a packaged-food label into a fast verdict, evidence you can inspect, and alternatives you can actually buy.</p>
        <Link href="/scan" className="landing-primary">
          <ScanLine size={22} /> Scan a product <ArrowRight size={20} />
        </Link>
        <Link href="/dashboard" className="landing-secondary">Explore your dashboard</Link>
      </section>

      <section className="landing-process" aria-label="How NutriScan works">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <div key={feature.number} className="landing-process__row">
              <span className="landing-process__number">{feature.number}</span>
              <Icon size={24} className="text-clay" />
              <div>
                <h2>{feature.title}</h2>
                <p>{feature.desc}</p>
              </div>
            </div>
          )
        })}
      </section>

      <p className="text-3xs text-muted" style={{ textAlign: 'center', marginTop: 28 }}>
        Built for India. Evidence guidance, not medical advice.
      </p>
    </PageShell>
  )
}
