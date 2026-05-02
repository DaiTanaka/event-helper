import type { SupabaseClient } from '@supabase/supabase-js'

export async function logAudit(
  supabase: SupabaseClient,
  action: string,
  entityType: string,
  entityId: string,
  snapshot?: Record<string, unknown> | null,
  userId?: string | null,
) {
  await supabase.from('audit_logs').insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    entity_snapshot: snapshot ?? null,
    user_id: userId ?? null,
  })
}

const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'throwam.com', 'sharklasers.com',
  'guerrillamailblock.com', 'grr.la', 'guerrillamail.info', 'guerrillamail.biz',
  'guerrillamail.de', 'guerrillamail.net', 'guerrillamail.org', 'spam4.me',
  'yopmail.com', 'trashmail.com', 'tempmail.com', 'temp-mail.org',
  'dispostable.com', 'mailnull.com', 'spamgourmet.com', 'maildrop.cc',
]

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? DISPOSABLE_DOMAINS.includes(domain) : false
}

const TEST_PATTERNS = [
  /^test[@+]/i, /^dummy[@+]/i, /^sample[@+]/i, /^demo[@+]/i,
  /^aaa+@/i, /^xxx+@/i, /^zzz+@/i,
  /^[a-z]{1,2}\d{0,2}@/i,
]

export function looksLikeTestEmail(email: string): boolean {
  if (isDisposableEmail(email)) return true
  return TEST_PATTERNS.some(p => p.test(email))
}
