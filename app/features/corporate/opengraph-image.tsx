import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '社内イベント・懇親会の幹事ガイド | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '🏢',
    title: '社内イベント・懇親会の幹事ガイド',
    tags: ['職場', '懇親会', '幹事'],
  })
}
