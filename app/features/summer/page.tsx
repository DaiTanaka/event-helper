export const metadata = {
  title: '夏のイベントに備える',
  description: '熱中症・感染症対策のアイコンデータを無料配布中。夏のイベント運営に役立ててください。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/summer' },
  openGraph: {
    title: '夏のイベントに備える | イベント開催ナビ',
    description: '熱中症・感染症対策のアイコンデータを無料配布中。夏のイベント運営に役立ててください。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: '夏のイベントに備える', item: 'https://event-helper.picoton.com/features/summer' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '夏のイベントに備える',
  description: '熱中症・感染症対策のアイコンデータを無料配布中。夏のイベント運営に役立ててください。',
  url: 'https://event-helper.picoton.com/features/summer',
  about: { '@type': 'Thing', name: '夏のイベント運営' },
  dateModified: '2025-01-01',
}

type Resource = {
  title: string
  emoji: string
  description: string
  articleUrl?: string
  articleLabel?: string
  pdfUrl: string
  pdfLabel: string
}

const RESOURCES: Resource[] = [
  {
    title: '熱中症対策アイコンデータ',
    emoji: '🌡️',
    description:
      '屋外・半屋外イベントでの熱中症リスクに備えた、配布・掲示用のアイコンセット。水分補給の呼びかけ・休憩スペースの案内など、参加者に視覚的に伝えたい対策をまとめて収録しています。',
    articleUrl: 'https://workshop.picoton.com/wp_news/2023/07/31/countermeasures-against-heat-stroke/',
    articleLabel: '活用方法の記事を読む',
    pdfUrl: 'https://workshop.picoton.com/pdf/heatstroke_all.pdf',
    pdfLabel: 'アイコンデータ（PDF）をダウンロード',
  },
  {
    title: '感染症対策アイコンデータ',
    emoji: '😷',
    description:
      'イベント会場での感染症対策を参加者・スタッフに周知するためのアイコンセット。手洗い・消毒・マスク着用・距離の確保など、対策ルールを視覚的に伝える素材として活用できます。',
    pdfUrl: 'https://workshop.picoton.com/pdf/kansentaisaku_all.pdf',
    pdfLabel: 'アイコンデータ（PDF）をダウンロード',
  },
]

function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
    >
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {label}
    </a>
  )
}

function ArticleButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 transition-colors"
    >
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {label}
    </a>
  )
}

export default function SummerFeaturePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-4">
            季節の特集
          </span>
          <div className="text-5xl mb-4">☀️</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            夏のイベントに備える
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
            屋外・半屋外イベントが増える夏は、熱中症や感染症への備えが欠かせません。
            参加者の安心・安全を守るための素材を無料で配布しています。
          </p>
        </div>
      </section>

      {/* 素材カード */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-5">
          {RESOURCES.map(res => (
            <div key={res.pdfUrl} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-50 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
                  {res.emoji}
                </div>
                <h2 className="text-base font-bold text-slate-800">{res.title}</h2>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{res.description}</p>
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                  <DownloadButton href={res.pdfUrl} label={res.pdfLabel} />
                  {res.articleUrl && res.articleLabel && (
                    <ArticleButton href={res.articleUrl} label={res.articleLabel} />
                  )}
                </div>
              </div>
              <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">
                  素材はピコトン（株式会社ピコトン）が提供。商用・非商用を問わず無料でご利用いただけます。
                </p>
              </div>
            </div>
          ))}

          {/* ピコトン案内 */}
          <PicotonBanner />
        </div>
      </section>

      {/* 関連ガイド */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-sm font-bold text-slate-500 mb-4">関連ガイド</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: '/features/checklist', emoji: '📋', title: 'イベント準備チェックリスト', desc: '企画〜後片付けまでの全手順' },
              { href: '/features/equipment', emoji: '📦', title: 'イベント備品リスト',        desc: 'カテゴリ別備品チェックリスト' },
              { href: '/features/timeline',  emoji: '⏱️', title: 'タイムテーブルの作り方',   desc: '当日進行表・時間配分' },
            ].map(item => (
              <a key={item.href} href={item.href} className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">{item.emoji} {item.title}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function PicotonBanner() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-4">
      <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
        💡
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-700 mb-1">
          ワークショッププログラムをお探しですか？
        </p>
        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          ピコトンでは夏のイベント向けコンテンツや子ども向けワークショッププログラムも提供しています。
        </p>
        <a
          href="https://workshop.picoton.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
        >
          ピコトン公式サイトを見る
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}
