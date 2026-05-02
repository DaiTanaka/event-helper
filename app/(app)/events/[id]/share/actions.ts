'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'

export async function createInvitation(
  eventId: string,
  role: 'editor' | 'viewer',
  label: string
): Promise<{ token: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  // オーナー確認
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single()
  if (!event) return { error: 'このイベントの招待リンクを作成する権限がありません' }

  const token = randomBytes(32).toString('hex')
  const admin = createAdminClient()

  const { error } = await admin.from('event_invitations').insert({
    event_id: eventId,
    label: label || null,
    role,
    invited_by: user.id,
    token,
  })

  if (error) return { error: '招待リンクの作成に失敗しました' }

  revalidatePath(`/events/${eventId}`)
  return { token }
}

export async function deleteInvitation(
  invitationId: string,
  eventId: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const { error } = await supabase
    .from('event_invitations')
    .delete()
    .eq('id', invitationId)
    .eq('event_id', eventId)

  if (error) return { error: '削除に失敗しました' }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function removeMember(
  memberId: string,
  eventId: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const { error } = await supabase
    .from('event_members')
    .delete()
    .eq('id', memberId)
    .eq('event_id', eventId)

  if (error) return { error: '削除に失敗しました' }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function updateMemberRole(
  memberId: string,
  eventId: string,
  role: 'editor' | 'viewer'
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const { error } = await supabase
    .from('event_members')
    .update({ role })
    .eq('id', memberId)
    .eq('event_id', eventId)

  if (error) return { error: '更新に失敗しました' }

  revalidatePath(`/events/${eventId}`)
  return {}
}

export async function acceptInvitation(
  token: string
): Promise<{ eventId: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const admin = createAdminClient()

  // token で招待を検索（RLS バイパス）
  const { data: inv } = await admin
    .from('event_invitations')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .single()

  if (!inv) return { error: '招待リンクが無効または期限切れです' }
  if (new Date(inv.expires_at) < new Date()) return { error: '招待リンクの有効期限が切れています' }

  // 既にメンバーなら成功扱い
  const { data: existing } = await admin
    .from('event_members')
    .select('id')
    .eq('event_id', inv.event_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!existing) {
    // オーナー本人は除外
    const { data: event } = await admin
      .from('events')
      .select('user_id')
      .eq('id', inv.event_id)
      .single()

    if (event?.user_id !== user.id) {
      const { error: memberError } = await admin.from('event_members').insert({
        event_id: inv.event_id,
        user_id: user.id,
        role: inv.role,
        invited_by: inv.invited_by,
      })
      if (memberError) return { error: 'メンバー追加に失敗しました' }
    }
  }

  // 招待を使用済みにする
  await admin
    .from('event_invitations')
    .update({ accepted_at: new Date().toISOString(), accepted_by: user.id })
    .eq('id', inv.id)

  return { eventId: inv.event_id }
}
