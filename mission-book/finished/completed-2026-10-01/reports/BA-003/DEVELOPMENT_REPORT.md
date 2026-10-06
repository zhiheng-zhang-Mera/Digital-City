# BA-003 Development Report — Device Embodiment + Foreground Binding

```text
MISSION                  = BA-003 (Butler Assistant programme)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = de097e7 (Digital-City main, "claim(BA-003): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T12:49:29Z
CONTROL_REVISION_AT_CLAIM= 94b6431 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-003-device-embodiment-binding
IMPLEMENTATION_HEAD_SHA  = eb3b1a1233a05c056dcc366341c76e0a20faa2f5
BRANCH_CI                = 36717697673 — gateway-web success, android success
LOCAL_CHECK_SUMMARY      = 115/115 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
TASK-SPECIFIC EXTERNAL   = none required (no UI/device acceptance in this bounded scope)
```

## 1. Deliverable

| File | Purpose |
|---|---|
| `contracts/assistant-embodiment-v1/descriptors.mjs` | Embodiment descriptor vocabularies, the Remote Fabric identity reference, competing-identity guard, strict descriptor validation |
| `contracts/assistant-embodiment-v1/registry.mjs` | Embodiment registry, many-to-many attachment, exclusive foreground binding, device-local context, the read-only task observation port, snapshot/restore/revalidation |
| `contracts/assistant-embodiment-v1/index.mjs` | Public surface + published guarantees |
| `contracts/assistant-embodiment-v1/tests/conformance.test.mjs` | 14-test conformance suite |
| root `tests/assistant-embodiment.test.mjs` | Registers the suite with `pnpm test` |

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| One assistant can bind to PC and Android concurrently | `one logical assistant inhabits PC and Android at the same time`; `one assistant on many devices keeps each device independent` |
| A device refuses a second simultaneous foreground assistant binding | `a device refuses a second simultaneous foreground assistant` (`FOREGROUND_ALREADY_BOUND`) |
| Foreground A→B while an unrelated A-owned background task remains A-owned and continues safely | `a foreground switch leaves an unrelated background task owned, executing and uncancelled` |
| Switching foreground does not silently create task handoff, cancel work or replace executor ownership | same test: the read-only port call log contains no mutating method, and the task row is byte-identical before/after |
| Device-local state is released/rebound cleanly on switch | `foreground A->B switches cleanly and releases the outgoing local context`; `device-local context stays per-device and never becomes authoritative` |
| Binding reconstructs after supported restart from authoritative state, never from stale local ownership assumptions | `binding reconstructs from authoritative state after a restart`; `a reconnecting device is refused when its local belief disagrees with authority` (`STALE_LOCAL_BINDING`) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.**
Choice: BA-003. Reason: the fresh scan found no owned repair and no eligible opposite-host Correction (BA-002 Correction was claimed by Alien, RF-002 Development was in progress by Alien), so the unclaimed-Development tier applied. BA is a different programme from my previous claim (GAI), which the tie-break prefers, and BA-003 is the next foundational Butler piece after the contracts I authored in BA-001/BA-002.

**D2 — Where the deliverable lives.**
Choice: `contracts/assistant-embodiment-v1/`, consistent with BA-001 and BA-002, with a thin root test entry and no `schema.json`. Reason: this is binding/session semantics, not a wire document (the same judgement recorded as BA-002 D2); and no City building is implied for a contract layer.

**D3 — Cross-branch discipline: physical-device identity.**
Problem: BA-003 must not mimic Remote Fabric device identity, and it must not consume BA-001/BA-002 (unmerged siblings from the same frozen baseline — copying is forbidden).
Options: (a) mint a Butler-local device id; (b) leave identity entirely to the caller with no shape; (c) reference the canonical identity with a typed shape that is usable but non-authoritative.
Choice: (c). `device_identity_ref` is `{authority:'REMOTE_FABRIC', device_id, installation_ref}` where `device_id` matches the Remote Fabric `dev-<32 hex>` pattern, and `identity_source` must be `REMOTE_FABRIC` with a reference or `UNAVAILABLE` with `null` — the two cannot disagree. A recursive guard rejects Butler-owned identity/trust fields (`butler_device_id`, `device_trust_state`, `device_key`, …). Reason: Butler may *know* which physical device it is on without becoming the authority for it; (a) would create the competing namespace the workbook forbids, and (b) would force every caller to invent an ad-hoc shape.

**D4 — How "switching foreground never moves tasks" becomes structural.**
Options: (a) document that the registry does not touch tasks; (b) reach tasks through a port whose method set cannot mutate anything.
Choice: (b) `TaskObservationPort` with exactly `listTasksOwnedBy`, `describeExecutor`, `isLeaseValid`, `isCapabilityAvailable`, plus published flags `may_mutate_ownership/may_cancel/may_reassign_executor: false`. The deterministic double logs every call, and the test asserts that after a foreground switch the only methods called are observation methods and the task row is unchanged. Reason: a promise is not testable; a method set is.

**D5 — Two foreground operations instead of one.**
Options: (a) a single `setForeground` that always overwrites; (b) `bindForeground` + `switchForeground`.
Choice: (b). `bindForeground` refuses when the device already has a foreground assistant (`FOREGROUND_ALREADY_BOUND`), which is the acceptance line "a device refuses a second simultaneous foreground assistant binding"; `switchForeground` performs an explicit handover and accepts an optional `expectedForegroundRef` compare-and-set. Reason: with (a) the refusal case is untestable and a caller holding a stale view could silently take over someone else's device. The CAS path is tested (`FOREGROUND_MISMATCH`).

**D6 — Device-local context classification.**
Options: (a) an untyped per-device bag; (b) typed kinds + explicit non-authoritative marker.
Choice: (b) `SENSORY_CONTEXT | UI_TRANSIENT | LOCAL_SCRATCH`, each entry stored with its instant, excluded from `snapshot()` by construction, released on foreground switch/release/detach and cleared when a revalidation reports a stale belief. Reason: same reasoning as BA-002 D4 at the device boundary — an untyped bag invites exactly the leak the programme forbids, and excluding it from the snapshot is what makes recovery unable to resurrect local assumptions.

**D7 — Recovery is not a single boolean.**
Choice: `restoreEmbodimentRegistry` re-seeds durable bindings through the same exclusivity gate and returns `restored_foreground` (marked `RESTORED_FROM_AUTHORITY`) plus `revalidation_required_for`; `revalidateEmbodiment` then answers one of four distinct reasons: `AUTHORITATIVE_AGREEMENT`, `STALE_LOCAL_BINDING`, `AUTHORITATIVE_NO_FOREGROUND`, `LOCAL_SESSION_HAS_NO_FOREGROUND`. Reason: "you are out of date" and "nobody holds this device any more" are different facts with different recoveries; collapsing them would make a device's next action ambiguous. A stale belief also clears that device's local context, because it belonged to a session authority no longer recognises.

**D8 — Detaching the foreground assistant.**
Problem: the workbook does not say what detaching while foreground does.
Choice: it releases the binding and its local state. Reason: a device must not keep a foreground interaction assistant it is no longer attached to; leaving the binding would let a detached assistant keep answering. Recorded because it is a policy choice, not something the workbook states.

**D9 — Duplicate/refresh semantics for descriptors.**
Choice: re-registering the *same* embodiment is an idempotent refresh (a device may update its capabilities or display name), but a different `device_id` under an existing `embodiment_ref` is refused (`EMBODIMENT_DEVICE_MISMATCH`) and one `device_id` under two embodiments is refused (`DUPLICATE_DEVICE_IDENTITY`). Reason: the former stops a device from being silently re-pointed at another physical device; the latter stops one physical device from being modelled twice, which would defeat the foreground-exclusivity invariant.

**D10 — `ui_surfaces: ['NONE']`.**
Choice: `NONE` is exclusive — a device with no UI may not also declare a surface. Reason: an ambiguous descriptor would make "which surface answers the foreground assistant" undecidable.

**D11 — Android / Computer-Use acceptance.**
Choice: not used. Reason: this bounded task is a contract/session layer with no UI and no device interaction surface; the workbook's out-of-scope list explicitly excludes device-specific UI beyond adapter contracts. Recorded because the Owner authorised Android Studio and a Computer-Use plugin *if acceptance required them* — it did not, so no observation was performed and none is claimed.

**D12 — PROCESS_DATA_POLICY evolution inbox.**
Choice: not used, consistent with BA-001 D11, BA-002 D13, EM-001 D13, GAI-001 D10, RF-001 D8.

## 3. Test summary

14 tests, all passing: Remote Fabric identity reference + competing-identity rejection; identity-unavailable devices represented honestly; closed descriptor vocabularies (capabilities, sensors, surfaces, actions, kind, locality, version, unknown fields, `NONE` exclusivity, instant and handle validation); one assistant on PC and Android concurrently with attachment ≠ foreground; second simultaneous foreground refused; detach releases foreground; clean A→B switch releasing outgoing local context; stale-view takeover refused with CAS and idempotent re-switch; background continuity across a switch with a read-only call log; device-local state per-device and non-authoritative; restart reconstruction from authoritative state with local context dropped; reconnect revalidation with four distinct reasons; per-device independence with butler foreground on two devices; duplicate device identity / unknown embodiment / constructor refusal.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 115 tests, 115 pass, 0 fail (101 baseline + 14 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail (7 skipped as in baseline) |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36717697673 on eb3b1a1233a05c056dcc366341c76e0a20faa2f5 | gateway-web success, android success |

## 5. Integration seams handed to sibling tasks

- BA-002 (Assistant Core): `attachAssistant`/`detachAssistant` are the device side of the Core's `connectEmbodiment`; the Core owns the session epoch, this registry owns the device-local binding and context. Reconciliation belongs in the merge workbook: `embodiment_ref` should name the Core session identity once both branches land.
- BA-004 (handoff): a handoff moves responsibility, never foreground. If a handoff should also move the foreground assistant, it must be two explicit operations (handoff + `switchForeground`), not one.
- BA-007 (settings/interaction surface): `bindForeground`/`switchForeground`/`listAssistantsForDevice` are the calls a per-device assistant picker needs; `FOREGROUND_ALREADY_BOUND` vs `FOREGROUND_MISMATCH` tells the UI whether to offer a switch or refresh.
- BA-008 (event bus/lease): foreground is explicitly **not** an execution lease (`is_execution_lease: false` in every binding); the lease lifecycle is BA-008's.
- BA-009 (duties/permission): the registry grants nothing; an attached assistant is present, not authorized.
- Remote Fabric (RF-001): `device_identity_ref.device_id` uses RF's `dev-<32 hex>` shape so a real RF identity can be referenced unchanged once RF is accepted; Butler never mints one.
- Android/Web surfaces (GAI-009-style integration): a client reports its own descriptor via `descriptorFor` and revalidates on reconnect; it must never assume it still holds the foreground.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to reach two foreground assistants on one device (concurrent switch races, restore-then-bind paths, detach during switch), to leak device-local context across a switch, and to make a task change owner/executor through any registry call.
2. Confirm D8 (detaching the foreground assistant releases the binding) and D9 (descriptor refresh semantics) as intended policy.
3. Decide in the merge workbook how `embodiment_ref` (this branch) and the Assistant Core's session/embodiment identity (BA-002) are unified.
4. Confirm whether an evolution/process-data record is wanted for BA component work (D12).

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
