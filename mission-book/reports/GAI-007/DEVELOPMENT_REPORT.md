# GAI-007 Development Report — Device-Aware Remote Execution + Result Return

```text
MISSION                  = GAI-007 (General AI Gateway programme, task 7 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 0b55626 (Digital-City main, "claim(GAI-007): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:22:40Z
CONTROL_REVISION_AT_CLAIM= 1dd719b (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-007-device-aware-remote-execution
IMPLEMENTATION_HEAD_SHA  = 99858b90e1470e7401d8ffd9cf52ade37d2c4381
BRANCH_CI                = 36743516874 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/general-ai-remote-execution-v1/` — `remote-execution.mjs` (RemoteExecutionPort facade, endpoint
ranking, DeviceSwitchProposal + V1 confirmation, single canonical dispatch, correlated event stream,
cancel from any authorized device, attention surfacing, semantic input staging), `index.mjs`, 7-test suite,
root `tests/general-ai-remote-execution.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Local interaction device remains unchanged after remote dispatch | `a healthy current device is preferred…` and `no execution begins before the V1 device-switch confirmation` (`interaction_device_unchanged: true` on every result; the dispatched action keeps `interaction_device_ref: device:laptop` while `execution_device_ref: device:desktop`) |
| No duplicate Action is created on the execution host | `exactly one canonical Action exists on the execution host…` (second dispatch absorbed: `duplicate: true, dispatched: false, actions_created_on_execution_host: 1`; one port call) |
| Remote progress/partial/final/error all correlate to the same actionId | Same test (`correlated_action_id` on every event; `correlated_action_ids: [action_id]` on the projection) |
| Remote cancel works and late/duplicate events are rejected/reconciled | `remote cancel works from any authorized device and reconciles late results` (idempotent, `LATE_EVENT_AFTER_TERMINAL` reconciled, `final_ref: null`) |
| Stale/offline remote endpoint cannot be selected as healthy | `endpoints are ranked from metadata only, and stale or offline ones are never healthy` (`STALE_ENDPOINT`/`OFFLINE`/`OVERLOADED`/`NO_SESSION` exclusions; `NO_HEALTHY_ENDPOINT` when nothing is healthy) |
| No execution begins before DeviceSwitchProposal confirmation in V1 | `no execution begins before the V1 device-switch confirmation` (`CONFIRMATION_REQUIRED`, `dispatch_performed: false`, zero port calls; denial ⇒ `PROPOSAL_NOT_CONFIRMED`) |
| ATTENTION_REQUIRED is returned to the interaction device | `hardware-bound authentication surfaces as ATTENTION_REQUIRED, never as false success` (`delivered_to: interaction_device_ref`, `execution_started: false`, `actions_created_on_execution_host: 0`) |
| Consume RemoteExecutionPort as a facade; no independent trust/transport/presence/identity | Port descriptor published (`facade_over: 'REMOTE_FABRIC_PUBLIC_API'`, `implements_trust_or_transport: false`, `implements_presence_or_identity: false`); the module imports nothing |
| Prefer current-device Web when healthy; rank known alternates; no probe requests | tests 1 and 2 (`LOCAL_WEB` + `selection_reason: 'CURRENT_DEVICE_HEALTHY'`; `ai_requests_launched: 0`, `probes_sent: 0`, zero dispatch calls during ranking) |
| Dispatch one canonical actionId; return status/progress/partial/final/error and AttentionRequest to the Action surface | tests 4 and 6 (`statusFor` projection; `raiseAttention` delivered remotely) |
| Semantic remote file staging via InputBundle refs and cleanup policy | `semantic input staging carries an explicit cleanup policy…` (`STAGING_POLICY_REQUIRED`; `cleanup_required` per reference; `canonical_local_path: null`) |
| Normal mode transports semantic RPC/event/stream, not mandatory remote-desktop video | `remote_desktop_stream: false` and `semantic_transport: true` on dispatch and status; the port call carries `semantic_rpc: true` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, BA-008, EM-004, EM-005, EM-008, EM-009, GAI-003…006, RF-004…007 Corrections; GAI-003
finished green). Tie-break after RF-007 excluded Remote Fabric, so GAI-007 was chosen: it is the consumer of
the RF-006 path manager and RF-007 capability registry just delivered (both fresh in context) and the last
GAI stage before the surface integration task.

**D2 — Where does the remote boundary sit?** CHOICE: one injected `RemoteExecutionPort` facade
(`listEndpoints`/`dispatch`/`cancel`) over the accepted Remote Fabric public API, with the descriptor
explicitly stating that it implements no trust, transport, presence or identity. Reason: the workbook
forbids implementing those here; keeping the facade as the only outward call means the module cannot
accidentally grow a second transport, and a double can stand in until the real API is accepted (the
programme-level real two-device proof remains an integration gate, recorded in §7).

**D3 — When does the work stay local?** CHOICE: if the interaction device itself is healthy (online,
Web-ready, fresh, not overloaded, session available), the proposal is `LOCAL_WEB` with
`requires_confirmation: false`, because moving work the current device can already do would interrupt the
user for no benefit. Reason: the workbook says "prefer current-device Web when healthy" and the core
invariant is about not disturbing the user; the test asserts the local route performs no dispatch.

**D4 — How are alternates ranked?** CHOICE: a published weighted score over presence, Web readiness,
session availability, input locality, load and freshness, with each factor's value, weight and contribution
exposed, sorted by score then `device_ref`. Reason: a deterministic, auditable ranking is required
("discovery/ranking must not launch duplicate AI requests as probes"), and publishing the breakdown means a
reviewer can see *why* a device won rather than trusting an opaque number. Exclusions are typed per
candidate (`OFFLINE`, `STALE_ENDPOINT`, `NOT_WEB_READY`, `OVERLOADED`, `NO_SESSION`, `INPUT_NOT_LOCAL`).

**D5 — Staleness boundary.** CHOICE: a missing or over-`max_freshness_ms` freshness value excludes the
endpoint (`STALE_ENDPOINT`), and an offline endpoint reports exactly `OFFLINE` without piling on secondary
reasons. Reason: "a stale/offline remote endpoint cannot be selected as healthy" is an acceptance bullet,
and fail-closed on unknown freshness is the only safe reading; reporting one dominant reason keeps the
message honest rather than noisy (the suite originally expected both reasons and was corrected).

**D6 — Confirmation vs denial (precision fixed by the suite).** CHOICE: a *denied* proposal reports
`PROPOSAL_NOT_CONFIRMED`, and only a proposal with no confirmation yet reports `CONFIRMATION_REQUIRED`. The
first implementation checked "not confirmed" first, so a denial looked like "you never asked" — the wrong
message for a UI that must show that the user already declined. The order was changed accordingly.

**D7 — One canonical action id.** CHOICE: dispatch takes the Action surface's `action_id` and passes it
through unchanged; a second dispatch for the same id is absorbed
(`dispatched: false, duplicate: true, actions_created_on_execution_host: 1`) and the port is not called
again. Reason: the acceptance bullet forbids a duplicate Action on the execution host, and the execution
host's Action count is asserted in the test rather than inferred.

**D8 — Event correlation and late events.** CHOICE: every event carries `correlated_action_id`, sequence
numbers must be consecutive (`EVENT_OUT_OF_ORDER` otherwise), `PARTIAL` is explicitly non-terminal, and
anything arriving after a terminal state is appended to `reconciled_events` with
`reason: 'LATE_EVENT_AFTER_TERMINAL'` while the first terminal result stands. Reason: the workbook requires
remote progress/partial/final/error to correlate to one action and late/duplicate events to be reconciled
rather than applied; discarding them silently would lose the evidence that a provider produced output the
user never asked for.

**D9 — Who may cancel?** CHOICE: any device in the action's viewer set (the interaction device and the
execution device at dispatch, extensible via the Action surface), not only the interaction device; cancel is
idempotent and reports `interaction_device_is_only_cancel_authority: false`. Reason: the workbook says cancel
must work "from any authorized device viewing the Action". An unauthorized device gets
`NOT_AUTHORIZED_TO_CANCEL`, and cancelling a terminal action is `LATE_EVENT_AFTER_TERMINAL`.

**D10 — Hardware-bound authentication.** CHOICE: when the endpoint reports `hardware_auth_required`, dispatch
returns `dispatched: false, attention_required: true, execution_started: false` with an `AttentionRequest`
delivered to the interaction device and `user_must_operate_execution_host: false`. Reason: the workbook
requires this to surface as ATTENTION_REQUIRED rather than a false success, and the core invariant forbids
sending the user to operate the execution host. The test asserts the port was never asked to dispatch.

**D11 — Staging.** CHOICE: staged references are semantic (`bundle_ref`, `staging_policy`, optional
`cleanup_by`, `canonical_local_path: null`) and a reference without an explicit policy is refused
(`STAGING_POLICY_REQUIRED`). Reason: the workbook requires semantic staging via InputBundle refs and a
cleanup policy; a missing policy must fail loudly rather than default to "leave it there".

**D12 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/general-ai-remote-execution-v1/remote-execution.mjs` | new — port facade, ranking, proposal/confirmation, dispatch, events, cancel, attention, staging |
| `contracts/general-ai-remote-execution-v1/index.mjs` | new — public surface |
| `contracts/general-ai-remote-execution-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/general-ai-remote-execution.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Three failures on first run: one genuine defect and two corrected expectations.

1. **Defect / precision:** a *denied* proposal was reported as `CONFIRMATION_REQUIRED` (the same code as
   "not asked yet"), because the confirmation-required branch ran first. Reordered so a denial reports
   `PROPOSAL_NOT_CONFIRMED` (D6).
2. **Expectation:** an offline endpoint was expected to report `['OFFLINE', 'NOT_WEB_READY']`; the module
   reports just `OFFLINE`, which is the honest, non-noisy answer (D5). Corrected.
3. **Expectations:** two assertions were written with the wrong code kind — a publish that should succeed was
   wrapped in `failure(...)`, and an invalid event `kind` was expected to be `UNKNOWN_ACTION` rather than
   `INVALID_REQUEST` (the module distinguishes a malformed request from an unknown action). Both corrected,
   and the idempotent-cancel-after-late-event case now asserts the duplicate return instead of a throw.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36743516874 on 99858b90e1470e7401d8ffd9cf52ade37d2c4381 | success |

## 6. Integration seams handed to sibling tasks

- **RF-006 / RF-007 (path manager, capability registry):** the facade resolves an endpoint and dispatches
  over the session RF-006 established, and an endpoint's `adapter_ref` should come from an RF-007 capability
  ticket. A path migration must keep the same `action_id` and `endpoint_ref`; this module never opens its own
  transport.
- **RF-008 / RF-009 (typed event stream, presence/reconnect):** `recordEvent` is the consumer of RF-008's
  typed stream and RF-009's reachability; presence may not resurrect a stale endpoint here, and a reconnect
  should re-propose rather than resume a stale ticket.
- **GAI-004 / GAI-005 / GAI-006 (consent/budget, triage, conversation):** a remote dispatch is still subject
  to the API consent/budget gate when it uses the API channel, and the action should be the same conversation
  turn; a `CONFIRMATION_REQUIRED` triage route and this V1 confirmation are separate gates and both must be
  satisfied.
- **BA-006 / BA-008 (task graph, execution leases):** an `EXCLUSIVE` execution should take a BA-008 lease on
  the execution device before dispatch, and the canonical `action_id` here should be the task graph's action
  reference so one action cannot be executed twice from two devices.
- **EM-007 (remote subworker return):** the Engineering programme faces the same interaction/execution split;
  at merge the two should share one "dispatch one canonical id, correlate every event" contract.
- **GAI-009 (Utopia surface integration):** `statusFor` is the projection the Ask/Do surface renders, and
  `attention` is what the interaction device must show.
- **Programme-level gate (not met by this branch):** the GAI merge workbook must perform a real two-device
  execution through an accepted Remote Fabric API; this component proves the semantics against a deterministic
  facade only, which the report states explicitly rather than implying real remote transport was exercised.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: an endpoint that reports `web_ready: true` and `hardware_auth_required:
   true` (does the local preference wrongly prefer it? currently the local route dispatches without an
   attention check — confirm that is intended); a proposal whose endpoint disappears between confirmation and
   dispatch (covered by `UNKNOWN_ENDPOINT`); two dispatches racing for the same `action_id` (synchronous here,
   so the interleaving cannot be expressed); an event stream that reuses a `seq` after a reconcile; and a
   cancel arriving after a reconciled final event.
2. Confirm D3 (local route skips confirmation) and D9 (any viewer may cancel) as the intended V1 readings.
3. Confirm the local-route hardware-auth gap in item 1: it is the one place where an attention requirement may
   not be surfaced, and it may need the same check as the remote path.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```
