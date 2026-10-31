import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import subsetFont from 'subset-font'

export type FontRole = 'display' | 'body' | 'mono'

export interface Run {
  text: string
  font: FontRole
  size: number
  fill: string
  /** Horizontal gap before this run, in px. */
  gap?: number
}

const require = createRequire(import.meta.url)

const FONTS: Record<FontRole, { file: string; axes?: Record<string, number> }> = {
  display: {
    file: '@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2',
    axes: { wght: 800, wdth: 125 },
  },
  body: {
    file: '@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2',
    axes: { wght: 400, wdth: 100 },
  },
  mono: { file: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2' },
}

const escapeXml = (s: string): string =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const familyOf = (role: FontRole): string => `rec-${role}`

/**
 * An SVG inside <img> cannot load external fonts, so each canvas tracks the
 * glyphs it draws and inlines exactly those as a base64 subset.
 */
export class Canvas {
  private readonly body: string[] = []
  private readonly glyphs = new Map<FontRole, Set<string>>()

  constructor(
    readonly width: number,
    readonly height: number,
    private readonly title: string,
  ) {}

  text(x: number, y: number, runs: Run | readonly Run[], anchor: 'start' | 'middle' | 'end' = 'start'): this {
    const spans = [runs].flat().map((run) => {
      this.track(run.font, run.text)
      const gap = run.gap ? ` dx="${run.gap}"` : ''
      return `<tspan${gap} font-family="${familyOf(run.font)}" font-size="${run.size}" fill="${run.fill}">${escapeXml(run.text)}</tspan>`
    })
    this.body.push(`<text x="${x}" y="${y}" text-anchor="${anchor}">${spans.join('')}</text>`)
    return this
  }

  rect(x: number, y: number, w: number, h: number, fill: string): this {
    this.body.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`)
    return this
  }

  circle(cx: number, cy: number, r: number, attrs: string): this {
    this.body.push(`<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`)
    return this
  }

  async toSvg(): Promise<string> {
    const faces = await Promise.all([...this.glyphs].map(([role, chars]) => fontFace(role, chars)))
    const style = `<style>${faces.join('')}</style>`
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" ` +
      `width="${this.width}" height="${this.height}" role="img">` +
      `<title>${escapeXml(this.title)}</title>${style}${this.body.join('')}</svg>\n`
    )
  }

  private track(role: FontRole, text: string): void {
    const set = this.glyphs.get(role) ?? new Set<string>()
    for (const ch of text) set.add(ch)
    this.glyphs.set(role, set)
  }
}

async function fontFace(role: FontRole, chars: ReadonlySet<string>): Promise<string> {
  const { file, axes } = FONTS[role]
  const source = await readFile(require.resolve(file))
  const subset = await subsetFont(source, [...chars].join(''), {
    targetFormat: 'woff2',
    ...(axes ? { variationAxes: axes } : {}),
  })
  return `@font-face{font-family:${familyOf(role)};src:url(data:font/woff2;base64,${subset.toString('base64')}) format("woff2")}`
}
