'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createEvent(
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const title = (formData.get('title') as string).trim()
  if (!title) return { error: 'イベント名を入力してください' }

  const { data, error } = await supabase
    .from('events')
    .insert({
      user_id: user?.id ?? null,
      title,
      event_date: formData.get('event_date') || null,
      end_date: formData.get('end_date') || null,
      venue_name: formData.get('venue_name') || null,
      venue_address: formData.get('venue_address') || null,
      venue_access: formData.get('venue_access') || null,
      setup_date: formData.get('setup_date') || null,
      teardown_date: formData.get('teardown_date') || null,
      organizer: formData.get('organizer') || null,
      co_organizers: formData.get('co_organizers') || null,
      expected_visitors: formData.get('expected_visitors') ? Number(formData.get('expected_visitors')) : null,
      target_audience: formData.get('target_audience') || null,
      overview: formData.get('overview') || null,
      contact_name: formData.get('contact_name') || null,
      contact_phone: formData.get('contact_phone') || null,
      contact_email: formData.get('contact_email') || null,
      notes: formData.get('notes') || null,
      event_type: formData.get('event_type') || null,
      target_age: (formData.getAll('target_age') as string[]).length > 0 ? formData.getAll('target_age') as string[] : null,
      venue_type: formData.get('venue_type') || null,
      prefecture: formData.get('prefecture') || null,
      venue_map_url: formData.get('venue_map_url') || null,
      venue_meeting_place: formData.get('venue_meeting_place') || null,
      venue_meeting_time: formData.get('venue_meeting_time') || null,
      venue_entry: formData.get('venue_entry') || null,
      staff_dress_code: formData.get('staff_dress_code') || null,
    })
    .select('id')
    .single()

  if (error) return { error: `保存失敗: ${error.message}` }

  redirect(`/events/${data.id}`)
}
