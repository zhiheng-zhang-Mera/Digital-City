# DISPATCH — Mech zero-claim, 2026-10-02 (after UI-190 Review completion)

```text
HOST                        = Mech
pool_incomplete             = true
claimable_now               = 0
potentially_claimable_later = true
CLASSIFICATION              = 5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
```

## Why zero, per task

| task | state | why Mech cannot claim it now |
|---|---|---|
| UI-190 | `REVIEW_COMPLETE`, `dc=true rc=true` | Mech's own review is finished and the claim is released. What remains is **not Review work**: the step-7 `FINAL_VISUAL_PREVIEW` Owner gate, then the step-8 merge to main and the `UI_BASELINE_FROZEN` declaration. |
| RS-201, RS-202 | `NOT_STARTED`, dep `UI-190` | UI-190's step 8 states the freeze "自动解锁 RS-201/202" — the unlock is the **freeze**, not review completion. Still locked. |
| RS-203 | dep RS-201/202 | locked |
| RS-290 | dep RS-201..203 | locked |
| UXI-301 | dep UI-190, RS-290 | locked |
| UXI-390 | dep UXI-301 | locked |

## Why this is 5.1 and not 5.3

Worth stating precisely, because an Owner gate *looks* like an external block and §5.3 would
change the required behaviour from "bounded re-scan" to "do not poll":

**§5.1 line 110 names "Owner gate 解除" explicitly** in its list of events that may unlock work:

```text
另一主机完成 Development/Review、CI 结束、Owner gate 解除、阶段冻结、
provider/device 恢复等事件可能解锁工作
```

So an Owner gate is, by the rules' own worked list, a `WAITING_ELIGIBILITY` condition. Behaviour:
low-cost wait, no busy-poll, bounded re-scan about every 20 minutes, immediate re-scan on the event.

## What Mech is NOT doing

**Not merging to main.** UI-190 carries `merge_authority: true`, but the workbook places the merge at
step 8, **after** the step-7 Owner gate. The critic has passed and the Owner has been delivered the
visual package (`reports/UI-190/FINAL_VISUAL_PREVIEW_PACKAGE.md`), so the merge is now gated on a
named step Mech would be skipping by acting unilaterally. Merging early would freeze a baseline
before the one gate the task reserves for the Owner, and that is not a decision a host should take
to look busy.

**Not claiming UI-190 again.** The Review is complete and its deliverables exist: the bounded
`reports/UI-190/REVIEW_REPORT.md` is written, and the visual package is delivered.

## State Mech leaves behind

```text
UI-190 status            = REVIEW_COMPLETE
development_head         = 10cdd75604836ad0b903f4dd749e80e16bdf32b6
review_head_sha          = 11bb3f6fc76aecbb1ae41f2e258cccf7beaa429b  (dev head + review repair)
review_ci                = 36895816630 success (android + gateway-web)
review_verdict           = PASS_WITH_REVIEW_REPAIR
UI_BASELINE_FROZEN       = NOT declared; RS-201/202 therefore NOT unlocked
open items               = Owner gate; merge + main CI; freeze declaration
```

## Honest note on how this review went

Two of my own instruments produced a false positive and a refuted hypothesis, and I published one
finding that was my own misreading of a downscaled screenshot and had to retract it. All three are
recorded in the workbook and in `REVIEW_REPORT.md` §5 rather than dropped. The confirmed defect this
review did produce (item 3) was found by the second round's *different* instrument, which is the
argument for not having repeated the first round's probe to satisfy the round count.
