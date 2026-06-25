"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import PageShell from '@/components/PageShell'

const STEPS = [
  {
    title: 'Basic info',
    sub: 'Personalise your experience',
    fields: ['Name', 'Age', 'Gender', 'Height (cm)', 'Weight (kg)'],
  },
  {
    title: 'Health goals',
    sub: 'Select all that apply.',
    opts: ['Lose weight', 'Build muscle', 'Eat cleaner', 'Manage diabetes', 'Reduce sodium', 'Heart health'],
  },
  {
    title: 'Diet preferences',
    sub: "We'll filter accordingly.",
    opts: ['Vegetarian', 'Vegan', 'Jain', 'Keto', 'Gluten-free', 'Dairy-free'],
  },
  {
    title: 'Health conditions',
    sub: "We'll flag risky ingredients.",
    opts: ['None', 'Diabetes (T2)', 'Hypertension', 'High cholesterol', 'Lactose intolerance', 'Celiac disease'],
  },
] as const

export default function ProfileSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    goals: ['Lose weight'] as string[],
    diet: ['Vegetarian'] as string[],
    condition: 'None',
  })

  const s = STEPS[step - 1]

  const toggleMulti = (field: 'goals' | 'diet', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile')
        const json = await res.json()
        if (json.success && json.data) {
          const d = json.data
          if (d.profile_completed) {
            setForm(prev => ({
              ...prev,
              name: d.name || '',
              age: d.age?.toString() || '',
              gender: d.gender || '',
              weight_kg: d.weight_kg?.toString() || '',
              height_cm: d.height_cm?.toString() || '',
            }))
          }
        }
      } catch {}
    }
    if (session) loadProfile()
  }, [session])

  async function handleSubmit() {
    if (step < 4) { setStep(v => v + 1); return }

    if (!form.name || !form.age || !form.gender || !form.weight_kg || !form.height_cm) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const firstGoal = form.goals[0] || ''
      const weightGoalMap: Record<string, string> = {
        'Lose weight': 'lose',
        'Build muscle': 'gain',
        'Eat cleaner': 'maintain',
        'Manage diabetes': 'maintain',
        'Reduce sodium': 'maintain',
        'Heart health': 'maintain',
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          age: parseInt(form.age),
          gender: form.gender,
          weight_kg: parseFloat(form.weight_kg),
          height_cm: parseFloat(form.height_cm),
          weight_goal: weightGoalMap[firstGoal] || 'maintain',
          goals: form.goals,
          diet: form.diet,
          condition: form.condition,
          is_diabetic: form.condition === 'Diabetes (T2)',
          has_bp: form.condition === 'Hypertension',
          has_heart_disease: form.condition === 'High cholesterol',
          has_cholesterol: form.condition === 'High cholesterol',
          is_vegetarian: form.diet.includes('Vegetarian'),
          is_vegan: form.diet.includes('Vegan'),
          is_jain: form.diet.includes('Jain'),
          allergies: [],
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Profile saved!')
        router.push('/dashboard')
      } else {
        toast.error('Something went wrong.')
      }
    } catch {
      toast.error('Network error.')
    }
    setLoading(false)
  }

  return (
    <PageShell variant="default" title="Set up profile" showBack={false}>
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={() => step > 1 ? setStep(v => v - 1) : router.back()}
          className="text-sm text-[var(--sand)] w-8 text-left"
        >
          {step > 1 ? '←' : ''}
        </button>
        <span className="text-xs text-[var(--sand)]">Step {step}/4</span>
      </div>

      {/* Progress bar */}
      <div className="px-3 pt-3 pb-0">
        <div className="h-[3px] rounded-full bg-[var(--surface-3)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--clay)] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-[var(--muted)] mt-1 block">
          Step {step} of 4
        </span>
      </div>

      {/* Content */}
      <div className="px-3 pt-4 pb-6">

        {/* Step title */}
        <h2 className="text-sm font-bold text-[var(--foreground)] mb-1">{s.title}</h2>
        <p className="text-[11px] text-[var(--muted)] mb-4 leading-relaxed">{s.sub}</p>

        {/* Step 1 — fields */}
        {step === 1 && (
          <div className="space-y-3 mb-4">
            {STEPS[0].fields.map(f => (
              <div key={f}>
                <label className="block text-[11px] text-[var(--muted)] mb-1">{f}</label>
                {f === 'Gender' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['Male', 'Female'].map(g => (
                      <button
                        key={g}
                        onClick={() => setForm({ ...form, gender: g.toLowerCase() })}
                        className={`h-8 rounded-lg border text-xs font-bold transition-colors ${
                          form.gender === g.toLowerCase()
                            ? 'bg-[var(--clay)]/10 border-[var(--clay)] text-[var(--clay)]'
                            : 'bg-[var(--surface-2)] border-[var(--border-2)] text-[var(--muted)]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                ) : f === 'Name' ? (
                  <input
                    type="text"
                    placeholder="e.g. Rajesh"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full h-8 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border-2)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--clay)] placeholder:text-[var(--muted-2)]"
                  />
                ) : (
                  <input
                    type="number"
                    placeholder={f === 'Age' ? 'e.g. 28' : f === 'Height (cm)' ? 'e.g. 170' : 'e.g. 65'}
                    value={form[f === 'Age' ? 'age' : f === 'Height (cm)' ? 'height_cm' : 'weight_kg']}
                    onChange={e => setForm({
                      ...form,
                      [f === 'Age' ? 'age' : f === 'Height (cm)' ? 'height_cm' : 'weight_kg']: e.target.value,
                    })}
                    className="w-full h-8 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border-2)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--clay)] placeholder:text-[var(--muted-2)]"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Steps 2-4 — options */}
        {step === 2 && (
          <div className="space-y-2 mb-4">
            {STEPS[1].opts.map(o => {
              const selected = form.goals.includes(o)
              return (
                <button key={o} onClick={() => toggleMulti('goals', o)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    selected ? 'border-[var(--clay)] bg-[var(--clay)]/5' : 'border-[var(--border-2)] bg-[var(--surface-2)]'
                  }`}>
                  <div className={`w-[14px] h-[14px] flex-shrink-0 flex items-center justify-center transition-colors rounded ${
                    selected ? 'bg-[var(--clay)] border-[var(--clay)] text-white' : 'border-2 border-[var(--border-2)]'
                  }`}>
                    {selected && <span className="text-[9px]">✓</span>}
                  </div>
                  <span className={`text-xs font-bold ${selected ? 'text-[var(--clay)]' : 'text-[var(--foreground)]'}`}>{o}</span>
                </button>
              )
            })}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 mb-4">
            {STEPS[2].opts.map(o => {
              const selected = form.diet.includes(o)
              return (
                <button key={o} onClick={() => toggleMulti('diet', o)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    selected ? 'border-[var(--clay)] bg-[var(--clay)]/5' : 'border-[var(--border-2)] bg-[var(--surface-2)]'
                  }`}>
                  <div className={`w-[14px] h-[14px] flex-shrink-0 flex items-center justify-center transition-colors rounded ${
                    selected ? 'bg-[var(--clay)] border-[var(--clay)] text-white' : 'border-2 border-[var(--border-2)]'
                  }`}>
                    {selected && <span className="text-[9px]">✓</span>}
                  </div>
                  <span className={`text-xs font-bold ${selected ? 'text-[var(--clay)]' : 'text-[var(--foreground)]'}`}>{o}</span>
                </button>
              )
            })}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2 mb-4">
            {STEPS[3].opts.map(o => {
              const selected = form.condition === o
              return (
                <button key={o} onClick={() => setForm({ ...form, condition: o })}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    selected ? 'border-[var(--clay)] bg-[var(--clay)]/5' : 'border-[var(--border-2)] bg-[var(--surface-2)]'
                  }`}>
                  <div className={`w-[14px] h-[14px] flex-shrink-0 flex items-center justify-center transition-colors rounded-full ${
                    selected ? 'bg-[var(--clay)] border-[var(--clay)] text-white' : 'border-2 border-[var(--border-2)]'
                  }`}>
                    {selected && <span className="text-[9px]">✓</span>}
                  </div>
                  <span className={`text-xs font-bold ${selected ? 'text-[var(--clay)]' : 'text-[var(--foreground)]'}`}>{o}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading || (step === 4 && loading)}
          className="w-full h-9 rounded-lg bg-[var(--clay)] text-white text-xs font-bold disabled:opacity-50"
        >
          {step < 4 ? 'Continue →' : '✓ Finish Setup'}
        </button>

      </div>
    </PageShell>
  )
}
