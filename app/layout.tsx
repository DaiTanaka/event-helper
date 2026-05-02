import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '500', '700'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://event-helper.picoton.com'
const SITE_NAME = 'イベント開催ナビ'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'はじめてでも引き継ぎでも安心。スケジュール・会場レイアウト・備品・タスク・予算をクラウドで一元管理できるイベント運営ツール。無料で今すぐ使えます。',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@picoton',
    creator: '@picoton',
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: 'はじめてでも引き継ぎでも安心。スケジュール・会場レイアウト・備品・タスク・予算をクラウドで一元管理できるイベント運営ツール。',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '株式会社ピコトン',
  url: 'https://workshop.picoton.com/',
  logo: 'https://workshop.picoton.com/wp-content/uploads/picoton-logo.png',
  sameAs: ['https://twitter.com/picoton'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: 'Japanese',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`h-full ${noto.className}`}>
      <body className="min-h-full bg-slate-50 text-slate-800">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        {children}
      </body>
    </html>
  )
}
