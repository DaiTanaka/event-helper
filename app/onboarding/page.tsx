import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import OnboardingForm from './OnboardingForm'

export const metadata: Metadata = {
  title: 'プロフィール設定 | イベント開催ナビ',
  robots: { index: false, follow: true },
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (profile) redirect('/events')

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-slate-50 flex flex-col">
      {/* ミニヘッダー */}
      <div className="flex items-center justify-center px-4 pt-8 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-base font-bold text-slate-800 tracking-tight">イベント開催ナビ</span>
        </div>
      </div>

      {/* フォーム */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">ようこそ！</h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              いくつかの質問にお答えいただくことで、<br />
              より適した情報をご提供できます。
            </p>
          </div>
          <OnboardingForm />
        </div>
      </div>
    </div>
  )
}
