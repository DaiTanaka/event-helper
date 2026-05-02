import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { acceptInvitation } from '@/app/(app)/events/[id]/share/actions'

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 招待情報を取得（admin client で RLS バイパス）
  const admin = createAdminClient()
  const { data: inv } = await admin
    .from('event_invitations')
    .select('*, events(title)')
    .eq('token', token)
    .maybeSingle()

  // 無効なトークン
  if (!inv) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mb-2">招待リンクが無効です</h1>
          <p className="text-sm text-slate-500 mb-6">このリンクは期限切れか、すでに使用済みです。</p>
          <Link href="/" className="text-sm text-orange-500 hover:text-orange-600">
            トップページに戻る
          </Link>
        </div>
      </div>
    )
  }

  const isExpired = new Date(inv.expires_at) < new Date()
  const isUsed = !!inv.accepted_at

  if (isExpired || isUsed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mb-2">
            {isExpired ? '招待の有効期限が切れています' : 'この招待リンクは使用済みです'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">招待者に新しいリンクを発行してもらってください。</p>
          <Link href="/" className="text-sm text-orange-500 hover:text-orange-600">
            トップページに戻る
          </Link>
        </div>
      </div>
    )
  }

  const eventTitle = (inv.events as { title: string } | null)?.title ?? 'イベント'
  const roleLabel = inv.role === 'editor' ? '編集者' : '閲覧者'

  // 未ログインの場合：ログイン/登録に誘導
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mb-1">チームに招待されています</h1>
          <p className="text-sm text-slate-500 mb-1">
            <span className="font-medium text-slate-700">「{eventTitle}」</span>
          </p>
          <p className="text-xs text-slate-400 mb-6">参加権限：{roleLabel}</p>

          <div className="space-y-3">
            <Link
              href={`/login?redirect=/invite/${token}`}
              className="block w-full py-3 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              ログインして参加する
            </Link>
            <Link
              href={`/signup?redirect=/invite/${token}`}
              className="block w-full py-3 border-2 border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              新規登録して参加する
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-4">イベント開催ナビは完全無料です</p>
        </div>
      </div>
    )
  }

  // ログイン済み：自動的に招待を受諾してイベントへ
  const result = await acceptInvitation(token)
  if ('error' in result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-sm w-full text-center">
          <p className="text-sm text-red-500 mb-4">{result.error}</p>
          <Link href="/events" className="text-sm text-orange-500 hover:text-orange-600">
            イベント一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  redirect(`/events/${result.eventId}`)
}
