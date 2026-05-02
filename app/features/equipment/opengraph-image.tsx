import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = 'イベント備品リスト | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '📦',
    title: 'イベント備品リスト',
    tags: ['備品', '持ち物'],
  })
}
