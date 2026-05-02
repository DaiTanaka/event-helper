'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { EventTask } from '@/lib/types'
import { TEMPLATE_TASKS } from '@/lib/task-templates'
import { shiftDate } from '@/lib/shiftDate'

export async function addTask(
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const title = (formData.get('title') as string).trim()
  if (!title) return { error: 'タイトルを入力してください' }

  const { count } = await supabase
    .from('event_tasks')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  const { error } = await supabase.from('event_tasks').insert({
    event_id: eventId,
    title,
    description: formData.get('description') || null,
    status: 'todo',
    priority: formData.get('priority') || 'medium',
    assignee: formData.get('assignee') || null,
    start_date: formData.get('start_date') || null,
    due_date: formData.get('due_date') || null,
    sort_order: count ?? 0,
  })

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}/tasks`)
  return {}
}

export async function updateTask(
  taskId: string,
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const title = (formData.get('title') as string).trim()
  if (!title) return { error: 'タイトルを入力してください' }

  const { error } = await supabase
    .from('event_tasks')
    .update({
      title,
      description: formData.get('description') || null,
      status: formData.get('status') || 'todo',
      priority: formData.get('priority') || 'medium',
      assignee: formData.get('assignee') || null,
      start_date: formData.get('start_date') || null,
      due_date: formData.get('due_date') || null,
    })
    .eq('id', taskId)

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}/tasks`)
  return {}
}

export async function renameTask(
  taskId: string,
  eventId: string,
  title: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const t = title.trim()
  if (!t) return { error: 'タイトルを入力してください' }
  const { error } = await supabase.from('event_tasks').update({ title: t }).eq('id', taskId)
  if (error) return { error: error.message }
  revalidatePath(`/events/${eventId}/tasks`)
  return {}
}

export async function reorderTasks(
  eventId: string,
  tasks: { id: string; sort_order: number }[]
): Promise<void> {
  const supabase = await createClient()
  await Promise.all(
    tasks.map(({ id, sort_order }) =>
      supabase.from('event_tasks').update({ sort_order }).eq('id', id).eq('event_id', eventId)
    )
  )
  revalidatePath(`/events/${eventId}/tasks`)
}

export async function deleteTask(taskId: string, eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_tasks').delete().eq('id', taskId)
  revalidatePath(`/events/${eventId}/tasks`)
}

export async function setTaskStatus(
  taskId: string,
  eventId: string,
  status: EventTask['status'],
  _: FormData
): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_tasks').update({ status }).eq('id', taskId)
  revalidatePath(`/events/${eventId}/tasks`)
}

export async function addTasksFromTemplate(
  eventId: string,
  selectedIds: string[],
  customTitles: Record<string, string> = {}
): Promise<{ error?: string }> {
  if (selectedIds.length === 0) return {}

  const supabase = await createClient()

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('event_date')
    .eq('id', eventId)
    .single()

  if (eventError) return { error: eventError.message }

  const { count } = await supabase
    .from('event_tasks')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  const eventDateStr = event?.event_date ?? null

  const selected = TEMPLATE_TASKS.filter(t => selectedIds.includes(t.id))

  const rows = selected.map((t, i) => ({
    event_id: eventId,
    title: customTitles[t.id]?.trim() || t.title,
    priority: t.priority,
    status: 'todo' as const,
    start_date: eventDateStr && t.startDays != null ? shiftDate(eventDateStr, t.startDays) : null,
    due_date: eventDateStr && t.dueDays != null ? shiftDate(eventDateStr, t.dueDays) : null,
    sort_order: (count ?? 0) + i,
  }))

  const { error } = await supabase.from('event_tasks').insert(rows)
  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}/tasks`)
  return {}
}
