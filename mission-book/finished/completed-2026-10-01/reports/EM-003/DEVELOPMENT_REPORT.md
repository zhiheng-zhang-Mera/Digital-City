# EM-003 Development Report — Engineering Job / Event / Result / Artifact Protocol

```text
MISSION                  = EM-003 (Engineering Manager programme, task 3 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = f7dbc71 (Digital-City main, "claim(EM-003): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T13:20:13Z
CONTROL_REVISION_AT_CLAIM= 3c42222 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DONOR_POLICY             = DS-Hns pinned but NOT read; no build/runtime dependency
IMPLEMENTATION_BRANCH    = engineering-manager/EM-003-job-result-artifact-protocol
IMPLEMENTATION_HEAD_SHA  = 8c16cfc266a9869ace2c059f7959322282285663
BRANCH_CI                = 36721305141 — success (run-level conclusion completed/success; both required jobs)
LOCAL_CHECK_SUMMARY      = 110/110 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

| File | Purpose |
|---|---|
| `contracts/engineering-job-v1/envelopes.mjs` | Job, event, result and artifact envelopes with strict validation; mode-specific admission; secret-shaped field refusal; artifact provenance |
| `contracts/engineering-job-v1/reconcile.mjs` | Deterministic event reconciliation (duplicate/late/gap), terminal immutability, result application, artifact attachment, auditable summary |
| `contracts/engineering-job-v1/index.mjs` | Public surface + published guarantees |
| `contracts/engineering-job-v1/tests/conformance.test.mjs` | 9-test conformance suite |
| root `tests/engineering-job.test.mjs` | Registers the suite with `pnpm test` |

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| autonomous jobs do not require `operations[]` | `an autonomous job needs an objective and bounded constraints, not an operation list` (and supplying operations to an agent mode is refused) |
| scripted jobs lacking an executable specification are refused/blocked honestly | `a scripted job without an executable specification is refused honestly, not admitted` — `SCRIPTED_SPEC_REQUIRED` with `honest_blocker: true` |
| partial/progress events cannot mark a job terminal | `a partial or progress event can never mark a job terminal` (validator + `applyEvent`) |
| a terminal result cannot be resurrected into active state by replay | `a terminal result is final and cannot be resurrected by replay` |
| artifact references preserve source job/device/connector provenance | `artifact references preserve job, device and connector provenance` |
| late and duplicate events are deterministic/idempotent | `late, duplicate and out-of-order events are deterministic and idempotent` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.**
Choice: EM-003. Reason: the fresh scan showed no owned repair and no eligible opposite-host Correction
(the only Development-complete-but-uncorrected task, EM-002, can only be corrected by Alien), so the
unclaimed-Development tier applied. EM is the largest pool and no other host is working in it, and EM
is a different programme from my previous claim (Remote Fabric), which the tie-break prefers.

**D2 — Cross-branch discipline.**
EM-001's and EM-002's contract packages live on unmerged sibling branches from the same frozen
baseline, so neither can be imported and neither may be copied. This branch declares its own
`engineering-job-v1` contract; the seam to EM-001 (`EngineeringJobEnvelope`, `EngineeringEventEnvelope`,
`EngineeringResultEnvelope`, `ArtifactEnvelope`) and to EM-002 (job submission through the connector
runtime) is recorded in §5 for the merge workbook.

**D3 — A scripted job with no operations: malformed, or blocked?**
Options: (a) treat it as an invalid document; (b) admit it and fail later; (c) refuse with a distinct
code that marks it a *blocker* rather than a malformed envelope.
Choice: (c) `SCRIPTED_SPEC_REQUIRED` with `honest_blocker: true`. Reason: the workbook asks for
"refused/blocked honestly". The document is well-formed — it simply cannot run — and a caller needs
to tell "you sent nonsense" from "this job has no executable specification". (b) would have put the
failure inside execution, where it looks like a runtime fault.

**D4 — How the two execution models are kept apart.**
Choice: admission is mode-specific and symmetric: a scripted job *must* carry `operations[]`, and an
agent-mode job *must not*. Reason: the workbook's core requirement is that one model is not forced
onto the other; validating only one direction would leave agent jobs that are silently scripted (or
scripted jobs that can never be executed) as legal documents.

**D5 — Event ordering: reject out-of-order, or reconcile it?**
Choice: reconcile deterministically — order by `(sequence, event_id)`, treat a duplicate `event_id` as
a no-op, ignore a sequence at or below the last applied one with reason `LATE_EVENT`, and apply a
forward jump with `gap_before: true` recorded on the applied entry. Reason: the acceptance line is
"late and duplicate events are deterministic/idempotent", not "ordering is guaranteed"; a transport
that may reorder (RF RPC/EVENT/STREAM) makes rejection the wrong policy. A gap is defined as *any*
sequence that is not exactly the next one, including the first event of a stream, because a stream
that starts at 5 does have holes and hiding that would make the audit misleading. (This rule was
changed during development after the first test run showed the initial `last_sequence > 0` guard
silently labelled a mid-stream start as clean.)

**D6 — Where terminal immutability is enforced.**
Choice: in `applyEvent`/`applyResult` (state), not only in the validator. Reason: a well-formed event
can arrive after a job has finished; the refusal must be a recorded `TERMINAL_JOB_IS_FINAL` on the
record rather than an exception, so a late stream does not look like a fault. Re-applying the *same*
result is an idempotent no-op (`DUPLICATE_RESULT`); a *different* result throws `TERMINAL_JOB_IS_FINAL`.

**D7 — Progress vs terminal.**
Choice: a partial event is modelled as a required `partial` block with `progress_percent`; any event
whose progress is below 100 may not carry a terminal state, and 100 is the only shape that can. This
makes "partial output cannot mark a job terminal" a property of the data rather than of a code path.

**D8 — Artifact provenance.**
Choice: provenance is a required block carrying `device_ref`, `connector_ref` and an optional
`event_ref`; the job reference is on the envelope; the digest must be a real `sha256:<64 hex>`. The
provenance is copied on attach, so a caller cannot rewrite what was recorded. Reason: the acceptance
line names job/device/connector provenance explicitly.

**D9 — Transport neutrality.**
Choice: the envelopes reject unknown fields, so an RF transport field (for example `transport:
'RF_STREAM'`) is a validation error rather than an accepted addition. Recorded because the workbook
says RF carriage may exist but RF envelopes never replace the canonical Engineering envelopes — the
strict shape is what makes that enforceable rather than a convention.

**D10 — No `schema.json`.**
Choice: runtime/protocol semantics validated in code, consistent with BA-002 D2 and BA-003 D2.

**D11 — PROCESS_DATA_POLICY evolution inbox.** Not used, consistent with EM-001 D13 / EM-002 D14 and
the other programmes' reports.

## 3. Test summary

9 tests, all passing: autonomous/interactive admission without operations and refusal when scripted; a
scripted job refused honestly without operations and admitted with them; envelope strictness (route,
version, mode, risk, placement, unknown fields, nested target/permissions, raw-secret refusal); a
partial event cannot be terminal while a 100 % event can; batch reconciliation with duplicate, late
and out-of-order events (including order-independence and gap reporting); terminal result finality with
idempotent replay and refused resurrection by result or event; result honesty (acceptance required for
success, no failing tests on success, version and job-reference matching, an honest failure accepted);
artifact provenance (mandatory block, digest shape, idempotent duplicate, cross-job refusal); published
guarantees and transport neutrality.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 110 tests, 110 pass, 0 fail (101 baseline + 9 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail (7 skipped as in baseline) |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36721305141 on 8c16cfc266a9869ace2c059f7959322282285663 | success (android success observed; run-level conclusion completed/success — the jobs endpoint returned intermittent 502s, so the run conclusion is the authoritative record) |

## 5. Integration seams handed to sibling tasks

- EM-001 (core contracts): this branch's `JOB_SPEC`/`EVENT_SPEC`/`RESULT_SPEC`/`ARTIFACT_SPEC` must be
  reconciled with EM-001's reserved `EngineeringJobEnvelope`/`EngineeringEventEnvelope`/
  `EngineeringResultEnvelope`/`ArtifactEnvelope` at merge (two independent declarations of the same
  family from the same baseline).
- EM-002 (connector runtime): `admitJob` is the admission gate a submitted job passes before the
  runtime sees it; `applyEvent`/`applyResult` are the state side of a connector's progress stream.
- EM-005 (attention): `BLOCKED` is an active non-terminal state, so a blocking attention event does not
  end a job.
- EM-010 (queue/DAG/worker pool): `job_version`, `sequence` and the terminal rules are the invariants a
  pool must preserve when it reorders or retries work.
- EM-013 (Utopia task surface): `jobSummary` is the auditable projection a control surface should show;
  canonical task truth remains in Shared Task Core, not here.
- Remote Fabric: cross-device carriage may wrap these envelopes, but this module rejects transport
  fields, so an RF envelope can never quietly become the canonical Engineering record (D9).

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to make a partial event terminal through a non-obvious shape, to
   resurrect a terminal job by replaying an event with a *new* id, and to attach an artifact whose
   provenance is copied from another job.
2. Confirm D3's blocker semantics (`honest_blocker: true`) as the intended shape for other
   cannot-execute conditions.
3. Confirm the gap rule in D5 (a stream starting at sequence 5 is reported as a gap).
4. The evolution-feed question remains open for the Owner (D11).

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
