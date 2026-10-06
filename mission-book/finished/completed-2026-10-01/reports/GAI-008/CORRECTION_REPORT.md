# GAI-008 Correction Report — Scoped Health + Bounded Retry + Honest Degradation

```text
MISSION              = GAI-008 (General AI Gateway programme, task 8 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-008-health-resilience-degradation.md
CLAIM_COMMIT         = 6914a4b (Digital-City main, claim of GAI-008 Correction by Alien)
CLAIMED_AT           = 2026-10-01T01:35:16Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 43183faa449a2bd8fd4ebd61348ccf4982ca3c0f
DEVELOPMENT_CI       = 36745985350-success
CORRECTION_BRANCH    = general-ai/GAI-008-health-resilience-degradation
CORRECTION_HEAD_SHA  = e34e310f0077ab4e1af5c30baa0b12be482c638b
BRANCH_CI            = 36802506885-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = GAI-008 16 pass (7 author + 9 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   43183fa (Mech)   run 36745985350   success 2026-09-30T16:41:00Z
corrected head     e34e310 (Alien)  run 36802506885   success
```

The corrected head executed its real workflow steps on GitHub-hosted runners, and 9 of the 16 tests in the
suite fail on the Development head, so green CI plus the suite is the completion evidence.

## 2. Independent review method

1. The Development head was exported with `git archive` and all four task blobs were verified against their
   Git objects: `D:\A-Utopia\.runtime\evidence\mission-book\GAI-008\frozen-43183fa\`.
2. An independent adversarial reviewer was pointed **only** at that frozen export, told to read the workbook
   first, and required to reproduce every claim with a runnable probe (19 probes, `probe-A`…`probe-T`). It
   reported 15 findings against an author suite of **7 tests / 141 asserts, all passing**.
3. I had independently found 7 mechanisms; merging **by mechanism** produced 14 repaired defects across three
   passes. The reviewer's genuinely new mechanisms (the cooldown anchored to a caller instant, the erased
   human acknowledgement, the opt-in boolean guards, the readiness of a degraded availability, the
   query/report disagreement) were repaired in passes 2 and 3.
4. Every repair is anchored by a regression that fails on the Development head: **7 pass / 9 fail on
   `43183fa`; 16 pass / 0 fail on `e34e310`**.

## 3. Defects found and repaired

| # | Mechanism | Root cause | Repair |
| --- | --- | --- | --- |
| 1 | **Every policy bound was unvalidated**, so `max_attempts: NaN`/`Infinity` removed the retry bound entirely, `max_health_ttl_ms: NaN` let `ttl_ms` reach 1e15 (a 31,700-year freshness horizon), `circuit_cooldown_ms: NaN` crashed with a raw `RangeError`, and `backoff_factor: 0.5` made backoff shrink | spread merge with no checks | the merged policy is validated (positive safe integers for every numeric bound, `backoff_factor >= 1`, `health_ttl_ms <= max_health_ttl_ms`) |
| 2 | **Every caller instant was unvalidated and the check was shape-only**, so `at: 'garbage'` was stamped into `evaluated_at`, and a calendar-impossible instant made `age` `NaN`, which is never `> staleAfter` — reporting a stale observation as `HEALTHY` forever | `when ?? now()` on 8 entry points; regex-only `isIsoInstant` | `callerInstant`/`isRealInstant` on the clock, `observed_at`, `healthAt` and all seven decision instants; an unmeasurable age is **stale**, never fresh |
| 3 | **The circuit cooldown ran from the caller's instant**: a backdated failure produced an `open_until` already in the past (cooldown never enforced) and a future instant extended a 30 s cooldown by a year; the half-open transition was also decided by the caller's instant | `open_until = at + cooldown`; `circuitFor` compared against the caller's `at` | the cooldown opens and elapses on the **registry clock** |
| 4 | **`recordOutcome` threw a raw `RangeError` after mutating the circuit**, leaving `state: OPEN` with `open_until: null` — a scope whose breaker could never half-open and never recover | mutation before the instant arithmetic | the instant is validated before any mutation, and the validated cooldown arithmetic cannot fail |
| 5 | **A replayed human-blocked failure erased a durable acknowledgement**: `humanBlocked.set(..., resolved: false)` overwrote `acknowledgeHumanAction`'s record, so the acknowledged action returned to `human_blocked_actions` | the block writer ignored the existing entry | an acknowledgement is durable: a re-block keeps `resolved`, records `reblocked_at`/`requires_new_acknowledgment`, and the decision reports `previously_acknowledged` |
| 6 | **A side-effecting transient failure was retried without an idempotency key.** The decision returned `retry: true` and only an informational flag — contradicting the module's own contract that a destructive failure is not retried without a key | the key was required only on the ambiguous path | a side-effecting transient retry is withheld for reconciliation (`IDEMPOTENCY_REQUIRED`) unless a key is present |
| 7 | **A degraded or unknown availability reported `readiness: READY`**, erasing the distinction the module exists to keep | only `UNAVAILABLE` was gated | `DEGRADED` → `NOT_READY`, `UNKNOWN` → `UNKNOWN` |
| 8 | **A degraded availability was reported as `reason: HEALTHY`** | the reason chain ignored the availability except for `UNAVAILABLE` | the reason names `AVAILABILITY_DEGRADED` |
| 9 | **A read mutated half-open state**, so `resilienceReport()` returned different `open_circuits` at the same instant before and after a `circuitState()` query | the transition lived in `circuitFor`, and the readers used the raw stored state | one `effectiveCircuitState` projection used by `circuitState`, `resilienceReport` and `faultIsolation` |
| 10 | **Non-boolean flags silently degraded safety**: `other_device_available: 1` dropped the device-switch proposal, and `side_effecting: 1` reported that no idempotency requirement applied | `=== true` comparisons on caller input | both flags must be booleans when given |
| 11 | **`degradeChannel` accepted any channel** (`'NONSENSE'`, `42`), returning an "honest degradation" verdict for a subject it cannot name | no validation against the declared scope kinds | the channel must be a canonical `SCOPE_KINDS` member |
| 12 | **A cyclic caller value crashed the shared freezer** (`RangeError: Maximum call stack size exceeded` from `policy()`) | `freeze` recursed with no visited set | the freezer tracks visited objects |
| 13 | **`isPlainObject` accepted exotic objects**, so a class instance passed the policy and port guards | `typeof`/`Array.isArray` only | canonical records must have an object or null prototype |
| 14 | `degradeChannel`'s `reason` and `channel` had no type rule, so a cyclic or non-text value reached the freezer | no validation | both must be text |

## 4. Local test summary

```text
corrected module  16 tests / 16 pass /  0 fail
development head  16 tests /  7 pass /  9 fail   ← the Alien regressions are the difference
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

Evidence under `D:\A-Utopia\.runtime\evidence\mission-book\GAI-008\`: `frozen-43183fa/` (byte-verified
export), `pre-fix-check/` (the corrected suite against the unfixed module — 9 failures),
`patch-resilience.mjs`, `-2.mjs`, `-3.mjs` (the three anchor-guarded repair passes), `probes/` (the
reviewer's 19 probes), `author-after-patch.log`, `prefix-test.log`, `postfix-test.log`, `gate-*.log`,
`ci-*.log`.

## 5. Owner boundaries and contract questions (recorded, not silently changed)

1. **The retry bound is counted by the caller.** `attempt` is supplied per decision and compared against
   `config.max_attempts`; a caller that keeps sending `attempt: 1` is never refused, and the reserved
   `attempts` map is unused. The author's suite encodes this model (three decisions for one `action_ref`
   with attempts 1, 2, 2 must all be permitted), so governor-side accounting is an Owner-level contract
   change, not a Correction. Recorded as the highest-value carry-forward for this module.
2. **`observeHealth` defaults every signal to its healthy value.** An observation with no signals reports
   `HEALTHY`/`READY`/fresh and enters `healthy_scopes`. The author's suite asserts exactly that for a
   signal-less observation, so requiring explicit evidence is an Owner ruling.
3. **`admissionsRecorded()` is a constant 0** (`admissions` is never incremented) and is asserted as 0 by
   the author's suite; the module has no admission path to wire it to.
4. **`failure_threshold` counts failures per scope, not per action**, and `half_open_probes` is declared and
   never read (the circuit admits unlimited half-open retries until an outcome is recorded). The workbook
   does not settle either semantic.
5. **`degradeChannel`'s body is constant** (`state: UNAVAILABLE`, `honest_degradation: true`,
   `false_success: false`) and does not consult an observation; the author's suite asserts those constants.
   The API-escalation half of the acceptance criterion is genuinely met (`escalateToApi` always refuses and
   no path sets `api_escalation`).
6. **Declared-but-unthrown codes** (`UNKNOWN_SCOPE`, `RETRY_NOT_PERMITTED`, `RETRY_BUDGET_EXHAUSTED`,
   `CIRCUIT_OPEN`, `IDEMPOTENCY_REQUIRED`, `HUMAN_ACTION_REQUIRED`, `STALE_OBSERVATION`,
   `ALREADY_ACKNOWLEDGED`) are returned as `reason` strings rather than thrown; `SIGNAL_KINDS` is unused.
7. **`classifyFailure` passes a negative `retry_after_ms` through** (the retry path clamps it with
   `Math.max`), and a provider `retry_after_ms` is not capped by `backoff_cap_ms` — the workbook does not
   settle whether a provider-supplied delay may exceed the local cap.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
