import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベントタイムテーブル（進行表）の作り方｜時間配分と注意点',
  description: 'イベントのタイムテーブル（当日進行表）の作成方法を解説。開会〜閉会までの時間配分の目安、バッファ設定のコツ、スタッフへの共有方法もまとめています。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/timeline' },
  openGraph: {
    title: 'イベントタイムテーブル（進行表）の作り方｜時間配分と注意点 | イベント開催ナビ',
    description: 'イベントのタイムテーブル（当日進行表）の作成方法を解説。開会〜閉会までの時間配分の目安、バッファ設定のコツ、スタッフへの共有方法もまとめています。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: 'タイムテーブル作成ガイド', item: 'https://event-helper.picoton.com/features/timeline' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'イベントのタイムテーブル（当日進行表）の作り方',
  description: '開会から閉会までの流れを時系列で整理し、スタッフ全員が共有できるタイムテーブルを作成する手順。',
  url: 'https://event-helper.picoton.com/features/timeline',
  step: [
    { '@type': 'HowToStep', name: 'イベント全体の所要時間を確認する', text: '会場の使用可能時間（搬入〜搬出）と、実際にプログラムを行う時間を分けて把握する。' },
    { '@type': 'HowToStep', name: 'プログラムの洗い出しと順序を決める', text: '開会・来賓挨拶・プログラム本体・休憩・閉会など、すべてのコマをリストアップし、論理的な流れで並べる。' },
    { '@type': 'HowToStep', name: '各コマに時間を割り当てる', text: 'プログラムの内容に応じて所要時間を設定し、合計時間が枠内に収まるか確認する。' },
    { '@type': 'HowToStep', name: 'バッファ時間を組み込む', text: '予定の変更・進行の遅れに備え、午前・午後それぞれに5〜10分のバッファを設ける。全体の10%が目安。' },
    { '@type': 'HowToStep', name: 'スタッフ担当者を割り当てる', text: '各コマに担当スタッフ・司会者・役割を明記し、全員が自分のアクションを確認できるようにする。' },
    { '@type': 'HowToStep', name: '事前にリハーサルで検証する', text: '本番1週間前までにタイムテーブルを使ったリハーサルを行い、実際の所要時間とのズレを確認・修正する。' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'タイムテーブルはいつまでに作ればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '本番の1〜2週間前には完成させ、スタッフ全員に配布するのが理想です。大規模なイベントでは1か月前に骨格を作り、参加者数が確定してから詳細を詰める2段階の作成が一般的です。' },
    },
    {
      '@type': 'Question',
      name: 'バッファ（余白時間）はどのくらい設けるべきですか？',
      acceptedAnswer: { '@type': 'Answer', text: '総プログラム時間の約10%を目安にしてください。3時間のイベントなら約20〜30分。午前・午後それぞれに分散させると対処しやすくなります。子ども向けや屋外イベントは特にバッファを多めに確保することをおすすめします。' },
    },
    {
      '@type': 'Question',
      name: '開会式・開会挨拶の時間はどのくらいが適切ですか？',
      acceptedAnswer: { '@type': 'Answer', text: '地域のお祭りや学校行事では5〜10分が一般的です。来賓が複数いる場合は事前に発言時間を伝えておきましょう。参加者が長い挨拶に飽きてしまわないよう、合計15分以内に収めることを推奨します。' },
    },
    {
      '@type': 'Question',
      name: '進行が遅れた場合はどう対処すればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: 'あらかじめ「削れるコマ（短縮可能なプログラム）」を決めておくことが重要です。司会者と事前に「〇〇分遅れたらBプランに切り替える」などの判断基準を共有しておくとスムーズです。閉会時刻は厳守することを優先してください。' },
    },
    {
      '@type': 'Question',
      name: 'タイムテーブルに記載すべき項目は何ですか？',
      acceptedAnswer: { '@type': 'Answer', text: '時刻（開始・終了）、プログラム名、担当者・司会者、場所・ステージ、備考（機材準備・転換作業など）が基本項目です。スタッフ用には担当者コールや準備開始時刻なども追記すると運営がスムーズになります。' },
    },
  ],
}

type TimeSlot = { time: string; duration: string; label: string; note: string; role: string }

const SAMPLE_TIMELINE: TimeSlot[] = [
  { time: '08:00', duration: '60分', label: '搬入・会場設営', note: 'スタッフのみ。会場レイアウト図に沿って設営', role: '設営班全員' },
  { time: '09:00', duration: '30分', label: '機材・音響チェック', note: 'マイク・プロジェクター・BGM確認', role: '音響担当' },
  { time: '09:30', duration: '30分', label: '受付スタッフ配置・最終確認', note: '受付シート・名札・案内資料の準備', role: '受付班' },
  { time: '10:00', duration: '10分', label: '開場・受付開始', note: '来場者誘導スタート', role: '受付・誘導班' },
  { time: '10:10', duration: '10分', label: '開会式・挨拶', note: '司会進行。来賓挨拶は5分以内', role: '司会' },
  { time: '10:20', duration: '70分', label: 'メインプログラム①', note: 'バッファ10分込み', role: '進行担当' },
  { time: '11:30', duration: '15分', label: '休憩', note: 'BGM流す。次のコマ準備', role: '進行担当・設営班' },
  { time: '11:45', duration: '60分', label: 'メインプログラム②', note: '', role: '進行担当' },
  { time: '12:45', duration: '10分', label: '閉会式・挨拶', note: '次回告知・アンケート案内', role: '司会' },
  { time: '12:55', duration: '35分', label: '後片付け・搬出', note: '原状回復。会場チェックリストで確認', role: 'スタッフ全員' },
  { time: '13:30', duration: '—', label: '完全退出', note: '会場返却', role: '責任者' },
]

const TIPS = [
  { icon: '⏱️', title: '「ざっくり時間」より「実測時間」で計画', body: '過去のイベント実績や類似イベントの実録を参考に、体感より少し長めの時間を設定する。初めての場合は必ずリハーサルで実測すること。' },
  { icon: '📌', title: '転換・準備時間を必ず入れる', body: 'プログラムの間に机を動かす・機材を切り替えるなどの転換作業がある場合、それ自体を独立したコマとして記載する。「暗黙の転換時間」は必ず遅延の原因になる。' },
  { icon: '🔄', title: 'AプランとBプランを用意する', body: '遅延が発生した場合に削れるコマ・短縮できるコマを「Bプラン」として司会者に事前共有しておく。判断は現場責任者が行えるよう権限を委譲しておく。' },
  { icon: '📤', title: '版管理をしっかり行う', body: 'タイムテーブルは更新のたびに「Ver.1.0 → Ver.1.1」のようにバージョン番号と更新日時を付記する。古いバージョンが混在するとスタッフ間の混乱につながる。' },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'イベントタイムテーブル（進行表）の作り方｜時間配分と注意点',
  description: 'イベントのタイムテーブル（当日進行表）の作成方法を解説。開会〜閉会までの時間配分の目安、バッファ設定のコツ、スタッフへの共有方法もまとめています。',
  url: 'https://event-helper.picoton.com/features/timeline',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function TimelinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-100 px-3 py-1 rounded-full mb-4">進行管理ガイド</span>
          <div className="text-5xl mb-4">⏱️</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベントタイムテーブル（進行表）の作り方
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            当日スムーズに進行するための時間割の作成方法。バッファの設け方・スタッフへの共有方法まで解説します。
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            タイムテーブルをアプリで管理する
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

          {/* 作成ステップ */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">タイムテーブル作成の6ステップ</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {howToJsonLd.step.map((step, i) => (
                <div key={step.name} className="px-6 py-4 flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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

          {/* サンプルタイムテーブル */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">サンプルタイムテーブル（半日イベント）</h2>
              <p className="text-xs text-slate-400 mt-0.5">3時間半・屋内イベントの例</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 w-16">時刻</th>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 w-14">時間</th>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500">内容</th>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 hidden sm:table-cell">担当</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {SAMPLE_TIMELINE.map(slot => (
                    <tr key={slot.time} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">{slot.time}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{slot.duration}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-700">{slot.label}</p>
                        {slot.note && <p className="text-xs text-slate-400 mt-0.5">{slot.note}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">{slot.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 実践のコツ */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">スムーズな進行のためのコツ</h2>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-50">
              {TIPS.map(tip => (
                <div key={tip.title} className="px-6 py-5 flex items-start gap-3">
                  <span className="text-xl shrink-0">{tip.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">{tip.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{tip.body}</p>
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
              <Link href="/features/venue-layout" className="group px-6 py-5 hover:bg-slate-50 transition-colors">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">🗺️ 会場レイアウト作成ガイド</p>
                <p className="text-xs text-slate-400 mt-1">配置パターン・動線設計の解説</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center shrink-0 text-xl">⏱️</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">タイムテーブルをクラウドで管理・共有</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">「イベント開催ナビ」のタイムテーブル機能ならコマの追加・並べ替えがかんたん。スタッフとリアルタイムで共有できます。</p>
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
