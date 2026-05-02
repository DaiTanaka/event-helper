import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = 'イベントアンケートの作り方 | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '📊',
    title: 'アンケートの作り方',
    tags: ['アンケート', '事後評価'],
  })
}
