'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { looksLikeTestEmail } from '@/lib/audit'

type ProfileData = {
  organization_type: string
  organization: string
  role: string
  events_per_year: string
  prefecture: string
  decision_authority: string
  budget_range: string
  phone: string
  newsletter_opt_in: boolean
  marketing_opt_in: boolean
}

export async function saveProfileAsAdmin(userId: string, email: string, data: ProfileData) {
  try {
    const admin = createAdminClient()
    const now = new Date().toISOString()

    const { error } = await admin.from('user_profiles').upsert({
      id: userId,
      organization_type:      data.organization_type   || null,
      organization:           data.organization         || null,
      role:                   data.role                 || null,
      events_per_year:        data.events_per_year      || null,
      prefecture:             data.prefecture           || null,
      decision_authority:     data.decision_authority   || null,
      budget_range:           data.budget_range         || null,
      phone:                  data.phone                || null,
      updated_at:             now,
      terms_accepted_at:      now,
      newsletter_opt_in:      data.newsletter_opt_in,
      newsletter_opted_in_at: data.newsletter_opt_in ? now : null,
      marketing_opt_in:       data.marketing_opt_in,
      marketing_opted_in_at:  data.marketing_opt_in ? now : null,
      is_test_account:        looksLikeTestEmail(email),
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: String(err) }
  }
}
