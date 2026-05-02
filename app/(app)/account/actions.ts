'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logAudit } from '@/lib/audit'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(
  prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const { error } = await supabase.from('user_profiles').update({
    organization_type:  (formData.get('organization_type') as string) || null,
    organization:       (formData.get('organization')       as string) || null,
    role:               (formData.get('role')               as string) || null,
    prefecture:         (formData.get('prefecture')         as string) || null,
    events_per_year:    (formData.get('events_per_year')    as string) || null,
    decision_authority: (formData.get('decision_authority') as string) || null,
    budget_range:       (formData.get('budget_range')       as string) || null,
    phone:              (formData.get('phone')               as string) || null,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/account')
  return { success: true }
}

export async function updateConsent(
  prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const now = new Date().toISOString()
  const newsletterOptIn = formData.get('newsletter_opt_in') === 'on'
  const marketingOptIn = formData.get('marketing_opt_in') === 'on'

  const { data: current } = await supabase
    .from('user_profiles')
    .select('newsletter_opt_in, marketing_opt_in')
    .eq('id', user.id)
    .single()

  const patch: Record<string, unknown> = {
    newsletter_opt_in: newsletterOptIn,
    marketing_opt_in: marketingOptIn,
    updated_at: now,
  }
  if (newsletterOptIn && !current?.newsletter_opt_in) patch.newsletter_opted_in_at = now
  if (marketingOptIn && !current?.marketing_opt_in)  patch.marketing_opted_in_at  = now

  const { error } = await supabase.from('user_profiles').update(patch).eq('id', user.id)
  if (error) return { error: error.message }

  await logAudit(supabase, 'update_consent', 'user_profile', user.id, {
    newsletter_opt_in: newsletterOptIn,
    marketing_opt_in: marketingOptIn,
  }, user.id)

  revalidatePath('/account')
  return { success: true }
}

export async function deleteAccount(
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const confirmation = (formData.get('confirmation') as string).trim()
  if (confirmation !== '退会する') return { error: '確認テキストが正しくありません' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  await supabase.from('deleted_user_snapshots').insert({
    original_user_id: user.id,
    email: user.email,
    profile_snapshot: profile ?? null,
    deletion_reason: 'user_request',
  })

  await logAudit(supabase, 'delete_account', 'user', user.id, {
    email: user.email,
    reason: 'user_request',
  }, user.id)

  // ユーザーの全イベントをソフトデリート
  const now = new Date().toISOString()
  const { data: userEvents } = await supabase
    .from('events')
    .select('id, title')
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (userEvents?.length) {
    await supabase
      .from('events')
      .update({ deleted_at: now })
      .eq('user_id', user.id)
      .is('deleted_at', null)

    await logAudit(supabase, 'delete_events_on_account_deletion', 'event', user.id, {
      event_ids: userEvents.map(e => e.id),
      event_titles: userEvents.map(e => e.title),
      count: userEvents.length,
    }, user.id)
  }

  // auth.users から削除（service role が必要）
  try {
    const admin = createAdminClient()
    await admin.auth.admin.deleteUser(user.id)
  } catch (e) {
    return { error: `アカウントの削除に失敗しました: ${(e as Error).message}` }
  }

  redirect('/login')
}
