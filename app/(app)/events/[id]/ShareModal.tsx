'use client'

import { useState, useTransition } from 'react'
import type { EventMember, EventInvitation } from '@/lib/types'
import {
  createInvitation,
  deleteInvitation,
  removeMember,
  updateMemberRole,
} from './share/actions'

type Props = {
  eventId: string
  eventTitle: string
  members: EventMember[]
  invitations: EventInvitation[]
  isOwner: boolean
}

const ROLE_LABEL: Record<string, string> = {
  editor: '編集者',
  viewer: '閲覧者',
}

const ROLE_DESC: Record<string, string> = {
  editor: 'すべての情報を編集できます',
  viewer: '閲覧のみ（自分のダッシュボードに表示）',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          コピー済み
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          リンクをコピー
        </>
      )}
    </button>
  )
}

export default function ShareModal({ eventId, eventTitle, members: initMembers, invitations: initInvitations, isOwner }: Props) {
  const [open, setOpen] = useState(false)
  const [members, setMembers] = useState(initMembers)
  const [invitations, setInvitations] = useState(initInvitations)
  const [role, setRole] = useState<'editor' | 'viewer'>('editor')
  const [label, setLabel] = useState('')
  const [newLink, setNewLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  function handleCreate() {
    setError(null)
    startTransition(async () => {
      const res = await createInvitation(eventId, role, label)
      if ('error' in res) {
        setError(res.error)
        return
      }
      const url = `${origin}/invite/${res.token}`
      setNewLink(url)
      setLabel('')
    })
  }

  function handleDeleteInvitation(id: string) {
    startTransition(async () => {
      await deleteInvitation(id, eventId)
      setInvitations(prev => prev.filter(i => i.id !== id))
      if (newLink) setNewLink(null)
    })
  }

  function handleRemoveMember(id: string) {
    startTransition(async () => {
      await removeMember(id, eventId)
      setMembers(prev => prev.filter(m => m.id !== id))
    })
  }

  function handleRoleChange(memberId: string, newRole: 'editor' | 'viewer') {
    startTransition(async () => {
      await updateMemberRole(memberId, eventId, newRole)
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m))
    })
  }

  const activeInvitations = invitations.filter(i => !i.accepted_at)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors no-print"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        共有
        {members.length > 0 && (
          <span className="bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full font-semibold">
            {members.length}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* ヘッダー */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">メンバーと共有</h2>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{eventTitle}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">

              {/* 招待リンク作成（オーナーのみ） */}
              {isOwner && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">招待リンクを作成</h3>

                  {newLink ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-medium text-green-700">招待リンクを作成しました</p>
                      <div className="bg-white border border-green-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono break-all">
                        {newLink}
                      </div>
                      <div className="flex gap-2">
                        <CopyButton text={newLink} />
                        <button
                          onClick={() => setNewLink(null)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          閉じる
                        </button>
                      </div>
                      <p className="text-xs text-slate-400">このリンクを知っている人なら誰でも参加できます。30日間有効です。</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          value={label}
                          onChange={e => setLabel(e.target.value)}
                          placeholder="メモ（任意）：例「田中さん用」"
                          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <select
                          value={role}
                          onChange={e => setRole(e.target.value as 'editor' | 'viewer')}
                          className="text-sm border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                          <option value="editor">編集者</option>
                          <option value="viewer">閲覧者</option>
                        </select>
                      </div>
                      <p className="text-xs text-slate-400">{ROLE_DESC[role]}</p>
                      {error && <p className="text-xs text-red-500">{error}</p>}
                      <button
                        onClick={handleCreate}
                        disabled={pending}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {pending ? '作成中...' : '招待リンクを作成'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 未使用の招待リンク */}
              {activeInvitations.length > 0 && isOwner && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">有効な招待リンク</h3>
                  <div className="space-y-2">
                    {activeInvitations.map(inv => (
                      <div key={inv.id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm text-slate-700 font-medium truncate">
                            {inv.label || '無題の招待リンク'}
                          </p>
                          <p className="text-xs text-slate-400">
                            {ROLE_LABEL[inv.role]} ·
                            {new Date(inv.expires_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}まで有効
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <CopyButton text={`${origin}/invite/${inv.token}`} />
                          <button
                            onClick={() => handleDeleteInvitation(inv.id)}
                            disabled={pending}
                            className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                            title="削除"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 現在のメンバー */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  メンバー {members.length > 0 && `（${members.length}名）`}
                </h3>
                {members.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    まだメンバーがいません。招待リンクを作成して共有しましょう。
                  </p>
                ) : (
                  <div className="space-y-2">
                    {members.map(member => (
                      <div key={member.id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-slate-700 font-medium truncate">
                              {member.email ?? 'メンバー'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(member.created_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}参加
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isOwner ? (
                            <select
                              value={member.role}
                              onChange={e => handleRoleChange(member.id, e.target.value as 'editor' | 'viewer')}
                              disabled={pending}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-300 bg-white"
                            >
                              <option value="editor">編集者</option>
                              <option value="viewer">閲覧者</option>
                            </select>
                          ) : (
                            <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                              {ROLE_LABEL[member.role]}
                            </span>
                          )}
                          {isOwner && (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={pending}
                              className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                              title="メンバーを削除"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* フッター */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
              <p className="text-xs text-slate-400 leading-relaxed">
                招待リンクを知っている人なら誰でも参加できます。担当者交代や引き継ぎ時に活用してください。
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
