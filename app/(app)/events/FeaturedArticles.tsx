import Link from 'next/link'

const FEATURES = [
  {
    href: '/features/summer',
    emoji: '☀️',
    title: '夏のイベントに備える',
    subtitle: '熱中症・感染症対策の素材を配布中',
    from: 'from-amber-400',
    to: 'to-orange-500',
  },
  {
    href: '/features/disaster',
    emoji: '🛡️',
    title: '防災イベントを開こう',
    subtitle: 'スゴロク・クイズ素材を無料配布中',
    from: 'from-sky-500',
    to: 'to-blue-600',
  },
  {
    href: '/features/calendar',
    emoji: '📅',
    title: '季節のイベントカレンダー',
    subtitle: '年間イベントアイデアを月別で確認',
    from: 'from-emerald-400',
    to: 'to-teal-500',
  },
] as const

export default function FeaturedArticles() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">特集記事</h2>
      </div>
      <div className="p-3 space-y-2">
        {FEATURES.map(f => (
          <Link
            key={f.href}
            href={f.href}
            className="group block rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
          >
            <div className={`bg-gradient-to-r ${f.from} ${f.to} px-4 py-3`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0 leading-none">{f.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white leading-snug truncate">{f.title}</p>
                  <p className="text-[10px] text-white/80 mt-0.5 truncate">{f.subtitle}</p>
                </div>
                <svg
                  className="w-3.5 h-3.5 text-white/70 group-hover:text-white shrink-0 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
