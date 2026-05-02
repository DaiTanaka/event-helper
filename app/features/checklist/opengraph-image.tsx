import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = 'イベント準備チェックリスト | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '📋',
    title: 'イベント準備チェックリスト',
    tags: ['準備', '手順', '全般'],
  })
}
