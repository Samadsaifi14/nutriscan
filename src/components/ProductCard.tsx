'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Pill } from './Pill'
import { scoreToRating } from '@/lib/utils'
import type { Product, Analysis } from '@/types/scanResult'

interface ProductCardProps {
  product: Pick<Product, 'name' | 'brand' | 'image_url'>
  analysis: Pick<Analysis, 'health_score' | 'health_rating'>
  onClick?: () => void
}

export function ProductCard({ product, analysis, onClick }: ProductCardProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 22 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 22 })

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 6)
    rotateX.set(-py * 6)
  }

  function handlePointerLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  const rating = scoreToRating(analysis.health_score ?? 5)
  const ringColor = { healthy: 'var(--moss)', moderate: 'var(--amber)', unhealthy: 'var(--rust)' }[rating] ?? 'var(--amber)'
  const pillVariant = { healthy: 'healthy' as const, moderate: 'warning' as const, unhealthy: 'harmful' as const }[rating]

  return (
    <motion.button
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, perspective: 800, width: '100%', textAlign: 'left' }}
      whileTap={{ scale: 0.98 }}
      className="product-card"
    >
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          width={56}
          height={56}
          className="product-card__thumb"
        />
      ) : (
        <div className="product-card__thumb" />
      )}
      <div className="product-card__body">
        <p className="product-card__name truncate">{product.name}</p>
        <p className="product-card__brand truncate">{product.brand}</p>
        <div className="product-card__tags">
          <Pill variant={pillVariant}>{analysis.health_score}/10</Pill>
        </div>
      </div>
      <div
        aria-hidden="true"
        style={{
          width: 8, height: 8, borderRadius: 9999, background: ringColor,
          boxShadow: `0 0 8px ${ringColor}`, flexShrink: 0,
        }}
      />
    </motion.button>
  )
}
