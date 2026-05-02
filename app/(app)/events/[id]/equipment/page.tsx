import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Event, EventEquipment } from '@/lib/types'
import type { LayoutItem } from '@/lib/layout-types'
import EquipmentSection from '../EquipmentSection'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — 備品リスト | イベント開催ナビ` }
}

function aggregateLayoutItems(items: LayoutItem[] | null): { label: string; count: number }[] {
  if (!items) return []
  const counts = new Map<string, number>()
  for (const item of items) {
    if (item.shape === 'person') continue
    const label = (item.label ?? '').trim()
    if (!label) continue
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: equipment }, { data: layout }] = await Promise.all([
    supabase.from('events').select('id, title, event_type').eq('id', id).single(),
    supabase.from('event_equipment').select('*').eq('event_id', id).order('category').order('sort_order'),
    supabase.from('venue_layouts').select('items').eq('event_id', id).maybeSingle(),
  ])

  if (!event) notFound()

  const e = event as Event
  const equipmentList = (equipment ?? []) as EventEquipment[]
  const layoutSuggestions = aggregateLayoutItems(layout?.items as LayoutItem[] | null)

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
          <h1 className="text-xl font-bold text-slate-800">備品リスト</h1>
          {equipmentList.length > 0 && (
            <p className="text-sm text-slate-500 mt-0.5">
              {equipmentList.filter(eq => eq.checked).length}/{equipmentList.length} 件確認済み
            </p>
          )}
        </div>
        <Link href="/features/equipment" target="_blank" className="text-xs text-orange-500 hover:text-orange-600 border border-orange-200 rounded-lg px-2.5 py-1.5 whitespace-nowrap shrink-0 transition-colors">
          💡 備品リストガイド
        </Link>
      </div>

      <EquipmentSection
        eventId={id}
        equipment={equipmentList}
        layoutSuggestions={layoutSuggestions}
        eventType={e.event_type}
      />
    </div>
  )
}
