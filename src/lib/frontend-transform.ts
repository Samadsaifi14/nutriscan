import type { NutritionPer100g } from './health-engine'

export function computeHealthRating(score: number | null | undefined): 'healthy' | 'moderate' | 'unhealthy' {
  if (score == null) return 'moderate'
  if (score >= 7) return 'healthy'
  if (score >= 4) return 'moderate'
  return 'unhealthy'
}

export interface CardItem {
  product: { barcode: string; name: string; brand: string; image_url: string | null }
  analysis: { health_score: number; health_rating: 'healthy' | 'moderate' | 'unhealthy' }
}

export function transformLogToCard(
  log: any,
  product?: { barcode?: string | null; brand?: string | null; image_url?: string | null; health_score?: number | null }
): CardItem {
  const name = log.product_name || 'Unknown Product'
  const brand = product?.brand ?? log.brand ?? ''
  const imageUrl = product?.image_url ?? log.image_url ?? null
  const healthScore = product?.health_score ?? log.health_score ?? 5

  return {
    product: { barcode: product?.barcode ?? log.barcode ?? '', name, brand, image_url: imageUrl },
    analysis: { health_score: healthScore, health_rating: computeHealthRating(healthScore) },
  }
}

export function transformProductToCard(p: any): CardItem {
  const healthScore = p.health_score ?? 5
  return {
    product: { barcode: p.barcode || '', name: p.name || 'Unknown', brand: p.brand || '', image_url: p.image_url || null },
    analysis: { health_score: healthScore, health_rating: computeHealthRating(healthScore) },
  }
}

export interface DashboardResponse {
  overallScore: number
  streak: number
  totalScans: number
  avgScore: number
  thisWeek: number
  recentScans: CardItem[]
  bestWeek: number
  trend: 'improving' | 'stable' | 'declining'
  monthLabel: string
}

export function computeStreak(
  dailyStats: { log_date: string; scan_count: number; avg_score: number }[]
): number {
  if (dailyStats.length === 0) return 0
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < dailyStats.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    const statDate = new Date(dailyStats[i]!.log_date + 'T00:00:00')
    if (statDate.getTime() === expected.getTime()) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function computeTrend(
  currentWeekAvg: number,
  priorWeekAvg: number | null
): 'improving' | 'stable' | 'declining' {
  if (priorWeekAvg === null || priorWeekAvg === 0) return 'stable'
  const diff = currentWeekAvg - priorWeekAvg
  const pct = diff / priorWeekAvg
  if (pct > 0.05) return 'improving'
  if (pct < -0.05) return 'declining'
  return 'stable'
}

export function estimateHealthScore(nutrition: NutritionPer100g): number | null {
  const hasAny = nutrition.calories != null && nutrition.calories > 0
  if (!hasAny) return null

  let penalty = 0
  if (nutrition.sugar != null && nutrition.sugar > 10) penalty += 2
  else if (nutrition.sugar != null && nutrition.sugar > 5) penalty += 1
  if (nutrition.sodium != null && nutrition.sodium > 400) penalty += 2
  else if (nutrition.sodium != null && nutrition.sodium > 200) penalty += 1
  if (nutrition.saturated_fat != null && nutrition.saturated_fat > 5) penalty += 2
  else if (nutrition.saturated_fat != null && nutrition.saturated_fat > 2) penalty += 1
  if (nutrition.protein != null && nutrition.protein > 10) penalty -= 1
  if (nutrition.fiber != null && nutrition.fiber > 5) penalty -= 1

  return Math.max(1, Math.min(10, 7 - penalty))
}
