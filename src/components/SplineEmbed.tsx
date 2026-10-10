"use client"

import { useEffect, useRef } from "react"

type SplineEmbedProps = {
  url: string
  style?: React.CSSProperties
  autoPlay?: boolean
  cameraControl?: boolean
}

export function SplineEmbed({
  url,
  style,
  autoPlay = true,
  cameraControl = true,
}: SplineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear any existing content
    container.innerHTML = ""

    // Create Spline canvas root
    const root = document.createElement("div")
    root.style.width = "100%"
    root.style.height = "100%"
    root.style.position = "relative"

    // Create iframe with Spline embed
    const iframe = document.createElement("iframe")
    iframe.src = url
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "none"
    iframe.loading = "lazy"

    // Wait for iframe to load and initialize Spline
    iframe.onload = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (iframeDoc) {
        const splineScript = iframeDoc.createElement("script")
        splineScript.type = "text/javascript"
        splineScript.async = true
        splineScript.src = "https://cdn.spline.build/three/r128/three.js"

        const splineInit = iframeDoc.createElement("script")
        splineInit.type = "text/javascript"
        splineInit.innerHTML = `
          (function() {
            var finished = false;
            function initSpline() {
              if (finished) return;
              finished = true;
              if (window.Spline) {
                window.Spline.initialize({
                  canvas: document.querySelector('canvas.spline-canvas')
                });
              } else {
                setTimeout(initSpline, 100);
              }
            }
            initSpline();
          })();
        `

        root.appendChild(iframe)
        root.appendChild(splineScript)
        root.appendChild(splineInit)
      }
    }

    container.appendChild(root)

    return () => {
      container.innerHTML = ""
    }
  }, [url, containerRef])

  return <div ref={containerRef} style={style} />
}