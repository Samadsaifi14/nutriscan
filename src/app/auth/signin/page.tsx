"use client"
import { signIn } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function SignInPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => setMounted(true), [])

  async function handleSignIn() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const features = [
    { icon: '📷', title: 'Smart Scanning', desc: 'Camera or photo mode for any Indian product' },
    { icon: '🤖', title: 'Gemini AI', desc: 'Instant health ratings and ingredient warnings' },
    { icon: '📊', title: 'Track Macros', desc: 'Personalised calorie goals based on your BMI' },
    { icon: '🇮🇳', title: 'Made for India', desc: 'FSSAI standards, Indian product database' },
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">

      {/* Top gradient decoration */}
      <div className="absolute top-0 left-0 right-0 h-72 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-20 w-72 h-72 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center p-6 max-w-sm mx-auto w-full">

        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-brand mb-5 shadow-lg shadow-emerald-500/30">
            <span className="text-4xl">🥗</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            <span className="text-gradient">HealthOX</span>
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Your AI-powered food health advisor.<br/>
            Know what you eat. Live better.
          </p>
        </div>

        {/* Sign in card */}
        <div className="w-full bg-[var(--card)] rounded-3xl p-7 shadow-xl border border-[var(--card-border)] mb-6 animate-fade-in-up stagger-1">

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
              Get started for free
            </h2>
            <p className="text-xs text-[var(--muted)]">
              No credit card required · Always free
            </p>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-2xl font-bold text-sm transition-all duration-200 relative overflow-hidden group"
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)',
              color: 'white',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(5, 150, 105, 0.35)',
            }}
          >
            {!loading && (
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Signing you in...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff" fillOpacity="0.9"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ffffff" fillOpacity="0.9"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#ffffff" fillOpacity="0.9"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ffffff" fillOpacity="0.9"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p className="text-xs text-center text-[var(--muted)] mt-4">
            By signing in you agree to our terms of service and privacy policy
          </p>
        </div>

        {/* Features grid */}
        <div className="w-full grid grid-cols-2 gap-3 animate-fade-in-up stagger-2">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--card-border)]"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-xs font-bold text-[var(--foreground)] mb-1">{f.title}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="mt-6 flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
        )}

      </div>

      {/* Bottom tagline */}
      <div className="text-center pb-6 relative">
        <p className="text-xs text-[var(--muted)]">
          Made with 💚 for a healthier India
        </p>
      </div>

    </div>
  )
}