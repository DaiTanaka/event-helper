'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { addContact, updateContact, deleteContact, moveContact, clearAllContacts, bulkAddContactTemplate } from './actions'
import type { EventContact } from '@/lib/types'
import { downloadCSV } from '@/lib/csv'
import { getContactTemplatesForEventType } from '@/lib/contact-templates'

type Props = { eventId: string; contacts: EventContact[]; eventType?: string | null }

const inputCls = 'w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'

function EditContactRow({
  contact,
  eventId,
  onClose,
}: {
  contact: EventContact
  eventId: string
  onClose: () => void
}) {
  const updateWithId = updateContact.bind(null, contact.id, eventId)
  const [state, formAction, pending] = useActionState(updateWithId, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose()
    wasPending.current = pending
  }, [pending, state, onClose])

  return (
    <tr className="border-b border-slate-100 bg-orange-50/20">
      <td colSpan={4} className="px-4 py-3">
        <form action={formAction} className="space-y-2">
          {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input name="name" type="text" required defaultValue={contact.name} placeholder="名前 *" className={inputCls} />
            <input name="role" type="text" defaultValue={contact.role ?? ''} placeholder="役割" className={inputCls} />
            <input name="company" type="text" defaultValue={contact.company ?? ''} placeholder="会社/所属" className={inputCls} />
            <input name="phone" type="tel" defaultValue={contact.phone ?? ''} placeholder="電話番号" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input name="email" type="email" defaultValue={contact.email ?? ''} placeholder="メールアドレス" className={inputCls} />
            <input name="notes" type="text" defaultValue={contact.notes ?? ''} placeholder="メモ" className={inputCls} />
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
      </td>
    </tr>
  )
}

export default function ContactsSection({ eventId, contacts, eventType }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const templateGroups = getContactTemplatesForEventType(eventType)

  const addWithId = addContact.bind(null, eventId)
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
        <h2 className="font-semibold text-slate-700">スタッフ連絡先</h2>
        <div className="flex items-center gap-3">
          {contacts.length > 0 && (
            <>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <form action={clearAllContacts.bind(null, eventId)}>
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
                onClick={() => downloadCSV('スタッフ連絡先.csv', [
                  ['名前', '役割', '会社/所属', '電話番号', 'メールアドレス', 'メモ'],
                  ...contacts.map(c => [c.name, c.role ?? '', c.company ?? '', c.phone ?? '', c.email ?? '', c.notes ?? '']),
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
            役割ごとに連絡先を一括追加します。名前・電話番号等は後から編集してください。
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {templateGroups.map(group => (
              <form key={group.id} action={bulkAddContactTemplate.bind(null, group.id, eventId)}>
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2.5 border border-slate-200 bg-white rounded-xl hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                >
                  <p className="text-xs font-medium text-slate-700 group-hover:text-orange-600">+ {group.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {group.contacts.map(c => c.role).join('・')}
                  </p>
                </button>
              </form>
            ))}
          </div>
        </div>
      )}

      {contacts.length === 0 && !showForm && !showTemplates && (
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          連絡先がまだ登録されていません
        </div>
      )}

      {contacts.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">名前</th>
              <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium hidden sm:table-cell">役割 / 会社</th>
              <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">連絡先</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, idx) =>
              editingId === c.id ? (
                <EditContactRow key={c.id} contact={c} eventId={eventId} onClose={() => setEditingId(null)} />
              ) : (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{c.name}</div>
                    {c.notes && <div className="text-xs text-slate-400 mt-0.5">{c.notes}</div>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {c.role && <div className="text-slate-700 text-xs">{c.role}</div>}
                    {c.company && <div className="text-slate-400 text-xs">{c.company}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="text-orange-500 hover:text-orange-600 text-xs block">{c.phone}</a>
                    )}
                    {c.email && <div className="text-slate-400 text-xs truncate max-w-48">{c.email}</div>}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <form action={moveContact.bind(null, c.id, eventId, 'up')}>
                        <button type="submit" disabled={idx === 0} className="p-1 text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="上へ">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                      </form>
                      <form action={moveContact.bind(null, c.id, eventId, 'down')}>
                        <button type="submit" disabled={idx === contacts.length - 1} className="p-1 text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="下へ">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </form>
                      <button type="button" onClick={() => { setEditingId(c.id); setConfirmDeleteId(null) }} className="p-1 text-slate-300 hover:text-orange-300 transition-colors" title="編集">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {confirmDeleteId === c.id ? (
                        <div className="flex items-center gap-1.5 ml-1">
                          <form action={deleteContact.bind(null, c.id, eventId)}>
                            <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">削除</button>
                          </form>
                          <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600">取消</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => { setConfirmDeleteId(c.id); setEditingId(null) }} className="p-1 text-slate-300 hover:text-red-400 transition-colors" title="削除">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <form ref={formRef} action={formAction} className="border-t border-slate-100 px-6 py-4 space-y-3">
          {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">名前 <span className="text-red-500">*</span></label>
              <input name="name" type="text" required placeholder="例：田中" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">役割</label>
              <input name="role" type="text" placeholder="例：会場担当" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">会社/所属</label>
              <input name="company" type="text" placeholder="例：株式会社〇〇" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">電話番号</label>
              <input name="phone" type="tel" placeholder="例：090-1234-5678" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">メールアドレス</label>
              <input name="email" type="email" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">メモ</label>
              <input name="notes" type="text" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
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
