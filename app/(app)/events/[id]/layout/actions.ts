'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { CanvasState } from '@/lib/layout-types'
import { generateThumbnail } from '@/lib/thumbnail'

export async function saveLayout(
  eventId: string,
  state: CanvasState
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data: existing, error: selectError } = await supabase
    .from('venue_layouts')
    .select('id')
    .eq('event_id', eventId)
    .maybeSingle()

  if (selectError) return { error: selectError.message }

  const thumbnail = generateThumbnail(state)
  const payload = {
    room_width: state.roomWidth,
    room_height: state.roomHeight,
    grid_size: state.gridSize,
    items: state.items,
    thumbnail,
  }

  let error
  if (existing) {
    ;({ error } = await supabase.from('venue_layouts').update(payload).eq('event_id', eventId))
  } else {
    ;({ error } = await supabase.from('venue_layouts').insert({ event_id: eventId, ...payload }))
  }

  if (error) return { error: error.message }
  return {}
}

export async function clearLayout(eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('venue_layouts').delete().eq('event_id', eventId)
  redirect(`/events/${eventId}`)
}

export async function loadLayout(eventId: string): Promise<CanvasState | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('venue_layouts')
    .select('*')
    .eq('event_id', eventId)
    .maybeSingle()

  if (!data) return null

  return {
    roomWidth: data.room_width,
    roomHeight: data.room_height,
    gridSize: data.grid_size ?? 0,
    snapEnabled: true,
    items: (data.items as CanvasState['items']) ?? [],
  }
}
