import { NextRequest, NextResponse } from 'next/server'
import { callGeminiVision } from '@/lib/gemini'

export async function GET(req: NextRequest) {
  try {
    const { text } = await callGeminiVision(
      'What do you see? Reply in JSON: {"status": "ok", "message": "describe what you see"}',
      // 1x1 white pixel as base64 — just tests if the API connection works
      '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=',
      { temperature: 0.1, maxTokens: 100 }
    )
    return NextResponse.json({ success: true, text })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, type: err.type })
  }
}