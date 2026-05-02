'use client'

import { useState } from 'react'
import { PRESET_ITEMS, PRESET_CATEGORIES } from '@/lib/layout-presets'
import type { CanvasState, LayoutItem, LayoutAction, ItemShape } from '@/lib/layout-types'

type Props = {
  state: CanvasState
  dispatch: React.Dispatch<LayoutAction>
  onSelect: (id: string) => void
}

function CustomItemForm({ onAdd }: {
  onAdd: (shape: ItemShape, w: number, h: number, label: string) => void
}) {
  const [shape, setShape] = useState<ItemShape>('rect')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [label, setLabel] = useState('')

  function handleAdd() {
    const w = Number(width)
    const h = Number(height)
    if (!w || !h || !label.trim()) return
    onAdd(shape, w, h, label.trim())
    setWidth('')
    setHeight('')
    setLabel('')
  }

  return (
    <div className="px-3 py-3 space-y-2 border-t border-slate-100">
      <div className="flex gap-1">
        <button
          onClick={() => setShape('rect')}
          className={`flex-1 py-1 text-xs rounded transition-colors ${shape === 'rect' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          □ 四角
        </button>
        <button
          onClick={() => setShape('circle')}
          className={`flex-1 py-1 text-xs rounded transition-colors ${shape === 'circle' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          ○ 丸
        </button>
        <button
          onClick={() => setShape('person')}
          className={`flex-1 py-1 text-xs rounded transition-colors ${shape === 'person' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          人
        </button>
      </div>
      <input
        value={label}
        onChange={e => setLabel(e.target.value)}
        placeholder="名前"
        className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
      />
      <div className="flex gap-1 items-center">
        <input
          value={width}
          onChange={e => setWidth(e.target.value)}
          placeholder="幅"
          type="number"
          min={1}
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        <span className="text-slate-400 text-xs shrink-0">×</span>
        <input
          value={height}
          onChange={e => setHeight(e.target.value)}
          placeholder="高さ"
          type="number"
          min={1}
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        <span className="text-slate-400 text-xs shrink-0">cm</span>
      </div>
      <button
        onClick={handleAdd}
        disabled={!label.trim() || !width || !height}
        className="w-full py-1.5 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-40 transition-colors"
      >
        追加
      </button>
    </div>
  )
}

export default function ItemLibrary({ state, dispatch, onSelect }: Props) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(PRESET_CATEGORIES))

  function toggleCategory(cat: string) {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) { next.delete(cat) } else { next.add(cat) }
      return next
    })
  }

  function addPreset(preset: (typeof PRESET_ITEMS)[number]) {
    const id = crypto.randomUUID()
    const item: LayoutItem = {
      id,
      presetId: preset.id,
      shape: preset.shape,
      x: Math.max(0, (state.roomWidth - preset.width) / 2),
      y: Math.max(0, (state.roomHeight - preset.height) / 2),
      width: preset.width,
      height: preset.height,
      rotation: 0,
      label: preset.label,
      color: preset.color,
      locked: false,
    }
    dispatch({ type: 'ADD_ITEM', item })
    onSelect(id)
  }

  function addCustom(shape: ItemShape, w: number, h: number, label: string) {
    const id = crypto.randomUUID()
    const item: LayoutItem = {
      id,
      shape,
      x: Math.max(0, (state.roomWidth - w) / 2),
      y: Math.max(0, (state.roomHeight - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      label,
      color: '#e2e8f0',
      locked: false,
    }
    dispatch({ type: 'ADD_ITEM', item })
    onSelect(id)
  }

  const chairCount = state.items.filter(i => i.presetId?.startsWith('chair-') || i.presetId === 'sofa').length
  const itemCount = state.items.length

  return (
    <div className="w-52 bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0">
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">アイテム</p>
        {itemCount > 0 && (
          <p className="text-xs text-slate-400 mt-0.5">
            合計 {itemCount}点
            {chairCount > 0 && <span className="ml-1">/ 椅子 {chairCount}脚</span>}
          </p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {PRESET_CATEGORIES.map(cat => (
          <div key={cat}>
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-500 flex items-center justify-between hover:bg-slate-100 transition-colors sticky top-0 z-10"
            >
              {cat}
              <svg className={`w-3 h-3 transition-transform ${openCategories.has(cat) ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategories.has(cat) && PRESET_ITEMS.filter(p => p.category === cat).map(preset => (
              <button
                key={preset.id}
                onClick={() => addPreset(preset)}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                {preset.shape === 'person' ? (
                  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" style={{ color: preset.color }}>
                    <circle cx="12" cy="7" r="4" fill="currentColor" stroke="#9ca3af" strokeWidth="1"/>
                    <rect x="6" y="12" width="12" height="10" rx="3" fill="currentColor" stroke="#9ca3af" strokeWidth="1"/>
                  </svg>
                ) : (
                  <div
                    className="w-6 h-6 border border-slate-200 shrink-0"
                    style={{
                      background: preset.color,
                      borderRadius: preset.shape === 'circle' ? '50%' : '2px',
                    }}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-slate-700 truncate">{preset.label}</p>
                  <p className="text-xs text-slate-400">{preset.width}×{preset.height}cm</p>
                </div>
              </button>
            ))}
          </div>
        ))}

        <div>
          <div className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-500 sticky top-0 z-10">
            カスタム
          </div>
          <CustomItemForm onAdd={addCustom} />
        </div>
      </div>
    </div>
  )
}
