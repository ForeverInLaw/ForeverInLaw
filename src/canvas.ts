import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import subsetFont from 'subset-font'

export type Weight = 'regular' | 'bold'

export interface Run {
  text: string
  size: number
  fill: string
  weight?: Weight
}

/** One character cell: a glyph and its fill. A space is an empty cell. */
export type Cell = readonly [glyph: string, fill: string]

export interface GridOptions {
  x: number
  y: number
  /** Column width; the glyph size follows from it. */
  cell: number
  rowHeight: number
  weight?: Weight
  /** Rows fade in top to bottom when the image loads. */
  reveal?: boolean
}

/** JetBrains Mono advances every glyph by 0.6em, which is what keeps a character grid exact. */
export const ADVANCE = 0.6

const require = createRequire(import.meta.url)
const FAMILY = 'm'
const FONTS: Record<Weight, { file: string; css: number }> = {
  regular: { file: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2', css: 400 },
  bold: { file: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-800-normal.woff2', css: 800 },
}
const ROW_DELAY_MS = 15

const escapeXml = (s: string): string =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const num = (n: number): string => String(+n.toFixed(2))

/**
 * An SVG inside <img> cannot load external fonts or stylesheets, so each canvas tracks the
 * glyphs it draws, inlines exactly those as a font subset, and carries its own animation CSS.
 */
export class Canvas {
  private readonly body: string[] = []
  private readonly glyphs = new Map<Weight, Set<string>>()
  private revealed = false
  private blinking = false

  constructor(
    readonly width: number,
    readonly height: number,
    private readonly title: string,
    /** Soft phosphor glow behind character grids, or none. */
    private readonly glow?: string,
  ) {}

  text(x: number, y: number, runs: Run | readonly Run[], anchor: 'start' | 'middle' | 'end' = 'start'): this {
    const spans = [runs].flat().map((run) => {
      const weight = run.weight ?? 'regular'
      this.track(weight, run.text)
      return `<tspan font-size="${run.size}" font-weight="${FONTS[weight].css}" fill="${run.fill}">${escapeXml(run.text)}</tspan>`
    })
    this.body.push(`<text x="${num(x)}" y="${num(y)}" text-anchor="${anchor}">${spans.join('')}</text>`)
    return this
  }

  /** A 1px outline drawn inside the given box. */
  frame(x: number, y: number, w: number, h: number, stroke: string): this {
    this.body.push(`<rect x="${num(x + 0.5)}" y="${num(y + 0.5)}" width="${num(w - 1)}" height="${num(h - 1)}" fill="none" stroke="${stroke}"/>`)
    return this
  }

  /** A text cursor that blinks after the image loads. */
  cursor(x: number, y: number, w: number, h: number, fill: string): this {
    this.blinking = true
    this.body.push(`<rect class="cursor" x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" fill="${fill}"/>`)
    return this
  }

  /** Rows of character cells. Runs of same-fill glyphs share a tspan positioned by column. */
  grid(rows: readonly (readonly Cell[])[], { x, y, cell, rowHeight, weight = 'regular', reveal = false }: GridOptions): this {
    this.revealed ||= reveal
    const size = num(cell / ADVANCE)
    const lines = rows.flatMap((row, r) => {
      const spans: string[] = []
      for (let c = 0; c < row.length; ) {
        const [glyph, fill] = row[c] ?? [' ', '']
        if (glyph === ' ') {
          c++
          continue
        }
        const start = c
        let run = ''
        while (c < row.length && row[c]?.[0] !== ' ' && row[c]?.[1] === fill) run += row[c++]?.[0]
        this.track(weight, run)
        spans.push(`<tspan x="${num(x + start * cell)}" fill="${fill}">${escapeXml(run)}</tspan>`)
      }
      if (spans.length === 0) return []
      const delay = reveal ? ` style="animation-delay:${r * ROW_DELAY_MS}ms"` : ''
      return [`<text y="${num(y + (r + 1) * rowHeight)}"${delay}>${spans.join('')}</text>`]
    })
    const glow = this.glow ? ' class="glow"' : ''
    this.body.push(`<g${glow} font-size="${size}" font-weight="${FONTS[weight].css}"${reveal ? ' data-reveal=""' : ''}>${lines.join('')}</g>`)
    return this
  }

  async toSvg(): Promise<string> {
    const faces = await Promise.all([...this.glyphs].map(([weight, chars]) => fontFace(weight, chars)))
    const css = [
      ...faces,
      `text{font-family:${FAMILY};white-space:pre}`,
      this.glow ? `.glow{filter:drop-shadow(0 0 2.5px ${this.glow})}` : '',
      this.revealed ? '[data-reveal] text{animation:scan .5s both cubic-bezier(.16,1,.3,1)}@keyframes scan{from{opacity:0;transform:translateY(-3px)}}' : '',
      this.blinking ? '.cursor{animation:blink 1.06s steps(1) infinite}@keyframes blink{50%{opacity:0}}' : '',
      this.revealed || this.blinking ? '@media (prefers-reduced-motion:reduce){*{animation:none!important}}' : '',
    ].join('')
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" ` +
      `width="${this.width}" height="${this.height}" role="img">` +
      `<title>${escapeXml(this.title)}</title><style>${css}</style>${this.body.join('')}</svg>\n`
    )
  }

  private track(weight: Weight, text: string): void {
    const set = this.glyphs.get(weight) ?? new Set<string>()
    for (const ch of text) set.add(ch)
    this.glyphs.set(weight, set)
  }
}

async function fontFace(weight: Weight, chars: ReadonlySet<string>): Promise<string> {
  const { file, css } = FONTS[weight]
  const source = await readFile(require.resolve(file))
  const subset = await subsetFont(source, [...chars].join(''), { targetFormat: 'woff2' })
  return `@font-face{font-family:${FAMILY};font-weight:${css};src:url(data:font/woff2;base64,${subset.toString('base64')}) format("woff2")}`
}
