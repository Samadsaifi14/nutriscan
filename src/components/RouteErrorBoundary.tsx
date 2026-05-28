"use client"

import ErrorBoundary from './ErrorBoundary'

export default function RouteErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-lg font-bold mb-2">This section failed to load</p>
            <p className="text-sm text-[var(--muted)] mb-4">Please try again or go back to the dashboard.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold"
            >
              Reload
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
