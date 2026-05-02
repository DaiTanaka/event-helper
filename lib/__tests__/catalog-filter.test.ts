import { describe, it, expect } from 'vitest'

// ── カタログ掲載期間フィルターロジック ────────────────────────
// contents/page.tsx の日付フィルタリングと同じロジックを独立してテスト

type CatalogRow = {
  display_start_date: string | null
  display_end_date: string | null
}

function isDisplayed(row: CatalogRow, today: string): boolean {
  const startOk = !row.display_start_date || row.display_start_date <= today
  const endOk = !row.display_end_date || row.display_end_date >= today
  return startOk && endOk
}

function filterByDisplayDate(rows: CatalogRow[], today: string): CatalogRow[] {
  return rows.filter(r => isDisplayed(r, today))
}

// ── isDisplayed ───────────────────────────────────────────────

describe('isDisplayed', () => {
  const TODAY = '2026-04-30'

  it('always shows item with no dates', () => {
    expect(isDisplayed({ display_start_date: null, display_end_date: null }, TODAY)).toBe(true)
  })

  it('shows item when today is within range', () => {
    expect(isDisplayed({ display_start_date: '2026-04-01', display_end_date: '2026-05-31' }, TODAY)).toBe(true)
  })

  it('shows item when today equals start date', () => {
    expect(isDisplayed({ display_start_date: '2026-04-30', display_end_date: null }, TODAY)).toBe(true)
  })

  it('shows item when today equals end date', () => {
    expect(isDisplayed({ display_start_date: null, display_end_date: '2026-04-30' }, TODAY)).toBe(true)
  })

  it('hides item when today is before start date', () => {
    expect(isDisplayed({ display_start_date: '2026-05-01', display_end_date: null }, TODAY)).toBe(false)
  })

  it('hides item when today is after end date', () => {
    expect(isDisplayed({ display_start_date: null, display_end_date: '2026-04-29' }, TODAY)).toBe(false)
  })

  it('shows item with only start date that has passed', () => {
    expect(isDisplayed({ display_start_date: '2026-01-01', display_end_date: null }, TODAY)).toBe(true)
  })

  it('shows item with only end date that is in the future', () => {
    expect(isDisplayed({ display_start_date: null, display_end_date: '2026-12-31' }, TODAY)).toBe(true)
  })

  it('hides item when start is tomorrow and end is far future', () => {
    expect(isDisplayed({ display_start_date: '2026-05-01', display_end_date: '2026-12-31' }, TODAY)).toBe(false)
  })

  it('hides item when start is fine but end was yesterday', () => {
    expect(isDisplayed({ display_start_date: '2026-01-01', display_end_date: '2026-04-29' }, TODAY)).toBe(false)
  })
})

// ── filterByDisplayDate ───────────────────────────────────────

describe('filterByDisplayDate', () => {
  const TODAY = '2026-04-30'

  it('returns empty array for empty input', () => {
    expect(filterByDisplayDate([], TODAY)).toHaveLength(0)
  })

  it('returns all items when all have no dates', () => {
    const rows: CatalogRow[] = [
      { display_start_date: null, display_end_date: null },
      { display_start_date: null, display_end_date: null },
    ]
    expect(filterByDisplayDate(rows, TODAY)).toHaveLength(2)
  })

  it('filters out expired items', () => {
    const rows: CatalogRow[] = [
      { display_start_date: null, display_end_date: '2026-04-01' },
      { display_start_date: null, display_end_date: '2026-12-31' },
    ]
    expect(filterByDisplayDate(rows, TODAY)).toHaveLength(1)
  })

  it('filters out future items', () => {
    const rows: CatalogRow[] = [
      { display_start_date: '2026-06-01', display_end_date: null },
      { display_start_date: '2026-01-01', display_end_date: null },
    ]
    expect(filterByDisplayDate(rows, TODAY)).toHaveLength(1)
  })

  it('keeps items active on exactly today', () => {
    const rows: CatalogRow[] = [
      { display_start_date: '2026-04-30', display_end_date: '2026-04-30' },
    ]
    expect(filterByDisplayDate(rows, TODAY)).toHaveLength(1)
  })

  it('handles mixed scenarios correctly', () => {
    const rows: CatalogRow[] = [
      { display_start_date: null, display_end_date: null },           // 常時表示
      { display_start_date: '2026-01-01', display_end_date: '2026-12-31' }, // 期間内
      { display_start_date: '2026-05-01', display_end_date: null },   // 未来
      { display_start_date: null, display_end_date: '2026-04-29' },   // 期限切れ
    ]
    const result = filterByDisplayDate(rows, TODAY)
    expect(result).toHaveLength(2)
  })

  it('preserves order of matching items', () => {
    const rows: CatalogRow[] = [
      { display_start_date: '2026-01-01', display_end_date: null },
      { display_start_date: null, display_end_date: '2026-04-29' },   // 除外
      { display_start_date: null, display_end_date: '2026-12-31' },
    ]
    const result = filterByDisplayDate(rows, TODAY)
    expect(result[0]).toEqual(rows[0])
    expect(result[1]).toEqual(rows[2])
  })
})

// ── エッジケース ──────────────────────────────────────────────

describe('edge cases', () => {
  it('works at year boundary (Dec 31)', () => {
    const today = '2025-12-31'
    const row: CatalogRow = { display_start_date: '2025-01-01', display_end_date: '2025-12-31' }
    expect(isDisplayed(row, today)).toBe(true)
  })

  it('hides on first day of new year if end was Dec 31', () => {
    const today = '2026-01-01'
    const row: CatalogRow = { display_start_date: '2025-01-01', display_end_date: '2025-12-31' }
    expect(isDisplayed(row, today)).toBe(false)
  })

  it('shows on first day of new year if start is Jan 1', () => {
    const today = '2026-01-01'
    const row: CatalogRow = { display_start_date: '2026-01-01', display_end_date: null }
    expect(isDisplayed(row, today)).toBe(true)
  })
})
