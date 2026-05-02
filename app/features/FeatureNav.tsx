'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const FEATURE_NAV = [
  { href: '/features',          emoji: '📚', label: '一覧' },
  { href: '/features/checklist',    emoji: '📋', label: '準備リスト' },
  { href: '/features/timeline',     emoji: '⏱️', label: 'タイムテーブル' },
  { href: '/features/venue-layout', emoji: '🗺️', label: 'レイアウト' },
  { href: '/features/budget',       emoji: '💰', label: '予算管理' },
  { href: '/features/equipment',    emoji: '📦', label: '備品リスト' },
  { href: '/features/calendar',     emoji: '📅', label: 'カレンダー' },
  { href: '/features/school',        emoji: '🏫', label: '学校行事' },
  { href: '/features/corporate',    emoji: '🏢', label: '社内イベント' },
  { href: '/features/online',        emoji: '💻', label: 'オンライン' },
  { href: '/features/staff',         emoji: '👥', label: 'スタッフ配置' },
  { href: '/features/announcement',  emoji: '📢', label: '告知・案内文' },
  { href: '/features/survey',        emoji: '📊', label: 'アンケート' },
  { href: '/features/handover',      emoji: '🔁', label: '引き継ぎ' },
  { href: '/features/community-event', emoji: '🏮', label: '地域イベント' },
  { href: '/features/summer',       emoji: '☀️', label: '夏の備え' },
  { href: '/features/disaster',     emoji: '🛡️', label: '防災特集' },
]

export default function FeatureNav() {
  const pathname = usePathname()

  return (
    <div className="border-t border-slate-100 bg-white">
      <div className="max-w-3xl mx-auto px-2 flex overflow-x-auto">
        {FEATURE_NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              item.href === '/features' ? pathname === '/features' : pathname.startsWith(item.href)
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="text-base leading-none">{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
