import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = 'イベント開催ガイド・特集一覧 | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '📚',
    title: 'イベント開催ガイド・特集一覧',
    tags: ['準備', '当日運営', '事後評価'],
  })
}
