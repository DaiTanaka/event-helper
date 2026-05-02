'use server'

import { createClient } from '@/lib/supabase/server'
import { logAudit, looksLikeTestEmail } from '@/lib/audit'
import { redirect } from 'next/navigation'

export async function saveUserProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const termsAccepted = formData.get('terms_accepted') === 'on'
  if (!termsAccepted) return

  const now = new Date().toISOString()
  const newsletterOptIn = formData.get('newsletter_opt_in') === 'on'
  const marketingOptIn  = formData.get('marketing_opt_in')  === 'on'

  const payload: Record<string, unknown> = {
    id:                user.id,
    organization_type: formData.get('organization_type') || null,
    organization:      formData.get('organization')      || null,
    role:              formData.get('role')               || null,
    events_per_year:   formData.get('events_per_year')   || null,
    prefecture:        formData.get('prefecture')         || null,
    decision_authority:formData.get('decision_authority') || null,
    budget_range:      formData.get('budget_range')       || null,
    phone:             formData.get('phone')              || null,
    updated_at:        now,
    terms_accepted_at: now,
    newsletter_opt_in:       newsletterOptIn,
    newsletter_opted_in_at:  newsletterOptIn ? now : null,
    marketing_opt_in:        marketingOptIn,
    marketing_opted_in_at:   marketingOptIn ? now : null,
    is_test_account:   looksLikeTestEmail(user.email ?? ''),
  }

  await supabase.from('user_profiles').upsert(payload)

  await logAudit(supabase, 'create_profile', 'user_profile', user.id, {
    email:              user.email,
    organization_type:  payload.organization_type,
    newsletter_opt_in:  newsletterOptIn,
    marketing_opt_in:   marketingOptIn,
    is_test_auto_flagged: payload.is_test_account,
  }, user.id)

  redirect('/events')
}
