'use client'

import { useState } from 'react'
import Link from 'next/link'

type QAPair = {
  id: string
  question: string
  answer: string
}

const STORAGE_KEY = 'try-qa'

function newPair(): QAPair {
  return { id: crypto.randomUUID(), question: '', answer: '' }
}

function load(): QAPair[] {
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

function save(pairs: QAPair[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs))
}

const SAMPLE_QUESTIONS = [
  { q: '駐車場はありますか？', a: '会場近くの○○駐車場をご利用ください（有料）。' },
  { q: '飲食物の持ち込みはできますか？', a: '会場内への飲食物の持ち込みはご遠慮ください。' },
  { q: '子供も参加できますか？', a: 'お子様連れでのご参加は歓迎です。' },
]

export default function TryQA() {
  const [pairs, setPairs] = useState<QAPair[]>(() => load())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQ, setEditQ] = useState('')
  const [editA, setEditA] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')

  function update(next: QAPair[]) {
    setPairs(next)
    save(next)
  }

  function startEdit(pair: QAPair) {
    setEditingId(pair.id)
    setEditQ(pair.question)
    setEditA(pair.answer)
  }

  function commitEdit() {
    if (!editingId) return
    const q = editQ.trim()
    const a = editA.trim()
    if (q || a) {
      update(pairs.map(p => p.id === editingId ? { ...p, question: q, answer: a } : p))
    } else {
      update(pairs.filter(p => p.id !== editingId))
    }
    setEditingId(null)
  }

  function deletePair(id: string) {
    update(pairs.filter(p => p.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function addPair() {
    const q = newQ.trim()
    const a = newA.trim()
    if (!q) return
    const pair = { ...newPair(), question: q, answer: a }
    update([...pairs, pair])
    setNewQ('')
    setNewA('')
    setShowForm(false)
  }

  function addSample(q: string, a: string) {
    const pair = { ...newPair(), question: q, answer: a }
    update([...pairs, pair])
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ツールバー */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center gap-2 px-4 shrink-0 no-print">
        <span className="text-sm font-medium text-slate-700 hidden sm:block">Q&A集</span>
        <div className="flex-1" />
        <button
          onClick={() => { setShowForm(v => !v); setNewQ(''); setNewA('') }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          追加
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 追加フォーム */}
        {showForm && (
          <div className="bg-white border-b border-slate-200 px-4 py-3 space-y-2">
            <input
              value={newQ}
              onChange={e => setNewQ(e.target.value)}
              placeholder="質問を入力…"
              autoFocus
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <textarea
              value={newA}
              onChange={e => setNewA(e.target.value)}
              placeholder="回答を入力…"
              rows={3}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addPair}
                disabled={!newQ.trim()}
                className="px-4 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 disabled:opacity-40 transition-colors"
              >
                追加
              </button>
              <button
                onClick={() => { setShowForm(false); setNewQ(''); setNewA('') }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto p-4 space-y-3">
          {pairs.length === 0 && !showForm && (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 mb-4">よくある質問と回答を登録しましょう</p>
              <p className="text-xs text-slate-400 mb-3">サンプルから追加：</p>
              <div className="space-y-2 max-w-md mx-auto">
                {SAMPLE_QUESTIONS.map(s => (
                  <button
                    key={s.q}
                    onClick={() => addSample(s.q, s.a)}
                    className="w-full text-left text-xs bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:border-orange-300 hover:shadow-sm transition-all"
                  >
                    <span className="font-semibold text-orange-600">Q.</span> {s.q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {pairs.map((pair, i) => (
            <div key={pair.id} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
              {editingId === pair.id ? (
                <div className="p-4 space-y-2">
                  <input
                    value={editQ}
                    onChange={e => setEditQ(e.target.value)}
                    placeholder="質問"
                    autoFocus
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <textarea
                    value={editA}
                    onChange={e => setEditA(e.target.value)}
                    placeholder="回答"
                    rows={3}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={commitEdit}
                      className="px-4 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => deletePair(pair.id)}
                      className="ml-auto px-3 py-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full text-left px-4 py-3 group hover:bg-slate-50 transition-colors"
                  onClick={() => startEdit(pair)}
                >
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    <span className="text-orange-600 font-bold mr-1">Q{i + 1}.</span>{pair.question}
                  </p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed whitespace-pre-wrap">
                    <span className="font-bold mr-1">A.</span>{pair.answer || <span className="text-slate-300 font-normal">（回答未入力）</span>}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    クリックして編集
                  </p>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 保存CTA */}
      <div className="bg-orange-50 border-t border-orange-200 px-4 py-3 shrink-0 flex items-center justify-between gap-3 no-print">
        <div>
          <p className="text-xs font-semibold text-orange-700">このQ&Aを保存しませんか？</p>
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
