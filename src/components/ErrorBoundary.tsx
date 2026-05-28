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
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
          <div className="max-w-sm w-full text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--muted)] mb-2">
              An unexpected error occurred. Please try again.
            </p>
            <p className="text-xs text-[var(--muted)] mb-6">
              This error has been reported. Try refreshing or go back.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.href = '/dashboard'
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-[var(--foreground)] rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
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