import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = 'スタッフ役割分担ガイド | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '👥',
    title: 'スタッフ役割分担ガイド',
    tags: ['スタッフ', '役割分担', '当日運営'],
  })
}
