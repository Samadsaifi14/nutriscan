import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PillProps {
  children: ReactNode
  active?: boolean
  variant?: 'default' | 'healthy' | 'warning' | 'harmful' | 'moderate' | 'unhealthy'
  onClick?: () => void
  icon?: ReactNode
}

export function Pill({ children, active, variant = 'default', onClick, icon }: PillProps) {
  const variantClass = {
    default: active ? 'chip--active' : '',
    healthy: 'chip--healthy',
    warning: 'chip--warning',
    moderate: 'chip--warning',
    unhealthy: 'chip--harmful',
    harmful: 'chip--harmful',
  }[variant]

  const Tag = onClick ? 'button' : 'span'

  return (
    <Tag onClick={onClick} className={cn('chip', variantClass)}>
      {icon}
      {children}
    </Tag>
  )
}
