import { describe, it, expect, vi } from 'vitest'

// Prevent next/headers from throwing in the Node test environment
vi.mock('next/headers', () => ({ cookies: vi.fn() }))

import { ADMIN_EMAILS, ADMIN_EMAIL } from '@/lib/is-admin'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

describe('ADMIN_EMAILS', () => {
  it('is a non-empty array', () => {
    expect(ADMIN_EMAILS.length).toBeGreaterThan(0)
  })

  it('all entries are valid email addresses', () => {
    for (const email of ADMIN_EMAILS) {
      expect(EMAIL_RE.test(email), `invalid email: ${email}`).toBe(true)
    }
  })

  it('all entries are unique', () => {
    expect(new Set(ADMIN_EMAILS).size).toBe(ADMIN_EMAILS.length)
  })

  it('all entries are lowercase', () => {
    for (const email of ADMIN_EMAILS) {
      expect(email, `not lowercase: ${email}`).toBe(email.toLowerCase())
    }
  })
})

describe('ADMIN_EMAIL', () => {
  it('equals the first element of ADMIN_EMAILS', () => {
    expect(ADMIN_EMAIL).toBe(ADMIN_EMAILS[0])
  })

  it('is included in ADMIN_EMAILS', () => {
    expect(ADMIN_EMAILS).toContain(ADMIN_EMAIL)
  })
})
