import { createAdminClient } from '@/lib/supabase/admin'
import EventsClient from './EventsClient'

export default async function AdminEventsPage() {
  let errorMessage: string | null = null
  type EventRow = {
    id: string
    title: string
    event_type: string | null
    venue_type: string | null
    prefecture: string | null
    expected_visitors: number | null
    target_age: string[] | null
    event_date: string | null
    created_at: string
    user_email: string
  }
  let events: EventRow[] = []

  try {
    const admin = createAdminClient()

    const [{ data: eventsData }, { data: authUsersData }] = await Promise.all([
      admin
        .from('events')
        .select('id, title, event_type, venue_type, prefecture, expected_visitors, target_age, event_date, created_at, user_id')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1000),
      admin.auth.admin.listUsers({ perPage: 1000 }),
    ])

    const emailMap = new Map(
      (authUsersData?.users ?? []).map(u => [u.id, u.email ?? '(メールなし)'])
    )

    events = (eventsData ?? []).map(e => ({
      id: e.id,
      title: e.title,
      event_type: e.event_type,
      venue_type: e.venue_type,
      prefecture: e.prefecture,
      expected_visitors: e.expected_visitors,
      target_age: e.target_age,
      event_date: e.event_date,
      created_at: e.created_at,
      user_email: emailMap.get(e.user_id) ?? '(不明)',
    }))
  } catch (e) {
    errorMessage = (e as Error).message
  }

  if (errorMessage) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
        <p className="font-medium mb-1">イベント一覧の取得に失敗しました</p>
        <p className="text-xs">{errorMessage}</p>
      </div>
    )
  }

  return <EventsClient events={events} />
}
