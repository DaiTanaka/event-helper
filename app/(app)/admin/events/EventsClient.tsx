'use client'

import { useState } from 'react'
import { downloadCSV } from '@/lib/csv'

type EventRow = {
  id: string
  title: string
  event_type: string | null
  venue_type: string | null
  prefecture: string | null
  expected_visitors: number | null
  target_age: string[] | null
  event_date: string | null
  created_at: string
  user_email: string
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  corporate_party: '企業・社内',
  school_event: '学校・教育',
  community_festival: '地域・自治体',
  commercial_facility: '商業施設',
  sports: 'スポーツ',
  exhibition: '展示会',
  other: 'その他',
}

const VENUE_TYPE_LABELS: Record<string, string> = {
  indoor: '屋内',
  outdoor: '屋外',
  hybrid: 'ミックス',
}

export default function EventsClient({ events }: { events: EventRow[] }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')

  const filtered = events.filter(e => {
    const matchSearch = !search || e.title.includes(search) || e.user_email.includes(search)
    const matchType = !filterType || e.event_type === filterType
    return matchSearch && matchType
  })

  // 統計
  const withType = events.filter(e => e.event_type).length
  const withoutType = events.length - withType
  const typeCounts = Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => ({
    key, label, count: events.filter(e => e.event_type === key).length,
  })).filter(x => x.count > 0).sort((a, b) => b.count - a.count)
  const avgVisitors = (() => {
    const vals = events.filter(e => e.expected_visitors).map(e => e.expected_visitors!)
    return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null
  })()

  function handleDownload() {
    downloadCSV('イベント一覧.csv', [
      ['タイトル', 'イベント種別', '会場タイプ', '都道府県', '来場想定', 'ターゲット年齢', '開催日', '登録日', 'ユーザー'],
      ...filtered.map(e => [
        e.title,
        e.event_type ? (EVENT_TYPE_LABELS[e.event_type] ?? e.event_type) : '',
        e.venue_type ? (VENUE_TYPE_LABELS[e.venue_type] ?? e.venue_type) : '',
        e.prefecture ?? '',
        e.expected_visitors ? String(e.expected_visitors) : '',
        (e.target_age ?? []).join(' / '),
        e.event_date ? new Date(e.event_date).toLocaleDateString('ja-JP') : '',
        new Date(e.created_at).toLocaleDateString('ja-JP'),
        e.user_email,
      ]),
    ])
  }

  return (
    <div className="space-y-4">

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">総イベント数</p>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">{events.length}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">種別入力率</p>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">
            {events.length ? Math.round((withType / events.length) * 100) : 0}
            <span className="text-sm font-normal text-slate-400">%</span>
          </p>
          {withoutType > 0 && <p className="text-xs text-amber-500 mt-0.5">未設定 {withoutType} 件</p>}
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">最多種別</p>
          <p className="text-sm font-bold text-slate-800">{typeCounts[0]?.label ?? '—'}</p>
          {typeCounts[0] && <p className="text-xs text-slate-400 mt-0.5">{typeCounts[0].count} 件</p>}
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">平均来場想定</p>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">
            {avgVisitors != null ? avgVisitors.toLocaleString() : '—'}
            {avgVisitors != null && <span className="text-sm font-normal text-slate-400"> 名</span>}
          </p>
        </div>
      </div>

      {/* 種別内訳 */}
      {typeCounts.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-3">イベント種別内訳</p>
          <div className="space-y-2">
            {typeCounts.map(({ key, label, count }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-28 shrink-0">{label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{ width: `${(count / events.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 tabular-nums w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="タイトル・メールで絞り込み"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 w-64"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          <option value="">種別: すべて</option>
          {Object.entries(EVENT_TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <span className="text-xs text-slate-400">{filtered.length} 件</span>
        <div className="flex-1" />
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-2.5 text-left text-xs text-slate-400 font-medium">タイトル</th>
                <th className="px-4 py-2.5 text-left text-xs text-slate-400 font-medium">種別</th>
                <th className="px-4 py-2.5 text-left text-xs text-slate-400 font-medium hidden sm:table-cell">会場</th>
                <th className="px-4 py-2.5 text-left text-xs text-slate-400 font-medium hidden md:table-cell">都道府県</th>
                <th className="px-4 py-2.5 text-right text-xs text-slate-400 font-medium hidden md:table-cell">来場想定</th>
                <th className="px-4 py-2.5 text-left text-xs text-slate-400 font-medium hidden lg:table-cell">開催日</th>
                <th className="px-4 py-2.5 text-left text-xs text-slate-400 font-medium hidden lg:table-cell">登録日</th>
                <th className="px-4 py-2.5 text-left text-xs text-slate-400 font-medium">ユーザー</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-xs">
                    該当するイベントがありません
                  </td>
                </tr>
              )}
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <a
                      href={`/events/${e.id}`}
                      className="text-slate-800 hover:text-purple-600 font-medium transition-colors"
                    >
                      {e.title}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {e.event_type ? (
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">
                        {EVENT_TYPE_LABELS[e.event_type] ?? e.event_type}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-500">未設定</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">
                    {e.venue_type ? (VENUE_TYPE_LABELS[e.venue_type] ?? e.venue_type) : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                    {e.prefecture ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 text-xs hidden md:table-cell">
                    {e.expected_visitors ? `${e.expected_visitors.toLocaleString()}名` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell tabular-nums">
                    {e.event_date ? new Date(e.event_date).toLocaleDateString('ja-JP') : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell tabular-nums">
                    {new Date(e.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-36">
                    {e.user_email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
