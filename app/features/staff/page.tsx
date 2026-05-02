import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベントスタッフの役割分担ガイド',
  description: 'イベントスタッフの役割分担を解説。受付・進行・誘導・音響・撮影など8つの担当職種と必要人数の目安、スタッフ証の作り方、当日の動き方チェックリストつき。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/staff' },
  openGraph: {
    title: 'イベントスタッフの役割分担ガイド | イベント開催ナビ',
    description: 'イベントスタッフの役割分担を解説。8つの担当職種・必要人数の目安・当日チェックリストつき。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド一覧', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: 'スタッフの役割分担ガイド', item: 'https://event-helper.picoton.com/features/staff' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'イベントスタッフの役割分担を決める方法',
  description: 'スムーズな当日運営のためのスタッフ配置・役割分担の決め方5ステップ',
  step: [
    { '@type': 'HowToStep', position: 1, name: '必要な担当職種を洗い出す', text: 'イベントの内容・規模に合わせて必要な担当を列挙する。最低限必要なのは「全体進行（MC）」「受付」「会場誘導」の3役。音響・照明・撮影は専門知識が必要なため、外部委託も検討する。' },
    { '@type': 'HowToStep', position: 2, name: '必要人数を算出する', text: '参加者50人ごとにスタッフ1人が目安。受付は参加者100人あたり2〜3人、誘導は出入口・分岐点に1人ずつ配置。余裕を持って最低1名のフリー（何でも担当）を確保する。' },
    { '@type': 'HowToStep', position: 3, name: '担当者に役割説明と権限を伝える', text: '当日1週間前までに「担当職種」「担当エリア」「緊急時の判断権限」を書面で共有する。特にトラブル対応の判断者（責任者）を明確にしておく。' },
    { '@type': 'HowToStep', position: 4, name: 'スタッフ証・腕章を用意する', text: '参加者がスタッフを識別できるよう、首掛け証・腕章・ビブス・Tシャツなどでスタッフを視覚的に区別する。受付・誘導・救護など役割別に色を分けると混乱が減る。' },
    { '@type': 'HowToStep', position: 5, name: '当日の連絡体制を整える', text: '全スタッフの緊急連絡先を共有したグループLINEを事前に作成する。インカム・トランシーバーを使う場合はチャンネルを割り当てる。責任者への一報フローを明確にする。' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'イベントスタッフは何人必要ですか？',
      acceptedAnswer: { '@type': 'Answer', text: '参加者50人ごとにスタッフ1人が一般的な目安です。例えば参加者200人のイベントならスタッフ4〜6人が最低ライン。これに全体進行・音響・受付・誘導・撮影などの専門担当が加わります。外部委託（業者）と内部スタッフの役割分担を事前に整理することが重要です。' },
    },
    {
      '@type': 'Question',
      name: 'ボランティアスタッフを集めるにはどうすればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '地域イベントであれば①自治会・町内会の回覧板で募集 ②近隣の学校（高校・大学）にボランティア参加を依頼 ③地域のボランティアセンターに登録 の3つが主な方法です。活動内容・時間・交通費支給の有無を明記して募集すると集まりやすくなります。早めの募集（開催2〜3ヶ月前）が理想です。' },
    },
    {
      '@type': 'Question',
      name: 'スタッフ証はどうやって作ればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: 'WordやGoogleスライド、Canvaなどで簡単に作成できます。A6サイズ（A4を4分割）が扱いやすいです。記載内容は①イベント名 ②スタッフ氏名 ③担当役職 ④緊急連絡先（裏面）が基本です。ラミネート加工すると耐水性が上がり、首掛け用の穴をパンチで開けてストラップを通せます。' },
    },
    {
      '@type': 'Question',
      name: '当日スタッフのシフト管理はどうすればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: 'Googleスプレッドシートや表形式で、時間帯×担当者のシフト表を作成します。タイムテーブル（進行表）と連動させて「〇時〜受付担当、〇時〜誘導担当に切り替え」のように役割の時間変更も明記します。スタッフ全員に共有し、前日までに確認してもらうことが重要です。' },
    },
    {
      '@type': 'Question',
      name: 'スタッフへの事前説明会（打ち合わせ）は必要ですか？',
      acceptedAnswer: { '@type': 'Answer', text: 'できる限り実施することを推奨します。特に①会場の動線確認 ②トラブル時の対応フロー ③緊急時の避難誘導の3点は実地（または図面上）で確認することで当日の対応速度が大きく変わります。参加が難しいスタッフには動画・資料で補完します。打ち合わせは開催1〜2週前が理想です。' },
    },
  ],
}

const ROLES = [
  {
    role: '全体進行（MC）',
    emoji: '🎤',
    required: '必須',
    count: '1〜2名',
    duties: ['開会・閉会の司会', 'プログラム進行の管理', '時間管理・アナウンス'],
    skills: 'マイク使用経験、落ち着いた対応力',
  },
  {
    role: '受付',
    emoji: '📋',
    required: '必須',
    count: '参加者100人に2〜3名',
    duties: ['参加者チェックイン', '資料・グッズの配布', '名簿管理・集計'],
    skills: '丁寧な接客、計数作業',
  },
  {
    role: '会場誘導',
    emoji: '🚦',
    required: '必須',
    count: '出入口・分岐点に各1名',
    duties: ['会場への案内', '座席・ブース誘導', '混雑コントロール'],
    skills: '方向感覚、コミュニケーション力',
  },
  {
    role: '音響・映像',
    emoji: '🔊',
    required: '規模による',
    count: '1〜2名',
    duties: ['マイク・スピーカー操作', 'BGM・SE再生', 'プロジェクター・スクリーン操作'],
    skills: '機材操作の基礎知識（外部委託も可）',
  },
  {
    role: '撮影・記録',
    emoji: '📷',
    required: '推奨',
    count: '1〜2名',
    duties: ['写真・動画撮影', '記録用コンテンツ作成', 'SNS投稿用素材収集'],
    skills: 'カメラ操作、編集ソフト基礎',
  },
  {
    role: '設営・撤収',
    emoji: '🪑',
    required: '必須',
    count: 'イベント規模による',
    duties: ['会場セッティング', '什器・備品の搬入出', '後片付け・原状回復'],
    skills: '体力、段取り力',
  },
  {
    role: '救護・安全',
    emoji: '🩺',
    required: '推奨',
    count: '1名以上',
    duties: ['救急箱の管理', '体調不良者の対応', '避難誘導リード'],
    skills: '救急処置の基礎（AED講習推奨）',
  },
  {
    role: '総合責任者',
    emoji: '🗝️',
    required: '必須',
    count: '1名',
    duties: ['全体の意思決定・判断', 'スタッフ間の調整', 'トラブル対応の最終判断'],
    skills: '全体把握力、冷静な判断力',
  },
]

const SIZE_GUIDE = [
  { size: '小規模（〜50人）', staff: '3〜5名', roles: '進行・受付・誘導は兼務可。撮影は参加者に依頼も可。' },
  { size: '中規模（50〜200人）', staff: '6〜10名', roles: '各担当を1名以上配置。音響・撮影は専任が望ましい。' },
  { size: '大規模（200人〜）', staff: '11名以上', roles: '担当ごとに複数名配置。外部スタッフ・業者との連携が必要。' },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'イベントスタッフの役割分担ガイド',
  description: 'イベントスタッフの役割分担を解説。受付・進行・誘導・音響・撮影など8つの担当職種と必要人数の目安、スタッフ証の作り方、当日の動き方チェックリストつき。',
  url: 'https://event-helper.picoton.com/features/staff',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function StaffPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <nav className="text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-slate-600">ホーム</Link>
            <span>/</span>
            <Link href="/features" className="hover:text-slate-600">ガイド一覧</Link>
            <span>/</span>
            <span className="text-slate-600">スタッフの役割分担</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">👥</span>
            <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">スタッフ運営</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベントスタッフの役割分担ガイド
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            スムーズな当日運営のためのスタッフ配置・役割分担の決め方を解説。8つの担当職種・規模別必要人数・スタッフ証の作り方・当日チェックリストつき。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-10">

          {/* 5ステップ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">役割分担を決める5ステップ</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: '必要な担当職種を洗い出す', body: 'イベントの内容・規模に合わせて必要な担当を列挙します。最低限必要なのは「全体進行（MC）」「受付」「会場誘導」の3役。音響・照明・撮影は専門知識が必要なため、外部委託も検討してください。' },
                { step: 2, title: '必要人数を算出する', body: '参加者50人ごとにスタッフ1人が目安。受付は参加者100人あたり2〜3人、誘導は出入口・分岐点に1人ずつ。余裕を持って最低1名のフリー（何でも担当）を確保します。' },
                { step: 3, title: '担当者に役割・権限を伝える', body: '当日1週間前までに「担当職種」「担当エリア」「緊急時の判断権限」を書面で共有します。特にトラブル対応の判断者（責任者）を明確にしておくことが重要です。' },
                { step: 4, title: 'スタッフ証・腕章を用意する', body: '参加者がスタッフを識別できるよう、首掛け証・腕章・ビブスなどで視覚的に区別します。受付・誘導・救護など役割別に色を分けると混乱が減ります。' },
                { step: 5, title: '当日の連絡体制を整える', body: '全スタッフの緊急連絡先を共有したグループLINEを事前に作成します。インカムを使う場合はチャンネルを割り当て、責任者への一報フローを明確にします。' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.step}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{s.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 役割一覧 */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">担当職種・役割一覧（8種類）</h2>
            <div className="space-y-3">
              {ROLES.map(r => (
                <div key={r.role} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.emoji}</span>
                      <p className="text-sm font-bold text-slate-800">{r.role}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.required === '必須' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{r.required}</span>
                      <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">{r.count}</span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 mb-1.5">主な担当業務</p>
                      <ul className="space-y-1">
                        {r.duties.map(d => (
                          <li key={d} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 mb-1.5">求められるスキル</p>
                      <p className="text-xs text-slate-600">{r.skills}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 規模別人数目安 */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">参加者規模別：スタッフ必要人数の目安</h2>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">規模</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">スタッフ数</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">配置のポイント</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SIZE_GUIDE.map(row => (
                    <tr key={row.size}>
                      <td className="px-4 py-3 font-medium text-slate-800">{row.size}</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">{row.staff}</td>
                      <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{row.roles}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* スタッフ証の作り方 */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-3">📛 スタッフ証の作り方（簡単3ステップ）</h2>
            <ol className="space-y-2">
              {[
                'WordやCanvaでA6サイズ（A4を4分割）のカードを作成。イベント名・氏名・担当役職を記載する',
                '役割別に背景色を変えると識別しやすい（例：受付=青、誘導=黄、救護=赤）',
                'ラミネート加工し、上部にパンチで穴をあけてネックストラップを通せば完成',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* 当日チェックリスト */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">当日スタッフ チェックリスト</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { phase: '集合時（開始2時間前）', items: ['スタッフ証・腕章の受け取り', 'タイムテーブルの再確認', '持ち場・担当エリアの確認', 'グループLINE・通信機器の確認'] },
                { phase: '開場前（開始30分前）', items: ['配置についているか確認', '設備・備品の最終チェック', '参加者名簿・資料の準備', '緊急時連絡先の確認'] },
                { phase: '開場中〜進行中', items: ['担当エリアから離れない', 'トラブルは即座に責任者へ報告', '定期的に隣の担当者と連絡', '体調不良者・迷子に注意'] },
                { phase: '終了後（撤収）', items: ['参加者の退場完了確認', '忘れ物・落とし物の確認', '備品・レンタル品の返却チェック', '次回担当者へのメモ作成'] },
              ].map(phase => (
                <div key={phase.phase} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-700">{phase.phase}</p>
                  </div>
                  <ul className="p-4 space-y-2">
                    {phase.items.map(item => (
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
                {
                  q: 'イベントスタッフは何人必要ですか？',
                  a: '参加者50人ごとにスタッフ1人が一般的な目安です。例えば参加者200人のイベントならスタッフ4〜6人が最低ライン。これに進行・音響・受付・誘導・撮影などの専門担当が加わります。外部委託と内部スタッフの役割分担を事前に整理することが重要です。',
                },
                {
                  q: 'ボランティアスタッフを集めるにはどうすればよいですか？',
                  a: '地域イベントであれば①自治会・町内会の回覧板で募集 ②近隣の学校（高校・大学）にボランティア参加を依頼 ③地域のボランティアセンターに登録 の3つが主な方法です。活動内容・時間・交通費支給の有無を明記して2〜3ヶ月前から募集するのが理想です。',
                },
                {
                  q: 'スタッフ証はどうやって作ればよいですか？',
                  a: 'WordやCanvaなどでA6サイズ（A4を4分割）のカードを作成できます。記載内容は①イベント名 ②スタッフ氏名 ③担当役職 ④緊急連絡先（裏面）が基本です。ラミネート加工してネックストラップを通せば完成。役割別に背景色を変えると識別しやすくなります。',
                },
                {
                  q: '当日スタッフのシフト管理はどうすればよいですか？',
                  a: 'Googleスプレッドシートで時間帯×担当者のシフト表を作成します。タイムテーブルと連動させて「〇時〜受付担当、〇時〜誘導担当に切り替え」のように役割変更も明記します。スタッフ全員に共有し、前日までに確認してもらうことが重要です。',
                },
                {
                  q: 'スタッフへの事前打ち合わせは必要ですか？',
                  a: 'できる限り実施することを推奨します。特に①会場の動線確認 ②トラブル時の対応フロー ③緊急時の避難誘導 の3点は実地（または図面上）で確認することで当日の対応速度が大きく変わります。参加が難しいスタッフには動画・資料で補完します。開催1〜2週前が理想です。',
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
                { href: '/features/timeline',  emoji: '⏱️', title: 'タイムテーブルの作り方',   desc: 'スタッフの動きを時間割で整理' },
                { href: '/features/checklist', emoji: '📋', title: 'イベント準備チェックリスト', desc: 'スタッフ準備を含む全手順' },
                { href: '/features/handover',  emoji: '🔁', title: 'イベント引き継ぎガイド',   desc: 'スタッフ情報の引き継ぎ方法' },
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
              <p className="text-sm font-bold text-slate-800 mb-1">スタッフ管理もアプリで一元化</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」ならスタッフのタスク割り当て・タイムテーブル・備品リストをクラウドで管理。チームと共有して当日の「誰が何をするか」を見える化できます。完全無料。
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
