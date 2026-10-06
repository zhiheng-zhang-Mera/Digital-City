# BA-002 Development Report — Assistant Core (Shared Brain Runtime)

```text
MISSION                  = BA-002 (Butler Assistant programme)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 0598905 (Digital-City main, claim of BA-002 Development by Mech)
CLAIMED_AT               = 2026-09-30T12:19:49Z
CONTROL_REVISION_AT_CLAIM= 4e5e274 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-002-shared-brain-runtime
IMPLEMENTATION_HEAD_SHA  = d3fbf6c40c695758c3d91ae89162da39a7003349
BRANCH_CI                = 36714457772 — gateway-web success, android success
LOCAL_CHECK_SUMMARY      = 115/115 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

New contract package `contracts/assistant-core-v1/`:

| File | Purpose |
|---|---|
| `core.mjs` | Assistant Core: authoritative durable state, embodiment sessions, typed promotion, ContextProjection, causal log, recovery |
| `profile-port.mjs` | `AssistantProfilePort` — the versioned seam to the BA-001 Butler Zone contract, plus a deterministic double |
| `index.mjs` | Public surface |
| `tests/conformance.test.mjs` | 14-test conformance suite |
| root `tests/assistant-core.test.mjs` | Registers the suite with `pnpm test` |

Acceptance mapping:

- authoritative durable-state boundary (identity/profile **references**, memory/relationship references, task/commitment references, checkpoints, causal/event log) → `assistantStatus`, `readDurable`, `causalLog`, `snapshot`, `assertProfileReference`.
- ContextProjection as embodiment/session-specific material → `projectContext`.
- live token context, scratch reasoning, plan drafts, uncommitted inference and UI transient state kept outside shared state → `setTransientState` (typed kinds only) + snapshot exclusion + promotion guards.
- multiple simultaneous embodiments → `connectEmbodiment`/`disconnectEmbodiment`/`assistantStatus`.
- typed commit/promotion paths → `promote` with `DURABLE_KINDS`.
- lifecycle/recovery without becoming separate minds → `restoreAssistantCore` (process restart) and `core.reloadFromSnapshot` (in-process recovery) with epoch invalidation.

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim after EM-001.**
Options: (a) wait for an eligible Correction; (b) claim in a programme already occupied; (c) claim unclaimed Development in a third programme.
Choice: BA-002. Reason: the fresh scan found no owned repair and no eligible opposite-host Correction (Alien's RF-001 was still in progress), so the unclaimed-Development tier applied; BA is a different programme from my previous claim (EM), satisfying the tie-break, and BA-002 closes the largest architectural gap in the programme while depending on a seam I already know exactly.

**D2 — No `schema.json` for this task.**
Problem: BA-001 and EM-001 both published a JSON Schema; the programme has no explicit rule.
Options: (a) also publish a schema; (b) rely on runtime validators + tests.
Choice: (b), recorded as a deliberate deviation. Reason: BA-002 defines runtime/session semantics (what may be shared, when a write is legal, what a projection may disclose) rather than a wire document; the only cross-module surface is the `AssistantProfilePort`, which is a port contract. Publishing a schema for in-memory state would be decorative and would double-maintain the same rules.

**D3 — Cross-branch discipline with BA-001.**
Problem: BA-002 branches from the frozen baseline that does **not** contain BA-001's Butler Zone; the programme forbids copying a sibling implementation.
Options: (a) copy BA-001's profile logic in; (b) depend on nothing and invent profile state; (c) depend on a self-declared versioned port.
Choice: (c) `AssistantProfilePort.resolveProfileReference(assistantId) → {profile_ref, profile_revision}`, with `ASSISTANT_PROFILE_PORT.integration_status = WAITING_FOR_BA001_BUTLER_ZONE_BINDING` and a deterministic double for local tests. Reason: the Core needs identity continuity, not profile contents; the port keeps the seam honest and makes the eventual merge a binding rather than a rewrite. `assertProfileReference` rejects any extra key, which is what prevents profile fields from being copied into authoritative assistant state.

**D4 — How embodiment-local state is represented.**
Options: (a) an untyped scratch bag per embodiment; (b) typed transient kinds.
Choice: (b) `setTransientState(embodimentRef, {kind})` with `kind ∈ TRANSIENT_ONLY_KINDS`. Reason: an untyped bag invites exactly the leak this task forbids; typing makes both guards enforceable and testable — a durable kind sent to the transient path fails with `DURABLE_KIND_REQUIRES_PROMOTION`, and scratch sent to the durable path fails with `EPHEMERAL_STATE_CANNOT_BE_PROMOTED_AS_IS`.

**D5 — Promotion is version-checked, never last-writer-wins.**
Choice: `expectedRevision` is **required** for durable promotion (`REVISION_CHECK_REQUIRED` when absent or non-integer); a mismatch is `STALE_REVISION`. Reason: acceptance explicitly requires version/causal checks rather than silent overwrite; making the check optional would have left a silent-overwrite path.

**D6 — Ordering of the idempotency check and the revision check.**
Problem: a promotion may commit and then fail to acknowledge, so the caller retries with an outdated revision.
Choice: the idempotency lookup runs first, so an already-applied promotion replays (`replayed: true`, same `record_id`, revision unchanged) even with a stale `expectedRevision`; only a *new* key is subject to the revision check. Reason: otherwise a committed-but-unacknowledged write could never be safely retried, which is precisely the duplicate-side-effect risk this contract exists to prevent. The fingerprint is computed over a stable (key-order-independent) serialization so a retry with different key order still replays.

**D7 — Record identity.**
Problem found in self-review: a global counter produces colliding record ids after recovery.
Choice: `<assistant_id>:record:<per-assistant sequence>`. Reason: recovery seeds records from a snapshot without replaying the original counter; deriving the id from the assistant plus its own sequence makes the id stable and collision-free across restore.

**D8 — Two distinct recovery modes (design defect found before push).**
Problem: the first draft made `EMBODIMENT_SESSION_EXPIRED` unreachable, because a process restart has no knowledge of previous handles at all.
Options: (a) keep only process restart and drop the epoch guard; (b) model both restart and in-process recovery.
Choice: (b). `restoreAssistantCore(snapshot)` creates a new core (previous handles unknown → `EMBODIMENT_NOT_CONNECTED`, `attestEmbodiment` → `UNKNOWN_EMBODIMENT`), while `core.reloadFromSnapshot(snapshot)` replaces durable state in the running core, advances the epoch and keeps handles registered so they are provably stale (`EMBODIMENT_SESSION_EXPIRED`, `attestEmbodiment` → `SESSION_EXPIRED`, projection `scope_stale: true`). Reason: local state is a cache, not authority — both real recovery shapes must force the device to reconnect and re-fetch authority, and neither may resume side effects from scratch state. Recorded because the development host rejected its own first design.

**D9 — Authority/user-identity versus raw-secret rejection.**
Choice: two typed codes, `PROMOTION_AUTHORITY_FORBIDDEN` and `PROMOTION_SECRET_FORBIDDEN` (initially one code). Reason: "this is not assistant state" and "this is not storable anywhere" are different diagnoses for the caller.

**D10 — Disclosure filtering.**
Choice: a record is projected only when its `scope` was explicitly requested **and** its `audience` is visible in the requesting audience's matrix; omitted records are reported in `withheld` with `SCOPE_NOT_REQUESTED` or `AUDIENCE_NOT_PERMITTED`. Reason: invariant 7 — knowing a record exists does not authorize emitting it; explicit withholding reasons let a caller prove nothing was silently leaked or silently dropped. `DEVICE_EPHEMERAL` scope can never be promoted (`EPHEMERAL_SCOPE_CANNOT_BE_PROMOTED`).

**D11 — Snapshot contents.**
Choice: durable records and the causal log only; embodiment handles and transient state are excluded, and projections carry `core_epoch`/`scope_stale` so staleness is visible rather than silently served. Reason: a snapshot that carried local scratch would let recovery resurrect uncommitted inference as truth.

**D12 — Scope deliberately not implemented.**
Choice: no device UI, no foreground binding, no permission/lease computation and no task-ownership transfer. Reason: BA-003 (embodiment/foreground), BA-008 (lease/reconnect safety) and BA-009 (duties/permission) own those; implementing them here would duplicate sibling contracts. The executor/lease seam is recorded below.

**D13 — PROCESS_DATA_POLICY evolution inbox.**
Choice: not used, consistent with BA-001 D11 and EM-001 D13; this report is the construction record.

## 3. Test summary

14 tests, all passing: cross-embodiment visibility of a committed record; two embodiments with different local context sharing one authoritative identity/profile reference; assistant survival after one embodiment disconnects (and its handle being gone); transient state never leaking into shared state or snapshots plus typed promotion guards; revision-checked concurrent promotion with a retry path and no silent overwrite; idempotent promotion and key-reuse refusal; user-identity/authority/secret rejection with profile-reference-only enforcement; disclosure limited by audience and requested scope with explicit withholding; recovery keeping one assistant and its durable records; process-restart session refusal; in-process recovery expiring live sessions until re-fetch; one expired embodiment not disturbing the assistant; profile-port seam with deterministic double; contract invariant flags.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 115 tests, 115 pass, 0 fail (101 baseline + 14 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail (7 skipped as in baseline) |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36714457772 on d3fbf6c40c695758c3d91ae89162da39a7003349 | gateway-web success, android success |

## 5. Integration seams handed to sibling tasks

- BA-001 (Butler Zone): provide `resolveProfileReference(assistantId) → {profile_ref, profile_revision}` over `AssistantZone`; then flip `integration_status` and replace the deterministic double. No profile field may be copied into core state.
- BA-003 (embodiment/foreground binding): `connectEmbodiment`/`embodimentRef` is identity continuity for a device session; foreground election and its single-foreground-per-device rule must be added above this contract, not inside it.
- BA-004 (handoff): promotion transfers committed checkpoints/decisions; a handoff must use `promote` (scope + audience) and must not copy permission (none exists in core state by construction).
- BA-005 (Digital-Me gateway): `USER_GLOBAL` scope exists in `MEMORY_SCOPES` but no Digital-Me source is bound here; BA-005 owns authorized retrieval and must project through `projectContext` so audience filtering stays in one place.
- BA-006 (task coordination): `TASK_REFERENCE` records are references; canonical task truth remains outside the assistant core.
- BA-008 (lease/reconnect): `attestEmbodiment`/`scope_stale`/epoch invalidation are the revalidation hooks a device must call before resuming side effects; lease state itself is not stored here.
- BA-009 (duties/permission): core state rejects authority fields, so effective permission must be computed outside the Core.

## 6. Open items for the Correction host / Owner

1. Adversarial review should attempt to leak transient state (deep nesting inside a transient value, prototype-pollution keys, array payloads), to bypass the audience matrix (record promoted under a different scope than its content suggests, audience escalation through promotion), and to defeat recovery (stale handle reuse on a reloaded core, snapshot tampering with an older `core_epoch`, duplicate promotion across a reload).
2. Confirm the D2 decision (no published JSON Schema) for runtime-semantics tasks in this programme.
3. Confirm whether an evolution/process-data record is wanted for BA component work (D13).

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
