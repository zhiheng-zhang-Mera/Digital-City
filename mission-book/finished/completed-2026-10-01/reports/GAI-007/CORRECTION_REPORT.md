# GAI-007 Correction Report — Device-Aware Remote Execution + Result Return

```text
MISSION              = GAI-007 (General AI Gateway programme, task 7 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-007-device-aware-remote-execution.md
CLAIM_COMMIT         = e6af91c (Digital-City main, claim of GAI-007 Correction by Alien)
CLAIMED_AT           = 2026-10-01T01:23:05Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 99858b90e1470e7401d8ffd9cf52ade37d2c4381
DEVELOPMENT_CI       = 36743516874-success
CORRECTION_BRANCH    = general-ai/GAI-007-device-aware-remote-execution
CORRECTION_HEAD_SHA  = a4791b0f3f0cc4e2379ecea205a68ef229eb844a
BRANCH_CI            = 36801575502-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = GAI-007 19 pass (7 author + 12 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   99858b9 (Mech)   run 36743516874   success 2026-09-30T16:20:49Z
corrected head     a4791b0 (Alien)  run 36801575502   success
```

The corrected head executed its real workflow steps on GitHub-hosted runners. Green hosted CI on this head
plus the 19-test suite (12 of which fail on the Development head) is the completion evidence.

## 2. Independent review method

1. The Development head was exported with `git archive` and all four task blobs were verified against their
   Git objects: `D:\A-Utopia\.runtime\evidence\mission-book\GAI-007\frozen-99858b9\`.
2. An independent adversarial reviewer was pointed **only** at that frozen export, told to read the task
   workbook first, and required to reproduce every claim with a runnable probe (`p1`–`p4`). It reported 11
   material findings against an author suite of **7 tests, 7 passing**.
3. I had independently found 7 mechanisms; merging **by mechanism** produced 16 repaired defects across two
   passes. The reviewer's four overlapping findings (dispatch health revalidation, the un-terminalised
   attention path, the caller-controlled policy, unvalidated instants) confirmed my pass-1 repairs; its
   seven new mechanisms were repaired in pass 2.
4. Every repair is anchored by a regression that fails on the Development head: **7 pass / 12 fail on
   `99858b9`; 19 pass / 0 fail on `a4791b0`**.

## 3. Defects found and repaired

| # | Mechanism | Root cause | Repair |
| --- | --- | --- | --- |
| 1 | **The V1 device-switch confirmation was effectively caller-switchable.** `policy: { v1_confirmation_required: false }` removed the requirement, and any non-boolean value (`'yes'`, `1`) silently disabled it too, so a remote dispatch proceeded with no recorded confirmation | the gate read `config.v1_confirmation_required === true` and the policy was merged unvalidated | the policy must be `true` (V1 requires it) and `dispatch` hard-wires the confirmation gate for `REMOTE_DEVICE` |
| 2 | **A live `action_id` bypassed both confirmation gates**: the duplicate short-circuit ran before them, so a caller holding any live action id received the full status projection from a **denied** proposal instead of `PROPOSAL_NOT_CONFIRMED`, and could read another proposal's `final_ref` | dedupe ordered before the gates and unbound to its proposal | the gates run first; a duplicate is only absorbed when the proposal **and** action reference match, otherwise `DUPLICATE_DISPATCH` |
| 3 | **A refused dispatch was recorded as a dispatch** (`acceptance acceptance`): the port's `accepted: false` was discarded and an action was created with `dispatched: true` / `actions_created_on_execution_host: 1` | only `receipt_ref` was read from the port result | a dispatch requires an accepted receipt; otherwise a typed refusal and **no** action |
| 4 | **A terminal success could be synthesized**: a `FINAL` event with no `payload_ref` reported `SUCCEEDED` and the router minted its own `final_ref` from the event reference | `payload_ref ?? event.event_ref` | a `FINAL` must name the result it returns (`INVALID_REQUEST`); nothing is fabricated |
| 5 | **A cancelled or completed action could be un-terminalised** by `raiseAttention`, after which `recordEvent`'s terminal guard no longer matched and a late `FINAL` was applied — reporting `SUCCEEDED` for a cancelled action | `action.state = 'AWAITING_USER'` with no terminal guard | attention on a settled action is refused (`LATE_EVENT_AFTER_TERMINAL`) and the terminal truth stands |
| 6 | **The hardware-authentication path created no action**: the returned attention named an `action_id` that `statusFor` could not resolve, and a repeat dispatch minted another attention | the early return preceded `actions.set` | the action is registered in `AWAITING_USER` with its attention, so the pending decision is addressable and nothing executed |
| 7 | **A refused cancellation was reported as cancelled**: with no `cancel` on the port, or with `{accepted: false}` from the executor, the router still set `state: 'CANCELLED'` | the port result was ignored when building the cancellation | a cancellation requires an accepted receipt; otherwise a typed refusal and the action stays live |
| 8 | **The declared cancellation policy was never read**: `policy.cancel_authorized_states` was published but no decision consulted it (only the viewer list was checked) | a config field no decision reads | cancellation is refused when the action's state is not in `cancel_authorized_states` |
| 9 | **Stale or offline endpoints were dispatched to**: `dispatch` re-listed endpoints but only compared `endpoint_ref`/`device_ref`, never presence, freshness, web readiness or load | the eligibility predicate was only used during ranking | the endpoint is re-scored at dispatch and a no-longer-healthy endpoint is refused (`NO_HEALTHY_ENDPOINT` with its exclusion reasons) |
| 10 | **Every caller instant was unvalidated** and the shared instant check was shape-only, so `at: 'garbage'` and calendar-impossible instants were stamped into `dispatched_at`/`confirmed_at`/`cancelled_at`, and an impossible `cleanup_by` was stored as a staged policy | `when ?? now()` on six entry points; regex-only `isIsoInstant` | `callerInstant`/`isRealInstant` everywhere, including the clock and the staged cleanup deadline |
| 11 | **The health ceilings were caller-controllable**: `max_freshness_ms: Infinity`/`NaN` made every endpoint look fresh, `max_load` could be raised above 1, and non-numeric weights poisoned scores | unvalidated policy merge | the merged policy is validated (positive finite ceilings, `max_load` in (0, 1], non-negative finite weights, an array of canonical states) |
| 12 | **An exact event replay was applied twice** whenever the caller omitted `seq`; the only ordering check was opt-in | `if (seq !== null && ...)` | an exact replay (same kind, payload and text as the last event) is suppressed with `applied: false, duplicate: true` |
| 13 | **Non-boolean requirements skipped an exclusion**: `requires_local_input: 1` / `requires_session: 'true'` were read as false, so an unsuitable endpoint stayed eligible | `=== true` comparisons on caller input | the requirement flags must be booleans when given |
| 14 | **A non-text reference could crash the freezer** (untyped `RangeError`) or be stored raw: `user_ref`, `payload_ref`, `text`, `reason` had no type rule | `freeze` recursed with no visited set; no type checks | those fields are validated as text, and the shared freezer is cycle-safe |
| 15 | **`isPlainObject` accepted exotic objects**, so a class instance passed the port, policy and bundle guards | `typeof`/`Array.isArray` only | canonical records must have an object or null prototype |
| 16 | Staged input references and result references were stored without a type rule, and an impossible `cleanup_by` was accepted | shape-only instant check on the staging field | the cleanup deadline must be a real instant; the staged snapshot carries the validated value |

## 4. Local test summary

```text
corrected module  19 tests / 19 pass /  0 fail
development head  19 tests /  7 pass / 12 fail   ← the Alien regressions are the difference
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

Evidence under `D:\A-Utopia\.runtime\evidence\mission-book\GAI-007\`: `frozen-99858b9/` (byte-verified
export), `pre-fix-check/` (the corrected suite against the unfixed module — 12 failures),
`patch-remote-execution.mjs` and `-2.mjs` (the two anchor-guarded repair passes), `probes/` (the
reviewer's `p1`–`p4`), `author-after-patch*.log`, `prefix-test.log`, `postfix-test.log`, `gate-*.log`,
`ci-*.log`.

## 5. Owner boundaries and contract questions (recorded, not silently changed)

1. **`INVALID_PROPOSAL` is still never raised** (`DUPLICATE_DISPATCH` now is). A malformed proposal is
   refused as `INVALID_REQUEST`, so one declared code remains unused vocabulary — recorded rather than
   mapped onto a different meaning.
2. **Local health is not re-checked before a remote dispatch.** If the interaction device becomes healthy
   again after a proposal was confirmed, the router still dispatches remotely. The workbook's "prefer the
   current device's Web when it is healthy" may bind only the ranking step, so this is a contract question
   rather than a repair.
3. **`interaction_device_ref` is never mutated** anywhere, which is the module's headline invariant and was
   verified rather than changed.

Nothing in this list is a known wrong behaviour left in place: each is either a deliberate contract
question or unused vocabulary recorded for the Owner.
