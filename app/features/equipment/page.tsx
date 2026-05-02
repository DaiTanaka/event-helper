import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'イベント備品リスト｜カテゴリ別チェックリストと必要なもの一覧',
  description: 'イベント開催に必要な備品・持ち物チェックリスト。受付・音響・設営・案内・安全衛生・食飲料・清掃など7カテゴリを網羅。見落としがちな備品も含めて確認できます。',
  alternates: { canonical: 'https://event-helper.picoton.com/features/equipment' },
  openGraph: {
    title: 'イベント備品リスト｜カテゴリ別チェックリストと必要なもの一覧 | イベント開催ナビ',
    description: 'イベント開催に必要な備品・持ち物チェックリスト。受付・音響・設営・案内・安全衛生・食飲料・清掃など7カテゴリを網羅。見落としがちな備品も含めて確認できます。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://event-helper.picoton.com' },
    { '@type': 'ListItem', position: 2, name: 'ガイド・特集', item: 'https://event-helper.picoton.com/features' },
    { '@type': 'ListItem', position: 3, name: 'イベント備品リスト', item: 'https://event-helper.picoton.com/features/equipment' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'イベント当日に最低限必要な備品は何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '受付用の机・椅子・名札・筆記用具・参加者名簿、案内用の看板またはA字看板、延長コード、ゴミ袋、救急セットが最低限の備品です。音響が必要な場合はマイクとスピーカー、プレゼンがある場合はプロジェクターとスクリーンも加えてください。',
      },
    },
    {
      '@type': 'Question',
      name: '備品はどこから調達すればよいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '会場に備え付けの備品を最初に確認し、不足分を調達します。机・椅子は会場レンタル、音響機材は専門業者、消耗品はホームセンターやネット通販が一般的です。少量の場合は100円ショップでも揃います。イベント業者からまとめてレンタルするとコストを抑えられる場合もあります。',
      },
    },
    {
      '@type': 'Question',
      name: '備品の数量はどう決めればよいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '参加者数に応じた基本数に加え、予備を10〜20%確保するのが目安です。名札・ペンなどの消耗品は多めに用意しましょう。受付スタッフ1人あたりに必要なものも別途カウントしてください。',
      },
    },
    {
      '@type': 'Question',
      name: '備品の管理・引き継ぎをうまくするには？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '備品リストに「数量・調達方法・担当者・保管場所・返却期限」を記録しておくことが重要です。購入品と借用品を区別し、借用品には返却先と期限を明記しましょう。クラウドツールで管理すると来年の担当者への引き継ぎがスムーズになります。',
      },
    },
    {
      '@type': 'Question',
      name: '屋外イベントで特別に必要な備品は何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '屋外イベントでは、テント・タープ・ウェイト（風対策）・防水シート・延長コード（アース付き）・発電機（電源がない場合）・日よけ用パラソル・熱中症対策グッズ（冷却スプレー・氷・冷水）・雨天対策の養生テープ・ゴミ分別ボックスが追加で必要です。',
      },
    },
  ],
}

type EquipmentCategory = {
  category: string
  emoji: string
  essential: string[]
  optional: string[]
  notes?: string
}

const EQUIPMENT: EquipmentCategory[] = [
  {
    category: '受付・案内',
    emoji: '🗃️',
    essential: [
      '受付用テーブル・椅子',
      '参加者名簿・受付シート',
      '名札（クリップ式またはシール式）・名札ホルダー',
      'ボールペン・サインペン（複数本）',
      '付箋・クリップ・輪ゴム',
      'お釣り用の小銭（参加費がある場合）',
    ],
    optional: [
      'パーテーション・行列整理用ロープ',
      '案内看板・A字看板',
      '方向指示の矢印シール',
      'QRコード読み取り端末（電子受付の場合）',
    ],
    notes: '受付スタッフ1人に対して1セット用意すると運営がスムーズ',
  },
  {
    category: '音響・映像',
    emoji: '🎤',
    essential: [
      'マイク（有線または無線）',
      'スピーカー・アンプ',
      'マイクスタンド',
    ],
    optional: [
      'プロジェクター（解像度・輝度確認）',
      'スクリーン（または白壁）',
      'HDMIケーブル・変換アダプタ',
      'ポインター（レーザーポインタ）',
      '音楽再生用デバイス・Bluetoothスピーカー',
      'イヤモニ・トランシーバー（大規模の場合）',
    ],
    notes: '会場備え付けを先に確認。持ち込み機材との互換性テストを前日に実施',
  },
  {
    category: '設営・什器',
    emoji: '🪑',
    essential: [
      'テーブル（会場に不足する分）',
      '椅子（予備含め参加者数+α）',
      '延長コード・電源タップ',
      'ガムテープ・養生テープ',
      'ハサミ・カッター',
    ],
    optional: [
      'テント・タープ（屋外の場合）',
      'テント用ウェイト・ペグ',
      'テーブルクロス',
      '装飾用バルーン・バナー',
      'ステージ台・演台',
      '脚立（高所作業用）',
    ],
  },
  {
    category: '印刷物・文書',
    emoji: '📄',
    essential: [
      'プログラム・当日パンフレット',
      'タイムテーブル（スタッフ用）',
      '会場マップ・座席図',
      'アンケート用紙',
    ],
    optional: [
      'プレスリリース・報告書テンプレート',
      '緊急連絡先一覧',
      'スタッフマニュアル・当日の手順書',
      'メモ用紙（参加者向け）',
    ],
    notes: '当日の急な変更に備えてコピー機またはプリンタへのアクセスを確認しておく',
  },
  {
    category: '安全・衛生',
    emoji: '🩹',
    essential: [
      '救急セット（絆創膏・消毒液・包帯など）',
      'ゴミ袋（分別用に複数種）',
      '消毒用アルコール・ウェットティッシュ',
      'マスク（予備含む）',
    ],
    optional: [
      '体温計・AED（会場確認）',
      '熱中症対策グッズ（冷却スプレー・氷・塩分タブレット）',
      '防水シート・雨天用ビニール袋',
      '安全ピン・針金（簡易修理用）',
      '消火器の位置確認（設置確認のみ）',
    ],
    notes: '参加者50名以上の場合、AEDの設置場所を全スタッフに周知',
  },
  {
    category: '食飲料・おもてなし',
    emoji: '🥤',
    essential: [
      '飲料水（スタッフ用・参加者用）',
      '紙コップ・割り箸',
    ],
    optional: [
      '茶菓子・軽食（懇親会がある場合）',
      'アイスボックス・クーラーボックス',
      'テーブルクロス（食事エリア用）',
      '配膳用トング・取り分け皿',
      'ゴミ入れ（食品廃棄用）',
    ],
    notes: 'アレルギー対応の確認を事前に。食品を扱う場合は衛生管理（手袋着用など）を徹底',
  },
  {
    category: '撮影・記録',
    emoji: '📸',
    essential: [
      'カメラまたはスマートフォン',
      '充電器・モバイルバッテリー',
    ],
    optional: [
      '三脚・一脚',
      'ビデオカメラ（動画記録用）',
      'ストレージ（SDカード・USBメモリ）',
      'ライブ配信機材（オンライン中継の場合）',
      'ドローン（屋外・許可取得済みの場合）',
    ],
    notes: '参加者の撮影には肖像権への配慮が必要。撮影可否・SNS掲載ルールをアナウンスする',
  },
]

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'イベント備品リスト｜カテゴリ別チェックリストと必要なもの一覧',
  description: 'イベント開催に必要な備品・持ち物チェックリスト。受付・音響・設営・案内・安全衛生・食飲料・清掃など7カテゴリを網羅。見落としがちな備品も含めて確認できます。',
  url: 'https://event-helper.picoton.com/features/equipment',
  publisher: { '@type': 'Organization', name: '株式会社ピコトン', url: 'https://event-helper.picoton.com' },
  dateModified: '2025-01-01',
}

export default function EquipmentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-4">備品管理ガイド</span>
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            イベント備品リスト
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            受付・音響・設営・安全衛生など7カテゴリの備品を網羅したチェックリスト。
            「必須」と「あると便利」に分けているので、規模に合わせて取捨選択できます。
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            備品リストをアプリで管理する
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-16 space-y-5">

          {/* 備品カテゴリ一覧 */}
          {EQUIPMENT.map(cat => (
            <div key={cat.category} className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                <span className="text-xl">{cat.emoji}</span>
                <div>
                  <h2 className="text-base font-bold text-slate-800">{cat.category}</h2>
                  {cat.notes && <p className="text-xs text-slate-400 mt-0.5">{cat.notes}</p>}
                </div>
              </div>
              <div className="px-6 py-5 grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">必須</p>
                  <ul className="space-y-2">
                    {cat.essential.map(item => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-1 w-3.5 h-3.5 rounded border-2 border-orange-300 shrink-0" />
                        <span className="text-sm text-slate-700 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">あると便利</p>
                  <ul className="space-y-2">
                    {cat.optional.map(item => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-1 w-3.5 h-3.5 rounded border border-slate-300 shrink-0" />
                        <span className="text-sm text-slate-500 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

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
                { href: '/features/checklist',    emoji: '📋', title: 'イベント準備チェックリスト', desc: '企画〜後片付けまでの全手順' },
                { href: '/features/budget',       emoji: '💰', title: '予算・費用管理ガイド',     desc: '費用項目・予算策定手順' },
                { href: '/features/survey',       emoji: '📊', title: 'アンケートの作り方',       desc: '参加者満足度調査・回収のコツ' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="group px-5 py-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">{item.emoji} {item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 text-xl">📦</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">備品リストをクラウドで管理・共有</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">「イベント開催ナビ」の備品管理機能で、数量・担当者・調達状況をチームで共有。来年の備品リストとしてそのまま引き継げます。</p>
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
