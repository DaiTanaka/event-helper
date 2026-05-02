import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = '夏のイベントに備える | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '☀️',
    title: '夏のイベントに備える',
    tags: ['夏', '無料素材'],
  })
}
