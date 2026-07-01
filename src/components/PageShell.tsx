'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TopBar } from './TopBar'
import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  variant?: 'default' | 'bare' | 'no-header' | 'fullscreen'
  title?: string
  left?: ReactNode
  right?: ReactNode
  showBack?: boolean
  noBorder?: boolean
  transparentTop?: boolean
  className?: string
}

export function PageShell({
  children,
  variant = 'default',
  title,
  left,
  right,
  showBack,
  noBorder,
  transparentTop,
  className,
}: PageShellProps) {
  if (variant === 'fullscreen') {
    return <div className="scan-overlay">{children}</div>
  }

  return (
    <>
      {variant === 'default' && (
        <TopBar
          title={title}
          left={left}
          right={right}
          showBack={showBack}
          noBorder={noBorder}
          transparent={transparentTop}
        />
      )}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'page px-page',
          variant === 'default' && 'pb-[calc(var(--footer-offset)+24px)]',
          variant === 'default' && 'pt-[calc(var(--header-offset)+16px)]',
          variant === 'bare' && 'pt-[calc(var(--header-offset)+16px)] pb-[calc(var(--footer-offset)+24px)]',
          variant === 'no-header' && 'pb-[calc(var(--footer-offset)+24px)]',
          className
        )}
      >
        {children}
      </motion.main>
    </>
  )
}
