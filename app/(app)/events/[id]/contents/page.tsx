import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Event, EventContent } from '@/lib/types'
import type { CatalogItem } from '@/lib/catalog'
import { CATALOG } from '@/lib/catalog'
import ContentsClient from './ContentsClient'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — コンテンツ管理 | イベント開催ナビ` }
}

export default async function ContentsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: contents }, { data: dbCatalog }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('event_contents').select('*').eq('event_id', id).order('sort_order'),
    supabase.from('catalog_items').select('*').eq('active', true).order('sort_order'),
  ])

  if (!event) notFound()

  const today = new Date().toISOString().split('T')[0]

  const catalogItems: CatalogItem[] = dbCatalog?.length
    ? dbCatalog
        .filter(r => {
          const startOk = !r.display_start_date || r.display_start_date <= today
          const endOk = !r.display_end_date || r.display_end_date >= today
          return startOk && endOk
        })
        .map(r => ({
          id: r.id, title: r.title, category: r.category, company_name: r.company_name,
          price_from: r.price_from, price_to: r.price_to, description: r.description,
          tags: r.tags ?? [], isPiqton: r.is_piqton, isAd: r.is_ad,
          contact_url: r.contact_url ?? undefined,
          url: r.url ?? undefined,
          og_image_url: r.og_image_url ?? undefined,
        }))
    : CATALOG

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
        <h1 className="text-xl font-bold text-slate-800">コンテンツ管理</h1>
        <p className="text-sm text-slate-400 mt-0.5">{(event as Event).title}</p>
      </div>
      <ContentsClient
        event={event as Event}
        contents={(contents ?? []) as EventContent[]}
        catalogItems={catalogItems}
      />
    </div>
  )
}
