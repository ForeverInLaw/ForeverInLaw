import { Canvas } from './canvas.ts'
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
    fg: '#F4EFF8',
    soft: '#D9CFE6',
    muted: '#A094B0',
    hairline: '#2A2433',
    accent: '#F492F0',
    accentText: '#F492F0',
    dim: '#4A3F58',
  },
  light: {
    fg: '#1D1421',
    soft: '#3E3346',
    muted: '#6D6277',
    hairline: '#E2DCE7',
    accent: '#D04EC5',
    accentText: '#8F2784',
    dim: '#D8CFE0',
  },
}

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
  canvas.text(0, HEAD_HEIGHT - 20, { text: label, font: 'mono', size: 15, fill: t.accentText })
  if (right) {
    canvas.text(WIDTH, HEAD_HEIGHT - 20, { text: right, font: 'mono', size: 14, fill: t.muted }, 'end')
  }
  return canvas
}

function renderCover(stats: Stats): Canvas {
  const canvas = new Canvas(WIDTH, 520, `Sergei, ForeverInLaw LP, runtime ${runtime(stats.runtimeSeconds)}`)
  const cx = 690
  const cy = 430
  const outer = 262
  const label = 76
  const ink = '#1E1030'

  canvas
    .rect(0, 0, WIDTH, 520, ink)
    .circle(cx, cy, outer + 6, 'fill="#07050B"')

  const usable = outer - label - 12
  let radius = outer
  for (const { commits } of stats.tracks.values()) {
    const band = Math.max(5, (usable * commits) / stats.runtimeSeconds)
    for (let r = radius; r > radius - band; r -= 2.4) {
      canvas.circle(cx, cy, r, 'fill="none" stroke="#3A3048" stroke-width=".7"')
    }
    radius -= band + 3
  }

  canvas
    .circle(cx, cy, label, 'fill="#F492F0"')
    .circle(cx, cy, 5, 'fill="#07050B"')
    .text(cx, cy - 28, { text: 'redstone.md', font: 'mono', size: 13, fill: ink }, 'middle')
    .text(cx, cy + 40, { text: 'RS-2018', font: 'mono', size: 13, fill: ink }, 'middle')
    .text(56, 148, { text: 'Sergei', font: 'display', size: 104, fill: '#F492F0' })
    .text(56, 194, { text: 'ForeverInLaw LP', font: 'body', size: 21, fill: '#D9CFE6' })
    .text(56, 440, { text: 'Label: redstone.md', font: 'mono', size: 15, fill: '#B3A6C2' })
    .text(56, 468, {
      text: `${runtime(stats.runtimeSeconds)} · 1 commit = 1 second`,
      font: 'mono',
      size: 15,
      fill: '#B3A6C2',
    })
  return canvas
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
      { text: track.title, font: 'display', size: 54, fill: t.fg },
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
    .text(44, 42, { text: track.title, font: 'display', size: 26, fill: t.fg })
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
      size: 34,
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
  canvas.rect(left, top, 124, 92, '#EFE9DC')
  let x = left + 12
  widths.forEach((w, i) => {
    if (i % 2 === 0) canvas.rect(x, top + 10, w * 2, 52, '#1E1030')
    x += w * 2
  })
  canvas.text(left + 12, top + 82, { text: 'RS-2018', font: 'mono', size: 13, fill: '#1E1030' })
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
