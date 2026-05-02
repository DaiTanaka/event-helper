import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Event, EventContent, EventBudgetItem } from '@/lib/types'
import BudgetClient from './BudgetClient'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — 予算管理 | イベント開催ナビ` }
}

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: contents }, { data: budgetItems }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('event_contents').select('*').eq('event_id', id).order('sort_order'),
    supabase.from('event_budget_items').select('*').eq('event_id', id).order('sort_order'),
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">予算管理</h1>
          <p className="text-sm text-slate-400 mt-0.5">{(event as Event).title}</p>
        </div>
        <Link href="/features/budget" target="_blank" className="text-xs text-orange-500 hover:text-orange-600 border border-orange-200 rounded-lg px-2.5 py-1.5 whitespace-nowrap shrink-0 transition-colors">
          💡 予算管理ガイド
        </Link>
      </div>
      <BudgetClient
        event={event as Event}
        contents={(contents ?? []) as EventContent[]}
        budgetItems={(budgetItems ?? []) as EventBudgetItem[]}
      />
    </div>
  )
}
