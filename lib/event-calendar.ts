export type CalendarEvent = {
  name: string
  emoji: string
  timing: string
  idea: string
  featured?: boolean  // ピコトンPDFで太字表示されていた主要イベント
  event_type?: string // イベント新規作成フォームへの種別ヒント
}

export type MonthCalendar = {
  month: number        // 1-12
  label: string        // "1月"
  seasonColor: string  // Tailwind background class for season accent
  events: CalendarEvent[]
}

export const EVENT_CALENDAR: MonthCalendar[] = [
  {
    month: 1,
    label: '1月',
    seasonColor: 'bg-sky-50',
    events: [
      { name: 'お正月', emoji: '⛩️', timing: '1/1〜松の内', idea: 'おみくじ・運試し要素を取り入れたイベント', featured: true, event_type: 'community_festival' },
      { name: '書初め', emoji: '🖌️', timing: '1月上旬', idea: '毛筆体験、大きな書初め体験イベント', event_type: 'commercial_facility' },
      { name: '鏡開き', emoji: '🍡', timing: '1/11', idea: '鏡開きしたお餅の試食会', event_type: 'community_festival' },
      { name: '正月遊び', emoji: '🎲', timing: '1月中', idea: 'スゴロク・コマなど日本の伝統遊びイベント', event_type: 'commercial_facility' },
      { name: '成人式', emoji: '👘', timing: '1月第2月曜', idea: '晴れ着姿を残すフォトイベント', event_type: 'community_festival' },
      { name: '餅つき', emoji: '🔨', timing: '年末〜お正月', idea: '体験型の餅つきイベント', event_type: 'community_festival' },
    ],
  },
  {
    month: 2,
    label: '2月',
    seasonColor: 'bg-pink-50',
    events: [
      { name: '節分', emoji: '👹', timing: '立春の前日', idea: '鬼がモチーフの工作イベント', featured: true, event_type: 'commercial_facility' },
      { name: 'バレンタインデー', emoji: '💝', timing: '2/14', idea: 'お菓子がモチーフのワークショップ', featured: true, event_type: 'commercial_facility' },
      { name: '猫の日', emoji: '🐱', timing: '2/22', idea: '猫アイテムの体験・物販イベント', featured: true, event_type: 'commercial_facility' },
      { name: '建国記念日', emoji: '🗾', timing: '2/11', idea: '日本の成り立ちを楽しく学べるイベント', event_type: 'community_festival' },
    ],
  },
  {
    month: 3,
    label: '3月',
    seasonColor: 'bg-pink-50',
    events: [
      { name: 'ひな祭り', emoji: '🎎', timing: '3/3', idea: 'ひな人形モチーフの工作イベント', featured: true, event_type: 'commercial_facility' },
      { name: '国際女性の日', emoji: '🌼', timing: '3/8', idea: 'ミモザの花のリース作りワークショップ', event_type: 'commercial_facility' },
      { name: 'ホワイトデー', emoji: '🍪', timing: '3/14', idea: 'クッキングワークショップ', event_type: 'commercial_facility' },
      { name: '卒業式', emoji: '🎓', timing: '3月中旬〜下旬', idea: '卒業記念のフォトイベント・記念品', event_type: 'school_event' },
      { name: '春休み', emoji: '🌸', timing: '3月下旬〜', idea: '新学期に向けた子ども向けイベント', featured: true, event_type: 'commercial_facility' },
    ],
  },
  {
    month: 4,
    label: '4月',
    seasonColor: 'bg-green-50',
    events: [
      { name: 'お花見', emoji: '🌸', timing: '3月下旬〜4月上旬', idea: '桜モチーフのノベルティ配布・写真撮影コーナー', event_type: 'community_festival' },
      { name: '入学式・入園式', emoji: '🏫', timing: '4月上旬', idea: '新学期応援フェア・交通安全グッズイベント', featured: true, event_type: 'school_event' },
      { name: 'イースター', emoji: '🐣', timing: '3〜4月', idea: 'イースター仕様のフォトブース、エッグ工作イベント', featured: true, event_type: 'commercial_facility' },
      { name: '潮干狩り', emoji: '🦪', timing: '4月中旬〜', idea: 'ピクニック向けアイテムの体験イベント', event_type: 'sports' },
    ],
  },
  {
    month: 5,
    label: '5月',
    seasonColor: 'bg-green-50',
    events: [
      { name: 'ゴールデンウィーク', emoji: '🌿', timing: '4月末〜5月上旬', idea: '自然素材を使った工作イベント', featured: true, event_type: 'commercial_facility' },
      { name: 'こどもの日・鯉のぼり', emoji: '🎏', timing: '5/5', idea: '鯉のぼりモチーフの工作・折り紙ワークショップ', featured: true, event_type: 'community_festival' },
      { name: '母の日', emoji: '👩', timing: '5月第2日曜', idea: 'プレゼントが作れる花・工作ワークショップ', featured: true, event_type: 'commercial_facility' },
      { name: '八十八夜', emoji: '🍵', timing: '5月1〜2日頃', idea: '新茶の試飲会・お茶文化体験', event_type: 'community_festival' },
      { name: '運動会', emoji: '🏃', timing: '5月中', idea: '参加者が体を動かせる屋外イベント', event_type: 'sports' },
    ],
  },
  {
    month: 6,
    label: '6月',
    seasonColor: 'bg-blue-50',
    events: [
      { name: '梅雨', emoji: '☔', timing: '6月上旬〜7月下旬', idea: '室内でも楽しめる工作・体験イベント', featured: true, event_type: 'commercial_facility' },
      { name: '父の日', emoji: '👨', timing: '6月第3日曜', idea: '父の日プレゼントが作れる工作ワークショップ', featured: true, event_type: 'commercial_facility' },
      { name: 'てるてる坊主', emoji: '🌂', timing: '6月中', idea: 'てるてる坊主の工作・デコレーションイベント', featured: true, event_type: 'commercial_facility' },
      { name: '梅の日', emoji: '🫙', timing: '6/6', idea: '梅を使ったクッキングワークショップ', event_type: 'community_festival' },
      { name: 'ジューンブライド', emoji: '💍', timing: '6月中', idea: 'ウェディング関連のテーマイベント', event_type: 'commercial_facility' },
    ],
  },
  {
    month: 7,
    label: '7月',
    seasonColor: 'bg-cyan-50',
    events: [
      { name: '七夕', emoji: '🎋', timing: '7/7', idea: '星座・天体モチーフの工作ワークショップ', featured: true, event_type: 'community_festival' },
      { name: '夏休みスタート', emoji: '🏖️', timing: '7月上旬〜', idea: '光るおもちゃの工作・夏休み自由研究イベント', featured: true, event_type: 'commercial_facility' },
      { name: '納涼祭', emoji: '🏮', timing: '7〜8月', idea: '光るうちわの工作・縁日屋台イベント', featured: true, event_type: 'community_festival' },
      { name: '土用の丑の日', emoji: '🐍', timing: '7月下旬', idea: 'うなぎ料理の試食会', event_type: 'commercial_facility' },
      { name: 'そうめん', emoji: '🍜', timing: '7月中', idea: 'アレンジそうめんのクッキングワークショップ', event_type: 'commercial_facility' },
    ],
  },
  {
    month: 8,
    label: '8月',
    seasonColor: 'bg-yellow-50',
    events: [
      { name: '夏休み', emoji: '🌻', timing: '7月下旬〜8月中', idea: '夏の自由研究・宿題に役立つ体験イベント', featured: true, event_type: 'commercial_facility' },
      { name: '花火大会', emoji: '🎆', timing: '8月中', idea: '縁日の遊びを楽しめるイベント・フォトブース', featured: true, event_type: 'community_festival' },
      { name: '夏祭り', emoji: '🍧', timing: '8月中', idea: 'かき氷・スイカなど夏の風物詩体験イベント', featured: true, event_type: 'community_festival' },
      { name: 'バーベキュー', emoji: '🔥', timing: '8月中', idea: '野外クッキング体験イベント', event_type: 'sports' },
      { name: 'お盆', emoji: '🏡', timing: '8/15頃', idea: '地域の盆踊りや伝統文化体験イベント', event_type: 'community_festival' },
    ],
  },
  {
    month: 9,
    label: '9月',
    seasonColor: 'bg-amber-50',
    events: [
      { name: '防災の日', emoji: '🛡️', timing: '9/1', idea: '防災知識が楽しく学べるクイズ・スゴロクイベント', featured: true, event_type: 'community_festival' },
      { name: '敬老の日', emoji: '👴', timing: '9月第3月曜', idea: '敬老プレゼントが作れる工作ワークショップ', featured: true, event_type: 'community_festival' },
      { name: 'お月見（十五夜）', emoji: '🌕', timing: '旧暦8/15', idea: '月見団子の試食会・月をテーマにした工作', featured: true, event_type: 'community_festival' },
      { name: '金木犀', emoji: '🌼', timing: '9月中', idea: '金木犀のフラワーリース作りワークショップ', event_type: 'commercial_facility' },
      { name: '運動会・体育祭', emoji: '🏃', timing: '9月中', idea: '参加者が体を動かせる屋外イベント', event_type: 'sports' },
    ],
  },
  {
    month: 10,
    label: '10月',
    seasonColor: 'bg-orange-50',
    events: [
      { name: 'ハロウィン', emoji: '🎃', timing: '10/31', idea: 'ハロウィン工作・仮装フォトブースイベント', featured: true, event_type: 'commercial_facility' },
      { name: '世界食糧デー', emoji: '🌾', timing: '10/16', idea: 'エコクッキングを伝えるワークショップ', featured: true, event_type: 'community_festival' },
      { name: '読書週間', emoji: '📚', timing: '10/27〜11/9', idea: '本の読み聞かせイベント・ブックフェア', event_type: 'commercial_facility' },
      { name: '紅葉狩り', emoji: '🍂', timing: '9月下旬〜', idea: '押し花・落ち葉工作ワークショップ', event_type: 'commercial_facility' },
    ],
  },
  {
    month: 11,
    label: '11月',
    seasonColor: 'bg-orange-50',
    events: [
      { name: '七五三', emoji: '👘', timing: '11/15', idea: '晴れ着姿を残すフォトイベント', featured: true, event_type: 'community_festival' },
      { name: '折り紙の日', emoji: '📄', timing: '11/11', idea: '折り紙ワークショップ・工作体験', featured: true, event_type: 'commercial_facility' },
      { name: '文化の日', emoji: '🎨', timing: '11/3', idea: 'アートワークショップ・創作体験イベント', event_type: 'community_festival' },
      { name: '紅葉', emoji: '🍁', timing: '11〜12月', idea: '紅葉の押し花・クラフト工作イベント', event_type: 'commercial_facility' },
      { name: 'どんぐり', emoji: '🌰', timing: '10中〜11月', idea: 'どんぐりを使った工作イベント', event_type: 'commercial_facility' },
    ],
  },
  {
    month: 12,
    label: '12月',
    seasonColor: 'bg-blue-50',
    events: [
      { name: 'クリスマス', emoji: '🎄', timing: '12/25', idea: 'クリスマス工作・リース作りワークショップ', featured: true, event_type: 'commercial_facility' },
      { name: '大晦日', emoji: '🎊', timing: '12/31', idea: '年越しのご馳走・振る舞いイベント', featured: true, event_type: 'community_festival' },
      { name: '年賀状づくり', emoji: '✉️', timing: '12月中旬〜', idea: '手作り年賀状・スタンプワークショップ', event_type: 'commercial_facility' },
      { name: '大掃除', emoji: '🧹', timing: '12月中〜下旬', idea: '大掃除に役立つアイデアを紹介するイベント', event_type: 'community_festival' },
    ],
  },
]

/** 指定月のカレンダーデータを返す（1〜12） */
export function getMonthCalendar(month: number): MonthCalendar | undefined {
  return EVENT_CALENDAR.find(m => m.month === month)
}

/** 指定月の featured イベントだけ返す */
export function getFeaturedEvents(month: number): CalendarEvent[] {
  return getMonthCalendar(month)?.events.filter(e => e.featured) ?? []
}
