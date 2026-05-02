'use client'

import { useActionState, useState, useEffect, useLayoutEffect, useRef, useTransition } from 'react'
import { addTask, updateTask, deleteTask, setTaskStatus, renameTask, reorderTasks } from './actions'
import type { EventTask } from '@/lib/types'
import type { TemplateCategory, TemplateTask } from '@/lib/task-templates'
import TaskTemplateSelector from './TaskTemplateSelector'

const inputCls = 'w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'

const STATUS_LABELS: Record<EventTask['status'], string> = {
  todo: '未着手',
  in_progress: '進行中',
  done: '完了',
}

const STATUS_NEXT: Record<EventTask['status'], EventTask['status']> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
}

const STATUS_BTN: Record<EventTask['status'], string> = {
  todo: 'bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600',
  in_progress: 'bg-orange-100 text-orange-600 hover:bg-green-100 hover:text-green-700',
  done: 'bg-green-100 text-green-700 hover:bg-slate-100 hover:text-slate-600 line-through',
}

const PRIORITY_DOT: Record<EventTask['priority'], string> = {
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-slate-200',
}

function EditTaskForm({
  task,
  eventId,
  onClose,
}: {
  task: EventTask
  eventId: string
  onClose: () => void
}) {
  const updateWithId = updateTask.bind(null, task.id, eventId)
  const [state, formAction, pending] = useActionState(updateWithId, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose()
    wasPending.current = pending
  }, [pending, state, onClose])

  return (
    <div className="border-b border-slate-100 bg-orange-50/30 px-4 py-3">
      <form action={formAction} className="space-y-2">
        {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input name="title" required defaultValue={task.title} placeholder="タスク名 *" className={inputCls} />
          <select name="status" defaultValue={task.status} className={inputCls}>
            <option value="todo">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="done">完了</option>
          </select>
          <select name="priority" defaultValue={task.priority} className={inputCls}>
            <option value="high">優先度：高</option>
            <option value="medium">優先度：中</option>
            <option value="low">優先度：低</option>
          </select>
          <input name="assignee" defaultValue={task.assignee ?? ''} placeholder="担当者" className={inputCls} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-slate-400 mb-0.5">開始日</label>
            <input name="start_date" type="date" defaultValue={task.start_date ?? ''} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-0.5">期限日</label>
            <input name="due_date" type="date" defaultValue={task.due_date ?? ''} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-0.5">メモ</label>
            <input name="description" defaultValue={task.description ?? ''} placeholder="メモ" className={inputCls} />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className="px-3 py-1 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {pending ? '保存中...' : '保存'}
          </button>
          <button type="button" onClick={onClose} className="px-3 py-1 text-xs text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}

function TaskRow({
  task,
  eventId,
  confirmDeleteId,
  setConfirmDeleteId,
  onEdit,
  isRenaming,
  renameValue,
  onStartRename,
  onRenameChange,
  onRenameCommit,
  onRenameCancel,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  task: EventTask
  eventId: string
  confirmDeleteId: string | null
  setConfirmDeleteId: (id: string | null) => void
  onEdit: () => void
  isRenaming: boolean
  renameValue: string
  onStartRename: () => void
  onRenameChange: (v: string) => void
  onRenameCommit: () => void
  onRenameCancel: () => void
  onDragStart: () => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  isDragOver: boolean
}) {
  const today = new Date().toISOString().slice(0, 10)
  const isOverdue = task.due_date && task.due_date < today && task.status !== 'done'
  const nextStatus = STATUS_NEXT[task.status]

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 min-w-0 transition-colors ${isDragOver ? 'border-t-2 border-t-orange-300 bg-orange-50/30' : ''}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drag handle */}
      <span
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="shrink-0 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-400 select-none touch-none"
        title="ドラッグで並び替え"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </span>

      {/* Status toggle */}
      <form action={setTaskStatus.bind(null, task.id, eventId, nextStatus)}>
        <button
          type="submit"
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${STATUS_BTN[task.status]}`}
          title={`クリックで「${STATUS_LABELS[nextStatus]}」へ`}
        >
          {STATUS_LABELS[task.status]}
        </button>
      </form>

      {/* Priority dot */}
      <span
        className={`shrink-0 w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`}
        title={`優先度：${task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}`}
      />

      {/* Title */}
      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <input
            autoFocus
            value={renameValue}
            onChange={e => onRenameChange(e.target.value)}
            onBlur={onRenameCommit}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); onRenameCommit() }
              if (e.key === 'Escape') onRenameCancel()
            }}
            className="w-full px-1.5 py-0.5 border border-orange-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        ) : (
          <>
            <span
              className={`text-sm cursor-text select-text ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}
              onDoubleClick={onStartRename}
              title="ダブルクリックで名前を変更"
            >
              {task.title}
            </span>
            {task.description && (
              <span className="ml-2 text-xs text-slate-400 truncate">{task.description}</span>
            )}
          </>
        )}
      </div>

      {/* Assignee */}
      {task.assignee && (
        <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{task.assignee}</span>
      )}

      {/* Due date */}
      {task.due_date && (
        <span className={`text-xs shrink-0 tabular-nums ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
          {new Date(task.due_date + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
          {isOverdue && '↑'}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="p-1 text-slate-300 hover:text-orange-300 transition-colors"
          title="編集"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        {confirmDeleteId === task.id ? (
          <div className="flex items-center gap-1.5 ml-1">
            <form action={deleteTask.bind(null, task.id, eventId)}>
              <button type="submit" className="text-xs text-red-600 hover:text-red-700 font-medium">削除</button>
            </form>
            <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600">取消</button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDeleteId(task.id)}
            className="p-1 text-slate-300 hover:text-red-400 transition-colors"
            title="削除"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

function StatusGroup({
  label,
  tasks,
  eventId,
  editingId,
  confirmDeleteId,
  setConfirmDeleteId,
  onEdit,
  collapsible,
  renamingId,
  renameValue,
  setRenamingId,
  setRenameValue,
  onRenameCommit,
}: {
  label: string
  tasks: EventTask[]
  eventId: string
  editingId: string | null
  confirmDeleteId: string | null
  setConfirmDeleteId: (id: string | null) => void
  onEdit: (id: string) => void
  collapsible?: boolean
  renamingId: string | null
  renameValue: string
  setRenamingId: (id: string | null) => void
  setRenameValue: (v: string) => void
  onRenameCommit: () => void
}) {
  const [open, setOpen] = useState(false)
  const [localTasks, setLocalTasks] = useState(tasks)
  const [prevTasksProp, setPrevTasksProp] = useState(tasks)
  const [isDragging, setIsDragging] = useState(false)
  const dragIdRef = useRef<string | null>(null)
  const localTasksRef = useRef(localTasks)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // Keep localTasksRef in sync after each commit so handleDrop always reads the latest list
  useLayoutEffect(() => {
    localTasksRef.current = localTasks
  })

  // Derive-during-render: sync local list when server data changes (but not during drag)
  if (tasks !== prevTasksProp) {
    setPrevTasksProp(tasks)
    if (!isDragging) {
      setLocalTasks(tasks)
    }
  }

  if (tasks.length === 0) return null

  function handleDragStart(taskId: string) {
    dragIdRef.current = taskId
    setIsDragging(true)
  }

  function handleDragOver(e: React.DragEvent, overTaskId: string) {
    e.preventDefault()
    const dragId = dragIdRef.current
    if (!dragId) return
    if (dragId === overTaskId) {
      setDragOverId(null)
      return
    }
    setDragOverId(overTaskId)
    setLocalTasks(prev => {
      const fromIdx = prev.findIndex(t => t.id === dragId)
      const toIdx = prev.findIndex(t => t.id === overTaskId)
      if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return prev
      const next = [...prev]
      const [item] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, item)
      return next
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    dragIdRef.current = null
    setIsDragging(false)
    setDragOverId(null)
    const ordered = localTasksRef.current
    startTransition(async () => {
      await reorderTasks(eventId, ordered.map((t, i) => ({ id: t.id, sort_order: i })))
    })
  }

  function handleDragEnd() {
    dragIdRef.current = null
    setIsDragging(false)
    setDragOverId(null)
  }

  return (
    <div>
      <button
        type="button"
        onClick={collapsible ? () => setOpen(v => !v) : undefined}
        className={`w-full px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 text-left ${collapsible ? 'hover:bg-slate-100 transition-colors cursor-pointer' : 'cursor-default'}`}
      >
        {collapsible && (
          <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-xs text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
      </button>

      {(!collapsible || open) && localTasks.map(task =>
        editingId === task.id ? (
          <EditTaskForm key={task.id} task={task} eventId={eventId} onClose={() => onEdit('')} />
        ) : (
          <TaskRow
            key={task.id}
            task={task}
            eventId={eventId}
            confirmDeleteId={confirmDeleteId}
            setConfirmDeleteId={setConfirmDeleteId}
            onEdit={() => onEdit(task.id)}
            isRenaming={renamingId === task.id}
            renameValue={renameValue}
            onStartRename={() => { setRenamingId(task.id); setRenameValue(task.title) }}
            onRenameChange={setRenameValue}
            onRenameCommit={onRenameCommit}
            onRenameCancel={() => setRenamingId(null)}
            onDragStart={() => handleDragStart(task.id)}
            onDragEnd={handleDragEnd}
            onDragOver={e => handleDragOver(e, task.id)}
            onDrop={handleDrop}
            isDragOver={dragOverId === task.id}
          />
        )
      )}
    </div>
  )
}

export default function TaskList({
  eventId,
  tasks,
  templateCategories,
  templateTasks,
}: {
  eventId: string
  tasks: EventTask[]
  templateCategories: TemplateCategory[]
  templateTasks: TemplateTask[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const addWithId = addTask.bind(null, eventId)
  const [addState, addAction, addPending] = useActionState(addWithId, {})
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !addPending && !addState?.error) {
      setShowForm(false)
      formRef.current?.reset()
    }
    wasPending.current = addPending
  }, [addPending, addState])

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')
  const doneTasks = tasks.filter(t => t.status === 'done')

  function handleEdit(id: string) {
    setEditingId(id || null)
    setConfirmDeleteId(null)
    setRenamingId(null)
  }

  async function handleRenameCommit() {
    const id = renamingId
    if (!id) return
    setRenamingId(null)
    if (renameValue.trim()) {
      await renameTask(id, eventId, renameValue)
    }
  }

  const groupProps = {
    eventId,
    editingId,
    confirmDeleteId,
    setConfirmDeleteId,
    onEdit: handleEdit,
    renamingId,
    renameValue,
    setRenamingId,
    setRenameValue,
    onRenameCommit: handleRenameCommit,
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {tasks.filter(t => t.status !== 'done').length} 件のタスク
          </span>
          {doneTasks.length > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              {doneTasks.length}件完了
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setShowTemplateSelector(v => !v); setShowForm(false) }}
            className={`text-xs border px-2 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              showTemplateSelector
                ? 'bg-slate-700 text-white border-slate-700'
                : 'text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
            </svg>
            テンプレート
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null) }}
            className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            追加
          </button>
        </div>
      </div>

      {showTemplateSelector && (
        <TaskTemplateSelector
          eventId={eventId}
          onClose={() => setShowTemplateSelector(false)}
          categories={templateCategories}
          templateTasks={templateTasks}
        />
      )}

      {tasks.length === 0 && !showForm && !showTemplateSelector ? (
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          タスクがまだありません。「テンプレート」で選んで追加できます。
        </div>
      ) : (
        <>
          <StatusGroup label="進行中" tasks={inProgressTasks} {...groupProps} />
          <StatusGroup label="未着手" tasks={todoTasks} {...groupProps} />
          <StatusGroup label="完了" tasks={doneTasks} {...groupProps} collapsible />
        </>
      )}

      {/* Add form */}
      {showForm && (
        <form ref={formRef} action={addAction} className="border-t border-slate-100 px-4 py-4 space-y-2">
          {addState?.error && <p className="text-xs text-red-600">{addState.error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">タスク名 <span className="text-red-500">*</span></label>
              <input name="title" required placeholder="例：会場の最終確認" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">優先度</label>
              <select name="priority" defaultValue="medium" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">担当者</label>
              <input name="assignee" placeholder="例：田中" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">メモ</label>
              <input name="description" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">開始日</label>
              <input name="start_date" type="date" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">期限日</label>
              <input name="due_date" type="date" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">キャンセル</button>
            <button type="submit" disabled={addPending} className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
              {addPending ? '追加中...' : '追加'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
