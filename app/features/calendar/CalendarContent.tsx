'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { EVENT_CALENDAR, type MonthCalendar } from '@/lib/event-calendar'

function planningMonth(): number {
  const m = new Date().getMonth() + 1
  return ((m - 1 + 2) % 12) + 1
}

export default function CalendarContent() {
  const searchParams = useSearchParams()
  const paramMonth = parseInt(searchParams.get('month') ?? '', 10)
  const defaultMonth = paramMonth >= 1 && paramMonth <= 12 ? paramMonth : planningMonth()

  const currentMonth = new Date().getMonth() + 1
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth)

  const monthData = EVENT_CALENDAR.find(m => m.month === selectedMonth)!

  return (
    <>
      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-6 text-center">
          <span className="inline-block text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full mb-4">
            季節のイベントカレンダー
          </span>
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            年間イベントカレンダー
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
            季節ごとのイベントアイデアをまとめました。企画は約2ヵ月前から動き出すのがおすすめです。
          </p>
        </div>
      </section>

      {/* 月タブ */}
      <div className="sticky top-[88px] z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-2 overflow-x-auto">
          <div className="flex">
            {EVENT_CALENDAR.map(m => (
              <button
                key={m.month}
                onClick={() => setSelectedMonth(m.month)}
                className={`shrink-0 px-3 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  selectedMonth === m.month
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {m.month === currentMonth && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mr-1 align-middle -mt-0.5" title="今月" />
                )}
                {m.month === planningMonth() && m.month !== currentMonth && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 mr-1 align-middle -mt-0.5" title="企画の目安" />
                )}
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* イベントカード */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <MonthSection data={monthData} />
        </div>
      </section>
    </>
  )
}

function MonthSection({ data }: { data: MonthCalendar }) {
  const featured = data.events.filter(e => e.featured)
  const others = data.events.filter(e => !e.featured)

  return (
    <div>
      {/* 注目イベント */}
      {featured.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <h2 className="text-sm font-bold text-slate-700">注目イベント</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {featured.map(event => (
              <Link
                key={event.name}
                href={`/events/new?hint=${encodeURIComponent(event.name)}${event.event_type ? `&hintType=${event.event_type}` : ''}`}
                className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 leading-none mt-0.5">{event.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                        {event.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">{event.timing}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{event.idea}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-orange-500 group-hover:text-orange-600 transition-colors">
                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  このイベントを計画する
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* その他のイベント */}
      {others.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <h2 className="text-sm font-bold text-slate-500">その他のイベント</h2>
          </div>
          <div className="space-y-2">
            {others.map(event => (
              <Link
                key={event.name}
                href={`/events/new?hint=${encodeURIComponent(event.name)}${event.event_type ? `&hintType=${event.event_type}` : ''}`}
                className="group flex items-start gap-3 px-4 py-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all"
              >
                <span className="text-xl shrink-0 leading-none mt-0.5">{event.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">
                      {event.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{event.timing}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{event.idea}</p>
                </div>
                <svg
                  className="w-4 h-4 text-slate-300 group-hover:text-orange-400 shrink-0 mt-1 transition-colors"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ピコトン案内 */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-4">
        <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
          💡
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700 mb-1">
            ワークショッププログラムをお探しですか？
          </p>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            ピコトンではイベント向けワークショップコンテンツを提供しています。季節のテーマに合ったプログラムについてご相談ください。
          </p>
          <a
            href="https://workshop.picoton.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            ピコトン公式サイトを見る
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
