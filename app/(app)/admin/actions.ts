'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CATALOG } from '@/lib/catalog'
import { TEMPLATE_CATEGORIES, TEMPLATE_TASKS } from '@/lib/task-templates'
import { ADMIN_EMAILS } from '@/lib/is-admin'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !ADMIN_EMAILS.includes(user.email)) throw new Error('管理者権限が必要です')
  return supabase
}

// ── シード ──────────────────────────────────────────────
export async function seedCatalog(): Promise<{ error?: string }> {
  try {
    const supabase = await requireAdmin()
    const { error: delError } = await supabase.from('catalog_items').delete().neq('id', '')
    if (delError) return { error: delError.message }
    const rows = CATALOG.map((item, i) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      company_name: item.company_name,
      price_from: item.price_from,
      price_to: item.price_to,
      description: item.description,
      tags: item.tags,
      is_piqton: item.isPiqton ?? false,
      is_ad: item.isAd ?? false,
      contact_url: item.contact_url ?? null,
      sort_order: i,
      active: true,
    }))
    const { error } = await supabase.from('catalog_items').insert(rows)
    if (error) return { error: error.message }
    revalidatePath('/admin')
    return {}
  } catch (e) { return { error: (e as Error).message } }
}

export async function seedTemplates(): Promise<{ error?: string }> {
  try {
    const supabase = await requireAdmin()
    const catRows = TEMPLATE_CATEGORIES.map((c, i) => ({ ...c, sort_order: i }))
    const { error: ce } = await supabase.from('task_template_categories').upsert(catRows, { onConflict: 'id' })
    if (ce) return { error: ce.message }
    const taskRows = TEMPLATE_TASKS.map((t, i) => ({
      id: t.id, title: t.title, category_id: t.categoryId,
      priority: t.priority, start_days: t.startDays, due_days: t.dueDays,
      sort_order: i, active: true,
    }))
    const { error: te } = await supabase.from('task_template_tasks').upsert(taskRows, { onConflict: 'id' })
    if (te) return { error: te.message }
    revalidatePath('/admin')
    return {}
  } catch (e) { return { error: (e as Error).message } }
}

// ── カタログ CRUD ───────────────────────────────────────
export async function saveCatalogItem(_: unknown, formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await requireAdmin()
    const id = formData.get('id') as string | null
    const tagsRaw = (formData.get('tags') as string ?? '').split(',').map(s => s.trim()).filter(Boolean)
    const payload = {
      title: (formData.get('title') as string).trim(),
      category: (formData.get('category') as string).trim(),
      company_name: (formData.get('company_name') as string).trim(),
      price_from: formData.get('price_from') ? Number(formData.get('price_from')) : null,
      price_to: formData.get('price_to') ? Number(formData.get('price_to')) : null,
      description: (formData.get('description') as string ?? '').trim(),
      tags: tagsRaw,
      is_piqton: formData.get('is_piqton') === 'true',
      is_ad: formData.get('is_ad') === 'true',
      contact_url: formData.get('contact_url') || null,
      url: formData.get('url') || null,
      og_image_url: formData.get('og_image_url') || null,
      active: formData.get('active') !== 'false',
      sort_order: Number(formData.get('sort_order') ?? 0),
      display_start_date: (formData.get('display_start_date') as string) || null,
      display_end_date: (formData.get('display_end_date') as string) || null,
    }
    if (id) {
      const { error } = await supabase.from('catalog_items').update(payload).eq('id', id)
      if (error) return { error: error.message }
    } else {
      const newId = `custom-${Date.now()}`
      const { error } = await supabase.from('catalog_items').insert({ ...payload, id: newId })
      if (error) return { error: error.message }
    }
    revalidatePath('/admin')
    return {}
  } catch (e) { return { error: (e as Error).message } }
}

export async function deleteCatalogItem(id: string): Promise<{ error?: string }> {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('catalog_items').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin')
    return {}
  } catch (e) { return { error: (e as Error).message } }
}

// ── テンプレートカテゴリ CRUD ────────────────────────────
export async function saveTemplateCategory(_: unknown, formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await requireAdmin()
    const id = formData.get('id') as string | null
    const payload = {
      label: (formData.get('label') as string).trim(),
      color: (formData.get('color') as string).trim(),
      sort_order: Number(formData.get('sort_order') ?? 0),
    }
    if (id) {
      const { error } = await supabase.from('task_template_categories').update(payload).eq('id', id)
      if (error) return { error: error.message }
    } else {
      const newId = `cat-${Date.now()}`
      const { error } = await supabase.from('task_template_categories').insert({ ...payload, id: newId })
      if (error) return { error: error.message }
    }
    revalidatePath('/admin')
    return {}
  } catch (e) { return { error: (e as Error).message } }
}

export async function deleteTemplateCategory(id: string): Promise<{ error?: string }> {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('task_template_categories').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin')
    return {}
  } catch (e) { return { error: (e as Error).message } }
}

// ── テンプレートタスク CRUD ─────────────────────────────
export async function saveTemplateTask(_: unknown, formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await requireAdmin()
    const id = formData.get('id') as string | null
    const payload = {
      title: (formData.get('title') as string).trim(),
      category_id: (formData.get('category_id') as string).trim(),
      priority: formData.get('priority') as 'high' | 'medium' | 'low',
      start_days: formData.get('start_days') ? Number(formData.get('start_days')) : null,
      due_days: formData.get('due_days') ? Number(formData.get('due_days')) : null,
      sort_order: Number(formData.get('sort_order') ?? 0),
      active: formData.get('active') !== 'false',
    }
    if (id) {
      const { error } = await supabase.from('task_template_tasks').update(payload).eq('id', id)
      if (error) return { error: error.message }
    } else {
      const newId = `tmpl-${Date.now()}`
      const { error } = await supabase.from('task_template_tasks').insert({ ...payload, id: newId })
      if (error) return { error: error.message }
    }
    revalidatePath('/admin')
    return {}
  } catch (e) { return { error: (e as Error).message } }
}

export async function deleteTemplateTask(id: string): Promise<{ error?: string }> {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('task_template_tasks').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin')
    return {}
  } catch (e) { return { error: (e as Error).message } }
}
