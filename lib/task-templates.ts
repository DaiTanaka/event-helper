export type TemplateTask = {
  id: string
  title: string
  categoryId: string
  priority: 'high' | 'medium' | 'low'
  startDays: number | null
  dueDays: number | null
}

export type TemplateCategory = {
  id: string
  label: string
  color: string
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'planning',  label: '企画・立案',         color: 'bg-purple-100 text-purple-700' },
  { id: 'venue',     label: '会場・設備',         color: 'bg-blue-100 text-blue-700' },
  { id: 'design',    label: '広告・デザイン',     color: 'bg-pink-100 text-pink-700' },
  { id: 'pr',        label: '集客・PR',           color: 'bg-orange-100 text-orange-700' },
  { id: 'staff',     label: 'スタッフ・人員',     color: 'bg-teal-100 text-teal-700' },
  { id: 'program',   label: 'コンテンツ・プログラム', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'equip',     label: '備品・資材',         color: 'bg-yellow-100 text-yellow-700' },
  { id: 'ops',       label: '受付・当日運営',     color: 'bg-green-100 text-green-700' },
  { id: 'post',      label: '事後処理',           color: 'bg-slate-100 text-slate-600' },
]

export const TEMPLATE_TASKS: TemplateTask[] = [
  // 企画・立案
  { id: 'plan-kickoff',   title: 'キックオフミーティング',       categoryId: 'planning', priority: 'high',   startDays: -90, dueDays: -90 },
  { id: 'plan-concept',   title: 'イベントコンセプト・テーマ決定', categoryId: 'planning', priority: 'high',   startDays: -90, dueDays: -75 },
  { id: 'plan-budget',    title: '予算計画・承認',               categoryId: 'planning', priority: 'high',   startDays: -90, dueDays: -60 },
  { id: 'plan-doc',       title: '企画書作成',                   categoryId: 'planning', priority: 'medium', startDays: -90, dueDays: -60 },
  { id: 'plan-schedule',  title: '全体スケジュール策定',         categoryId: 'planning', priority: 'high',   startDays: -90, dueDays: -60 },
  { id: 'plan-vendor',    title: '外部委託先・業者選定',         categoryId: 'planning', priority: 'medium', startDays: -75, dueDays: -45 },

  // 会場・設備
  { id: 'venue-search',       title: '会場候補のリストアップ',         categoryId: 'venue', priority: 'medium', startDays: -90, dueDays: -75 },
  { id: 'venue-visit',        title: '会場の下見',                     categoryId: 'venue', priority: 'medium', startDays: -75, dueDays: -60 },
  { id: 'venue-book',         title: '会場の予約・契約',               categoryId: 'venue', priority: 'high',   startDays: -75, dueDays: -60 },
  { id: 'venue-pa',           title: '音響・映像機材の確認・手配',     categoryId: 'venue', priority: 'medium', startDays: -45, dueDays: -21 },
  { id: 'venue-layout',       title: '会場レイアウト計画',             categoryId: 'venue', priority: 'medium', startDays: -30, dueDays: -14 },
  { id: 'venue-equip-check',  title: '会場設備の最終確認',             categoryId: 'venue', priority: 'medium', startDays: -14, dueDays: -7  },
  { id: 'venue-final',        title: '会場最終確認（前日）',           categoryId: 'venue', priority: 'high',   startDays: -1,  dueDays: -1  },

  // 広告・デザイン
  { id: 'design-concept',  title: 'ビジュアルコンセプト立案',       categoryId: 'design', priority: 'medium', startDays: -60, dueDays: -45 },
  { id: 'design-flyer',    title: '広告デザイン（チラシ）',         categoryId: 'design', priority: 'medium', startDays: -45, dueDays: -30 },
  { id: 'design-poster',   title: '広告デザイン（ポスター）',       categoryId: 'design', priority: 'medium', startDays: -45, dueDays: -30 },
  { id: 'design-sns',      title: 'SNS用バナー画像作成',           categoryId: 'design', priority: 'medium', startDays: -30, dueDays: -21 },
  { id: 'design-check',    title: 'デザイン確認',                   categoryId: 'design', priority: 'high',   startDays: -30, dueDays: -21 },
  { id: 'design-fix',      title: 'デザイン修正',                   categoryId: 'design', priority: 'medium', startDays: -21, dueDays: -14 },
  { id: 'design-sign',     title: '看板・サイン制作',               categoryId: 'design', priority: 'medium', startDays: -21, dueDays: -10 },
  { id: 'design-print-f',  title: 'チラシ印刷',                     categoryId: 'design', priority: 'high',   startDays: -14, dueDays: -7  },
  { id: 'design-print-p',  title: 'ポスター印刷',                   categoryId: 'design', priority: 'high',   startDays: -14, dueDays: -7  },
  { id: 'design-web',      title: 'イベントWebページ作成・公開',   categoryId: 'design', priority: 'high',   startDays: -45, dueDays: -30 },
  { id: 'design-deco',     title: '会場装飾デザイン・制作',         categoryId: 'design', priority: 'medium', startDays: -30, dueDays: -14 },

  // 集客・PR
  { id: 'pr-guide',   title: '募集要項・参加案内の作成',       categoryId: 'pr', priority: 'high',   startDays: -60, dueDays: -45 },
  { id: 'pr-form',    title: '申込フォーム作成',               categoryId: 'pr', priority: 'high',   startDays: -45, dueDays: -30 },
  { id: 'pr-start',   title: '参加者募集開始',                 categoryId: 'pr', priority: 'high',   startDays: -30, dueDays: -30 },
  { id: 'pr-sns1',    title: 'SNS告知投稿（第1弾）',          categoryId: 'pr', priority: 'medium', startDays: -30, dueDays: -30 },
  { id: 'pr-sns2',    title: 'SNS告知投稿（第2弾）',          categoryId: 'pr', priority: 'medium', startDays: -14, dueDays: -14 },
  { id: 'pr-sns3',    title: 'SNS告知投稿（直前）',           categoryId: 'pr', priority: 'medium', startDays: -3,  dueDays: -3  },
  { id: 'pr-press',   title: 'プレスリリース作成・配信',       categoryId: 'pr', priority: 'medium', startDays: -30, dueDays: -21 },
  { id: 'pr-mail',    title: 'メールマガジン・DM配信',         categoryId: 'pr', priority: 'medium', startDays: -14, dueDays: -14 },
  { id: 'pr-list',    title: '参加者リスト最終確定',           categoryId: 'pr', priority: 'high',   startDays: -7,  dueDays: -3  },

  // スタッフ・人員
  { id: 'staff-roles',    title: 'スタッフ役割分担表作成',   categoryId: 'staff', priority: 'medium', startDays: -60, dueDays: -45 },
  { id: 'staff-recruit',  title: 'スタッフ募集・選定',       categoryId: 'staff', priority: 'medium', startDays: -60, dueDays: -45 },
  { id: 'staff-manual',   title: 'スタッフ運営マニュアル作成', categoryId: 'staff', priority: 'medium', startDays: -21, dueDays: -14 },
  { id: 'staff-meeting',  title: 'スタッフ事前ミーティング', categoryId: 'staff', priority: 'high',   startDays: -10, dueDays: -7  },
  { id: 'staff-contact',  title: '緊急連絡網の整備',         categoryId: 'staff', priority: 'high',   startDays: -7,  dueDays: -3  },
  { id: 'staff-assign',   title: '当日スタッフ配置最終確認', categoryId: 'staff', priority: 'high',   startDays: -3,  dueDays: -1  },

  // コンテンツ・プログラム
  { id: 'prog-plan',        title: 'プログラム構成の企画',         categoryId: 'program', priority: 'high',   startDays: -60, dueDays: -45 },
  { id: 'prog-speaker',     title: '出演者・講師へのオファー',     categoryId: 'program', priority: 'high',   startDays: -60, dueDays: -45 },
  { id: 'prog-info',        title: '出演者情報・プロフィール収集', categoryId: 'program', priority: 'medium', startDays: -30, dueDays: -21 },
  { id: 'prog-script',      title: '進行台本の作成',               categoryId: 'program', priority: 'high',   startDays: -21, dueDays: -14 },
  { id: 'prog-script-fix',  title: '進行台本の確認・修正',         categoryId: 'program', priority: 'medium', startDays: -14, dueDays: -7  },
  { id: 'prog-rehearsal',   title: 'リハーサルの実施',             categoryId: 'program', priority: 'high',   startDays: -7,  dueDays: -3  },
  { id: 'prog-final',       title: '当日進行マニュアル最終確認',   categoryId: 'program', priority: 'high',   startDays: -3,  dueDays: -1  },

  // 備品・資材
  { id: 'equip-list',   title: '備品・消耗品リスト作成',       categoryId: 'equip', priority: 'medium', startDays: -45, dueDays: -30 },
  { id: 'equip-order',  title: '備品・資材の発注',             categoryId: 'equip', priority: 'high',   startDays: -30, dueDays: -21 },
  { id: 'equip-print',  title: '印刷物（当日配布物）の発注',   categoryId: 'equip', priority: 'high',   startDays: -14, dueDays: -7  },
  { id: 'equip-check',  title: '備品の搬入・最終確認',         categoryId: 'equip', priority: 'medium', startDays: -1,  dueDays: 0   },

  // 受付・当日運営
  { id: 'ops-list',      title: '受付リスト・名簿の作成',     categoryId: 'ops', priority: 'medium', startDays: -14, dueDays: -7  },
  { id: 'ops-badge',     title: '名札・バッジの準備',         categoryId: 'ops', priority: 'medium', startDays: -7,  dueDays: -3  },
  { id: 'ops-flow',      title: '当日の動線・配置計画',       categoryId: 'ops', priority: 'medium', startDays: -14, dueDays: -7  },
  { id: 'ops-setup',     title: '会場設営',                   categoryId: 'ops', priority: 'high',   startDays: 0,   dueDays: 0   },
  { id: 'ops-teardown',  title: '撤収・清掃',                 categoryId: 'ops', priority: 'medium', startDays: 0,   dueDays: 1   },

  // 事後処理
  { id: 'post-thanks',    title: 'お礼状・感謝メール送付',   categoryId: 'post', priority: 'medium', startDays: 1,  dueDays: 3  },
  { id: 'post-survey',    title: 'アンケートの回収・集計',   categoryId: 'post', priority: 'low',    startDays: 1,  dueDays: 7  },
  { id: 'post-analysis',  title: 'アンケート分析',           categoryId: 'post', priority: 'low',    startDays: 3,  dueDays: 10 },
  { id: 'post-expense',   title: '経費精算',                 categoryId: 'post', priority: 'medium', startDays: 1,  dueDays: 7  },
  { id: 'post-photo',     title: '写真・動画の整理',         categoryId: 'post', priority: 'low',    startDays: 1,  dueDays: 14 },
  { id: 'post-review',    title: '振り返りミーティング',     categoryId: 'post', priority: 'medium', startDays: 7,  dueDays: 7  },
  { id: 'post-report',    title: '報告書作成',               categoryId: 'post', priority: 'low',    startDays: 7,  dueDays: 14 },
]

export function dueDaysLabel(days: number | null): string {
  if (days === null) return ''
  if (days === 0) return '当日'
  if (days > 0) return `D+${days}`
  return `D${days}`
}
