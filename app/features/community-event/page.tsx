import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '地域イベント・お祭り開催ガイド｜自治会・町内会の行事準備手順',
  description: '地域のお祭り・自治会・町内会行事の開催方法を解説。企画から当日運営まで準備手順と注意点をまとめました。道路使用許可・警察への届出・ボランティア募集のコツも紹介。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/community-event' },
  openGraph: {
    title: '地域イベント・お祭り開催ガイド｜自治会・町内会の行事準備手順 | イベント開催ナビ',
    description: '地域のお祭り・自治会・町内会行事の開催方法を解説。企画から当日運営まで準備手順と注意点をまとめました。道路使用許可・警察への届出・ボランティア募集のコツも紹介。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: '地域イベント・お祭り開催ガイド', item: 'https://event-helper.picoton.com/features/community-event' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '地域イベント・お祭りの開催手順',
  description: '自治会・町内会・NPOが地域のお祭りや行事を開催するための準備から当日運営までの手順。',
  url: 'https://event-helper.picoton.com/features/community-event',
  step: [
    {
      '@type': 'HowToStep',
      name: '企画会議・目的の確認（6〜12か月前）',
      text: '開催目的・テーマ・ターゲット（地域住民全般か子ども向けかなど）を確認し、開催日程の候補を出す。近隣の行事・学校行事と重ならないよう地域カレンダーを確認する。',
    },
    {
      '@type': 'HowToStep',
      name: '会場・許可申請の手続き（4〜6か月前）',
      text: '公共スペース・公園・道路を使用する場合は、道路使用許可（警察）・公園使用許可（市区町村）などの申請を早めに行う。飲食を提供する場合は保健所への相談も必要。',
    },
    {
      '@type': 'HowToStep',
      name: 'スタッフ・ボランティアの募集（3〜4か月前）',
      text: '自治会・町内会内での役割分担を決め、必要に応じてボランティアを公募する。役割ごとの担当者を明確にし、連絡網を整備する。',
    },
    {
      '@type': 'HowToStep',
      name: '外部委託・協賛の調整（2〜3か月前）',
      text: '出店者・芸能者・警備会社などの外部委託先を確定させる。協賛企業・団体への依頼は早めに行い、協賛金や物品提供の条件を文書で確認する。',
    },
    {
      '@type': 'HowToStep',
      name: '告知・集客（1〜2か月前）',
      text: '地域の回覧板・掲示板・SNS・地域情報サイト・市区町村の広報誌などを活用して告知する。子ども向けは学校を通じた案内も有効。',
    },
    {
      '@type': 'HowToStep',
      name: '安全管理・緊急時対応の準備（2〜4週間前）',
      text: '救護所の設置・AED位置の確認・熱中症対策（夏季）・雨天対応プランを策定する。警備・誘導スタッフの配置計画を作成し、緊急連絡先一覧を全スタッフに配布する。',
    },
    {
      '@type': 'HowToStep',
      name: '当日運営・後片付け',
      text: 'タイムテーブルに沿って進行し、ゴミの分別・原状回復を徹底する。終了後は収支報告・振り返りを行い、来年度への引き継ぎ文書を作成する。',
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '地域のお祭りに必要な許可申請にはどんなものがありますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '主な申請として、①道路使用許可（警察署：道路でイベントを行う場合）、②公共施設・公園の使用許可（市区町村）、③飲食物の提供（保健所への相談・届出）、④拡声器・音響設備の使用（自治体・警察への届出が必要な場合）があります。開催の3〜6か月前に各担当窓口に相談することをおすすめします。',
      },
    },
    {
      '@type': 'Question',
      name: 'ボランティアスタッフはどう募集すればよいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '自治会・町内会内での声がけに加え、地域のボランティアセンター、社会福祉協議会、大学のボランティアサークル、地域SNSグループなどを活用できます。募集の際は「何をするか・何時間か・特別なスキルが必要か」を明記し、交通費や食事の提供有無も伝えると応募が集まりやすくなります。',
      },
    },
    {
      '@type': 'Question',
      name: '地域イベントの予算はどこから調達できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '①自治会・町内会の年間予算からの充当、②市区町村・都道府県の補助金・助成金（「地域づくり」「市民活動」「防災」などのテーマで公募されることが多い）、③地域企業・商店からの協賛、④参加費・出店料などの当日収入、⑤共同募金・寄付が主な財源です。助成金は申請締め切りが半年〜1年前のものも多いため、早めの情報収集が重要です。',
      },
    },
    {
      '@type': 'Question',
      name: '雨天の場合の対応はどう決めればよいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '①決行（雨でも実施）、②順延（翌日・翌週に延期）、③中止、の3パターンを事前に決め、判断基準（例：前日17時に予報で降水確率70%以上なら中止）を告知文に明記しておきます。延期の場合は会場・業者の再調整が必要なため、契約時に雨天対応について確認しておくことが重要です。',
      },
    },
    {
      '@type': 'Question',
      name: '地域イベントでの食品提供に必要な手続きは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '営利目的の飲食物販売は食品営業許可（または届出）が必要です。一般的な自治会の非営利的な模擬店は「食品販売届出」で対応できる場合がありますが、地域の保健所に相談してください。食品衛生責任者の配置、手洗い設備の確保、食材の温度管理なども求められます。',
      },
    },
  ],
}

type EventType = { name: string; examples: string[]; note: string }

const COMMUNITY_EVENT_TYPES: EventType[] = [
  { name: '夏祭り・盆踊り', examples: ['盆踊り大会', '縁日・模擬店', '花火観賞会', '浴衣コンテスト'], note: '熱中症対策・飲料水の確保が必須。夜間は照明設備の確認を' },
  { name: '運動会・スポーツ大会', examples: ['地域運動会', 'ミニマラソン', 'グラウンドゴルフ大会', 'ドッジボール大会'], note: '傷害保険への加入を強く推奨。医療スタッフまたは救護担当の配置を' },
  { name: 'フリーマーケット・マルシェ', examples: ['フリマ', '手作り市', '産直野菜マルシェ', 'クラフトフェア'], note: '出店者との事前契約・ルール共有が重要。雨天対応を事前に決めておく' },
  { name: '文化祭・展示会', examples: ['地域文化発表会', '写真展', '工芸品展示', 'お茶会・伝統芸能'], note: '展示品の保管・盗難対策が必要。入場人数の管理も考慮' },
  { name: '防災・安全イベント', examples: ['防災訓練', '消火体験', '救急講習', '防災スゴロク大会'], note: '自治体・消防署との連携で専門家の協力を得やすい' },
  { name: '子ども向けイベント', examples: ['子どもまつり', '工作教室', '読み聞かせ会', 'ハロウィンイベント'], note: '安全対策を最優先。保護者との連絡体制・迷子対応を事前に準備' },
]

const UNIQUE_POINTS = [
  { icon: '📋', title: '許可申請が必要な場合がある', body: '公道・公園・公共施設を使用する場合は、警察・市区町村への事前申請が必要です。申請には数か月かかることもあるため早めに動きましょう。' },
  { icon: '🤝', title: 'ボランティアと有償スタッフが混在する', body: '役割・待遇・指示系統を明確にしておかないとトラブルの原因になります。ボランティア保険への加入も検討してください。' },
  { icon: '💰', title: '補助金・助成金の活用チャンス', body: '地域活動を支援する助成金が多数あります。市区町村の「市民活動支援」「地域づくり」などの名称で公募されていることが多いです。' },
  { icon: '🌧️', title: '雨天・悪天候への対応が重要', body: '屋外イベントは雨天プランを事前に決めておかないと当日の判断が遅れます。「決行・順延・中止」の基準と発表方法を告知時から明示しましょう。' },
  { icon: '📢', title: '地域コミュニティを通じた告知が効果的', body: '回覧板・地域掲示板・自治会メーリングリスト・地域SNSグループなど、地域特有のチャネルを活用することで参加率が高まります。' },
  { icon: '🔁', title: '毎年開催の場合は引き継ぎが最大の課題', body: '担当者が変わっても「去年と同じ」を維持できるよう、準備資料・連絡先・ノウハウをデジタルで管理しておくことが鍵です。' },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '地域イベント・お祭り開催ガイド｜自治会・町内会の行事準備手順',
  description: '地域のお祭り・自治会・町内会行事の開催方法を解説。企画から当日運営まで準備手順と注意点をまとめました。道路使用許可・警察への届出・ボランティア募集のコツも紹介。',
  url: 'https://event-helper.picoton.com/features/community-event',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function CommunityEventPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-rose-700 bg-rose-100 px-3 py-1 rounded-full mb-4">
            地域イベントガイド
          </span>
          <div className="text-5xl mb-4">🏮</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            地域イベント・お祭り開催ガイド
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            自治会・町内会・地域団体が主催するお祭りや行事の準備手順を解説。
            許可申請・ボランティア募集・雨天対応など地域イベント特有のポイントも網羅しています。
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            地域イベントの準備を始める
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

          {/* 地域イベントの種類 */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">地域イベントの主な種類</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {COMMUNITY_EVENT_TYPES.map(et => (
                <div key={et.name} className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800 mb-1.5">{et.name}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {et.examples.map(ex => (
                      <span key={ex} className="text-xs bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full">{ex}</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{et.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 準備手順 */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">地域イベント開催の7ステップ</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {howToJsonLd.step.map((step, i) => (
                <div key={step.name} className="px-6 py-4 flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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

          {/* 地域イベント特有のポイント */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">地域イベント特有の注意点</h2>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {UNIQUE_POINTS.map(pt => (
                <div key={pt.title} className="px-6 py-5 flex items-start gap-3">
                  <span className="text-xl shrink-0">{pt.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">{pt.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{pt.body}</p>
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
                { href: '/features/school',    emoji: '🏫', title: '学校行事ガイド',            desc: '文化祭・体育祭・PTAの行事準備' },
                { href: '/features/corporate', emoji: '🏢', title: '社内イベント・懇親会ガイド', desc: '幹事のやることをステップで解説' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="group px-5 py-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">{item.emoji} {item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0 text-xl">🏮</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">地域イベントの準備をクラウドで一元管理</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">タスク・タイムテーブル・会場レイアウト・備品リスト・連絡先を一か所に集約。来年の担当者へもそのまま引き継げます。自治会・町内会・PTAの行事に最適です。</p>
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
