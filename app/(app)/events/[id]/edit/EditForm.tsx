'use client'

import { useActionState } from 'react'
import { updateEvent } from '../actions'
import { useRouter } from 'next/navigation'
import type { Event } from '@/lib/types'
import { EVENT_TYPES, VENUE_TYPES, PREFECTURES } from '@/lib/eventFields'
import AgeCheckboxes from '@/app/(app)/events/AgeCheckboxes'

type Props = { event: Event }

const inp = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white'
const opt = <span className="text-xs font-normal text-slate-400 ml-1">任意</span>

export default function EditForm({ event }: Props) {
  const router = useRouter()
  const updateWithId = updateEvent.bind(null, event.id)
  const [state, formAction, pending] = useActionState(updateWithId, {})

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">
          {state.error}
        </div>
      )}

      {/* ── 1. イベントの概要（何をやるか） ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-slate-700 text-sm">イベントの概要</h2>
          <p className="text-xs text-slate-400 mt-0.5">何をやるイベントかを定義します</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            イベント名 <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            defaultValue={event.title}
            placeholder="例：春のファミリーフェスタ2025"
            className={inp}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">イベント種別{opt}</label>
          <select name="event_type" defaultValue={event.event_type ?? ''} className={inp}>
            <option value="">選択してください</option>
            {EVENT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">イベント概要・目的{opt}</label>
          <textarea
            name="overview"
            rows={3}
            defaultValue={event.overview ?? ''}
            placeholder="イベントの目的・内容・特徴など"
            className={`${inp} resize-none`}
          />
        </div>
      </section>

      {/* ── 2. 対象・規模（誰のためにどのくらい） ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-slate-700 text-sm">対象・規模</h2>
          <p className="text-xs text-slate-400 mt-0.5">誰のためのイベントか、どのくらいの規模か</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">ターゲット年齢層{opt}</label>
          <AgeCheckboxes checked={event.target_age ?? []} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ターゲット層・属性{opt}</label>
            <input
              name="target_audience"
              type="text"
              defaultValue={event.target_audience ?? ''}
              placeholder="例：子連れファミリー・商業施設利用者"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">来場想定人数{opt}</label>
            <div className="relative">
              <input name="expected_visitors" type="number" min={0} defaultValue={event.expected_visitors ?? ''} placeholder="200" className={`${inp} pr-8`} />
              <span className="absolute right-3 top-2.5 text-sm text-slate-400">名</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 開催日程（いつ） ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-700 text-sm">開催日程</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">開催日</label>
            <input name="event_date" type="date" defaultValue={event.event_date ?? ''} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">終了日{opt}</label>
            <input name="end_date" type="date" defaultValue={event.end_date ?? ''} className={inp} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">設営日{opt}</label>
            <input name="setup_date" type="date" defaultValue={event.setup_date ?? ''} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">撤収日{opt}</label>
            <input name="teardown_date" type="date" defaultValue={event.teardown_date ?? ''} className={inp} />
          </div>
        </div>
      </section>

      {/* ── 4. 会場（どこで） ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-700 text-sm">会場</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">会場名{opt}</label>
          <input name="venue_name" type="text" defaultValue={event.venue_name ?? ''} placeholder="例：○○ショッピングモール 1Fイベントスペース" className={inp} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">会場住所{opt}</label>
          <input name="venue_address" type="text" defaultValue={event.venue_address ?? ''} placeholder="例：東京都渋谷区〇〇1-2-3" className={inp} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Googleマップ URL{opt}</label>
          <input name="venue_map_url" type="url" defaultValue={event.venue_map_url ?? ''} placeholder="https://maps.app.goo.gl/..." className={inp} />
          <p className="text-[11px] text-slate-400 mt-1">Googleマップで「共有」→「リンクをコピー」で取得できます</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">会場タイプ{opt}</label>
            <select name="venue_type" defaultValue={event.venue_type ?? ''} className={inp}>
              <option value="">選択してください</option>
              {VENUE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">開催都道府県{opt}</label>
            <select name="prefecture" defaultValue={event.prefecture ?? ''} className={inp}>
              <option value="">選択してください</option>
              {PREFECTURES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">アクセス・搬入口{opt}</label>
          <textarea name="venue_access" rows={2} defaultValue={event.venue_access ?? ''} placeholder="例：搬入口は北側。スタッフ駐車場は建物裏。" className={`${inp} resize-none`} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">入館・入場方法{opt}</label>
          <textarea name="venue_entry" rows={2} defaultValue={event.venue_entry ?? ''} placeholder="例：南側搬入口から入場。受付で担当者名を伝えIDバッジを受け取る。" className={`${inp} resize-none`} />
        </div>
      </section>

      {/* ── 5. 主催・スタッフ（誰が仕切るか） ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-slate-700 text-sm">主催・スタッフ</h2>
          <p className="text-xs text-slate-400 mt-0.5">主催者情報と担当スタッフへの案内をまとめて管理</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">主催者{opt}</label>
          <input name="organizer" type="text" defaultValue={event.organizer ?? ''} placeholder="例：○○株式会社 営業推進部" className={inp} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">共催・協力{opt}</label>
          <input name="co_organizers" type="text" defaultValue={event.co_organizers ?? ''} placeholder="例：○○市、△△商工会議所" className={inp} />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-medium text-slate-500 mb-3">担当者連絡先</p>
          <div className="space-y-3">
            <input name="contact_name" type="text" defaultValue={event.contact_name ?? ''} placeholder="担当者名" className={inp} />
            <div className="grid grid-cols-2 gap-4">
              <input name="contact_phone" type="tel" defaultValue={event.contact_phone ?? ''} placeholder="電話番号" className={inp} />
              <input name="contact_email" type="email" defaultValue={event.contact_email ?? ''} placeholder="メールアドレス" className={inp} />
            </div>
            <textarea name="notes" rows={2} defaultValue={event.notes ?? ''} placeholder="備考・その他の特記事項（任意）" className={`${inp} resize-none`} />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-medium text-slate-500 mb-3">スタッフ当日案内{opt}</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">集合場所</label>
                <input name="venue_meeting_place" type="text" defaultValue={event.venue_meeting_place ?? ''} placeholder="例：正面玄関前" className={inp} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">集合時間</label>
                <input name="venue_meeting_time" type="text" defaultValue={event.venue_meeting_time ?? ''} placeholder="例：10:00（開演30分前）" className={inp} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">服装・ユニフォーム</label>
              <textarea name="staff_dress_code" rows={2} defaultValue={event.staff_dress_code ?? ''} placeholder="例：黒ポロシャツ着用。社名入りベストは受付で貸与。" className={`${inp} resize-none`} />
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-3 pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 text-center text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 py-3 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {pending ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  )
}
