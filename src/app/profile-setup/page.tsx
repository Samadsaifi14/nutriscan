'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { ChevronRight, User, Scale, Activity, Heart, Leaf } from 'lucide-react'

const STEPS = [
  { key: 'name', icon: <User size={18} />, title: 'Your Name', field: 'name', placeholder: 'Enter your name', type: 'text' },
  { key: 'weight', icon: <Scale size={18} />, title: 'Weight', field: 'weight_kg', placeholder: 'Enter weight (kg)', type: 'number' },
  { key: 'height', icon: <Activity size={18} />, title: 'Height', field: 'height_cm', placeholder: 'Enter height (cm)', type: 'number' },
  { key: 'diet', icon: <Leaf size={18} />, title: 'Dietary Preference', field: 'is_vegetarian', type: 'toggle', label: 'I am vegetarian' },
  { key: 'health', icon: <Heart size={18} />, title: 'Health Conditions', fields: ['is_diabetic', 'has_bp'], type: 'multi-toggle', labels: ['Diabetic', 'High BP'] },
]

export default function ProfileSetup() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, unknown>>({})

  const current = STEPS[step]!

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else saveProfile()
  }

  async function saveProfile() {
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      router.push('/dashboard')
    } catch {
      // silent
    }
  }

  return (
    <PageShell variant="bare">
      {/* Step bar */}
      <div className="step-bar" style={{ marginBottom: 40, marginTop: 24 }}>
        {STEPS.map((s, i) => (
          <div key={s.key} className="step-bar__node">
            <div className={`step-bar__circle ${i < step ? 'step-bar__node--done' : ''} ${i === step ? 'step-bar__node--active' : ''}`}
              style={{
                ...(i < step ? { background: 'var(--moss)', borderColor: 'var(--moss)', color: '#fff' } : {}),
                ...(i === step ? { background: 'var(--clay)', borderColor: 'var(--clay)', color: '#fff' } : {}),
              }}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className="step-bar__label" style={{ ...(i === step ? { color: 'var(--clay)', fontWeight: 600 } : {}) }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="card" style={{ minHeight: 200 }}>
        <div className="row--sm" style={{ marginBottom: 20 }}>
          <div className="icon-btn" style={{ color: 'var(--clay)' }}>{current.icon}</div>
          <span className="text-h3" style={{ fontWeight: 700 }}>{current.title}</span>
        </div>

        {current.type === 'text' || current.type === 'number' ? (
          <div className="input-group">
            {current.field && (
              <input
                className="input"
                type={current.type}
                placeholder={current.placeholder}
                value={(form[current.field] as string) ?? ''}
                onChange={(e) => setForm({ ...form, [current.field!]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && next()}
                autoFocus
              />
            )}
          </div>
        ) : current.type === 'toggle' ? (
          <label className="row--md" style={{ cursor: 'pointer', padding: '8px 0' }}>
            <div className={`toggle ${form[current.field!] ? 'toggle--on' : ''}`}
              onClick={() => setForm({ ...form, [current.field!]: !form[current.field!] })}>
              <div className="toggle__knob" />
            </div>
            <span className="text-sm">{current.label}</span>
          </label>
        ) : (
          <div className="stack--md">
            {current.fields?.map((f, i) => (
              <label key={f} className="row--md" style={{ cursor: 'pointer' }}>
                <div className={`toggle ${form[f] ? 'toggle--on' : ''}`}
                  onClick={() => setForm({ ...form, [f]: !form[f] })}>
                  <div className="toggle__knob" />
                </div>
                <span className="text-sm">{current.labels?.[i]}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn--primary btn--full" style={{ marginTop: 24 }} onClick={next}>
        {step < STEPS.length - 1 ? 'Continue' : 'Complete Setup'} <ChevronRight size={16} />
      </button>
    </PageShell>
  )
}
