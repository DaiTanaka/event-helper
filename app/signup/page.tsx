import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignupForm from './SignupForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '無料登録 | イベント開催ナビ',
  description: 'メールアドレスだけで無料登録。イベント管理・チーム共有・印刷機能をすべて無料で使えます。',
  alternates: { canonical: 'https://event-helper.picoton.com/signup' },
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/events')

  const { redirect: redirectParam } = await searchParams
  const safeRedirect = redirectParam?.startsWith('/') && !redirectParam.startsWith('//')
    ? redirectParam
    : '/events'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-sm">イベント開催ナビ</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">無料アカウントを作成</h1>
            <p className="text-sm text-slate-500 mt-1">情報を入力して登録を完了してください</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <SignupForm redirectTo={safeRedirect} />
          </div>
        </div>
      </div>
    </div>
  )
}
