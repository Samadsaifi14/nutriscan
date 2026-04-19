"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function SignInPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  async function handleSignIn() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const features = [
    { icon: '📷', title: 'Smart Scanning', desc: 'Barcode & photo scan for any Indian product' },
    { icon: '🤖', title: 'Gemini AI', desc: 'Instant health scores & additive warnings' },
    { icon: '📊', title: 'Track Macros', desc: 'Personalised goals based on your profile' },
    { icon: '🇮🇳', title: 'Made for India', desc: 'FSSAI standards, Indian product database' },
  ]

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] flex flex-col font-sans">

      {/* Top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-64 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-16 w-64 h-64 bg-sky-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-5 py-10 max-w-sm mx-auto w-full gap-6">

        {/* Hero section */}
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 text-[11px] text-emerald-400 tracking-wide mb-6">
            ✦ AI-Powered Food Intelligence
          </div>

          {/* Logo mark */}
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <span className="text-3xl">🥗</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl font-black tracking-tight mb-3"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HealthOX
          </h1>

          <p className="text-sm text-[#7a8fa6] leading-relaxed">
            Know what you eat,{' '}
            <span className="text-emerald-400 font-medium">actually.</span>
            <br />
            Scan any food product sold in India.
          </p>
        </div>

        {/* Features grid */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#1e242d] border border-[#2a3545] rounded-2xl p-4"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-xs font-semibold text-[#f0f4f8] mb-1">{f.title}</p>
              <p className="text-[11px] text-[#7a8fa6] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Auth card */}
        <div className="w-full bg-[#161a20] border border-[#2a3545] rounded-3xl p-6 flex flex-col gap-3">

          <div className="text-center mb-1">
            <h2 className="text-base font-semibold text-[#f0f4f8]">Get started for free</h2>
            <p className="text-[11px] text-[#7a8fa6] mt-0.5">No credit card · Always free</p>
          </div>

          {/* Google button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#2a3545] disabled:text-[#7a8fa6] disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Signing you in…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" fillOpacity="0.9" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" fillOpacity="0.9" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" fillOpacity="0.9" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" fillOpacity="0.9" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#2a3545]" />
            <span className="text-[11px] text-[#7a8fa6]">or</span>
            <div className="flex-1 h-px bg-[#2a3545]" />
          </div>

          {/* Guest button */}
          <button
            onClick={() => router.push('/scan')}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl text-sm font-medium text-[#f0f4f8] bg-[#1e242d] border border-[#2a3545] hover:border-emerald-500/50 hover:bg-[#252c38] transition-all duration-200"
          >
            <span className="text-base">👤</span>
            Continue as Guest
          </button>

          {/* Guest info pill */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-[11px] text-[#7a8fa6] leading-relaxed text-center">
              <span className="text-[#f0f4f8] font-medium">Guest mode:</span> Scan & get AI ratings without signing in.
              Sign in to save history & get weekly reports.
            </p>
          </div>

          <p className="text-[10px] text-center text-[#7a8fa6]">
            By signing in you agree to our terms of service
          </p>
        </div>

        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 text-[11px] text-[#7a8fa6] hover:text-[#f0f4f8] transition-colors"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
        )}

      </div>

      <div className="text-center pb-6 relative">
        <p className="text-[11px] text-[#7a8fa6]">Made with 💚 for a healthier India</p>
      </div>
    </div>
  )
}