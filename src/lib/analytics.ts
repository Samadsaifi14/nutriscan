import { GA_MEASUREMENT_ID } from '@/lib/config'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function pageView(url: string): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

export function event(
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  window.gtag?.('event', action, params)
}

export const AnalyticsEvents = {
  SCAN_BARCODE: 'scan_barcode',
  SCAN_PHOTO: 'scan_photo',
  SCAN_VISION: 'scan_vision',
  LOG_MEAL: 'log_meal',
  VIEW_ANALYSIS: 'view_analysis',
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
  PROFILE_COMPLETE: 'profile_complete',
  SHARE_PRODUCT: 'share_product',
  SCAN_ERROR: 'scan_error',
} as const