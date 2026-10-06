# RF-009 Development Report — Presence / Offline / Reconnect + Audit

```text
MISSION                  = RF-009 (Remote Fabric programme, task 9 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 49bb40c (Digital-City main, "claim(RF-009): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:47:30Z
CONTROL_REVISION_AT_CLAIM= d69076d (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-009-presence-offline-reconnect-audit
IMPLEMENTATION_HEAD_SHA  = e6b83b4d0b22131391bffc4dda243fcd650b3143
BRANCH_CI                = 36746849199 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/remote-presence-reconnect-v1/` — `presence.mjs` (presence vocabulary and staleness, offline action
policy, pending-command reconciliation, duplicate-effect suppression, append-only audit), `index.mjs`, 7-test
suite, root `tests/remote-presence-reconnect.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Disconnect/reconnect updates presence honestly and preserves logical device identity | `presence is honest, distinct and never collapses into ONLINE or FAILED` (`device_id` preserved across every transition) and `a silent node becomes UNREACHABLE rather than ONLINE or FAILED` |
| Queueable work follows explicit expiry; non-queueable live actions are rejected/expired while offline | `queueable work expires and live-only actions never run late` (`LIVE_ACTION_NOT_QUEUEABLE` while unreachable, `DROPPED_LIVE_CONTEXT_LOST`, `DROPPED_EXPIRED`) |
| Stale command replay after reconnect cannot duplicate an already-completed side effect | `a stale replay after reconnect cannot duplicate a completed side effect` (`DUPLICATE_COMPLETED_EFFECT`, `DUPLICATE_SUPPRESSED` during reconcile) |
| Unknown transport outcome remains UNKNOWN until reconciled rather than reported success | `an unknown transport outcome stays UNKNOWN until it is reconciled` (`reported_success: false`, `reported_failure: false`, `DROPPED_UNKNOWN`) |
| Reconnect revalidates current trust/capability/policy hooks before invocation resumes | `reconnect revalidates identity, trust, capability, presence and authority before resuming` (six distinct drop reasons; `side_effects_resumed_without_revalidation: false`) |
| Audit records enough causal identifiers to debug without storing secret keys/private payload bodies | `the audit log carries causal identifiers and no secrets, and state is isolated` (recursive forbidden-field scan empty; every entry has causal identifiers) |
| Sleep/degraded/unreachable states do not silently collapse into ONLINE or FAILED | Test 1 (`SLEEPING` not reachable, `DEGRADED` reachable, `BUSY` distinct) and test 2 (`UNREACHABLE` with `timed_out_from` preserved; an explicitly `OFFLINE` node stays offline) |
| Presence vocabulary, last-seen, path class and bounded quality metadata | Test 1 (`PRESENCE_STATES`, `PATH_CLASSES`, `last_seen_at`, `quality.{latency_ms, network_quality, power}`) |
| Explicit offline action policy (queueable/live, expiry, requires-live-session) | Test 3 |
| Bounded retry/duplicate-safe recovery | Test 3 (bounded queue deadline) and test 6 (effect confirmation + suppression) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, BA-008, EM-004, EM-005, EM-008, EM-009, GAI-003…008, RF-004…008 Corrections; GAI-005
in progress). Tie-break after GAI-008 excluded General AI, so RF-009 was chosen: it is the reconciliation
authority that BA-008, GAI-007 and RF-006/008 all reference (each of those modules explicitly delegates
resume/reconnect to a presence layer), so leaving it unimplemented leaves those seams unverifiable.

**D2 — How many presence states, and what does the project do over time?** CHOICE: seven states
(`ONLINE/OFFLINE/SLEEPING/BUSY/DEGRADED/UNREACHABLE/UNKNOWN`) with a derived `UNREACHABLE` when a reachable
node has been silent longer than `offline_after_ms`, and the previously reported state preserved as
`timed_out_from` / `reported_state`. Reason: "sleep/degraded/unreachable states do not silently collapse into
ONLINE or FAILED" is an acceptance bullet, and the honest way to satisfy it is to keep the *reported* state
and the *derived* reachability separately visible. An explicitly `OFFLINE` node is not re-derived into
`UNREACHABLE`, because a node that said it is offline needs no inference.

**D3 — May a live action be queued?** CHOICE: no — a `LIVE_ONLY` action (or one with
`requires_live_session`) is refused while the node is not reachable (`LIVE_ACTION_NOT_QUEUEABLE`), and if it
was accepted while reachable but its live context passed, reconciliation drops it as
`DROPPED_LIVE_CONTEXT_LOST`. Reason: the workbook names camera capture, mouse click and screen unlock as
actions that "must not silently execute hours after their intended live context"; refusing them at enqueue
time and expiring them at reconciliation time are the two halves of that guarantee. The refusal result
publishes `interactive_action_must_not_run_late: true` so the rule is visible in data.

**D4 — Queue expiry.** CHOICE: a queueable action requires a deadline (default applied, maximum enforced) and
is dropped as `DROPPED_EXPIRED` with the deadline reported. Reason: "indefinite queues with no expiry
semantics" is out of scope; requiring the deadline at enqueue means no code path can create an unbounded
queue, and the maximum keeps a queue from outliving its usefulness.

**D5 — Unknown outcome.** CHOICE: `markOutcomeUnknown` sets `UNKNOWN` with `reported_success: false`,
`reported_failure: false`, `reconciliation_required: true`, and reconciliation drops it as `DROPPED_UNKNOWN`
rather than resuming. Reason: "unknown transport outcome remains UNKNOWN until reconciled rather than
reported success" is an acceptance bullet, and the dangerous default is assuming a request that lost its
connection succeeded (or failed) without evidence. Only an explicit `confirmEffect` resolves it.

**D6 — What must reconnect revalidate?** CHOICE: five things — identity (`device_id` unchanged), trust
(`TRUSTED`), capability availability, presence reachability and an upper-layer authority reference
(`lease_valid` + `lease_ref`) — and each failure drops the pending command with its own reason
(`TRUST_NOT_REFRESHED`, `CAPABILITY_NOT_REFRESHED`, `IDENTITY_MISMATCH`, `PRESENCE_NOT_REACHABLE`,
`AUTHORITY_NOT_REVALIDATED`). Reason: "reconnect revalidates current trust/capability/policy hooks before
invocation resumes" is an acceptance bullet, and "resuming stale side effects from local cache alone" is out
of scope. Reconciliation returns `RESUMED` with `executed: false` — it restores state for the caller to
dispatch, and it never executes a side effect itself.

**D7 — Duplicate suppression.** CHOICE: `confirmEffect` records the effect and keys it by node plus
`action_ref`, so a later replay of the same action is refused (`DUPLICATE_COMPLETED_EFFECT`) and a queued
replay during reconciliation is marked `DUPLICATE_SUPPRESSED` without executing. Reason: "stale command
replay after reconnect cannot duplicate an already-completed side effect" is an acceptance bullet, and
keying on the action (not only the command) is what catches a retry that arrives under a fresh command id.
A defect found while writing: the effect record did not originally store `action_ref`, which would have made
the action-keyed check silently useless — fixed before the suite ran.

**D8 — Audit.** CHOICE: an append-only, bounded log where every entry carries causal identifiers
(node/session/path/command/action refs, from/to states, outcome) and explicit
`contains_secret_material: false` / `contains_private_payload: false` flags, with a recursive forbidden-field
scan available. Reason: the workbook asks for auditability "without logging secrets or raw private payloads
by default". The scanner skips boolean values, because this module's own assertion flags would otherwise be
reported as secret material — the same class of false positive found earlier in this pool (EM-008), now
handled consistently.

**D9 — Presence is not authority.** CHOICE: every projection states `presence_is_reachability_only: true`,
`presence_is_not_ownership: true`, `presence_grants_permission: false`. Reason: "turning presence into task
ownership" is out of scope, and RF invariant 11 keeps permission intersectional; publishing the negatives
gives the merge an explicit contract to check.

**D10 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/remote-presence-reconnect-v1/presence.mjs` | new — presence, offline policy, reconciliation, duplicate suppression, audit |
| `contracts/remote-presence-reconnect-v1/index.mjs` | new — public surface |
| `contracts/remote-presence-reconnect-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/remote-presence-reconnect.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Three failures on first run: one genuine defect (found before the suite ran) and two corrected
expectations.

1. **Defect (found while writing the test):** `confirmEffect` stored the completed effect without
   `action_ref`, so `assertNotDuplicate`'s action-keyed check could never match — the duplicate guard would
   have silently degraded to command-keyed only. Fixed by recording `action_ref` and keying on it.
2. **Defect / false positive:** the forbidden-field scan flagged this module's own
   `contains_secret_material` boolean flag as secret material. Fixed by skipping boolean values (a boolean
   cannot be a secret), consistent with the same fix made earlier in EM-008.
3. **Expectations:** the queue-expiry test configured a 10 s maximum while asking for a 60 s deadline (the
   refusal was correct — the test policy was wrong), and an audit-filter assertion compared the per-node view
   against the whole log including another node's entry. Both corrected; the module was right in both cases.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36746849199 on e6b83b4d0b22131391bffc4dda243fcd650b3143 | success |

## 6. Integration seams handed to sibling tasks

- **BA-008 (embodiment bus / leases):** `reconcile` here should drive BA-008's lease revalidation, and
  BA-008's `REVALIDATION_REQUIRED` is the mirror of this module's `DROPPED_NOT_REVALIDATED`. At merge the two
  should share one reconciliation entry point rather than each exposing its own.
- **GAI-007 (device-aware remote execution):** endpoint ranking must consume this module's presence instead of
  estimating reachability, and a reconnect that drops a pending command must surface to the action's status
  rather than being retried silently.
- **RF-006 / RF-008 (path manager, data plane):** `last_seen_at` and `path_class` come from the selected path,
  and RF-008's `attempt_id` retries must consult this module's expiry before opening a new attempt; a
  subscription replay is not a command replay.
- **RF-007 (capability registry):** capability availability is refreshed here as an input, but the registry
  remains the authority for what a node offers — this module only revalidates the *reference*.
- **GAI-008 (health/resilience):** reachability (this module) and health (that module) are different facts;
  an unreachable node may still be healthy, and a healthy node may be unreachable, so neither may be derived
  from the other at merge.
- **BA-006 (task graph):** presence never becomes task ownership — a task owned by an assistant stays owned
  when every device is offline, and this module states that explicitly.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a live action enqueued while reachable and reconciled at the *same* instant
   (the check is `age > 0`, so a same-instant reconciliation currently drops it — confirm that is intended);
   an effect confirmed for a command that is still `UNKNOWN` (currently allowed, which is how an unknown
   becomes resolved — confirm); a node re-registered with the same `node_ref` but a different `device_id`
   (registration overwrites, so identity preservation is silently lost — this looks like a real gap); an
   audit entry whose `detail_ref` is a payload body; and a very large `max_audit_entries`.
2. Confirm D3 (live-only refusal at enqueue) and D6 (reconcile never executes, only restores state).
3. The identity-overwrite case in item 1 is the most likely real defect in this module and should be checked
   first: `registerNode` on an existing `node_ref` should probably refuse or require an explicit re-pair
   rather than replacing the `device_id`.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
