# ROUND RECORD — RS-290 verdict issued; UXI-301 dependency analysed and NOT yet claimable

```text
RS-290  = REVIEW_COMPLETE (Mech verdict, this round) - see review_verdict in the workbook
UXI-301 = NOT_STARTED, dependencies ["UI-190", "RS-290"], baseline_policy CLAIM_TIME_MAIN
NEXT CLAIMABLE = still none, and the reason CHANGED this round
```

## What was decided, and the reasoning

With RS-290 now `REVIEW_COMPLETE` I checked whether its dependent, UXI-301, became claimable — the
objective requires claiming the next available task and §4 forbids idling when one exists. **It has
not, and the test is concrete rather than a restatement of the dependency list.**

UXI-301's goal is to take *"RS-290 **冻结的** 调度状态"* — RS-290's **frozen** scheduling state — and wire
it into UI-190's shell. Its `dependencies: ["UI-190","RS-290"]` is therefore satisfied by the
**freeze**, not by review-complete, because what UXI-301 needs is the **schema on `main`**, not the
verdict. And `baseline_policy: CLAIM_TIME_MAIN` makes that literal: UXI-301 is cut from `main` at claim
time. Measured:

```text
utopia main                        = de91f5e381e3283fd60d539bca0c1435de8f79ff
main contains 2f81296 (RS-290 head) = NO
commits on rs/RS-290 not in main    = 60
```

So claiming UXI-301 now would cut a branch from a `main` that contains **none** of RS-290's work — the
presentation contract, the unified vocabulary and the DTO would all be absent from the tree the task is
supposed to integrate. The dependency would read as satisfied in the frontmatter while being absent in
fact, which is the failure §7 exists to prevent.

**Decision: do not claim UXI-301.** Recording the reasoning because "dependencies are green" is exactly
the kind of control-plane claim that can be true and still wrong.

## What the blocking condition now is

RS-290 step 7, and it is **Alien's**: the merge to `main`, `main` CI green, and the
`RESCHEDULING_BASELINE_FROZEN` declaration, under this task's `merge_authority: true`. That declaration
is what unlocks UXI-301 and, through it, UXI-390. My claim on RS-290's Review is discharged and
`merge_authority: false` for me on this task, so nothing here is mine to push forward.

```text
pool_incomplete              = TRUE
claimable_now                = 0
classification               = TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY (§5.1)
structural_ineligibility_reason = NONE (Mech is eligible for UXI-301 once the freeze lands)
global_external_blocker      = NONE
wake_condition               = RESCHEDULING_BASELINE_FROZEN declared and RS-290 merged to main
rescan_after                 = bounded per §5.1, plus immediate re-scan on the freeze event
```

## Open item carried forward

The duplicate frontmatter keys in UI-000 and UI-101, verified this round and attributed to Mech's own
commits — see `CONTROL_PLANE_DUPLICATE_KEYS_MECH.md`. Recorded as `VERIFIED, NOT YET REPAIRED` because
three of the four need their canonical value established from the commit record rather than guessed.
It should be repaired before or alongside the phase freeze, so the frozen baseline does not carry
ambiguous control-plane state.


## 中文阅读译本 / Chinese reading translation

[完整中文阅读译本](./zh-CN/ROUND_RECORD_RS290_VERDICT_AND_UXI301_GATE.md)逐节保留解释和历史限制，原代码证据不改写，不产生新的任务状态或验收。 / [Complete Chinese reading translation](./zh-CN/ROUND_RECORD_RS290_VERDICT_AND_UXI301_GATE.md) preserves the explanations and historical limits section by section, without rewriting code evidence or creating new task state or acceptance.
