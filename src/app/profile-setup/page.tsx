"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: '🪑' },
  { value: 'light', label: 'Lightly Active', desc: 'Light exercise 1–3 days/week', icon: '🚶' },
  { value: 'moderate', label: 'Moderately Active', desc: 'Exercise 3–5 days/week', icon: '🏃' },
  { value: 'active', label: 'Very Active', desc: 'Hard exercise 6–7 days/week', icon: '⚡' },
  { value: 'very_active', label: 'Extra Active', desc: 'Very hard exercise daily', icon: '🔥' },
]

const weightGoalOptions = [
  {
    value: 'lose',
    label: 'Lose Weight',
    desc: 'Calorie deficit of 500 kcal/day · ~0.5 kg/week loss',
    icon: '📉',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.3)',
  },
  {
    value: 'maintain',
    label: 'Maintain Weight',
    desc: 'Stay at your current weight with balanced nutrition',
    icon: '⚖️',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    border: 'rgba(5,150,105,0.3)',
  },
  {
    value: 'gain',
    label: 'Gain Weight',
    desc: 'Calorie surplus of 300 kcal/day · lean muscle gain',
    icon: '📈',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
  },
]

export default function ProfileSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [emailPrefs, setEmailPrefs] = useState({
    weekly_report_email: true,
    email_unsubscribed: false,
  })

  const [form, setForm] = useState({
    age: '',
    gender: '',
    weight_kg: '',
    height_cm: '',
    activity_level: 'moderate',
    weight_goal: 'maintain',
    is_diabetic: false,
    has_bp: false,
    is_vegetarian: false,
  })

  // Load existing profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile')
        const json = await res.json()
        if (json.success && json.data) {
          const d = json.data
          setEmailPrefs({
            weekly_report_email: d.weekly_report_email ?? true,
            email_unsubscribed: d.email_unsubscribed ?? false,
          })
          if (d.profile_completed) {
            setForm(prev => ({
              ...prev,
              age: d.age?.toString() || '',
              gender: d.gender || '',
              weight_kg: d.weight_kg?.toString() || '',
              height_cm: d.height_cm?.toString() || '',
              activity_level: d.activity_level || 'moderate',
              weight_goal: d.weight_goal || 'maintain',
              is_diabetic: d.is_diabetic || false,
              has_bp: d.has_bp || false,
              is_vegetarian: d.is_vegetarian || false,
            }))
          }
        }
      } catch (e) {
        console.log('Failed to load profile:', e)
      }
    }
    if (session) loadProfile()
  }, [session])

  function getBMIInfo(bmi: number) {
    if (bmi < 18.5) return {
      label: 'Underweight', color: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
      advice: 'Focus on nutritious calorie-dense foods to reach a healthy weight.',
    }
    if (bmi < 25) return {
      label: 'Normal weight', color: '#059669',
      bg: 'rgba(5,150,105,0.08)',
      advice: 'Great work! Maintain your balanced diet and active lifestyle.',
    }
    if (bmi < 30) return {
      label: 'Overweight', color: '#d97706',
      bg: 'rgba(217,119,6,0.08)',
      advice: 'Consider reducing processed foods and increasing physical activity.',
    }
    return {
      label: 'Obese', color: '#dc2626',
      bg: 'rgba(220,38,38,0.08)',
      advice: 'Consult a healthcare provider for a personalised weight management plan.',
    }
  }

  function getGoalLabel(goal: string) {
    return weightGoalOptions.find(g => g.value === goal)?.label || 'Maintain Weight'
  }

  async function handleSubmit() {
    if (!form.age || !form.gender || !form.weight_kg || !form.height_cm) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(form.age),
          gender: form.gender,
          weight_kg: parseFloat(form.weight_kg),
          height_cm: parseFloat(form.height_cm),
          activity_level: form.activity_level,
          weight_goal: form.weight_goal,
          is_diabetic: form.is_diabetic,
          has_bp: form.has_bp,
          is_vegetarian: form.is_vegetarian,
        })
      })
      const json = await res.json()
      if (json.success) {
        setResult(json)
        setStep(4)
        toast.success('Profile saved!')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
    setLoading(false)
  }

  async function saveEmailPrefs(newPrefs: typeof emailPrefs) {
    setSavingPrefs(true)
    try {
      const res = await fetch('/api/profile/email-prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs)
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Email preferences saved')
      } else {
        toast.error('Failed to save preferences')
      }
    } catch {
      toast.error('Network error')
    }
    setSavingPrefs(false)
  }

  const gradientStyle = {
    background: 'linear-gradient(135deg, #059669, #0ea5e9)',
  }

  const textGradientStyle = {
    background: 'linear-gradient(135deg, #059669, #0ea5e9)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center p-5 py-10">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
            style={gradientStyle}
          >
            <span className="text-2xl">🥗</span>
          </div>
          <h1 className="text-2xl font-black mb-1" style={textGradientStyle}>HealthOX</h1>
          <p className="text-sm text-[var(--muted)]">
            {step === 4 ? 'Your profile is ready!' : `Step ${step} of 3`}
          </p>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: step >= s
                    ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                    : 'var(--card-border)'
                }}
              />
            ))}
          </div>
        )}

        {/* ═══ STEP 1 — Basic Info ═══ */}
        {step === 1 && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Basic Information</h2>
            <p className="text-xs text-[var(--muted)] mb-6">Used to calculate your BMI and personalised calorie goal</p>

            <div className="space-y-4">

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 22"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--card-border)] focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm outline-none transition-colors"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'male', label: '👨 Male' },
                    { value: 'female', label: '👩 Female' },
                  ].map(g => (
                    <button
                      key={g.value}
                      onClick={() => setForm({ ...form, gender: g.value })}
                      className="py-3.5 rounded-2xl border-2 text-sm font-bold transition-all"
                      style={{
                        borderColor: form.gender === g.value ? '#059669' : 'var(--card-border)',
                        background: form.gender === g.value
                          ? 'linear-gradient(135deg, rgba(5,150,105,0.1), rgba(14,165,233,0.05))'
                          : 'var(--card)',
                        color: form.gender === g.value ? '#059669' : 'var(--muted)',
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height + Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 170"
                    value={form.height_cm}
                    onChange={e => setForm({ ...form, height_cm: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--card-border)] focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 65"
                    value={form.weight_kg}
                    onChange={e => setForm({ ...form, weight_kg: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--card-border)] focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm outline-none transition-colors"
                  />
                </div>
              </div>

            </div>

            <button
              onClick={() => {
                if (!form.age || !form.gender || !form.weight_kg || !form.height_cm) {
                  toast.error('Please fill in all fields')
                  return
                }
                setStep(2)
              }}
              className="w-full mt-6 py-4 rounded-2xl text-white text-sm font-bold"
              style={{ ...gradientStyle, boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ═══ STEP 2 — Weight Goal ═══ */}
        {step === 2 && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Your Goal</h2>
            <p className="text-xs text-[var(--muted)] mb-6">
              This sets your calorie target — we will calculate the exact amount based on your body data
            </p>

            <div className="space-y-3 mb-6">
              {weightGoalOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, weight_goal: opt.value })}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all"
                  style={{
                    borderColor: form.weight_goal === opt.value ? opt.border : 'var(--card-border)',
                    background: form.weight_goal === opt.value ? opt.bg : 'transparent',
                  }}
                >
                  <span className="text-3xl flex-shrink-0">{opt.icon}</span>
                  <div className="flex-1">
                    <p
                      className="text-sm font-bold mb-1"
                      style={{ color: form.weight_goal === opt.value ? opt.color : 'var(--foreground)' }}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">{opt.desc}</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: form.weight_goal === opt.value ? opt.color : 'var(--card-border)',
                      background: form.weight_goal === opt.value ? opt.color : 'transparent',
                    }}
                  >
                    {form.weight_goal === opt.value && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Preview of what this means */}
            <div
              className="p-3 rounded-xl mb-6 text-xs text-[var(--muted)] leading-relaxed"
              style={{ background: 'var(--card-border)', opacity: 0.8 }}
            >
              {form.weight_goal === 'lose' && '📉 We will set your calorie goal 500 kcal below your maintenance level, which leads to safe and steady weight loss of about 0.5 kg per week.'}
              {form.weight_goal === 'maintain' && '⚖️ We will match your calorie goal exactly to your energy needs so your weight stays stable while you stay nourished.'}
              {form.weight_goal === 'gain' && '📈 We will set your calorie goal 300 kcal above your maintenance level, which supports lean muscle gain without excessive fat.'}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[var(--card-border)] text-[var(--muted)] text-sm font-bold"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl text-white text-sm font-bold"
                style={{ ...gradientStyle, boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3 — Activity & Health ═══ */}
        {step === 3 && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Activity & Health</h2>
            <p className="text-xs text-[var(--muted)] mb-6">Helps us fine-tune your calorie target</p>

            {/* Activity level */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-[var(--foreground)] mb-3">Activity Level</label>
              <div className="space-y-2">
                {activityOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, activity_level: opt.value })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all"
                    style={{
                      borderColor: form.activity_level === opt.value ? '#059669' : 'var(--card-border)',
                      background: form.activity_level === opt.value
                        ? 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(14,165,233,0.04))'
                        : 'transparent',
                    }}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p
                        className="text-sm font-bold"
                        style={{ color: form.activity_level === opt.value ? '#059669' : 'var(--foreground)' }}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{opt.desc}</p>
                    </div>
                    {form.activity_level === opt.value && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                        style={{ background: '#059669' }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Health conditions */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[var(--foreground)] mb-3">
                Health Conditions{' '}
                <span className="text-[var(--muted)] font-normal">(optional)</span>
              </label>
              <div className="space-y-2">
                {[
                  { key: 'is_diabetic', label: '🩸 Diabetic', desc: 'We will flag high sugar products' },
                  { key: 'has_bp', label: '💊 High Blood Pressure', desc: 'We will flag high sodium products' },
                  { key: 'is_vegetarian', label: '🥦 Vegetarian', desc: 'We will note non-veg ingredients' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setForm({ ...form, [item.key]: !form[item.key as keyof typeof form] })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: form[item.key as keyof typeof form] ? '#059669' : 'var(--card-border)',
                      background: form[item.key as keyof typeof form] ? 'rgba(5,150,105,0.05)' : 'transparent',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 text-white transition-all"
                      style={{
                        borderColor: form[item.key as keyof typeof form] ? '#059669' : 'var(--card-border)',
                        background: form[item.key as keyof typeof form] ? '#059669' : 'transparent',
                        fontSize: '11px',
                      }}
                    >
                      {form[item.key as keyof typeof form] ? '✓' : ''}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{item.label}</p>
                      <p className="text-xs text-[var(--muted)]">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[var(--card-border)] text-[var(--muted)] text-sm font-bold"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl text-white text-sm font-bold transition-all"
                style={{
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #059669, #0ea5e9)',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(5,150,105,0.3)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Calculating...' : 'Get My Goals →'}
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4 — Results ═══ */}
        {step === 4 && result && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)]">

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎯</div>
              <h2 className="text-xl font-black text-[var(--foreground)] mb-1">Your Personal Goals</h2>
              <p className="text-xs text-[var(--muted)]">Calculated just for your body and goal</p>
            </div>

            {/* BMI */}
            {(() => {
              const info = getBMIInfo(result.bmi)
              return (
                <div
                  className="rounded-2xl p-5 mb-4 text-center"
                  style={{ background: info.bg, border: `1px solid ${info.bg}` }}
                >
                  <p className="text-xs text-[var(--muted)] mb-1">Your BMI</p>
                  <p className="text-5xl font-black mb-2" style={{ color: info.color }}>
                    {result.bmi}
                  </p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                    style={{ background: info.color }}
                  >
                    {info.label}
                  </span>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{info.advice}</p>
                </div>
              )
            })()}

            {/* Calorie breakdown */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(14,165,233,0.04))',
                border: '1px solid rgba(5,150,105,0.2)',
              }}
            >
              <p className="text-xs text-[var(--muted)] text-center mb-3">Daily Calorie Goal</p>
              <p className="text-5xl font-black text-center mb-1" style={textGradientStyle}>
                {result.dailyCalorieGoal}
              </p>
              <p className="text-xs text-[var(--muted)] text-center mb-4">kcal per day</p>

              {/* Breakdown */}
              <div className="space-y-2 border-t border-[var(--card-border)] pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">Base Metabolic Rate</span>
                  <span className="text-xs font-bold text-[var(--foreground)]">{result.bmr} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">With Activity Level</span>
                  <span className="text-xs font-bold text-[var(--foreground)]">{result.tdee} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">Goal Adjustment</span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: result.weight_goal === 'lose'
                        ? '#3b82f6'
                        : result.weight_goal === 'gain'
                        ? '#f59e0b'
                        : '#059669'
                    }}
                  >
                    {result.weight_goal === 'lose' ? '− 500 kcal (deficit)' : result.weight_goal === 'gain' ? '+ 300 kcal (surplus)' : 'No change'}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center pt-2 border-t border-[var(--card-border)]"
                >
                  <span className="text-xs font-bold text-[var(--foreground)]">Your Daily Target</span>
                  <span className="text-sm font-black" style={{ color: '#059669' }}>
                    {result.dailyCalorieGoal} kcal
                  </span>
                </div>
              </div>
            </div>

            {/* Goal badge */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-6"
              style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}
            >
              <span className="text-xl">
                {result.weight_goal === 'lose' ? '📉' : result.weight_goal === 'gain' ? '📈' : '⚖️'}
              </span>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">Goal: {getGoalLabel(result.weight_goal)}</p>
                <p className="text-xs text-[var(--muted)]">
                  {result.weight_goal === 'lose'
                    ? 'Expected loss: ~0.5 kg per week at this calorie level'
                    : result.weight_goal === 'gain'
                    ? 'Expected gain: ~0.3 kg per week at this calorie level'
                    : 'Calorie matched to maintain your current weight'}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 rounded-2xl text-white text-sm font-bold"
              style={{ ...gradientStyle, boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}
            >
              Start Tracking with HealthOX →
            </button>
          </div>
        )}

        {/* ═══ EMAIL PREFERENCES ═══ */}
        <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)] mt-4">

          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(5,150,105,0.1)' }}
            >
              📧
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">Email Preferences</h3>
              <p className="text-xs text-[var(--muted)]">Control which emails you receive</p>
            </div>
          </div>

          <div className="h-px bg-[var(--card-border)] mb-5" />

          <div className="space-y-4">

            {/* Weekly reports */}
            <div
              className="flex items-start gap-4 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                  ? 'rgba(5,150,105,0.3)'
                  : 'var(--card-border)',
                background: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                  ? 'rgba(5,150,105,0.04)'
                  : 'transparent',
              }}
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--foreground)] mb-1">📊 Weekly Nutrition Reports</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Every Monday morning — your weekly calorie summary, macros, and insights delivered to your inbox
                </p>
              </div>
              <button
                onClick={() => {
                  if (emailPrefs.email_unsubscribed) {
                    toast.error('Re-subscribe from all emails first')
                    return
                  }
                  const newPrefs = { ...emailPrefs, weekly_report_email: !emailPrefs.weekly_report_email }
                  setEmailPrefs(newPrefs)
                  saveEmailPrefs(newPrefs)
                }}
                disabled={savingPrefs || emailPrefs.email_unsubscribed}
                className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 disabled:opacity-50"
                style={{
                  background: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                    ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                    : '#e5e7eb',
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{
                    left: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed ? '26px' : '2px',
                  }}
                />
              </button>
            </div>

            {/* Unsubscribe all */}
            <div
              className="flex items-start gap-4 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: emailPrefs.email_unsubscribed ? '#dc2626' : 'var(--card-border)',
                background: emailPrefs.email_unsubscribed ? 'rgba(220,38,38,0.04)' : 'transparent',
              }}
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--foreground)] mb-1">🚫 Unsubscribe from All Emails</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Stop all HealthOX emails. You can re-enable anytime by toggling this off.
                </p>
              </div>
              <button
                onClick={() => {
                  const newPrefs = {
                    email_unsubscribed: !emailPrefs.email_unsubscribed,
                    weekly_report_email: emailPrefs.email_unsubscribed ? true : false,
                  }
                  setEmailPrefs(newPrefs)
                  saveEmailPrefs(newPrefs)
                }}
                disabled={savingPrefs}
                className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 disabled:opacity-50"
                style={{ background: emailPrefs.email_unsubscribed ? '#dc2626' : '#e5e7eb' }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{ left: emailPrefs.email_unsubscribed ? '26px' : '2px' }}
                />
              </button>
            </div>

            {/* Warning */}
            {emailPrefs.email_unsubscribed && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <span className="flex-shrink-0">⚠️</span>
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                  You are unsubscribed from all HealthOX emails. Toggle off above to re-enable.
                </p>
              </div>
            )}

            {/* Status */}
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs font-bold text-[var(--foreground)] mb-2">Current Status</p>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted)]">Weekly reports</span>
                  <span className={`text-xs font-bold ${emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed ? 'text-emerald-600' : 'text-red-500'}`}>
                    {emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed ? '✓ On' : '✗ Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted)]">All emails</span>
                  <span className={`text-xs font-bold ${!emailPrefs.email_unsubscribed ? 'text-emerald-600' : 'text-red-500'}`}>
                    {!emailPrefs.email_unsubscribed ? '✓ Subscribed' : '✗ Unsubscribed'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col gap-3 mt-4">
          {step < 4 && (
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 rounded-2xl text-xs text-[var(--muted)] border border-[var(--card-border)] bg-[var(--card)] hover:text-[var(--foreground)] transition-colors"
            >
              ← Back to Dashboard
            </button>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="w-full py-3 rounded-2xl text-xs font-bold border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            🚪 Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}