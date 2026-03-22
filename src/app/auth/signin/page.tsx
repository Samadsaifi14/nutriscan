"use client"
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0fdf4',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
        maxWidth: '360px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>🥗 NutriScan</h1>
        <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '15px' }}>
          Your AI-powered food health advisor
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          style={{
            width: '100%',
            padding: '12px 20px',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}