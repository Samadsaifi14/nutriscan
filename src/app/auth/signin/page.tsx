'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { Camera } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()

  return (
    <PageShell variant="bare">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80dvh', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--clay), var(--moss))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Camera size={28} color="#fff" />
        </div>
        <h1 className="text-h2" style={{ marginBottom: 8 }}>Welcome to HealthOX</h1>
        <p className="text-sm" style={{ color: 'var(--sand)', marginBottom: 32, maxWidth: 280 }}>
          Sign in to scan products, track your health scores, and discover better alternatives.
        </p>
        <div className="stack--sm" style={{ width: '100%', maxWidth: 300 }}>
          <button
            className="btn btn--primary btn--full"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Continue with Google
          </button>
          <button
            className="btn btn--secondary btn--full"
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          >
            Continue with GitHub
          </button>
          <button
            className="btn btn--outline btn--full"
            onClick={() => signIn('credentials', { callbackUrl: '/dashboard' })}
          >
            Continue with Email
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)', marginTop: 24 }}>
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </PageShell>
  )
}
