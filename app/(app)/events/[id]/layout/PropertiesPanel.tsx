'use client'

import { useState } from 'react'
import { ITEM_COLORS } from '@/lib/layout-presets'
import type { CanvasState, LayoutItem, LayoutAction } from '@/lib/layout-types'

type Props = {
  state: CanvasState
  dispatch: React.Dispatch<LayoutAction>
  selectedItem: LayoutItem | null
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  unit?: string
}) {
  const [prevValue, setPrevValue] = useState(value)
  const [local, setLocal] = useState(String(Math.round(value)))
  if (prevValue !== value) {
    setPrevValue(value)
    setLocal(String(Math.round(value)))
  }

  return (
    <div className="flex-1">
      <label className="block text-xs text-slate-400 mb-0.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={local}
          min={min}
          max={max}
          onChange={e => setLocal(e.target.value)}
          onBlur={() => {
            const n = Number(local)
            if (!isNaN(n)) onChange(n)
          }}
          onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
          className={`w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400 ${unit ? 'pr-6' : ''}`}
        />
        {unit && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">{unit}</span>
        )}
      </div>
    </div>
  )
}

function RoomSettings({ state, dispatch }: { state: CanvasState; dispatch: React.Dispatch<LayoutAction> }) {
  return (
    <div className="px-3 py-3 space-y-3">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">会場設定</p>

      <div className="space-y-2">
        <p className="text-xs text-slate-500">部屋サイズ</p>
        <div className="flex gap-2">
          <NumberInput
            label="幅"
            value={state.roomWidth}
            min={100}
            max={10000}
            unit="cm"
            onChange={w => dispatch({ type: 'SET_ROOM', width: w, height: state.roomHeight })}
          />
          <NumberInput
            label="奥行き"
            value={state.roomHeight}
            min={100}
            max={10000}
            unit="cm"
            onChange={h => dispatch({ type: 'SET_ROOM', width: state.roomWidth, height: h })}
          />
        </div>
        <p className="text-xs text-slate-400">
          {(state.roomWidth / 100).toFixed(1)}m × {(state.roomHeight / 100).toFixed(1)}m
        </p>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">グリッド間隔</label>
        <select
          value={state.gridSize}
          onChange={e => dispatch({ type: 'SET_GRID_SIZE', size: Number(e.target.value) })}
          className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          <option value={0}>なし</option>
          <option value={5}>5cm</option>
          <option value={10}>10cm</option>
          <option value={25}>25cm</option>
          <option value={50}>50cm</option>
          <option value={100}>100cm（1m）</option>
          <option value={200}>200cm（2m）</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-600">スナップ</label>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SNAP' })}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${state.snapEnabled ? 'bg-orange-500' : 'bg-slate-200'}`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${state.snapEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-400 space-y-0.5">
          <span className="block"><kbd className="font-mono bg-slate-100 px-1 rounded text-xs">Del</kbd> 削除</span>
          <span className="block"><kbd className="font-mono bg-slate-100 px-1 rounded text-xs">Ctrl+C</kbd> コピー</span>
          <span className="block"><kbd className="font-mono bg-slate-100 px-1 rounded text-xs">Ctrl+V</kbd> 貼り付け</span>
          <span className="block"><kbd className="font-mono bg-slate-100 px-1 rounded text-xs">Ctrl+Z</kbd> 元に戻す</span>
          <span className="block"><kbd className="font-mono bg-slate-100 px-1 rounded text-xs">Ctrl+Y</kbd> やり直し</span>
          <span className="block"><kbd className="font-mono bg-slate-100 px-1 rounded text-xs">Space</kbd>+ドラッグ 移動</span>
          <span className="block">ホイール ズーム</span>
        </p>
      </div>
    </div>
  )
}

function ItemProperties({ item, dispatch }: { item: LayoutItem; dispatch: React.Dispatch<LayoutAction> }) {
  function update(updates: Partial<LayoutItem>) {
    dispatch({ type: 'UPDATE_ITEM', id: item.id, updates })
  }

  const [prevItem, setPrevItem] = useState({ id: item.id, label: item.label })
  const [labelLocal, setLabelLocal] = useState(item.label)
  if (prevItem.id !== item.id || prevItem.label !== item.label) {
    setPrevItem({ id: item.id, label: item.label })
    setLabelLocal(item.label)
  }

  return (
    <div className="px-3 py-3 space-y-3">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">プロパティ</p>

      {/* ラベル */}
      <div>
        <label className="block text-xs text-slate-500 mb-1">ラベル</label>
        <input
          value={labelLocal}
          onChange={e => setLabelLocal(e.target.value)}
          onBlur={() => update({ label: labelLocal })}
          onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </div>

      {/* 位置 */}
      <div>
        <p className="text-xs text-slate-500 mb-1">位置 (cm)</p>
        <div className="flex gap-2">
          <NumberInput label="X" value={item.x} min={0} onChange={x => update({ x })} />
          <NumberInput label="Y" value={item.y} min={0} onChange={y => update({ y })} />
        </div>
      </div>

      {/* サイズ */}
      <div>
        <p className="text-xs text-slate-500 mb-1">サイズ (cm)</p>
        <div className="flex gap-2">
          <NumberInput label="幅" value={item.width} min={1} onChange={width => update({ width })} />
          <NumberInput label="高さ" value={item.height} min={1} onChange={height => update({ height })} />
        </div>
      </div>

      {/* 回転 */}
      <div>
        <p className="text-xs text-slate-500 mb-1">回転</p>
        <div className="flex gap-2 items-end">
          <NumberInput label="角度" value={item.rotation} min={-180} max={180} unit="°" onChange={rotation => update({ rotation })} />
          <div className="flex gap-1 mb-0.5">
            {[0, 45, 90, -90].map(deg => (
              <button
                key={deg}
                onClick={() => update({ rotation: deg })}
                className="px-1.5 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50"
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 色 */}
      <div>
        <p className="text-xs text-slate-500 mb-1">色</p>
        <div className="flex flex-wrap gap-1">
          {ITEM_COLORS.map(color => (
            <button
              key={color}
              onClick={() => update({ color })}
              className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${item.color === color ? 'border-orange-400 scale-110' : 'border-transparent'}`}
              style={{ background: color }}
            />
          ))}
          <input
            type="color"
            value={item.color}
            onChange={e => update({ color: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer border border-slate-200"
            title="カスタムカラー"
          />
        </div>
      </div>

      {/* ロック */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-600">移動をロック</label>
        <button
          onClick={() => update({ locked: !item.locked })}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.locked ? 'bg-orange-500' : 'bg-slate-200'}`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${item.locked ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* 複製・削除 */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => dispatch({ type: 'DUPLICATE_ITEM', id: item.id })}
          className="flex-1 py-1.5 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors"
        >
          複製
        </button>
        <button
          onClick={() => dispatch({ type: 'DELETE_ITEM', id: item.id })}
          className="flex-1 py-1.5 text-xs border border-red-200 rounded hover:bg-red-50 text-red-600 transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  )
}

export default function PropertiesPanel({ state, dispatch, selectedItem }: Props) {
  return (
    <div className="w-56 bg-white border-l border-slate-200 flex flex-col overflow-hidden shrink-0">
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {selectedItem ? selectedItem.label : '設定'}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedItem ? (
          <ItemProperties key={selectedItem.id} item={selectedItem} dispatch={dispatch} />
        ) : (
          <RoomSettings state={state} dispatch={dispatch} />
        )}
      </div>
    </div>
  )
}
