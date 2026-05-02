import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベント準備チェックリスト｜開催までの手順と準備項目',
  description: '地域・学校・職場でイベントを開催するための準備チェックリスト。企画から当日運営・後片付けまで、やること・確認事項を一覧でまとめました。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/checklist' },
  openGraph: {
    title: 'イベント準備チェックリスト｜開催までの手順と準備項目 | イベント開催ナビ',
    description: '地域・学校・職場でイベントを開催するための準備チェックリスト。企画から当日運営・後片付けまで、やること・確認事項を一覧でまとめました。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: 'イベント準備チェックリスト', item: 'https://event-helper.picoton.com/features/checklist' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'イベントを開催する手順',
  description: '地域・学校・職場のイベントを成功させるための準備手順と確認項目。',
  url: 'https://event-helper.picoton.com/features/checklist',
  step: [
    {
      '@type': 'HowToStep',
      name: '企画・立案（開催3〜6か月前）',
      text: '目的・テーマ・ターゲットを決め、開催日程と予算の大枠を確定する。会場候補を選定し仮押さえを行う。',
    },
    {
      '@type': 'HowToStep',
      name: '会場・外部委託の確定（開催2〜3か月前）',
      text: '会場と契約し、必要に応じて音響・映像・飲食・保険などの外部委託先を選定・契約する。',
    },
    {
      '@type': 'HowToStep',
      name: '告知・集客（開催1〜2か月前）',
      text: 'チラシ・SNS・メール・ポスターなどで告知を開始。参加申込の受付方法を整備する。',
    },
    {
      '@type': 'HowToStep',
      name: 'スタッフ・役割分担（開催1か月前）',
      text: 'スタッフの人数と役割を確定し、タイムテーブルと会場レイアウト図を作成する。必要な備品リストを整理する。',
    },
    {
      '@type': 'HowToStep',
      name: '最終確認・リハーサル（開催1〜2週間前）',
      text: '参加者数を集計し、備品・資材の発注・手配を完了させる。スタッフへの最終連絡と当日マニュアルを配布する。',
    },
    {
      '@type': 'HowToStep',
      name: '当日運営',
      text: '開場前に会場設営・機材確認を行い、タイムテーブルに沿って進行する。問題発生時の対応窓口を明確にしておく。',
    },
    {
      '@type': 'HowToStep',
      name: '後片付け・振り返り',
      text: '会場の原状回復・借用品の返却を行い、収支報告と参加者アンケートをまとめて次回に備える。',
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'イベント準備はどのくらい前から始めるべきですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '規模によりますが、一般的に小規模（〜50人）なら1〜2か月前、中規模（50〜300人）なら3〜4か月前、大規模（300人以上）なら半年〜1年前から準備を始めることが推奨されます。会場の予約は特に早めに動くことが重要です。',
      },
    },
    {
      '@type': 'Question',
      name: 'イベント当日に必要な備品は何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '基本的な備品として、受付用の机・椅子・名札、案内看板、筆記用具、延長コード、ゴミ袋、救急セット、マスク・消毒液などが挙げられます。イベントの種類によって音響機器、プロジェクター、テーブルクロスなどを追加します。',
      },
    },
    {
      '@type': 'Question',
      name: 'イベントのスタッフは何人必要ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '参加者20〜30人につき1人のスタッフが目安です。受付・会場誘導・司会進行・撮影・緊急対応など、役割ごとに担当者を決めておくとスムーズに運営できます。',
      },
    },
    {
      '@type': 'Question',
      name: 'イベントの予算はどう組めばよいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '会場費・機材費・備品費・人件費・印刷費・広告費・食費・保険料などの項目を洗い出し、収入（参加費・協賛）と支出のバランスを確認します。予備費として総予算の10〜15%を確保しておくことをおすすめします。',
      },
    },
    {
      '@type': 'Question',
      name: '引き継ぎをうまくするコツは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '準備リスト・タイムテーブル・連絡先・予算・備品リストをまとめたイベント記録を残しておくことが重要です。クラウドツールを使えば次の担当者がそのまま利用でき、毎年の「1から作り直し」を防げます。',
      },
    },
  ],
}

type Phase = {
  phase: string
  icon: string
  timing: string
  items: string[]
}

const CHECKLIST: Phase[] = [
  {
    phase: '企画・立案',
    icon: '💡',
    timing: '3〜6か月前',
    items: [
      'イベントの目的・テーマを決める',
      'ターゲット（対象者・想定人数）を設定する',
      '開催日程の候補を出す',
      '概算予算を立てる',
      '会場候補を選定し仮押さえする',
      '必要な許可申請・届出を確認する（道路使用許可など）',
    ],
  },
  {
    phase: '体制づくり',
    icon: '👥',
    timing: '2〜3か月前',
    items: [
      '実行委員会・スタッフ体制を決める',
      '役割分担と責任者を明確にする',
      '会場との本契約を行う',
      '外部委託先（音響・映像・飲食等）を選定・契約する',
      '保険加入を検討する（賠償責任保険など）',
      '予算を詳細に組む',
    ],
  },
  {
    phase: '告知・集客',
    icon: '📢',
    timing: '1〜2か月前',
    items: [
      'チラシ・ポスターを作成・配布する',
      'SNS・メール・ウェブサイトで告知する',
      '参加申込の受付方法を整備する（フォーム等）',
      '協賛・後援の依頼を行う',
      '参加者への事前案内文を準備する',
    ],
  },
  {
    phase: '準備・手配',
    icon: '📋',
    timing: '2〜4週間前',
    items: [
      'タイムテーブル（当日スケジュール）を作成する',
      '会場レイアウト図を作成する',
      '備品リストを作成・手配する',
      'スタッフへのマニュアルを作成する',
      '参加者名簿・受付シートを準備する',
      '緊急時対応フロー・連絡先リストを整備する',
    ],
  },
  {
    phase: '最終確認',
    icon: '✅',
    timing: '1週間前〜前日',
    items: [
      '参加者数を最終集計する',
      'スタッフ全員に最終連絡をする',
      '備品・資材の搬入方法を確認する',
      'リハーサルを行う（必要な場合）',
      '天気予報を確認し、雨天対策を行う（屋外の場合）',
      '当日の持ち物リストを確認する',
    ],
  },
  {
    phase: '当日運営',
    icon: '🎉',
    timing: '当日',
    items: [
      '開場前に会場設営・機材チェックを行う',
      '受付・誘導体制を確認する',
      'タイムテーブルに沿って進行する',
      '写真・記録を残す',
      'ゴミの分別・廃棄ルールを守る',
      '閉会後の原状回復を行う',
    ],
  },
  {
    phase: '後片付け・振り返り',
    icon: '📊',
    timing: '終了後1〜2週間',
    items: [
      '借用品を期限内に返却する',
      '収支報告書をまとめる',
      '参加者アンケートを集計・分析する',
      'スタッフへの労いと振り返りMTGを行う',
      '次回開催に向けた改善点をまとめて記録する',
    ],
  },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'イベント準備チェックリスト｜開催までの手順と準備項目',
  description: '地域・学校・職場でイベントを開催するための準備チェックリスト。企画から当日運営・後片付けまで、やること・確認事項を一覧でまとめました。',
  url: 'https://event-helper.picoton.com/features/checklist',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function ChecklistPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full mb-4">
            準備ガイド
          </span>
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベント準備チェックリスト
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            企画から当日運営・後片付けまで、イベント開催のやること・確認事項を段階別にまとめました。
            漏れなく準備を進めるための完全ガイドです。
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            チェックリストをアプリで管理する
          </Link>
        </div>
      </section>

      {/* チェックリスト本体 */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

          {CHECKLIST.map((phase) => (
            <div key={phase.phase} className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                <span className="text-xl">{phase.icon}</span>
                <div>
                  <h2 className="text-base font-bold text-slate-800">{phase.phase}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{phase.timing}</p>
                </div>
              </div>
              <ul className="divide-y divide-slate-50">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 px-6 py-3">
                    <span className="mt-0.5 w-4 h-4 rounded border border-slate-300 shrink-0 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-sm bg-transparent" />
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* FAQ */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <span className="text-xl">❓</span>
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
                { href: '/features/timeline',     emoji: '⏱️', title: 'タイムテーブルの作り方',   desc: '当日進行表・時間配分' },
                { href: '/features/budget',       emoji: '💰', title: '予算・費用管理ガイド',     desc: '費用項目・予算策定手順' },
                { href: '/features/handover',     emoji: '🔁', title: 'イベント引き継ぎガイド',   desc: '来年担当者への引き継ぎ方法' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="group px-5 py-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">{item.emoji} {item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTAカード */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 text-xl">
              🗂️
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">
                チェックリストをクラウドで管理しませんか？
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」なら準備タスク・会場レイアウト・タイムテーブル・備品リストを一元管理。
                チームと共有して、来年もそのまま引き継げます。
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/try"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  登録なしで今すぐ試す
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white transition-colors"
                >
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
