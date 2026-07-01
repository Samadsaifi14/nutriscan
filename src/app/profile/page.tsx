'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { HealthScoreRing } from '@/components/HealthScoreRing'
import { SkeletonDashboard } from '@/components/Skeleton'
import { Settings, User, Award, Download, Trash, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile')
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  if (status === 'loading') return <PageShell title="Profile" showBack><SkeletonDashboard /></PageShell>

  const user = session?.user
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() ?? '?'

  const menuItems = [
    { label: 'Profile Setup', icon: <User size={16} />, href: '/profile-setup' },
    { label: 'Badges', icon: <Award size={16} />, href: '/profile-setup' },
    { label: 'Settings', icon: <Settings size={16} />, href: '/settings' },
    { label: 'Export Data', icon: <Download size={16} />, href: '/settings' },
    { label: 'Delete Account', icon: <Trash size={16} />, href: '/settings', dangerous: true },
  ]

  return (
    <PageShell title="Profile" showBack>
      <div className="card row--md" style={{ marginBottom: 24 }}>
        <div className="avatar avatar--lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, background: 'linear-gradient(135deg, var(--clay), var(--clay-dim))', color: '#fff' }}>
          {initials}
        </div>
        <div className="stack--sm flex-1">
          <span className="text-body" style={{ fontWeight: 700 }}>{user?.name ?? 'User'}</span>
          <span className="text-xs" style={{ color: 'var(--sand)' }}>{user?.email}</span>
        </div>
        <HealthScoreRing score={profile?.overallScore ?? 7} size="sm" />
      </div>

      <div className="stack--sm">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="card card--sm row--md"
            style={{ justifyContent: 'space-between', ...(item.dangerous ? { borderColor: 'rgba(192,64,40,0.3)' } : {}) }}
            onClick={() => router.push(item.href)}
          >
            <div className="row--sm">
              <div className="icon-btn" style={{ width: 36, height: 36, color: item.dangerous ? 'var(--rust)' : 'var(--sand)' }}>
                {item.icon}
              </div>
              <span className="text-sm" style={{ fontWeight: 600, color: item.dangerous ? 'var(--rust)' : 'var(--cream)' }}>
                {item.label}
              </span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
          </button>
        ))}
      </div>
    </PageShell>
  )
}
