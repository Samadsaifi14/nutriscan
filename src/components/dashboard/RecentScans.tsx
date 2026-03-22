"use client"

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
}

const mealEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

export function RecentScans({ logs }: RecentScansProps) {
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
            background: '#f9fafb',
            borderRadius: '10px'
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
                {log.quantity_g}g · {log.meal_type}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '14px', fontWeight: 600,
                color: '#16a34a'
              }}>
                {Math.round(log.calories)} kcal
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                {new Date(log.logged_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}