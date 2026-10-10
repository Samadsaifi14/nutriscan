"use client"

import { SplineEmbed } from "@/components/SplineEmbed"
import { GSAPTextReveal } from "@/components/GSAPTextReveal"
import { WebGLCursor } from "@/components/WebGLCursor"

type Option3Props = {
  steps: {
    title: string
    description: string
    splineUrl: string
    icon?: string
  }[]
}

export function Option3ScientificStorytelling({ steps }: Option3Props) {
  return (
    <section className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-black">
      {steps.map((step, index) => (
        <div key={index} className="relative pt-20 pb-30">
          <SplineEmbed
            url={step.splineUrl}
            style={{ height: "400px", marginBottom: "2rem" }}
            autoPlay
            cameraControl
          />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <GSAPTextReveal selector={`h2: nth-of-type(${index + 1})`} duration={1} />

            <p className="mt-4 text-lg opacity-80">
              {step.description}
            </p>
          </div>
        </div>
      ))}

      <div className="relative pt-32">
        <WebGLCursor elements={["canvas", "a", "button"]} color="rgba(0, 255, 255, 0.4)" size={16} />
      </div>
    </section>
  )
}