"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import PageShell from '@/components/PageShell'

interface EmailPrefs {
  weekly_report_email: boolean
  email_unsubscribed: boolean
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [prefs, setPrefs] = useState<EmailPrefs>({
    weekly_report_email: true,
    email_unsubscribed: false,
  })
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/profile')
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    enabled: status === 'authenticated',
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (data) {
      setPrefs({
        weekly_report_email: data.weekly_report_email ?? true,
        email_unsubscribed: data.email_unsubscribed ?? false,
      })
    }
  }, [data])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile/email-prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Preferences saved')
      } else {
        toast.error(json.error || 'Something went wrong')
      }
    } catch {
      toast.error('Network error')
    }
    setSaving(false)
  }

  if (status === 'loading' || isLoading) {
    return (
      <PageShell variant="default" title="Settings">
        <div style={{ padding: 16 }}><div style={{ height: 200 }} /></div>
      </PageShell>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <PageShell variant="default" title="Settings">
      {/* ── Email Preferences ── */}
      <div style={{
        background: 'var(--surface-2)', borderRadius: 14,
        border: '0.5px solid var(--border-2)', padding: 14,
        margin: '0 12px', marginTop: 8, marginBottom: 10,
      }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>
          EMAIL PREFERENCES
        </div>

        {/* Weekly report toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: 12, marginBottom: 12,
          borderBottom: '0.5px solid var(--border-2)',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 2 }}>
              Weekly Report
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
              Get a weekly summary of your nutrition and scans
            </div>
          </div>
          <button
            onClick={() => setPrefs(p => ({ ...p, weekly_report_email: !p.weekly_report_email }))}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: prefs.weekly_report_email ? 'var(--clay)' : 'var(--surface-3)',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background 0.2s', flexShrink: 0,
            }}
            aria-label="Toggle weekly report"
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'white', position: 'absolute',
              top: 2, left: prefs.weekly_report_email ? 22 : 2,
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>

        {/* Unsubscribe toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 2 }}>
              Unsubscribe All
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
              Stop receiving all email communications
            </div>
          </div>
          <button
            onClick={() => setPrefs(p => ({ ...p, email_unsubscribed: !p.email_unsubscribed }))}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: prefs.email_unsubscribed ? 'var(--risk-red)' : 'var(--surface-3)',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background 0.2s', flexShrink: 0,
            }}
            aria-label="Toggle unsubscribe"
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'white', position: 'absolute',
              top: 2, left: prefs.email_unsubscribed ? 22 : 2,
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </div>

      {/* ── Account ── */}
      <div style={{
        background: 'var(--surface-2)', borderRadius: 14,
        border: '0.5px solid var(--border-2)', padding: 14,
        margin: '0 12px', marginBottom: 10,
      }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>
          ACCOUNT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0',
          }}>
            <span style={{ fontSize: 13, color: 'var(--foreground)', fontWeight: 600 }}>Email</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{session?.user?.email || '—'}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0', borderTop: '0.5px solid var(--border-2)',
          }}>
            <span style={{ fontSize: 13, color: 'var(--foreground)', fontWeight: 600 }}>Edit Profile</span>
            <span
              onClick={() => router.push('/profile-setup')}
              style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 600, cursor: 'pointer' }}
            >
              Update ›
            </span>
          </div>
        </div>
      </div>

      {/* ── Save Button ── */}
      <div style={{ margin: '0 12px', marginTop: 4 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', height: 40, borderRadius: 10,
            background: 'var(--clay)', color: 'white',
            border: 'none', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', opacity: saving ? 0.5 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      <div style={{ height: 24 }} />
    </PageShell>
  )
}
