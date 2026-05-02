import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LoginForm from './LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ログイン | イベント開催ナビ',
  robots: { index: false, follow: true },
}

export default async function LoginPage({
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
        <Link href="/signup" className="text-sm px-4 py-1.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
          新規登録
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">ログイン</h1>
            <p className="text-sm text-slate-400 mt-2">スケジュール・備品・マニュアルをひとまとめに</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <LoginForm redirectTo={safeRedirect} />
          </div>
        </div>
      </div>
    </div>
  )
}
