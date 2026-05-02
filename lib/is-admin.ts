import { createClient } from '@/lib/supabase/server'

export const ADMIN_EMAILS = ['tanakadai1980@gmail.com', 'tanaka@picoton.com']

// 後方互換
export const ADMIN_EMAIL = ADMIN_EMAILS[0]

export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email ? ADMIN_EMAILS.includes(user.email) : false
}
