export type ContactTemplate = {
  name: string
  role: string
}

export type ContactTemplateGroup = {
  id: string
  label: string
  eventTypes: string[] | 'all'
  contacts: ContactTemplate[]
}

export const CONTACT_TEMPLATE_GROUPS: ContactTemplateGroup[] = [
  // ── 汎用 ─────────────────────────────────────────────────────
  {
    id: 'basic_staff',
    label: '基本運営体制',
    eventTypes: 'all',
    contacts: [
      { name: '主催者代表', role: '主催者代表' },
      { name: '副代表・サブリーダー', role: '副代表' },
      { name: '会場担当', role: '会場担当' },
      { name: '緊急連絡担当', role: '緊急連絡' },
    ],
  },
  {
    id: 'vendors',
    label: '外部業者',
    eventTypes: 'all',
    contacts: [
      { name: '会場担当者', role: '会場担当' },
      { name: '音響・映像業者', role: '音響・映像' },
      { name: '印刷・製作業者', role: '印刷・製作' },
      { name: '輸送・搬入業者', role: '輸送・搬入' },
    ],
  },

  // ── 企業・社内イベント ────────────────────────────────────────
  {
    id: 'party_staff',
    label: '懇親会スタッフ',
    eventTypes: ['corporate_party'],
    contacts: [
      { name: '司会進行', role: '司会進行' },
      { name: '受付担当', role: '受付' },
      { name: 'ケータリング担当', role: 'ケータリング' },
      { name: '撮影担当', role: '撮影' },
      { name: '余興担当', role: '余興' },
    ],
  },

  // ── 学校・教育イベント ────────────────────────────────────────
  {
    id: 'school_staff',
    label: '学校行事スタッフ',
    eventTypes: ['school_event'],
    contacts: [
      { name: '校長・責任者', role: '責任者' },
      { name: '担任・学年主任', role: '学年主任' },
      { name: '保護者対応担当', role: '保護者対応' },
      { name: '救護担当', role: '救護' },
      { name: '撮影・記録係', role: '撮影・記録' },
    ],
  },

  // ── 地域・自治体イベント ──────────────────────────────────────
  {
    id: 'festival_staff',
    label: '地域イベントスタッフ',
    eventTypes: ['community_festival'],
    contacts: [
      { name: '実行委員長', role: '実行委員長' },
      { name: 'ステージ担当', role: 'ステージ担当' },
      { name: '警備・誘導担当', role: '警備・誘導' },
      { name: '救護担当', role: '救護' },
      { name: '出店管理担当', role: '出店管理' },
      { name: '清掃担当', role: '清掃' },
    ],
  },

  // ── 商業施設イベント ──────────────────────────────────────────
  {
    id: 'commercial_staff',
    label: '商業施設イベントスタッフ',
    eventTypes: ['commercial_facility'],
    contacts: [
      { name: 'イベント統括', role: 'イベント統括' },
      { name: 'フロア担当', role: 'フロア担当' },
      { name: '整理券配布担当', role: '整理券配布' },
      { name: '誘導係', role: '誘導' },
      { name: '館内放送担当', role: '館内放送' },
    ],
  },

  // ── スポーツ・アウトドア ──────────────────────────────────────
  {
    id: 'sports_staff',
    label: 'スポーツ大会スタッフ',
    eventTypes: ['sports'],
    contacts: [
      { name: '大会委員長', role: '大会委員長' },
      { name: '審判長', role: '審判長' },
      { name: 'タイムキーパー', role: 'タイムキーパー' },
      { name: 'アナウンス担当', role: 'アナウンス' },
      { name: '救護担当', role: '救護' },
    ],
  },

  // ── 展示会・見本市 ────────────────────────────────────────────
  {
    id: 'exhibition_staff',
    label: '展示会スタッフ',
    eventTypes: ['exhibition'],
    contacts: [
      { name: '会場統括', role: '会場統括' },
      { name: '受付・登録担当', role: '受付・登録' },
      { name: 'ブース案内担当', role: 'ブース案内' },
      { name: 'プレス対応担当', role: 'プレス対応' },
      { name: '搬入・搬出担当', role: '搬入・搬出' },
    ],
  },
]

export function getContactTemplatesForEventType(eventType: string | null | undefined): ContactTemplateGroup[] {
  if (!eventType) return CONTACT_TEMPLATE_GROUPS.filter(g => g.eventTypes === 'all')
  return CONTACT_TEMPLATE_GROUPS.filter(
    g => g.eventTypes === 'all' || (g.eventTypes as string[]).includes(eventType)
  )
}
