import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { downloadCSV } from '@/lib/csv'

// downloadCSV はブラウザ専用 API (URL.createObjectURL, document.createElement, Blob) に依存する。
// vitest の vi.stubGlobal でノード環境にグローバルを注入してテストする。

function makeSetup() {
  const clickFn = vi.fn()
  const revokeObjectURLFn = vi.fn()
  let lastBlobParts: BlobPart[] = []
  let lastBlobType = ''

  class MockBlob {
    type: string
    constructor(parts: BlobPart[], opts?: BlobPropertyBag) {
      lastBlobParts = parts
      lastBlobType = opts?.type ?? ''
      this.type = lastBlobType
    }
  }

  const anchorEl = { href: '', download: '', click: clickFn }
  const createObjectURLFn = vi.fn(() => 'blob:mock-url')

  vi.stubGlobal('Blob', MockBlob)
  vi.stubGlobal('URL', {
    createObjectURL: createObjectURLFn,
    revokeObjectURL: revokeObjectURLFn,
  })
  vi.stubGlobal('document', {
    createElement: vi.fn(() => anchorEl),
  })

  return { clickFn, revokeObjectURLFn, createObjectURLFn, anchorEl, getContent: () => lastBlobParts.join(''), getType: () => lastBlobType }
}

describe('downloadCSV — download trigger', () => {
  afterEach(() => { vi.unstubAllGlobals() })

  it('clicks the anchor element', () => {
    const { clickFn } = makeSetup()
    downloadCSV('test.csv', [['a']])
    expect(clickFn).toHaveBeenCalledOnce()
  })

  it('sets the correct download filename on the anchor', () => {
    makeSetup()
    downloadCSV('report.csv', [])
    const anchor = (document.createElement as ReturnType<typeof vi.fn>).mock.results[0].value
    expect(anchor.download).toBe('report.csv')
  })

  it('sets href to the blob URL', () => {
    makeSetup()
    downloadCSV('out.csv', [['x']])
    const anchor = (document.createElement as ReturnType<typeof vi.fn>).mock.results[0].value
    expect(anchor.href).toBe('blob:mock-url')
  })

  it('revokes the object URL after clicking', () => {
    const { revokeObjectURLFn } = makeSetup()
    downloadCSV('test.csv', [['x']])
    expect(revokeObjectURLFn).toHaveBeenCalledWith('blob:mock-url')
  })

  it('calls URL.createObjectURL with the Blob', () => {
    const { createObjectURLFn } = makeSetup()
    downloadCSV('test.csv', [['a']])
    expect(createObjectURLFn).toHaveBeenCalledOnce()
  })
})

describe('downloadCSV — Blob MIME type', () => {
  afterEach(() => { vi.unstubAllGlobals() })

  it('creates Blob with text/csv;charset=utf-8; content type', () => {
    const { getType } = makeSetup()
    downloadCSV('test.csv', [['a']])
    expect(getType()).toBe('text/csv;charset=utf-8;')
  })
})

describe('downloadCSV — CSV formatting', () => {
  afterEach(() => { vi.unstubAllGlobals() })

  it('prefixes content with UTF-8 BOM (\\uFEFF)', () => {
    const { getContent } = makeSetup()
    downloadCSV('test.csv', [['a']])
    expect(getContent().startsWith('﻿')).toBe(true)
  })

  it('wraps each cell in double quotes', () => {
    const { getContent } = makeSetup()
    downloadCSV('test.csv', [['hello', 'world']])
    const body = getContent().replace('﻿', '')
    expect(body).toContain('"hello"')
    expect(body).toContain('"world"')
  })

  it('separates columns with comma', () => {
    const { getContent } = makeSetup()
    downloadCSV('test.csv', [['a', 'b', 'c']])
    const body = getContent().replace('﻿', '')
    expect(body).toBe('"a","b","c"')
  })

  it('separates rows with CRLF', () => {
    const { getContent } = makeSetup()
    downloadCSV('test.csv', [['row1'], ['row2']])
    const body = getContent().replace('﻿', '')
    expect(body).toBe('"row1"\r\n"row2"')
  })

  it('escapes double quotes inside cell values', () => {
    const { getContent } = makeSetup()
    downloadCSV('test.csv', [['say "hello"']])
    const body = getContent().replace('﻿', '')
    expect(body).toBe('"say ""hello"""')
  })

  it('handles empty string cells', () => {
    const { getContent } = makeSetup()
    downloadCSV('test.csv', [['', 'b']])
    const body = getContent().replace('﻿', '')
    expect(body).toBe('"","b"')
  })

  it('handles null cell values gracefully', () => {
    const { getContent } = makeSetup()
    downloadCSV('test.csv', [[null as unknown as string]])
    const body = getContent().replace('﻿', '')
    expect(body).toBe('""')
  })

  it('handles undefined cell values gracefully', () => {
    const { getContent } = makeSetup()
    downloadCSV('test.csv', [[undefined as unknown as string]])
    const body = getContent().replace('﻿', '')
    expect(body).toBe('""')
  })

  it('handles empty rows array (no content beyond BOM)', () => {
    const { getContent } = makeSetup()
    downloadCSV('empty.csv', [])
    const body = getContent().replace('﻿', '')
    expect(body).toBe('')
  })

  it('handles multi-row multi-column data', () => {
    const { getContent } = makeSetup()
    downloadCSV('data.csv', [
      ['名前', '役割'],
      ['田中', 'スタッフ'],
    ])
    const body = getContent().replace('﻿', '')
    expect(body).toBe('"名前","役割"\r\n"田中","スタッフ"')
  })
})
