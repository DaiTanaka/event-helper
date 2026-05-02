'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { saveProfileAsAdmin } from './actions'

const ORG_TYPES = [
  { value: '企業・法人', icon: '🏢', label: '企業・法人' },
  { value: '自治体・行政', icon: '🏛️', label: '自治体・行政' },
  { value: 'NPO・団体', icon: '🤝', label: 'NPO・団体' },
  { value: '個人・フリーランス', icon: '👤', label: '個人・フリーランス' },
]
const ROLES = [
  { value: '主催者・責任者', label: '主催者・責任者' },
  { value: '運営スタッフ', label: '運営スタッフ' },
  { value: '外部コーディネーター', label: '外部コーディネーター' },
  { value: 'その他', label: 'その他' },
]
const EVENTS_PER_YEAR = [
  { value: '年1〜2回', label: '年1〜2回' },
  { value: '年3〜5回', label: '年3〜5回' },
  { value: '年6〜12回', label: '年6〜12回' },
  { value: '年13回以上', label: '年13回以上' },
]
const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
]
const DECISION_AUTHORITY = [
  { value: '自分で判断できる', label: '自分で判断できる' },
  { value: '上長・組織の承認が必要', label: '上長・組織の承認が必要' },
]
const BUDGET_RANGE = [
  { value: '50万円未満', label: '50万円未満' },
  { value: '50〜200万円', label: '50〜200万円' },
  { value: '200〜500万円', label: '200〜500万円' },
  { value: '500万円以上', label: '500万円以上' },
]

const cardBase = 'flex flex-col items-center justify-center gap-1.5 p-3 border-2 rounded-xl cursor-pointer text-sm font-medium transition-all select-none'
const cardOff  = 'border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50'
const cardOn   = 'border-orange-500 bg-orange-50 text-orange-700'
const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800'

function CardRadio({ name, value, selected, onChange, children }: {
  name: string; value: string; selected: string; onChange: (v: string) => void; children: React.ReactNode
}) {
  return (
    <label className={`${cardBase} ${selected === value ? cardOn : cardOff}`}>
      <input type="radio" name={name} value={value} checked={selected === value} onChange={() => onChange(value)} className="sr-only" />
      {children}
    </label>
  )
}

const STEP_LABELS = ['アカウント情報', '組織情報', '役割・規模', '連絡先・設定']
const TOTAL_STEPS = 4

export default function SignupForm({ redirectTo = '/events' }: { redirectTo?: string }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [doneEmail, setDoneEmail] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgType, setOrgType] = useState('')
  const [organization, setOrganization] = useState('')
  const [role, setRole] = useState('')
  const [eventsPerYear, setEventsPerYear] = useState('')
  const [prefecture, setPrefecture] = useState('')
  const [decisionAuthority, setDecisionAuthority] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const [phone, setPhone] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)

  const supabase = createClient()

  function goNext() {
    setError('')
    if (step === 1) {
      if (!email) { setError('メールアドレスを入力してください'); return }
      if (password.length < 6) { setError('パスワードは6文字以上で入力してください'); return }
    }
    if (step === 2 && !orgType) {
      setError('組織の種類を選択してください')
      return
    }
    setStep(s => s + 1)
  }

  function goBack() {
    setError('')
    setStep(s => s - 1)
  }

  async function handleSubmit() {
    if (!termsAccepted) { setError('利用規約への同意が必要です'); return }
    setError('')
    setLoading(true)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}` },
    })

    if (authError) { setError(authError.message); setLoading(false); return }
    if (!authData.user) { setError('アカウント作成に失敗しました'); setLoading(false); return }

    const result = await saveProfileAsAdmin(authData.user.id, email, {
      organization_type: orgType,
      organization,
      role,
      events_per_year: eventsPerYear,
      prefecture,
      decision_authority: decisionAuthority,
      budget_range: budgetRange,
      phone,
      newsletter_opt_in: newsletterOptIn,
      marketing_opt_in: marketingOptIn,
    })

    if (result?.error) { setError(result.error); setLoading(false); return }

    setDoneEmail(email)
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800">確認メールを送信しました</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          <strong>{doneEmail}</strong> 宛にメールをお送りしました。<br />
          メール内のリンクをクリックして登録を完了してください。
        </p>
        <p className="text-xs text-slate-400">メールが届かない場合はスパムフォルダもご確認ください。</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* プログレスバー */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>STEP {step} / {TOTAL_STEPS}</span>
          <span>{STEP_LABELS[step - 1]}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      {/* STEP 1: アカウント情報 */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              placeholder="example@company.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              placeholder="6文字以上"
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* STEP 2: 組織情報 */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">
              どのような組織でイベントを主催していますか？
              <span className="text-red-500 ml-1 text-xs">必須</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ORG_TYPES.map(o => (
                <CardRadio key={o.value} name="org_type" value={o.value} selected={orgType} onChange={setOrgType}>
                  <span className="text-xl">{o.icon}</span>
                  <span className="text-xs text-center leading-snug">{o.label}</span>
                </CardRadio>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              会社・組織名
              <span className="text-slate-400 font-normal text-xs ml-1">任意</span>
            </label>
            <input
              type="text"
              value={organization}
              onChange={e => setOrganization(e.target.value)}
              placeholder="例：〇〇株式会社、△△実行委員会"
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* STEP 3: 役割・規模 */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2.5">あなたの役割は？</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <CardRadio key={r.value} name="role" value={r.value} selected={role} onChange={setRole}>
                  <span className="text-xs text-center">{r.label}</span>
                </CardRadio>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2.5">年間イベント開催数は？</p>
            <div className="grid grid-cols-2 gap-2">
              {EVENTS_PER_YEAR.map(e => (
                <CardRadio key={e.value} name="events_per_year" value={e.value} selected={eventsPerYear} onChange={setEventsPerYear}>
                  <span className="text-xs text-center">{e.label}</span>
                </CardRadio>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              主な活動エリア
              <span className="text-slate-400 font-normal text-xs ml-1">任意</span>
            </label>
            <select value={prefecture} onChange={e => setPrefecture(e.target.value)} className={inputCls}>
              <option value="">都道府県を選択</option>
              {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* STEP 4: 連絡先・設定 */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2.5">サービス・ツールの導入について</p>
            <div className="grid grid-cols-2 gap-2">
              {DECISION_AUTHORITY.map(d => (
                <CardRadio key={d.value} name="decision_authority" value={d.value} selected={decisionAuthority} onChange={setDecisionAuthority}>
                  <span className="text-xs text-center leading-snug">{d.label}</span>
                </CardRadio>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2.5">1回あたりのイベント予算（目安）</p>
            <div className="grid grid-cols-2 gap-2">
              {BUDGET_RANGE.map(b => (
                <CardRadio key={b.value} name="budget_range" value={b.value} selected={budgetRange} onChange={setBudgetRange}>
                  <span className="text-xs text-center">{b.label}</span>
                </CardRadio>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              電話番号
              <span className="text-slate-400 font-normal text-xs ml-1">任意</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="例：03-1234-5678"
              className={inputCls}
            />
            <p className="text-xs text-slate-400 mt-1">ご登録いただいた場合、担当者よりご連絡する場合があります</p>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
              />
              <span className="text-sm text-slate-700 leading-relaxed">
                <a href="/terms" target="_blank" className="text-orange-500 underline hover:text-orange-600">利用規約</a>
                および
                <a href="/privacy" target="_blank" className="text-orange-500 underline hover:text-orange-600">プライバシーポリシー</a>
                に同意する
                <span className="text-red-500 ml-1 text-xs">必須</span>
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={e => setNewsletterOptIn(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">サービスのお知らせ・イベント運営のヒントをメールで受け取る</p>
                <p className="text-xs text-slate-400">新機能の案内、運営に役立つ情報など</p>
              </div>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={e => setMarketingOptIn(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">ピコトンの担当者からイベント制作・運営サポートに関するご提案・ご連絡を受け取ることに同意する</p>
                <p className="text-xs text-slate-400">メールまたはお電話でご案内する場合があります</p>
              </div>
            </label>
            <p className="text-xs text-slate-400 leading-relaxed">
              ※ いずれもアカウント設定からいつでも変更できます。
            </p>
          </div>
        </div>
      )}

      {/* ナビゲーションボタン */}
      <div className="space-y-2 pt-1">
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={goNext}
            className="w-full py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
          >
            次へ →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {loading ? '登録中...' : 'アカウントを作成する'}
          </button>
        )}
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="w-full text-sm text-slate-400 hover:text-slate-600 py-1 transition-colors"
          >
            ← 前のステップに戻る
          </button>
        )}
        {step === 1 && (
          <p className="text-center text-sm text-slate-500 pt-2">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-orange-500 hover:underline">ログイン</Link>
          </p>
        )}
      </div>
    </div>
  )
}
