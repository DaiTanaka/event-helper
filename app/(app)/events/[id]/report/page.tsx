import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Event, EventContent, EventBudgetItem, EventReport } from '@/lib/types'
import ReportClient from './ReportClient'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — 実施報告書 | イベント開催ナビ` }
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: contents }, { data: budgetItems }, { data: report }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('event_contents').select('*').eq('event_id', id).order('sort_order'),
    supabase.from('event_budget_items').select('*').eq('event_id', id).order('sort_order'),
    supabase.from('event_reports').select('*').eq('event_id', id).maybeSingle(),
  ])

  if (!event) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/events/${id}`} className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          イベント詳細に戻る
        </Link>
      </div>
      <div>
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <h1 className="text-xl font-bold text-slate-800">実施報告書</h1>
          <Link href="/features/survey" className="text-xs text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full hover:bg-orange-100 transition-colors">
            💡 アンケートの作り方
          </Link>
        </div>
        <p className="text-sm text-slate-400 mt-0.5">{(event as Event).title}</p>
      </div>
      <ReportClient
        event={event as Event}
        contents={(contents ?? []) as EventContent[]}
        budgetItems={(budgetItems ?? []) as EventBudgetItem[]}
        report={report as EventReport | null}
      />
    </div>
  )
}
