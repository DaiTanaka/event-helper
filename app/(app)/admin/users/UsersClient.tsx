'use client'

import { useTransition } from 'react'
import { toggleTestFlag } from './actions'

type UserRow = {
  id: string
  email: string
  created_at: string
  profile: {
    organization: string | null
    industry: string | null
    role: string | null
    prefecture: string | null
    newsletter_opt_in: boolean
    marketing_opt_in: boolean
    is_test_account: boolean
    terms_accepted_at: string | null
  } | null
  event_count: number
}

export default function UsersClient({ users }: { users: UserRow[] }) {
  const real = users.filter(u => !u.profile?.is_test_account)
  const test = users.filter(u => u.profile?.is_test_account)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">ユーザー一覧</h2>
        <div className="flex gap-3 text-sm text-slate-500">
          <span>全体: <strong className="text-slate-800">{users.length}</strong></span>
          <span>実ユーザー: <strong className="text-green-700">{real.length}</strong></span>
          <span>テスト: <strong className="text-slate-400">{test.length}</strong></span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
              <th className="pb-2 font-medium pr-4">メール</th>
              <th className="pb-2 font-medium pr-4">団体・業種</th>
              <th className="pb-2 font-medium pr-4">役割 / 都道府県</th>
              <th className="pb-2 font-medium pr-4">同意</th>
              <th className="pb-2 font-medium pr-4">イベント</th>
              <th className="pb-2 font-medium pr-4">登録日</th>
              <th className="pb-2 font-medium">テスト</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <UserRow key={u.id} user={u} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserRow({ user }: { user: UserRow }) {
  const [isPending, startTransition] = useTransition()
  const isTest = user.profile?.is_test_account ?? false

  return (
    <tr className={`text-xs ${isTest ? 'opacity-50' : ''}`}>
      <td className="py-2 pr-4">
        <span className="font-medium text-slate-700">{user.email}</span>
      </td>
      <td className="py-2 pr-4 text-slate-500">
        <div>{user.profile?.organization ?? <span className="text-slate-300">—</span>}</div>
        <div className="text-slate-400">{user.profile?.industry ?? ''}</div>
      </td>
      <td className="py-2 pr-4 text-slate-500">
        <div>{user.profile?.role ?? <span className="text-slate-300">—</span>}</div>
        <div className="text-slate-400">{user.profile?.prefecture ?? ''}</div>
      </td>
      <td className="py-2 pr-4">
        <div className="flex gap-1.5">
          <span title="規約同意" className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${user.profile?.terms_accepted_at ? 'bg-green-500' : 'bg-slate-200'}`}>
            {user.profile?.terms_accepted_at ? '✓' : ''}
          </span>
          <span title="メルマガ" className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${user.profile?.newsletter_opt_in ? 'bg-blue-500' : 'bg-slate-200'}`}>
            {user.profile?.newsletter_opt_in ? 'M' : ''}
          </span>
          <span title="営業" className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${user.profile?.marketing_opt_in ? 'bg-purple-500' : 'bg-slate-200'}`}>
            {user.profile?.marketing_opt_in ? 'S' : ''}
          </span>
        </div>
      </td>
      <td className="py-2 pr-4 text-slate-500">{user.event_count}</td>
      <td className="py-2 pr-4 text-slate-400">
        {new Date(user.created_at).toLocaleDateString('ja-JP')}
      </td>
      <td className="py-2">
        {user.profile ? (
          <button
            disabled={isPending}
            onClick={() => startTransition(async () => { await toggleTestFlag(user.id, !isTest) })}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
              isTest
                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            }`}
          >
            {isTest ? 'テスト解除' : 'テスト'}
          </button>
        ) : (
          <span className="text-slate-300 text-xs">プロフィールなし</span>
        )}
      </td>
    </tr>
  )
}
