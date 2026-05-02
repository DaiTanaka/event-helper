import { createClient } from '@/lib/supabase/server'
import { CATALOG } from '@/lib/catalog'
import { TEMPLATE_CATEGORIES, TEMPLATE_TASKS } from '@/lib/task-templates'
import AdminClient from './AdminClient'
import type { CatalogItem } from '@/lib/catalog'
import type { TemplateCategory, TemplateTask } from '@/lib/task-templates'

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ data: dbCatalog }, { data: dbCategories }, { data: dbTasks }] = await Promise.all([
    supabase.from('catalog_items').select('*').order('sort_order'),
    supabase.from('task_template_categories').select('*').order('sort_order'),
    supabase.from('task_template_tasks').select('*').order('sort_order'),
  ])

  // DB が空なら静的データにフォールバック
  const catalogItems: (CatalogItem & { active?: boolean })[] = dbCatalog?.length
    ? dbCatalog.map(r => ({
        id: r.id, title: r.title, category: r.category, company_name: r.company_name,
        price_from: r.price_from, price_to: r.price_to, description: r.description,
        tags: r.tags ?? [], isPiqton: r.is_piqton, isAd: r.is_ad,
        contact_url: r.contact_url, url: r.url, og_image_url: r.og_image_url,
        active: r.active, sort_order: r.sort_order,
        display_start_date: r.display_start_date ?? null,
        display_end_date: r.display_end_date ?? null,
      }))
    : CATALOG as (CatalogItem & { active?: boolean })[]

  const templateCategories: TemplateCategory[] = dbCategories?.length
    ? dbCategories as TemplateCategory[]
    : TEMPLATE_CATEGORIES

  const templateTasks: (TemplateTask & { active: boolean })[] = dbTasks?.length
    ? dbTasks.map(t => ({
        id: t.id,
        title: t.title,
        categoryId: t.category_id,
        priority: t.priority as 'high' | 'medium' | 'low',
        startDays: t.start_days as number | null,
        dueDays: t.due_days as number | null,
        active: Boolean(t.active),
      }))
    : TEMPLATE_TASKS.map(t => ({ ...t, active: true }))

  return (
    <AdminClient
      catalogItems={catalogItems}
      templateCategories={templateCategories}
      templateTasks={templateTasks}
    />
  )
}
