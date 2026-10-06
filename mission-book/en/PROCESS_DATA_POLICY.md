# Process Data / Utopia Dogfood Policy

[中文原文](../PROCESS_DATA_POLICY.md) · [Mission Book dashboard](../README.md)

## Decision

```text
Digital-City
  = mission definitions + claims + compact reports
Utopia
  = raw/structured migration experience + accepted evolution episodes
City MUST NOT be a raw-process staging warehouse.
Utopia MUST NOT learn directly from unfiltered raw logs.
```

Digital-City is the ownership/boundary/mission control plane. Terminal logs, screenshots, repeated retries, and raw traces must not accumulate in City and slow Hns task scans with historical noise. Utopia is the product and experience learner, so migration process data belongs there; raw events are evidence, not immediately effective instructions.

> **Process evidence is not instruction inheritance.**

Failed approaches, temporary workarounds, old-branch decisions, and Verifier repairs cannot automatically become current Utopia rules merely because they appear in history.

## Three-layer Utopia flow

Suggested logical layout:

```text
Utopia/
├─ .runtime/evidence/mission-book/<MISSION_ID>/<run-id>/
│  └─ raw receipts / screenshots / error artifacts   [git-ignored]
│
└─ data-records/evolution/
   ├─ inbox/mission-book/<MISSION_ID>/
   │  └─ bounded structured event stream             [mission branch]
   │
   └─ episodes/mission-book/<MISSION_ID>/
      └─ verified normalized episode                 [accepted/main]
```

### Layer 1 — Raw runtime evidence

During construction write first to `.runtime/evidence/mission-book/<MISSION_ID>/<run-id>/`, following Utopia's existing `.runtime/` Git-ignore rules. Record command/action receipts, test/CI results, errors, crash/restart/recovery receipts, UI/Android/Windows evidence, refs/SHA/digests, and timing/resource data when useful.

Never commit secrets, credentials, hidden model reasoning, or unbounded terminal dumps. Large temporary logs stay local or in hosted artifacts. Small non-sensitive evidence required for cross-host Migration/Verification may be selectively published on the mission branch under `evidence/raw/mission-book/<MISSION_ID>/`. Before Verification it is only candidate evidence; it becomes accepted repository evidence only when the verified branch merges to `main`.

### Layer 2 — Evolution inbox

During Migration/Verification append **bounded, structured, non-sensitive** facts to the mission implementation branch's `data-records/evolution/inbox/mission-book/<MISSION_ID>/events.jsonl`. This is cross-host handoff data, neither raw terminal dump nor authoritative rules.

Suggested events:

```text
MISSION_CLAIMED
ATTEMPT_STARTED
CHANGE_APPLIED
TEST_PASS
TEST_FAIL
RUNTIME_FAIL
RECOVERY
OWNER_INTERVENTION
VERIFIER_FINDING
REPAIR_APPLIED
CI_RESULT
MISSION_ACCEPTED
```

Every entry includes at least Mission ID, host/role, source/target SHA or ref, timestamp, outcome, and evidence pointer. **Inbox is not an active policy/rule source.**

### Layer 3 — Verified episode

Only after Verification completion and all required CI green, normalize the whole history into `data-records/evolution/episodes/mission-book/<MISSION_ID>/episode.json`. Delete inbox files from the current tree in the same final branch commit; Git history retains construction traces, while `main` exposes verified episode by default.

Keep both successful migration/verification paths and failed/rejected approaches/repairs, explicitly labeled by outcome. Only this provenance-bound normalized episode may feed later Utopia self-evolution/retrieval/training.

## City report relationship

```text
Utopia .runtime raw / branch inbox / verified episode
               ↓
      pointer + digest + summary
               ↓
Digital-City/mission-book/reports/MB-xxx/
```

City keeps indexes/conclusions; Utopia keeps experience. **Raw data need not pass through City before returning to Utopia.**

## Assessment-first / NO_VALUE negative-result flow

For `assessment_required=true` missions (currently MB-010..012), Assessment is engineering experience to retain even when **no code is migrated**.

### Branch and data locations

Assessment Host creates a standard mission branch from Utopia latest `main` at claim. Before verdict, only process-data writes are allowed:

```text
.runtime/evidence/mission-book/<MISSION_ID>/<run-id>/assessment/
data-records/evolution/inbox/mission-book/<MISSION_ID>/events.jsonl
evidence/raw/mission-book/<MISSION_ID>/assessment/   # selectively committed bounded non-sensitive evidence only
```

The event schema currently has no ASSESSMENT-specific eventType. Continue `role=MIGRATION`; use existing types such as MISSION_CLAIMED/ATTEMPT_STARTED/TEST_PASS/TEST_FAIL; indicate `phase=assessment`, Utopia baseline SHA, donor refs, and comparison evidence in summary/sourceRef/targetRef/evidence. **Never invent eventType for recording convenience.**

### NO_VALUE

For a City `NO_VALUE` verdict:

- Write no product/runtime code.
- Push and retain branch; do not merge or delete.
- City `ASSESSMENT_REPORT.md` records immutable branch HEAD and evidence pointers.
- `migration_complete=true`, `migration_status=SKIPPED_COMPLETE`, `migration_completion_basis=SKIPPED_NOT_REQUIRED`.
- `verification_complete=true`, `verification_status=NOT_REQUIRED_SKIPPED_COMPLETE`.
- With no accepted implementation code, **no verified implementation episode is required or may be fabricated**.
- The negative result remains paper-usable architecture-selection/duplication-avoidance/migration-triage evidence.

### FULL / PARTIAL

For `FULL_MIGRATION` or `PARTIAL_MIGRATION`, continue real Migration on the same branch. Assessment events stay in the same inbox history and enter the verified episode through normal Verification plus `mission:finalize`, preserving why some portions were migrated and others rejected.

## Owner-accepted Migration / finalizer contract

If Migration Host genuinely records BLOCKED and Owner later explicitly accepts the boundary and declares Migration complete:

- Preserve the BLOCKED event; never rewrite/fabricate Migration Host MIGRATION_COMPLETE/PASS.
- Verification Host records OWNER_INTERVENTION referencing City owner ruling.
- Finalizer owner-override validates together: migration blocker, Owner ruling, OWNER_INTERVENTION, independent VERIFIER_FINDING, final CI PASS, and VERIFICATION_COMPLETE PASS.
- Episode records migration acceptance basis/ruling reference.

Initially used for MB-007/MB-008. It does not apply to MB-003's real-provider core seam: if MB-003 retains migration value, real execution path remains non-waivable.

## Implemented bootstrap contract

UTOPIA_EVOLUTION_BOOTSTRAP_MAIN = `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`
UTOPIA_EVOLUTION_BOOTSTRAP_PR = `utopia#9`
BOOTSTRAP_CI = `36562928621` / success (gateway-web + android)

Utopia supplies fixed tools/contracts:

```text
contracts/evolution/mission-event-v1.schema.json
contracts/evolution/mission-episode-v1.schema.json
pnpm mission:event -- ...
pnpm mission:finalize -- ...
```

`mission:event` only appends bounded structured facts; it never changes runtime policy. `mission:finalize` generates a verified episode only with two distinct participating hosts, Migration PASS, independent Verifier Finding, latest implementation CI PASS, and later PASS Verification Complete.

### Verification closeout order

```text
independent review
  ↓
repair / real-use verification
  ↓
implementation required CI = GREEN
  ↓
record CI_RESULT PASS
  ↓
record VERIFICATION_COMPLETE PASS
  ↓
pnpm mission:finalize
  ↓
commit episode + inbox removal
  ↓
FINAL BRANCH HEAD required CI = GREEN
  ↓
merge main
  ↓
City VERIFICATION_REPORT
```

The second CI covers the exact final branch HEAD produced by finalize. It is not written back into the deleted inbox; City Verification Report records run/conclusion. Only all-green final branch CI permits the episode to enter Utopia `main` through merge.

### Mandatory event coverage

Record at least:

```text
MISSION_CLAIMED
ATTEMPT_STARTED
CHANGE_APPLIED
TEST_PASS / TEST_FAIL
RUNTIME_PASS / RUNTIME_FAIL
RECOVERY
OWNER_INTERVENTION        (when occurring)
MIGRATION_COMPLETE
VERIFIER_FINDING
REPAIR_APPLIED            (when occurring)
CI_RESULT
VERIFICATION_COMPLETE
```

Construction models must not extend event names; the Utopia event contract governs.

## Capability Registry relationship

`capability-registry/` is not a raw-process store. Its role is:

```text
current verified capability state
+ implementation navigation
+ user exposure/reachability state
+ exact provenance/evidence pointers
```

It MUST NOT contain unbounded terminal logs, full CI dumps, screenshots copied only for convenience, hidden model reasoning, speculative implementation guesses, or stale branch-only verification. Process/history remains in Utopia evidence/evolution and Mission Book reports. Registry keeps only current reconciled state plus pointers.

Recommended flow:

```text
runtime / UI / E2E evidence
          ↓
Mission Book report + exact SHA
          ↓
Formal Review reconciliation
          ↓
capability-registry/records/CAP-*.yaml
          ↓
human exposure matrix / agent navigation
```

For Registry/runtime disagreement preserve mismatch before repair and classify `CAPABILITY_REGISTRY_STALE` or `CAPABILITY_REGISTRY_REALITY_MISMATCH`. These are research candidates under `CONSTRUCTION_RULES.md §14B`; Registry repair must not erase before-state.

## City Work Monitor / JEV observation projection

City Work Monitor and JEV follow the same boundary:

```text
canonical Utopia task/action/event/device/review truth
        ↓
bounded observation adapter
        ↓
JEV observation layer
        ↓
normalized monitor projection
        ↓
UI / diagnostics
```

**Monitor is a projection, not a new authority surface.** Convenient dashboard queries cannot justify a second scheduler/task/device/review/capability state.

### Separate Observation and Decision

```text
ordinary event / heartbeat / progress → observe + record + continue
state transition requiring a choice → Decision
```

JEV may continuously observe; Decision is event-triggered only. Neither becomes a City-wide synchronous execution lock. Minimum observable Decision receipt:

```text
decision_id
task_or_workbook_id
trigger_event
pre_state
decision_source = RULE | FAST_MODEL | CRITIC | OWNER
action
confidence_if_available
queue_wait_ms_if_observable
decision_latency_ms_if_observable
timeout_or_fallback
escalation_reason
post_state
evidence_refs
```

Tool-unexposed fields use `NOT_OBSERVABLE + reason`, never fabricated zero.

### Data layers

High-frequency heartbeats, raw event streams, and UI-refresh telemetry belong in `.runtime / hosted artifacts`. Only bounded state transitions, decision receipts, failure/recovery, reconciliation, and research-required samples enter evolution inbox/accepted episodes. Digital-City continues to store only compact monitor/decision summaries, exact run/SHA/artifact pointers, bounded research indexes, and blocker/reconciliation/Owner decisions.

### Monitor-specific failure labels

```text
MONITOR_SYNC_BARRIER
MONITOR_REALITY_DRIFT
SUMMARY_HIDES_ACTIVE_RISK
EDGE_CAUSALITY_MISSING
DECISION_PROVENANCE_MISSING
DECISION_TIMEOUT_GLOBAL_IMPACT
DASHBOARD_BECOMES_SECOND_TASK_TRUTH
```

Preserve bounded before/after evidence for these phenomena; repair must not sanitize away before-state.
