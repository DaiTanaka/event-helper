import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Event, EventSchedule, EventEquipment, EventContact, EventQA, EventMember, EventInvitation, EventReport } from '@/lib/types'
import { EVENT_TYPES, TARGET_AGES, VENUE_TYPES } from '@/lib/eventFields'
import EventDetailClient from './EventDetailClient'
import ShareModal from './ShareModal'
import OverviewSection from './OverviewSection'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} | イベント開催ナビ` }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: event },
    { data: schedules },
    { data: equipment },
    { data: layout },
    { data: contacts },
    { data: qaItems },
    { data: taskStatuses },
    { data: contentStatuses },
    { data: members },
    { data: invitations },
    { data: report },
  ] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('event_schedules').select('*').eq('event_id', id).order('day_number').order('sort_order'),
    supabase.from('event_equipment').select('*').eq('event_id', id).order('category').order('sort_order'),
    supabase.from('venue_layouts').select('thumbnail, items').eq('event_id', id).maybeSingle(),
    supabase.from('event_contacts').select('*').eq('event_id', id).order('sort_order'),
    supabase.from('event_qa').select('*').eq('event_id', id).order('sort_order'),
    supabase.from('event_tasks').select('status').eq('event_id', id),
    supabase.from('event_contents').select('status').eq('event_id', id),
    supabase.from('event_members').select('*').eq('event_id', id).order('created_at'),
    supabase.from('event_invitations').select('*').eq('event_id', id).order('created_at', { ascending: false }),
    supabase.from('event_reports').select('id').eq('event_id', id).maybeSingle(),
  ])

  if (!event) notFound()

  const e = event as Event
  const scheduleList = (schedules ?? []) as EventSchedule[]
  const equipmentList = (equipment ?? []) as EventEquipment[]
  const contactList = (contacts ?? []) as EventContact[]
  const qaList = (qaItems ?? []) as EventQA[]
  const totalTasks = taskStatuses?.length ?? 0
  const doneTasks = taskStatuses?.filter(t => t.status === 'done').length ?? 0
  const totalContents = contentStatuses?.length ?? 0
  const confirmedContents = contentStatuses?.filter(c => c.status === 'confirmed').length ?? 0
  const memberList = (members ?? []) as EventMember[]
  const invitationList = (invitations ?? []) as EventInvitation[]
  const isOwner = !!user && e.user_id === user.id
  const hasReport = !!(report as EventReport | null)

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) : null

  const eventTypeLabel = e.event_type ? (EVENT_TYPES.find(t => t.value === e.event_type)?.label ?? e.event_type) : null
  const venueTypeLabel = e.venue_type ? (VENUE_TYPES.find(t => t.value === e.venue_type)?.label ?? e.venue_type) : null

  // Primary: information the user needs at a glance
  const primaryRows = [
    { label: '概要', value: e.overview },
    {
      label: '会場',
      value: e.venue_name ? (
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span>{e.venue_name}</span>
          {e.venue_address && <span className="text-slate-400 text-xs">{e.venue_address}</span>}
          {e.venue_map_url && (
            <a
              href={e.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-600 font-medium whitespace-nowrap"
            >
              地図 ↗
            </a>
          )}
        </span>
      ) : null,
    },
    { label: '主催', value: e.organizer },
    {
      label: '担当者',
      value: e.contact_name ? (
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span>{e.contact_name}</span>
          {e.contact_phone && <span className="text-slate-400 text-xs">{e.contact_phone}</span>}
          {e.contact_email && <span className="text-slate-400 text-xs">{e.contact_email}</span>}
        </span>
      ) : null,
    },
  ].filter(row => row.value)

  // Secondary: operational/analytics data — visible on demand
  const secondaryRows = [
    { label: 'アクセス・搬入口', value: e.venue_access },
    { label: '入館・入場方法', value: e.venue_entry },
    { label: 'イベント種別', value: eventTypeLabel },
    {
      label: 'ターゲット年齢',
      value: e.target_age && e.target_age.length > 0 ? (
        <span className="flex flex-wrap gap-1">
          {e.target_age.map(v => {
            const found = TARGET_AGES.find(t => t.value === v)
            return (
              <span key={v} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-orange-50 text-orange-700 border border-orange-100">
                {found?.label ?? v}
              </span>
            )
          })}
        </span>
      ) : null,
    },
    { label: 'ターゲット層', value: e.target_audience },
    { label: '来場想定', value: e.expected_visitors ? `${e.expected_visitors.toLocaleString()}名` : null },
    { label: '会場タイプ', value: venueTypeLabel },
    { label: '都道府県', value: e.prefecture },
    { label: '共催・協力', value: e.co_organizers },
    { label: '備考', value: e.notes },
  ].filter(row => row.value)

  const hasStaffBriefing = !!(e.venue_meeting_place || e.venue_meeting_time || e.staff_dress_code)

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href="/events" className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-slate-800 truncate">{e.title}</h1>
          {e.event_date && (
            <p className="text-sm text-slate-400 mt-0.5">
              {formatDate(e.event_date)}
              {e.end_date && e.end_date !== e.event_date && <> 〜 {formatDate(e.end_date)}</>}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 no-print">
          {user && (
            <ShareModal
              eventId={id}
              eventTitle={e.title}
              members={memberList}
              invitations={invitationList}
              isOwner={isOwner}
            />
          )}
        </div>
      </div>

      {/* イベント種別未入力の警告 */}
      {!e.event_type && isOwner && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
          <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="text-amber-700">
            イベント種別が未入力です。
            <Link href={`/events/${id}/edit`} className="underline ml-1 hover:text-amber-800">編集画面で設定してください。</Link>
          </span>
        </div>
      )}

      {/* 準備チェックリスト（オーナーのみ・未完了項目がある場合のみ表示） */}
      {isOwner && (() => {
        const checks: { label: string; done: boolean; href?: string }[] = [
          { label: '開催日',         done: !!e.event_date,            href: `/events/${id}/edit` },
          { label: '会場名',         done: !!e.venue_name,            href: `/events/${id}/edit` },
          { label: 'スケジュール',   done: scheduleList.length > 0 },
          { label: '備品リスト',     done: equipmentList.length > 0 },
          { label: 'スタッフ連絡先', done: contactList.length > 0 },
          { label: 'Q&A集',          done: qaList.length > 0 },
          { label: 'タスク',         done: totalTasks > 0,            href: `/events/${id}/tasks` },
          { label: '予算設定',       done: !!e.total_budget,          href: `/events/${id}/budget` },
        ]
        const doneCount = checks.filter(c => c.done).length
        if (doneCount === checks.length) return null
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden no-print">
            <div className="px-6 py-3 border-b border-slate-50 flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">準備チェック</h2>
              <span className="text-xs text-slate-400">{doneCount}/{checks.length} 完了</span>
            </div>
            <div className="px-6 py-1.5">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3 mt-2">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all"
                  style={{ width: `${Math.round((doneCount / checks.length) * 100)}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2 pb-4">
                {checks.map(({ label, done, href }) =>
                  done ? null : href ? (
                    <Link
                      key={label}
                      href={href}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                    >
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      {label}未入力 →
                    </Link>
                  ) : (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500"
                    >
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      {label}未登録
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* 開催概要 */}
      <OverviewSection
        primary={primaryRows}
        secondary={secondaryRows}
        editHref={(isOwner || !e.user_id) ? `/events/${id}/edit` : undefined}
      />

      {/* スタッフ当日案内 */}
      {hasStaffBriefing && (
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-3.5 border-b border-slate-50 flex items-center gap-2">
            <div className="w-5 h-5 bg-teal-50 rounded-md flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">スタッフ当日案内</h2>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {e.venue_meeting_place && (
                <div>
                  <dt className="text-xs text-slate-400 mb-0.5">集合場所</dt>
                  <dd className="text-sm font-medium text-slate-800">{e.venue_meeting_place}</dd>
                </div>
              )}
              {e.venue_meeting_time && (
                <div>
                  <dt className="text-xs text-slate-400 mb-0.5">集合時間</dt>
                  <dd className="text-sm font-medium text-slate-800">{e.venue_meeting_time}</dd>
                </div>
              )}
              {e.staff_dress_code && (
                <div className={(!e.venue_meeting_place && !e.venue_meeting_time) ? '' : 'col-span-2 sm:col-span-1'}>
                  <dt className="text-xs text-slate-400 mb-0.5">服装・ユニフォーム</dt>
                  <dd className="text-sm text-slate-700">{e.staff_dress_code}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      )}

      {/* 機能グリッド + 展開セクション */}
      <EventDetailClient
        eventId={id}
        eventType={e.event_type}
        schedules={scheduleList}
        equipment={equipmentList}
        contacts={contactList}
        qaList={qaList}
        layoutThumbnail={layout?.thumbnail ?? null}
        totalTasks={totalTasks}
        doneTasks={doneTasks}
        totalContents={totalContents}
        confirmedContents={confirmedContents}
        totalBudget={e.total_budget}
        hasReport={hasReport}
      />
    </div>
  )
}
