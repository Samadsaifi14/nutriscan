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
  maxTokens: 10000,
  timeoutMs: 20000,
  maxRetries: 3,
}

const MODEL = 'gemini-2.5-flash'
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

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
        const retryable = ['rate_limit', 'network', 'unavailable'].includes(err.type)
        if (retryable && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000
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

function handleGeminiResponse(res: Response, body?: string): string {
  if (res.status === 429) throw new GeminiError('rate_limit', 'Gemini rate limit exceeded', 429)
  if (res.status === 503) throw new GeminiError('unavailable', 'Gemini is temporarily overloaded. Please try again.', 503)
  if (res.status === 504) throw new GeminiError('timeout', 'Gemini request timed out', 504)
  if (!res.ok) throw new GeminiError('api_error', `Gemini API error ${res.status}: ${body || ''}`, res.status)
  return body || ''
}

export async function callGemini(
  prompt: string,
  imageBase64?: string,
  config?: GeminiConfig
): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
  const { temperature, maxTokens, timeoutMs, maxRetries } = { ...DEFAULTS, ...config }
  const apiKey = getApiKey()
  const model = config?.model || MODEL

  return retryWithBackoff(async () => {
    const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`

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

    let data: any
    try {
      data = JSON.parse(body)
    } catch {
      throw new GeminiError('invalid_response', 'Gemini returned invalid JSON')
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new GeminiError('invalid_response', 'Gemini returned empty response')

    const usage = {
      inputTokens: data.usageMetadata?.promptTokenCount || 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
    }

    console.log(`Gemini [${model}] tokens — in: ${usage.inputTokens}, out: ${usage.outputTokens}`)
    return { text, usage }
  }, maxRetries)
}

export async function streamGemini(
  prompt: string,
  onChunk: (text: string) => void,
  imageBase64?: string,
  config?: GeminiConfig
): Promise<{ usage: { inputTokens: number; outputTokens: number } }> {
  const { temperature, maxTokens, timeoutMs, maxRetries } = { ...DEFAULTS, ...config }
  const apiKey = getApiKey()
  const model = config?.model || MODEL

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

    if (!res.body) throw new GeminiError('api_error', 'No response body from Gemini')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let usage = { inputTokens: 0, outputTokens: 0 }

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
              inputTokens: json.usageMetadata.promptTokenCount || 0,
              outputTokens: json.usageMetadata.candidatesTokenCount || 0,
            }
          }
        } catch {
          // skip malformed SSE chunks
        }
      }
    }

    console.log(`Gemini stream [${model}] tokens — in: ${usage.inputTokens}, out: ${usage.outputTokens}`)
    return { usage }
  }, maxRetries)
}