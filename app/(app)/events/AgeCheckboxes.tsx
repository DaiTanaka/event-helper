import { TARGET_AGES } from '@/lib/eventFields'

type AgeItem = typeof TARGET_AGES[number]

function Group({ items, checked }: { items: readonly AgeItem[]; checked: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-y-2.5 gap-x-6">
      {items.map(t => (
        <label key={t.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="target_age"
            value={t.value}
            defaultChecked={checked.includes(t.value)}
            className="w-4 h-4 rounded border-slate-300 accent-orange-500 cursor-pointer shrink-0"
          />
          <span className="text-sm text-slate-700 leading-snug">{t.label}</span>
        </label>
      ))}
    </div>
  )
}

export default function AgeCheckboxes({ checked = [] }: { checked?: string[] }) {
  const childItems = TARGET_AGES.filter(t => t.group === 'children')
  const adultItems = TARGET_AGES.filter(t => t.group === 'adults')

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">子ども</p>
        <Group items={childItems} checked={checked} />
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">大人</p>
        <Group items={adultItems} checked={checked} />
      </div>
    </div>
  )
}
