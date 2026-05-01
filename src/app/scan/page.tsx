// src/app/scan/page.tsx
"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Scan } from 'lucide-react'

export default function ScanPage() {
  const router = useRouter()

  useEffect(() => {
    // Just redirect back to dashboard after 2 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 animate-pulse">
        <Scan className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Use the Scan Button!</h1>
      <p className="text-[#7a8fa6] text-center mb-4">
        Tap the green scan button at the bottom to scan products
      </p>
      <p className="text-sm text-emerald-400">Redirecting to dashboard...</p>
    </div>
  )
}