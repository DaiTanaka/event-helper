/**
 * Swaps the element with the given id up or down within items.
 * Returns the reordered array, or null if the move is a no-op
 * (id not found, or already at the boundary).
 */
export function swapByDirection<T extends { id: string }>(
  items: T[],
  id: string,
  direction: 'up' | 'down',
): T[] | null {
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return null
  if (direction === 'up' && idx === 0) return null
  if (direction === 'down' && idx === items.length - 1) return null

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  const result = [...items]
  ;[result[idx], result[swapIdx]] = [result[swapIdx], result[idx]]
  return result
}
