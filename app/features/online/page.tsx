import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'オンライン・ハイブリッドイベントの開き方',
  description: 'Zoom・Teams・YouTubeを使ったオンラインイベント・ハイブリッドイベントの開催方法を解説。配信ツール比較・画質・音声トラブル対策・参加者を飽きさせない進行のコツまで。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/online' },
  openGraph: {
    title: 'オンライン・ハイブリッドイベントの開き方 | イベント開催ナビ',
    description: 'Zoom・Teams・YouTubeを使ったオンラインイベント・ハイブリッドイベントの開催方法を解説。配信ツール比較・トラブル対策・進行のコツまで。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド一覧', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: 'オンライン・ハイブリッドイベントの開き方', item: 'https://event-helper.picoton.com/features/online' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'オンライン・ハイブリッドイベントの開き方',
  description: 'オンラインおよびハイブリッド形式のイベントを成功させるための7ステップ',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'オンライン／ハイブリッドを選択する', text: '参加者全員がオンラインなら「オンライン専用」、一部が会場参加なら「ハイブリッド」を選択。ハイブリッドは2会場の音声・映像連携が必要なため、準備コストが大幅に増える点を考慮する。' },
    { '@type': 'HowToStep', position: 2, name: '配信ツールを選ぶ', text: '双方向コミュニケーションが必要→Zoom/Teams、視聴者が多く一方向でよい→YouTube Live/Vimeo、社内向け少人数→Google Meet。無料枠と参加者上限・録画機能を比較して選ぶ。' },
    { '@type': 'HowToStep', position: 3, name: '機材・インターネット環境を整える', text: '最低限必要なのは①安定した有線インターネット（上り10Mbps以上推奨）②マイクつきWebカメラ（または外付けマイク＋カメラ）③照明。参加者が100名を超える場合はエンコーダーや外部音響機材の使用を検討する。' },
    { '@type': 'HowToStep', position: 4, name: 'リハーサルを必ず行う', text: '本番と同じ機材・回線・ツールで、本番の1〜3日前にリハーサルを実施する。特に①画面共有の切り替え ②BGM・SE再生 ③登壇者の音声確認 ④ハイブリッドの場合は会場スピーカーとオンライン音声の干渉確認 を重点的に確認する。' },
    { '@type': 'HowToStep', position: 5, name: '参加者への事前案内を送る', text: '開催3〜7日前に接続URLとあわせて①推奨ブラウザ・アプリのバージョン ②接続テスト用URLまたは時間 ③当日のトラブル連絡先 を案内する。初めてオンラインイベントに参加する方向けに接続手順の画像付きマニュアルを作成すると問い合わせが激減する。' },
    { '@type': 'HowToStep', position: 6, name: '当日の進行を工夫する', text: '画面越しでは集中力が30〜45分で下がる。①15〜20分ごとに休憩や質問タイムを挟む ②チャット・投票・アンケート機能を活用してインタラクションを増やす ③長い発表を複数の短いセッションに分割する。' },
    { '@type': 'HowToStep', position: 7, name: '録画・アーカイブを活用する', text: '配信を録画し、後日参加者に共有することで時間帯の制約で参加できなかった人にもコンテンツを届けられる。録画前に登壇者全員から同意を取得しておくこと。' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'オンラインイベントの開催に必要な機材は何ですか？',
      acceptedAnswer: { '@type': 'Answer', text: '最低限必要な機材は①安定したインターネット回線（有線接続・上り10Mbps以上推奨）②マイクつきWebカメラ（またはPCの内蔵カメラ＋外付けマイク）③照明（窓からの自然光でも可）です。100名以上の大規模配信では外部音響機材・エンコーダー・複数カメラが必要になります。' },
    },
    {
      '@type': 'Question',
      name: 'ZoomとYouTube Liveはどちらを使えばよいですか？',
      acceptedAnswer: { '@type': 'Answer', text: '双方向コミュニケーション（発言・質問・グループワーク）が必要なら Zoom が適しています。参加者が多く一方向での配信でよい場合（講演・式典・コンサートなど）はYouTube Liveが向いています。Zoomは無料版で参加者100人・40分の制限があります。YouTube Liveは参加者数に制限はありませんが、登録チャンネルが必要です。' },
    },
    {
      '@type': 'Question',
      name: 'ハイブリッドイベントとオンラインイベントの違いは何ですか？',
      acceptedAnswer: { '@type': 'Answer', text: 'オンラインイベントは全参加者がリモートで参加する形式です。ハイブリッドイベントは会場参加とオンライン参加が混在する形式で、両者が同じ体験を得られるよう音響・映像を双方向に繋ぐ必要があります。ハイブリッドは準備コストと技術的難易度がオンライン専用より高くなります。' },
    },
    {
      '@type': 'Question',
      name: 'オンラインイベントで参加者を飽きさせないコツは？',
      acceptedAnswer: { '@type': 'Answer', text: '①15〜20分ごとに休憩・質問タイムを入れる ②チャット・投票・リアクション機能を積極活用する ③カメラ越しでも表情豊かに話す ④スライドに動画や図を多く入れる ⑤グループワークやブレイクアウトルームを活用する ⑥BGMや効果音で雰囲気を作る、の6点が効果的です。' },
    },
    {
      '@type': 'Question',
      name: '配信中に音声・映像トラブルが起きたときはどう対処しますか？',
      acceptedAnswer: { '@type': 'Answer', text: '事前に①サブ機材（スマートフォンなど）でバックアップ接続できるよう準備する ②トラブル時のアナウンス文を用意する ③技術担当者を別に立てて進行者は進行に集中できるようにする、の3点を準備しておくことが重要です。音声が聞こえない場合は「チャットでご連絡ください」とスライドに表示しておくと参加者が混乱しません。' },
    },
  ],
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'オンライン・ハイブリッドイベントの開き方',
  description: 'Zoom・Teams・YouTubeを使ったオンラインイベント・ハイブリッドイベントの開催方法を解説。配信ツール比較・画質・音声トラブル対策・参加者を飽きさせない進行のコツまで。',
  url: 'https://event-helper.picoton.com/features/online',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

const TOOL_COMPARE = [
  { tool: 'Zoom', free: '100人・40分', paid: '300〜1000人', strong: '双方向・ブレイクアウト', weak: '無料版の時間制限' },
  { tool: 'Google Meet', free: '100人・60分', paid: '500〜1000人', strong: '無料で使いやすい', weak: '投票・ウェビナー機能なし' },
  { tool: 'Microsoft Teams', free: '100人・60分', paid: '300〜1000人', strong: 'Office連携・社内向け', weak: '社外参加者に手間' },
  { tool: 'YouTube Live', free: '無制限（公開）', paid: '（プランなし）', strong: '大規模配信・録画共有', weak: '一方向のみ・チャンネル必要' },
  { tool: 'Vimeo', free: '制限あり', paid: '〜5000人', strong: '高画質・プロ向け', weak: '有料プランのみ本格使用' },
]

export default function OnlinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <nav className="text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-slate-600">ホーム</Link>
            <span>/</span>
            <Link href="/features" className="hover:text-slate-600">ガイド一覧</Link>
            <span>/</span>
            <span className="text-slate-600">オンライン・ハイブリッドイベント</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">💻</span>
            <span className="inline-block text-xs font-semibold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">オンライン開催</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            オンライン・ハイブリッドイベントの開き方
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            Zoom・Teams・YouTube Liveを使ったオンラインイベントとハイブリッドイベントの開催方法を解説。配信ツールの比較からトラブル対策・進行のコツまで。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-10">

          {/* 形式の選択 */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">まず「形式」を選ぶ</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  type: 'オンライン専用',
                  emoji: '💻',
                  desc: '参加者全員がリモートで参加。準備が比較的シンプル。',
                  good: ['遠方からも参加しやすい', '会場費・移動費が不要', '録画・アーカイブが容易'],
                  care: ['対面より一体感が出にくい', 'ネット環境の差が出る'],
                  color: 'indigo',
                },
                {
                  type: 'ハイブリッド',
                  emoji: '🏟️',
                  desc: '会場参加＋オンライン参加が混在。両者を同時に運営する。',
                  good: ['対面の熱量とオンラインの広い参加を両立', '参加者の選択肢が増える'],
                  care: ['音声・映像の二重管理が必要', '準備コストが高い', '技術担当者が必須'],
                  color: 'amber',
                },
              ].map(f => (
                <div key={f.type} className={`rounded-xl border p-5 ${f.color === 'indigo' ? 'border-indigo-200 bg-indigo-50/40' : 'border-amber-200 bg-amber-50/40'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{f.emoji}</span>
                    <p className="text-sm font-bold text-slate-800">{f.type}</p>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{f.desc}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 mb-1">メリット</p>
                      {f.good.map(g => <p key={g} className="text-xs text-slate-600 flex gap-1"><span className="text-green-500">✓</span>{g}</p>)}
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 mb-1 mt-2">注意点</p>
                      {f.care.map(c => <p key={c} className="text-xs text-slate-600 flex gap-1"><span className="text-amber-500">!</span>{c}</p>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7ステップ */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">開催準備の7ステップ</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: 'オンライン／ハイブリッドを選択する', body: '参加者全員がオンラインなら「オンライン専用」、一部が会場参加なら「ハイブリッド」。ハイブリッドは準備コストが大幅に増える点を考慮して選択します。' },
                { step: 2, title: '配信ツールを選ぶ', body: '双方向コミュニケーションが必要→Zoom/Teams、視聴者が多く一方向でよい→YouTube Live/Vimeo、社内向け少人数→Google Meet。無料枠と参加者上限・録画機能を比較して選びます。' },
                { step: 3, title: '機材・インターネット環境を整える', body: '最低限必要なのは①有線インターネット（上り10Mbps以上推奨）②マイクつきWebカメラ③照明。100名超の場合はエンコーダーや外部音響機材の使用を検討します。' },
                { step: 4, title: 'リハーサルを必ず行う', body: '本番と同じ機材・回線・ツールで、1〜3日前にリハーサル実施。画面共有の切り替え・BGM再生・音声確認・ハイブリッドの場合は会場音とオンライン音の干渉確認を重点的に。' },
                { step: 5, title: '参加者への事前案内を送る', body: '3〜7日前に接続URLと①推奨ブラウザ・アプリのバージョン ②接続テスト情報 ③当日トラブル連絡先を送付。接続手順の画像付きマニュアルがあると問い合わせが激減します。' },
                { step: 6, title: '当日の進行を工夫する', body: '画面越しでは集中力が30〜45分で下がります。15〜20分ごとに休憩・質問タイムを挟み、チャット・投票・アンケート機能でインタラクションを増やします。' },
                { step: 7, title: '録画・アーカイブを活用する', body: '配信を録画し後日参加者に共有することで、時間帯の制約で参加できなかった人にもコンテンツを届けられます。録画前に登壇者全員から同意を取得しておくこと。' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.step}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{s.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ツール比較 */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">配信ツール比較</h2>
            <div className="rounded-xl border border-slate-200 overflow-x-auto">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">ツール</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">無料枠</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">有料上限</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">得意なこと</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">注意点</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TOOL_COMPARE.map(row => (
                    <tr key={row.tool} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-indigo-700">{row.tool}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{row.free}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{row.paid}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{row.strong}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{row.weak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 機材チェックリスト */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">機材・環境チェックリスト</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  cat: '必須機材',
                  items: ['安定した有線インターネット回線', 'マイクつきWebカメラ（またはPC内蔵）', '十分な照明（窓光・リングライト）', '配信ツール（最新バージョン）'],
                },
                {
                  cat: '推奨機材（100人以上）',
                  items: ['外付けコンデンサーマイク', 'HDMIキャプチャーカード', '外部モニター（資料確認用）', 'エンコーダーソフト（OBS等）'],
                },
                {
                  cat: '事前確認事項',
                  items: ['上り帯域速度テスト（10Mbps以上）', 'バックグラウンドの照明・騒音確認', '画面共有のテスト', 'バックアップ接続デバイスの用意'],
                },
                {
                  cat: 'ハイブリッド追加機材',
                  items: ['会場のプロジェクター・大型モニター', '会場用スピーカー（エコー対策）', '会場マイク（有線推奨）', '映像切り替えスイッチャー'],
                },
              ].map(cat => (
                <div key={cat.cat} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-700">{cat.cat}</p>
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
                {
                  q: 'オンラインイベントの開催に必要な機材は何ですか？',
                  a: '最低限必要な機材は①安定したインターネット回線（有線・上り10Mbps以上推奨）②マイクつきWebカメラ（またはPC内蔵カメラ＋外付けマイク）③照明です。100名以上の大規模配信では外部音響機材・エンコーダー・複数カメラが必要になります。',
                },
                {
                  q: 'ZoomとYouTube Liveはどちらを使えばよいですか？',
                  a: '双方向コミュニケーション（発言・質問・グループワーク）が必要ならZoomが適しています。参加者が多く一方向での配信でよい場合（講演・式典など）はYouTube Liveが向いています。Zoomは無料版で参加者100人・40分の制限があります。',
                },
                {
                  q: 'ハイブリッドイベントとオンラインイベントの違いは何ですか？',
                  a: 'オンラインイベントは全参加者がリモートで参加する形式です。ハイブリッドイベントは会場参加とオンライン参加が混在する形式で、両者が同じ体験を得られるよう音響・映像を双方向に繋ぐ必要があります。ハイブリッドは準備コストと技術的難易度がオンライン専用より高くなります。',
                },
                {
                  q: 'オンラインイベントで参加者を飽きさせないコツは？',
                  a: '①15〜20分ごとに休憩・質問タイムを入れる ②チャット・投票・リアクション機能を積極活用する ③スライドに動画や図を多く入れる ④ブレイクアウトルームでグループワークを実施する ⑤BGMや効果音で雰囲気を演出する、の5点が効果的です。',
                },
                {
                  q: '配信中に音声・映像トラブルが起きたときはどうすればよいですか？',
                  a: '事前に①スマートフォンでバックアップ接続できるよう準備する ②トラブル時のアナウンス文を用意しておく ③技術担当者を別に立てて進行者は進行に集中できるようにする、の3点を準備しておくことが重要です。音声が聞こえない場合は「チャットでご連絡ください」とスライドに常時表示しておくと参加者が混乱しません。',
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
                { href: '/features/timeline',  emoji: '⏱️', title: 'タイムテーブルの作り方', desc: 'オンライン進行表のテンプレート' },
                { href: '/features/staff',     emoji: '👥', title: 'スタッフ役割分担ガイド', desc: '配信担当・技術担当の役割' },
                { href: '/features/survey',    emoji: '📊', title: 'アンケートの作り方',    desc: 'オンライン参加者の満足度調査' },
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
              <p className="text-sm font-bold text-slate-800 mb-1">オンラインイベントの準備もアプリで管理</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                「イベント開催ナビ」ならタイムテーブル・スタッフのタスク・備品リスト・予算をクラウドで一元管理。オンライン・ハイブリッド対応の準備チェックリストとして活用できます。完全無料。
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
