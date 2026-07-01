import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

export function scoreToRating(score: number): 'healthy' | 'moderate' | 'unhealthy' {
  if (score >= 7) return 'healthy'
  if (score >= 4) return 'moderate'
  return 'unhealthy'
}

export function ratingColor(rating: 'healthy' | 'moderate' | 'unhealthy') {
  return { healthy: '#8FB878', moderate: '#E49030', unhealthy: '#E06B52' }[rating]
}
