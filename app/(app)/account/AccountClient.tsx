'use client'

import { useState, useActionState } from 'react'
import { updateProfile, updateConsent, deleteAccount } from './actions'

const ORG_TYPES = ['企業・法人', '自治体・行政', 'NPO・団体', '個人・フリーランス']
const ROLES = ['主催者・責任者', '運営スタッフ', '外部コーディネーター', 'その他']
const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
]
const EVENTS_PER_YEAR = ['年1〜2回', '年3〜5回', '年6〜12回', '年13回以上']
const DECISION_AUTHORITY = ['自分で判断できる', '上長・組織の承認が必要']
const BUDGET_RANGE = ['50万円未満', '50〜200万円', '200〜500万円', '500万円以上']

const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800'

type Profile = {
  organization_type: string | null
  organization: string | null
  role: string | null
  prefecture: string | null
  events_per_year: string | null
  decision_authority: string | null
  budget_range: string | null
  phone: string | null
  newsletter_opt_in: boolean
  marketing_opt_in: boolean
  terms_accepted_at: string | null
}

type Tab = 'profile' | 'consent' | 'danger'

export default function AccountClient({ email, profile }: { email: string; profile: Profile }) {
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">アカウント設定</h1>
        <p className="text-sm text-slate-500 mt-1">{email}</p>
      </div>

      <div className="flex gap-1 border-b border-slate-100">
        {([
          ['profile', 'プロフィール'],
          ['consent', 'メール設定'],
          ['danger', '退会'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile' && <ProfileTab profile={profile} />}
      {tab === 'consent' && <ConsentTab profile={profile} />}
      {tab === 'danger' && <DangerTab />}
    </div>
  )
}

function ProfileTab({ profile }: { profile: Profile }) {
  const [state, action, isPending] = useActionState(updateProfile, {})

  return (
    <form action={action} className="space-y-4">
      {state.error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</div>}
      {state.success && <div className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">保存しました</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">組織の種類</label>
        <select name="organization_type" defaultValue={profile.organization_type ?? ''} className={inputCls}>
          <option value="">選択してください</option>
          {ORG_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          会社・組織名 <span className="text-slate-400 font-normal text-xs">任意</span>
        </label>
        <input type="text" name="organization" defaultValue={profile.organization ?? ''} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">あなたの役割</label>
        <select name="role" defaultValue={profile.role ?? ''} className={inputCls}>
          <option value="">選択してください</option>
          {ROLES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">主な活動エリア</label>
        <select name="prefecture" defaultValue={profile.prefecture ?? ''} className={inputCls}>
          <option value="">都道府県を選択</option>
          {PREFECTURES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">年間イベント開催数</label>
        <div className="grid grid-cols-2 gap-2">
          {EVENTS_PER_YEAR.map(v => (
            <label key={v} className="flex items-center gap-2.5 border border-slate-200 rounded-lg px-3 py-2.5 cursor-pointer hover:border-orange-300 hover:bg-orange-50 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-colors">
              <input type="radio" name="events_per_year" value={v} defaultChecked={profile.events_per_year === v} className="accent-orange-500" />
              <span className="text-sm text-slate-700">{v}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">サービス導入の決裁権</label>
        <select name="decision_authority" defaultValue={profile.decision_authority ?? ''} className={inputCls}>
          <option value="">選択してください</option>
          {DECISION_AUTHORITY.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">1回あたりのイベント予算</label>
        <select name="budget_range" defaultValue={profile.budget_range ?? ''} className={inputCls}>
          <option value="">選択してください</option>
          {BUDGET_RANGE.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          電話番号 <span className="text-slate-400 font-normal text-xs">任意</span>
        </label>
        <input type="tel" name="phone" defaultValue={profile.phone ?? ''} placeholder="例：03-1234-5678" className={inputCls} />
      </div>

      <button type="submit" disabled={isPending} className="w-full py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors">
        {isPending ? '保存中...' : '変更を保存'}
      </button>
    </form>
  )
}

function ConsentTab({ profile }: { profile: Profile }) {
  const [state, action, isPending] = useActionState(updateConsent, {})

  return (
    <form action={action} className="space-y-5">
      {state.error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</div>}
      {state.success && <div className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">設定を保存しました</div>}

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="newsletter_opt_in" defaultChecked={profile.newsletter_opt_in} className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-700">お役立ち情報・サービスのお知らせ</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">新機能の案内、イベント運営に役立つ情報などをメールでお届けします。</p>
          </div>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="marketing_opt_in" defaultChecked={profile.marketing_opt_in} className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-700">ピコトンからのご提案・ご連絡</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">イベント制作・運営サポートに関するご提案をメールまたはお電話でご案内する場合があります。</p>
          </div>
        </label>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
        利用規約への同意は{' '}
        {profile.terms_accepted_at ? new Date(profile.terms_accepted_at).toLocaleDateString('ja-JP') : '不明'}
        {' '}に記録されています。
      </p>

      <button type="submit" disabled={isPending} className="w-full py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors">
        {isPending ? '保存中...' : '設定を保存'}
      </button>
    </form>
  )
}

function DangerTab() {
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [state, action, isPending] = useActionState(deleteAccount, {})

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-red-700">退会について</h2>
        <ul className="text-xs text-red-600 space-y-1 leading-relaxed list-disc list-inside">
          <li>退会後、ログインできなくなります。</li>
          <li>作成したイベントは非公開になりますが、サービス改善・分析のためデータを一定期間保持します。</li>
          <li>本サービスは無料サービスのため、データの完全な削除や復旧の保証はありません。</li>
          <li>退会処理は取り消せません。</li>
        </ul>
      </div>

      {!open ? (
        <button onClick={() => setOpen(true)} className="text-sm text-red-500 hover:text-red-700 underline transition-colors">
          退会手続きを行う
        </button>
      ) : (
        <form action={action} className="space-y-4 border border-red-200 rounded-xl p-4">
          {state.error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              確認のため「<span className="font-bold text-red-600">退会する</span>」と入力してください
            </label>
            <input
              type="text"
              name="confirmation"
              value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
              placeholder="退会する"
              className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending || confirmation !== '退会する'} className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 disabled:opacity-40 transition-colors">
              {isPending ? '処理中...' : '退会する'}
            </button>
            <button type="button" onClick={() => { setOpen(false); setConfirmation('') }} className="px-4 py-2.5 border border-slate-200 text-sm text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
