import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '社内イベント・懇親会・忘年会の幹事ガイド',
  description: '社内イベント・懇親会・忘年会・歓送迎会の幹事がやることをステップで解説。会場選び・参加費集め・タイムテーブル・盛り上がるゲームアイデア・欠席者対応まで。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/corporate' },
  openGraph: {
    title: '社内イベント・懇親会・忘年会の幹事ガイド | イベント開催ナビ',
    description: '社内イベント・懇親会・忘年会・歓送迎会の幹事がやることをステップで解説。会場選び・参加費集め・タイムテーブルまで。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド一覧', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: '社内イベント・懇親会・忘年会の幹事ガイド', item: 'https://event-helper.picoton.com/features/corporate' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '社内イベント・懇親会の幹事がやること',
  description: '懇親会・忘年会などの社内イベントを成功させるための幹事の準備手順',
  step: [
    { '@type': 'HowToStep', position: 1, name: '日程・参加者・予算を確認する', text: '上長・人事担当者と連携し、参加対象者・日程の候補・一人あたりの予算上限（会社負担と自己負担の比率）を確認する。日程調整にはLINEアンケートやGoogleフォームが便利。' },
    { '@type': 'HowToStep', position: 2, name: '会場を選んで予約する', text: '参加人数・予算・アクセスを軸に会場を2〜3件に絞ってから下見または電話確認する。飲食を伴う場合は食物アレルギーへの対応可否も確認する。会場は開催4〜8週前までに仮予約する。' },
    { '@type': 'HowToStep', position: 3, name: '参加確認と欠席者対応を行う', text: '参加・欠席の締切を明確にして全員に周知する。欠席者の多い理由（費用・日時・形式）を把握し、次回改善に活かす。参加費の集め方（事前振込・当日集金・経費精算）も事前に決める。' },
    { '@type': 'HowToStep', position: 4, name: 'タイムテーブルと進行を作る', text: '開会・乾杯・歓談・余興・締め（挨拶）の流れを時間割で作成する。余興・ゲームはルールを事前に準備して参加者全員が楽しめる内容にする。司会者を別に立てると幹事が場の管理に集中できる。' },
    { '@type': 'HowToStep', position: 5, name: '当日のオペレーションを管理する', text: '受付・座席案内・飲み物注文・支払い対応・写真撮影を担当別に割り当てる。会計は混雑する退場時ではなく席を立つ前に完了させると後処理がスムーズになる。' },
    { '@type': 'HowToStep', position: 6, name: '事後の精算・お礼・振り返りをする', text: '参加費の過不足精算・領収書の処理を翌営業日までに完了する。参加者への御礼メール（写真共有含む）は72時間以内に送ると印象がよい。次回幹事へ改善点を引き継ぐ。' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '忘年会・懇親会の幹事は何ヶ月前から準備すればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '人気の時期（12月・3〜4月）は会場が埋まりやすいため、2〜3ヶ月前から準備を始めるのが理想です。開催4〜6週前までに日程確定と会場仮予約、3週前に参加確認の締切、2週前に最終人数確定・会場本予約、1週前にタイムテーブル確定・連絡、というスケジュールが標準的です。' },
    },
    {
      '@type': 'Question',
      name: '参加率を上げるにはどうすればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '①参加費を安く設定する（会社補助を最大活用）②平日夜より金曜日・休前日を選ぶ ③参加が任意でも「全員で楽しいことをする」という雰囲気を作る ④早期申込み特典やペア参加の促進 ⑤事前にどんな内容か告知して興味を持ってもらう、の5点が効果的です。強制参加にするより自然に参加したくなる雰囲気作りが長期的に重要です。' },
    },
    {
      '@type': 'Question',
      name: '盛り上がる社内イベントのゲームやアイデアは？',
      acceptedAnswer: { '@type': 'Answer', text: '少人数（〜20人）では①クイズ（会社・メンバーにちなんだ問題）②ビンゴ大会 ③チームビルディングゲーム が定番です。大人数（20人〜）では①チーム対抗クイズ ②リレー式スピーチ ③大喜利 ④写真コンテスト が盛り上がります。重要なのは参加者全員が楽しめる「負荷の低い参加形式」を選ぶことです。' },
    },
    {
      '@type': 'Question',
      name: '社内イベントの参加費の相場はいくらですか？',
      acceptedAnswer: { '@type': 'Answer', text: '懇親会・忘年会の自己負担の相場は1人あたり2,000〜5,000円が一般的です。会社補助がある場合の自己負担はさらに下がります。歓送迎会では送り出す側（歓送）は参加費を抑え、迎える側（歓迎）は少し高めに設定することがあります。食事内容・会場・アルコールの有無によって幅があります。' },
    },
    {
      '@type': 'Question',
      name: '参加費の集め方はどれが一番スムーズですか？',
      acceptedAnswer: { '@type': 'Answer', text: '社内イベントでは①当日受付で現金集金 ②事前に口座振込（人数が多い場合） ③経費精算（会社補助分を後精算）の3方式が使われます。最もトラブルが少ないのは当日集金です。電子マネー（PayPay等）を使うと釣り銭不要でスムーズです。事前振込は未払い管理が必要になるため、少人数以外はあまりお勧めしません。' },
    },
  ],
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '社内イベント・懇親会・忘年会の幹事ガイド',
  description: '社内イベント・懇親会・忘年会・歓送迎会の幹事がやることをステップで解説。会場選び・参加費集め・タイムテーブル・盛り上がるゲームアイデア・欠席者対応まで。',
  url: 'https://event-helper.picoton.com/features/corporate',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

const EVENT_TYPES = [
  { name: '懇親会・交流会', emoji: '🍻', timing: '随時', notes: '新メンバー歓迎・プロジェクト打ち上げ・部署間交流。参加しやすい立食ビュッフェ形式が人気。' },
  { name: '忘年会・新年会', emoji: '🎉', timing: '11〜12月・1月', notes: '一年の締めくくりや新年の決意表明の場。スピーチ・表彰・余興・ゲームを組み込む。' },
  { name: '歓送迎会', emoji: '🌸', timing: '3〜4月・9月', notes: '退職・異動・入社の節目の会。送り出す人・迎える人を主役にした進行が重要。' },
  { name: 'チームビルディング', emoji: '🤝', timing: '随時', notes: 'ワークショップ・アウトドア・スポーツなど。日常の業務を離れた体験が連帯感を高める。' },
  { name: '社内運動会・スポーツ大会', emoji: '⚽', timing: '秋〜春', notes: '本格的な運動会から社内オリンピックまで。チーム編成の工夫で部署を超えた交流を促進。' },
  { name: '表彰式・キックオフ', emoji: '🏆', timing: '期初・期末', notes: '全社・部門の目標発表や成果表彰。式典的な進行の中にもエンタメ要素を入れると記憶に残る。' },
]

export default function CorporatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <nav className="text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-slate-600">ホーム</Link>
            <span>/</span>
            <Link href="/features" className="hover:text-slate-600">ガイド一覧</Link>
            <span>/</span>
            <span className="text-slate-600">社内イベント幹事ガイド</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏢</span>
            <span className="inline-block text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">社内イベント</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            社内イベント・懇親会・忘年会の幹事ガイド
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            懇親会・忘年会・歓送迎会・チームビルディングの幹事がやることをステップで解説。会場選び・参加費集め・タイムテーブル・盛り上がるゲームアイデアまで。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-10">

          {/* 社内イベント種別 */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">社内イベントの種類と特徴</h2>
            <div className="space-y-3">
              {EVENT_TYPES.map(e => (
                <div key={e.name} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                  <span className="text-2xl shrink-0">{e.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-800">{e.name}</p>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{e.timing}</span>
                    </div>
                    <p className="text-sm text-slate-600">{e.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6ステップ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">幹事のやること 6ステップ</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: '日程・参加者・予算を確認する', body: '上長・人事担当者と連携し、参加対象者・日程の候補・一人あたり予算上限（会社負担と自己負担の比率）を確認します。日程調整にはLINEアンケートやGoogleフォームが便利です。' },
                { step: 2, title: '会場を選んで予約する', body: '参加人数・予算・アクセスを軸に会場を2〜3件に絞って確認します。食物アレルギーへの対応可否も確認し、開催4〜8週前までに仮予約します。人気時期（12月・3〜4月）は特に早めに動きましょう。' },
                { step: 3, title: '参加確認と欠席者対応を行う', body: '参加・欠席の締切を明確にして全員に周知します。参加費の集め方（事前振込・当日集金・経費精算）も事前に決めておきます。' },
                { step: 4, title: 'タイムテーブルと進行を作る', body: '開会・乾杯・歓談・余興・締めの流れを時間割で作成します。余興・ゲームはルールを事前に準備して参加者全員が楽しめる内容にします。司会者を別に立てると幹事が場の管理に集中できます。' },
                { step: 5, title: '当日のオペレーションを管理する', body: '受付・座席案内・飲み物注文・支払い対応・写真撮影を担当別に割り当てます。会計は席を立つ前に完了させると後処理がスムーズです。' },
                { step: 6, title: '事後の精算・お礼・振り返りをする', body: '参加費の過不足精算・領収書の処理を翌営業日までに完了します。参加者への御礼メール（写真共有含む）は72時間以内に送ると印象がよいです。次回幹事へ改善点を引き継ぎましょう。' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-slate-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.step}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{s.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 幹事チェックリスト */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">幹事チェックリスト</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { phase: '4〜8週前', items: ['日程・参加対象者の確認', '予算上限の確認', '日程調整アンケートの送付', '会場の下見・仮予約'] },
                { phase: '2〜3週前', items: ['参加確認の締切・集計', '最終人数で会場本予約', '司会・余興の担当決め', 'タイムテーブルの作成'] },
                { phase: '1週前', items: ['全参加者への最終案内', '参加費集金の方法連絡', 'ゲーム・余興の準備', '会場へのレイアウト確認'] },
                { phase: '当日・翌日', items: ['受付・座席案内の実施', '進行・時間管理', '精算・領収書処理', 'お礼メール・写真共有'] },
              ].map(cat => (
                <div key={cat.phase} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-700">{cat.phase}</p>
                  </div>
                  <ul className="p-4 space-y-2">
                    {cat.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="w-3.5 h-3.5 border border-slate-300 rounded shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">よくある質問</h2>
            <div className="space-y-3">
              {[
                { q: '忘年会・懇親会の幹事は何ヶ月前から準備すればよいですか？', a: '人気の時期（12月・3〜4月）は会場が埋まりやすいため、2〜3ヶ月前から準備を始めるのが理想です。開催4〜6週前までに日程確定と会場仮予約、3週前に参加確認の締切、2週前に最終人数確定・会場本予約、1週前にタイムテーブル確定が標準的なスケジュールです。' },
                { q: '参加率を上げるにはどうすればよいですか？', a: '①参加費を安く設定する（会社補助を最大活用）②平日夜より金曜日・休前日を選ぶ ③「全員で楽しいことをする」という雰囲気を作る ④事前にどんな内容か告知して興味を持ってもらう ⑤強制ではなく自然に参加したくなる雰囲気作り、の5点が効果的です。' },
                { q: '盛り上がる社内イベントのゲームやアイデアは？', a: '少人数（〜20人）では①クイズ（会社・メンバーにちなんだ問題）②ビンゴ大会 ③チームビルディングゲーム が定番です。大人数（20人〜）では①チーム対抗クイズ ②リレー式スピーチ ③写真コンテスト が盛り上がります。参加者全員が楽しめる「負荷の低い参加形式」を選ぶことが重要です。' },
                { q: '社内イベントの参加費の相場はいくらですか？', a: '懇親会・忘年会の自己負担の相場は1人あたり2,000〜5,000円が一般的です。会社補助がある場合の自己負担はさらに下がります。食事内容・会場・アルコールの有無によって幅があります。' },
                { q: '参加費の集め方はどれが一番スムーズですか？', a: '最もトラブルが少ないのは当日集金です。PayPay等の電子マネーを使うと釣り銭不要でスムーズです。事前振込は未払い管理が必要になるため、少人数以外はあまりお勧めしません。経費精算は会社のルールに合わせて対応します。' },
              ].map((item, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                    <span className="text-sm font-semibold text-slate-800">Q. {item.q}</span>
                    <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">A. {item.a}</div>
                </details>
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
                { href: '/features/timeline',        emoji: '⏱️', title: 'タイムテーブルの作り方', desc: '懇親会の進行表・時間配分' },
                { href: '/features/community-event', emoji: '🏮', title: '地域イベント開催ガイド',  desc: '自治会・町内会行事の企画運営' },
                { href: '/features/school',          emoji: '🏫', title: '学校行事ガイド',          desc: '文化祭・体育祭・PTAの行事準備' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="group px-5 py-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">{item.emoji} {item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 text-xl">🗂️</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">懇親会・社内イベントの準備をアプリで管理</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」なら幹事のタスクリスト・タイムテーブル・予算・連絡先リストをクラウドで管理。次の幹事への引き継ぎもそのままできます。完全無料。
              </p>
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
