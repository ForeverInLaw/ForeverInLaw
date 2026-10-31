import { Octokit } from 'octokit'
import { FIRST_DISCOGRAPHY_YEAR, LOGIN, TRACKS, UTC_OFFSET, type Track } from './content.ts'

export interface TrackStats {
  commits: number
  first: Date
  last: Date
}

export interface YearTotal {
  year: number
  total: number
}

export interface Stats {
  tracks: ReadonlyMap<Track, TrackStats>
  /** One commit is one second of the record. */
  runtimeSeconds: number
  weeks: readonly number[]
  firstDay: Date
  lastDay: Date
  lastYearTotal: number
  years: readonly YearTotal[]
  privateThisYear: number
  hours: readonly number[]
}

interface PublicContributions {
  user: {
    contributionsCollection: {
      totalCommitContributions: number
      totalIssueContributions: number
      totalPullRequestContributions: number
      totalPullRequestReviewContributions: number
      totalRepositoryContributions: number
    }
  }
}

const CALENDAR_URL = `https://github.com/users/${LOGIN}/contributions`
const CELL_RE = /data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-\d+-\d+)"/g
const TIP_RE = /<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)</g

async function fetchCalendarHtml(query = ''): Promise<string> {
  const res = await fetch(CALENDAR_URL + query, { headers: { Accept: 'text/html' } })
  if (!res.ok) throw new Error(`contribution calendar: HTTP ${res.status}`)
  return res.text()
}

/** The public calendar fragment is the only tokenless source that includes private work. */
async function fetchDays(): Promise<{ date: string; count: number }[]> {
  const html = await fetchCalendarHtml()
  const counts = new Map<string, number>()
  for (const [, id, label] of html.matchAll(TIP_RE)) {
    if (id && label) counts.set(id, Number(/^\d+/.exec(label.trim())?.[0] ?? 0))
  }
  const days = [...html.matchAll(CELL_RE)].map(([, date, id]) => ({
    date: date ?? '',
    count: counts.get(id ?? '') ?? 0,
  }))
  if (days.length < 300) throw new Error(`contribution calendar: parsed only ${days.length} days`)
  return days.sort((a, b) => a.date.localeCompare(b.date))
}

async function fetchYearTotal(year: number): Promise<number> {
  const html = await fetchCalendarHtml(`?from=${year}-01-01&to=${year}-12-31`)
  const match = new RegExp(`([\\d,]+)\\s+contributions?\\s+in\\s+${year}`).exec(html)
  if (!match?.[1]) throw new Error(`contribution calendar: no total for ${year}`)
  return Number(match[1].replaceAll(',', ''))
}

async function fetchPublicTotal(octokit: Octokit, year: number): Promise<number> {
  const { user } = await octokit.graphql<PublicContributions>(
    `query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalRepositoryContributions
        }
      }
    }`,
    { login: LOGIN, from: `${year}-01-01T00:00:00Z`, to: `${year}-12-31T23:59:59Z` },
  )
  return Object.values(user.contributionsCollection).reduce((sum, n) => sum + n, 0)
}

async function fetchCommitDates(octokit: Octokit, track: Track): Promise<Date[]> {
  const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
    owner: track.owner,
    repo: track.repo,
    author: LOGIN,
    per_page: 100,
  })
  return commits.flatMap((c) => (c.commit.author?.date ? [new Date(c.commit.author.date)] : []))
}

function chunkWeeks(counts: readonly number[]): number[] {
  const weeks: number[] = []
  for (let i = 0; i < counts.length; i += 7) {
    weeks.push(counts.slice(i, i + 7).reduce((sum, n) => sum + n, 0))
  }
  return weeks
}

/** Any failure rejects, so a broken run never overwrites the committed images. */
export async function fetchStats(token: string): Promise<Stats> {
  const octokit = new Octokit({ auth: token })
  const currentYear = new Date().getUTCFullYear()
  const yearList = Array.from(
    { length: currentYear - FIRST_DISCOGRAPHY_YEAR + 1 },
    (_, i) => FIRST_DISCOGRAPHY_YEAR + i,
  )

  const [commitDates, days, totals, publicThisYear] = await Promise.all([
    Promise.all(TRACKS.map((track) => fetchCommitDates(octokit, track))),
    fetchDays(),
    Promise.all(yearList.map(fetchYearTotal)),
    fetchPublicTotal(octokit, currentYear),
  ])

  const tracks = new Map<Track, TrackStats>()
  const hours = Array.from({ length: 24 }, () => 0)
  TRACKS.forEach((track, i) => {
    const dates = (commitDates[i] ?? []).toSorted((a, b) => a.getTime() - b.getTime())
    const first = dates[0]
    const last = dates.at(-1)
    if (!first || !last) throw new Error(`no commits found for ${track.owner}/${track.repo}`)
    tracks.set(track, { commits: dates.length, first, last })
    for (const date of dates) {
      const hour = (date.getUTCHours() + UTC_OFFSET) % 24
      hours[hour] = (hours[hour] ?? 0) + 1
    }
  })

  const years = yearList.map((year, i) => ({ year, total: totals[i] ?? 0 }))
  const thisYearTotal = years.at(-1)?.total ?? 0
  const firstDay = days[0]
  const lastDay = days.at(-1)
  if (!firstDay || !lastDay) throw new Error('contribution calendar: no days')

  return {
    tracks,
    runtimeSeconds: [...tracks.values()].reduce((sum, t) => sum + t.commits, 0),
    weeks: chunkWeeks(days.map((d) => d.count)),
    firstDay: new Date(firstDay.date),
    lastDay: new Date(lastDay.date),
    lastYearTotal: days.reduce((sum, d) => sum + d.count, 0),
    years,
    privateThisYear: Math.max(0, thisYearTotal - publicThisYear),
    hours,
  }
}
