import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } }
  ).then(r => r.text())
  const url = css.match(/src: url\((.+?)\) format/)?.[1]
  if (!url) throw new Error(`Failed to parse font URL for ${family} ${weight}`)
  return fetch(url).then(r => r.arrayBuffer())
}

export async function generateOgImage({
  emoji,
  title,
  tags,
}: {
  emoji: string
  title: string
  tags?: string[]
}): Promise<ImageResponse> {
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
          padding: '60px 80px',
        }}
      >
        {/* ロゴ行 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: '#f97316',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#94a3b8' }}>イベント開催ナビ</span>
        </div>

        {/* 絵文字 */}
        <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 24 }}>{emoji}</div>

        {/* タイトル */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#1e293b',
            textAlign: 'center',
            lineHeight: 1.35,
            maxWidth: 960,
            marginBottom: 32,
          }}
        >
          {title}
        </div>

        {/* タグ */}
        {tags && tags.length > 0 && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: '#f97316',
                  background: '#fff7ed',
                  padding: '6px 20px',
                  borderRadius: 100,
                  border: '2px solid #fed7aa',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Noto Sans JP', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Noto Sans JP', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  )
}
