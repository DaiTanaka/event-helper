import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/events/', '/admin/', '/account/', '/invite/', '/onboarding/', '/auth/', '/login'],
    },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  }
}
