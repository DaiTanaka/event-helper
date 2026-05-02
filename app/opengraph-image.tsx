import { ImageResponse } from 'next/og'

export const alt = 'イベント開催ナビ — 誰でも安心してイベント管理できるツール'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } }
  ).then(r => r.text())
  const url = css.match(/src: url\((.+?)\) format/)?.[1]
  if (!url) throw new Error(`Failed to parse font URL for ${family} ${weight}`)
  return fetch(url).then(r => r.arrayBuffer())
}

export default async function Image() {
  const [fontRegular, fontBold] = await Promise.all([
    fetchGoogleFont('Noto Sans JP', 400),
    fetchGoogleFont('Noto Sans JP', 700),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff7ed 0%, #fff 50%, #f0f9ff 100%)',
          fontFamily: '"Noto Sans JP"',
          padding: '80px 100px',
        }}
      >
        {/* ロゴアイコン */}
        <div
          style={{
            width: 80,
            height: 80,
            background: '#f97316',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        {/* サイト名 */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          イベント開催ナビ
        </div>

        {/* キャッチコピー */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: '#64748b',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 800,
          }}
        >
          はじめてでも引き継ぎでも安心。
          スケジュール・会場レイアウト・備品・タスク・予算をクラウドで一元管理。
        </div>

        {/* フリーバッジ */}
        <div
          style={{
            marginTop: 40,
            background: '#f97316',
            color: 'white',
            fontSize: 22,
            fontWeight: 700,
            padding: '10px 32px',
            borderRadius: 100,
          }}
        >
          無料で今すぐ使えます
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto Sans JP', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Noto Sans JP', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  )
}
