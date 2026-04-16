declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const canTrack = () => GA_ID && typeof window !== 'undefined'

export function pageView(url: string): void {
  if (!canTrack()) return
  window.gtag?.('config', GA_ID!, { page_path: url })
}

export function event(
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!canTrack()) return
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

export type AnalyticsEvent = typeof AnalyticsEvents[keyof typeof AnalyticsEvents]