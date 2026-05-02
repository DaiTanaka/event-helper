export const metadata = {
  title: '防災イベントを開こう',
  description: '防災スゴロク・防災クイズの素材を無料配布中。地域・学校の防災イベントにご活用ください。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/disaster' },
  openGraph: {
    title: '防災イベントを開こう | イベント開催ナビ',
    description: '防災スゴロク・防災クイズの素材を無料配布中。地域・学校の防災イベントにご活用ください。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: '防災イベントを開こう', item: 'https://event-helper.picoton.com/features/disaster' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '防災イベントを開こう',
  description: '防災スゴロク・防災クイズの素材を無料配布中。地域・学校の防災イベントにご活用ください。',
  url: 'https://event-helper.picoton.com/features/disaster',
  about: { '@type': 'Thing', name: '防災イベント' },
  hasPart: [
    { '@type': 'CreativeWork', name: '防災スゴロク', description: 'A3サイズの手作りスゴロクキット。盤面・コマ・アイテムリストの3ファイルで構成。地域行事・学校での防災教育に。' },
    { '@type': 'CreativeWork', name: '防災クイズ', description: '防災士が監修した初級・中級の2段階防災クイズPDF。イベントのアイスブレイクや避難訓練の事前学習に。' },
  ],
  dateModified: '2025-01-01',
}

type SugorokuFile = { label: string; url: string; size: string }
type QuizFile = { label: string; level: string; url: string }

const SUGOROKU_FILES: SugorokuFile[] = [
  {
    label: '盤面',
    url: 'https://workshop.picoton.com/disaster-sugoroku-download/file/disaster-sugoroku_bord.pdf',
    size: 'A3',
  },
  {
    label: 'サイコロとコマ',
    url: 'https://workshop.picoton.com/disaster-sugoroku-download/file/disaster-sugoroku_koma.pdf',
    size: 'A4',
  },
  {
    label: 'アイテムリスト',
    url: 'https://workshop.picoton.com/disaster-sugoroku-download/file/disaster-sugoroku_item-list.pdf',
    size: 'A4',
  },
]

const QUIZ_ARTICLE_URL = 'https://workshop.picoton.com/wp_news/2025/03/17/disaster-prevention-quiz/'

const QUIZ_FILES: QuizFile[] = [
  {
    label: '防災クイズ 初級編',
    level: '初級',
    url: 'https://workshop.picoton.com/pdf/disaster-prevention-quiz-beginner.pdf',
  },
  {
    label: '防災クイズ 中級編',
    level: '中級',
    url: 'https://workshop.picoton.com/pdf/disaster-prevention-quiz-intermediate.pdf',
  },
]

function DownloadRow({ label, url, size }: SugorokuFile) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-colors"
    >
      <div className="w-8 h-8 bg-slate-100 group-hover:bg-sky-100 rounded-lg flex items-center justify-center shrink-0 transition-colors">
        <svg className="w-4 h-4 text-slate-500 group-hover:text-sky-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </div>
      <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-sky-700 transition-colors">{label}</span>
      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 group-hover:bg-sky-100 px-1.5 py-0.5 rounded transition-colors">{size}</span>
    </a>
  )
}

function QuizCard({ label, level, url }: QuizFile) {
  const isAdvanced = level === '中級'
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isAdvanced
            ? 'bg-sky-100 text-sky-700'
            : 'bg-emerald-100 text-emerald-700'
        }`}>
          {level}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-700 group-hover:text-sky-700 transition-colors">{label}</p>
      <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-sky-500 transition-colors mt-auto">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        PDFをダウンロード
      </div>
    </a>
  )
}

export default function DisasterFeaturePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-full mb-4">
            防災特集
          </span>
          <div className="text-5xl mb-4">🛡️</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            防災イベントを開こう
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
            地域や学校で、参加者が楽しみながら防災の知識を身につけられる素材を無料で配布しています。
            スゴロクやクイズを通じて、防災意識を自然に高めましょう。
          </p>
        </div>
      </section>

      {/* コンテンツ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-5">

          {/* ── 防災スゴロク ── */}
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-sky-50 flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
                🎲
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">A3サイズ『防災スゴロク』データ</h2>
                <p className="text-xs text-slate-400 mt-0.5">全3ファイル（印刷して組み立てる手作りキット）</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                みんなで楽しみながら防災を学べるスゴロクゲーム。各マスに防災の知識や取るべき行動が書かれていて、
                ゲームを通じて自然と防災意識が身につきます。盤面はA3、サイコロ・コマ・アイテムリストはA4で印刷してください。
                地域行事・学校での防災教育・自治会のイベントにおすすめです。
              </p>
              <div className="space-y-2">
                {SUGOROKU_FILES.map(f => (
                  <DownloadRow key={f.url} {...f} />
                ))}
              </div>
            </div>
            <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">
                素材はピコトン（株式会社ピコトン）が提供。商用・非商用を問わず無料でご利用いただけます。
              </p>
            </div>
          </div>

          {/* ── 防災クイズ ── */}
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-sky-50 flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
                ❓
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">防災士が作った！防災クイズ</h2>
                <p className="text-xs text-slate-400 mt-0.5">初級・中級の2レベルで対応</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                防災士が監修した本格的な防災クイズ。初級は子どもや防災初心者向け、中級は大人・一般向けの内容です。
                イベントのアイスブレイク、防災学習プログラム、避難訓練の事前学習などに幅広く使えます。
              </p>

              {/* 詳細記事リンク */}
              <a
                href={QUIZ_ARTICLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors mb-5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                活用方法の記事を読む（ピコトン公式）
              </a>

              {/* クイズダウンロード */}
              <div className="grid sm:grid-cols-2 gap-3">
                {QUIZ_FILES.map(f => (
                  <QuizCard key={f.url} {...f} />
                ))}
              </div>
            </div>
            <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">
                素材はピコトン（株式会社ピコトン）が提供。商用・非商用を問わず無料でご利用いただけます。
              </p>
            </div>
          </div>

          {/* ピコトン案内 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-4">
            <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
              💡
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 mb-1">
                防災ワークショッププログラムをお探しですか？
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                ピコトンでは防災をテーマにしたワークショッププログラムの提供も行っています。
                地域・学校向けの出張プログラムについてはお気軽にご相談ください。
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

        </div>
      </section>

      {/* 関連ガイド */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-sm font-bold text-slate-500 mb-4">関連ガイド</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: '/features/checklist',  emoji: '📋', title: 'イベント準備チェックリスト', desc: '企画〜後片付けまでの全手順' },
              { href: '/features/equipment',  emoji: '📦', title: 'イベント備品リスト',        desc: 'カテゴリ別備品チェックリスト' },
              { href: '/features/calendar',   emoji: '📅', title: '季節のイベントカレンダー',  desc: '月別イベントアイデア一覧' },
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
