import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditForm from './EditForm'
import type { Event } from '@/lib/types'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — 編集 | イベント開催ナビ` }
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">開催概要を編集</h1>
      </div>
      <EditForm event={event as Event} />
    </div>
  )
}
