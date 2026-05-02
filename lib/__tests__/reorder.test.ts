import { describe, it, expect } from 'vitest'
import { swapByDirection } from '@/lib/reorder'

type Item = { id: string; label: string }

function items(...labels: string[]): Item[] {
  return labels.map((label, i) => ({ id: String(i), label }))
}

// ── 基本動作 ──────────────────────────────────────────────────

describe('swapByDirection – up', () => {
  it('moves middle item up by one', () => {
    const result = swapByDirection(items('A', 'B', 'C'), '1', 'up')
    expect(result?.map(i => i.label)).toEqual(['B', 'A', 'C'])
  })

  it('moves last item up by one', () => {
    const result = swapByDirection(items('A', 'B', 'C'), '2', 'up')
    expect(result?.map(i => i.label)).toEqual(['A', 'C', 'B'])
  })

  it('returns null when item is already first', () => {
    expect(swapByDirection(items('A', 'B', 'C'), '0', 'up')).toBeNull()
  })
})

describe('swapByDirection – down', () => {
  it('moves first item down by one', () => {
    const result = swapByDirection(items('A', 'B', 'C'), '0', 'down')
    expect(result?.map(i => i.label)).toEqual(['B', 'A', 'C'])
  })

  it('moves middle item down by one', () => {
    const result = swapByDirection(items('A', 'B', 'C'), '1', 'down')
    expect(result?.map(i => i.label)).toEqual(['A', 'C', 'B'])
  })

  it('returns null when item is already last', () => {
    expect(swapByDirection(items('A', 'B', 'C'), '2', 'down')).toBeNull()
  })
})

// ── エッジケース ──────────────────────────────────────────────

describe('swapByDirection – edge cases', () => {
  it('returns null when id not found', () => {
    expect(swapByDirection(items('A', 'B'), 'nonexistent', 'up')).toBeNull()
    expect(swapByDirection(items('A', 'B'), 'nonexistent', 'down')).toBeNull()
  })

  it('returns null for single-item list moving up', () => {
    expect(swapByDirection(items('A'), '0', 'up')).toBeNull()
  })

  it('returns null for single-item list moving down', () => {
    expect(swapByDirection(items('A'), '0', 'down')).toBeNull()
  })

  it('returns null for empty list', () => {
    expect(swapByDirection([], 'x', 'up')).toBeNull()
    expect(swapByDirection([], 'x', 'down')).toBeNull()
  })

  it('does not mutate the original array', () => {
    const original = items('A', 'B', 'C')
    const before = original.map(i => i.label)
    swapByDirection(original, '0', 'down')
    expect(original.map(i => i.label)).toEqual(before)
  })

  it('returns all items (length unchanged)', () => {
    const list = items('A', 'B', 'C', 'D')
    const result = swapByDirection(list, '1', 'up')
    expect(result).toHaveLength(4)
  })

  it('only the two swapped items change position', () => {
    const result = swapByDirection(items('A', 'B', 'C', 'D'), '1', 'down')!
    expect(result[0].label).toBe('A')
    expect(result[1].label).toBe('C')
    expect(result[2].label).toBe('B')
    expect(result[3].label).toBe('D')
  })
})

// ── スケジュール移動シミュレーション ──────────────────────────
// moveSchedule は dayItems でフィルタしてから swapByDirection を呼ぶ

describe('swapByDirection – grouped reorder simulation (like moveSchedule)', () => {
  type Schedule = { id: string; day_number: number }
  const schedules: Schedule[] = [
    { id: 's1', day_number: 1 },
    { id: 's2', day_number: 1 },
    { id: 's3', day_number: 1 },
    { id: 's4', day_number: 2 },
    { id: 's5', day_number: 2 },
  ]

  it('moves s2 up within day 1 only', () => {
    const day1 = schedules.filter(s => s.day_number === 1)
    const result = swapByDirection(day1, 's2', 'up')!
    expect(result.map(s => s.id)).toEqual(['s2', 's1', 's3'])
  })

  it('cannot move s1 up (already first in day 1)', () => {
    const day1 = schedules.filter(s => s.day_number === 1)
    expect(swapByDirection(day1, 's1', 'up')).toBeNull()
  })

  it('day 2 items are unaffected by day 1 reorder', () => {
    const day1 = schedules.filter(s => s.day_number === 1)
    swapByDirection(day1, 's2', 'up')
    const day2 = schedules.filter(s => s.day_number === 2)
    expect(day2.map(s => s.id)).toEqual(['s4', 's5'])
  })

  it('s4 can move down within day 2', () => {
    const day2 = schedules.filter(s => s.day_number === 2)
    const result = swapByDirection(day2, 's4', 'down')!
    expect(result.map(s => s.id)).toEqual(['s5', 's4'])
  })
})
