'use server'

import { createClient } from '@/lib/supabase/server'

export async function trackCatalogView(
  catalogId: string,
  eventId: string,
): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('catalog_views').insert({
      user_id: user?.id ?? null,
      catalog_id: catalogId,
      event_id: eventId,
    })
  } catch {
    // トラッキング失敗はサイレントに
  }
}
