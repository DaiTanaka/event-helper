import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import AccountClient from './AccountClient'

export const metadata: Metadata = {
  title: 'アカウント設定 | イベント開催ナビ',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('organization_type, organization, role, prefecture, events_per_year, decision_authority, budget_range, phone, newsletter_opt_in, marketing_opt_in, terms_accepted_at')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) redirect('/onboarding')

  return (
    <AccountClient
      email={user.email ?? ''}
      profile={profile}
    />
  )
}
