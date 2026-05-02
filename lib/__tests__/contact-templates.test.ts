import { describe, it, expect } from 'vitest'
import { CONTACT_TEMPLATE_GROUPS, getContactTemplatesForEventType } from '@/lib/contact-templates'

// ── 配列の整合性 ───────────────────────────────────────────────

describe('CONTACT_TEMPLATE_GROUPS — structure', () => {
  it('is a non-empty array', () => {
    expect(CONTACT_TEMPLATE_GROUPS.length).toBeGreaterThan(0)
  })

  it('all group ids are unique', () => {
    const ids = CONTACT_TEMPLATE_GROUPS.map(g => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all groups have a non-empty label', () => {
    for (const g of CONTACT_TEMPLATE_GROUPS) {
      expect(g.label.trim().length, `group "${g.id}" label is empty`).toBeGreaterThan(0)
    }
  })

  it('all groups have at least one contact', () => {
    for (const g of CONTACT_TEMPLATE_GROUPS) {
      expect(g.contacts.length, `group "${g.id}" has no contacts`).toBeGreaterThan(0)
    }
  })

  it('all contacts have non-empty name and role', () => {
    for (const g of CONTACT_TEMPLATE_GROUPS) {
      for (const c of g.contacts) {
        expect(c.name.trim().length, `group "${g.id}" contact name is empty`).toBeGreaterThan(0)
        expect(c.role.trim().length, `group "${g.id}" contact role is empty`).toBeGreaterThan(0)
      }
    }
  })

  it('eventTypes is "all" or a non-empty string array', () => {
    for (const g of CONTACT_TEMPLATE_GROUPS) {
      if (g.eventTypes === 'all') continue
      expect(Array.isArray(g.eventTypes), `group "${g.id}" eventTypes is invalid`).toBe(true)
      expect((g.eventTypes as string[]).length).toBeGreaterThan(0)
    }
  })

  it('has at least one universal ("all") group', () => {
    expect(CONTACT_TEMPLATE_GROUPS.some(g => g.eventTypes === 'all')).toBe(true)
  })

  it('has at least one event-type-specific group', () => {
    expect(CONTACT_TEMPLATE_GROUPS.some(g => g.eventTypes !== 'all')).toBe(true)
  })
})

// ── getContactTemplatesForEventType ────────────────────────────

describe('getContactTemplatesForEventType', () => {
  it('returns only "all" groups when eventType is null', () => {
    const result = getContactTemplatesForEventType(null)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('returns only "all" groups when eventType is undefined', () => {
    const result = getContactTemplatesForEventType(undefined)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('includes "all" groups for a known event type', () => {
    const result = getContactTemplatesForEventType('corporate_party')
    expect(result.some(g => g.eventTypes === 'all')).toBe(true)
  })

  it('includes matching event-type groups for corporate_party', () => {
    const result = getContactTemplatesForEventType('corporate_party')
    const specific = result.filter(g => g.eventTypes !== 'all')
    expect(specific.length).toBeGreaterThan(0)
    expect(specific.every(g => (g.eventTypes as string[]).includes('corporate_party'))).toBe(true)
  })

  it('does not include groups for other event types', () => {
    const result = getContactTemplatesForEventType('sports')
    for (const g of result) {
      if (g.eventTypes === 'all') continue
      expect((g.eventTypes as string[]).includes('sports')).toBe(true)
    }
  })

  it('returns at least 1 group for each known event type', () => {
    const types = [
      'corporate_party', 'school_event', 'community_festival',
      'commercial_facility', 'sports', 'exhibition',
    ]
    for (const t of types) {
      expect(getContactTemplatesForEventType(t).length, `no groups for "${t}"`).toBeGreaterThan(0)
    }
  })

  it('returns only "all" groups for an unknown event type', () => {
    const result = getContactTemplatesForEventType('nonexistent_type')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('result for specific type is superset of null result', () => {
    const nullResult = getContactTemplatesForEventType(null)
    const specificResult = getContactTemplatesForEventType('school_event')
    const nullIds = new Set(nullResult.map(g => g.id))
    for (const g of nullResult) {
      expect(specificResult.some(r => r.id === g.id), `"all" group "${g.id}" missing from specific result`).toBe(true)
    }
    expect(specificResult.length).toBeGreaterThanOrEqual(nullIds.size)
  })
})
