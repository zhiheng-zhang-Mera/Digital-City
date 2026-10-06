# GAI-005 Development Report — Deterministic + JEV Triage Routing

```text
MISSION                  = GAI-005 (General AI Gateway programme, task 5 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 1d7fb4e (Digital-City main, "claim(GAI-005): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:38:12Z
CONTROL_REVISION_AT_CLAIM= 7d95799 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-005-triage-jev-routing
IMPLEMENTATION_HEAD_SHA  = 48169de998a913f495fbca1dac5bd37d79e57e19
BRANCH_CI                = 36738383466 — success
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/general-ai-triage-routing-v1/` — `triage-routing.mjs` (deterministic fast path, optional JEV
port, output normalization, gateway policy decision, engineering hand-off, confirmation boundary, audit
trail), `index.mjs`, 6-test suite, root `tests/general-ai-triage-routing.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Known deterministic commands invoke no JEV and no general-AI provider | `a known deterministic command consults no JEV and no provider` (triage port records **zero** calls; `jev_attempted: false`; `general_ai_invoked: false`) |
| Ambiguous lightweight text can use JEV when available | Same test (unknown text *does* consult the port) plus `JEV recommends, gateway policy decides…` |
| JEV unavailable/timeout/malformed output is non-blocking | `unavailable, timed-out, malformed and low-confidence JEV is non-blocking` (each yields a typed `jev_fallback_reason` and a usable `MANUAL_PICKER` decision) |
| JEV cannot directly execute an Action or grant permission | `JEV cannot execute an Action or grant permission` (six hostile outputs refused with `JEV_MAY_NOT_EXECUTE`; router exposes no execution member; `permission_granted: false`) |
| HARD/engineering classification does not silently call General AI as a coding worker | `engineering intent routes to the Engineering programme, never to General AI` (typed engineering port; absent port ⇒ explicit `ENGINEERING_ROUTE_DEFERRED`; `general_ai_invoked: false` throughout) |
| Route recommendation and final chosen route are separately auditable | `JEV recommends, gateway policy decides…` (`recommendation.*` preserved even when policy overrides; `chosen.decided_by`; both in the audit trail) |
| Gateway policy, not JEV, makes the final decision | Same test (`policy.decide` override wins, `decided_by: GATEWAY_POLICY_CUSTOM`, `policy_ref` recorded) |
| Low confidence / no JEV falls back to deterministic candidate + manual picker | `unavailable…non-blocking` (low confidence is treated as **no** signal, not a weak one) |
| Complex engineering intent routes outside GAI through a typed route/port | As above (engineering port; deferred seam when absent) |
| Side-effect/destructive intents stay subject to confirmation/permission boundaries | `JEV cannot execute…` (`CONFIRMATION_REQUIRED`, `requires_confirmation: true`, `permission_granted: false`, even when JEV recommended `GENERAL_AI`) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, EM-004, BA-006, EM-008, EM-009, GAI-004 and RF-004 Corrections). Tie-break after RF-005
excluded Remote Fabric, so GAI-005 was chosen: it is the routing layer that consumes the admission gate
GAI-004 just built (now in context), and GAI-006/007/009 all need a route decision to exist first.

**D2 — Is JEV required for routing?** OPTIONS: (a) JEV first with a deterministic fallback; (b) deterministic
first with optional JEV; (c) JEV-only semantic router. CHOICE: (b). Reason: the workbook requires
deterministic/local routing as first priority and no mandatory LLM for basic routing. The test asserts the
port's call count is **zero** for a known command, which is stronger evidence than "the code looks like it
skips JEV".

**D3 — Who decides the route?** CHOICE: gateway policy always produces `chosen`; JEV only fills
`recommendation`. A custom `policy.decide` can override the recommendation and the override is recorded with
`decided_by: GATEWAY_POLICY_CUSTOM` and its `policy_ref`. Reason: the workbook separates classification from
the final execution/admission decision, and the acceptance bullet requires both to be auditable. Keeping
them as two fields (rather than one resolved value plus a note) makes it impossible to lose the
recommendation when policy overrides it.

**D4 — How is "JEV cannot execute" enforced?** CHOICE: a recursive scan for execution/authority-shaped keys
(`action_ref`, `execute`, `handler_ref`, `grants`, `lease`, `capabilities`, `credential_ref`, …) anywhere in
the triage output; if found, the whole output is refused (`JEV_MAY_NOT_EXECUTE`) and the recommendation is
discarded. Reason: sanitizing a hostile output would leave the rest of it as a decision input, and the
workbook's out-of-scope list forbids giving JEV credentials, leases or Computer Use authority. Refusing the
whole output makes the boundary binary and testable, and the router itself exposes no execution member.

**D5 — Failure taxonomy.** CHOICE: distinct typed fallback reasons — `JEV_UNAVAILABLE`, `JEV_TIMEOUT`,
`JEV_MALFORMED`, `JEV_LOW_CONFIDENCE`, `JEV_MAY_NOT_EXECUTE` — all leading to the same non-blocking
fallback. Reason: the workbook asks for non-blocking behaviour, and an operator needs to know *why* triage
was skipped. Note the asymmetry with RF-005's deliberate generic failure: there the caller may be an
attacker (an existence oracle), here the caller is the gateway itself, so precision is safe and useful.

**D6 — Timeout modelling.** CHOICE: the port reports a timeout as a typed outcome (`error.code === 'TIMEOUT'`
/ `ETIMEDOUT`) which the router maps to `JEV_TIMEOUT`; enforcing a real deadline belongs to the async
adapter. Reason: this contract module is synchronous and pure (no timers), so it cannot own a wall-clock
deadline; modelling the timeout *outcome* keeps the fallback behaviour honest and testable, and the seam is
recorded in §6.

**D7 — Unknown vocabulary.** CHOICE: an intent/complexity/risk/channel outside the canonical vocabularies
normalizes to `null`; if nothing at all is recognized the output is `JEV_MALFORMED`. Reason: coercing
`CHITCHAT` into `QUESTION` (or `critical` into `HIGH`) would invent certainty the classifier did not
provide; null means "no signal", which the router already handles correctly.

**D8 — Engineering routing.** CHOICE: engineering intents (`ENGINEERING`, or `COMPLEX` complexity) are
routed to a typed `EngineeringRoutePort`; when that port is absent the decision is an explicit
`ENGINEERING_ROUTE_DEFERRED` seam with `deferred: true` and `succeeded: false`, and `general_ai_invoked`
stays false. Reason: the workbook forbids making GAI an engineering executor, and a missing sibling
implementation must be a recorded typed seam rather than a silent provider call or a hard failure.
Low-confidence engineering guesses must **not** trigger this (tested), because a weak classifier signal must
not open a heavier route.

**D9 — Side effects and destructive intent.** CHOICE: `ACTION` intent or `HIGH`/`DESTRUCTIVE` risk forces
`CONFIRMATION_REQUIRED` regardless of what JEV recommended, with `permission_granted: false`. Reason: the
workbook requires side-effect/destructive intents to remain subject to the existing Utopia
confirmation/permission boundaries; the test asserts the recommendation is still recorded (for audit) while
not being followed.

**D10 — Deterministic matching rule.** CHOICE: a command matches only as an exact string or a prefix
followed by a space, so "/help me" matches `/help` while "please open the city" does not match
`/city open`. Reason: a substring match would silently capture conversational text and route it away from
triage — the opposite of "deterministic first, then ask".

**D11 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/general-ai-triage-routing-v1/triage-routing.mjs` | new — deterministic path, JEV normalization, policy decision, engineering hand-off, audit |
| `contracts/general-ai-triage-routing-v1/index.mjs` | new — public surface |
| `contracts/general-ai-triage-routing-v1/tests/conformance.test.mjs` | new — 6 conformance tests |
| `tests/general-ai-triage-routing.test.mjs` | new — root runner entry (101 → 107 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

6 tests, all passing **on the first run** — no module defect and no corrected expectation in this task.
That is worth stating explicitly rather than glossing: the two prior GAI/EM tasks each needed real fixes
(GAI-004's proposal could carry a consent field; EM-009's pressure decision was forgeable), so the tests
here were written with those classes of hole in mind (hostile classifier output, policy override,
missing-port seam, unknown vocabulary) and the implementation satisfied them directly. The only adjustments
made while writing were to the test scaffolding itself (a port double that records calls, and a policy
double that overrides), not to expectations about module behaviour.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 107 tests, 107 pass, 0 fail (101 baseline + 6 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36738383466 on 48169de998a913f495fbca1dac5bd37d79e57e19 | success |

## 6. Integration seams handed to sibling tasks

- **GAI-004 (API channel + consent + budget):** a `GENERAL_AI` route here only *reports a channel*
  (`general_ai_invoked: false`); the actual API run must still pass GAI-004's consent → budget → admission
  gate. A route decision is not consent, and this module deliberately holds no consent record.
- **GAI-003 / GAI-006 (web channel, conversation/streaming):** the web channel supplies text and receives a
  route decision; a conversation turn that routes to `CONFIRMATION_REQUIRED` must ask the user rather than
  starting a provider run.
- **GAI-007 (device-aware remote execution):** a remote execution carries the same triage decision plus its
  own consent; `permission_granted: false` here must not be read as permission elsewhere.
- **GAI-008 (health/resilience/degradation):** the typed fallback reasons are the honest-degradation surface
  for triage; GAI-008 should report triage unavailability rather than treating it as an error.
- **EM-010 / EM-013 (foreman scheduling, shared task core):** `EngineeringRoutePort.route` is the seam for
  handing engineering work to the Engineering programme; its absence yields `ENGINEERING_ROUTE_DEFERRED`.
  At merge the two programmes should agree one hand-off shape instead of each defining a route call.
- **Butler assistant (BA-*):** this module classifies and routes; it never replaces the assistant identity
  or the task graph, and `jev_is_canonical_truth: false` is asserted on every decision.
- **JEV adapter (external):** real deadline enforcement and the actual model call belong to the adapter that
  implements `JevTriagePort.classify`; the adapter must convert a deadline into a `TIMEOUT`-coded error so
  the router can degrade honestly (D6).
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a triage output whose execution-shaped key is hidden behind an array
   index or an unusual case (`Action_Ref`, `LEASE`); a policy `decide` that returns `CONFIRMATION_REQUIRED`
   for everything (should still be honoured, and should require confirmation); a classification that claims
   `needs_general_ai: true` with a `DESTRUCTIVE` risk; and a deterministic command whose prefix collides
   with another command (`/city` vs `/city open`).
2. Confirm D4 (refusing the whole hostile output rather than sanitizing it) and D8 (low-confidence
   engineering signals do not open the engineering route) as the intended readings.
3. Confirm D6 (timeout is an adapter responsibility, modelled here as a typed outcome) is acceptable, or
   whether this contract should own a deadline parameter.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
