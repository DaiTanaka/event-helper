import Link from 'next/link'

type NewsItem = {
  title: string
  link: string
  date: string
}

function parseRSS(xml: string): NewsItem[] {
  const items: NewsItem[] = []
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = match[1]
    const title = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/.exec(item)?.[1]?.trim() ?? ''
    const link  = /<link>([\s\S]*?)<\/link>/.exec(item)?.[1]?.trim() ?? ''
    const date  = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(item)?.[1]?.trim() ?? ''
    if (title && link) items.push({ title, link, date })
    if (items.length >= 5) break
  }
  return items
}

function formatDate(rfc: string): string {
  try {
    const d = new Date(rfc)
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

async function fetchNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      'https://workshop.picoton.com/wp_news/tag/event-know-how/feed/',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    return parseRSS(await res.text())
  } catch {
    return []
  }
}

export default async function NewsFeed() {
  const items = await fetchNews()
  if (items.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">イベントノウハウ</h2>
        </div>
        <Link
          href="https://workshop.picoton.com/wp_news/tag/event-know-how/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-orange-500 hover:text-orange-700 font-medium"
        >
          すべて見る →
        </Link>
      </div>
      <ul className="divide-y divide-slate-50">
        {items.map((item, i) => (
          <li key={i}>
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-0.5 px-4 py-3 hover:bg-orange-50/50 transition-colors group"
            >
              <span className="text-xs font-medium text-slate-700 group-hover:text-orange-600 leading-snug line-clamp-2 transition-colors">
                {item.title}
              </span>
              {item.date && (
                <span className="text-[10px] text-slate-400">{formatDate(item.date)}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
