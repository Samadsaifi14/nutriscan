"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
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

  function getBMIInfo(bmi: number) {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20', advice: 'Focus on nutritious calorie-dense foods to reach a healthy weight.' }
    if (bmi < 25) return { label: 'Normal weight', color: '#059669', bg: 'bg-green-50 dark:bg-green-900/20', advice: 'Great work! Maintain your balanced diet and active lifestyle.' }
    if (bmi < 30) return { label: 'Overweight', color: '#d97706', bg: 'bg-amber-50 dark:bg-amber-900/20', advice: 'Consider reducing processed foods and increasing physical activity.' }
    return { label: 'Obese', color: '#dc2626', bg: 'bg-red-50 dark:bg-red-900/20', advice: 'Consult a healthcare provider for a personalised weight management plan.' }
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
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-5">

      <div className="relative w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand mb-4">
            <span className="text-2xl">🥗</span>
          </div>
          <h1 className="text-2xl font-black text-gradient mb-1">NutriScan</h1>
          <p className="text-sm text-[var(--muted)]">
            {step === 3 ? 'Your profile is ready!' : `Step ${step} of 2`}
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-[var(--card)] p-6 rounded-2xl">
            <input placeholder="Age" type="number"
              value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })}
            />

            <input placeholder="Height (cm)" type="number"
              value={form.height_cm}
              onChange={e => setForm({ ...form, height_cm: e.target.value })}
            />

            <input placeholder="Weight (kg)" type="number"
              value={form.weight_kg}
              onChange={e => setForm({ ...form, weight_kg: e.target.value })}
            />

            <button onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <button onClick={handleSubmit}>
              {loading ? 'Loading...' : 'Calculate'}
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && result && (
          <div className="bg-[var(--card)] p-6 rounded-2xl text-center">

            <h2>Your BMI: {result.bmi}</h2>
            <h3>Calories: {result.dailyCalorieGoal}</h3>

            {/* USER INFO */}
            <p className="text-xs text-[var(--muted)] mb-2">
              Logged in as {session?.user?.email}
            </p>

            {/* DASHBOARD BUTTON */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 mt-3 bg-green-600 text-white rounded-xl"
            >
              Go to Dashboard
            </button>

            {/* SIGN OUT BUTTON */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to sign out?')) {
                  signOut({ callbackUrl: '/auth/signin' })
                }
              }}
              className="w-full mt-3 py-3 rounded-xl border border-red-400 text-red-500"
            >
              🚪 Sign Out
            </button>

          </div>
        )}

      </div>
    </div>
  )
}