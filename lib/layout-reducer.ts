import type { HistoryState, LayoutAction, CanvasState } from './layout-types'

export const INITIAL_CANVAS_STATE: CanvasState = {
  roomWidth: 2000,
  roomHeight: 1500,
  items: [],
  gridSize: 0,
  snapEnabled: true,
}

export const INITIAL_HISTORY: HistoryState = {
  past: [],
  present: INITIAL_CANVAS_STATE,
  future: [],
}

function pushHistory(history: HistoryState, newPresent: CanvasState): HistoryState {
  return {
    past: [...history.past, history.present].slice(-50),
    present: newPresent,
    future: [],
  }
}

export function layoutReducer(history: HistoryState, action: LayoutAction): HistoryState {
  const { present } = history

  switch (action.type) {
    case 'UNDO': {
      if (history.past.length === 0) return history
      const past = [...history.past]
      const newPresent = past.pop()!
      return { past, present: newPresent, future: [present, ...history.future] }
    }
    case 'REDO': {
      if (history.future.length === 0) return history
      const [newPresent, ...future] = history.future
      return { past: [...history.past, present], present: newPresent, future }
    }
    case 'LOAD': {
      const seen = new Set<string>()
      const items = action.state.items.filter(item => {
        if (seen.has(item.id)) return false
        seen.add(item.id)
        return true
      })
      return { past: [], present: { ...action.state, items }, future: [] }
    }

    case 'ADD_ITEM':
      return pushHistory(history, { ...present, items: [...present.items, action.item] })

    case 'UPDATE_ITEM':
      return pushHistory(history, {
        ...present,
        items: present.items.map(item =>
          item.id === action.id ? { ...item, ...action.updates } : item
        ),
      })

    case 'DELETE_ITEM':
      return pushHistory(history, {
        ...present,
        items: present.items.filter(item => item.id !== action.id),
      })

    case 'DUPLICATE_ITEM': {
      const source = present.items.find(i => i.id === action.id)
      if (!source) return history
      const dupe = { ...source, id: crypto.randomUUID(), x: source.x + 20, y: source.y + 20 }
      return pushHistory(history, { ...present, items: [...present.items, dupe] })
    }

    case 'SET_ROOM':
      return pushHistory(history, { ...present, roomWidth: action.width, roomHeight: action.height })

    case 'SET_GRID_SIZE':
      return { ...history, present: { ...present, gridSize: action.size } }

    case 'TOGGLE_SNAP':
      return { ...history, present: { ...present, snapEnabled: !present.snapEnabled } }

    default:
      return history
  }
}
