import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '学校行事・文化祭の準備ガイド | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '🏫',
    title: '学校行事・文化祭の準備ガイド',
    tags: ['学校', '文化祭', '体育祭'],
  })
}
