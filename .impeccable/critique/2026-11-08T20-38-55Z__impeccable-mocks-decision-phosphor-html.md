---
target: phosphor mock
total_score: 10
max_score: 20
na_heuristics: 3,5,7,9,10
p0_count: 2
p1_count: 2
target_identity: "file:D:\\bprojects\\ForeverInLaw\\.impeccable\\mocks\\decision\\phosphor.html"
target_fingerprint: "sha256:23403e24d8cdcdfee981802684201e805fc89f06daa7c83a0bc5ecd8249b8508"
target_path: "D:\\bprojects\\ForeverInLaw\\.impeccable\\mocks\\decision\\phosphor.html"
timestamp: 2026-11-08T20-38-55Z
slug: impeccable-mocks-decision-phosphor-html
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | No "updated" stamp; 7,526 (12 mo) next to 7,256 (2026) reads as a typo |
| 2 | Match System / Real World | 2 | Clients must decode drwxr-xr-x, grep, wc -l, slugs |
| 3 | User Control and Freedom | n/a | static images |
| 4 | Consistency and Standards | 2 | amber "peak" on every bar head; grep stop shows lines without "stop" |
| 5 | Error Prevention | n/a | no input |
| 6 | Recognition Rather Than Recall | 2 | contacts shown as pictures at top, clickable only at the end |
| 7 | Flexibility and Efficiency | n/a | README |
| 8 | Aesthetic and Minimalist Design | 2 | permission column noise, ~20 amber spots, wave squashed by one spike |
| 9 | Error Recovery | n/a | nothing to recover |
| 10 | Help and Documentation | n/a | captions act as legends |
| **Total** | | **10/20** | **Acceptable (50%)** |

## Priority issues
- P0 Text unreadable on phones: 840 viewBox scaled to ~350px → body 15px→6.3px, meta 13px→5.4px.
- P0 No working doors near top: projects as one image can't link per repo; contacts are pictures; redstone-md never named.
- P1 Amber accent spent ~20 times (bar heads, every crest >25, corner of SERGEI); peak means nothing.
- P1 Data/copy credibility: 7,526 vs 7,256; grep stop lists non-matching lines; 72/45/27 dormant years.
- P2 Flat scale (13/14/15, 20/22/26); section prompts same as meta; drwx t1 fails AA (4.23 dark, 2.98 light); wave squashed by 170 spike.
- P2 Portrait: bright background dominates, face in shadow; 175px grey texture on phone.
- P3 Light mode: grey #e6e5e4 slices on white GitHub, brown peak #a8560c 4.17:1.

## Detector
79 findings, all false positives: 78 low-contrast (reads SVG text CSS color #000 vs page, ignores fill), 1 em-dash-overuse (counts `--` in flags/glyph art). Overlay blocked (ERR_BLOCKED_BY_CLIENT from data: page).
