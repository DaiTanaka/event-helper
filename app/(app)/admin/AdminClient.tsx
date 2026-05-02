'use client'

import { useState, useTransition, useActionState } from 'react'
import {
  seedCatalog, seedTemplates,
  saveCatalogItem, deleteCatalogItem,
  saveTemplateCategory, deleteTemplateCategory,
  saveTemplateTask, deleteTemplateTask,
} from './actions'
import type { CatalogItem } from '@/lib/catalog'
import type { TemplateCategory, TemplateTask } from '@/lib/task-templates'

type DbTask = TemplateTask & { active: boolean }

const inputCls = 'w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200'

// ────────────────────────────
// カタログアイテム行
// ────────────────────────────
function CatalogRow({ item, categories }: { item: CatalogItem & { active?: boolean; url?: string; og_image_url?: string; sort_order?: number; display_start_date?: string | null; display_end_date?: string | null }; categories: string[] }) {
  const [editing, setEditing] = useState(false)
  const [deleting, startDelete] = useTransition()
  const [state, action, isPending] = useActionState(saveCatalogItem, {})

  if (editing) {
    return (
      <tr className="bg-orange-50/40">
        <td colSpan={7} className="px-4 py-3">
          <form action={async (fd) => { await action(fd); setEditing(false) }} className="space-y-2">
            {state.error && <p className="text-xs text-red-600">{state.error}</p>}
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="sort_order" value={item.sort_order ?? 0} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-0.5">タイトル *</label>
                <input name="title" required defaultValue={item.title} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-0.5">カテゴリ *</label>
                <input name="category" required defaultValue={item.category} list="cat-list" className={inputCls} />
                <datalist id="cat-list">{categories.map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-0.5">会社名 *</label>
                <input name="company_name" required defaultValue={item.company_name} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-0.5">価格下限（円）</label>
                <input name="price_from" type="number" defaultValue={item.price_from ?? ''} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-0.5">価格上限（円）</label>
                <input name="price_to" type="number" defaultValue={item.price_to ?? ''} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-0.5">タグ（カンマ区切り）</label>
                <input name="tags" defaultValue={item.tags?.join(', ') ?? ''} className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-4">
                <label className="block text-xs text-slate-500 mb-0.5">説明</label>
                <textarea name="description" rows={2} defaultValue={item.description} className={inputCls + ' resize-none'} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-0.5">参照URL（ページリンク）</label>
                <input name="url" type="url" defaultValue={item.url ?? ''} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-0.5">画像URL（OG画像等）</label>
                <input name="og_image_url" type="url" defaultValue={item.og_image_url ?? ''} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-0.5">問合せURL</label>
                <input name="contact_url" defaultValue={item.contact_url ?? ''} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-0.5">掲載開始日</label>
                <input name="display_start_date" type="date" defaultValue={item.display_start_date ?? ''} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-0.5">掲載終了日</label>
                <input name="display_end_date" type="date" defaultValue={item.display_end_date ?? ''} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1 justify-end">
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="hidden" name="is_piqton" value="false" />
                  <input type="checkbox" name="is_piqton" value="true" defaultChecked={item.isPiqton} className="accent-orange-500" />
                  ピコトン自社商品
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="hidden" name="is_ad" value="false" />
                  <input type="checkbox" name="is_ad" value="true" defaultChecked={item.isAd} className="accent-orange-500" />
                  広告（PR）
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="hidden" name="active" value="false" />
                  <input type="checkbox" name="active" value="true" defaultChecked={item.active !== false} className="accent-orange-500" />
                  有効
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isPending} className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
                {isPending ? '保存中...' : '保存'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="px-3 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50">
                キャンセル
              </button>
            </div>
          </form>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50 group">
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          {item.isPiqton && <span className="text-[10px] bg-orange-100 text-orange-600 px-1 rounded">自社</span>}
          {item.isAd && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">PR</span>}
          {item.active === false && <span className="text-[10px] bg-slate-100 text-slate-400 px-1 rounded">非表示</span>}
          <span className="text-sm text-slate-800">{item.title}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-xs text-slate-500">{item.category}</td>
      <td className="px-3 py-2.5 text-xs text-slate-500 hidden sm:table-cell">{item.company_name}</td>
      <td className="px-3 py-2.5 text-xs text-slate-500 tabular-nums hidden md:table-cell">
        {item.price_from != null ? `¥${item.price_from.toLocaleString()}` : '-'}
        {item.price_to != null ? `〜¥${item.price_to.toLocaleString()}` : item.price_from != null ? '〜' : ''}
      </td>
      <td className="px-3 py-2.5 text-xs text-slate-400 tabular-nums hidden lg:table-cell">
        {item.display_start_date || item.display_end_date ? (
          <span>
            {item.display_start_date ?? '〜'}
            {' 〜 '}
            {item.display_end_date ?? ''}
          </span>
        ) : <span className="text-slate-200">常時</span>}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="text-xs text-orange-500 hover:text-orange-600 font-medium">編集</button>
          <span className="text-slate-200">|</span>
          <button
            disabled={deleting}
            onClick={() => { if (confirm('削除しますか？')) startDelete(async () => { await deleteCatalogItem(item.id) }) }}
            className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
          >削除</button>
        </div>
      </td>
    </tr>
  )
}

// ────────────────────────────
// カタログ管理タブ
// ────────────────────────────
function CatalogManager({ items }: { items: (CatalogItem & { active?: boolean })[] }) {
  const [seeding, startSeed] = useTransition()
  const [seedError, setSeedError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addState, addAction, addPending] = useActionState(saveCatalogItem, {})

  const categories = [...new Set(items.map(i => i.category))]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{items.length} 件</p>
        <div className="flex gap-2">
          {seedError && <p className="text-xs text-red-600">{seedError}</p>}
          <button
            disabled={seeding}
            onClick={() => startSeed(async () => { const r = await seedCatalog(); if (r.error) setSeedError(r.error) })}
            className="text-xs border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {seeding ? '投入中...' : '静的データを再投入'}
          </button>
          <button
            onClick={() => setShowAddForm(v => !v)}
            className="text-xs bg-orange-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-orange-600"
          >
            + 追加
          </button>
        </div>
      </div>

      {showAddForm && (
        <form action={async (fd) => { await addAction(fd); setShowAddForm(false) }} className="p-4 border border-orange-100 bg-orange-50/30 rounded-xl space-y-2">
          {addState.error && <p className="text-xs text-red-600">{addState.error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="col-span-2"><label className="block text-xs text-slate-500 mb-0.5">タイトル *</label><input name="title" required className={inputCls} /></div>
            <div><label className="block text-xs text-slate-500 mb-0.5">カテゴリ *</label><input name="category" required list="cat-list-add" className={inputCls} /><datalist id="cat-list-add">{categories.map(c => <option key={c} value={c} />)}</datalist></div>
            <div><label className="block text-xs text-slate-500 mb-0.5">会社名 *</label><input name="company_name" required className={inputCls} /></div>
            <div><label className="block text-xs text-slate-500 mb-0.5">価格下限</label><input name="price_from" type="number" className={inputCls} /></div>
            <div><label className="block text-xs text-slate-500 mb-0.5">価格上限</label><input name="price_to" type="number" className={inputCls} /></div>
            <div className="col-span-2"><label className="block text-xs text-slate-500 mb-0.5">タグ（カンマ区切り）</label><input name="tags" className={inputCls} /></div>
            <div className="col-span-2 sm:col-span-4"><label className="block text-xs text-slate-500 mb-0.5">説明</label><textarea name="description" rows={2} className={inputCls + ' resize-none'} /></div>
            <div className="col-span-2"><label className="block text-xs text-slate-500 mb-0.5">参照URL</label><input name="url" type="url" className={inputCls} /></div>
            <div className="col-span-2"><label className="block text-xs text-slate-500 mb-0.5">画像URL</label><input name="og_image_url" type="url" className={inputCls} /></div>
            <div>
              <label className="block text-xs text-slate-500 mb-0.5">掲載開始日</label>
              <input name="display_start_date" type="date" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-0.5">掲載終了日</label>
              <input name="display_end_date" type="date" className={inputCls} />
            </div>
            <div className="flex gap-3 items-end">
              <label className="flex items-center gap-1 text-xs text-slate-600"><input type="hidden" name="is_piqton" value="false" /><input type="checkbox" name="is_piqton" value="true" className="accent-orange-500" />自社</label>
              <label className="flex items-center gap-1 text-xs text-slate-600"><input type="hidden" name="is_ad" value="false" /><input type="checkbox" name="is_ad" value="true" className="accent-orange-500" />PR広告</label>
              <label className="flex items-center gap-1 text-xs text-slate-600"><input type="hidden" name="active" value="false" /><input type="checkbox" name="active" value="true" defaultChecked className="accent-orange-500" />有効</label>
            </div>
            <input type="hidden" name="sort_order" value={items.length} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={addPending} className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">{addPending ? '追加中...' : '追加'}</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50">キャンセル</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-3 py-2 text-left text-xs text-slate-400 font-medium">タイトル</th>
              <th className="px-3 py-2 text-left text-xs text-slate-400 font-medium">カテゴリ</th>
              <th className="px-3 py-2 text-left text-xs text-slate-400 font-medium hidden sm:table-cell">会社</th>
              <th className="px-3 py-2 text-left text-xs text-slate-400 font-medium hidden md:table-cell">価格</th>
              <th className="px-3 py-2 text-left text-xs text-slate-400 font-medium hidden lg:table-cell">掲載期間</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <CatalogRow key={item.id} item={item} categories={categories} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ────────────────────────────
// テンプレートタスク行
// ────────────────────────────
function TemplateTaskRow({ task, categories }: { task: DbTask; categories: TemplateCategory[] }) {
  const [editing, setEditing] = useState(false)
  const [deleting, startDelete] = useTransition()
  const [state, action, isPending] = useActionState(saveTemplateTask, {})

  if (editing) {
    return (
      <div className="px-4 py-3 bg-orange-50/40 border-b border-slate-100">
        <form action={async (fd) => { await action(fd); setEditing(false) }} className="space-y-2">
          {state.error && <p className="text-xs text-red-600">{state.error}</p>}
          <input type="hidden" name="id" value={task.id} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="col-span-2"><label className="block text-xs text-slate-500 mb-0.5">タスク名 *</label><input name="title" required defaultValue={task.title} className={inputCls} /></div>
            <div><label className="block text-xs text-slate-500 mb-0.5">カテゴリ</label>
              <select name="category_id" defaultValue={task.categoryId} className={inputCls}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div><label className="block text-xs text-slate-500 mb-0.5">優先度</label>
              <select name="priority" defaultValue={task.priority} className={inputCls}>
                <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
              </select>
            </div>
            <div><label className="block text-xs text-slate-500 mb-0.5">開始日（D±N）</label><input name="start_days" type="number" defaultValue={task.startDays ?? ''} className={inputCls} /></div>
            <div><label className="block text-xs text-slate-500 mb-0.5">期限日（D±N）</label><input name="due_days" type="number" defaultValue={task.dueDays ?? ''} className={inputCls} /></div>
            <input type="hidden" name="sort_order" value={0} />
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-xs text-slate-600"><input type="hidden" name="active" value="false" /><input type="checkbox" name="active" value="true" defaultChecked={task.active !== false} className="accent-orange-500" />有効</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">{isPending ? '保存中...' : '保存'}</button>
            <button type="button" onClick={() => setEditing(false)} className="px-3 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg">キャンセル</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-2 border-b border-slate-50 group hover:bg-slate-50 ${task.active === false ? 'opacity-40' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-slate-300'}`} />
      <span className="flex-1 text-sm text-slate-700">{task.title}</span>
      <span className="text-xs text-slate-400 tabular-nums w-10 text-right">{task.dueDays != null ? (task.dueDays === 0 ? '当日' : task.dueDays > 0 ? `D+${task.dueDays}` : `D${task.dueDays}`) : '-'}</span>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} className="text-xs text-orange-500 hover:text-orange-600">編集</button>
        <button disabled={deleting} onClick={() => { if (confirm('削除しますか？')) startDelete(async () => { await deleteTemplateTask(task.id) }) }} className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50">削除</button>
      </div>
    </div>
  )
}

// ────────────────────────────
// テンプレートカテゴリセクション
// ────────────────────────────
function CategorySection({ cat, tasks, allCategories }: { cat: TemplateCategory; tasks: DbTask[]; allCategories: TemplateCategory[] }) {
  const [open, setOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [catState, catAction, catPending] = useActionState(saveTemplateCategory, {})
  const [taskState, taskAction, taskPending] = useActionState(saveTemplateTask, {})
  const [deleting, startDelete] = useTransition()

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      {editingCat ? (
        <form action={async (fd) => { await catAction(fd); setEditingCat(false) }} className="p-3 bg-orange-50/30 flex flex-wrap gap-2 items-end">
          {catState.error && <p className="text-xs text-red-600 w-full">{catState.error}</p>}
          <input type="hidden" name="id" value={cat.id} />
          <input type="hidden" name="sort_order" value={0} />
          <div><label className="block text-xs text-slate-500 mb-0.5">ラベル</label><input name="label" required defaultValue={cat.label} className={inputCls + ' w-40'} /></div>
          <div><label className="block text-xs text-slate-500 mb-0.5">色クラス</label><input name="color" required defaultValue={cat.color} className={inputCls + ' w-48'} /></div>
          <button type="submit" disabled={catPending} className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg disabled:opacity-50">{catPending ? '...' : '保存'}</button>
          <button type="button" onClick={() => setEditingCat(false)} className="px-3 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg">取消</button>
        </form>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer group" onClick={() => setOpen(v => !v)}>
          <svg className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
          <span className="text-xs text-slate-400 ml-1">{tasks.length}件</span>
          <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={e => { e.stopPropagation(); setEditingCat(true) }} className="text-xs text-orange-500 hover:text-orange-600">編集</button>
            <button disabled={deleting} onClick={e => { e.stopPropagation(); if (confirm('カテゴリとタスクをすべて削除しますか？')) startDelete(async () => { await deleteTemplateCategory(cat.id) }) }} className="text-xs text-red-500 hover:text-red-600">削除</button>
          </div>
        </div>
      )}
      {open && (
        <div>
          {tasks.map(t => <TemplateTaskRow key={t.id} task={t} categories={allCategories} />)}
          {showAddTask ? (
            <div className="px-4 py-3 bg-green-50/30 border-t border-slate-100">
              <form action={async (fd) => { await taskAction(fd); setShowAddTask(false) }} className="space-y-2">
                {taskState.error && <p className="text-xs text-red-600">{taskState.error}</p>}
                <input type="hidden" name="category_id" value={cat.id} />
                <input type="hidden" name="sort_order" value={tasks.length} />
                <input type="hidden" name="active" value="true" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="col-span-2"><label className="block text-xs text-slate-500 mb-0.5">タスク名 *</label><input name="title" required className={inputCls} /></div>
                  <div><label className="block text-xs text-slate-500 mb-0.5">優先度</label><select name="priority" defaultValue="medium" className={inputCls}><option value="high">高</option><option value="medium">中</option><option value="low">低</option></select></div>
                  <div className="grid grid-cols-2 gap-1">
                    <div><label className="block text-xs text-slate-500 mb-0.5">開始(D±N)</label><input name="start_days" type="number" className={inputCls} /></div>
                    <div><label className="block text-xs text-slate-500 mb-0.5">期限(D±N)</label><input name="due_days" type="number" className={inputCls} /></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={taskPending} className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{taskPending ? '追加中...' : '追加'}</button>
                  <button type="button" onClick={() => setShowAddTask(false)} className="px-3 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg">キャンセル</button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={() => setShowAddTask(true)} className="w-full px-4 py-2 text-xs text-orange-500 hover:bg-orange-50 text-left border-t border-slate-50">
              + タスクを追加
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ────────────────────────────
// テンプレート管理タブ
// ────────────────────────────
function TemplateManager({ categories, tasks }: { categories: TemplateCategory[]; tasks: DbTask[] }) {
  const [seeding, startSeed] = useTransition()
  const [seedError, setSeedError] = useState<string | null>(null)
  const [showAddCat, setShowAddCat] = useState(false)
  const [catState, catAction, catPending] = useActionState(saveTemplateCategory, {})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{categories.length} カテゴリ / {tasks.length} タスク</p>
        <div className="flex gap-2">
          {seedError && <p className="text-xs text-red-600">{seedError}</p>}
          <button disabled={seeding} onClick={() => startSeed(async () => { const r = await seedTemplates(); if (r.error) setSeedError(r.error) })} className="text-xs border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50">{seeding ? '投入中...' : '静的データを再投入'}</button>
          <button onClick={() => setShowAddCat(v => !v)} className="text-xs bg-orange-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-orange-600">+ カテゴリ追加</button>
        </div>
      </div>
      {showAddCat && (
        <form action={async (fd) => { await catAction(fd); setShowAddCat(false) }} className="p-3 border border-orange-100 bg-orange-50/30 rounded-xl flex flex-wrap gap-2 items-end">
          {catState.error && <p className="text-xs text-red-600 w-full">{catState.error}</p>}
          <input type="hidden" name="sort_order" value={categories.length} />
          <div><label className="block text-xs text-slate-500 mb-0.5">ラベル *</label><input name="label" required placeholder="例：広告・デザイン" className={inputCls + ' w-40'} /></div>
          <div><label className="block text-xs text-slate-500 mb-0.5">色クラス</label><input name="color" defaultValue="bg-slate-100 text-slate-600" className={inputCls + ' w-48'} /></div>
          <button type="submit" disabled={catPending} className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg disabled:opacity-50">{catPending ? '...' : '追加'}</button>
          <button type="button" onClick={() => setShowAddCat(false)} className="px-3 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg">キャンセル</button>
        </form>
      )}
      <div className="space-y-2">
        {categories.map(cat => (
          <CategorySection
            key={cat.id}
            cat={cat}
            tasks={tasks.filter(t => t.categoryId === cat.id)}
            allCategories={categories}
          />
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────
// メイン AdminClient
// ────────────────────────────
export default function AdminClient({
  catalogItems,
  templateCategories,
  templateTasks,
}: {
  catalogItems: (CatalogItem & { active?: boolean })[]
  templateCategories: TemplateCategory[]
  templateTasks: DbTask[]
}) {
  const [tab, setTab] = useState<'catalog' | 'templates'>('catalog')

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {([{ key: 'catalog', label: 'カタログ管理' }, { key: 'templates', label: 'テンプレート管理' }] as const).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${tab === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        {tab === 'catalog' && <CatalogManager items={catalogItems} />}
        {tab === 'templates' && <TemplateManager categories={templateCategories} tasks={templateTasks} />}
      </div>
    </div>
  )
}
