/**
 * Returns a YYYY-MM-DD date string that is `days` days offset from `baseDate`.
 * Uses UTC arithmetic to avoid timezone-dependent off-by-one errors.
 */
export function shiftDate(baseDate: string, days: number): string {
  const y = Number(baseDate.slice(0, 4))
  const m = Number(baseDate.slice(5, 7))
  const d = Number(baseDate.slice(8, 10))
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}
