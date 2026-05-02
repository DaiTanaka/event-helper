import { describe, it, expect } from 'vitest'
import { layoutReducer, INITIAL_CANVAS_STATE, INITIAL_HISTORY } from '@/lib/layout-reducer'
import type { LayoutItem, CanvasState } from '@/lib/layout-types'

function mockItem(id = 'item-1'): LayoutItem {
  return {
    id,
    shape: 'rect',
    x: 100,
    y: 100,
    width: 180,
    height: 45,
    rotation: 0,
    label: 'テーブル',
    color: '#fde68a',
    locked: false,
  }
}

describe('INITIAL_CANVAS_STATE', () => {
  it('roomWidth is 2000', () => {
    expect(INITIAL_CANVAS_STATE.roomWidth).toBe(2000)
  })
  it('roomHeight is 1500', () => {
    expect(INITIAL_CANVAS_STATE.roomHeight).toBe(1500)
  })
  it('items is empty array', () => {
    expect(INITIAL_CANVAS_STATE.items).toEqual([])
  })
  it('gridSize defaults to 0 (no grid)', () => {
    expect(INITIAL_CANVAS_STATE.gridSize).toBe(0)
  })
  it('snapEnabled defaults to true', () => {
    expect(INITIAL_CANVAS_STATE.snapEnabled).toBe(true)
  })
})

describe('INITIAL_HISTORY', () => {
  it('has empty past and future', () => {
    expect(INITIAL_HISTORY.past).toHaveLength(0)
    expect(INITIAL_HISTORY.future).toHaveLength(0)
  })
  it('present equals INITIAL_CANVAS_STATE', () => {
    expect(INITIAL_HISTORY.present).toEqual(INITIAL_CANVAS_STATE)
  })
})

describe('ADD_ITEM', () => {
  it('adds item to present.items', () => {
    const item = mockItem()
    const result = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    expect(result.present.items).toHaveLength(1)
    expect(result.present.items[0]).toEqual(item)
  })

  it('pushes previous state to past', () => {
    const item = mockItem()
    const result = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    expect(result.past).toHaveLength(1)
    expect(result.past[0]).toEqual(INITIAL_CANVAS_STATE)
  })

  it('clears future', () => {
    const item = mockItem()
    const result = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    expect(result.future).toHaveLength(0)
  })

  it('accumulates multiple items', () => {
    const a = mockItem('a')
    const b = mockItem('b')
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item: a })
    const h2 = layoutReducer(h1, { type: 'ADD_ITEM', item: b })
    expect(h2.present.items).toHaveLength(2)
  })
})

describe('UPDATE_ITEM', () => {
  it('updates matching item fields', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'UPDATE_ITEM', id: item.id, updates: { x: 200, label: '更新後' } })
    expect(h2.present.items[0].x).toBe(200)
    expect(h2.present.items[0].label).toBe('更新後')
  })

  it('preserves unchanged fields', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'UPDATE_ITEM', id: item.id, updates: { x: 200 } })
    expect(h2.present.items[0].color).toBe('#fde68a')
    expect(h2.present.items[0].y).toBe(100)
  })

  it('does not modify other items', () => {
    const a = mockItem('a')
    const b = mockItem('b')
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item: a })
    const h2 = layoutReducer(h1, { type: 'ADD_ITEM', item: b })
    const h3 = layoutReducer(h2, { type: 'UPDATE_ITEM', id: 'a', updates: { x: 999 } })
    expect(h3.present.items.find(i => i.id === 'b')?.x).toBe(100)
  })

  it('pushes to history', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const histLen = h1.past.length
    const h2 = layoutReducer(h1, { type: 'UPDATE_ITEM', id: item.id, updates: { x: 999 } })
    expect(h2.past.length).toBe(histLen + 1)
  })
})

describe('DELETE_ITEM', () => {
  it('removes the item by id', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'DELETE_ITEM', id: item.id })
    expect(h2.present.items).toHaveLength(0)
  })

  it('keeps other items intact', () => {
    const a = mockItem('a')
    const b = mockItem('b')
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item: a })
    const h2 = layoutReducer(h1, { type: 'ADD_ITEM', item: b })
    const h3 = layoutReducer(h2, { type: 'DELETE_ITEM', id: 'a' })
    expect(h3.present.items).toHaveLength(1)
    expect(h3.present.items[0].id).toBe('b')
  })

  it('pushes to history', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'DELETE_ITEM', id: item.id })
    expect(h2.past.length).toBe(2)
  })
})

describe('DUPLICATE_ITEM', () => {
  it('adds copy with 20px offset', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'DUPLICATE_ITEM', id: item.id })
    expect(h2.present.items).toHaveLength(2)
    const dupe = h2.present.items[1]
    expect(dupe.x).toBe(item.x + 20)
    expect(dupe.y).toBe(item.y + 20)
  })

  it('assigns a new id', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'DUPLICATE_ITEM', id: item.id })
    const dupe = h2.present.items[1]
    expect(dupe.id).not.toBe(item.id)
  })

  it('preserves all other properties', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'DUPLICATE_ITEM', id: item.id })
    const dupe = h2.present.items[1]
    expect(dupe.label).toBe(item.label)
    expect(dupe.color).toBe(item.color)
    expect(dupe.width).toBe(item.width)
    expect(dupe.shape).toBe(item.shape)
  })

  it('is a no-op when id not found', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'DUPLICATE_ITEM', id: 'nonexistent' })
    expect(result).toBe(INITIAL_HISTORY)
  })
})

describe('UNDO', () => {
  it('restores previous state', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'UNDO' })
    expect(h2.present.items).toHaveLength(0)
  })

  it('moves current present to future', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const stateWithItem = h1.present
    const h2 = layoutReducer(h1, { type: 'UNDO' })
    expect(h2.future[0]).toEqual(stateWithItem)
  })

  it('reduces past length by 1', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'UNDO' })
    expect(h2.past).toHaveLength(0)
  })

  it('is a no-op on empty past (returns same reference)', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'UNDO' })
    expect(result).toBe(INITIAL_HISTORY)
  })
})

describe('REDO', () => {
  it('reapplies undone state', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'UNDO' })
    const h3 = layoutReducer(h2, { type: 'REDO' })
    expect(h3.present.items).toHaveLength(1)
  })

  it('clears one entry from future', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'UNDO' })
    const h3 = layoutReducer(h2, { type: 'REDO' })
    expect(h3.future).toHaveLength(0)
  })

  it('is a no-op on empty future (returns same reference)', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'REDO' })
    expect(result).toBe(INITIAL_HISTORY)
  })

  it('new action clears future', () => {
    const itemA = mockItem('a')
    const itemB = mockItem('b')
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item: itemA })
    const h2 = layoutReducer(h1, { type: 'UNDO' })
    expect(h2.future).toHaveLength(1)
    const h3 = layoutReducer(h2, { type: 'ADD_ITEM', item: itemB })
    expect(h3.future).toHaveLength(0)
  })
})

describe('SET_ROOM', () => {
  it('updates roomWidth and roomHeight', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'SET_ROOM', width: 3000, height: 2000 })
    expect(result.present.roomWidth).toBe(3000)
    expect(result.present.roomHeight).toBe(2000)
  })

  it('pushes previous state to history', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'SET_ROOM', width: 3000, height: 2000 })
    expect(result.past).toHaveLength(1)
  })

  it('does not affect items', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'SET_ROOM', width: 3000, height: 2000 })
    expect(h2.present.items).toHaveLength(1)
  })
})

describe('SET_GRID_SIZE', () => {
  it('updates gridSize', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'SET_GRID_SIZE', size: 50 })
    expect(result.present.gridSize).toBe(50)
  })

  it('does NOT push to history (no undo for grid)', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'SET_GRID_SIZE', size: 50 })
    expect(result.past).toHaveLength(0)
  })

  it('accepts 0 to disable grid', () => {
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'SET_GRID_SIZE', size: 100 })
    const h2 = layoutReducer(h1, { type: 'SET_GRID_SIZE', size: 0 })
    expect(h2.present.gridSize).toBe(0)
  })
})

describe('TOGGLE_SNAP', () => {
  it('toggles snapEnabled from true to false', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'TOGGLE_SNAP' })
    expect(result.present.snapEnabled).toBe(false)
  })

  it('toggles snapEnabled back to true', () => {
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'TOGGLE_SNAP' })
    const h2 = layoutReducer(h1, { type: 'TOGGLE_SNAP' })
    expect(h2.present.snapEnabled).toBe(true)
  })

  it('does NOT push to history', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'TOGGLE_SNAP' })
    expect(result.past).toHaveLength(0)
  })
})

describe('LOAD', () => {
  it('replaces present with new state', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const newState: CanvasState = { ...INITIAL_CANVAS_STATE, roomWidth: 5000 }
    const h2 = layoutReducer(h1, { type: 'LOAD', state: newState })
    expect(h2.present.roomWidth).toBe(5000)
    expect(h2.present.items).toHaveLength(0)
  })

  it('clears past and future', () => {
    const item = mockItem()
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item })
    const h2 = layoutReducer(h1, { type: 'UNDO' })
    const newState: CanvasState = { ...INITIAL_CANVAS_STATE }
    const h3 = layoutReducer(h2, { type: 'LOAD', state: newState })
    expect(h3.past).toHaveLength(0)
    expect(h3.future).toHaveLength(0)
  })

  it('deduplicates items with the same id', () => {
    const dup = mockItem('dup-id')
    const corrupted: CanvasState = {
      ...INITIAL_CANVAS_STATE,
      items: [dup, { ...dup }, { ...dup }],
    }
    const result = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: corrupted })
    expect(result.present.items).toHaveLength(1)
    expect(result.present.items[0].id).toBe('dup-id')
  })

  it('keeps the first occurrence when deduplicating', () => {
    const first = mockItem('x')
    const second = { ...mockItem('x'), label: '別ラベル' }
    const corrupted: CanvasState = {
      ...INITIAL_CANVAS_STATE,
      items: [first, second],
    }
    const result = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: corrupted })
    expect(result.present.items[0].label).toBe(first.label)
  })

  it('passes through clean items unchanged', () => {
    const a = mockItem('a')
    const b = mockItem('b')
    const clean: CanvasState = { ...INITIAL_CANVAS_STATE, items: [a, b] }
    const result = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: clean })
    expect(result.present.items).toHaveLength(2)
  })

  it('handles empty items array', () => {
    const result = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: INITIAL_CANVAS_STATE })
    expect(result.present.items).toHaveLength(0)
  })
})

describe('history limit', () => {
  it('past does not exceed 50 entries', () => {
    let history = INITIAL_HISTORY
    for (let i = 0; i < 60; i++) {
      history = layoutReducer(history, { type: 'SET_ROOM', width: 1000 + i, height: 1000 })
    }
    expect(history.past.length).toBeLessThanOrEqual(50)
  })

  it('most recent states are preserved when limit is reached', () => {
    let history = INITIAL_HISTORY
    for (let i = 0; i < 60; i++) {
      history = layoutReducer(history, { type: 'SET_ROOM', width: 1000 + i, height: 1000 })
    }
    // last ADD pushed width=1059 to present; past should have width=1058 as last entry
    expect(history.past[history.past.length - 1].roomWidth).toBe(1058)
  })
})
