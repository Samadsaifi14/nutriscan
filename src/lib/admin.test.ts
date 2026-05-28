import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getAdminEmails, isAdminEmail } from './admin'

describe('admin', () => {
  const original = process.env.ADMIN_EMAILS

  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_EMAILS
    else process.env.ADMIN_EMAILS = original
  })

  it('parses ADMIN_EMAILS from env', () => {
    process.env.ADMIN_EMAILS = 'Admin@Example.com, other@test.com'
    expect(getAdminEmails()).toEqual(['admin@example.com', 'other@test.com'])
    expect(isAdminEmail('admin@example.com')).toBe(true)
    expect(isAdminEmail('unknown@test.com')).toBe(false)
  })
})
