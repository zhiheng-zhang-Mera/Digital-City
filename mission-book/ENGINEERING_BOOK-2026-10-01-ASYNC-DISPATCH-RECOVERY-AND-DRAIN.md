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
