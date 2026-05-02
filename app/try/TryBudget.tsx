'use client'

import { useState } from 'react'
import Link from 'next/link'

const BUDGET_CATEGORIES = ['コンテンツ費', 'スタッフ費・謝礼', '会場費', '備品・消耗品費', '交通・宿泊費', '印刷・資材費', 'その他']

const SAMPLE_ITEMS: Array<{ category: string; name: string; estimated: number }> = [
  { category: '会場費',       name: '会場使用料',     estimated: 50000 },
  { category: 'スタッフ費・謝礼', name: 'MC・司会謝礼',  estimated: 30000 },
  { category: '印刷・資材費', name: 'チラシ・印刷物',  estimated: 20000 },
]

type BudgetItem = {
  id: string
  category: string
  name: string
  estimated: number
  actual: number | null
}

type StoredState = {
  totalBudget: number | null
  items: BudgetItem[]
}

const STORAGE_KEY = 'try-budget'

function load(): StoredState {
  if (typeof window === 'undefined') return { totalBudget: null, items: [] }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as StoredState
  } catch {}
  return { totalBudget: null, items: [] }
}

function persist(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function fmt(n: number) { return `¥${n.toLocaleString()}` }

function ItemForm({
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  initial?: BudgetItem
  onSave: (item: BudgetItem) => void
  onCancel: () => void
  onDelete?: () => void
}) {
  const [category, setCategory] = useState(initial?.category ?? 'その他')
  const [name, setName] = useState(initial?.name ?? '')
  const [estimated, setEstimated] = useState(initial?.estimated.toString() ?? '0')
  const [actual, setActual] = useState(initial?.actual?.toString() ?? '')

  function submit() {
    if (!name.trim()) return
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      category,
      name: name.trim(),
      estimated: parseInt(estimated) || 0,
      actual: actual !== '' ? parseInt(actual) || null : null,
    })
  }

  return (
    <div className="p-4 space-y-2 bg-slate-50 border-b border-slate-200">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          >
            {BUDGET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="品目名 *"
          autoFocus
          className="col-span-2 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <div>
          <label className="block text-xs text-slate-400 mb-1">見積金額（¥）</label>
          <input
            type="number"
            value={estimated}
            onChange={e => setEstimated(e.target.value)}
            min={0}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">実績（¥・任意）</label>
          <input
            type="number"
            value={actual}
            onChange={e => setActual(e.target.value)}
            min={0}
            placeholder="未確定"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={!name.trim()}
          className="px-4 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 disabled:opacity-40 transition-colors"
        >
          保存
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
          取消
        </button>
        {onDelete && (
          <button onClick={onDelete} className="ml-auto px-3 py-1.5 text-xs text-red-400 hover:text-red-600 transition-colors">
            削除
          </button>
        )}
      </div>
    </div>
  )
}

export default function TryBudget() {
  const [state, setState] = useState<StoredState>(() => load())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')

  function update(next: StoredState) {
    setState(next)
    persist(next)
  }

  function saveTotalBudget() {
    const n = budgetInput === '' ? null : parseInt(budgetInput.replace(/,/g, ''), 10)
    update({ ...state, totalBudget: isNaN(n as number) ? null : n })
    setEditingBudget(false)
  }

  function addItem(item: BudgetItem) {
    update({ ...state, items: [...state.items, item] })
    setShowAdd(false)
  }

  function editItem(item: BudgetItem) {
    update({ ...state, items: state.items.map(x => x.id === item.id ? item : x) })
    setEditingId(null)
  }

  function deleteItem(id: string) {
    update({ ...state, items: state.items.filter(x => x.id !== id) })
    setEditingId(null)
  }

  function addSample(s: typeof SAMPLE_ITEMS[number]) {
    const item: BudgetItem = { id: crypto.randomUUID(), ...s, actual: null }
    update({ ...state, items: [...state.items, item] })
  }

  const totalEstimated = state.items.reduce((s, i) => s + i.estimated, 0)
  const totalActual = state.items.reduce((s, i) => s + (i.actual ?? i.estimated), 0)
  const remaining = state.totalBudget != null ? state.totalBudget - totalEstimated : null

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ツールバー */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center gap-2 px-4 shrink-0 no-print">
        <span className="text-sm font-medium text-slate-700 hidden sm:block">予算管理</span>
        <div className="flex-1" />
        <button
          onClick={() => { setShowAdd(v => !v); setEditingId(null) }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          追加
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showAdd && (
          <ItemForm
            onSave={addItem}
            onCancel={() => setShowAdd(false)}
          />
        )}

        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* 総予算 */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 shrink-0">総予算：</span>
              {editingBudget ? (
                <>
                  <span className="text-sm text-slate-500">¥</span>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={e => setBudgetInput(e.target.value)}
                    placeholder="500000"
                    autoFocus
                    className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    onKeyDown={e => { if (e.key === 'Enter') saveTotalBudget(); if (e.key === 'Escape') setEditingBudget(false) }}
                  />
                  <button onClick={saveTotalBudget} className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600">保存</button>
                  <button onClick={() => setEditingBudget(false)} className="text-xs px-2 py-1.5 text-slate-400 hover:text-slate-600">取消</button>
                </>
              ) : (
                <>
                  <span className="text-base font-bold text-slate-800 flex-1">
                    {state.totalBudget != null ? fmt(state.totalBudget) : <span className="text-slate-300 font-normal text-sm">未設定</span>}
                  </span>
                  <button
                    onClick={() => { setBudgetInput(state.totalBudget?.toString() ?? ''); setEditingBudget(true) }}
                    className="text-xs text-orange-500 hover:text-orange-700 border border-orange-200 px-2 py-0.5 rounded-lg"
                  >
                    {state.totalBudget != null ? '変更' : '設定'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* サマリー */}
          {state.items.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-[10px] font-medium text-amber-600 mb-0.5">見積合計</p>
                <p className="text-sm font-bold text-amber-700 tabular-nums">{fmt(totalEstimated)}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-[10px] font-medium text-blue-600 mb-0.5">実績合計</p>
                <p className="text-sm font-bold text-blue-700 tabular-nums">{fmt(totalActual)}</p>
              </div>
              <div className={`rounded-xl p-3 text-center ${remaining != null && remaining < 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className={`text-[10px] font-medium mb-0.5 ${remaining != null && remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>残予算</p>
                <p className={`text-sm font-bold tabular-nums ${remaining != null && remaining < 0 ? 'text-red-700' : 'text-green-700'}`}>
                  {remaining != null ? fmt(remaining) : '—'}
                </p>
              </div>
            </div>
          )}

          {/* 費用項目リスト */}
          {state.items.length === 0 && !showAdd ? (
            <div className="text-center py-8">
              <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-slate-400 mb-4">費用項目を追加しましょう</p>
              <p className="text-xs text-slate-400 mb-2">サンプルから追加：</p>
              <div className="space-y-2 max-w-xs mx-auto">
                {SAMPLE_ITEMS.map(s => (
                  <button
                    key={s.name}
                    onClick={() => addSample(s)}
                    className="w-full text-left text-xs bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:border-orange-300 hover:shadow-sm transition-all flex items-center justify-between gap-3"
                  >
                    <span className="font-medium text-slate-700">{s.name}</span>
                    <span className="text-amber-600 font-semibold tabular-nums shrink-0">¥{s.estimated.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
              {state.items.map(item => (
                <div key={item.id} className="border-b border-slate-50 last:border-0">
                  {editingId === item.id ? (
                    <ItemForm
                      initial={item}
                      onSave={editItem}
                      onCancel={() => setEditingId(null)}
                      onDelete={() => deleteItem(item.id)}
                    />
                  ) : (
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors group"
                      onClick={() => { setEditingId(item.id); setShowAdd(false) }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-800">{item.name}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{item.category}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-amber-700 tabular-nums">{fmt(item.estimated)}</p>
                          {item.actual != null && (
                            <p className="text-[10px] text-blue-500 tabular-nums">実績 {fmt(item.actual)}</p>
                          )}
                        </div>
                        <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 保存CTA */}
      <div className="bg-orange-50 border-t border-orange-200 px-4 py-3 shrink-0 flex items-center justify-between gap-3 no-print">
        <div>
          <p className="text-xs font-semibold text-orange-700">この予算表を保存しませんか？</p>
          <p className="text-[11px] text-orange-500">無料登録すれば実績管理・CSV出力もできます</p>
        </div>
        <Link
          href="/signup"
          className="shrink-0 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors"
        >
          無料で保存する
        </Link>
      </div>
    </div>
  )
}
