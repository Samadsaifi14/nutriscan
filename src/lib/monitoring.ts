/** Optional error reporting — enable with SENTRY_DSN in production. */

export function captureException(error: unknown, context?: Record<string, string>) {
  console.error('[error]', error, context ?? '')
  if (typeof window !== 'undefined' && (window as any).Sentry?.captureException) {
    ;(window as any).Sentry.captureException(error, { extra: context })
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (level === 'error') console.error(message)
  else console.log(`[${level}]`, message)
}
