import { describe, it, expect } from 'vitest'
import { CATEGORIES, CATALOG } from '@/lib/catalog'

// ── CATEGORIES ────────────────────────────────────────────────

describe('CATEGORIES', () => {
  it('is a non-empty array', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0)
  })

  it('first entry is すべて', () => {
    expect(CATEGORIES[0]).toBe('すべて')
  })

  it('has no duplicate entries', () => {
    expect(new Set(CATEGORIES).size).toBe(CATEGORIES.length)
  })

  it('includes expected categories', () => {
    for (const expected of ['ステージ・演出', '音響・映像', 'アトラクション', 'フード・飲食', 'ワークショップ', '展示・ブース', 'その他']) {
      expect(CATEGORIES).toContain(expected)
    }
  })
})

// ── CATALOG ───────────────────────────────────────────────────

describe('CATALOG', () => {
  const validCategories = new Set<string>(CATEGORIES.filter(c => c !== 'すべて'))

  it('is a non-empty array', () => {
    expect(CATALOG.length).toBeGreaterThan(0)
  })

  it('all item ids are unique', () => {
    const ids = CATALOG.map(item => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all items have non-empty id', () => {
    for (const item of CATALOG) {
      expect(item.id.trim().length).toBeGreaterThan(0)
    }
  })

  it('all items have non-empty title', () => {
    for (const item of CATALOG) {
      expect(item.title.trim().length, `item ${item.id} has empty title`).toBeGreaterThan(0)
    }
  })

  it('all items have non-empty company_name', () => {
    for (const item of CATALOG) {
      expect(item.company_name.trim().length, `item ${item.id} has empty company_name`).toBeGreaterThan(0)
    }
  })

  it('all items have non-empty description', () => {
    for (const item of CATALOG) {
      expect(item.description.trim().length, `item ${item.id} has empty description`).toBeGreaterThan(0)
    }
  })

  it('all item categories exist in CATEGORIES (excluding すべて)', () => {
    for (const item of CATALOG) {
      expect(validCategories.has(item.category), `item ${item.id} has unknown category: ${item.category}`).toBe(true)
    }
  })

  it('price_from is null or non-negative', () => {
    for (const item of CATALOG) {
      if (item.price_from !== null) {
        expect(item.price_from, `item ${item.id} price_from is negative`).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('price_to is null or >= price_from when both are non-null', () => {
    for (const item of CATALOG) {
      if (item.price_from !== null && item.price_to !== null) {
        expect(item.price_to, `item ${item.id}: price_to < price_from`).toBeGreaterThanOrEqual(item.price_from)
      }
    }
  })

  it('tags is an array for every item', () => {
    for (const item of CATALOG) {
      expect(Array.isArray(item.tags), `item ${item.id} tags is not an array`).toBe(true)
    }
  })

  it('all tags are non-empty strings', () => {
    for (const item of CATALOG) {
      for (const tag of item.tags) {
        expect(typeof tag).toBe('string')
        expect(tag.trim().length, `item ${item.id} has empty tag`).toBeGreaterThan(0)
      }
    }
  })

  it('isPiqton items belong to company ピコトン', () => {
    for (const item of CATALOG) {
      if (item.isPiqton) {
        expect(item.company_name, `isPiqton item ${item.id} should be ピコトン`).toBe('ピコトン')
      }
    }
  })

  it('isAd items have a contact_url', () => {
    for (const item of CATALOG) {
      if (item.isAd) {
        expect(item.contact_url, `isAd item ${item.id} missing contact_url`).toBeDefined()
        expect(item.contact_url!.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('isPiqton and isAd are mutually exclusive', () => {
    for (const item of CATALOG) {
      expect(item.isPiqton && item.isAd, `item ${item.id} cannot be both isPiqton and isAd`).toBeFalsy()
    }
  })

  it('contains Piqton items', () => {
    expect(CATALOG.filter(i => i.isPiqton).length).toBeGreaterThan(0)
  })

  it('contains no ad items (catalog is Picoton-only)', () => {
    expect(CATALOG.filter(i => i.isAd).length).toBe(0)
  })

  it('all items are Picoton products', () => {
    expect(CATALOG.filter(i => i.isPiqton).length).toBe(CATALOG.length)
  })
})
