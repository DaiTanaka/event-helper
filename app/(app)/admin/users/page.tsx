import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import UsersClient from './UsersClient'

export default async function AdminUsersPage() {
  let errorMessage: string | null = null
  let users: {
    id: string
    email: string
    created_at: string
    profile: {
      organization: string | null
      industry: string | null
      role: string | null
      prefecture: string | null
      newsletter_opt_in: boolean
      marketing_opt_in: boolean
      is_test_account: boolean
      terms_accepted_at: string | null
    } | null
    event_count: number
  }[] = []

  try {
    const admin = createAdminClient()
    const supabase = await createClient()

    const [{ data: authUsers }, { data: profiles }, { data: eventCounts }] = await Promise.all([
      admin.auth.admin.listUsers({ perPage: 1000 }),
      supabase.from('user_profiles').select('id, organization, industry, role, prefecture, newsletter_opt_in, marketing_opt_in, is_test_account, terms_accepted_at'),
      supabase.from('events').select('user_id').is('deleted_at', null),
    ])

    const profileMap = new Map((profiles ?? []).map(p => [p.id, p]))
    const countMap = new Map<string, number>()
    for (const e of eventCounts ?? []) {
      if (e.user_id) countMap.set(e.user_id, (countMap.get(e.user_id) ?? 0) + 1)
    }

    users = (authUsers?.users ?? []).map(u => ({
      id: u.id,
      email: u.email ?? '(メールなし)',
      created_at: u.created_at,
      profile: profileMap.get(u.id) ?? null,
      event_count: countMap.get(u.id) ?? 0,
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch (e) {
    errorMessage = (e as Error).message
  }

  if (errorMessage) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
        <p className="font-medium mb-1">ユーザー一覧の取得に失敗しました</p>
        <p className="text-xs">{errorMessage}</p>
        <p className="text-xs mt-2 text-red-500">
          .env.local に <code>SUPABASE_SERVICE_ROLE_KEY</code> が設定されているか確認してください。
        </p>
      </div>
    )
  }

  return <UsersClient users={users} />
}
