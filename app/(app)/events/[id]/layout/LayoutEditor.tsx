'use client'

import { useReducer, useState, useEffect, useTransition, useRef } from 'react'
import Link from 'next/link'
import { layoutReducer, INITIAL_CANVAS_STATE } from '@/lib/layout-reducer'
import type { CanvasState, LayoutItem } from '@/lib/layout-types'
import { saveLayout, clearLayout } from './actions'
import ItemLibrary from './ItemLibrary'
import CanvasArea from './CanvasArea'
import PropertiesPanel from './PropertiesPanel'

type Props = {
  eventId: string
  eventTitle: string
  initialState: CanvasState | null
}

export default function LayoutEditor({ eventId, eventTitle, initialState }: Props) {
  const [history, dispatch] = useReducer(layoutReducer, {
    past: [],
    present: initialState ?? INITIAL_CANVAS_STATE,
    future: [],
  })

  const state = history.present
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [confirmClear, setConfirmClear] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clipboardRef = useRef<LayoutItem | null>(null)
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state })

  const selectedItem = state.items.find(i => i.id === selectedId) ?? null

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          dispatch({ type: 'DELETE_ITEM', id: selectedId })
          setSelectedId(null)
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        dispatch({ type: 'UNDO' })
        setSelectedId(null)
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        dispatch({ type: 'REDO' })
        setSelectedId(null)
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedId) {
          const item = stateRef.current.items.find(i => i.id === selectedId)
          if (item) clipboardRef.current = item
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        const src = clipboardRef.current
        if (!src) return
        const { roomWidth, roomHeight } = stateRef.current
        const offset = 20
        const newItem: LayoutItem = {
          ...src,
          id: crypto.randomUUID(),
          x: Math.min(src.x + offset, roomWidth - src.width),
          y: Math.min(src.y + offset, roomHeight - src.height),
          locked: false,
        }
        dispatch({ type: 'ADD_ITEM', item: newItem })
        setSelectedId(newItem.id)
        // shift clipboard so repeated pastes cascade
        clipboardRef.current = { ...newItem }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  function handleSave() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setSaveStatus('saving')
    startTransition(async () => {
      const result = await saveLayout(eventId, state)
      if (result.error) {
        setSaveStatus('error')
        setSaveError(result.error)
      } else {
        setSaveStatus('saved')
        saveTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2500)
      }
    })
  }

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-20 flex flex-col bg-slate-100">
      {/* Toolbar */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center gap-2 px-3 shrink-0">
        <Link
          href={`/events/${eventId}`}
          className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          title="イベントに戻る"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="w-px h-5 bg-slate-200" />

        <span className="text-sm font-medium text-slate-700 truncate max-w-48">{eventTitle}</span>
        <span className="text-slate-300 text-sm">—</span>
        <span className="text-sm text-slate-500">会場レイアウト</span>

        <div className="flex-1" />

        {/* Undo / Redo */}
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

        {/* Delete layout */}
        {confirmClear ? (
          <div className="flex items-center gap-2">
            <form action={clearLayout.bind(null, eventId)}>
              <button type="submit" className="px-2.5 py-1 text-xs text-red-600 font-medium hover:text-red-700 border border-red-200 rounded hover:bg-red-50 transition-colors">
                削除する
              </button>
            </form>
            <button type="button" onClick={() => setConfirmClear(false)} className="text-xs text-slate-400 hover:text-slate-600">取消</button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-400 transition-colors"
            title="レイアウトを削除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        <div className="w-px h-5 bg-slate-200" />

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isPending}
          className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${
            saveStatus === 'saved'
              ? 'bg-green-100 text-green-700'
              : saveStatus === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60'
          }`}
          title={saveStatus === 'error' && saveError ? saveError : undefined}
        >
          {saveStatus === 'saving' ? '保存中…' : saveStatus === 'saved' ? '保存済み ✓' : saveStatus === 'error' ? `エラー: ${saveError ?? ''}` : '保存'}
        </button>
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        <ItemLibrary
          state={state}
          dispatch={dispatch}
          onSelect={setSelectedId}
        />
        <CanvasArea
          state={state}
          dispatch={dispatch}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <PropertiesPanel
          state={state}
          dispatch={dispatch}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  )
}
