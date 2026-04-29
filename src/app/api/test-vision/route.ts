import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key' })

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  )
  const data = await res.json()

  // Extract just model names that support generateContent
  const models = data.models
    ?.filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m: any) => m.name)

  return NextResponse.json({ models })
}