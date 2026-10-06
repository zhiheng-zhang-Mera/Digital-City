# UXI-301 — CLAIM RECORD (Mech, Development host)

```text
WORKBOOK   = UXI-301  调度状态接入非工程化 UI
CLAIMED BY = Mech, 2026-10-02T04:30:22Z
BASELINE   = 1a5bc0ee825c681636b9611efa2163f458c0a76f   (CLAIM_TIME_MAIN)
BRANCH     = uxi/UXI-301-scheduler-status-into-product-ui
REVIEW     = must be a DIFFERENT host (§3) — Mech must not review its own development
```

## The gate, and why it was checked twice

UXI-301 depends on `["UI-190", "RS-290"]`. The dependency list was green `REVIEW_COMPLETE` one round
before this claim, and I **declined to claim then**, because the dependency that actually gates this
task is not the verdict but the **frozen schema on `main`**:

```text
one round ago:  RS-290 = REVIEW_COMPLETE,  main = de91f5e,  RS-290 was 60 commits ahead of main
this round:     RS-290 = RESCHEDULING_BASELINE_FROZEN,
                main moved de91f5e -> 1a5bc0ee
                via "merge(RS-290): rescheduling baseline freeze - reviewed head 2f81296"
                and main now CONTAINS 2f81296
```

UXI-301's goal is to wire *"RS-290 **冻结的** 调度状态"* — the **frozen** scheduling state — into UI-190's
shell, and `baseline_policy: CLAIM_TIME_MAIN` means the branch is cut from `main` at claim time. Claiming
a round earlier would have cut a branch containing **none** of the presentation contract, the unified
vocabulary or the DTO. The claim is therefore the same check that failed last round now passing, which
is why the basis field records the tree state and not just the dependency status.

## What this task must deliver, read from the workbook rather than assumed

Scope, from the workbook's own steps:

1. one unified adapter mapping the scheduler vocabulary to user language and allowed actions;
2. Web and Android share semantics, not necessarily pixels;
3. the provider-choice list may show unavailable entries **with their reason**, but must force them
   unselectable;
4. remote handoff shows progress / result / attention on the current device;
5. queue / degraded / offline use non-alarming, comprehensible wording;
6. technical detail lives behind an expandable Advanced;
7. driven by **real** concurrency, provider-unavailable, device-busy and remote-handoff E2E — **not by
   static mocks**. This is the same standard RS-203 and RS-290 were held to, and the mock prohibition
   is explicit in the workbook.

Explicit prohibitions: do not modify the RS-290 contract; do not recompute provider/device selection
in the UI; do not make a greyed-out unavailable provider clickable; do not restore the old
dashboard/control-panel structure for display convenience. Acceptance additionally requires that
**no raw scheduler field leaks by default**.

## Baseline content this branch starts from

Verified present on `main` at `1a5bc0ee`, because it is the surface UXI-301 must consume:

- `contracts/rs-presentation-contract-v1/presentation.mjs` — `TERMS`, `TERM_CLASS`, `TERM_OF`,
  `INTENDED_COLLAPSES`, `presentTerm`, `termRef`, `presentState`, `projectStatus`, with provenance-based
  refs (route 2) and 27 declared terms;
- the RS-201 provider registry, RS-202 routing/pressure/hysteresis/rescan/assignment-guard, and RS-203
  `createReturnBridge`.

## Next

Begin step 1 (the adapter) and step 7's real-E2E-driven UI, on a worktree cut from `1a5bc0ee`, with
inspectable evidence per the RS-203/RS-290 precedent that `.runtime/` is gitignored and therefore
unopenable by a review host.


[阅读译本 / Reading translation](./zh-CN/CLAIM_RECORD_MECH.md)
