import { describe, it, expect } from 'vitest'
import { EQUIPMENT_TEMPLATE_GROUPS, getEquipmentTemplatesForEventType } from '@/lib/equipment-template-groups'

const VALID_CATEGORIES = new Set(['什器・家具', '電気機器', '消耗品', '印刷物', '装飾', 'その他'])

// ── 配列の整合性 ───────────────────────────────────────────────

describe('EQUIPMENT_TEMPLATE_GROUPS — structure', () => {
  it('is a non-empty array', () => {
    expect(EQUIPMENT_TEMPLATE_GROUPS.length).toBeGreaterThan(0)
  })

  it('all group ids are unique', () => {
    const ids = EQUIPMENT_TEMPLATE_GROUPS.map(g => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all groups have a non-empty label', () => {
    for (const g of EQUIPMENT_TEMPLATE_GROUPS) {
      expect(g.label.trim().length, `group "${g.id}" label is empty`).toBeGreaterThan(0)
    }
  })

  it('all groups have at least one item', () => {
    for (const g of EQUIPMENT_TEMPLATE_GROUPS) {
      expect(g.items.length, `group "${g.id}" has no items`).toBeGreaterThan(0)
    }
  })

  it('all items have non-empty name and unit', () => {
    for (const g of EQUIPMENT_TEMPLATE_GROUPS) {
      for (const item of g.items) {
        expect(item.name.trim().length, `group "${g.id}" item name is empty`).toBeGreaterThan(0)
        expect(item.unit.trim().length, `group "${g.id}" item unit is empty`).toBeGreaterThan(0)
      }
    }
  })

  it('all items have a positive quantity', () => {
    for (const g of EQUIPMENT_TEMPLATE_GROUPS) {
      for (const item of g.items) {
        expect(item.quantity, `group "${g.id}" item "${item.name}" quantity <= 0`).toBeGreaterThan(0)
      }
    }
  })

  it('all item categories are valid', () => {
    for (const g of EQUIPMENT_TEMPLATE_GROUPS) {
      for (const item of g.items) {
        expect(VALID_CATEGORIES.has(item.category), `group "${g.id}" item "${item.name}" has invalid category "${item.category}"`).toBe(true)
      }
    }
  })

  it('eventTypes is "all" or a non-empty string array', () => {
    for (const g of EQUIPMENT_TEMPLATE_GROUPS) {
      if (g.eventTypes === 'all') continue
      expect(Array.isArray(g.eventTypes)).toBe(true)
      expect((g.eventTypes as string[]).length).toBeGreaterThan(0)
    }
  })

  it('has at least one universal ("all") group', () => {
    expect(EQUIPMENT_TEMPLATE_GROUPS.some(g => g.eventTypes === 'all')).toBe(true)
  })
})

// ── getEquipmentTemplatesForEventType ──────────────────────────

describe('getEquipmentTemplatesForEventType', () => {
  it('returns only "all" groups when eventType is null', () => {
    const result = getEquipmentTemplatesForEventType(null)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('returns only "all" groups when eventType is undefined', () => {
    const result = getEquipmentTemplatesForEventType(undefined)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('includes "all" groups for a known event type', () => {
    const result = getEquipmentTemplatesForEventType('corporate_party')
    expect(result.some(g => g.eventTypes === 'all')).toBe(true)
  })

  it('includes matching groups for corporate_party', () => {
    const result = getEquipmentTemplatesForEventType('corporate_party')
    const specific = result.filter(g => g.eventTypes !== 'all')
    expect(specific.length).toBeGreaterThan(0)
    expect(specific.every(g => (g.eventTypes as string[]).includes('corporate_party'))).toBe(true)
  })

  it('does not include groups for other event types', () => {
    const result = getEquipmentTemplatesForEventType('sports')
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
      expect(getEquipmentTemplatesForEventType(t).length, `no groups for "${t}"`).toBeGreaterThan(0)
    }
  })

  it('returns only "all" groups for an unknown event type', () => {
    const result = getEquipmentTemplatesForEventType('nonexistent_type')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(g => g.eventTypes === 'all')).toBe(true)
  })

  it('result for specific type is superset of null result', () => {
    const nullResult = getEquipmentTemplatesForEventType(null)
    const specificResult = getEquipmentTemplatesForEventType('community_festival')
    for (const g of nullResult) {
      expect(specificResult.some(r => r.id === g.id), `"all" group "${g.id}" missing from specific result`).toBe(true)
    }
    expect(specificResult.length).toBeGreaterThanOrEqual(nullResult.length)
  })
})
