"use client"
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import PageShell from '@/components/PageShell'

interface ProfileData {
  name: string
  email: string
  age?: number
  gender?: string
  weight_kg?: number
  height_cm?: number
  activity_level?: string
  weight_goal?: string
  daily_calorie_goal?: number
  bmi?: number
  bmr?: number
  tdee?: number
  is_diabetic?: boolean
  has_bp?: boolean
  has_heart_disease?: boolean
  has_cholesterol?: boolean
  is_vegetarian?: boolean
  is_vegan?: boolean
  is_jain?: boolean
  allergies?: string[]
  goals?: string[]
  diet?: string[]
  condition?: string
}

const IconScale = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M5 21h14M5 13l7-5 7 5"/>
  </svg>
)
const IconFlame = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
  </svg>
)
const IconActivity = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const IconLeaf = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 014 13c0-4 2-7 7-9 5 2 9 5 9 11a7 7 0 01-9 5z"/><line x1="11" y1="20" x2="11" y2="13"/>
  </svg>
)
const IconAlert = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

function getBMICategory(bmi?: number): { label: string; color: string } {
  if (!bmi) return { label: "—", color: "#888" }
  if (bmi < 18.5) return { label: "Underweight", color: "#60a5fa" }
  if (bmi < 25)   return { label: "Healthy",     color: "#4ade80" }
  if (bmi < 30)   return { label: "Overweight",  color: "#fb923c" }
  return           { label: "Obese",             color: "#f87171" }
}

function formatEnum(val: string | undefined): string {
  if (!val) return "—"
  return val.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

function Section({ title, icon, children, delay = 0 }: { title: string; icon: string; children: React.ReactNode; delay?: number }) {
  return (
    <div className="section-card" style={{
      background: "var(--surface-2, #181818)",
      borderRadius: 20,
      border: "1px solid var(--border, rgba(255,255,255,0.07))",
      marginBottom: 12,
      overflow: "hidden",
      animation: `fadeUp 0.4s ease backwards`,
      animationDelay: `${delay}ms`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "13px 16px",
        borderBottom: "1px solid var(--border, rgba(255,255,255,0.06))",
      }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <h2 style={{
          margin: 0, fontSize: 11, fontWeight: 700,
          textTransform: "uppercase" as const, letterSpacing: "1.2px",
          color: "var(--text-muted, #777)",
        }}>{title}</h2>
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

function AnimatedStat({ value, accent }: { value: string; accent: string }) {
  const [display, setDisplay] = useState("0")
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node || animated.current) return
    animated.current = true

    const num = parseFloat(value)
    if (isNaN(num)) { setDisplay(value); return }

    const duration = 600
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const cur = num * eased
      setDisplay(num % 1 === 0 ? Math.round(cur).toString() : cur.toFixed(1))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])

  return <div ref={ref} style={{ fontSize: 28, fontWeight: 800, color: accent, lineHeight: 1, letterSpacing: "-0.5px" }}>{display}</div>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { data, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile")
      if (!res.ok) throw new Error("Failed")
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data as ProfileData
    },
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin")
  }, [status, router])

  const p = data
  const bmiInfo = getBMICategory(p?.bmi)

  const statCards = [
    { label: "BMI", value: p?.bmi?.toFixed(1) ?? "—", sub: bmiInfo.label, icon: <IconScale />, accent: "#cd853f", bg: "rgba(205,133,63,0.09)", border: "rgba(205,133,63,0.18)" },
    { label: "BMR", value: p?.bmr ? `${Math.round(p.bmr)}` : "—", sub: "base kcal/day", icon: <IconFlame />, accent: "#6b8e5a", bg: "rgba(107,142,90,0.09)", border: "rgba(107,142,90,0.18)" },
    { label: "TDEE", value: p?.tdee ? `${Math.round(p.tdee)}` : "—", sub: "total kcal/day", icon: <IconActivity />, accent: "#d4a017", bg: "rgba(212,160,23,0.09)", border: "rgba(212,160,23,0.18)" },
    { label: "Goal", value: p?.daily_calorie_goal ? `${p.daily_calorie_goal}` : "—", sub: "kcal target", icon: <IconTarget />, accent: "#b24a2f", bg: "rgba(178,74,47,0.09)", border: "rgba(178,74,47,0.18)" },
  ]

  const bodyRows = [
    { label: "Age",      value: p?.age ? `${p.age} yrs` : "—" },
    { label: "Gender",   value: formatEnum(p?.gender) },
    { label: "Weight",   value: p?.weight_kg ? `${p.weight_kg} kg` : "—" },
    { label: "Height",   value: p?.height_cm ? `${p.height_cm} cm` : "—" },
    { label: "Activity", value: formatEnum(p?.activity_level) },
    { label: "Goal",     value: formatEnum(p?.weight_goal) },
  ]

  const dietTags: string[] = [
    p?.is_vegetarian && "Vegetarian",
    p?.is_vegan && "Vegan",
    p?.is_jain && "Jain",
    ...(p?.diet ?? []),
  ].filter(Boolean) as string[]

  const conditions: string[] = [
    p?.is_diabetic && "Diabetes",
    p?.has_bp && "Blood Pressure",
    p?.has_heart_disease && "Heart Disease",
    p?.has_cholesterol && "High Cholesterol",
    p?.condition,
  ].filter(Boolean) as string[]

  const initials = p?.name
    ? p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : (session?.user?.name?.[0]?.toUpperCase() ?? "?")

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <PageShell variant="default" title="Profile">
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
          <SkeletonBlock height={88} delay={0} />
          <SkeletonBlock height={140} delay={50} />
          <SkeletonBlock height={200} delay={100} />
          <SkeletonBlock height={100} delay={150} />
        </div>
      </PageShell>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <PageShell variant="default" title="Profile">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.8); } 60% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes slideInRow { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .profile-page * { box-sizing: border-box; }
        .stat-card { transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: default; }
        .stat-card:active { transform: scale(0.97); }
        .pill-tag { animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) backwards; }
        .row-item { animation: slideInRow 0.3s ease backwards; }
        .row-item:last-child { border-bottom: none !important; }
        .edit-btn { transition: background 0.15s ease, opacity 0.15s ease; }
        .edit-btn:hover { opacity: 0.85; }
        .edit-btn:active { opacity: 0.7; }
      `}</style>

      <div className="profile-page" style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px", animation: "fadeUp 0.35s ease" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 0 18px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #cd853f 0%, #b24a2f 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#fff", flexShrink: 0,
            boxShadow: "0 4px 16px rgba(205,133,63,0.35)", letterSpacing: 1,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              margin: 0, fontSize: 18, fontWeight: 700,
              color: "var(--foreground, #f0ece4)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {p?.name ?? session?.user?.name ?? "Your Profile"}
            </h1>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--muted, #888)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {p?.email ?? session?.user?.email}
            </p>
          </div>
          <a href="/profile-setup" className="edit-btn" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "7px 12px", borderRadius: 99,
            background: "var(--surface-2, #1e1e1e)", border: "1px solid var(--border-2, rgba(255,255,255,0.08))",
            color: "var(--muted, #888)", fontSize: 12, fontWeight: 600,
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            <IconEdit /> Edit
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {statCards.map((c, i) => (
            <div key={c.label} className="stat-card" style={{
              borderRadius: 18, padding: "15px 14px 13px",
              background: c.bg, border: `1px solid ${c.border}`,
              animation: `fadeUp 0.35s ease backwards`,
              animationDelay: `${120 + i * 80}ms`,
            }}>
              <div style={{ color: c.accent, marginBottom: 8 }}>{c.icon}</div>
              <AnimatedStat value={c.value} accent={c.accent} />
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted, #777)", marginTop: 5 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted-2, #666)", marginTop: 1 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <Section title="Body Stats" icon="📏" delay={200}>
          {bodyRows.map((r, i) => (
            <div key={r.label} className="row-item" style={{
              animationDelay: `${300 + i * 50}ms`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid var(--border, rgba(255,255,255,0.04))",
            }}>
              <span style={{ fontSize: 14, color: "var(--muted, #888)", fontWeight: 500 }}>{r.label}</span>
              <span style={{ fontSize: 14, color: "var(--foreground, #f0ece4)", fontWeight: 600, textTransform: "capitalize" }}>{r.value}</span>
            </div>
          ))}
        </Section>

        {dietTags.length > 0 && (
          <Section title="Diet Preferences" icon="🥗" delay={300}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px" }}>
              {dietTags.map((t, i) => (
                <span key={t} className="pill-tag" style={{
                  animationDelay: `${400 + i * 60}ms`,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: "rgba(107,142,90,0.14)", color: "var(--moss, #7aad68)",
                  border: "1px solid rgba(107,142,90,0.24)",
                }}>
                  <IconLeaf /> {t}
                </span>
              ))}
            </div>
          </Section>
        )}

        {conditions.length > 0 && (
          <Section title="Health Conditions" icon="🩺" delay={400}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px" }}>
              {conditions.map((c, i) => (
                <span key={c} className="pill-tag" style={{
                  animationDelay: `${500 + i * 60}ms`,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: "rgba(220,60,60,0.1)", color: "var(--risk-red, #e05555)",
                  border: "1px solid rgba(220,60,60,0.2)",
                }}>
                  <IconAlert /> {c}
                </span>
              ))}
            </div>
          </Section>
        )}

        {(p?.allergies ?? []).length > 0 && (
          <Section title="Allergies" icon="⚠️" delay={500}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px" }}>
              {(p?.allergies ?? []).map((a, i) => (
                <span key={a} className="pill-tag" style={{
                  animationDelay: `${600 + i * 60}ms`,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: "rgba(220,60,60,0.1)", color: "var(--risk-red, #e05555)",
                  border: "1px solid rgba(220,60,60,0.2)",
                }}>
                  <IconAlert /> {a}
                </span>
              ))}
            </div>
          </Section>
        )}

        {!p && !isLoading && (
          <div style={{ textAlign: "center", padding: "40px 24px", color: "var(--muted, #777)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
            <p style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "var(--foreground, #f0ece4)" }}>Profile not set up yet</p>
            <a href="/profile-setup" style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 99,
              background: "var(--clay, #cd853f)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
            }}>Set up profile</a>
          </div>
        )}
      </div>
    </PageShell>
  )
}
