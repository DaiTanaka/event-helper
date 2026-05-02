'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { duplicateEvent } from './actions'

export default function DuplicateEventButton({ eventId }: { eventId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDuplicate() {
    setError(null)
    startTransition(async () => {
      const result = await duplicateEvent(eventId)
      if (result.error) {
        setError(result.error)
        setConfirming(false)
      } else if (result.newId) {
        router.push(`/events/${result.newId}`)
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-center gap-2">
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-sm text-slate-500">スケジュール・備品・連絡先・タスクをすべてコピーします</span>
          <button
            onClick={handleDuplicate}
            disabled={isPending}
            className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? '複製中...' : '複製する'}
          </button>
          <button
            onClick={() => { setConfirming(false); setError(null) }}
            disabled={isPending}
            className="px-3 py-1.5 text-sm border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      複製
    </button>
  )
}
