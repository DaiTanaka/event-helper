import Link from 'next/link'
import TryClient from './TryClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '無料体験',
  description: '登録不要で今すぐ体験。準備チェックリスト・会場レイアウト・タイムテーブル・連絡先・Q&A・予算管理をブラウザで試せます。',
  alternates: { canonical: 'https://event-helper.picoton.com/try' },
  openGraph: {
    title: '無料体験 | イベント開催ナビ',
    description: '登録不要で今すぐ体験。準備チェックリスト・会場レイアウト・タイムテーブル・連絡先・Q&A・予算管理をブラウザで試せます。',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'イベント開催ナビ — 無料体験',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  description: '登録不要でイベント管理ツールを体験。準備チェックリスト・会場レイアウト・タイムテーブル・連絡先・Q&A・予算管理をブラウザで試せます。',
  url: 'https://event-helper.picoton.com/try',
}

export default function TryPage() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="fixed top-0 inset-x-0 z-30 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4 no-print">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-sm">イベント開催ナビ</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 transition-colors">
            ログイン
          </Link>
          <Link href="/signup" className="text-sm px-4 py-1.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
            新規登録
          </Link>
        </div>
      </header>

      <TryClient />
    </div>
    </>
  )
}
