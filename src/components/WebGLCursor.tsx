"use client"

import { useEffect, useRef } from "react"

type WebGLCursorProps = {
  elements?: string[]
  color?: string
  size?: number
}

export function WebGLCursor({
  elements = ["canvas", "a", "button", "input", "textarea"],
  color = "rgba(0, 255, 255, 0.6)",
  size = 20,
}: WebGLCursorProps) {
  useEffect(() => {
    const elems = elements
    if (!elems.includes("canvas") && document.querySelector("canvas")) {
      ;(elems as string[]).push("canvas")
    }

    const mouse = { x: 0, y: 0 }
    const cursor = document.createElement("div")
    cursor.style.position = "fixed"
    cursor.style.pointerEvents = "none"
    cursor.style.width = `${size}px`
    cursor.style.height = `${size}px`
    cursor.style.background = color
    cursor.style.borderRadius = "50%"
    cursor.style.transform = "translate(-50%, -50%)"
    cursor.style.mixBlendMode = "screen"
    cursor.style.transition = "width 0.2s, height 0.2s"
    cursor.style.zIndex = "9999"
    document.body.appendChild(cursor)

    const updateCursor = () => {
      cursor.style.left = `${mouse.x}px`
      cursor.style.top = `${mouse.y}px`
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.body.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      updateCursor()
    }

    document.addEventListener("mousemove", handleMouseMove)

    // Hover effect on specified elements
    elems.forEach((selector) => {
      const targets = document.querySelectorAll(selector)
      targets.forEach((target) => {
        target.addEventListener("mouseenter", () => {
          cursor.style.width = `${size + 30}px`
          cursor.style.height = `${size + 30}px`
        })
        target.addEventListener("mouseleave", () => {
          cursor.style.width = `${size}px`
          cursor.style.height = `${size}px`
        })
      })
    })

    return () => {
      document.body.removeChild(cursor)
      elems.forEach((selector) => {
        const targets = document.querySelectorAll(selector)
        targets.forEach((target) => {
          target.removeEventListener("mouseenter", () => {})
          target.removeEventListener("mouseleave", () => {})
        })
      })
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [elements, color, size])

  return null
}