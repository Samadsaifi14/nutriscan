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

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
  </svg>
)
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)
const IconBellOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.73 21a2 2 0 01-3.46 0M18.63 13A17.888 17.888 0 0118 8M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 00-9.33-5M1 1l22 22"/>
  </svg>
)
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)
const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconLogOut = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

function Toggle({ on, onChange, danger = false, disabled = false }: { on: boolean; onChange: () => void; danger?: boolean; disabled?: boolean }) {
  const activeColor = danger ? "#e05555" : "#cd853f"
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      disabled={disabled}
      style={{
        width: 48, height: 28, borderRadius: 99, border: "none",
        cursor: disabled ? "not-allowed" : "pointer", padding: 0,
        position: "relative", flexShrink: 0,
        background: on ? activeColor : "var(--surface-3, #2a2a2a)",
        transition: "background 0.2s ease",
        opacity: disabled ? 0.5 : 1, outline: "none",
      }}
      onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onChange() } }}
    >
      <div style={{
        position: "absolute", top: 4, left: on ? 24 : 4,
        width: 20, height: 20, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {on && <div style={{ color: activeColor }}><IconCheck /></div>}
      </div>
    </button>
  )
}

function Section({ title, icon, children, delay = 0 }: { title: string; icon: React.ReactNode; children: React.ReactNode; delay?: number }) {
  return (
    <div className="section-card" style={{
      background: "var(--surface-2, #181818)",
      borderRadius: 20, border: "1px solid var(--border, rgba(255,255,255,0.07))",
      marginBottom: 12, overflow: "hidden",
      animation: `fadeUp 0.4s ease backwards`,
      animationDelay: `${delay}ms`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "13px 16px",
        borderBottom: "1px solid var(--border, rgba(255,255,255,0.06))",
        color: "var(--muted, #777)",
      }}>
        {icon}
        <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.2px", color: "var(--muted, #777)" }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function SkeletonBlock({ height, delay = 0 }: { height: number; delay?: number }) {
  return (
    <div style={{
      height, borderRadius: 16,
      background: "linear-gradient(90deg, var(--surface-2,#1e1e1e) 25%, var(--surface-3,#252525) 50%, var(--surface-2,#1e1e1e) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      animationDelay: `${delay}ms`,
    }} />
  )
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [prefs, setPrefs] = useState<EmailPrefs>({ weekly_report_email: true, email_unsubscribed: false })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/profile")
      if (!res.ok) throw new Error("Failed")
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
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
    if (status === "unauthenticated") router.push("/auth/signin")
  }, [status, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/profile/email-prefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      })
      if (!res.ok) throw new Error("Save failed")
      const json = await res.json()
      if (!json.success) throw new Error(json.error || "Save failed")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast.success("Preferences saved")
    } catch {
      toast.error("Failed to save — try again")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <PageShell variant="default" title="Settings">
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
          <SkeletonBlock height={160} delay={0} />
          <SkeletonBlock height={120} delay={50} />
          <SkeletonBlock height={56} delay={100} />
        </div>
      </PageShell>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <PageShell variant="default" title="Settings">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .settings-page * { box-sizing: border-box; }
        .nav-row { transition: background 0.12s ease; }
        .nav-row:hover { background: rgba(255,255,255,0.03) !important; }
        .nav-row:active { background: rgba(255,255,255,0.06) !important; }
        .save-btn { transition: opacity 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease; }
        .save-btn:not(:disabled):hover { opacity: 0.92; box-shadow: 0 0 20px rgba(205,133,63,0.35); }
        .save-btn:not(:disabled):active { transform: scale(0.98); }
      `}</style>

      <div className="settings-page" style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px", animation: "fadeUp 0.35s ease" }}>

        <div style={{ padding: "20px 0 16px" }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--foreground, #f0ece4)", letterSpacing: "-0.3px" }}>Settings</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted, #777)" }}>Manage your account preferences</p>
        </div>

        <Section title="Email Preferences" icon={<IconMail />} delay={100}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", gap: 12,
            borderBottom: "1px solid var(--border, rgba(255,255,255,0.04))",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                <IconBell />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground, #f0ece4)" }}>Weekly Report</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted, #777)", lineHeight: 1.4 }}>Your nutrition summary every Monday morning</p>
            </div>
            <Toggle on={prefs.weekly_report_email && !prefs.email_unsubscribed} onChange={() => setPrefs(p => ({ ...p, weekly_report_email: !p.weekly_report_email }))} disabled={prefs.email_unsubscribed} />
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                <IconBellOff />
                <span style={{ fontSize: 14, fontWeight: 600, color: prefs.email_unsubscribed ? "var(--risk-red, #e05555)" : "var(--foreground, #f0ece4)" }}>Unsubscribe from all</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted, #777)", lineHeight: 1.4 }}>Stop all marketing and report emails</p>
            </div>
            <Toggle on={prefs.email_unsubscribed} onChange={() => setPrefs(p => ({ ...p, email_unsubscribed: !p.email_unsubscribed }))} danger />
          </div>
        </Section>

        <Section title="Account" icon={<IconUser />} delay={200}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", gap: 12,
            borderBottom: "1px solid var(--border, rgba(255,255,255,0.04))",
          }}>
            <span style={{ fontSize: 14, color: "var(--muted, #888)", fontWeight: 500 }}>Email</span>
            <span style={{ fontSize: 13, color: "var(--muted, #777)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>
              {session?.user?.email ?? "—"}
            </span>
          </div>
          <a href="/profile-setup" className="nav-row" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", textDecoration: "none",
            borderBottom: "1px solid var(--border, rgba(255,255,255,0.04))",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ color: "var(--clay, #cd853f)" }}><IconUser /></div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground, #f0ece4)" }}>Edit Profile</span>
            </div>
            <div style={{ color: "var(--muted-2, #666)" }}><IconChevronRight /></div>
          </a>
          <a href="/legal/privacy" className="nav-row" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", textDecoration: "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ color: "var(--moss, #6b8e5a)" }}><IconShield /></div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground, #f0ece4)" }}>Privacy & Data</span>
            </div>
            <div style={{ color: "var(--muted-2, #666)" }}><IconChevronRight /></div>
          </a>
        </Section>

        <Section title="Session" icon={<IconLogOut />} delay={300}>
          <button
            className="nav-row"
            onClick={() => {
              if (confirm("Sign out of Bio You?")) {
                import("next-auth/react").then(({ signOut }) => signOut({ callbackUrl: "/auth/signin" }))
              }
            }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 9,
              padding: "14px 16px", background: "none", border: "none",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ color: "var(--risk-red, #e05555)" }}><IconLogOut /></div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--risk-red, #e05555)" }}>Sign out</span>
          </button>
        </Section>

        <button
          className="save-btn"
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%", padding: "15px", borderRadius: 16, border: "none",
            background: saved ? "var(--moss, #6b8e5a)" : "var(--clay, #cd853f)",
            color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer", marginTop: 4,
            letterSpacing: "0.2px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background 0.2s ease",
          }}
        >
          {saving ? (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Saving…</>
          ) : saved ? (
            <><IconCheck /> Saved!</>
          ) : (
            "Save preferences"
          )}
        </button>
      </div>
    </PageShell>
  )
}
