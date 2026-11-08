// Editorial content of the profile. Everything numeric comes from src/github.ts.

export const LOGIN = 'ForeverInLaw'
export const FIRST_YEAR = 2022
export const NIGHT_HOURS = new Set([22, 23, 0, 1, 2, 3])
export const UTC_OFFSET = 2

export const ROLE = 'co-founder of redstone.md'
export const BIO = ['Networking, encrypted chat, web apps', 'and bots, mostly closed source.'] as const

export interface Track {
  title: string
  owner: string
  repo: string
  description: string
  /** Stack and credits, shown after the active period. */
  notes: string
}

/** Open-source work. The README ranks it by commits, so order here does not matter. */
export const TRACKS: readonly Track[] = [
  { title: 'mosh', owner: 'redstone-md', repo: 'mosh-flutter', description: 'Encrypted desktop messenger on moss', notes: 'dm, core, calls' },
  { title: 'shield', owner: 'redstone-md', repo: 'shield', description: 'Telegram moderation, heuristics before LLM', notes: 'Go · tg-spam remix' },
  { title: 'flucord', owner: 'redstone-md', repo: 'flucord', description: 'Native Discord client in Flutter, no WebView', notes: 'Dart, C++ · with Rxflex' },
  { title: 'moss', owner: 'redstone-md', repo: 'moss', description: 'Embeddable P2P mesh core in Go', notes: 'Go · with Rxflex' },
  { title: 'g3', owner: 'redstone-md', repo: 'g3', description: 'S3-compatible storage on Google Drive', notes: 'TypeScript, Go · with Rxflex' },
]

export interface ClosedSourceTrack {
  title: string
  slug: string
  description: string
}

export const CLOSED_SOURCE: readonly ClosedSourceTrack[] = [
  { title: 'Launch VPN', slug: 'launch-vpn', description: 'Subscriber portal with payments, promo codes and device controls' },
  { title: 'CustomerAI', slug: 'customerai', description: 'Visual editor for AI support flows, with handover to a human' },
  { title: 'Balansear', slug: 'balansear', description: "Authoritative DNS that routes by the client's ASN and location" },
  { title: 'Trellis', slug: 'owork365', description: 'Field-service platform with a Gantt schedule and a mobile portal' },
  { title: 'Reed', slug: 'crooked-arm-s-tma', description: 'Telegram Mini App for support tickets' },
]

export const OUTTAKES = [
  'fix(persistence): stop the test suite from destroying the real DEK',
  'docs(changelog): stop claiming the telemetry default changed in 0.6.9',
  'fix(core): a send the relay never tried is re-routed, not failed',
  'feat(dm): one moss node, a proven status, and a text that never fails',
] as const

export const CREDITS = [
  'Written by Sergei. moss, flucord and g3 with Andy (Rxflex).',
  'Guest commit on qeeqbox/social-analyzer (24.4k stars): one exclamation mark.',
] as const

export const NOW_PLAYING_URL = 'https://spotify-now-playing.foreverinlaw.workers.dev/now-playing.svg'

export interface Contact {
  /** Short label set before the value on the chip. */
  kind: string
  label: string
  href: string
}

/** The first contact is the primary door: the cover links to it and its command sits on the cover. */
export const CONTACTS: readonly Contact[] = [
  { kind: 'tg', label: '@nevermorelove', href: 'https://t.me/nevermorelove' },
  { kind: 'mail', label: 'x@c0.md', href: 'mailto:x@c0.md' },
  { kind: 'web', label: 'zaebal.dev', href: 'https://zaebal.dev' },
  { kind: 'gh', label: 'redstone-md', href: 'https://github.com/redstone-md' },
]
