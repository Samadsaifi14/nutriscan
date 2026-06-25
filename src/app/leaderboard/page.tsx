"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageShell from '@/components/PageShell'
import { supabase } from '@/lib/supabase'

interface LeaderboardUser {
  user_id: string
  name: string
  image: string
  contributions_count: number
  validated_count: number
  total_impact: number
  city: string
  badges: string[]
}

const PERIODS = ['Weekly', 'Monthly', 'All time']

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(0)

  useEffect(() => {
    fetchLeaderboard()
  }, [period])

  async function fetchLeaderboard() {
    setLoading(true)
    let query = supabase
      .from('user_profiles')
      .select('*')
      .order('total_impact', { ascending: false })
      .limit(50)

    const { data, error } = await query

    if (!error && data) {
      setUsers(data.map(u => ({
        user_id: u.user_id,
        name: u.name || 'Anonymous',
        image: u.image || '',
        contributions_count: u.contributions_count || 0,
        validated_count: u.validated_count || 0,
        total_impact: u.total_impact || 0,
        city: u.city || 'India',
        badges: u.badges || [],
      })))
    }
    setLoading(false)
  }

  const currentUserId = (session?.user as any)?.id
  const currentUserIdx = currentUserId ? users.findIndex(u => u.user_id === currentUserId) : -1
  const currentUser = currentUserIdx >= 0 ? users[currentUserIdx] : null

  return (
    <PageShell variant="default" title="Leaderboard" right={<span className="text-sm text-[var(--sand)]">👥</span>}>

      {/* Period tabs */}
      <div className="flex border-b border-[var(--border)] flex-shrink-0">
        {PERIODS.map((t, i) => (
          <button key={t} onClick={() => setPeriod(i)}
              className={`flex-1 h-8 text-xs font-bold border-b-2 transition-colors ${
              period === i
                ? 'text-[var(--clay)] border-[var(--clay)]'
                : 'text-[var(--muted)] border-transparent'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* My rank card */}
      {currentUser && (
        <div className="mx-3 mt-3 mb-1 p-3 rounded-xl border border-[var(--clay)] bg-[var(--surface)] flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-bold text-[var(--clay)]">#{currentUserIdx + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--clay)] to-[var(--clay-dim)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {(currentUser.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[var(--foreground)]">{currentUser.name}</span>
            <span className="text-xs text-[var(--sand)] block">{currentUser.total_impact} pts · {currentUser.contributions_count} scans</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-[var(--clay)]/15 text-[var(--clay)] border border-[var(--clay)]/25 w-fit">↑ 3 places</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-11 bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">🌟</span>
            <p className="text-sm font-bold text-[var(--foreground)] mb-1">Be the first!</p>
            <p className="text-xs text-[var(--sand)] mb-4">Contribute products to join</p>
            <button onClick={() => router.push('/contribute')}
              className="px-5 py-2 bg-[var(--clay)] text-white font-bold rounded-xl text-xs">
              Start Contributing
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {users.map((u, i) => (
              <div key={u.user_id}
                className={`flex items-center gap-3 px-3 py-2 border-b border-[var(--border)] ${
                  currentUserId === u.user_id ? 'bg-[var(--clay)]/5' : ''
                }`}>
                <span className={`text-xs font-bold w-5 text-center ${i < 3 ? 'text-base' : 'text-[var(--muted)]'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--clay)] to-[var(--clay-dim)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {(u.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[var(--foreground)]">{u.name}</span>
                  <span className="text-xs text-[var(--sand)] block">{u.contributions_count} scans</span>
                </div>
                <span className="text-xs font-bold text-[var(--clay)]">{u.total_impact} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </PageShell>
  )
}
