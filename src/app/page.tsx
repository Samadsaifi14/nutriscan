"use client"
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Phone3DMockup from '@/components/Phone3DMockup'

const FEATURES = [
  {
    icon: '🔬',
    title: 'AI Ingredient Analysis',
    desc: 'Scan any barcode to instantly detect harmful additives, preservatives, and artificial colors.',
  },
  {
    icon: '🇮🇳',
    title: 'Made for India',
    desc: 'FSSAI compliance checks, ICMR RDA comparisons, Indian brand barcode detection.',
  },
  {
    icon: '🌿',
    title: 'Healthier Alternatives',
    desc: 'Get curated Indian alternatives — from Maggi to millets, we\'ve got you covered.',
  },
  {
    icon: '📊',
    title: 'Track Your Nutrition',
    desc: 'Log meals, track macros, monitor streaks, and get weekly email reports.',
  },
  {
    icon: '🛒',
    title: 'Shop Smart',
    desc: 'Buy products directly from Amazon, Flipkart, Blinkit, Instamart, BigBasket & more.',
  },
  {
    icon: '👥',
    title: 'Community Powered',
    desc: 'Contribute missing products, validate submissions, and earn badges.',
  },
]

const BENTO_STATS = [
  { value: '50K+', label: 'Products Scanned' },
  { value: '10K+', label: 'Active Users' },
  { value: '1K+', label: 'Community Contributions' },
  { value: '30+', label: 'Indian Categories' },
]

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') return null
  if (session) return null

  return (
    <div style={{ background: 'var(--sand)' }}>
      {/* ── Hero ── */}
      <section className="app-container" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}>
          {/* Left: Copy */}
          <div>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--clay)',
              marginBottom: 16,
            }}>
              ✦ Know What You Eat
            </p>
            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(52px, 6vw, 80px)',
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
              lineHeight: 1,
              marginBottom: 24,
            }}>
              Scan.<br />
              <span style={{ color: 'var(--clay)' }}>Know.</span><br />
              Choose Better.
            </h1>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 300,
              fontSize: 17,
              lineHeight: 1.7,
              color: 'var(--bark-mid)',
              marginBottom: 40,
              maxWidth: 480,
            }}>
              India&apos;s first AI-powered food scanner. Instantly analyze packaged foods,
              detect harmful additives, and discover healthier Indian alternatives.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link href="/auth/signin" className="btn-primary">
                <span>Get Started Free →</span>
              </Link>
              <Link href="/auth/signin" className="btn-light">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right: 3D Phone */}
          <div style={{ height: 600, position: 'relative' }}>
            {/* Ambient orbs */}
            <div style={{
              position: 'absolute',
              top: -60,
              right: -40,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(196,113,74,0.12), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: -40,
              left: -60,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(61,92,46,0.10), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <Phone3DMockup />
          </div>
        </div>
      </section>

      {/* ── Marquee / Trust Bar ── */}
      <section style={{
        overflow: 'hidden',
        padding: '40px 0',
        borderTop: '1px solid rgba(44,31,15,0.06)',
        borderBottom: '1px solid rgba(44,31,15,0.06)',
      }}>
        <div className="marquee-track" style={{
          display: 'flex',
          gap: 60,
          width: 'max-content',
          animation: 'marquee 20s linear infinite',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--muted-2)',
        }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 60 }}>
              <span>✦ FSSAI Compliant</span>
              <span>✦ ICMR RDA Based</span>
              <span>✦ AI Powered</span>
              <span>✦ 100% Free</span>
              <span>✦ Indian Foods</span>
              <span>✦ Community Driven</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="app-container" style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--clay)',
            marginBottom: 12,
          }}>
            ✦ Everything You Need
          </p>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(38px, 4vw, 58px)',
            letterSpacing: '-0.04em',
            color: 'var(--ink)',
          }}>
            Scan. Analyze.<br />
            <span style={{ color: 'var(--clay)' }}>Transform.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {/* First card spans 2 cols */}
          <div className="feature-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🧬</div>
            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '-0.04em',
              color: 'var(--bark)',
              marginBottom: 8,
            }}>
              AI-Powered Health Engine
            </h3>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'var(--bark-mid)',
            }}>
              Our deterministic health engine scores products on nutrition quality,
              ingredient safety, and processing level — with FSSAI compliance and
              child safety checks built in. AI enhances results with personalized
              insights, but never replaces the core scoring.
            </p>
          </div>

          {FEATURES.slice(0, 2).map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '-0.04em',
                color: 'var(--bark)',
                marginBottom: 8,
              }}>{f.title}</h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300,
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--bark-mid)',
              }}>{f.desc}</p>
            </div>
          ))}

          {FEATURES.slice(2).map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '-0.04em',
                color: 'var(--bark)',
                marginBottom: 8,
              }}>{f.title}</h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300,
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--bark-mid)',
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bento Grid ── */}
      <section style={{
        background: 'var(--cream)',
        padding: '100px 48px',
      }}>
        <div className="app-container" style={{ padding: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--clay)',
              marginBottom: 12,
            }}>
              ✦ Trusted By Thousands
            </p>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(38px, 4vw, 58px)',
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
            }}>
              Built for India.<br />
              <span style={{ color: 'var(--clay)' }}>Built for You.</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}>
            {/* Big dark card */}
            <div className="bento-card-dark" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--clay-light)',
                marginBottom: 16,
              }}>
                ✦ India-First Approach
              </p>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: '-0.04em',
                color: 'var(--cream)',
                marginBottom: 16,
              }}>
                70+ Indian Brands<br />
                Mapped by Barcode
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300,
                fontSize: 15,
                lineHeight: 1.7,
                color: 'rgba(250,247,242,0.6)',
              }}>
                From Amul to Britannia, Parle to Patanjali — we recognize
                Indian barcode prefixes and map them to brands automatically.
                Our database is curated for the Indian palate.
              </p>
              <div style={{ marginTop: 32, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['ICMR RDA', 'FSSAI', 'Ayush', 'Vegan', 'FSSAI License'].map(tag => (
                  <span key={tag} className="chip-safe" style={{ color: 'var(--clay-light)', border: '1px solid rgba(232,149,110,0.2)', background: 'rgba(232,149,110,0.08)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            {BENTO_STATS.map((stat, i) => (
              <div key={i} className="bento-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: '-0.04em',
                  color: 'var(--clay)',
                  marginBottom: 4,
                }}>{stat.value}</p>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: 13,
                  color: 'var(--muted-2)',
                }}>{stat.label}</p>
              </div>
            ))}

            {/* Wide card */}
            <div className="bento-card" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 36 }}>🛒</div>
                <div>
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: '-0.04em',
                    color: 'var(--bark)',
                    marginBottom: 4,
                  }}>
                    Shop from Indian Marketplaces
                  </h3>
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 300,
                    fontSize: 14,
                    color: 'var(--bark-mid)',
                  }}>
                    Amazon · Flipkart · Blinkit · Instamart · BigBasket · Zepto · JioMart
                  </p>
                </div>
              </div>
            </div>

            {/* Single cards */}
            <div className="bento-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: '-0.04em',
                color: 'var(--bark)',
                marginBottom: 4,
              }}>
                8 Badges
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300,
                fontSize: 13,
                color: 'var(--bark-mid)',
              }}>
                Earn rewards for contributing
              </p>
            </div>

            <div className="bento-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📧</div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: '-0.04em',
                color: 'var(--bark)',
                marginBottom: 4,
              }}>
                Weekly Reports
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300,
                fontSize: 13,
                color: 'var(--bark-mid)',
              }}>
                Nutrition summaries by email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="app-container" style={{
        paddingTop: 100,
        paddingBottom: 100,
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--clay)',
          marginBottom: 16,
        }}>
          ✦ Start Your Journey
        </p>
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(38px, 4vw, 58px)',
          letterSpacing: '-0.04em',
          color: 'var(--ink)',
          marginBottom: 20,
        }}>
          Ready to Know<br />
          <span style={{ color: 'var(--clay)' }}>What You Eat?</span>
        </h2>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 300,
          fontSize: 17,
          lineHeight: 1.7,
          color: 'var(--bark-mid)',
          marginBottom: 40,
          maxWidth: 480,
          margin: '0 auto 40px',
        }}>
          Join thousands of health-conscious Indians who scan before they eat.
          Free. No ads. No subscription.
        </p>
        <Link href="/auth/signin" className="btn-primary" style={{ display: 'inline-block' }}>
          <span>Get Started Free →</span>
        </Link>
      </section>
    </div>
  )
}
