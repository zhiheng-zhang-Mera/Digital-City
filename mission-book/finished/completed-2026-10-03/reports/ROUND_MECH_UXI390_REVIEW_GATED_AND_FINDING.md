# ROUND RECORD — Mech: UXI-301 review closed, UXI-390 review gated, and a finding filed into Alien's live development

```text
HOST = Mech   BASELINE = utopia main 1a5bc0e   CONTROL PLANE = Digital-City @ 944d5aa
```

## 1. Board state, read rather than assumed

Every workbook in the pool, read from its own frontmatter this round:

| task | status | development | review | development_complete |
|---|---|---|---|---|
| UI-000 | `REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS` | Mech | Alien | true |
| UI-101 / UI-102 / UI-103 | `REVIEW_COMPLETE` | Alien / Mech / Mech | Mech / Alien / Alien | true |
| UI-190 | `UI_BASELINE_FROZEN` | Alien | Mech | true |
| RS-201 / RS-202 / RS-203 | `REVIEW_COMPLETE` | Alien / Alien / Mech | Mech / Mech / Alien | true |
| RS-290 | `RESCHEDULING_BASELINE_FROZEN` | Alien | Mech | true |
| UXI-301 | `REVIEW_COMPLETE` | Mech | Alien | true |
| **UXI-390** | **`IN_PROGRESS`** | **Alien** | **null** | **false** |
| XX-000 | `NOT_STARTED` | null | null | false |

`XX-000` is `mission-book/MISSION_TEMPLATE.md` with `execution_enabled: false` — the blank template, not a
task. UXI-390's own claim record states it "declares no dependents, so it is the last task in this pool."

## 2. Zero-claim classification (§5)

**Classification: NO CLAIMABLE TASK EXISTS, and the one open task is not mine to develop.**

The pool is exhausted. The only unfinished work is UXI-390, which Alien claimed at
`2026-10-02T08:14:57Z` and still holds (`status: IN_PROGRESS`, `development_complete: false`). Its review is
mine by §3 for the reason already ruled on by the Owner and recorded in its own frontmatter: "Alien
developed RS-290 and reviewed UXI-301, so Alien must not take the independent visual-critic role for its own
output, and the review of UXI-390 must be Mech's."

So my position is not idleness and it is not a manufactured claim. My assigned duty is the **review** of
UXI-390, and it is **gated on an event I do not control**: Alien flipping `development_complete` to `true`.
Claiming a review before that would score an author's unfinished tree. §4 requires me not to sit idle and §9
forbids manufacturing work; both are satisfied by (a) doing verification that is owed regardless of when the
gate opens, which is what sections 3 and 4 record, and (b) holding a bounded wait on the gate rather than
polling without limit.

## 3. Work done this round, and it was verification rather than waiting

**The reconciliation instrument was wrong and Alien found it.** `uxi390-reconcile.mjs` resolved CI without
`--repo`, so `gh` inferred the repository from the process working directory: the check was correct only
when invoked from the utopia checkout and silently queried the *control plane* from anywhere else. Fixed by
reading `implementation_repo` **from the workbook** — the declaration already existed and I simply was not
using it. I also took Alien's sharper second point, that "a wrong-tree run reports a clean PASS set — the
failure mode least likely to be noticed", and added a wrong-tree guard that fails loudly. Verified from both
directories: repo and tree checks PASS from `D:\A-utopia` and from `D:\A-utopia\.mission-book`, 10/12.

The two remaining failures are benign and are **not** findings: recorded head `82ab99a` against the branch
tip `d15bc614`, and the CI binding that follows from it — ordinary mid-development lag, which should clear
when Alien declares complete.

**Alien's three fixes were verified at the source rather than from the commit message**, all PASS: the BOM is
gone; the re-run is published under this task's own path at
`evidence/raw/mission-book/UXI-390/web-e2e-rerun-by-alien.json`; and the RS-290 contract is byte-identical to
`main`. Alien's PowerShell root cause is exactly right — `Set-Content -Encoding UTF8` writes a BOM under
5.1 — and it is the same trap I have fallen into.

## 4. Finding filed into Alien's live development (not a review)

Alien's repair at `d15bc61` renders unrouted actions as `TextButton(enabled = false)` and parity-guards the
two `ACTION_WIRING` maps. Both verified. **But the wiring is declared and not connected on Android**, and
that is sharper than the defect the repair closed:

```text
MainActivity.kt:103   if(selectedNode==null) item { SchedulerStatusPanel(state.feed, online) }
SchedulerPanel.kt:40  onAction: (taskId: String, token: String) -> Unit = { _, _ -> }
SchedulerPanel.kt:116   TextButton(onClick = { onAction(taskId, action.token) }) { Text(action.label) }
```

`SchedulerStatusPanel` has exactly **one** call site tree-wide and it does not pass `onAction`, so the default
no-op is what every routed action calls. With `UNWIRED_ACTIONS == {CONFIRM}`, `KEEP_WAITING`, `CANCEL`,
`RETRY` and `CHOOSE_PROVIDER` all render as **enabled, clickable controls that do nothing**.

Measured against the client's real route surface (`city`, `presentation`, `tasks` create, `tasks/:id/cancel`,
`capabilities/:id/invoke`, `capability-invocations/:id`), **three of the four are capabilities Android
already has and never calls** — `CANCEL` via `CityClient.kt:112 fun cancel(id)`, which `MainActivity.kt:124`
uses from the task row twenty-one lines below the broken call site, and `RETRY` via `CityClient.kt:85
fun createTask`, whose payload is character-for-character the Web route's. So only `CHOOSE_PROVIDER` is a
genuine capability gap: **the finding narrows Alien's recorded scope question rather than widening it.**

Two things make this worth filing mid-development rather than holding for the review. First, the repair made
the other four *worse*: honestly disabling `CONFIRM` tells the user this surface knows which controls are
real, and the four dead-but-enabled buttons inherit credibility from that discrimination. Second, the parity
guard **forbids the correct Android state** — it asserts the unrouted set is exactly `{CONFIRM}`, so
acknowledging `CHOOSE_PROVIDER` as unimplemented on Android would fail the guard, and a future host would
otherwise "fix" that by loosening the test. `ACTION_WIRING` is shared product truth; `UNWIRED_ACTIONS` is
per-surface capability; the guard should assert containment, not equality.

Filed at `mission-book/reports/UXI-390/FINDING_MECH_ACTION_WIRING_DECLARED_NOT_CONNECTED.md`. No gate item is
scored and the branch was not touched — a reviewer reaching into live development is how the omission
happened, since that line is mine.

## 5. Errors of mine, recorded rather than smoothed

- **`MainActivity.kt:103` is my omission.** I created that call site and left it without `onAction` while the
  panel passed its tests. On Web I made exactly this impossible — an unroutable action renders `disabled`
  with `aria-disabled="true"` — and I wrote in that very commit that "a control that looks functional and
  does nothing teaches the user their choice was received, which is worse than an honest gap." I then failed
  to carry my own rule to Android. Same shape as Alien's F-1 against me: a principle stated, then not carried
  across the surfaces it applies to.
- **My dispatch was written one commit behind.** I published an acknowledgement saying the Android defect was
  open, then rebased and found Alien had already shipped the repair at `d15bc61`. Corrected in the finding
  document rather than left standing.
- **My gate watcher failed twice before it ran, both times on a trap this programme already knows.**
  First, `core.quotepath`: I fed `git ls-tree --name-only` output straight back to `git show`, and for a CJK
  path git returns the name quoted and C-escaped, so the lookup died with `does not exist in 'origin/main'`.
  Fixed with `-z`, which does not quote. Second, and worse because it is a repeat: I wrote `(?m)` as an
  inline prefix inside `new RegExp`, which is not a valid group — the flag must be the second argument. I
  have made the missing-`m`-flag mistake before in this task. Neither bug was in the thing being measured,
  which is the only reason they cost two runs rather than a wrong result.

## 6. Deliberate non-actions

- **Not editing UXI-390's workbook.** Alien is the author and it is in progress; its frontmatter is not mine
  to write. Same reason Alien declined to edit mine during the UXI-301 review.
- **Not repairing the Android wiring.** The fix is one argument at one call site, which is exactly why
  reaching in would be wrong — it is Alien's branch, under Alien's claim, and `CHOOSE_PROVIDER` needs the
  Owner's scope decision alongside it.
- **Still not fixed, unchanged from earlier rounds:** the 9 archive frontmatter problems (reported, not
  fixed). The UXI-390 BOM is now Alien's to have fixed and it has.

## 7. Bounded wait on the gate

§5.1 wait opened on the control plane for UXI-390's `development_complete` to flip, as a bounded background
watcher polling `origin/main` every 60 s for ~9.5 minutes, printing the baseline snapshot up front and
exiting on the transition, on any material workbook change, or at the deadline. The gate is open when
`development_complete: true`; the review is then run against the exact `development_head_sha` recorded in the
workbook, not against whatever the branch tip happens to be.

语言配对 / Language pair: [原文 / Source](./ROUND_MECH_UXI390_REVIEW_GATED_AND_FINDING.md) · [译本 / Translation](./zh-CN/ROUND_MECH_UXI390_REVIEW_GATED_AND_FINDING.md)
