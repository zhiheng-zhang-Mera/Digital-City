# DISPATCH — Mech typed blocker: UI-190's Owner gate holds the whole remaining programme

```text
HOST             = Mech
CLASSIFICATION   = 5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY  (see §3)
CONSECUTIVE GOAL ROUNDS WITH THIS SAME CONDITION = 3  (rounds 21, 22, 23)
BLOCKER TYPE     = Owner action required; no internal code can produce it
```

## 1. The exact condition

`reports/UI-190/FINAL_VISUAL_PREVIEW_PACKAGE.md` is delivered and waiting. UI-190's own
`owner_gate: FINAL_VISUAL_PREVIEW` is **open and unresolved**, and the workbook sequences step 8
(merge to `main`, then `UI_BASELINE_FROZEN`) **after** step 7's Owner delivery.

```text
UI-190  status = REVIEW_COMPLETE, development_complete = true, review_complete = true
        development_head = 10cdd75604836ad0b903f4dd749e80e16bdf32b6
        review_head_sha  = 11bb3f6fc76aecbb1ae41f2e258cccf7beaa429b
        review_ci        = 36895816630 success (android + gateway-web)
        review_verdict   = PASS_WITH_REVIEW_REPAIR
        owner_gate       = FINAL_VISUAL_PREVIEW   <-- the blocker
        UI_BASELINE_FROZEN = NOT declared
```

## 2. Why nothing else is claimable

The remaining pool is fully chained behind that one step. Verified by scanning every active
workbook, not by assuming:

| task | deps | why locked |
|---|---|---|
| RS-201, RS-202 | `UI-190` | UI-190 step 8 states the freeze "自动解锁 RS-201/202" — the unlock is the **freeze**, not review completion |
| RS-203 | RS-201/202 | chained |
| RS-290 | RS-201..203 | chained |
| UXI-301 | UI-190, RS-290 | chained |
| UXI-390 | UXI-301 | chained |
| UI-000 / 101 / 102 / 103 / 190 | — | all `development_complete` **and** `review_complete` |

`claimable_now = 0` across every programme in `mission-book/`, every round.

## 3. Why this is 5.1 and not 5.2 or 5.3

Stated because the classification changes what should happen next:

*   **Not 5.2 STRUCTURALLY_INELIGIBLE.** The bar is not a stable mechanism excluding this host —
    it is a pending decision that will certainly change state. Mech is not barred; it is waiting.
*   **Not 5.3 GLOBAL_EXTERNAL_BLOCK**, even though an Owner action is external, because
    `CONSTRUCTION_RULES.md` **§5.1 line 110 names "Owner gate 解除" explicitly** in its list of
    events that unlock work. By the rules' own worked list, an Owner gate is a
    `WAITING_ELIGIBILITY` condition, so the prescribed behaviour is a low-cost wait with a
    bounded re-scan — not a do-not-poll external block.
*   Accordingly this record is **not** a claim that the pool is terminal, and it is **not** a
    claim that the phase is finished. It is a typed blocker report.

## 4. Why Mech has not simply merged to `main` itself

UI-190 carries `merge_authority: true`, and merging would have looked like progress. Mech did not,
deliberately:

1. The workbook places the merge at **step 8, after step 7's Owner gate**. Doing it now would
   freeze the UI baseline ahead of the one gate this task reserves for the Owner.
2. UI-190's **Development host is Alien** and the freeze is Development's step. A review host whose
   review is complete acting on another host's unstarted step is exactly the claim-overreach §2
   forbids.
3. Whether step 7's Owner involvement is *mandatory approval* or *permissive comment* ("此处 Owner
   **可**给方向性意见") is genuinely ambiguous in the workbook. Resolving that ambiguity in the
   direction that skips the gate is not Mech's call to make unilaterally; it belongs to the Owner
   or to the task's Development host. Recorded here as the reasoning rather than left implicit.

What Mech *did* do instead was verify, read-only, that the freeze will be clean when it is taken:
`branch..main = 0` (main is a strict ancestor), `git merge-tree --write-tree` exits 0 with no
conflicts, and main's latest CI is green, so step 8 is a **fast-forward** at these SHAs. Recorded
in `reports/UI-190/REVIEW_REPORT.md` §8.

## 5. What the Owner needs to do to unblock

One of:

*   **give the directional read** the gate asks for on
    `reports/UI-190/FINAL_VISUAL_PREVIEW_PACKAGE.md` — it needs no code knowledge, only
    "好看 / 不好看" plus anything that must change; or
*   **rule that step 7's Owner involvement is permissive rather than a gate**, so step 8 may
    proceed without it and the freeze can be declared. Recording that ruling matters for every
    later task that inherits an owner gate.

Either action releases everything downstream: merge → `UI_BASELINE_FROZEN` → RS-201/202 → RS-203 →
RS-290 → UXI-301 → UXI-390.

## 6. What Mech will do on unblock

Re-scan (§7 reconciliation first, per the rules), then claim the next eligible task in the chain —
RS-201/RS-202 become claimable the moment the freeze is declared.

## 7. Evidence that the wait was not idle

Across the three rounds this condition has held, Mech completed and closed UI-190's Review rather
than parking it: two critic rounds by self-built and deliberately different instruments, the
Android connected capture on the route Development had recorded as exhausted, one confirmed defect
found and repaired and verified two-sided, and the bounded `REVIEW_REPORT.md` written where
`report_path` had pointed at an empty directory.
