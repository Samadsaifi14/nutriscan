"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'

interface DayData {
  day: string
  calories: number
}

interface WeeklyChartProps {
  userId?: string
}

export function WeeklyChart({ userId }: WeeklyChartProps) {
  const { data: session } = useSession()
  const [days, setDays] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const effectiveUserId = userId || (session as any)?.userId

  useEffect(() => {
    if (effectiveUserId) {
      fetchWeeklyData()
    } else {
      setLoading(false)
    }
  }, [effectiveUserId])

  async function fetchWeeklyData() {
    setLoading(true)
    setError(null)
    try {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 6)

      const { data, error: queryError } = await supabase
        .from('food_logs')
        .select('calories, logged_at')
        .eq('user_id', effectiveUserId)
        .gte('logged_at', weekAgo.toISOString())

      if (queryError) {
        console.error('WeeklyChart error:', queryError)
        setError('Could not load weekly data')
        setLoading(false)
        return
      }

      const dayMap: Record<string, number> = {}
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        d.setHours(0, 0, 0, 0)
        const key = d.toLocaleDateString('en-CA')
        dayMap[key] = 0
      }

      data?.forEach(log => {
        const key = new Date(log.logged_at).toLocaleDateString('en-CA')
        if (dayMap[key] !== undefined) {
          dayMap[key] += log.calories || 0
        }
      })

      const result = Object.entries(dayMap).map(([date, calories]) => ({
        day: dayNames[new Date(date).getDay()],
        calories: Math.round(calories),
      }))

      setDays(result)
    } catch (e) {
      console.error('WeeklyChart fetch failed:', e)
      setError('Could not load weekly data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
          📊 This Week
        </h3>
        <div style={{ display: 'flex', gap: '8px', height: '120px', alignItems: 'flex-end' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
              <div style={{
                width: '100%',
                height: '30%',
                background: '#e5e7eb',
                borderRadius: '4px 4px 0 0',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>...</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
          📊 This Week
        </h3>
        <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '13px' }}>
          ⚠️ {error}
        </p>
        <button
          onClick={fetchWeeklyData}
          style={{
            display: 'block',
            margin: '8px auto 0',
            padding: '6px 16px',
            background: '#16a34a',
            color: 'white',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  const maxCal = Math.max(...days.map(d => d.calories), 2000)

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{
        fontSize: '15px',
        fontWeight: 600,
        color: '#111827',
        marginBottom: '16px',
      }}>
        📊 This Week
      </h3>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        height: '120px',
      }}>
        {days.map((d, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            height: '100%',
            justifyContent: 'flex-end',
          }}>
            <span style={{ fontSize: '10px', color: '#6b7280' }}>
              {d.calories > 0 ? d.calories : ''}
            </span>
            <div style={{
              width: '100%',
              height: `${Math.max((d.calories / maxCal) * 90, d.calories > 0 ? 4 : 0)}%`,
              background: d.calories > 2000 ? '#dc2626' : '#16a34a',
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.5s ease',
              minHeight: d.calories > 0 ? '4px' : '0',
            }} />
            <span style={{ fontSize: '11px', color: '#6b7280' }}>{d.day}</span>
          </div>
        ))}
      </div>

      {days.every(d => d.calories === 0) && (
        <p style={{
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '13px',
          marginTop: '8px',
        }}>
          No meals logged this week yet
        </p>
      )}
    </div>
  )
}