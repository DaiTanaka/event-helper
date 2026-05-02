import { describe, it, expect } from 'vitest'
import { EVENT_CALENDAR, getMonthCalendar, getFeaturedEvents } from '@/lib/event-calendar'

// ── 配列の整合性 ───────────────────────────────────────────────

describe('EVENT_CALENDAR — structure', () => {
  it('contains exactly 12 months', () => {
    expect(EVENT_CALENDAR).toHaveLength(12)
  })

  it('covers months 1–12 with no gaps', () => {
    const months = EVENT_CALENDAR.map(m => m.month).sort((a, b) => a - b)
    expect(months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('all months have a non-empty label', () => {
    for (const m of EVENT_CALENDAR) {
      expect(m.label.trim().length, `month ${m.month} label is empty`).toBeGreaterThan(0)
    }
  })

  it('all months have a non-empty seasonColor', () => {
    for (const m of EVENT_CALENDAR) {
      expect(m.seasonColor.trim().length, `month ${m.month} seasonColor is empty`).toBeGreaterThan(0)
    }
  })

  it('all months have at least one event', () => {
    for (const m of EVENT_CALENDAR) {
      expect(m.events.length, `month ${m.month} has no events`).toBeGreaterThan(0)
    }
  })

  it('all events have non-empty name, emoji, timing, and idea', () => {
    for (const m of EVENT_CALENDAR) {
      for (const e of m.events) {
        expect(e.name.trim().length, `month ${m.month} event name empty`).toBeGreaterThan(0)
        expect(e.emoji.trim().length, `month ${m.month} event emoji empty`).toBeGreaterThan(0)
        expect(e.timing.trim().length, `month ${m.month} event timing empty`).toBeGreaterThan(0)
        expect(e.idea.trim().length, `month ${m.month} event idea empty`).toBeGreaterThan(0)
      }
    }
  })

  it('featured flag is boolean or undefined (never null)', () => {
    for (const m of EVENT_CALENDAR) {
      for (const e of m.events) {
        expect(e.featured === undefined || typeof e.featured === 'boolean').toBe(true)
      }
    }
  })

  it('event_type is a string or undefined (never null)', () => {
    for (const m of EVENT_CALENDAR) {
      for (const e of m.events) {
        expect(e.event_type === undefined || typeof e.event_type === 'string').toBe(true)
      }
    }
  })

  it('at least one featured event exists across the entire calendar', () => {
    const hasFeatured = EVENT_CALENDAR.some(m => m.events.some(e => e.featured === true))
    expect(hasFeatured).toBe(true)
  })
})

// ── getMonthCalendar ───────────────────────────────────────────

describe('getMonthCalendar', () => {
  it('returns data for every valid month (1–12)', () => {
    for (let m = 1; m <= 12; m++) {
      const result = getMonthCalendar(m)
      expect(result, `getMonthCalendar(${m}) returned undefined`).toBeDefined()
      expect(result!.month).toBe(m)
    }
  })

  it('returns undefined for month 0', () => {
    expect(getMonthCalendar(0)).toBeUndefined()
  })

  it('returns undefined for month 13', () => {
    expect(getMonthCalendar(13)).toBeUndefined()
  })

  it('returned object contains events array', () => {
    const result = getMonthCalendar(6)!
    expect(Array.isArray(result.events)).toBe(true)
    expect(result.events.length).toBeGreaterThan(0)
  })

  it('January has お正月', () => {
    const jan = getMonthCalendar(1)!
    expect(jan.events.some(e => e.name === 'お正月')).toBe(true)
  })

  it('December has クリスマス', () => {
    const dec = getMonthCalendar(12)!
    expect(dec.events.some(e => e.name === 'クリスマス')).toBe(true)
  })
})

// ── getFeaturedEvents ──────────────────────────────────────────

describe('getFeaturedEvents', () => {
  it('returns only featured events', () => {
    for (let m = 1; m <= 12; m++) {
      const result = getFeaturedEvents(m)
      expect(result.every(e => e.featured === true), `month ${m} contains non-featured events`).toBe(true)
    }
  })

  it('returns empty array for month 0', () => {
    expect(getFeaturedEvents(0)).toEqual([])
  })

  it('returns empty array for month 13', () => {
    expect(getFeaturedEvents(13)).toEqual([])
  })

  it('returns a subset of the full month events', () => {
    for (let m = 1; m <= 12; m++) {
      const all = getMonthCalendar(m)!.events
      const featured = getFeaturedEvents(m)
      for (const e of featured) {
        expect(all.some(a => a.name === e.name)).toBe(true)
      }
    }
  })

  it('October has ハロウィン as featured', () => {
    const oct = getFeaturedEvents(10)
    expect(oct.some(e => e.name === 'ハロウィン')).toBe(true)
  })

  it('each month with featured events returns at least 1', () => {
    let foundMonth = false
    for (let m = 1; m <= 12; m++) {
      const featured = getFeaturedEvents(m)
      if (featured.length > 0) { foundMonth = true; break }
    }
    expect(foundMonth).toBe(true)
  })
})
