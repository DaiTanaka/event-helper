export type ItemShape = 'rect' | 'circle' | 'person'

export type LayoutItem = {
  id: string
  presetId?: string
  shape: ItemShape
  x: number
  y: number
  width: number
  height: number
  rotation: number
  label: string
  color: string
  locked: boolean
}

export type CanvasState = {
  roomWidth: number
  roomHeight: number
  items: LayoutItem[]
  gridSize: number
  snapEnabled: boolean
}

export type HistoryState = {
  past: CanvasState[]
  present: CanvasState
  future: CanvasState[]
}

export type LayoutAction =
  | { type: 'ADD_ITEM'; item: LayoutItem }
  | { type: 'UPDATE_ITEM'; id: string; updates: Partial<LayoutItem> }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'DUPLICATE_ITEM'; id: string }
  | { type: 'SET_ROOM'; width: number; height: number }
  | { type: 'SET_GRID_SIZE'; size: number }
  | { type: 'TOGGLE_SNAP' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD'; state: CanvasState }
