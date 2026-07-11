<!-- =================================================================== -->
<!--                          HERO                                       -->
<!-- =================================================================== -->

<a href="https://github.com/ForeverInLaw">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:7C3AED,100:22D3EE&height=240&section=header&text=ForeverInLaw&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=systems%20%E2%80%A2%20agents%20%E2%80%A2%20edge%20%E2%80%A2%20things%20that%20refuse%20to%20break&descAlignY=60&descSize=18" alt="header" width="100%" />
</a>

<div align="center">

[![typing](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&duration=2400&pause=700&color=7C3AED&center=true&vCenter=true&width=900&lines=Go+%E2%80%A2+TypeScript+%E2%80%A2+Python+%E2%80%A2+infra+%E2%80%A2+ai-agents;most+of+the+real+work+ships+behind+private+repos;i+build+stuff+that+annoys+me+until+it+stops+annoying+me;zaebal.dev+%E2%80%94+because+I%27m+done+with+broken+software)](https://github.com/ForeverInLaw)

</div>

<div align="center">

  <a href="https://zaebal.dev"><img src="https://img.shields.io/badge/zaebal.dev-7C3AED?style=for-the-badge&logo=hyperledger&logoColor=white&labelColor=0d1117" /></a>
  <a href="https://t.me/nevermorelove"><img src="https://img.shields.io/badge/telegram-%40nevermorelove-22D3EE?style=for-the-badge&logo=telegram&logoColor=white&labelColor=0d1117" /></a>
  <a href="mailto:x@c0.md"><img src="https://img.shields.io/badge/mail-x%40c0.md-22D3EE?style=for-the-badge&logo=maildotru&logoColor=white&labelColor=0d1117" /></a>
  <a href="https://github.com/ForeverInLaw?tab=followers"><img src="https://img.shields.io/github/followers/ForeverInLaw?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=7C3AED&label=followers" /></a>
  <img src="https://komarev.com/ghpvc/?username=ForeverInLaw&style=for-the-badge&color=22D3EE&label=visitors&labelColor=0d1117" />

</div>

<br/>

<!-- =================================================================== -->
<!--                          whoami                                     -->
<!-- =================================================================== -->

```sh
$ whoami --verbose
```

```ts
const sergei = {
  alias:     "ForeverInLaw",
  role:      "engineer / builder / system plumber",
  org:       "redstone.md — co-founder, open-source R&D (P2P networking, AI moderation)",
  stack:     ["Go", "TypeScript", "Python", "Rust-curious"],
  domains:   ["ai-agents", "e2ee & security", "edge & proxies", "telegram bots", "devtools"],
  shipping:  ["moss", "mosh", "shield", "screenstyler", "whispertocode", "corpcoreai"],
  beliefs:   [
    "code that ships > code that's elegant",
    "private repos > demo repos",
    "if it annoys you twice, automate it",
  ],
  status:    "shipping. always.",
};
```

<br/>

<!-- =================================================================== -->
<!--                          FOCUS                                      -->
<!-- =================================================================== -->

## ▍ what I build

- **AI agents & operator tooling** — multi-model routing, RAG pipelines (LangChain, FAISS), Telegram-native UX, eval loops
- **Security & E2EE** — Noise Protocol, MLS/OpenMLS, white-box security audits, authn/authz hardening
- **Edge & networking** — P2P meshes, NAT traversal, GeoDNS, TCP/UDP reverse proxies, traffic shaping
- **Multi-tenant SaaS** — Postgres row-level security for tenant isolation, offline-first PWAs, RBAC
- **Bots & automation** — Discord, Telegram, Steam, Spotify, escrow, support, "do-this-for-me" daemons
- **Infra & launchers** — config sync, restart APIs, health gateways, deploy pipelines for tiny ARM boxes
- **Side-quests** — game modding, scrapers, downloaders, anything that scratches an itch in under a weekend

<br/>

<!-- =================================================================== -->
<!--                          SELECTED WORK                              -->
<!-- =================================================================== -->

## ▍ selected work

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>🌿 MOSS</h3>
      <sub>Go · P2P · CGO · Noise</sub><br/><br/>
      <a href="https://github.com/redstone-md/moss">redstone-md/moss</a> — embeddable P2P mesh core, ~25k LOC Go. Noise XX/IK encrypted transport, topic pubsub with peer scoring, NAT traversal (hole punching, STUN, UPnP, relay fallback). Shipped as a C-shared library with FFI bindings for C/C++/C#/Python/Rust. ~0.86 test-to-source ratio: unit, integration, fuzz, multi-node churn in CI.
    </td>
    <td width="33%" valign="top">
      <h3>💬 MOSH</h3>
      <sub>TS · React · Tauri · Rust</sub><br/><br/>
      <a href="https://github.com/redstone-md/mosh">redstone-md/mosh</a> — desktop E2EE messenger on the MOSS runtime. OpenMLS (RFC 9420) group encryption, encrypted voice calls (AES-GCM-sealed Opus), React + Tauri v2/Rust backend with live <code>libmoss</code> lifecycle and a connection state machine that recovers after failed NAT punches.
    </td>
    <td width="33%" valign="top">
      <h3>🛡️ Shield</h3>
      <sub>Go · Telegram · LLM moderation</sub><br/><br/>
      <a href="https://github.com/redstone-md/shield">redstone-md/shield</a> — self-hosted Telegram moderation platform, 240+ commits on top of upstream tg-spam. Fast-path heuristics (Bayes, similarity, CAS) + slow-path LLM/Vision escalation (OpenAI, Gemini) behind circuit breakers and token budgets. Multi-tenant control plane, live-versioned rule sets, Lua plugins, SQLite/Postgres.
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <h3>📸 ScreenStyler</h3>
      <sub>TS · Next.js · local-first</sub><br/><br/>
      <a href="https://github.com/ForeverInLaw/screenstyler">screenstyler</a> — browser-based screenshot editor &amp; device mockup tool. Two modes: zero-cloud local-first (projects in IndexedDB) or cloud (Neon Postgres, Cloudflare R2, passwordless auth). Undo/redo history, Docker image that self-applies DB migrations, Vitest + Playwright suites.
    </td>
    <td width="33%" valign="top">
      <h3>🎙️ whispertocode</h3>
      <sub>Python · ASR · devtools</sub><br/><br/>
      <a href="https://github.com/ForeverInLaw/whispertocode">whispertocode</a> — speech → working code, end to end. Typing is slower than thinking out loud.
    </td>
    <td width="33%" valign="top">
      <h3>🤖 CorpCoreAI</h3>
      <sub>TS · Next.js · Telegram WebApp · LLM</sub><br/><br/>
      <a href="https://github.com/ForeverInLaw/CorpCoreAI">CorpCoreAI</a> — Telegram bot + Telegram WebApp (Next.js) for corporate task flow. NL task intake, NVIDIA Minimax for titling/subtasks, Postgres via Prisma, role-scoped UI, hourly reminder scheduler with day-of/overdue/manager-escalation alerts.
    </td>
  </tr>
</table>

> public list is visible 10%. real firepower lives in private repos — **corelogicx**, **axiomechat**, **harald**, **bananalyze**, **mlefia**, **owork365**, plus a graveyard of profitable internal tools.

<br/>

<!-- =================================================================== -->
<!--                          STACK                                      -->
<!-- =================================================================== -->

## ▍ stack

<div align="center">

<table>
<tr>
<td align="center" width="120"><b>languages</b></td>
<td><img src="https://skillicons.dev/icons?i=go,ts,js,python,rust,cs,bash" /></td>
</tr>
<tr>
<td align="center" width="120"><b>backend</b></td>
<td><img src="https://skillicons.dev/icons?i=nodejs,bun,fastapi,nestjs,express,graphql,tauri" /></td>
</tr>
<tr>
<td align="center" width="120"><b>frontend</b></td>
<td><img src="https://skillicons.dev/icons?i=react,nextjs,vite,tailwind,threejs" /></td>
</tr>
<tr>
<td align="center" width="120"><b>ai / ml</b></td>
<td><img src="https://skillicons.dev/icons?i=pytorch,sklearn,opencv" /></td>
</tr>
<tr>
<td align="center" width="120"><b>data</b></td>
<td><img src="https://skillicons.dev/icons?i=postgres,mysql,sqlite,mongodb,redis,prisma,supabase" /></td>
</tr>
<tr>
<td align="center" width="120"><b>infra</b></td>
<td><img src="https://skillicons.dev/icons?i=docker,nginx,linux,cloudflare,vercel,aws,git,githubactions,prometheus,grafana" /></td>
</tr>
<tr>
<td align="center" width="120"><b>daily driver</b></td>
<td><img src="https://skillicons.dev/icons?i=neovim,vscode,windows,powershell,obsidian,arch" /></td>
</tr>
</table>

</div>

<br/>

<!-- =================================================================== -->
<!--                          STATS                                      -->
<!-- =================================================================== -->

## ▍ stats

<div align="center">

<img height="200" src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=ForeverInLaw&theme=tokyonight" />
<img height="200" src="https://streak-stats.demolab.com?user=ForeverInLaw&hide_border=true&background=0D1117&stroke=7C3AED&ring=22D3EE&fire=22D3EE&currStreakLabel=22D3EE&sideLabels=E6EDF3&currStreakNum=E6EDF3&dates=8B949E&sideNums=E6EDF3" />

</div>

<div align="center">

<img height="200" src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=ForeverInLaw&theme=tokyonight" />
<img height="200" src="https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=ForeverInLaw&theme=tokyonight&utcOffset=2" />

</div>

<div align="center">
<a href="https://github.com/ForeverInLaw">
  <img width="98%" src="https://github-readme-activity-graph.vercel.app/graph?username=ForeverInLaw&bg_color=0D1117&color=22D3EE&line=7C3AED&point=ffffff&area=true&area_color=7C3AED&hide_border=true&custom_title=contribution%20pulse" />
</a>
</div>

<br/>

<!-- =================================================================== -->
<!--                          QUOTE                                      -->
<!-- =================================================================== -->

<div align="center">

<img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" />

</div>

<br/>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:22D3EE,50:7C3AED,100:0d1117&height=110&section=footer" width="100%" />
</div>
