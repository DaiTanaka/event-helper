import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { loadLayout } from './actions'
import LayoutEditor from './LayoutEditor'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — 会場レイアウト | イベント開催ナビ` }
}

export default async function LayoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('id, title')
    .eq('id', id)
    .single()

  if (!event) notFound()

  const savedState = await loadLayout(id)

  return (
    <LayoutEditor
      eventId={id}
      eventTitle={event.title}
      initialState={savedState}
    />
  )
}
