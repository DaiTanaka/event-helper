'use client'

import { useState } from 'react'
import { TIMETABLE_TEMPLATES } from '@/lib/timetable-templates'

type Row = {
  id: string
  type: '' | '設営' | '開催' | '撤収'
  start: string
  end: string
  content: string
  location: string
}

type ViewMode = 'timeline' | 'list'

const TYPE_INFO: Record<string, { bar: string; badge: string }> = {
  設営: { bar: 'bg-slate-50 border-slate-200',   badge: 'bg-slate-200 text-slate-700' },
  開催: { bar: 'bg-green-50 border-green-200',   badge: 'bg-green-100 text-green-700' },
  撤収: { bar: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  '':   { bar: 'bg-white border-slate-100',      badge: 'bg-slate-50 text-slate-400' },
}

const PX_PER_MIN = 2.5   // 1 hour = 150px

function parseMin(t: string): number | null {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return isNaN(h) || isNaN(m) ? null : h * 60 + m
}

function fmtTime(mins: number): string {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
}

function newRow(): Row {
  return { id: crypto.randomUUID(), type: '', start: '', end: '', content: '', location: '' }
}

const STORAGE_KEY = 'try-timetable'

/* ── Timeline view ────────────────────────────────────────── */
function TimelineView({ rows, editId, onEdit }: { rows: Row[]; editId: string | null; onEdit: (id: string) => void }) {
  const timed = rows
    .map(r => ({ ...r, sm: parseMin(r.start), em: parseMin(r.end) }))
    .filter((r): r is typeof r & { sm: number; em: number } => r.sm !== null && r.em !== null && r.em > r.sm)
    .sort((a, b) => a.sm - b.sm)

  if (timed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
        <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">開始・終了時刻を入力するとタイムラインが表示されます</p>
      </div>
    )
  }

  const minT = Math.floor(Math.min(...timed.map(r => r.sm)) / 30) * 30
  const maxT = Math.ceil(Math.max(...timed.map(r => r.em)) / 30) * 30
  const totalH = (maxT - minT) * PX_PER_MIN

  const markers: number[] = []
  for (let t = minT; t <= maxT; t += 30) markers.push(t)

  const untimedRows = rows.filter(r => parseMin(r.start) === null || parseMin(r.end) === null)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex">
        {/* time axis */}
        <div className="relative w-12 shrink-0" style={{ height: totalH + 24 }}>
          {markers.map(t => (
            <div
              key={t}
              className="absolute right-2 text-[10px] text-slate-400 tabular-nums -translate-y-1/2"
              style={{ top: (t - minT) * PX_PER_MIN }}
            >
              {fmtTime(t)}
            </div>
          ))}
        </div>

        {/* blocks area */}
        <div className="relative flex-1 border-l border-slate-200" style={{ height: totalH + 24 }}>
          {/* grid lines */}
          {markers.map(t => (
            <div
              key={t}
              className={`absolute inset-x-0 border-t ${t % 60 === 0 ? 'border-slate-200' : 'border-slate-100 border-dashed'}`}
              style={{ top: (t - minT) * PX_PER_MIN }}
            />
          ))}

          {/* event blocks */}
          {timed.map(row => {
            const top = (row.sm - minT) * PX_PER_MIN
            const blockH = Math.max((row.em - row.sm) * PX_PER_MIN, 28)
            const info = TYPE_INFO[row.type] ?? TYPE_INFO['']
            const active = editId === row.id

            return (
              <button
                key={row.id}
                onClick={() => onEdit(row.id === editId ? '' : row.id)}
                className={`absolute left-2 right-2 border rounded-lg overflow-hidden text-left transition-all
                  ${info.bar}
                  ${active ? 'ring-2 ring-orange-400 shadow-md z-10' : 'hover:shadow-sm hover:border-orange-200'}
                `}
                style={{ top: top + 2, height: blockH - 4 }}
              >
                <div className="flex items-start gap-1.5 px-2 py-1 h-full overflow-hidden">
                  {row.type && (
                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded shrink-0 mt-0.5 ${info.badge}`}>
                      {row.type}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate leading-tight">
                      {row.content || <span className="text-slate-300 font-normal">（内容未入力）</span>}
                    </p>
                    {blockH >= 46 && (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {row.start}–{row.end}{row.location ? ` / ${row.location}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {untimedRows.length > 0 && (
        <p className="text-[11px] text-slate-400 mt-3 pl-14">
          ※ 時刻未設定の行{untimedRows.length}件はリスト表示で確認できます
        </p>
      )}
    </div>
  )
}

/* ── List view ─────────────────────────────────────────────── */
function ListView({ rows, editId, onEdit }: { rows: Row[]; editId: string | null; onEdit: (id: string) => void }) {
  const sorted = [...rows].sort((a, b) => {
    if (!a.start && !b.start) return 0
    if (!a.start) return 1
    if (!b.start) return -1
    return a.start.localeCompare(b.start)
  })

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
        <p className="text-sm">行を追加してタイムテーブルを作りましょう</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 no-print">
          <tr className="text-xs text-slate-400">
            <th className="px-3 py-2 text-left font-medium w-16">区分</th>
            <th className="px-3 py-2 text-left font-medium w-20">開始</th>
            <th className="px-3 py-2 text-left font-medium w-20">終了</th>
            <th className="px-3 py-2 text-left font-medium">内容</th>
            <th className="px-3 py-2 text-left font-medium w-24 hidden sm:table-cell">場所</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.map(row => {
            const info = TYPE_INFO[row.type] ?? TYPE_INFO['']
            return (
              <tr
                key={row.id}
                onClick={() => onEdit(row.id === editId ? '' : row.id)}
                className={`cursor-pointer transition-colors ${editId === row.id ? 'bg-orange-50' : 'hover:bg-slate-50/60'}`}
              >
                <td className="px-3 py-2.5">
                  {row.type
                    ? <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${info.badge}`}>{row.type}</span>
                    : <span className="text-slate-300 text-xs">—</span>
                  }
                </td>
                <td className="px-3 py-2.5 text-slate-600 tabular-nums text-xs">{row.start || '—'}</td>
                <td className="px-3 py-2.5 text-slate-600 tabular-nums text-xs">{row.end || '—'}</td>
                <td className="px-3 py-2.5 font-medium text-slate-800 text-sm">
                  {row.content || <span className="text-slate-300 font-normal text-xs">（未入力）</span>}
                </td>
                <td className="px-3 py-2.5 text-slate-500 text-xs hidden sm:table-cell">{row.location || '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ── Edit panel ─────────────────────────────────────────────── */
function EditPanel({
  row,
  onChange,
  onDelete,
  onClose,
}: {
  row: Row
  onChange: (patch: Partial<Row>) => void
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <div className="shrink-0 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-4 py-3 no-print">
      <div className="max-w-2xl mx-auto space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-wide">編集中</span>
          <div className="flex-1" />
          <button
            onClick={onDelete}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            削除
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            完了
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <select
            value={row.type}
            onChange={e => onChange({ type: e.target.value as Row['type'] })}
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          >
            <option value="">区分なし</option>
            <option value="設営">設営</option>
            <option value="開催">開催</option>
            <option value="撤収">撤収</option>
          </select>
          <input type="time" value={row.start}
            onChange={e => onChange({ start: e.target.value })}
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input type="time" value={row.end}
            onChange={e => onChange({ end: e.target.value })}
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input type="text" value={row.location}
            onChange={e => onChange({ location: e.target.value })}
            placeholder="場所"
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <input type="text" value={row.content}
          onChange={e => onChange({ content: e.target.value })}
          placeholder="内容を入力（例：開会式・基調講演・会場設営 など）"
          autoFocus
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
    </div>
  )
}

/* ── Template picker modal ──────────────────────────────────── */
function TemplateModal({ onSelect, onClose }: { onSelect: (rows: Row[]) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-slate-800">テンプレートから始める</h2>
            <p className="text-xs text-slate-400 mt-0.5">選択後も自由に編集できます</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-3">
          {TIMETABLE_TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.rows as Row[])}
              className="group w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{tpl.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">{tpl.label}</p>
                  <p className="text-xs text-slate-400">{tpl.description}</p>
                </div>
                <span className="text-[10px] text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-full shrink-0">{tpl.rows.length}行</span>
              </div>
              <div className="space-y-0.5">
                {tpl.rows.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className={`px-1.5 py-0.5 rounded font-medium text-[9px] shrink-0 ${
                      r.type === '設営' ? 'bg-slate-200 text-slate-700' :
                      r.type === '開催' ? 'bg-green-100 text-green-700' :
                      r.type === '撤収' ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'
                    }`}>{r.type || '—'}</span>
                    <span className="tabular-nums shrink-0">{r.start}</span>
                    <span className="flex-1 truncate">{r.content}</span>
                  </div>
                ))}
                {tpl.rows.length > 3 && (
                  <p className="text-[10px] text-slate-400 pl-1">…他{tpl.rows.length - 3}行</p>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors">
            テンプレートを使わずに始める
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function TryTimetable() {
  const [rows, setRows] = useState<Row[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return []
  })
  const [editId, setEditId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [showTemplates, setShowTemplates] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return false
      }
    } catch {}
    return true
  })

  function save(next: Row[]) {
    setRows(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function addRow() {
    const r = newRow()
    save([...rows, r])
    setEditId(r.id)
  }

  function updateRow(id: string, patch: Partial<Row>) {
    save(rows.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  function deleteRow(id: string) {
    save(rows.filter(r => r.id !== id))
    setEditId(null)
  }

  function loadTemplate(templateRows: Row[]) {
    save(templateRows)
    setShowTemplates(false)
  }

  function handleEdit(id: string) {
    setEditId(id || null)
  }

  const editRow = rows.find(r => r.id === editId) ?? null

  return (
    <div className="flex flex-col h-full">
      {showTemplates && <TemplateModal onSelect={loadTemplate} onClose={() => setShowTemplates(false)} />}

      {/* ツールバー */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center gap-2 px-4 shrink-0 no-print">
        <span className="text-sm font-medium text-slate-700 hidden sm:block">タイムテーブル</span>

        {/* view toggle */}
        <div className="flex bg-slate-100 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              viewMode === 'timeline' ? 'bg-white text-slate-700 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            タイムライン
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white text-slate-700 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            リスト
          </button>
        </div>

        <button
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
          テンプレート
        </button>

        <div className="flex-1" />

        <button
          onClick={addRow}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          追加
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          印刷
        </button>
      </div>

      {/* content */}
      <div className="flex-1 overflow-auto p-4 pb-2">
        {viewMode === 'timeline'
          ? <TimelineView rows={rows} editId={editId} onEdit={handleEdit} />
          : <ListView     rows={rows} editId={editId} onEdit={handleEdit} />
        }
      </div>

      {/* edit panel */}
      {editRow && (
        <EditPanel
          row={editRow}
          onChange={patch => updateRow(editRow.id, patch)}
          onDelete={() => deleteRow(editRow.id)}
          onClose={() => setEditId(null)}
        />
      )}
    </div>
  )
}
