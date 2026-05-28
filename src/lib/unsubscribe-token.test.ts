import { describe, it, expect, beforeAll } from 'vitest'
import { createUnsubscribeUrl, verifyUnsubscribeToken } from './unsubscribe-token'

describe('unsubscribe-token', () => {
  beforeAll(() => {
    process.env.NEXTAUTH_SECRET = 'test-secret-for-unsubscribe-tokens-32chars'
  })

  it('creates and verifies signed unsubscribe URLs', () => {
    const url = createUnsubscribeUrl('user-123', 'weekly', 'https://app.test')
    const parsed = new URL(url)
    const userId = parsed.searchParams.get('userId')!
    const type = parsed.searchParams.get('type')!
    const exp = parsed.searchParams.get('exp')!
    const sig = parsed.searchParams.get('sig')!
    expect(verifyUnsubscribeToken(userId, type, exp, sig)).toBe(true)
    expect(verifyUnsubscribeToken(userId, type, exp, 'bad-sig')).toBe(false)
  })
})
