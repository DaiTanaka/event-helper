'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/catalog'
import type { CatalogItem } from '@/lib/catalog'
import type { EventContent } from '@/lib/types'
import { addContentFromCatalog } from './actions'
import { trackCatalogView } from './trackView'

const AD_INTERVAL = 4

function PriceRange({ item }: { item: CatalogItem }) {
  if (item.price_from === null) return <span className="text-xs text-slate-400">要見積</span>
  if (item.price_from === 0 && item.price_to === null) return <span className="text-xs text-green-600 font-medium">無料〜</span>
  return (
    <span className="text-xs text-slate-500">
      <span className="font-medium text-slate-700">
        ¥{item.price_from.toLocaleString()}
        {item.price_to != null && <>〜¥{item.price_to.toLocaleString()}</>}
        {item.price_to === null && <>〜</>}
      </span>
      <span className="text-slate-400 ml-1">（100名目安）</span>
    </span>
  )
}

// ── カタログカード ────────────────────────────────────────
function CatalogCard({
  item,
  isAdded,
  isBookmarked,
  onAdd,
  onToggleBookmark,
}: {
  item: CatalogItem
  isAdded: boolean
  isBookmarked: boolean
  onAdd: (item: CatalogItem) => void
  onToggleBookmark: (item: CatalogItem) => void
}) {
  const [adding, startAdd] = useTransition()

  const ogImage = item.og_image_url

  if (item.isAd) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-2 relative">
        <span className="absolute top-2 right-2 text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-medium">PR</span>
        {ogImage && <Image src={ogImage} alt="" width={400} height={112} className="w-full h-28 object-cover rounded-lg mb-1" referrerPolicy="no-referrer" />}
        <p className="text-sm font-semibold text-slate-800 pr-8">{item.title.replace('【PR】', '')}</p>
        <p className="text-xs text-slate-500 flex-1">{item.description}</p>
        <div className="flex items-center justify-between mt-1">
          <PriceRange item={item} />
          <a href={item.contact_url ?? '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-700 font-medium hover:underline">詳細・問合せ →</a>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border rounded-xl p-4 flex flex-col gap-2 transition-shadow ${
      item.isPiqton ? 'border-orange-100 bg-orange-50/30' : 'border-slate-100'
    } ${isBookmarked ? 'ring-2 ring-amber-400 border-amber-200' : ''}`}>
      {ogImage && <Image src={ogImage} alt={item.title} width={400} height={112} className="w-full h-28 object-cover rounded-lg" referrerPolicy="no-referrer" />}
      <div className="flex items-start justify-between gap-1">
        <div className="flex flex-wrap gap-1">
          {item.isPiqton && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">ピコトン</span>}
        </div>
        <button
          onClick={() => onToggleBookmark(item)}
          title={isBookmarked ? 'お気に入り解除' : 'お気に入りに追加'}
          className={`shrink-0 text-lg leading-none transition-transform hover:scale-110 ${isBookmarked ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'}`}
        >★</button>
      </div>
      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
      <p className="text-xs text-slate-500 flex-1 line-clamp-3">{item.description}</p>
      <div className="flex flex-wrap gap-1">
        {item.tags.map(tag => <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>)}
      </div>
      <div className="flex items-center justify-between mt-1">
        <PriceRange item={item} />
        <button
          disabled={isAdded || adding}
          onClick={() => startAdd(async () => { await onAdd(item) })}
          className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 disabled:opacity-50 disabled:cursor-default transition-colors"
        >
          {adding ? '...' : isAdded ? '追加済' : '選定に追加'}
        </button>
      </div>
    </div>
  )
}

// ── お気に入りパネル ──────────────────────────────────────
function BookmarkPanel({
  bookmarks,
  addedIds,
  onRemove,
  onClear,
  onAdd,
}: {
  bookmarks: CatalogItem[]
  addedIds: Set<string>
  onRemove: (id: string) => void
  onClear: () => void
  onAdd: (item: CatalogItem) => void
}) {
  const [open, setOpen] = useState(false)
  const [addingAll, startAddAll] = useTransition()

  if (bookmarks.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-amber-200 shadow-xl">
      <div className="max-w-4xl mx-auto px-4">
        {/* 折りたたみヘッダー */}
        <div className="flex items-center justify-between py-2.5">
          <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 text-sm font-semibold text-amber-700">
            <span className="text-base">★</span>
            お気に入り {bookmarks.length} 件
            <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <button
              disabled={addingAll}
              onClick={() => startAddAll(async () => { for (const item of bookmarks) { if (!addedIds.has(item.id)) await onAdd(item) } })}
              className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {addingAll ? '追加中...' : 'すべて選定に追加'}
            </button>
            <button onClick={onClear} className="text-xs text-slate-400 hover:text-slate-600">クリア</button>
          </div>
        </div>

        {/* 展開時: カード一覧 */}
        {open && (
          <div className="pb-4 overflow-x-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 min-w-0">
              {bookmarks.map(item => {
                const ogImage = item.og_image_url
                const isAdded = addedIds.has(item.id)
                return (
                  <div key={item.id} className={`border rounded-xl p-3 bg-white space-y-2 ${isAdded ? 'border-green-200 bg-green-50/30' : 'border-amber-100'}`}>
                    {ogImage && <Image src={ogImage} alt={item.title} width={400} height={80} className="w-full h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />}
                    <p className="text-xs font-semibold text-slate-800 line-clamp-2">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.company_name}</p>
                    <PriceRange item={item} />
                    <div className="flex gap-1.5">
                      <button
                        disabled={isAdded}
                        onClick={() => { startAddAll(async () => { await onAdd(item) }) }}
                        className="flex-1 text-xs py-1 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:bg-green-500"
                      >
                        {isAdded ? '追加済' : '追加'}
                      </button>
                      <button onClick={() => onRemove(item.id)} className="text-xs px-1.5 py-1 rounded border border-slate-200 text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── メイン ────────────────────────────────────────────────
export default function CatalogBrowser({
  eventId,
  existingContents,
  catalogItems,
}: {
  eventId: string
  existingContents: EventContent[]
  catalogItems: CatalogItem[]
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('すべて')
  const [bookmarks, setBookmarks] = useState<Map<string, CatalogItem>>(new Map())
  const [addedIds, setAddedIds] = useState<Set<string>>(
    new Set(existingContents.map(c => c.catalog_id).filter(Boolean) as string[])
  )
  const [addError, setAddError] = useState<string | null>(null)

  const organic = catalogItems.filter(i => !i.isAd)
  const ads = catalogItems.filter(i => i.isAd)

  const filtered = organic.filter(item => {
    const matchCat = category === 'すべて' || item.category === category
    const matchQ = !query || item.title.includes(query) || item.description.includes(query) ||
      item.tags.some(t => t.includes(query)) || item.company_name.includes(query)
    return matchCat && matchQ
  })

  // 広告を AD_INTERVAL 件ごとに挿入
  const withAds: (CatalogItem | { _ad: true; item: CatalogItem })[] = []
  filtered.forEach((item, idx) => {
    withAds.push(item)
    if (ads.length > 0 && (idx + 1) % AD_INTERVAL === 0) {
      withAds.push({ _ad: true, item: ads[Math.floor(idx / AD_INTERVAL) % ads.length] })
    }
  })

  async function handleAdd(item: CatalogItem) {
    setAddError(null)
    const [, r] = await Promise.all([
      trackCatalogView(item.id, eventId).catch(() => {}),
      addContentFromCatalog(
        eventId, item.id, item.title, item.category, item.company_name,
        item.price_from, item.url, item.og_image_url
      ),
    ])
    if (r.error) {
      setAddError(r.error)
    } else {
      setAddedIds(prev => new Set([...prev, item.id]))
    }
  }

  function toggleBookmark(item: CatalogItem) {
    setBookmarks(prev => {
      const next = new Map(prev)
      if (next.has(item.id)) { next.delete(item.id) } else { next.set(item.id, item) }
      return next
    })
  }

  const bookmarkList = [...bookmarks.values()]

  return (
    <div className="pb-24 space-y-3">
      {/* フィルター */}
      <input
        type="search"
        placeholder="キーワードで検索..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200"
      />
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 text-xs rounded-full border transition-colors ${category === cat ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 text-slate-600 hover:border-orange-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      {addError && (
        <div className="flex items-center justify-between gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5">
          <span>{addError}</span>
          <button onClick={() => setAddError(null)} className="shrink-0 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-10">該当するコンテンツが見つかりません</p>
      )}

      {/* カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {withAds.map((entry, idx) => {
          if ('_ad' in entry) {
            return <CatalogCard key={`ad-${idx}`} item={entry.item} isAdded={false} isBookmarked={false} onAdd={() => {}} onToggleBookmark={() => {}} />
          }
          return (
            <CatalogCard
              key={entry.id}
              item={entry}
              isAdded={addedIds.has(entry.id)}
              isBookmarked={bookmarks.has(entry.id)}
              onAdd={handleAdd}
              onToggleBookmark={toggleBookmark}
            />
          )
        })}
      </div>

      {/* お気に入りパネル */}
      <BookmarkPanel
        bookmarks={bookmarkList}
        addedIds={addedIds}
        onRemove={id => setBookmarks(prev => { const n = new Map(prev); n.delete(id); return n })}
        onClear={() => setBookmarks(new Map())}
        onAdd={handleAdd}
      />
    </div>
  )
}
