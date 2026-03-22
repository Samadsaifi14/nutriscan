"use client"
import { useState } from 'react'

interface FoodLog {
  id: string
  product_name: string
  calories: number
  meal_type: string
  logged_at: string
  quantity_g: number
}

interface RecentScansProps {
  logs: FoodLog[]
  onDelete: (id: string) => void
}

const mealEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

export function RecentScans({ logs, onDelete }: RecentScansProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}" from your meal history?`)) return

    setDeletingId(id)
    try {
      const res = await fetch('/api/log/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const json = await res.json()
      if (json.success) {
        onDelete(id)
      } else {
        alert('Failed to delete. Try again.')
      }
    } catch {
      alert('Something went wrong.')
    }
    setDeletingId(null)
  }

  if (logs.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '14px'
      }}>
        No meals logged yet. Scan a product to get started!
      </div>
    )
  }

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
        🕐 Recent Meals
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.map(log => (
          <div key={log.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: deletingId === log.id ? '#fef2f2' : '#f9fafb',
            borderRadius: '10px',
            opacity: deletingId === log.id ? 0.6 : 1,
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '20px' }}>
              {mealEmoji[log.meal_type] || '🍽️'}
            </span>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '14px', fontWeight: 500,
                color: '#111827', marginBottom: '2px'
              }}>
                {log.product_name}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {log.quantity_g}g · {log.meal_type} · {new Date(log.logged_at).toLocaleDateString()}
              </div>
            </div>

            <div style={{ textAlign: 'right', marginRight: '8px' }}>
              <div style={{
                fontSize: '14px', fontWeight: 600,
                color: '#16a34a'
              }}>
                {Math.round(log.calories)} kcal
              </div>
            </div>

            <button
              onClick={() => handleDelete(log.id, log.product_name)}
              disabled={deletingId === log.id}
              title="Delete this meal"
              style={{
                background: 'none',
                border: '1px solid #fca5a5',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: deletingId === log.id ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                color: '#ef4444',
                flexShrink: 0
              }}
            >
              {deletingId === log.id ? '...' : '🗑️'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}