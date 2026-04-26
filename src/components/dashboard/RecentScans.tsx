"use client"
import { useState } from 'react'
import toast from 'react-hot-toast'

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

const mealColors: Record<string, string> = {
  breakfast: 'bg-orange-50 dark:bg-orange-900/20',
  lunch: 'bg-yellow-50 dark:bg-yellow-900/20',
  dinner: 'bg-blue-50 dark:bg-blue-900/20',
  snack: 'bg-green-50 dark:bg-green-900/20',
}

export default function RecentScans({ logs, onDelete }: RecentScansProps) {
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
        toast.success('Meal removed')
      } else {
        toast.error('Failed to delete. Try again.')
      }
    } catch {
      toast.error('Something went wrong.')
    }
    setDeletingId(null)
  }

  if (logs.length === 0) {
    return (
      <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--card-border)] text-center">
        <div className="text-4xl mb-3">🍽️</div>
        <p className="text-sm font-medium text-[var(--foreground)] mb-1">
          No meals logged yet
        </p>
        <p className="text-xs text-[var(--muted)]">
          Scan a product and log it to see your meals here
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          🕐 Recent Meals
        </h3>
        <span className="text-xs text-[var(--muted)]">
          {logs.length} meal{logs.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {logs.map(log => (
          <div
            key={log.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              deletingId === log.id
                ? 'opacity-50 bg-red-50 dark:bg-red-900/20'
                : 'bg-gray-50 dark:bg-slate-800/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
              mealColors[log.meal_type] || 'bg-gray-100 dark:bg-slate-700'
            }`}>
              {mealEmoji[log.meal_type] || '🍽️'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">
                {log.product_name}
              </p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {log.quantity_g}g ·{' '}
                <span className="capitalize">{log.meal_type}</span> ·{' '}
                {new Date(log.logged_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short'
                })}
              </p>
            </div>

            <div className="text-right flex-shrink-0 mr-1">
              <p className="text-sm font-bold text-green-600 dark:text-green-400">
                {Math.round(log.calories)}
              </p>
              <p className="text-xs text-[var(--muted)]">kcal</p>
            </div>

            <button
              onClick={() => handleDelete(log.id, log.product_name)}
              disabled={deletingId === log.id}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-800 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === log.id ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
                  <path d="M21 12a9 9 0 00-9-9"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}