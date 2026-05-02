import { describe, it, expect } from 'vitest'
import { generateThumbnail } from '@/lib/thumbnail'
import type { CanvasState, LayoutItem } from '@/lib/layout-types'

function baseState(overrides: Partial<CanvasState> = {}): CanvasState {
  return {
    roomWidth: 2000,
    roomHeight: 1500,
    gridSize: 0,
    snapEnabled: true,
    items: [],
    ...overrides,
  }
}

function makeItem(overrides: Partial<LayoutItem> = {}): LayoutItem {
  return {
    id: 'item-1',
    shape: 'rect',
    x: 100,
    y: 100,
    width: 180,
    height: 45,
    rotation: 0,
    label: 'テーブル',
    color: '#fde68a',
    locked: false,
    ...overrides,
  }
}

// ── SVG 基本構造 ──────────────────────────────────────────────

describe('generateThumbnail – structure', () => {
  it('returns a string starting with <svg', () => {
    const svg = generateThumbnail(baseState())
    expect(svg.startsWith('<svg')).toBe(true)
  })

  it('contains xmlns attribute', () => {
    const svg = generateThumbnail(baseState())
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
  })

  it('contains a viewBox', () => {
    const svg = generateThumbnail(baseState())
    expect(svg).toContain('viewBox=')
  })

  it('contains white background rect', () => {
    const svg = generateThumbnail(baseState())
    expect(svg).toContain('fill="white"')
  })

  it('contains border rect at the end', () => {
    const svg = generateThumbnail(baseState())
    expect(svg).toContain('stroke="#64748b"')
  })
})

// ── スケール計算 ──────────────────────────────────────────────

describe('generateThumbnail – scale', () => {
  it('width-constrained canvas fits within 240', () => {
    const svg = generateThumbnail(baseState({ roomWidth: 2000, roomHeight: 100 }))
    const m = svg.match(/width="(\d+)"/)
    expect(m).not.toBeNull()
    expect(Number(m![1])).toBeLessThanOrEqual(240)
  })

  it('height-constrained canvas fits within 180', () => {
    const svg = generateThumbnail(baseState({ roomWidth: 100, roomHeight: 1500 }))
    const m = svg.match(/height="(\d+)"/)
    expect(m).not.toBeNull()
    expect(Number(m![1])).toBeLessThanOrEqual(180)
  })

  it('square canvas fits within both limits', () => {
    const svg = generateThumbnail(baseState({ roomWidth: 1000, roomHeight: 1000 }))
    const wm = svg.match(/width="(\d+)"/)
    const hm = svg.match(/height="(\d+)"/)
    expect(Number(wm![1])).toBeLessThanOrEqual(240)
    expect(Number(hm![1])).toBeLessThanOrEqual(180)
  })

  it('standard 2000x1500 room renders at 240x180', () => {
    const svg = generateThumbnail(baseState({ roomWidth: 2000, roomHeight: 1500 }))
    expect(svg).toContain('width="240"')
    expect(svg).toContain('height="180"')
  })
})

// ── 空キャンバス ──────────────────────────────────────────────

describe('generateThumbnail – empty canvas', () => {
  it('produces valid SVG with no items', () => {
    const svg = generateThumbnail(baseState())
    expect(svg).not.toContain('<circle')
    expect(svg).not.toContain('fill="#')
  })
})

// ── rect アイテム ─────────────────────────────────────────────

describe('generateThumbnail – rect items', () => {
  it('renders a rect element for shape=rect', () => {
    const svg = generateThumbnail(baseState({ items: [makeItem()] }))
    expect(svg).toContain('<rect')
  })

  it('includes item color in rect fill', () => {
    const svg = generateThumbnail(baseState({ items: [makeItem({ color: '#fde68a' })] }))
    expect(svg).toContain('fill="#fde68a"')
  })

  it('adds rotation transform when rotation !== 0', () => {
    const svg = generateThumbnail(baseState({ items: [makeItem({ rotation: 45 })] }))
    expect(svg).toContain('transform="rotate(45,')
  })

  it('does not add transform when rotation is 0', () => {
    const svg = generateThumbnail(baseState({ items: [makeItem({ rotation: 0 })] }))
    expect(svg).not.toContain('transform="rotate')
  })
})

// ── circle アイテム ───────────────────────────────────────────

describe('generateThumbnail – circle items', () => {
  it('renders a circle element for shape=circle', () => {
    const item = makeItem({ shape: 'circle', width: 90, height: 90, color: '#fde68a' })
    const svg = generateThumbnail(baseState({ items: [item] }))
    expect(svg).toContain('<circle')
  })

  it('circle has a positive radius', () => {
    const item = makeItem({ shape: 'circle', width: 90, height: 90 })
    const svg = generateThumbnail(baseState({ items: [item] }))
    const m = svg.match(/<circle[^>]+r="([\d.]+)"/)
    expect(m).not.toBeNull()
    expect(Number(m![1])).toBeGreaterThan(0)
  })

  it('circle radius is half of scaled width', () => {
    const state = baseState({ roomWidth: 2000, roomHeight: 1500, items: [makeItem({ shape: 'circle', width: 100, height: 100, x: 0, y: 0 })] })
    const scale = Math.min(240 / 2000, 180 / 1500)
    const expectedR = ((100 * scale) / 2).toFixed(1)
    const svg = generateThumbnail(state)
    expect(svg).toContain(`r="${expectedR}"`)
  })
})

// ── person アイテム ───────────────────────────────────────────

describe('generateThumbnail – person items', () => {
  it('renders head (circle) and body (rect) for shape=person', () => {
    const item = makeItem({ shape: 'person', width: 40, height: 60, color: '#93c5fd' })
    const svg = generateThumbnail(baseState({ items: [item] }))
    expect(svg).toContain('<circle')
    expect(svg).toContain('<rect')
  })

  it('person body height is positive for all preset sizes', () => {
    const sizes = [
      { width: 40, height: 60 },  // staff / director / mc
      { width: 35, height: 55 },  // participant / adult
      { width: 25, height: 42 },  // child
    ]
    for (const { width, height } of sizes) {
      const item = makeItem({ shape: 'person', width, height })
      const svg = generateThumbnail(baseState({ items: [item] }))
      // 最初の height は SVG canvas, 2番目以降にアイテムの body が含まれる
      const allHeights = [...svg.matchAll(/height="([\d.]+)"/g)].map(m => Number(m[1]))
      // body の height は正値であるはず
      for (const h of allHeights) {
        expect(h, `person ${width}x${height}: non-positive height`).toBeGreaterThan(0)
      }
    }
  })

  it('person head circle uses item color', () => {
    const item = makeItem({ shape: 'person', width: 40, height: 60, color: '#a78bfa' })
    const svg = generateThumbnail(baseState({ items: [item] }))
    expect(svg).toContain('fill="#a78bfa"')
  })
})

// ── 複数アイテム ──────────────────────────────────────────────

describe('generateThumbnail – multiple items', () => {
  it('renders all items', () => {
    const items: LayoutItem[] = [
      makeItem({ id: 'a', shape: 'rect', color: '#fde68a' }),
      makeItem({ id: 'b', shape: 'circle', width: 90, height: 90, color: '#bfdbfe' }),
      makeItem({ id: 'c', shape: 'person', width: 40, height: 60, color: '#93c5fd' }),
    ]
    const svg = generateThumbnail(baseState({ items }))
    expect(svg).toContain('#fde68a')
    expect(svg).toContain('#bfdbfe')
    expect(svg).toContain('#93c5fd')
  })
})
