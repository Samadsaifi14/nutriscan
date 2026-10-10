"use client"

import { SplineEmbed } from "@/components/SplineEmbed"
import { GSAPTextReveal } from "@/components/GSAPTextReveal"
import { WebGLCursor } from "@/components/WebGLCursor"

type Option1Props = {
  splineUrl: string
}

export function Option1ImmersiveLanding({ splineUrl }: Option1Props) {
  return (
    <section className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-black">
      <SplineEmbed url={splineUrl} style={{ height: "500px" }} autoPlay cameraControl />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-white">
        <GSAPTextReveal
          selector=".text-hero"
          stagger={0.2}
          duration={1}
          offset={30}
        />

        <div className="mt-6 text-lg opacity-80">
          Scroll through the molecular scene to explore the story of biological input → analysis → interpretable evidence
        </div>

        <GSAPTextReveal
          selector=".landing-primary"
          stagger={0.3}
          duration={0.8}
          offset={50}
        />
      </div>

      <WebGLCursor elements={["canvas", "a", "button"]} color="rgba(0, 255, 255, 0.4)" size={16} />
    </section>
  )
}