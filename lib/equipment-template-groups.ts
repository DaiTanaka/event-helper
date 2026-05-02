export type EquipmentTemplateItem = {
  name: string
  quantity: number
  unit: string
  category: string
}

export type EquipmentTemplateGroup = {
  id: string
  label: string
  eventTypes: string[] | 'all'
  items: EquipmentTemplateItem[]
}

export const EQUIPMENT_TEMPLATE_GROUPS: EquipmentTemplateGroup[] = [
  // ── 汎用 ─────────────────────────────────────────────────────
  {
    id: 'general_furniture',
    label: '什器セット',
    eventTypes: 'all',
    items: [
      { name: 'テーブル',       quantity: 10,  unit: '台', category: '什器・家具' },
      { name: '椅子',           quantity: 50,  unit: '脚', category: '什器・家具' },
      { name: '長テーブル',     quantity: 5,   unit: '台', category: '什器・家具' },
      { name: 'テーブルクロス', quantity: 10,  unit: '枚', category: '什器・家具' },
    ],
  },
  {
    id: 'general_av',
    label: '音響・映像セット',
    eventTypes: 'all',
    items: [
      { name: 'マイク',       quantity: 2, unit: '本', category: '電気機器' },
      { name: 'スピーカー',   quantity: 2, unit: '台', category: '電気機器' },
      { name: 'プロジェクター', quantity: 1, unit: '台', category: '電気機器' },
      { name: 'スクリーン',   quantity: 1, unit: '台', category: '電気機器' },
      { name: '延長コード',   quantity: 5, unit: '本', category: '電気機器' },
    ],
  },
  {
    id: 'general_print',
    label: '印刷物セット',
    eventTypes: 'all',
    items: [
      { name: 'プログラム', quantity: 200, unit: '枚', category: '印刷物' },
      { name: '案内看板',   quantity: 5,   unit: '枚', category: '印刷物' },
      { name: '受付票',     quantity: 100, unit: '枚', category: '印刷物' },
      { name: '名札',       quantity: 50,  unit: '枚', category: '印刷物' },
    ],
  },

  // ── 企業・社内イベント ────────────────────────────────────────
  {
    id: 'corporate_party',
    label: '懇親会セット',
    eventTypes: ['corporate_party'],
    items: [
      { name: 'ウェルカムボード',     quantity: 1,  unit: '枚', category: '装飾' },
      { name: 'テーブル装飾（生花）', quantity: 5,  unit: '個', category: '装飾' },
      { name: 'マイクスタンド',       quantity: 1,  unit: '本', category: '電気機器' },
      { name: 'レーザーポインター',   quantity: 1,  unit: '本', category: '電気機器' },
      { name: '景品（ラッフル賞）',   quantity: 5,  unit: '個', category: 'その他' },
      { name: 'カメラ・三脚',         quantity: 1,  unit: '式', category: '電気機器' },
    ],
  },

  // ── 学校・教育イベント ────────────────────────────────────────
  {
    id: 'school_event',
    label: '学校行事セット',
    eventTypes: ['school_event'],
    items: [
      { name: '横断幕',             quantity: 1,  unit: '枚', category: '装飾' },
      { name: 'テント',             quantity: 5,  unit: '張', category: '什器・家具' },
      { name: '表彰状・楯',         quantity: 10, unit: '個', category: '印刷物' },
      { name: '救急セット',         quantity: 1,  unit: '式', category: 'その他' },
      { name: '熱中症対策（飲料水）', quantity: 50, unit: '本', category: '消耗品' },
      { name: '集合写真用台',       quantity: 1,  unit: '台', category: '什器・家具' },
    ],
  },

  // ── 地域・自治体イベント ──────────────────────────────────────
  {
    id: 'community_festival',
    label: '地域フェスタセット',
    eventTypes: ['community_festival'],
    items: [
      { name: 'テント（大）',     quantity: 10, unit: '張', category: '什器・家具' },
      { name: '発電機',           quantity: 1,  unit: '台', category: '電気機器' },
      { name: '拡声器・メガホン', quantity: 3,  unit: '個', category: '電気機器' },
      { name: 'ゴミ袋',          quantity: 100, unit: '枚', category: '消耗品' },
      { name: '誘導旗・案内旗',  quantity: 10, unit: '本', category: 'その他' },
      { name: '警備員用ビブス',  quantity: 10, unit: '枚', category: 'その他' },
    ],
  },

  // ── 商業施設イベント ──────────────────────────────────────────
  {
    id: 'commercial_facility',
    label: '商業施設イベントセット',
    eventTypes: ['commercial_facility'],
    items: [
      { name: '整理券用紙',     quantity: 500, unit: '枚', category: '印刷物' },
      { name: '番号札',         quantity: 100, unit: '枚', category: '印刷物' },
      { name: 'バナースタンド', quantity: 3,   unit: '本', category: '装飾' },
      { name: 'カラーコーン',  quantity: 10,  unit: '個', category: 'その他' },
      { name: '受付テーブル',  quantity: 2,   unit: '台', category: '什器・家具' },
    ],
  },

  // ── スポーツ・アウトドア ──────────────────────────────────────
  {
    id: 'sports',
    label: 'スポーツ大会セット',
    eventTypes: ['sports'],
    items: [
      { name: 'スターターピストル/ブザー', quantity: 1,  unit: '個', category: '電気機器' },
      { name: '計時装置',                  quantity: 1,  unit: '台', category: '電気機器' },
      { name: 'ゼッケン',                  quantity: 50, unit: '枚', category: 'その他' },
      { name: 'トロフィー・メダル',        quantity: 10, unit: '個', category: 'その他' },
      { name: '救急セット',                quantity: 1,  unit: '式', category: 'その他' },
      { name: 'コース・ラインテープ',      quantity: 5,  unit: '巻', category: '消耗品' },
    ],
  },

  // ── 展示会・見本市 ────────────────────────────────────────────
  {
    id: 'exhibition',
    label: '展示会セット',
    eventTypes: ['exhibition'],
    items: [
      { name: '展示パネル',       quantity: 10, unit: '枚', category: '装飾' },
      { name: 'バナースタンド',   quantity: 5,  unit: '本', category: '装飾' },
      { name: 'カタログ棚・台',   quantity: 5,  unit: '台', category: '什器・家具' },
      { name: '名刺入れ',         quantity: 20, unit: '個', category: 'その他' },
      { name: '来場者カウンター', quantity: 2,  unit: '個', category: '電気機器' },
      { name: 'タブレット端末',   quantity: 2,  unit: '台', category: '電気機器' },
    ],
  },
]

export function getEquipmentTemplatesForEventType(eventType: string | null | undefined): EquipmentTemplateGroup[] {
  if (!eventType) return EQUIPMENT_TEMPLATE_GROUPS.filter(g => g.eventTypes === 'all')
  return EQUIPMENT_TEMPLATE_GROUPS.filter(
    g => g.eventTypes === 'all' || (g.eventTypes as string[]).includes(eventType)
  )
}
