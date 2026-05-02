import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '防災イベントを開こう | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '🛡️',
    title: '防災イベントを開こう',
    tags: ['防災', '無料素材'],
  })
}
