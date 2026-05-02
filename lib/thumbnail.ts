import type { CanvasState } from './layout-types'

export function generateThumbnail(state: CanvasState): string {
  const MAX_W = 240
  const MAX_H = 180
  const scale = Math.min(MAX_W / state.roomWidth, MAX_H / state.roomHeight)
  const W = Math.round(state.roomWidth * scale)
  const H = Math.round(state.roomHeight * scale)

  const shapes = state.items.map(item => {
    const cx = ((item.x + item.width / 2) * scale).toFixed(1)
    const cy = ((item.y + item.height / 2) * scale).toFixed(1)
    const w = (item.width * scale).toFixed(1)
    const h = (item.height * scale).toFixed(1)
    const r = (item.width * scale / 2).toFixed(1)
    const rot = item.rotation !== 0 ? ` transform="rotate(${item.rotation},${cx},${cy})"` : ''

    if (item.shape === 'circle') {
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" stroke="#9ca3af" stroke-width="0.5"/>`
    }
    if (item.shape === 'person') {
      const pW = +w, pH = +h
      const headR = (pW * 0.28).toFixed(1)
      const headCy = (+cy - pH / 2 + pW * 0.28 * 1.05).toFixed(1)
      const bodyTop = (+cy - pH / 2 + pW * 0.28 * 1.05 + pW * 0.28 * 1.1).toFixed(1)
      const bodyW = (pW * 0.70).toFixed(1)
      const bodyH = (+cy + pH / 2 - +bodyTop).toFixed(1)
      const bodyX = (+cx - pW * 0.35).toFixed(1)
      const rx = (pW * 0.70 * 0.22).toFixed(1)
      return `<circle cx="${cx}" cy="${headCy}" r="${headR}" fill="${item.color}" stroke="#9ca3af" stroke-width="0.5"/><rect x="${bodyX}" y="${bodyTop}" width="${bodyW}" height="${bodyH}" rx="${rx}" fill="${item.color}" stroke="#9ca3af" stroke-width="0.5"/>`
    }
    return `<rect x="${(+cx - +w / 2).toFixed(1)}" y="${(+cy - +h / 2).toFixed(1)}" width="${w}" height="${h}" fill="${item.color}" stroke="#9ca3af" stroke-width="0.5" rx="1"${rot}/>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="white"/>${shapes}<rect width="${W}" height="${H}" fill="none" stroke="#64748b" stroke-width="1.5"/></svg>`
}
