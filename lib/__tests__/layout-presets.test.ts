import { describe, it, expect } from 'vitest'
import { PRESET_ITEMS, PRESET_CATEGORIES, ITEM_COLORS } from '@/lib/layout-presets'

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/
const VALID_SHAPES = new Set(['rect', 'circle', 'person'])

describe('PRESET_ITEMS', () => {
  it('is a non-empty array', () => {
    expect(PRESET_ITEMS.length).toBeGreaterThan(0)
  })

  it('all items have unique IDs', () => {
    const ids = PRESET_ITEMS.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('all items have valid shapes', () => {
    for (const preset of PRESET_ITEMS) {
      expect(VALID_SHAPES.has(preset.shape), `${preset.id} has invalid shape: ${preset.shape}`).toBe(true)
    }
  })

  it('all items have positive width', () => {
    for (const preset of PRESET_ITEMS) {
      expect(preset.width, `${preset.id} width`).toBeGreaterThan(0)
    }
  })

  it('all items have positive height', () => {
    for (const preset of PRESET_ITEMS) {
      expect(preset.height, `${preset.id} height`).toBeGreaterThan(0)
    }
  })

  it('all items have non-empty labels', () => {
    for (const preset of PRESET_ITEMS) {
      expect(preset.label.trim().length, `${preset.id} label is empty`).toBeGreaterThan(0)
    }
  })

  it('all items have valid hex colors', () => {
    for (const preset of PRESET_ITEMS) {
      expect(preset.color, `${preset.id} color "${preset.color}" is not a hex color`).toMatch(HEX_COLOR)
    }
  })

  it('all items have a category', () => {
    for (const preset of PRESET_ITEMS) {
      expect(preset.category.trim().length, `${preset.id} has no category`).toBeGreaterThan(0)
    }
  })

  it('contains at least one テーブル item', () => {
    const tables = PRESET_ITEMS.filter(p => p.category === 'テーブル')
    expect(tables.length).toBeGreaterThan(0)
  })

  it('contains at least one 椅子 item', () => {
    const chairs = PRESET_ITEMS.filter(p => p.category === '椅子')
    expect(chairs.length).toBeGreaterThan(0)
  })

  it('contains person-shaped items in 人物 category', () => {
    const persons = PRESET_ITEMS.filter(p => p.shape === 'person')
    expect(persons.length).toBeGreaterThan(0)
    for (const p of persons) {
      expect(p.category).toBe('人物')
    }
  })

  it('contains スタッフ preset', () => {
    const found = PRESET_ITEMS.find(p => p.id === 'person-staff')
    expect(found).toBeDefined()
    expect(found?.shape).toBe('person')
  })

  it('contains ディレクター preset', () => {
    expect(PRESET_ITEMS.find(p => p.id === 'person-director')).toBeDefined()
  })

  it('contains 司会 preset', () => {
    expect(PRESET_ITEMS.find(p => p.id === 'person-mc')).toBeDefined()
  })

  it('contains 参加者 presets', () => {
    expect(PRESET_ITEMS.find(p => p.id === 'person-participant')).toBeDefined()
    expect(PRESET_ITEMS.find(p => p.id === 'person-adult')).toBeDefined()
    expect(PRESET_ITEMS.find(p => p.id === 'person-child')).toBeDefined()
  })

  it('circle items have equal width and height (for correct rendering)', () => {
    const circles = PRESET_ITEMS.filter(p => p.shape === 'circle')
    for (const c of circles) {
      expect(c.width, `${c.id} circle should be square`).toBe(c.height)
    }
  })
})

describe('PRESET_CATEGORIES', () => {
  it('is a non-empty array', () => {
    expect(PRESET_CATEGORIES.length).toBeGreaterThan(0)
  })

  it('has no duplicate entries', () => {
    const unique = new Set(PRESET_CATEGORIES)
    expect(unique.size).toBe(PRESET_CATEGORIES.length)
  })

  it('includes all categories referenced in PRESET_ITEMS', () => {
    const itemCategories = new Set(PRESET_ITEMS.map(p => p.category))
    for (const cat of itemCategories) {
      expect(PRESET_CATEGORIES, `category "${cat}" missing from PRESET_CATEGORIES`).toContain(cat)
    }
  })

  it('includes 人物 category', () => {
    expect(PRESET_CATEGORIES).toContain('人物')
  })
})

describe('ITEM_COLORS', () => {
  it('is a non-empty array', () => {
    expect(ITEM_COLORS.length).toBeGreaterThan(0)
  })

  it('all entries are valid hex colors', () => {
    for (const color of ITEM_COLORS) {
      expect(color, `"${color}" is not a valid hex color`).toMatch(HEX_COLOR)
    }
  })

  it('has no duplicate colors', () => {
    const unique = new Set(ITEM_COLORS)
    expect(unique.size).toBe(ITEM_COLORS.length)
  })
})
