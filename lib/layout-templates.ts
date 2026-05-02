import type { CanvasState } from './layout-types'

export type LayoutTemplate = {
  id: string
  label: string
  description: string
  emoji: string
  state: CanvasState
}

// 前面ステージ型 — 講演会・式典・入学式
// Stage is at top (y=120-340). People sit behind tables facing UP toward stage.
// Chairs must be on the BACK side of each table (higher y = further from stage).
const stageLayout: CanvasState = {
  roomWidth: 2000,
  roomHeight: 1500,
  gridSize: 0,
  snapEnabled: true,
  items: [
    { id: 'st-screen', shape: 'rect', x: 600, y: 30, width: 800, height: 60, rotation: 0, label: 'スクリーン', color: '#cbd5e1', locked: false },
    { id: 'st-stage', shape: 'rect', x: 400, y: 120, width: 1200, height: 220, rotation: 0, label: 'ステージ', color: '#86efac', locked: false },
    { id: 'st-podium', shape: 'rect', x: 940, y: 360, width: 120, height: 100, rotation: 0, label: '演台', color: '#6ee7b7', locked: false },
    // table row 1 (y=530-610) — chairs BELOW table at y=620
    { id: 'st-t1l', shape: 'rect', x: 100, y: 530, width: 750, height: 80, rotation: 0, label: '長テーブル', color: '#fde68a', locked: false },
    { id: 'st-c1',  shape: 'rect', x: 150,  y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c2',  shape: 'rect', x: 280,  y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c3',  shape: 'rect', x: 410,  y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c4',  shape: 'rect', x: 540,  y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c5',  shape: 'rect', x: 670,  y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-t1r', shape: 'rect', x: 1150, y: 530, width: 750, height: 80, rotation: 0, label: '長テーブル', color: '#fde68a', locked: false },
    { id: 'st-c6',  shape: 'rect', x: 1200, y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c7',  shape: 'rect', x: 1330, y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c8',  shape: 'rect', x: 1460, y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c9',  shape: 'rect', x: 1590, y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c10', shape: 'rect', x: 1720, y: 620, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    // table row 2 (y=760-840) — chairs BELOW at y=850
    { id: 'st-t2l', shape: 'rect', x: 100, y: 760, width: 750, height: 80, rotation: 0, label: '長テーブル', color: '#fde68a', locked: false },
    { id: 'st-c11', shape: 'rect', x: 150,  y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c12', shape: 'rect', x: 280,  y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c13', shape: 'rect', x: 410,  y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c14', shape: 'rect', x: 540,  y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c15', shape: 'rect', x: 670,  y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-t2r', shape: 'rect', x: 1150, y: 760, width: 750, height: 80, rotation: 0, label: '長テーブル', color: '#fde68a', locked: false },
    { id: 'st-c16', shape: 'rect', x: 1200, y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c17', shape: 'rect', x: 1330, y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c18', shape: 'rect', x: 1460, y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c19', shape: 'rect', x: 1590, y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c20', shape: 'rect', x: 1720, y: 850, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    // table row 3 (y=990-1070) — chairs BELOW at y=1080
    { id: 'st-t3l', shape: 'rect', x: 100, y: 990, width: 750, height: 80, rotation: 0, label: '長テーブル', color: '#fde68a', locked: false },
    { id: 'st-c21', shape: 'rect', x: 150,  y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c22', shape: 'rect', x: 280,  y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c23', shape: 'rect', x: 410,  y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c24', shape: 'rect', x: 540,  y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c25', shape: 'rect', x: 670,  y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-t3r', shape: 'rect', x: 1150, y: 990, width: 750, height: 80, rotation: 0, label: '長テーブル', color: '#fde68a', locked: false },
    { id: 'st-c26', shape: 'rect', x: 1200, y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c27', shape: 'rect', x: 1330, y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c28', shape: 'rect', x: 1460, y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c29', shape: 'rect', x: 1590, y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'st-c30', shape: 'rect', x: 1720, y: 1080, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    // reception & entrance
    { id: 'st-recept',  shape: 'rect', x: 50,  y: 1370, width: 300, height: 80, rotation: 0, label: '受付', color: '#c4b5fd', locked: false },
    { id: 'st-entrance', shape: 'rect', x: 850, y: 1400, width: 300, height: 70, rotation: 0, label: '入口', color: '#fca5a5', locked: false },
  ],
}

// ロの字型 — 会議・研修・ワークショップ
// Tables form a perimeter rectangle. People sit on the OUTSIDE of each side, facing inward.
// Top table (y=320-400): chairs above at y=250 (OUTSIDE = north of table)
// Bottom table (y=1020-1100): chairs below at y=1110 (OUTSIDE = south of table)
// Left table (x=350-430): chairs left at x=280 (OUTSIDE = west of table)
// Right table (x=1570-1650): chairs right at x=1660 (OUTSIDE = east of table)
const uShapeLayout: CanvasState = {
  roomWidth: 2000,
  roomHeight: 1500,
  gridSize: 0,
  snapEnabled: true,
  items: [
    { id: 'u-wb', shape: 'rect', x: 700, y: 100, width: 600, height: 70, rotation: 0, label: 'ホワイトボード', color: '#cbd5e1', locked: false },
    // table perimeter
    { id: 'u-ttop',  shape: 'rect', x: 350, y: 320,  width: 1300, height: 80, rotation: 0, label: 'テーブル', color: '#fde68a', locked: false },
    { id: 'u-tbot',  shape: 'rect', x: 350, y: 1020, width: 1300, height: 80, rotation: 0, label: 'テーブル', color: '#fde68a', locked: false },
    { id: 'u-tleft', shape: 'rect', x: 350, y: 400,  width: 80,   height: 620, rotation: 0, label: 'テーブル', color: '#fde68a', locked: false },
    { id: 'u-tright',shape: 'rect', x: 1570,y: 400,  width: 80,   height: 620, rotation: 0, label: 'テーブル', color: '#fde68a', locked: false },
    // chairs — top table, OUTSIDE (above, y=250)
    { id: 'u-c1', shape: 'rect', x: 440,  y: 250, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c2', shape: 'rect', x: 600,  y: 250, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c3', shape: 'rect', x: 760,  y: 250, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c4', shape: 'rect', x: 920,  y: 250, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c5', shape: 'rect', x: 1080, y: 250, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c6', shape: 'rect', x: 1240, y: 250, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c7', shape: 'rect', x: 1400, y: 250, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    // chairs — bottom table, OUTSIDE (below, y=1110)
    { id: 'u-c8',  shape: 'rect', x: 440,  y: 1110, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c9',  shape: 'rect', x: 600,  y: 1110, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c10', shape: 'rect', x: 760,  y: 1110, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c11', shape: 'rect', x: 920,  y: 1110, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c12', shape: 'rect', x: 1080, y: 1110, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c13', shape: 'rect', x: 1240, y: 1110, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c14', shape: 'rect', x: 1400, y: 1110, width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    // chairs — left table, OUTSIDE (to the left, x=280)
    { id: 'u-c15', shape: 'rect', x: 280, y: 450,  width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c16', shape: 'rect', x: 280, y: 600,  width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c17', shape: 'rect', x: 280, y: 750,  width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c18', shape: 'rect', x: 280, y: 900,  width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    // chairs — right table, OUTSIDE (to the right, x=1660)
    { id: 'u-c19', shape: 'rect', x: 1660, y: 450,  width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c20', shape: 'rect', x: 1660, y: 600,  width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c21', shape: 'rect', x: 1660, y: 750,  width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    { id: 'u-c22', shape: 'rect', x: 1660, y: 900,  width: 60, height: 60, rotation: 0, label: '椅子', color: '#93c5fd', locked: false },
    // projector & entrance
    { id: 'u-proj',    shape: 'rect', x: 940, y: 660,  width: 120, height: 80, rotation: 0, label: 'プロジェクター', color: '#e2e8f0', locked: false },
    { id: 'u-entrance',shape: 'rect', x: 850, y: 1380, width: 300, height: 70, rotation: 0, label: '入口', color: '#fca5a5', locked: false },
  ],
}

// 立食パーティー型 — 懇親会・歓迎会・謝恩会
const standingPartyLayout: CanvasState = {
  roomWidth: 2000,
  roomHeight: 1500,
  gridSize: 0,
  snapEnabled: true,
  items: [
    { id: 'sp-stage', shape: 'rect', x: 600, y: 80, width: 800, height: 160, rotation: 0, label: 'ステージ', color: '#86efac', locked: false },
    { id: 'sp-mic',   shape: 'rect', x: 960, y: 260, width: 80,  height: 80,  rotation: 0, label: 'マイク台', color: '#6ee7b7', locked: false },
    { id: 'sp-bar',   shape: 'rect', x: 1820,y: 200, width: 120, height: 900, rotation: 0, label: 'バーカウンター', color: '#c4b5fd', locked: false },
    // round tables
    { id: 'sp-rt1', shape: 'circle', x: 225,  y: 425, width: 150, height: 150, rotation: 0, label: '丸テーブル', color: '#fde68a', locked: false },
    { id: 'sp-rt2', shape: 'circle', x: 675,  y: 425, width: 150, height: 150, rotation: 0, label: '丸テーブル', color: '#fde68a', locked: false },
    { id: 'sp-rt3', shape: 'circle', x: 1125, y: 425, width: 150, height: 150, rotation: 0, label: '丸テーブル', color: '#fde68a', locked: false },
    { id: 'sp-rt4', shape: 'circle', x: 225,  y: 925, width: 150, height: 150, rotation: 0, label: '丸テーブル', color: '#fde68a', locked: false },
    { id: 'sp-rt5', shape: 'circle', x: 675,  y: 925, width: 150, height: 150, rotation: 0, label: '丸テーブル', color: '#fde68a', locked: false },
    { id: 'sp-rt6', shape: 'circle', x: 1125, y: 925, width: 150, height: 150, rotation: 0, label: '丸テーブル', color: '#fde68a', locked: false },
    { id: 'sp-food',    shape: 'rect', x: 1550, y: 1150, width: 350, height: 120, rotation: 0, label: 'フード・ドリンク', color: '#fed7aa', locked: false },
    { id: 'sp-recept',  shape: 'rect', x: 50,   y: 1360, width: 300, height: 80,  rotation: 0, label: '受付', color: '#c4b5fd', locked: false },
    { id: 'sp-entrance',shape: 'rect', x: 850,  y: 1400, width: 300, height: 70,  rotation: 0, label: '入口', color: '#fca5a5', locked: false },
  ],
}

// 展示ブース型 — 文化祭・展示会・マルシェ
const exhibitionBoothLayout: CanvasState = {
  roomWidth: 2000,
  roomHeight: 1500,
  gridSize: 0,
  snapEnabled: true,
  items: [
    { id: 'ex-ba', shape: 'rect', x: 50,   y: 50,   width: 430, height: 200, rotation: 0, label: 'ブースA', color: '#fde68a', locked: false },
    { id: 'ex-bb', shape: 'rect', x: 530,  y: 50,   width: 430, height: 200, rotation: 0, label: 'ブースB', color: '#c4b5fd', locked: false },
    { id: 'ex-bc', shape: 'rect', x: 1010, y: 50,   width: 430, height: 200, rotation: 0, label: 'ブースC', color: '#86efac', locked: false },
    { id: 'ex-bd', shape: 'rect', x: 1490, y: 50,   width: 430, height: 200, rotation: 0, label: 'ブースD', color: '#93c5fd', locked: false },
    { id: 'ex-be', shape: 'rect', x: 50,   y: 1250, width: 430, height: 200, rotation: 0, label: 'ブースE', color: '#fde68a', locked: false },
    { id: 'ex-bf', shape: 'rect', x: 530,  y: 1250, width: 430, height: 200, rotation: 0, label: 'ブースF', color: '#c4b5fd', locked: false },
    { id: 'ex-bg', shape: 'rect', x: 1010, y: 1250, width: 430, height: 200, rotation: 0, label: 'ブースG', color: '#86efac', locked: false },
    { id: 'ex-bh', shape: 'rect', x: 1490, y: 1250, width: 430, height: 200, rotation: 0, label: 'ブースH', color: '#93c5fd', locked: false },
    { id: 'ex-bi', shape: 'rect', x: 50,   y: 380,  width: 200, height: 300, rotation: 0, label: 'ブースI', color: '#fed7aa', locked: false },
    { id: 'ex-bj', shape: 'rect', x: 50,   y: 780,  width: 200, height: 300, rotation: 0, label: 'ブースJ', color: '#fed7aa', locked: false },
    { id: 'ex-bk', shape: 'rect', x: 1750, y: 380,  width: 200, height: 300, rotation: 0, label: 'ブースK', color: '#fed7aa', locked: false },
    { id: 'ex-bl', shape: 'rect', x: 1750, y: 780,  width: 200, height: 300, rotation: 0, label: 'ブースL', color: '#fed7aa', locked: false },
    { id: 'ex-info',    shape: 'rect', x: 850,  y: 680,  width: 300, height: 100, rotation: 0, label: 'インフォメーション', color: '#e2e8f0', locked: false },
    { id: 'ex-recept',  shape: 'rect', x: 50,   y: 1420, width: 300, height: 60,  rotation: 0, label: '受付', color: '#c4b5fd', locked: false },
    { id: 'ex-entrance',shape: 'rect', x: 850,  y: 1430, width: 300, height: 50,  rotation: 0, label: '入口', color: '#fca5a5', locked: false },
  ],
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'stage',
    label: '前面ステージ型',
    description: '講演会・式典・入学式。前方ステージに向けて長テーブルを配置。',
    emoji: '🎤',
    state: stageLayout,
  },
  {
    id: 'ushape',
    label: 'ロの字型',
    description: '会議・研修・ワークショップ。全員が向き合えるスクエア配置。',
    emoji: '🟥',
    state: uShapeLayout,
  },
  {
    id: 'party',
    label: '立食パーティー型',
    description: '懇親会・歓迎会・謝恩会。丸テーブルを散らした自由な動線。',
    emoji: '🥂',
    state: standingPartyLayout,
  },
  {
    id: 'exhibition',
    label: '展示ブース型',
    description: '文化祭・展示会・マルシェ。壁沿いと中央にブースを配置。',
    emoji: '🏪',
    state: exhibitionBoothLayout,
  },
]
