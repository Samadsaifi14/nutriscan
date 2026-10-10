"use client"

import { useEffect } from "react"
import { gsap } from "gsap"

type GSAPTextRevealProps = {
  selector: string
  stagger?: number
  duration?: number
  offset?: number
}

export function GSAPTextReveal({
  selector,
  stagger = 0.1,
  duration = 0.8,
  offset = 0,
}: GSAPTextRevealProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce").matches) {
      return
    }

    const elements = document.querySelectorAll(selector)
    if (elements.length === 0) return

    gsap.fromTo(
      elements,
      { opacity: 0, y: offset || 20 },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: "power3.out",
        overwrite: "auto",
      }
    )
  }, [selector, stagger, duration, offset])

  return null
}