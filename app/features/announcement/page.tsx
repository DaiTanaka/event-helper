import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベント告知・案内文の書き方',
  description: 'イベントの告知文・案内文の書き方を徹底解説。SNS投稿・チラシ・メール・回覧板など媒体別の文例テンプレートつき。5W1Hを押さえた告知で集客力アップ。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/announcement' },
  openGraph: {
    title: 'イベント告知・案内文の書き方 | イベント開催ナビ',
    description: 'イベントの告知文・案内文の書き方を徹底解説。SNS投稿・チラシ・メール・回覧板など媒体別の文例テンプレートつき。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド一覧', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: 'イベント告知・案内文の書き方', item: 'https://event-helper.picoton.com/features/announcement' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'イベント告知・案内文の書き方',
  description: '集客に効果的なイベント告知文を作成するための5ステップ',
  step: [
    { '@type': 'HowToStep', position: 1, name: '5W1Hを整理する', text: 'When（いつ）・Where（どこで）・Who（誰が/誰向け）・What（何をする）・Why（なぜ開催）・How（参加方法）を先に書き出す。これが告知文の骨格になる。' },
    { '@type': 'HowToStep', position: 2, name: '媒体を選ぶ', text: 'ターゲット層に合わせて告知媒体を選択する。地域住民→回覧板・掲示板、保護者→学校プリント・LINE、一般公募→SNS・Webサイト。複数媒体を組み合わせると効果的。' },
    { '@type': 'HowToStep', position: 3, name: '告知文を作成する', text: 'タイトル（キャッチコピー）→日時・場所→内容の見どころ→参加方法・申込先の順で構成する。チラシは200字以内、SNSは140字以内を目安に。' },
    { '@type': 'HowToStep', position: 4, name: '告知タイミングを決める', text: '初回告知は開催の4〜6週前、リマインド告知は1〜2週前、当日朝に最終告知を行う。SNSは複数回投稿することで認知を拡げる。' },
    { '@type': 'HowToStep', position: 5, name: '問い合わせ先を明記する', text: '担当者名・連絡先（電話番号またはメールアドレス）・受付時間を必ず記載する。個人情報に配慮し、専用メールアドレスの利用を推奨。' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'イベントの告知はいつから始めるべきですか？',
      acceptedAnswer: { '@type': 'Answer', text: '規模にもよりますが、一般的には開催の4〜6週前から始めるのが目安です。大型イベントや遠方からの参加者が見込まれる場合は2〜3ヶ月前からの告知が効果的です。告知が遅れると参加者が予定を入れられないため、早めの発信を心がけましょう。' },
    },
    {
      '@type': 'Question',
      name: '告知文に必ず書くべき情報は何ですか？',
      acceptedAnswer: { '@type': 'Answer', text: '①イベント名・タイトル ②開催日時（年月日・曜日・開始〜終了時刻） ③開催場所（住所・アクセス方法） ④内容・見どころ ⑤対象者・参加資格 ⑥参加費（無料の場合も明記） ⑦申込方法・締切 ⑧問い合わせ先 の8項目は必須です。' },
    },
    {
      '@type': 'Question',
      name: 'SNSでイベント告知する際のコツは？',
      acceptedAnswer: { '@type': 'Answer', text: '①最初の一文でイベントの魅力を伝える ②日時・場所・参加方法をシンプルにまとめる ③画像・フライヤー画像を添付して視認性を高める ④ハッシュタグ（地域名＋イベント種別）を活用する ⑤開催1週間前と前日にもリマインド投稿を行う、の5点が特に効果的です。' },
    },
    {
      '@type': 'Question',
      name: '回覧板やプリントで告知する場合の注意点は？',
      acceptedAnswer: { '@type': 'Answer', text: '紙媒体では①文字サイズを10pt以上にして読みやすくする ②地図や写真を入れると参加意欲が上がる ③個人の携帯番号より団体・組織の連絡先を使う ④配布枚数と配布タイミングを担当者と事前調整する の4点に注意してください。プリントは持ち帰ってもらうよう、A4か三つ折りA4が扱いやすいサイズです。' },
    },
    {
      '@type': 'Question',
      name: '参加申込みはどの方法が一番集めやすいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '対象層によって最適な方法が異なります。高齢者・地域住民向けは電話受付が最も集まりやすいです。PTAや職場向けはLINEグループでの返信やGoogleフォームが便利です。一般公募はEventbriteやPeatixなどのイベント申込みツールを使うと管理が楽になります。参加者層に合わせて複数の申込み方法を用意するのが理想です。' },
    },
  ],
}

const MEDIA_TEMPLATES = [
  {
    media: 'SNS（X・Instagram）',
    emoji: '📱',
    points: ['140字以内でまとめる', '日時・場所を冒頭に', 'ハッシュタグ2〜4個', '画像・フライヤー添付'],
    example: '【告知】🎉〇〇地区夏まつり開催！\n📅 8月15日（土）15:00〜20:00\n📍 〇〇公園\n出店・盆踊り・花火あり。入場無料！\n詳細→ [URL]\n#〇〇市 #夏まつり',
  },
  {
    media: 'メール・LINE',
    emoji: '✉️',
    points: ['件名で内容がわかるように', '日時・場所を太字や箇条書きで', '申込リンクを目立たせる', '返信期限を明記'],
    example: '件名：【ご案内】○月○日 〇〇イベント開催のお知らせ\n\n〇〇様\n\n標記のイベントを下記のとおり開催します。\n■ 日時：○月○日（曜）○時〜\n■ 場所：〇〇\n■ 参加費：無料\n○月○日までにご返信ください。',
  },
  {
    media: 'チラシ・回覧板',
    emoji: '📄',
    points: ['タイトルを大きく目立たせる', 'A4/B5 1枚に収める', '地図・写真を入れる', '問い合わせ先を下部に'],
    example: '【タイトル大】\nイベント名\n\n日時：○月○日（曜）○時〜\n場所：〇〇（住所）\n\n内容：〈見どころ2〜3点〉\n参加費：無料\n申込：不要 / 事前申込制\n\nお問い合わせ：〇〇（TEL: xxx-xxxx）',
  },
]

const TIMING_STEPS = [
  { week: '4〜6週前', action: '初回告知', detail: 'チラシ配布・SNS初投稿・自治会回覧。参加者が予定を確保できるよう早めに。' },
  { week: '2〜3週前', action: '第2弾告知', detail: 'SNS再投稿・ポスター掲示・関係者へのメール。告知範囲を広げる。' },
  { week: '1週前', action: 'リマインド', detail: 'SNS・LINEグループでリマインド。申込締切の場合は再周知。' },
  { week: '前日〜当日朝', action: '最終告知', detail: 'SNS・LINEで当日の天気・集合場所・持ち物を再確認する投稿。' },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'イベント告知・案内文の書き方',
  description: 'イベントの告知文・案内文の書き方を徹底解説。SNS投稿・チラシ・メール・回覧板など媒体別の文例テンプレートつき。5W1Hを押さえた告知で集客力アップ。',
  url: 'https://event-helper.picoton.com/features/announcement',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function AnnouncementPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <nav className="text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-slate-600">ホーム</Link>
            <span>/</span>
            <Link href="/features" className="hover:text-slate-600">ガイド一覧</Link>
            <span>/</span>
            <span className="text-slate-600">告知・案内文の書き方</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📢</span>
            <span className="inline-block text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">告知・広報</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベント告知・案内文の書き方
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            集客を左右する告知文の書き方を解説。5W1Hの整理からSNS・チラシ・メールの媒体別テンプレート、告知タイミングまで。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-10">

          {/* 5ステップ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">告知文作成の5ステップ</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: '5W1Hを整理する', body: 'When（いつ）・Where（どこで）・Who（誰が/誰向け）・What（何をする）・Why（なぜ開催）・How（参加方法）を先に書き出す。これが告知文の骨格になります。' },
                { step: 2, title: '媒体を選ぶ', body: 'ターゲット層に合わせて告知媒体を選択します。地域住民→回覧板・掲示板、保護者→学校プリント・LINE、一般公募→SNS・Webサイト。複数媒体を組み合わせると効果的。' },
                { step: 3, title: '告知文を作成する', body: 'タイトル（キャッチコピー）→日時・場所→内容の見どころ→参加方法・申込先の順で構成します。チラシは200字以内、SNSは140字以内が目安。' },
                { step: 4, title: '告知タイミングを決める', body: '初回告知は開催の4〜6週前、リマインドは1〜2週前、当日朝に最終告知。SNSは複数回投稿することで認知が広がります。' },
                { step: 5, title: '問い合わせ先を明記する', body: '担当者名・連絡先（電話またはメール）・受付時間を必ず記載します。個人情報に配慮し、専用メールアドレスの利用を推奨します。' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.step}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{s.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 告知必須項目 */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">告知文に必ず含める8項目</h2>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-8">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">項目</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">記載例・注意点</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['1', 'イベント名・タイトル', '魅力が伝わるキャッチコピーを添えると効果的'],
                    ['2', '開催日時', '年月日・曜日・開始〜終了時刻をすべて記載'],
                    ['3', '開催場所', '住所・最寄り駅・駐車場の有無まで'],
                    ['4', '内容・見どころ', '参加者が「行きたい」と思う情報を3点以内で'],
                    ['5', '対象者・参加資格', '年齢制限・地域限定など条件があれば必ず明記'],
                    ['6', '参加費', '無料の場合も「参加費：無料」と明記する'],
                    ['7', '申込方法・締切', '申込不要な場合も「申込不要・当日参加可」と記載'],
                    ['8', '問い合わせ先', '担当者名・連絡先・受付時間を明記'],
                  ].map(([n, item, note]) => (
                    <tr key={n} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">{n}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{item}</td>
                      <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 媒体別テンプレート */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">媒体別：告知文テンプレート</h2>
            <div className="space-y-4">
              {MEDIA_TEMPLATES.map(t => (
                <div key={t.media} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                    <span className="text-lg">{t.emoji}</span>
                    <p className="text-sm font-bold text-slate-800">{t.media}</p>
                  </div>
                  <div className="p-5 grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">ポイント</p>
                      <ul className="space-y-1">
                        {t.points.map(p => (
                          <li key={p} className="flex items-start gap-1.5 text-sm text-slate-700">
                            <span className="text-sky-500 mt-0.5 shrink-0">✓</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">文例</p>
                      <pre className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed border border-slate-100">{t.example}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 告知タイミング */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">告知タイミングの目安</h2>
            <div className="space-y-2">
              {TIMING_STEPS.map(t => (
                <div key={t.week} className="flex gap-4 items-start p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-1 rounded shrink-0 w-20 text-center">{t.week}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-0.5">{t.action}</p>
                    <p className="text-sm text-slate-500">{t.detail}</p>
                  </div>
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
                  q: 'イベントの告知はいつから始めるべきですか？',
                  a: '規模にもよりますが、一般的には開催の4〜6週前から始めるのが目安です。大型イベントや遠方からの参加者が見込まれる場合は2〜3ヶ月前からの告知が効果的。告知が遅れると参加者が予定を入れられないため、早めの発信を心がけましょう。',
                },
                {
                  q: 'SNSでイベント告知する際のコツは？',
                  a: '①最初の一文でイベントの魅力を伝える ②日時・場所・参加方法をシンプルにまとめる ③画像・フライヤーを添付して視認性を高める ④ハッシュタグ（地域名＋イベント種別）を活用する ⑤開催1週間前と前日にもリマインド投稿する、の5点が特に効果的です。',
                },
                {
                  q: '参加申込みはどの方法が一番集めやすいですか？',
                  a: '対象層によって異なります。高齢者・地域住民は電話受付が最も集まりやすいです。PTAや職場はLINEグループでの返信やGoogleフォームが便利。一般公募はPeatixなどのイベントプラットフォームを使うと管理が楽になります。複数の申込み方法を用意するのが理想です。',
                },
                {
                  q: '無料イベントでも告知文に参加費を書くべきですか？',
                  a: '必ず「参加費：無料」と明記してください。無料と書いていないと参加者が迷って申込みをためらう原因になります。また「材料費のみ〇〇円」のように一部費用が発生する場合も、誤解を防ぐために明確に記載することが大切です。',
                },
                {
                  q: '告知チラシはどのサイズがよいですか？',
                  a: 'A4（210×297mm）またはA5（148×210mm）が最もよく使われます。回覧板や手渡しにはA4を二つ折りにしたA5サイズが扱いやすいです。掲示板に貼る場合はA4または大きめのA3が見やすくなります。デジタル配布（PDF・SNS）ではA4横またはInstagram向けの正方形フォーマットも使われます。',
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
                { href: '/features/checklist',    emoji: '📋', title: 'イベント準備チェックリスト', desc: '企画〜後片付けの全手順' },
                { href: '/features/community-event', emoji: '🏮', title: '地域イベント開催ガイド',   desc: '自治会・PTAのお祭り運営' },
                { href: '/features/handover',     emoji: '🔁', title: 'イベント引き継ぎガイド',   desc: '次回担当への5ドキュメント' },
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
              <p className="text-sm font-bold text-slate-800 mb-1">告知から当日まで、アプリで一元管理</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」ならチェックリスト・タイムテーブル・備品リスト・予算をクラウドで管理。チームと共有して告知漏れ・準備漏れをゼロに。完全無料。
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
