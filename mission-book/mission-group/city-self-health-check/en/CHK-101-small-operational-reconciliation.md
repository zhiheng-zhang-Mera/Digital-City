> English reading translation / 英文阅读译本. The [original document](../CHK-101-small-operational-reconciliation.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

> **Owner ruling (2026-10-07):** 暂时屏蔽旧版工作书的验收限制，对 DGX 和 CHK 系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。 Internal development proceeds across all five CHK workbooks on Alien-GPT-CHK without waiting for old per-task opposite-host acceptance. Whole-series independent second-host review remains NOT_RUN. This exception changes development sequencing only; no main merge, scheduling, repair or promotion authority is granted. Accepted dependency SHAs remain unfilled until actually accepted.


# CHK-101 — Small Operational Reconciliation / Small health check

> **OWNER ACTIVATED / EXECUTION ENABLED.** The first run is bounded dry-run/read-only. Dependency, independent review and promotion gates remain in force; automatic repairs and self-modification are not authorized.

## Objective
Find drift that has just emerged after recent construction at low cost, preventing small issues from accumulating into widespread control-plane drift.

## Check surfaces
### 1. Capability Registry
- Are new or changed capabilities registered?
- Do CAP record paths, symbols, and APIs still exist?
- Is the exact verified SHA stale or pointing to the wrong revision?
- Are all four layers—implementation, wiring, reachability, and intent—represented honestly?
- Are surface paths still discoverable?
- Is INTERNAL_ONLY still justified?

### 2. Mission Book
Reconcile:

```text
workbook frontmatter
↔ generated README
↔ MISSION_PROGRESS.json
↔ dependency state
↔ finished archive
```

Check duplicate IDs, incorrect active or parked states, completed work not archived, dependencies not unlocked, and similar inconsistencies.

### 3. Identity / Evidence
Check:
- Consistency of development, review, CI, and evidence SHAs;
- Ancestry of dependency accepted SHAs;
- Stale mutable refs;
- EVIDENCE_POINTER_MISMATCH;
- STALE_EXECUTION_IDENTITY;
- BASELINE_ANCESTRY_MISMATCH.

### 4. Sentinel runtime flows
Run only a few high-value paths, for example:

```text
start City
→ create task
→ route/select target
→ receive canonical state
→ complete/fail
→ UI reconciliation
```

Do not run the full heavyweight E2E suite by default.

### 5. UI / Exposure
Catch new regressions:
- False affordances;
- Hidden important state;
- Broken entry points;
- Disconnected backends;
- Web/Android parity regressions;
- Mismatched refusal or error presentation.

### 6. Open findings / debt
Classify review findings into at least:

`OPEN / ACKNOWLEDGED_DEBT / DEFERRED_BY_DESIGN / SUPERSEDED / RESOLVED`.

### 7. Prevent loss of research/evolution evidence
Only determine whether recent events include G3/G4 episodes worth preserving, Owner intervention, reality drift, or semantic integration conflicts. Do not launch research engineering inside a small check.

## Outputs
```text
HEALTHY
DRIFT_FOUND
REQUIRES_RECONCILIATION
FOLLOWUP_WORKBOOK_CANDIDATE
OBSERVE_MORE
```

Every finding must include an owner surface, severity, evidence pointer, and recommended destination.

## Prohibitions
- Fixing every problem incidentally during the check;
- Starting large refactors merely because documents are untidy;
- Turning transient runtime noise directly into permanent rules.

## Completion gate
Produce a bounded health report. If repairs are needed, only create or recommend subsequent formal work items; do not expand implementation scope within this task.
