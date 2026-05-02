export type TimetableRow = {
  id: string
  type: '' | '設営' | '開催' | '撤収'
  start: string
  end: string
  content: string
  location: string
}

export type TimetableTemplate = {
  id: string
  label: string
  description: string
  emoji: string
  eventTypes?: string[]
  rows: TimetableRow[]
}

export const TIMETABLE_TEMPLATES: TimetableTemplate[] = [
  {
    id: 'party',
    label: '社内懇親会',
    description: '歓迎会・忘年会・送別会など。夕方開催を想定。',
    emoji: '🥂',
    eventTypes: ['corporate_party'],
    rows: [
      { id: 'p1', type: '設営', start: '16:00', end: '17:00', content: '会場設営・テーブル配置', location: '宴会場' },
      { id: 'p2', type: '設営', start: '17:00', end: '18:00', content: 'ケータリング搬入・食卓セッティング', location: '宴会場' },
      { id: 'p3', type: '開催', start: '18:00', end: '18:10', content: '開会・司会紹介', location: '宴会場' },
      { id: 'p4', type: '開催', start: '18:10', end: '18:20', content: '代表挨拶', location: '宴会場' },
      { id: 'p5', type: '開催', start: '18:20', end: '18:25', content: '乾杯', location: '宴会場' },
      { id: 'p6', type: '開催', start: '18:25', end: '19:30', content: '歓談・食事', location: '宴会場' },
      { id: 'p7', type: '開催', start: '19:30', end: '19:50', content: '余興・ゲーム', location: '宴会場' },
      { id: 'p8', type: '開催', start: '19:50', end: '20:00', content: '閉会挨拶・記念撮影', location: '宴会場' },
      { id: 'p9', type: '撤収', start: '20:00', end: '20:30', content: '片付け・撤収', location: '宴会場' },
    ],
  },
  {
    id: 'seminar',
    label: 'セミナー・講演会',
    description: '1日開催のセミナー・カンファレンスを想定。',
    emoji: '📅',
    eventTypes: ['corporate_party', 'school_event', 'exhibition'],
    rows: [
      { id: 's1', type: '設営', start: '08:30', end: '09:30', content: '会場設営・資料配布準備', location: '会議室' },
      { id: 's2', type: '設営', start: '09:30', end: '09:55', content: '受付準備・AV機器テスト', location: '受付' },
      { id: 's3', type: '開催', start: '10:00', end: '10:10', content: '開会・主催者挨拶', location: '会議室' },
      { id: 's4', type: '開催', start: '10:10', end: '11:40', content: '第1部 基調講演', location: '会議室' },
      { id: 's5', type: '開催', start: '11:40', end: '12:00', content: '質疑応答', location: '会議室' },
      { id: 's6', type: '開催', start: '12:00', end: '13:00', content: '昼食休憩', location: 'ロビー' },
      { id: 's7', type: '開催', start: '13:00', end: '14:30', content: '第2部 パネルディスカッション', location: '会議室' },
      { id: 's8', type: '開催', start: '14:30', end: '14:45', content: '休憩', location: 'ロビー' },
      { id: 's9', type: '開催', start: '14:45', end: '15:45', content: '第3部 ワークショップ', location: '会議室' },
      { id: 's10', type: '開催', start: '15:45', end: '16:00', content: '閉会・アンケート記入', location: '会議室' },
      { id: 's11', type: '撤収', start: '16:00', end: '17:00', content: '会場片付け・撤収', location: '会議室' },
    ],
  },
  {
    id: 'festival',
    label: '学校文化祭',
    description: '文化祭・学園祭の1日スケジュール。',
    emoji: '🏫',
    eventTypes: ['school_event'],
    rows: [
      { id: 'f1', type: '設営', start: '08:00', end: '09:00', content: '一般開放前準備・最終確認', location: '各会場' },
      { id: 'f2', type: '開催', start: '09:00', end: '09:30', content: '開会式・全体アナウンス', location: '体育館' },
      { id: 'f3', type: '開催', start: '09:30', end: '12:00', content: '展示・体験コーナー一般開放', location: '各クラス・廊下' },
      { id: 'f4', type: '開催', start: '12:00', end: '13:00', content: '昼食休憩・模擬店', location: '校庭' },
      { id: 'f5', type: '開催', start: '13:00', end: '14:30', content: 'ステージ発表', location: '体育館' },
      { id: 'f6', type: '開催', start: '14:30', end: '15:30', content: '後夜祭・有志パフォーマンス', location: '体育館' },
      { id: 'f7', type: '開催', start: '15:30', end: '15:45', content: '閉会式', location: '体育館' },
      { id: 'f8', type: '撤収', start: '15:45', end: '17:30', content: '片付け・清掃', location: '各会場' },
    ],
  },
  {
    id: 'community',
    label: '地域フェスティバル',
    description: '地域祭り・マルシェ・野外イベントを想定。',
    emoji: '🏮',
    eventTypes: ['community_festival', 'commercial_facility'],
    rows: [
      { id: 'com1', type: '設営', start: '07:00', end: '09:00', content: '会場設営・テント設置', location: '会場全体' },
      { id: 'com2', type: '設営', start: '09:00', end: '09:30', content: '出店者受付・ブース割り当て', location: '受付' },
      { id: 'com3', type: '開催', start: '10:00', end: '10:15', content: '開会式・主催者挨拶', location: 'メインステージ' },
      { id: 'com4', type: '開催', start: '10:15', end: '12:00', content: '午前の部（出店・体験コーナー）', location: '会場全体' },
      { id: 'com5', type: '開催', start: '12:00', end: '13:00', content: '昼食・休憩（模擬店営業）', location: '飲食エリア' },
      { id: 'com6', type: '開催', start: '13:00', end: '15:30', content: '午後の部（ステージイベント・体験）', location: '会場全体' },
      { id: 'com7', type: '開催', start: '15:30', end: '16:00', content: '抽選会・表彰・閉会式', location: 'メインステージ' },
      { id: 'com8', type: '撤収', start: '16:00', end: '18:00', content: '片付け・撤収・清掃', location: '会場全体' },
    ],
  },
  {
    id: 'sports',
    label: 'スポーツ大会',
    description: '競技会・運動会・トーナメント大会を想定。',
    emoji: '🏆',
    eventTypes: ['sports'],
    rows: [
      { id: 'sp1', type: '設営', start: '07:30', end: '09:00', content: '会場設営・コース準備', location: '競技エリア' },
      { id: 'sp2', type: '設営', start: '09:00', end: '09:30', content: '受付・選手登録', location: '受付' },
      { id: 'sp3', type: '開催', start: '09:30', end: '09:45', content: '開会式・準備体操', location: 'メイン会場' },
      { id: 'sp4', type: '開催', start: '09:45', end: '12:00', content: '午前の部（予選・第1ラウンド）', location: '競技エリア' },
      { id: 'sp5', type: '開催', start: '12:00', end: '13:00', content: '昼食休憩', location: '休憩エリア' },
      { id: 'sp6', type: '開催', start: '13:00', end: '15:30', content: '午後の部（決勝・表彰レース）', location: '競技エリア' },
      { id: 'sp7', type: '開催', start: '15:30', end: '16:00', content: '表彰式・閉会式', location: 'メイン会場' },
      { id: 'sp8', type: '撤収', start: '16:00', end: '17:30', content: '会場片付け・器材収納', location: '競技エリア' },
    ],
  },
  {
    id: 'exhibition',
    label: '展示会・見本市',
    description: 'B2Bの展示会・発表会・見本市を想定。',
    emoji: '🏢',
    eventTypes: ['exhibition'],
    rows: [
      { id: 'ex1', type: '設営', start: '07:00', end: '09:30', content: '出展者搬入・ブース設営', location: '展示ホール' },
      { id: 'ex2', type: '設営', start: '09:30', end: '09:55', content: '受付準備・スタッフ配置確認', location: '受付' },
      { id: 'ex3', type: '開催', start: '10:00', end: '10:20', content: '開会式・主催者挨拶', location: 'メインステージ' },
      { id: 'ex4', type: '開催', start: '10:20', end: '12:00', content: '午前 展示・来場者受付', location: '展示ホール' },
      { id: 'ex5', type: '開催', start: '12:00', end: '13:00', content: '昼食休憩（出展社・スタッフ交代）', location: '休憩室' },
      { id: 'ex6', type: '開催', start: '13:00', end: '17:00', content: '午後 展示・商談・デモ', location: '展示ホール' },
      { id: 'ex7', type: '開催', start: '17:00', end: '17:30', content: '閉会・来場者退場', location: '展示ホール' },
      { id: 'ex8', type: '撤収', start: '17:30', end: '19:30', content: '出展者撤収・搬出', location: '展示ホール' },
    ],
  },
]

export function getTemplatesForEventType(eventType: string | null | undefined): TimetableTemplate[] {
  if (!eventType) return TIMETABLE_TEMPLATES
  const matched = TIMETABLE_TEMPLATES.filter(
    t => !t.eventTypes || t.eventTypes.includes(eventType)
  )
  return matched.length > 0 ? matched : TIMETABLE_TEMPLATES
}
