import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = 'タイムテーブル（進行表）の作り方 | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '⏱️',
    title: 'タイムテーブルの作り方',
    tags: ['当日運営', '進行管理'],
  })
}
