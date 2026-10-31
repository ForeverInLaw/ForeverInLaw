// Editorial content of the record. Everything numeric comes from src/github.ts.

export const LOGIN = 'ForeverInLaw'
export const FIRST_DISCOGRAPHY_YEAR = 2022
export const NIGHT_HOURS = new Set([22, 23, 0, 1, 2, 3])
export const UTC_OFFSET = 2

export interface Track {
  title: string
  owner: string
  repo: string
  tag?: string
  description: string
  stack: string
}

export const SIDE_A: readonly Track[] = [
  {
    title: 'mosh',
    owner: 'redstone-md',
    repo: 'mosh-flutter',
    description: 'Encrypted desktop messenger on moss',
    stack: 'dm, core, calls',
  },
  {
    title: 'shield',
    owner: 'redstone-md',
    repo: 'shield',
    tag: 'tg-spam remix',
    description: 'Telegram moderation, heuristics before LLM',
    stack: 'Go',
  },
]

export const SIDE_B: readonly Track[] = [
  {
    title: 'flucord',
    owner: 'redstone-md',
    repo: 'flucord',
    tag: 'feat. Rxflex',
    description: 'Native Discord client in Flutter, no WebView',
    stack: 'Dart, C++',
  },
  {
    title: 'moss',
    owner: 'redstone-md',
    repo: 'moss',
    tag: 'feat. Rxflex',
    description: 'Embeddable P2P mesh core in Go',
    stack: 'Go',
  },
  {
    title: 'g3',
    owner: 'redstone-md',
    repo: 'g3',
    tag: 'feat. Rxflex',
    description: 'S3-compatible storage on Google Drive',
    stack: 'TypeScript, Go',
  },
]

export const TRACKS: readonly Track[] = [...SIDE_A, ...SIDE_B]

export interface ClosedSourceTrack {
  title: string
  slug: string
  description: string
}

export const SIDE_C: readonly ClosedSourceTrack[] = [
  {
    title: 'Launch VPN',
    slug: 'launch-vpn',
    description: 'Subscriber portal with payments, promo codes and device controls',
  },
  {
    title: 'CustomerAI',
    slug: 'customerai',
    description: 'Visual editor for AI support flows, with handover to a human',
  },
  {
    title: 'Balansear',
    slug: 'balansear',
    description: "Authoritative DNS that routes by the client's ASN and location",
  },
  {
    title: 'Trellis',
    slug: 'owork365',
    description: 'Field-service platform with a Gantt schedule and a mobile portal',
  },
  {
    title: 'Reed',
    slug: 'crooked-arm-s-tma',
    description: 'Telegram Mini App for support tickets',
  },
]

export const OUTTAKES = [
  'fix(persistence): stop the test suite from destroying the real DEK',
  'docs(changelog): stop claiming the telemetry default changed in 0.6.9',
  'fix(core): a send the relay never tried is re-routed, not failed',
  'feat(dm): one moss node, a proven status, and a text that never fails',
] as const

export const CREDITS = [
  'Written and produced by Sergei.',
  'moss, flucord and g3 with Andy (Rxflex).',
  'Guest appearance on qeeqbox/social-analyzer (24.4k stars),',
  'for one package-lock.json.',
] as const

export const CONTACTS = [
  { label: 'zaebal.dev', href: 'https://zaebal.dev' },
  { label: '@nevermorelove', href: 'https://t.me/nevermorelove' },
  { label: 'x@c0.md', href: 'mailto:x@c0.md' },
] as const
