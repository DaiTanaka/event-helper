import Link from 'next/link'

type FileType = 'pdf' | 'pptx' | 'xlsx'
type DownloadItem = { name: string; url: string; type: FileType }
type DownloadGroup = { label: string; items: DownloadItem[] }

const GROUPS: DownloadGroup[] = [
  {
    label: 'イベント運営マニュアルテンプレート',
    items: [
      {
        name: 'ディレクター用マニュアル',
        url: 'https://workshop.picoton.com/download/file/saf-isaufd8cshu9aa234rq3!/picotonWS_uneimanual.pdf',
        type: 'pdf',
      },
      {
        name: '運営マニュアルテンプレート',
        url: 'https://workshop.picoton.com/document/picotonWS_uneimanual.pptx',
        type: 'pptx',
      },
      {
        name: 'イベント企画書&提案書テンプレート',
        url: 'https://workshop.picoton.com/download/file/saf-isaufd8cshu9aa234rq3!/proposal_format.pptx',
        type: 'pptx',
      },
      {
        name: 'イベント報告書テンプレート',
        url: 'https://workshop.picoton.com/download/file/saf-isaufd8cshu9aa234rq3!/event-report-template.xlsx',
        type: 'xlsx',
      },
    ],
  },
  {
    label: 'イベント会場レイアウトマニュアル',
    items: [
      {
        name: 'イベント会場レイアウトマニュアル',
        url: 'https://workshop.picoton.com/download/file/saf-isaufd8cshu9aa234rq3!/picoton-event-venue-layout-manual.pdf',
        type: 'pdf',
      },
      {
        name: 'ペーパークラフト（レイアウト用）',
        url: 'https://workshop.picoton.com/download/file/saf-isaufd8cshu9aa234rq3!/picoton-venue-layout-paper-craft.pdf',
        type: 'pdf',
      },
      {
        name: '子供向けイベント司会台本テンプレート',
        url: 'https://workshop.picoton.com/download/file/saf-isaufd8cshu9aa234rq3!/picotonWS_moderator-script-template.xlsx',
        type: 'xlsx',
      },
      {
        name: '季節のイベントアイデアカレンダー',
        url: 'https://workshop.picoton.com/download/file/saf-isaufd8cshu9aa234rq3!/picoton_event-calendar.pdf',
        type: 'pdf',
      },
    ],
  },
]

const TYPE_BADGE: Record<FileType, { label: string; cls: string }> = {
  pdf:  { label: 'PDF',  cls: 'bg-red-50 text-red-600 border-red-100' },
  pptx: { label: 'PPT',  cls: 'bg-orange-50 text-orange-600 border-orange-100' },
  xlsx: { label: 'XLS',  cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
}

function DownloadIcon() {
  return (
    <svg className="w-3 h-3 shrink-0 text-slate-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

export default function DownloadResources() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">無料ダウンロード素材</h2>
      </div>
      <div className="divide-y divide-slate-50">
        {GROUPS.map(group => (
          <div key={group.label} className="px-4 py-3 space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{group.label}</p>
            {group.items.map(item => {
              const badge = TYPE_BADGE[item.type]
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 py-1.5 hover:text-orange-600 transition-colors"
                >
                  <DownloadIcon />
                  <span className="text-xs text-slate-600 group-hover:text-orange-600 flex-1 leading-snug transition-colors">
                    {item.name}
                  </span>
                  <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.cls}`}>
                    {badge.label}
                  </span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-slate-50 bg-slate-50/50">
        <Link
          href="https://workshop.picoton.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs text-orange-500 hover:text-orange-700 font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          ピコトン公式サイトで詳細を見る
        </Link>
      </div>
    </div>
  )
}
