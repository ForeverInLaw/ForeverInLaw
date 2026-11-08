import { ADVANCE, Canvas, type Run } from './canvas.ts'
import {
  BIO,
  CLOSED_SOURCE,
  CONTACTS,
  CREDITS,
  NIGHT_HOURS,
  OUTTAKES,
  ROLE,
  TRACKS,
  UTC_OFFSET,
  type ClosedSourceTrack,
  type Contact,
  type Track,
} from './content.ts'
import type { Stats, TrackStats } from './github.ts'
import { BAR_CELLS, NAME_COLUMNS, burnRow, charsFor, nameRows, portraitRows, ridge, wrap } from './glyphs.ts'
import { PORTRAIT_SIZE } from './portrait.ts'
import { LAYOUTS, THEMES, ink, sliceCanvas, type LayoutName, type ThemeName } from './theme.ts'

/** A README image. Slices render per layout and theme; inline images (chips) per theme only. */
export interface Image {
  name: string
  alt: string
  href?: string
  render: (theme: ThemeName, layout: LayoutName) => Canvas
}

export type Block =
  | { kind: 'slice'; image: Image }
  | { kind: 'inline'; height: number; images: readonly Image[] }

const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })
const monthOf = (date: Date): string => monthFormat.format(date)
const count = (n: number): string => n.toLocaleString('en')
const hh = (hour: number): string => `${String(hour).padStart(2, '0')}:00`

/** "May–Nov 2026", "Aug 20–21, 2026" or "Nov 2025–Feb 2026". */
function period({ first, last }: TrackStats): string {
  const [y1, y2] = [first.getUTCFullYear(), last.getUTCFullYear()]
  if (y1 !== y2) return `${monthOf(first)} ${y1}–${monthOf(last)} ${y2}`
  if (first.getUTCMonth() !== last.getUTCMonth()) return `${monthOf(first)}–${monthOf(last)} ${y2}`
  return `${monthOf(first)} ${first.getUTCDate()}–${last.getUTCDate()}, ${y2}`
}

const PRIMARY = CONTACTS[0]
const COMMAND = `~ $ open ${PRIMARY?.href.replace(/^https?:\/\//, '') ?? ''}`
const COMMAND_WIDTH = COMMAND.length * 15 * ADVANCE

function renderCover(theme: ThemeName, layout: LayoutName): Canvas {
  const t = THEMES[theme]
  const s = ink(t)
  if (layout === 'wide') {
    const side = 420
    const cell = side / PORTRAIT_SIZE
    return sliceCanvas(layout, t, side, 'Sergei, ForeverInLaw')
      .grid(portraitRows(t), { x: 840 - side, y: -cell * 0.18, cell, rowHeight: cell, reveal: true })
      .grid(nameRows(t), { x: 32, y: 40, cell: 356 / NAME_COLUMNS, rowHeight: 6.6, weight: 'bold' })
      .text(32, 176, s.primary('ForeverInLaw', 20, true))
      .text(32, 200, s.primary(ROLE, 15, true))
      .text(32, 234, s.secondary(BIO[0]))
      .text(32, 256, s.secondary(BIO[1]))
      .text(32, 310, s.primary(COMMAND, 15, true))
      .cursor(32 + COMMAND_WIDTH + 4, 298, 9, 16, t.stone[3])
  }
  const side = 380
  const cell = side / PORTRAIT_SIZE
  const top = 20 + side
  return sliceCanvas(layout, t, top + 290, 'Sergei, ForeverInLaw')
    .grid(portraitRows(t), { x: 20, y: 20 - cell * 0.18, cell, rowHeight: cell, reveal: true })
    .grid(nameRows(t), { x: 20, y: top + 20, cell: 380 / NAME_COLUMNS, rowHeight: 6.4, weight: 'bold' })
    .text(20, top + 140, s.primary('ForeverInLaw', 20, true))
    .text(20, top + 164, s.primary(ROLE, 15, true))
    .text(20, top + 198, s.secondary(BIO[0]))
    .text(20, top + 220, s.secondary(BIO[1]))
    .text(20, top + 262, s.primary(COMMAND, 15, true))
    .cursor(20 + COMMAND_WIDTH + 4, top + 250, 9, 16, t.stone[3])
}

const CHIP = { height: 36, size: 15, pad: 14 } as const

/** A contact as a small fixed-height image, so chips sit inline and keep their size on phones. */
function renderChip(contact: Contact, theme: ThemeName): Canvas {
  const t = THEMES[theme]
  const s = ink(t)
  const advance = CHIP.size * ADVANCE
  const width = Math.round(CHIP.pad * 2 + (contact.kind.length + 1 + contact.label.length) * advance)
  const y = CHIP.height / 2 + CHIP.size * 0.36
  return new Canvas(width, CHIP.height, `${contact.kind} ${contact.label}`)
    .frame(0, 0, width, CHIP.height, t.stone[0])
    .text(CHIP.pad, y, s.secondary(contact.kind, CHIP.size))
    .text(CHIP.pad + (contact.kind.length + 1) * advance, y, s.primary(contact.label, CHIP.size, true))
}

function renderHeader(theme: ThemeName, layout: LayoutName, left: string, right: string): Canvas {
  const t = THEMES[theme]
  const s = ink(t)
  const { width, margin } = LAYOUTS[layout]
  if (layout === 'narrow') {
    return sliceCanvas(layout, t, 74, left).text(margin, 34, s.primary(left, 15, true)).text(margin, 58, s.secondary(right, 14))
  }
  return sliceCanvas(layout, t, 52, left).text(margin, 34, s.primary(left, 15, true)).text(width - margin, 34, s.secondary(right), 'end')
}

interface Ranked {
  track: Track
  data: TrackStats
  /** 0 for the project with the most commits, which carries the accent. */
  rank: number
  max: number
}

function renderTrack({ track, data, rank, max }: Ranked, theme: ThemeName, layout: LayoutName): Canvas {
  const t = THEMES[theme]
  const s = ink(t)
  const title: Run = rank === 0 ? s.accent(track.title, 32) : s.primary(track.title, 32, true)
  const meta = `${period(data)} · ${track.notes}`
  const repo = `${track.owner}/${track.repo}`
  const alt = `${track.title}: ${track.description}`
  const bar = [burnRow(t, data.commits, max)]
  if (layout === 'wide') {
    return sliceCanvas(layout, t, 100, alt)
      .text(32, 40, s.secondary('drwxr-xr-x'))
      .text(140, 42, title)
      .grid(bar, { x: 440, y: 20, cell: 9.4, rowHeight: 20 })
      .text(808, 40, s.primary(count(data.commits), 20, true), 'end')
      .text(140, 68, s.primary(track.description))
      .text(140, 90, s.secondary(meta))
      .text(808, 90, s.secondary(repo), 'end')
  }
  const descLines = wrap(track.description, charsFor(380, 15))
  const metaLines = [...wrap(meta, charsFor(380, 14)), repo]
  const top = 110
  const slice = sliceCanvas(layout, t, top + (descLines.length + metaLines.length) * 21 + 14, alt)
    .text(20, 44, title)
    .text(400, 44, s.primary(count(data.commits), 20, true), 'end')
    .grid(bar, { x: 20, y: 52, cell: 380 / BAR_CELLS, rowHeight: 22 })
  descLines.forEach((line, i) => slice.text(20, top + i * 21, s.primary(line)))
  metaLines.forEach((line, i) => slice.text(20, top + (descLines.length + i) * 21, s.secondary(line, 14)))
  return slice
}

function renderClosed(track: ClosedSourceTrack, theme: ThemeName, layout: LayoutName): Canvas {
  const t = THEMES[theme]
  const s = ink(t)
  const wide = layout === 'wide'
  const x = wide ? 140 : LAYOUTS.narrow.margin
  const lines = wrap(track.description, charsFor(wide ? 668 : 380, 15))
  const slice = sliceCanvas(layout, t, 38 + lines.length * 21, `${track.title}: ${track.description}`)
  if (wide) slice.text(32, 26, s.secondary('drwx------'))
  slice.text(x, 26, s.primary(track.title, wide ? 15 : 16, true))
  lines.forEach((line, i) => slice.text(x, 48 + i * 21, s.secondary(line)))
  return slice
}

/** One outlier week would flatten the year, so the scale tops out just above the runner-up. */
function weekScale(weeks: readonly number[]): { scale: number; peak: number; peakIndex: number } {
  const peak = Math.max(...weeks, 1)
  const runnerUp = weeks.toSorted((a, b) => b - a)[1] ?? peak
  return { scale: Math.min(peak, Math.max(1, runnerUp * 1.15)), peak, peakIndex: weeks.indexOf(peak) }
}

/** Year rows sit under the week axis: first baseline offset from the chart floor, then one row per year. */
const YEARS_TOP = 70
const YEAR_STEP = 26

function renderWeeks(stats: Stats, theme: ThemeName, layout: LayoutName): Canvas {
  const t = THEMES[theme]
  const s = ink(t)
  const { width, margin } = LAYOUTS[layout]
  const wide = layout === 'wide'
  const rows = wide ? 22 : 18
  const rowHeight = wide ? 8 : 7
  const colsPer = wide ? 2 : 1
  const cell = (width - 2 * margin) / (stats.weeks.length * colsPer)
  const top = wide ? 74 : 92
  const base = top + rows * rowHeight
  const last = stats.weeks.length - 1
  const { scale, peak, peakIndex } = weekScale(stats.weeks)
  const total = `${count(stats.lastYearTotal)} in the last 12 months`

  const height = base + YEARS_TOP + (stats.years.length - 1) * YEAR_STEP + 24
  const slice = sliceCanvas(layout, t, height, `Contributions week by week: ${total}`)
    .text(margin, 34, s.primary('Contributions, week by week', 15, true))
  if (wide) slice.text(width - margin, 34, s.secondary(total), 'end')
  else slice.text(margin, 58, s.secondary(total, 14))
  slice.grid(ridge(t, stats.weeks, { scale, rows, colsPer, gap: 0, hot: (i) => i === peakIndex }), { x: margin, y: top, cell, rowHeight })

  if (peak > scale) {
    const label = `↑ ${count(peak)} ${peakIndex === last ? 'this week' : 'peak week'}`
    const half = (label.length * 14 * ADVANCE) / 2
    const center = margin + (peakIndex + 0.5) * colsPer * cell
    const x = Math.min(width - margin - half, Math.max(margin + half, center))
    slice.text(x, top - 8, s.accent(label, 14), 'middle')
  }
  slice.text(margin, base + 26, s.secondary(`${monthOf(stats.firstDay)} ${stats.firstDay.getUTCFullYear()}`, 14))
  slice.text(width - margin, base + 26, s.secondary(`${monthOf(stats.lastDay)} ${stats.lastDay.getUTCFullYear()}`, 14), 'end')

  // Every year as a bar on the project rows' grid, so the quiet years and the jump both stay visible.
  const maxYear = Math.max(...stats.years.map((y) => y.total), 1)
  const barX = wide ? 440 : margin + 56
  const barCell = wide ? 9.4 : (width - margin - 60 - barX) / BAR_CELLS
  const current = stats.years.at(-1)?.year
  stats.years.forEach(({ year, total }, i) => {
    const y = base + YEARS_TOP + i * YEAR_STEP
    slice.text(margin, y, s.secondary(year === current ? `${year} so far` : String(year)))
    slice.grid([burnRow(t, total, maxYear)], { x: barX, y: y - 15, cell: barCell, rowHeight: 15 })
    slice.text(width - margin, y, year === current ? s.accent(count(total), 15) : s.primary(count(total), 15, true), 'end')
  })
  return slice
}

function renderHours(stats: Stats, theme: ThemeName, layout: LayoutName): Canvas {
  const t = THEMES[theme]
  const s = ink(t)
  const { width, margin } = LAYOUTS[layout]
  const colsPer = layout === 'wide' ? 3 : 2
  const cell = (width - 2 * margin) / (24 * (colsPer + 1))
  const rows = 10
  const top = 56
  const base = top + rows * 9
  const peak = Math.max(...stats.hours, 1)
  const busiest = stats.hours.indexOf(peak)
  const slice = sliceCanvas(layout, t, base + 44, `Commits by hour of day, busiest at ${hh(busiest)}`)
    .text(margin, 34, s.primary(`Commits by hour, UTC+${UTC_OFFSET}`, 15, true))
    .text(width - margin, 34, s.secondary(`busiest ${hh(busiest)}`), 'end')
    .grid(ridge(t, stats.hours, { scale: peak, rows, colsPer, gap: 1, hot: (h) => NIGHT_HOURS.has(h) }), { x: margin, y: top, cell, rowHeight: 9 })
  for (const hour of [0, 6, 12, 18]) {
    slice.text(margin + hour * (colsPer + 1) * cell, base + 26, s.secondary(String(hour).padStart(2, '0'), 14))
  }
  return slice
}

function renderLog(theme: ThemeName, layout: LayoutName): Canvas {
  const t = THEMES[theme]
  const s = ink(t)
  const { width, margin } = LAYOUTS[layout]
  const budget = charsFor(width - 2 * margin, 15)
  const blocks = [
    { title: '~ $ cat OUTTAKES', lines: OUTTAKES, primary: true },
    { title: '~ $ cat CREDITS', lines: CREDITS, primary: false },
  ]
  const lines: { y: number; run: Run }[] = []
  let y = 34
  for (const block of blocks) {
    lines.push({ y, run: s.primary(block.title, 15, true) })
    y += 32
    for (const line of block.lines) {
      for (const part of wrap(line, budget)) {
        lines.push({ y, run: block.primary ? s.primary(part) : s.secondary(part) })
        y += 22
      }
      y += layout === 'narrow' ? 8 : 4
    }
    y += 28
  }
  const slice = sliceCanvas(layout, t, y - 20, `Outtakes: ${OUTTAKES.join('; ')}. ${CREDITS.join(' ')}`)
  for (const line of lines) slice.text(margin, line.y, line.run)
  return slice
}

const slice = (image: Image): Block => ({ kind: 'slice', image })

/** The profile from top to bottom. The README and the image files both derive from this list. */
export function buildSections(stats: Stats): Block[] {
  const ranked = TRACKS.map((track) => {
    const data = stats.tracks.get(track)
    if (!data) throw new Error(`missing stats for ${track.title}`)
    return { track, data }
  }).toSorted((a, b) => b.data.commits - a.data.commits)
  const max = ranked[0]?.data.commits ?? 1
  const year = stats.years.at(-1)?.year ?? new Date().getUTCFullYear()
  const privateNote = `${count(stats.privateThisYear)} private contributions in ${year}`

  return [
    slice({ name: 'cover', alt: `Sergei, ForeverInLaw, ${ROLE}. ${BIO.join(' ')}`, href: PRIMARY?.href, render: renderCover }),
    {
      kind: 'inline',
      height: CHIP.height,
      images: CONTACTS.map((contact) => ({
        name: `contact-${contact.kind}`,
        alt: `${contact.kind} ${contact.label}`,
        href: contact.href,
        render: (theme) => renderChip(contact, theme),
      })),
    },
    slice({
      name: 'open-source',
      alt: 'Open source, by commits',
      render: (theme, layout) => renderHeader(theme, layout, '~/src $ ls -l', 'open source, by commits'),
    }),
    ...ranked.map(({ track, data }, rank) =>
      slice({
        name: `track-${track.title}`,
        alt: `${track.title}: ${track.description}. ${count(data.commits)} commits, ${period(data)}`,
        href: `https://github.com/${track.owner}/${track.repo}`,
        render: (theme, layout) => renderTrack({ track, data, rank, max }, theme, layout),
      }),
    ),
    slice({
      name: 'closed-source',
      alt: `Closed source: ${privateNote}`,
      render: (theme, layout) => renderHeader(theme, layout, '~/src $ ls -l closed/', privateNote),
    }),
    ...CLOSED_SOURCE.map((track) =>
      slice({
        name: `closed-${track.slug}`,
        alt: `${track.title}: ${track.description}`,
        href: `https://redstone.md/projects/${track.slug}`,
        render: (theme, layout) => renderClosed(track, theme, layout),
      }),
    ),
    slice({
      name: 'weeks',
      alt: `Contributions week by week: ${count(stats.lastYearTotal)} in the last twelve months`,
      render: (theme, layout) => renderWeeks(stats, theme, layout),
    }),
    slice({
      name: 'hours',
      alt: 'Commits by hour of day, busiest late at night',
      render: (theme, layout) => renderHours(stats, theme, layout),
    }),
    slice({ name: 'log', alt: `Outtakes and credits. ${CREDITS.join(' ')}`, render: renderLog }),
  ]
}
