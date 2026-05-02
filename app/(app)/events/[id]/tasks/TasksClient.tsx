'use client'

import { useState } from 'react'
import type { Event, EventTask } from '@/lib/types'
import type { TemplateCategory, TemplateTask } from '@/lib/task-templates'
import TaskList from './TaskList'
import GanttChart from './GanttChart'

type Tab = 'list' | 'gantt'

export default function TasksClient({
  event,
  tasks,
  templateCategories,
  templateTasks,
}: {
  event: Event
  tasks: EventTask[]
  templateCategories: TemplateCategory[]
  templateTasks: TemplateTask[]
}) {
  const [tab, setTab] = useState<Tab>('list')

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('list')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          タスクリスト
        </button>
        <button
          onClick={() => setTab('gantt')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === 'gantt' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          ガントチャート
        </button>
      </div>

      {tab === 'list' ? (
        <TaskList eventId={event.id} tasks={tasks} templateCategories={templateCategories} templateTasks={templateTasks} />
      ) : (
        <GanttChart event={event} tasks={tasks} />
      )}
    </div>
  )
}
