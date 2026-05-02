'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import type { EventContent } from '@/lib/types'
import { updateContent, deleteContent, setContentStatus, cancelContent, fetchUrlMeta } from './actions'
import { addSchedule } from '../actions'
import { CANCEL_REASONS } from '@/lib/eventFields'

const STATUS_LABEL: Record<EventContent['status'], string> = {
  considering: '検討中',
  confirmed: '確定',
  cancelled: 'キャンセル',
}

const STATUS_STYLE: Record<EventContent['status'], string> = {
  considering: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-slate-100 text-slate-400 border-slate-200',
}


const DAY_LABELS = ['1日目', '2日目', '3日目', '4日目', '5日目']

const inputCls =
  'w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200'

// ── 編集フォーム ────────────────────────────────────────────────

function EditContentForm({
  content,
  eventId,
  onClose,
}: {
  content: EventContent
  eventId: string
  onClose: () => void
}) {
  const updateBound = updateContent.bind(null, content.id, eventId)
  const [state, action, isPending] = useActionState(updateBound, {})
  const wasPending = useRef(false)

  const [urlValue, setUrlValue] = useState(content.url ?? '')
  const [ogImageValue, setOgImageValue] = useState(content.og_image_url ?? '')
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [fetchPending, startFetch] = useTransition()

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) onClose()
    wasPending.current = isPending
  }, [isPending, state.error, onClose])

  function handleFetchMeta() {
    if (!urlValue) return
    setFetchError(null)
    startFetch(async () => {
      const result = await fetchUrlMeta(urlValue)
      if (result.error) setFetchError(result.error)
      else if (result.imageUrl) setOgImageValue(result.imageUrl)
    })
  }

  return (
    <form action={action} className="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-3">
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <input type="hidden" name="og_image_url" value={ogImageValue} />
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs text-slate-500 mb-1">コンテンツ名 *</label>
          <input name="title" defaultValue={content.title} required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">カテゴリ</label>
          <input name="category" defaultValue={content.category ?? ''} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">提供会社</label>
          <input name="company_name" defaultValue={content.company_name ?? ''} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">見積金額（円）</label>
          <input name="estimated_cost" type="number" defaultValue={content.estimated_cost ?? ''} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">確定金額（円）</label>
          <input name="actual_cost" type="number" defaultValue={content.actual_cost ?? ''} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">ステータス</label>
          <select name="status" defaultValue={content.status} className={inputCls + ' bg-white'}>
            <option value="considering">検討中</option>
            <option value="confirmed">確定</option>
            <option value="cancelled">キャンセル</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">見送り理由</label>
          <select name="cancel_reason" defaultValue={content.cancel_reason ?? ''} className={inputCls + ' bg-white'}>
            <option value="">—</option>
            {CANCEL_REASONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-slate-500 mb-1">メモ</label>
          <textarea name="notes" defaultValue={content.notes ?? ''} rows={2} className={inputCls + ' resize-none'} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-slate-500 mb-1">URL</label>
          <div className="flex gap-2">
            <input
              name="url"
              type="url"
              value={urlValue}
              onChange={e => setUrlValue(e.target.value)}
              placeholder="https://..."
              className={inputCls + ' flex-1'}
            />
            <button
              type="button"
              onClick={handleFetchMeta}
              disabled={!urlValue || fetchPending}
              className="shrink-0 text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {fetchPending ? '取得中...' : '画像取得'}
            </button>
          </div>
          {fetchError && <p className="text-xs text-red-500 mt-1">{fetchError}</p>}
        </div>
        {ogImageValue && (
          <div className="col-span-2 flex items-center gap-3">
            <Image src={ogImageValue} alt="" width={112} height={64} className="h-16 w-28 object-cover rounded-lg" referrerPolicy="no-referrer" />
            <button
              type="button"
              onClick={() => setOgImageValue('')}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              画像を削除
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
          {isPending ? '保存中...' : '保存'}
        </button>
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50">
          キャンセル
        </button>
      </div>
    </form>
  )
}

// ── スケジュール追加フォーム ────────────────────────────────────

function AddToScheduleForm({
  contentTitle,
  eventId,
  onClose,
}: {
  contentTitle: string
  eventId: string
  onClose: () => void
}) {
  const addBound = addSchedule.bind(null, eventId)
  const [state, action, isPending] = useActionState(addBound, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) onClose()
    wasPending.current = isPending
  }, [isPending, state?.error, onClose])

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <p className="text-xs font-semibold text-slate-500 mb-2.5 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        タイムスケジュールに追加
      </p>
      <form action={action} className="space-y-2.5">
        <input type="hidden" name="content" value={contentTitle} />
        <input type="hidden" name="schedule_type" value="開催" />
        {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <select
            name="day_number"
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-orange-300"
          >
            {[1, 2, 3, 4, 5].map(d => (
              <option key={d} value={d}>{DAY_LABELS[d - 1]}</option>
            ))}
          </select>
          <input
            name="start_time"
            type="time"
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-300"
          />
          <span className="text-slate-300 text-xs">〜</span>
          <input
            name="end_time"
            type="time"
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-300"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-medium"
          >
            {isPending ? '追加中...' : '追加する'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}

// ── コンテンツカード ────────────────────────────────────────────

function ContentRow({
  content,
  eventId,
}: {
  content: EventContent
  eventId: string
}) {
  const [editing, setEditing] = useState(false)
  const [addingSchedule, setAddingSchedule] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [pickingCancelReason, setPickingCancelReason] = useState(false)
  const [isCancelling, startCancel] = useTransition()

  const confirmAction  = setContentStatus.bind(null, content.id, eventId, 'confirmed')
  const considerAction = setContentStatus.bind(null, content.id, eventId, 'considering')
  const deleteAction   = deleteContent.bind(null, content.id, eventId)

  function handleCancelWithReason(reason: string | null) {
    startCancel(async () => {
      await cancelContent(content.id, eventId, reason)
      setPickingCancelReason(false)
    })
  }

  if (editing) {
    return <EditContentForm content={content} eventId={eventId} onClose={() => setEditing(false)} />
  }

  const isActive = content.status !== 'cancelled'
  const accentColor =
    content.status === 'confirmed'  ? 'bg-green-400' :
    content.status === 'considering' ? 'bg-amber-400' :
    'bg-slate-200'

  return (
    <div className={`flex rounded-xl border overflow-hidden shadow-sm transition-all ${
      content.status === 'confirmed' ? 'border-green-100' : 'border-slate-100'
    } ${!isActive ? 'opacity-50' : ''}`}>
      {/* 左アクセントバー */}
      <div className={`w-1 shrink-0 ${accentColor}`} />

      <div className="flex-1 min-w-0 bg-white">
        {/* OG画像 */}
        {content.og_image_url && isActive && (
          <Image
            src={content.og_image_url}
            alt={content.title}
            width={400}
            height={128}
            className="w-full h-32 object-cover border-b border-slate-50"
            referrerPolicy="no-referrer"
          />
        )}

        <div className="p-4">
          {/* ステータスバッジ + カテゴリ + 金額（同一行） */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${STATUS_STYLE[content.status]}`}>
                {STATUS_LABEL[content.status]}
              </span>
              {content.category && (
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                  {content.category}
                </span>
              )}
            </div>
            <div className="shrink-0 text-right">
              {content.actual_cost != null ? (
                <p className="text-sm font-bold text-green-700">¥{content.actual_cost.toLocaleString()}</p>
              ) : content.estimated_cost != null ? (
                <p className="text-sm text-slate-400">~¥{content.estimated_cost.toLocaleString()}</p>
              ) : null}
            </div>
          </div>

          {/* タイトル */}
          <p className={`text-sm font-semibold text-slate-800 leading-snug ${!isActive ? 'line-through' : ''}`}>
            {content.url ? (
              <a href={content.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 hover:underline">
                {content.title}
                <svg className="inline ml-1 w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : content.title}
          </p>

          {/* 会社名 */}
          {content.company_name && (
            <p className="text-xs text-slate-400 mt-0.5">{content.company_name}</p>
          )}

          {/* メモ */}
          {content.notes && (
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{content.notes}</p>
          )}

          {/* ── 検討中: 確定/見送りアクション ── */}
          {content.status === 'considering' && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50 flex-wrap">
              <form action={confirmAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  確定する
                </button>
              </form>
              {pickingCancelReason ? (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs text-slate-500 font-medium">見送り理由（任意）</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CANCEL_REASONS.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        disabled={isCancelling}
                        onClick={() => handleCancelWithReason(r.value)}
                        className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg border border-slate-200 hover:border-red-200 transition-colors disabled:opacity-50"
                      >
                        {r.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={isCancelling}
                      onClick={() => handleCancelWithReason(null)}
                      className="text-xs px-2.5 py-1 text-slate-400 border border-dashed border-slate-200 rounded-lg hover:text-slate-600 transition-colors disabled:opacity-50"
                    >
                      理由なし
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickingCancelReason(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 self-start"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setPickingCancelReason(true) }}
                  className="px-3 py-1.5 text-sm text-slate-400 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  見送り
                </button>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => { setEditing(true); setConfirmDelete(false) }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  編集
                </button>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <form action={deleteAction}>
                      <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">削除</button>
                    </form>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs text-slate-400">取消</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)} className="text-xs text-slate-300 hover:text-red-400">削除</button>
                )}
              </div>
            </div>
          )}

          {/* ── 確定済み: スケジュール追加 / 戻す ── */}
          {content.status === 'confirmed' && (
            <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-50 flex-wrap">
              <button
                type="button"
                onClick={() => { setAddingSchedule(!addingSchedule); setConfirmDelete(false) }}
                className={`text-xs flex items-center gap-1 font-medium transition-colors ${
                  addingSchedule ? 'text-orange-600' : 'text-orange-400 hover:text-orange-600'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                スケジュールに追加
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => { setEditing(true); setAddingSchedule(false); setConfirmDelete(false) }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  編集
                </button>
                <form action={considerAction}>
                  <button type="submit" className="text-xs text-slate-400 hover:text-slate-600">
                    検討中に戻す
                  </button>
                </form>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <form action={deleteAction}>
                      <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">削除</button>
                    </form>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs text-slate-400">取消</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)} className="text-xs text-slate-300 hover:text-red-400">削除</button>
                )}
              </div>
            </div>
          )}

          {/* ── 見送り: 復活ボタン ── */}
          {content.status === 'cancelled' && (
            <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-50">
              <form action={considerAction}>
                <button type="submit" className="text-xs text-slate-400 hover:text-slate-600">
                  ↩ 検討中に戻す
                </button>
              </form>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => { setEditing(true); setConfirmDelete(false) }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  編集
                </button>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <form action={deleteAction}>
                      <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">削除</button>
                    </form>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs text-slate-400">取消</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)} className="text-xs text-slate-300 hover:text-red-400">削除</button>
                )}
              </div>
            </div>
          )}

          {/* スケジュール追加フォーム（インライン展開） */}
          {addingSchedule && (
            <AddToScheduleForm
              contentTitle={content.title}
              eventId={eventId}
              onClose={() => setAddingSchedule(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── 予算サマリー ────────────────────────────────────────────────

function BudgetSummary({ contents }: { contents: EventContent[] }) {
  const active = contents.filter(c => c.status !== 'cancelled')
  const confirmed = contents.filter(c => c.status === 'confirmed')
  const estimatedTotal = active.reduce((sum, c) => sum + (c.estimated_cost ?? 0), 0)
  const confirmedTotal = confirmed.reduce((sum, c) => sum + (c.actual_cost ?? c.estimated_cost ?? 0), 0)

  if (contents.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-slate-500 mb-3">予算サマリー</p>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">検討中含む合計</p>
          <p className="text-base font-bold text-slate-700">¥{estimatedTotal.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">確定済み合計</p>
          <p className="text-base font-bold text-green-600">¥{confirmedTotal.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">確定件数</p>
          <p className="text-base font-bold text-slate-700">
            {confirmed.length}
            <span className="text-xs font-normal text-slate-400"> / {contents.length}件</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── メインコンポーネント ───────────────────────────────────────

export default function ContentsList({
  contents,
  eventId,
}: {
  contents: EventContent[]
  eventId: string
}) {
  const [showCancelled, setShowCancelled] = useState(false)

  const confirmed = contents.filter(c => c.status === 'confirmed')
  const considering = contents.filter(c => c.status === 'considering')
  const cancelled = contents.filter(c => c.status === 'cancelled')

  return (
    <div className="space-y-6">
      <BudgetSummary contents={contents} />

      {contents.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-8">
          まだコンテンツがありません。カタログから選んで追加しましょう。
        </p>
      )}

      {/* 確定セクション */}
      {confirmed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide">確定</h3>
            <span className="text-xs text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
              {confirmed.length}件
            </span>
          </div>
          <div className="space-y-2.5">
            {confirmed.map(c => (
              <ContentRow key={c.id} content={c} eventId={eventId} />
            ))}
          </div>
        </section>
      )}

      {/* 検討中セクション */}
      {considering.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide">検討中</h3>
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              {considering.length}件
            </span>
          </div>
          <div className="space-y-2.5">
            {considering.map(c => (
              <ContentRow key={c.id} content={c} eventId={eventId} />
            ))}
          </div>
        </section>
      )}

      {/* キャンセルセクション（折りたたみ） */}
      {cancelled.length > 0 && (
        <section>
          <button
            type="button"
            onClick={() => setShowCancelled(!showCancelled)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${showCancelled ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            キャンセル（{cancelled.length}件）
          </button>
          {showCancelled && (
            <div className="mt-2.5 space-y-2.5">
              {cancelled.map(c => (
                <ContentRow key={c.id} content={c} eventId={eventId} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
