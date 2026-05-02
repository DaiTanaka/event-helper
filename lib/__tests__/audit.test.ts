import { describe, it, expect } from 'vitest'
import { isDisposableEmail, looksLikeTestEmail } from '@/lib/audit'

// ── isDisposableEmail ─────────────────────────────────────────

describe('isDisposableEmail', () => {
  it('returns true for mailinator.com', () => {
    expect(isDisposableEmail('user@mailinator.com')).toBe(true)
  })

  it('returns true for yopmail.com', () => {
    expect(isDisposableEmail('user@yopmail.com')).toBe(true)
  })

  it('returns true for trashmail.com', () => {
    expect(isDisposableEmail('user@trashmail.com')).toBe(true)
  })

  it('returns true for guerrillamail.com', () => {
    expect(isDisposableEmail('user@guerrillamail.com')).toBe(true)
  })

  it('returns true for tempmail.com', () => {
    expect(isDisposableEmail('user@tempmail.com')).toBe(true)
  })

  it('is case-insensitive for the domain', () => {
    expect(isDisposableEmail('user@MAILINATOR.COM')).toBe(true)
    expect(isDisposableEmail('user@YopMail.Com')).toBe(true)
  })

  it('returns false for gmail.com', () => {
    expect(isDisposableEmail('user@gmail.com')).toBe(false)
  })

  it('returns false for a legitimate corporate domain', () => {
    expect(isDisposableEmail('tanaka@picoton.com')).toBe(false)
  })

  it('returns false for an empty string', () => {
    expect(isDisposableEmail('')).toBe(false)
  })

  it('returns false for a string with no @ sign', () => {
    expect(isDisposableEmail('notanemail')).toBe(false)
  })

  it('returns false for a string with only @', () => {
    expect(isDisposableEmail('@')).toBe(false)
  })
})

// ── looksLikeTestEmail ────────────────────────────────────────

describe('looksLikeTestEmail', () => {
  it('returns true for test@ prefix', () => {
    expect(looksLikeTestEmail('test@example.com')).toBe(true)
  })

  it('returns true for test+ prefix', () => {
    expect(looksLikeTestEmail('test+tag@example.com')).toBe(true)
  })

  it('returns true for dummy@ prefix', () => {
    expect(looksLikeTestEmail('dummy@example.com')).toBe(true)
  })

  it('returns true for sample@ prefix', () => {
    expect(looksLikeTestEmail('sample@example.com')).toBe(true)
  })

  it('returns true for demo@ prefix', () => {
    expect(looksLikeTestEmail('demo@example.com')).toBe(true)
  })

  it('returns true for aaa@ prefix (repeated a)', () => {
    expect(looksLikeTestEmail('aaa@example.com')).toBe(true)
  })

  it('returns true for xxx@ prefix', () => {
    expect(looksLikeTestEmail('xxx@example.com')).toBe(true)
  })

  it('returns true for zzz@ prefix', () => {
    expect(looksLikeTestEmail('zzz@example.com')).toBe(true)
  })

  it('returns true for single-letter local part (a@...)', () => {
    expect(looksLikeTestEmail('a@example.com')).toBe(true)
  })

  it('returns true for two-letter local part (ab@...)', () => {
    expect(looksLikeTestEmail('ab@example.com')).toBe(true)
  })

  it('returns true for one-letter + digit local part (a1@...)', () => {
    expect(looksLikeTestEmail('a1@example.com')).toBe(true)
  })

  it('returns true for disposable domain (delegates to isDisposableEmail)', () => {
    expect(looksLikeTestEmail('foo@mailinator.com')).toBe(true)
  })

  it('is case-insensitive for keyword prefixes', () => {
    expect(looksLikeTestEmail('TEST@example.com')).toBe(true)
    expect(looksLikeTestEmail('DUMMY@example.com')).toBe(true)
  })

  it('returns false for a normal multi-letter local part', () => {
    expect(looksLikeTestEmail('tanaka@company.co.jp')).toBe(false)
  })

  it('returns false for info@ (4-letter local part)', () => {
    expect(looksLikeTestEmail('info@picoton.com')).toBe(false)
  })

  it('returns false for yamada.taro@gmail.com', () => {
    expect(looksLikeTestEmail('yamada.taro@gmail.com')).toBe(false)
  })

  it('returns false for admin@ (5-letter local part)', () => {
    expect(looksLikeTestEmail('admin@example.com')).toBe(false)
  })
})
