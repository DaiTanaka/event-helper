'use client'

import { useState, useTransition, useRef } from 'react'
import { dueDaysLabel } from '@/lib/task-templates'
import type { TemplateCategory, TemplateTask } from '@/lib/task-templates'
import { addTasksFromTemplate } from './actions'

const PRIORITY_DOT: Record<string, string> = {
  high:   'bg-red-400',
  medium: 'bg-yellow-400',
  low:    'bg-slate-300',
}

const PRIORITY_LABEL: Record<string, string> = {
  high: '高', medium: '中', low: '低',
}

export default function TaskTemplateSelector({
  eventId,
  onClose,
  categories,
  templateTasks,
}: {
  eventId: string
  onClose: () => void
  categories: TemplateCategory[]
  templateTasks: TemplateTask[]
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(categories.map(c => c.id))
  )
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({})
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const editInputRef = useRef<HTMLInputElement>(null)

  function toggleTask(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  function toggleCategory(catId: string) {
    const catTasks = templateTasks.filter(t => t.categoryId === catId)
    const allSelected = catTasks.every(t => selected.has(t.id))
    setSelected(prev => {
      const next = new Set(prev)
      if (allSelected) {
        catTasks.forEach(t => next.delete(t.id))
      } else {
        catTasks.forEach(t => next.add(t.id))
      }
      return next
    })
  }

  function toggleExpand(catId: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(catId)) { next.delete(catId) } else { next.add(catId) }
      return next
    })
  }

  function startEditTitle(task: TemplateTask) {
    setSelected(prev => {
      const next = new Set(prev)
      next.add(task.id)
      return next
    })
    setEditingTitleId(task.id)
    setTimeout(() => editInputRef.current?.select(), 0)
  }

  function commitEditTitle(taskId: string, value: string) {
    setCustomTitles(prev => ({ ...prev, [taskId]: value }))
    setEditingTitleId(null)
  }

  function handleAdd() {
    setError(null)
    startTransition(async () => {
      const result = await addTasksFromTemplate(eventId, [...selected], customTitles)
      if (result.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="border-t border-slate-100">
      {/* ヘッダー */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-700">タスクを選んで追加</p>
          <span className="text-xs text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5">
            {selected.size} 件選択中
          </span>
        </div>
        <div className="flex items-center gap-2">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleAdd}
            disabled={selected.size === 0 || pending}
            className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            {pending ? '追加中...' : `${selected.size}件を追加する`}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="px-3 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 disabled:opacity-40"
          >
            キャンセル
          </button>
        </div>
      </div>

      {/* カテゴリ一覧 */}
      <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
        {categories.map(cat => {
          const catTasks = templateTasks.filter(t => t.categoryId === cat.id)
          const selectedCount = catTasks.filter(t => selected.has(t.id)).length
          const allSelected = selectedCount === catTasks.length
          const isOpen = expanded.has(cat.id)

          return (
            <div key={cat.id}>
              {/* カテゴリ行 */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/60 hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-3.5 h-3.5 accent-orange-500 shrink-0"
                />
                <button
                  type="button"
                  onClick={() => toggleExpand(cat.id)}
                  className="flex items-center gap-2 flex-1 text-left min-w-0"
                >
                  <svg
                    className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto shrink-0">
                    {selectedCount}/{catTasks.length}
                  </span>
                </button>
              </div>

              {/* タスク一覧 */}
              {isOpen && (
                <div className="divide-y divide-slate-50">
                  {catTasks.map(task => {
                    const isSelected = selected.has(task.id)
                    const isEditing = editingTitleId === task.id
                    const displayTitle = customTitles[task.id] ?? task.title
                    const hasCustomTitle = customTitles[task.id] != null && customTitles[task.id] !== task.title

                    return (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
                          isSelected ? 'bg-orange-50/50' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleTask(task.id)}
                          className="w-3.5 h-3.5 accent-orange-500 shrink-0"
                        />

                        {/* タイトル（編集中はinput、それ以外はテキスト） */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              ref={editInputRef}
                              autoFocus
                              defaultValue={displayTitle}
                              onBlur={e => commitEditTitle(task.id, e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') { e.preventDefault(); commitEditTitle(task.id, (e.target as HTMLInputElement).value) }
                                if (e.key === 'Escape') setEditingTitleId(null)
                              }}
                              className="w-full px-1.5 py-0.5 border border-orange-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                          ) : (
                            <span className={`text-sm ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>
                              {displayTitle}
                              {hasCustomTitle && (
                                <span className="ml-1 text-[10px] text-orange-400">（変更済）</span>
                              )}
                            </span>
                          )}
                        </div>

                        {/* 優先度 */}
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`}
                          title={`優先度: ${PRIORITY_LABEL[task.priority]}`}
                        />

                        {/* タイミング */}
                        {task.dueDays != null && (
                          <span className="text-xs text-slate-400 tabular-nums shrink-0 w-10 text-right">
                            {dueDaysLabel(task.dueDays)}
                          </span>
                        )}

                        {/* 名前変更ボタン */}
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => startEditTitle(task)}
                            className="shrink-0 p-1 text-slate-300 hover:text-orange-400 transition-colors"
                            title="名前を変更"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* フッター */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>● 高優先度　● 中　● 低　　D-N = 開催N日前、D+N = 開催N日後</span>
        <button
          type="button"
          onClick={() => {
            if (selected.size === templateTasks.length) {
              setSelected(new Set())
            } else {
              setSelected(new Set(templateTasks.map(t => t.id)))
            }
          }}
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          {selected.size === templateTasks.length ? 'すべて解除' : 'すべて選択'}
        </button>
      </div>
    </div>
  )
}
