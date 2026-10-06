# EM-007 Development Report — Remote Sub-worker Execution + Automatic Return/Control

```text
MISSION                  = EM-007 (Engineering Manager programme, task 7 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = bae579f (Digital-City main, "claim(EM-007): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:35:11Z
CONTROL_REVISION_AT_CLAIM= f6865b6 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-007-remote-subworker-return-control
IMPLEMENTATION_HEAD_SHA  = 3bd9f556616dbaccfd00cb4620144fdcc669baf1
BRANCH_CI                = 36730656520 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/engineering-return-control-v1/` — `return-control.mjs` (Remote Fabric execution port facade +
double, interaction-surface resolution, the return/control bridge, staged-context semantics), `index.mjs`,
7-test suite, root `tests/engineering-return-control.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| an approved `RemoteFallbackProposal` is required before dispatch in V1 | `a remote dispatch needs an approved proposal and an eligible host` |
| only eligible trusted hosts that satisfy the capabilities are selected | same test (`INELIGIBLE_REMOTE_HOST`) |
| the original job id, owner and canonical truth are kept; the host becomes executor only | same test (`owner_preserved: true`, `executor_kind: 'REMOTE'`) |
| state/stage/progress/events/logs/attention/result/artifact return automatically | `every channel returns to the current interaction surface, not to the execution device` (all eight channels) |
| pause/resume/cancel/respond forward from any authorised device, idempotently | `control is forwarded from any authorised device and applied once` |
| stale, late and duplicate remote events are reconciled | `stale and duplicate remote events are reconciled instead of re-applied` |
| normal operation never needs remote-desktop video or walking to the host | `every channel returns…` (`assertNoRemoteHostInteraction`) and the published contract flags |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Scan: no owned repair and no eligible Correction for Mech (Alien was
correcting EM-003), so the development tier applied. EM-007 chosen under the tie-break (different
programme from my GAI claim) and because it carries the third EM hard invariant.

**D2 — Trust and transport stay elsewhere.** CHOICE: the module adapts an injected
`EngineeringRemoteExecutionPort` and publishes `owns_node_trust: false`, `owns_transport: false`,
`owns_device_identity: false`, `adapts_remote_fabric_public_api: true`. Reason: the workbook puts Remote
Fabric internals out of scope and requires an Engineering *facade*, not a second fabric.

**D3 — What makes the return path checkable?** CHOICE: every returned envelope names both
`origin_device_ref` and `delivered_to_device_ref`, plus `requires_remote_host_interaction: false`, and
`assertNoRemoteHostInteraction` refuses a run whose attention return was delivered anywhere other than the
interaction surface. Reason: "all normal control, attention and results return automatically to the
user-facing/shared control plane" is easy to claim and hard to check; naming both devices makes the
failure mode (delivering to the executor) detectable.

**D4 — Control plane follows the user.** CHOICE: `resolveInteractionSurface` prefers the device marked
current and falls back to the most recently operated *authorised, online* device; the bridge re-resolves
the surface on each return, so a user who picks up another device mid-run keeps control. Execution does not
move with them. Reason: the invariant is about the *user's* surface, not the executor's.

**D5 — Ambiguous "current" input.** PROBLEM: my first test passed two devices both marked `is_current`,
and the resolver broke the tie by device-reference order. CHOICE: refuse it (`INVALID_REQUEST`, naming the
claimants) and correct the test. Reason: two devices claiming the current interaction surface is an input
error; breaking the tie silently decides where the user's control plane is, which is exactly the kind of
quiet arbitrary choice this programme's contracts refuse elsewhere.

**D6 — Control authority.** CHOICE: any device in the resolved authorised set may pause/resume/cancel/
respond (`UNAUTHORIZED_INTERACTION_DEVICE` otherwise), each command applied once by `command_id`, and the
acknowledgement itself returns to the interaction surface. Reason: "forward control from any authorized
interaction device … with idempotent reconciliation" — and the user must see that their command landed.

**D7 — Event reconciliation.** CHOICE: an event whose `origin_device_ref` is not the recorded executor, or
whose channel is unknown, is refused (`INVALID_ENVELOPE`); a sequence at or below the last applied one is
reconciled as `STALE_EVENT`; a repeat of the same (sequence, channel) is not re-applied; and a duplicate
dispatch attempt for a job is refused (`DUPLICATE_EXECUTION`). Reason: retry, reconnect and duplicate
delivery must not produce a second execution or a duplicated result.

**D8 — Hardware-bound actions.** CHOICE: `recordPhysicalActionRequired` records a typed
`PHYSICAL_ACTION_REQUIRED` attention return with `fabricated_success: false`, delivered to the interaction
surface. Reason: the workbook's rule 10 — a genuinely hardware-bound action is reported honestly and never
fabricated as success.

**D9 — Context staging.** CHOICE: staged entries carry a reference and a `sha256` digest with a bounded
entry count and an explicit cleanup policy (`AFTER_RESULT` by default, `AFTER_CANCEL` allowed), and the
result records `opaque_bulk_transfer: false`. Reason: "stage required files/context semantically with
digest/provenance and bounded cleanup policy".

**D10 — No `schema.json`.** Consistent with the other component branches.

## 3. Test summary

7 tests, all passing: approval/eligibility/owner-change refusals with a successful dispatch; all eight
return channels delivered to the interaction surface with origin and no-remote-interaction flags plus
envelope refusals; the control plane following the user to another surface while execution stays put, an
unauthorised device never becoming the surface, and the ambiguous-current refusal; stale/duplicate event
reconciliation with duplicate-dispatch refusal; control forwarding with idempotency, authorised-device
enforcement and command validation; the hardware-bound typed blocker; and staged context with digest
validation plus the port's ownership flags.

One development finding is recorded (D5): the ambiguous `is_current` input, where the module was improved
rather than the test bent.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36730656520 on 3bd9f556616dbaccfd00cb4620144fdcc669baf1 | success |

## 5. Integration seams handed to sibling tasks

- EM-006 (placement): the approved proposal from EM-006 is the dispatch precondition; `owner_ref` on the
  proposal must equal the job owner (this module enforces it).
- EM-005 (attention): a remote worker's attention return should travel through both bridges — EM-005 owns
  the projection fan-out, EM-007 owns getting the event off the execution host and onto the interaction
  surface.
- EM-003 (job protocol): the returned envelopes map onto the job/event/result/artifact family; the
  duplicate/stale rules here complement EM-003's reconciliation.
- EM-009 (health/restart): a crashed remote executor must surface as a typed state return, not as silence.
- Remote Fabric (RF-006/RF-009): this module is a facade — transport, path selection and presence remain
  RF's, and a real implementation injects the RF-backed port.
- GAI-007: the same "interaction device ≠ execution device" shape applies to general-AI remote execution;
  the two facades should share this vocabulary at merge.
- Web/Android surfaces: `status(jobRef).interaction_device_ref` is the surface that should receive every
  return; a client never needs to address the executor directly.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to deliver a return to the executor while claiming otherwise, to apply a
   control twice under different command ids, and to make a stale event advance the sequence.
2. Confirm D5 (ambiguous current surface refused) and whether the fallback order (current, then most
   recently operated authorised device) is the intended resolution.
3. Confirm the default staged-context cleanup policy (`AFTER_RESULT`) and the 64-entry bound.
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
