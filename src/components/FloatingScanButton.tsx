"use client"

import { useRouter }   from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Camera }      from 'lucide-react'

const HIDDEN_PATHS = ['/scan', '/auth', '/signin']

export default function FloatingScanButton() {
  const router   = useRouter()
  const pathname = usePathname()

  if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null

  return (
    <button onClick={() => router.push('/scan')} className="fab-scan" aria-label="Scan a product">
      <Camera size={22} strokeWidth={1.8} color="#fff" />
    </button>
  )
}
