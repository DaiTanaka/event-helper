import Link from 'next/link'
import FeatureNav from './FeatureNav'

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            イベント一覧
          </Link>
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-700 hidden sm:block">イベント開催ナビ</span>
          </Link>
        </div>
        <FeatureNav />
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-100 bg-slate-50 mt-16">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">ガイド一覧</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mb-8">
            {[
              { href: '/features/checklist',      label: 'イベント準備チェックリスト' },
              { href: '/features/timeline',       label: 'タイムテーブルの作り方' },
              { href: '/features/venue-layout',   label: '会場レイアウト作成ガイド' },
              { href: '/features/budget',         label: '予算・費用管理ガイド' },
              { href: '/features/equipment',      label: 'イベント備品リスト' },
              { href: '/features/staff',          label: 'スタッフ役割分担ガイド' },
              { href: '/features/announcement',   label: 'イベント告知・案内文' },
              { href: '/features/survey',         label: 'アンケートの作り方' },
              { href: '/features/handover',       label: 'イベント引き継ぎガイド' },
              { href: '/features/community-event',label: '地域イベント開催ガイド' },
              { href: '/features/school',         label: '学校行事ガイド' },
              { href: '/features/corporate',      label: '社内イベント・懇親会ガイド' },
              { href: '/features/calendar',       label: '季節のイベントカレンダー' },
              { href: '/features/online',         label: 'オンライン・ハイブリッドイベント' },
              { href: '/features/disaster',       label: '防災イベントを開こう' },
              { href: '/features/summer',         label: '夏のイベントに備える' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="text-xs text-slate-500 hover:text-orange-600 transition-colors py-0.5 truncate">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs text-slate-500 font-medium">イベント開催ナビ</span>
              <span className="text-xs text-slate-400">© 2025 株式会社ピコトン</span>
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <Link href="/terms" className="hover:text-slate-600">利用規約</Link>
              <Link href="/privacy" className="hover:text-slate-600">プライバシーポリシー</Link>
              <a href="https://workshop.picoton.com/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600">ピコトン公式</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
