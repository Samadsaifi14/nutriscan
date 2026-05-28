// BioYou - Health Score Breakdown Component
// Shows detailed score explanation with icons

import { AlertTriangle, CheckCircle, XCircle, MinusCircle } from 'lucide-react'

interface ScoreBreakdownItem {
  factor: string
  label: string
  impact: "positive" | "negative" | "neutral" | "warning" | "critical"
  detail: string
  points: number
}

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownItem[]
  score: number
  grade: string
}

export function HealthScoreBreakdown({ breakdown, score, grade }: ScoreBreakdownProps) {
  // Sort breakdown by impact (critical first)
  const sorted = [...breakdown].sort((a, b) => {
    const order = { critical: 0, negative: 1, warning: 2, neutral: 3, positive: 4 }
    return (order[a.impact as keyof typeof order] || 3) - (order[b.impact as keyof typeof order] || 3)
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Score Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Health Score</h3>
          <p className="text-sm text-gray-500">Breakdown of why this score</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${
            grade === 'A' ? 'text-green-600' :
            grade === 'B' ? 'text-lime-600' :
            grade === 'C' ? 'text-yellow-600' :
            grade === 'D' ? 'text-orange-600' : 'text-red-600'
          }`}>
            {score}/10
          </div>
          <div className={`text-sm font-medium ${
            grade === 'A' ? 'text-green-700' :
            grade === 'B' ? 'text-lime-700' :
            grade === 'C' ? 'text-yellow-700' :
            grade === 'D' ? 'text-orange-700' : 'text-red-700'
          }`}>
            Grade {grade}
          </div>
        </div>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-3">
        {sorted.map((item, index) => (
          <BreakdownItem key={index} item={item} />
        ))}
      </div>
    </div>
  )
}

function BreakdownItem({ item }: { item: ScoreBreakdownItem }) {
  const icon = {
    positive: <CheckCircle className="w-5 h-5 text-green-500" />,
    negative: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    critical: <XCircle className="w-5 h-5 text-red-600" />,
    neutral: <MinusCircle className="w-5 h-5 text-gray-400" />,
  }

  const bgColor = {
    positive: 'bg-green-50 border-green-200',
    negative: 'bg-red-50 border-red-200',
    warning: 'bg-orange-50 border-orange-200',
    critical: 'bg-red-100 border-red-300',
    neutral: 'bg-gray-50 border-gray-200',
  }

  const textColor = {
    positive: 'text-green-800',
    negative: 'text-red-800',
    warning: 'text-orange-800',
    critical: 'text-red-900',
    neutral: 'text-gray-600',
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${bgColor[item.impact]}`}>
      <div className="flex-shrink-0 mt-0.5">
        {icon[item.impact]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${textColor[item.impact]}`}>
            {item.label}
          </span>
          <span className={`text-sm font-medium ${
            item.points > 0 ? 'text-green-600' : item.points < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {item.points > 0 ? `+${item.points}` : item.points}
          </span>
        </div>
        <p className={`text-sm mt-1 ${textColor[item.impact].replace('800', '600')}`}>
          {item.detail}
        </p>
      </div>
    </div>
  )
}

// Compact version for cards
export function HealthScoreBadge({ score, grade }: { score: number; grade: string }) {
  const colors = {
    A: 'bg-green-100 text-green-800 border-green-300',
    B: 'bg-lime-100 text-lime-800 border-lime-300',
    C: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    D: 'bg-orange-100 text-orange-800 border-orange-300',
    F: 'bg-red-100 text-red-800 border-red-300',
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${colors[grade as keyof typeof colors] || colors.F}`}>
      {score}/10 ({grade})
    </span>
  )
}