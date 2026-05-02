'use client'

import { useReducer, useState, useEffect, useRef } from 'react'
import { layoutReducer, INITIAL_CANVAS_STATE } from '@/lib/layout-reducer'
import type { CanvasState, LayoutItem } from '@/lib/layout-types'
import ItemLibrary from '@/app/(app)/events/[id]/layout/ItemLibrary'
import CanvasArea from '@/app/(app)/events/[id]/layout/CanvasArea'
import PropertiesPanel from '@/app/(app)/events/[id]/layout/PropertiesPanel'
import LayoutTemplateSelector from './LayoutTemplateSelector'

const STORAGE_KEY = 'try-layout'

export default function TryLayoutEditor() {
  const loadedRef = useRef(false)
  const [showTemplates, setShowTemplates] = useState(() => {
    if (typeof window === 'undefined') return false
    return !localStorage.getItem(STORAGE_KEY)
  })
  const [history, dispatch] = useReducer(layoutReducer, {
    past: [],
    present: INITIAL_CANVAS_STATE,
    future: [],
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const clipboardRef = useRef<LayoutItem | null>(null)
  const stateRef = useRef(history.present)
  useEffect(() => { stateRef.current = history.present })

  // localStorageから初期ロード — 保存データがなければテンプレート選択を表示
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: CanvasState = JSON.parse(saved)
        dispatch({ type: 'LOAD', state: parsed })
      }
    } catch {}
    loadedRef.current = true
  }, [])

  // 変更のたびlocalStorageに保存
  useEffect(() => {
    if (!loadedRef.current) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.present))
  }, [history.present])

  const state = history.present
  const selectedItem = state.items.find(i => i.id === selectedId) ?? null
  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) { dispatch({ type: 'DELETE_ITEM', id: selectedId }); setSelectedId(null) }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); dispatch({ type: 'UNDO' }); setSelectedId(null)
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault(); dispatch({ type: 'REDO' }); setSelectedId(null)
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedId) clipboardRef.current = stateRef.current.items.find(i => i.id === selectedId) ?? null
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        const src = clipboardRef.current
        if (!src) return
        const newItem: LayoutItem = { ...src, id: crypto.randomUUID(), x: src.x + 20, y: src.y + 20, locked: false }
        dispatch({ type: 'ADD_ITEM', item: newItem }); setSelectedId(newItem.id)
        clipboardRef.current = { ...newItem }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  function loadTemplate(state: CanvasState) {
    dispatch({ type: 'LOAD', state })
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {showTemplates && (
        <LayoutTemplateSelector
          onSelect={loadTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
      {/* ツールバー */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center gap-2 px-3 shrink-0 no-print">
        <span className="text-sm font-medium text-slate-700">会場レイアウト</span>
        <button
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
          テンプレート
        </button>
        <div className="flex-1" />
        <button
          onClick={() => { dispatch({ type: 'UNDO' }); setSelectedId(null) }}
          disabled={!canUndo}
          title="元に戻す (Ctrl+Z)"
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={() => { dispatch({ type: 'REDO' }); setSelectedId(null) }}
          disabled={!canRedo}
          title="やり直し (Ctrl+Y)"
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          印刷
        </button>
      </div>

      {/* 3カラムレイアウト */}
      <div className="flex flex-1 overflow-hidden">
        <ItemLibrary state={state} dispatch={dispatch} onSelect={setSelectedId} />
        <CanvasArea state={state} dispatch={dispatch} selectedId={selectedId} onSelect={setSelectedId} />
        <PropertiesPanel state={state} dispatch={dispatch} selectedItem={selectedItem} />
      </div>
    </div>
  )
}
