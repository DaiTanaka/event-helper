'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveReport(eventId: string, data: {
  actual_visitors: number | null
  total_revenue: number | null
  total_expense: number | null
  summary: string
  highlights: string
  improvements: string
  next_actions: string
  satisfaction_score: number | null
  weather: string
  report_date: string
  content_score: number | null
  venue_score: number | null
  operation_score: number | null
  attendance_rate: number | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '権限がありません' }

  const { data: event } = await supabase.from('events').select('user_id').eq('id', eventId).single()
  if (!event || event.user_id !== user.id) return { error: '権限がありません' }

  const payload = {
    event_id: eventId,
    ...data,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('event_reports').upsert(payload, { onConflict: 'event_id' })
  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}/report`)
  return {}
}
