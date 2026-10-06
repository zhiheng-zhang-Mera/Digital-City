# UI-103 — DEVELOPMENT REPORT

```text
MISSION                    = UI-103 (Rooms 统一视觉与嵌入体验)
PHASE                      = UI_CIVILIZATION
REPORT_ROLE                = DEVELOPMENT
HOST                       = Mech
BASELINE_POLICY            = CLAIM_TIME_MAIN
BASELINE_SHA               = e7c498f5acd86da324a45c3278219c8daa612561
BRANCH                     = ui/UI-103-rooms-visual-unification
HEAD_SHA                   = 399a1c118fa0016e7f30ce8f0e3ba01917b39db1
DEVELOPMENT_CI             = 36866763373-success-android-and-gateway-web
VISUAL_DIRECTION_SOURCE    = mission-book/reports/UI-000/OWNER_STYLE_RULING.md (adopted C2)
DEVELOPMENT_COMPLETE       = true
REVIEW_HOST                = not claimed (see §7)
```

## 1. The engineering decision that shaped this task

UI-103 forbids "逐个房间复制一套独立 CSS". Before writing anything I checked whether that
constraint is satisfiable, and it is — decisively:

```text
var(--  occurrences across apps/rooms/rooms/**/client.mjs and shared/client-kit.js  =  0
```

`apps/rooms/hub/public/hub.css` is the only stylesheet in `apps/rooms`, and every Room styles itself
exclusively through its shared classes. So porting the adopted direction is a **token + shared
primitive change in one file**, and all ten Rooms inherit it with **zero room-module edits**.

The design choice that makes this work: token **names** are unchanged from the old palette
(`--bg`, `--panel`, `--panel-2`, `--line`, `--text`, `--muted`, `--accent`, …). Only their *values*,
and the primitives built on them, moved. Renaming would have forced edits across ten modules for no
product benefit.

## 2. What changed

| Area | Change |
|---|---|
| Tokens | Adopted C2 values: `--void/--bg #08070f`, `--panel #14121f`, `--panel-2 #1b1830`, violet structural `#8b5cf6`, lime signal `#c6f24e`, hologram cyan `#5ee7ff` |
| `--muted` | Re-derived, not copied: it must stay WCAG AA on the *new* panels. Measured 4.93:1 on `--panel-2` and 5.28:1 on `--panel` |
| HUD primitives | Clipped-corner panels/buttons (`clip-path`, `--radius: 0`), corner bracket, hairline violet borders, wide-tracked uppercase micro-labels, segmented stat fill, faint scanline backdrop — **all drawn with CSS boxes, never glyphs** |
| Shell | Rail reads `UTOPIA / ROOMS / 本地工具`; status reads `10 个本地工具 · 已就绪`; room pill reads `会保存在本机` |
| Diagnostics | `LOCAL · 127.0.0.1`, the listening origin, the runtime directory and the room-pack version moved into a collapsed `运行详情` disclosure |
| Embedded mode | `?embedded=1` drops the hub's own rail so the Web shell owns the chrome |
| Favicon | Added; the hub was 404ing `/favicon.ico` on every load |

The runtime path is worth calling out: the hub previously printed `persistent · .runtime/knowledge.json`
as the room's product subtitle. UI-103 forbids exactly that, so the subtitle became `会保存在本机`
and the path moved into diagnostics.

## 3. Verification

`scripts/ui-103/verify-hub.mjs` was written for this task. The risk this change carries is
**regression across ten rooms**, not a missing feature, so the probe mounts every room in a real
browser and asserts per room:

```text
rooms mounted                              10/10
page errors                                0
console errors                             0
dev-tool strings on the default path       0   (ROOM PACK V1 / 127.0.0.1 / .runtime-rooms/ / persistent ·)
diagnostics present and collapsed          yes (all 10)
WCAG AA contrast failures on the hub       0
```

Per-room mounted nodes: knowledge 44, bookmarks 45, checklist 37, prompts 49, text-workshop 38,
hash 23, data-lab 23, focus 43, calendar 51, decisions 65 — every room renders real interactive
content, none falls back to an error banner.

```text
node --test "apps/rooms/tests/*.test.mjs"   69/69
node --test "tests/*.test.mjs"              854/854
node scripts/check-bilingual.mjs            docs / evidence / data-records = SYNCHRONIZED
hosted CI 36866763373                      success (android + gateway-web)
```

Representative rooms captured at 1440×960 and 390×844 — Knowledge, Checklist, Data Lab, Focus —
in `evidence/raw/mission-book/UI-103/`.

## 4. Two decisions recorded rather than silently taken

### D1 — The embedded-mode seam is NOT closed, and is not claimed as closed

UI-103 asks that the Web iframe embedding read as one product. The Rooms side now provides an
explicit, testable mechanism (`?embedded=1`), but **making `apps/web` actually request it belongs to
UI-101** — `apps/web/**` is outside UI-103's allowed modification boundary (`apps/rooms/**`
presentation). Per `CONSTRUCTION_RULES.md` §10, **deferred ≠ passed**:

```text
pending_seam: apps/web terminal.js's room iframe must append ?embedded=1 to the hub URL
owner_of_seam: UI-101 (Web product shell)
status: mechanism provided and verified on the Rooms side; consumer side not wired
```

I deliberately did not reach into `apps/web` to close it. Doing so would have exceeded this
workbook's boundary to make a local demo look complete.

### D2 — Contrast was measured on the new palette, not assumed

Because the adopted direction is a dark neon register, the restyle could easily have shipped
unreadable secondary text — this is exactly the defect Mech found and repaired during the UI-000
revision review (267 elements below AA). `--muted` was therefore re-derived against the new panel
values and the probe asserts 0 AA failures. The brand mark also got a solid `background-color`
under its gradient, so it still reads (and stays measurable) if gradients are unavailable.

## 5. Boundaries — what was NOT done

- **No Room module was edited.** No persistence, API, store or room-semantics change; the 69 room
  tests pass unmodified.
- **No per-room stylesheet.** The single shared stylesheet is the whole mechanism.
- **No framework.** Web/Rooms remain Vanilla HTML/CSS/JS.
- **No `apps/web/**` change** — see D1.
- **Not verified here:** cross-surface visual equality with Web/Android. UI-103's gate says the hub
  must be consistent with Web and Android, but Web is UI-101's and Android is UI-102's; that
  cross-check is UI-190's job. This report claims the hub carries the **adopted token direction**,
  not that all three surfaces already match.

## 6. Evidence pointers

```text
Utopia branch            ui/UI-103-rooms-visual-unification
Utopia head              399a1c118fa0016e7f30ce8f0e3ba01917b39db1
Utopia CI                36866763373 (android + gateway-web, success)
Published evidence       evidence/raw/mission-book/UI-103/            (8 PNG, 1.04 MB)
Full raw run             .runtime/evidence/mission-book/UI-103/       (git-ignored)
Verification probe       scripts/ui-103/verify-hub.mjs
```

## 7. State and what unblocks Review

```text
DEVELOPMENT_COMPLETE   = true
REVIEW_HOST            = unclaimed — must be a host other than Mech (§3)
```

Per §3 the Review must be performed by a different physical host, so it is not Mech's to take.
Mech's position is `WAITING_ELIGIBILITY`: UI-101/UI-102 are still unclaimed sibling Developments,
UI-190 needs all three, and RS-\*/UXI-\* sit downstream.

A reviewer should specifically challenge: (a) whether the shared-primitive approach really avoided
per-room divergence across all ten rooms, and not just the four captured; (b) whether the HUD
treatment hurts any room's dense-workflow ergonomics (Data Lab's textareas, Prompts' long lists);
(c) whether moving `127.0.0.1` into diagnostics still leaves the local-only safety property
discoverable enough.

## Language reading link / 语言阅读链接

[Complete reading translation / 完整阅读译文](./zh-CN/DEVELOPMENT_REPORT.md)
