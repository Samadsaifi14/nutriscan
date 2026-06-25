"use client"

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface TopBarProps {
  title?:       string | null
  left?:        React.ReactNode
  right?:       React.ReactNode
  showBack?:    boolean
  noBorder?:    boolean
  transparent?: boolean
  className?:   string
}

export default function TopBar({
  title,
  left,
  right,
  showBack    = false,
  noBorder    = false,
  transparent = false,
  className   = '',
}: TopBarProps) {
  const router = useRouter()

  const leftSlot = left ?? (
    showBack ? (
      <button onClick={() => router.back()} className="icon-btn" aria-label="Go back">
        <ArrowLeft size={18} />
      </button>
    ) : (
      <div style={{ width: 36 }} />
    )
  )

  const rightSlot = right ?? <div style={{ width: 36 }} />

  return (
    <header
      className={`topbar ${transparent ? 'topbar--transparent' : ''} ${noBorder ? 'border-b-0' : ''} ${className}`}
    >
      <div className="topbar__left">{leftSlot}</div>
      {title && <h1 className="topbar__title">{title}</h1>}
      <div className="topbar__right">{rightSlot}</div>
    </header>
  )
}
