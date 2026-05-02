import { createAdminClient } from '@/lib/supabase/admin'
import DataClient from './DataClient'

export default async function AdminDataPage() {
  let errorMessage: string | null = null

  type QARow = {
    question: string
    answer: string
    event_title: string
    event_type: string | null
    prefecture: string | null
    expected_visitors: number | null
    user_email: string
  }

  type ScheduleRow = {
    content: string
    schedule_type: string | null
    location: string | null
    start_time: string | null
    end_time: string | null
    event_type: string | null
    event_title: string
  }

  type EquipmentRow = {
    name: string
    category: string | null
    quantity: number
    unit: string | null
    event_type: string | null
    event_title: string
  }

  type ContactRow = {
    name: string
    role: string | null
    company: string | null
    event_type: string | null
    event_title: string
  }

  let qa: QARow[] = []
  let schedules: ScheduleRow[] = []
  let equipment: EquipmentRow[] = []
  let contacts: ContactRow[] = []

  try {
    const admin = createAdminClient()

    const [qaRes, scheduleRes, equipRes, contactRes, authRes] = await Promise.all([
      admin
        .from('event_qa')
        .select('question, answer, event_id, events(title, event_type, prefecture, expected_visitors, user_id)')
        .order('sort_order')
        .limit(5000),
      admin
        .from('event_schedules')
        .select('content, schedule_type, location, start_time, end_time, event_id, events(title, event_type)')
        .order('day_number').order('sort_order')
        .limit(5000),
      admin
        .from('event_equipment')
        .select('name, category, quantity, unit, event_id, events(title, event_type)')
        .order('sort_order')
        .limit(5000),
      admin
        .from('event_contacts')
        .select('name, role, company, event_id, events(title, event_type)')
        .order('sort_order')
        .limit(5000),
      admin.auth.admin.listUsers({ perPage: 1000 }),
    ])

    const emailMap = new Map(
      (authRes.data?.users ?? []).map(u => [u.id, u.email ?? '(メールなし)'])
    )

    qa = (qaRes.data ?? []).map(r => {
      const e = r.events as unknown as { title: string; event_type: string | null; prefecture: string | null; expected_visitors: number | null; user_id: string } | null
      return {
        question: r.question,
        answer: r.answer,
        event_title: e?.title ?? '(不明)',
        event_type: e?.event_type ?? null,
        prefecture: e?.prefecture ?? null,
        expected_visitors: e?.expected_visitors ?? null,
        user_email: emailMap.get(e?.user_id ?? '') ?? '(不明)',
      }
    })

    schedules = (scheduleRes.data ?? []).map(r => {
      const e = r.events as unknown as { title: string; event_type: string | null } | null
      return {
        content: r.content,
        schedule_type: r.schedule_type,
        location: r.location,
        start_time: r.start_time,
        end_time: r.end_time,
        event_type: e?.event_type ?? null,
        event_title: e?.title ?? '(不明)',
      }
    })

    equipment = (equipRes.data ?? []).map(r => {
      const e = r.events as unknown as { title: string; event_type: string | null } | null
      return {
        name: r.name,
        category: r.category,
        quantity: r.quantity,
        unit: r.unit,
        event_type: e?.event_type ?? null,
        event_title: e?.title ?? '(不明)',
      }
    })

    contacts = (contactRes.data ?? []).map(r => {
      const e = r.events as unknown as { title: string; event_type: string | null } | null
      return {
        name: r.name,
        role: r.role,
        company: r.company,
        event_type: e?.event_type ?? null,
        event_title: e?.title ?? '(不明)',
      }
    })
  } catch (e) {
    errorMessage = (e as Error).message
  }

  if (errorMessage) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
        <p className="font-medium mb-1">データの取得に失敗しました</p>
        <p className="text-xs">{errorMessage}</p>
      </div>
    )
  }

  return <DataClient qa={qa} schedules={schedules} equipment={equipment} contacts={contacts} />
}
