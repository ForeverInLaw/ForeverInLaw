import { Canvas } from './canvas.ts'
import { AVATAR_LEVELS, AVATAR_SIZE } from './halftone.ts'
import {
  CREDITS,
  NIGHT_HOURS,
  OUTTAKES,
  SIDE_A,
  SIDE_B,
  SIDE_C,
  type ClosedSourceTrack,
  type Track,
} from './content.ts'
import type { Stats } from './github.ts'

export type ThemeName = 'dark' | 'light'

interface Theme {
  fg: string
  soft: string
  muted: string
  hairline: string
  accent: string
  accentText: string
  dim: string
}

const THEMES: Record<ThemeName, Theme> = {
  dark: {
    fg: '#F2F0EB',
    soft: '#D6D3CC',
    muted: '#9A978F',
    hairline: '#2B2B2E',
    accent: '#8EA6FF',
    accentText: '#8EA6FF',
    dim: '#343A4C',
  },
  light: {
    fg: '#141210',
    soft: '#3B3834',
    muted: '#6E6A63',
    hairline: '#E2DFD8',
    accent: '#1B3FD6',
    accentText: '#1B3FD6',
    dim: '#CFCBC2',
  },
}

const PAPER = '#E8E2D2'
const INK = '#141210'
const COBALT = '#1B3FD6'
/** The avatar's dark border would print as a hard vertical bar. */
const AVATAR_FRAME_COLUMNS = 3

const WIDTH = 840
const HEAD_HEIGHT = 112

/** A README slice. `themed: false` means one image for both color schemes. */
export interface Section {
  name: string
  alt: string
  href?: string
  themed: boolean
  render: (theme: ThemeName) => Canvas
}

export const runtime = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

const compact = (n: number): string => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))

const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })
const monthOf = (date: Date): string => monthFormat.format(date)

function recordingPeriod(first: Date, last: Date, now: Date): string {
  const year = last.getUTCFullYear()
  const sameMonth = first.getUTCMonth() === last.getUTCMonth() && first.getUTCFullYear() === year
  const period = sameMonth
    ? `${monthOf(first)} ${first.getUTCDate()}–${last.getUTCDate()}, ${year}`
    : `${monthOf(first)}–${monthOf(last)} ${year}`
  const recent = now.getTime() - last.getTime() < 30 * 86_400_000
  return recent ? `${period}, still recording` : period
}

function heading(canvas: Canvas, t: Theme, label: string, right?: string): Canvas {
  canvas.text(0, HEAD_HEIGHT - 20, { text: label, font: 'display', size: 20, fill: t.accentText })
  if (right) {
    canvas.text(WIDTH, HEAD_HEIGHT - 20, { text: right, font: 'mono', size: 14, fill: t.muted }, 'end')
  }
  return canvas
}

function renderCover(stats: Stats): Canvas {
  const height = 520
  const cell = height / AVATAR_SIZE
  const left = WIDTH - height
  const dots = [...AVATAR_LEVELS].flatMap((level, i) => {
    const column = i % AVATAR_SIZE
    const r = ((9 - Number(level)) / 9) * cell * 0.66
    if (r <= 0.5 || column < AVATAR_FRAME_COLUMNS) return []
    const x = left + column * cell + cell / 2
    const y = Math.floor(i / AVATAR_SIZE) * cell + cell / 2
    return [{ x: +x.toFixed(1), y: +y.toFixed(1), r: +r.toFixed(2) }]
  })

  return new Canvas(WIDTH, height, `Sergei, ForeverInLaw LP, runtime ${runtime(stats.runtimeSeconds)}`)
    .rect(0, 0, WIDTH, height, PAPER)
    .dots(dots, INK)
    .text(20, 500, { text: 'SERGEI', font: 'display', size: 212, fill: COBALT })
    .text(28, 56, { text: 'ForeverInLaw LP', font: 'display', size: 30, fill: INK })
    .text(28, 86, {
      text: `redstone.md, ${runtime(stats.runtimeSeconds)}`,
      font: 'display',
      size: 18,
      fill: INK,
    })
}

function renderTrack(track: Track, number: number, stats: Stats, now: Date, t: Theme): Canvas {
  const data = stats.tracks.get(track)
  if (!data) throw new Error(`missing stats for ${track.title}`)
  const canvas = new Canvas(WIDTH, 182, `${number}. ${track.title}: ${track.description}`)
  const period = recordingPeriod(data.first, data.last, now)
  return canvas
    .rect(0, 0, WIDTH, 1, t.hairline)
    .text(0, 70, { text: String(number), font: 'mono', size: 15, fill: t.muted })
    .text(44, 78, [
      { text: track.title, font: 'display', size: 64, fill: t.fg },
      ...(track.tag
        ? [{ text: `(${track.tag})`, font: 'body' as const, size: 17, fill: t.muted, gap: 14 }]
        : []),
    ])
    .text(WIDTH, 70, { text: runtime(data.commits), font: 'mono', size: 19, fill: t.fg }, 'end')
    .text(44, 118, { text: track.description, font: 'body', size: 20, fill: t.soft })
    .text(44, 148, { text: `${period} · ${track.stack}`, font: 'mono', size: 14, fill: t.muted })
}

function renderClosedTrack(track: ClosedSourceTrack, t: Theme): Canvas {
  return new Canvas(WIDTH, 96, `${track.title}: ${track.description}`)
    .rect(0, 0, WIDTH, 1, t.hairline)
    .text(44, 42, { text: track.title, font: 'display', size: 30, fill: t.fg })
    .text(44, 71, { text: track.description, font: 'body', size: 17, fill: t.soft })
    .text(WIDTH, 42, { text: '—', font: 'mono', size: 19, fill: t.muted }, 'end')
}

function renderWaveform(stats: Stats, t: Theme): Canvas {
  const barsHeight = 170
  const canvas = new Canvas(WIDTH, HEAD_HEIGHT + barsHeight + 44, `Waveform of ${stats.lastYearTotal} contributions`)
  heading(canvas, t, 'Waveform')
  const peak = Math.max(...stats.weeks, 1)
  const step = WIDTH / stats.weeks.length
  stats.weeks.forEach((count, i) => {
    const h = Math.max(2, (count / peak) * barsHeight)
    canvas.rect(+(i * step).toFixed(2), +(HEAD_HEIGHT + barsHeight - h).toFixed(2), +(step - 3).toFixed(2), +h.toFixed(2), t.accent)
  })
  const y = HEAD_HEIGHT + barsHeight + 30
  const caption = (text: string) => ({ text, font: 'mono' as const, size: 14, fill: t.muted })
  canvas.text(0, y, caption(`${monthOf(stats.firstDay)} ${stats.firstDay.getUTCFullYear()}`))
  canvas.text(WIDTH, y, caption(`${stats.lastYearTotal.toLocaleString('en')} contributions · ${monthOf(stats.lastDay)} ${stats.lastDay.getUTCFullYear()}`), 'end')
  return canvas
}

function renderHours(stats: Stats, t: Theme): Canvas {
  const barsHeight = 130
  const canvas = new Canvas(WIDTH, HEAD_HEIGHT + barsHeight + 44, 'Commits by hour of day, busiest late at night')
  heading(canvas, t, 'Studio hours', 'UTC+2')
  const peak = Math.max(...stats.hours, 1)
  const step = WIDTH / 24
  stats.hours.forEach((count, hour) => {
    const h = Math.max(2, (count / peak) * barsHeight)
    const fill = NIGHT_HOURS.has(hour) ? t.accent : t.dim
    canvas.rect(+(hour * step).toFixed(2), +(HEAD_HEIGHT + barsHeight - h).toFixed(2), +(step - 6).toFixed(2), +h.toFixed(2), fill)
  })
  for (const hour of [0, 6, 12, 18]) {
    canvas.text(+(hour * step).toFixed(2), HEAD_HEIGHT + barsHeight + 30, {
      text: String(hour).padStart(2, '0'),
      font: 'mono',
      size: 14,
      fill: t.muted,
    })
  }
  return canvas
}

function renderDiscography(stats: Stats, t: Theme): Canvas {
  const canvas = new Canvas(WIDTH, HEAD_HEIGHT + 104, 'Contributions by year')
  heading(canvas, t, 'Discography')
  const step = WIDTH / stats.years.length
  const latest = stats.years.at(-1)?.year
  stats.years.forEach(({ year, total }, i) => {
    canvas.text(+(i * step).toFixed(2), HEAD_HEIGHT + 44, {
      text: total.toLocaleString('en'),
      font: 'display',
      size: 44,
      fill: year === latest ? t.accentText : t.fg,
    })
    canvas.text(+(i * step).toFixed(2), HEAD_HEIGHT + 74, { text: String(year), font: 'mono', size: 14, fill: t.muted })
  })
  return canvas
}

function renderOuttakes(t: Theme): Canvas {
  const lineHeight = 36
  const canvas = new Canvas(WIDTH, HEAD_HEIGHT + OUTTAKES.length * lineHeight + 20, 'Outtakes: real commit messages')
  heading(canvas, t, 'Outtakes')
  OUTTAKES.forEach((line, i) => {
    canvas.text(0, HEAD_HEIGHT + 22 + i * lineHeight, { text: line, font: 'mono', size: 16, fill: t.soft })
  })
  return canvas
}

function renderCredits(t: Theme): Canvas {
  const lineHeight = 30
  const canvas = new Canvas(WIDTH, HEAD_HEIGHT + CREDITS.length * lineHeight + 48, CREDITS.join(' '))
  heading(canvas, t, 'Credits')
  CREDITS.forEach((line, i) => {
    canvas.text(0, HEAD_HEIGHT + 24 + i * lineHeight, { text: line, font: 'body', size: 18, fill: t.soft })
  })

  const widths = [3, 1, 2, 1, 4, 2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2]
  const left = WIDTH - 124
  const top = HEAD_HEIGHT + 2
  canvas.rect(left, top, 124, 92, PAPER)
  let x = left + 12
  widths.forEach((w, i) => {
    if (i % 2 === 0) canvas.rect(x, top + 10, w * 2, 52, INK)
    x += w * 2
  })
  canvas.text(left + 12, top + 82, { text: 'RS-2018', font: 'mono', size: 13, fill: INK })
  return canvas
}

/** The record from top to bottom. The README and the image files both derive from this list. */
export function buildSections(stats: Stats, now: Date): Section[] {
  const themed = (
    name: string,
    alt: string,
    draw: (t: Theme) => Canvas,
    href?: string,
  ): Section => ({
    name,
    alt,
    themed: true,
    ...(href ? { href } : {}),
    render: (theme) => draw(THEMES[theme]),
  })

  const side = (label: string, tracks: readonly Track[], offset: number): Section[] => [
    themed(`side-${label.toLowerCase()}`, `Side ${label}`, (t) =>
      heading(new Canvas(WIDTH, HEAD_HEIGHT, `Side ${label}`), t, `Side ${label}`),
    ),
    ...tracks.map((track, i) =>
      themed(
        `track-${track.title}`,
        `${offset + i}. ${track.title}: ${track.description}`,
        (t) => renderTrack(track, offset + i, stats, now, t),
        `https://github.com/${track.owner}/${track.repo}`,
      ),
    ),
  ]

  const closedHead = `${runtime(stats.privateThisYear)} · ${compact(stats.privateThisYear)} private contributions in ${now.getUTCFullYear()}`

  return [
    {
      name: 'cover',
      alt: `Sergei, ForeverInLaw LP. Label: redstone.md. ${runtime(stats.runtimeSeconds)}, one commit is one second.`,
      href: 'https://zaebal.dev',
      themed: false,
      render: () => renderCover(stats),
    },
    ...side('A', SIDE_A, 1),
    ...side('B', SIDE_B, SIDE_A.length + 1),
    themed('side-c', `Side C, closed source. ${closedHead}`, (t) =>
      heading(new Canvas(WIDTH, HEAD_HEIGHT, 'Side C, closed source'), t, 'Side C · Closed source', closedHead),
    ),
    ...SIDE_C.map((track) =>
      themed(
        `closed-${track.slug}`,
        `${track.title}: ${track.description}`,
        (t) => renderClosedTrack(track, t),
        `https://redstone.md/projects/${track.slug}`,
      ),
    ),
    themed('waveform', `Waveform: ${stats.lastYearTotal} contributions in the last twelve months, week by week`, (t) => renderWaveform(stats, t)),
    themed('hours', 'Studio hours: commits by hour of day, busiest late at night', (t) => renderHours(stats, t)),
    themed('discography', `Discography: ${stats.years.map((y) => `${y.year}: ${y.total}`).join(', ')}`, (t) => renderDiscography(stats, t)),
    themed('outtakes', `Outtakes: ${OUTTAKES.join('; ')}`, renderOuttakes),
    themed('credits', CREDITS.join(' '), renderCredits),
  ]
}
