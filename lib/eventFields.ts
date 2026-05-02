export const EVENT_TYPES = [
  { value: 'corporate_party',     label: '企業・社内イベント' },
  { value: 'school_event',        label: '学校・教育イベント' },
  { value: 'community_festival',  label: '地域・自治体イベント' },
  { value: 'commercial_facility', label: '商業施設イベント' },
  { value: 'sports',              label: 'スポーツ・アウトドア' },
  { value: 'exhibition',          label: '展示会・見本市' },
  { value: 'other',               label: 'その他' },
] as const

export const TARGET_AGES = [
  // 子ども
  { value: 'infant',     label: '乳幼児（〜2歳）',           group: 'children' },
  { value: 'preschool',  label: '未就学児（3〜6歳）',        group: 'children' },
  { value: 'elem_lower', label: '小学生 低学年（7〜9歳）',   group: 'children' },
  { value: 'elem_upper', label: '小学生 高学年（10〜12歳）', group: 'children' },
  { value: 'teen',       label: '中高生（13〜18歳）',        group: 'children' },
  // 大人
  { value: 'f1_m1',      label: 'F1・M1（20〜34歳）',       group: 'adults' },
  { value: 'f2_m2',      label: 'F2・M2（35〜49歳）',       group: 'adults' },
  { value: 'f3_m3',      label: 'F3・M3（50〜64歳）',       group: 'adults' },
  { value: 'seniors',    label: 'シニア（65歳以上）',        group: 'adults' },
] as const

export const VENUE_TYPES = [
  { value: 'indoor',  label: '屋内' },
  { value: 'outdoor', label: '屋外' },
  { value: 'hybrid',  label: '屋内・屋外ミックス' },
] as const

export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
] as const

export const CANCEL_REASONS = [
  { value: 'budget',          label: '予算超過' },
  { value: 'schedule',        label: 'スケジュール調整不可' },
  { value: 'not_fit',         label: '内容が合わない' },
  { value: 'vendor_changed',  label: '他ベンダーに変更' },
  { value: 'event_cancelled', label: 'イベント自体の中止' },
  { value: 'other',           label: 'その他' },
] as const
