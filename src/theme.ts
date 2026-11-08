import { Canvas, type Run } from './canvas.ts'

export type ThemeName = 'dark' | 'light'
export type LayoutName = 'wide' | 'narrow'

/**
 * Stone tones sampled from the avatar, faintest to primary reading weight, plus one amber
 * accent reserved for data peaks. Neither theme paints a ground: GitHub leaves a gap of its own
 * page colour between stacked images, so a painted slab would show a seam under every slice.
 */
export interface Theme {
  stone: readonly [faint: string, dim: string, secondary: string, primary: string]
  accent: string
  glow?: string
}

export const THEMES: Record<ThemeName, Theme> = {
  dark: {
    stone: ['#4f4943', '#8c857b', '#b8b1a9', '#e6e5e4'],
    accent: '#ffb43a',
    glow: 'rgb(230 229 228 / .22)',
  },
  light: {
    stone: ['#c9c3bb', '#6f685e', '#5d564e', '#2d2824'],
    accent: '#8f4a0a',
  },
}

/** Wide ships to desktop; narrow is swapped in on phones, where wide text would shrink below reading size. */
export const LAYOUTS: Record<LayoutName, { width: number; margin: number }> = {
  wide: { width: 840, margin: 32 },
  narrow: { width: 420, margin: 20 },
}

/** Text runs in the theme's reading tiers. */
export function ink(t: Theme) {
  const run = (text: string, size: number, fill: string, bold: boolean): Run => ({
    text,
    size,
    fill,
    weight: bold ? 'bold' : 'regular',
  })
  return {
    primary: (text: string, size = 15, bold = false) => run(text, size, t.stone[3], bold),
    secondary: (text: string, size = 15) => run(text, size, t.stone[2], false),
    accent: (text: string, size: number) => run(text, size, t.accent, true),
  }
}

/** A full-width slice canvas for the theme's layout. */
export function sliceCanvas(layout: LayoutName, t: Theme, height: number, title: string): Canvas {
  const { width } = LAYOUTS[layout]
  return new Canvas(width, height, title, t.glow)
}
