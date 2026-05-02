'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getEventOwner(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('events').select('user_id').eq('id', eventId).single()
  if (!data || data.user_id !== user.id) return null
  return { supabase, userId: user.id }
}

export async function updateTotalBudget(eventId: string, totalBudget: number | null) {
  const ctx = await getEventOwner(eventId)
  if (!ctx) return { error: '権限がありません' }
  await ctx.supabase.from('events').update({ total_budget: totalBudget }).eq('id', eventId)
  revalidatePath(`/events/${eventId}/budget`)
  return {}
}

export async function addBudgetItem(eventId: string, data: {
  category: string
  name: string
  quantity: number
  unit_price: number
  actual_price: number | null
  notes: string
}) {
  const ctx = await getEventOwner(eventId)
  if (!ctx) return { error: '権限がありません' }
  const { data: existing } = await ctx.supabase
    .from('event_budget_items').select('sort_order').eq('event_id', eventId).order('sort_order', { ascending: false }).limit(1)
  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1
  const { error } = await ctx.supabase.from('event_budget_items').insert({
    event_id: eventId, ...data, sort_order: nextOrder,
  })
  if (error) return { error: error.message }
  revalidatePath(`/events/${eventId}/budget`)
  return {}
}

export async function updateBudgetItem(id: string, eventId: string, data: {
  category: string
  name: string
  quantity: number
  unit_price: number
  actual_price: number | null
  notes: string
}) {
  const ctx = await getEventOwner(eventId)
  if (!ctx) return { error: '権限がありません' }
  const { error } = await ctx.supabase.from('event_budget_items').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/events/${eventId}/budget`)
  return {}
}

export async function deleteBudgetItem(id: string, eventId: string) {
  const ctx = await getEventOwner(eventId)
  if (!ctx) return { error: '権限がありません' }
  await ctx.supabase.from('event_budget_items').delete().eq('id', id)
  revalidatePath(`/events/${eventId}/budget`)
  return {}
}
