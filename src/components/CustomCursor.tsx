"use client"

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let mx = 0, my = 0
    let rx = 0, ry = 0

    const onMouse = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const anim = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px'
        dotRef.current.style.top = my + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px'
        ringRef.current.style.top = ry + 'px'
      }
      rafRef.current = requestAnimationFrame(anim)
    }

    window.addEventListener('mousemove', onMouse)
    rafRef.current = requestAnimationFrame(anim)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#C4714A',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          zIndex: 10000,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s, height 0.15s',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '0.5px solid #2C1F0F',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s, height 0.15s, border-color 0.15s',
        }}
      />
    </>
  )
}
