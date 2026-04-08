"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'

interface DayData {
  day: string
  calories: number
}

export function WeeklyChart() {
  const { data: session } = useSession()
  const [days, setDays] = useState<DayData[]>([])

  useEffect(() => {
    if (session?.userId) fetchWeeklyData()
  }, [session])

  async function fetchWeeklyData() {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 6)

    const { data } = await supabase
      .from('food_logs')
      .select('calories, logged_at')
      .eq('user_id', (session as any)?.userId)
      .gte('logged_at', weekAgo.toISOString())

    // Group by day
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
      calories: Math.round(calories)
    }))

    setDays(result)
  }

  const maxCal = Math.max(...days.map(d => d.calories), 2000)

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{
        fontSize: '15px', fontWeight: 600,
        color: '#111827', marginBottom: '16px'
      }}>
        📊 This Week
      </h3>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        height: '120px'
      }}>
        {days.map((d, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            height: '100%',
            justifyContent: 'flex-end'
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
              minHeight: d.calories > 0 ? '4px' : '0'
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
          marginTop: '8px'
        }}>
          No meals logged this week yet
        </p>
      )}
    </div>
  )
}
