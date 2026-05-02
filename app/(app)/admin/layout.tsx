import { redirect } from 'next/navigation'
import { getIsAdmin } from '@/lib/is-admin'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) redirect('/events')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/events" className="text-sm text-slate-400 hover:text-slate-600">← イベント一覧</Link>
        <span className="text-slate-200">/</span>
        <h1 className="text-lg font-bold text-slate-800">管理者パネル</h1>
        <div className="flex gap-2 ml-auto">
          <Link href="/admin" className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            カタログ・テンプレート
          </Link>
          <Link href="/admin/users" className="text-xs px-3 py-1.5 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
            ユーザー一覧
          </Link>
          <Link href="/admin/events" className="text-xs px-3 py-1.5 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
            イベントデータ
          </Link>
          <Link href="/admin/data" className="text-xs px-3 py-1.5 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
            収集データ
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
