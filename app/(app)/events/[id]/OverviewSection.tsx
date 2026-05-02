'use client'

import { useState } from 'react'
import Link from 'next/link'

type Row = { label: string; value: React.ReactNode }

export default function OverviewSection({
  primary,
  secondary,
  editHref,
}: {
  primary: Row[]
  secondary: Row[]
  editHref?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const hasSecondary = secondary.length > 0
  const rows = expanded ? [...primary, ...secondary] : primary

  if (primary.length === 0 && secondary.length === 0) return null

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-3.5 border-b border-slate-50 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">開催概要</h2>
        {editHref && (
          <Link
            href={editHref}
            className="no-print flex items-center gap-1 text-xs text-slate-400 hover:text-orange-500 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            編集
          </Link>
        )}
      </div>

      <dl className="divide-y divide-slate-50">
        {rows.map(({ label, value }) => (
          <div key={label} className="grid grid-cols-3 gap-4 px-6 py-3">
            <dt className="text-sm text-slate-400 font-medium">{label}</dt>
            <dd className="col-span-2 text-sm text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>

      {hasSecondary && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="no-print w-full py-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50"
        >
          {expanded ? (
            <>
              閉じる
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              詳細情報を見る
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </section>
  )
}
