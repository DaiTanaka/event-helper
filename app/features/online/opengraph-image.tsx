import { generateOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const alt = 'オンライン・ハイブリッドイベントの開き方 | イベント開催ナビ'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return generateOgImage({
    emoji: '💻',
    title: 'オンライン・ハイブリッドイベント',
    tags: ['オンライン', 'ハイブリッド', 'Zoom'],
  })
}
