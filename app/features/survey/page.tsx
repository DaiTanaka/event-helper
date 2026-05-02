import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベントアンケートの作り方',
  description: 'イベント後のアンケートを効果的に設計するガイド。満足度・改善点・再参加意向を引き出す質問例つき。回収率を上げるコツ・Googleフォームの活用法・結果の活かし方まで解説。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/survey' },
  openGraph: {
    title: 'イベントアンケートの作り方 | イベント開催ナビ',
    description: 'イベント後のアンケートを効果的に設計するガイド。質問例・回収率アップのコツ・Googleフォーム活用法・結果の活かし方まで解説。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド一覧', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: 'イベントアンケートの作り方', item: 'https://event-helper.picoton.com/features/survey' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'イベントアンケートの作り方',
  description: '回答率が上がり、次回改善に使えるイベントアンケートを設計する5ステップ',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'アンケートの目的を決める', text: '「次回開催の判断材料にする」「コンテンツ改善に使う」「参加者ニーズを把握する」など、何のためにアンケートを取るかを先に決める。目的によって聞くべき設問が変わる。' },
    { '@type': 'HowToStep', position: 2, name: '設問数・形式を設計する', text: '設問は5〜10問以内に絞る。選択式（満足度5段階・複数選択）を中心に、自由記述は1〜2問にとどめる。設問が多いほど回答率が下がる。' },
    { '@type': 'HowToStep', position: 3, name: '回収方法を決める', text: '当日配布の紙アンケート、GoogleフォームやMicrosoft FormsのQRコード、メール送付の3方式がある。当日配布＋QRコードの併用が最も回収率が高い。' },
    { '@type': 'HowToStep', position: 4, name: '回答をお願いするタイミングを計画する', text: 'イベント終了直後（帰り際）が最も回答率が高い。退場時に紙を配るか、閉会の挨拶でQRコードを画面表示して誘導する。後日メール送付の場合は当日中に送ること。' },
    { '@type': 'HowToStep', position: 5, name: '結果を集計・活用する', text: '定量データ（満足度・参加動機）はグラフ化して共有する。自由記述はカテゴリ分けして頻出意見をピックアップする。結果は必ず次回企画の会議資料に含める。' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'イベントアンケートはいつ配るのが効果的ですか？',
      acceptedAnswer: { '@type': 'Answer', text: 'イベント終了直後（退場時・解散前）が最も回答率が高いタイミングです。紙アンケートは帰り際に配布し、会場出口や受付付近で記入・回収するのが効果的です。QRコードを使うデジタルアンケートは、閉会挨拶のタイミングでスクリーンに表示して参加者に案内します。後日メール送付の場合は当日中が最も回答率が高く、1週間後には大幅に低下します。' },
    },
    {
      '@type': 'Question',
      name: 'イベントアンケートに何問設問を入れるべきですか？',
      acceptedAnswer: { '@type': 'Answer', text: '5〜10問以内が目安です。設問数が増えるほど回答率が下がります。「全体満足度（5段階）」「参加動機（複数選択）」「内容への評価（複数選択）」「改善してほしい点（自由記述）」「次回参加意向（はい/いいえ）」の5問があれば基本的な分析は可能です。詳しく聞きたい場合でも15問を超えないようにしましょう。' },
    },
    {
      '@type': 'Question',
      name: 'アンケートの回収率を上げるには？',
      acceptedAnswer: { '@type': 'Answer', text: '①その場で記入・回収できる仕組みを作る ②設問数を10問以内に絞る ③回答時間の目安（「2分で回答できます」）を明示する ④記名不要・匿名であることを伝える ⑤閉会挨拶でアンケートの重要性を説明する、の5点が特に効果的です。紙アンケートではペンを用意すること、デジタルアンケートではQRコードを大きく表示することも大切です。' },
    },
    {
      '@type': 'Question',
      name: '無料で使えるアンケートツールはありますか？',
      acceptedAnswer: { '@type': 'Answer', text: 'Googleフォーム（完全無料・Googleアカウントがあれば即使用可）が最もよく使われます。回答はGoogleスプレッドシートに自動集計され、グラフも自動生成されます。Microsoft Formsも無料で使いやすい選択肢です。QRコードはGoogleフォームのURLをQRコード生成サイト（例：QRコード生成）で作成できます。' },
    },
    {
      '@type': 'Question',
      name: 'アンケートの結果はどのように活用すればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '①満足度スコアは次回目標値として設定する ②自由記述のネガティブ意見はカテゴリ分けして頻度順に並べ、優先改善項目を決める ③「次回も参加したい」比率は事業継続の判断材料にする ④参加動機のデータは次回の告知媒体・メッセージ選定に活かす ⑤結果サマリーはスタッフと共有し、来年の引き継ぎ資料に含める、の5点が実践的な活用方法です。' },
    },
  ],
}

const QUESTION_EXAMPLES = [
  {
    category: '全体評価',
    emoji: '⭐',
    questions: [
      { type: '5段階評価', text: 'このイベントに全体的にどのくらい満足しましたか？（1＝不満〜5＝満足）' },
      { type: 'はい/いいえ', text: '来年も同じようなイベントが開催されたら参加したいですか？' },
    ],
  },
  {
    category: '参加動機・認知経路',
    emoji: '📣',
    questions: [
      { type: '複数選択', text: 'このイベントをどこで知りましたか？（SNS / チラシ / 口コミ / 学校・職場 / その他）' },
      { type: '複数選択', text: '参加を決めた一番の理由は？（内容に興味 / 無料 / 知人に誘われた / その他）' },
    ],
  },
  {
    category: 'コンテンツ評価',
    emoji: '🎯',
    questions: [
      { type: '複数選択', text: '特によかったプログラムを教えてください。（選択肢：各コンテンツ名）' },
      { type: '5段階評価', text: 'スタッフの対応はいかがでしたか？（1〜5）' },
    ],
  },
  {
    category: '改善・要望',
    emoji: '💬',
    questions: [
      { type: '自由記述', text: '改善してほしい点や次回への要望があればご記入ください。' },
      { type: '自由記述', text: 'その他、ご意見・ご感想があればご自由にお書きください。' },
    ],
  },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'イベントアンケートの作り方',
  description: 'イベント後のアンケートを効果的に設計するガイド。満足度・改善点・再参加意向を引き出す質問例つき。回収率を上げるコツ・Googleフォームの活用法・結果の活かし方まで解説。',
  url: 'https://event-helper.picoton.com/features/survey',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function SurveyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <nav className="text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-slate-600">ホーム</Link>
            <span>/</span>
            <Link href="/features" className="hover:text-slate-600">ガイド一覧</Link>
            <span>/</span>
            <span className="text-slate-600">アンケートの作り方</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📊</span>
            <span className="inline-block text-xs font-semibold text-violet-700 bg-violet-100 px-3 py-1 rounded-full">事後評価・改善</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベントアンケートの作り方
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            回答率が上がり、次回改善に使えるアンケートの設計方法を解説。質問例・回収のコツ・Googleフォーム活用法・結果の活かし方まで。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-10">

          {/* 5ステップ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">アンケート設計の5ステップ</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: 'アンケートの目的を決める', body: '「次回開催の判断材料にする」「コンテンツ改善に使う」「参加者ニーズを把握する」など、何のためにアンケートを取るかを先に決めます。目的によって設問内容が変わります。' },
                { step: 2, title: '設問数・形式を設計する', body: '設問は5〜10問以内に絞ります。選択式（満足度5段階・複数選択）を中心に、自由記述は1〜2問。設問が多いほど回答率が下がります。' },
                { step: 3, title: '回収方法を決める', body: '①当日配布の紙アンケート ②GoogleフォームのQRコードで当日デジタル回収 ③イベント後メール送付 の3方式があります。当日配布＋QRコードの併用が最も回収率が高いです。' },
                { step: 4, title: '回答タイミングを計画する', body: 'イベント終了直後（退場時）が最も回答率が高いです。閉会挨拶でQRコードを画面表示するか、退場時に紙を配ります。後日メール送付の場合は当日中に送ること。' },
                { step: 5, title: '結果を集計・活用する', body: '満足度などの定量データはグラフ化して共有します。自由記述はカテゴリ分けして頻出意見をピックアップ。結果は必ず次回企画の会議資料に含めます。' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-violet-500 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.step}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{s.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 設問例 */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">カテゴリ別：設問例</h2>
            <p className="text-sm text-slate-500 mb-4">全部で5〜10問に絞るために、カテゴリごとに1〜2問を選んで使用してください。</p>
            <div className="space-y-4">
              {QUESTION_EXAMPLES.map(cat => (
                <div key={cat.category} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <p className="text-sm font-bold text-slate-800">{cat.category}</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {cat.questions.map((q, i) => (
                      <div key={i} className="px-5 py-3 flex items-start gap-3">
                        <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded shrink-0 mt-0.5">{q.type}</span>
                        <p className="text-sm text-slate-700">{q.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 回収率アップのコツ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">回収率を上げる5つのコツ</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'その場で回収できる仕組みを作る', body: '退場時に紙を配って出口で回収、またはQRコードを閉会時に大きくスクリーン表示。「持ち帰り後に提出」はほぼ回収できません。' },
                { title: '設問数を10問以内に絞る', body: '設問が多いほど途中離脱が増えます。「2分で答えられます」と伝えるだけで回答率が上がります。' },
                { title: '匿名であることを明示する', body: '「記名不要・匿名です」と明記するだけで自由記述の率直なコメントが増えます。' },
                { title: '記入道具を用意する', body: '紙アンケートにはペンを必ず添付します。「ペンがない」という理由で未回答になるケースが意外と多いです。' },
                { title: '閉会挨拶でアンケートを案内する', body: '「3分だけお時間をいただけますか」と挨拶の中で直接お願いすると、スルーされにくくなります。' },
              ].map((tip, i) => (
                <div key={i} className="p-4 rounded-xl border border-violet-100 bg-violet-50/40">
                  <p className="text-sm font-bold text-slate-800 mb-1">{tip.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Googleフォーム */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-3">Googleフォームで無料作成する手順</h2>
            <ol className="space-y-2">
              {[
                'Googleアカウントでログインし、forms.google.com を開く',
                '「＋ 新しいフォームを作成」を選択',
                '設問を追加（形式：選択式・チェックボックス・段落など）',
                '設定→「回答の収集先」でGoogleスプレッドシートと連携する',
                '送信→「リンク」タブからURLを取得し、QRコード生成サイトでQRコードを作成',
                '回答が集まったら「回答」タブでグラフを確認・CSVでエクスポート',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">よくある質問</h2>
            <div className="space-y-3">
              {[
                {
                  q: 'イベントアンケートはいつ配るのが効果的ですか？',
                  a: 'イベント終了直後（退場時・解散前）が最も回答率が高いタイミングです。紙アンケートは帰り際に配布し、出口付近で記入・回収するのが効果的。QRコードを使うデジタルアンケートは閉会挨拶のタイミングでスクリーンに表示します。後日メール送付の場合は当日中が最も高く、1週間後には大幅に低下します。',
                },
                {
                  q: '何問設問を入れるべきですか？',
                  a: '5〜10問以内が目安です。「全体満足度（5段階）」「参加動機（複数選択）」「内容への評価（複数選択）」「改善点（自由記述）」「次回参加意向（はい/いいえ）」の5問があれば基本的な分析は可能です。詳しく聞きたい場合でも15問を超えないようにしましょう。',
                },
                {
                  q: '回収率を上げるには？',
                  a: '①その場で記入・回収できる仕組みを作る ②設問数を10問以内に絞る ③回答時間の目安（「2分で回答できます」）を明示する ④記名不要・匿名であることを伝える ⑤閉会挨拶でアンケートの重要性を説明する、の5点が特に効果的です。',
                },
                {
                  q: '無料で使えるアンケートツールは？',
                  a: 'Googleフォーム（完全無料）が最もよく使われます。回答はGoogleスプレッドシートに自動集計され、グラフも自動生成されます。Microsoft Formsも無料で使いやすいです。QRコードはGoogleフォームのURLをQRコード生成サイトで変換するだけで作成できます。',
                },
                {
                  q: 'アンケートの結果はどう活用すればよいですか？',
                  a: '①満足度スコアを次回目標値として設定する ②自由記述のネガティブ意見をカテゴリ分けして優先改善項目を決める ③「次回も参加したい」比率は継続開催の判断材料にする ④参加動機のデータを次回告知媒体の選定に活かす ⑤結果サマリーをスタッフと共有し、引き継ぎ資料に含める、の5点が実践的です。',
                },
              ].map((item, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                    <span className="text-sm font-semibold text-slate-800">Q. {item.q}</span>
                    <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    A. {item.a}
                  </div>
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
                { href: '/features/handover',     emoji: '🔁', title: 'イベント引き継ぎガイド',   desc: 'アンケート結果も引き継ぎ資料へ' },
                { href: '/features/checklist',    emoji: '📋', title: 'イベント準備チェックリスト', desc: 'アンケート準備も含む全手順' },
                { href: '/features/announcement', emoji: '📢', title: 'イベント告知・案内文',       desc: '次回告知への活かし方' },
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
              <p className="text-sm font-bold text-slate-800 mb-1">アンケートの知見を次回イベントに活かす</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」ならアンケート結果をイベントレポートとして保存・引き継ぎが可能。来年の担当者にそのまま渡せます。完全無料。
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
