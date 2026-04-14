"use client"
import { useState } from 'react'
import {
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp,
  ExternalLink, Leaf, Shield, TrendingDown, Heart, Baby,
  Droplets, ShoppingBag, Clock, Activity, Info, Zap, Star
} from 'lucide-react'
 
export interface AnalysisData {
  health_rating: 'healthy' | 'moderate' | 'unhealthy'
  health_score: number
  health_score_breakdown?: {
    nutrition_score: number
    ingredient_safety_score: number
    processing_score: number
    overall: number
  }
  summary: string
  detailed_breakdown?: {
    calories?: string
    protein?: string
    sugar?: string
    sodium?: string
    fat?: string
    fiber?: string
    processing_level?: string
    overall_nutrient_density?: string
  }
  safe_consumption?: {
    amount?: string
    frequency?: string
    notes?: string
    personalized_for_user?: string
  }
  harmful_ingredients?: Array<{
    name: string
    also_known_as?: string[]
    found_in_product?: boolean
    concern: string
    severity: 'high' | 'medium' | 'low'
    scientific_source?: string
    source_url?: string
    global_safe_limit?: string
    amount_in_this_product?: string
    personalized_safe_limit?: string
    percentage_of_daily_limit?: string
  }>
  ingredient_warnings?: Array<{
    ingredient: string
    concern: string
    severity: 'high' | 'medium' | 'low'
  }>
  long_term_risks?: string[]
  positives?: string[]
  healthier_alternatives?: Array<{
    name: string
    reason: string
    availability?: string
    type?: string
  }>
  fssai_compliance?: string
  diabetic_suitability?: string
  bp_suitability?: string
  child_suitability?: string
  pregnancy_suitability?: string
  personalized?: boolean
  analyzed_at?: string
}
 
function getScoreColor(score: number) {
  if (score >= 7.5) return '#10b981'
  if (score >= 5.5) return '#f59e0b'
  if (score >= 3.5) return '#f97316'
  return '#ef4444'
}
 
function getSeverityStyles(severity: string) {
  switch (severity) {
    case 'high': return {
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
      card: 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10',
      icon: 'text-red-500',
    }
    case 'medium': return {
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
      card: 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10',
      icon: 'text-amber-500',
    }
    default: return {
      badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
      card: 'border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/10',
      icon: 'text-yellow-500',
    }
  }
}
 
function getSuitabilityConfig(value?: string) {
  switch (value) {
    case 'suitable':             return { icon: CheckCircle,  color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40', label: 'Safe' }
    case 'consume_with_caution': return { icon: AlertTriangle, color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40',   label: 'Caution' }
    case 'avoid':                return { icon: XCircle,       color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40',             label: 'Avoid' }
    default:                     return { icon: Info,          color: 'text-gray-400',    bg: 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700',            label: 'Unknown' }
  }
}
 
function clamp(score: number) { return Math.min(Math.max(score / 10, 0), 1) }
 
function ScoreRing({ score, rating }: { score: number; rating: string }) {
  const radius = 52
  const circ   = 2 * Math.PI * radius
  const offset = circ * (1 - clamp(score))
  const color  = getScoreColor(score)
  const gradMap: Record<string, string> = {
    healthy: 'from-emerald-500 to-teal-400',
    moderate: 'from-amber-500 to-yellow-400',
    unhealthy: 'from-red-500 to-orange-500',
  }
  const label = rating === 'healthy' ? 'Healthy' : rating === 'moderate' ? 'Moderate' : 'Unhealthy'
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="10"
            className="text-gray-100 dark:text-gray-800" />
          <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-3xl font-black tabular-nums leading-none" style={{ color }}>
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">/ 10</span>
        </div>
      </div>
      <span className={`px-5 py-1.5 rounded-full text-sm font-bold text-white shadow-sm bg-gradient-to-r ${gradMap[rating] || gradMap.moderate}`}>
        {label}
      </span>
    </div>
  )
}
 
function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = getScoreColor(score)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{score.toFixed(1)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${clamp(score) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
 
function HarmfulCard({ item }: { item: NonNullable<AnalysisData['harmful_ingredients']>[0] }) {
  const [open, setOpen] = useState(false)
  const s = getSeverityStyles(item.severity)
  return (
    <div className={`rounded-xl border overflow-hidden ${s.card}`}>
      <button className="w-full flex items-start gap-3 p-3 text-left" onClick={() => setOpen(x => !x)}>
        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${s.icon}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${s.badge}`}>
              {item.severity} risk
            </span>
          </div>
          {item.also_known_as && item.also_known_as.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">Also: {item.also_known_as.slice(0, 3).join(', ')}</p>
          )}
          <p className={`text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>
            {item.concern}
          </p>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-3 pb-3 pt-2 space-y-2.5 border-t border-black/5 dark:border-white/5">
          <div className="grid grid-cols-2 gap-2">
            {item.amount_in_this_product && (
              <div className="bg-white/70 dark:bg-black/20 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">In this product</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.amount_in_this_product}</p>
              </div>
            )}
            {item.global_safe_limit && (
              <div className="bg-white/70 dark:bg-black/20 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Daily safe limit</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.global_safe_limit}</p>
              </div>
            )}
            {item.percentage_of_daily_limit && (
              <div className="bg-white/70 dark:bg-black/20 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">% of daily limit</p>
                <p className="text-xs font-bold text-red-600 dark:text-red-400">{item.percentage_of_daily_limit}</p>
              </div>
            )}
            {item.personalized_safe_limit && (
              <div className="bg-white/70 dark:bg-black/20 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Your safe limit</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.personalized_safe_limit}</p>
              </div>
            )}
          </div>
          {(item.scientific_source || item.source_url) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Shield className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-400">{item.scientific_source}</span>
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  <ExternalLink className="w-3 h-3" /> Source
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
 
export default function AnalysisCard({ analysis, productName }: { analysis: AnalysisData; productName: string }) {
  if (!analysis) return null
 
  const score    = Number(analysis.health_score) || 0
  const rating   = analysis.health_rating || 'moderate'
  const harmful  = (analysis.harmful_ingredients || []).filter(h => h.found_in_product !== false)
  const highRisk = harmful.filter(h => h.severity === 'high')
 
  const longTermRisks: string[] = analysis.long_term_risks?.length
    ? analysis.long_term_risks
    : harmful.filter(h => h.severity === 'high').map(h => h.concern).slice(0, 4)
 
  const alternatives = analysis.healthier_alternatives || []
  const positives    = analysis.positives || []
  const warnings     = analysis.ingredient_warnings || []
 
  const suitability = [
    { label: 'Diabetic',  value: analysis.diabetic_suitability  },
    { label: 'High BP',   value: analysis.bp_suitability        },
    { label: 'Children',  value: analysis.child_suitability     },
    { label: 'Pregnancy', value: analysis.pregnancy_suitability },
  ]
 
  return (
    <div className="space-y-3">
 
      {/* SCORE + SUMMARY */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className={`px-4 py-2.5 flex items-center gap-2 text-xs font-semibold
          ${rating === 'healthy'   ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
          : rating === 'unhealthy' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          :                          'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'}`}>
          <Star className="w-3.5 h-3.5" />
          AI Health Analysis {analysis.personalized ? '· Personalised' : '· General'}
        </div>
        <div className="p-5 flex flex-col items-center gap-4">
          <ScoreRing score={score} rating={rating} />
          {analysis.personalized && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400
              bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1 rounded-full">
              <Zap className="w-3 h-3" /> Based on your health profile
            </div>
          )}
          {analysis.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              {analysis.summary}
            </p>
          )}
        </div>
        {analysis.health_score_breakdown && (
          <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Score Breakdown</p>
            <ScoreBar label="Nutrition Quality" score={analysis.health_score_breakdown.nutrition_score ?? 0} />
            <ScoreBar label="Ingredient Safety" score={analysis.health_score_breakdown.ingredient_safety_score ?? 0} />
            <ScoreBar label="Processing Level"  score={analysis.health_score_breakdown.processing_score ?? 0} />
          </div>
        )}
      </div>
 
      {/* SUITABILITY GRID */}
      {suitability.some(s => s.value && s.value !== 'unknown') && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Who Should Be Careful</p>
          <div className="grid grid-cols-2 gap-2">
            {suitability.map(({ label, value }) => {
              if (!value || value === 'unknown') return null
              const cfg = getSuitabilityConfig(value)
              const StatusIcon = cfg.icon
              return (
                <div key={label} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${cfg.bg}`}>
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-none">{label}</p>
                    <p className={`text-xs font-bold mt-0.5 ${cfg.color}`}>{cfg.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
 
      {/* HARMFUL INGREDIENTS */}
      {harmful.length > 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/40 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {harmful.length} Harmful Ingredient{harmful.length !== 1 ? 's' : ''} Found
            </p>
            {highRisk.length > 0 && (
              <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                {highRisk.length} HIGH
              </span>
            )}
          </div>
          <div className="space-y-2">
            {harmful.map((item, i) => <HarmfulCard key={i} item={item} />)}
          </div>
        </div>
      )}
 
      {/* INGREDIENT WARNINGS (fallback) */}
      {warnings.length > 0 && harmful.length === 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-amber-100 dark:border-amber-900/30 shadow-sm">
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> Ingredient Warnings
          </p>
          <div className="space-y-2.5">
            {warnings.map((w, i) => {
              const s = getSeverityStyles(w.severity)
              return (
                <div key={i} className={`rounded-xl border p-3 ${s.card}`}>
                  <div className="flex items-start gap-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 capitalize ${s.badge}`}>{w.severity}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{w.ingredient}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{w.concern}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
 
      {/* LONG-TERM HEALTH RISKS */}
      {longTermRisks.length > 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-900/30 shadow-sm">
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4" />
            Health Risks of Regular Consumption
          </p>
          <ul className="space-y-2.5">
            {longTermRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-orange-400 dark:text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
 
      {/* WHAT'S GOOD */}
      {positives.length > 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4" /> What's Good About This
          </p>
          <ul className="space-y-2">
            {positives.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <Leaf className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
 
      {/* SAFE CONSUMPTION */}
      {analysis.safe_consumption && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-emerald-500" /> Safe Consumption Guide
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {analysis.safe_consumption.amount && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Safe Amount</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{analysis.safe_consumption.amount}</p>
              </div>
            )}
            {analysis.safe_consumption.frequency && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Frequency</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{analysis.safe_consumption.frequency}</p>
              </div>
            )}
          </div>
          {(analysis.safe_consumption.personalized_for_user || analysis.safe_consumption.notes) && (
            <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              💡 {analysis.safe_consumption.personalized_for_user || analysis.safe_consumption.notes}
            </p>
          )}
        </div>
      )}
 
      {/* HEALTHIER ALTERNATIVES */}
      {alternatives.length > 0 && (
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-emerald-500" /> Healthier Alternatives
          </p>
          <div className="space-y-2.5">
            {alternatives.map((alt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl
                bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{alt.name}</p>
                    {alt.availability && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40
                        text-emerald-700 dark:text-emerald-400 capitalize font-medium">
                        {alt.availability.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{alt.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* FSSAI */}
      {analysis.fssai_compliance && (
        <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium
          ${analysis.fssai_compliance === 'compliant'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40'
            : analysis.fssai_compliance === 'concern'
            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'}`}>
          <Shield className="w-4 h-4 flex-shrink-0" />
          FSSAI: {analysis.fssai_compliance === 'compliant' ? 'No compliance concerns detected'
            : analysis.fssai_compliance === 'concern' ? 'Possible FSSAI compliance concern'
            : 'Compliance status unknown'}
        </div>
      )}
 
    </div>
  )
}