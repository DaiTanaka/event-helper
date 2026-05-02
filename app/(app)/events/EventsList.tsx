'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Event } from '@/lib/types'

const EVENT_TYPE_SHORT: Record<string, string> = {
  corporate_party:     '企業・社内',
  school_event:        '学校・教育',
  community_festival:  '地域・自治体',
  commercial_facility: '商業施設',
  sports:              'スポーツ',
  exhibition:          '展示会',
  other:               'その他',
}

export type EventWithCounts = Event & {
  event_schedules: { count: number }[]
  event_equipment: { count: number }[]
  event_tasks: { count: number }[]
  done_task_count?: number
}

function getDaysDiff(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function CountdownBadge({ dateStr }: { dateStr: string }) {
  const days = getDaysDiff(dateStr)
  if (days === 0)
    return <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full shrink-0">本日</span>
  if (days === 1)
    return <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full shrink-0">明日</span>
  if (days > 1 && days <= 7)
    return <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full shrink-0">あと{days}日</span>
  if (days > 7 && days <= 30)
    return <span className="px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-400 rounded-full shrink-0">あと{days}日</span>
  return <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 rounded-full shrink-0">あと{days}日</span>
}

function EventCard({ event, past = false, shared = false }: { event: EventWithCounts; past?: boolean; shared?: boolean }) {
  const scheduleCount = event.event_schedules?.[0]?.count ?? 0
  const equipmentCount = event.event_equipment?.[0]?.count ?? 0
  const taskCount = event.event_tasks?.[0]?.count ?? 0

  return (
    <Link
      href={`/events/${event.id}`}
      className={`group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all flex overflow-hidden ${
        past ? 'border-slate-200 opacity-75 hover:opacity-100' : 'border-slate-200 hover:border-orange-300'
      }`}
    >
      {/* 左アクセントバー */}
      <div className={`w-1 shrink-0 ${past ? 'bg-slate-200' : 'bg-orange-500'}`} />

      <div className="flex-1 p-4 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors truncate">
                {event.title}
              </h2>
              {!past && event.event_date && <CountdownBadge dateStr={event.event_date} />}
              {past && (
                <span className="px-2 py-0.5 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-full shrink-0">終了</span>
              )}
              {shared && (
                <span className="px-2 py-0.5 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-full shrink-0 flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  共有
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
              {event.event_type && (
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium shrink-0">
                  {EVENT_TYPE_SHORT[event.event_type] ?? event.event_type}
                </span>
              )}
              {event.event_date && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.event_date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {event.end_date && event.end_date !== event.event_date && (
                    <> 〜 {new Date(event.end_date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}</>
                  )}
                </span>
              )}
              {event.venue_name && (
                <span className="flex items-center gap-1 truncate">
                  <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.venue_name}
                </span>
              )}
            </div>
          </div>

          <span className="text-xs text-slate-400 group-hover:text-orange-400 shrink-0 transition-colors whitespace-nowrap">
            詳しく見る →
          </span>
        </div>

        {(scheduleCount > 0 || equipmentCount > 0 || taskCount > 0 || event.total_budget != null) && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
            {event.total_budget != null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 text-xs rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ¥{event.total_budget.toLocaleString()}
              </span>
            )}
            {scheduleCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-xs rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                スケジュール {scheduleCount}件
              </span>
            )}
            {taskCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                タスク {event.done_task_count ?? 0}/{taskCount}
              </span>
            )}
            {equipmentCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 text-xs rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                備品 {equipmentCount}件
              </span>
            )}
            </div>
            {taskCount > 0 && (
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>タスク進捗</span>
                  <span>{Math.round(((event.done_task_count ?? 0) / taskCount) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.round(((event.done_task_count ?? 0) / taskCount) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function EventsList({
  upcoming,
  past,
  sharedEventIds = [],
}: {
  upcoming: EventWithCounts[]
  past: EventWithCounts[]
  sharedEventIds?: string[]
}) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const usedTypes = Array.from(
    new Set([...upcoming, ...past].map(e => e.event_type).filter(Boolean) as string[])
  )

  function filter(events: EventWithCounts[]) {
    return events.filter(e => {
      if (typeFilter && e.event_type !== typeFilter) return false
      const q = query.trim().toLowerCase()
      if (!q) return true
      return (
        e.title.toLowerCase().includes(q) ||
        (e.venue_name ?? '').toLowerCase().includes(q) ||
        (e.organizer ?? '').toLowerCase().includes(q)
      )
    })
  }

  const filteredUpcoming = filter(upcoming)
  const filteredPast = filter(past)
  const noResults = (query.trim() || typeFilter) && filteredUpcoming.length === 0 && filteredPast.length === 0

  return (
    <div className="space-y-4">
      {(upcoming.length + past.length) >= 3 && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="イベント名・会場名・主催者で検索..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm"
            />
          </div>
          {usedTypes.length > 1 && (
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="shrink-0 px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-600"
            >
              <option value="">種別: すべて</option>
              {usedTypes.map(t => (
                <option key={t} value={t}>{EVENT_TYPE_SHORT[t] ?? t}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {noResults ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-400 shadow-sm">
          「{query}」に一致するイベントはありません
        </div>
      ) : (
        <div className="space-y-8">
          {filteredUpcoming.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">今後のイベント</h2>
                <span className="text-xs text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full shadow-sm">{filteredUpcoming.length}件</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredUpcoming.map(event => (
                  <EventCard key={event.id} event={event} shared={sharedEventIds.includes(event.id)} />
                ))}
              </div>
            </div>
          )}

          {filteredPast.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">過去のイベント</h2>
                <span className="text-xs text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full shadow-sm">{filteredPast.length}件</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPast.map(event => (
                  <EventCard key={event.id} event={event} past shared={sharedEventIds.includes(event.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
