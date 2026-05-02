import type { ItemShape } from './layout-types'

export type PresetItem = {
  id: string
  category: string
  label: string
  shape: ItemShape
  width: number
  height: number
  color: string
}

export const PRESET_ITEMS: PresetItem[] = [
  // テーブル
  { id: 'table-conf-180', category: 'テーブル', label: '会議テーブル', shape: 'rect', width: 180, height: 45, color: '#fde68a' },
  { id: 'table-round-90', category: 'テーブル', label: '丸テーブル', shape: 'circle', width: 90, height: 90, color: '#fde68a' },
  { id: 'table-long-180', category: 'テーブル', label: '長机', shape: 'rect', width: 180, height: 45, color: '#fef3c7' },
  { id: 'table-fold-170', category: 'テーブル', label: '折りたたみ机', shape: 'rect', width: 170, height: 45, color: '#fef3c7' },
  { id: 'table-sq-90', category: 'テーブル', label: '正方形テーブル', shape: 'rect', width: 90, height: 90, color: '#fde68a' },
  // 椅子
  { id: 'chair-pipe', category: '椅子', label: 'パイプ椅子', shape: 'rect', width: 43, height: 43, color: '#bfdbfe' },
  { id: 'chair-arm', category: '椅子', label: 'アームチェア', shape: 'rect', width: 65, height: 65, color: '#93c5fd' },
  { id: 'sofa', category: '椅子', label: 'ソファ', shape: 'rect', width: 180, height: 80, color: '#93c5fd' },
  // ステージ・演出
  { id: 'stage', category: 'ステージ', label: 'ステージ', shape: 'rect', width: 400, height: 120, color: '#bbf7d0' },
  { id: 'podium', category: 'ステージ', label: '演台', shape: 'rect', width: 60, height: 50, color: '#86efac' },
  { id: 'screen', category: 'ステージ', label: 'スクリーン', shape: 'rect', width: 200, height: 12, color: '#e2e8f0' },
  { id: 'projector', category: 'ステージ', label: 'プロジェクター', shape: 'rect', width: 40, height: 30, color: '#cbd5e1' },
  // 設備
  { id: 'whiteboard', category: '設備', label: 'ホワイトボード', shape: 'rect', width: 90, height: 12, color: '#f1f5f9' },
  { id: 'partition', category: '設備', label: 'パーティション', shape: 'rect', width: 180, height: 8, color: '#94a3b8' },
  { id: 'pillar', category: '設備', label: '柱', shape: 'rect', width: 60, height: 60, color: '#64748b' },
  // 動線・受付
  { id: 'entrance', category: '動線', label: '出入口', shape: 'rect', width: 90, height: 15, color: '#6ee7b7' },
  { id: 'emergency-exit', category: '動線', label: '非常口', shape: 'rect', width: 90, height: 15, color: '#fca5a5' },
  { id: 'reception', category: '動線', label: '受付', shape: 'rect', width: 150, height: 60, color: '#fed7aa' },
  { id: 'sign', category: '動線', label: '案内看板', shape: 'rect', width: 60, height: 10, color: '#c084fc' },
  // 人物
  { id: 'person-staff', category: '人物', label: 'スタッフ', shape: 'person', width: 40, height: 60, color: '#93c5fd' },
  { id: 'person-director', category: '人物', label: 'ディレクター', shape: 'person', width: 40, height: 60, color: '#a78bfa' },
  { id: 'person-mc', category: '人物', label: '司会', shape: 'person', width: 40, height: 60, color: '#fb923c' },
  { id: 'person-participant', category: '人物', label: '参加者', shape: 'person', width: 35, height: 55, color: '#86efac' },
  { id: 'person-adult', category: '人物', label: '参加者（大人）', shape: 'person', width: 35, height: 55, color: '#6ee7b7' },
  { id: 'person-child', category: '人物', label: '参加者（子供）', shape: 'person', width: 25, height: 42, color: '#fde68a' },
]

export const PRESET_CATEGORIES = Array.from(new Set(PRESET_ITEMS.map(p => p.category)))

export const ITEM_COLORS = [
  '#fde68a', '#fca5a5', '#bfdbfe', '#bbf7d0',
  '#e9d5ff', '#fed7aa', '#6ee7b7', '#f1f5f9',
  '#fbbf24', '#f87171', '#60a5fa', '#34d399',
  '#a78bfa', '#fb923c', '#94a3b8', '#e2e8f0',
]
