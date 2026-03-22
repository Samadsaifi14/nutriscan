"use client"
import { signIn } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function SignInPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥗</div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            NutriScan
          </h1>
          <p className="text-[var(--muted)] text-sm">
            AI-powered food health advisor
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--card)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2 text-center">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--muted)] text-center mb-6">
            Sign in to track your nutrition and get AI health ratings
          </p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl font-semibold text-base transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-xs text-center text-[var(--muted)] mt-4">
            By signing in you agree to our terms of service
          </p>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { emoji: '📷', text: 'Scan barcodes' },
            { emoji: '🤖', text: 'AI analysis' },
            { emoji: '📊', text: 'Track calories' },
          ].map(f => (
            <div key={f.text} className="bg-[var(--card)] rounded-xl p-3 border border-[var(--card-border)]">
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="text-xs text-[var(--muted)]">{f.text}</div>
            </div>
          ))}
        </div>

        {/* Dark mode toggle */}
        {mounted && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
