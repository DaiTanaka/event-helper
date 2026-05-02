'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { addSchedule, updateSchedule, deleteSchedule, moveSchedule, clearAllSchedules, bulkAddScheduleTemplate } from './actions'
import type { EventSchedule } from '@/lib/types'
import { downloadCSV } from '@/lib/csv'
import { getTemplatesForEventType } from '@/lib/timetable-templates'

type Props = { eventId: string; schedules: EventSchedule[]; eventType?: string | null }
type ViewMode = 'list' | 'track' | 'timeline'

const DAY_LABELS = ['1日目', '2日目', '3日目', '4日目', '5日目']

type Preset = { label: string; content: string; start_time?: string; end_time?: string }
const PRESETS: Preset[] = [
  { label: '開場・受付', content: '開場・受付', start_time: '09:00', end_time: '10:00' },
  { label: '開会式', content: '開会式・挨拶', start_time: '10:00', end_time: '10:15' },
  { label: '来賓挨拶', content: '来賓挨拶' },
  { label: '休憩', content: '休憩' },
  { label: '昼食', content: '昼食・休憩', start_time: '12:00', end_time: '13:00' },
  { label: '閉会式', content: '閉会式・挨拶' },
  { label: '片付け', content: '片付け・撤収' },
]

const inputCls = 'w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'

const SCHEDULE_TYPE_STYLE: Record<string, string> = {
  設営: 'bg-slate-100 text-slate-600',
  撤収: 'bg-orange-100 text-orange-700',
  開催: 'bg-green-100 text-green-700',
}

function schedulesByStartTime(items: EventSchedule[]) {
  return [...items].sort((a, b) => {
    if (!a.start_time && !b.start_time) return a.sort_order - b.sort_order
    if (!a.start_time) return 1
    if (!b.start_time) return -1
    return a.start_time.localeCompare(b.start_time)
  })
}

// ────────────────────────────
// 編集フォーム（共通）
// ────────────────────────────
function EditScheduleForm({
  schedule,
  eventId,
  locationOptions,
  onClose,
}: {
  schedule: EventSchedule
  eventId: string
  locationOptions: string[]
  onClose: () => void
}) {
  const updateWithId = updateSchedule.bind(null, schedule.id, eventId)
  const [state, formAction, pending] = useActionState(updateWithId, {})
  const wasPending = useRef(false)
  const startTimeRef = useRef<HTMLInputElement>(null)
  const endTimeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose()
    wasPending.current = pending
  }, [pending, state, onClose])

  return (
    <div className="bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 my-1">
      <form action={formAction} className="space-y-2">
        {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <select name="schedule_type" defaultValue={schedule.schedule_type ?? ''} className={inputCls}>
            <option value="">区分なし</option>
            <option value="設営">設営</option>
            <option value="開催">開催</option>
            <option value="撤収">撤収</option>
          </select>
          <select name="day_number" defaultValue={schedule.day_number} className={inputCls}>
            {[1, 2, 3, 4, 5].map(d => (
              <option key={d} value={d}>{DAY_LABELS[d - 1]}</option>
            ))}
          </select>
          <div className="flex gap-1">
            <input ref={startTimeRef} name="start_time" type="time" defaultValue={schedule.start_time?.slice(0, 5) ?? ''} className={inputCls + ' flex-1'} />
            <button type="button" title="現在の時刻（整時）" onClick={() => { const h = String(new Date().getHours()).padStart(2,'0'); if (startTimeRef.current) startTimeRef.current.value = `${h}:00` }} className="shrink-0 px-1.5 border border-slate-200 rounded text-slate-400 hover:text-orange-400 hover:border-orange-200 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3"/></svg>
            </button>
          </div>
          <div className="flex gap-1">
            <input ref={endTimeRef} name="end_time" type="time" defaultValue={schedule.end_time?.slice(0, 5) ?? ''} className={inputCls + ' flex-1'} />
            <button type="button" title="現在の時刻（整時）" onClick={() => { const h = String(new Date().getHours()).padStart(2,'0'); if (endTimeRef.current) endTimeRef.current.value = `${h}:00` }} className="shrink-0 px-1.5 border border-slate-200 rounded text-slate-400 hover:text-orange-400 hover:border-orange-200 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3"/></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input name="content" type="text" required defaultValue={schedule.content} placeholder="内容 *" className={inputCls} />
          <div className="relative">
            <input
              name="location"
              type="text"
              list="edit-location-list"
              defaultValue={schedule.location ?? ''}
              placeholder="ステージ・エリア"
              className={inputCls}
            />
            <datalist id="edit-location-list">
              {locationOptions.map(loc => <option key={loc} value={loc} />)}
            </datalist>
          </div>
          <input name="responsible_person" type="text" defaultValue={schedule.responsible_person ?? ''} placeholder="担当者" className={inputCls} />
          <input name="notes" type="text" defaultValue={schedule.notes ?? ''} placeholder="メモ" className={inputCls} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className="px-3 py-1 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {pending ? '保存中...' : '保存'}
          </button>
          <button type="button" onClick={onClose} className="px-3 py-1 text-xs text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}

// ────────────────────────────
// 編集モーダル（タイムライン用）
// ────────────────────────────
function EditScheduleModal({
  schedule,
  eventId,
  locationOptions,
  onClose,
}: {
  schedule: EventSchedule
  eventId: string
  locationOptions: string[]
  onClose: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-semibold text-slate-700 text-sm">スケジュール編集</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4">
          <EditScheduleForm
            schedule={schedule}
            eventId={eventId}
            locationOptions={locationOptions}
            onClose={onClose}
          />
          <div className="mt-4 pt-4 border-t border-slate-100">
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">本当に削除しますか？</span>
                <form action={deleteSchedule.bind(null, schedule.id, eventId)}>
                  <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">
                    削除する
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-slate-300 hover:text-red-400 transition-colors"
              >
                このスケジュールを削除
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────
// リスト表示
// ────────────────────────────
function ListView({
  daySchedules,
  eventId,
  locationOptions,
  editingId,
  confirmDeleteId,
  setEditingId,
  setConfirmDeleteId,
}: {
  daySchedules: EventSchedule[]
  eventId: string
  locationOptions: string[]
  editingId: string | null
  confirmDeleteId: string | null
  setEditingId: (id: string | null) => void
  setConfirmDeleteId: (id: string | null) => void
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-50">
          <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium w-28">時間</th>
          <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">内容</th>
          <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium w-24 hidden sm:table-cell">担当</th>
          <th className="w-28"></th>
        </tr>
      </thead>
      <tbody>
        {daySchedules.map((s, dayIdx) =>
          editingId === s.id ? (
            <tr key={s.id}>
              <td colSpan={4} className="px-4 py-2">
                <EditScheduleForm
                  schedule={s}
                  eventId={eventId}
                  locationOptions={locationOptions}
                  onClose={() => setEditingId(null)}
                />
              </td>
            </tr>
          ) : (
            <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-500 tabular-nums text-xs whitespace-nowrap">
                {s.start_time?.slice(0, 5)}
                {s.end_time && <>〜{s.end_time.slice(0, 5)}</>}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {s.schedule_type && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${SCHEDULE_TYPE_STYLE[s.schedule_type] ?? ''}`}>
                      {s.schedule_type}
                    </span>
                  )}
                  <span className="text-slate-800">{s.content}</span>
                </div>
                {s.location && <div className="text-xs text-slate-400 mt-0.5">📍 {s.location}</div>}
                {s.notes && <div className="text-xs text-slate-400 mt-0.5">{s.notes}</div>}
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">{s.responsible_person}</td>
              <td className="px-2 py-3">
                <div className="flex items-center justify-end gap-0.5">
                  <form action={moveSchedule.bind(null, s.id, eventId, 'up')}>
                    <button type="submit" disabled={dayIdx === 0} className="p-1 text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed" title="上へ">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  </form>
                  <form action={moveSchedule.bind(null, s.id, eventId, 'down')}>
                    <button type="submit" disabled={dayIdx === daySchedules.length - 1} className="p-1 text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed" title="下へ">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </form>
                  <button type="button" onClick={() => { setEditingId(s.id); setConfirmDeleteId(null) }} className="p-1 text-slate-300 hover:text-orange-300" title="編集">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {confirmDeleteId === s.id ? (
                    <div className="flex items-center gap-1.5 ml-1">
                      <form action={deleteSchedule.bind(null, s.id, eventId)}>
                        <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">削除</button>
                      </form>
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600">取消</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => { setConfirmDeleteId(s.id); setEditingId(null) }} className="p-1 text-slate-300 hover:text-red-400" title="削除">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  )
}

// ────────────────────────────
// トラック表示
// ────────────────────────────
function TrackCard({
  schedule,
  eventId,
  locationOptions,
  editing,
  onEdit,
  confirmDeleteId,
  setConfirmDeleteId,
  setEditingId,
}: {
  schedule: EventSchedule
  eventId: string
  locationOptions: string[]
  editing: boolean
  onEdit: () => void
  confirmDeleteId: string | null
  setConfirmDeleteId: (id: string | null) => void
  setEditingId: (id: string | null) => void
}) {
  if (editing) {
    return (
      <EditScheduleForm
        schedule={schedule}
        eventId={eventId}
        locationOptions={locationOptions}
        onClose={() => setEditingId(null)}
      />
    )
  }

  return (
    <div className="relative border border-slate-100 rounded-xl p-3 hover:border-slate-200 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {(schedule.start_time || schedule.end_time) && (
            <p className="text-xs text-slate-400 tabular-nums mb-1">
              {schedule.start_time?.slice(0, 5)}
              {schedule.end_time && <> 〜 {schedule.end_time.slice(0, 5)}</>}
            </p>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            {schedule.schedule_type && (
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${SCHEDULE_TYPE_STYLE[schedule.schedule_type] ?? ''}`}>
                {schedule.schedule_type}
              </span>
            )}
            <span className="text-sm font-medium text-slate-800">{schedule.content}</span>
          </div>
          {schedule.responsible_person && (
            <p className="text-xs text-slate-400 mt-1">担当: {schedule.responsible_person}</p>
          )}
          {schedule.notes && (
            <p className="text-xs text-slate-400 mt-0.5">{schedule.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" onClick={onEdit} className="p-1 text-slate-300 hover:text-orange-300" title="編集">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {confirmDeleteId === schedule.id ? (
            <div className="flex items-center gap-1">
              <form action={deleteSchedule.bind(null, schedule.id, eventId)}>
                <button type="submit" className="text-xs text-red-600 font-medium">削除</button>
              </form>
              <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400">取消</button>
            </div>
          ) : (
            <button type="button" onClick={() => { setConfirmDeleteId(schedule.id); setEditingId(null) }} className="p-1 text-slate-300 hover:text-red-400" title="削除">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function TrackView({
  daySchedules,
  eventId,
  locationOptions,
  editingId,
  confirmDeleteId,
  setEditingId,
  setConfirmDeleteId,
}: {
  daySchedules: EventSchedule[]
  eventId: string
  locationOptions: string[]
  editingId: string | null
  confirmDeleteId: string | null
  setEditingId: (id: string | null) => void
  setConfirmDeleteId: (id: string | null) => void
}) {
  const uniqueLocations = [...new Set(
    daySchedules.filter(s => s.location).map(s => s.location!)
  )]
  const hasGlobal = daySchedules.some(s => !s.location)
  const tracks = [...(hasGlobal ? ['全体'] : []), ...uniqueLocations]

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-px bg-slate-100 min-w-0"
        style={{ gridTemplateColumns: `repeat(${tracks.length}, minmax(200px, 1fr))` }}
      >
        {tracks.map(track => {
          const items = schedulesByStartTime(
            daySchedules.filter(s => track === '全体' ? !s.location : s.location === track)
          )
          return (
            <div key={track} className="bg-white">
              <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-600 text-center">
                {track}
              </div>
              <div className="p-2 space-y-2 min-h-[60px]">
                {items.map(s => (
                  <TrackCard
                    key={s.id}
                    schedule={s}
                    eventId={eventId}
                    locationOptions={locationOptions}
                    editing={editingId === s.id}
                    onEdit={() => { setEditingId(s.id); setConfirmDeleteId(null) }}
                    confirmDeleteId={confirmDeleteId}
                    setConfirmDeleteId={setConfirmDeleteId}
                    setEditingId={setEditingId}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ────────────────────────────
// タイムライン表示（縦軸=時間、横軸=ステージ）
// ────────────────────────────

const TRACK_COLORS = [
  { header: 'bg-red-500',    block: 'bg-red-400'    },
  { header: 'bg-amber-400',  block: 'bg-amber-400'  },
  { header: 'bg-green-500',  block: 'bg-green-500'  },
  { header: 'bg-blue-500',   block: 'bg-blue-500'   },
  { header: 'bg-purple-500', block: 'bg-purple-500' },
  { header: 'bg-teal-500',   block: 'bg-teal-500'   },
  { header: 'bg-pink-500',   block: 'bg-pink-500'   },
]

const PPM = 2.5 // pixels per minute

function timeToMinutes(time: string): number {
  const parts = time.split(':').map(Number)
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
}

function TimelineView({
  daySchedules,
  onEdit,
}: {
  daySchedules: EventSchedule[]
  onEdit: (schedule: EventSchedule) => void
}) {
  const timedEvents = daySchedules.filter(s => s.start_time)

  if (timedEvents.length === 0) {
    return (
      <p className="px-6 py-8 text-center text-sm text-slate-400">
        開始時間が設定されたスケジュールがありません
      </p>
    )
  }

  // 全トラック（location が異なるものを列として分ける）
  const locationList = [...new Set(daySchedules.map(s => s.location?.trim() || '全体'))]

  // 時間範囲（1時間単位で切り上げ/切り捨て）
  const allMinutes = timedEvents.flatMap(s => [
    timeToMinutes(s.start_time!),
    s.end_time ? timeToMinutes(s.end_time) : timeToMinutes(s.start_time!) + 60,
  ])
  const minMinute = Math.floor(Math.min(...allMinutes) / 60) * 60
  const maxMinute = Math.ceil(Math.max(...allMinutes) / 60) * 60
  const totalMinutes = maxMinute - minMinute

  // 30分刻みの目盛り用配列
  const ticks = Array.from(
    { length: Math.round(totalMinutes / 30) + 1 },
    (_, i) => minMinute + i * 30
  )

  const AXIS_W = 48
  const TRACK_MIN_W = 150

  return (
    <div className="overflow-x-auto">
      <div
        className="flex select-none"
        style={{ minWidth: `${AXIS_W + locationList.length * TRACK_MIN_W}px` }}
      >
        {/* ── 時間軸 ── */}
        <div
          className="shrink-0 relative border-r border-slate-200 bg-white"
          style={{ width: `${AXIS_W}px` }}
        >
          {/* トラックヘッダー分のスペーサー */}
          <div className="h-12" />
          <div className="relative" style={{ height: `${totalMinutes * PPM}px` }}>
            {ticks.map(min => {
              const isHour = min % 60 === 0
              const top = (min - minMinute) * PPM
              const label = `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`
              return (
                <div
                  key={min}
                  className="absolute left-0 right-0"
                  style={{ top: `${top}px` }}
                >
                  <span className={`absolute right-1.5 -translate-y-1/2 leading-none tabular-nums ${
                    isHour
                      ? 'text-xs font-semibold text-slate-600'
                      : 'text-[10px] text-slate-300'
                  }`}>
                    {isHour ? `${Math.floor(min / 60)}:00` : label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── トラック列 ── */}
        <div
          className="flex-1 grid"
          style={{ gridTemplateColumns: `repeat(${locationList.length}, minmax(${TRACK_MIN_W}px, 1fr))` }}
        >
          {locationList.map((track, trackIdx) => {
            const color = TRACK_COLORS[trackIdx % TRACK_COLORS.length]
            const trackEvents = timedEvents.filter(
              s => (s.location?.trim() || '全体') === track
            )

            return (
              <div key={track} className="border-l border-slate-100 first:border-l-0 flex flex-col">
                {/* ヘッダー */}
                <div className={`h-12 flex items-center justify-center px-2 ${color.header}`}>
                  <span className="text-sm font-bold text-white tracking-wide text-center leading-tight">
                    {track}
                  </span>
                </div>

                {/* タイムライン本体 */}
                <div
                  className="relative flex-1 bg-slate-50/30"
                  style={{ height: `${totalMinutes * PPM}px` }}
                >
                  {/* グリッド線 */}
                  {ticks.map(min => {
                    const isHour = min % 60 === 0
                    return (
                      <div
                        key={min}
                        className={`absolute left-0 right-0 border-t ${
                          isHour ? 'border-slate-200' : 'border-slate-100'
                        }`}
                        style={{ top: `${(min - minMinute) * PPM}px` }}
                      />
                    )
                  })}

                  {/* イベントブロック */}
                  {trackEvents.map(event => {
                    const startMin = timeToMinutes(event.start_time!) - minMinute
                    const endMin = event.end_time
                      ? timeToMinutes(event.end_time) - minMinute
                      : startMin + 60
                    const durationMin = Math.max(endMin - startMin, 15)
                    const heightPx = durationMin * PPM

                    return (
                      <div
                        key={event.id}
                        className={`absolute left-1 right-1 ${color.block} rounded-lg overflow-hidden shadow-sm cursor-pointer hover:opacity-90 hover:shadow-md active:opacity-75 transition-all`}
                        onClick={() => onEdit(event)}
                        title="クリックして編集"
                        style={{
                          top: `${startMin * PPM + 1}px`,
                          height: `${Math.max(heightPx - 2, 28)}px`,
                        }}
                      >
                        <div className="px-2 py-1 h-full flex flex-col justify-start">
                          {/* 時間 */}
                          <p className="text-[10px] text-white/80 tabular-nums leading-tight shrink-0">
                            {event.start_time?.slice(0, 5)}
                            {event.end_time && <>〜{event.end_time.slice(0, 5)}</>}
                          </p>
                          {/* 内容 */}
                          {heightPx >= 40 && (
                            <p className="text-xs font-bold text-white leading-tight mt-0.5 line-clamp-2">
                              {event.content}
                            </p>
                          )}
                          {heightPx < 40 && (
                            <p className="text-xs font-semibold text-white leading-tight truncate">
                              {event.content}
                            </p>
                          )}
                          {/* 担当者 */}
                          {heightPx >= 64 && event.responsible_person && (
                            <p className="text-[10px] text-white/70 leading-tight mt-0.5 truncate shrink-0">
                              {event.responsible_person}
                            </p>
                          )}
                          {/* メモ */}
                          {heightPx >= 88 && event.notes && (
                            <p className="text-[10px] text-white/60 leading-tight mt-0.5 truncate shrink-0">
                              {event.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────
// メインコンポーネント
// ────────────────────────────
const SCHEDULE_TYPE_BADGE: Record<string, string> = {
  設営: 'bg-slate-200 text-slate-700',
  開催: 'bg-green-100 text-green-700',
  撤収: 'bg-orange-100 text-orange-700',
}

export default function ScheduleSection({ eventId, schedules, eventType }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>(
    schedules.some(s => s.start_time && s.end_time) ? 'timeline' : 'list'
  )
  const [showForm, setShowForm] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [modalSchedule, setModalSchedule] = useState<EventSchedule | null>(null)

  const templateList = getTemplatesForEventType(eventType)
  const formRef = useRef<HTMLFormElement>(null)
  const contentRef = useRef<HTMLInputElement>(null)
  const startTimeRef = useRef<HTMLInputElement>(null)
  const endTimeRef = useRef<HTMLInputElement>(null)

  const addWithId = addSchedule.bind(null, eventId)
  const [state, formAction, pending] = useActionState(addWithId, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setShowForm(false)
      formRef.current?.reset()
    }
    wasPending.current = pending
  }, [pending, state])

  function applyPreset(preset: Preset) {
    if (contentRef.current) contentRef.current.value = preset.content
    if (startTimeRef.current) startTimeRef.current.value = preset.start_time ?? ''
    if (endTimeRef.current) endTimeRef.current.value = preset.end_time ?? ''
    setShowForm(true)
  }

  const maxDay = Math.max(...schedules.map(s => s.day_number), 1)
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)

  const locationOptions = [...new Set(
    schedules.filter(s => s.location).map(s => s.location!)
  )]
  const hasMultipleTracks = locationOptions.length >= 2 ||
    (locationOptions.length === 1 && schedules.some(s => !s.location))
  const hasTimedEvents = schedules.some(s => s.start_time && s.end_time)

  return (
  <>
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-semibold text-slate-700">タイムスケジュール</h2>
        <div className="flex items-center gap-2">
          {/* ビュー切替 */}
          {(hasMultipleTracks || hasTimedEvents) && (
            <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                リスト
              </button>
              {hasMultipleTracks && (
                <button
                  type="button"
                  onClick={() => setViewMode('track')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${viewMode === 'track' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  トラック
                </button>
              )}
              {hasTimedEvents && (
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${viewMode === 'timeline' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  タイムライン
                </button>
              )}
            </div>
          )}
          {schedules.length > 0 && (
            <>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <form action={clearAllSchedules.bind(null, eventId)}>
                    <button type="submit" className="text-xs text-red-600 font-medium hover:text-red-700">全件削除</button>
                  </form>
                  <button type="button" onClick={() => setConfirmClear(false)} className="text-xs text-slate-400 hover:text-slate-600">取消</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmClear(true)} className="p-1 text-slate-300 hover:text-red-400 transition-colors" title="全件削除">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => downloadCSV('タイムスケジュール.csv', [
                  ['日目', '区分', '開始', '終了', '内容', 'ステージ/エリア', '担当者', 'メモ'],
                  ...schedules.map(s => [
                    `${s.day_number}日目`,
                    s.schedule_type ?? '',
                    s.start_time?.slice(0, 5) ?? '',
                    s.end_time?.slice(0, 5) ?? '',
                    s.content,
                    s.location ?? '',
                    s.responsible_person ?? '',
                    s.notes ?? '',
                  ]),
                ])}
                className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                title="CSVダウンロード"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={() => setShowTemplates(v => !v)}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            テンプレート
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null) }}
            className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            追加
          </button>
        </div>
      </div>

      {/* テンプレートパネル */}
      {showTemplates && (
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <p className="text-xs text-slate-500 mb-3">
            スケジュールをまとめて追加します。既存のスケジュールに追記されます。
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {templateList.map(tpl => (
              <form key={tpl.id} action={bulkAddScheduleTemplate.bind(null, tpl.id, eventId)}>
                <button
                  type="submit"
                  className="w-full text-left border border-slate-200 bg-white rounded-xl p-3 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{tpl.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 group-hover:text-orange-600 leading-tight">+ {tpl.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{tpl.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{tpl.rows.length}行</span>
                  </div>
                  <div className="space-y-0.5">
                    {tpl.rows.slice(0, 3).map(r => (
                      <div key={r.id} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        {r.type && (
                          <span className={`px-1 py-px rounded font-medium shrink-0 ${SCHEDULE_TYPE_BADGE[r.type] ?? 'bg-slate-100 text-slate-500'}`}>
                            {r.type}
                          </span>
                        )}
                        {r.start && <span className="text-slate-400 shrink-0">{r.start}</span>}
                        <span className="truncate">{r.content}</span>
                      </div>
                    ))}
                    {tpl.rows.length > 3 && (
                      <p className="text-[10px] text-slate-400">…他 {tpl.rows.length - 3} 行</p>
                    )}
                  </div>
                </button>
              </form>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form ref={formRef} action={formAction} className="border-b border-orange-100 bg-orange-50/30 px-6 py-4 space-y-3">
          <div>
            <p className="text-xs text-slate-400 mb-1.5">クイック挿入:</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {state?.error && <p className="text-xs text-red-600">{state.error}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">区分</label>
              <select name="schedule_type" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">区分なし</option>
                <option value="設営">設営</option>
                <option value="開催">開催</option>
                <option value="撤収">撤収</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">日目</label>
              <select name="day_number" defaultValue="1" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                {[1, 2, 3, 4, 5].map(d => (
                  <option key={d} value={d}>{DAY_LABELS[d - 1]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">開始</label>
              <div className="flex gap-1">
                <input ref={startTimeRef} name="start_time" type="time" className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <button type="button" title="現在の時刻（整時）" onClick={() => { const h = String(new Date().getHours()).padStart(2,'0'); if (startTimeRef.current) startTimeRef.current.value = `${h}:00` }} className="shrink-0 px-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-orange-400 hover:border-orange-200 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3"/></svg>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">終了</label>
              <div className="flex gap-1">
                <input ref={endTimeRef} name="end_time" type="time" className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <button type="button" title="現在の時刻（整時）" onClick={() => { const h = String(new Date().getHours()).padStart(2,'0'); if (endTimeRef.current) endTimeRef.current.value = `${h}:00` }} className="shrink-0 px-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-orange-400 hover:border-orange-200 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">内容 <span className="text-red-500">*</span></label>
              <input ref={contentRef} name="content" type="text" required placeholder="例：開会式・挨拶" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">ステージ・エリア</label>
              <input
                name="location"
                type="text"
                list="add-location-list"
                placeholder="例：ステージ①"
                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <datalist id="add-location-list">
                {locationOptions.map(loc => <option key={loc} value={loc} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">担当者</label>
              <input name="responsible_person" type="text" placeholder="例：田中" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">メモ</label>
              <input name="notes" type="text" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">
              キャンセル
            </button>
            <button type="submit" disabled={pending} className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
              {pending ? '追加中...' : '追加'}
            </button>
          </div>
        </form>
      )}

      {schedules.length === 0 && !showForm && (
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          スケジュールがまだ登録されていません
        </div>
      )}

      {days.map(day => {
        const daySchedules = schedules.filter(s => s.day_number === day)
        if (daySchedules.length === 0) return null
        return (
          <div key={day}>
            {maxDay > 1 && (
              <div className="px-6 py-2 bg-slate-50 text-xs font-medium text-slate-500 border-b border-slate-100">
                {DAY_LABELS[day - 1] ?? `${day}日目`}
              </div>
            )}
            {viewMode === 'timeline' && hasTimedEvents ? (
              <TimelineView daySchedules={daySchedules} onEdit={setModalSchedule} />
            ) : viewMode === 'track' && hasMultipleTracks ? (
              <TrackView
                daySchedules={daySchedules}
                eventId={eventId}
                locationOptions={locationOptions}
                editingId={editingId}
                confirmDeleteId={confirmDeleteId}
                setEditingId={setEditingId}
                setConfirmDeleteId={setConfirmDeleteId}
              />
            ) : (
              <ListView
                daySchedules={daySchedules}
                eventId={eventId}
                locationOptions={locationOptions}
                editingId={editingId}
                confirmDeleteId={confirmDeleteId}
                setEditingId={setEditingId}
                setConfirmDeleteId={setConfirmDeleteId}
              />
            )}
          </div>
        )
      })}
    </section>

    {modalSchedule && (
      <EditScheduleModal
        schedule={modalSchedule}
        eventId={eventId}
        locationOptions={locationOptions}
        onClose={() => setModalSchedule(null)}
      />
    )}
  </>
  )
}
