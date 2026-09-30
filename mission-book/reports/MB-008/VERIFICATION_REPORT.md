# MB-008 — Computer Use Runtime — VERIFICATION REPORT

> Status: **IN PROGRESS — PRE-CHAIN EVENTS COMPLETE / RUN-2 DRIVER FIX PENDING**
> Verification Host: `Mech`
> Migration Host: `Alien`
> Completion basis: `OWNER_ACCEPTED_COMPLETE`
> Repair step: `2`

## 0. Current checkpoint

```text
OWNER_GATE = MB-007 repair_status=COMPLETE
VALUE_VERDICT = ROUTE_B_CONTINUE
MIGRATION_HEAD = aa2a6a8faab779a020d75b93dba548ba3755ce30
POST_MB007_MAIN = d850d73a9c23dbd07f9a0c7483dd2f44272f273f
RECONCILED_HEAD = 77b774cf34df
RECONCILED_CI = 36655586918 PASS
PRE_CHAIN_EVENT_HEAD = 65418f2493cb
PRE_CHAIN_EVENT_CI = 36658350359 PASS
VERIFICATION_COMPLETE = false
```

## 1. Value reassessment

Route B selected: current Utopia main still lacks the MB-008 safety/guard/recovery/postcondition semantics as an equivalent implementation, so skipping the Mission would be incorrect.

## 2. Integration-first reconciliation

The branch was 48 commits behind post-MB-007 main. Three shared-control-plane conflicts were resolved without weakening existing mechanisms:

- `services/capability-bridge/registry.mjs`: kept main's strict superset, including both exclusion filters and MB-009 declared/enumerated split.
- `city/CITY_IMPLEMENTATION_MANIFEST.json`: unioned complete stage-2/stage-3 documents by district id; current-main ownership wins collisions; relocated `11-entertainment` theme ownership is not duplicated.
- `city/tests/manifest.test.mjs`: regenerated census in manifest declaration order.

Reconciled branch head: `77b774cf34df`.

Hosted CI: `36655586918 PASS`.

## 3. Pre-chain Verification events — COMPLETE

Committed at Utopia branch head `65418f2493cb`, hosted CI `36658350359 PASS`.

Existing Verification events — **do not duplicate**:

| Event | ID | Outcome |
|---|---|---|
| OWNER_INTERVENTION | `MB-008:fe4650b1af0044de` | INFO |
| ATTEMPT_STARTED | `MB-008:7208d35e54fae3cf` | INFO |
| VERIFIER_FINDING | `MB-008:67f53cc8da24edda` | BLOCKED / independent finding |
| TEST_PASS | `MB-008:1ce4bdb9cbe65fda` | PASS |
| CI_RESULT | `MB-008:1cd9ff19bf0c3d6e` | PASS — run `36655586918` |

The independent finding is intentionally retained as a truthful historical finding. Do not rewrite it to green; later runtime evidence and final completion events establish the closeout.

## 4. Run-2 bounded-chain partial result

The happy path is already real and useful:

```text
normalizeAction
→ validateAction
→ classifyRisk(FILE_WRITE) = high
→ evaluateDestructive
→ real bounded file write in evidence workspace
→ createWorldState before/after
→ different digests
→ meaningfulChange.changed = true
→ file postcondition verdict = success
```

Observed API facts that must be reused rather than rediscovered:

- `FILE_*` actions take `path` inline; file-shaped `target` throws `TARGET_INVALID`.
- expected-effect vocabulary is closed snake_case; use donor vocabulary such as `file_created`.
- `vworld` / `pinnedClock` are test fixtures, not runtime API.
- world state is perception-shaped.
- file postcondition verification requires `facts.fileExists` as a function.

Two evidence-driver defects remain; **migrated product logic is not to be modified for these**:

1. **Refusal bookkeeping:** migrated destructive guard correctly throws `ComputerUseError` / `DESTRUCTIVE_FORBIDDEN` for `DELETE`, but the run-2 driver records `not-thrown` while the process dies. Fix the driver so the exact exception is caught, recorded and asserted, with zero side effect.
2. **Recovery ordering:** the attempted “miss” truthfully returns success because the file still exists. Create a genuine miss by deleting the evidence-workspace file first, verify the expected file-created postcondition now fails/misses, then perform the donor-shaped recovery/stabilization path, recreate/write the file, and verify success.

Resume evidence source (host-local): `.runtime/evidence/mission-book/MB-008/run-2/CHAIN-STATE.md`. If it is unavailable on the active host, reconstruct only from the committed events and this report; do not guess missing evidence.

## 5. Remaining closeout

- fix only the run-2 evidence driver;
- capture truthful refusal with zero side effect;
- capture genuine miss → donor-shaped recovery → success;
- record `RUNTIME_PASS/PASS` only after both paths are valid;
- run complete required tests;
- commit/push runtime evidence summary event(s), obtain a new green hosted CI;
- append the **final** `CI_RESULT/PASS`;
- append `VERIFICATION_COMPLETE/PASS` after that final CI event;
- owner-override finalization;
- episode + inbox removal;
- final branch-head CI;
- merge to Utopia main;
- merged-main CI;
- City closeout.
