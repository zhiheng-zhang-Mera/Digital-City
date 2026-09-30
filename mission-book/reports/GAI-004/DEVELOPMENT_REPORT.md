# GAI-004 Development Report — API Channel + Explicit Consent + Budget Policy

```text
MISSION                  = GAI-004 (General AI Gateway programme, task 4 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 1f21790 (Digital-City main, "claim(GAI-004): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:11:40Z
CONTROL_REVISION_AT_CLAIM= 0bc450e (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-004-api-channel-consent-budget
IMPLEMENTATION_HEAD_SHA  = fbb749272ad65c9a8de6cc303371b52fda22f7ef
BRANCH_CI                = 36735078546 — success
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/general-ai-api-channel-v1/` — `api-channel.mjs` (protocol adapters, ApiSwitchProposal, consent
records, budget policy, admission, execution, usage accounting, redaction), `index.mjs`, 6-test suite, root
`tests/general-ai-api-channel.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| No API network call occurs before consent and budget admission | `no API network call happens before consent and budget admission` (adapter call counter is 0 for every refusal; the adapter double records each call) |
| Deny consent ⇒ no API call | same test (`REFUSED_NO_CONSENT` / `CONSENT_DENIED`, `adapter_called: false`) |
| Approve consent + deny budget ⇒ no API call | same test (`REFUSED_BUDGET` with `OVER_PER_ACTION_LIMIT`, `adapter_called: false`) |
| Approve both ⇒ API run may proceed | same test (`ADMITTED`, adapter reached once) |
| Explicit `use API` is recorded as a user-directed choice | `a Web failure proposes API but never grants it, and budget does not stand in for consent` (`user_directed: true`, `consent_kind: USER_COMMAND`, and equally for `USER_SETTING`) |
| Rate limit/auth/provider faults remain typed | `rate limit, auth and provider faults stay typed and never look like success` |
| Usage absent from the provider response remains unknown, not zero | `usage the provider did not report stays unknown, never zero` |
| Secret values never appear in logs, Action provenance or reports | `streaming is supported only where the adapter says so, and secrets never reach provenance` |
| ApiSwitchProposal before Web→API escalation; `WEB failure != API permission` | `a Web failure proposes API but never grants it…` (`grants_permission: false`, `web_failure_implies_permission: false`, proposal-only admission refused) |
| `budget available != user consent`; `user consent → budget check → API admission` | same test (`budget_available_implies_consent: false`, `user_consent_implied: false`, budget is `null` when consent is absent) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien has
BA-004, EM-004, BA-006, EM-008 and RF-004's Corrections queued/in progress). Tie-break after EM-008
(Engineering) pointed away from EM, so GAI-004 was chosen: it is the consent/budget gate that GAI-005
(triage/routing), GAI-006 (conversation/streaming) and GAI-007 (device-aware remote execution) must pass
through, and it is a different programme from the previous claim.

**D2 — What actually grants API permission?** OPTIONS: (a) a Web channel failure; (b) available budget;
(c) an explicit user consent record. CHOICE: (c) only — `admit` returns `REFUSED_NO_CONSENT` whenever no
consent record exists, regardless of Web state or budget, and the budget is not even evaluated in that case
(`budget: null`). Reason: the workbook's hard policy states both equalities as prohibitions; encoding them
as separate refusal codes means a caller cannot launder a Web failure or a healthy budget into permission.
The proposal record publishes `grants_permission: false` so the negative is visible in the data, not only
in the code path.

**D3 — Can a proposal carry a consent or an admission?** CHOICE: no — proposal input is strictly validated
and unknown keys are refused (`INVALID_PROPOSAL`). Reason: found by test — a first version silently ignored
an extra `consent` key on the proposal, so a caller could reasonably believe the proposal carried consent.
Refusing unknown keys makes "a proposal grants nothing" a property of the shape rather than a convention.

**D4 — Is an explicit user command an escalation?** CHOICE: no. A direct `use API` command/setting is
recorded with `escalation: false` and `user_directed: true`; only a proposal-backed consent records
`escalation: true` plus the `proposal_ref`. Reason: the workbook says a Web failure is not permission *and*
that an explicit command is itself the consent record; conflating the two would make the audit trail claim
a failure that never happened.

**D5 — Where is the budget checked, and what is the order?** CHOICE: `consent → budget → adapter`, with
per-action and aggregate limits, and the aggregate refusal distinguished from the consent refusal
(`REFUSED_BUDGET` vs `REFUSED_NO_CONSENT`). Reason: the workbook fixes that order; distinct codes keep
"you must ask the user" and "you have spent too much" from being the same message, which matters because
only the first needs a human decision.

**D6 — Unknown usage.** CHOICE: absent provider usage yields `known: false` with `input_tokens`,
`output_tokens`, `total_tokens` and `cost` all `null` (never 0), unknown aggregate spend makes the budget
verdict `AGGREGATE_USAGE_UNKNOWN` which under the default `on_unknown_usage: 'REFUSE'` becomes
`REFUSED_USAGE_UNKNOWN`, and `accumulateUsage` keeps unknown sticky. Reason: "usage absent … remains
unknown, not zero" is an acceptance bullet, and the dangerous direction is a free-looking call that
silently consumes an unmeasured budget. Treating it as zero would also silently disable the aggregate limit.

**D7 — Missing adapter or unsupported streaming.** CHOICE: a protocol with no adapter refuses
(`REFUSED_NO_ADAPTER`) and streaming on a non-streaming adapter refuses with the non-retryable
`STREAMING_UNSUPPORTED` fault, both *before* any adapter call. Reason: the workbook requires API adapter
contracts with typed errors; silently falling back to another protocol or downgrading a stream would be a
false success in exactly the area (channel identity) this task is about.

**D8 — Typed faults over thrown errors at the boundary.** CHOICE: an adapter exception becomes a result
`{ok: false, fault: {code, retryable, retry_after_ms}}`, with unknown codes mapped to `PROVIDER_FAULT`.
Reason: `ok: false` plus a code is checkable; an untyped throw propagating to a caller that only checks
truthiness is how a fault becomes a false success.

**D9 — Protocol identity vs provider identity.** CHOICE: adapters are keyed by protocol
(`OPENAI_COMPATIBLE`, `ANTHROPIC`, `GEMINI`) and `provider`/`model` are separate opaque fields carried into
the call and the provenance. Reason: the workbook requires the two not be coupled, and the test drives one
protocol with a `deepseek` provider to prove it.

**D10 — Secrets.** CHOICE: the adapter receives a `credential_ref` handle (never a value), and the module's
own records — provenance, log, stored response — are recursively redacted, including secret-shaped
substrings inside longer messages. Reason: the workbook requires handles/references and redaction. The
redaction boundary is deliberately our records, not the outgoing adapter call, so a caller's request is not
silently altered; the test asserts both sides of that line.

**D11 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/general-ai-api-channel-v1/api-channel.mjs` | new — consent, proposal, budget, admission, execution, usage, redaction |
| `contracts/general-ai-api-channel-v1/index.mjs` | new — public surface |
| `contracts/general-ai-api-channel-v1/tests/conformance.test.mjs` | new — 6 conformance tests |
| `tests/general-ai-api-channel.test.mjs` | new — root runner entry (101 → 107 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

6 tests, all passing. One genuine defect was found by the suite and fixed in the module: **a proposal
silently accepted a `consent` key** (D3). Proposal input is now strictly shape-checked and an unknown key is
`INVALID_PROPOSAL`, so "a proposal grants nothing and carries nothing" is structural. No expectation had to
be relaxed; the remaining expectation that exercised it (`proposal + consent still refused`) passes because
the module refuses the malformed proposal outright.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 107 tests, 107 pass, 0 fail (101 baseline + 6 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36735078546 on fbb749272ad65c9a8de6cc303371b52fda22f7ef | success |

## 6. Integration seams handed to sibling tasks

- **GAI-003 (web channel):** the Web channel reports a `web_channel_state`; feeding that into
  `proposeApiSwitch` is the only supported escalation entry, and the proposal cannot carry a session or a
  consent. A healthy Web channel never forbids an explicit user command.
- **GAI-005 (triage/routing):** routing must call `admit`/`execute` rather than an adapter directly;
  `REFUSED_NO_CONSENT` vs `REFUSED_BUDGET` are the two distinguishable outcomes a router must surface
  differently (ask the user vs report the limit).
- **GAI-006 (conversation/streaming/cancellation):** streaming is adapter-declared; a cancelled stream should
  return a typed fault rather than a partial success, and the redaction boundary defined here should be
  reused for conversation records.
- **GAI-007 (device-aware remote execution):** this contract is the choke point for the API side effect; a
  remote execution must carry its own consent record — a Web failure on another device is not one.
- **GAI-002 (registry):** adapters are chosen by protocol, credentials by `credential_ref`; the registry's
  provider/model/account descriptors supply `provider`/`model` here, and the two vocabularies (protocol vs
  provider) must stay separate at merge.
- **EM-008 / EM-004 (auth handles, registry auth status):** the API channel consumes a `credential_ref`
  handle and never a value; the secret scanning/redaction helpers here are a deliberate near-copy of EM-008's
  and should be reconciled into one shared utility at merge rather than two.
- **RF (Remote Fabric):** an API-only run is a device-local side effect; RF-006/EM-007 must not replicate the
  consent or the credential handle without an explicit user decision.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a consent record whose `scope` names a different action than
   `action_ref`; a `USER_SETTING` consent reused for an unrelated action; a proposal whose
   `web_channel_state` claims success; an adapter that returns `{usage: {input_tokens: 0}}` (a reported
   zero versus an absent value); and a budget policy with a negative or non-integer limit.
2. Confirm D4 (a direct user choice is not an escalation) and D6 (unknown aggregate spend refuses by
   default) as the intended policy readings.
3. Confirm the scope-binding gap is intentionally left to GAI-005/GAI-007 rather than solved here.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```
