"use client"

import { useEffect, useRef, useState } from 'react'

export default function Phone3DMockup() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMouseX(x)
      setMouseY(y)
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div style={{ perspective: '1200px' }} className="w-full h-full flex items-center justify-center">
      <div
        ref={sceneRef}
        className="phone-scene"
        style={{
          transformStyle: 'preserve-3d',
          animation: 'phoneFloat 6s ease-in-out infinite',
          transform: `rotateY(${-12 + mouseX * 8}deg) rotateX(${5 - mouseY * 4}deg)`,
        }}
      >
        <div
          className="phone-outer"
          style={{
            width: 280,
            height: 580,
            background: '#1A1208',
            borderRadius: 40,
            boxShadow: '40px 60px 80px rgba(26,18,8,0.35), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)',
            padding: 12,
            position: 'relative' as const,
          }}
        >
          {/* Notch */}
          <div style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 24,
            background: '#1A1208',
            borderRadius: '0 0 16px 16px',
            zIndex: 10,
          }} />

          {/* Screen */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 28,
            background: 'linear-gradient(180deg, #3D5C2E 0%, #C4714A 40%, #2C1F0F 100%)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            position: 'relative' as const,
          }}>
            {/* Mock scan UI */}
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.5)',
              }} />
            </div>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 20,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.04em',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              HealthOX
            </div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 11,
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
            }}>
              Scan. Know. Choose Better.
            </div>
            {/* Scan line animation */}
            <div style={{
              position: 'absolute',
              left: 40,
              right: 40,
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(250,247,242,0.6), transparent)',
              animation: 'scanAnim 2.5s ease-in-out infinite',
            }} />
          </div>
        </div>

        {/* Floating tag pills */}
        <TagPill index={0} top={-20} left={-80}>✦ 100% Free</TagPill>
        <TagPill index={1} top={60} right={-90}>✦ AI Powered</TagPill>
        <TagPill index={2} top={260} left={-70}>✦ Indian Foods</TagPill>
      </div>
    </div>
  )
}

function TagPill({
  children, index, top, left, right,
}: {
  children: React.ReactNode
  index: number
  top?: number
  left?: number
  right?: number
}) {
  const style: React.CSSProperties = {
    position: 'absolute',
    top,
    ...(left !== undefined ? { left } : {}),
    ...(right !== undefined ? { right } : {}),
    background: '#FAF7F2',
    color: '#2C1F0F',
    padding: '8px 16px',
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'DM Sans, sans-serif',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(26,18,8,0.1)',
    opacity: 0,
    animation: `slideUp 0.6s cubic-bezier(.16,1,.3,1) ${0.3 + index * 0.15}s forwards`,
  }
  return <div style={style}>{children}</div>
}
