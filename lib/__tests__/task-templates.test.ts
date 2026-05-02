import { describe, it, expect } from 'vitest'
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_TASKS,
  dueDaysLabel,
} from '@/lib/task-templates'

const VALID_PRIORITIES = new Set(['high', 'medium', 'low'])

// ── dueDaysLabel ──────────────────────────────────────────────

describe('dueDaysLabel', () => {
  it('returns empty string for null', () => {
    expect(dueDaysLabel(null)).toBe('')
  })

  it('returns 当日 for 0', () => {
    expect(dueDaysLabel(0)).toBe('当日')
  })

  it('returns D+N for positive days', () => {
    expect(dueDaysLabel(1)).toBe('D+1')
    expect(dueDaysLabel(7)).toBe('D+7')
    expect(dueDaysLabel(14)).toBe('D+14')
  })

  it('returns D-N for negative days', () => {
    expect(dueDaysLabel(-1)).toBe('D-1')
    expect(dueDaysLabel(-30)).toBe('D-30')
    expect(dueDaysLabel(-90)).toBe('D-90')
  })
})

// ── TEMPLATE_CATEGORIES ───────────────────────────────────────

describe('TEMPLATE_CATEGORIES', () => {
  it('is a non-empty array', () => {
    expect(TEMPLATE_CATEGORIES.length).toBeGreaterThan(0)
  })

  it('all entries have a non-empty id', () => {
    for (const cat of TEMPLATE_CATEGORIES) {
      expect(cat.id.trim().length).toBeGreaterThan(0)
    }
  })

  it('all entries have a non-empty label', () => {
    for (const cat of TEMPLATE_CATEGORIES) {
      expect(cat.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('all entries have a non-empty color string', () => {
    for (const cat of TEMPLATE_CATEGORIES) {
      expect(cat.color.trim().length).toBeGreaterThan(0)
    }
  })

  it('all ids are unique', () => {
    const ids = TEMPLATE_CATEGORIES.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes expected category ids', () => {
    const ids = new Set(TEMPLATE_CATEGORIES.map(c => c.id))
    for (const expected of ['planning', 'venue', 'design', 'pr', 'staff', 'program', 'equip', 'ops', 'post']) {
      expect(ids.has(expected), `missing category: ${expected}`).toBe(true)
    }
  })
})

// ── TEMPLATE_TASKS ────────────────────────────────────────────

describe('TEMPLATE_TASKS', () => {
  const categoryIds = new Set(TEMPLATE_CATEGORIES.map(c => c.id))

  it('is a non-empty array', () => {
    expect(TEMPLATE_TASKS.length).toBeGreaterThan(0)
  })

  it('all task ids are unique', () => {
    const ids = TEMPLATE_TASKS.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all tasks have non-empty id', () => {
    for (const t of TEMPLATE_TASKS) {
      expect(t.id.trim().length).toBeGreaterThan(0)
    }
  })

  it('all tasks have non-empty title', () => {
    for (const t of TEMPLATE_TASKS) {
      expect(t.title.trim().length, `task ${t.id} has empty title`).toBeGreaterThan(0)
    }
  })

  it('all tasks reference a valid categoryId', () => {
    for (const t of TEMPLATE_TASKS) {
      expect(categoryIds.has(t.categoryId), `task ${t.id} has unknown categoryId: ${t.categoryId}`).toBe(true)
    }
  })

  it('all tasks have a valid priority', () => {
    for (const t of TEMPLATE_TASKS) {
      expect(VALID_PRIORITIES.has(t.priority), `task ${t.id} has invalid priority: ${t.priority}`).toBe(true)
    }
  })

  it('startDays <= dueDays when both are non-null', () => {
    for (const t of TEMPLATE_TASKS) {
      if (t.startDays !== null && t.dueDays !== null) {
        expect(t.startDays, `task ${t.id}: startDays > dueDays`).toBeLessThanOrEqual(t.dueDays)
      }
    }
  })

  it('every TEMPLATE_CATEGORY has at least one task', () => {
    for (const cat of TEMPLATE_CATEGORIES) {
      const count = TEMPLATE_TASKS.filter(t => t.categoryId === cat.id).length
      expect(count, `category ${cat.id} has no tasks`).toBeGreaterThan(0)
    }
  })

  it('contains expected high-priority tasks', () => {
    const highIds = new Set(TEMPLATE_TASKS.filter(t => t.priority === 'high').map(t => t.id))
    expect(highIds.has('plan-kickoff')).toBe(true)
    expect(highIds.has('venue-book')).toBe(true)
  })
})
