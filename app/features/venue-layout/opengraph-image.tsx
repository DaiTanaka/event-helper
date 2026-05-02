import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '会場レイアウト作成ガイド | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '🗺️',
    title: '会場レイアウト作成ガイド',
    tags: ['会場設営', '座席配置'],
  })
}
