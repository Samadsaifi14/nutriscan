"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: '🪑' },
  { value: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week', icon: '🚶' },
  { value: 'moderate', label: 'Moderately Active', desc: 'Exercise 3-5 days/week', icon: '🏃' },
  { value: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week', icon: '⚡' },
  { value: 'very_active', label: 'Extra Active', desc: 'Very hard exercise daily', icon: '🔥' },
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
    is_diabetic: false,
    has_bp: false,
    is_vegetarian: false,
  })

  // Load existing email preferences when session is ready
  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch('/api/profile')
        const json = await res.json()
        if (json.success && json.data) {
          setEmailPrefs({
            weekly_report_email: json.data.weekly_report_email ?? true,
            email_unsubscribed: json.data.email_unsubscribed ?? false,
          })
          // If profile already completed pre-fill the form
          if (json.data.profile_completed) {
            setForm(prev => ({
              ...prev,
              age: json.data.age?.toString() || '',
              gender: json.data.gender || '',
              weight_kg: json.data.weight_kg?.toString() || '',
              height_cm: json.data.height_cm?.toString() || '',
              activity_level: json.data.activity_level || 'moderate',
              is_diabetic: json.data.is_diabetic || false,
              has_bp: json.data.has_bp || false,
              is_vegetarian: json.data.is_vegetarian || false,
            }))
          }
        }
      } catch (e) {
        console.log('Failed to load profile:', e)
      }
    }
    if (session) loadPrefs()
  }, [session])

  function getBMIInfo(bmi: number) {
    if (bmi < 18.5) return {
      label: 'Underweight', color: '#3b82f6',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      advice: 'Focus on nutritious calorie-dense foods to reach a healthy weight.'
    }
    if (bmi < 25) return {
      label: 'Normal weight', color: '#059669',
      bg: 'bg-green-50 dark:bg-green-900/20',
      advice: 'Great work! Maintain your balanced diet and active lifestyle.'
    }
    if (bmi < 30) return {
      label: 'Overweight', color: '#d97706',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      advice: 'Consider reducing processed foods and increasing physical activity.'
    }
    return {
      label: 'Obese', color: '#dc2626',
      bg: 'bg-red-50 dark:bg-red-900/20',
      advice: 'Consult a healthcare provider for a personalised weight management plan.'
    }
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
          is_diabetic: form.is_diabetic,
          has_bp: form.has_bp,
          is_vegetarian: form.is_vegetarian,
        })
      })
      const json = await res.json()
      if (json.success) {
        setResult(json)
        setStep(3)
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

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-5">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand mb-4 shadow-lg shadow-emerald-500/25"
            style={{ background: 'linear-gradient(135deg, #059669, #0ea5e9)' }}>
            <span className="text-2xl">🥗</span>
          </div>
          <h1 className="text-2xl font-black mb-1"
            style={{
              background: 'linear-gradient(135deg, #059669, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            HealthOX
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {step === 3
              ? 'Your profile is ready!'
              : `Set up your health profile — Step ${step} of 2`}
          </p>
        </div>

        {/* Progress bar */}
        {step < 3 && (
          <div className="flex gap-2 mb-6">
            {[1, 2].map(s => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: step >= s
                    ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                    : 'var(--card-border)'
                }}
              />
            ))}
          </div>
        )}

        {/* ─── STEP 1 — Basic Info ─── */}
        {step === 1 && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)] animate-scale-in">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Basic Info</h2>
            <p className="text-xs text-[var(--muted)] mb-6">Used to calculate your BMI and calorie goal</p>

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
                    placeholder="170"
                    value={form.height_cm}
                    onChange={e => setForm({ ...form, height_cm: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-[var(--card-border)] focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="65"
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
              className="w-full mt-6 py-4 rounded-2xl text-white text-sm font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ─── STEP 2 — Activity & Health ─── */}
        {step === 2 && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)] animate-scale-in">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Activity & Health</h2>
            <p className="text-xs text-[var(--muted)] mb-6">Helps us set the right calorie target for you</p>

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
                      <p className="text-sm font-bold"
                        style={{ color: form.activity_level === opt.value ? '#059669' : 'var(--foreground)' }}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{opt.desc}</p>
                    </div>
                    {form.activity_level === opt.value && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                        style={{ background: '#059669' }}>
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
                Health Conditions <span className="text-[var(--muted)] font-normal">(optional)</span>
              </label>
              <div className="space-y-2">
                {[
                  { key: 'is_diabetic', label: '🩸 Diabetic', desc: 'Flag high sugar products' },
                  { key: 'has_bp', label: '💊 High Blood Pressure', desc: 'Flag high sodium products' },
                  { key: 'is_vegetarian', label: '🥦 Vegetarian', desc: 'Note non-veg ingredients' },
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
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all text-white"
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
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[var(--card-border)] text-[var(--muted)] text-sm font-bold transition-colors hover:border-[var(--muted)]"
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

        {/* ─── STEP 3 — Results ─── */}
        {step === 3 && result && (
          <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)] animate-scale-in">

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎯</div>
              <h2 className="text-xl font-black text-[var(--foreground)] mb-1">Your Health Profile</h2>
              <p className="text-xs text-[var(--muted)]">Personalised just for you</p>
            </div>

            {/* BMI Card */}
            {(() => {
              const info = getBMIInfo(result.bmi)
              return (
                <div className={`${info.bg} rounded-2xl p-5 mb-4 text-center`}>
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

            {/* Calorie goal */}
            <div
              className="rounded-2xl p-5 mb-6 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(14,165,233,0.05))',
                border: '1px solid rgba(5,150,105,0.2)'
              }}
            >
              <p className="text-xs text-[var(--muted)] mb-1">Your Daily Calorie Goal</p>
              <p className="text-5xl font-black mb-1"
                style={{
                  background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                {result.dailyCalorieGoal}
              </p>
              <p className="text-xs text-[var(--muted)]">kcal per day · personalised for your body</p>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 rounded-2xl text-white text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
              }}
            >
              Start Tracking with HealthOX →
            </button>
          </div>
        )}

        {/* ─── EMAIL PREFERENCES CARD ─── */}
        {/* Always visible — not tied to any step */}
        <div className="bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)] mt-4 animate-fade-in-up">

          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.12), rgba(14,165,233,0.08))' }}
            >
              📧
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">Email Preferences</h3>
              <p className="text-xs text-[var(--muted)]">Control which emails you receive</p>
            </div>
          </div>

          <div className="h-px bg-[var(--card-border)] my-5" />

          <div className="space-y-4">

            {/* Weekly reports toggle */}
            <div
              className="flex items-start gap-4 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                  ? 'rgba(5,150,105,0.3)'
                  : 'var(--card-border)',
                background: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                  ? 'linear-gradient(135deg, rgba(5,150,105,0.04), rgba(14,165,233,0.02))'
                  : 'transparent',
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">📊</span>
                  <p className="text-sm font-bold text-[var(--foreground)]">Weekly Nutrition Reports</p>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Every Monday morning you get a beautiful summary of your weekly calorie intake,
                  macros, and personalised nutrition insights delivered to your inbox.
                </p>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => {
                  if (emailPrefs.email_unsubscribed) {
                    toast.error('Re-subscribe from all emails first')
                    return
                  }
                  const newPrefs = {
                    ...emailPrefs,
                    weekly_report_email: !emailPrefs.weekly_report_email
                  }
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
                    left: emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                      ? '26px'
                      : '2px',
                  }}
                />
              </button>
            </div>

            {/* Unsubscribe all toggle */}
            <div
              className="flex items-start gap-4 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: emailPrefs.email_unsubscribed ? '#dc2626' : 'var(--card-border)',
                background: emailPrefs.email_unsubscribed
                  ? 'rgba(220,38,38,0.04)'
                  : 'transparent',
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">🚫</span>
                  <p className="text-sm font-bold text-[var(--foreground)]">Unsubscribe from All Emails</p>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Stop all HealthOX emails including weekly reports and account notifications.
                  You can re-enable anytime by toggling this off.
                </p>
              </div>

              {/* Toggle switch */}
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
                style={{
                  background: emailPrefs.email_unsubscribed ? '#dc2626' : '#e5e7eb',
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{
                    left: emailPrefs.email_unsubscribed ? '26px' : '2px',
                  }}
                />
              </button>
            </div>

            {/* Warning when unsubscribed */}
            {emailPrefs.email_unsubscribed && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <span className="text-base flex-shrink-0">⚠️</span>
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                  You are currently unsubscribed from all HealthOX emails.
                  Toggle off the option above to start receiving emails again.
                </p>
              </div>
            )}

            {/* Current status summary */}
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs font-bold text-[var(--foreground)] mb-2">Current Status</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted)]">Weekly nutrition reports</span>
                  <span className={`text-xs font-bold ${
                    emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500'
                  }`}>
                    {emailPrefs.weekly_report_email && !emailPrefs.email_unsubscribed ? '✓ On' : '✗ Off'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted)]">All emails</span>
                  <span className={`text-xs font-bold ${
                    !emailPrefs.email_unsubscribed
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500'
                  }`}>
                    {!emailPrefs.email_unsubscribed ? '✓ Subscribed' : '✗ Unsubscribed'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Go to dashboard button for returning users */}
        {step < 3 && (
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full mt-4 py-3 rounded-2xl text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors border border-[var(--card-border)] bg-[var(--card)]"
          >
            ← Back to Dashboard
          </button>
        )}

      </div>
    </div>
  )
}
