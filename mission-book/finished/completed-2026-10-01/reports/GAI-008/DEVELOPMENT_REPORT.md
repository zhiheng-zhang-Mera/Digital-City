# GAI-008 Development Report — Health + Resilience + Honest Degradation

```text
MISSION                  = GAI-008 (General AI Gateway programme, task 8 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = e3333ea (Digital-City main, "claim(GAI-008): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:38:20Z
CONTROL_REVISION_AT_CLAIM= 688c065 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-008-health-resilience-degradation
IMPLEMENTATION_HEAD_SHA  = 43183faa449a2bd8fd4ebd61348ccf4982ca3c0f
BRANCH_CI                = 36745985350 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/general-ai-health-resilience-v1/` — `resilience.mjs` (five separate signals, typed readiness,
staleness, failure classification, bounded retry/backoff, scoped circuits, honest channel degradation, fault
isolation, human-action acknowledgement), `index.mjs`, 7-test suite, root
`tests/general-ai-health-resilience.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Transient technical failure follows bounded retry/circuit policy | `a transient technical failure follows a bounded retry and backoff policy` (backoff 100 → 200, cap honoured, provider `retry-after` honoured above it, hard attempt bound) |
| Auth/human attention never auto-resumes as if technical retry succeeded | `human-blocked and ambiguous failures never auto-resume as a technical retry` (`HUMAN_ACTION_REQUIRED`, `auto_resume: false`, explicit acknowledgement required, a later healthy observation does not resolve it) |
| Stale health is distinguishable from healthy | `stale health is distinguishable from healthy and never reported as healthy` (`UNKNOWN` + `STALE_OBSERVATION`, `stale: true`, report lists stale scopes separately) |
| Circuit state is scoped so one provider/account/channel cannot globally trip all AI | `circuits are scoped so one failure cannot trip all AI or the local surfaces` (`circuit_is_global: false`, other scopes `CLOSED`, healthy provider still retries, half-open probe after cooldown) |
| General AI outage leaves Rooms/City Tasks/other independent surfaces usable | Same test plus `a Web failure degrades honestly…` (`local_surfaces_use_general_ai: false`, `poisons_all_ai: false`, `local_surfaces: [ROOMS, CITY_TASKS, …]`) |
| No automatic API escalation exists in resilience code | `a Web failure degrades honestly and never silently escalates to the API` (`api_escalation: null`, `api_escalation_automatically_triggered: false`, `escalateToApi()` refuses, `admissionsRecorded(): 0`) |
| Typed health/readiness for provider, account, model, WEB and API channel | Test 1 (`SCOPE_KINDS`; per-scope observation and readiness) |
| Availability, health, auth, rate limit and budget kept separate | Test 1 (`signals_are_separate`, `auth_is_not_health`, `budget_is_not_availability`; a HEALTHY provider with `NEEDS_USER` is `NOT_READY`) |
| Never retry destructive/ambiguous actions without idempotency/reconciliation | Test 4 (`IDEMPOTENCY_REQUIRED`; with a key, `AMBIGUOUS_WITH_IDEMPOTENCY` still `requires_reconciliation: true`) |
| Web failure may propose another device or stay unavailable | Test 6 (`DEVICE_SWITCH_PROPOSAL` with `requires_user_confirmation: true`; with no other device, `proposal: null`) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, BA-008, EM-004, EM-005, EM-008, EM-009, GAI-003…007, RF-004…008 Corrections; EM-006
is in progress). Tie-break after RF-008 excluded Remote Fabric, so the choice was between GAI-008 and the
heavier Engineering/Butler stages. GAI-008 was taken deliberately: it is a well-bounded contract that closes
the GAI gateway's failure semantics, whereas EM-010 (foreman queue/DAG/worker pool) is the programme's
largest remaining substrate and deserves a fresh context rather than the tail of this round. That judgement
is recorded rather than left implicit, and EM-010 remains the next Engineering claim.

**D2 — Health vocabulary.** CHOICE: reuse EM-004's exact four-value registry vocabulary
(`HEALTHY`/`DEGRADED`/`UNHEALTHY`/`UNKNOWN`) for health, with a separate `READINESS`
(`READY`/`NOT_READY`/`UNKNOWN`) and separate `AVAILABILITY`, `AUTH_STATES`, `RATE_LIMIT_STATES` and
`BUDGET_STATES`. Reason: one health word across programmes means two reports cannot disagree, while the
workbook explicitly requires availability, health, auth, rate limit and budget to stay *separate* — so they
are five fields, not one status. Readiness is the derived, single answer a caller wants, and it is `NOT_READY`
for a healthy-but-unsigned provider.

**D3 — What does staleness do?** CHOICE: past the TTL the projection becomes `UNKNOWN` with
`reason: 'STALE_OBSERVATION'` and `stale: true` (never `HEALTHY`), and a never-observed scope is `UNKNOWN`
with `NO_OBSERVATION`. Reason: "stale health is distinguishable from healthy" is an acceptance bullet, and
fail-closed on old evidence is the only honest reading. The report separates `healthy_scopes` from
`stale_scopes`, so a dashboard cannot accidentally count a stale provider as up.

**D4 — Which failures may be retried?** CHOICE: four classes — `TRANSIENT_TECHNICAL` (retryable, bounded),
`HUMAN_BLOCKED` (never retried), `PERMANENT` (never retried), `AMBIGUOUS` (retried only with an idempotency
key) — and an unrecognized code classifies as `AMBIGUOUS` rather than transient. Reason: the workbook forbids
auto-retry for auth/human states and forbids retrying destructive/ambiguous actions without idempotency; the
default-to-ambiguous rule means a new provider error code cannot silently become retryable.

**D5 — How is a human-blocked action cleared?** CHOICE: only `acknowledgeHumanAction` marks it resolved, and
the response states `auto_resume_still_required: true`; a successful health observation does *not* resolve it.
Reason: "auth/human attention never auto-resumes as if technical retry succeeded" is an acceptance bullet. A
provider becoming reachable is not a user signing in, and conflating them is how a system starts making
authenticated calls it was never authorised to make.

**D6 — Circuit scope.** CHOICE: circuits are keyed by `(scope_kind, scope_ref)` — provider, account, model,
web channel or API channel — with `circuit_is_global: false`, a cooldown, and a half-open state that permits
exactly one probe. Reason: "circuit state is scoped so one provider/account/channel cannot globally trip all
AI" requires that the *only* tripping entity is the failing scope; the test asserts another provider still
retries while the first is open. The half-open path is what makes recovery observable rather than requiring a
restart.

**D7 — Isolation from local surfaces.** CHOICE: `faultIsolation()` and `degradeChannel()` publish
`local_surfaces` (Rooms, City tasks, arcades, local capabilities) with `local_surfaces_use_general_ai: false`
and `poisons_all_ai: false`. Reason: the workbook requires a General AI outage to leave the other Utopia
surfaces usable; stating the dependency direction as data is what lets the merge prove it, and it also
documents that resilience code holds no Engineering ownership.

**D8 — No automatic API escalation.** CHOICE: `degradeChannel` returns `api_escalation: null` and
`api_escalation_automatically_triggered: false`, offers only a `DEVICE_SWITCH_PROPOSAL` requiring user
confirmation, and the module exposes an `escalateToApi()` entry point that always refuses with
`API_ESCALATION_IS_NOT_AUTOMATIC`. Reason: "no automatic API escalation exists in resilience code" is an
acceptance bullet; providing the refusal explicitly (rather than merely not implementing escalation) makes the
prohibition testable and gives a caller a typed answer, consistent with GAI-004's consent gate.

**D9 — Retry-after semantics.** CHOICE: a provider `retry-after` is honoured *above* the computed exponential
backoff, and the backoff is capped by policy. Reason: the provider knows when it will be ready, and ignoring
that is how a client turns rate limiting into an outage. The suite originally asserted this at the last
permitted attempt (where the answer is correctly "exhausted"); the test now checks it at an attempt that still
has budget, and asserts exhaustion separately.

**D10 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/general-ai-health-resilience-v1/resilience.mjs` | new — signals, readiness, staleness, classification, retry, circuits, degradation, isolation |
| `contracts/general-ai-health-resilience-v1/index.mjs` | new — public surface |
| `contracts/general-ai-health-resilience-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/general-ai-health-resilience.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. One failure on first run, and it was a **test-arithmetic** mistake rather than a module defect: the
retry-after assertion was written against the last permitted attempt (3 of `max_attempts: 3`), where the
correct answer is `ATTEMPTS_EXHAUSTED` with no backoff. The test now asserts retry-after honouring on an
attempt that still has budget and asserts exhaustion separately, so both behaviours are covered rather than
one being masked. No module change was needed for this task — worth stating plainly rather than implying a
fix happened.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36745985350 on 43183faa449a2bd8fd4ebd61348ccf4982ca3c0f | success |

## 6. Integration seams handed to sibling tasks

- **GAI-004 / GAI-005 / GAI-006 / GAI-007 (admission, triage, conversation, remote execution):** a
  `TRANSIENT_TECHNICAL` retry decision belongs to the channel that failed, and a `HUMAN_BLOCKED` decision is
  exactly what GAI-004's consent/auth gate and GAI-007's ATTENTION_REQUIRED surface must present to the user.
  Triage should treat a stale health projection as `UNKNOWN`, never as available.
- **EM-004 / EM-005 (engineering registry health, attention):** the health vocabulary is deliberately
  identical, and both programmes should consume one projection rule; the Engineering attention envelope is
  the natural carrier for a `HUMAN_BLOCKED` action.
- **EM-009 (runtime recovery) / BA-008 (leases):** a circuit is not a lease — an open circuit refuses new
  retries while a lease governs who may act; a restart must not clear a circuit silently, and this module's
  half-open probe is the only recovery path.
- **RF-006 / RF-008 (path manager, data plane):** transport-level retry (`attempt_id`) is RF-008's concern
  while service-level backoff is this module's; the two must not multiply into an unbounded retry loop, so
  RF-008 should ask this governor before opening a new attempt.
- **GAI-009 (Utopia surface integration):** `resilienceReport()` is the honest degradation surface a UI should
  render (stale, unknown, open circuits, human-blocked actions), and it must never render a stale scope as up.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a scope observed healthy again while a human-blocked action is pending (the
   module keeps the action pending — confirm that is intended for a *scope-level* recovery); a circuit that
   is only ever probed by an action already past its attempt budget; a `retry_after_ms` larger than the
   circuit cooldown; an observation with `ttl_ms` shorter than the clock granularity; and a `degradeChannel`
   for the API channel itself (currently only meaningful for WEB).
2. Confirm D5 (only an explicit acknowledgement clears a human-blocked action) and D9 (retry-after wins over
   computed backoff) as the intended readings.
3. Confirm whether `escalateToApi()` should also record an attempted-escalation audit entry, which would make
   an accidental caller visible in the journal (it currently refuses without recording).

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
