'use client'

import { useState } from 'react'
import { downloadCSV } from '@/lib/csv'

type QARow = {
  question: string
  answer: string
  event_title: string
  event_type: string | null
  prefecture: string | null
  expected_visitors: number | null
  user_email: string
}

type ScheduleRow = {
  content: string
  schedule_type: string | null
  location: string | null
  start_time: string | null
  end_time: string | null
  event_type: string | null
  event_title: string
}

type EquipmentRow = {
  name: string
  category: string | null
  quantity: number
  unit: string | null
  event_type: string | null
  event_title: string
}

type ContactRow = {
  name: string
  role: string | null
  company: string | null
  event_type: string | null
  event_title: string
}

type Tab = 'qa' | 'schedule' | 'equipment' | 'contacts'

const EVENT_TYPE_LABELS: Record<string, string> = {
  corporate_party: '企業・社内',
  school_event: '学校・教育',
  community_festival: '地域・自治体',
  commercial_facility: '商業施設',
  sports: 'スポーツ',
  exhibition: '展示会',
  other: 'その他',
}

function label(v: string | null) {
  return v ? (EVENT_TYPE_LABELS[v] ?? v) : '—'
}

export default function DataClient({
  qa,
  schedules,
  equipment,
  contacts,
}: {
  qa: QARow[]
  schedules: ScheduleRow[]
  equipment: EquipmentRow[]
  contacts: ContactRow[]
}) {
  const [tab, setTab] = useState<Tab>('qa')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')

  function filterRows<T extends { event_type: string | null; event_title: string }>(rows: T[]): T[] {
    return rows.filter(r => {
      const matchType = !filterType || r.event_type === filterType
      const q = search.toLowerCase()
      const matchSearch = !q || r.event_title.toLowerCase().includes(q)
      return matchType && matchSearch
    })
  }

  const filteredQA = filterRows(qa).filter(r => {
    const q = search.toLowerCase()
    if (!q) return true
    return r.event_title.toLowerCase().includes(q) ||
      r.question.toLowerCase().includes(q) ||
      r.answer.toLowerCase().includes(q)
  })

  const filteredSchedules = filterRows(schedules).filter(r => {
    const q = search.toLowerCase()
    if (!q) return true
    return r.event_title.toLowerCase().includes(q) || r.content.toLowerCase().includes(q)
  })

  const filteredEquipment = filterRows(equipment).filter(r => {
    const q = search.toLowerCase()
    if (!q) return true
    return r.event_title.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
  })

  const filteredContacts = filterRows(contacts).filter(r => {
    const q = search.toLowerCase()
    if (!q) return true
    return r.event_title.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      (r.role ?? '').toLowerCase().includes(q)
  })

  // 頻出集計
  const contactTopRoles = (() => {
    const map = new Map<string, number>()
    contacts.forEach(c => {
      const key = (c.role ?? '').trim()
      if (key) map.set(key, (map.get(key) ?? 0) + 1)
    })
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)
  })()

  const equipTopNames = (() => {
    const map = new Map<string, number>()
    equipment.forEach(e => map.set(e.name, (map.get(e.name) ?? 0) + 1))
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)
  })()

  const scheduleTopContent = (() => {
    const map = new Map<string, number>()
    schedules.forEach(s => {
      const key = s.content.trim()
      if (key) map.set(key, (map.get(key) ?? 0) + 1)
    })
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)
  })()

  function downloadQA() {
    downloadCSV('QAデータ.csv', [
      ['質問', '回答', 'イベントタイトル', 'イベント種別', '都道府県', '来場想定', 'ユーザー'],
      ...filteredQA.map(r => [
        r.question, r.answer, r.event_title,
        label(r.event_type), r.prefecture ?? '',
        r.expected_visitors ? String(r.expected_visitors) : '',
        r.user_email,
      ]),
    ])
  }

  function downloadSchedules() {
    downloadCSV('スケジュールデータ.csv', [
      ['内容', '区分', 'ステージ/エリア', '開始', '終了', 'イベント種別', 'イベントタイトル'],
      ...filteredSchedules.map(r => [
        r.content, r.schedule_type ?? '', r.location ?? '',
        r.start_time?.slice(0, 5) ?? '', r.end_time?.slice(0, 5) ?? '',
        label(r.event_type), r.event_title,
      ]),
    ])
  }

  function downloadEquipment() {
    downloadCSV('備品データ.csv', [
      ['品名', 'カテゴリ', '数量', '単位', 'イベント種別', 'イベントタイトル'],
      ...filteredEquipment.map(r => [
        r.name, r.category ?? '', String(r.quantity), r.unit ?? '',
        label(r.event_type), r.event_title,
      ]),
    ])
  }

  function downloadContacts() {
    downloadCSV('連絡先データ.csv', [
      ['名前', '役割', '会社/所属', 'イベント種別', 'イベントタイトル'],
      ...filteredContacts.map(r => [
        r.name, r.role ?? '', r.company ?? '',
        label(r.event_type), r.event_title,
      ]),
    ])
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'qa',        label: 'Q&Aペア',     count: qa.length },
    { key: 'schedule',  label: 'スケジュール', count: schedules.length },
    { key: 'equipment', label: '備品データ',   count: equipment.length },
    { key: 'contacts',  label: '連絡先',       count: contacts.length },
  ]

  return (
    <div className="space-y-4">

      {/* サマリー */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tabs.map(t => (
          <div key={t.key} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-slate-400 mb-1">{t.label}</p>
            <p className="text-2xl font-bold text-slate-800 tabular-nums">{t.count.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">件のレコード</p>
          </div>
        ))}
      </div>

      {/* タブ + フィルター */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                tab === t.key ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-300 w-48"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          <option value="">種別: すべて</option>
          {Object.entries(EVENT_TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <div className="flex-1" />
        {tab === 'qa' && (
          <button onClick={downloadQA} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        )}
        {tab === 'schedule' && (
          <button onClick={downloadSchedules} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        )}
        {tab === 'equipment' && (
          <button onClick={downloadEquipment} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        )}
        {tab === 'contacts' && (
          <button onClick={downloadContacts} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        )}
      </div>

      {/* Q&Aタブ */}
      {tab === 'qa' && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-100 text-xs text-slate-400">
            {filteredQA.length.toLocaleString()} 件表示
          </div>
          <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
            {filteredQA.slice(0, 200).map((row, i) => (
              <div key={i} className="px-4 py-3 hover:bg-slate-50">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      <span className="text-orange-400 font-bold mr-1">Q.</span>{row.question}
                    </p>
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                      <span className="text-green-600 font-bold mr-1">A.</span>{row.answer}
                    </p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    {row.event_type && (
                      <span className="inline-block text-xs px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded-full">
                        {label(row.event_type)}
                      </span>
                    )}
                    <p className="text-xs text-slate-400 truncate max-w-28">{row.event_title}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredQA.length > 200 && (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">
                表示は200件まで。CSVで全件取得できます。
              </div>
            )}
          </div>
        </div>
      )}

      {/* スケジュールタブ */}
      {tab === 'schedule' && (
        <div className="space-y-4">
          {/* 頻出コンテンツ TOP20 */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-500">頻出スケジュール内容 TOP20</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <tbody>
                  {scheduleTopContent.map(([content, count]) => (
                    <tr key={content} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">{content}</td>
                      <td className="px-4 py-2 text-right text-slate-500 tabular-nums">{count} 件</td>
                      <td className="px-4 py-2 w-32">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-400 rounded-full"
                            style={{ width: `${(count / (scheduleTopContent[0]?.[1] ?? 1)) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 生データ */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 text-xs text-slate-400">
              {filteredSchedules.length.toLocaleString()} 件表示
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-2 text-left text-slate-400 font-medium">内容</th>
                    <th className="px-4 py-2 text-left text-slate-400 font-medium hidden sm:table-cell">区分</th>
                    <th className="px-4 py-2 text-left text-slate-400 font-medium hidden sm:table-cell">時間</th>
                    <th className="px-4 py-2 text-left text-slate-400 font-medium">種別</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.slice(0, 200).map((s, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">{s.content}</td>
                      <td className="px-4 py-2 text-slate-500 hidden sm:table-cell">{s.schedule_type ?? '—'}</td>
                      <td className="px-4 py-2 text-slate-500 tabular-nums hidden sm:table-cell">
                        {s.start_time?.slice(0, 5) ?? ''}
                        {s.end_time && <>〜{s.end_time.slice(0, 5)}</>}
                      </td>
                      <td className="px-4 py-2 text-slate-400">{label(s.event_type)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 連絡先タブ */}
      {tab === 'contacts' && (
        <div className="space-y-4">
          {/* 頻出役割 TOP20 */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-500">頻出役割 TOP20</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <tbody>
                  {contactTopRoles.map(([role, count]) => (
                    <tr key={role} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">{role}</td>
                      <td className="px-4 py-2 text-right text-slate-500 tabular-nums">{count} 件</td>
                      <td className="px-4 py-2 w-32">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-400 rounded-full"
                            style={{ width: `${(count / (contactTopRoles[0]?.[1] ?? 1)) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 生データ */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 text-xs text-slate-400">
              {filteredContacts.length.toLocaleString()} 件表示
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-2 text-left text-slate-400 font-medium">名前</th>
                    <th className="px-4 py-2 text-left text-slate-400 font-medium">役割</th>
                    <th className="px-4 py-2 text-left text-slate-400 font-medium hidden sm:table-cell">会社/所属</th>
                    <th className="px-4 py-2 text-left text-slate-400 font-medium">種別</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.slice(0, 200).map((c, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">{c.name}</td>
                      <td className="px-4 py-2 text-slate-500">{c.role ?? '—'}</td>
                      <td className="px-4 py-2 text-slate-400 hidden sm:table-cell">{c.company ?? '—'}</td>
                      <td className="px-4 py-2 text-slate-400">{label(c.event_type)}</td>
                    </tr>
                  ))}
                  {filteredContacts.length > 200 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-xs text-slate-400 text-center">
                        表示は200件まで。CSVで全件取得できます。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 備品タブ */}
      {tab === 'equipment' && (
        <div className="space-y-4">
          {/* 頻出備品 TOP20 */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-500">頻出備品名 TOP20</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <tbody>
                  {equipTopNames.map(([name, count]) => (
                    <tr key={name} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">{name}</td>
                      <td className="px-4 py-2 text-right text-slate-500 tabular-nums">{count} 件のイベント</td>
                      <td className="px-4 py-2 w-32">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-400 rounded-full"
                            style={{ width: `${(count / (equipTopNames[0]?.[1] ?? 1)) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 生データ */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 text-xs text-slate-400">
              {filteredEquipment.length.toLocaleString()} 件表示
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-2 text-left text-slate-400 font-medium">品名</th>
                    <th className="px-4 py-2 text-left text-slate-400 font-medium hidden sm:table-cell">カテゴリ</th>
                    <th className="px-4 py-2 text-right text-slate-400 font-medium">数量</th>
                    <th className="px-4 py-2 text-left text-slate-400 font-medium">種別</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.slice(0, 200).map((e, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">{e.name}</td>
                      <td className="px-4 py-2 text-slate-500 hidden sm:table-cell">{e.category ?? '—'}</td>
                      <td className="px-4 py-2 text-right text-slate-500 tabular-nums">{e.quantity}{e.unit ?? ''}</td>
                      <td className="px-4 py-2 text-slate-400">{label(e.event_type)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
