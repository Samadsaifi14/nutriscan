import { useEffect, useRef } from 'react'

export function useScrollReveal(threshold = 0.15) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = containerRef.current ?? document
    const targets = root.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-stagger')
    if (!targets.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [threshold])

  return containerRef
}
