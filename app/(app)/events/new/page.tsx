import type { Metadata } from 'next'
import EventForm from './EventForm'

export const metadata: Metadata = {
  title: '新規イベント作成 | イベント開催ナビ',
}

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ hint?: string; hintType?: string }>
}) {
  const { hint, hintType } = await searchParams
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">新規イベント作成</h1>
        <p className="text-sm text-slate-500 mt-1">基本情報を入力してください</p>
      </div>
      <EventForm defaultTitle={hint} defaultEventType={hintType} />
    </div>
  )
}
