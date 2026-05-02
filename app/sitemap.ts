import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://event-helper.picoton.com'

const CALENDAR_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function sitemap(): MetadataRoute.Sitemap {
  const calendarMonths: MetadataRoute.Sitemap = CALENDAR_MONTHS.map(m => ({
    url: `${BASE}/features/calendar?month=${m}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: `${BASE}/`,                       changeFrequency: 'monthly',  priority: 1.0, lastModified: '2025-01-01' },
    { url: `${BASE}/features`,               changeFrequency: 'monthly',  priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/checklist`,     changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/timeline`,      changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/venue-layout`,  changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/budget`,        changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/equipment`,     changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/school`,        changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/corporate`,     changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/online`,        changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/staff`,         changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/announcement`,  changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/survey`,        changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/handover`,      changeFrequency: 'yearly',   priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/community-event`, changeFrequency: 'yearly', priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/features/calendar`,      changeFrequency: 'monthly',  priority: 0.8, lastModified: '2025-01-01' },
    ...calendarMonths,
    { url: `${BASE}/features/summer`,        changeFrequency: 'yearly',   priority: 0.7, lastModified: '2025-01-01' },
    { url: `${BASE}/features/disaster`,      changeFrequency: 'yearly',   priority: 0.7, lastModified: '2025-01-01' },
    { url: `${BASE}/try`,                    changeFrequency: 'monthly',  priority: 0.8, lastModified: '2025-01-01' },
    { url: `${BASE}/signup`,                 changeFrequency: 'yearly',   priority: 0.6, lastModified: '2025-01-01' },
    { url: `${BASE}/terms`,                  changeFrequency: 'yearly',   priority: 0.3, lastModified: '2025-01-01' },
    { url: `${BASE}/privacy`,                changeFrequency: 'yearly',   priority: 0.3, lastModified: '2025-01-01' },
  ]
}
