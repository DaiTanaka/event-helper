import { describe, it, expect } from 'vitest'
import type { EventContent, EventBudgetItem } from '@/lib/types'

// ── テストデータファクトリ ────────────────────────────────────
function makeContent(overrides: Partial<EventContent> = {}): EventContent {
  return {
    id: 'c1',
    event_id: 'ev1',
    catalog_id: null,
    title: 'テストコンテンツ',
    category: 'ワークショップ',
    company_name: 'テスト株式会社',
    estimated_cost: null,
    actual_cost: null,
    status: 'considering',
    cancel_reason: null,
    notes: null,
    url: null,
    og_image_url: null,
    sort_order: 0,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeBudgetItem(overrides: Partial<EventBudgetItem> = {}): EventBudgetItem {
  return {
    id: 'b1',
    event_id: 'ev1',
    category: 'その他',
    name: 'テスト費用',
    quantity: 1,
    unit_price: 10000,
    actual_price: null,
    notes: null,
    sort_order: 0,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

// ── 純粋な集計ロジック（BudgetClientと同じ計算式） ─────────────

function calcContentEstimated(contents: EventContent[]) {
  return contents.reduce((s, c) => s + (c.estimated_cost ?? 0), 0)
}

function calcContentActual(contents: EventContent[]) {
  return contents.reduce((s, c) => s + (c.actual_cost ?? 0), 0)
}

function calcConfirmedEstimated(contents: EventContent[]) {
  return contents.filter(c => c.status === 'confirmed').reduce((s, c) => s + (c.estimated_cost ?? 0), 0)
}

function calcItemsEstimated(items: EventBudgetItem[]) {
  return items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
}

function calcItemsActual(items: EventBudgetItem[]) {
  return items.reduce((s, i) => s + (i.actual_price ?? i.unit_price * i.quantity), 0)
}

function calcRemaining(totalBudget: number | null, totalEstimated: number) {
  return totalBudget != null ? totalBudget - totalEstimated : null
}

// ── コンテンツ集計 ────────────────────────────────────────────

describe('calcContentEstimated', () => {
  it('returns 0 for empty list', () => {
    expect(calcContentEstimated([])).toBe(0)
  })

  it('sums estimated_cost across all contents', () => {
    const contents = [
      makeContent({ id: 'c1', estimated_cost: 50000 }),
      makeContent({ id: 'c2', estimated_cost: 30000 }),
    ]
    expect(calcContentEstimated(contents)).toBe(80000)
  })

  it('treats null estimated_cost as 0', () => {
    const contents = [
      makeContent({ id: 'c1', estimated_cost: null }),
      makeContent({ id: 'c2', estimated_cost: 20000 }),
    ]
    expect(calcContentEstimated(contents)).toBe(20000)
  })

  it('handles all nulls gracefully', () => {
    const contents = [
      makeContent({ id: 'c1', estimated_cost: null }),
      makeContent({ id: 'c2', estimated_cost: null }),
    ]
    expect(calcContentEstimated(contents)).toBe(0)
  })
})

describe('calcContentActual', () => {
  it('returns 0 for empty list', () => {
    expect(calcContentActual([])).toBe(0)
  })

  it('sums actual_cost across all contents', () => {
    const contents = [
      makeContent({ id: 'c1', actual_cost: 48000 }),
      makeContent({ id: 'c2', actual_cost: 32000 }),
    ]
    expect(calcContentActual(contents)).toBe(80000)
  })

  it('treats null actual_cost as 0', () => {
    const contents = [makeContent({ id: 'c1', actual_cost: null })]
    expect(calcContentActual(contents)).toBe(0)
  })
})

describe('calcConfirmedEstimated', () => {
  it('only sums confirmed contents', () => {
    const contents = [
      makeContent({ id: 'c1', status: 'confirmed', estimated_cost: 50000 }),
      makeContent({ id: 'c2', status: 'considering', estimated_cost: 30000 }),
      makeContent({ id: 'c3', status: 'cancelled', estimated_cost: 10000 }),
    ]
    expect(calcConfirmedEstimated(contents)).toBe(50000)
  })

  it('returns 0 when no confirmed contents', () => {
    const contents = [
      makeContent({ id: 'c1', status: 'considering', estimated_cost: 99999 }),
    ]
    expect(calcConfirmedEstimated(contents)).toBe(0)
  })

  it('sums multiple confirmed contents', () => {
    const contents = [
      makeContent({ id: 'c1', status: 'confirmed', estimated_cost: 100000 }),
      makeContent({ id: 'c2', status: 'confirmed', estimated_cost: 200000 }),
    ]
    expect(calcConfirmedEstimated(contents)).toBe(300000)
  })
})

// ── 予算項目集計 ──────────────────────────────────────────────

describe('calcItemsEstimated', () => {
  it('returns 0 for empty list', () => {
    expect(calcItemsEstimated([])).toBe(0)
  })

  it('multiplies unit_price by quantity', () => {
    const items = [makeBudgetItem({ unit_price: 5000, quantity: 3 })]
    expect(calcItemsEstimated(items)).toBe(15000)
  })

  it('sums across multiple items', () => {
    const items = [
      makeBudgetItem({ id: 'b1', unit_price: 10000, quantity: 2 }),
      makeBudgetItem({ id: 'b2', unit_price: 5000, quantity: 4 }),
    ]
    expect(calcItemsEstimated(items)).toBe(40000)
  })

  it('handles quantity of 1 correctly', () => {
    const items = [makeBudgetItem({ unit_price: 30000, quantity: 1 })]
    expect(calcItemsEstimated(items)).toBe(30000)
  })
})

describe('calcItemsActual', () => {
  it('uses actual_price when set', () => {
    const items = [makeBudgetItem({ unit_price: 10000, quantity: 2, actual_price: 18000 })]
    expect(calcItemsActual(items)).toBe(18000)
  })

  it('falls back to unit_price * quantity when actual_price is null', () => {
    const items = [makeBudgetItem({ unit_price: 10000, quantity: 2, actual_price: null })]
    expect(calcItemsActual(items)).toBe(20000)
  })

  it('mixes actual and estimated correctly', () => {
    const items = [
      makeBudgetItem({ id: 'b1', unit_price: 10000, quantity: 2, actual_price: 18000 }),
      makeBudgetItem({ id: 'b2', unit_price: 5000, quantity: 3, actual_price: null }),
    ]
    expect(calcItemsActual(items)).toBe(18000 + 15000)
  })

  it('returns 0 for empty list', () => {
    expect(calcItemsActual([])).toBe(0)
  })
})

// ── 残予算 ────────────────────────────────────────────────────

describe('calcRemaining', () => {
  it('returns null when totalBudget is null', () => {
    expect(calcRemaining(null, 100000)).toBeNull()
  })

  it('returns positive remaining when under budget', () => {
    expect(calcRemaining(500000, 300000)).toBe(200000)
  })

  it('returns 0 when exactly at budget', () => {
    expect(calcRemaining(300000, 300000)).toBe(0)
  })

  it('returns negative when over budget', () => {
    expect(calcRemaining(200000, 300000)).toBe(-100000)
  })

  it('handles zero totalEstimated', () => {
    expect(calcRemaining(500000, 0)).toBe(500000)
  })
})

// ── 統合: 全体集計 ────────────────────────────────────────────

describe('budget totals integration', () => {
  it('totalEstimated combines confirmed contents and budget items', () => {
    const contents = [
      makeContent({ id: 'c1', status: 'confirmed', estimated_cost: 100000 }),
      makeContent({ id: 'c2', status: 'considering', estimated_cost: 50000 }),
    ]
    const items = [
      makeBudgetItem({ id: 'b1', unit_price: 20000, quantity: 2 }),
    ]
    const confirmedEst = calcConfirmedEstimated(contents)
    const itemsEst = calcItemsEstimated(items)
    expect(confirmedEst + itemsEst).toBe(100000 + 40000)
  })

  it('remaining budget is negative when over budget', () => {
    const contents = [
      makeContent({ id: 'c1', status: 'confirmed', estimated_cost: 400000 }),
    ]
    const items = [makeBudgetItem({ id: 'b1', unit_price: 200000, quantity: 1 })]
    const total = calcConfirmedEstimated(contents) + calcItemsEstimated(items)
    expect(calcRemaining(500000, total)).toBe(-100000)
  })
})
