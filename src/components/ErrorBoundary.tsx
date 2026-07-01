'use client'

import { Component } from 'react'
import Link from 'next/link'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="page px-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16, minHeight: '100dvh' }}>
          <div className="empty-state__icon" style={{ fontSize: 32 }}>!</div>
          <h2 className="text-h2">Something went wrong</h2>
          <p className="text-sm text-sand" style={{ maxWidth: 300 }}>
            An unexpected error occurred. Please try reloading.
          </p>
          <div className="row--sm" style={{ marginTop: 8 }}>
            <button className="btn btn--secondary" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <Link href="/dashboard" className="btn btn--primary">
              Home
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
