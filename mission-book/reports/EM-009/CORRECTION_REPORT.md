# EM-009 Correction Report — Runtime Ownership + Health / Restart / Recovery

```text
MISSION              = EM-009 (Engineering Manager programme, task 9 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-009-runtime-health-restart-recovery.md
CLAIM_COMMIT         = 11e8f27 (Digital-City main, claim of EM-009 Correction by Alien)
CLAIMED_AT           = 2026-10-01T03:00:01Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 6ae1aea8833a15a11512642113810d8de0e83d75
DEVELOPMENT_CI       = 36736326499-success
CORRECTION_BRANCH    = engineering-manager/EM-009-runtime-health-restart-recovery
CORRECTION_HEAD_SHA  = c26003836996bffe4bf9ff7dedcb45dc0444474f
BRANCH_CI            = 36809354459-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-009 18 pass (7 author + 11 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   6ae1aea (Mech)   run 36736326499   success
corrected head     c260038 (Alien)  run 36809354459   gateway-web success / android success
```

## 2. Independent review method

The Development head was exported with `git archive` (`D:\A-Utopia\.runtime\evidence\mission-book\EM-009\frozen-6ae1aea\`)
and all four branch blobs were verified against their Git objects before any review started:

```text
contracts/engineering-runtime-supervisor-v1/supervisor.mjs            MATCH 6053d270b44094d4f2e2a8a897277b5500ae04f6
contracts/engineering-runtime-supervisor-v1/index.mjs                 MATCH c369fefe49f15cb405bf91a6b8eb308c584611aa
contracts/engineering-runtime-supervisor-v1/tests/conformance.test.mjs MATCH b6f8671fc0329458e6af26c7bccbe31d01307ae1
tests/engineering-runtime-supervisor.test.mjs                         MATCH 8a48712600d4cae670fb82e0128197833c26eae1
```

An independent adversarial reviewer was pointed only at that frozen export, told to read the workbook first
and briefed on the safety properties that matter here (monitor versus executor separation, pid-reuse
identity, a budget/cooldown that cannot be switched off, terminal jobs not resurrecting). It returned 16
probes and `probes/FINDINGS.md` with 10 reproduced mechanisms (`MATERIAL_DEFECTS_FOUND`, high confidence;
the frozen module's SHA-256 unchanged for the whole review). My own probe is
`probes-alien/probe-alien-em009.mjs`.

The structural half of the module held up in both reviews: the monitor's public surface really is four
sensing operations with no restart/kill/spawn member and no reference to the supervisor, a hand-made
decision is refused, an unissued reading is refused, stale liveness reads `UNKNOWN`, a reused or absent pid
is refused with zero port calls, safe mode is terminal, terminal jobs do not resurrect, and a backwards
clock is refused. What did not hold up was that every one of those guards consumed an **unvalidated caller
value** — and two of the reviewer's findings (a forged reading, a retargeted decision) defeated the
monitor/executor separation by *data* rather than by code.

## 3. First pass — 8 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **A forged reading minted real pressure.** `decidePressure` accepted any object carrying a `reading_id` this monitor had issued, so a genuine `HEALTHY` reading copied with `health: 'CRITICAL'` produced `PRESSURE/RESTART` — and a healthy instance was really signalled | 2, 8 | the decision is made from the reading the monitor recorded; the caller's object only names it | yes |
| 2 | **The restart policy could be switched off.** `max_restarts: NaN/Infinity/undefined` meant safe mode was never entered, and `backoff_base_ms: NaN` made every cooldown comparison vanish — the acceptance bullet "restart budget ends in safe mode instead of an infinite loop" was defeatable by a config value | 3 | the restart policy is validated (non-negative integers, factor ≥ 1, base ≤ cap, known keys) and the dead `INVALID_POLICY` code is used | yes |
| 3 | **The pressure policy could be switched off.** `min_confidence: NaN` muted the confidence gate, `stale_after_ms: Infinity` made every reading fresh, `critical_at: 0` made every healthy sample `CRITICAL`, and thresholds were never checked for order | 3 | the pressure policy is validated (ordered thresholds, positive `stale_after_ms`, `min_confidence` in [0,1], known keys) | yes |
| 4 | **Instants were shape-only and their comparisons failed open.** `2026-13-45T99:99:99Z` was accepted; `Date.parse` gave `NaN`, so staleness read `fresh` (stale evidence became pressure) and the cooldown comparison vanished (a second restart passed inside a 60s cooldown) | 6 | real-instant validation everywhere, NaN-safe comparisons that hold the brake, and a typed refusal for an uninterpretable instant | yes |
| 5 | **A throwing hook escaped untyped after the restart had happened.** A throwing readiness hook left the instance `RESTARTING` with an untyped error; a throwing process port escaped after the checkpoint had been recorded; the "every precondition is checked BEFORE any signal" comment was not true of the hooks | 5, 9 | a throwing port is a `PROCESS_SIGNAL_FAILED` refusal, a throwing readiness is `READINESS_CHECK_FAILED`, the checkpoint is recorded only once the signal was accepted, and the state ends `SUSPENDED` (not `RESTARTING`) with nothing counted | yes |
| 6 | **An absent probe confidence counted as confident.** `confidence` defaulted to `0.5`, exactly the default `min_confidence`, so a probe that reported no confidence at all passed the gate and produced `CRITICAL`/`PRESSURE` | 3, 8 | an absent confidence is 0 (no confidence) | yes |
| 7 | **The freezer recursed without a visited set**, so a self-referential policy or decision blew the stack with an untyped `RangeError` | 9 | `freeze` walks with a `WeakSet`, and a cyclic policy is refused as `INVALID_POLICY` before it can be frozen | yes |
| 8 | **`reconcileQueue` dropped unreadable active entries silently**, so a lost active job looked exactly like a job that never existed | 8, 10 | malformed active entries are reported in `malformed_active_entries` | yes |

## 4. Second pass — the independent review's non-overlapping findings

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 9 | **A minted decision could be retargeted at another instance.** The issuer vouched only for a `decision_id` string, so a decision minted for `worker:2`, shallow-copied with `instance_ref: 'worker:1'`, passed provenance and restarted `worker:1`; rewriting the verdict/evidence was equally accepted | 4, 2 | the issuer compares the decision's own content (kind, instance, verdict, action, health, confidence, policy_ref, decided_at) with the summary the monitor minted | yes |
| 10 | **A decision was never consumed.** One pressure decision could authorise restart after restart (bounded only by budget and cooldown) and no result carried an attempt key | 11 | the decision is spent when the restart it authorised has actually been signalled: one decision, one restart; a fresh `sense`+`decidePressure` is required for the next one | yes |
| 11 | **An unrecordable port answer escaped untyped after a real restart.** `freeze(clone(signal_result))` threw `DataCloneError` if the port returned something uncloneable, after the process had been signalled | 9, 5 | the snapshot is attempted in a guard; an unrecordable answer is reported as `signal_result: null` plus a `SIGNAL_RESULT_UNRECORDABLE` journal entry | yes |
| 12 | **A readiness answer was never bound to what it was about.** A hook answering `{ready: true, instance_ref: 'worker:other'}` (or naming another checkpoint) resumed this instance | 4, 13 | an answer that names an instance or checkpoint must name this one, otherwise the instance stays `SUSPENDED` with `READINESS_CONFIRMED_FOR_ANOTHER` | yes |
| 13 | **`supervise` was unguarded**: a non-array `decisions` produced an untyped `TypeError` part-way through a set of instances | 9 | `instances`, `decisions` and `live_processes` must be arrays (`INVALID_INSTANCE`) | yes |

## 5. Local test summary

```text
corrected module                    18 tests / 18 pass / 0 fail
development head 6ae1aea            18 tests /  7 pass / 11 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 7 tests are unchanged and all 7 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\EM-009\`: `frozen-6ae1aea/` (byte-verified export),
`prefix-test.log` (the corrected suite against the Development head), `gate-EM-009.log`,
`probes-alien/probe-alien-em009.mjs` (13 mechanisms reproduced), and the independent review's
`probes/FINDINGS.md` + 16 probes.

## 6. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **The signal payload carries no `process_start_marker`** (reviewer D6): the port receives `instance_ref`, `pid`, `signal` and `owner_token`, so a pid recycled between `validate` and `signal` is indistinguishable *to the port* | Author-encoded: `conformance.test.mjs:139` asserts that exact payload with `deepEqual`. The marker is still validated against the live table before anything is signalled, and the port contract is the port owner's to extend. Recorded for an owner decision, not changed silently. |
| **A refused restart leaves a `RUNNING` state record for a never-established instance** (reviewer D9): `ensure` fabricates state on a refusal | Author-encoded: `conformance.test.mjs:312` asserts `stateFor('worker:2').runtime_state === 'RUNNING'` for an instance that was only refused. It is inert in the safety direction (no authority follows from a state record; restart still needs provenance, identity, budget, cooldown and a checkpoint). The unguarded-input half of the finding is repaired (#13). |
| **`cooldown_ms` is validated but the decision uses the crash-loop backoff** (`backoffFor`) | Author-encoded: `conformance.test.mjs:174` expects `retry_after_ms === 1000` (the backoff base) with `cooldown_ms: 0`, and `:243` advances only the backoff base before a second restart succeeds. Making `cooldown_ms` participate would refuse those restarts. Recorded as a declared-but-unread policy field; it is now validated so it cannot be a NaN hole. |
| **`owner_token` stays optional on `restart`** | Author-encoded: `conformance.test.mjs:135` performs the successful restart without a token, while the impostor case at `:130` supplies one. Requiring it would make the documented happy path fail; the token check still applies whenever a token is supplied. |
| **The exported `PRESSURE_ISSUER` symbol remains reachable** while `Object.keys(monitor)` is exactly the four sensing operations | Author-encoded: `conformance.test.mjs:62` asserts the enumerable surface. The symbol is needed for the supervisor to verify provenance, and reachability is not authority: the issuer now checks content against what the monitor minted, so holding the symbol buys nothing. |
| **`reconcileQueue`'s `terminal_did_not_resurrect` is tautological** (`dropped.length === 0 || resumed.every(...)`) | It can never be false by construction, and the author asserts it is true (`conformance.test.mjs:265/273`). The real guarantee — the authoritative terminal set wins over the recovered active set — is enforced and asserted; the flag is a derived summary rather than an independent check. |
| **Heuristic pid identity**: the registry trusts the `live_processes` table its caller supplies | The module owns no process enumeration (it is a pure module with an injected process port); validating against a caller-supplied table is the designed seam, and a reused pid is still caught by the start marker. |

## 7. Disclosure

- The corrected head was pushed and verified green in one pass this time, but the independent review's
  findings arrived while the report was being written; they are the second pass above, and the workbook was
  marked complete only after both passes were green on the same head.
- My own probe crashed mid-run on a helper bug (`clockAt` was already a clock, so `clockAt(0)` returned a
  string and the monitor refused a non-function clock). The probe was fixed and re-run; the failure is
  recorded rather than hidden because it is exactly the kind of unvalidated-value mistake this task is
  about.
- I removed one redundant assertion I had written twice in the same regression (`isIsoInstant(...) === false`
  after the direct call) before committing.
- The two reviews disagreed in neither direction on the structural properties; every material difference was
  a mechanism one of us had not reproduced, and all of them are repaired above.
- Dependency installation is part of the gate procedure in a fresh Correction worktree
  (`pnpm install --frozen-lockfile` at the root and under `city/`). No billing refusal was recorded as a code
  failure; every hosted run in this task that started executed real steps.
