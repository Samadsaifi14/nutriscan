'use client'

import Link from 'next/link'
import { PageShell } from '@/components/PageShell'
import { ArrowRight, Database, FlaskConical, ScanLine, Shield } from 'lucide-react'
import { Option1ImmersiveLanding } from '@/components/Option1ImmersiveLanding'
import { Option2FullVisualRedesign } from '@/components/Option2FullVisualRedesign'
import { Option3ScientificStorytelling } from '@/components/Option3ScientificStorytelling'

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
        <span className="landing-wordmark__meta"><Database size={14} /> BioNexus immersive 3D</span>
      </header>

      <section className="landing-hero">
        <div className="landing-kicker"><span /> Scan · understand · choose</div>
        <h1 className="text-hero">A clearer read<br />on every label.</h1>
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

      {/* Option 1: Immersive Landing Page */}
      <Option1ImmersiveLanding
        splineUrl="https://cdn.spline.build/scene/planetary-system/balloon.splinescenefile"
      />

      {/* Option 2: Full Visual Redesign */}
      <Option2FullVisualRedesign
        splineUrls={{
          scene1: "https://cdn.spline.build/scene/industrial-factory/engine.splinescenefile",
          scene2: "https://cdn.spline.build/scene/space/rocket.splinescenefile",
        }}
        pageTitle="Full Visual Redesign"
      />

      {/* Option 3: Scientific Storytelling */}
      <Option3ScientificStorytelling
        steps={[
          {
            title: "Biological Input",
            description: "Starting with raw biological data and molecular structures",
            splineUrl: "https://cdn.spline.build/scene/molecular-structures/dna.splinescenefile",
            icon: "🧬",
          },
          {
            title: "Analysis",
            description: "AI-powered analysis of compounds and their effects",
            splineUrl: "https://cdn.spline.build/scene/data-visualization/chart.splinescenefile",
            icon: "📊",
          },
          {
            title: "Interpretable Evidence",
            description: "Clear, evidence-based insights and alternatives",
            splineUrl: "https://cdn.spline.build/scene/science/evidence.splinescenefile",
            icon: "🔬",
          },
        ]}
      />
    </PageShell>
  )
}