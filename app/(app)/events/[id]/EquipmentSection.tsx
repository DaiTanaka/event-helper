'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { addEquipment, updateEquipment, updateEquipmentQuantity, deleteEquipment, moveEquipment, toggleEquipmentCheck, importFromLayout, clearAllEquipment, bulkAddEquipmentGroup } from './actions'
import type { EventEquipment } from '@/lib/types'
import { downloadCSV } from '@/lib/csv'
import { getEquipmentTemplatesForEventType } from '@/lib/equipment-template-groups'

type LayoutSuggestion = { label: string; count: number }
type Props = { eventId: string; equipment: EventEquipment[]; layoutSuggestions?: LayoutSuggestion[]; eventType?: string | null }

const CATEGORIES = ['什器・家具', '電気機器', '消耗品', '印刷物', '装飾', 'その他']

const inputCls = 'w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'

function EditEquipmentRow({
  item,
  eventId,
  onClose,
}: {
  item: EventEquipment
  eventId: string
  onClose: () => void
}) {
  const updateWithId = updateEquipment.bind(null, item.id, eventId)
  const [state, formAction, pending] = useActionState(updateWithId, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose()
    wasPending.current = pending
  }, [pending, state, onClose])

  return (
    <div className="px-4 py-3 bg-orange-50/20 border-b border-slate-100">
      <form action={formAction} className="space-y-2">
        {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="col-span-2">
            <input name="name" type="text" required defaultValue={item.name} placeholder="品名 *" className={inputCls} />
          </div>
          <div className="flex gap-1">
            <input name="quantity" type="number" min={1} defaultValue={item.quantity} className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <input name="unit" type="text" defaultValue={item.unit ?? '個'} className="w-12 px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <select name="category" defaultValue={item.category ?? 'その他'} className={inputCls}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input name="supplier" type="text" defaultValue={item.supplier ?? ''} placeholder="仕入先" className={inputCls} />
          <input name="notes" type="text" defaultValue={item.notes ?? ''} placeholder="メモ" className={inputCls} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className="px-3 py-1 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {pending ? '保存中...' : '保存'}
          </button>
          <button type="button" onClick={onClose} className="px-3 py-1 text-xs text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}

export default function EquipmentSection({ eventId, equipment, layoutSuggestions = [], eventType }: Props) {
  const templateGroups = getEquipmentTemplatesForEventType(eventType)

  const [showForm, setShowForm] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showLayoutImport, setShowLayoutImport] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const addWithId = addEquipment.bind(null, eventId)
  const [state, formAction, pending] = useActionState(addWithId, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setShowForm(false)
      formRef.current?.reset()
    }
    wasPending.current = pending
  }, [pending, state])

  const categories = Array.from(new Set(equipment.map(e => e.category ?? 'その他')))

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-700">備品リスト</h2>
          {equipment.length > 0 && (
            <span className="text-xs text-slate-400">
              {equipment.filter(e => e.checked).length}/{equipment.length} 確認済み
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {equipment.length > 0 && (
            <>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <form action={clearAllEquipment.bind(null, eventId)}>
                    <button type="submit" className="text-xs text-red-600 font-medium hover:text-red-700">全件削除</button>
                  </form>
                  <button type="button" onClick={() => setConfirmClear(false)} className="text-xs text-slate-400 hover:text-slate-600">取消</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmClear(true)} className="p-1 text-slate-300 hover:text-red-400 transition-colors" title="全件削除">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => downloadCSV('備品リスト.csv', [
                  ['品名', '数量', '単位', 'カテゴリ', '仕入先', 'メモ', '確認済み'],
                  ...equipment.map(e => [e.name, String(e.quantity), e.unit ?? '', e.category ?? '', e.supplier ?? '', e.notes ?? '', e.checked ? '✓' : '']),
                ])}
                className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                title="CSVダウンロード"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </>
          )}
          {layoutSuggestions.length > 0 && (
            <button
              onClick={() => setShowLayoutImport(v => !v)}
              className={`text-xs flex items-center gap-1 transition-colors ${showLayoutImport ? 'text-amber-600' : 'text-slate-500 hover:text-amber-600'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              レイアウトから
            </button>
          )}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            テンプレート
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null) }}
            className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            追加
          </button>
        </div>
      </div>

      {/* テンプレートパネル */}
      {showTemplates && (
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <p className="text-xs text-slate-500 mb-3">備品セットをまとめて追加します。数量は後から変更できます。</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {templateGroups.map(group => (
              <form key={group.id} action={bulkAddEquipmentGroup.bind(null, group.id, eventId)}>
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2.5 border border-slate-200 bg-white rounded-xl hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                >
                  <p className="text-xs font-medium text-slate-700 group-hover:text-orange-600">+ {group.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {group.items.map(i => i.name).join('・')}
                  </p>
                </button>
              </form>
            ))}
          </div>
        </div>
      )}

      {/* レイアウト取り込みパネル */}
      {showLayoutImport && layoutSuggestions.length > 0 && (() => {
        const existingNames = new Set(equipment.map(e => e.name))
        const newItems = layoutSuggestions.filter(s => !existingNames.has(s.label))
        return (
          <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-100">
            <p className="text-xs text-slate-500 mb-3">
              レイアウトに配置されたアイテムを取り込めます。既存の備品は変更されません。
            </p>
            <div className="space-y-2">
              {layoutSuggestions.map(item => {
                const exists = existingNames.has(item.label)
                return (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-700">
                      {item.label}
                      <span className="text-slate-400 text-xs ml-1.5">× {item.count}</span>
                    </span>
                    {exists ? (
                      <span className="text-xs text-green-600 flex items-center gap-1 shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        登録済み
                      </span>
                    ) : (
                      <form action={importFromLayout.bind(null, eventId, item.label, item.count)}>
                        <button
                          type="submit"
                          className="text-xs text-amber-700 hover:text-amber-800 border border-amber-300 hover:border-amber-400 bg-white hover:bg-amber-50 px-2.5 py-1 rounded-lg transition-colors shrink-0 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          追加
                        </button>
                      </form>
                    )}
                  </div>
                )
              })}
            </div>
            {newItems.length > 1 && (
              <form
                className="mt-3 pt-3 border-t border-amber-100"
                action={async (fd) => {
                  for (const item of newItems) {
                    await importFromLayout(eventId, item.label, item.count, fd)
                  }
                }}
              >
                <button
                  type="submit"
                  className="text-xs text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  未登録の {newItems.length} 件をまとめて追加
                </button>
              </form>
            )}
          </div>
        )
      })()}

      {equipment.length === 0 && !showForm && !showTemplates && (
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          備品がまだ登録されていません
        </div>
      )}

      {categories.map(cat => {
        const items = equipment.filter(e => (e.category ?? 'その他') === cat)
        if (items.length === 0) return null
        return (
          <div key={cat}>
            <div className="px-6 py-2 bg-slate-50 text-xs font-medium text-slate-500 border-t border-slate-100">
              {cat}
            </div>
            <div>
              {items.map((item, catIdx) =>
                editingId === item.id ? (
                  <div key={item.id} className="sm:col-span-2">
                    <EditEquipmentRow
                      item={item}
                      eventId={eventId}
                      onClose={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 px-4 py-2.5 border-b border-slate-50 hover:bg-slate-50 transition-colors ${item.checked ? 'opacity-50' : ''}`}
                  >
                    {/* チェックボックス */}
                    <form action={toggleEquipmentCheck.bind(null, item.id, !item.checked, eventId)}>
                      <button
                        type="submit"
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          item.checked ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-green-400'
                        }`}
                      >
                        {item.checked && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </form>

                    {/* 品名 */}
                    <span className={`flex-1 min-w-0 text-sm truncate ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {item.name}
                      {item.notes && <span className="text-xs text-slate-400 ml-1.5 font-normal">({item.notes})</span>}
                    </span>

                    {/* 数量 +/- */}
                    <div className="flex items-center gap-1 shrink-0">
                      <form action={updateEquipmentQuantity.bind(null, item.id, eventId, Math.max(1, item.quantity - 1))}>
                        <button
                          type="submit"
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 rounded border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs leading-none"
                        >
                          −
                        </button>
                      </form>
                      <span className="min-w-[48px] text-center text-sm text-slate-600 tabular-nums">
                        {item.quantity}<span className="text-slate-400 text-xs ml-0.5">{item.unit}</span>
                      </span>
                      <form action={updateEquipmentQuantity.bind(null, item.id, eventId, item.quantity + 1)}>
                        <button
                          type="submit"
                          className="w-6 h-6 rounded border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 flex items-center justify-center text-xs leading-none"
                        >
                          +
                        </button>
                      </form>
                    </div>

                    {/* 操作ボタン */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <form action={moveEquipment.bind(null, item.id, eventId, 'up')}>
                        <button type="submit" disabled={catIdx === 0} className="p-1 text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed" title="上へ">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </form>
                      <form action={moveEquipment.bind(null, item.id, eventId, 'down')}>
                        <button type="submit" disabled={catIdx === items.length - 1} className="p-1 text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed" title="下へ">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </form>
                      <button
                        type="button"
                        onClick={() => { setEditingId(item.id); setConfirmDeleteId(null) }}
                        className="p-1 text-slate-300 hover:text-orange-300 transition-colors"
                        title="編集"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5 ml-1">
                          <form action={deleteEquipment.bind(null, item.id, eventId)}>
                            <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">削除</button>
                          </form>
                          <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600">取消</button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setConfirmDeleteId(item.id); setEditingId(null) }}
                          className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                          title="削除"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )
      })}

      {showForm && (
        <form ref={formRef} action={formAction} className="border-t border-slate-100 px-6 py-4 space-y-3">
          {state?.error && (
            <p className="text-xs text-red-600">{state.error}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">品名 <span className="text-red-500">*</span></label>
              <input
                name="name"
                type="text"
                required
                placeholder="例：テーブル"
                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">数量</label>
              <div className="flex gap-1">
                <input name="quantity" type="number" min={1} defaultValue={1} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <input name="unit" type="text" defaultValue="個" className="w-12 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">カテゴリ</label>
              <select name="category" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">仕入先・持参者</label>
              <input name="supplier" type="text" placeholder="例：業者手配・自社" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">メモ</label>
              <input name="notes" type="text" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">
              キャンセル
            </button>
            <button type="submit" disabled={pending} className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
              {pending ? '追加中...' : '追加'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
