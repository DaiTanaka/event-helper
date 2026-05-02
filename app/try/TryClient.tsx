'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import TryTimetable from './TryTimetable'
import TryQA from './TryQA'
import TryContacts from './TryContacts'
import TryBudget from './TryBudget'
import { TEMPLATE_CATEGORIES, TEMPLATE_TASKS } from '@/lib/task-templates'

const TryLayoutEditor = dynamic(() => import('./TryLayoutEditor'), { ssr: false })

type Tab = 'checklist' | 'timetable' | 'layout' | 'qa' | 'contacts' | 'budget'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'layout',    label: 'レイアウト', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { key: 'timetable', label: '日程',      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'checklist', label: '準備リスト', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { key: 'contacts',  label: '連絡先',    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'qa',        label: 'Q&A',      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { key: 'budget',    label: '予算',      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

type EventTypeDef = {
  id: string
  label: string
  subtitle: string
  emoji: string
  categories: string[]
}

const BLANK_CATEGORY = { id: 'custom', label: 'タスク', color: 'bg-slate-100 text-slate-600' }

const CHECKLIST_STORAGE_KEY = 'try-checklist'

type ChecklistState = { selectedType: string | null; tasks: LocalTask[]; checked: string[] }

function loadChecklist(): ChecklistState | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY)
    if (saved) return JSON.parse(saved) as ChecklistState
  } catch {}
  return null
}

const EVENT_TYPES: EventTypeDef[] = [
  {
    id: 'corporate',
    label: '社内イベント',
    subtitle: '懇親会・表彰式・研修',
    emoji: '🏢',
    categories: ['planning', 'venue', 'staff', 'equip', 'ops', 'post'],
  },
  {
    id: 'school',
    label: '学校行事',
    subtitle: '文化祭・体育祭・入学式',
    emoji: '🏫',
    categories: ['planning', 'venue', 'program', 'staff', 'equip', 'ops', 'post'],
  },
  {
    id: 'community',
    label: '地域・NPOイベント',
    subtitle: 'お祭り・地区行事・チャリティー',
    emoji: '🎋',
    categories: ['planning', 'venue', 'design', 'pr', 'staff', 'equip', 'ops', 'post'],
  },
  {
    id: 'seminar',
    label: 'セミナー・展示会',
    subtitle: 'カンファレンス・勉強会・展示',
    emoji: '📅',
    categories: ['planning', 'venue', 'design', 'pr', 'program', 'staff', 'equip', 'ops', 'post'],
  },
]

type EventTypeId = string

type LocalTask = {
  id: string
  categoryId: string
  title: string
  priority: 'high' | 'medium' | 'low'
  dueDays: number | null
}

const PRIORITY_DOT: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-slate-300',
}

function dueDaysLabel(days: number | null): string {
  if (days === null) return ''
  if (days === 0) return '当日'
  if (days >= 60) return `${Math.round(days / 30)}ヶ月前`
  if (days >= 14) return `${Math.round(days / 7)}週間前`
  if (days > 0) return `${days}日前`
  return `D+${Math.abs(days)}`
}

function ChecklistTab() {
  const [selectedType, setSelectedType] = useState<EventTypeId | null>(() => loadChecklist()?.selectedType ?? null)
  const [checked, setChecked] = useState<Set<string>>(() => new Set(loadChecklist()?.checked ?? []))
  const [localTasks, setLocalTasks] = useState<LocalTask[]>(() => loadChecklist()?.tasks ?? [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify({
        selectedType,
        tasks: localTasks,
        checked: Array.from(checked),
      }))
    } catch {}
  }, [selectedType, localTasks, checked])

  const isBlank = selectedType === 'blank'
  const type = EVENT_TYPES.find(t => t.id === selectedType)
  const filteredCategories = isBlank
    ? [BLANK_CATEGORY]
    : type
      ? TEMPLATE_CATEGORIES.filter(c => type.categories.includes(c.id))
      : []

  function selectType(id: string) {
    if (id === 'blank') {
      setLocalTasks([])
      setChecked(new Set())
      setEditingId(null)
      setSelectedType('blank')
      return
    }
    const et = EVENT_TYPES.find(t => t.id === id)!
    setLocalTasks(TEMPLATE_TASKS.filter(t => et.categories.includes(t.categoryId)))
    setChecked(new Set())
    setEditingId(null)
    setSelectedType(id)
  }

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  function startEdit(id: string, title: string) {
    setEditingId(id)
    setEditingValue(title)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  function commitEdit() {
    if (!editingId) return
    const trimmed = editingValue.trim()
    if (trimmed) {
      setLocalTasks(prev => prev.map(t => t.id === editingId ? { ...t, title: trimmed } : t))
    } else {
      setLocalTasks(prev => prev.filter(t => t.id !== editingId))
      setChecked(prev => { const s = new Set(prev); s.delete(editingId); return s })
    }
    setEditingId(null)
    setEditingValue('')
  }

  function cancelEdit() {
    if (editingId) {
      const task = localTasks.find(t => t.id === editingId)
      if (!task?.title) {
        setLocalTasks(prev => prev.filter(t => t.id !== editingId))
      }
    }
    setEditingId(null)
    setEditingValue('')
  }

  function deleteTask(id: string) {
    setLocalTasks(prev => prev.filter(t => t.id !== id))
    setChecked(prev => { const s = new Set(prev); s.delete(id); return s })
    if (editingId === id) { setEditingId(null); setEditingValue('') }
  }

  function addTask(categoryId: string) {
    const newTask: LocalTask = {
      id: crypto.randomUUID(),
      categoryId,
      title: '',
      priority: 'medium',
      dueDays: null,
    }
    setLocalTasks(prev => [...prev, newTask])
    setTimeout(() => startEdit(newTask.id, ''), 0)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {!selectedType ? (
        /* ── イベント種別選択 ── */
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-lg mx-auto">
            <h2 className="text-base font-bold text-slate-800 mb-1 text-center">
              どんなイベントを開催しますか？
            </h2>
            <p className="text-xs text-slate-500 text-center mb-6">
              選ぶだけで準備リストが表示されます
            </p>
            <div className="grid grid-cols-2 gap-3">
              {EVENT_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => selectType(t.id)}
                  className="bg-white border border-slate-200 rounded-2xl p-4 text-left hover:border-orange-300 hover:shadow-md transition-all group"
                >
                  <div className="text-2xl mb-2">{t.emoji}</div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{t.subtitle}</p>
                  <div className="mt-2 text-[10px] text-orange-500 font-medium">
                    {TEMPLATE_TASKS.filter(task => t.categories.includes(task.categoryId)).length}件のタスク →
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => selectType('blank')}
                className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
              >
                テンプレートを使わずに始める
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── タスクリスト ── */
        <div className="flex flex-col h-full">
          {/* サブヘッダー */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3 shrink-0 no-print">
            <button
              onClick={() => { setSelectedType(null); setLocalTasks([]); setChecked(new Set()); setEditingId(null) }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              変更
            </button>
            <span className="text-sm font-semibold text-slate-700">
              {isBlank ? '✏️ 自由作成' : `${type?.emoji} ${type?.label}`}
            </span>
            <span className="ml-auto text-xs text-slate-400">
              {checked.size}/{localTasks.length}件
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg px-2 py-1 transition-colors"
              title="印刷"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              印刷
            </button>
          </div>

          <div className="flex-1 overflow-y-auto try-scroll">
            <div className="max-w-2xl mx-auto">
              {filteredCategories.map(cat => {
                const tasks = localTasks.filter(t => t.categoryId === cat.id)
                return (
                  <div key={cat.id}>
                    <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 sticky top-0 z-10 flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{tasks.length}件</span>
                    </div>
                    {tasks.map(task => {
                      const isChecked = checked.has(task.id)
                      const isEditing = editingId === task.id
                      return (
                        <div
                          key={task.id}
                          className={`group flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 transition-colors ${
                            isChecked ? 'bg-orange-50/50' : 'bg-white hover:bg-slate-50/60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => { if (!isEditing) toggle(task.id) }}
                            className="w-4 h-4 accent-orange-500 shrink-0"
                          />
                          {isEditing ? (
                            <input
                              ref={editInputRef}
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={e => {
                                if (e.key === 'Enter') commitEdit()
                                if (e.key === 'Escape') cancelEdit()
                              }}
                              placeholder="タスク名を入力…"
                              className="flex-1 text-sm text-slate-700 bg-transparent border-b border-orange-400 outline-none py-0.5"
                            />
                          ) : (
                            <span
                              className={`flex-1 text-sm cursor-text ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}
                              onDoubleClick={() => startEdit(task.id, task.title)}
                            >
                              {task.title}
                            </span>
                          )}
                          {!isEditing && (
                            <>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                              {task.dueDays !== null && (
                                <span className="text-[10px] text-slate-400 tabular-nums shrink-0 w-14 text-right">
                                  {dueDaysLabel(task.dueDays)}
                                </span>
                              )}
                              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                  onClick={() => startEdit(task.id, task.title)}
                                  className="p-1 rounded hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                    <button
                      onClick={() => addTask(cat.id)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-400 hover:text-orange-500 hover:bg-orange-50/50 transition-colors border-b border-slate-100"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      タスクを追加
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 保存CTA */}
          <div className="bg-orange-50 border-t border-orange-200 px-4 py-3 shrink-0 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-orange-700">このリストを保存しませんか？</p>
              <p className="text-[11px] text-orange-500">無料登録すれば担当者・期日を設定して管理できます</p>
            </div>
            <Link
              href="/signup"
              className="shrink-0 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors"
            >
              無料で保存する
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// header(56) + banner(40) + tabs(44) = 140px
const CONTENT_TOP = 140

export default function TryClient() {
  const [tab, setTab] = useState<Tab>('layout')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowModal(true), 5 * 60 * 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {/* 体験モードバナー */}
      <div className="fixed top-14 inset-x-0 z-20 bg-amber-50 border-b border-amber-200 h-10 flex items-center justify-between px-4 no-print">
        <span className="text-xs text-amber-700 truncate">
          <span className="font-semibold">体験モード</span>：データはこのブラウザにのみ保存されます
        </span>
        <Link href="/signup" className="text-xs font-semibold text-orange-600 hover:text-orange-700 whitespace-nowrap ml-3 shrink-0">
          無料登録してデータを保存する →
        </Link>
      </div>

      {/* タブバー（top: 56+40=96px） */}
      <div className="fixed top-24 inset-x-0 z-20 bg-white border-b border-slate-200 flex no-print">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 text-xs font-medium transition-colors border-b-2 flex flex-col items-center justify-center gap-0.5 ${
              tab === key ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
            <span className="leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* コンテンツエリア（top: 56+40+44=140px） */}
      <div
        className="fixed inset-x-0 bottom-0 flex flex-col try-content"
        style={{ top: CONTENT_TOP }}
      >
        {tab === 'checklist' && <ChecklistTab />}
        {tab === 'timetable' && <TryTimetable />}
        {tab === 'layout'    && <TryLayoutEditor />}
        {tab === 'contacts'  && <TryContacts />}
        {tab === 'qa'        && <TryQA />}
        {tab === 'budget'    && <TryBudget />}
      </div>

      {/* 登録促進モーダル */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">データを保存しませんか？</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              無料アカウントを作成すると、準備リスト・レイアウト・日程・連絡先・Q&A・予算をクラウドに保存し、
              チームメンバーと共有できます。
            </p>
            <div className="space-y-2">
              <Link href="/signup" className="block w-full py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors">
                無料登録してデータを保存する
              </Link>
              <button onClick={() => setShowModal(false)} className="block w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                このまま体験を続ける
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
