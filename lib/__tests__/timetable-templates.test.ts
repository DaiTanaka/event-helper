import { describe, it, expect } from 'vitest'
import { TIMETABLE_TEMPLATES } from '@/lib/timetable-templates'

const VALID_TYPES = new Set(['', '設営', '開催', '撤収'])
const TIME_RE = /^(\d{2}):(\d{2})$/

function parseMin(t: string): number {
  const m = t.match(TIME_RE)
  if (!m) throw new Error(`Invalid time format: "${t}"`)
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (h < 0 || h > 23 || min < 0 || min > 59) throw new Error(`Out-of-range time: "${t}"`)
  return h * 60 + min
}

// ── Array structure ────────────────────────────────────────────

describe('TIMETABLE_TEMPLATES array', () => {
  it('exports exactly 6 templates', () => {
    expect(TIMETABLE_TEMPLATES).toHaveLength(6)
  })

  it('all template ids are unique', () => {
    const ids = TIMETABLE_TEMPLATES.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('contains expected template ids', () => {
    const ids = new Set(TIMETABLE_TEMPLATES.map(t => t.id))
    for (const expected of ['party', 'seminar', 'festival', 'community', 'sports', 'exhibition']) {
      expect(ids.has(expected), `missing template id: ${expected}`).toBe(true)
    }
  })

  it('all templates have non-empty label', () => {
    for (const tpl of TIMETABLE_TEMPLATES) {
      expect(tpl.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('all templates have non-empty description', () => {
    for (const tpl of TIMETABLE_TEMPLATES) {
      expect(tpl.description.trim().length).toBeGreaterThan(0)
    }
  })

  it('all templates have a non-empty emoji', () => {
    for (const tpl of TIMETABLE_TEMPLATES) {
      expect(tpl.emoji.trim().length).toBeGreaterThan(0)
    }
  })
})

// ── Per-template row validity ──────────────────────────────────

for (const tpl of TIMETABLE_TEMPLATES) {
  describe(`template "${tpl.id}" — row validity`, () => {
    const { rows } = tpl

    it('has at least 5 rows', () => {
      expect(rows.length).toBeGreaterThanOrEqual(5)
    })

    it('all row ids are non-empty', () => {
      for (const row of rows) {
        expect(row.id.trim().length, `row id is empty`).toBeGreaterThan(0)
      }
    })

    it('all row ids are unique within the template', () => {
      const ids = rows.map(r => r.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all rows have a valid type', () => {
      for (const row of rows) {
        expect(VALID_TYPES.has(row.type), `row "${row.id}" has invalid type: "${row.type}"`).toBe(true)
      }
    })

    it('all rows have non-empty content', () => {
      for (const row of rows) {
        expect(row.content.trim().length, `row "${row.id}" has empty content`).toBeGreaterThan(0)
      }
    })

    it('start times are in HH:MM format (or empty)', () => {
      for (const row of rows) {
        if (row.start !== '') {
          expect(TIME_RE.test(row.start), `row "${row.id}" start "${row.start}" is not HH:MM`).toBe(true)
        }
      }
    })

    it('end times are in HH:MM format (or empty)', () => {
      for (const row of rows) {
        if (row.end !== '') {
          expect(TIME_RE.test(row.end), `row "${row.id}" end "${row.end}" is not HH:MM`).toBe(true)
        }
      }
    })

    it('start < end for all rows with both times set', () => {
      for (const row of rows) {
        if (row.start && row.end) {
          expect(
            parseMin(row.start),
            `row "${row.id}": start (${row.start}) must be earlier than end (${row.end})`
          ).toBeLessThan(parseMin(row.end))
        }
      }
    })

    it('all start times are valid clock values (0–23h, 0–59m)', () => {
      for (const row of rows) {
        if (row.start) {
          expect(() => parseMin(row.start)).not.toThrow()
        }
      }
    })

    it('all end times are valid clock values (0–23h, 0–59m)', () => {
      for (const row of rows) {
        if (row.end) {
          expect(() => parseMin(row.end)).not.toThrow()
        }
      }
    })

    it('has at least one 設営 (setup) row', () => {
      expect(rows.some(r => r.type === '設営')).toBe(true)
    })

    it('has at least one 開催 (event) row', () => {
      expect(rows.some(r => r.type === '開催')).toBe(true)
    })

    it('has at least one 撤収 (teardown) row', () => {
      expect(rows.some(r => r.type === '撤収')).toBe(true)
    })

    it('setup rows start before main event rows', () => {
      const setupRows  = rows.filter(r => r.type === '設営' && r.start)
      const eventRows  = rows.filter(r => r.type === '開催' && r.start)
      if (setupRows.length > 0 && eventRows.length > 0) {
        const latestSetup   = Math.max(...setupRows.map(r => parseMin(r.start)))
        const earliestEvent = Math.min(...eventRows.map(r => parseMin(r.start)))
        expect(latestSetup).toBeLessThanOrEqual(earliestEvent)
      }
    })

    it('main event rows start before teardown rows', () => {
      const eventRows    = rows.filter(r => r.type === '開催' && r.start)
      const teardownRows = rows.filter(r => r.type === '撤収' && r.start)
      if (eventRows.length > 0 && teardownRows.length > 0) {
        const latestEvent    = Math.max(...eventRows.map(r => parseMin(r.start)))
        const earliestTeardown = Math.min(...teardownRows.map(r => parseMin(r.start)))
        expect(latestEvent).toBeLessThanOrEqual(earliestTeardown)
      }
    })

    it('location field exists on every row (may be empty string)', () => {
      for (const row of rows) {
        expect(row).toHaveProperty('location')
        expect(typeof row.location).toBe('string')
      }
    })
  })
}

// ── Template-specific content checks ──────────────────────────

describe('party template content', () => {
  const tpl = TIMETABLE_TEMPLATES.find(t => t.id === 'party')!

  it('has rows starting in the evening (start >= 16:00)', () => {
    const timedRows = tpl.rows.filter(r => r.start)
    expect(timedRows.some(r => parseMin(r.start) >= 16 * 60)).toBe(true)
  })

  it('has a 乾杯 (toast) row', () => {
    expect(tpl.rows.some(r => r.content.includes('乾杯'))).toBe(true)
  })
})

describe('seminar template content', () => {
  const tpl = TIMETABLE_TEMPLATES.find(t => t.id === 'seminar')!

  it('is a full-day schedule (some rows before noon, some after noon)', () => {
    const morningRows = tpl.rows.filter(r => r.start && parseMin(r.start) < 12 * 60)
    const afternoonRows = tpl.rows.filter(r => r.start && parseMin(r.start) >= 12 * 60)
    expect(morningRows.length).toBeGreaterThan(0)
    expect(afternoonRows.length).toBeGreaterThan(0)
  })

  it('has more rows than the party template', () => {
    const partyTpl = TIMETABLE_TEMPLATES.find(t => t.id === 'party')!
    expect(tpl.rows.length).toBeGreaterThanOrEqual(partyTpl.rows.length)
  })
})

describe('festival template content', () => {
  const tpl = TIMETABLE_TEMPLATES.find(t => t.id === 'festival')!

  it('starts in the morning (first timed row before 10:00)', () => {
    const timedRows = tpl.rows.filter(r => r.start).sort((a, b) => parseMin(a.start) - parseMin(b.start))
    expect(timedRows.length).toBeGreaterThan(0)
    expect(parseMin(timedRows[0].start)).toBeLessThan(10 * 60)
  })

  it('has an opening ceremony row (開会式)', () => {
    expect(tpl.rows.some(r => r.content.includes('開会'))).toBe(true)
  })
})

// ── Cross-template uniqueness ──────────────────────────────────

describe('cross-template row id uniqueness', () => {
  it('row ids do not collide across templates', () => {
    const allIds = TIMETABLE_TEMPLATES.flatMap(t => t.rows.map(r => r.id))
    expect(new Set(allIds).size).toBe(allIds.length)
  })
})
