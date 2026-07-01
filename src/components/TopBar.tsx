'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface TopBarProps {
  title?: string
  left?: ReactNode
  right?: ReactNode
  showBack?: boolean
  noBorder?: boolean
  transparent?: boolean
}

export function TopBar({ title, left, right, showBack, noBorder, transparent }: TopBarProps) {
  const router = useRouter()
  return (
    <header
      className={cn(
        'topbar',
        transparent && 'topbar--transparent',
        noBorder && 'topbar--noBorder'
      )}
    >
      <div className="topbar__left">
        {showBack ? (
          <button
            aria-label="Go back"
            onClick={() => router.back()}
            className="icon-btn"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          left
        )}
      </div>
      {title && <h1 className="topbar__title truncate">{title}</h1>}
      <div className="topbar__right">{right}</div>
    </header>
  )
}
