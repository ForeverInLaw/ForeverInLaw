// Everything drawn on the profile comes from one luminance ramp: the portrait, the name,
// the bars and the charts. These builders turn data into rows of character cells.
import { ADVANCE, type Cell } from './canvas.ts'
import { PORTRAIT_LEVELS, PORTRAIT_SIZE } from './portrait.ts'
import type { Theme } from './theme.ts'

const RAMP = ' .:-=+*#%@'
const BLANK: Cell = [' ', '']

/** Density 0–9 to a stone tier index. Amber is never assigned by density. */
const tierOf = (density: number): 0 | 1 | 2 | 3 => (density <= 2 ? 0 : density <= 4 ? 1 : density <= 6 ? 2 : 3)
const glyphOf = (density: number): string => RAMP[density] ?? ' '

/** The avatar's dark border column would print as a bar. */
const FRAME_COLUMNS = 5

/** Glyph density follows the avatar's darkness: a glowing negative on dark, an ink positive on paper. */
export function portraitRows(t: Theme): Cell[][] {
  return Array.from({ length: PORTRAIT_SIZE }, (_, y) =>
    Array.from({ length: PORTRAIT_SIZE }, (_, x): Cell => {
      if (x < FRAME_COLUMNS) return BLANK
      const density = 9 - Number(PORTRAIT_LEVELS[y * PORTRAIT_SIZE + x] ?? 9)
      return [glyphOf(density), t.stone[tierOf(density)]]
    }),
  )
}

const LETTERS: Record<string, readonly string[]> = {
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  G: ['01111', '10000', '10000', '10011', '10001', '10001', '01111'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
}
const NAME = 'SERGEI'
const NAME_SCALE = 2
export const NAME_COLUMNS = (NAME.length * 6 - 1) * NAME_SCALE

/** Block letters, each font pixel a 2×2 patch of glyphs, densest at the top and settling downward. */
export function nameRows(t: Theme): Cell[][] {
  const rows = 7 * NAME_SCALE
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: NAME_COLUMNS }, (_, c): Cell => {
      const px = Math.floor(c / NAME_SCALE)
      const bit = LETTERS[NAME[Math.floor(px / 6)] ?? '']?.[Math.floor(r / NAME_SCALE)]?.[px % 6]
      if (px % 6 >= 5 || bit !== '1') return BLANK
      return [glyphOf(9 - Math.floor((r / rows) * 3)), t.stone[3]]
    }),
  )
}

export const BAR_CELLS = 30

/** A value as a bar that burns from the densest glyph down, over a faint track so short bars sit on a line. */
export function burnRow(t: Theme, value: number, max: number): Cell[] {
  const filled = Math.max(3, Math.round((value / max) * BAR_CELLS))
  return Array.from({ length: BAR_CELLS }, (_, i): Cell => {
    if (i >= filled) return ['.', t.stone[0]]
    const density = 9 - Math.floor((i / Math.max(filled, 12)) * 5)
    return [glyphOf(density), t.stone[tierOf(density)]]
  })
}

const CREST = '@%#*+=-::.'

export interface RidgeOptions {
  /** Value that fills the full height; anything above is clipped at the top row. */
  scale: number
  rows: number
  /** Character columns per value, and blank columns after it. */
  colsPer: number
  gap: number
  /** Columns whose crest burns amber. */
  hot: (index: number) => boolean
}

/** Columns of glyphs with a crest: densest at the top, thinning toward the floor. */
export function ridge(t: Theme, values: readonly number[], { scale, rows, colsPer, gap, hot }: RidgeOptions): Cell[][] {
  const grid: Cell[][] = Array.from({ length: rows }, () => [])
  values.forEach((value, i) => {
    const height = Math.max(1, Math.min(rows, Math.round(Math.sqrt(value / scale) * rows)))
    const lit = hot(i)
    for (let r = 0; r < rows; r++) {
      const depth = r - (rows - height)
      let cell = BLANK
      if (depth >= 0) {
        const glyph = CREST[Math.min(CREST.length - 1, depth)] ?? '.'
        const tier = tierOf(RAMP.indexOf(glyph))
        cell = [glyph, lit && depth < 3 ? t.accent : (t.stone[lit ? tier : Math.max(0, tier - 1)] ?? t.stone[0])]
      }
      for (let k = 0; k < colsPer; k++) grid[r]?.push(cell)
      for (let k = 0; k < gap; k++) grid[r]?.push(BLANK)
    }
  })
  return grid
}

/** Greedy word wrap for a monospace line budget. */
export function wrap(text: string, chars: number): string[] {
  const lines: string[] = []
  for (const word of text.split(' ')) {
    const line = lines.at(-1)
    if (line !== undefined && line.length + 1 + word.length <= chars) lines[lines.length - 1] = `${line} ${word}`
    else lines.push(word)
  }
  return lines
}

/** How many monospace characters of `size` fit in `width`. */
export const charsFor = (width: number, size: number): number => Math.floor(width / (size * ADVANCE))
