'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { getIsAdmin } from '@/lib/is-admin'
import { revalidatePath } from 'next/cache'

export async function toggleTestFlag(userId: string, isTest: boolean): Promise<void> {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) throw new Error('管理者権限が必要です')

  const admin = createAdminClient()
  await admin.from('user_profiles').update({ is_test_account: isTest }).eq('id', userId)
  revalidatePath('/admin/users')
}
