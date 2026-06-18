// src/app/leaderboard/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

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

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all')

  useEffect(() => {
    fetchLeaderboard()
  }, [timeFilter])

  async function fetchLeaderboard() {
    setLoading(true)
    
    let query = supabase
      .from('user_profiles')
      .select('*')
      .order('total_impact', { ascending: false })
      .limit(50)

    const { data, error } = await query

    if (!error && data) {
      // Fetch user details from auth
      const userIds = data.map(u => u.user_id)
      
      // For now, just use the profile data with placeholder names
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

  function getRankEmoji(rank: number): string {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}`
  }

  // Get current user's rank
  const currentUserId = (session?.user as any)?.id
  const currentUserRank = currentUserId
    ? users.findIndex(u => u.user_id === currentUserId) + 1 
    : null

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-amber-500/20 to-transparent px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black">🏆 Leaderboard</h1>
          <div className="text-sm text-[#7a8fa6]">India</div>
        </div>
        
        {/* My Rank Card */}
        {session && currentUserRank && currentUserRank <= 50 && (
          <div className="bg-gradient-to-r from-[var(--clay)]/20 to-purple-500/20 border border-[var(--clay)]/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--clay)]/30 flex items-center justify-center text-xl font-bold">
                {getRankEmoji(currentUserRank)}
              </div>
              <div>
                <p className="text-sm font-bold text-[#f0f4f8]">Your Rank</p>
                <p className="text-xs text-[#7a8fa6]">India #{currentUserRank}</p>
              </div>
            </div>
          </div>
        )}

        {/* Time filter */}
        <div className="flex gap-2">
          {(['all', 'month', 'week'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                timeFilter === t 
                  ? 'bg-[var(--clay)] text-white' 
                  : 'bg-[#1a1f28] text-[#7a8fa6]'
              }`}
            >
              {t === 'all' ? 'All Time' : t === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-8 pt-4">
            {/* 2nd */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#2a3545] mx-auto mb-2 flex items-center justify-center text-2xl">
                {users[1].image ? <img src={users[1].image} alt={users[1].name} className="w-full h-full rounded-full object-cover" /> : '🥈'}
              </div>
              <p className="text-xs font-bold text-[#f0f4f8] truncate max-w-[80px] mx-auto">{users[1].name}</p>
              <p className="text-[10px] text-amber-400">{users[1].total_impact} impact</p>
            </div>
            
            {/* 1st */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-500/30 to-amber-500/10 mx-auto mb-2 flex items-center justify-center text-3xl border-2 border-amber-500">
                {users[0].image ? <img src={users[0].image} alt={users[0].name} className="w-full h-full rounded-full object-cover" /> : '🥇'}
              </div>
              <p className="text-sm font-black text-[#f0f4f8] truncate max-w-[100px] mx-auto">{users[0].name}</p>
              <p className="text-[10px] text-amber-400">{users[0].total_impact} impact</p>
            </div>
            
            {/* 3rd */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#2a3545] mx-auto mb-2 flex items-center justify-center text-2xl">
                {users[2].image ? <img src={users[2].image} alt={users[2].name} className="w-full h-full rounded-full object-cover" /> : '🥉'}
              </div>
              <p className="text-xs font-bold text-[#f0f4f8] truncate max-w-[80px] mx-auto">{users[2].name}</p>
              <p className="text-[10px] text-amber-400">{users[2].total_impact} impact</p>
            </div>
          </div>
        )}

        {/* Rest of leaderboard */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🌟</div>
            <h2 className="text-lg font-bold text-[#f0f4f8] mb-2">Be the First!</h2>
            <p className="text-sm text-[#7a8fa6]">Contribute products to top the leaderboard</p>
            <button 
              onClick={() => router.push('/contribute')}
              className="mt-4 px-6 py-2 bg-[var(--clay)] text-white font-bold rounded-xl"
            >
              Start Contributing
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {users.slice(3).map((user, idx) => (
              <div 
                key={user.user_id} 
                className={`flex items-center gap-3 p-3 bg-[#161a20] border border-[#2a3545] rounded-xl ${
                  currentUserId === user.user_id ? 'border-[var(--clay)]/50' : ''
                }`}
              >
                <div className="w-8 text-center text-sm font-bold text-[#7a8fa6]">
                  {idx + 4}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-[#2a3545] flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#f0f4f8] truncate">{user.name}</p>
                  <p className="text-[10px] text-[#7a8fa6]">
                    {user.contributions_count} contributions · {user.city}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-black text-[var(--clay)]">{user.total_impact}</p>
                  <p className="text-[10px] text-[#7a8fa6]">impact</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 p-4 bg-[#161a20] border border-[#2a3545] rounded-xl text-center">
          <p className="text-sm text-[#7a8fa6] mb-3">Want to climb the ranks?</p>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/contribute')}
              className="flex-1 py-2.5 bg-[var(--clay)] text-white font-bold rounded-lg text-sm"
            >
              📝 Contribute
            </button>
            <button 
              onClick={() => router.push('/validate')}
              className="flex-1 py-2.5 bg-purple-500 text-white font-bold rounded-lg text-sm"
            >
              ✅ Validate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}