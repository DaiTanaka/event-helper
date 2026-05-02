import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '学校行事・文化祭・体育祭の準備ガイド',
  description: '文化祭・体育祭・学習発表会・卒業式など学校行事の準備方法を解説。生徒参加型運営のコツ・PTA/保護者連携・行事別準備スケジュールと担当者チェックリストつき。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/school' },
  openGraph: {
    title: '学校行事・文化祭・体育祭の準備ガイド | イベント開催ナビ',
    description: '文化祭・体育祭・学習発表会・卒業式など学校行事の準備方法を解説。行事別準備スケジュール・担当者チェックリストつき。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド一覧', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: '学校行事・文化祭・体育祭の準備ガイド', item: 'https://event-helper.picoton.com/features/school' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '学校行事の準備手順',
  description: '学校行事をスムーズに開催するための準備ステップ',
  step: [
    { '@type': 'HowToStep', position: 1, name: '行事の目的・目標を確認する', text: '「生徒の自主性を育む」「保護者との交流を深める」「学年の絆を強める」など行事の目的を担当者間で共有する。目的が明確になると企画内容や配分予算の優先順位が決まりやすくなる。' },
    { '@type': 'HowToStep', position: 2, name: '年間行事カレンダーと日程を確定する', text: '他の行事・試験・部活動と重複しないよう学校全体のカレンダーと照合して日程を確定する。雨天対策が必要な屋外行事は予備日も設定する。' },
    { '@type': 'HowToStep', position: 3, name: '担当委員会・係を編成する', text: '生徒（実行委員・各係）と教員（顧問・担当）の役割分担を明確にする。生徒主体の行事ほど事前に権限と責任の範囲を決めておくことが重要。' },
    { '@type': 'HowToStep', position: 4, name: '予算・物品を確保する', text: '学校予算の申請締切に合わせて費用計画を立てる。物品は購入・レンタル・寄贈（保護者会）の3通りを検討する。外部業者を使う場合は2〜3社から見積を取る。' },
    { '@type': 'HowToStep', position: 5, name: '保護者・地域への案内を出す', text: '保護者向けプリントは行事の1ヶ月前を目安に配布する。来校者の増える行事では駐車場・入校手続きについても明記する。緊急連絡はClassiや学校メールを活用する。' },
    { '@type': 'HowToStep', position: 6, name: '前日・当日・撤収を管理する', text: '前日の会場設営・排水確認・音響テストを担当ごとにリスト化する。当日は集合時間・役割ごとの動き・緊急時フローをスタッフ全員で再確認してから開始する。' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '文化祭の準備はいつから始めるべきですか？',
      acceptedAnswer: { '@type': 'Answer', text: '本番の3〜4ヶ月前から始めるのが一般的です。実行委員・各クラス・部活動への周知、テーマ決め、予算申請は3ヶ月前までに完了するのが理想です。クラス展示・ステージ発表の内容決定は2ヶ月前、制作・練習は1ヶ月前から本格化します。' },
    },
    {
      '@type': 'Question',
      name: '体育祭の種目選びで気をつけることは何ですか？',
      acceptedAnswer: { '@type': 'Answer', text: '①全員参加できる種目を中心に構成する ②過度に激しい接触が生じる種目は安全面から見直す ③特定の生徒だけが活躍する種目に偏らないようにする ④雨天時でも体育館で実施できる種目を数種用意しておく、の4点が重要です。近年は体力差による格差を減らすため、チームワーク重視の種目を増やす学校が増えています。' },
    },
    {
      '@type': 'Question',
      name: '学校行事の準備で生徒の参加意欲を高めるには？',
      acceptedAnswer: { '@type': 'Answer', text: '①生徒が意思決定に参加できる場（アンケート・会議）を設ける ②担当委員に権限と責任を与えて「自分たちで作った」という達成感を持たせる ③準備過程の記録（写真・動画）を共有して進捗を見える化する ④生徒の頑張りを教員や保護者が具体的に称賛する、の4点が効果的です。' },
    },
    {
      '@type': 'Question',
      name: '保護者・PTAとの連携で大切なことは何ですか？',
      acceptedAnswer: { '@type': 'Answer', text: '①早めの情報共有（日程・役割依頼は2ヶ月前）②参加・協力をお願いする内容を明確にする（ボランティア内容・時間・持ち物）③当日の動線・受付・案内を事前に伝える ④行事後に感謝のお知らせと振り返りを共有する、の4点が保護者との良好な連携につながります。' },
    },
    {
      '@type': 'Question',
      name: '学校行事の引き継ぎはどうすればよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '①当年度の記録（タイムテーブル・予算・スタッフ配置・反省点）をデジタル文書でまとめる ②次年度担当者への引き継ぎ会を行事終了から1ヶ月以内に実施する ③業者や用品の発注先リスト（見積書含む）を保存する ④「うまくいったこと・改善したいこと」を別々にまとめておく、が有効です。クラウドで管理すると担当者が変わっても参照しやすくなります。' },
    },
  ],
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '学校行事・文化祭・体育祭の準備ガイド',
  description: '文化祭・体育祭・学習発表会・卒業式など学校行事の準備方法を解説。生徒参加型運営のコツ・PTA/保護者連携・行事別準備スケジュールと担当者チェックリストつき。',
  url: 'https://event-helper.picoton.com/features/school',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

const SCHOOL_EVENTS = [
  { name: '文化祭・学園祭', emoji: '🎨', prep: '3〜4ヶ月前', key: 'テーマ決め・クラス展示・ステージ発表・予算配分', tips: '生徒実行委員会が中心。教員は安全管理と予算管理を担う' },
  { name: '体育祭・運動会', emoji: '🏃', prep: '2〜3ヶ月前', key: '種目選定・チーム編成・競技ルール・当日の進行表', tips: '雨天時プランを必ず用意。熱中症対策（水分・日陰）を優先' },
  { name: '学習発表会', emoji: '🎤', prep: '2ヶ月前', key: '発表内容・練習スケジュール・会場設定・保護者案内', tips: '低学年は練習時間を短くして発表当日に集中できるように' },
  { name: '修学旅行', emoji: '🚌', prep: '6〜12ヶ月前', key: '旅行会社選定・行程・グループ分け・緊急時対応フロー', tips: 'アレルギー・持病・宗教への配慮を事前調査票で把握する' },
  { name: '入学式・卒業式', emoji: '🎓', prep: '2〜3ヶ月前', key: '式次第・来賓対応・会場設営・司会・保護者座席配置', tips: '式の長さは90分以内が目安。予行練習を必ず1〜2回実施' },
  { name: 'PTAバザー・おやじの会', emoji: '🛒', prep: '2ヶ月前', key: '出品物収集・価格設定・当日スタッフ・会計管理', tips: '食品販売は自治体の保健所への届出が必要な場合がある' },
]

export default function SchoolPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <nav className="text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-slate-600">ホーム</Link>
            <span>/</span>
            <Link href="/features" className="hover:text-slate-600">ガイド一覧</Link>
            <span>/</span>
            <span className="text-slate-600">学校行事準備ガイド</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏫</span>
            <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">学校行事</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            学校行事・文化祭・体育祭の準備ガイド
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            文化祭・体育祭・学習発表会・卒業式など学校行事の準備方法を解説。生徒参加型運営のコツ・保護者連携・行事別チェックリストまで。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-10">

          {/* 行事別一覧 */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">行事別 準備のポイント</h2>
            <div className="space-y-3">
              {SCHOOL_EVENTS.map(e => (
                <div key={e.name} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{e.emoji}</span>
                      <p className="text-sm font-bold text-slate-800">{e.name}</p>
                    </div>
                    <span className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">{e.prep}から準備</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 mb-1">主な準備項目</p>
                      <p className="text-xs text-slate-600">{e.key}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 mb-1">ポイント</p>
                      <p className="text-xs text-slate-600">{e.tips}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 準備の6ステップ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">学校行事 準備の6ステップ</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: '行事の目的・目標を確認する', body: '「生徒の自主性を育む」「保護者との交流を深める」「学年の絆を強める」など目的を担当者間で共有します。目的が明確になると企画内容・予算の優先順位が決まりやすくなります。' },
                { step: 2, title: '年間カレンダーと日程を確定する', body: '他の行事・試験・部活動と重複しないよう全体カレンダーと照合して日程を確定します。屋外行事は雨天予備日も設定しておきます。' },
                { step: 3, title: '担当委員会・係を編成する', body: '生徒（実行委員・各係）と教員（顧問・担当）の役割分担を明確にします。生徒主体の行事ほど権限と責任の範囲を事前に決めておくことが重要です。' },
                { step: 4, title: '予算・物品を確保する', body: '学校予算の申請締切に合わせて費用計画を立てます。外部業者を使う場合は2〜3社から見積を取り、保護者会からの協力も含めて計画します。' },
                { step: 5, title: '保護者・地域への案内を出す', body: '保護者向けプリントは行事の1ヶ月前を目安に配布します。来校者の増える行事では駐車場・入校手続きを明記し、Classiや学校メールも活用します。' },
                { step: 6, title: '前日・当日・撤収を管理する', body: '前日の会場設営・音響テスト・担当確認リストを整備します。当日は集合時間・役割・緊急時フローをスタッフ全員で再確認してから開始します。' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.step}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{s.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 当日チェックリスト */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">当日 担当別チェックリスト</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  role: '全体統括（教員）',
                  items: ['全スタッフ・生徒の配置確認', '来賓・保護者対応の最終確認', '緊急時連絡フローの共有', '医務・救護担当の確認'],
                },
                {
                  role: '受付・誘導',
                  items: ['来場者名簿・プログラムの準備', '案内看板・誘導矢印の設置', '入場制限・整理券の管理', '迷子・忘れ物対応の準備'],
                },
                {
                  role: '音響・映像',
                  items: ['マイク・スピーカーの音量確認', 'BGM・効果音の再生テスト', 'スクリーン・プロジェクター確認', 'トラブル時のバックアップ機材'],
                },
                {
                  role: '安全管理',
                  items: ['救急箱・AEDの場所確認', '避難経路・出入口の確保', '熱中症対策（水分・日陰）確認', '不審者対応の連絡体制'],
                },
              ].map(cat => (
                <div key={cat.role} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-blue-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-700">{cat.role}</p>
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
                { q: '文化祭の準備はいつから始めるべきですか？', a: '本番の3〜4ヶ月前から始めるのが一般的です。実行委員・各クラスへの周知、テーマ決め、予算申請は3ヶ月前までに完了するのが理想です。クラス展示・ステージ発表の内容決定は2ヶ月前、制作・練習は1ヶ月前から本格化します。' },
                { q: '体育祭の種目選びで気をつけることは何ですか？', a: '①全員参加できる種目を中心に構成する ②過度に激しい接触が生じる種目は安全面から見直す ③特定の生徒だけが活躍する種目に偏らないようにする ④雨天時でも体育館で実施できる種目を数種用意しておく、の4点が重要です。' },
                { q: '学校行事の準備で生徒の参加意欲を高めるには？', a: '①生徒が意思決定に参加できる場（アンケート・会議）を設ける ②担当委員に権限と責任を与えて「自分たちで作った」という達成感を持たせる ③準備過程の記録を共有して進捗を見える化する ④生徒の頑張りを教員や保護者が具体的に称賛する、の4点が効果的です。' },
                { q: '保護者・PTAとの連携で大切なことは何ですか？', a: '①早めの情報共有（日程・役割依頼は2ヶ月前）②参加・協力をお願いする内容を明確にする（ボランティア内容・時間・持ち物）③当日の動線・受付・案内を事前に伝える ④行事後に感謝のお知らせと振り返りを共有する、の4点が重要です。' },
                { q: '学校行事の引き継ぎはどうすればよいですか？', a: '①当年度の記録（タイムテーブル・予算・スタッフ配置・反省点）をデジタル文書でまとめる ②次年度担当者への引き継ぎ会を行事終了から1ヶ月以内に実施する ③業者や用品の発注先リストを保存する ④「うまくいったこと・改善したいこと」を別々にまとめておく、が有効です。' },
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
                { href: '/features/community-event', emoji: '🏮', title: '地域イベント開催ガイド',  desc: '自治会・PTA行事の企画〜当日まで' },
                { href: '/features/handover',      emoji: '🔁', title: 'イベント引き継ぎガイド',   desc: '来年度担当者へのスムーズな引き継ぎ' },
                { href: '/features/corporate',     emoji: '🏢', title: '社内イベント・懇親会ガイド', desc: '幹事のやることをステップで解説' },
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
              <p className="text-sm font-bold text-slate-800 mb-1">学校行事の準備をクラウドで管理</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」なら行事ごとにチェックリスト・タイムテーブル・備品リスト・予算を保存・共有。来年の担当者にそのまま引き継げます。完全無料。
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
