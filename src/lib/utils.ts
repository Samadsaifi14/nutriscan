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
  return { healthy: 'var(--moss)', moderate: 'var(--clay)', unhealthy: 'var(--rust)' }[rating]
}

export function escapeIlike(str: string): string {
  return str.replace(/[%_\\]/g, '\\$&')
}
