"use client"
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import PageShell from '@/components/PageShell'

interface ProfileData {
  name: string
  email: string
  age: number
  gender: string
  weight_kg: number
  height_cm: number
  activity_level: string
  weight_goal: string
  daily_calorie_goal: number
  bmi: number
  bmr: number
  tdee: number
  is_diabetic: boolean
  has_bp: boolean
  has_heart_disease: boolean
  has_cholesterol: boolean
  is_vegetarian: boolean
  is_vegan: boolean
  is_jain: boolean
  allergies: string[]
  goals: string[]
  diet: string[]
  condition: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile')
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data as ProfileData
    },
    enabled: status === 'authenticated',
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  if (status === 'loading' || isLoading) {
    return (
      <PageShell variant="default" title="Profile">
        <div style={{ padding: 16 }}><div style={{ height: 200 }} /></div>
      </PageShell>
    )
  }

  if (status === 'unauthenticated') return null

  const p = data

  const statCards = [
    { label: 'BMI', value: p?.bmi?.toFixed(1) ?? '—', color: 'var(--clay)' },
    { label: 'BMR', value: p?.bmr ? `${p.bmr} kcal` : '—', color: 'var(--moss)' },
    { label: 'TDEE', value: p?.tdee ? `${p.tdee} kcal` : '—', color: 'var(--amber)' },
    { label: 'Daily Goal', value: p?.daily_calorie_goal ? `${p.daily_calorie_goal} kcal` : '—', color: 'var(--rust)' },
  ]

  const dietTags: string[] = []
  if (p?.is_vegetarian) dietTags.push('Vegetarian')
  if (p?.is_vegan) dietTags.push('Vegan')
  if (p?.is_jain) dietTags.push('Jain')
  if (p?.diet) dietTags.push(...p.diet.filter(d => !['Vegetarian', 'Vegan', 'Jain'].includes(d)))

  const conditions: string[] = []
  if (p?.is_diabetic) conditions.push('Diabetes')
  if (p?.has_bp) conditions.push('Hypertension')
  if (p?.has_heart_disease) conditions.push('Heart Disease')
  if (p?.has_cholesterol) conditions.push('High Cholesterol')
  if (p?.condition && p.condition !== 'None') conditions.push(p.condition)

  return (
    <PageShell variant="default" title="Profile">
      {/* ── Header ── */}
      <div style={{
        margin: '0 12px', marginTop: 8, marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--clay), var(--clay-dim))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, color: 'white',
          flexShrink: 0,
        }}>
          {(p?.name || 'U')[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.03em' }}>
            {p?.name || 'User'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
            {p?.email || ''}
          </div>
        </div>
      </div>

      {/* ── Stat Grid ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        margin: '0 12px', marginBottom: 16,
      }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: 'var(--surface-2)', borderRadius: 12,
            border: '0.5px solid var(--border-2)',
            padding: '12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Body Stats ── */}
      <div style={{
        background: 'var(--surface-2)', borderRadius: 14,
        border: '0.5px solid var(--border-2)', padding: 14,
        margin: '0 12px', marginBottom: 10,
      }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>
          BODY STATS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Age', value: p?.age ?? '—', unit: 'years' },
            { label: 'Gender', value: p?.gender ? (p.gender.charAt(0).toUpperCase() + p.gender.slice(1)) : '—', unit: '' },
            { label: 'Weight', value: p?.weight_kg ?? '—', unit: 'kg' },
            { label: 'Height', value: p?.height_cm ?? '—', unit: 'cm' },
            { label: 'Activity', value: p?.activity_level ? p.activity_level.replace('_', ' ') : '—', unit: '' },
            { label: 'Goal', value: p?.weight_goal ? p.weight_goal.charAt(0).toUpperCase() + p.weight_goal.slice(1) : '—', unit: '' },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 13,
            }}>
              <span style={{ color: 'var(--muted)' }}>{r.label}</span>
              <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                {r.value} {r.unit && <span style={{ color: 'var(--muted-2)', fontWeight: 400 }}>{r.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Diet ── */}
      {dietTags.length > 0 && (
        <div style={{
          background: 'var(--surface-2)', borderRadius: 14,
          border: '0.5px solid var(--border-2)', padding: 14,
          margin: '0 12px', marginBottom: 10,
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
            DIET PREFERENCES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dietTags.map(t => (
              <span key={t} style={{
                padding: '4px 10px', borderRadius: 20,
                background: 'rgba(108,140,78,0.12)', color: 'var(--moss)',
                fontSize: 12, fontWeight: 600,
                border: '0.5px solid rgba(108,140,78,0.2)',
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Conditions ── */}
      {conditions.length > 0 && (
        <div style={{
          background: 'var(--surface-2)', borderRadius: 14,
          border: '0.5px solid var(--border-2)', padding: 14,
          margin: '0 12px', marginBottom: 10,
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
            HEALTH CONDITIONS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {conditions.map(c => (
              <span key={c} style={{
                padding: '4px 10px', borderRadius: 20,
                background: 'rgba(190,66,48,0.10)', color: 'var(--risk-red)',
                fontSize: 12, fontWeight: 600,
                border: '0.5px solid rgba(190,66,48,0.18)',
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Allergies ── */}
      {p?.allergies && p.allergies.length > 0 && (
        <div style={{
          background: 'var(--surface-2)', borderRadius: 14,
          border: '0.5px solid var(--border-2)', padding: 14,
          margin: '0 12px', marginBottom: 10,
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
            ALLERGIES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {p.allergies.map(a => (
              <span key={a} style={{
                padding: '4px 10px', borderRadius: 20,
                background: 'rgba(190,66,48,0.10)', color: 'var(--risk-red)',
                fontSize: 12, fontWeight: 600,
                border: '0.5px solid rgba(190,66,48,0.18)',
              }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom Spacer ── */}
      <div style={{ height: 24 }} />
    </PageShell>
  )
}
