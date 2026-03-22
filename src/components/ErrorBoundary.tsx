"use client"
import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
          <div className="max-w-sm w-full text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--muted)] mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = '/dashboard'
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm"
            >
              Go back to Dashboard
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}