import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TEMPLATE_CATEGORIES, TEMPLATE_TASKS } from '@/lib/task-templates'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'イベント開催ナビ — 誰でも安心してイベント管理できるツール',
  description: 'はじめてでも引き継ぎでも安心。準備リスト・会場レイアウト・タイムテーブル・備品リスト・連絡先をクラウドで一元管理。無料で今すぐ使えます。',
  alternates: { canonical: 'https://event-helper.picoton.com' },
  openGraph: {
    title: 'イベント開催ナビ — 誰でも安心してイベント管理できるツール',
    description: 'はじめてでも引き継ぎでも安心。準備リスト・会場レイアウト・タイムテーブル・備品リスト・連絡先をクラウドで一元管理。無料で今すぐ使えます。',
  },
}

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'イベント開催ナビ',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  description: 'はじめてでも引き継ぎでも安心。準備リスト・会場レイアウト・タイムテーブル・備品リスト・連絡先をクラウドで一元管理できるイベント運営ツール。',
  url: 'https://event-helper.picoton.com',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://workshop.picoton.com/' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'イベント開催ナビは無料で使えますか？',
      acceptedAnswer: { '@type': 'Answer', text: 'はい、全機能を無料でご利用いただけます。クレジットカード不要で、有料プランへの切り替えを求めることはありません。' },
    },
    {
      '@type': 'Question',
      name: 'アカウント登録なしで使えますか？',
      acceptedAnswer: { '@type': 'Answer', text: '登録なしで「無料体験」ページからすぐにお試しいただけます。データをクラウドで保存・共有したい場合は無料アカウントの作成が必要です。' },
    },
    {
      '@type': 'Question',
      name: 'どのようなイベントに使えますか？',
      acceptedAnswer: { '@type': 'Answer', text: '地域の祭り・文化祭・体育祭・マーケット・展示会・スポーツイベント・講演会・防災イベントなど、あらゆる規模のイベント運営に対応しています。' },
    },
    {
      '@type': 'Question',
      name: 'チームで共有できますか？',
      acceptedAnswer: { '@type': 'Answer', text: 'はい。アカウントを作成するとチームメンバーとイベント情報を共有でき、来年の担当者への引き継ぎにもそのままご活用いただけます。' },
    },
    {
      '@type': 'Question',
      name: '会場レイアウトも管理できますか？',
      acceptedAnswer: { '@type': 'Answer', text: 'はい。ドラッグ&ドロップで机・椅子・ステージなどを配置できる会場レイアウト機能を搭載しています。PDFや画像での書き出しにも対応しています。' },
    },
    {
      '@type': 'Question',
      name: 'スマートフォン・タブレットでも使えますか？',
      acceptedAnswer: { '@type': 'Answer', text: 'はい。レスポンシブ対応のウェブアプリのため、スマートフォン・タブレット・PCどのデバイスからでもブラウザでご利用いただけます。アプリのインストールは不要です。' },
    },
    {
      '@type': 'Question',
      name: '複数のイベントを同時に管理できますか？',
      acceptedAnswer: { '@type': 'Answer', text: 'はい。アカウントを作成すると複数のイベントを作成・管理できます。昨年のイベントをコピーして今年の準備を始めることもでき、定期開催イベントの引き継ぎに便利です。' },
    },
    {
      '@type': 'Question',
      name: 'データは安全に保管されますか？',
      acceptedAnswer: { '@type': 'Answer', text: 'データはSupabase（PostgreSQL）のクラウドデータベースに保存されます。登録情報はサービス改善・ご案内の目的にのみ使用し、同意なく第三者へ提供することはありません。株式会社ピコトンが運営・管理しています。' },
    },
  ],
}

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/events')

  const totalTasks = TEMPLATE_TASKS.length
  const categoryCount = TEMPLATE_CATEGORIES.length

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="min-h-screen bg-white text-slate-800">

      {/* ── ヘッダー ──────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">イベント開催ナビ</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 transition-colors hidden sm:block">
              ログイン
            </Link>
            <Link href="/signup" className="text-sm px-4 py-1.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
              無料で登録
            </Link>
          </div>
        </div>
      </header>

      {/* ── ヒーロー ───────────────────────────────────────── */}
      <section className="pt-14 bg-gradient-to-b from-orange-100 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-5">
              完全無料・登録なしで今すぐ体験
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-snug mb-5">
              はじめてでも、<br />
              <span className="text-orange-500">ひきつぎ</span>でも、<br />
              安心してイベント管理。
            </h1>
            <p className="text-slate-600 leading-relaxed mb-8 text-[15px]">
              「何から手をつければ？」が解決する準備ツール。{totalTasks}のタスクテンプレートで準備リストをすぐ作成し、
              会場レイアウト・タイムテーブル・備品リストも一元管理。チームで共有して、来年もそのまま引き継げます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/try"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                今すぐ試す
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 text-slate-500 font-normal rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                無料アカウントを作成
              </Link>
            </div>
            <p className="text-xs text-slate-400 mt-3">クレジットカード不要・無料で全機能を試せます</p>

            {/* モバイル向けキー数字バッジ（md以下で表示） */}
            <div className="flex gap-3 mt-5 md:hidden">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
                <span className="text-base text-orange-500">✓</span>
                <div>
                  <p className="text-[10px] text-slate-400">タスクテンプレート</p>
                  <p className="text-xs font-bold text-slate-700">{totalTasks}件収録</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
                <span className="text-base">👥</span>
                <div>
                  <p className="text-[10px] text-slate-400">チーム共有</p>
                  <p className="text-xs font-bold text-slate-700">対応</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
                <span className="text-base">🖨️</span>
                <div>
                  <p className="text-[10px] text-slate-400">印刷・PDF</p>
                  <p className="text-xs font-bold text-slate-700">対応</p>
                </div>
              </div>
            </div>
          </div>

          {/* ヒーロービジュアル：タスクテンプレートモックアップ */}
          <div className="relative hidden md:block">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="h-9 bg-white border-b border-slate-100 flex items-center px-3 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                </div>
                <div className="flex-1 mx-3 h-4 bg-slate-100 rounded text-xs flex items-center px-2 text-slate-400 text-[10px]">
                  イベント開催ナビ — タスク管理
                </div>
              </div>
              {/* タスクリストモックアップ */}
              <div className="p-3 space-y-1.5 bg-white">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[9px] font-semibold text-slate-500">準備リスト</span>
                  <div className="flex gap-1.5">
                    <span className="text-[8px] text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">テンプレート</span>
                    <span className="text-[8px] text-white bg-orange-500 px-1.5 py-0.5 rounded">+ 追加</span>
                  </div>
                </div>
                {[
                  { label: '進行中', color: 'bg-orange-100 text-orange-600', tasks: [
                    { title: '会場予約・契約', dot: 'bg-red-400', days: 'D-60', assignee: '山田' },
                    { title: '企画書作成', dot: 'bg-yellow-400', days: 'D-60', assignee: '田中' },
                  ]},
                  { label: '未着手', color: 'bg-slate-100 text-slate-500', tasks: [
                    { title: 'スタッフ役割分担表作成', dot: 'bg-yellow-400', days: 'D-45', assignee: '佐藤' },
                    { title: '広告デザイン（チラシ）', dot: 'bg-slate-300', days: 'D-30', assignee: '' },
                    { title: '備品・資材の発注', dot: 'bg-red-400', days: 'D-21', assignee: '山田' },
                  ]},
                ].map(group => (
                  <div key={group.label}>
                    <div className="px-3 py-1 flex items-center gap-1.5">
                      <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${group.color}`}>{group.label}</span>
                    </div>
                    {group.tasks.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50/50 rounded">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.dot}`} />
                        <span className="flex-1 text-[9px] text-slate-700">{t.title}</span>
                        {t.assignee && <span className="text-[8px] text-slate-400">{t.assignee}</span>}
                        <span className="text-[8px] text-slate-400 tabular-nums">{t.days}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* フローティングバッジ：共有中 */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] text-slate-500">チームで共同編集</p>
                <p className="text-[10px] font-bold text-slate-700">3名が参加中</p>
              </div>
            </div>
            {/* フローティングバッジ：テンプレート */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] text-slate-500">テンプレート</p>
                <p className="text-[10px] font-bold text-slate-700">{totalTasks}件のタスク</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 課題提起 ──────────────────────────────────────── */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-orange-400 font-semibold text-sm mb-3">こんな経験、ありませんか？</p>
          <h2 className="text-center text-2xl font-bold text-white mb-10">
            イベント担当者が抱える、よくある課題
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🔄', text: '担当者が変わるたびに情報が失われ、毎回ゼロから準備が始まる', highlight: true },
              { icon: '😰', text: '「何から手をつければいいか」が分からず、準備の開始が遅れる', highlight: true },
              { icon: '📁', text: '会場レイアウトをExcelで毎回ゼロから作り直している' },
              { icon: '📋', text: 'タイムテーブル・備品リスト・連絡先が別々のファイルに散在' },
              { icon: '🖨️', text: '印刷用にレイアウトを整えるだけで1〜2時間かかる' },
              { icon: '📝', text: '変更のたびに全員へ最新版をメールで送り直している' },
            ].map(item => (
              <div
                key={item.text}
                className={`flex items-start gap-3 rounded-xl px-4 py-3.5 ${
                  item.highlight
                    ? 'bg-orange-900/40 border border-orange-700/50'
                    : 'bg-slate-700'
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                <p className="text-sm leading-relaxed" style={{ color: item.highlight ? '#fbd38d' : '#e2e8f0' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">
            特に「引き継ぎ」と「初めての担当」、この2つを
            <span className="text-white font-semibold">イベント開催ナビ</span>でまとめて解決できます。
          </p>
        </div>
      </section>

      {/* ── タスクテンプレートセクション ──────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-orange-500 font-semibold text-sm mb-3">タスクテンプレート</p>
          <h2 className="text-center text-2xl font-bold text-slate-800 mb-3">
            「何をすればいいか」が<br className="sm:hidden" />すぐ分かる
          </h2>
          <p className="text-center text-slate-500 text-sm mb-10">
            {categoryCount}カテゴリ・{totalTasks}のタスクから選ぶだけ。<br />
            開催日を設定すれば締め切りが自動計算されます。
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            {TEMPLATE_CATEGORIES.map(cat => {
              const count = TEMPLATE_TASKS.filter(t => t.categoryId === cat.id).length
              return (
                <div key={cat.id} className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${cat.color}`}>{cat.label}</span>
                  <span className="text-xs text-slate-400 ml-auto">{count}件</span>
                </div>
              )
            })}
          </div>

          {/* タスクプレビュー */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">タスクテンプレートのサンプル（企画〜当日まで）</span>
              <span className="text-xs text-slate-400">D = 開催日</span>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { title: 'キックオフミーティング', cat: '企画・立案', catColor: 'bg-purple-100 text-purple-700', days: 'D-90', dot: 'bg-red-400' },
                { title: '会場予約・契約', cat: '会場・設備', catColor: 'bg-blue-100 text-blue-700', days: 'D-60', dot: 'bg-red-400' },
                { title: 'スタッフ役割分担表作成', cat: 'スタッフ・人員', catColor: 'bg-teal-100 text-teal-700', days: 'D-45', dot: 'bg-yellow-400' },
                { title: '備品・資材の発注', cat: '備品・資材', catColor: 'bg-yellow-100 text-yellow-700', days: 'D-21', dot: 'bg-red-400' },
                { title: '当日スタッフ配置最終確認', cat: 'スタッフ・人員', catColor: 'bg-teal-100 text-teal-700', days: 'D-1', dot: 'bg-red-400' },
                { title: '会場設営', cat: '受付・当日運営', catColor: 'bg-green-100 text-green-700', days: '当日', dot: 'bg-red-400' },
                { title: 'お礼状・感謝メール送付', cat: '事後処理', catColor: 'bg-slate-100 text-slate-600', days: 'D+3', dot: 'bg-yellow-400' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${row.dot}`} />
                  <span className="flex-1 text-sm text-slate-700">{row.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 hidden sm:inline ${row.catColor}`}>{row.cat}</span>
                  <span className="text-xs text-slate-400 tabular-nums shrink-0 w-10 text-right">{row.days}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-orange-50 border-t border-orange-100 flex items-center justify-between">
              <span className="text-xs text-orange-700">さらに{totalTasks - 7}件のタスクが登録されています</span>
              <Link href="/try" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                全て見る →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── こんな方に ────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-orange-500 font-semibold text-sm mb-3">こんな方に</p>
          <h2 className="text-center text-2xl font-bold text-slate-800 mb-12">
            どんなイベントにも使えます
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                emoji: '🎪',
                type: '集客イベント主催者',
                examples: '展示会・マルシェ・体験イベント・フェス',
                desc: '集客告知から当日の導線・スタッフ配置まで一元管理。準備の抜け漏れをなくして、来場者対応に集中できます。',
              },
              {
                emoji: '🏢',
                type: '社内イベント担当',
                examples: '懇親会・表彰式・社員研修',
                desc: '急に担当になっても、テンプレートから準備リストをすぐ作成。来年の担当者にそのまま引き継げます。',
              },
              {
                emoji: '🤝',
                type: '学校・地域・NPO',
                examples: '文化祭・お祭り・地区行事・チャリティー',
                desc: '毎年変わるメンバーでも安心。前年の資料を複製して引き継ぎ、当日スタッフにはマニュアルを印刷して配布できます。',
              },
              {
                emoji: '📅',
                type: '定期イベント主催者',
                examples: 'セミナー・勉強会・展示会',
                desc: '前回のデータをそのまま活用。スタッフへの共有・当日の進行確認・事後報告まで一ツールで完結。',
              },
            ].map(item => (
              <div key={item.type} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <p className="text-xs font-semibold text-orange-500 mb-1">{item.examples}</p>
                <h3 className="text-base font-bold text-slate-800 mb-2">{item.type}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 機能紹介 ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-orange-500 font-semibold text-sm mb-3">できること</p>
          <h2 className="text-center text-2xl font-bold text-slate-800 mb-3">
            準備から当日・事後まで、ひとつで完結
          </h2>
          <p className="text-center text-slate-500 text-sm mb-14">すべての機能は無料で使えます</p>

          <div className="space-y-16">
            {/* 機能1：タスク管理 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="h-7 bg-slate-50 border-b border-slate-100 flex items-center px-3 justify-between">
                    <div className="text-[10px] text-slate-400 font-medium">タスク管理</div>
                    <div className="flex gap-1.5">
                      <div className="text-[9px] text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">テンプレート</div>
                      <div className="text-[9px] text-white bg-orange-500 px-1.5 py-0.5 rounded">+ 追加</div>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[
                      { s: '進行中', sc: 'bg-orange-100 text-orange-600', t: '会場予約・契約', d: 'bg-red-400', days: 'D-60', a: '山田' },
                      { s: '未着手', sc: 'bg-slate-100 text-slate-600', t: 'スタッフ役割分担表作成', d: 'bg-yellow-400', days: 'D-45', a: '田中' },
                      { s: '未着手', sc: 'bg-slate-100 text-slate-600', t: '備品・資材の発注', d: 'bg-red-400', days: 'D-21', a: '' },
                      { s: '完了', sc: 'bg-green-100 text-green-700', t: '企画書作成', d: 'bg-slate-300', days: 'D-60', a: '佐藤' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2">
                        <span className={`text-[7px] px-1 py-0.5 rounded-full font-medium shrink-0 ${row.sc} ${row.s === '完了' ? 'line-through opacity-60' : ''}`}>{row.s}</span>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${row.d}`} />
                        <span className={`flex-1 text-[9px] ${row.s === '完了' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{row.t}</span>
                        {row.a && <span className="text-[8px] text-slate-400 shrink-0">{row.a}</span>}
                        <span className="text-[8px] text-slate-400 tabular-nums shrink-0">{row.days}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 py-2 bg-slate-50 border-t border-slate-50">
                    <div className="flex justify-between text-[8px] text-slate-400 mb-1">
                      <span>1/4 完了</span><span>25%</span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full w-1/4" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">タスク管理</span>
                <h3 className="text-xl font-bold text-slate-800 mt-3 mb-3">
                  準備の抜け漏れを<br />ゼロにする
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  担当者・期日・優先度を設定して一元管理。{categoryCount}カテゴリ・{totalTasks}のタスクテンプレートから選べば、
                  経験がなくても何をいつやるべきかが一目で分かります。
                </p>
                <ul className="space-y-1.5">
                  {[`${totalTasks}件のタスクテンプレート`, '開催日から締め切りを自動計算', '担当者・優先度・進捗を管理', 'ガントチャートで全体を可視化'].map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 機能2：会場レイアウト */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2 bg-slate-50 rounded-2xl border border-slate-200 p-4 overflow-hidden">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="h-7 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-1.5">
                    <div className="text-[10px] text-slate-400 font-medium">会場レイアウト</div>
                    <div className="ml-auto flex gap-1.5">
                      <div className="text-[9px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">元に戻す</div>
                      <div className="text-[9px] text-white bg-orange-500 px-1.5 py-0.5 rounded">保存</div>
                    </div>
                  </div>
                  <div className="flex h-36">
                    <div className="w-16 bg-slate-50 border-r border-slate-100 p-1.5 space-y-1">
                      {['テーブル 長机', '椅子', 'ステージ', '受付台', '看板'].map(l => (
                        <div key={l} className="bg-white border border-slate-200 rounded text-[7px] text-slate-500 text-center py-0.5">{l}</div>
                      ))}
                    </div>
                    <div className="flex-1 relative bg-slate-100 p-2">
                      <div className="absolute inset-2" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '14px 14px' }}>
                        <div className="absolute bg-orange-200 border border-orange-400 rounded text-[7px] text-orange-800 flex items-center justify-center" style={{ left: 14, top: 8, width: 70, height: 22 }}>ステージ</div>
                        {[[12,42],[56,42],[100,42],[12,68],[56,68]].map(([x,y], i) => (
                          <div key={i} className="absolute bg-blue-100 border border-blue-300 rounded text-[6px] text-blue-700 flex items-center justify-center" style={{ left: x, top: y, width: 40, height: 22 }}>テーブル</div>
                        ))}
                        <div className="absolute bg-green-100 border border-green-300 rounded text-[7px] text-green-700 flex items-center justify-center" style={{ left: 155, top: 42, width: 38, height: 48 }}>受付</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:order-1">
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">会場レイアウト</span>
                <h3 className="text-xl font-bold text-slate-800 mt-3 mb-3">
                  ドラッグ＆ドロップで<br />会場図を作成・印刷
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  テーブル・椅子・ステージ・受付などをドラッグして配置するだけ。
                  完成したらA4印刷やPDF出力が可能。毎回Excelで作り直す必要はもうありません。
                </p>
                <ul className="space-y-1.5">
                  {['プリセット備品から選ぶだけで即完成', 'グリッドスナップで綺麗に整列', '印刷・PDF出力対応', '元に戻す・やり直し対応'].map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 機能3＋4：残り機能 */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
                  label: 'タイムテーブル',
                  title: '当日進行をチームで共有',
                  desc: '設営・開催・撤収を色分けして時系列で管理。変更があっても即反映し、印刷してスタッフに配るだけ。',
                },
                {
                  icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>),
                  label: '実施報告書',
                  title: '事後報告まで一気通貫',
                  desc: '来場者数・収支・アンケート結果・次回への申し送りを1ページに集約。助成金・社内報告に活用できます。',
                },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 mb-3">{f.icon}</div>
                  <span className="text-xs font-bold text-orange-500">{f.label}</span>
                  <h3 className="text-base font-bold text-slate-800 mt-1 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── チームで共有セクション ────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">チームで共有</span>
              <h2 className="text-2xl font-bold text-slate-800 mt-3 mb-4">
                メンバーを招待して<br />チームで管理する
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                招待リンクを作成して共有するだけ。担当者が複数いるイベントも、
                全員が同じ情報を見ながら準備を進められます。
                担当が変わっても、アカウントを追加するだけで引き継ぎ完了です。
              </p>
              <ul className="space-y-3">
                {[
                  { icon: '🔗', text: '招待リンクを作成してURLをシェア' },
                  { icon: '✏️', text: '編集者・閲覧者のロールを設定' },
                  { icon: '🔄', text: '引き継ぎ時はメンバーを追加するだけ' },
                  { icon: '📱', text: 'スマホからでもリアルタイムで確認' },
                ].map(item => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <span className="text-sm text-slate-600 leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* 共有UIモックアップ */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">メンバーと共有</h3>
                <p className="text-xs text-slate-400 mt-0.5">夏まつり実行委員会2025</p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">招待リンクを作成</p>
                  <div className="flex gap-2">
                    <div className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-400">メモ（任意）：例「田中さん用」</div>
                    <div className="border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-500">編集者</div>
                  </div>
                  <button className="mt-2 w-full py-2 bg-orange-500 text-white text-xs font-medium rounded-lg">招待リンクを作成</button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">メンバー（3名）</p>
                  <div className="space-y-2">
                    {[
                      { name: '田中 由美', role: 'オーナー', color: 'bg-orange-100 text-orange-600' },
                      { name: '山田 健一', role: '編集者', color: 'bg-blue-100 text-blue-600' },
                      { name: '佐藤 みき', role: '閲覧者', color: 'bg-slate-100 text-slate-500' },
                    ].map(m => (
                      <div key={m.name} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                        <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="flex-1 text-xs font-medium text-slate-700">{m.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${m.color}`}>{m.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 毎年使えるセクション ─────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-orange-500 font-semibold text-sm mb-3">毎年使える</p>
          <h2 className="text-center text-2xl font-bold text-slate-800 mb-3">
            「去年の資料」を<br className="sm:hidden" />そのまま引き継ぎ
          </h2>
          <p className="text-center text-slate-500 text-sm mb-12">
            ゼロから作り直さない。去年の成果を今年に繋げる。
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">イベントを複製して更新</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                前回のイベントをワンクリックで複製。タスク・スケジュール・備品・連絡先をまるごと引き継ぎ、
                日程と担当者を更新するだけで準備開始できます。
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">実施報告書で振り返り</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                来場者数・収支・アンケート・次回への申し送りを1ページに集約。
                翌年の担当者への最高の引き継ぎ資料になります。助成金報告にも活用できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 中間CTA ───────────────────────────────────────── */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            まずは準備リストを<br className="sm:hidden" />無料で試してみてください
          </h2>
          <p className="text-orange-100 text-sm leading-relaxed mb-8">
            登録不要で、{totalTasks}件のタスクテンプレートと会場レイアウト・タイムテーブルを今すぐ体験できます。<br />
            「使えそう」と感じたら、無料登録でデータを保存しましょう。
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-md text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            今すぐ無料で試す（登録不要）
          </Link>
        </div>
      </section>

      {/* ── 安心・信頼 ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-slate-800 mb-10">安心してお使いいただくために</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: '🎉',
                title: '完全無料',
                desc: '全機能を無料でご利用いただけます。有料プランへの切り替えを求めることはありません。',
              },
              {
                icon: '🔒',
                title: 'データの取り扱い',
                desc: '登録情報はサービス改善・ご案内の目的にのみ使用します。同意なく第三者へ提供することはありません。',
              },
              {
                icon: '🏢',
                title: 'ピコトンが運営',
                desc: 'イベント制作・ワークショッププログラムを手がける株式会社ピコトンが開発・運営しています。',
              },
            ].map(item => (
              <div key={item.title} className="text-center px-4">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 最終CTA ───────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            次のイベント準備から、<br />変えてみませんか？
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            登録は1分で完了。クレジットカード不要です。<br />
            まずはテンプレートを試すだけでも、今すぐ使えます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/try"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md text-sm"
            >
              登録なしで今すぐ試す
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 text-slate-500 font-normal rounded-xl hover:bg-white transition-colors text-sm"
            >
              無料アカウントを作成
            </Link>
          </div>
        </div>
      </section>

      {/* ── 特集・ガイド ──────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">イベント開催ガイド・特集</h2>
              <p className="text-slate-500 text-sm mt-1">準備のヒントや素材を無料でご活用ください</p>
            </div>
            <Link href="/features" className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors whitespace-nowrap">
              全て見る →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/features/checklist',    emoji: '📋', title: 'イベント準備チェックリスト', desc: '企画〜後片付けまでの全手順' },
              { href: '/features/timeline',     emoji: '⏱️', title: 'タイムテーブルの作り方',    desc: '当日進行表・時間配分の目安' },
              { href: '/features/budget',       emoji: '💰', title: '予算・費用管理ガイド',      desc: '費用項目の洗い出し・予算策定' },
              { href: '/features/staff',        emoji: '👥', title: 'スタッフ役割分担ガイド',    desc: '担当職種・必要人数の目安' },
              { href: '/features/announcement', emoji: '📢', title: 'イベント告知・案内文',       desc: 'SNS・チラシ・メール別テンプレート' },
              { href: '/features/survey',       emoji: '📊', title: 'アンケートの作り方',        desc: '回収率を上げる設問設計・活用法' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/40 transition-colors"
              >
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-700 transition-colors leading-snug">{item.title}</p>
                <p className="text-xs text-slate-400 mt-auto">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── フッター ──────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">準備・計画</p>
              <ul className="space-y-1.5">
                {[
                  { href: '/features/checklist', label: '準備チェックリスト' },
                  { href: '/features/timeline',  label: 'タイムテーブル' },
                  { href: '/features/budget',    label: '予算・費用管理' },
                  { href: '/features/staff',     label: 'スタッフ役割分担' },
                ].map(l => <li key={l.href}><Link href={l.href} className="text-xs text-slate-500 hover:text-orange-600 transition-colors">{l.label}</Link></li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">当日・会場</p>
              <ul className="space-y-1.5">
                {[
                  { href: '/features/venue-layout', label: '会場レイアウト' },
                  { href: '/features/equipment',    label: 'イベント備品リスト' },
                  { href: '/features/online',       label: 'オンライン・ハイブリッド' },
                  { href: '/features/announcement', label: '告知・案内文' },
                  { href: '/features/calendar',     label: '季節のイベントカレンダー' },
                ].map(l => <li key={l.href}><Link href={l.href} className="text-xs text-slate-500 hover:text-orange-600 transition-colors">{l.label}</Link></li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">事後・継続</p>
              <ul className="space-y-1.5">
                {[
                  { href: '/features/survey',         label: 'アンケートの作り方' },
                  { href: '/features/handover',       label: '引き継ぎガイド' },
                  { href: '/features/community-event',label: '地域イベントガイド' },
                  { href: '/features/school',         label: '学校行事ガイド' },
                  { href: '/features/corporate',      label: '社内イベント・懇親会' },
                  { href: '/features/disaster',       label: '防災イベント' },
                  { href: '/features/summer',         label: '夏のイベントに備える' },
                ].map(l => <li key={l.href}><Link href={l.href} className="text-xs text-slate-500 hover:text-orange-600 transition-colors">{l.label}</Link></li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">サービス</p>
              <ul className="space-y-1.5">
                {[
                  { href: '/try',    label: '登録なしで試す（無料）' },
                  { href: '/signup', label: '無料アカウント作成' },
                  { href: '/features', label: 'ガイド一覧' },
                  { href: '/login',  label: 'ログイン' },
                ].map(l => <li key={l.href}><Link href={l.href} className="text-xs text-slate-500 hover:text-orange-600 transition-colors">{l.label}</Link></li>)}
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-slate-200 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-slate-500">イベント開催ナビ</span>
              <span>© 2025 株式会社ピコトン</span>
            </div>
            <div className="flex gap-5">
              <Link href="/terms" className="hover:text-slate-600 transition-colors">利用規約</Link>
              <Link href="/privacy" className="hover:text-slate-600 transition-colors">プライバシーポリシー</Link>
              <a href="https://workshop.picoton.com/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">ピコトン公式</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
    </>
  )
}
