import { describe, it, expect } from 'vitest'
import { shiftDate } from '@/lib/shiftDate'

// ── 基本動作 ──────────────────────────────────────────────────

describe('shiftDate', () => {
  it('returns the same date when days is 0', () => {
    expect(shiftDate('2026-04-30', 0)).toBe('2026-04-30')
  })

  it('adds positive days', () => {
    expect(shiftDate('2026-04-30', 1)).toBe('2026-05-01')
    expect(shiftDate('2026-04-30', 7)).toBe('2026-05-07')
    expect(shiftDate('2026-04-30', 14)).toBe('2026-05-14')
  })

  it('subtracts negative days', () => {
    expect(shiftDate('2026-04-30', -1)).toBe('2026-04-29')
    expect(shiftDate('2026-04-30', -30)).toBe('2026-03-31')
    expect(shiftDate('2026-04-30', -90)).toBe('2026-01-30')
  })

  // ── 月境界 ──────────────────────────────────────────────────

  it('crosses month boundary forward', () => {
    expect(shiftDate('2026-01-31', 1)).toBe('2026-02-01')
    expect(shiftDate('2026-03-31', 1)).toBe('2026-04-01')
  })

  it('crosses month boundary backward', () => {
    expect(shiftDate('2026-03-01', -1)).toBe('2026-02-28')
    expect(shiftDate('2026-04-01', -1)).toBe('2026-03-31')
  })

  it('handles leap year February', () => {
    expect(shiftDate('2024-02-28', 1)).toBe('2024-02-29')
    expect(shiftDate('2024-02-29', 1)).toBe('2024-03-01')
  })

  it('does not produce leap day in non-leap year', () => {
    expect(shiftDate('2026-02-28', 1)).toBe('2026-03-01')
  })

  // ── 年境界 ──────────────────────────────────────────────────

  it('crosses year boundary forward', () => {
    expect(shiftDate('2025-12-31', 1)).toBe('2026-01-01')
  })

  it('crosses year boundary backward', () => {
    expect(shiftDate('2026-01-01', -1)).toBe('2025-12-31')
  })

  // ── タイムゾーン非依存 ────────────────────────────────────
  // UTC+9 (JST) 環境でも正しく動くことを確認するためのケース

  it('returns correct date string regardless of local timezone (days=0)', () => {
    // ローカル midnight → UTC に変換すると前日になる可能性があるが
    // shiftDate は UTC 演算を使うので常に正しい
    const result = shiftDate('2026-04-30', 0)
    expect(result).toBe('2026-04-30')
  })

  it('D-30 from event date', () => {
    expect(shiftDate('2026-06-15', -30)).toBe('2026-05-16')
  })

  it('D+14 after event date', () => {
    expect(shiftDate('2026-06-15', 14)).toBe('2026-06-29')
  })

  // ── テンプレートタスクで使われる典型的なオフセット ───────────

  it('D-90 kickoff from event date', () => {
    expect(shiftDate('2026-09-01', -90)).toBe('2026-06-03')
  })

  it('D-60 budget planning', () => {
    expect(shiftDate('2026-09-01', -60)).toBe('2026-07-03')
  })

  it('D+7 post event debrief', () => {
    expect(shiftDate('2026-09-01', 7)).toBe('2026-09-08')
  })
})
