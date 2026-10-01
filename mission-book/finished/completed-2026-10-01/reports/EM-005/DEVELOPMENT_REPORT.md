# EM-005 Development Report — Attention Bridge + Recent-Device Notification/Ring

```text
MISSION                  = EM-005 (Engineering Manager programme, task 5 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 53829ae (Digital-City main, "claim(EM-005): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T13:55:55Z
CONTROL_REVISION_AT_CLAIM= 69a2fe2 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-005-attention-recent-device-alerts
IMPLEMENTATION_HEAD_SHA  = adf0cf5e6bd17b5f1e4dba29a5f04d51743146f5
BRANCH_CI                = 36725729360 — success
LOCAL_CHECK_SUMMARY      = 111/111 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/engineering-attention-v1/` — `attention.mjs` (envelope + validation, recent-device ranking,
sound policy, the bridge: open/deliver/acknowledge/withdraw/respond/queries), `index.mjs`, 10-test suite,
root `tests/engineering-attention.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| one `attention_id` creates one logical question despite multiple projections | `one attention_id is one logical question however many projections it carries` |
| the current interaction device is always included when eligible/online | `the current interaction device always carries the actionable projection` (ineligible ⇒ `CURRENT_DEVICE_NOT_ELIGIBLE`, never silent re-projection) |
| only the configured 2–3 recent eligible devices receive auxiliary alert projections | `only the configured 2-3 recent eligible devices receive auxiliary projections` (band enforced at construction and at ranking) |

Plus the programme's remaining hard rules, each tested: ranking by user-interaction recency; first valid
acknowledgement wins globally; delivery dedup across reconnect/refresh/retry/heartbeat; sound suppressed
but notification retained; no ringing for informational events by default; response routed to the
originating connector whichever device answered.

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair and no eligible opposite-host Correction
(Alien was correcting GAI-002), so the unclaimed-Development tier applied. EM-005 chosen: EM is the
largest pool, no other host was in it, it is a different programme from my previous claim (RF), and it
carries one of the programme's three hard invariants.

**D2 — Does the bridge own notification state?** CHOICE: the envelope + projections live in a bridge
that models the shared Attention projection; the contract states it owns no Engineering-only
notification database, and the envelope carries the canonical `attention_id`, `job_ref` and
`connector_ref` so the canonical Attention state stays the fan-out source. Reason: the workbook forbids
a second global notification store; keeping the record as a projection of one question is what makes
"one attention_id, one logical question" checkable (`logicalQuestions()`).

**D3 — What ranks "recent"?** Options: (a) uptime; (b) heartbeat age; (c) real user interaction
recency. CHOICE: (c), with offline/ineligible devices excluded and ties broken by device reference.
Reason: the invariant says "most recently **user-operated**"; a server that has been up for months is
not a device the user touches, and heartbeat age measures liveness rather than attention. The test
deliberately gives the server the freshest heartbeat and the phone the stalest, and the phone still wins.

**D4 — Where the actionable copy goes.** CHOICE: exactly one ACTIONABLE projection, always on the
current interaction device; auxiliary devices get NOTIFY or RING. A current device that is offline or
ineligible is a typed refusal rather than a silent re-projection. Reason: the user must be able to answer
where they are looking, and quietly moving the question elsewhere would hide that their device dropped
off.

**D5 — Sound versus visibility.** CHOICE: `ringing` and `notification_visible` are independent; quiet,
full-screen and protected use set `ringing: false` with `sound_suppressed: true` while the notification
stays visible; informational events (`blocking: false`) do not ring unless the policy opts in. Reason:
the invariant is "suppress sound without losing the notification", and a single `notified` flag could not
express it.

**D6 — Deduplication and delivery epochs.** CHOICE: each projection carries a `delivery_epoch`, and
`deliver` records `(device, epoch)` once — every later delivery of the same epoch returns
`ALREADY_DELIVERED` with `ringing: false`, regardless of whether the cause was a reconnect, a page
refresh, a connector retry or a heartbeat. After acknowledgement every delivery is refused with the
status as the reason. Reason: the workbook lists all four causes explicitly; modelling them as one
idempotent delivery is the only way none of them can become a second ring.

**D7 — Who may answer?** CHOICE: any *projected* device may acknowledge — the actionable device is not
privileged — the first acknowledgement closes the question globally, and every other projection is
withdrawn as `ANSWERED_ELSEWHERE` and stops being actionable or visible. Reason: the user may answer from
the phone that is ringing rather than walking back to the interaction device.

**D8 — Response routing.** CHOICE: `respond` returns `{job_ref, connector_ref, answered_by_device_ref,
routed_to_connector: true}`, and a second response (or a response from a device that did not acknowledge)
is refused. Reason: the workbook requires the answer to reach the originating connector regardless of
which device answered, and a duplicate answer would be a second decision the connector never asked for.

**D9 — Instant handling.** CHOICE: callers may pass a millisecond instant or an ISO string; the record
always stores ISO, and anything else is a typed refusal. Reason: found while testing — the bridge was
echoing whatever the caller passed, so a record could hold a number in `at` while `created_at` held an
ISO string. Normalising in one helper (`atOf`) keeps the audit homogeneous.

**D10 — No `schema.json`.** Consistent with BA-002 D2, BA-003 D2, EM-003 D10, EM-004 D9 and GAI-002 D9.

## 3. Test summary

10 tests, all passing: one-question-per-id with re-open as re-delivery; actionable-only-on-the-current
device plus the ineligible-current refusal; the 2–3 band enforced at construction and ranking; recency
ranking with a stale-heartbeat phone beating a fresh-heartbeat server, offline/ineligible exclusion and
deterministic tie-breaking; first-ack-wins with global withdrawal and duplicate answers; response routing
with duplicate-answer and unprojected-device refusals; delivery dedup across four re-delivery causes plus
the post-acknowledgement refusal; quiet/full-screen/protected sound suppression with the notification
retained; informational events not ringing by default and ringing when the policy opts in; withdrawal
plus envelope strictness (kind, version, blocking type, instant, unknown field, empty question) and the
per-device projection query.

Three defects surfaced in development and are recorded rather than smoothed over: (1) `open` pre-marked
every projection as delivered, which made the first real delivery indistinguishable from a duplicate —
fixed by leaving delivery to `deliver`; (2) the bridge echoed caller instants verbatim, mixing numbers
and ISO strings in the audit — fixed with `atOf`; (3) two of my own test expectations were wrong (an
instant type and a quiet-policy assertion that assumed all four devices were quiet) and were corrected
after confirming the module's behaviour was the intended one.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 111 tests, 111 pass, 0 fail (101 baseline + 10 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36725729360 on adf0cf5e6bd17b5f1e4dba29a5f04d51743146f5 | success |

## 5. Integration seams handed to sibling tasks

- EM-001 (core contracts): bind `AttentionEnvelope` and the projection shape to EM-001's `AttentionEnvelope`
  and `AttentionEnvelope` state at merge; the projection vocabulary is `ACTIONABLE | NOTIFY | RING`.
- EM-003 (job protocol): a `BLOCKED` job is the natural source of an attention event; `withdraw` is the
  path to close it when the job reaches a terminal state.
- EM-004 (registry): `usability().blockers` should feed the question text; an unusable instance is a
  reason to ask, not a reason to answer for the user.
- EM-007 (remote return control): a remote worker's permission/question traffic returns through this
  bridge, which is why the response routes to the connector rather than to the device.
- RF-009 (presence): device `online`/`last_interacted_at` must come from canonical presence and real
  interaction, not from this module's own heuristics; this contract consumes them as input.
- Web/Android surfaces: `projectionsFor(deviceRef)` is the query a client uses to ask what it should
  show and whether it may ring; `acknowledge` is the only way to close a question.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to ring twice for one epoch (a delivery after an acknowledgement, a
   second projection for one device, a re-open with the same id but a different question), to answer from
   an unprojected or offline device, and to make an informational event ring despite policy.
2. Confirm D7 (any projected device may answer) and D3's tie-break rule.
3. Confirm whether `recentDeviceCount` should default to 3 or 2 (the contract defaults to 3 and enforces
   the band).
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
