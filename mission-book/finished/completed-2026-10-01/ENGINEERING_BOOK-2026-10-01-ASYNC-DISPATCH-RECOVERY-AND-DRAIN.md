# Engineering Book — Async Dispatch Recovery and Programme Drain

> Date: 2026-10-01
> Control repo: zhiheng-zhang-Mera/Digital-City
> Implementation repo: zhiheng-zhang-Mera/utopia
> Type: RECOVERY / SCHEDULING REPAIR ONLY
> Product feature expansion: FORBIDDEN

## 0. Purpose

This workbook recovers the current externally blocked component run without creating a fifth programme or adding product scope.

Current pool truth:

- 41/41 Development implementations exist.
- 20/41 tasks are complete through Development + other-host Correction.
- 2 Corrections are code-complete but hosted-CI blocked.
- 5 Developments are code-complete but hosted-CI blocked.
- 14 green Developments still require the other physical host's Correction.
- GitHub Actions account billing/spending state prevents new hosted jobs from starting.

Target flow:

    restore hosted CI
    -> close the seven blocked heads honestly
    -> drain Corrections dependency-first
    -> start programme integration whenever one programme becomes eligible
    -> keep both hosts useful without violating host separation

## 1. Incident snapshot

Historical component baseline:

    COMPONENT_BASELINE = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c

Utopia main now also contains evidence-only records for this incident. Those documentation commits do not authorize changing already reported component heads merely to make them appear current. Future programme integration starts from then-current main and preserves those records.

| Class | Count | Tasks |
| --- | ---: | --- |
| Development + Correction complete | 20 | BA-001..005; EM-001..006; GAI-001/002/003/005; RF-001..005 |
| Correction code-complete, hosted CI blocked | 2 | GAI-004, RF-006 |
| Development green, waiting other-host Correction | 14 | BA-006/008; EM-007..011; GAI-006..008; RF-007..010 |
| Development code-complete, hosted CI blocked | 5 | BA-007/009; EM-012/013; GAI-009 |

Seven blocked heads:

| Task | Stage | Host | Head | Blocked run |
| --- | --- | --- | --- | --- |
| GAI-004 | Correction | Alien | 11d5ece | 36750532324 / 36750532665 and re-runs |
| RF-006 | Correction | Alien | 8fbd71d | 36751505413 / 36752017760 and re-runs |
| BA-007 | Development | Mech | 8fa4686 | 36752540378 |
| BA-009 | Development | Mech | 9e1de31 | 36750981300 |
| EM-012 | Development | Mech | 364c516 | 36751919772 |
| EM-013 | Development | Mech | 5920e80 | 36753243377 |
| GAI-009 | Development | Mech | 8dfdf9e | 36753891511 |

Known GitHub annotation:

    The job was not started because recent account payments have failed or your spending limit
    needs to be increased. Please check the 'Billing & plans' section in your settings

This remains a typed external blocker until the Owner/account state changes.

## 2. Hard rules

1. Local PASS never substitutes for hosted CI where hosted CI is required.
2. Re-run the exact recorded blocked head first after billing recovery. Do not rebase merely because main gained evidence documents.
3. No new component feature work merely because a host is idle.
4. Development Host != Correction Host remains binding.
5. No programme merge workbook before that programme's full component gate is satisfied.
6. If a hosted job actually starts and a test step fails, it becomes a normal code defect and must not continue to be labelled billing.
7. Preserve the failed interval as paper/dogfood evidence.

## 3. R0 — Owner external unblock

Required external action:

    RESTORE_GITHUB_ACTIONS_BILLING_OR_SPENDING_LIMIT

Until GitHub Actions starts jobs again:

- Alien: GLOBAL_EXTERNAL_BLOCK for hosted closure of GAI-004 and RF-006. Do not accumulate more unverifiable Correction heads.
- Mech: Development pool is drained; for most remaining component Corrections it is STRUCTURALLY_INELIGIBLE because it authored Development. Do not invent substitute work.
- Both hosts may park with the typed reason.

The approximately 20-minute re-scan rule does not require polling a known unchanged account-level billing blocker. It applies to TEMPORARILY_UNCLAIMABLE, not GLOBAL_EXTERNAL_BLOCK.

## 4. R1 — Recover the seven blocked heads

Immediately after billing/spending is restored, both hosts work in parallel.

### Alien lane

Re-run hosted CI on exact heads:

1. GAI-004 @ 11d5ece
2. RF-006 @ 8fbd71d

If green:
- record the new run id;
- set correction_complete = true;
- retain the blocked runs as history.

If jobs start and tests fail:
- classify ACTIONABLE_OWNED_REPAIR;
- repair only observed defects;
- rerun local gates + hosted CI;
- record the new corrected head.

### Mech lane

Re-run hosted CI on exact heads:

1. BA-007 @ 8fa4686
2. BA-009 @ 9e1de31
3. EM-012 @ 364c516
4. EM-013 @ 5920e80
5. GAI-009 @ 8dfdf9e

If green:
- set development_complete = true;
- record the new hosted run id;
- make the task eligible for Alien Correction.

Mech must not correct these five itself.

Expected state if all seven are green without code changes:

    FULLY_COMPLETE = 22/41
    WAITING_CORRECTION = 19/41
    DEVELOPMENT_BLOCKED = 0
    CORRECTION_CI_BLOCKED = 0

## 5. R2 — Alien becomes the Correction drain lane

After R1, Alien owns the high-throughput Correction lane. The goal is dependency-aware programme drain, not fairness.

### Priority A — Remote Fabric first

After RF-006 closes:

    RF-007
    RF-008
    RF-009
    RF-010

Reason: accepted Remote Fabric removes the real cross-device seam that later GAI and EM integration otherwise defer.

When RF-001..010 all satisfy their two-stage gates, emit:

    REMOTE_COMPONENT_POOL_DRAINED

This wakes Mech's Remote integration lane.

### Priority B — General AI Gateway

    GAI-006
    GAI-007
    GAI-008
    GAI-009  (after recovered Development green)

GAI-004 should already close in R1.

### Priority C — Butler Assistant

    BA-006
    BA-008
    BA-007  (after recovered Development green)
    BA-009  (after recovered Development green)

### Priority D — Engineering Manager

    EM-007
    EM-008
    EM-009
    EM-010
    EM-011
    EM-012  (after recovered Development green)
    EM-013  (after recovered Development green)

Exact order inside a programme may change when one stage becomes actionable earlier. Never idle merely to preserve list order.

Alien continues independent adversarial Correction. Author tests alone are not sufficient.

## 6. R3 — Mech becomes the programme-integration lane

After R1, Mech will usually be structurally ineligible for remaining component Corrections because it authored their Development.

State:

    STRUCTURALLY_INELIGIBLE_FOR_COMPONENT_CORRECTION
    reason = SAME_PHYSICAL_HOST_AS_DEVELOPMENT

Mech must not create make-work.

Wake conditions:

1. REMOTE_COMPONENT_POOL_DRAINED
2. GENERAL_AI_COMPONENT_POOL_DRAINED
3. BUTLER_COMPONENT_POOL_DRAINED
4. ENGINEERING_MANAGER_COMPONENT_POOL_DRAINED

When one becomes true, Mech creates the programme-specific merge/integration workbook required by the existing programme rules.

Expected order if Alien follows R2:

    Remote Fabric
    -> General AI Gateway
    -> Butler Assistant
    -> Engineering Manager

If another programme genuinely drains earlier, Mech may take that ready integration stage instead.

Every integration workbook must:
- start from then-current Utopia main;
- preserve incident evidence and any already merged programme;
- integrate corrected branches as an explicit union/superset;
- run full relevant local gates and hosted CI;
- perform required real acceptance;
- merge only when the true programme terminal gate is green;
- rerun merged-main CI.

## 7. Eligibility-aware idle rule

Every zero-claim scan uses the four classes in CROSS_PROGRAMME_EXECUTION_CONTRACT.md.

TEMPORARILY_UNCLAIMABLE:
- unfinished work can become eligible later;
- host is not structurally excluded;
- park and rescan after approximately 20 minutes;
- no busy polling.

STRUCTURALLY_INELIGIBLE:
- stable mechanism forbids all current remaining stages to this host;
- record exact reason;
- park until explicit wake condition;
- no periodic rescan required.

GLOBAL_EXTERNAL_BLOCK:
- useful progress requires account/Owner/hardware/provider state change;
- report once with exact evidence;
- stop;
- no repeated 20-minute polling against a known unchanged blocker.

POOL_TERMINAL:
- only after all relevant stages satisfy their actual terminal semantics.

## 8. Paper/dogfood instrumentation

Every future zero-claim event should record:

    timestamp
    host
    pool_incomplete
    claimable_now
    potentially_claimable_later
    structural_ineligibility_reason
    global_external_blocker
    rescan_after
    next_scan_timestamp
    next_scan_outcome
    work_became_eligible
    owner_intervention_required

This enables comparison of:
- one-shot exit;
- fixed approximately 20-minute bounded re-entry;
- event-driven wake-up;
- dependency-aware programme drain.

Paper material:
- Digital-City Research Institute / paper-materials / ASYNC_DISPATCH_TRANSIENT_QUIESCENCE_2026-10-01
- Utopia evidence / PAPER_EVIDENCE_ASYNC_DISPATCH_TRANSIENT_QUIESCENCE_2026-10-01
- Utopia raw evidence / async-dispatch-2026-10-01 / incident-summary.json

## 9. Stop conditions

Success:

    SEVEN_BLOCKED_HEADS_RECOVERED
    AND SCHEDULER_RULE_ACTIVE
    AND HOST_LANES_ASSIGNED

Typed external stop:

    RECOVERY_BLOCKED_ONLY_ON_GITHUB_ACTIONS_ACCOUNT_STATE

No workaround may relabel the typed external stop as success.

## 10. Recovery closure and control-plane reconciliation incident

STATUS: `RECOVERY_CLOSED_WITH_RECONCILIATION_REPAIR`

The GitHub Actions account-level block was removed and the exact blocked heads were re-run without rewriting their implementation history. The seven recovery heads are now green:

| Task | Stage | Run | Attempt | Exact head | Result |
| --- | --- | ---: | ---: | --- | --- |
| GAI-004 | Correction | 36750532665 | 4 | `11d5eced3e913cdd0cd9249d55825dedbcc3d5ac` | success |
| RF-006 | Correction | 36752017760 | 4 | `8fbd71df10535456cddd8146e28b08fd7684d714` | success |
| BA-007 | Development | 36752540378 | 3 | `8fa4686bb7acb2b57a34a00fe517f6ecaad9769f` | success |
| BA-009 | Development | 36750981300 | 5 | `9e1de31ba53766758406e991dbacdb8f707b1bfc` | success |
| EM-012 | Development | 36751919772 | 3 | `364c5160952039d31074af3bfae843c1d0f4be24` | success |
| EM-013 | Development | 36753243377 | 3 | `5920e8076d317e15142b7d16c8531e529ce587f0` | success |
| GAI-009 | Development | 36753891511 | 3 | `8dfdf9edcf6f525797de964650b383a916271371` | success |

After the external condition recovered, a second failure mode became visible: **execution truth changed out-of-band, but the Digital-City control plane did not automatically reconcile the recovered state.** Five task frontmatters still labelled successful Development runs as `BLOCKED_GITHUB_ACCOUNT_BILLING`, the Mission Book dashboard still advertised the original all-unclaimed state, and GAI-005 carried a Correction CI pointer to RF-009's run (`36746849199`) rather than its own successful run (`36746845955`).

This is classified as:

`CONTROL_PLANE_STATE_RECONCILIATION_LAG`

It is distinct from the Billing outage itself. The external system had recovered; the remaining error was stale/misattributed control metadata.

Repair applied on 2026-10-01:

- BA-007, BA-009, GAI-009, EM-012 and EM-013 Development frontmatter reconciled to COMPLETE on their exact green heads;
- the stale Billing blocker fields were removed from current task truth while the historical outage remains preserved in reports and paper evidence;
- GAI-005 Correction CI provenance corrected to run `36746845955`;
- the Mission Book dashboard recomputed from task truth;
- Remote Fabric recorded as `REMOTE_COMPONENT_POOL_DRAINED` and programme integration unlocked;
- the normative cross-programme contract gained an external-state reconciliation/provenance-validation gate.

Post-reconciliation component truth:

```text
DEVELOPMENT_GREEN = 41/41
CORRECTION_COMPLETE = 36/41
REMOTE_FABRIC = 10/10 DEVELOPMENT + 10/10 CORRECTION
WAITING_ALIEN_CORRECTION = BA-007, BA-009, GAI-009, EM-012, EM-013
GITHUB_ACTIONS_ACCOUNT_BLOCK = RECOVERED
```

The historical §§0–9 above remain an immutable incident snapshot and must not be rewritten to make the outage appear absent.

---

## Appendix — component-stage closeout (2026-10-01, after the Owner-requested Correction round)

The incident snapshot above stops at `CORRECTION_COMPLETE = 36/41`. The five Corrections it lists as
`WAITING_ALIEN_CORRECTION` were subsequently executed by host Alien (Development by Mech) and are closed; each
records its own corrected head, hosted-CI run, repaired mechanisms, Alien regressions that fail on the
Development head, author-encoded boundaries and a disclosure section:

```text
BA-007   head f8f15af835e6ea04921142403c1c33584364d451   run 36817491957   reports/BA-007/CORRECTION_REPORT.md
BA-009   head 2abf8d47ad0663c175779ab9a3057594d2db86ab   run 36818585688   reports/BA-009/CORRECTION_REPORT.md
GAI-009  head 4e65e265eba4bb346924d1c078955a587e9e199f   run 36820218698   reports/GAI-009/CORRECTION_REPORT.md
EM-012   head e4afd5ea5a822b481a93771b4b33041d64e29cb8   run 36821442088   reports/EM-012/CORRECTION_REPORT.md
EM-013   head 0ef455eabbdf54a7edfd975fa0fe82eb89690ca6   run 36822830353   reports/EM-013/CORRECTION_REPORT.md
```

```text
FINAL COMPONENT TRUTH (2026-10-01, generated from task workbook frontmatter)
DEVELOPMENT_GREEN                                = 41/41
CORRECTION_COMPLETE                              = 41/41
OPPOSITE_PHYSICAL_HOSTS_ON_EVERY_TASK            = true
COMPONENT_BRANCHES_MERGED_TO_UTOPIA_MAIN          = 0
MERGE_WORKBOOKS_CREATED                          = 0/4
ACTIONABLE_OWNED_REPAIR                          = 0
ELIGIBLE_CORRECTION_OTHER_HOST                   = 0
UNCLAIMED_DEVELOPMENT                            = 0
DEVELOPMENT_IN_PROGRESS_BY                       = 0
```

The four component pools are drained, so every programme merge workbook is eligible, but no merge workbook has
been created and no component branch is merged to Utopia main. The merge stage is separate, Owner-authorized work
that has not started. Real provider/login acceptance, real two-device transport E2E and real third-party connector
acceptance (Claude Code, WorkBuddy) remain open programme-integration gates and were never fabricated during the
component stage. The incident snapshot above is unchanged. *This component-stage appendix is itself superseded by
Appendix B below (merge-stage closeout).*

---

## Appendix B — merge-stage closeout (2026-10-01)

The Owner authorized the merge stage. All four programme merge workbooks were created and executed in pool order
**BA → RF → GAI → EM**, each starting from the then-current `main` and re-refreshing from `main` immediately
before its final merge (contract §7.6), with the required local suite, docs check and hosted CI re-run on the
refreshed integration head before the final merge, and hosted CI verified again on the resulting `main` (§7.7):

```text
programme              integration head / CI      main merge / CI            archive tags
Butler Assistant       4ff27ba  · 36827219769     41e241c · 36827422797      9   (archive/BA-001..009)
Remote Fabric          160fcc3  · 36828179156     49914d9 · 36828413515      10  (archive/RF-001..010)
General AI Gateway     a47e4eb  · 36828980482     74b37cf · 36829232339      9   (archive/GAI-001..009)
Engineering Manager    aef657f  · 36829755814     e7c498f · 36830053908      13  (archive/EM-001..013)
```

```text
FINAL MERGE TRUTH (2026-10-01)
MERGE_WORKBOOKS_CREATED                    = 4/4
COMPONENT_BRANCHES_MERGED_TO_UTOPIA_MAIN    = 41
UTOPIA_MAIN_SHA                             = e7c498f5acd86da324a45c3278219c8daa612561
UTOPIA_MAIN_CI                              = 36830053908 success
ARCHIVE_TAGS_ON_ORIGIN                      = 79
REMOTE_BRANCHES_REMAINING                   = main (only)
CORRECTED_HEADS_ANCESTORS_OF_MAIN           = 41/41
HISTORY_DELETED                             = 0
TERMINAL_MARKER                             = ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN
```

Archiving replaced each merged branch ref with an annotated tag on the same corrected commit and then deleted the
remote branch, so deleting the branch removed no commit: every Development and Correction head stays reachable on
origin through `archive/<ID>` (and through the merge commits on `main`). Compatible conflicts
were resolved as explicit unions — BA had none; RF resolved RF-001 × RF-002 across the City manifest, its test, the
capability-registry test and both architecture docs; GAI and EM were clean unions. A main-drift incident during the
BA merge (evidence-only commits had landed on `origin/main` after the integration branch was cut) was caught by the
ancestry check and repaired by refreshing from `main` and re-running every check and CI run — recorded as decision
D-series entries in the Butler workbook.

Merging code is **not** evidence of a real external run. Real provider/login acceptance, real two-device transport
E2E and real third-party connector acceptance (Claude Code, WorkBuddy) remain open, typed
`REAL_PROVIDER_ACCEPTANCE_PENDING`-style programme-integration gates exactly as the individual reports record.
Appendices above are unchanged.

语言配对 / Language pair: [English](./ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md) · [中文](./zh-CN/ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md)
