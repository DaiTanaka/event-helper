'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { swapByDirection } from '@/lib/reorder'
import { QA_TEMPLATE_GROUPS } from '@/lib/qa-templates'
import { TIMETABLE_TEMPLATES } from '@/lib/timetable-templates'
import { CONTACT_TEMPLATE_GROUPS } from '@/lib/contact-templates'
import { EQUIPMENT_TEMPLATE_GROUPS } from '@/lib/equipment-template-groups'

export async function updateEvent(
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .update({
      title: (formData.get('title') as string).trim(),
      event_date: formData.get('event_date') || null,
      end_date: formData.get('end_date') || null,
      venue_name: formData.get('venue_name') || null,
      venue_address: formData.get('venue_address') || null,
      organizer: formData.get('organizer') || null,
      co_organizers: formData.get('co_organizers') || null,
      expected_visitors: formData.get('expected_visitors') ? Number(formData.get('expected_visitors')) : null,
      target_audience: formData.get('target_audience') || null,
      overview: formData.get('overview') || null,
      contact_name: formData.get('contact_name') || null,
      contact_phone: formData.get('contact_phone') || null,
      contact_email: formData.get('contact_email') || null,
      notes: formData.get('notes') || null,
      setup_date: formData.get('setup_date') || null,
      teardown_date: formData.get('teardown_date') || null,
      venue_access: formData.get('venue_access') || null,
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
    .eq('id', eventId)

  if (error) return { error: error.message }

  redirect(`/events/${eventId}`)
}

export async function deleteEvent(eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (event) {
    await supabase.from('audit_logs').insert({
      action: 'delete_event',
      entity_type: 'event',
      entity_id: eventId,
      entity_snapshot: event,
      user_id: user?.id ?? null,
    })
    await supabase.from('events').update({ deleted_at: new Date().toISOString() }).eq('id', eventId)
  }

  redirect('/events')
}

export async function addSchedule(
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const content = (formData.get('content') as string).trim()
  if (!content) return { error: '内容を入力してください' }

  const { count } = await supabase
    .from('event_schedules')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  const { error } = await supabase
    .from('event_schedules')
    .insert({
      event_id: eventId,
      day_number: Number(formData.get('day_number') ?? 1),
      schedule_type: formData.get('schedule_type') || null,
      start_time: formData.get('start_time') || null,
      end_time: formData.get('end_time') || null,
      content,
      location: formData.get('location') || null,
      responsible_person: formData.get('responsible_person') || null,
      notes: formData.get('notes') || null,
      sort_order: count ?? 0,
    })

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function updateSchedule(
  scheduleId: string,
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const content = (formData.get('content') as string).trim()
  if (!content) return { error: '内容を入力してください' }

  const { error } = await supabase
    .from('event_schedules')
    .update({
      day_number: Number(formData.get('day_number') ?? 1),
      schedule_type: formData.get('schedule_type') || null,
      start_time: formData.get('start_time') || null,
      end_time: formData.get('end_time') || null,
      content,
      location: formData.get('location') || null,
      responsible_person: formData.get('responsible_person') || null,
      notes: formData.get('notes') || null,
    })
    .eq('id', scheduleId)

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function deleteSchedule(scheduleId: string, eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_schedules').delete().eq('id', scheduleId)
  revalidatePath(`/events/${eventId}`)
}

export async function clearAllSchedules(eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_schedules').delete().eq('event_id', eventId)
  revalidatePath(`/events/${eventId}`)
}

export async function bulkAddScheduleTemplate(templateId: string, eventId: string, _: FormData): Promise<void> {
  const template = TIMETABLE_TEMPLATES.find(t => t.id === templateId)
  if (!template) return

  const supabase = await createClient()

  const { count } = await supabase
    .from('event_schedules')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  await supabase.from('event_schedules').insert(
    template.rows.map((row, i) => ({
      event_id: eventId,
      day_number: 1,
      schedule_type: row.type || null,
      start_time: row.start || null,
      end_time: row.end || null,
      content: row.content,
      location: row.location || null,
      sort_order: (count ?? 0) + i,
    }))
  )

  revalidatePath(`/events/${eventId}`)
}

export async function moveSchedule(
  scheduleId: string,
  eventId: string,
  direction: 'up' | 'down',
  _: FormData
): Promise<void> {
  const supabase = await createClient()

  const { data: schedules } = await supabase
    .from('event_schedules')
    .select('id, day_number, sort_order')
    .eq('event_id', eventId)
    .order('day_number')
    .order('sort_order')

  if (!schedules) return

  const current = schedules.find(s => s.id === scheduleId)
  if (!current) return

  const dayItems = schedules.filter(s => s.day_number === current.day_number)
  const reordered = swapByDirection(dayItems, scheduleId, direction)
  if (!reordered) return

  await Promise.all(
    reordered.map((item, i) =>
      supabase.from('event_schedules').update({ sort_order: i }).eq('id', item.id)
    )
  )

  revalidatePath(`/events/${eventId}`)
}

export async function addEquipment(
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const name = (formData.get('name') as string).trim()
  if (!name) return { error: '品名を入力してください' }

  const { count } = await supabase
    .from('event_equipment')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  const { error } = await supabase
    .from('event_equipment')
    .insert({
      event_id: eventId,
      category: formData.get('category') || null,
      name,
      quantity: Number(formData.get('quantity') ?? 1),
      unit: formData.get('unit') || '個',
      supplier: formData.get('supplier') || null,
      notes: formData.get('notes') || null,
      sort_order: count ?? 0,
    })

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function updateEquipment(
  equipmentId: string,
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const name = (formData.get('name') as string).trim()
  if (!name) return { error: '品名を入力してください' }

  const { error } = await supabase
    .from('event_equipment')
    .update({
      category: formData.get('category') || null,
      name,
      quantity: Number(formData.get('quantity') ?? 1),
      unit: formData.get('unit') || '個',
      supplier: formData.get('supplier') || null,
      notes: formData.get('notes') || null,
    })
    .eq('id', equipmentId)

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function deleteEquipment(equipmentId: string, eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_equipment').delete().eq('id', equipmentId)
  revalidatePath(`/events/${eventId}`)
}

export async function clearAllEquipment(eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_equipment').delete().eq('event_id', eventId)
  revalidatePath(`/events/${eventId}`)
}

export async function importFromLayout(eventId: string, name: string, quantity: number, _: FormData): Promise<void> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('event_equipment')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
  await supabase.from('event_equipment').insert({
    event_id: eventId,
    category: '什器・家具',
    name,
    quantity,
    unit: '台',
    sort_order: count ?? 0,
  })
  revalidatePath(`/events/${eventId}`)
}

export async function moveEquipment(
  equipmentId: string,
  eventId: string,
  direction: 'up' | 'down',
  _: FormData
): Promise<void> {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('event_equipment')
    .select('id, category, sort_order')
    .eq('event_id', eventId)
    .order('category')
    .order('sort_order')

  if (!items) return

  const current = items.find(e => e.id === equipmentId)
  if (!current) return

  const catItems = items.filter(e => (e.category ?? 'その他') === (current.category ?? 'その他'))
  const reordered = swapByDirection(catItems, equipmentId, direction)
  if (!reordered) return

  await Promise.all(
    reordered.map((item, i) =>
      supabase.from('event_equipment').update({ sort_order: i }).eq('id', item.id)
    )
  )

  revalidatePath(`/events/${eventId}`)
}

export async function updateEquipmentQuantity(
  equipmentId: string,
  eventId: string,
  quantity: number,
  _: FormData
): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_equipment').update({ quantity }).eq('id', equipmentId)
  revalidatePath(`/events/${eventId}`)
}

export async function toggleEquipmentCheck(
  equipmentId: string,
  checked: boolean,
  eventId: string,
  _: FormData
): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_equipment').update({ checked }).eq('id', equipmentId)
  revalidatePath(`/events/${eventId}`)
}

const EQUIPMENT_TEMPLATES: Record<string, Array<{ name: string; quantity: number; unit: string; category: string }>> = {
  '什器セット': [
    { name: 'テーブル', quantity: 10, unit: '台', category: '什器・家具' },
    { name: '椅子', quantity: 50, unit: '脚', category: '什器・家具' },
    { name: '長テーブル', quantity: 5, unit: '台', category: '什器・家具' },
    { name: 'テーブルクロス', quantity: 10, unit: '枚', category: '什器・家具' },
  ],
  '音響・映像セット': [
    { name: 'マイク', quantity: 2, unit: '本', category: '電気機器' },
    { name: 'スピーカー', quantity: 2, unit: '台', category: '電気機器' },
    { name: 'プロジェクター', quantity: 1, unit: '台', category: '電気機器' },
    { name: 'スクリーン', quantity: 1, unit: '台', category: '電気機器' },
    { name: '延長コード', quantity: 5, unit: '本', category: '電気機器' },
  ],
  '印刷物セット': [
    { name: 'プログラム', quantity: 200, unit: '枚', category: '印刷物' },
    { name: '案内看板', quantity: 5, unit: '枚', category: '印刷物' },
    { name: '受付票', quantity: 100, unit: '枚', category: '印刷物' },
    { name: '名札', quantity: 50, unit: '枚', category: '印刷物' },
  ],
}

export async function bulkAddEquipmentGroup(groupId: string, eventId: string, _: FormData): Promise<void> {
  const group = EQUIPMENT_TEMPLATE_GROUPS.find(g => g.id === groupId)
  if (!group) return

  const supabase = await createClient()

  const { count } = await supabase
    .from('event_equipment')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  await supabase.from('event_equipment').insert(
    group.items.map((item, i) => ({
      event_id: eventId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      sort_order: (count ?? 0) + i,
    }))
  )

  revalidatePath(`/events/${eventId}`)
}

export async function addEquipmentTemplate(
  template: string,
  eventId: string,
  _: FormData
): Promise<void> {
  const supabase = await createClient()
  const templateItems = EQUIPMENT_TEMPLATES[template]
  if (!templateItems) return

  const { count } = await supabase
    .from('event_equipment')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  await supabase.from('event_equipment').insert(
    templateItems.map((item, i) => ({
      event_id: eventId,
      ...item,
      sort_order: (count ?? 0) + i,
    }))
  )

  revalidatePath(`/events/${eventId}`)
}

// ── Contacts ──────────────────────────────────────────────

export async function addContact(
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const name = (formData.get('name') as string).trim()
  if (!name) return { error: '名前を入力してください' }

  const { count } = await supabase
    .from('event_contacts')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  const { error } = await supabase.from('event_contacts').insert({
    event_id: eventId,
    name,
    role: formData.get('role') || null,
    company: formData.get('company') || null,
    phone: formData.get('phone') || null,
    email: formData.get('email') || null,
    notes: formData.get('notes') || null,
    sort_order: count ?? 0,
  })

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function updateContact(
  contactId: string,
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const name = (formData.get('name') as string).trim()
  if (!name) return { error: '名前を入力してください' }

  const { error } = await supabase
    .from('event_contacts')
    .update({
      name,
      role: formData.get('role') || null,
      company: formData.get('company') || null,
      phone: formData.get('phone') || null,
      email: formData.get('email') || null,
      notes: formData.get('notes') || null,
    })
    .eq('id', contactId)

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function deleteContact(contactId: string, eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_contacts').delete().eq('id', contactId)
  revalidatePath(`/events/${eventId}`)
}

export async function clearAllContacts(eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_contacts').delete().eq('event_id', eventId)
  revalidatePath(`/events/${eventId}`)
}

export async function bulkAddContactTemplate(groupId: string, eventId: string, _: FormData): Promise<void> {
  const group = CONTACT_TEMPLATE_GROUPS.find(g => g.id === groupId)
  if (!group) return

  const supabase = await createClient()

  const { count } = await supabase
    .from('event_contacts')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  await supabase.from('event_contacts').insert(
    group.contacts.map((c, i) => ({
      event_id: eventId,
      name: c.name,
      role: c.role,
      sort_order: (count ?? 0) + i,
    }))
  )

  revalidatePath(`/events/${eventId}`)
}

export async function moveContact(
  contactId: string,
  eventId: string,
  direction: 'up' | 'down',
  _: FormData
): Promise<void> {
  const supabase = await createClient()

  const { data: contacts } = await supabase
    .from('event_contacts')
    .select('id, sort_order')
    .eq('event_id', eventId)
    .order('sort_order')

  if (!contacts) return

  const reordered = swapByDirection(contacts, contactId, direction)
  if (!reordered) return

  await Promise.all(
    reordered.map((item, i) =>
      supabase.from('event_contacts').update({ sort_order: i }).eq('id', item.id)
    )
  )

  revalidatePath(`/events/${eventId}`)
}

// ── Q&A ───────────────────────────────────────────────────

export async function addQA(
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const question = (formData.get('question') as string).trim()
  const answer = (formData.get('answer') as string).trim()
  if (!question) return { error: '質問を入力してください' }
  if (!answer) return { error: '回答を入力してください' }

  const { count } = await supabase
    .from('event_qa')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  const { error } = await supabase.from('event_qa').insert({
    event_id: eventId,
    question,
    answer,
    sort_order: count ?? 0,
  })

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function updateQA(
  qaId: string,
  eventId: string,
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const question = (formData.get('question') as string).trim()
  const answer = (formData.get('answer') as string).trim()
  if (!question) return { error: '質問を入力してください' }
  if (!answer) return { error: '回答を入力してください' }

  const { error } = await supabase
    .from('event_qa')
    .update({ question, answer })
    .eq('id', qaId)

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function bulkAddQA(groupId: string, eventId: string, _: FormData): Promise<void> {
  const group = QA_TEMPLATE_GROUPS.find(g => g.id === groupId)
  if (!group) return

  const supabase = await createClient()

  const { count } = await supabase
    .from('event_qa')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  await supabase.from('event_qa').insert(
    group.pairs.map((pair, i) => ({
      event_id: eventId,
      question: pair.question,
      answer: pair.answer,
      sort_order: (count ?? 0) + i,
    }))
  )

  revalidatePath(`/events/${eventId}`)
}

export async function deleteQA(qaId: string, eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_qa').delete().eq('id', qaId)
  revalidatePath(`/events/${eventId}`)
}

export async function clearAllQA(eventId: string, _: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('event_qa').delete().eq('event_id', eventId)
  revalidatePath(`/events/${eventId}`)
}

export async function moveQA(
  qaId: string,
  eventId: string,
  direction: 'up' | 'down',
  _: FormData
): Promise<void> {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('event_qa')
    .select('id, sort_order')
    .eq('event_id', eventId)
    .order('sort_order')

  if (!items) return

  const reordered = swapByDirection(items, qaId, direction)
  if (!reordered) return

  await Promise.all(
    reordered.map((item, i) =>
      supabase.from('event_qa').update({ sort_order: i }).eq('id', item.id)
    )
  )

  revalidatePath(`/events/${eventId}`)
}

// ── Duplicate Event ───────────────────────────────────────

export async function duplicateEvent(
  eventId: string
): Promise<{ newId?: string; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const [
    { data: event },
    { data: schedules },
    { data: equipment },
    { data: contacts },
    { data: qaItems },
    { data: taskItems },
  ] = await Promise.all([
    supabase.from('events').select('*').eq('id', eventId).single(),
    supabase.from('event_schedules').select('*').eq('event_id', eventId).order('sort_order'),
    supabase.from('event_equipment').select('*').eq('event_id', eventId).order('sort_order'),
    supabase.from('event_contacts').select('*').eq('event_id', eventId).order('sort_order'),
    supabase.from('event_qa').select('*').eq('event_id', eventId).order('sort_order'),
    supabase.from('event_tasks').select('*').eq('event_id', eventId).order('sort_order'),
  ])

  if (!event) return { error: 'イベントが見つかりません' }

  const { data: newEvent, error: eventError } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      title: `${event.title}（複製）`,
      event_date: event.event_date,
      end_date: event.end_date,
      setup_date: event.setup_date,
      teardown_date: event.teardown_date,
      venue_name: event.venue_name,
      venue_address: event.venue_address,
      venue_access: event.venue_access,
      organizer: event.organizer,
      co_organizers: event.co_organizers,
      expected_visitors: event.expected_visitors,
      target_audience: event.target_audience,
      overview: event.overview,
      contact_name: event.contact_name,
      contact_phone: event.contact_phone,
      contact_email: event.contact_email,
      notes: event.notes,
      total_budget: event.total_budget,
      event_type: event.event_type,
      target_age: event.target_age,
      venue_type: event.venue_type,
      prefecture: event.prefecture,
      venue_map_url: event.venue_map_url,
      venue_meeting_place: event.venue_meeting_place,
      venue_meeting_time: event.venue_meeting_time,
      venue_entry: event.venue_entry,
      staff_dress_code: event.staff_dress_code,
    })
    .select('id')
    .single()

  if (eventError || !newEvent) return { error: eventError?.message ?? '複製に失敗しました' }

  const newId = newEvent.id

  await Promise.all([
    schedules?.length
      ? supabase.from('event_schedules').insert(
          schedules.map(s => ({
            event_id: newId,
            day_number: s.day_number,
            schedule_type: s.schedule_type,
            start_time: s.start_time,
            end_time: s.end_time,
            content: s.content,
            location: s.location,
            responsible_person: s.responsible_person,
            notes: s.notes,
            sort_order: s.sort_order,
          }))
        )
      : null,
    equipment?.length
      ? supabase.from('event_equipment').insert(
          equipment.map(eq => ({
            event_id: newId,
            category: eq.category,
            name: eq.name,
            quantity: eq.quantity,
            unit: eq.unit,
            supplier: eq.supplier,
            notes: eq.notes,
            checked: false,
            sort_order: eq.sort_order,
          }))
        )
      : null,
    contacts?.length
      ? supabase.from('event_contacts').insert(
          contacts.map(c => ({
            event_id: newId,
            name: c.name,
            role: c.role,
            company: c.company,
            phone: c.phone,
            email: c.email,
            notes: c.notes,
            sort_order: c.sort_order,
          }))
        )
      : null,
    qaItems?.length
      ? supabase.from('event_qa').insert(
          qaItems.map(q => ({
            event_id: newId,
            question: q.question,
            answer: q.answer,
            sort_order: q.sort_order,
          }))
        )
      : null,
    taskItems?.length
      ? supabase.from('event_tasks').insert(
          taskItems.map(t => ({
            event_id: newId,
            title: t.title,
            description: t.description,
            status: 'todo',
            priority: t.priority,
            assignee: t.assignee,
            start_date: t.start_date,
            due_date: t.due_date,
            sort_order: t.sort_order,
          }))
        )
      : null,
  ].filter(Boolean))
  revalidatePath('/events')
  return { newId }
}
