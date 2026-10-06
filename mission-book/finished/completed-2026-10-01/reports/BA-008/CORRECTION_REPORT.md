# BA-008 Correction Report — Embodiment Event Bus, Execution Lease + Reconnect Safety

```text
MISSION              = BA-008 (Butler Assistant programme, task 8 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-008-embodiment-event-bus.md
CLAIM_COMMIT         = c4f82c6 (Digital-City main, claim of BA-008 Correction by Alien)
CLAIMED_AT           = 2026-10-01T02:04:49Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = f06cf316c87e710bf65092dbc96d76497eae3a79
DEVELOPMENT_CI       = 36741617086-success
CORRECTION_BRANCH    = assistant/BA-008-embodiment-event-bus
CORRECTION_HEAD_SHA  = 1070190c3bd39342780d2cb941123d9ab3666225
BRANCH_CI            = 36805605456-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = BA-008 23 pass (7 author + 16 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   f06cf31 (Mech)   run 36741617086   success
first-pass head    a5f8093 (Alien)  run 36804531861   success   ← superseded by the review in §5
corrected head     1070190 (Alien)  run 36805605456   gateway-web success / android success
```

The corrected head executed the real `V0.2 checks` workflow on GitHub-hosted runners. No billing refusal
occurred in this task's runs; every run that started completed with real steps.

## 2. Independent review method

The Development head was exported with `git archive` (`D:\A-Utopia\.runtime\evidence\mission-book\BA-008\frozen-f06cf31\`)
and an independent adversarial reviewer was pointed only at that frozen export, after being told to read the
workbook first. It returned `probes/FINDINGS.md` and 14 runnable probes: 13 reproduced mechanisms against the
author's 7-test suite (which catches none of them).

Because that review was written against the *frozen Development head*, its findings were re-measured against
the first-pass head before any of them were repaired. That re-measurement was itself material: 6 of the 6
first-pass repairs held (own-key allow-list, plain-prototype rule, cycle-safe freezer, real instants on every
path, policy bounds, the negative `task_version` bound), while 13 mechanisms were still live on `a5f8093`, and
two of the review's statements were shown to be probe artifacts rather than defects (§5, D12). Repairing a
finding that is not a defect would have been a false repair, so the measurement came first.

Probe evidence (all under the evidence directory above):

```text
probes/FINDINGS.md + probe-01..probe-14   the reviewer's frozen-head probes
run-probes-current.mjs + current-head/    the same probes re-pointed at a chosen head
probes-against-a5f8093.log                which findings were still live before this pass
probes-against-patched.log                the same probes after the repairs
pre-fix-check-second-pass.log             the corrected suite against f06cf31 (7 pass / 16 fail) and a5f8093 (10 pass / 13 fail)
gate-second-pass.log                      root / rooms / city / promotion-history / bilingual
```

## 3. First pass — 6 mechanisms (head a5f8093, run 36804531861)

| # | Mechanism | Root cause | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **The canonical allow-list used prototype-chain membership**, so `toString`/`constructor`/`valueOf`/`__proto__` passed the "not part of the canonical contract" guard | `key in spec` | `Object.hasOwn(spec, key)` over `Reflect.ownKeys` | yes |
| 2 | **`isPlainObject` accepted class instances and foreign prototypes**, so a canonical record could be an object with inherited behaviour | `typeof === 'object' && !Array.isArray` | the prototype must be `Object.prototype` or `null` | yes (with #1) |
| 3 | **The freezer recursed with no visited set**, so a cyclic caller value reaching `policy()` blew the stack with an untyped `RangeError` | recursion without a visited set | a `WeakSet` of visited objects | (defence in depth) |
| 4 | **Instants were validated by shape only.** `2026-13-45T99:99:99Z` and `2026-02-30T00:00:00Z` passed the regex and then either normalised silently or crashed `new Date(...).toISOString()` with a raw `RangeError` instead of a typed refusal | regex-only check | `isRealInstant` (component round trip) on the envelope rule, on `clock()` and on every caller instant (10 × `const at = when ?? now()` plus 3 inline sites) | yes |
| 5 | **A policy bound could be switched off**: `max_lease_ttl_ms: NaN`/`Infinity` disabled every lease-length comparison, and `require_action_key_for_exclusive: 'yes'` was truthy-but-not-`true` | caller-controlled policy read as a boolean/limit | both TTLs must be positive safe integers with `default ≤ max`, and the action-key requirement must be literally `true` | yes |
| 6 | **`noteAuthoritativeTaskVersion` accepted an unvalidated instant** and (found later, §5) a negative version | missing validation | the same real-instant rule, plus a non-negative version bound | yes |

## 4. Second pass — the independent review's live findings (head 1070190, run 36805605456)

Mechanisms re-measured as live on `a5f8093` and repaired here. Each has a regression that fails on `a5f8093`
(10 pass / 13 fail) and on the Development head `f06cf31` (7 pass / 16 fail) and passes on `1070190` (23 pass).

| # | Mechanism | Root cause | Repair | Regression |
| --- | --- | --- | --- | --- |
| D1 | **Reconnect revived a superseded lease → two simultaneously valid exclusive leases.** `reconcile` revalidated any listed suspended lease without consulting `leasesByScope`, so a device that lost its scope to a newer holder got its authority back and both holders could commit (`probe-01`, `probe-13`) | revocation decision ignored the scope's current holder | a SUSPENDED/ACTIVE exclusive lease whose scope is now held ACTIVE by another lease is **revoked** (`REVOKE_ON_SUPERSEDED_SCOPE`, never resumed) | yes |
| D2 | **A retry after renewal or reassignment executed the same action twice.** The consumed-effect record was keyed `effect:${lease_ref}:${action_key}` and both operations mint a new `lease_ref` for the same logical action (`probe-02`, `probe-11b`) | idempotency key bound to a mutable reference | the record is keyed on the **action** (`action_scope` + `action_key`), so a handoff is not a licence to re-execute | yes |
| D3 | **`renewLease` re-keyed without retiring the old entry**, so one lease appeared twice in `leases()`; the new reference could collide with another holder's, making holder B's valid lease unreachable and letting holder A commit in its place; `valid_exclusive_leases` was hardcoded `1` and `validExclusiveLeaseCount` double-counted the aliased object (`probe-02`, `probe-13`) | re-key without delete + refs derived from a per-lease counter | refs come from a monotonic **per-scope** counter, renewal deletes the previous reference, and `valid_exclusive_leases` / `validExclusiveLeaseCount` report the real count of distinct ACTIVE exclusive leases | yes |
| D4 | **`holder_ref` was optional, so the holder check did not run.** Omitting it renewed and committed as any holder, and `reassignLease` performed no holder check at all (`probe-03`) | `assertUsable(lease, at, holder_ref = null)` skipped the check for `null` | `renewLease`/`commitSideEffect` require the acting holder (`INVALID_REQUEST` when absent, never a bypass); a reassignment that names a holder must name the current one | yes |
| D5 | **Expiry could be defeated by backdating.** Every decision used the caller's `at` (`when ?? now()`), so an instant before `expires_at` made an expired lease ACTIVE again — and `at: 0`/`'not-an-instant'` produced `NaN`, which never compares as expired (`probe-04`) | caller-controlled "now" | authority instants are real ISO-8601 instants and may not precede the bus clock (`INVALID_REQUEST`, "authority cannot be rewound"); `isRealInstant` rejects `NaN` outright | yes |
| D6 | **`isIsoInstant` was shape-only.** The exported helper reported `true` for `2026-13-01T00:00:00Z`; only the pass-1 internal `isRealInstant` guarded decisions | regex-only exported contract | the exported helper also requires a finite `Date.parse`, so the API surface no longer contradicts the decision path | yes |
| D7 | **Reconnect revalidation was opt-in.** A missing `lease_refs` array meant "still authoritative", a missing `task_versions` entry counted as a version match, and `task_versions: 7` was silently ignored — so `reconcile({authoritative:{}})` revalidated everything, reconnected the device and reported `authoritative_state_consulted: true` (`probe-06`) | authority consulted only when the caller supplied it | `authoritative.lease_refs` must be an array of lease refs (`INVALID_REQUEST` otherwise) and a lease carrying a `task_ref` must have a matching non-negative version entry or it is revoked | yes |
| D8 | **Routing trusted caller flags.** `routeOutput` decided availability from `candidate.available` and delivered a PRIVATE payload to a device the bus had itself observed as disconnected (`probe-07`) | a decision read a caller-controlled value | the candidate's claim can only narrow the bus's own `deviceState`: a known-disconnected device is `DEVICE_UNAVAILABLE` whatever it claims | yes |
| D9 | **Staleness and replay absorption were gated on the optional `command_ref`.** An event carrying `task_ref`/`task_version` but no `command_ref` skipped the version check entirely, and an event carrying only an `action_key` was never absorbed (`probe-08`) | guard path gated on an unrelated optional field | the replay identity is `command_ref` when present and the `action_key` otherwise, and the staleness check runs whenever the event carries a task version | yes |
| D10 | **Mutation survived a refused reconciliation.** The cyclic case crashed the freezer (fixed in pass 1), but the `DataCloneError` case threw *while building the return value* — after the leases had been revalidated and the device marked connected — so a failed reconciliation left a live grant (`probe-09`) | validation interleaved with mutation | the entire authoritative payload and the local intents are validated and cloned **before** any lease or device state is touched | yes |
| D11 | **Canonical envelope fields were validated and then dropped.** `embodiment_kind` and `transport_ref` never reached the canonical event, and the caller's declared `event_id` was overwritten with `event:${seq}`, so duplicate identities could not be detected (`probe-12`) | builder hardcoded identity, never destructured the declared fields | the emitted event carries the declared `event_id`, `embodiment_kind` and `transport_ref`; declared ids must be unique and the bus owns the `event:<n>` namespace it generates | yes |
| D12 | **Own-getter TOCTOU: the value validated was not the value used.** `checkShape` read each field and `publish` read it again, so a getter could return a valid instant to validation and `NOT-AN-INSTANT` to the event (`probe-10d`) | field read once for validation, again for construction | each declared field is read exactly once into a snapshot; admissibility (plain object + own-key allow-list) is checked on the object itself, and the snapshot is what is validated **and** used | yes |
| D13a | **`exclusive === true` literal.** `exclusive: 'true'` / `1` produced a non-exclusive lease: no action key was required and a second device could take the same scope (`probe-11a`) | literal-only comparison | `exclusive` must be a boolean (`INVALID_LEASE` otherwise) | yes |

## 5. Findings that were measured and deliberately not "repaired"

Two of the review's statements did not survive re-measurement, and three more describe behaviour the author's
suite encodes as a contract. Recording them as repairs would have been a false repair, so they are recorded as
boundaries instead — each one is a place where a future workbook decision, not a silent local change, is
required.

| Finding | Decision |
| --- | --- |
| **D12 `__proto__` smuggling** | **Probe artifact, not a defect.** The probe built the object with `{ ...eventFor(), __proto__: {...} }`, where an object-literal `__proto__` sets the prototype and is never serialised, so the round-tripped object was an ordinary event; `Object.prototype` was not polluted. An actually own `__proto__` key is refused by the own-key allow-list (verified directly). Nothing was "fixed" for it. |
| **D13b the lease's `action_key` is not binding at commit** | **Owner boundary.** The author's suite encodes the opposite of the review's suggested repair: `conformance.test.mjs:234` commits `'post-reconcile'` against a lease declared with `'action-key-1'` and asserts the effect **executes**. Binding the commit key to the lease key would break the encoded contract, so the idempotency guarantee is carried by the action-key registry (D2) rather than by lease binding. The declared key is now at least observable: it is included in `leaseProjection`. |
| **D8 `in_audience` is a caller assertion** | **Owner boundary.** The module defines no audience/binding registry and the author's suite passes `in_audience` flags for devices the bus has never seen (`conformance.test.mjs:252-256`), so membership cannot be independently verified without inventing a registry this workbook does not scope. What was repaired is the half the bus *can* know: its own device state. An unknown device is still trusted as available. |
| **D5 a published event's `at` may lag the clock** | **Deliberate asymmetry, recorded.** A delayed or offline-synced event is a *record* of something that already happened, and publishing confers no authority, so `publish` accepts a lagging instant while every authority operation refuses one. The alternative — refusing lagging event instants — would make reconnect-synced input impossible. |
| **Anonymous reassignment (`probe-03`/`probe-14`)** | **Owner boundary.** `reassignLease` has no actor identity in this module and the author's suite reassigns without naming one (`conformance.test.mjs:186`), so an unnamed handoff is recorded as `acting_holder_ref: null` rather than trusted; naming a wrong holder is now refused. A required acting authority needs a workbook-level actor contract. |

Inert vocabulary and contract questions inherited from the review's coverage probes, all re-confirmed as having
no reachable behavioural consequence here: `UNKNOWN_DEVICE` / `AUDIENCE_NOT_PERMITTED` / `PRIVACY_WITHHELD` are
declared but never thrown; `ROUTING_REASONS.WATCHER` is never emitted; device identity is an unbound caller
string, so a device is auto-created as connected (a device registry/authentication is outside this module's
scope); there is no delivery/ack lifecycle and no cursor/gap reporting (`broadcast: false` and
`private_response_broadcast: false` are true by construction of the per-candidate loop, not measured); and
`holdsExclusive`'s `except_lease_ref` parameter is still never passed by any caller.

## 6. Local test summary

```text
corrected module                    23 tests / 23 pass / 0 fail
first-pass head a5f8093             23 tests / 10 pass / 13 fail   ← the second-pass regressions are the difference
development head f06cf31            23 tests /  7 pass / 16 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 7 tests are byte-identical to the Development head and all 7 pass; the 16 Alien regressions
(3 from the first pass and 13 from the second) are the added coverage. Evidence:
`frozen-f06cf31/` and `frozen-a5f8093/` (byte exports), `pre-fix-check-second-pass.log`,
`probes-against-a5f8093.log`, `probes-against-patched.log`, `gate-second-pass.log`.

## 7. Disclosure

- The first pass pushed `a5f8093` and ran hosted CI green (run 36804531861) **before** the independent review
  returned. It was not reported complete: the workbook stayed `IN_PROGRESS` until this second pass closed the
  13 mechanisms above. The first-pass test suite (3 regressions) caught none of them, which is exactly why the
  independent adversarial pass exists.
- Every failure of my own work is retained above rather than hidden: the six mechanisms of §3 that the
  reviewer's probes falsified on the Development head while my own first-pass probes had passed, and the two
  review statements (§5) that re-measurement showed were probe artifacts.
- No billing refusal was recorded as a code failure in this task; every hosted run that started executed real
  steps.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
