import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Event, EventSchedule } from '@/lib/types'
import ScheduleSection from '../ScheduleSection'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — タイムスケジュール | イベント開催ナビ` }
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: schedules }] = await Promise.all([
    supabase.from('events').select('id, title, event_type, event_date, end_date').eq('id', id).single(),
    supabase.from('event_schedules').select('*').eq('event_id', id).order('day_number').order('sort_order'),
  ])

  if (!event) notFound()

  const e = event as Event
  const scheduleList = (schedules ?? []) as EventSchedule[]

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) : null

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/events/${id}`}
        className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-4"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {e.title}
      </Link>

      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">タイムスケジュール</h1>
          {e.event_date && (
            <p className="text-sm text-slate-500 mt-0.5">
              開催日: {formatDate(e.event_date)}
              {e.end_date && e.end_date !== e.event_date && <> 〜 {formatDate(e.end_date)}</>}
            </p>
          )}
        </div>
        <Link href="/features/timeline" target="_blank" className="text-xs text-orange-500 hover:text-orange-600 border border-orange-200 rounded-lg px-2.5 py-1.5 whitespace-nowrap shrink-0 transition-colors">
          💡 進行表ガイド
        </Link>
      </div>

      <ScheduleSection eventId={id} schedules={scheduleList} eventType={e.event_type} />
    </div>
  )
}
