import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '地域イベント・お祭り開催ガイド | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '🏮',
    title: '地域イベント・お祭り開催ガイド',
    tags: ['地域', '自治会', 'お祭り'],
  })
}
