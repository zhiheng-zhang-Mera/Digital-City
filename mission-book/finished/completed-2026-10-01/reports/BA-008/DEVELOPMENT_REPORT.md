# BA-008 Development Report — Embodiment Event Bus, Execution Lease + Reconnect Safety

```text
MISSION                  = BA-008 (Butler Assistant programme, task 8 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = a730e94 (Digital-City main, "claim(BA-008): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:02:10Z
CONTROL_REVISION_AT_CLAIM= b103c50 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-008-embodiment-event-bus
IMPLEMENTATION_HEAD_SHA  = f06cf316c87e710bf65092dbc96d76497eae3a79
BRANCH_CI                = 36741617086 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/assistant-embodiment-bus-v1/` — `embodiment-bus.mjs` (canonical event envelopes, exclusive leases
with versions/expiry/revocation/reassignment, guarded side-effect commits, disconnect + reconciliation,
audience-aware output routing), `index.mjs`, 7-test suite, root `tests/assistant-embodiment-bus.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Contradictory commands from two devices cannot execute two incompatible exclusive side effects | `contradictory commands from two devices cannot produce two exclusive side effects` (`EXCLUSIVE_LEASE_HELD` naming the holder; the loser cannot commit at all; `valid_exclusive_leases: 1`) |
| At most one valid execution lease exists for a given exclusive action scope at a time | Same test plus `validExclusiveLeaseCount` assertions after expiry/reassignment |
| Retries/replays with the same idempotency/action key do not duplicate the external side effect | `retries and replays with the same action key never duplicate the external side effect` (second commit `executed: false, duplicate: true`; exactly one `SIDE_EFFECT_COMMITTED` in the journal; replayed device command absorbed; same command with a different key refused) |
| Lease expiry/revocation/reassignment is authoritative and observable through the event/task state | `lease expiry, revocation and reassignment are authoritative and observable` (EXPIRED stops authority and stops blocking the scope; REVOKED emitted as a `LEASE` event and idempotent; reassignment is version-checked supersession) |
| After disconnect/restart, stale local work cannot resume a side effect until authority and lease are revalidated | `after a disconnect nothing resumes on a stale local lease` (suspension, `REVALIDATION_REQUIRED` on commit/publish/claim, reconcile revalidates or revokes, stale intents dropped, `stale_local_work_resumed: false`) |
| Output routing respects device availability, current foreground binding, audience/privacy scope and causal task state | `output routing respects availability, foreground and privacy without broadcasting` |
| Canonical Assistant event envelopes with assistant/device/audience/task/causal/action correlation; RF envelopes never canonical | `embodiment events are the canonical Assistant model and transport stays non-canonical` |
| Serialize/version conflicting commands against authoritative task state rather than live local plans | `retries and replays…` (`STALE_EVENT` carrying `authoritative_task_version`; `noteAuthoritativeTaskVersion` only moves forward) |
| Reject stale/replayed events or make them idempotent | Same test |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, EM-004, EM-005, EM-008, EM-009, GAI-003, GAI-004, GAI-005, GAI-006, RF-004, RF-005
and RF-006 Corrections). Tie-break after GAI-006 excluded General AI, so BA-008 was chosen: it is the
execution/lease layer BA-006 opened, and it is the contract RF-009 (reconnect) and GAI-007 (remote
execution) must reconcile against.

**D2 — Where does task truth come from?** CHOICE: the bus never infers a task version; authoritative
versions arrive through `noteAuthoritativeTaskVersion` (owned by the task graph) and every event/lease
carries the version it was authored against, with an older version refused as `STALE_EVENT`. Reason: the
workbook requires serialising against authoritative task state "rather than live local plans"; requiring the
truth to be supplied makes that structural, and `noteAuthoritativeTaskVersion` itself refuses to move
backwards so a confused caller cannot rewind authority.

**D3 — One lease model or two?** CHOICE: one exclusive lease per action scope, regardless of device, with
`lease_version` incrementing across renewals and reassignments, and explicit `ACTIVE/SUSPENDED/REVOKED/
EXPIRED/SUPERSEDED` states. Reason: the acceptance list is written as "at most one valid execution lease" and
"two devices holding simultaneously valid exclusive authority" is out of scope; a single scope-keyed lease
makes both impossible by construction, and the test asserts the count directly rather than trusting the
refusal path.

**D4 — Reassignment implementation (defect found by the suite).** The first version called
`acquireLease` for the successor *before* releasing the current lease, so reassignment failed with
`EXCLUSIVE_LEASE_HELD` against the very lease being handed over — a deadlock in the one operation whose
purpose is to move authority. Fixed by superseding the current lease first, acquiring the successor, and
restoring the previous state if acquisition throws (so a failed reassignment is not a partial one).

**D5 — Renewal semantics (defect found by the suite).** A renewal computed `expires_at = now() + ttl`, so a
clock behind the lease acquisition silently shortened authority. Fixed by refusing a renewal whose instant
precedes `acquired_at` (`INVALID_LEASE`) instead of quietly correcting it. Note a renewal *with a smaller
ttl* legitimately shortens the window — that is the caller's explicit choice, and the test asserts the new
window rather than assuming it grows.

**D6 — Reconcile must revoke, not only revalidate (defect found by the suite).** The first version only
invalidated `ACTIVE` leases missing from authoritative state, so a lease suspended by the disconnect that
authoritative state no longer listed stayed suspended forever and could be re-activated by a later reconcile.
Fixed: any lease authority does not list, or lists at a different task version, is `REVOKED` — with the
reason distinguishing `REVOKE_ON_RECONCILE` from `REVOKE_ON_VERSION_MISMATCH`. A suspended lease is only
revalidated when authority still lists it, the version matches and it has not expired.

**D7 — What may resume after reconnect?** CHOICE: only intents whose lease was revalidated in this
reconciliation (or read-only intents); side-effecting intents with a stale task version or an unrevalidated
lease are dropped with a typed reason, and the result always reports `stale_local_work_resumed: false` and
`ready_to_resume: false` when anything was dropped. Reason: the workbook requires fetching authoritative
state, invalidating/revalidating leases, reconciling local intents and "only then" resuming; publishing the
negative makes the guard testable and stops a caller treating `ready_to_resume` as a formality.

**D8 — Is an event a side effect?** CHOICE: no — `publish` and `commitSideEffect` are separate surfaces, and
only the latter produces `external_side_effect: true`, guarded by the lease holder plus an action key.
Reason: conflating "an event was accepted" with "an external action happened" is exactly how duplicate side
effects hide; the tests assert `external_side_effect: false` on event paths and a single
`SIDE_EFFECT_COMMITTED` entry.

**D9 — Output routing and privacy.** CHOICE: audience membership gates delivery, availability is checked
first, the foreground device is a *preference among permitted devices*, duplicates are suppressed, and
deliveries are never broadcast (`broadcast: false`). Reason: the workbook requires routing without
broadcasting private responses. The suite initially expected a foreground device outside the audience to
receive a shared response; the module withholds it, which is the privacy-safe reading, and the expectation
was corrected to match (with a separate case proving `FOREGROUND` is still reported when the device *is* in
the audience). A private response reaches only in-audience devices, and the refusals distinguish
`PRIVACY_WITHHELD` from `NOT_IN_AUDIENCE`.

**D10 — Transport neutrality.** CHOICE: events may carry a `transport_ref`, and every event states
`transport_envelope_is_canonical: false` with `canonical_state_source: 'ASSISTANT_EMBODIMENT_BUS'`; the
module owns no transport and imports nothing. Reason: the workbook makes this an Assistant
domain-semantic bus and hands cross-device delivery to Remote Fabric.

**D11 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/assistant-embodiment-bus-v1/embodiment-bus.mjs` | new — events, leases, side-effect commits, disconnect/reconcile, routing |
| `contracts/assistant-embodiment-bus-v1/index.mjs` | new — public surface |
| `contracts/assistant-embodiment-bus-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/assistant-embodiment-bus.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Six failures on first run: three genuine module defects and three corrected expectations.

1. **Defect:** reassignment could not take over the lease it was reassigning (`EXCLUSIVE_LEASE_HELD`
   against itself). Fixed by releasing first with rollback on failure (D4).
2. **Defect:** renewal could shorten a lease when the clock was behind the acquisition. Fixed with a typed
   refusal (D5).
3. **Defect:** reconciliation left a suspended lease that authority no longer listed in limbo. Fixed by
   revoking anything authority does not list or lists at another version (D6).
4. **Expectation:** a renewal test used a smaller ttl and expected the expiry to grow. The new window is
   authoritative; the assertion now checks the actual new window (D5).
5. **Expectation:** `failure(...)` was used around a publish that was supposed to succeed. Corrected, and a
   separate assertion covers the accepted current version.
6. **Expectation:** a foreground device outside the audience was expected to receive a shared response. The
   module withholds it, which is the privacy-safe reading; the expectation was corrected and a separate
   in-audience case now proves `FOREGROUND` is reported (D9). Also, `acquire(bus, {action_scope})` inherited
   an action key from the shared helper, so an `ACTION_KEY_REQUIRED` case had to pass `action_key: null` to
   test what it claimed to test.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36741617086 on f06cf316c87e710bf65092dbc96d76497eae3a79 | success |

## 6. Integration seams handed to sibling tasks

- **BA-006 (authoritative task graph):** that module owns task truth and the lease record; this bus owns
  execution authority for an action scope. At merge, BA-006's `lease_ref`/`lease_epoch` and this module's
  `lease_ref`/`lease_version` must become one lease notion, and `executor_ref` should be this bus's
  `holder_ref`/`device_ref`. `noteAuthoritativeTaskVersion` is the injection point for BA-006's versions.
- **BA-003 (embodiment binding) / BA-007 (interaction surface):** `source_device_ref`, `audience` and the
  foreground preference are the bus-side view of a device binding; BA-003 owns the durable binding.
- **BA-004 (handoff):** a handoff changes logical ownership, not execution authority; a handoff must not
  silently transfer or restart a lease, and this bus is where "the executor continues" must be provable.
- **GAI-007 (device-aware remote execution) / EM-007 (remote subworker):** an exclusive remote side effect
  should be taken through `acquireLease` + `commitSideEffect` so two devices cannot both act.
- **RF-009 (presence/offline/reconnect):** `onDisconnect` + `reconcile` are the reconciliation half of
  reconnect; RF-009 supplies reachability and this bus supplies authority, and neither may resume work
  alone.
- **RF-008 (typed stream/RPC):** partial/result events travel as bus events with a `transport_ref`; the RF
  envelope must stay non-canonical, which this contract now states on every event.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: two devices racing `acquireLease` interleaved through `reassignLease`;
   a `publish` that omits `command_ref` but carries an `action_key` (currently no idempotency record is
   kept — confirm that is acceptable); a reconcile whose authoritative `task_versions` is missing an entry
   the lease refers to (currently treated as "no opinion", i.e. revalidated — this is the riskiest choice in
   the module); and a `routeOutput` candidate list containing the same device under different audience flags.
2. Confirm D7 (`ready_to_resume: false` whenever anything was dropped) and D9 (audience membership gates
   delivery even for a foreground device) as the intended readings.
3. Confirm the missing-version-entry behaviour in `reconcile` (see item 1), which may need to be
   fail-closed (`REVOKE_ON_MISSING_VERSION`) rather than permissive.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
