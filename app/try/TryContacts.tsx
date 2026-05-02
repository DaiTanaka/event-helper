'use client'

import { useState } from 'react'
import Link from 'next/link'

type Contact = {
  id: string
  name: string
  role: string
  phone: string
  email: string
  notes: string
}

const STORAGE_KEY = 'try-contacts'

function newContact(): Contact {
  return { id: crypto.randomUUID(), name: '', role: '', phone: '', email: '', notes: '' }
}

function load(): Contact[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return []
}

function save(contacts: Contact[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
}

function ContactForm({
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  initial: Contact
  onSave: (c: Contact) => void
  onCancel: () => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState<Omit<Contact, 'id'>>({
    name: initial.name,
    role: initial.role,
    phone: initial.phone,
    email: initial.email,
    notes: initial.notes,
  })

  function set(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-4 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="名前 *"
          autoFocus
          className="col-span-2 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <input
          value={form.role}
          onChange={e => set('role', e.target.value)}
          placeholder="役割（例：司会・会場担当）"
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <input
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
          placeholder="電話番号"
          type="tel"
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <input
          value={form.email}
          onChange={e => set('email', e.target.value)}
          placeholder="メールアドレス"
          type="email"
          className="col-span-2 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <input
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="メモ"
          className="col-span-2 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave({ ...initial, ...form })}
          disabled={!form.name.trim()}
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

export default function TryContacts() {
  const [contacts, setContacts] = useState<Contact[]>(() => load())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [draftNew] = useState(() => newContact())

  function update(next: Contact[]) {
    setContacts(next)
    save(next)
  }

  function saveEdit(c: Contact) {
    update(contacts.map(x => x.id === c.id ? c : x))
    setEditingId(null)
  }

  function deleteContact(id: string) {
    update(contacts.filter(c => c.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function addContact(c: Contact) {
    update([...contacts, c])
    setShowForm(false)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ツールバー */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center gap-2 px-4 shrink-0 no-print">
        <span className="text-sm font-medium text-slate-700 hidden sm:block">スタッフ連絡先</span>
        <div className="flex-1" />
        <button
          onClick={() => { setShowForm(v => !v); setEditingId(null) }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          追加
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showForm && (
          <div className="bg-white border-b border-slate-200">
            <ContactForm
              initial={draftNew}
              onSave={addContact}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="max-w-2xl mx-auto p-4 space-y-2">
          {contacts.length === 0 && !showForm && (
            <div className="text-center py-12">
              <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-slate-400">スタッフの連絡先を登録しましょう</p>
              <p className="text-xs text-slate-300 mt-1">右上の「追加」ボタンから登録できます</p>
            </div>
          )}

          {contacts.map(contact => (
            <div key={contact.id} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
              {editingId === contact.id ? (
                <ContactForm
                  initial={contact}
                  onSave={saveEdit}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => deleteContact(contact.id)}
                />
              ) : (
                <button
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors group"
                  onClick={() => { setEditingId(contact.id); setShowForm(false) }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">{contact.name}</span>
                        {contact.role && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">{contact.role}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                        {contact.phone && (
                          <span className="text-xs text-slate-500">{contact.phone}</span>
                        )}
                        {contact.email && (
                          <span className="text-xs text-slate-400">{contact.email}</span>
                        )}
                        {contact.notes && (
                          <span className="text-xs text-slate-400 italic">{contact.notes}</span>
                        )}
                      </div>
                    </div>
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-400 transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 保存CTA */}
      <div className="bg-orange-50 border-t border-orange-200 px-4 py-3 shrink-0 flex items-center justify-between gap-3 no-print">
        <div>
          <p className="text-xs font-semibold text-orange-700">この連絡先リストを保存しませんか？</p>
          <p className="text-[11px] text-orange-500">無料登録すればイベントと紐づけて管理できます</p>
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
