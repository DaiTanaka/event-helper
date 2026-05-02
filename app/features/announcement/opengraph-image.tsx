import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = 'イベント告知・案内文の書き方 | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '📢',
    title: 'イベント告知・案内文の書き方',
    tags: ['告知', '広報', '集客'],
  })
}
