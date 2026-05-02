import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import EventsList, { type EventWithCounts } from './EventsList'
import NewsFeed from './NewsFeed'
import DownloadResources from './DownloadResources'
import FeaturedArticles from './FeaturedArticles'
import EventHints from './EventHints'

export const metadata: Metadata = {
  title: 'イベント一覧 | イベント開催ナビ',
}

function NewsFeedSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="px-4 py-3 border-b border-slate-100 h-10 bg-slate-50" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-slate-50 space-y-1.5">
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
          <div className="h-2.5 bg-slate-100 rounded w-16 mt-0.5" />
        </div>
      ))}
    </div>
  )
}

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let events: EventWithCounts[] = []
  if (user) {
    // 自分がオーナーのイベント
    const { data: ownedEvents } = await supabase
      .from('events')
      .select('*, event_schedules(count), event_equipment(count), event_tasks(count)')
      .eq('user_id', user.id)
      .is('deleted_at', null)

    // 自分がメンバーとして招待されたイベント
    const { data: memberRows } = await supabase
      .from('event_members')
      .select('event_id')
      .eq('user_id', user.id)

    const memberEventIds = (memberRows ?? []).map(r => r.event_id)

    let sharedEvents: EventWithCounts[] = []
    if (memberEventIds.length > 0) {
      const { data } = await supabase
        .from('events')
        .select('*, event_schedules(count), event_equipment(count), event_tasks(count)')
        .in('id', memberEventIds)
        .is('deleted_at', null)
      sharedEvents = (data ?? []) as EventWithCounts[]
    }

    // 重複を排除してマージ
    const ownedIds = new Set((ownedEvents ?? []).map(e => e.id))
    const deduped = sharedEvents.filter(e => !ownedIds.has(e.id))
    events = [...(ownedEvents ?? []), ...deduped] as EventWithCounts[]
  }

  // タスク完了数を取得
  const eventIds = events.map(e => e.id)
  if (eventIds.length > 0) {
    const { data: doneTasks } = await supabase
      .from('event_tasks')
      .select('event_id')
      .in('event_id', eventIds)
      .eq('status', 'done')
    const doneCountByEvent = new Map<string, number>()
    for (const task of doneTasks ?? []) {
      doneCountByEvent.set(task.event_id, (doneCountByEvent.get(task.event_id) ?? 0) + 1)
    }
    events = events.map(e => ({ ...e, done_task_count: doneCountByEvent.get(e.id) ?? 0 }))
  }

  const sharedEventIds = events
    .filter(e => e.user_id !== user?.id)
    .map(e => e.id)

  const todayStr = new Date().toISOString().slice(0, 10)

  const upcoming = events
    .filter(e => !e.event_date || e.event_date >= todayStr)
    .sort((a, b) => {
      if (!a.event_date) return 1
      if (!b.event_date) return -1
      return a.event_date.localeCompare(b.event_date)
    })

  const past = events
    .filter(e => e.event_date && e.event_date < todayStr)
    .sort((a, b) => b.event_date!.localeCompare(a.event_date!))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

      {/* ── メイン：イベント一覧 ── */}
      <div>
        <EventHints />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">イベント一覧</h1>
            {!user && (
              <p className="text-sm text-slate-500 mt-0.5">
                <Link href="/login" className="text-orange-500 hover:underline">ログイン</Link>するとイベントを保存・管理できます
              </p>
            )}
          </div>
          <Link
            href="/events/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規作成
          </Link>
        </div>

        {!user ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">イベントを作成しましょう</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
              スケジュール・備品リスト・運営マニュアルをまとめて管理。印刷もかんたん。
            </p>
            <Link
              href="/events/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
            >
              無料で始める
            </Link>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <p className="text-slate-500 text-sm mb-4">まだイベントがありません</p>
            <Link
              href="/events/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
            >
              最初のイベントを作成
            </Link>
          </div>
        ) : (
          <EventsList upcoming={upcoming} past={past} sharedEventIds={sharedEventIds} />
        )}
      </div>

      {/* ── サイドバー：情報 ── */}
      <aside className="space-y-5 lg:sticky lg:top-20">

        {/* 特集記事 */}
        <FeaturedArticles />

        {/* ニュース */}
        <Suspense fallback={<NewsFeedSkeleton />}>
          <NewsFeed />
        </Suspense>

        {/* ダウンロード素材 */}
        <DownloadResources />

        {/* ピコトンバナー */}
        <Link
          href="https://workshop.picoton.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-white rounded-2xl border border-slate-200 p-4 hover:border-orange-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">ワークショッププログラム</p>
              <p className="text-xs font-semibold text-slate-700 leading-snug">イベント向けコンテンツは<br />ピコトンにご相談ください</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-orange-400 shrink-0 mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">workshop.picoton.com</p>
        </Link>
      </aside>

    </div>
  )
}
