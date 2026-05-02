'use client'

import { useState, useActionState } from 'react'
import type { Event, EventContent } from '@/lib/types'
import type { CatalogItem } from '@/lib/catalog'
import { addContent } from './actions'
import ContentsList from './ContentsList'
import CatalogBrowser from './CatalogBrowser'

type Tab = 'list' | 'catalog'

function AddContentForm({
  eventId,
  onClose,
}: {
  eventId: string
  onClose: () => void
}) {
  const addBound = addContent.bind(null, eventId)
  const [state, action, isPending] = useActionState(addBound, {})

  return (
    <form action={action} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs text-slate-500 mb-1">コンテンツ名 *</label>
          <input
            name="title"
            required
            placeholder="例：マジックショー"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">カテゴリ</label>
          <input
            name="category"
            placeholder="例：ステージ・演出"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">提供会社</label>
          <input
            name="company_name"
            placeholder="例：〇〇プロダクション"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">見積金額（円）</label>
          <input
            name="estimated_cost"
            type="number"
            placeholder="0"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">メモ</label>
          <input
            name="notes"
            placeholder="気になる点など"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-slate-500 mb-1">URL</label>
          <input
            name="url"
            type="url"
            placeholder="https://..."
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {isPending ? '追加中...' : '追加'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-sm border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}

export default function ContentsClient({
  event,
  contents,
  catalogItems,
}: {
  event: Event
  contents: EventContent[]
  catalogItems: CatalogItem[]
}) {
  const [tab, setTab] = useState<Tab>('list')
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="space-y-4">
      {/* タブ */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {([
          { key: 'list', label: '選定リスト' },
          { key: 'catalog', label: 'カタログから選ぶ' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setShowAddForm(false) }}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              tab === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'list' && (
        <div className="space-y-3">
          {showAddForm ? (
            <AddContentForm eventId={event.id} onClose={() => setShowAddForm(false)} />
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              <span className="text-lg leading-none">＋</span> 手動で追加
            </button>
          )}
          <ContentsList contents={contents} eventId={event.id} />
        </div>
      )}

      {tab === 'catalog' && (
        <CatalogBrowser eventId={event.id} existingContents={contents} catalogItems={catalogItems} />
      )}
    </div>
  )
}
