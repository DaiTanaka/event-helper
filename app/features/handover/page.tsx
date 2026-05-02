import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベント引き継ぎガイド｜担当者交代をスムーズにする5つの文書',
  description: '毎年悩むイベントの引き継ぎを成功させる方法を解説。引き継ぎ文書に必要な5項目・よくある失敗パターン・クラウドツールを活用した効率化まで。自治会・学校・職場の行事担当者向け。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/handover' },
  openGraph: {
    title: 'イベント引き継ぎガイド｜担当者交代をスムーズにする5つの文書 | イベント開催ナビ',
    description: '毎年悩むイベントの引き継ぎを成功させる方法を解説。引き継ぎ文書に必要な5項目・よくある失敗パターン・クラウドツールを活用した効率化まで。自治会・学校・職場の行事担当者向け。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: 'イベント引き継ぎガイド', item: 'https://event-helper.picoton.com/features/handover' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'イベントの引き継ぎをスムーズに行う方法',
  description: '担当者交代が発生しても次の担当者がゼロから悩まずに済む引き継ぎ体制の作り方。',
  url: 'https://event-helper.picoton.com/features/handover',
  step: [
    {
      '@type': 'HowToStep',
      name: '引き継ぎ文書の5項目を揃える',
      text: '①イベント概要・目的、②準備タスクリストと担当者、③タイムテーブル、④備品・予算の実績、⑤連絡先リストの5点を文書化する。',
    },
    {
      '@type': 'HowToStep',
      name: '「なぜこうしたか」の理由を記録する',
      text: '決定事項だけでなく、その背景・理由・失敗談も残す。「去年やってみてうまくいかなかったこと」が次年度の担当者に最も価値ある情報になる。',
    },
    {
      '@type': 'HowToStep',
      name: 'ベンダー・外部委託先の連絡先を整理する',
      text: '会場・音響・印刷会社・助成金申請先など、年に1度しか使わない連絡先をリスト化する。担当者の個人デバイスに保存しない。',
    },
    {
      '@type': 'HowToStep',
      name: '引き継ぎ先と一緒に読み合わせを行う',
      text: '文書を渡して終わりにせず、新旧担当者で1〜2時間の読み合わせセッションを設ける。不明点をその場で解消し、質問事項をメモに残す。',
    },
    {
      '@type': 'HowToStep',
      name: 'クラウドで管理してどこからでもアクセスできるようにする',
      text: '特定の担当者のPCやUSBメモリに保存しない。クラウドツールを使えば新担当者が即日アクセスでき、次年度の更新も容易になる。',
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'イベントの引き継ぎはいつ行えばよいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'イベント終了後2〜4週間以内が理想です。記憶や反省点が鮮明なうちに振り返りと文書化を行い、次年度の担当者が決まり次第読み合わせを実施してください。担当者が急に変わる場合に備え、引き継ぎ文書は常に最新の状態に保っておくことを推奨します。',
      },
    },
    {
      '@type': 'Question',
      name: '引き継ぎ文書に最低限必要な内容は何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '①イベント名・目的・開催概要、②準備タスクリストと担当者分担、③当日タイムテーブル、④備品リストと調達先・費用実績、⑤関係者・外部委託先の連絡先の5点が最低限必要です。さらに「うまくいった点・改善点」の振り返りメモを加えると次年度の準備が格段に楽になります。',
      },
    },
    {
      '@type': 'Question',
      name: '引き継ぎがうまくいかない典型的な原因は何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '①前任者の個人PCやメールにデータが散在している、②「例年通り」という口伝頼りで文書化されていない、③引き継ぎのタイミングが遅すぎて前任者に確認できない、④連絡先が担当者の個人スマートフォンにしか入っていない、⑤「去年こうしたがよくなかった」という失敗情報が共有されていない、の5つが最も多いパターンです。',
      },
    },
    {
      '@type': 'Question',
      name: '毎年ゼロから準備しなくても済む方法はありますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'クラウドでイベント情報を管理することで、昨年のデータをそのまま引き継いで更新するだけで今年の準備を始められます。タスクリスト・タイムテーブル・備品リスト・予算・連絡先がすべてオンライン上にあれば、担当者が変わっても即日引き継ぎが可能です。',
      },
    },
    {
      '@type': 'Question',
      name: 'ボランティアスタッフが多いイベントの引き継ぎで注意することは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '毎年メンバーが入れ替わるボランティア団体では、「人」ではなく「役割」単位で引き継ぎ文書を作成することが重要です。「○○さんがいつもやっている」ではなく、「受付リーダーがやること」として手順化してください。また、ボランティア向けのマニュアルは毎年当日に配布できるよう印刷用フォーマットを整備しておくことをおすすめします。',
      },
    },
  ],
}

type FailPattern = { icon: string; title: string; solution: string }

const FAIL_PATTERNS: FailPattern[] = [
  {
    icon: '💾',
    title: 'データが前任者のPCの中だけにある',
    solution: 'クラウドストレージまたは専用ツールで管理。特定の端末に依存しない体制を作る。',
  },
  {
    icon: '🗣️',
    title: '口伝・暗黙知が多く文書化されていない',
    solution: '「例年通り」の内容を具体的な手順として言語化する。初めての担当者が読んでも動けるレベルを目標に。',
  },
  {
    icon: '📱',
    title: '連絡先が個人スマートフォンにしか入っていない',
    solution: '会場・業者・スタッフの連絡先を共有ドキュメントにまとめる。担当者交代で連絡先が失われるのを防ぐ。',
  },
  {
    icon: '⏰',
    title: '引き継ぎが直前すぎて質問できない',
    solution: 'イベント終了後2〜4週間以内に着手。旧担当者がまだ記憶も熱量もある時期に読み合わせを実施する。',
  },
  {
    icon: '❌',
    title: '失敗談・改善点が引き継がれない',
    solution: '「うまくいかなかったこと」「来年変えたいこと」を必ず文書に記録する。これが最も価値ある情報。',
  },
  {
    icon: '📂',
    title: '毎年ゼロから資料を作り直している',
    solution: '昨年の文書を「テンプレート」として活用し、更新するだけで完成する体制を整える。',
  },
]

const HANDOVER_DOCS = [
  {
    num: '01',
    title: 'イベント概要シート',
    items: ['イベント名・目的・ターゲット', '開催日時・場所・規模（参加者数）', '担当組織・責任者名', '過去の開催履歴と参加者数推移'],
  },
  {
    num: '02',
    title: '準備タスクリスト（役割分担付き）',
    items: ['各タスクの担当者・期限', '外部委託の有無と発注先', '今年変更したこと・その理由', '来年やるべき改善点'],
  },
  {
    num: '03',
    title: '当日タイムテーブル（スタッフ版）',
    items: ['搬入〜搬出の全コマと担当者', '転換・準備作業の時間', '緊急時の対応フロー', '過去の実績時間との差異メモ'],
  },
  {
    num: '04',
    title: '備品リスト（調達情報付き）',
    items: ['品目・数量・保管場所', '購入品と借用品の区別・返却先', '費用実績と調達先（業者名・連絡先）', '来年の増減アドバイス'],
  },
  {
    num: '05',
    title: '関係者・連絡先リスト',
    items: ['会場担当者・緊急連絡先', '外部委託業者（音響・印刷・保険など）', 'スタッフ・ボランティア一覧', '行政・協賛先の担当者情報'],
  },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'イベント引き継ぎガイド｜担当者交代をスムーズにする5つの文書',
  description: '毎年悩むイベントの引き継ぎを成功させる方法を解説。引き継ぎ文書に必要な5項目・よくある失敗パターン・クラウドツールを活用した効率化まで。自治会・学校・職場の行事担当者向け。',
  url: 'https://event-helper.picoton.com/features/handover',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function HandoverPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full mb-4">
            引き継ぎガイド
          </span>
          <div className="text-5xl mb-4">🔁</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベント引き継ぎガイド
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            「去年の資料がない」「前任者に聞けない」を防ぐための引き継ぎ体制の作り方。
            担当者が変わっても翌年スムーズに動ける仕組みを整えましょう。
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            クラウドで引き継ぎを管理する
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

          {/* よくある失敗パターン */}
          <div className="rounded-2xl border border-red-100 bg-red-50/30 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100">
              <h2 className="text-base font-bold text-slate-800">引き継ぎを失敗する6つのパターン</h2>
              <p className="text-xs text-slate-400 mt-0.5">心当たりがある場合は今年から対策を始めましょう</p>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-red-100">
              {FAIL_PATTERNS.map(p => (
                <div key={p.title} className="px-6 py-4">
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="text-lg">{p.icon}</span>
                    <p className="text-sm font-semibold text-slate-700">{p.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed ml-7">→ {p.solution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 引き継ぎ手順 */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">引き継ぎを成功させる5ステップ</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {howToJsonLd.step.map((step, i) => (
                <div key={step.name} className="px-6 py-4 flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{step.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 引き継ぎ文書5点 */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">引き継ぎ文書に必要な5つの項目</h2>
              <p className="text-xs text-slate-400 mt-0.5">この5点が揃えば、初めての担当者でも最低限動けます</p>
            </div>
            <div className="divide-y divide-slate-100">
              {HANDOVER_DOCS.map(doc => (
                <div key={doc.num} className="px-6 py-5 flex items-start gap-4">
                  <span className="text-xs font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg shrink-0 font-mono">
                    {doc.num}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-2">{doc.title}</p>
                    <ul className="space-y-1">
                      {doc.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="w-1 h-1 rounded-full bg-indigo-300 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
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
              {faqJsonLd.mainEntity.map(qa => (
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
                { href: '/features/budget',    emoji: '💰', title: '予算・費用管理ガイド',     desc: '費用項目・予算策定手順' },
                { href: '/features/equipment', emoji: '📦', title: 'イベント備品リスト',        desc: 'カテゴリ別備品チェックリスト' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="group px-5 py-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">{item.emoji} {item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-xl">🔁</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">来年の担当者がゼロから悩まない仕組みを作る</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">「イベント開催ナビ」ならタスク・タイムテーブル・備品・予算・連絡先をクラウドで一元管理。今年のデータをそのまま来年の担当者に引き継げます。</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/try" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors">登録なしで今すぐ試す</Link>
                <Link href="/signup" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white transition-colors">無料アカウントを作成</Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
