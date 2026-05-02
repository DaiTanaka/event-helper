'use client'

import { useState } from 'react'
import { deleteEvent } from './actions'

export default function DeleteEventButton({ eventId }: { eventId: string }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">削除しますか？</span>
        <form action={deleteEvent.bind(null, eventId)}>
          <button type="submit" className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            削除する
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          取消
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
    >
      このイベントを削除
    </button>
  )
}
