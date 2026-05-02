'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { addQA, updateQA, deleteQA, moveQA, clearAllQA, bulkAddQA } from './actions'
import type { EventQA } from '@/lib/types'
import { downloadCSV } from '@/lib/csv'
import { getTemplatesForEventType } from '@/lib/qa-templates'

type Props = { eventId: string; qaList: EventQA[]; eventType?: string | null }

const inputCls = 'w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'

function EditQARow({
  qa,
  eventId,
  onClose,
}: {
  qa: EventQA
  eventId: string
  onClose: () => void
}) {
  const updateWithId = updateQA.bind(null, qa.id, eventId)
  const [state, formAction, pending] = useActionState(updateWithId, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose()
    wasPending.current = pending
  }, [pending, state, onClose])

  return (
    <div className="border-b border-slate-100 bg-orange-50/20 px-4 py-3">
      <form action={formAction} className="space-y-2">
        {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
        <div>
          <label className="block text-xs text-slate-500 mb-1">質問 <span className="text-red-500">*</span></label>
          <input name="question" type="text" required defaultValue={qa.question} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">回答 <span className="text-red-500">*</span></label>
          <textarea name="answer" required rows={3} defaultValue={qa.answer} className={`${inputCls} resize-none`} />
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

export default function QASection({ eventId, qaList, eventType }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const templateGroups = getTemplatesForEventType(eventType)

  const addWithId = addQA.bind(null, eventId)
  const [state, formAction, pending] = useActionState(addWithId, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setShowForm(false)
      formRef.current?.reset()
    }
    wasPending.current = pending
  }, [pending, state])

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
        <h2 className="font-semibold text-slate-700">Q&A集</h2>
        <div className="flex items-center gap-3">
          {qaList.length > 0 && (
            <>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <form action={clearAllQA.bind(null, eventId)}>
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
                onClick={() => downloadCSV('QA集.csv', [
                  ['質問', '回答'],
                  ...qaList.map(q => [q.question, q.answer]),
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
          <button
            onClick={() => setShowTemplates(v => !v)}
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
          <p className="text-xs text-slate-500 mb-3">
            よくあるQ&Aをまとめて追加できます。追加後に内容を編集してください。
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {templateGroups.map(group => (
              <form key={group.id} action={bulkAddQA.bind(null, group.id, eventId)}>
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2.5 border border-slate-200 bg-white rounded-xl hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                >
                  <p className="text-xs font-medium text-slate-700 group-hover:text-orange-600">+ {group.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {group.pairs.map(p => p.question).join('・')}
                  </p>
                </button>
              </form>
            ))}
          </div>
        </div>
      )}

      {qaList.length === 0 && !showForm && !showTemplates && (
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          Q&Aがまだ登録されていません
        </div>
      )}

      <div className="divide-y divide-slate-50">
        {qaList.map((qa, idx) =>
          editingId === qa.id ? (
            <EditQARow key={qa.id} qa={qa} eventId={eventId} onClose={() => setEditingId(null)} />
          ) : (
            <div key={qa.id} className="px-4 py-3 hover:bg-slate-50">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    <span className="text-orange-400 mr-1 font-bold">Q.</span>{qa.question}
                  </p>
                  <p className="text-sm text-slate-600 mt-1.5 whitespace-pre-wrap leading-relaxed">
                    <span className="text-green-600 mr-1 font-bold">A.</span>{qa.answer}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <form action={moveQA.bind(null, qa.id, eventId, 'up')}>
                    <button type="submit" disabled={idx === 0} className="p-1 text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="上へ">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                  </form>
                  <form action={moveQA.bind(null, qa.id, eventId, 'down')}>
                    <button type="submit" disabled={idx === qaList.length - 1} className="p-1 text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="下へ">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </form>
                  <button type="button" onClick={() => { setEditingId(qa.id); setConfirmDeleteId(null) }} className="p-1 text-slate-300 hover:text-orange-300 transition-colors" title="編集">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  {confirmDeleteId === qa.id ? (
                    <div className="flex items-center gap-1.5 ml-1">
                      <form action={deleteQA.bind(null, qa.id, eventId)}>
                        <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">削除</button>
                      </form>
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600">取消</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => { setConfirmDeleteId(qa.id); setEditingId(null) }} className="p-1 text-slate-300 hover:text-red-400 transition-colors" title="削除">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {showForm && (
        <form ref={formRef} action={formAction} className="border-t border-slate-100 px-6 py-4 space-y-3">
          {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
          <div>
            <label className="block text-xs text-slate-500 mb-1">質問 <span className="text-red-500">*</span></label>
            <input name="question" type="text" required placeholder="例：駐車場はありますか？" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">回答 <span className="text-red-500">*</span></label>
            <textarea name="answer" required rows={3} placeholder="例：会場近くに有料駐車場があります。" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">キャンセル</button>
            <button type="submit" disabled={pending} className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">{pending ? '追加中...' : '追加'}</button>
          </div>
        </form>
      )}
    </section>
  )
}
