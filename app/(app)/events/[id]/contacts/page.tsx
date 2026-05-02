import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Event, EventContact } from '@/lib/types'
import ContactsSection from '../ContactsSection'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — スタッフ連絡先 | イベント開催ナビ` }
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: contacts }] = await Promise.all([
    supabase.from('events').select('id, title, event_type').eq('id', id).single(),
    supabase.from('event_contacts').select('*').eq('event_id', id).order('sort_order'),
  ])

  if (!event) notFound()

  const e = event as Event
  const contactList = (contacts ?? []) as EventContact[]

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

      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <h1 className="text-xl font-bold text-slate-800">スタッフ連絡先</h1>
          <Link href="/features/staff" className="text-xs text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full hover:bg-orange-100 transition-colors">
            💡 スタッフ役割分担ガイド
          </Link>
        </div>
        {contactList.length > 0 && (
          <p className="text-sm text-slate-500 mt-0.5">{contactList.length}件登録済み</p>
        )}
      </div>

      <ContactsSection eventId={id} contacts={contactList} eventType={e.event_type} />
    </div>
  )
}
