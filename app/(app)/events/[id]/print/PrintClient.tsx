'use client'

import { useState, useSyncExternalStore } from 'react'
import type { Event, EventSchedule, EventEquipment, EventContact, EventQA, EventTask, EventBudgetItem } from '@/lib/types'
import Link from 'next/link'

type Props = {
  event: Event
  schedules: EventSchedule[]
  equipment: EventEquipment[]
  contacts: EventContact[]
  qaList: EventQA[]
  tasks: EventTask[]
  budgetItems: EventBudgetItem[]
  layoutThumbnail: string | null
}

type BlockAlign = 'left' | 'center' | 'right'
type BlockSize  = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type Block = {
  id: string
  type: 'heading' | 'text' | 'image'
  content: string
  size?: BlockSize
  align?: BlockAlign
}

type PagePosition =
  | 'start'
  | 'after:overview'
  | 'after:contacts'
  | 'after:schedule'
  | 'after:equipment'
  | 'after:qa'
  | 'after:tasks'
  | 'after:budget'
  | 'after:layout'
  | 'end'

type CustomPage = {
  id: string
  title: string           // 空文字のとき見出しを非表示
  position: PagePosition
  blocks: Block[]
}

type ManualConfig = { hiddenSections: string[]; customPages: CustomPage[] }

// ── 定数 ─────────────────────────────────────────────────────
const ALL_SECTIONS = [
  { key: 'overview',  label: '開催概要' },
  { key: 'contacts',  label: 'スタッフ連絡先' },
  { key: 'schedule',  label: 'タイムスケジュール' },
  { key: 'equipment', label: '備品リスト' },
  { key: 'qa',        label: 'Q&A集' },
  { key: 'tasks',     label: '準備チェックリスト' },
  { key: 'budget',    label: '予算' },
  { key: 'layout',    label: '会場レイアウト' },
]

const PAGE_POSITIONS: { value: PagePosition; label: string }[] = [
  { value: 'start',           label: '最初（表紙）' },
  { value: 'after:overview',  label: '開催概要の後' },
  { value: 'after:contacts',  label: 'スタッフ連絡先の後' },
  { value: 'after:schedule',  label: 'タイムスケジュールの後' },
  { value: 'after:equipment', label: '備品リストの後' },
  { value: 'after:qa',        label: 'Q&A集の後' },
  { value: 'after:tasks',     label: '準備チェックリストの後' },
  { value: 'after:budget',    label: '予算の後' },
  { value: 'after:layout',    label: '会場レイアウトの後' },
  { value: 'end',             label: '最後' },
]

const HEADING_SIZES: { value: BlockSize; label: string; cls: string }[] = [
  { value: 'sm', label: 'S', cls: 'text-sm font-semibold' },
  { value: 'md', label: 'M', cls: 'text-base font-semibold' },
  { value: 'lg', label: 'L', cls: 'text-xl font-bold' },
  { value: 'xl', label: 'XL', cls: 'text-2xl font-bold' },
]

const TEXT_SIZES: { value: BlockSize; label: string; cls: string }[] = [
  { value: 'xs', label: 'S', cls: 'text-xs' },
  { value: 'sm', label: 'M', cls: 'text-sm' },
  { value: 'md', label: 'L', cls: 'text-base' },
  { value: 'lg', label: 'XL', cls: 'text-lg' },
]

const ALIGNS: { value: BlockAlign; icon: string }[] = [
  { value: 'left',   icon: '≡L' },
  { value: 'center', icon: '≡C' },
  { value: 'right',  icon: '≡R' },
]

const defaultConfig: ManualConfig = { hiddenSections: [], customPages: [] }
function uid() { return Math.random().toString(36).slice(2) }

// ── ブロックのCSSクラス解決 ───────────────────────────────────
function blockCls(block: Block): string {
  const alignCls = block.align === 'center' ? 'text-center' : block.align === 'right' ? 'text-right' : 'text-left'
  if (block.type === 'heading') {
    const sz = HEADING_SIZES.find(s => s.value === (block.size ?? 'lg')) ?? HEADING_SIZES[2]
    return `${sz.cls} ${alignCls} mt-4 text-slate-800`
  }
  const sz = TEXT_SIZES.find(s => s.value === (block.size ?? 'sm')) ?? TEXT_SIZES[1]
  return `${sz.cls} ${alignCls} text-slate-800 whitespace-pre-wrap leading-relaxed`
}

// ── カスタムページ描画（再利用） ──────────────────────────────
function CustomPageSection({ page }: { page: CustomPage }) {
  return (
    <div className="print-break-before print-avoid-break mb-8 print:mb-6">
      {page.title && (
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-4">{page.title}</h2>
      )}
      <div className="space-y-3">
        {page.blocks.map(block => {
          if (block.type === 'image') {
            return block.content ? (
              <div key={block.id} className="border border-slate-200 rounded p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.content} alt="" className="max-w-full h-auto" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div key={block.id} className="border-2 border-dashed border-slate-200 rounded p-8 text-center text-xs text-slate-400">
                画像URLを設定パネルで入力してください
              </div>
            )
          }
          const Tag = block.type === 'heading' ? 'p' : 'p'
          return <Tag key={block.id} className={blockCls(block)}>{block.content}</Tag>
        })}
      </div>
    </div>
  )
}

// ── ブロック編集コントロール ──────────────────────────────────
function BlockStyleBar({
  block,
  onUpdate,
}: {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
}) {
  const sizes = block.type === 'heading' ? HEADING_SIZES : TEXT_SIZES
  const currentSize = block.size ?? (block.type === 'heading' ? 'lg' : 'sm')
  const currentAlign = block.align ?? 'left'

  return (
    <div className="flex items-center gap-1 mt-1">
      {/* サイズ */}
      <span className="text-[9px] text-slate-400 mr-0.5">サイズ</span>
      {sizes.map(s => (
        <button
          key={s.value}
          onClick={() => onUpdate({ size: s.value })}
          className={`text-[9px] px-1.5 py-0.5 rounded border leading-none ${
            currentSize === s.value
              ? 'bg-orange-500 text-white border-orange-500'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          {s.label}
        </button>
      ))}
      <span className="text-[9px] text-slate-400 ml-1.5 mr-0.5">配置</span>
      {ALIGNS.map(a => (
        <button
          key={a.value}
          onClick={() => onUpdate({ align: a.value })}
          title={a.value}
          className={`text-[9px] px-1.5 py-0.5 rounded border leading-none ${
            currentAlign === a.value
              ? 'bg-orange-500 text-white border-orange-500'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          {a.value === 'left' ? '左' : a.value === 'center' ? '中' : '右'}
        </button>
      ))}
    </div>
  )
}

// ── 設定パネル ────────────────────────────────────────────────
function SettingsPanel({
  config,
  onChange,
  onClose,
}: {
  config: ManualConfig
  onChange: (c: ManualConfig) => void
  onClose: () => void
}) {
  function toggleSection(key: string) {
    const hidden = config.hiddenSections.includes(key)
      ? config.hiddenSections.filter(s => s !== key)
      : [...config.hiddenSections, key]
    onChange({ ...config, hiddenSections: hidden })
  }

  function addPage() {
    onChange({
      ...config,
      customPages: [...config.customPages, { id: uid(), title: '', position: 'end', blocks: [] }],
    })
  }

  function updatePage(id: string, updates: Partial<CustomPage>) {
    onChange({
      ...config,
      customPages: config.customPages.map(p => p.id === id ? { ...p, ...updates } : p),
    })
  }

  function deletePage(id: string) {
    onChange({ ...config, customPages: config.customPages.filter(p => p.id !== id) })
  }

  function addBlock(pageId: string, type: Block['type']) {
    const page = config.customPages.find(p => p.id === pageId)!
    const newBlock: Block = { id: uid(), type, content: '' }
    updatePage(pageId, { blocks: [...page.blocks, newBlock] })
  }

  function updateBlock(pageId: string, blockId: string, updates: Partial<Block>) {
    const page = config.customPages.find(p => p.id === pageId)!
    updatePage(pageId, {
      blocks: page.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b),
    })
  }

  function deleteBlock(pageId: string, blockId: string) {
    const page = config.customPages.find(p => p.id === pageId)!
    updatePage(pageId, { blocks: page.blocks.filter(b => b.id !== blockId) })
  }

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div
        className="ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
          <h2 className="text-sm font-bold text-slate-800">マニュアル設定</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* セクション表示設定 */}
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">表示セクション</p>
            <div className="space-y-2">
              {ALL_SECTIONS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!config.hiddenSections.includes(key)}
                    onChange={() => toggleSection(key)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* カスタムページ */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">カスタムページ</p>
              <button
                onClick={addPage}
                className="text-xs px-2.5 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                + ページ追加
              </button>
            </div>

            <div className="space-y-4">
              {config.customPages.map(page => (
                <div key={page.id} className="border border-slate-200 rounded-xl overflow-hidden">

                  {/* ページヘッダー */}
                  <div className="bg-slate-50 px-3 py-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={page.title}
                        onChange={e => updatePage(page.id, { title: e.target.value })}
                        className="flex-1 text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-300"
                        placeholder="ページ見出し（空欄で非表示）"
                      />
                      <button
                        onClick={() => deletePage(page.id)}
                        className="text-red-400 hover:text-red-600 text-xs shrink-0"
                      >
                        削除
                      </button>
                    </div>
                    {/* 挿入位置 */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 shrink-0">挿入位置</span>
                      <select
                        value={page.position ?? 'end'}
                        onChange={e => updatePage(page.id, { position: e.target.value as PagePosition })}
                        className="flex-1 text-[10px] border border-slate-200 rounded px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-orange-300 text-slate-700"
                      >
                        {PAGE_POSITIONS.map(pos => (
                          <option key={pos.value} value={pos.value}>{pos.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ブロック一覧 */}
                  <div className="p-3 space-y-3">
                    {page.blocks.map(block => (
                      <div key={block.id} className="bg-slate-50 rounded-lg p-2 space-y-1">
                        <div className="flex gap-2 items-start">
                          <div className="flex-1">
                            {block.type === 'image' ? (
                              <input
                                value={block.content}
                                onChange={e => updateBlock(page.id, block.id, { content: e.target.value })}
                                placeholder="画像URL（https://...）"
                                className="w-full text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-orange-300"
                              />
                            ) : (
                              <textarea
                                value={block.content}
                                onChange={e => updateBlock(page.id, block.id, { content: e.target.value })}
                                rows={block.type === 'heading' ? 1 : 3}
                                placeholder={block.type === 'heading' ? '見出しテキスト' : 'テキスト内容'}
                                className="w-full text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-orange-300 resize-none"
                              />
                            )}
                          </div>
                          <button
                            onClick={() => deleteBlock(page.id, block.id)}
                            className="text-red-300 hover:text-red-500 text-xs mt-1 shrink-0"
                          >✕</button>
                        </div>

                        {/* テキスト/見出しのスタイル設定 */}
                        {(block.type === 'heading' || block.type === 'text') && (
                          <BlockStyleBar
                            block={block}
                            onUpdate={updates => updateBlock(page.id, block.id, updates)}
                          />
                        )}

                        <span className="text-[9px] text-slate-400">
                          {block.type === 'heading' ? '見出し' : block.type === 'image' ? '画像URL' : 'テキスト'}
                        </span>
                      </div>
                    ))}

                    {/* ブロック追加ボタン */}
                    <div className="flex gap-1.5">
                      {(['heading', 'text', 'image'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => addBlock(page.id, t)}
                          className="text-[10px] px-2 py-1 border border-slate-200 rounded text-slate-500 hover:bg-slate-100"
                        >
                          + {t === 'heading' ? '見出し' : t === 'text' ? 'テキスト' : '画像'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {config.customPages.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">
                  「＋ページ追加」で<br />任意の場所にページを挿入できます
                </p>
              )}
            </div>

            {/* 画像URL説明 */}
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">画像URLの指定方法</p>
              <ol className="text-[11px] text-amber-700 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Googleドライブに画像をアップロード</li>
                <li>「共有」→「リンクを知っている全員」に変更</li>
                <li>URLの <code className="bg-amber-100 px-0.5 rounded">file/d/[ID]/view</code> を <code className="bg-amber-100 px-0.5 rounded">uc?id=[ID]</code> に書き換え</li>
                <li>または <strong>imgur.com</strong> に投稿してURLを使用</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── メイン ────────────────────────────────────────────────────
const DAY_LABELS = ['1日目', '2日目', '3日目', '4日目', '5日目']
const PRIORITY_LABEL: Record<EventTask['priority'], string> = { high: '高', medium: '中', low: '低' }

const TYPE_STYLES: Record<string, { dot: string; borderColor: string; badge: string }> = {
  '設営': { dot: 'bg-blue-400',   borderColor: '#60a5fa', badge: 'bg-blue-50 text-blue-700' },
  '開催': { dot: 'bg-orange-400', borderColor: '#fb923c', badge: 'bg-orange-50 text-orange-700' },
  '撤収': { dot: 'bg-green-500',  borderColor: '#22c55e', badge: 'bg-green-50 text-green-700' },
}
const DEFAULT_TYPE_STYLE = { dot: 'bg-slate-400', borderColor: '#94a3b8', badge: 'bg-slate-100 text-slate-600' }

function ScheduleTimeline({ schedules }: { schedules: EventSchedule[] }) {
  return (
    <div className="relative">
      <div className="absolute left-[68px] top-0 bottom-0 w-px bg-slate-200" />
      {schedules.map(s => {
        const st = TYPE_STYLES[s.schedule_type ?? ''] ?? DEFAULT_TYPE_STYLE
        return (
          <div key={s.id} className="flex items-start mb-3 relative">
            <div className="w-[68px] shrink-0 text-right pr-3 pt-1.5">
              <span className="text-[11px] tabular-nums font-bold text-slate-800 block leading-none">
                {s.start_time?.slice(0, 5) ?? '−−:−−'}
              </span>
              {s.end_time && (
                <span className="text-[10px] tabular-nums text-slate-400 block leading-none mt-0.5">
                  〜{s.end_time.slice(0, 5)}
                </span>
              )}
            </div>
            <div className={`absolute left-[64px] top-2 w-2.5 h-2.5 rounded-full ${st.dot} border-2 border-white z-10`} />
            <div
              className="ml-6 flex-1 border border-slate-200 rounded px-3 py-2 bg-white"
              style={{ borderLeftWidth: 3, borderLeftColor: st.borderColor }}
            >
              <div className="flex items-start gap-2 flex-wrap">
                {s.schedule_type && (
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${st.badge} shrink-0 mt-0.5`}>
                    {s.schedule_type}
                  </span>
                )}
                <span className="text-sm font-medium text-slate-900 leading-snug">{s.content}</span>
              </div>
              {(s.location || s.responsible_person || s.notes) && (
                <div className="mt-1 flex gap-4 flex-wrap text-[11px] text-slate-500">
                  {s.location && <span>場所: {s.location}</span>}
                  {s.responsible_person && <span>担当: {s.responsible_person}</span>}
                  {s.notes && <span className="text-slate-400">{s.notes}</span>}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function PrintClient({ event: e, schedules, equipment, contacts, qaList, tasks, budgetItems, layoutThumbnail }: Props) {
  const storageKey = `manual-config-${e.id}`
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const [config, setConfig] = useState<ManualConfig>(() => {
    if (typeof window === 'undefined') return defaultConfig
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as ManualConfig
        parsed.customPages = (parsed.customPages ?? []).map(p => ({
          ...p,
          position: (p.position ?? 'end') as PagePosition,
        }))
        return parsed
      }
    } catch {}
    return defaultConfig
  })
  const [showSettings, setShowSettings] = useState(false)

  function updateConfig(c: ManualConfig) {
    setConfig(c)
    try { localStorage.setItem(storageKey, JSON.stringify(c)) } catch {}
  }

  const hidden = new Set(config.hiddenSections)

  // 指定ポジションのカスタムページを返す
  function pagesAt(pos: PagePosition) {
    return config.customPages.filter(p => (p.position ?? 'end') === pos)
  }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) : null

  const maxDay = Math.max(...schedules.map(s => s.day_number), 1)
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)
  const equipCategories = Array.from(new Set(equipment.map(eq => eq.category ?? 'その他')))

  const infoRows = [
    { label: '開催日程', value: formatDate(e.event_date) ? (<>{formatDate(e.event_date)}{e.end_date && e.end_date !== e.event_date && <> 〜 {formatDate(e.end_date)}</>}</>) : null },
    { label: '設営日 / 撤収日', value: (e.setup_date || e.teardown_date) ? (<>{formatDate(e.setup_date) ?? '—'} / {formatDate(e.teardown_date) ?? '—'}</>) : null },
    { label: '会場', value: e.venue_name ? (<>{e.venue_name}{e.venue_address && <> — {e.venue_address}</>}{e.venue_map_url && <> （<a href={e.venue_map_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">地図</a>）</>}</>) : null },
    { label: 'アクセス・搬入口', value: e.venue_access },
    { label: '入館・入場方法', value: e.venue_entry },
    { label: '主催', value: e.organizer },
    { label: '共催・協力', value: e.co_organizers },
    { label: '来場想定人数', value: e.expected_visitors ? `${e.expected_visitors.toLocaleString()}名` : null },
    { label: 'ターゲット', value: e.target_audience },
    { label: '概要', value: e.overview },
    { label: '備考', value: e.notes },
  ].filter(r => r.value)

  const hasStaffBriefing = !!(e.venue_meeting_place || e.venue_meeting_time || e.staff_dress_code)
  const staffBriefingRows = [
    { label: '集合場所', value: e.venue_meeting_place },
    { label: '集合時間', value: e.venue_meeting_time },
    { label: '服装・ユニフォーム', value: e.staff_dress_code },
    { label: '担当者', value: e.contact_name ? (<>{e.contact_name}{e.contact_phone && `　TEL: ${e.contact_phone}`}{e.contact_email && `　Mail: ${e.contact_email}`}</>) : null },
  ].filter(r => r.value)

  return (
    <>
      {/* ── 印刷コントロールバー ── */}
      <div className="no-print fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link href={`/events/${e.id}`} className="text-sm text-slate-500 hover:text-slate-700">← 戻る</Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              ページ設定
              {(config.hiddenSections.length > 0 || config.customPages.length > 0) && (
                <span className="bg-orange-500 text-white text-[10px] px-1.5 rounded-full">
                  {config.customPages.length > 0 ? `+${config.customPages.length}p` : config.hiddenSections.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            印刷 / PDF保存
          </button>
        </div>
      </div>

      {/* 設定パネル */}
      {showSettings && (
        <SettingsPanel config={config} onChange={updateConfig} onClose={() => setShowSettings(false)} />
      )}

      {/* ── 印刷コンテンツ ── */}
      <div className="max-w-3xl mx-auto py-16 px-4 print:py-0 print:px-0">

        {/* 最初のカスタムページ（表紙など） */}
        {pagesAt('start').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* ── 1. 開催概要 ── */}
        {!hidden.has('overview') && (
          <div className="print-avoid-break mb-8 print:mb-6">
            <div className="text-center py-6 border-b-2 border-slate-800 mb-6">
              <h1 className="text-2xl font-bold text-slate-900">{e.title}</h1>
              <p className="text-slate-500 mt-1 text-sm">イベント運営マニュアル</p>
            </div>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {infoRows.map(({ label, value }) => (
                  <tr key={label} className="border border-slate-300">
                    <th className="px-3 py-2 bg-slate-100 text-left font-medium text-slate-700 whitespace-nowrap w-36">{label}</th>
                    <td className="px-3 py-2 text-slate-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagesAt('after:overview').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* ── 2. スタッフ連絡先 ── */}
        {!hidden.has('contacts') && (contacts.length > 0 || hasStaffBriefing) && (
          <div className="print-break-before print-avoid-break mb-8 print:mb-6">
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-4">スタッフ連絡先</h2>

            {/* 当日案内（集合・服装・担当者） */}
            {staffBriefingRows.length > 0 && (
              <table className="w-full border-collapse text-sm mb-5">
                <tbody>
                  {staffBriefingRows.map(({ label, value }) => (
                    <tr key={label} className="border border-slate-300">
                      <th className="px-3 py-2 bg-slate-100 text-left font-medium text-slate-700 whitespace-nowrap w-36">{label}</th>
                      <td className="px-3 py-2 text-slate-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600 w-24">名前</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600 w-24">役割</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600">会社/所属</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600 w-32">電話番号</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600">メール / メモ</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id}>
                    <td className="border border-slate-300 px-2 py-2 text-xs font-medium">{c.name}</td>
                    <td className="border border-slate-300 px-2 py-2 text-xs">{c.role}</td>
                    <td className="border border-slate-300 px-2 py-2 text-xs">{c.company}</td>
                    <td className="border border-slate-300 px-2 py-2 text-xs font-medium">{c.phone}</td>
                    <td className="border border-slate-300 px-2 py-2 text-xs">{c.email}{c.notes && <span className="text-slate-500 ml-1">({c.notes})</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagesAt('after:contacts').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* ── 3. タイムスケジュール ── */}
        {!hidden.has('schedule') && schedules.length > 0 && (
          <div className="print-break-before print-avoid-break mb-8 print:mb-6">
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-4">タイムスケジュール</h2>
            {days.map(day => {
              const daySchedules = schedules.filter(s => s.day_number === day)
              if (daySchedules.length === 0) return null
              return (
                <div key={day} className="mb-4">
                  {maxDay > 1 && <h3 className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 mb-2">{DAY_LABELS[day - 1] ?? `${day}日目`}</h3>}
                  <ScheduleTimeline schedules={daySchedules} />
                </div>
              )
            })}
          </div>
        )}
        {pagesAt('after:schedule').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* ── 4. 備品リスト ── */}
        {!hidden.has('equipment') && equipment.length > 0 && (
          <div className="print-break-before print-avoid-break mb-8 print:mb-6">
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-4">備品リスト</h2>
            {equipCategories.map(cat => {
              const items = equipment.filter(eq => (eq.category ?? 'その他') === cat)
              if (items.length === 0) return null
              return (
                <div key={cat} className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 mb-2">{cat}</h3>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600">品名</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-right text-xs font-medium text-slate-600 w-16">数量</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600 w-28">仕入先</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-center text-xs font-medium text-slate-600 w-8">✓</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600">備考</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id}>
                          <td className="border border-slate-300 px-2 py-2 text-xs">{item.name}</td>
                          <td className="border border-slate-300 px-2 py-2 text-xs text-right tabular-nums">{item.quantity}{item.unit}</td>
                          <td className="border border-slate-300 px-2 py-2 text-xs">{item.supplier}</td>
                          <td className="border border-slate-300 px-2 py-2 text-xs text-center">□</td>
                          <td className="border border-slate-300 px-2 py-2 text-xs">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
        )}
        {pagesAt('after:equipment').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* ── 5. Q&A集 ── */}
        {!hidden.has('qa') && qaList.length > 0 && (
          <div className="print-break-before mb-8 print:mb-6">
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-4">Q&A集</h2>
            <div className="space-y-3">
              {qaList.map((qa, i) => (
                <div key={qa.id} className="print-avoid-break border border-slate-200 rounded px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800"><span className="text-orange-600 font-bold mr-1">Q{i + 1}.</span>{qa.question}</p>
                  <p className="text-sm text-slate-700 mt-1.5 whitespace-pre-wrap leading-relaxed"><span className="font-bold mr-1">A.</span>{qa.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {pagesAt('after:qa').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* ── 6. 準備チェックリスト ── */}
        {!hidden.has('tasks') && tasks.filter(t => t.status !== 'done').length > 0 && (
          <div className="print-break-before print-avoid-break mb-8 print:mb-6">
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-4">準備チェックリスト</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-300 px-2 py-1.5 text-center text-xs font-medium text-slate-600 w-8">✓</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600">タスク名</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-center text-xs font-medium text-slate-600 w-10">優先</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600 w-20">期限日</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600 w-20">担当者</th>
                </tr>
              </thead>
              <tbody>
                {tasks.filter(t => t.status !== 'done').map(task => (
                  <tr key={task.id}>
                    <td className="border border-slate-300 px-2 py-2 text-xs text-center">□</td>
                    <td className="border border-slate-300 px-2 py-2 text-xs">{task.title}</td>
                    <td className="border border-slate-300 px-2 py-2 text-xs text-center">{PRIORITY_LABEL[task.priority]}</td>
                    <td className="border border-slate-300 px-2 py-2 text-xs tabular-nums">
                      {task.due_date ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }) : ''}
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-xs">{task.assignee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagesAt('after:tasks').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* ── 7. 予算 ── */}
        {!hidden.has('budget') && budgetItems.length > 0 && (() => {
          const totalEstimated = budgetItems.reduce((s, b) => s + b.unit_price * b.quantity, 0)
          const totalActual = budgetItems.reduce((s, b) => s + (b.actual_price != null ? b.actual_price * b.quantity : b.unit_price * b.quantity), 0)
          const categories = Array.from(new Set(budgetItems.map(b => b.category)))
          return (
            <div className="print-break-before print-avoid-break mb-8 print:mb-6">
              <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-4">予算</h2>
              <div className="flex gap-6 mb-4 text-sm">
                {e.total_budget != null && (
                  <div><span className="text-slate-500">総予算：</span><span className="font-bold">¥{e.total_budget.toLocaleString()}</span></div>
                )}
                <div><span className="text-slate-500">見積合計：</span><span className="font-bold">¥{totalEstimated.toLocaleString()}</span></div>
                <div><span className="text-slate-500">実績合計：</span><span className="font-bold">¥{totalActual.toLocaleString()}</span></div>
              </div>
              {categories.map(cat => {
                const items = budgetItems.filter(b => b.category === cat)
                return (
                  <div key={cat} className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 mb-2">{cat}</h3>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600">品目</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-right text-xs font-medium text-slate-600 w-12">数量</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-right text-xs font-medium text-slate-600 w-28">単価（見積）</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-right text-xs font-medium text-slate-600 w-28">実績</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-left text-xs font-medium text-slate-600">備考</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id}>
                            <td className="border border-slate-300 px-2 py-2 text-xs">{item.name}</td>
                            <td className="border border-slate-300 px-2 py-2 text-xs text-right tabular-nums">{item.quantity}</td>
                            <td className="border border-slate-300 px-2 py-2 text-xs text-right tabular-nums">¥{(item.unit_price * item.quantity).toLocaleString()}</td>
                            <td className="border border-slate-300 px-2 py-2 text-xs text-right tabular-nums">
                              {item.actual_price != null ? `¥${(item.actual_price * item.quantity).toLocaleString()}` : '—'}
                            </td>
                            <td className="border border-slate-300 px-2 py-2 text-xs">{item.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          )
        })()}
        {pagesAt('after:budget').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* ── 8. 会場レイアウト ──────────────────────────── */}
        {!hidden.has('layout') && layoutThumbnail && (
          <div className="print-break-before print-avoid-break mb-8 print:mb-6">
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-1 mb-4">会場レイアウト</h2>
            <div className="border border-slate-300 p-3 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(layoutThumbnail)}`}
                alt="会場レイアウト図"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        )}
        {pagesAt('after:layout').map(p => <CustomPageSection key={p.id} page={p} />)}

        {/* 最後のカスタムページ */}
        {pagesAt('end').map(p => <CustomPageSection key={p.id} page={p} />)}

      </div>
    </>
  )
}
