import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '予算・費用管理ガイド | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '💰',
    title: '予算・費用管理ガイド',
    tags: ['費用', '収支管理'],
  })
}
