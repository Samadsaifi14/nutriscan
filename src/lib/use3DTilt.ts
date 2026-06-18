import { useRef, useCallback, useEffect } from 'react'

interface TiltOptions {
  max?: number
  speed?: number
  scale?: number
  glare?: boolean
  mobile?: boolean
}

export function use3DTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const { max = 12, speed = 400, scale = 1.02, mobile = false } = options
  const ref = useRef<T>(null)
  const frameRef = useRef<number>(0)

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current
      if (!el) return
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (clientX - cx) / (rect.width / 2)
        const dy = (clientY - cy) / (rect.height / 2)
        el.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease'
        el.style.transform = `perspective(1000px) rotateX(${-dy * max}deg) rotateY(${dx * max}deg) scale(${scale})`
      })
    },
    [max, scale]
  )

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frameRef.current)
    el.style.transition = `transform ${speed}ms cubic-bezier(0.16,1,0.3,1), box-shadow ${speed}ms cubic-bezier(0.16,1,0.3,1)`
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [speed])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onMouseLeave = () => handleLeave()
    const onTouchMove = (e: TouchEvent) => {
      if (!mobile) return
      const t = e.touches[0]
      handleMove(t.clientX, t.clientY)
    }
    const onTouchEnd = () => handleLeave()
    el.addEventListener('mousemove', onMouseMove, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave, { passive: true })
    if (mobile) {
      el.addEventListener('touchmove', onTouchMove, { passive: true })
      el.addEventListener('touchend', onTouchEnd, { passive: true })
    }
    return () => {
      cancelAnimationFrame(frameRef.current)
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      if (mobile) {
        el.removeEventListener('touchmove', onTouchMove)
        el.removeEventListener('touchend', onTouchEnd)
      }
    }
  }, [handleMove, handleLeave, mobile])

  return ref
}
