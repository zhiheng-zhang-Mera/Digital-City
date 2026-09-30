# EM-009 Development Report — Runtime Ownership + Health / Restart / Recovery

```text
MISSION                  = EM-009 (Engineering Manager programme, task 9 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 679cdf6 (Digital-City main, "claim(EM-009): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:19:05Z
CONTROL_REVISION_AT_CLAIM= 1ffce00 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-009-runtime-health-restart-recovery
IMPLEMENTATION_HEAD_SHA  = 6ae1aea8833a15a11512642113810d8de0e83d75
BRANCH_CI                = 36736326499 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/engineering-runtime-supervisor-v1/` — `supervisor.mjs` (health monitor, ownership registry,
restart supervisor, queue reconciliation, health ladder mapping), `index.mjs`, 7-test suite, root
`tests/engineering-runtime-supervisor.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Monitor cannot directly execute restart in source/permission tests | `authority is split…` (monitor keys are exactly `sense/decidePressure/policy/readings`; no `restart/kill/spawn/signal/terminate/execute` member; a source-slice scan asserts the monitor factory never signals a process or references the supervisor) |
| Restart executor has no authority to invent health pressure policy | same test (no `setThresholds`/`setPolicy`/`decidePressure`/`sense`; a hand-made decision — even with a perfect shape — is `PRESSURE_REQUIRED` because only the issuing monitor can vouch for it; a reading the monitor never produced cannot become pressure) |
| Stale/dead ownership cannot kill an unrelated process with a reused PID | `a stale or reused pid is never signalled` (`PID_REUSED` when the pid exists with a different start marker, `STALE_OWNERSHIP` when absent, `NOT_THE_OWNER` for a wrong token — with zero signals recorded) |
| Restart budget ends in safe mode instead of an infinite loop | `the restart budget ends in safe mode instead of an infinite loop` (cooldown/backoff refusals, exactly `max_restarts` signals, then terminal `SAFE_MODE` that refuses even after a long wait) |
| Resume occurs only after required readiness/checkpoint reconciliation | `resume happens only after a checkpoint and a readiness confirmation` (`CHECKPOINT_REQUIRED`, `CHECKPOINT_FAILED`, then restarted-but-`SUSPENDED` until readiness confirms) |
| Terminal jobs do not resurrect after recovery | `a terminal job does not resurrect after recovery` (`dropped_terminal_jobs`; a malformed terminal list is refused rather than read as empty) |
| One connector crash does not terminate unrelated connectors / Utopia | `one crashed connector never terminates unrelated connectors` (`untouched: ['worker:2']`, `other_instances_terminated: []`, only the unhealthy pid signalled) |
| Ownership records generalised by connector/instance/worker with stale PID validation; process/runtime scope only | `createOwnershipRegistry` (instance_ref + owner_token + pid + process_start_marker) with `validate()` returning typed `reason`; no network/session concern appears anywhere in the module |
| Health semantics with confidence/freshness | `the contract is strict, frozen, and honest about stale observations` (stale liveness ⇒ UNKNOWN, low confidence ⇒ UNKNOWN, neither can drive a restart) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, EM-004, BA-006, EM-008, GAI-004 and RF-004 Corrections). Tie-break after GAI-004 excluded GAI, so
EM-009 was chosen: it is the restart/recovery half of the seam EM-008 opened (persistent session
references must be restored by *someone*), and EM-010 (scheduler/worker pool) and EM-013 (integration)
both need a supervisor that will not kill a healthy worker.

**D2 — One module or three authorities?** OPTIONS: (a) a supervisor that also senses; (b) a monitor that
also restarts; (c) three objects — ownership, monitor, supervisor — with the monitor and supervisor
explicitly unable to do each other's job. CHOICE: (c). Reason: the acceptance list is written as
prohibitions, and prohibitions are only testable when the capability is absent from the surface. The
monitor's public keys are asserted to be exactly the four sensing operations, and a source-slice test
asserts its factory contains no signal call.

**D3 — How do we make "the supervisor cannot invent pressure" structural rather than documented?** First
version validated the decision's *shape* (kind, policy_ref, decided_at, thresholds). The suite found the
hole immediately: a hand-made object with the right shape passed. CHOICE: the monitor keeps a private set of
the pressure decisions it actually issued and exposes a **symbol-keyed** issuer
(`PRESSURE_ISSUER`) that the supervisor verifies. Reason: symbols stay out of `Object.keys`, so the
sensing surface stays exactly four operations while provenance becomes unforgeable; a shape check alone can
never distinguish a decision from a lookalike.

**D4 — Isolation from a reused PID.** CHOICE: an ownership record carries the process start marker, and a
live pid with a *different* marker is `PID_REUSED` — refused, with no signal. Reason: pids are recycled, and
the acceptance bullet names exactly this failure ("cannot kill an unrelated process with a reused PID").
The test double records every signal, so the assertion is "zero signals reached the foreign process" rather
than "the code returned an error".

**D5 — Safety ordering.** CHOICE: every precondition (pressure provenance, safe mode, budget, cooldown,
ownership, checkpoint) is evaluated before the signal, so a refused restart has no side effect at all.
Reason: a partially executed restart is much worse than a refused one; the result records
`process_signalled` so callers can prove which happened.

**D6 — Restart ≠ resume.** CHOICE: after a restart the instance goes to `SUSPENDED` unless the readiness
hook confirms it is back; a missing readiness hook also suspends. Reason: "resume occurs only after
required readiness/checkpoint reconciliation" is an acceptance bullet, and defaulting to "assume it came
back" is the false-success shape this programme keeps flagging. The result separates `restarted` from
`resumed` so a caller cannot conflate them.

**D7 — Health vocabulary.** CHOICE: publish the five-value pressure ladder (`HEALTHY/ELEVATED/DEGRADED/
CRITICAL/UNKNOWN`) *and* `mapToRegistryHealth()` onto EM-004's registry vocabulary
(`HEALTHY/DEGRADED/UNHEALTHY/UNKNOWN`). Reason: the workbook asks for the richer pressure semantics while
EM-004's registry already publishes a four-value health fact; publishing the mapping keeps one projection
rule instead of letting two programmes disagree in a report.

**D8 — Stale and low-confidence evidence.** CHOICE: a liveness timestamp older than `stale_after_ms`, a
failed probe, or confidence below the policy minimum yields `UNKNOWN`, and `UNKNOWN` can never produce
pressure. Reason: old or unproven evidence must not be converted into a destructive action; this was
surfaced by the safe-mode test, where a long wait turned a crash loop into a stale reading and correctly
suppressed further pressure (the test was then written to model a live probe instead).

**D9 — Terminal job resurrection.** CHOICE: `reconcileQueue` drops any job that is terminal in
authoritative state, and a malformed `terminal` argument throws a typed error instead of being treated as
empty. Reason: the acceptance bullet requires terminal jobs not to return; silently reading a malformed
list as "nothing is terminal" is precisely a resurrection path, so it is refused loudly.

**D10 — Scope.** CHOICE: process/runtime recovery only; no network/session reconnect, no machine reboot, no
provider-specific heuristics, and the supervisor is neutral over connector/worker kinds. Reason: the
workbook's out-of-scope list; cross-device reconnect stays Remote Fabric's and is recorded as a seam.

**D11 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/engineering-runtime-supervisor-v1/supervisor.mjs` | new — monitor, ownership, supervisor, reconciliation, health mapping |
| `contracts/engineering-runtime-supervisor-v1/index.mjs` | new — public surface |
| `contracts/engineering-runtime-supervisor-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/engineering-runtime-supervisor.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Four failed on first run; one was a genuine security-relevant defect and three were corrected
expectations:

1. **Defect:** a hand-crafted pressure decision with the right shape was accepted as authority to restart
   (the ownership check refused it only incidentally, as `NOT_THE_OWNER`). Fixed with the symbol-keyed
   issuer (D3); the test now asserts `PRESSURE_REQUIRED` for a forged decision and that the monitor's
   public surface is still exactly four operations.
2. **Defect:** `reconcileQueue` threw a raw `TypeError` on a malformed `terminal` argument. Fixed with a
   typed `INVALID_INSTANCE` refusal (D9), because silently treating it as empty is a resurrection path.
3. **Expectation:** the safe-mode test kept `last_liveness_at` fixed while advancing the clock, so after a
   long wait the reading became stale and correctly produced no pressure. The probe double now follows the
   observation instant, which models a live process; the module was right (D8).
4. **Expectation:** the resume test restarted twice at the same instant and hit the (correct) cooldown.
   The test now advances the clock by the backoff, which is the behaviour a real crash loop exhibits.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36736326499 on 6ae1aea8833a15a11512642113810d8de0e83d75 | success |

## 6. Integration seams handed to sibling tasks

- **EM-008 (credential/profile/session persistence):** its `exportPersistentRefs()`/`restore()` are the
  data half of restart recovery; the before-restart checkpoint hook here is where that snapshot should be
  taken, and the readiness hook is where a restored reference is re-validated. Neither module should grow
  the other's responsibility.
- **EM-004 (registry: process/auth/health):** `RUNTIME_STATES` covers EM-004's process states while
  `mapToRegistryHealth()` projects the pressure ladder onto the registry's four health facts; the registry's
  `pid_ref` should be the ownership record's pid and its start marker, not a bare pid.
- **EM-002 (connector adapter/process runtime):** the process port (`signal`) is the only way this module
  touches a runtime, so EM-002's launcher can implement it without exposing anything else.
- **EM-010 (foreman queue / DAG / worker pool):** `reconcileQueue` is the queue-recovery gate — the
  scheduler must run recovered queues through it before dispatching, or a terminal job can come back.
- **EM-007 / RF-006 (remote subworker return, path manager):** this supervisor is explicitly *not*
  responsible for network/session reconnect; a remote worker's reconnect must not be modelled as a local
  restart, and a remote return must not be gated on a local readiness hook.
- **GAI-008 (health/resilience/honest degradation):** the pressure ladder and the "UNKNOWN cannot justify a
  destructive action" rule are directly reusable; GAI should consume the projection rather than define a
  second health vocabulary.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: obtaining the monitor's issuer symbol and minting a decision by hand
   (the symbol is exported, so this needs an explicit judgement about whether it should be
   module-private); a decision for instance A replayed against instance B (covered, but worth re-testing);
   a checkpoint that succeeds and a signal that fails; a readiness hook that throws; and a duplicate
   `claim()` that overwrites ownership with a new pid.
2. Confirm D6 (a missing readiness hook suspends rather than resumes) and D8 (stale/low-confidence evidence
   can never produce pressure) as the intended readings.
3. Confirm whether `PRESSURE_ISSUER` should be exported at all, or kept module-private with the issuing
   check performed inside the monitor via a closure the supervisor receives at construction.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
