import Link from 'next/link'
import { getFeaturedEvents, getMonthCalendar } from '@/lib/event-calendar'

function planningMonth(): number {
  // イベント企画は2ヵ月前が目安
  const m = new Date().getMonth() + 1
  return ((m - 1 + 2) % 12) + 1
}

export default function EventHints() {
  const target = planningMonth()
  const label = getMonthCalendar(target)?.label ?? `${target}月`
  const events = getFeaturedEvents(target)

  if (events.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <p className="text-xs font-bold text-slate-700">今から計画したい：{label}のイベント</p>
          <p className="text-[10px] text-slate-400 mt-0.5">イベント企画は約2ヵ月前がスタートの目安です</p>
        </div>
        <Link
          href={`/features/calendar?month=${target}`}
          className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors whitespace-nowrap ml-4"
        >
          すべて見る →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-0.5 px-0.5">
        {events.map(event => (
          <Link
            key={event.name}
            href={`/events/new?hint=${encodeURIComponent(event.name)}${event.event_type ? `&hintType=${event.event_type}` : ''}`}
            className="group shrink-0 w-44 bg-white border border-slate-100 rounded-2xl p-3.5 hover:border-orange-200 hover:shadow-sm transition-all"
          >
            <div className="text-2xl mb-2 leading-none">{event.emoji}</div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug mb-1">
              {event.name}
            </p>
            <p className="text-[10px] text-slate-400 mb-2 leading-snug">{event.timing}</p>
            <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{event.idea}</p>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-orange-500 group-hover:text-orange-600 transition-colors">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              このイベントを計画する
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
