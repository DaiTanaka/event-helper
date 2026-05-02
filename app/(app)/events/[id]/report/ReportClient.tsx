'use client'

import { useState, useTransition, useSyncExternalStore } from 'react'
import type { Event, EventContent, EventBudgetItem, EventReport } from '@/lib/types'
import { saveReport } from './actions'

// ── 型定義 ────────────────────────────────────────────────────
type Photo = { id: string; url: string; caption: string }

type ReportConfig = {
  hiddenSections: string[]
  photos: Photo[]
}

function uid() { return Math.random().toString(36).slice(2) }
function fmt(n: number) { return `¥${n.toLocaleString()}` }

const inputCls = "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
const textareaCls = `${inputCls} resize-none`

// ── セクションカード ─────────────────────────────────────────
function Section({
  title, hidden, onToggle, children,
}: {
  title: string
  hidden: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-opacity ${hidden ? 'opacity-50 border-slate-100' : 'border-slate-100'}`}>
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className={`text-xs ${hidden ? 'text-red-400' : 'text-slate-400'}`}>
            {hidden ? '印刷から除外' : '印刷に含める'}
          </span>
          <input
            type="checkbox"
            checked={!hidden}
            onChange={onToggle}
            className="w-3.5 h-3.5 accent-orange-500"
          />
        </label>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

function StarRating({
  value, onChange, label,
}: {
  value: number | null
  onChange: (v: number | null) => void
  label: string
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1.5">{label}</p>
      <div className="flex gap-0.5 items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(value === star ? null : star)}
            className={`text-xl leading-none transition-colors ${
              star <= (value ?? 0) ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
            }`}
          >
            ★
          </button>
        ))}
        {value != null && (
          <span className="text-xs text-slate-400 ml-1.5">{value}/5</span>
        )}
      </div>
    </div>
  )
}

// ── 写真セクション（編集） ─────────────────────────────────────
function PhotoEditor({ photos, onChange }: { photos: Photo[]; onChange: (p: Photo[]) => void }) {
  function addPhoto() {
    onChange([...photos, { id: uid(), url: '', caption: '' }])
  }

  function updatePhoto(id: string, updates: Partial<Photo>) {
    onChange(photos.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  function removePhoto(id: string) {
    onChange(photos.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-3">
      {photos.map((photo, i) => (
        <div key={photo.id} className="bg-slate-50 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 shrink-0">写真 {i + 1}</span>
            <button onClick={() => removePhoto(photo.id)} className="ml-auto text-xs text-red-400 hover:text-red-600">削除</button>
          </div>
          <input
            value={photo.url}
            onChange={e => updatePhoto(photo.id, { url: e.target.value })}
            placeholder="画像URL（https://...）"
            className={inputCls}
          />
          <input
            value={photo.caption}
            onChange={e => updatePhoto(photo.id, { caption: e.target.value })}
            placeholder="キャプション（任意）"
            className={inputCls}
          />
          {photo.url && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption} className="w-full max-h-48 object-cover" referrerPolicy="no-referrer"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addPhoto}
        className="w-full text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl py-3 hover:bg-slate-50 hover:text-orange-500 hover:border-orange-300 transition-colors"
      >
        + 写真を追加（URLで指定）
      </button>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <p className="text-xs font-semibold text-amber-700 mb-1">画像URLの指定方法</p>
        <ol className="text-[11px] text-amber-700 space-y-1 list-decimal list-inside leading-relaxed">
          <li>Googleドライブに画像をアップロード</li>
          <li>「共有」→「リンクを知っている全員」に変更</li>
          <li>URLの <code className="bg-amber-100 px-0.5 rounded">file/d/[ID]/view</code> を <code className="bg-amber-100 px-0.5 rounded">uc?id=[ID]</code> に書き換え</li>
          <li>または <strong>imgur.com</strong> に投稿してURLをコピー</li>
        </ol>
      </div>
    </div>
  )
}

// ── 印刷用レポート表示 ────────────────────────────────────────
function PrintView({
  event: e, contents, budgetItems, data, hidden, photos,
}: {
  event: Event
  contents: EventContent[]
  budgetItems: EventBudgetItem[]
  data: Partial<EventReport>
  hidden: Set<string>
  photos: Photo[]
}) {
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) : '—'

  const confirmedContents = contents.filter(c => c.status === 'confirmed')
  const contentActual = confirmedContents.reduce((s, c) => s + (c.actual_cost ?? c.estimated_cost ?? 0), 0)
  const itemsActual = budgetItems.reduce((s, i) => s + (i.actual_price ?? i.unit_price * i.quantity), 0)
  const totalExpense = data.total_expense ?? contentActual + itemsActual

  // 表示セクションの順序から番号を振る
  let num = 0
  function n() { return ++num }

  const visiblePhotos = photos.filter(p => p.url)

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-sm print:py-0 print:px-0 space-y-8">

      {/* タイトル */}
      <div className="text-center border-b-2 border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-900">{e.title}</h1>
        <p className="text-slate-500 mt-1">イベント実施報告書</p>
        {data.report_date && (
          <p className="text-xs text-slate-400 mt-1">
            報告日: {new Date(data.report_date + 'T00:00:00').toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      {/* 1. イベント概要 */}
      {!hidden.has('overview') && (
        <div>
          <h2 className="text-base font-bold border-b border-slate-400 pb-1 mb-3">{n()}. イベント概要</h2>
          <table className="w-full border-collapse">
            <tbody>
              {[
                ['イベント名', e.title],
                ['開催日程', e.event_date ? `${formatDate(e.event_date)}${e.end_date && e.end_date !== e.event_date ? ` 〜 ${formatDate(e.end_date)}` : ''}` : '—'],
                ['会場', e.venue_name ? `${e.venue_name}${e.venue_address ? `（${e.venue_address}）` : ''}` : '—'],
                ['主催', e.organizer ?? '—'],
                ['来場目標人数', e.expected_visitors ? `${e.expected_visitors.toLocaleString()}名` : '—'],
                ['来場実績人数', data.actual_visitors != null ? `${data.actual_visitors.toLocaleString()}名` : '—'],
                ['天候', data.weather || '—'],
              ].map(([label, value]) => (
                <tr key={label} className="border border-slate-300">
                  <th className="px-3 py-1.5 bg-slate-100 text-left font-medium text-slate-700 whitespace-nowrap w-36 text-xs">{label}</th>
                  <td className="px-3 py-1.5 text-slate-800 text-xs">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. 実施概要 */}
      {!hidden.has('summary') && data.summary && (
        <div>
          <h2 className="text-base font-bold border-b border-slate-400 pb-1 mb-3">{n()}. 実施概要</h2>
          <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* 3. 成果・評価 */}
      {!hidden.has('evaluation') && (
        <div>
          <h2 className="text-base font-bold border-b border-slate-400 pb-1 mb-3">{n()}. 成果・評価</h2>
          <div className="space-y-4">
            {(data.content_score || data.venue_score || data.operation_score || data.satisfaction_score != null) && (
              <table className="border-collapse text-xs mb-2">
                <tbody>
                  {[
                    data.content_score   != null ? ['コンテンツ評価', '★'.repeat(data.content_score) + '☆'.repeat(5 - data.content_score)] : null,
                    data.venue_score     != null ? ['会場評価',       '★'.repeat(data.venue_score)   + '☆'.repeat(5 - data.venue_score)]   : null,
                    data.operation_score != null ? ['運営評価',       '★'.repeat(data.operation_score) + '☆'.repeat(5 - data.operation_score)] : null,
                    data.satisfaction_score != null ? ['総合満足度', `${data.satisfaction_score} / 5.0`] : null,
                  ].filter((x): x is [string, string] => x !== null).map(([label, val]) => (
                    <tr key={label} className="border border-slate-300">
                      <th className="px-3 py-1 bg-slate-100 text-left font-medium text-slate-700 whitespace-nowrap w-32">{label}</th>
                      <td className="px-3 py-1 text-slate-800">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {data.highlights && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">【良かった点・成果】</p>
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{data.highlights}</p>
              </div>
            )}
            {data.improvements && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">【課題・改善点】</p>
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{data.improvements}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. 次回への申し送り */}
      {!hidden.has('next_actions') && data.next_actions && (
        <div>
          <h2 className="text-base font-bold border-b border-slate-400 pb-1 mb-3">{n()}. 次回への申し送り</h2>
          <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{data.next_actions}</p>
        </div>
      )}

      {/* 5. 収支報告 */}
      {!hidden.has('budget') && (
        <div>
          <h2 className="text-base font-bold border-b border-slate-400 pb-1 mb-3">{n()}. 収支報告</h2>
          <table className="w-full border-collapse mb-3">
            <tbody>
              {([
                ['総予算', e.total_budget != null ? fmt(e.total_budget) : '—'],
                ['収入合計', data.total_revenue != null ? fmt(data.total_revenue) : '—'],
                ['支出合計（実績）', fmt(totalExpense)],
                ...(e.total_budget != null ? [['予算残', fmt(e.total_budget - totalExpense)]] : []),
              ] as [string, string][]).map(([label, value]) => (
                <tr key={label} className="border border-slate-300">
                  <th className="px-3 py-1.5 bg-slate-100 text-left font-medium text-slate-700 whitespace-nowrap w-36 text-xs">{label}</th>
                  <td className="px-3 py-1.5 text-slate-800 text-xs">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {confirmedContents.length > 0 && (
            <>
              <p className="text-xs font-semibold text-slate-600 mb-2">コンテンツ費内訳</p>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-300 px-2 py-1 text-left font-medium">コンテンツ名</th>
                    <th className="border border-slate-300 px-2 py-1 text-right font-medium w-24">実績</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedContents.map(c => (
                    <tr key={c.id}>
                      <td className="border border-slate-300 px-2 py-1">{c.title}</td>
                      <td className="border border-slate-300 px-2 py-1 text-right tabular-nums">
                        {c.actual_cost != null ? fmt(c.actual_cost) : c.estimated_cost != null ? fmt(c.estimated_cost) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* 6. イベント写真 */}
      {!hidden.has('photos') && visiblePhotos.length > 0 && (
        <div>
          <h2 className="text-base font-bold border-b border-slate-400 pb-1 mb-4">{n()}. イベント写真</h2>
          <div className="grid grid-cols-2 gap-4">
            {visiblePhotos.map(photo => (
              <div key={photo.id} className="space-y-1">
                <div className="border border-slate-200 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.caption} className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                </div>
                {photo.caption && (
                  <p className="text-xs text-slate-500 text-center">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── メイン ────────────────────────────────────────────────────
export default function ReportClient({
  event,
  contents,
  budgetItems,
  report,
}: {
  event: Event
  contents: EventContent[]
  budgetItems: EventBudgetItem[]
  report: EventReport | null
}) {
  const storageKey = `report-config-${event.id}`

  const [printMode, setPrintMode] = useState(false)
  const [saving, startSave] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 非表示セクション・写真（localStorage）
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const cfg = JSON.parse(saved) as ReportConfig
        return new Set(cfg.hiddenSections ?? [])
      }
    } catch {}
    return new Set()
  })
  const [photos, setPhotos] = useState<Photo[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const cfg = JSON.parse(saved) as ReportConfig
        return cfg.photos ?? []
      }
    } catch {}
    return []
  })

  function saveConfig(hidden: Set<string>, ph: Photo[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        hiddenSections: Array.from(hidden),
        photos: ph,
      }))
    } catch {}
  }

  function toggleSection(key: string) {
    setHiddenSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      saveConfig(next, photos)
      return next
    })
  }

  function updatePhotos(ph: Photo[]) {
    setPhotos(ph)
    saveConfig(hiddenSections, ph)
  }

  // レポートフィールド
  const [actualVisitors, setActualVisitors] = useState(report?.actual_visitors?.toString() ?? '')
  const [totalRevenue, setTotalRevenue] = useState(report?.total_revenue?.toString() ?? '')
  const [totalExpense, setTotalExpense] = useState(report?.total_expense?.toString() ?? '')
  const [summary, setSummary] = useState(report?.summary ?? '')
  const [highlights, setHighlights] = useState(report?.highlights ?? '')
  const [improvements, setImprovements] = useState(report?.improvements ?? '')
  const [nextActions, setNextActions] = useState(report?.next_actions ?? '')
  const [satisfactionScore, setSatisfactionScore] = useState(report?.satisfaction_score?.toString() ?? '')
  const [weather, setWeather] = useState(report?.weather ?? '')
  const [reportDate, setReportDate] = useState(report?.report_date ?? new Date().toISOString().split('T')[0])
  const [contentScore, setContentScore] = useState<number | null>(report?.content_score ?? null)
  const [venueScore, setVenueScore] = useState<number | null>(report?.venue_score ?? null)
  const [operationScore, setOperationScore] = useState<number | null>(report?.operation_score ?? null)

  const parsedActualVisitors = actualVisitors !== '' ? parseInt(actualVisitors) || null : null
  const computedAttendanceRate =
    parsedActualVisitors != null && event.expected_visitors
      ? Math.round((parsedActualVisitors / event.expected_visitors) * 10000) / 100
      : null

  const currentData = {
    actual_visitors: parsedActualVisitors,
    total_revenue: totalRevenue !== '' ? parseInt(totalRevenue) || null : null,
    total_expense: totalExpense !== '' ? parseInt(totalExpense) || null : null,
    summary,
    highlights,
    improvements,
    next_actions: nextActions,
    satisfaction_score: satisfactionScore !== '' ? parseFloat(satisfactionScore) || null : null,
    weather,
    report_date: reportDate,
    content_score: contentScore,
    venue_score: venueScore,
    operation_score: operationScore,
    attendance_rate: computedAttendanceRate,
  }

  function handleSave() {
    setError(null)
    startSave(async () => {
      const r = await saveReport(event.id, currentData)
      if (r.error) {
        setError(r.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    })
  }

  if (printMode) {
    return (
      <>
        <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPrintMode(false)} className="text-sm text-slate-500 hover:text-slate-700">← 編集に戻る</button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            印刷 / PDF保存
          </button>
        </div>
        <div className="pt-16">
          <PrintView
            event={event}
            contents={contents}
            budgetItems={budgetItems}
            data={currentData}
            hidden={hiddenSections}
            photos={photos}
          />
        </div>
      </>
    )
  }

  return (
    <div className="space-y-5">

      {/* 基本情報 */}
      <Section title="基本情報" hidden={hiddenSections.has('overview')} onToggle={() => toggleSection('overview')}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="報告日">
            <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} className={inputCls} />
          </Field>
          <Field label="来場者数（実績）">
            <input type="number" value={actualVisitors} onChange={e => setActualVisitors(e.target.value)}
              placeholder={event.expected_visitors?.toString() ?? '例: 120'} className={inputCls} />
          </Field>
          <Field label="天候">
            <input value={weather} onChange={e => setWeather(e.target.value)}
              placeholder="例: 晴れ" className={inputCls} />
          </Field>
        </div>
        {computedAttendanceRate != null && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500">来場率</span>
            <span className={`text-sm font-bold ${computedAttendanceRate >= 100 ? 'text-green-600' : computedAttendanceRate >= 80 ? 'text-amber-600' : 'text-red-500'}`}>
              {computedAttendanceRate}%
            </span>
            <span className="text-xs text-slate-400">
              （目標 {event.expected_visitors?.toLocaleString()} 名）
            </span>
          </div>
        )}
      </Section>

      {/* 実施概要 */}
      <Section title="実施概要" hidden={hiddenSections.has('summary')} onToggle={() => toggleSection('summary')}>
        <Field label="全体の概要・特記事項">
          <textarea rows={4} value={summary} onChange={e => setSummary(e.target.value)}
            placeholder="イベント全体の流れや特記事項を記載してください"
            className={textareaCls} />
        </Field>
      </Section>

      {/* 成果・評価 */}
      <Section title="成果・評価" hidden={hiddenSections.has('evaluation')} onToggle={() => toggleSection('evaluation')}>
        <div className="space-y-4">
          {/* 詳細スコア */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
            <StarRating value={contentScore} onChange={setContentScore} label="コンテンツ評価" />
            <StarRating value={venueScore} onChange={setVenueScore} label="会場評価" />
            <StarRating value={operationScore} onChange={setOperationScore} label="運営評価" />
          </div>
          <Field label="総合満足度スコア (0〜5)">
            <input type="number" step={0.1} min={0} max={5} value={satisfactionScore}
              onChange={e => setSatisfactionScore(e.target.value)}
              placeholder="例: 4.2" className={`${inputCls} max-w-36`} />
          </Field>
          <Field label="良かった点・成果">
            <textarea rows={4} value={highlights} onChange={e => setHighlights(e.target.value)}
              placeholder="・参加者の反応が良く盛況だった&#10;・スタッフ連携がスムーズだった"
              className={textareaCls} />
          </Field>
          <Field label="課題・改善点">
            <textarea rows={4} value={improvements} onChange={e => setImprovements(e.target.value)}
              placeholder="・受付の待機列が長くなった&#10;・音響トラブルが発生した"
              className={textareaCls} />
          </Field>
        </div>
      </Section>

      {/* 次回への申し送り */}
      <Section title="次回への申し送り" hidden={hiddenSections.has('next_actions')} onToggle={() => toggleSection('next_actions')}>
        <Field label="申し送り事項">
          <textarea rows={4} value={nextActions} onChange={e => setNextActions(e.target.value)}
            placeholder="・受付を2レーンに増やす&#10;・音響チェックを1時間前に実施する"
            className={textareaCls} />
        </Field>
      </Section>

      {/* 収支報告 */}
      <Section title="収支報告" hidden={hiddenSections.has('budget')} onToggle={() => toggleSection('budget')}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="収入合計（¥）">
            <input type="number" value={totalRevenue} onChange={e => setTotalRevenue(e.target.value)}
              placeholder="例: 500000" className={inputCls} />
          </Field>
          <Field label="支出合計（¥）">
            <input type="number" value={totalExpense} onChange={e => setTotalExpense(e.target.value)}
              placeholder="予算管理から自動計算" className={inputCls} />
          </Field>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          ※ 支出を空欄にすると予算管理ページの実績金額を自動で集計します
        </p>
      </Section>

      {/* イベント写真 */}
      <Section title="イベント写真" hidden={hiddenSections.has('photos')} onToggle={() => toggleSection('photos')}>
        {mounted ? (
          <PhotoEditor photos={photos} onChange={updatePhotos} />
        ) : (
          <p className="text-sm text-slate-400">読み込み中...</p>
        )}
      </Section>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex items-center justify-between gap-3 pb-6">
        <button
          onClick={() => setPrintMode(true)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          印刷プレビュー
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {saving ? '保存中...' : saved ? '✓ 保存しました' : '保存'}
        </button>
      </div>

      {/* 非表示セクションの案内 */}
      {mounted && hiddenSections.size > 0 && (
        <div className="text-xs text-slate-400 text-center pb-2">
          {hiddenSections.size}件のセクションが印刷から除外されています
        </div>
      )}
    </div>
  )
}
