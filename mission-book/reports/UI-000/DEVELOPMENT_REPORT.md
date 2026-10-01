# UI-000 — DEVELOPMENT REPORT

```text
MISSION                    = UI-000 (视觉方向候选与审美门禁)
PHASE                      = UI_CIVILIZATION
REPORT_ROLE                = DEVELOPMENT
HOST                       = Mech
IMPLEMENTATION_REPO        = zhiheng-zhang-Mera/utopia
CONTROL_REPO               = zhiheng-zhang-Mera/Digital-City
CONSTRUCTION_RULES         = mission-book/CONSTRUCTION_RULES.md (current head)
BASELINE_POLICY            = CLAIM_TIME_MAIN
BASELINE_SHA               = e7c498f5acd86da324a45c3278219c8daa612561
BRANCH                     = ui/UI-000-visual-direction-candidates
HEAD_SHA                   = c03adf13bbdd64d74514534b1de1e61ce3a68c6a
DEVELOPMENT_CI             = 36856637359-success-android-and-gateway-web
FIRST_HEAD_SHA             = 905e9ff97d21cd282601a819af1e69acc455af99
FIRST_HEAD_CI              = 36854042480-success-android-and-gateway-web
REVIEW_HOST_HEAD_SHA       = 727a254acd3b6c1c8925dbf78b0630e1a1410f8a
REVIEW_HOST_HEAD_NOTE      = Alien's independent review commit; preserved as an ancestor of HEAD
CLAIMED_AT                 = 2026-10-01T20:30:19Z
DEVELOPMENT_COMPLETE       = true
REVIEW_HOST                = Alien (claimed; see §10)
OWNER_GATE                 = STYLE_SELECTION (waiting, see §9)
```

> `HEAD_SHA` is the current Development head. The branch has moved three times and every move is
> recorded rather than rewritten: `905e9ff` (first head, CI green) → `6059252` (17 dead controls
> removed, §4 D9) → `727a254` (**Alien's independent review**: two repairs plus their own probe) →
> `c03adf1` (contract contradiction + WCAG tap targets, §10). The chain is linear, every earlier
> remote head is an ancestor of the current one, and no force-push was used anywhere.
>
> `DEVELOPMENT_CI` is re-verified with the control-plane reconciliation in §7a before this mission is
> treated as reviewable.

---

## 1. What this task actually delivers

`CONSTRUCTION_RULES.md` §2 makes the workbook frontmatter the only claim truth, and the UI-000
workbook asked for three things that are easy to fake and hard to do honestly:

1. an **actual functional / information map** of the current product;
2. **three structurally and visually different** candidates that all carry the **same functional facts**;
3. proof that they are runnable, not moodboards.

Delivered:

| Deliverable | Where |
|---|---|
| Canonical function / information map (machine-readable) | `apps/web/candidates/shared/facts.js` |
| Same map, readable | `apps/web/candidates/README.md` §2 |
| Candidate A · Halo / 随行 | `apps/web/candidates/a/` |
| Candidate B · Atlas / 工作台 | `apps/web/candidates/b/` |
| Candidate C · Prism / 剧场 | `apps/web/candidates/c/` |
| Real SVG icon system (replaces `◈ ▦ ◇ ≋ ◉ ▤ ≣ ⊞ ⚙ ▣`) | `apps/web/candidates/shared/icons.js` |
| Parity contract (29 capabilities + 20 demoted technical fields + 7 actions) | `apps/web/candidates/shared/parity-probes.js` |
| Shared local runtime — every control acts on one model | `apps/web/candidates/shared/runtime.js` |
| Parity runner (real browser) | `scripts/ui-000/parity.mjs` |
| Screenshot harness | `scripts/ui-000/screenshot.mjs` |
| Android Compose representative screens | `apps/android/app/src/main/java/city/utopia/control/ui000/CandidateGallery.kt` |
| Android capture harness | `scripts/ui-000/android-screens.mjs` |
| Room Hub candidate themes (real hub, real rooms) | `apps/rooms/hub/public/themes/{a,b,c}.css` |
| Candidate contract test (CI) | `tests/ui-000-candidates.test.mjs` |
| Evidence (bounded, published) | `evidence/raw/mission-book/UI-000/` |

## 2. Function / information map as built

Reconnaissance read `apps/web/**` (8 files, all), `apps/android/**` (all main sources),
`apps/rooms/**` (hub + shared + all ten room modules) and the Gateway room client.

**Current first-level navigation — 9 items, verified in all three surfaces:**

```text
Web      : Home · Rooms("Tools / Rooms") · Devices · Activity
           Advanced: Services · Tasks · Actions · Pairing · Settings
Android  : Home ◈ · Ask ❯ · Rooms ▦ · Action ≣ · Devices ◇ · Services ◉ · Tasks ▤ · Activity ≋ · Settings ⚙
           (+ a 10th reachable page `Find` with no bar item)
Rooms    : 10-room rail + one stage; no search, no filter
```

The problem is not colour. It is that internal engineering structure is projected onto the product
surface: `WORKSPACE / ALIEN`, `CONTROL SURFACE`, task ids, event `#seq`, room `id`/`number`,
capability ids, invocation ids, digests, `backendRef`/`resultRef`/`provenance`, `apiVersion`/`schemaVersion`,
hub URL, and raw `lastCheckpoint` JSON all print on the default path; icons are Unicode geometry
glyphs; Android defines 3 of ~30 M3 colour roles with no theme file and no dark theme; and the Room
Hub is a flat `#0c1016` + `#5ec8f2` single hard-coded dark scheme.

**Canonical capacity model:** 5 primary surfaces + 5 advanced surfaces, **29 capabilities**, and
**20 technical fields that must stay reachable but leave the reading path**.

## 3. The three candidates

| | A · Halo / 随行 | B · Atlas / 工作台 | C · Prism / 剧场 |
|---|---|---|---|
| Navigation model | none — bottom omnibox is the spine | **object rail** (机器/工具/作业/记录), not pages | big-type **acts** + 后台 drawer |
| Structure | single 760 px column, hairline rules, timeline rail | rail + canvas + **inspector** (3 zones) | unequal poster deck, full-bleed spotlight |
| Visual | warm paper, serif display, terracotta accent | cool neutral, 1 px grid, near-square corners, mono numerals | dark, violet + lime, layered surfaces |
| Technical detail lives in | inline `<details>运行详情</details>` | the **inspector**, closed by default | `<details>` inside each poster |
| Metric | `#fbf8f3` / `#b4502a` / r8 | `#f6f7f6` / `#1f4ed8` / r2 | `#0a0912` / `#8b5cf6` / r18 |

The three demotion mechanisms are deliberately different, because "how technical detail is hidden"
is exactly the architectural decision the Owner is choosing between.

## 4. Decisions taken where the workbook left options open

The Owner instruction was: where the workbook does not specify, choose the best option and record the
problem, the choice and the reasoning. These are all of them.

### D1 — How to prove "三套必须共享同样功能事实"

- **Problem.** The rule is a property of three hand-written UIs. Reviewing it by eye is exactly the
  kind of claim that silently rots, and "the same page count" proves nothing.
- **Options.** (a) rely on the independent review host; (b) hand-write a capability list per candidate;
  (c) drive the real candidates in a real browser and probe for the facts.
- **Choice.** (c). `shared/parity-probes.js` declares, per capability, a surface and literal tokens
  that must be present; `scripts/ui-000/parity.mjs` renders every surface of every candidate in Chrome
  and checks them.
- **Reasoning.** (b) can lie: a hand-written list is not evidence about the DOM. (c) fails if a value
  was dropped, and the contract test additionally asserts that **every** capability has a probe, so
  coverage cannot quietly shrink.
- **Result.** 324/324 probes pass (108 per candidate).

### D2 — Probes that would have punished correct demotion

- **Problem.** The first probe set was one class. Candidate B legitimately keeps technical values in
  its inspector, so `textContent` did not contain them and B "failed" — a false negative that would
  have pressured a candidate into leaking engineering values onto the product surface.
- **Options.** (a) relax the probes until everything passed; (b) require every value on the primary
  surface; (c) split the contract in two.
- **Choice.** (c). `SURFACE_PROBES` are product facts and must read on their surface untouched.
  `TECHNICAL_PROBES` must be **reachable** — each candidate exposes `revealAll()` (open every
  disclosure / open the inspector for every openable row, i.e. what a reviewer does by hand) and the
  runner checks the revealed DOM.
- **Reasoning.** This matches the workbook's actual rule ("默认折叠到高级信息/运行详情" — folded, not
  deleted) instead of inventing a stricter one. It fails a candidate that deletes a value and passes
  one that hides it properly.

### D3 — How the Room representative page stays real

- **Problem.** UI-000 wants a Room representative page per candidate, without a second Room implementation.
- **Options.** (a) screenshot the same hub three times and call it theming; (b) build three fake room
  pages; (c) use the hub's existing CSS custom properties.
- **Choice.** (c). `apps/rooms/hub/public/themes/{a,b,c}.css` override the `:root` tokens `hub.css`
  already defines, loaded only when `?theme=` is present.
- **Reasoning.** The seam already existed, so no Room module, markup or API is touched, and the
  screenshot is the **real** Knowledge Room with **real** stored data — the strongest available
  evidence short of doing UI-103 early. The contract test asserts themes only restyle.

### D4 — Android: real Compose screens vs. a high-fidelity prototype

- **Problem.** The workbook allows "real code or a high-fidelity runnable prototype". Building and
  booting Android is expensive and was not guaranteed to work here.
- **Options.** (a) three HTML mock-ups labelled "Android"; (b) real Compose screens, no screenshots;
  (c) real Compose screens + a real emulator capture.
- **Choice.** (c).
- **Reasoning.** (a) would misrepresent the surface that has the worst structural problem (9 nav items,
  glyph icons, no theme). Verification showed the offline build works, so the honest option was available.
- **Cost, recorded honestly.** Host-side prerequisites had to be discovered the hard way:
  `JAVA_HOME` points at a non-existent path and PATH `java` is JDK 26, which AGP 8.11 rejects; the
  working JDK is `D:\GDPR-Refine\.tools\jdk-17.0.20.1+1`. The SDK has **no `cmdline-tools`**, so
  `avdmanager` does not exist and the AVD was hand-authored (`%USERPROFILE%\.android\avd\utopia36*`).
  WHPX acceleration is available. Both harness scripts and the AVD recipe are recorded in
  `evidence/raw/mission-book/UI-000/README.md`.

### D5 — Exporting the candidate Activity

- **Problem.** `adb shell am start` cannot launch a non-exported Activity, so the Compose screens
  could not be captured while keeping `android:exported="false"`.
- **Options.** (a) export it in the main manifest; (b) render it inside `MainActivity` behind an extra;
  (c) override the flag from the debug source set.
- **Choice.** (c) — `app/src/debug/AndroidManifest.xml` with `tools:replace="android:exported"`.
- **Reasoning.** Release builds keep the Activity sealed; only a debug build can start it. (b) would
  have modified shipping navigation for a temporary gate, which `CONSTRUCTION_RULES.md` §9 forbids.

### D6 — Raw evidence volume

- **Problem.** 80 screenshots / 6.06 MB would go into a control-plane repository that
  `PROCESS_DATA_POLICY.md` explicitly says must not be a raw staging warehouse; but a **visual** Owner
  gate is un-decidable without images.
- **Choice.** Full run stays in git-ignored `.runtime/evidence/mission-book/UI-000/` (Layer 1); a
  curated 23-file / 2.79 MB subset is published to `evidence/raw/mission-book/UI-000/` with a README
  explaining what each image is. Harness defaults were changed to write to the ignored area.
- **Reasoning.** Owner and review host can decide from the repo; the control plane stays bounded.

### D7 — Candidate cleanup contract

- **Problem.** "不把候选三套全部长期留在生产代码" has no stated mechanism.
- **Choice.** The whole tree is declared temporary in three places (candidate README, Android file
  header, manifest comments), and `tests/ui-000-candidates.test.mjs` **skips** when the tree is gone
  and the production shell is clean, but **fails** if the tree is removed while the shell still
  references it, or if the tree exists but the shell was contaminated.
- **Reasoning.** A cleanup task cannot leave a permanently red suite, and a half-done cleanup cannot
  pass silently.

### D8 — Relaxed probes that were judgement calls, flagged for the reviewer

Two probe tokens accept a family rather than one literal, and the review host should challenge them:
`tools/room-availability` accepts `运行` (each direction words availability differently) and
`event-seq` accepts `41` without a `#` prefix (candidate A prefixes nothing). Both are paired with a
`TECHNICAL_PROBES` entry that checks the concrete value, so a real loss still fails.

### D9 — A control that does nothing is a defect, not a prototype shortcut

- **Problem.** After the first head was published (CI green), Mech re-scanned its own deliverable and
  found **17 controls across the three directions that rendered but did nothing** (`onclick: () => {}`):
  room launch, hub launch, capability invoke, demo task, task cancel, pairing generation, token
  replacement. Every one of them was in the parity contract's blind spot: the probes proved that the
  same facts were *displayed*, never that the same facts could be *produced*.
- **Options.** (a) leave them — "they are only prototypes"; (b) delete the controls that do not work;
  (c) give every control real behaviour and make parity prove it.
- **Choice.** (c).
- **Reasoning.** (a) is the worst option: a dead button is a false affordance, and the workbook's rule
  is that the three directions "share the same functional facts" — a control that does nothing is a
  removed function presented as present, which is exactly the failure mode the rule exists to stop.
  (b) would delete product function to make the artefact tidy, which §9 forbids. (c) is also the only
  option that turns the *similarity* claim into something a machine can check.
- **Why it was not left to the review host.** Review may repair in-scope defects, but knowingly
  publishing a defect and relying on the reviewer to catch it is not a completion gate being met.
- **Cost of doing it properly.** A shared `shared/runtime.js` had to exist first: if each direction
  implemented the actions itself, the three would drift and behaviour parity would become a third
  unverifiable claim. All three now import one deterministic local model.
- **What the fix exposed.** Two genuine, previously invisible **parity gaps**, not just dead code:
  candidate B had **no per-room launch control at all**, and candidate A had **no hub-launch control**.
  Both were added. This is the strongest available argument that the fix was not cosmetic.
- **New machine checks.** `ACTION_PROBES` clicks each control by label and asserts the produced fact;
  `openRoom`/`openHub` additionally assert that a real navigation happened (`window.open` target URL,
  not just rendered text). The contract test bans `=> {}` from returning and requires every
  `runtime.ACTIONS` entry to have a probe.

## 5. Verification actually performed (Development host)

```text
node --test "tests/*.test.mjs"            -> tests 859 | pass 859 | fail 0
node --test "apps/rooms/tests/*.test.mjs" -> tests  69 | pass  69 | fail 0
node city/test-all.mjs                    -> fail 0 (7 skipped by design)
node scripts/check-bilingual.mjs          -> docs / evidence / data-records = SYNCHRONIZED
node scripts/verify-promotion-history.mjs -> 10 record(s) verified at e7c498f5acd8
node --test tests/ui-000-candidates.test.mjs -> tests 5 | pass 5 | fail 0
node scripts/ui-000/parity.mjs            -> 324/324 probes, PASS (a 108, b 108, c 108)
apps/android: gradlew.bat --offline :app:testDebugUnitTest :app:assembleDebug -> BUILD SUCCESSFUL
```

The parity run covers four passes per candidate: surface facts, demoted technical values after
`revealAll()`, Ask/Do states, and — since D9 — the seven actions actually clicked.

`CANDIDATE_SHOTS`: every candidate was rendered at 1440×960 **and** 414×896 across all ten surfaces,
with no page errors, plus candidate C's spotlight overlay. `0` empty handlers remain in the three
candidates.

## 6. Boundaries — what was deliberately NOT done

- **No product behaviour changed.** No API, protocol, DTO, scheduler, Gateway or Room semantics were
  touched. `services/**` and `contracts/**` are untouched.
- **No framework migration.** Web and Rooms stay Vanilla HTML/CSS/JS; Android stays Compose Material 3.
- **No candidate was chosen.** Picking A/B/C is the Owner gate; this report must not pre-empt it.
- **No production Web/Android/room styling was rewritten.** UI-101/102/103 own that; the candidates are
  prototypes, and the winners must be re-implemented inside those workbooks' boundaries rather than by
  renaming this tree.
- **No review was performed by Mech.** `CONSTRUCTION_RULES.md` §3 forbids one host doing both roles,
  and no second-host stand-in was invented (§9).
- **Not claimed:** real cross-device behaviour, provider/login acceptance, or accessibility conformance
  beyond what the designs implement. The parity runner proves *presence and production of facts*, not
  usability.
- **Not claimed: the candidate actions are not the real Gateway.** `shared/runtime.js` is a local,
  deterministic model. `openRoom`/`openHub` perform a real navigation to the real Room Hub deep link,
  but invoke / demo-task / cancel / pairing / disconnect simulate the same state transitions locally
  rather than calling `/api/v0/*`. Wiring them to the live Gateway belongs to UI-101..103, inside the
  boundaries those workbooks set; the prototypes must not be mistaken for an integrated client.

## 7. Evidence pointers

```text
Utopia branch            ui/UI-000-visual-direction-candidates
Utopia head              6059252e318503fc3161235eb6099cf59ca34c61
Utopia head CI           36855082899 (android + gateway-web, success)
Superseded head          905e9ff97d21cd282601a819af1e69acc455af99 (CI 36854042480) — see D9
Published evidence       evidence/raw/mission-book/UI-000/            (24 files, 2.80 MB)
Full raw run             .runtime/evidence/mission-book/UI-000/       (80 files, 6.06 MB, git-ignored)
Parity report            evidence/raw/mission-book/UI-000/parity-report.md
How it was produced      evidence/raw/mission-book/UI-000/README.md
```

## 7a. Reconciliation before handoff (§7)

```text
recorded branch == evidence head_branch     ui/UI-000-visual-direction-candidates                          OK
recorded head   == evidence head_sha        c03adf13bbdd64d74514534b1de1e61ce3a68c6a                     OK
required terminal state == evidence conclusion  run 36856637359 == success (android + gateway-web)       OK
```

`EVIDENCE_POINTER_MISMATCH` is absent. Stale pointers were hit twice during this mission — once for
`905e9ff` (§8 item 6) and once where `parity.mjs` wrote its report to a path that was no longer
published, leaving the published report at 285/285 while the real run was 390/390 (§10). Both were
caught and corrected rather than left, which is what §7 exists for.

## 8. Disclosure — this host's own errors, found and repaired

Recorded because the workbook asks for it and because two of them were substantive.

1. **The `el()` helper never rendered `text`.** Attribute-style `{ text: … }` was emitted as an HTML
   attribute, not as content. The first parity run reported 81 passing probes for candidate A because
   the runner searched `innerText + innerHTML`, so tokens matched the *attribute values*. Switching the
   runner to `textContent` collapsed it to 9/95 and exposed the defect. Without that change the
   candidates would have shipped with missing labels and a green check. Repaired in all three candidates.
2. **17 controls did nothing.** First found as one instance in candidate C (a room poster whose handler
   re-opened the same page); the real scope was 17 across all three directions, and it survived the
   first green CI run because the parity contract only proved facts were *displayed*, never that they
   could be *produced*. Fixed in full — see §4 D9 — and the fix exposed two genuine parity gaps
   (candidate B had no per-room launch control; candidate A had no hub-launch control). The first
   published head `905e9ff` was therefore superseded by `6059252`.
3. **Candidate B's Atlas rows read value-then-label on Android**, which rendered as trailing
   annotations. Corrected to label-then-value.
4. **Two "failures" were mine, not the product's.** `capability-adapters` and `city-roads` failed in
   the fresh worktree with `CORRUPT_INPUT`. Baseline `main` passed, and the adapter itself reported
   `mammoth could not be loaded … (run: pnpm --dir city install --frozen-lockfile)`. Cause: `city`
   dependencies are installed by CI and were absent in the worktree; the first repair attempt
   (`Copy-Item -Recurse`) broke pnpm's symlink layout, and a directory junction fixed it. Environment,
   not product.
5. **Two Android capture attempts produced wrong images** — three splash screens, then the same
   direction three times — before the real causes (`exported="false"`, instance reuse, ~23 s first
   frame, and a system ANR dialog) were found. The harness now encodes all four.
6. **The `HEAD_SHA` in this report was briefly stale.** After the D9 fix the branch head moved from
   `905e9ff` to `6059252`; §7a reconciliation caught the stale pointer and it was corrected rather
   than left for the review host to discover.

## 9. State after Development, and what unblocks Review

```text
DEVELOPMENT_COMPLETE      = true
REVIEW_HOST               = Alien (unclaimed)
OWNER_GATE                = STYLE_SELECTION (unresolved)
```

`CONSTRUCTION_RULES.md` §3 requires Development and Review on different physical hosts, and this host is
Mech, so the review stage is not Mech's to take. `CONSTRUCTION_RULES.md` §5 classifies Mech's position as
`TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY` — not pool-terminal, not structurally ineligible:

```text
pool_incomplete              = true
claimable_now                = 0 on Mech
potentially_claimable_later  = true
classification               = TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
structural_ineligibility_reason = null
global_external_blocker      = null
wake_condition               = UI-000 Review completed by Alien, or an Owner STYLE_SELECTION ruling,
                               or a new eligible claim appearing in the global scan
rescan_after                 = ~20 minutes (liveness fallback only)
terminal_reason              = null
```

UI-101 / UI-102 / UI-103 depend on UI-000 and remain locked until the Owner selects a direction, so
they are not claimable on any host yet. Per §4 this Development host continues to scan the global
pool rather than idling on this mission.

---

## 10. Review integration (§3 two-host discipline, actually exercised)

Alien claimed the Review and pushed `727a254` — an independent review containing **two repairs and
their own probe** (`scripts/ui-000/review-probes.mjs`, authored before this branch existed on origin).
It is deliberately stricter than the Development runner: product facts asserted against *visible* text,
demoted values against *reachable* text, plus horizontal-overflow and tap-target measurement and
probe-coverage reporting.

### 10.1 Both of Alien's repairs were real defects in this host's work

1. **`parity.mjs` hard-coded `channel: 'chrome'`.** On a host with Edge but no Google Chrome the runner
   died before its first assertion, so the "285/285" evidence recorded in the first completion was
   **not reproducible off this machine**. Mech had treated "it runs here" as "the evidence is
   reproducible". Alien's fallback is kept.
2. **Candidate B's data table could not shrink past an unbreakable token**, pushing the page 37 px wide
   at a 390 px viewport (`scrollWidth` 427 vs 390). Mech had captured a 414 px screenshot but **never
   measured `scrollWidth`**, so it was invisible from Mech's evidence.

Neither was caught by the Development host's own verification. This is the two-host rule earning its
keep, and it is the strongest evidence in this report that the discipline is load-bearing rather than
ceremonial.

### 10.2 Mech's integration head acted on Alien's probe

Both hosts' work is preserved; `727a254` is an ancestor of `c03adf1` and Alien's probe file is unchanged.

```text
Alien's review-probes.mjs       727a254 (Alien)   c03adf1 (integrated)
strictVisibleFailures                    8              0
tapTargets                              10              0
overflow / glyphs / consoleVocab     0/0/0          0/0/0
capability coverage                  29/29          29/29
TOTAL FAILURES                          35             17
```

- **8 strictVisibleFailures → 0.** Root cause was a contradiction in *Mech's own contract*:
  `SURFACE_PROBES` demanded the raw event type and raw invocation id be **visible** on Home/Services,
  while UI-000 requires internal vocabulary to be **folded away**. The contract was ordering the
  candidates to break the rule. Fixed by asserting product-legible facts instead (timestamps for
  activity, status for invocation history) and moving the raw tokens into `TECHNICAL_PROBES`, so
  reachability is still checked. This also exposed that candidate B was rendering `task.completed`
  raw on its primary path; B now renders readable event text and keeps the raw type in its inspector.
- **10 tapTargets → 0.** Real WCAG 2.5.8 violations: text-link and tiny-link controls measured under a
  24 px target at 390 px. Fixed by a minimum target height on that class in all three directions —
  a hit-area fix that changes no visual direction.

### 10.3 The 17 remaining findings are NOT silently resolved by Mech

None of the 17 is an unqualified product defect. They are **6 probe false positives**, **8 advanced-surface
interpretation disagreements**, **2 contract-definition questions** and **1 reachability-binding question**.
Each is documented with its evidence in
[`HANDOFF_MECH_TO_ALIEN_REVIEW_FINDINGS.md`](./HANDOFF_MECH_TO_ALIEN_REVIEW_FINDINGS.md), which asks the
review host or the Owner to rule. Mech deliberately did **not** weaken the probe or redefine the contract
to make them disappear, because all three possible resolutions (change the probe, change the contract,
change the scope) sit in the review host's or the Owner's authority, not the Development host's.

Worked example of why that restraint matters: `a/room-id: "knowledge"` is reported as leaked, but the
match is the word *knowledge* inside the room's own prose summary ("Plain-text knowledge entries…"),
and `a/room-number: "10"` matches the phrase "10 个" (the room **count**). Substring matching against a
whole page cannot distinguish an identifier from a word. Mech's `LEAK_PROBES` avoid this by choosing
slugs that cannot occur in prose (`text-workshop`, `data-lab`).

### 10.4 Mech's commitment

Mech makes no further Development-side changes to UI-000 unless hosted CI goes red or the review host /
Owner rules that one is required. The branch history is linear and force-push-free:
`905e9ff → 6059252 → 727a254 (Alien) → 9c22dc0 → c03adf1`.
