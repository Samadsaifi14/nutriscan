import { useEffect } from 'react'

export function use3DPage() {
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        document.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
          const depth = parseFloat(el.dataset.depth ?? '0')
          el.style.transform = `translateY(${scrollY * depth * -1}px) translateZ(0)`
        })
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}
