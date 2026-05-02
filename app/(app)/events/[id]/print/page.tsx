import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Event, EventSchedule, EventEquipment, EventContact, EventQA, EventTask, EventBudgetItem } from '@/lib/types'
import PrintClient from './PrintClient'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — 印刷プレビュー | イベント開催ナビ` }
}

export default async function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: event },
    { data: schedules },
    { data: equipment },
    { data: contacts },
    { data: qaItems },
    { data: layout },
    { data: taskItems },
    { data: budgetItems },
  ] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('event_schedules').select('*').eq('event_id', id).order('day_number').order('sort_order'),
    supabase.from('event_equipment').select('*').eq('event_id', id).order('category').order('sort_order'),
    supabase.from('event_contacts').select('*').eq('event_id', id).order('sort_order'),
    supabase.from('event_qa').select('*').eq('event_id', id).order('sort_order'),
    supabase.from('venue_layouts').select('thumbnail').eq('event_id', id).maybeSingle(),
    supabase.from('event_tasks').select('*').eq('event_id', id).order('due_date', { ascending: true, nullsFirst: false }).order('sort_order'),
    supabase.from('event_budget_items').select('*').eq('event_id', id).order('sort_order'),
  ])

  if (!event) notFound()

  return (
    <PrintClient
      event={event as Event}
      schedules={(schedules ?? []) as EventSchedule[]}
      equipment={(equipment ?? []) as EventEquipment[]}
      contacts={(contacts ?? []) as EventContact[]}
      qaList={(qaItems ?? []) as EventQA[]}
      tasks={(taskItems ?? []) as EventTask[]}
      budgetItems={(budgetItems ?? []) as EventBudgetItem[]}
      layoutThumbnail={layout?.thumbnail ?? null}
    />
  )
}
