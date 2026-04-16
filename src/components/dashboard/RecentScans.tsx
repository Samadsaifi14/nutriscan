"use client"
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface FoodLog {
  id: string
  product_name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  meal_type: string
  logged_at: string
  quantity_g: number
}

interface RecentScansProps {
  userId: string
}

const mealEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍿',
}

const mealColors: Record<string, string> = {
  breakfast: 'bg-orange-50 dark:bg-orange-900/20',
  lunch: 'bg-yellow-50 dark:bg-yellow-900/20',
  dinner: 'bg-blue-50 dark:bg-blue-900/20',
  snack: 'bg-green-50 dark:bg-green-900/20',
}

export default function RecentScans({ userId }: RecentScansProps) {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: meals, isLoading } = useQuery({
    queryKey: ['recentMeals', userId],
    queryFn: async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('food_logs')
        .select('id, product_name, calories, protein_g, carbs_g, fat_g, meal_type, logged_at, quantity_g')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString())
        .order('logged_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return (data || []) as FoodLog[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  })

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}" from your meal history?`)) return

    setDeletingId(id)
    try {
      const res = await fetch('/api/log/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (json.success) {
        queryClient.setQueryData<FoodLog[]>(['recentMeals', userId], old =>
          (old || []).filter(m => m.id !== id)
        )
        queryClient.invalidateQueries({ queryKey: ['weeklyChart', userId] })
        toast.success('Meal removed')
      } else {
        toast.error('Failed to delete. Try again.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="h-24 flex items-center justify-center">
          <p className="text-xs text-gray-400 animate-pulse">Loading meals...</p>
        </div>
      </div>
    )
  }

  if (!meals || meals.length === 0) {
    return (
      <div className="rounded-2xl p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
        <div className="text-4xl mb-3">🍽️</div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          No meals logged today
        </p>
        <p className="text-xs text-gray-400">
          Scan a product and log it to see your meals here
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
          🕐 Today's Meals
        </p>
        <span className="text-xs text-gray-400">
          {meals.length} meal{meals.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {meals.map(meal => (
          <div
            key={meal.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              deletingId === meal.id
                ? 'opacity-50 bg-red-50 dark:bg-red-900/20'
                : 'bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
              mealColors[meal.meal_type] || 'bg-gray-100 dark:bg-gray-700'
            }`}>
              {mealEmoji[meal.meal_type] || '🍽️'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                {meal.product_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {meal.quantity_g}g · <span className="capitalize">{meal.meal_type}</span>
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] text-blue-500 font-medium">P {Math.round(meal.protein_g)}g</span>
                <span className="text-[10px] text-yellow-500 font-medium">C {Math.round(meal.carbs_g)}g</span>
                <span className="text-[10px] text-red-400 font-medium">F {Math.round(meal.fat_g)}g</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0 mr-1">
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {Math.round(meal.calories)}
              </p>
              <p className="text-[10px] text-gray-400">kcal</p>
            </div>

            <button
              onClick={() => handleDelete(meal.id, meal.product_name)}
              disabled={deletingId === meal.id}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-800 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === meal.id ? (
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