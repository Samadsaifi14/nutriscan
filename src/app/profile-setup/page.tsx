'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { ChevronRight, User, Scale, Activity, Heart, Leaf, Globe, Utensils } from 'lucide-react'

const STEPS = [
  { key: 'basic', icon: <User size={18} />, title: 'Basic Info' },
  { key: 'body', icon: <Scale size={18} />, title: 'Body Metrics' },
  { key: 'diet', icon: <Leaf size={18} />, title: 'Diet & Allergies' },
  { key: 'ethnicity', icon: <Globe size={18} />, title: 'Ethnicity' },
  { key: 'health', icon: <Heart size={18} />, title: 'Health Conditions' },
  { key: 'preferences', icon: <Utensils size={18} />, title: 'Food Preferences' },
]

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const ETHNICITY_OPTIONS = [
  'Indian (South)', 'Indian (North)', 'Indian (East)', 'Indian (West)', 'Indian (Northeast)',
  'East Asian', 'Southeast Asian', 'Mediterranean', 'European', 'American',
  'Latin American', 'Middle Eastern', 'African', 'Caribbean', 'Other',
]
const ALLERGY_OPTIONS = [
  'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish', 'Fish',
  'Sesame', 'Peanuts', 'Sulfites', 'Mustard', 'Celery', 'Lupin', 'Mollusks',
]
const MEDICAL_CONDITIONS = [
  { field: 'is_diabetic', label: 'Diabetes' },
  { field: 'has_bp', label: 'High Blood Pressure' },
  { field: 'has_heart_disease', label: 'Heart Disease' },
  { field: 'has_cholesterol', label: 'High Cholesterol' },
  { field: 'has_thyroid', label: 'Thyroid Disorder' },
  { field: 'has_kidney_disease', label: 'Kidney Disease' },
  { field: 'has_pcod', label: 'PCOD/PCOS' },
  { field: 'is_pregnant', label: 'Pregnant' },
  { field: 'is_lactating', label: 'Lactating' },
]
const DIET_OPTIONS = [
  { field: 'is_vegetarian', label: 'Vegetarian' },
  { field: 'is_vegan', label: 'Vegan' },
  { field: 'is_jain', label: 'Jain' },
]
const CUISINE_OPTIONS = [
  'South Indian', 'North Indian', 'Bengali', 'Gujarati', 'Rajasthani',
  'Maharashtrian', 'Punjabi', 'Chinese', 'Japanese', 'Thai',
  'Mediterranean', 'Italian', 'Mexican', 'American', 'Continental',
]
const SPICE_OPTIONS = ['Mild', 'Medium', 'Spicy']

export default function ProfileSetup() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, unknown>>({
    is_diabetic: false, has_bp: false, has_heart_disease: false, has_cholesterol: false,
    has_thyroid: false, has_kidney_disease: false, has_pcod: false,
    is_pregnant: false, is_lactating: false,
    is_vegetarian: false, is_vegan: false, is_jain: false,
    allergies: [] as string[], cuisine_preferences: [] as string[],
  })

  const current = STEPS[step]!

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else saveProfile()
  }

  function prev() {
    if (step > 0) setStep(step - 1)
  }

  function toggleArrayField(field: string, value: string) {
    const arr = (form[field] as string[]) || []
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    setForm({ ...form, [field]: next })
  }

  function toggleBool(field: string) {
    setForm({ ...form, [field]: !form[field] })
  }

  async function saveProfile() {
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      router.push('/dashboard')
    } catch { /* silent */ }
  }

  const bmi = form.weight_kg && form.height_cm
    ? ((form.weight_kg as number) / ((form.height_cm as number) / 100) ** 2).toFixed(1)
    : null

  return (
    <PageShell variant="bare">
      <div className="step-bar" style={{ marginBottom: 32, marginTop: 24 }}>
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

      <div className="card" style={{ minHeight: 200 }}>
        <div className="row--sm" style={{ marginBottom: 20 }}>
          <div className="icon-btn" style={{ color: 'var(--clay)' }}>{current.icon}</div>
          <span className="text-h3" style={{ fontWeight: 700 }}>{current.title}</span>
        </div>

        {current.key === 'basic' && (
          <div className="stack--md">
            <div className="input-group">
              <label className="text-xs text-sand" style={{ marginBottom: 4 }}>Name</label>
              <input className="input" type="text" placeholder="Your name"
                value={(form.name as string) ?? ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="row--md">
              <div className="input-group flex-1">
                <label className="text-xs text-sand" style={{ marginBottom: 4 }}>Age</label>
                <input className="input" type="number" placeholder="Age"
                  value={(form.age as number) ?? ''}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} />
              </div>
              <div className="input-group flex-1">
                <label className="text-xs text-sand" style={{ marginBottom: 4 }}>Gender</label>
                <select className="input" value={(form.gender as string) ?? ''}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Select</option>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {current.key === 'body' && (
          <div className="stack--md">
            <div className="row--md">
              <div className="input-group flex-1">
                <label className="text-xs text-sand" style={{ marginBottom: 4 }}>Weight (kg)</label>
                <input className="input" type="number" placeholder="e.g. 70"
                  value={(form.weight_kg as number) ?? ''}
                  onChange={(e) => setForm({ ...form, weight_kg: Number(e.target.value) })} />
              </div>
              <div className="input-group flex-1">
                <label className="text-xs text-sand" style={{ marginBottom: 4 }}>Height (cm)</label>
                <input className="input" type="number" placeholder="e.g. 170"
                  value={(form.height_cm as number) ?? ''}
                  onChange={(e) => setForm({ ...form, height_cm: Number(e.target.value) })} />
              </div>
            </div>
            {bmi && (
              <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(61,92,46,0.08)', border: '1px solid rgba(61,92,46,0.15)' }}>
                <p className="text-xs" style={{ color: 'var(--moss)' }}>BMI: {bmi}</p>
              </div>
            )}
          </div>
        )}

        {current.key === 'diet' && (
          <div className="stack--md">
            <p className="text-xs text-sand mb-1">Dietary Identity</p>
            {DIET_OPTIONS.map((opt) => (
              <label key={opt.field} className="row--md" style={{ cursor: 'pointer' }}>
                <div className={`toggle ${form[opt.field] ? 'toggle--on' : ''}`}
                  onClick={() => toggleBool(opt.field)}>
                  <div className="toggle__knob" />
                </div>
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
            <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <p className="text-xs text-sand mb-2">Allergies (select all that apply)</p>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map((a) => (
                  <button key={a}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      (form.allergies as string[])?.includes(a)
                        ? 'bg-[var(--clay)] text-white border-[var(--clay)]'
                        : 'border-[var(--card-border)] text-[var(--sand)] hover:border-[var(--clay)]'
                    }`}
                    onClick={() => toggleArrayField('allergies', a)}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {current.key === 'ethnicity' && (
          <div className="stack--md">
            <div className="input-group">
              <label className="text-xs text-sand" style={{ marginBottom: 4 }}>Ethnicity / Region</label>
              <select className="input" value={(form.ethnicity as string) ?? ''}
                onChange={(e) => setForm({ ...form, ethnicity: e.target.value })}>
                <option value="">Select your background</option>
                {ETHNICITY_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        )}

        {current.key === 'health' && (
          <div className="stack--md">
            <p className="text-xs text-sand mb-1">Medical Conditions</p>
            {MEDICAL_CONDITIONS.map((c) => (
              <label key={c.field} className="row--md" style={{ cursor: 'pointer' }}>
                <div className={`toggle ${form[c.field] ? 'toggle--on' : ''}`}
                  onClick={() => toggleBool(c.field)}>
                  <div className="toggle__knob" />
                </div>
                <span className="text-sm">{c.label}</span>
              </label>
            ))}
          </div>
        )}

        {current.key === 'preferences' && (
          <div className="stack--md">
            <div>
              <p className="text-xs text-sand mb-2">Spice Level</p>
              <div className="flex gap-2">
                {SPICE_OPTIONS.map((s) => (
                  <button key={s}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.spice_level === s.toLowerCase()
                        ? 'bg-[var(--clay)] text-white border-[var(--clay)]'
                        : 'border-[var(--card-border)] text-[var(--sand)] hover:border-[var(--clay)]'
                    }`}
                    onClick={() => setForm({ ...form, spice_level: s.toLowerCase() })}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <p className="text-xs text-sand mb-2">Cuisine Preferences (select all that apply)</p>
              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTIONS.map((c) => (
                  <button key={c}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      (form.cuisine_preferences as string[])?.includes(c)
                        ? 'bg-[var(--clay)] text-white border-[var(--clay)]'
                        : 'border-[var(--card-border)] text-[var(--sand)] hover:border-[var(--clay)]'
                    }`}
                    onClick={() => toggleArrayField('cuisine_preferences', c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="row--md" style={{ marginTop: 24 }}>
        {step > 0 && (
          <button className="btn btn--outline flex-1" onClick={prev}>
            Back
          </button>
        )}
        <button className="btn btn--primary flex-1" onClick={next}>
          {step < STEPS.length - 1 ? 'Continue' : 'Complete Setup'} <ChevronRight size={16} />
        </button>
      </div>
    </PageShell>
  )
}
