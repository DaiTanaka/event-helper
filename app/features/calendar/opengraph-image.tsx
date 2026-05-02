import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '季節のイベントカレンダー | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '📅',
    title: '季節のイベントカレンダー',
    tags: ['企画アイデア', '季節'],
  })
}
