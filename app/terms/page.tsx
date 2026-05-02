import Link from 'next/link'

export const metadata = {
  title: '利用規約',
  description: 'イベント開催ナビの利用規約です。サービスのご利用前にご確認ください。',
  alternates: { canonical: 'https://event-helper.picoton.com/terms' },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-100 py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-700">イベント開催ナビ</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">← トップに戻る</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">利用規約</h1>
          <p className="text-sm text-slate-400">最終更新日：2025年1月1日</p>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">第1条（適用）</h2>
            <p>本利用規約（以下「本規約」）は、株式会社ピコトン（以下「当社」）が提供するイベント開催ナビ（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意した上で本サービスを利用するものとします。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">第2条（利用登録）</h2>
            <p>本サービスの利用を希望する方は、当社の定める方法により利用登録を行うものとします。当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>虚偽の事項を届け出た場合</li>
              <li>本規約に違反したことがある者からの申請である場合</li>
              <li>その他、当社が利用登録を相当でないと判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">第3条（禁止事項）</h2>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">第4条（本サービスの提供の停止等）</h2>
            <p>当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができます。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>本サービスにかかるコンピューターシステムの保守点検または更新を行う場合</li>
              <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
              <li>その他、当社が本サービスの提供が困難と判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">第5条（免責事項）</h2>
            <p>当社の債務不履行責任は、当社の故意または重過失によらない場合には免責されるものとします。本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等については、当社は一切責任を負いません。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">第6条（サービス内容の変更等）</h2>
            <p>当社は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあります。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">第7条（利用規約の変更）</h2>
            <p>当社は必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができます。変更後の利用規約は、本サービス上に掲示した時点から効力を生じるものとします。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">第8条（準拠法・裁判管轄）</h2>
            <p>本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</p>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <p>お問い合わせ：<a href="https://workshop.picoton.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-700 underline">株式会社ピコトン 公式サイト</a></p>
          </section>
        </div>
      </main>
    </div>
  )
}
