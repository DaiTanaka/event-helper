'use client'

import { useState, useRef, useEffect } from 'react'
import type { CanvasState, LayoutItem, LayoutAction } from '@/lib/layout-types'

type Props = {
  state: CanvasState
  dispatch: React.Dispatch<LayoutAction>
  selectedId: string | null
  onSelect: (id: string | null) => void
}

type MoveDrag = {
  kind: 'move'
  itemId: string
  startCanvasX: number
  startCanvasY: number
  startItemX: number
  startItemY: number
}

type ResizeDrag = {
  kind: 'resize'
  itemId: string
  hx: -1 | 0 | 1
  hy: -1 | 0 | 1
  anchorCanvasX: number
  anchorCanvasY: number
  origW: number
  origH: number
  rotRad: number
}

type RotateDrag = {
  kind: 'rotate'
  itemId: string
  centerCanvasX: number
  centerCanvasY: number
}

type PanDrag = {
  kind: 'pan'
  startMouseX: number
  startMouseY: number
  startPanX: number
  startPanY: number
}

type ActiveDrag = MoveDrag | ResizeDrag | RotateDrag | PanDrag

type DragDisplay = {
  itemId: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

type SnapGuide = { axis: 'x' | 'y'; value: number }

const HANDLE_R_PX = 5
const ROTATE_DIST_PX = 28
const SNAP_ITEM_PX = 8
const MIN_ITEM_SIZE = 10
const SEL_PAD_PX = 5

function snapToGrid(value: number, grid: number) {
  return Math.round(value / grid) * grid
}

function rotateVec(x: number, y: number, rad: number) {
  return {
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad),
  }
}

type SelectionHandlesProps = {
  selectedItem: LayoutItem
  dragDisplay: DragDisplay | null
  hr: number
  rotDist: number
  selPad: number
  onStartRotate: (e: React.PointerEvent, item: LayoutItem) => void
  onStartResize: (e: React.PointerEvent, item: LayoutItem, hx: -1 | 0 | 1, hy: -1 | 0 | 1) => void
}

function SelectionHandles({ selectedItem, dragDisplay, hr, rotDist, selPad, onStartRotate, onStartResize }: SelectionHandlesProps) {
  const isDrag = dragDisplay?.itemId === selectedItem.id
  const dx = isDrag ? dragDisplay!.x : selectedItem.x
  const dy = isDrag ? dragDisplay!.y : selectedItem.y
  const dw = isDrag ? dragDisplay!.width : selectedItem.width
  const dh = isDrag ? dragDisplay!.height : selectedItem.height
  const drot = isDrag ? dragDisplay!.rotation : selectedItem.rotation
  const cx = dx + dw / 2
  const cy = dy + dh / 2
  const liveItem: LayoutItem = { ...selectedItem, x: dx, y: dy, width: dw, height: dh, rotation: drot }

  const resizeHandles: { hx: -1 | 0 | 1; hy: -1 | 0 | 1; cursor: string }[] =
    selectedItem.shape === 'circle' ? [] : [
      { hx: -1, hy: -1, cursor: 'nwse-resize' },
      { hx:  0, hy: -1, cursor: 'ns-resize' },
      { hx:  1, hy: -1, cursor: 'nesw-resize' },
      { hx: -1, hy:  0, cursor: 'ew-resize' },
      { hx:  1, hy:  0, cursor: 'ew-resize' },
      { hx: -1, hy:  1, cursor: 'nesw-resize' },
      { hx:  0, hy:  1, cursor: 'ns-resize' },
      { hx:  1, hy:  1, cursor: 'nwse-resize' },
    ]

  return (
    <g transform={`translate(${cx},${cy}) rotate(${drot})`} style={{ pointerEvents: 'none' }}>
      {selectedItem.shape === 'circle' ? (
        <circle r={dw / 2 + selPad} fill="none"
          stroke="#2563eb" strokeWidth={1.5} strokeDasharray="6 3"
          vectorEffect="non-scaling-stroke" />
      ) : (
        <rect x={-dw / 2 - selPad} y={-dh / 2 - selPad}
          width={dw + selPad * 2} height={dh + selPad * 2}
          fill="none" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="6 3"
          vectorEffect="non-scaling-stroke" rx={4} />
      )}
      {!selectedItem.locked && (
        <>
          <line x1={0} y1={-dh / 2 - selPad} x2={0} y2={-dh / 2 - selPad - rotDist}
            stroke="#2563eb" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          <circle cx={0} cy={-dh / 2 - selPad - rotDist} r={hr}
            fill="white" stroke="#2563eb" strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            style={{ pointerEvents: 'all', cursor: 'crosshair' }}
            onPointerDown={e => onStartRotate(e, liveItem)} />
        </>
      )}
      {!selectedItem.locked && resizeHandles.map(({ hx, hy, cursor }) => (
        <circle
          key={`${hx}${hy}`}
          cx={hx * (dw / 2 + selPad)}
          cy={hy * (dh / 2 + selPad)}
          r={hr}
          fill="white" stroke="#2563eb" strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          style={{ pointerEvents: 'all', cursor }}
          onPointerDown={e => onStartResize(e, liveItem, hx, hy)} />
      ))}
    </g>
  )
}

export default function CanvasArea({ state, dispatch, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const [zoom, setZoom] = useState(0.25)
  const [panX, setPanX] = useState(40)
  const [panY, setPanY] = useState(40)

  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null)
  const [dragDisplay, setDragDisplay] = useState<DragDisplay | null>(null)
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([])

  const spaceDown = useRef(false)
  const [spaceDownState, setSpaceDownState] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const { width, height } = container.getBoundingClientRect()
    if (width === 0 || height === 0) return
    const margin = 60
    const z = Math.min((width - margin * 2) / state.roomWidth, (height - margin * 2) / state.roomHeight)
    const fz = Math.max(0.05, Math.min(2, z))
    setPanX((width - state.roomWidth * fz) / 2)
    setPanY((height - state.roomHeight * fz) / 2)
    setZoom(fz)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function screenToCanvas(sx: number, sy: number) {
    const rect = svgRef.current!.getBoundingClientRect()
    return { x: (sx - rect.left - panX) / zoom, y: (sy - rect.top - panY) / zoom }
  }

  function findItem(cx: number, cy: number): LayoutItem | null {
    for (let i = state.items.length - 1; i >= 0; i--) {
      const it = state.items[i]
      const icx = it.x + it.width / 2
      const icy = it.y + it.height / 2
      const dx = cx - icx, dy = cy - icy
      const rad = -it.rotation * (Math.PI / 180)
      const lx = dx * Math.cos(rad) - dy * Math.sin(rad)
      const ly = dx * Math.sin(rad) + dy * Math.cos(rad)
      if (it.shape === 'circle') {
        if (lx * lx + ly * ly <= (it.width / 2) ** 2) return it
      } else {
        if (Math.abs(lx) <= it.width / 2 && Math.abs(ly) <= it.height / 2) return it
      }
    }
    return null
  }

  function fitToScreen() {
    const container = containerRef.current
    if (!container) return
    const { width, height } = container.getBoundingClientRect()
    const margin = 60
    const z = Math.min((width - margin * 2) / state.roomWidth, (height - margin * 2) / state.roomHeight)
    const fz = Math.max(0.05, Math.min(2, z))
    setPanX((width - state.roomWidth * fz) / 2)
    setPanY((height - state.roomHeight * fz) / 2)
    setZoom(fz)
  }

  function computeItemSnap(
    draggingId: string,
    nx: number,
    ny: number,
    item: LayoutItem,
  ): { x: number; y: number; guides: SnapGuide[] } {
    const threshold = SNAP_ITEM_PX / zoom
    const others = state.items.filter(i => i.id !== draggingId)

    const myXs = [nx, nx + item.width / 2, nx + item.width]
    const myYs = [ny, ny + item.height / 2, ny + item.height]

    let bestDx = Infinity, bestDy = Infinity
    let snapXVal: number | null = null, snapYVal: number | null = null

    for (const other of others) {
      const oxs = [other.x, other.x + other.width / 2, other.x + other.width]
      const oys = [other.y, other.y + other.height / 2, other.y + other.height]
      for (const mx of myXs) {
        for (const ox of oxs) {
          const d = ox - mx
          if (Math.abs(d) < threshold && Math.abs(d) < Math.abs(bestDx)) {
            bestDx = d
            snapXVal = ox
          }
        }
      }
      for (const my of myYs) {
        for (const oy of oys) {
          const d = oy - my
          if (Math.abs(d) < threshold && Math.abs(d) < Math.abs(bestDy)) {
            bestDy = d
            snapYVal = oy
          }
        }
      }
    }

    return {
      x: nx + (isFinite(bestDx) ? bestDx : 0),
      y: ny + (isFinite(bestDy) ? bestDy : 0),
      guides: [
        ...(snapXVal !== null ? [{ axis: 'x' as const, value: snapXVal }] : []),
        ...(snapYVal !== null ? [{ axis: 'y' as const, value: snapYVal }] : []),
      ],
    }
  }

  function startResize(e: React.PointerEvent, item: LayoutItem, hx: -1 | 0 | 1, hy: -1 | 0 | 1) {
    e.stopPropagation()
    if (e.button !== 0) return
    svgRef.current!.setPointerCapture(e.pointerId)
    const rotRad = item.rotation * (Math.PI / 180)
    const cx = item.x + item.width / 2
    const cy = item.y + item.height / 2
    const anchorLocal = rotateVec(-hx * item.width / 2, -hy * item.height / 2, rotRad)
    setActiveDrag({
      kind: 'resize', itemId: item.id, hx, hy,
      anchorCanvasX: cx + anchorLocal.x,
      anchorCanvasY: cy + anchorLocal.y,
      origW: item.width, origH: item.height, rotRad,
    })
    setDragDisplay({ itemId: item.id, x: item.x, y: item.y, width: item.width, height: item.height, rotation: item.rotation })
  }

  function startRotate(e: React.PointerEvent, item: LayoutItem) {
    e.stopPropagation()
    if (e.button !== 0) return
    svgRef.current!.setPointerCapture(e.pointerId)
    setActiveDrag({
      kind: 'rotate', itemId: item.id,
      centerCanvasX: item.x + item.width / 2,
      centerCanvasY: item.y + item.height / 2,
    })
    setDragDisplay({ itemId: item.id, x: item.x, y: item.y, width: item.width, height: item.height, rotation: item.rotation })
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (e.button === 1 || spaceDown.current) {
      if (e.button === 1) e.preventDefault()
      svgRef.current!.setPointerCapture(e.pointerId)
      setActiveDrag({ kind: 'pan', startMouseX: e.clientX, startMouseY: e.clientY, startPanX: panX, startPanY: panY })
      return
    }
    if (e.button !== 0) return

    const canvas = screenToCanvas(e.clientX, e.clientY)
    const hit = findItem(canvas.x, canvas.y)

    if (hit && !hit.locked) {
      onSelect(hit.id)
      svgRef.current!.setPointerCapture(e.pointerId)
      setActiveDrag({
        kind: 'move', itemId: hit.id,
        startCanvasX: canvas.x, startCanvasY: canvas.y,
        startItemX: hit.x, startItemY: hit.y,
      })
      setDragDisplay({ itemId: hit.id, x: hit.x, y: hit.y, width: hit.width, height: hit.height, rotation: hit.rotation })
    } else if (hit?.locked) {
      onSelect(hit.id)
    } else {
      onSelect(null)
    }
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!activeDrag) return

    if (activeDrag.kind === 'pan') {
      setPanX(activeDrag.startPanX + e.clientX - activeDrag.startMouseX)
      setPanY(activeDrag.startPanY + e.clientY - activeDrag.startMouseY)
      return
    }

    const canvas = screenToCanvas(e.clientX, e.clientY)

    if (activeDrag.kind === 'move') {
      const item = state.items.find(i => i.id === activeDrag.itemId)!
      let nx = activeDrag.startItemX + canvas.x - activeDrag.startCanvasX
      let ny = activeDrag.startItemY + canvas.y - activeDrag.startCanvasY

      if (state.snapEnabled && state.gridSize > 0) {
        nx = snapToGrid(nx, state.gridSize)
        ny = snapToGrid(ny, state.gridSize)
      }

      const snap = computeItemSnap(activeDrag.itemId, nx, ny, item)
      nx = Math.max(0, Math.min(state.roomWidth - item.width, snap.x))
      ny = Math.max(0, Math.min(state.roomHeight - item.height, snap.y))
      setSnapGuides(snap.guides)
      setDragDisplay({ itemId: activeDrag.itemId, x: nx, y: ny, width: item.width, height: item.height, rotation: item.rotation })
      return
    }

    if (activeDrag.kind === 'resize') {
      const { hx, hy, anchorCanvasX, anchorCanvasY, origW, origH, rotRad } = activeDrag
      const vx = canvas.x - anchorCanvasX
      const vy = canvas.y - anchorCanvasY
      // Mouse vector in item local space
      const lx = vx * Math.cos(-rotRad) - vy * Math.sin(-rotRad)
      const ly = vx * Math.sin(-rotRad) + vy * Math.cos(-rotRad)

      const newW = hx !== 0 ? Math.max(MIN_ITEM_SIZE, lx * hx) : origW
      const newH = hy !== 0 ? Math.max(MIN_ITEM_SIZE, ly * hy) : origH

      // New center = anchor + rotate(handle_local_offset)
      const newCenter = rotateVec(hx * newW / 2, hy * newH / 2, rotRad)
      setDragDisplay({
        itemId: activeDrag.itemId,
        x: anchorCanvasX + newCenter.x - newW / 2,
        y: anchorCanvasY + newCenter.y - newH / 2,
        width: newW,
        height: newH,
        rotation: rotRad * (180 / Math.PI),
      })
      return
    }

    if (activeDrag.kind === 'rotate') {
      const dx = canvas.x - activeDrag.centerCanvasX
      const dy = canvas.y - activeDrag.centerCanvasY
      let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90
      if (e.shiftKey) angleDeg = Math.round(angleDeg / 15) * 15
      setDragDisplay(prev => prev ? { ...prev, rotation: angleDeg } : null)
    }
  }

  function handlePointerUp() {
    if (activeDrag && activeDrag.kind !== 'pan' && dragDisplay) {
      dispatch({
        type: 'UPDATE_ITEM',
        id: dragDisplay.itemId,
        updates: {
          x: Math.round(dragDisplay.x),
          y: Math.round(dragDisplay.y),
          width: Math.round(dragDisplay.width),
          height: Math.round(dragDisplay.height),
          rotation: Math.round(dragDisplay.rotation * 10) / 10,
        },
      })
    }
    setActiveDrag(null)
    setDragDisplay(null)
    setSnapGuides([])
  }

  function handleWheel(e: React.WheelEvent<SVGSVGElement>) {
    e.preventDefault()
    const rect = svgRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.1 : 0.9
    const nz = Math.max(0.05, Math.min(5, zoom * factor))
    setPanX(mx - (mx - panX) * (nz / zoom))
    setPanY(my - (my - panY) * (nz / zoom))
    setZoom(nz)
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLSelectElement)) {
        spaceDown.current = true
        setSpaceDownState(true)
        e.preventDefault()
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceDown.current = false
        setSpaceDownState(false)
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // Grid lines
  const gridLines: React.ReactNode[] = []
  if (state.gridSize > 0) {
    for (let x = 0; x <= state.roomWidth; x += state.gridSize) {
      const major = x % (state.gridSize * 2) === 0
      gridLines.push(
        <line key={`gv${x}`} x1={x} y1={0} x2={x} y2={state.roomHeight}
          stroke={major ? '#d1d5db' : '#e5e7eb'} strokeWidth={major ? 1 : 0.5}
          vectorEffect="non-scaling-stroke" />
      )
    }
    for (let y = 0; y <= state.roomHeight; y += state.gridSize) {
      const major = y % (state.gridSize * 2) === 0
      gridLines.push(
        <line key={`gh${y}`} x1={0} y1={y} x2={state.roomWidth} y2={y}
          stroke={major ? '#d1d5db' : '#e5e7eb'} strokeWidth={major ? 1 : 0.5}
          vectorEffect="non-scaling-stroke" />
      )
    }
  }

  const selectedItem = state.items.find(i => i.id === selectedId)
  const hr = HANDLE_R_PX / zoom
  const rotDist = ROTATE_DIST_PX / zoom
  const selPad = SEL_PAD_PX / zoom

  const cursorStyle = activeDrag?.kind === 'pan' || activeDrag?.kind === 'move'
    ? 'grabbing'
    : spaceDownState ? 'grab' : 'default'

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden bg-slate-400">
      <svg
        ref={svgRef}
        className="w-full h-full select-none"
        style={{ cursor: cursorStyle }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <g transform={`translate(${panX},${panY}) scale(${zoom})`}>
          {/* 部屋の背景 */}
          <rect x={0} y={0} width={state.roomWidth} height={state.roomHeight} fill="white" />

          {/* グリッド */}
          {gridLines}

          {/* 部屋の枠 */}
          <rect x={0} y={0} width={state.roomWidth} height={state.roomHeight}
            fill="none" stroke="#64748b" strokeWidth={4} vectorEffect="non-scaling-stroke" />

          {/* 寸法ラベル */}
          <text x={state.roomWidth / 2} y={-16} textAnchor="middle" fontSize={14}
            fill="#64748b" fontFamily="sans-serif" vectorEffect="non-scaling-stroke">
            {state.roomWidth}cm（{(state.roomWidth / 100).toFixed(1)}m）
          </text>
          <text x={-16} y={state.roomHeight / 2} textAnchor="middle" fontSize={14}
            fill="#64748b" fontFamily="sans-serif"
            transform={`rotate(-90,-16,${state.roomHeight / 2})`} vectorEffect="non-scaling-stroke">
            {state.roomHeight}cm（{(state.roomHeight / 100).toFixed(1)}m）
          </text>

          {/* アイテム間スナップガイド */}
          {snapGuides.map((g, i) =>
            g.axis === 'x' ? (
              <line key={i} x1={g.value} y1={-9999} x2={g.value} y2={9999}
                stroke="#e11d48" strokeWidth={1} strokeDasharray="4 2"
                vectorEffect="non-scaling-stroke" style={{ pointerEvents: 'none' }} />
            ) : (
              <line key={i} x1={-9999} y1={g.value} x2={9999} y2={g.value}
                stroke="#e11d48" strokeWidth={1} strokeDasharray="4 2"
                vectorEffect="non-scaling-stroke" style={{ pointerEvents: 'none' }} />
            )
          )}

          {/* アイテム */}
          {state.items.map(item => {
            const isDrag = dragDisplay?.itemId === item.id
            const dx = isDrag ? dragDisplay!.x : item.x
            const dy = isDrag ? dragDisplay!.y : item.y
            const dw = isDrag ? dragDisplay!.width : item.width
            const dh = isDrag ? dragDisplay!.height : item.height
            const drot = isDrag ? dragDisplay!.rotation : item.rotation
            const cx = dx + dw / 2
            const cy = dy + dh / 2
            const isSel = item.id === selectedId
            const sc = isSel ? '#2563eb' : '#9ca3af'
            const sw = isSel ? 3 : 1
            const fs = Math.max(8, Math.min(20, Math.min(dw, dh) / 4))
            const fs2 = Math.max(6, fs * 0.65)

            // Person shape geometry
            const pHeadR = dw * 0.28
            const pHeadCy = -dh / 2 + pHeadR * 1.05
            const pBodyTop = pHeadCy + pHeadR * 1.1
            const pBodyW = dw * 0.70
            const pBodyH = dh / 2 - pBodyTop
            const pLabelY = (pBodyTop + dh / 2) / 2

            return (
              <g key={item.id}
                transform={`translate(${cx},${cy}) rotate(${drot})`}
                style={{ cursor: item.locked ? 'not-allowed' : 'grab', opacity: isDrag ? 0.75 : 1 }}>
                {item.shape === 'circle' ? (
                  <circle r={dw / 2} fill={item.color}
                    stroke={sc} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
                ) : item.shape === 'person' ? (
                  <>
                    <circle cx={0} cy={pHeadCy} r={pHeadR}
                      fill={item.color} stroke={sc} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
                    <rect x={-pBodyW / 2} y={pBodyTop} width={pBodyW} height={pBodyH}
                      rx={pBodyW * 0.22} fill={item.color}
                      stroke={sc} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
                  </>
                ) : (
                  <rect x={-dw / 2} y={-dh / 2} width={dw} height={dh}
                    fill={item.color} stroke={sc}
                    strokeWidth={sw} vectorEffect="non-scaling-stroke" rx={2} />
                )}
                {item.locked && (
                  <text x={dw / 2 - 8} y={-dh / 2 + 2}
                    fontSize={10} textAnchor="end" dominantBaseline="hanging"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}>🔒</text>
                )}
                <text x={0} y={item.shape === 'person' ? pLabelY : -fs2 * 0.3}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={fs} fill="#1f2937" fontFamily="sans-serif"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>{item.label}</text>
                {item.shape !== 'person' && (
                  <text x={0} y={fs * 0.75} textAnchor="middle" dominantBaseline="middle"
                    fontSize={fs2} fill="#6b7280" fontFamily="sans-serif"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    {Math.round(dw)}×{Math.round(dh)}
                  </text>
                )}
              </g>
            )
          })}

          {/* 選択ハンドル */}
          {selectedItem && (
            <SelectionHandles
              selectedItem={selectedItem}
              dragDisplay={dragDisplay}
              hr={hr}
              rotDist={rotDist}
              selPad={selPad}
              onStartRotate={startRotate}
              onStartResize={startResize}
            />
          )}
        </g>
      </svg>

      {/* ズームコントロール */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 shadow-lg">
        <button onClick={() => setZoom(z => Math.min(5, z * 1.25))}
          className="w-8 h-8 bg-white rounded-t border border-slate-200 text-slate-600 hover:bg-slate-50 text-base font-bold flex items-center justify-center">
          +
        </button>
        <button onClick={() => setZoom(z => Math.max(0.05, z / 1.25))}
          className="w-8 h-8 bg-white border-x border-b border-slate-200 text-slate-600 hover:bg-slate-50 text-base font-bold flex items-center justify-center">
          −
        </button>
        <button onClick={fitToScreen}
          className="w-8 h-8 bg-white rounded-b border-x border-b border-slate-200 text-slate-500 hover:bg-slate-50 text-xs flex items-center justify-center">
          全体
        </button>
      </div>

      {/* ズーム表示 */}
      <div className="absolute bottom-4 left-4 text-xs text-white bg-slate-600/60 px-2 py-0.5 rounded backdrop-blur-sm">
        {Math.round(zoom * 100)}%
      </div>

      {/* スナップ表示 */}
      {state.snapEnabled && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-white bg-slate-600/60 px-2 py-0.5 rounded backdrop-blur-sm">
          {state.gridSize > 0 ? `スナップ ON（${state.gridSize}cm）` : 'スナップ ON（アイテム間）'}
        </div>
      )}
    </div>
  )
}
