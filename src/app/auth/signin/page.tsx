"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import PageShell from '@/components/PageShell'

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  async function handleSignIn() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  if (!mounted) return null

  return (
    <PageShell variant="bare">
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 20, minHeight: '100dvh',
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 22 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--clay), #78471C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          <span>\uD83E\uDD66</span>
        </div>
        <span style={{ fontSize: 14, color: 'var(--foreground)', fontWeight: 800, letterSpacing: '-0.04em' }}>Bio You</span>
        <span style={{ fontSize: 8, color: 'var(--muted)' }}>Know what&apos;s in your food</span>
      </div>

      <div style={{
        background: 'var(--surface-2)', borderRadius: 10,
        border: '0.5px solid var(--border-2)', padding: 16,
        width: '100%', maxWidth: 320,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <span style={{ fontSize: 10, color: 'var(--foreground)', fontWeight: 700 }}>Sign in or create account</span>

        <button onClick={handleSignIn} disabled={loading} style={{
          height: 36, borderRadius: 10,
          background: 'var(--surface-3)', border: '0.5px solid var(--border-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: loading ? 'not-allowed' : 'pointer', color: 'var(--foreground)',
          fontSize: 8, fontWeight: 500, opacity: loading ? 0.6 : 1,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--foreground)' }}>G</span>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 0.5, background: 'var(--border-2)' }} />
          <span style={{ fontSize: 7, color: 'var(--muted)' }}>or</span>
          <div style={{ flex: 1, height: 0.5, background: 'var(--border-2)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 7.5, color: 'var(--muted)' }}>Email address</span>
          <div style={{ height: 32, borderRadius: 8, background: 'var(--surface-3)', border: '0.5px solid var(--border-2)' }} />
        </div>

        <button style={{
          height: 34, borderRadius: 10, background: 'var(--clay)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 8, fontWeight: 700, cursor: 'pointer', border: 'none',
        }}>
          Send magic link →
        </button>
      </div>

      <span style={{
        fontSize: 7, color: 'var(--muted)', marginTop: 14,
        textAlign: 'center', lineHeight: 1.6,
      }}>
        By signing in you agree to our{' '}
        <a href="/legal/terms" style={{ color: 'var(--clay)', textDecoration: 'underline' }}>Terms</a>
        {' & '}
        <a href="/legal/privacy" style={{ color: 'var(--clay)', textDecoration: 'underline' }}>Privacy Policy</a>
      </span>
    </div>
    </PageShell>
  )
}
