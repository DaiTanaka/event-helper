'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import type { EventSchedule, EventEquipment, EventContact, EventQA } from '@/lib/types'
import ContactsSection from './ContactsSection'
import QASection from './QASection'
import DuplicateEventButton from './DuplicateEventButton'
import DeleteEventButton from './DeleteEventButton'

type InlineSection = 'contacts' | 'qa'

type Props = {
  eventId: string
  eventType: string | null
  schedules: EventSchedule[]
  equipment: EventEquipment[]
  contacts: EventContact[]
  qaList: EventQA[]
  layoutThumbnail: string | null
  totalTasks: number
  doneTasks: number
  totalContents: number
  confirmedContents: number
  totalBudget?: number | null
  hasReport?: boolean
}

// ── 統計バッジ ────────────────────────────────────────────────

function StatBadge({ children, color = 'slate' }: { children: React.ReactNode; color?: 'orange' | 'green' | 'amber' | 'blue' | 'teal' | 'violet' | 'purple' | 'slate' }) {
  const styles: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-600',
    green:  'bg-green-100 text-green-600',
    amber:  'bg-amber-100 text-amber-600',
    blue:   'bg-blue-100 text-blue-600',
    teal:   'bg-teal-100 text-teal-600',
    violet: 'bg-violet-100 text-violet-600',
    purple: 'bg-purple-100 text-purple-600',
    slate:  'bg-slate-100 text-slate-500',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[color]}`}>
      {children}
    </span>
  )
}

// ── インライン開閉カード ────────────────────────────────────────

function ToggleCard({
  section, active, onToggle, iconBg, iconColor, icon, title, children,
}: {
  section: InlineSection
  active: boolean
  onToggle: (s: InlineSection) => void
  iconBg: string
  iconColor: string
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(section)}
      className={`group w-full bg-white rounded-2xl border shadow-sm p-5 text-center transition-all hover:shadow-md ${
        active
          ? 'border-orange-300 ring-2 ring-orange-100 shadow-md'
          : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors ${active ? '' : 'group-hover:brightness-95'}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-sm font-semibold text-slate-700 leading-tight mb-2">{title}</p>
      <div className="min-h-[20px] flex justify-center items-center">
        {children}
      </div>
      {active && (
        <div className="mt-2.5 flex justify-center">
          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </button>
  )
}

// ── ナビゲーションカード（別ページへリンク） ────────────────────

function LinkCard({
  href, iconBg, iconColor, icon, title, children, external,
}: {
  href: string
  iconBg: string
  iconColor: string
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="group block w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center transition-all hover:shadow-md hover:border-slate-200"
    >
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:brightness-95 transition-all`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-sm font-semibold text-slate-700 leading-tight mb-2">{title}</p>
      <div className="min-h-[20px] flex justify-center items-center">
        {children}
      </div>
      <div className="mt-2.5 flex justify-center">
        <svg className="w-4 h-4 text-slate-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

// ── SVGアイコン定義 ────────────────────────────────────────────

const Icons = {
  schedule: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  equipment: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  contacts: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  qa: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  contents: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  tasks: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  layout: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  ),
  print: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  budget: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  report: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

// ── メインコンポーネント ───────────────────────────────────────

export default function EventDetailClient({
  eventId,
  eventType,
  schedules,
  equipment,
  contacts,
  qaList,
  layoutThumbnail,
  totalTasks,
  doneTasks,
  totalContents,
  confirmedContents,
  totalBudget,
  hasReport,
}: Props) {
  const [activeSection, setActiveSection] = useState<InlineSection | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  function toggle(section: InlineSection) {
    if (activeSection === section) {
      setActiveSection(null)
    } else {
      setActiveSection(section)
      setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80)
    }
  }

  const checkedEquipment = equipment.filter(e => e.checked).length

  return (
    <div className="space-y-6">
      {/* ── 機能グリッド ── */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-0.5">機能</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          {/* 会場レイアウト */}
          <LinkCard
            href={`/events/${eventId}/layout`}
            iconBg="bg-amber-50" iconColor="text-amber-500" icon={Icons.layout}
            title="会場レイアウト"
          >
            {layoutThumbnail
              ? <StatBadge color="amber">保存済み</StatBadge>
              : <span className="text-xs text-slate-300">レイアウト作成</span>}
          </LinkCard>

          {/* 備品リスト */}
          <LinkCard
            href={`/events/${eventId}/equipment`}
            iconBg="bg-blue-50" iconColor="text-blue-500" icon={Icons.equipment}
            title="備品リスト"
          >
            {equipment.length > 0
              ? <div className="flex flex-col items-center gap-1">
                  <StatBadge color="blue">{equipment.length}件</StatBadge>
                  {checkedEquipment > 0 && (
                    <span className="text-xs text-slate-400">確認済 {checkedEquipment}/{equipment.length}</span>
                  )}
                </div>
              : <span className="text-xs text-slate-300">未登録</span>}
          </LinkCard>

          {/* タイムスケジュール */}
          <LinkCard
            href={`/events/${eventId}/schedule`}
            iconBg="bg-orange-50" iconColor="text-orange-500" icon={Icons.schedule}
            title="タイムスケジュール"
          >
            {schedules.length > 0
              ? <StatBadge color="orange">{schedules.length}件</StatBadge>
              : <span className="text-xs text-slate-300">未登録</span>}
          </LinkCard>

          {/* コンテンツ管理 */}
          <LinkCard
            href={`/events/${eventId}/contents`}
            iconBg="bg-purple-50" iconColor="text-purple-500" icon={Icons.contents}
            title="コンテンツ管理"
          >
            {totalContents > 0
              ? <div className="flex flex-col items-center gap-1">
                  {confirmedContents > 0 && <StatBadge color="green">確定 {confirmedContents}件</StatBadge>}
                  {totalContents - confirmedContents > 0 && (
                    <span className="text-xs text-amber-500">検討中 {totalContents - confirmedContents}件</span>
                  )}
                </div>
              : <span className="text-xs text-slate-300">選定を始める</span>}
          </LinkCard>

          {/* タスク管理 */}
          <LinkCard
            href={`/events/${eventId}/tasks`}
            iconBg="bg-green-50" iconColor="text-green-500" icon={Icons.tasks}
            title="タスク管理"
          >
            {totalTasks > 0
              ? <div className="w-full px-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{doneTasks}/{totalTasks}</span>
                    <span>{Math.round((doneTasks / totalTasks) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full transition-all"
                      style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
                    />
                  </div>
                </div>
              : <span className="text-xs text-slate-300">タスクを作成</span>}
          </LinkCard>

          {/* スタッフ連絡先 */}
          <ToggleCard
            section="contacts" active={activeSection === 'contacts'} onToggle={toggle}
            iconBg="bg-teal-50" iconColor="text-teal-500" icon={Icons.contacts}
            title="スタッフ連絡先"
          >
            {contacts.length > 0
              ? <StatBadge color="teal">{contacts.length}件</StatBadge>
              : <span className="text-xs text-slate-300">未登録</span>}
          </ToggleCard>

          {/* Q&A集 */}
          <ToggleCard
            section="qa" active={activeSection === 'qa'} onToggle={toggle}
            iconBg="bg-violet-50" iconColor="text-violet-500" icon={Icons.qa}
            title="Q&A集"
          >
            {qaList.length > 0
              ? <StatBadge color="violet">{qaList.length}件</StatBadge>
              : <span className="text-xs text-slate-300">未登録</span>}
          </ToggleCard>

          {/* 予算管理 */}
          <LinkCard
            href={`/events/${eventId}/budget`}
            iconBg="bg-emerald-50" iconColor="text-emerald-500" icon={Icons.budget}
            title="予算管理"
          >
            {totalBudget != null
              ? <StatBadge color="green">¥{totalBudget.toLocaleString()}</StatBadge>
              : <span className="text-xs text-slate-300">収支を管理</span>}
          </LinkCard>

          {/* 運営マニュアル */}
          <LinkCard
            href={`/events/${eventId}/print`}
            iconBg="bg-slate-50" iconColor="text-slate-500" icon={Icons.print}
            title="運営マニュアル"
            external
          >
            <span className="text-xs text-slate-400">印刷・PDF出力</span>
          </LinkCard>

          {/* 実施報告書 */}
          <LinkCard
            href={`/events/${eventId}/report`}
            iconBg="bg-rose-50" iconColor="text-rose-500" icon={Icons.report}
            title="実施報告書"
          >
            {hasReport
              ? <StatBadge color="amber">報告済</StatBadge>
              : <span className="text-xs text-slate-300">報告書を作成</span>}
          </LinkCard>
        </div>
      </div>

      {/* ── インライン展開セクション ── */}
      {activeSection && (
        <div ref={sectionRef}>
          {activeSection === 'contacts' && (
            <div>
              <div className="flex justify-end mb-1.5 no-print">
                <Link href={`/events/${eventId}/contacts`} className="text-xs text-slate-400 hover:text-orange-500 flex items-center gap-1 transition-colors">
                  全画面で開く
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
              <ContactsSection eventId={eventId} contacts={contacts} eventType={eventType} />
            </div>
          )}
          {activeSection === 'qa' && (
            <div>
              <div className="flex justify-end mb-1.5 no-print">
                <Link href={`/events/${eventId}/qa`} className="text-xs text-slate-400 hover:text-orange-500 flex items-center gap-1 transition-colors">
                  全画面で開く
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
              <QASection eventId={eventId} qaList={qaList} eventType={eventType} />
            </div>
          )}
        </div>
      )}

      {/* ── 複製・削除 ── */}
      <div className="pb-4 flex flex-col items-center gap-4 no-print pt-2">
        <DuplicateEventButton eventId={eventId} />
        <DeleteEventButton eventId={eventId} />
      </div>
    </div>
  )
}
