import { Suspense } from 'react'
import type { Metadata } from 'next'
import CalendarContent from './CalendarContent'

export const metadata: Metadata = {
  title: '季節のイベントカレンダー',
  description: '1月〜12月の年間イベントアイデアを月別にまとめました。地域・学校・商業施設のイベント企画にご活用ください。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/calendar' },
  openGraph: {
    title: '季節のイベントカレンダー | イベント開催ナビ',
    description: '1月〜12月の年間イベントアイデアを月別にまとめました。地域・学校・商業施設のイベント企画にご活用ください。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: '季節のイベントカレンダー', item: 'https://event-helper.picoton.com/features/calendar' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '季節のイベントカレンダー',
  description: '1月〜12月の年間イベントアイデアを月別にまとめました。地域・学校・商業施設のイベント企画にご活用ください。',
  url: 'https://event-helper.picoton.com/features/calendar',
  numberOfItems: 12,
  itemListElement: Array.from({ length: 12 }, (_, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${i + 1}月のイベントアイデア`,
    url: `https://event-helper.picoton.com/features/calendar?month=${i + 1}`,
  })),
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '季節のイベントカレンダー',
  description: '1月〜12月の年間イベントアイデアを月別にまとめました。地域・学校・商業施設のイベント企画にご活用ください。',
  url: 'https://event-helper.picoton.com/features/calendar',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

export default function CalendarPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* SEO用静的ヒーロー（クライアントコンポーネントの前に配置） */}
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-4 text-center">
          <span className="inline-block text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-full mb-4">
            年間イベント企画
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            季節のイベントカレンダー
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto mb-4">
            1月〜12月の年間イベントアイデアを月別にまとめました。
            地域のお祭り・学校行事・商業施設のイベント企画にご活用ください。
          </p>
          {/* 月一覧（クロールされる静的リンク） */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {MONTH_LABELS.map((label, i) => (
              <a
                key={i}
                href={`/features/calendar?month=${i + 1}`}
                className="text-xs font-medium text-sky-600 bg-sky-50 border border-sky-100 hover:bg-sky-100 px-3 py-1 rounded-full transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Suspense>
        <CalendarContent />
      </Suspense>
    </>
  )
}
