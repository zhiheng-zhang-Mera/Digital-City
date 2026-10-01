# EM-001 Development Report — Core Contracts + Engineering Ownership Boundaries

```text
MISSION                  = EM-001 (Engineering Manager programme)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 04ec68d (Digital-City main, claim of EM-001 Development by Mech)
CLAIMED_AT               = 2026-09-30T12:08:39Z
CONTROL_REVISION_AT_CLAIM= ef706ef (latest main when the claim was made; contained Alien's RF-001 claim 7e1a499)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DONOR_REPO               = zhiheng-zhang-Mera/DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b (pinned, NOT read at runtime, NOT a dependency)
IMPLEMENTATION_BRANCH    = engineering-manager/EM-001-core-contracts-boundaries
IMPLEMENTATION_HEAD_SHA  = efa127b38e5285ec9beb25d85fc21160c13d5f7a
BRANCH_CI                = 36713450542 — gateway-web success, android success
LOCAL_CHECK_SUMMARY      = 123/123 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

New contract package `contracts/engineering-manager-v1/`:

| File | Purpose |
|---|---|
| `canonical.mjs` | Deterministic canonical JSON + sha256 digests (order-independent identity) |
| `ownership.mjs` | Canonical concern→owner map, reserved `ENGINEERING` route, Engineering-owned state allowlist, foreign-route/foreign-state/secret/Codex-Boss scans, `CanonicalTaskTruthPort` |
| `envelopes.mjs` | Versioned job, event, attention, result, artifact, connector descriptor/instance, capability manifest, auth status and remote-fallback envelopes with strict validators |
| `ports.mjs` | `EngineeringManagerPort` / `ConnectorPort` / `ConnectorRegistryPort` / `EngineeringRemoteExecutionPort` / `CanonicalTaskTruthPort` contracts, conformance probe, deterministic connector double |
| `replay.mjs` | Idempotency ledger for submit/control/result, stable job identity, job-version/transition/terminal rules |
| `index.mjs` / `schema.json` | Public surface and published JSON Schema |
| `tests/conformance.test.mjs` | 22-test conformance suite |
| root `tests/engineering-manager.test.mjs` | Registers the suite with `pnpm test` |

Acceptance mapping:

- versioned `EngineeringManagerPort`/`ConnectorPort`/`ConnectorRegistryPort`/`EngineeringRemoteExecutionPort` → `PORT_CONTRACTS` + `describePort` + `probePortConformance`.
- canonical job/connector-instance/execution-host/owner/coordinator/executor/lease identifiers → `JOB_SPEC` (`job_ref`, `city_task_ref`, `owner`, `executor`, `connector_instance_ref`, `lease_ref`).
- `ENGINEERING` reserved as the product/task semantic route without exposing HNS/CODEX/CLAUDE/WORKBUDDY as ownership routes → `validateEngineeringRoute` + `PROVIDER_PRODUCT_PATTERN`.
- City/Shared Task Core stays canonical; EM owns only execution state → `ENGINEERING_OWNED_STATE_FIELDS`, `FOREIGN_CANONICAL_FIELDS`, `CANONICAL_TASK_TRUTH_PORT`.
- idempotency/replay/version rules for submit/control/result → `createIdempotencyLedger`, `submitJob`, `applyControlCommand`, `applyResult`.
- separation from GAI/BA/RF/City authorization → `CANONICAL_OWNERSHIP`, foreign-route and foreign-field rejection.

## 2. Decision log (problem → options → choice → reason)

**D1 — Next claim after BA-001.**
Options: (a) wait for a Correction to become eligible; (b) claim another BA task; (c) claim an unclaimed Development in another programme.
Choice: EM-001. Reason: a fresh global scan found no actionable owned repair and no eligible opposite-host Correction, so tier 3 applied; Alien had just claimed RF-001, so choosing Engineering Manager both satisfies the "prefer a different programme" tie-break and avoids two hosts converging on one programme. EM is also the largest pool (13 of 41 tasks), and EM-001 is the contract foundation that EM-002..EM-013 must reference.

**D2 — Where the contract lives.**
Choice: `contracts/engineering-manager-v1/` with a thin root test entry — the same decision as BA-001 D3, for the same reason (repository contract pattern + root `tests/*.test.mjs` CI glob). No runtime service and no connector implementation were created: the task is boundary definition, and inventing a service would pre-empt EM-002/EM-004 scope.

**D3 — Boundaries as documents or as executable checks?**
Options: (a) a markdown boundary document; (b) validators that fail when a boundary is crossed.
Choice: (b). Reason: every EM-001 acceptance criterion is a negative invariant ("is not redefined", "is rejected", "cannot become", "no raw secret"). A document cannot fail a build or a future connector; `validateEngineeringRoute`, `findForeignCanonicalFields`, `findSecretFields` and `findForbiddenDonorReferences` can, and they are exercised by tests.

**D4 — Owner/coordinator vs executor modelling.**
Options: (a) one `owner` string plus an optional `host`; (b) two required sub-objects with explicit role resolution.
Choice: (b) `owner{task_owner_ref, coordinator_ref}` + `executor{host_kind, host_ref, placement}` plus `resolveJobRoles()` reporting `executionHostChangeCreatesNewOwner: false`. Reason: invariant 10 and the remote-execution rule "changing execution host does not create a new task owner" must hold even when one physical host fills both roles; `applyApprovedFallback` is tested to preserve `owner.task_owner_ref` across a local→remote move.

**D5 — How to make ports "replacement-safe" testable.**
Options: (a) TypeScript-style declarations only; (b) data-driven method lists plus a runtime conformance probe; (c) probe plus a deterministic double.
Choice: (c). Reason: async construction explicitly allows stable ports plus deterministic test doubles for missing siblings. The probe reports missing methods, non-function members and extension surface, and `createDeterministicConnectorDouble` lets EM-002..EM-012 run bounded tests with no provider installed while still returning only scripted outcomes (it cannot silently report success).

**D6 — What an idempotency digest must cover.**
Problem: a retry/reconnect resends an envelope whose volatile fields (state, job_version, checkpoints, timestamps) have legitimately changed.
Options: (a) digest the whole envelope; (b) digest the semantic operation only.
Choice: (b) — submit digest covers the submit intent (`submitIntentOf`: route, refs, mode, owner, workspace, scope, acceptance, risk, operations, key), control digest covers `{job_ref, kind, job_version, issuer}`, result digest covers `{job_ref, result_ref, outcome, acceptance}`. Reason: (a) turns every legitimate retry into `IDEMPOTENCY_KEY_REUSE`, while the real guarantee needed is "same key + different intent = refuse". This was a genuine design fork and is recorded because it determines retry behaviour after restart.

**D7 — Unknown/stale version policy.**
Choice: refuse stale (`STALE_JOB_VERSION`) and future (`FUTURE_JOB_VERSION`) versions, refuse resuming terminal jobs (`JOB_ALREADY_TERMINAL`) and refuse overwriting a finished job with another result (`DUPLICATE_RESULT_CONFLICT`). Reason: acceptance requires unknown version/state/route rejection rather than guessing, and duplicate-side-effect safety requires that a terminal job cannot be resurrected by a late event.

**D8 — Attention envelope shape.**
Options: (a) one question envelope per device; (b) one shared envelope with typed projections.
Choice: (b) `attention_id` shared across 1 actionable projection + up to 3 recent-device notify/ring projections; `acknowledgeAttention` implements first-valid-ack-wins and forces every projection to stop ringing/being actionable; `projectAttention` suppresses re-delivery for already-delivered or acknowledged epochs. Reason: EM invariants 1–3/6 and final acceptance 15–18; model (a) would have created independent questions and re-ringing on reconnect.

**D9 — False-success defence.**
Choice: `SUCCEEDED` requires `acceptance.status = PASS`, no failing tests and `blocking_state = null`; a typed blocker (for example `PHYSICAL_ACTION_REQUIRED`) can never be reported as success. Reason: rule 10/acceptance 20 — a hardware-bound action must be reported honestly as a typed blocking state.

**D10 — Provider neutrality.**
Choice: provider product names are never routes and never required fields; only `ConnectorDescriptor.provider_ref` may name a provider, and only as an opaque reference; Codex-Boss is rejected anywhere it appears, including inside string values. Reason: acceptance "no provider product name is required by the core contract" plus the programme rule that Codex-Boss is a tombstone and DS-Hns is not a runtime dependency.

**D11 — Remote fallback shape.**
Choice: `requires_user_approval` is `const true`, candidate objects have a strict field set (so a `speed_rank`/load score cannot be smuggled), `reason`/`measured_reason` are limited to measured local blocking states, `scope` is `CURRENT_JOB`, and dispatch preserves the logical owner. Reason: LOCAL_FIRST invariants — a faster idle remote host alone must never trigger fallback and V1 requires explicit user approval.

**D12 — Schema/runtime drift.**
Choice: the conformance suite derives required keys and enums from the runtime specs and compares them with `schema.json`, so either side changing alone fails the build. Reason: prevents the published schema from becoming decorative (this is also why BA-001's speculative per-port version keys were removed there).

**D13 — PROCESS_DATA_POLICY evolution inbox.**
Choice: not used, consistent with BA-001 D11; this report is the construction record. Reason: the policy's event vocabulary is migration-scoped and self-invented event types are forbidden.

## 3. Test summary

22 tests, all passing: provider-neutral autonomous job + distinct owner/executor roles; scripted-vs-agent operations rules; unknown version/state/mode/event-type/port rejection; foreign-route rejection; provider-name route rejection with `provider_ref` allowed; Codex-Boss rejection across job/event/connector; raw-secret rejection with handle allowance; Engineering-owned-state allowlist and foreign canonical state rejection; typed event validation; attention projection rules (one actionable, ≤3 recent, distinct devices, no informational ringing); first-ack-wins and no re-ringing on reconnect; result false-success defences; port conformance probe and extensions; deterministic connector double run; duplicate submit replay and key-reuse refusal; control version/transition/terminal rules; result idempotency and terminal conflicts; job identity across restart/reconnect and incompatible-envelope rejection; measured user-approved remote fallback preserving ownership; canonical digest stability plus schema↔runtime consistency; error type contract.

Negative paths assert both the typed error code and that no state changed.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 123 tests, 123 pass, 0 fail (101 baseline + 22 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail (7 skipped as in baseline) |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36713450542 on efa127b38e5285ec9beb25d85fc21160c13d5f7a | gateway-web success, android success |

## 5. Integration seams handed to sibling tasks

- EM-002/EM-004/EM-011/EM-012: implement `ConnectorPort` and pass `assertPortConformance`; register through `ConnectorRegistryPort`; use `createDeterministicConnectorDouble` in tests. Only `ConnectorDescriptor.provider_ref` may name a provider.
- EM-003: `JOB_SPEC`/`EVENT_SPEC`/`RESULT_SPEC`/`ARTIFACT_SPEC` are the canonical wire shapes; use `parseJobEnvelope`/`jobIdentityDigest` for restart/reconnect identity.
- EM-005: `ATTENTION_SPEC` + `acknowledgeAttention`/`projectAttention` implement the one-event-many-projections rule; delivery/ring policy and device quiet-mode remain EM-005 scope.
- EM-006/EM-007: `PLACEMENT_STATES`, `validateRemoteFallbackProposal`, `applyApprovedFallback` implement LOCAL_FIRST and owner preservation; measured local pressure feeding `LOCAL_BLOCKED/LOCAL_UNAVAILABLE` is EM-006 scope.
- EM-008: `AUTH_STATUS_SPEC.credential_ref` is a handle; the neutral SecureHandleStorePort owns storage.
- EM-009: `RECOVERING`/`BLOCKED` states and terminal-job rules must be respected by restart supervision.
- EM-013: canonical task truth stays behind `CanonicalTaskTruthPort` (Shared Task/Action Core); EM reports execution state, results and attention through it.
- RF/GAI: `EngineeringRemoteExecutionPort` adapts to Remote Fabric public APIs; it is not an independent transport. Device identity comes from Remote Fabric, never minted here.

## 6. Open items for the Correction host / Owner

1. Adversarial review should attempt to smuggle provider identity or foreign semantics through unenumerated paths (nested string values, arrays, `provider_ref` overflow, case variants of foreign route names, prototype-pollution keys).
2. Confirm the idempotency-digest scope decision (D6) if a future connector needs a different retry identity.
3. Confirm whether an evolution/process-data record is wanted for EM component work (D13), as for BA-001.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
