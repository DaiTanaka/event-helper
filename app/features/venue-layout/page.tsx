import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '会場レイアウト作成ガイド｜イベント会場の設営・図面の作り方',
  description: 'イベントの会場レイアウト（座席配置・机の並べ方・動線設計）の作成方法を解説。スクール形式・シアター形式・島型など、配置パターンと注意点もまとめています。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/venue-layout' },
  openGraph: {
    title: '会場レイアウト作成ガイド｜イベント会場の設営・図面の作り方 | イベント開催ナビ',
    description: 'イベントの会場レイアウト（座席配置・机の並べ方・動線設計）の作成方法を解説。スクール形式・シアター形式・島型など、配置パターンと注意点もまとめています。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: '会場レイアウト作成ガイド', item: 'https://event-helper.picoton.com/features/venue-layout' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '会場レイアウト作成ガイド｜イベント会場の設営・図面の作り方',
  description: 'イベントの会場レイアウト（座席配置・机の並べ方・動線設計）の作成方法を解説。スクール形式・シアター形式・島型など、配置パターンと注意点もまとめています。',
  url: 'https://event-helper.picoton.com/features/venue-layout',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://workshop.picoton.com/' },
  about: { '@type': 'Thing', name: '会場レイアウト' },
  mainEntityOfPage: 'https://event-helper.picoton.com/features/venue-layout',
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '会場レイアウト作成ガイド｜イベント会場の設営・図面の作り方',
  description: 'イベントの会場レイアウト（座席配置・机の並べ方・動線設計）の作成方法を解説。スクール形式・シアター形式・島型など、配置パターンと注意点もまとめています。',
  url: 'https://event-helper.picoton.com/features/venue-layout',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '会場レイアウトはいつ決めるべきですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '本番の1〜2週間前までに確定し、当日の設営担当者に共有しておくのが理想です。ただし会場の下見時に大まかなレイアウトを検討し、参加者数が確定した段階で詳細を詰めるのが一般的な流れです。',
      },
    },
    {
      '@type': 'Question',
      name: 'シアター形式とスクール形式の違いは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'シアター形式は椅子のみを並べる形式で、講演・発表会など参加者が聴くだけのイベントに向いています。スクール形式は机と椅子を並べる学校のような配置で、ワークショップや研修など参加者が書いたり作業したりするイベントに適しています。',
      },
    },
    {
      '@type': 'Question',
      name: '避難通路は何メートル確保すれば良いですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '消防法では、収容人数50人以上の場合、通路幅を60cm以上確保することが求められます（主要通路は120cm以上が推奨）。非常口への動線は常に確保し、入退場の動線と交差しない設計が理想です。',
      },
    },
    {
      '@type': 'Question',
      name: '会場レイアウト図はどうやって作りますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Excelやパワーポイント、または専用のレイアウト作成ツールを使う方法があります。「イベント開催ナビ」では、ドラッグ&ドロップで机・椅子・ステージなどを配置できる会場レイアウト機能を無料で提供しています。',
      },
    },
  ],
}

type LayoutType = {
  name: string
  emoji: string
  description: string
  suitable: string[]
  capacity: string
}

const LAYOUT_TYPES: LayoutType[] = [
  {
    name: 'シアター形式',
    emoji: '🎭',
    description: '椅子のみを並べるレイアウト。ステージや演台に向かって行を作る形式。',
    suitable: ['講演会・セミナー', '発表会・演奏会', '映画・上映会'],
    capacity: '同じ面積で最も多くの人数を収容できる',
  },
  {
    name: 'スクール形式',
    emoji: '📚',
    description: '机と椅子をすべて正面に向けて並べる学校の教室形式。',
    suitable: ['研修・勉強会', 'ワークショップ', '試験・テスト'],
    capacity: 'シアター形式より約30〜40%少なくなる',
  },
  {
    name: '島型（グループ型）',
    emoji: '🏝️',
    description: '数人用の机を島状に配置する形式。グループでの作業・会話がしやすい。',
    suitable: ['グループワーク', '交流会・懇親会', '子ども向けイベント'],
    capacity: 'スクール形式よりさらに少なくなる',
  },
  {
    name: 'ロの字・コの字形式',
    emoji: '⬜',
    description: '机を四角形や三方向に並べ、中央を空けた形式。全員が顔を見合わせられる。',
    suitable: ['会議・ディスカッション', '委員会・打ち合わせ', '少人数の研修'],
    capacity: '少人数（8〜20人程度）に適している',
  },
  {
    name: 'バンケット形式',
    emoji: '🍽️',
    description: '円形テーブルを複数配置する宴会スタイル。食事や歓談を伴う場に向いている。',
    suitable: ['懇親会・パーティー', '表彰式・式典', '地域のお祭り'],
    capacity: '島型と同程度',
  },
  {
    name: 'スタンディング形式',
    emoji: '🧍',
    description: '座席を設けず立ち見で行うレイアウト。短時間のイベントや混雑時に有効。',
    suitable: ['展示会・マルシェ', '短時間のデモ・ピッチ', 'オープニングイベント'],
    capacity: '同じ面積で最も多くの人数を受け入れられる',
  },
]

const DESIGN_POINTS = [
  {
    icon: '🚪',
    title: '入退場の動線',
    body: '出入口から各座席・エリアへの動線を確保する。入場と退場の流れが交差しないよう、一方通行になる動線設計が理想。',
  },
  {
    icon: '🚨',
    title: '非常口・避難経路',
    body: '非常口を塞がないこと。主要通路は120cm以上、サブ通路は60cm以上の幅を確保する（収容人数50人以上は消防法による義務）。',
  },
  {
    icon: '🔌',
    title: '電源・機材の位置',
    body: 'プロジェクター・マイク・照明などの電源コンセント位置を事前に確認し、コード類が通路を横断しないよう配置する。',
  },
  {
    icon: '♿',
    title: 'バリアフリー対応',
    body: '車椅子・ベビーカーの通行スペース（90cm以上）を確保する。車椅子席は後方ではなく、視認性の良い場所に設置することが推奨される。',
  },
  {
    icon: '📸',
    title: '撮影・カメラアングル',
    body: 'カメラマンや記録係の立ち位置を事前に確保する。三脚を立てる場合は通路をふさがない位置を設定する。',
  },
  {
    icon: '🪑',
    title: '前後左右の間隔',
    body: '椅子の前後間隔は最低45cm（ゆとりある場合は60cm）を目安に。横の間隔は通路を除き最低5cm程度確保するとストレスが少ない。',
  },
]

export default function VenueLayoutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-violet-700 bg-violet-100 px-3 py-1 rounded-full mb-4">
            会場設営ガイド
          </span>
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            会場レイアウト作成ガイド
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            イベントの規模・目的に合った座席配置の選び方から、動線設計・避難通路の確保まで。
            会場レイアウト図の作り方と注意点を解説します。
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            レイアウト図を無料で作成する
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

          {/* 配置パターン */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">会場レイアウトの主な配置パターン</h2>
              <p className="text-xs text-slate-400 mt-0.5">イベントの目的に合わせて選択してください</p>
            </div>
            <div className="divide-y divide-slate-50">
              {LAYOUT_TYPES.map((lt) => (
                <div key={lt.name} className="px-6 py-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl shrink-0">{lt.emoji}</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{lt.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{lt.description}</p>
                    </div>
                  </div>
                  <div className="ml-9 grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">向いているイベント</p>
                      <ul className="space-y-1">
                        {lt.suitable.map(s => (
                          <li key={s} className="text-xs text-slate-600 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">収容人数の目安</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{lt.capacity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 設計のポイント */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">レイアウト設計のポイント</h2>
              <p className="text-xs text-slate-400 mt-0.5">安全性と快適性を両立させるための確認事項</p>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-50">
              {DESIGN_POINTS.map((pt) => (
                <div key={pt.title} className="px-6 py-5 flex items-start gap-3">
                  <span className="text-xl shrink-0">{pt.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">{pt.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{pt.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">よくある質問</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {faqJsonLd.mainEntity.map((qa) => (
                <div key={qa.name} className="px-6 py-5">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Q. {qa.name}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">A. {qa.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 関連ガイド */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">関連ガイド</h2>
            </div>
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {[
                { href: '/features/checklist', emoji: '📋', title: 'イベント準備チェックリスト', desc: '企画〜後片付けまでの全手順' },
                { href: '/features/timeline',  emoji: '⏱️', title: 'タイムテーブルの作り方',   desc: '当日進行表・時間配分' },
                { href: '/features/budget',    emoji: '💰', title: '予算・費用管理ガイド',     desc: '費用項目・予算策定手順' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="group px-5 py-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">{item.emoji} {item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTAカード */}
          <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center shrink-0 text-xl">
              🗺️
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">
                ドラッグ&ドロップでレイアウト図を作成
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」なら、机・椅子・ステージ・受付台などをドラッグして配置できる
                レイアウトエディタを無料で使えます。PDFや画像での書き出しにも対応。
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/try"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  登録なしで今すぐ試す
                </Link>
                <Link
                  href="/features/checklist"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white transition-colors"
                >
                  準備チェックリストを見る
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
