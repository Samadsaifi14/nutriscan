"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise, desk job' },
  { value: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { value: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 'very_active', label: 'Extra Active', desc: 'Very hard exercise, physical job' },
]

export default function ProfileSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

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

  function getBMICategory(bmi: number) {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' }
    if (bmi < 25) return { label: 'Normal weight', color: '#16a34a' }
    if (bmi < 30) return { label: 'Overweight', color: '#d97706' }
    return { label: 'Obese', color: '#dc2626' }
  }

  async function handleSubmit() {
    if (!form.age || !form.gender || !form.weight_kg || !form.height_cm) {
      alert('Please fill in all fields')
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
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      fontFamily: 'sans-serif',
      padding: '24px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🥗</div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
            Welcome to NutriScan
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Hello {session?.user?.name?.split(' ')[0]}! Let us personalise your experience.
          </p>
        </div>

        {/* Progress */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '8px', marginBottom: '24px', justifyContent: 'center'
        }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: step >= s ? '#16a34a' : '#e5e7eb',
                color: step >= s ? 'white' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700,
                transition: 'all 0.3s'
              }}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div style={{
                  width: '40px', height: '2px',
                  background: step > s ? '#16a34a' : '#e5e7eb',
                  transition: 'all 0.3s'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Basic Info */}
        {step === 1 && (
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: '#111827' }}>
              Basic Information
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
              This helps us calculate your BMI and personalise your calorie goal.
            </p>

            {/* Age */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Age (years)
              </label>
              <input
                type="number"
                placeholder="e.g. 22"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                style={{
                  width: '100%', padding: '12px',
                  border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Gender */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Gender
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['male', 'female'].map(g => (
                  <button
                    key={g}
                    onClick={() => setForm({ ...form, gender: g })}
                    style={{
                      flex: 1, padding: '12px',
                      background: form.gender === g ? '#f0fdf4' : 'white',
                      border: `2px solid ${form.gender === g ? '#16a34a' : '#e5e7eb'}`,
                      borderRadius: '10px', fontSize: '14px',
                      fontWeight: form.gender === g ? 600 : 400,
                      color: form.gender === g ? '#16a34a' : '#6b7280',
                      cursor: 'pointer', textTransform: 'capitalize'
                    }}
                  >
                    {g === 'male' ? '👨 Male' : '👩 Female'}
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Height (cm)
              </label>
              <input
                type="number"
                placeholder="e.g. 170"
                value={form.height_cm}
                onChange={e => setForm({ ...form, height_cm: e.target.value })}
                style={{
                  width: '100%', padding: '12px',
                  border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Weight */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                placeholder="e.g. 65"
                value={form.weight_kg}
                onChange={e => setForm({ ...form, weight_kg: e.target.value })}
                style={{
                  width: '100%', padding: '12px',
                  border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              onClick={() => {
                if (!form.age || !form.gender || !form.weight_kg || !form.height_cm) {
                  alert('Please fill in all fields')
                  return
                }
                setStep(2)
              }}
              style={{
                width: '100%', padding: '14px',
                background: '#16a34a', color: 'white',
                border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2 — Activity + Health */}
        {step === 2 && (
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: '#111827' }}>
              Activity & Health
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
              This helps us set the right calorie target for you.
            </p>

            {/* Activity Level */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>
                Activity Level
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activityOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, activity_level: opt.value })}
                    style={{
                      padding: '12px 14px', textAlign: 'left',
                      background: form.activity_level === opt.value ? '#f0fdf4' : 'white',
                      border: `2px solid ${form.activity_level === opt.value ? '#16a34a' : '#e5e7eb'}`,
                      borderRadius: '10px', cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      fontSize: '14px', fontWeight: 600,
                      color: form.activity_level === opt.value ? '#16a34a' : '#111827'
                    }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Health Conditions */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>
                Health Conditions (optional)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { key: 'is_diabetic', label: '🩸 Diabetic', desc: 'We will flag high sugar products' },
                  { key: 'has_bp', label: '💊 High Blood Pressure', desc: 'We will flag high sodium products' },
                  { key: 'is_vegetarian', label: '🥦 Vegetarian', desc: 'We will note non-veg ingredients' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setForm({ ...form, [item.key]: !form[item.key as keyof typeof form] })}
                    style={{
                      padding: '12px 14px', textAlign: 'left',
                      background: form[item.key as keyof typeof form] ? '#f0fdf4' : 'white',
                      border: `2px solid ${form[item.key as keyof typeof form] ? '#16a34a' : '#e5e7eb'}`,
                      borderRadius: '10px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '6px',
                      background: form[item.key as keyof typeof form] ? '#16a34a' : '#e5e7eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', color: 'white', flexShrink: 0
                    }}>
                      {form[item.key as keyof typeof form] ? '✓' : ''}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1, padding: '14px',
                  background: '#f3f4f6', color: '#374151',
                  border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 2, padding: '14px',
                  background: loading ? '#9ca3af' : '#16a34a',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Calculating...' : 'Calculate My Goals →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Results */}
        {step === 3 && result && (
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎯</div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                Your Personal Goals
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>
                Based on your profile, here are your targets
              </p>
            </div>

            {/* BMI Card */}
            <div style={{
              padding: '20px', borderRadius: '14px', marginBottom: '14px',
              background: getBMICategory(result.bmi).color + '15',
              border: `2px solid ${getBMICategory(result.bmi).color}30`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Your BMI</div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: getBMICategory(result.bmi).color }}>
                {result.bmi}
              </div>
              <div style={{
                display: 'inline-block', padding: '4px 12px',
                background: getBMICategory(result.bmi).color,
                color: 'white', borderRadius: '20px',
                fontSize: '13px', fontWeight: 600, marginTop: '4px'
              }}>
                {getBMICategory(result.bmi).label}
              </div>
            </div>

            {/* Calorie Goal Card */}
            <div style={{
              padding: '20px', borderRadius: '14px', marginBottom: '14px',
              background: '#f0fdf4', border: '2px solid #bbf7d0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Daily Calorie Goal
              </div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#16a34a' }}>
                {result.dailyCalorieGoal}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>kcal per day</div>
            </div>

            {/* BMI Scale */}
            <div style={{ marginBottom: '20px', padding: '14px', background: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                BMI Scale
              </div>
              <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '10px', marginBottom: '6px' }}>
                <div style={{ flex: 1, background: '#3b82f6' }} />
                <div style={{ flex: 1.3, background: '#16a34a' }} />
                <div style={{ flex: 1, background: '#d97706' }} />
                <div style={{ flex: 1, background: '#dc2626' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af' }}>
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                Under 18.5 · 18.5–24.9 · 25–29.9 · 30+
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              style={{
                width: '100%', padding: '16px',
                background: '#16a34a', color: 'white',
                border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Go to My Dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}