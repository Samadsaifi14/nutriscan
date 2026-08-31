'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { Check, ChevronRight, Leaf, Heart, SlidersHorizontal } from 'lucide-react'

type Diet = 'vegetarian' | 'vegan' | 'jain' | 'non_veg'

const STEPS = [
  { key: 'diet', icon: <Leaf size={18} />, title: 'Diet' },
  { key: 'health', icon: <Heart size={18} />, title: 'Health' },
  { key: 'more', icon: <SlidersHorizontal size={18} />, title: 'More' },
]

const DIET_OPTIONS: { value: Diet; label: string; desc: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, fish, or poultry' },
  { value: 'vegan', label: 'Vegan', desc: 'No animal products at all' },
  { value: 'jain', label: 'Jain', desc: 'No root veg / fermented items' },
  { value: 'non_veg', label: 'Non-Vegetarian', desc: 'Includes meat, fish, poultry' },
]

const ETHNICITY_OPTIONS = [
  'Indian (South)', 'Indian (North)', 'Indian (East)', 'Indian (West)', 'Indian (Northeast)',
  'East Asian', 'Southeast Asian', 'Mediterranean', 'European', 'American',
  'Latin American', 'Middle Eastern', 'African', 'Caribbean', 'Other',
]
const ALLERGY_OPTIONS = [
  'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish', 'Fish',
  'Sesame', 'Peanuts', 'Sulfites', 'Mustard', 'Celery', 'Lupin', 'Mollusks',
]
const OTHER_CONDITIONS = [
  { field: 'has_thyroid', label: 'Thyroid Disorder' },
  { field: 'has_kidney_disease', label: 'Kidney Disease' },
  { field: 'has_pcod', label: 'PCOD/PCOS' },
  { field: 'is_pregnant', label: 'Pregnant' },
  { field: 'is_lactating', label: 'Lactating' },
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
    is_diabetic: false,
    has_bp: false,
    is_vegetarian: true,
    is_vegan: false,
    is_jain: false,
    has_thyroid: false,
    has_kidney_disease: false,
    has_pcod: false,
    is_pregnant: false,
    is_lactating: false,
    allergies: [] as string[],
    cuisine_preferences: [] as string[],
  })
  const [diet, setDiet] = useState<Diet>('vegetarian')

  const current = STEPS[step]!

  function applyDiet(d: Diet) {
    setDiet(d)
    setForm({
      ...form,
      is_vegetarian: d !== 'non_veg',
      is_vegan: d === 'vegan',
      is_jain: d === 'jain',
    })
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else saveProfile()
  }
  function prev() {
    if (step > 0) setStep(step - 1)
  }
  function toggleArrayField(field: string, value: string) {
    const arr = (form[field] as string[]) || []
    setForm({ ...form, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] })
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

  return (
    <PageShell variant='bare'>
      <div className='step-bar' style={{ marginBottom: 32, marginTop: 24 }}>
        {STEPS.map((s, i) => (
          <div key={s.key} className='step-bar__node'>
            <div className={`step-bar__circle ${i < step ? 'step-bar__node--done' : ''} ${i === step ? 'step-bar__node--active' : ''}`}
              style={{
                ...(i < step ? { background: 'var(--moss)', borderColor: 'var(--moss)', color: '#fff' } : {}),
                ...(i === step ? { background: 'var(--clay)', borderColor: 'var(--clay)', color: '#fff' } : {}),
              }}
            >
              {i < step ? <Check size={15} /> : i + 1}
            </div>
            <span className='step-bar__label' style={{ ...(i === step ? { color: 'var(--clay)', fontWeight: 600 } : {}) }}>{s.title}</span>
          </div>
        ))}
      </div>

      <div className='card' style={{ minHeight: 200 }}>
        <div className='row--sm' style={{ marginBottom: 20 }}>
          <div className='icon-btn' style={{ color: 'var(--clay)' }}>{current.icon}</div>
          <span className='text-h3' style={{ fontWeight: 700 }}>{current.title}</span>
        </div>

        {current.key === 'diet' && (
          <div className='stack--sm'>
            <p className='text-xs text-sand mb-1'>What best describes your diet?</p>
            {DIET_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => applyDiet(opt.value)}
                className={`row--md text-left p-3 rounded-xl border transition-all ${diet === opt.value ? 'border-[var(--clay)]' : 'border-[var(--card-border)]'}`}
                style={diet === opt.value ? { background: 'rgba(196,113,74,0.08)' } : {}}>
                <div className={`toggle ${diet === opt.value ? 'toggle--on' : ''}`}><div className='toggle__knob' /></div>
                <div>
                  <p className='text-sm font-semibold' style={{ color: 'var(--cream)' }}>{opt.label}</p>
                  <p className='text-[11px] text-sand'>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {current.key === 'health' && (
          <div className='stack--md'>
            <p className='text-xs text-sand mb-1'>Any of these? (optional — helps personalize warnings)</p>
            {[
              { field: 'is_diabetic', label: 'Diabetes' },
              { field: 'has_bp', label: 'High Blood Pressure' },
            ].map((c) => (
              <label key={c.field} className='row--md' style={{ cursor: 'pointer' }}>
                <div className={`toggle ${form[c.field] ? 'toggle--on' : ''}`} onClick={() => toggleBool(c.field)}>
                  <div className='toggle__knob' />
                </div>
                <span className='text-sm'>{c.label}</span>
              </label>
            ))}
            <p className='text-[11px] text-sand mt-1'>You can skip this and add more later.</p>
          </div>
        )}

        {current.key === 'more' && (
          <div className='stack--md'>
            <p className='text-[11px] font-bold text-sand uppercase tracking-wide'>Optional — fine-tune anytime</p>
            <div className='input-group'>
              <label className='text-xs text-sand' style={{ marginBottom: 4 }}>Ethnicity / Region</label>
              <select className='input' value={(form.ethnicity as string) ?? ''} onChange={(e) => setForm({ ...form, ethnicity: e.target.value })}>
                <option value=''>Select (optional)</option>
                {ETHNICITY_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <p className='text-xs text-sand mb-2'>Allergies</p>
              <div className='flex flex-wrap gap-2'>
                {ALLERGY_OPTIONS.map((a) => (
                  <button key={a} onClick={() => toggleArrayField('allergies', a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      (form.allergies as string[])?.includes(a) ? 'bg-[var(--clay)] text-white border-[var(--clay)]' : 'border-[var(--card-border)] text-[var(--sand)] hover:border-[var(--clay)]'
                    }`}>{a}</button>
                ))}
              </div>
            </div>
            <div>
              <p className='text-xs text-sand mb-2'>Other conditions</p>
              <div className='stack--sm'>
                {OTHER_CONDITIONS.map((c) => (
                  <label key={c.field} className='row--md' style={{ cursor: 'pointer' }}>
                    <div className={`toggle ${form[c.field] ? 'toggle--on' : ''}`} onClick={() => toggleBool(c.field)}><div className='toggle__knob' /></div>
                    <span className='text-sm'>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className='text-xs text-sand mb-2'>Spice level</p>
              <div className='flex gap-2'>
                {SPICE_OPTIONS.map((s) => (
                  <button key={s} onClick={() => setForm({ ...form, spice_level: s.toLowerCase() })}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.spice_level === s.toLowerCase() ? 'bg-[var(--clay)] text-white border-[var(--clay)]' : 'border-[var(--card-border)] text-[var(--sand)] hover:border-[var(--clay)]'
                    }`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <p className='text-xs text-sand mb-2'>Cuisine preferences</p>
              <div className='flex flex-wrap gap-2'>
                {CUISINE_OPTIONS.map((c) => (
                  <button key={c} onClick={() => toggleArrayField('cuisine_preferences', c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      (form.cuisine_preferences as string[])?.includes(c) ? 'bg-[var(--clay)] text-white border-[var(--clay)]' : 'border-[var(--card-border)] text-[var(--sand)] hover:border-[var(--clay)]'
                    }`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='row--md' style={{ marginTop: 24 }}>
        {step > 0 && (
          <button className='btn btn--outline flex-1' onClick={prev}>Back</button>
        )}
        <button className='btn btn--primary flex-1' onClick={next}>
          {step < STEPS.length - 1 ? 'Continue' : 'Finish'} <ChevronRight size={16} />
        </button>
      </div>
    </PageShell>
  )
}
