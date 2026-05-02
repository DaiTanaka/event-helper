import { describe, it, expect } from 'vitest'
import { LAYOUT_TEMPLATES } from '@/lib/layout-templates'
import { layoutReducer, INITIAL_HISTORY } from '@/lib/layout-reducer'
const VALID_SHAPES = new Set(['rect', 'circle', 'person'])
const HEX_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/

// ── Array structure ────────────────────────────────────────────

describe('LAYOUT_TEMPLATES array', () => {
  it('exports exactly 4 templates', () => {
    expect(LAYOUT_TEMPLATES).toHaveLength(4)
  })

  it('all template ids are unique', () => {
    const ids = LAYOUT_TEMPLATES.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('contains expected template ids', () => {
    const ids = new Set(LAYOUT_TEMPLATES.map(t => t.id))
    for (const expected of ['stage', 'ushape', 'party', 'exhibition']) {
      expect(ids.has(expected), `missing template id: ${expected}`).toBe(true)
    }
  })

  it('all templates have non-empty label', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      expect(tpl.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('all templates have non-empty description', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      expect(tpl.description.trim().length).toBeGreaterThan(0)
    }
  })

  it('all templates have a non-empty emoji', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      expect(tpl.emoji.trim().length).toBeGreaterThan(0)
    }
  })
})

// ── Canvas dimensions ──────────────────────────────────────────

describe('canvas dimensions', () => {
  it('all templates share roomWidth=2000', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      expect(tpl.state.roomWidth).toBe(2000)
    }
  })

  it('all templates share roomHeight=1500', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      expect(tpl.state.roomHeight).toBe(1500)
    }
  })

  it('all templates have snapEnabled=true', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      expect(tpl.state.snapEnabled).toBe(true)
    }
  })

  it('all templates have at least 5 items', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      expect(tpl.state.items.length, `template ${tpl.id} has too few items`).toBeGreaterThanOrEqual(5)
    }
  })
})

// ── Per-template item validity ─────────────────────────────────

for (const tpl of LAYOUT_TEMPLATES) {
  describe(`template "${tpl.id}" — item validity`, () => {
    const { items, roomWidth, roomHeight } = tpl.state

    it('all item ids are unique within the template', () => {
      const ids = items.map(i => i.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all items have a valid shape', () => {
      for (const item of items) {
        expect(VALID_SHAPES.has(item.shape), `item "${item.id}" has invalid shape: ${item.shape}`).toBe(true)
      }
    })

    it('all items have positive width', () => {
      for (const item of items) {
        expect(item.width, `item "${item.id}" has non-positive width`).toBeGreaterThan(0)
      }
    })

    it('all items have positive height', () => {
      for (const item of items) {
        expect(item.height, `item "${item.id}" has non-positive height`).toBeGreaterThan(0)
      }
    })

    it('all items start within room bounds (x >= 0, y >= 0)', () => {
      for (const item of items) {
        expect(item.x, `item "${item.id}" x is negative`).toBeGreaterThanOrEqual(0)
        expect(item.y, `item "${item.id}" y is negative`).toBeGreaterThanOrEqual(0)
      }
    })

    it('all items fit within room width (x + width <= roomWidth)', () => {
      for (const item of items) {
        expect(
          item.x + item.width,
          `item "${item.id}" extends beyond roomWidth (${item.x}+${item.width}=${item.x + item.width} > ${roomWidth})`
        ).toBeLessThanOrEqual(roomWidth)
      }
    })

    it('all items fit within room height (y + height <= roomHeight)', () => {
      for (const item of items) {
        expect(
          item.y + item.height,
          `item "${item.id}" extends beyond roomHeight (${item.y}+${item.height}=${item.y + item.height} > ${roomHeight})`
        ).toBeLessThanOrEqual(roomHeight)
      }
    })

    it('all items have a non-empty label', () => {
      for (const item of items) {
        expect(item.label.trim().length, `item "${item.id}" has empty label`).toBeGreaterThan(0)
      }
    })

    it('all items have a valid hex color', () => {
      for (const item of items) {
        expect(HEX_COLOR_RE.test(item.color), `item "${item.id}" has invalid color: ${item.color}`).toBe(true)
      }
    })

    it('all items have numeric rotation', () => {
      for (const item of items) {
        expect(typeof item.rotation, `item "${item.id}" rotation is not a number`).toBe('number')
        expect(isNaN(item.rotation)).toBe(false)
      }
    })

    it('all items have boolean locked', () => {
      for (const item of items) {
        expect(typeof item.locked, `item "${item.id}" locked is not boolean`).toBe('boolean')
      }
    })
  })
}

// ── Stage template semantic checks ────────────────────────────

describe('stage template — chair placement', () => {
  const tpl = LAYOUT_TEMPLATES.find(t => t.id === 'stage')!
  const items = tpl.state.items
  const stageItem = items.find(i => i.label === 'ステージ')!
  const chairs = items.filter(i => i.label === '椅子')
  const tables = items.filter(i => i.label === '長テーブル')

  it('has a stage item', () => {
    expect(stageItem).toBeDefined()
  })

  it('has chairs', () => {
    expect(chairs.length).toBeGreaterThan(0)
  })

  it('has long tables', () => {
    expect(tables.length).toBeGreaterThan(0)
  })

  it('has a screen item', () => {
    expect(items.find(i => i.label === 'スクリーン')).toBeDefined()
  })

  it('has a podium item', () => {
    expect(items.find(i => i.label === '演台')).toBeDefined()
  })

  it('all chairs are south of (below) the stage bottom edge', () => {
    const stageBottom = stageItem.y + stageItem.height
    for (const chair of chairs) {
      expect(
        chair.y,
        `chair "${chair.id}" (y=${chair.y}) should be below stage bottom (${stageBottom})`
      ).toBeGreaterThan(stageBottom)
    }
  })

  it('every chair has at least one table whose bottom edge is at or above the chair top', () => {
    for (const chair of chairs) {
      const tablesAbove = tables.filter(t => t.y + t.height <= chair.y)
      expect(
        tablesAbove.length,
        `chair "${chair.id}" (y=${chair.y}) has no table directly above it — chairs must face the stage`
      ).toBeGreaterThan(0)
    }
  })
})

// ── U-shape template semantic checks ──────────────────────────

describe('ushape template — chair placement', () => {
  const tpl = LAYOUT_TEMPLATES.find(t => t.id === 'ushape')!
  const items = tpl.state.items
  const chairs = items.filter(i => i.label === '椅子')
  const topTable   = items.find(i => i.id === 'u-ttop')!
  const botTable   = items.find(i => i.id === 'u-tbot')!
  const leftTable  = items.find(i => i.id === 'u-tleft')!
  const rightTable = items.find(i => i.id === 'u-tright')!

  it('has all four perimeter table segments', () => {
    expect(topTable).toBeDefined()
    expect(botTable).toBeDefined()
    expect(leftTable).toBeDefined()
    expect(rightTable).toBeDefined()
  })

  it('has chairs', () => {
    expect(chairs.length).toBeGreaterThan(0)
  })

  it('all chairs are OUTSIDE the perimeter rectangle', () => {
    const perimTop   = topTable.y
    const perimBot   = botTable.y + botTable.height
    const perimLeft  = leftTable.x
    const perimRight = rightTable.x + rightTable.width

    for (const chair of chairs) {
      const northOfPerim = chair.y + chair.height <= perimTop
      const southOfPerim = chair.y >= perimBot
      const westOfPerim  = chair.x + chair.width <= perimLeft
      const eastOfPerim  = chair.x >= perimRight
      const isOutside    = northOfPerim || southOfPerim || westOfPerim || eastOfPerim

      expect(
        isOutside,
        `chair "${chair.id}" (x=${chair.x},y=${chair.y}) is inside the perimeter — chairs must face inward from the outside`
      ).toBe(true)
    }
  })
})

// ── Party template checks ──────────────────────────────────────

describe('party template', () => {
  const tpl = LAYOUT_TEMPLATES.find(t => t.id === 'party')!
  const items = tpl.state.items

  it('has round tables (circle shapes)', () => {
    const roundTables = items.filter(i => i.shape === 'circle')
    expect(roundTables.length).toBeGreaterThanOrEqual(4)
  })

  it('has a bar counter', () => {
    expect(items.find(i => i.label.includes('バー'))).toBeDefined()
  })

  it('has an entrance', () => {
    expect(items.find(i => i.label === '入口')).toBeDefined()
  })
})

// ── Exhibition template checks ─────────────────────────────────

describe('exhibition template', () => {
  const tpl = LAYOUT_TEMPLATES.find(t => t.id === 'exhibition')!
  const items = tpl.state.items

  it('has at least 10 booth items', () => {
    const booths = items.filter(i => i.label.startsWith('ブース'))
    expect(booths.length).toBeGreaterThanOrEqual(10)
  })

  it('all booth labels are unique', () => {
    const boothLabels = items.filter(i => i.label.startsWith('ブース')).map(i => i.label)
    expect(new Set(boothLabels).size).toBe(boothLabels.length)
  })

  it('has an information desk', () => {
    expect(items.find(i => i.label === 'インフォメーション')).toBeDefined()
  })

  it('has an entrance', () => {
    expect(items.find(i => i.label === '入口')).toBeDefined()
  })
})

// ── LOAD action integration ────────────────────────────────────

describe('LOAD action with layout templates', () => {
  it('LOAD replaces present state with template state', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      const result = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: tpl.state })
      expect(result.present).toEqual(tpl.state)
    }
  })

  it('LOAD clears past and future history', () => {
    const stageTpl = LAYOUT_TEMPLATES.find(t => t.id === 'stage')!
    // First add an item (creates history), then LOAD
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'ADD_ITEM', item: stageTpl.state.items[0] })
    const h2 = layoutReducer(h1, { type: 'UNDO' })
    expect(h2.future.length).toBeGreaterThan(0)
    const h3 = layoutReducer(h2, { type: 'LOAD', state: stageTpl.state })
    expect(h3.past).toHaveLength(0)
    expect(h3.future).toHaveLength(0)
  })

  it('LOAD produces correct item count for every template', () => {
    for (const tpl of LAYOUT_TEMPLATES) {
      const result = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: tpl.state })
      expect(result.present.items).toHaveLength(tpl.state.items.length)
    }
  })

  it('items remain editable after LOAD', () => {
    const tpl = LAYOUT_TEMPLATES.find(t => t.id === 'party')!
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: tpl.state })
    const firstId = h1.present.items[0].id
    const h2 = layoutReducer(h1, { type: 'UPDATE_ITEM', id: firstId, updates: { label: '変更後' } })
    expect(h2.present.items[0].label).toBe('変更後')
    expect(h2.past).toHaveLength(1)
  })

  it('item can be deleted from loaded template', () => {
    const tpl = LAYOUT_TEMPLATES.find(t => t.id === 'exhibition')!
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: tpl.state })
    const originalCount = h1.present.items.length
    const firstId = h1.present.items[0].id
    const h2 = layoutReducer(h1, { type: 'DELETE_ITEM', id: firstId })
    expect(h2.present.items).toHaveLength(originalCount - 1)
  })

  it('loaded template state can be undone', () => {
    const tpl = LAYOUT_TEMPLATES.find(t => t.id === 'ushape')!
    const h1 = layoutReducer(INITIAL_HISTORY, { type: 'LOAD', state: tpl.state })
    // ADD then UNDO should restore template state
    const h2 = layoutReducer(h1, { type: 'ADD_ITEM', item: tpl.state.items[0] })
    const h3 = layoutReducer(h2, { type: 'UNDO' })
    expect(h3.present).toEqual(tpl.state)
  })
})

// ── Cross-template uniqueness ──────────────────────────────────

describe('cross-template item id uniqueness', () => {
  it('item ids are unique across all templates (no id collisions)', () => {
    const allIds: string[] = LAYOUT_TEMPLATES.flatMap(t => t.state.items.map(i => i.id))
    expect(new Set(allIds).size).toBe(allIds.length)
  })
})
