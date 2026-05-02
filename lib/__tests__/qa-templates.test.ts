import { describe, it, expect } from 'vitest'
import { QA_TEMPLATE_GROUPS, getTemplatesForEventType } from '@/lib/qa-templates'

// ── 配列の整合性 ───────────────────────────────────────────────

describe('QA_TEMPLATE_GROUPS — structure', () => {
  it('is a non-empty array', () => {
    expect(QA_TEMPLATE_GROUPS.length).toBeGreaterThan(0)
  })

  it('all group ids are unique', () => {
    const ids = QA_TEMPLATE_GROUPS.map(g => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all groups have a non-empty label', () => {
    for (const g of QA_TEMPLATE_GROUPS) {
      expect(g.label.trim().length, `group "${g.id}" label is empty`).toBeGreaterThan(0)
    }
  })

  it('all groups have at least one QA pair', () => {
    for (const g of QA_TEMPLATE_GROUPS) {
      expect(g.pairs.length, `group "${g.id}" has no pairs`).toBeGreaterThan(0)
    }
  })

  it('all QA pairs have non-empty question and answer', () => {
    for (const g of QA_TEMPLATE_GROUPS) {
      for (const pair of g.pairs) {
        expect(pair.question.trim().length, `group "${g.id}" has empty question`).toBeGreaterThan(0)
        expect(pair.answer.trim().length, `group "${g.id}" has empty answer`).toBeGreaterThan(0)
      }
    }
  })

  it('eventTypes is "all" or a non-empty string array', () => {
    for (const g of QA_TEMPLATE_GROUPS) {
      if (g.eventTypes === 'all') continue
      expect(Array.isArray(g.eventTypes)).toBe(true)
      expect((g.eventTypes as string[]).length).toBeGreaterThan(0)
    }
  })

  it('has at least one universal ("all") group', () => {
    expect(QA_TEMPLATE_GROUPS.some(g => g.eventTypes === 'all')).toBe(true)
  })

  it('has at least one event-type-specific group', () => {
    expect(QA_TEMPLATE_GROUPS.some(g => g.eventTypes !== 'all')).toBe(true)
  })
})

// ── getTemplatesForEventType ───────────────────────────────────

describe('getTemplatesForEventType', () => {
  it('returns only "all" groups when eventType is null', () => {
    const result = getTemplatesForEventType(null)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('returns only "all" groups when eventType is undefined', () => {
    const result = getTemplatesForEventType(undefined)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('includes "all" groups for a known event type', () => {
    const result = getTemplatesForEventType('corporate_party')
    expect(result.some(g => g.eventTypes === 'all')).toBe(true)
  })

  it('includes matching groups for corporate_party', () => {
    const result = getTemplatesForEventType('corporate_party')
    const specific = result.filter(g => g.eventTypes !== 'all')
    expect(specific.length).toBeGreaterThan(0)
    expect(specific.every(g => (g.eventTypes as string[]).includes('corporate_party'))).toBe(true)
  })

  it('does not include groups for other event types', () => {
    const result = getTemplatesForEventType('community_festival')
    for (const g of result) {
      if (g.eventTypes === 'all') continue
      expect((g.eventTypes as string[]).includes('community_festival')).toBe(true)
    }
  })

  it('returns at least 1 group for each known event type', () => {
    const types = [
      'corporate_party', 'school_event', 'community_festival',
      'commercial_facility', 'sports', 'exhibition',
    ]
    for (const t of types) {
      expect(getTemplatesForEventType(t).length, `no groups for "${t}"`).toBeGreaterThan(0)
    }
  })

  it('returns only "all" groups for an unknown event type', () => {
    const result = getTemplatesForEventType('nonexistent_type')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('result for specific type is superset of null result', () => {
    const nullResult = getTemplatesForEventType(null)
    const specificResult = getTemplatesForEventType('exhibition')
    for (const g of nullResult) {
      expect(specificResult.some(r => r.id === g.id), `"all" group "${g.id}" missing`).toBe(true)
    }
    expect(specificResult.length).toBeGreaterThanOrEqual(nullResult.length)
  })
})
