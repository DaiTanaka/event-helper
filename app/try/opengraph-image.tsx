import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '登録不要で今すぐ体験 | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '🗂️',
    title: '登録不要で今すぐ体験',
    tags: ['無料', '登録不要'],
  })
}
