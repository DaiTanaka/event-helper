import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Event, EventTask } from '@/lib/types'
import { TEMPLATE_CATEGORIES, TEMPLATE_TASKS } from '@/lib/task-templates'
import type { TemplateCategory, TemplateTask } from '@/lib/task-templates'
import TasksClient from './TasksClient'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title').eq('id', id).single()
  if (!data) return {}
  return { title: `${data.title} — タスク管理 | イベント開催ナビ` }
}

export default async function TasksPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: tasks }, { data: dbCategories, error: catError }, { data: dbTasks, error: taskError }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase
      .from('event_tasks')
      .select('*')
      .eq('event_id', id)
      .order('sort_order'),
    supabase.from('task_template_categories').select('*').order('sort_order'),
    supabase.from('task_template_tasks').select('*').eq('active', true).order('sort_order'),
  ])

  if (!event) notFound()

  const e = event as Event
  const taskList = (tasks ?? []) as EventTask[]

  const templateCategories: TemplateCategory[] = (!catError && dbCategories?.length)
    ? dbCategories.map(r => ({ id: r.id, label: r.label, color: r.color }))
    : TEMPLATE_CATEGORIES

  const templateTasks: TemplateTask[] = (!taskError && dbTasks?.length)
    ? dbTasks.map(r => ({
        id: r.id,
        title: r.title,
        categoryId: r.category_id,
        priority: r.priority as 'high' | 'medium' | 'low',
        startDays: r.start_days,
        dueDays: r.due_days,
      }))
    : TEMPLATE_TASKS

  const formatDate = (d: string | null) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) : null

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/events/${id}`}
        className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-4"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {e.title}
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">タスク管理</h1>
          {e.event_date && (
            <p className="text-sm text-slate-500 mt-0.5">開催日: {formatDate(e.event_date)}</p>
          )}
        </div>
        <Link href="/features/checklist" target="_blank" className="text-xs text-orange-500 hover:text-orange-600 border border-orange-200 rounded-lg px-2.5 py-1.5 whitespace-nowrap shrink-0 transition-colors">
          💡 準備チェックリスト
        </Link>
      </div>

      <TasksClient event={e} tasks={taskList} templateCategories={templateCategories} templateTasks={templateTasks} />
    </div>
  )
}
