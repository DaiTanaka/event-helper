import Link from 'next/link'

export const metadata = {
  title: 'プライバシーポリシー',
  description: 'イベント開催ナビのプライバシーポリシーです。個人情報の取り扱いについてご確認ください。',
  alternates: { canonical: 'https://event-helper.picoton.com/privacy' },
}

export default function PrivacyPage() {
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
          <h1 className="text-2xl font-bold text-slate-800 mb-2">プライバシーポリシー</h1>
          <p className="text-sm text-slate-400">最終更新日：2025年1月1日</p>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">1. 事業者情報</h2>
            <p>株式会社ピコトン（以下「当社」）は、イベント開催ナビ（以下「本サービス」）において収集する個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">2. 収集する情報</h2>
            <p>当社は、本サービスの提供にあたり、以下の情報を収集することがあります。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>メールアドレス（アカウント登録時）</li>
              <li>お名前・組織名・役職などのプロフィール情報（任意入力）</li>
              <li>イベント情報（タイトル・日程・会場など）</li>
              <li>本サービスの利用状況に関する情報（アクセスログ等）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">3. 利用目的</h2>
            <p>収集した情報は、以下の目的のために利用します。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>本サービスの提供・運営</li>
              <li>本サービスの改善・新機能開発</li>
              <li>お問い合わせへの対応</li>
              <li>サービスに関するご案内（メールマガジン等。同意いただいた場合のみ）</li>
              <li>利用規約に違反する行為への対応</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">4. 第三者への提供</h2>
            <p>当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">5. 業務委託</h2>
            <p>当社は、本サービスの提供に必要な範囲で、業務委託先（クラウドサービス等）に個人情報を提供することがあります。この場合、適切な管理を行う委託先を選定し、必要な監督を行います。</p>
            <p className="mt-2">利用しているサービスの例：</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Supabase（データベース・認証）</li>
              <li>Vercel（ホスティング）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">6. 個人情報の管理</h2>
            <p>当社は、個人情報の漏えい・滅失・毀損の防止その他個人情報の安全管理のために必要かつ適切な措置を講じます。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">7. 開示・訂正・削除</h2>
            <p>ユーザーは、当社の保有する自己の個人情報について、開示・訂正・削除を求めることができます。アカウント設定画面からの操作、または下記お問い合わせ先よりご連絡ください。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">8. Cookieの利用</h2>
            <p>本サービスでは、ログイン状態の維持・サービス改善のためにCookieを使用することがあります。ブラウザの設定によりCookieを無効にすることも可能ですが、その場合一部のサービス機能が利用できなくなることがあります。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">9. プライバシーポリシーの変更</h2>
            <p>当社は、必要に応じて本ポリシーを変更することがあります。重要な変更については、本サービス上でお知らせします。</p>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-800 mb-2">10. お問い合わせ</h2>
            <p>個人情報の取り扱いに関するお問い合わせは、以下よりご連絡ください。</p>
            <p className="mt-2">
              株式会社ピコトン<br />
              <a href="https://workshop.picoton.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-700 underline">公式サイト・お問い合わせフォーム</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
