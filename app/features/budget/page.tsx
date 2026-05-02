import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベント予算・費用管理ガイド｜費用項目の内訳と予算の立て方',
  description: 'イベントの予算管理方法を解説。会場費・備品費・人件費・広告費など費用項目の内訳、予算策定の手順、収支管理のコツを地域・学校・職場のイベント担当者向けにまとめました。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/budget' },
  openGraph: {
    title: 'イベント予算・費用管理ガイド｜費用項目の内訳と予算の立て方 | イベント開催ナビ',
    description: 'イベントの予算管理方法を解説。会場費・備品費・人件費・広告費など費用項目の内訳、予算策定の手順、収支管理のコツを地域・学校・職場のイベント担当者向けにまとめました。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: '予算・費用管理ガイド', item: 'https://event-helper.picoton.com/features/budget' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'イベントの予算を立てる手順',
  description: 'イベント開催にかかる費用を整理し、収支の均衡が取れた予算計画を作成する方法。',
  url: 'https://event-helper.picoton.com/features/budget',
  step: [
    { '@type': 'HowToStep', name: 'イベントの規模と目的を確認する', text: '参加人数・開催時間・会場形式によって費用の大枠が変わるため、まず規模感を固める。' },
    { '@type': 'HowToStep', name: '収入の見込みを洗い出す', text: '参加費・協賛金・助成金・補助金・物品販売など、見込まれる収入源をすべて列挙し概算を出す。' },
    { '@type': 'HowToStep', name: '支出項目をすべて洗い出す', text: '会場費・機材費・備品費・人件費・印刷費・広告費・食費・保険料・交通費など、発生しうる費用をすべてリストアップする。' },
    { '@type': 'HowToStep', name: '各項目に金額を割り当てる', text: '過去の実績や見積もりをもとに各項目に金額を設定し、収支の合計を試算する。' },
    { '@type': 'HowToStep', name: '予備費を確保する', text: '予期せぬ出費に備え、総支出の10〜15%を予備費として確保する。予備費は「使わなければ黒字」と考える。' },
    { '@type': 'HowToStep', name: '承認を得てから発注・契約する', text: '予算案を上位者・委員会に提出し承認を得てから、会場・外部委託などの契約を行う。承認前の仮発注は後のトラブルのもと。' },
    { '@type': 'HowToStep', name: '実績を記録し収支報告書をまとめる', text: 'イベント終了後に実際の収支を集計し、翌年の予算策定に活かせるよう記録を残す。' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'イベント予算の目安はどのくらいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '規模によって大きく異なりますが、小規模（〜50人・半日）で数万〜30万円程度、中規模（100〜300人・1日）で50万〜200万円程度が目安です。会場費が最大の費用項目になることが多く、全体予算の30〜50%を占めるケースが多いです。' },
    },
    {
      '@type': 'Question',
      name: '参加費は何円に設定すればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '「(総支出 − 協賛・助成金) ÷ 参加予定人数」で最低収支トントンになる額を算出してください。地域のお祭りや学校行事では無料〜数百円、研修・セミナーでは数千〜数万円が一般的です。参加費を設定する場合は、キャンセルポリシーも合わせて定めておきましょう。' },
    },
    {
      '@type': 'Question',
      name: '協賛金・助成金を活用するには？',
      acceptedAnswer: { '@type': 'Answer', text: '地域の企業や団体からの協賛は、協賛メリット（看板掲載・パンフ記載・来賓席など）を具体的に示した提案書を持参すると獲得しやすいです。公的助成金は自治体・財団の公募情報を半年〜1年前から確認し、申請期限に余裕を持って準備してください。' },
    },
    {
      '@type': 'Question',
      name: 'コスト削減のポイントは何ですか？',
      acceptedAnswer: { '@type': 'Answer', text: '①会場：平日・午前開始・公共施設利用で安くなることが多い ②印刷：データ配布・SNS活用でチラシコスト削減 ③機材：購入よりレンタル、または会場備え付けを活用 ④食費：ケータリング・仕出しより弁当注文、またはお茶のみに絞るなどの工夫があります。' },
    },
    {
      '@type': 'Question',
      name: '領収書・経費の管理はどうすればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '支出が発生するたびに担当者名・日付・金額・用途を記録し、領収書と突き合わせて管理します。スプレッドシートや専用ツールを使い、承認者が確認できる状態にしておくことが重要です。会計報告は総会・引き継ぎ文書にも使えるよう保存してください。' },
    },
  ],
}

type ExpenseCategory = { category: string; emoji: string; items: { name: string; memo: string }[] }

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    category: '会場・設備費',
    emoji: '🏛️',
    items: [
      { name: '会場使用料', memo: '準備・撤去時間も含めた総時間で計算' },
      { name: '冷暖房・電気代', memo: '公共施設は別途請求される場合あり' },
      { name: '駐車場代', memo: '近隣の有料駐車場利用時' },
    ],
  },
  {
    category: '機材・レンタル費',
    emoji: '🎤',
    items: [
      { name: '音響（マイク・スピーカー）', memo: '会場備え付けの場合は無料のことも' },
      { name: '映像（プロジェクター・スクリーン）', memo: '解像度・輝度の確認を忘れずに' },
      { name: 'テーブル・椅子', memo: '会場に不足する分のレンタル' },
    ],
  },
  {
    category: '備品・消耗品費',
    emoji: '📦',
    items: [
      { name: '文具・筆記用具', memo: '受付・名札用など' },
      { name: 'ゴミ袋・清掃用品', memo: '会場ルールを確認' },
      { name: '装飾・看板', memo: '手作りかプロ発注かで費用が大きく変わる' },
    ],
  },
  {
    category: '印刷・制作費',
    emoji: '🖨️',
    items: [
      { name: 'チラシ・ポスター', memo: '部数・カラー印刷かで変動' },
      { name: 'パンフレット・プログラム', memo: '当日配布分' },
      { name: '看板・バナー', memo: '屋外用は耐水素材が必要' },
    ],
  },
  {
    category: '広告・集客費',
    emoji: '📢',
    items: [
      { name: 'SNS広告費', memo: 'ターゲットを絞ると費用対効果が上がる' },
      { name: 'メール配信サービス', memo: '無料プランで賄える場合も多い' },
      { name: '地域紙・回覧板掲載', memo: '多くの場合無料または低コスト' },
    ],
  },
  {
    category: '人件費・謝礼',
    emoji: '👥',
    items: [
      { name: '講師・出演者謝礼', memo: '交通費・宿泊費込みで設定するか確認' },
      { name: 'アルバイト・スタッフ費', memo: '時給×人数×時間で算出' },
      { name: '司会者費', memo: 'プロ依頼か内部対応かで大きく変わる' },
    ],
  },
  {
    category: '飲食費',
    emoji: '🍱',
    items: [
      { name: '参加者への飲食提供', memo: '人数×単価で算出。アレルギー対応も考慮' },
      { name: 'スタッフ弁当・飲料', memo: '長時間の場合は必須' },
      { name: '来賓・VIP接待', memo: '食事会・懇親会がある場合' },
    ],
  },
  {
    category: 'その他・予備費',
    emoji: '🛡️',
    items: [
      { name: 'イベント保険（賠償責任保険）', memo: '参加者50人以上の場合は加入を強く推奨' },
      { name: '交通費・宿泊費', memo: '遠方からの招聘がある場合' },
      { name: '予備費', memo: '総支出の10〜15%を目安に確保' },
    ],
  },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'イベント予算・費用管理ガイド｜費用項目の内訳と予算の立て方',
  description: 'イベントの予算管理方法を解説。会場費・備品費・人件費・広告費など費用項目の内訳、予算策定の手順、収支管理のコツを地域・学校・職場のイベント担当者向けにまとめました。',
  url: 'https://event-helper.picoton.com/features/budget',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function BudgetPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-4">予算管理ガイド</span>
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベント予算・費用管理ガイド
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            費用項目の洗い出し方から、収支バランスの取り方・コスト削減のコツまで。
            はじめてのイベント予算策定にも使える実践ガイドです。
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            予算をアプリで管理する
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

          {/* 予算策定ステップ */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">予算策定の7ステップ</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {howToJsonLd.step.map((step, i) => (
                <div key={step.name} className="px-6 py-4 flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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

          {/* 費用項目一覧 */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">費用項目チェックリスト</h2>
              <p className="text-xs text-slate-400 mt-0.5">見落としやすい項目も含め網羅的に洗い出してください</p>
            </div>
            <div className="divide-y divide-slate-100">
              {EXPENSE_CATEGORIES.map(cat => (
                <div key={cat.category} className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{cat.emoji}</span>
                    <h3 className="text-sm font-bold text-slate-700">{cat.category}</h3>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map(item => (
                      <div key={item.name} className="flex items-start gap-3 ml-1">
                        <span className="mt-1.5 w-3 h-3 rounded border border-slate-300 shrink-0" />
                        <div>
                          <span className="text-sm text-slate-700">{item.name}</span>
                          <span className="text-xs text-slate-400 ml-2">{item.memo}</span>
                        </div>
                      </div>
                    ))}
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
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <Link href="/features/checklist" className="group px-6 py-5 hover:bg-slate-50 transition-colors">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">📋 イベント準備チェックリスト</p>
                <p className="text-xs text-slate-400 mt-1">企画〜後片付けまでの全手順</p>
              </Link>
              <Link href="/features/timeline" className="group px-6 py-5 hover:bg-slate-50 transition-colors">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">⏱️ タイムテーブルの作り方</p>
                <p className="text-xs text-slate-400 mt-1">当日進行表の作成・時間配分</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 text-xl">💰</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">収支管理もアプリで一元化</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">「イベント開催ナビ」の予算管理機能で収入・支出を記録し、リアルタイムで収支を確認できます。来年の予算策定にもそのまま活用できます。</p>
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
