# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Clients and hiring managers** looking for a contractor or engineer. They skim the profile to judge range and seniority, then reach out via Telegram or email.
- **Developers and the open-source community.** They come for the projects (mosh, moss, flucord, g3, shield) and leave into the repositories.

## Product Purpose

The GitHub profile README for Sergei (`ForeverInLaw`), co-founder of redstone.md. It presents his open-source work, closed-source client work, and real activity data in one scroll, and routes visitors to repos, project pages, or contact.

## Positioning

Every number on the page is live: commit counts, contribution waves, hours of day and yearly totals are fetched from GitHub on a daily build, so the profile reports real output instead of claiming it.

## Operating Context

Rendered inside GitHub's profile page (`github.com/ForeverInLaw`), in both GitHub dark and light themes, on desktop and mobile. The visitor sees it under GitHub's own chrome, next to the avatar and sidebar.

## Capabilities and Constraints

- Surface is GitHub README only. GitHub strips CSS and JS, so every visual is a generated SVG image (`src/build.ts` → `assets/*.svg`), stacked full-width, with light/dark variants via `<picture>`.
- SVGs inside `<img>` cannot load external fonts; fonts are subset and inlined per image (`src/canvas.ts`).
- Data comes from `src/github.ts`; editorial content lives in `src/content.ts`. A GitHub Action refreshes the build daily.
- Each section image can carry one link (repo, project page, site).
- The LP/record metaphor (sides, runtime, outtakes, credits) is **not** a commitment and may be replaced. Facts are kept: projects, descriptions, stacks, collaborators, stats, contacts.

## Brand Commitments

- Name shown as "Sergei"; handle `ForeverInLaw`; label/company `redstone.md`.
- Contacts: zaebal.dev, Telegram @nevermorelove, x@c0.md.
- Collaborator credit: moss, flucord and g3 with Andy (Rxflex).
- Spotify now-playing widget (external SVG) stays.

## Evidence on Hand

- Open source: mosh, shield (tg-spam remix), flucord, moss, g3 — repos under `redstone-md`.
- Closed source: Launch VPN, CustomerAI, Balansear, Trellis, Reed — pages on redstone.md.
- Live stats: per-repo commits and active periods, weekly contributions (12 months), commits by hour (UTC+2, late-night heavy), yearly totals since 2022, private contributions this year.
- Real commit messages (outtakes) and a guest contribution to qeeqbox/social-analyzer.
- Avatar brightness grid (96×96) for the glyph portrait in `src/portrait.ts`.
- No testimonials, client logos, or revenue figures exist; do not invent them.

## Product Principles

1. Real data over claims: anything numeric is fetched, never typed in.
2. Both doors open: a client finds the contact, a developer finds the repo, without either hunting.
3. Personality through specifics: real commit messages, real hours, real names.
4. Works under GitHub's constraints in both themes and at mobile width.
