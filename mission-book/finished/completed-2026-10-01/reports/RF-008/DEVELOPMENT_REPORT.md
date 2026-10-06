# RF-008 Development Report — Typed RPC / EVENT / STREAM + Reliable Commands

```text
MISSION                  = RF-008 (Remote Fabric programme, task 8 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 1dd36c0 (Digital-City main, "claim(RF-008): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:30:15Z
CONTROL_REVISION_AT_CLAIM= 046c9fc (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-008-typed-rpc-event-stream-commands
IMPLEMENTATION_HEAD_SHA  = 761685b28fabdc0cb2d2dfe9f47e170d4fe82752
BRANCH_CI                = 36744638449 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/remote-typed-dataplane-v1/` — `dataplane.mjs` (COMMAND/EVENT/STREAM envelopes, command identity
vs attempt, idempotent result caching, truthful states, deadlines, subscriptions/replay, stream lifecycle and
backpressure), `index.mjs`, 7-test suite, root `tests/remote-typed-dataplane.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Retrying the same idempotent side-effect command does not repeat the external effect | `a retried idempotent command does not repeat the effect, and a new command id is a new action` (`replayed: true, executed: false, external_effect_repeated: false`, cached `replayed_result_ref`) |
| New command IDs represent new actions even when arguments match | Same test (`new_user_action: true` for a new `command_id` with identical arguments; `COMMAND_ID_REUSED_WITH_DIFFERENT_ACTION` when the id is reused for another action) |
| Delivery/acceptance/running/completed states are observably distinct | `delivery, acceptance, running and completion are observably distinct, and ack is never success` (`ACCEPTED` → `QUEUED` → `RUNNING` → `WAITING_CONFIRMATION` → `SUCCEEDED`, `delivery_ack_is_execution_success: false`) |
| EVENT subscriptions and STREAM lifecycle can reconnect/cancel without being mistaken for RPC | `event subscriptions reconnect and replay…` (`is_rpc: false`, `reconnectable: true`, `reconnects`) and `stream lifecycle, backpressure and cancellation are independent of RPC` (`affects_commands: false`) |
| Deadline/expiry prevents stale interactive commands from executing later | `a deadline stops a stale interactive command from executing later` (`DEADLINE_EXPIRED` at dispatch; `sweepExpired` ⇒ `TIMEOUT`, `executed_after_deadline: []`) |
| Duplicate/reordered/replayed envelopes are handled deterministically | Tests 2 and 5 (duplicate attempt absorbed; duplicate event `applied: false`; out-of-order event and reordered stream frame refused) |
| Tests prove task/session separation and truthful terminal statuses | `the data plane is strict, frozen, and keeps task truth outside the transport session` (`task_truth_in_transport: false`, `owns_task_ownership: false`, two planes share no state) |
| Separate versioned envelopes for RPC/COMMAND, EVENT and STREAM setup/data/control | `RPC, EVENT and STREAM are separate versioned envelopes with opaque domain payloads` (`ENVELOPE_KINDS`; envelope version must be 1; an unknown kind refused) |
| Domain envelopes opaque; RF envelope never canonical | Same test (`domain_payload_canonical_source: 'DOMAIN'`, `rf_envelope_is_canonical: false`; a payload body refused) |
| Stable correlation fields; `attempt_id` separate from command identity | Test 2 (`command_id`/`attempt_id`/`origin_ref`/`target_ref`/`capability_id`/`capability_version`/`task_ref`/`action_ref`/`deadline_at`) |
| Typed errors and false-success prevention | Test 3 (`FALSE_SUCCESS_REFUSED` when a delivery ack is turned into success; typed `REFUSED`/`FAILED`/`TIMEOUT` errors with `retryable`) |
| Stream backpressure/cancellation independent from one-shot RPC | Test 6 (`PAUSED` with `reason: 'NO_CREDIT'`, credit resumes, `CANCELLED` leaves the command at `ACCEPTED`) |
| Event subscription identifiers, ordering and causal metadata for replay | Test 5 (`caused_by`, `correlation_ref`, `resume_from_sequence`, `next_sequence`) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, BA-008, EM-004, EM-005, EM-008, EM-009, GAI-003…007, RF-004…007 Corrections).
Tie-break after GAI-007 excluded General AI, so RF-008 was chosen: it is the data-plane layer the RF-006
path manager and RF-007 capability tickets hand off to, and GAI-007's event correlation depends on it.

**D2 — One message channel or three semantics?** CHOICE: three separate versioned envelopes — `COMMAND`,
`EVENT`, `STREAM_SETUP` (plus `STREAM_DATA`/`STREAM_CONTROL` kinds) — with no shared `sendMessage` path.
Reason: the workbook's first out-of-scope item is a universal `sendMessage()`, and collapsing the three would
make "is this a notification or a call?" unanswerable at the transport boundary. The test asserts an unknown
kind is refused rather than coerced into a command.

**D3 — Command identity vs attempt identity.** CHOICE: `command_id` is the user action and `attempt_id` is
one transport try; the same `command_id` with a new `attempt_id` is a retry (`new_user_action: false`), the
same pair is a duplicate envelope, and a new `command_id` is always a new action. Reason: the workbook
requires `attempt_id` to be separate from stable command identity so transport retries do not become new user
actions — and the complementary bullet, that new command ids *are* new actions even with matching arguments,
which only holds if identity is the id rather than the payload. The test drives both directions.

**D4 — How is a retry made safe?** CHOICE: a side-effecting command must carry an `idempotency_key`
(`IDEMPOTENCY_KEY_REQUIRED` otherwise), and a successful execution result is cached under it so a later
attempt replays the cached result (`replayed: true, external_effect_repeated: false`). Reason: "executing the
same side effect twice after retry" is out of scope; requiring the key at dispatch means there is no path
where a side effect is admitted without a replay guard.

**D5 — What may report success?** CHOICE: only `applyResult` with an execution result may reach a terminal
success; `transitionCommand` refuses a success state with `FALSE_SUCCESS_REFUSED`, and delivery
acknowledgement only moves `ACCEPTED → QUEUED` while reporting `delivery_ack_is_execution_success: false`.
Reason: "treating HTTP/transport 200 as task success" is out of scope, and the dangerous shape is a state
machine that lets a caller mark success from a transport fact. Keeping the only success path in one function
that names an execution result makes the rule enforceable.

**D6 — Deadlines.** CHOICE: a command whose deadline has already passed at dispatch is refused outright
(`DEADLINE_EXPIRED`, nothing stored), and a queued command that passes its deadline is swept to `TIMEOUT`
with `executed_after_deadline: []`. Reason: the workbook requires deadline/expiry to prevent a stale
interactive command from executing later; refusing at dispatch is fail-closed, and sweeping is the honest
disposition for one already accepted.

**D7 — Ordering.** CHOICE: events are strictly contiguous per topic and a non-contiguous sequence is refused
(`EVENT_OUT_OF_ORDER` with the expected sequence and a `resume_from_sequence` hint); stream frames are
likewise consecutive. Reason: the workbook requires deterministic handling of reordered/replayed envelopes.
Because the plane refuses to *create* a gap, `replayFrom`'s contiguity check is a verification rather than a
recovery path, and the test asserts that a resume point beyond the head reports nothing missing instead of
inventing holes.

**D8 — Backpressure.** CHOICE: streams carry credit; with no credit the plane pauses the stream and returns
`accepted: false, backpressure: true, reason: 'NO_CREDIT'` rather than dropping the frame or blocking.
Reason: the workbook requires backpressure independent of one-shot RPC; an explicit paused state is
observable, and `streamCredit` resumes it. Cancellation is likewise stream-scoped (`affects_commands: false`).

**D9 — Where does domain state live?** CHOICE: the plane carries `domain` + `domain_envelope_ref` only, and
every projection states `rf_envelope_is_canonical: false`, `domain_payload_canonical_source: 'DOMAIN'`,
`task_truth_in_transport: false`, `owns_task_ownership: false`, `owns_domain_state: false`. A payload body is
refused. Reason: the workbook requires BA/GAI/EM envelopes to stay canonical with RF carrying references, and
task truth to stay outside the transport envelope. Publishing the negatives, plus `separation()`, gives the
merge an explicit contract to check rather than an assumption.

**D10 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/remote-typed-dataplane-v1/dataplane.mjs` | new — envelopes, command reliability, deadlines, events/subscriptions, streams |
| `contracts/remote-typed-dataplane-v1/index.mjs` | new — public surface |
| `contracts/remote-typed-dataplane-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/remote-typed-dataplane.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Five failures on first run: three genuine defects and two corrected expectations.

1. **Defect:** `sendStreamData` read `at` in the backpressure branch before its declaration, so a
   zero-credit stream threw a `ReferenceError` instead of reporting backpressure — the whole point of the
   path. Fixed by hoisting the instant.
2. **Defect:** the command projection did not expose its envelope kind/version, so a consumer could not tell
   which versioned envelope it was holding — contrary to "separate versioned envelopes". Added
   `envelope_kind`/`envelope_version`.
3. **Defect (found while writing):** a syntax error in the suite (`domain: 'RF'` with a missing brace) made
   the whole file fail to import; fixed immediately rather than leaving a broken test file.
4. **Process defect found by the check run:** the root runner entry was missing, so `pnpm test` reported 101
   tests and the new suite was not part of the repository check. Added
   `tests/remote-typed-dataplane.test.mjs` (the suite then ran as 108/108). This is the kind of gap the
   full local-check step exists to catch, and it is recorded here rather than quietly fixed.
5. **Expectations:** the reordered-frame assertion sat in the zero-credit branch (where backpressure is
   reported first) and was moved after crediting; and an event-count expectation still counted an event that
   a later edit had removed. Both corrected.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36744638449 on 761685b28fabdc0cb2d2dfe9f47e170d4fe82752 | success |

## 6. Integration seams handed to sibling tasks

- **RF-006 / RF-007 (path manager, capability registry):** a command's `capability_id`/`capability_version`
  come from an RF-007 ticket and travel over the session RF-006 established; a path migration must not change
  `command_id` or force a new `attempt_id` beyond a genuine retry.
- **GAI-007 (remote execution) and GAI-006 (conversation stream):** `recordEvent` in the GAI router should be
  driven by this plane's EVENT semantics, and the GAI remote-dispatch id is the `action_ref` here, so one
  action cannot be represented by two command ids.
- **BA-008 (embodiment bus/leases):** a side-effecting command should take a BA-008 lease at the target
  before `applyResult` can report success; the `idempotency_key` and the lease's `action_key` are the same
  guard seen from two sides and should be reconciled at merge.
- **EM-007 / EM-009 (remote subworker, runtime recovery):** an engineering job's remote leg is a COMMAND;
  restart recovery must re-establish a subscription rather than replaying a command, and a timed-out command
  must be reconciled with the job's terminal state.
- **RF-009 (presence/offline/reconnect):** subscriptions are the reconnect surface; a reconnect replays from
  `resume_from_sequence`, and reachability changes must not resurrect a timed-out command.
- **RF-010 (fabric policy boundary):** deadlines, stream windows and idempotency requirements are deployment
  policy (`policy.default_stream_window`, `policy.max_stream_window`, `policy.max_deadline_ms`).
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a side-effecting retry arriving after the cached result was written but
   before the first command reached a terminal state; an idempotency key shared by two *different* command
   ids (currently both may execute — the cache is consulted only for retries of the same command id); a
   subscription replayed twice concurrently (the resume pointer is advanced on read); a stream frame sent with
   `bytes` negative; and a command whose `deadline_at` is extended by re-dispatch (currently a new attempt
   keeps the original deadline — confirm).
2. Confirm D5 (only `applyResult` may mark success) and D8 (backpressure pauses rather than drops).
3. Confirm the shared-idempotency-key behaviour in item 1: two distinct commands carrying one key is the one
   place where the guard may not hold, and it may need a `IDEMPOTENCY_KEY_ALREADY_APPLIED` refusal.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
