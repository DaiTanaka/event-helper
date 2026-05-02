'use client'

import { useState, useTransition } from 'react'
import type { Event, EventContent, EventBudgetItem } from '@/lib/types'
import { updateTotalBudget, addBudgetItem, updateBudgetItem, deleteBudgetItem } from './actions'
import { downloadCSV } from '@/lib/csv'

const BUDGET_CATEGORIES = ['コンテンツ費', 'スタッフ費・謝礼', '会場費', '備品・消耗品費', '交通・宿泊費', '印刷・資材費', 'その他']

function fmt(n: number) { return `¥${n.toLocaleString()}` }

// ── 予算設定バー ──────────────────────────────────────────────
function TotalBudgetBar({ eventId, total_budget }: { eventId: string; total_budget: number | null }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(total_budget?.toString() ?? '')
  const [saving, startSave] = useTransition()

  function save() {
    startSave(async () => {
      const n = value === '' ? null : parseInt(value.replace(/,/g, ''), 10)
      await updateTotalBudget(eventId, isNaN(n as number) ? null : n)
      setEditing(false)
    })
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">総予算：¥</span>
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-40 text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200"
          placeholder="例: 500000"
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
        />
        <button onClick={save} disabled={saving} className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">保存</button>
        <button onClick={() => setEditing(false)} className="text-xs px-2 py-1.5 text-slate-400 hover:text-slate-600">取消</button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">総予算：</span>
      <span className="text-base font-bold text-slate-800">
        {total_budget != null ? fmt(total_budget) : <span className="text-slate-300 font-normal">未設定</span>}
      </span>
      <button onClick={() => setEditing(true)} className="text-xs text-orange-500 hover:text-orange-700 border border-orange-200 px-2 py-0.5 rounded-lg">編集</button>
    </div>
  )
}

// ── 予算項目フォーム ──────────────────────────────────────────
function BudgetItemForm({
  eventId,
  initial,
  onDone,
  onCancel,
}: {
  eventId: string
  initial?: EventBudgetItem
  onDone: () => void
  onCancel: () => void
}) {
  const [category, setCategory] = useState(initial?.category ?? 'その他')
  const [name, setName] = useState(initial?.name ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity.toString() ?? '1')
  const [unitPrice, setUnitPrice] = useState(initial?.unit_price.toString() ?? '0')
  const [actualPrice, setActualPrice] = useState(initial?.actual_price?.toString() ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [saving, startSave] = useTransition()

  function submit() {
    if (!name.trim()) return
    startSave(async () => {
      const data = {
        category,
        name: name.trim(),
        quantity: parseInt(quantity) || 1,
        unit_price: parseInt(unitPrice) || 0,
        actual_price: actualPrice !== '' ? parseInt(actualPrice) || null : null,
        notes: notes.trim(),
      }
      if (initial) {
        await updateBudgetItem(initial.id, eventId, data)
      } else {
        await addBudgetItem(eventId, data)
      }
      onDone()
    })
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">カテゴリ</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white">
            {BUDGET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">品目名 *</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="例: MC費用"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">数量</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min={1}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">見積単価（¥）</label>
          <input type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} min={0}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">実績（¥）</label>
          <input type="number" value={actualPrice} onChange={e => setActualPrice(e.target.value)} min={0}
            placeholder="未確定"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">備考</label>
        <input value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="業者名・備考など"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="text-sm px-3 py-1.5 text-slate-500 hover:text-slate-700">取消</button>
        <button onClick={submit} disabled={saving || !name.trim()}
          className="text-sm px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
          {saving ? '保存中...' : initial ? '更新' : '追加'}
        </button>
      </div>
    </div>
  )
}

// ── メイン ────────────────────────────────────────────────────
export default function BudgetClient({
  event,
  contents,
  budgetItems: initialItems,
}: {
  event: Event
  contents: EventContent[]
  budgetItems: EventBudgetItem[]
}) {
  const items = initialItems
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleting, startDelete] = useTransition()

  // コンテンツ費集計
  const confirmedContents = contents.filter(c => c.status === 'confirmed')
  const confirmedEstimated = confirmedContents.reduce((s, c) => s + (c.estimated_cost ?? 0), 0)
  const confirmedActual = confirmedContents.reduce((s, c) => s + (c.actual_cost ?? 0), 0)

  // 予算項目集計
  const itemsEstimated = items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
  const itemsActual = items.reduce((s, i) => s + (i.actual_price ?? i.unit_price * i.quantity), 0)

  const totalEstimated = confirmedEstimated + itemsEstimated
  const totalActual = confirmedActual + itemsActual
  const remaining = event.total_budget != null ? event.total_budget - totalEstimated : null

  return (
    <div className="space-y-5">

      {/* 総予算 */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
        <TotalBudgetBar eventId={event.id} total_budget={event.total_budget} />
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '総予算', value: event.total_budget != null ? fmt(event.total_budget) : '—', color: 'bg-slate-50 text-slate-700' },
          { label: '見積合計', value: fmt(totalEstimated), color: 'bg-amber-50 text-amber-700' },
          { label: '実績合計', value: fmt(totalActual), color: 'bg-blue-50 text-blue-700' },
          {
            label: '残予算（見積）',
            value: remaining != null ? fmt(remaining) : '—',
            color: remaining != null && remaining < 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-xl p-4 text-center`}>
            <p className="text-xs font-medium mb-1 opacity-70">{label}</p>
            <p className="text-lg font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* コンテンツ費（読み取り専用） */}
      {contents.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">コンテンツ費（選定済）</h2>
            <a href={`/events/${event.id}/contents`} className="text-xs text-orange-500 hover:text-orange-700">コンテンツ管理 →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">コンテンツ名</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">カテゴリ</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">ステータス</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 w-28">見積</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 w-28">実績</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {contents.filter(c => c.status !== 'cancelled').map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-xs">{c.title}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">{c.category}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${c.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {c.status === 'confirmed' ? '確定' : '検討中'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-right tabular-nums">{c.estimated_cost != null ? fmt(c.estimated_cost) : '—'}</td>
                    <td className="px-4 py-2.5 text-xs text-right tabular-nums">{c.actual_cost != null ? fmt(c.actual_cost) : '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-medium">
                  <td colSpan={3} className="px-4 py-2 text-xs text-slate-600">確定分 小計</td>
                  <td className="px-4 py-2 text-xs text-right tabular-nums">{fmt(confirmedEstimated)}</td>
                  <td className="px-4 py-2 text-xs text-right tabular-nums">{fmt(confirmedActual)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 予算項目 */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-700">その他費用</h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => downloadCSV('予算管理.csv', [
                  ['カテゴリ', '品目', '数量', '単価（見積）', '見積小計', '実績', '備考'],
                  ...items.map(i => [
                    i.category,
                    i.name,
                    String(i.quantity),
                    String(i.unit_price),
                    String(i.unit_price * i.quantity),
                    i.actual_price != null ? String(i.actual_price) : '',
                    i.notes ?? '',
                  ]),
                ])}
                className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                title="CSVダウンロード"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            <button onClick={() => { setShowAdd(true); setEditId(null) }}
              className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              + 追加
            </button>
          </div>
        </div>

        {showAdd && (
          <div className="p-4 border-b border-slate-100">
            <BudgetItemForm
              eventId={event.id}
              onDone={() => setShowAdd(false)}
              onCancel={() => setShowAdd(false)}
            />
          </div>
        )}

        {items.length === 0 && !showAdd ? (
          <p className="text-sm text-slate-400 text-center py-10">費用項目を追加してください</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">カテゴリ</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">品目</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 w-16">数量</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 w-28">単価</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 w-28">見積小計</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 w-28">実績</th>
                  <th className="px-4 py-2 text-xs font-medium text-slate-500 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map(item => (
                  editId === item.id ? (
                    <tr key={item.id}>
                      <td colSpan={7} className="p-3">
                        <BudgetItemForm
                          eventId={event.id}
                          initial={item}
                          onDone={() => setEditId(null)}
                          onCancel={() => setEditId(null)}
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 text-xs text-slate-500">{item.category}</td>
                      <td className="px-4 py-2.5 text-xs">
                        {item.name}
                        {item.notes && <span className="text-slate-400 ml-1">({item.notes})</span>}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-right tabular-nums">{item.quantity}</td>
                      <td className="px-4 py-2.5 text-xs text-right tabular-nums">{fmt(item.unit_price)}</td>
                      <td className="px-4 py-2.5 text-xs text-right tabular-nums font-medium">{fmt(item.unit_price * item.quantity)}</td>
                      <td className="px-4 py-2.5 text-xs text-right tabular-nums">{item.actual_price != null ? fmt(item.actual_price) : '—'}</td>
                      <td className="px-4 py-2.5 text-xs flex gap-2 justify-end">
                        <button onClick={() => setEditId(item.id)} className="text-orange-500 hover:text-orange-700">編集</button>
                        <button
                          disabled={deleting}
                          onClick={() => startDelete(async () => { await deleteBudgetItem(item.id, event.id) })}
                          className="text-red-400 hover:text-red-600 disabled:opacity-50">削除</button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
              {items.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-50 font-medium">
                    <td colSpan={4} className="px-4 py-2 text-xs text-slate-600">小計</td>
                    <td className="px-4 py-2 text-xs text-right tabular-nums">{fmt(itemsEstimated)}</td>
                    <td className="px-4 py-2 text-xs text-right tabular-nums">{fmt(itemsActual)}</td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

      {/* 合計 */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">収支サマリー</h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-2 text-sm text-slate-600">コンテンツ費（確定）</td>
              <td className="py-2 text-sm text-right tabular-nums">{fmt(confirmedEstimated)}</td>
              <td className="py-2 text-sm text-right tabular-nums text-slate-400">{fmt(confirmedActual)}</td>
            </tr>
            <tr>
              <td className="py-2 text-sm text-slate-600">その他費用</td>
              <td className="py-2 text-sm text-right tabular-nums">{fmt(itemsEstimated)}</td>
              <td className="py-2 text-sm text-right tabular-nums text-slate-400">{fmt(itemsActual)}</td>
            </tr>
            <tr className="font-semibold text-slate-800">
              <td className="py-2 text-sm">合計</td>
              <td className="py-2 text-sm text-right tabular-nums text-amber-700">{fmt(totalEstimated)}</td>
              <td className="py-2 text-sm text-right tabular-nums text-blue-700">{fmt(totalActual)}</td>
            </tr>
            {event.total_budget != null && (
              <tr className={`font-bold ${remaining != null && remaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
                <td className="py-2 text-sm">残予算（見積ベース）</td>
                <td colSpan={2} className="py-2 text-sm text-right tabular-nums">{fmt(remaining ?? 0)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-3 flex gap-4 text-xs text-slate-400">
          <span>左列: 見積</span>
          <span>右列: 実績</span>
        </div>
      </div>
    </div>
  )
}
