"use client"
import { Component, ReactNode } from 'react'
import { event, AnalyticsEvents } from '@/lib/analytics'
import { captureException } from '@/lib/monitoring'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    captureException(error, {
      componentStack: (errorInfo.componentStack ?? '').slice(0, 200),
    })
    event(AnalyticsEvents.SCAN_ERROR, {
      error_message: error.name,
      error_name: error.name,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
          <div className="max-w-sm w-full text-center">
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
              Something went wrong
            </h1>
            <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
              An unexpected error occurred. Please try again.
            </p>
            <p className="text-xs mb-6" style={{ color: 'var(--muted-2)' }}>
              This error has been reported. Try refreshing or go back.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-colors text-white"
                style={{ background: 'var(--clay)' }}>
                Reload Page
              </button>
              <button onClick={() => { this.setState({ hasError: false }); window.location.href = '/dashboard' }}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
