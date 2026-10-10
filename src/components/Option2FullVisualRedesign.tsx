"use client"

import { SplineEmbed } from "@/components/SplineEmbed"
import { GSAPTextReveal } from "@/components/GSAPTextReveal"
import { WebGLCursor } from "@/components/WebGLCursor"

type Option2Props = {
  splineUrls: Record<string, string>
  pageTitle: string
}

export function Option2FullVisualRedesign({ splineUrls, pageTitle }: Option2Props) {
  const sceneKeys = Object.keys(splineUrls)

  return (
    <section className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-black">
      {sceneKeys.map((key, index) => (
        <SplineEmbed
          url={splineUrls[key]!}
          key={key}
          style={{ height: index === 0 ? "600px" : "400px" }}
          autoPlay
          cameraControl
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 text-white">
        <GSAPTextReveal selector={`h1`} stagger={0.15} duration={1} />

        <p className="mt-6 text-lg opacity-80">
          {pageTitle} — scroll-driven 3D experience built with Spline and GSAP
        </p>

        <GSAPTextReveal selector=".secondary-text" stagger={0.2} duration={0.8} offset={30} />
      </div>

      <WebGLCursor elements={["canvas", "a", "button", "input"]} color="rgba(0, 255, 255, 0.5)" size={20} />
    </section>
  )
}