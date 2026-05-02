import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベント開催ガイド・特集一覧',
  description: '地域・学校・職場のイベント企画・運営に役立つ無料ガイドをまとめました。準備チェックリスト・タイムテーブル・会場レイアウト・予算管理・季節のイベントカレンダーなど。',
  alternates: { canonical: 'https://event-helper.picoton.com/features' },
  openGraph: {
    title: 'イベント開催ガイド・特集一覧 | イベント開催ナビ',
    description: '地域・学校・職場のイベント企画・運営に役立つ無料ガイドをまとめました。準備チェックリスト・タイムテーブル・会場レイアウト・予算管理・季節のイベントカレンダーなど。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集一覧', item: 'https://event-helper.picoton.com/features' },
  ],
}

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'イベント開催ガイド・特集一覧',
  description: '地域・学校・職場のイベント企画・運営に役立つ無料ガイド集',
  url: 'https://event-helper.picoton.com/features',
  numberOfItems: 16,
  itemListElement: [
    { '@type': 'ListItem', position: 1,  name: 'イベント準備チェックリスト',        url: 'https://event-helper.picoton.com/features/checklist' },
    { '@type': 'ListItem', position: 2,  name: 'タイムテーブル（進行表）の作り方',  url: 'https://event-helper.picoton.com/features/timeline' },
    { '@type': 'ListItem', position: 3,  name: '会場レイアウト作成ガイド',          url: 'https://event-helper.picoton.com/features/venue-layout' },
    { '@type': 'ListItem', position: 4,  name: '予算・費用管理ガイド',              url: 'https://event-helper.picoton.com/features/budget' },
    { '@type': 'ListItem', position: 5,  name: 'イベント備品リスト',                url: 'https://event-helper.picoton.com/features/equipment' },
    { '@type': 'ListItem', position: 6,  name: 'オンライン・ハイブリッドイベントの開き方', url: 'https://event-helper.picoton.com/features/online' },
    { '@type': 'ListItem', position: 7,  name: 'スタッフの役割分担ガイド',          url: 'https://event-helper.picoton.com/features/staff' },
    { '@type': 'ListItem', position: 8,  name: 'イベント告知・案内文の書き方',      url: 'https://event-helper.picoton.com/features/announcement' },
    { '@type': 'ListItem', position: 9,  name: 'イベントアンケートの作り方',        url: 'https://event-helper.picoton.com/features/survey' },
    { '@type': 'ListItem', position: 10, name: 'イベント引き継ぎガイド',            url: 'https://event-helper.picoton.com/features/handover' },
    { '@type': 'ListItem', position: 11, name: '地域イベント・お祭り開催ガイド',    url: 'https://event-helper.picoton.com/features/community-event' },
    { '@type': 'ListItem', position: 12, name: '季節のイベントカレンダー',          url: 'https://event-helper.picoton.com/features/calendar' },
    { '@type': 'ListItem', position: 13, name: '学校行事・文化祭・体育祭の準備ガイド', url: 'https://event-helper.picoton.com/features/school' },
    { '@type': 'ListItem', position: 14, name: '社内イベント・懇親会・忘年会の幹事ガイド', url: 'https://event-helper.picoton.com/features/corporate' },
    { '@type': 'ListItem', position: 15, name: '防災イベントを開こう',              url: 'https://event-helper.picoton.com/features/disaster' },
    { '@type': 'ListItem', position: 16, name: '夏のイベントに備える',              url: 'https://event-helper.picoton.com/features/summer' },
  ],
}

const GUIDES = [
  {
    href: '/features/checklist',
    emoji: '📋',
    title: 'イベント準備チェックリスト',
    desc: '企画・立案から当日運営・後片付けまで、やること・確認事項を段階別にまとめた完全ガイド。',
    tags: ['準備', '手順', '全般'],
    color: 'orange',
  },
  {
    href: '/features/timeline',
    emoji: '⏱️',
    title: 'タイムテーブル（進行表）の作り方',
    desc: '開会から閉会までの時間割の作成方法。バッファの設け方・サンプル進行表・スタッフ共有のコツも解説。',
    tags: ['当日運営', '進行管理'],
    color: 'teal',
  },
  {
    href: '/features/venue-layout',
    emoji: '🗺️',
    title: '会場レイアウト作成ガイド',
    desc: 'シアター・スクール・島型など6つの配置パターンを用途別に解説。動線・避難通路・バリアフリー対応も。',
    tags: ['会場設営', '座席配置'],
    color: 'violet',
  },
  {
    href: '/features/budget',
    emoji: '💰',
    title: '予算・費用管理ガイド',
    desc: '会場費・機材費・人件費など8カテゴリの費用項目チェックリスト付き。予算策定の7ステップと節約のコツ。',
    tags: ['費用', '収支管理'],
    color: 'emerald',
  },
  {
    href: '/features/equipment',
    emoji: '📦',
    title: 'イベント備品リスト',
    desc: '受付・音響・設営・安全衛生など7カテゴリの備品を網羅。イベント規模別の必須品と見落としがちな備品も。',
    tags: ['備品', '持ち物'],
    color: 'amber',
  },
  {
    href: '/features/school',
    emoji: '🏫',
    title: '学校行事・文化祭・体育祭の準備ガイド',
    desc: '文化祭・体育祭・学習発表会・修学旅行・卒業式の準備方法。生徒参加型運営のコツ・PTA連携・行事別チェックリストつき。',
    tags: ['学校', '文化祭', '体育祭'],
    color: 'blue',
  },
  {
    href: '/features/corporate',
    emoji: '🏢',
    title: '社内イベント・懇親会・忘年会の幹事ガイド',
    desc: '懇親会・忘年会・歓送迎会・チームビルディングの幹事がやることをステップで解説。会場選び・参加費・盛り上げアイデアまで。',
    tags: ['職場', '懇親会', '幹事'],
    color: 'slate',
  },
  {
    href: '/features/online',
    emoji: '💻',
    title: 'オンライン・ハイブリッドイベント',
    desc: 'Zoom・Teams・YouTube Liveを使った開催方法。配信ツール比較・機材チェックリスト・トラブル対策・進行のコツまで。',
    tags: ['オンライン', 'ハイブリッド', 'Zoom'],
    color: 'indigo',
  },
  {
    href: '/features/staff',
    emoji: '👥',
    title: 'スタッフの役割分担ガイド',
    desc: '受付・進行・誘導・音響・撮影など8つの担当職種と必要人数の目安。スタッフ証の作り方・当日チェックリストつき。',
    tags: ['スタッフ', '役割分担', '当日運営'],
    color: 'emerald',
  },
  {
    href: '/features/announcement',
    emoji: '📢',
    title: 'イベント告知・案内文の書き方',
    desc: '5W1Hの整理からSNS・チラシ・メール別の文例テンプレート、告知タイミングまで。集客につながる告知文を解説。',
    tags: ['告知', '広報', '集客'],
    color: 'sky',
  },
  {
    href: '/features/survey',
    emoji: '📊',
    title: 'イベントアンケートの作り方',
    desc: '回答率が上がる設問設計・回収方法・Googleフォームの活用法・結果の活かし方まで。次回改善につながるアンケートを。',
    tags: ['アンケート', '事後評価'],
    color: 'violet',
  },
  {
    href: '/features/handover',
    emoji: '🔁',
    title: 'イベント引き継ぎガイド',
    desc: '次回担当者への引き継ぎ方法。よくある失敗パターン・必須5ドキュメント・チェックリストで来年の準備を90%削減。',
    tags: ['引き継ぎ', '運営ノウハウ'],
    color: 'rose',
  },
  {
    href: '/features/community-event',
    emoji: '🏮',
    title: '地域イベント・お祭り開催ガイド',
    desc: '自治会・町内会・PTAのイベント開催7ステップ。夏祭り・運動会・フリマ・防災イベントの企画から当日運営まで。',
    tags: ['地域', '自治会', 'お祭り'],
    color: 'orange',
  },
  {
    href: '/features/calendar',
    emoji: '📅',
    title: '季節のイベントカレンダー',
    desc: '1月〜12月の年間イベントアイデアを月別に掲載。地域・学校・商業施設のイベント企画にご活用ください。',
    tags: ['企画アイデア', '季節'],
    color: 'sky',
  },
  {
    href: '/features/disaster',
    emoji: '🛡️',
    title: '防災イベントを開こう',
    desc: '防災スゴロク・防災クイズのPDF素材を無料配布。地域・学校の防災イベントにそのままご利用いただけます。',
    tags: ['防災', '無料素材'],
    color: 'sky',
  },
  {
    href: '/features/summer',
    emoji: '☀️',
    title: '夏のイベントに備える',
    desc: '熱中症・感染症対策のアイコン素材を無料配布。屋外・半屋外イベントが多い夏の安全対策にどうぞ。',
    tags: ['夏', '無料素材'],
    color: 'amber',
  },
]

export default function FeaturesIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'イベント開催ガイド・特集一覧',
        description: '地域・学校・職場のイベント企画・運営に役立つ無料ガイド集',
        url: 'https://event-helper.picoton.com/features',
        publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
        dateModified: '2025-01-01',
      }) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full mb-4">
            無料ガイド・特集
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベント開催ガイド・特集一覧
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
            地域・学校・職場のイベント企画・運営に役立つ無料ガイドをまとめました。
            準備チェックリストからタイムテーブル・予算管理まで、すぐに使えます。
          </p>
        </div>
      </section>

      {/* ガイド一覧 */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <div className="space-y-3">
            {GUIDES.map(guide => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors shadow-sm"
              >
                <span className="text-3xl shrink-0 mt-0.5">{guide.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-slate-800 group-hover:text-orange-700 transition-colors mb-1">
                    {guide.title}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed mb-2">{guide.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-orange-400 transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* ツール案内 */}
          <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 text-xl">🗂️</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">
                準備から当日まで、アプリで一元管理
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」ならチェックリスト・タイムテーブル・会場レイアウト・備品リスト・予算をクラウドで管理。チームと共有して来年の引き継ぎにもそのまま使えます。完全無料。
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/try" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors">
                  登録なしで今すぐ試す
                </Link>
                <Link href="/signup" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white transition-colors">
                  無料アカウントを作成
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
