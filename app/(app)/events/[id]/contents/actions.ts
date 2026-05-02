'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addContent(
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const title = (formData.get('title') as string | null)?.trim()
  if (!title) return { error: 'コンテンツ名を入力してください' }

  const { count } = await supabase
    .from('event_contents').select('*', { count: 'exact', head: true }).eq('event_id', eventId)

  const { error } = await supabase.from('event_contents').insert({
    event_id: eventId,
    catalog_id: formData.get('catalog_id') || null,
    title,
    category: formData.get('category') || null,
    company_name: formData.get('company_name') || null,
    estimated_cost: formData.get('estimated_cost') ? Number(formData.get('estimated_cost')) : null,
    actual_cost: null,
    status: 'considering',
    notes: formData.get('notes') || null,
    url: formData.get('url') || null,
    og_image_url: formData.get('og_image_url') || null,
    sort_order: count ?? 0,
  })

  if (error) return { error: error.message }
  revalidatePath(`/events/${eventId}/contents`)
  return {}
}

export async function updateContent(
  contentId: string,
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const title = (formData.get('title') as string | null)?.trim()
  if (!title) return { error: 'コンテンツ名を入力してください' }

  const { error } = await supabase.from('event_contents').update({
    title,
    category: formData.get('category') || null,
    company_name: formData.get('company_name') || null,
    estimated_cost: formData.get('estimated_cost') ? Number(formData.get('estimated_cost')) : null,
    actual_cost: formData.get('actual_cost') ? Number(formData.get('actual_cost')) : null,
    status: formData.get('status') as 'considering' | 'confirmed' | 'cancelled',
    cancel_reason: formData.get('cancel_reason') as string | null || null,
    notes: formData.get('notes') || null,
    url: formData.get('url') || null,
    og_image_url: formData.get('og_image_url') || null,
  }).eq('id', contentId)

  if (error) return { error: error.message }
  revalidatePath(`/events/${eventId}/contents`)
  return {}
}

export async function deleteContent(contentId: string, eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_contents').delete().eq('id', contentId)
  revalidatePath(`/events/${eventId}/contents`)
}

export async function setContentStatus(
  contentId: string, eventId: string,
  status: 'considering' | 'confirmed' | 'cancelled', _: FormData
): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_contents').update({ status }).eq('id', contentId)
  revalidatePath(`/events/${eventId}/contents`)
}

export async function cancelContent(
  contentId: string,
  eventId: string,
  cancelReason: string | null,
): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_contents').update({
    status: 'cancelled',
    cancel_reason: cancelReason,
  }).eq('id', contentId)
  revalidatePath(`/events/${eventId}/contents`)
}

export async function addContentFromCatalog(
  eventId: string,
  catalogId: string,
  title: string,
  category: string,
  company_name: string,
  estimated_cost: number | null,
  url?: string,
  og_image_url?: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('event_contents').select('*', { count: 'exact', head: true }).eq('event_id', eventId)

  const { error } = await supabase.from('event_contents').insert({
    event_id: eventId,
    catalog_id: catalogId,
    title,
    category,
    company_name,
    estimated_cost,
    status: 'considering',
    url: url ?? null,
    og_image_url: og_image_url ?? null,
    sort_order: count ?? 0,
  })

  if (error) return { error: error.message }
  revalidatePath(`/events/${eventId}/contents`)
  return {}
}

export async function fetchUrlMeta(url: string): Promise<{
  title?: string
  imageUrl?: string
  error?: string
}> {
  try {
    new URL(url)
  } catch {
    return { error: '無効なURLです' }
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EventHelperBot/1.0)' },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow',
    })
    if (!res.ok) return { error: `取得失敗 (${res.status})` }
    const html = await res.text()

    const pick = (...patterns: RegExp[]) => {
      for (const p of patterns) { const m = html.match(p); if (m?.[1]) return m[1].trim() }
      return undefined
    }

    const imageUrl = pick(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    )
    const title = pick(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
      /<title[^>]*>([^<]+)<\/title>/i,
    )

    // Make relative image URLs absolute
    let absImage = imageUrl
    if (imageUrl && !imageUrl.startsWith('http')) {
      try { absImage = new URL(imageUrl, url).href } catch { absImage = undefined }
    }

    return { title, imageUrl: absImage }
  } catch (e) {
    return { error: `取得エラー: ${e instanceof Error ? e.message : '不明'}` }
  }
}
