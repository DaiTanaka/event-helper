'use client'

import { LAYOUT_TEMPLATES } from '@/lib/layout-templates'
import type { CanvasState } from '@/lib/layout-types'

function TemplateThumbnail({ id }: { id: string }) {
  if (id === 'stage') {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        <rect x="60" y="4" width="80" height="6" rx="1" fill="#cbd5e1" />
        <rect x="40" y="12" width="120" height="22" rx="2" fill="#86efac" />
        {/* table rows */}
        {[52, 74, 96].map(y => (
          <g key={y}>
            <rect x="10" y={y} width="75" height="8" rx="1" fill="#fde68a" />
            <rect x="115" y={y} width="75" height="8" rx="1" fill="#fde68a" />
            {[16, 28, 40, 52, 64].map(x => (
              <rect key={x} x={x} y={y - 10} width="6" height="6" rx="1" fill="#93c5fd" />
            ))}
            {[121, 133, 145, 157, 169].map(x => (
              <rect key={x} x={x} y={y - 10} width="6" height="6" rx="1" fill="#93c5fd" />
            ))}
          </g>
        ))}
        <rect x="5" y="135" width="30" height="8" rx="1" fill="#c4b5fd" />
        <rect x="85" y="138" width="30" height="7" rx="1" fill="#fca5a5" />
      </svg>
    )
  }
  if (id === 'ushape') {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        <rect x="60" y="15" width="80" height="7" rx="1" fill="#cbd5e1" />
        <rect x="35" y="30" width="130" height="8" rx="1" fill="#fde68a" />
        <rect x="35" y="112" width="130" height="8" rx="1" fill="#fde68a" />
        <rect x="35" y="38" width="8" height="74" rx="1" fill="#fde68a" />
        <rect x="157" y="38" width="8" height="74" rx="1" fill="#fde68a" />
        {[53, 73, 93, 113, 133, 153].map(x => (
          <rect key={x} x={x} y="39" width="7" height="7" rx="1" fill="#93c5fd" />
        ))}
        {[53, 73, 93, 113, 133, 153].map(x => (
          <rect key={x} x={x} y="104" width="7" height="7" rx="1" fill="#93c5fd" />
        ))}
        {[47, 62, 77, 92].map(y => (
          <rect key={y} x="44" y={y} width="7" height="7" rx="1" fill="#93c5fd" />
        ))}
        {[47, 62, 77, 92].map(y => (
          <rect key={y} x="149" y={y} width="7" height="7" rx="1" fill="#93c5fd" />
        ))}
        <rect x="88" y="138" width="24" height="7" rx="1" fill="#fca5a5" />
      </svg>
    )
  }
  if (id === 'party') {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        <rect x="60" y="8" width="80" height="16" rx="2" fill="#86efac" />
        <rect x="182" y="20" width="12" height="90" rx="2" fill="#c4b5fd" />
        {[
          [22, 42], [75, 42], [128, 42],
          [22, 92], [75, 92], [128, 92],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x + 7} cy={y + 7} rx="14" ry="14" fill="#fde68a" />
        ))}
        <rect x="5" y="136" width="30" height="8" rx="1" fill="#c4b5fd" />
        <rect x="85" y="138" width="30" height="7" rx="1" fill="#fca5a5" />
      </svg>
    )
  }
  // exhibition
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {['#fde68a', '#c4b5fd', '#86efac', '#93c5fd'].map((c, i) => (
        <rect key={i} x={5 + i * 48} y="5" width="43" height="20" rx="2" fill={c} />
      ))}
      {['#fde68a', '#c4b5fd', '#86efac', '#93c5fd'].map((c, i) => (
        <rect key={i} x={5 + i * 48} y="125" width="43" height="20" rx="2" fill={c} />
      ))}
      <rect x="5" y="32" width="20" height="30" rx="1" fill="#fed7aa" />
      <rect x="5" y="70" width="20" height="30" rx="1" fill="#fed7aa" />
      <rect x="175" y="32" width="20" height="30" rx="1" fill="#fed7aa" />
      <rect x="175" y="70" width="20" height="30" rx="1" fill="#fed7aa" />
      <rect x="78" y="65" width="44" height="10" rx="1" fill="#e2e8f0" />
      <rect x="85" y="140" width="30" height="7" rx="1" fill="#fca5a5" />
    </svg>
  )
}

export default function LayoutTemplateSelector({
  onSelect,
  onClose,
}: {
  onSelect: (state: CanvasState) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-slate-800">テンプレートから始める</h2>
            <p className="text-xs text-slate-400 mt-0.5">選択後も自由に編集できます</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-4 grid grid-cols-2 gap-3">
          {LAYOUT_TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => { onSelect(tpl.state); onClose() }}
              className="group text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="h-28 bg-slate-50 p-2 group-hover:bg-orange-50/30 transition-colors">
                <TemplateThumbnail id={tpl.id} />
              </div>
              <div className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{tpl.emoji}</span>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                    {tpl.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{tpl.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            テンプレートを使わずに始める
          </button>
        </div>
      </div>
    </div>
  )
}
