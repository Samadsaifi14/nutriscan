'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { Bell, Mail, Download, Trash, Sun, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const { data: session } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)

  async function handleExport() {
    try {
      const res = await fetch('/api/profile/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'healthox-data.json'
      a.click()
      toast.success('Data exported')
    } catch {
      toast.error('Export failed')
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure? This cannot be undone.')) return
    try {
      await fetch('/api/profile/delete', { method: 'DELETE' })
      router.push('/')
    } catch {
      toast.error('Delete failed')
    }
  }

  type SectionItem = { icon: React.ReactNode; label: string; right?: React.ReactNode; onClick?: () => void; dangerous?: boolean }
  const sections: { title: string; items: SectionItem[] }[] = [
    { title: 'Preferences', items: [
      { icon: <Bell size={16} />, label: 'Notifications', right: (
        <div className={`toggle ${notifications ? 'toggle--on' : ''}`} onClick={() => setNotifications(!notifications)} style={{ cursor: 'pointer' }}>
          <div className="toggle__knob" />
        </div>
      )},
      { icon: <Mail size={16} />, label: 'Email Preferences', right: <ChevronRight size={14} style={{ color: 'var(--muted)' }} />, onClick: () => router.push('/settings') },
      { icon: <Sun size={16} />, label: 'Theme', right: <span className="text-xs" style={{ color: 'var(--muted)' }}>Dark</span> },
    ]},
    { title: 'Data', items: [
      { icon: <Download size={16} />, label: 'Export Data', onClick: handleExport },
    ]},
    { title: 'Account', items: [
      { icon: <Trash size={16} />, label: 'Delete Account', dangerous: true, onClick: handleDelete },
    ]},
  ]

  return (
    <PageShell title="Settings" showBack>
      <div className="stack--md">
        {sections.map((section) => (
          <div key={section.title}>
            <span className="text-2xs" style={{ color: 'var(--muted)', marginBottom: 8, display: 'block' }}>{section.title}</span>
            <div className="stack--sm">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="card card--sm row--md"
                  style={{ justifyContent: 'space-between', cursor: item.onClick ? 'pointer' : 'default', borderColor: item.dangerous ? 'rgba(192,64,40,0.3)' : undefined }}
                  onClick={item.onClick}
                >
                  <div className="row--sm">
                    <div className="icon-btn" style={{ width: 36, height: 36, color: item.dangerous ? 'var(--rust)' : 'var(--sand)' }}>
                      {item.icon}
                    </div>
                    <span className="text-sm" style={{ fontWeight: 600, color: item.dangerous ? 'var(--rust)' : 'var(--cream)' }}>
                      {item.label}
                    </span>
                  </div>
                  {item.right}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
