---
name: ForeverInLaw
description: A GitHub profile drawn as one phosphor character grid, where glyph density is light.
colors:
  stone-primary: "#e6e5e4"
  stone-secondary: "#b8b1a9"
  stone-dim: "#8c857b"
  stone-faint: "#4f4943"
  amber: "#ffb43a"
  stone-primary-light: "#2d2824"
  stone-secondary-light: "#5d564e"
  stone-dim-light: "#6f685e"
  stone-faint-light: "#c9c3bb"
  amber-light: "#8f4a0a"
typography:
  display:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0em"
  headline:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0em"
  title:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.45
    letterSpacing: "0em"
  body:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  none: "0px"
spacing:
  margin-narrow: "20px"
  margin-wide: "32px"
  line: "21px"
  block: "32px"
  slice-wide: "840px"
  slice-narrow: "420px"
components:
  contact-chip:
    backgroundColor: "transparent"
    textColor: "{colors.stone-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "36px"
  section-header:
    textColor: "{colors.stone-primary}"
    typography: "{typography.title}"
    height: "52px"
  track-title:
    textColor: "{colors.stone-primary}"
    typography: "{typography.display}"
  track-title-top:
    textColor: "{colors.amber}"
    typography: "{typography.display}"
  burn-bar:
    textColor: "{colors.stone-primary}"
    width: "30 cells"
---

# Design System: ForeverInLaw

## Overview

**Creative North Star: "The Phosphor Grid"**

Everything on the profile is one monospace character grid, and glyph density stands in for light. The avatar, the name, the per-project bars, the year of contributions and the hours of the day are all drawn from the same ten-step ramp (` .:-=+*#%@`). There are no solid fills, no charts in the dashboard sense, and no badges: a value is shown as how densely a run of characters burns. The terminal idiom (prompts like `~/src $ ls -l`, `drwxr-xr-x` permission columns, `cat` blocks, a blinking cursor) is the native grammar of the world, not decoration on top of it.

The palette is stone sampled from the avatar plus a single amber reserved for data peaks. The surface is GitHub's README column, which strips CSS and JS, so every visual is a generated SVG slice stacked full-width, each with its own subset of JetBrains Mono inlined. Neither theme paints a ground: the slices are transparent and ink sits directly on GitHub's own page colour (dark #0d1117, light white), because GitHub leaves a gap of page colour between stacked images and any painted slab would show a seam under every slice.

The same system is consumed outside this repo by the Spotify now-playing card (`D:\bprojects\me\worker\spotify-now-playing.js`), which closes the README: same stone and amber tiers, same ramp, a glyph-rendered album cover, JetBrains Mono inlined, and the same 840/420 wide/narrow widths and margins.

**Key Characteristics:**
- One luminance ramp draws portrait, letterforms, bars and charts.
- Stone in four reading tiers, amber only on data peaks.
- One typeface, JetBrains Mono, at two weights (400, 800).
- Transparent slices over GitHub's page colour in both themes.
- Two layouts per slice: 840 wide, 420 narrow, swapped by `<picture>` media.
- Terminal prompts as section headers, square 1px frames, no radius.

## Colors

Warm stone in four tiers per theme, from faintest to primary reading weight, with one amber accent per theme. Dark and light are separate tier sets, not inversions: on dark the portrait is a glowing negative, on light an ink positive.

### Primary
- **Peak Amber** (dark `amber`, light `amber-light`): the only accent. It marks the top project's title, the current year's total, the peak week's label and crest, and the night-hour crests (22:00 to 03:00). It is never assigned by glyph density.

### Neutral
- **Bone** (`stone-primary` / `stone-primary-light`): primary reading weight. Names, track titles, descriptions, counts, prompts, the cursor, the densest glyphs.
- **Ash** (`stone-secondary` / `stone-secondary-light`): secondary text. Bio, metadata, periods, repo paths, axis labels, permission columns, chip kind prefixes.
- **Dust** (`stone-dim` / `stone-dim-light`): mid-density glyphs only (ramp steps 3-4). Not used for text.
- **Shadow Stone** (`stone-faint` / `stone-faint-light`): the faintest glyphs, the dotted track under short bars, and chip frames.

### Named Rules
**The Peak-Only Amber Rule.** Amber marks a data peak and nothing else: the top-ranked project, the current year, the spike week, the night hours. If it is not a peak in real data, it is stone.

**The No-Ground Rule.** Slices are transparent in both themes. Ink sits on GitHub's own page colour; never paint a background slab, it seams between stacked images.

**The Density-Is-Tier Rule.** Glyph density maps to stone tier (ramp 0-2 faint, 3-4 dim, 5-6 secondary, 7-9 primary). Denser glyph, brighter tier.

## Typography

**Display Font:** JetBrains Mono (subset and inlined per SVG)
**Body Font:** JetBrains Mono
**Label/Mono Font:** JetBrains Mono

**Character:** One monospace at regular (400) and extra-bold (800). Its exact 0.6em advance is what keeps the character grid square, so every bar, chart and letterform aligns to columns.

### Hierarchy
- **Display** (800, 32px): project titles in the open-source list.
- **Headline** (800, 20px): the handle under the name, and per-project commit counts.
- **Title** (800, 15px): prompts and section headers, closed-source titles, the cover command, chip labels.
- **Body** (400, 15px, 21-22px line pitch): descriptions, bio, outtakes and credits.
- **Label** (400, 14px): metadata on narrow, axis labels, the peak-week marker.
- **Block letters**: the name SERGEI is not set in type; it is a 5x7 pixel font where each pixel is a 2x2 patch of 800-weight ramp glyphs, densest at the top and settling downward.

### Named Rules
**The One Face Rule.** JetBrains Mono only, 400 and 800. Hierarchy comes from size, weight and stone tier, never a second family.

**The Line Budget Rule.** Text wraps greedily to the monospace character budget of its column (`floor(width / (size x 0.6))`), never by measured pixels.

## Layout

Every section is a full-width slice rendered in two layouts. Wide (840px, 32px margins) ships to desktop; narrow (420px, 20px margins) replaces it below a 600px viewport, where wide text would shrink below reading size. `<picture>` sources are ordered narrow before wide and light before dark.

Wide slices use a fixed column grid: permission column at x=32, titles and descriptions at x=140, bars at x=440 (30 cells at 9.4px), right-aligned counts and paths at x=808. The cover splits into a text column on the left and a 420px square glyph portrait on the right. Narrow collapses to a single column: portrait on top, then name, text, and bars stacked under their titles, with right-hand labels moved under the header.

Vertical rhythm is line-based: 21-22px between text lines, roughly 32px between a header and its first line. Contact chips are the one inline group, sitting in a row directly under the cover.

## Elevation & Depth

Flat. There are no shadows, layers or surfaces. Depth is carried by glyph density and stone tier alone. The one atmospheric effect is a soft phosphor glow (`drop-shadow(0 0 2.5px)` in translucent primary stone) on character grids in the dark theme only; light has none.

### Named Rules
**The Glow-Is-Dark-Only Rule.** Phosphor glow belongs to ink on a dark screen. Light theme is ink on paper and carries no glow.

## Shapes

Square everything. The only drawn outline is a 1px frame in faint stone, inset by half a pixel, around contact chips; no radius anywhere. All other forms are character cells: bars, ridges and letterforms are runs of glyphs, never rectangles.

## Components

### Contact chip
Small, fixed-height (36px) inline image so chips keep their size on phones. 1px faint-stone frame, 14px horizontal padding, kind prefix (`tg`, `mail`, `web`, `gh`) in secondary stone at 400, label in primary stone at 800, both 15px. Each chip links to its contact.

### Section header
A shell prompt (`~/src $ ls -l`) in primary title weight on the left, with a secondary-stone note right-aligned on wide or stacked beneath on narrow.

### Track row
Permission column (`drwxr-xr-x` / `drwx------`) in secondary stone, the title in display size, a burn bar, a headline-size count, then description in primary and metadata in secondary. The top project's title is amber. Closed-source rows are text only, no bar.

### Burn bar (signature)
A value as 30 cells that burn from the densest glyph down through the ramp, over a faint `.` track so short bars still sit on a line. Minimum three filled cells. Used for per-project commits and per-year totals on the same grid.

### Ridge chart (signature)
Columns of glyphs with a crest (`@%#*+=-::.`): densest at the top, thinning toward the floor. Heights are square-root scaled. Hot columns burn amber on their top three rows; non-hot columns drop one stone tier. Used for weeks of the year and hours of the day.

### Glyph portrait (signature)
96x96 cells from the avatar's brightness grid, density following darkness. Rows reveal top to bottom on load (0.5s each, 15ms stagger, expo-out ease). Disabled under reduced motion.

### Cursor
A 9x16 primary-stone block after the cover command, blinking at 1.06s in hard steps. Disabled under reduced motion.

## Do's and Don'ts

### Do:
- **Do** draw every quantity from the ramp ` .:-=+*#%@`, mapping density to stone tier.
- **Do** keep amber for real data peaks: top project, current year, spike week, night hours.
- **Do** render every slice in both layouts (840/32 and 420/20) and both themes.
- **Do** leave slices transparent so ink sits on GitHub's page colour.
- **Do** use shell idiom (prompts, permission columns, `cat`) for section structure.
- **Do** inline only the glyphs a slice uses, as a JetBrains Mono woff2 subset.

### Don't:
- **Don't** use solid fills for bars, charts or letterforms; build them from glyph runs.
- **Don't** paint a background in either theme.
- **Don't** use amber for emphasis, links or decoration.
- **Don't** introduce a second typeface or corner radius.
- **Don't** add badge or stats-card images; every number is a fetched value drawn in the grid.
- **Don't** apply the phosphor glow in the light theme.
