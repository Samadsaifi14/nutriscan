export class GeminiError extends Error {
  constructor(
    public type: 'rate_limit' | 'timeout' | 'network' | 'api_error' | 'unavailable' | 'invalid_response',
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

interface GeminiConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  timeoutMs?: number
  maxRetries?: number
}

const DEFAULTS: Required<Omit<GeminiConfig, 'model'>> = {
  temperature: 0.15,
  maxTokens: 3000,
  timeoutMs: 35000,
  maxRetries: 1,
}

// Two separate models:
// - TEXT_MODEL  : for pure text→JSON analysis (gemini 2.5 flash, better reasoning)
// - VISION_MODEL: for image reading (gemini 1.5 flash, proven stable vision support)
const TEXT_MODEL   = 'gemini-2.5-flash-preview-04-17'
const VISION_MODEL = 'gemini-1.5-flash'
const BASE_URL     = 'https://generativelanguage.googleapis.com/v1beta/models'

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new GeminiError('api_error', 'GEMINI_API_KEY is not configured')
  return key
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } catch (err: any) {
    if (err.name === 'AbortError') throw new GeminiError('timeout', `Gemini request timed out after ${timeoutMs / 1000}s`)
    throw new GeminiError('network', `Network error: ${err.message}`)
  } finally {
    clearTimeout(timer)
  }
}

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err: any) {
      lastError = err
      if (err instanceof GeminiError) {
        if (err.type === 'rate_limit') {
          console.warn('Gemini quota/rate limit — not retrying')
          throw err
        }
        const retryable = ['network', 'unavailable'].includes(err.type)
        if (retryable && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 2000
          console.log(`Gemini ${err.type} — retry ${attempt + 1}/${maxRetries} in ${delay}ms`)
          await new Promise(r => setTimeout(r, delay))
          continue
        }
      }
      throw err
    }
  }
  throw lastError
}

function handleGeminiResponse(res: Response, body?: string): void {
  if (res.status === 429) {
    const isQuota = (body || '').toLowerCase().includes('quota') ||
                    (body || '').toLowerCase().includes('resource_exhausted')
    throw new GeminiError(
      'rate_limit',
      isQuota
        ? 'Gemini daily quota exhausted. Try again tomorrow or upgrade at aistudio.google.com'
        : 'Gemini rate limit hit (too many requests per minute)',
      429
    )
  }
  if (res.status === 503) throw new GeminiError('unavailable', 'Gemini is temporarily overloaded', 503)
  if (res.status === 504) throw new GeminiError('timeout', 'Gemini gateway timed out', 504)
  if (!res.ok) throw new GeminiError('api_error', `Gemini API error ${res.status}: ${(body || '').slice(0, 200)}`, res.status)
}

function extractText(data: any): string {
  const finishReason = data.candidates?.[0]?.finishReason
  if (finishReason && !['STOP', 'MAX_TOKENS'].includes(finishReason)) {
    console.warn(`Gemini finish reason: ${finishReason}`)
    if (['SAFETY', 'RECITATION', 'PROHIBITED_CONTENT'].includes(finishReason)) {
      throw new GeminiError('invalid_response', `Gemini blocked the response: ${finishReason}`)
    }
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    console.error('Gemini empty text. Response:', JSON.stringify(data).slice(0, 800))
    throw new GeminiError('invalid_response', 'Gemini returned empty content')
  }
  return text
}

function extractUsage(data: any) {
  return {
    inputTokens:  data.usageMetadata?.promptTokenCount    || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
  }
}

// ─── TEXT-ONLY CALL (for /api/analyze) ────────────────────────────────────────
// Uses gemini-2.5-flash with responseMimeType=json for best analysis quality
export async function callGemini(
  prompt: string,
  imageBase64?: string,
  config?: GeminiConfig
): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
  const { temperature, maxTokens, timeoutMs, maxRetries } = { ...DEFAULTS, ...config }
  const apiKey = getApiKey()

  // If an image is passed to callGemini, route it through vision model
  const model = imageBase64 ? VISION_MODEL : (config?.model || TEXT_MODEL)

  return retryWithBackoff(async () => {
    const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`

    const parts: any[] = [{ text: prompt }]
    if (imageBase64) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } })
    }

    // responseMimeType ONLY for text-only calls — breaks vision calls
    const generationConfig: any = { temperature, maxOutputTokens: maxTokens }
    if (!imageBase64) {
      generationConfig.responseMimeType = 'application/json'
    }

    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }], generationConfig }),
    }, timeoutMs)

    const body = await res.text()
    handleGeminiResponse(res, body)

    let data: any
    try { data = JSON.parse(body) }
    catch { throw new GeminiError('invalid_response', 'Gemini returned invalid JSON wrapper') }

    const text  = extractText(data)
    const usage = extractUsage(data)
    console.log(`Gemini [${model}] in:${usage.inputTokens} out:${usage.outputTokens}`)
    return { text, usage }
  }, maxRetries)
}

// ─── VISION CALL (for /api/scan-vision and /api/scan-product-photo) ───────────
// Uses gemini-1.5-flash — stable vision model, no responseMimeType
export async function callGeminiVision(
  prompt: string,
  imageBase64: string,
  config?: GeminiConfig
): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
  const { temperature, maxTokens, timeoutMs, maxRetries } = { ...DEFAULTS, ...config }
  const apiKey = getApiKey()
  const model  = VISION_MODEL  // always 1.5-flash for vision

  return retryWithBackoff(async () => {
    const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`

    const parts: any[] = [
      { text: prompt },
      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
    ]

    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          // NO responseMimeType — vision calls must not have it
        },
      }),
    }, timeoutMs)

    const body = await res.text()
    handleGeminiResponse(res, body)

    let data: any
    try { data = JSON.parse(body) }
    catch { throw new GeminiError('invalid_response', 'Gemini returned invalid JSON wrapper') }

    const text  = extractText(data)
    const usage = extractUsage(data)
    console.log(`Gemini Vision [${model}] in:${usage.inputTokens} out:${usage.outputTokens}`)
    return { text, usage }
  }, maxRetries)
}

// ─── STREAM (unchanged) ───────────────────────────────────────────────────────
export async function streamGemini(
  prompt: string,
  onChunk: (text: string) => void,
  imageBase64?: string,
  config?: GeminiConfig
): Promise<{ usage: { inputTokens: number; outputTokens: number } }> {
  const { temperature, maxTokens, timeoutMs, maxRetries } = { ...DEFAULTS, ...config }
  const apiKey = getApiKey()
  const model  = imageBase64 ? VISION_MODEL : TEXT_MODEL

  return retryWithBackoff(async () => {
    const url = `${BASE_URL}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`

    const parts: any[] = [{ text: prompt }]
    if (imageBase64) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } })
    }

    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    }, timeoutMs)

    const body = await res.text()
    handleGeminiResponse(res, body)
    if (!res.body) throw new GeminiError('api_error', 'No response body from Gemini stream')

    const reader  = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let usage  = { inputTokens: 0, outputTokens: 0 }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const dataStr = trimmed.slice(6)
        if (dataStr === '[DONE]') continue
        try {
          const json = JSON.parse(dataStr)
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) onChunk(text)
          if (json.usageMetadata) {
            usage = {
              inputTokens:  json.usageMetadata.promptTokenCount    || 0,
              outputTokens: json.usageMetadata.candidatesTokenCount || 0,
            }
          }
        } catch { /* skip malformed SSE chunks */ }
      }
    }

    console.log(`Gemini stream [${model}] in:${usage.inputTokens} out:${usage.outputTokens}`)
    return { usage }
  }, maxRetries)
}