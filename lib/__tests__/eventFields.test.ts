import { describe, it, expect } from 'vitest'
import {
  EVENT_TYPES,
  TARGET_AGES,
  VENUE_TYPES,
  PREFECTURES,
  CANCEL_REASONS,
} from '@/lib/eventFields'

// ── EVENT_TYPES ───────────────────────────────────────────────

describe('EVENT_TYPES', () => {
  it('is a non-empty array', () => {
    expect(EVENT_TYPES.length).toBeGreaterThan(0)
  })

  it('all entries have non-empty value', () => {
    for (const t of EVENT_TYPES) {
      expect(t.value.trim().length, `empty value in EVENT_TYPES`).toBeGreaterThan(0)
    }
  })

  it('all entries have non-empty label', () => {
    for (const t of EVENT_TYPES) {
      expect(t.label.trim().length, `empty label: ${t.value}`).toBeGreaterThan(0)
    }
  })

  it('all values are unique', () => {
    const values = EVENT_TYPES.map(t => t.value)
    expect(new Set(values).size).toBe(values.length)
  })

  it('includes other as a fallback', () => {
    expect(EVENT_TYPES.map(t => t.value)).toContain('other')
  })

  it('includes corporate_party', () => {
    expect(EVENT_TYPES.map(t => t.value)).toContain('corporate_party')
  })
})

// ── TARGET_AGES ───────────────────────────────────────────────

describe('TARGET_AGES', () => {
  it('is a non-empty array', () => {
    expect(TARGET_AGES.length).toBeGreaterThan(0)
  })

  it('all entries have non-empty value and label', () => {
    for (const t of TARGET_AGES) {
      expect(t.value.trim().length).toBeGreaterThan(0)
      expect(t.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('all values are unique', () => {
    const values = TARGET_AGES.map(t => t.value)
    expect(new Set(values).size).toBe(values.length)
  })

  it('covers infant through seniors across child and adult groups', () => {
    const values = new Set(TARGET_AGES.map(t => t.value))
    for (const expected of ['infant', 'preschool', 'elem_lower', 'elem_upper', 'teen', 'f1_m1', 'f2_m2', 'f3_m3', 'seniors'] as const) {
      expect(values.has(expected), `missing: ${expected}`).toBe(true)
    }
  })

  it('each entry belongs to children or adults group', () => {
    for (const t of TARGET_AGES) {
      expect(['children', 'adults'], `unexpected group for ${t.value}`).toContain(t.group)
    }
  })
})

// ── VENUE_TYPES ───────────────────────────────────────────────

describe('VENUE_TYPES', () => {
  it('has exactly 3 entries (indoor, outdoor, hybrid)', () => {
    expect(VENUE_TYPES).toHaveLength(3)
  })

  it('all entries have non-empty value and label', () => {
    for (const t of VENUE_TYPES) {
      expect(t.value.trim().length).toBeGreaterThan(0)
      expect(t.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('all values are unique', () => {
    const values = VENUE_TYPES.map(t => t.value)
    expect(new Set(values).size).toBe(values.length)
  })

  it('includes indoor, outdoor, hybrid', () => {
    const values = new Set(VENUE_TYPES.map(t => t.value))
    expect(values.has('indoor')).toBe(true)
    expect(values.has('outdoor')).toBe(true)
    expect(values.has('hybrid')).toBe(true)
  })
})

// ── PREFECTURES ───────────────────────────────────────────────

describe('PREFECTURES', () => {
  it('has exactly 47 entries (all Japanese prefectures)', () => {
    expect(PREFECTURES).toHaveLength(47)
  })

  it('has no duplicate entries', () => {
    expect(new Set(PREFECTURES).size).toBe(PREFECTURES.length)
  })

  it('all entries are non-empty strings', () => {
    for (const p of PREFECTURES) {
      expect(p.trim().length, `empty prefecture`).toBeGreaterThan(0)
    }
  })

  it('contains 北海道 (first prefecture)', () => {
    expect(PREFECTURES[0]).toBe('北海道')
  })

  it('contains 沖縄県 (last prefecture)', () => {
    expect(PREFECTURES[PREFECTURES.length - 1]).toBe('沖縄県')
  })

  it('contains 東京都', () => {
    expect(PREFECTURES).toContain('東京都')
  })

  it('contains 大阪府', () => {
    expect(PREFECTURES).toContain('大阪府')
  })

  it('contains 京都府', () => {
    expect(PREFECTURES).toContain('京都府')
  })

  it('contains 神奈川県', () => {
    expect(PREFECTURES).toContain('神奈川県')
  })

  it('all entries end with 道, 府, 県, or 都', () => {
    const SUFFIXES = ['道', '府', '県', '都']
    for (const p of PREFECTURES) {
      const last = p[p.length - 1]
      expect(SUFFIXES.includes(last), `"${p}" does not end with 道/府/県/都`).toBe(true)
    }
  })

  it('has exactly 1 道 (北海道)', () => {
    expect(PREFECTURES.filter(p => p.endsWith('道'))).toHaveLength(1)
  })

  it('has exactly 1 都 (東京都)', () => {
    expect(PREFECTURES.filter(p => p.endsWith('都'))).toHaveLength(1)
  })

  it('has exactly 2 府 (大阪府, 京都府)', () => {
    expect(PREFECTURES.filter(p => p.endsWith('府'))).toHaveLength(2)
  })

  it('has exactly 43 県', () => {
    expect(PREFECTURES.filter(p => p.endsWith('県'))).toHaveLength(43)
  })
})

// ── CANCEL_REASONS ────────────────────────────────────────────

describe('CANCEL_REASONS', () => {
  it('is a non-empty array', () => {
    expect(CANCEL_REASONS.length).toBeGreaterThan(0)
  })

  it('all entries have non-empty value and label', () => {
    for (const r of CANCEL_REASONS) {
      expect(r.value.trim().length).toBeGreaterThan(0)
      expect(r.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('all values are unique', () => {
    const values = CANCEL_REASONS.map(r => r.value)
    expect(new Set(values).size).toBe(values.length)
  })

  it('includes other as a fallback', () => {
    expect(CANCEL_REASONS.map(r => r.value)).toContain('other')
  })

  it('includes event_cancelled', () => {
    expect(CANCEL_REASONS.map(r => r.value)).toContain('event_cancelled')
  })
})
