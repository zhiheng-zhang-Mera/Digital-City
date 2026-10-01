# EM-011 Development Report — DeepSeek Harness + Codex Reference Connectors

```text
MISSION                  = EM-011 (Engineering Manager programme, task 11 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 3a00269 (Digital-City main, "claim(EM-011): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:17:05Z
CONTROL_REVISION_AT_CLAIM= 1b8a274 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-011-deepseek-codex-reference-connectors
IMPLEMENTATION_HEAD_SHA  = cb3cad618e0dc8a147f2afcb5c7c81b4df998f62
BRANCH_CI                = 36750007584 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/engineering-reference-connectors-v1/` — `reference-connectors.mjs` (generic ConnectorPort, two
reference descriptors, host probing/auth/readiness/capabilities, canonical job vs backend provenance,
normalized events, typed unsupported states, health/attention, acceptance honesty, capability-based registry),
`index.mjs`, 7-test suite, root `tests/engineering-reference-connectors.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Both connectors can be registered without Foreman-core provider branches | `both reference connectors register and resolve generically, with no provider branches in the core` (`provider_name_branching: false`, `core_changed_for_third_connector: false`, a synthetic third connector resolved by the same path) |
| Installed/uninstalled/auth-required states are probed honestly | `installed, uninstalled and auth-required states are probed honestly` (`NOT_INSTALLED` with `auto_install_attempted: false`, parsed version, `NEEDS_USER`/`EXPIRED` with `user_action_required` and `auto_retry: false`, unrecognized auth ⇒ `UNKNOWN` readiness) |
| Any real product acceptance claimed at component stage includes genuine submit→progress→terminal evidence; otherwise the exact proof is deferred | `component-stage acceptance is only claimed with genuine real-host evidence` (deferred marker without evidence; partial and non-real evidence refused; genuine evidence accepted with `evidence_source: 'HOST_RUNTIME'`) |
| DeepSeek Harness connector through stable process/session boundaries; DS-Hns is donor evidence, not a runtime | `descriptor().donor_is_runtime_requirement === false`, injected process runtime; no donor import |
| Codex connector through the installed client/CLI boundary | Same port surface for `CODEX` (CLI session kind, its own capability and control set) |
| Map probe/version/auth/readiness/capabilities/start-or-attach/submit/events/control/result/health into ConnectorPort | Test 1 asserts every one of the eleven port methods exists on both connectors |
| Preserve backend run/session IDs as provenance while keeping one canonical Engineering job ID | `one canonical job id is preserved while backend ids stay provenance` (single session per canonical job; `is_provenance_only: true`) |
| Translate unsupported provider operations to typed UNSUPPORTED_CAPABILITY/ATTENTION/REFUSED states | `unsupported operations become typed states instead of silence or success` |
| Keep provider-specific parsing/automation below the adapter boundary | `CONNECTOR_PORT.product_parsing_lives_below_adapter: true`; version/event parsing is injected per kind and never in the core |
| An unknown outcome is never reported as success | `an unknown outcome is never reported as success, and retries do not duplicate` (`UNKNOWN` + `outcome_unknown_is_not_success`, no invented result reference) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004, BA-005, BA-006, BA-008, EM-004, EM-005, EM-008, EM-009, EM-010, GAI-003…008, RF-004…010 Corrections;
GAI-004 in progress). Tie-break after RF-010 excluded Remote Fabric, so EM-011 was chosen: it is the first
task that proves the generic connector contract against real execution paths, and the programme's remaining
tasks (EM-012 SDK, EM-013 integration) both build on it.

**D2 — Where does product specificity live?** CHOICE: descriptor data (kind, capabilities, supported controls,
version regex, session kind) plus injected `runtime`/parsing hooks; the core and the registry only read
descriptors and normalized shapes. Reason: the workbook requires provider-specific parsing/automation *below*
the adapter boundary and requires both connectors to register "without Foreman-core provider branches". The
suite proves genericity by registering a synthetic third connector and resolving it through the same path —
`core_changed_for_third_connector: false`.

**D3 — How is the host probed?** CHOICE: `probe()` reports `INSTALLED`/`NOT_INSTALLED`/`UNKNOWN` from the host
adapter, the version is parsed by the product's own regex and becomes `UNKNOWN` if unrecognized, and an
uninstalled product is never auto-installed. Reason: "installed/uninstalled/auth-required states are probed
honestly" is an acceptance bullet; inventing a version or silently installing would both be dishonest, and the
test asserts `auto_install_attempted: false` and `version_known: false` explicitly.

**D4 — Auth and readiness.** CHOICE: reuse the pool's canonical auth vocabulary
(`READY/MISSING/EXPIRED/NEEDS_USER/UNAVAILABLE/UNKNOWN`), with `user_action_required: true` and
`auto_retry: false` for the human-blocked states, and readiness derived from install **and** auth — so an
unrecognized auth state yields `UNKNOWN` readiness rather than ready. Reason: consistency with EM-008/GAI-008
means two programmes cannot disagree about a sign-in, and the "never auto-retry a human state" rule is the same
one established in GAI-008. Starting a session while auth is not ready refuses with
`USER_ACTION_REQUIRED`/`AUTH_REQUIRED` and never retries.

**D5 — Canonical job vs backend run/session.** CHOICE: one canonical Engineering job id per job; the backend
run and session identifiers are stored as `provenance` with `is_provenance_only: true`, and re-attaching to a
canonical job returns the existing session rather than minting a second one. Reason: the workbook requires
backend IDs preserved as provenance "while keeping one canonical Engineering job ID"; minting a second session
per attach would break the single-job invariant the Foreman relies on. The test asserts one session for two
attach calls.

**D6 — Unsupported operations.** CHOICE: a capability outside the descriptor's set refuses with
`UNSUPPORTED_CAPABILITY` naming the supported set and stating `silently_ignored: false`; a control op outside
the descriptor's set refuses with `UNSUPPORTED_OPERATION` and `refused: true`. Reason: the workbook asks for
typed `UNSUPPORTED_CAPABILITY`/`ATTENTION`/`REFUSED` states rather than provider-specific error text, and the
DeepSeek/Codex control sets genuinely differ (DeepSeek supports only cancel; Codex also pauses/resumes), which
is exactly the kind of difference the port must express as data.

**D7 — Unknown outcomes.** CHOICE: `result()` maps an absent or unrecognized backend state to `UNKNOWN` with
`outcome_unknown_is_not_success: true`, `terminal: false` and `result_ref: null`; only a recognized terminal
state is terminal. Reason: an unknown outcome reported as success is the most dangerous false-success shape in
a connector, and the same rule already exists in RF-009 and GAI-008; the connector must not be the place where
it breaks. A repeated submit with the same action key is absorbed (a retry is not a second submission).

**D8 — Acceptance honesty.** CHOICE: `acceptanceReport()` claims component-stage acceptance only when the host
runtime provides genuine evidence for submit → progress → terminal; otherwise it returns the exact marker
`REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION`, and partial or explicitly non-real evidence is
refused. Reason: the workbook states this rule almost verbatim and forbids emulating a smoke and labelling it
provider acceptance; the suite covers the deferred, partial, non-real and genuine paths, and the registry
summary reports `emulated_acceptance_claimed: 0`.

**D9 — Not executed in this environment.** The real products are not exercised here: this branch proves the
contract against injected host runtimes, and its acceptance report says so. The real two-product smoke belongs
to programme integration, which is where the deferred marker points. This is recorded rather than glossed, and
no real-product claim is made anywhere in this report.

**D10 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/engineering-reference-connectors-v1/reference-connectors.mjs` | new — port, descriptors, probing, sessions, submits, events, control, results, health, acceptance, registry |
| `contracts/engineering-reference-connectors-v1/index.mjs` | new — public surface |
| `contracts/engineering-reference-connectors-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/engineering-reference-connectors.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Three failures on first run — all test-side; **no module defect was found in this task**, which is
stated plainly rather than dressed up as a fix:

1. **Test error:** two defects of the same kind as previous rounds — sorting a frozen array in place
   (`registry.connectorKinds().sort()`), and asserting `UNKNOWN` for a runtime double whose default result was
   `RUNNING` (the module correctly relayed what the double reported; the double now returns an empty result,
   which is what "no outcome yet" actually looks like).
2. **Test error:** the registry acceptance summary registered two connectors of the *same* kind, so the second
   replaced the first and the "deferred" list came back empty. The test now registers a CODEX connector as the
   deferred case and asserts the exact list.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36750007584 on cb3cad618e0dc8a147f2afcb5c7c81b4df998f62 | success |

## 6. Integration seams handed to sibling tasks

- **EM-002 / EM-004 / EM-006 (connector adapter/process runtime, capability registry, placement):** these
  connectors implement that port; capability and control differences are descriptor data, and the registry
  here should be reconciled with EM-004's instance registry (one registry, not two) at merge.
- **EM-008 (credentials/sessions):** auth state should be sourced from the credential layer rather than probed
  ad hoc; the vocabulary is already identical, so the merge is a wiring change.
- **EM-010 (foreman scheduler):** `startOrAttach`/`submit` are what a scheduler node calls; the canonical job
  id is the join key, and the scheduler's acceptance evidence requirement is satisfied by this module's
  terminal result plus the node's own acceptance reference.
- **EM-012 (connector SDK, Claude Code / WorkBuddy paths):** the SDK should generalize this contract; the
  synthetic-connector test is the shape proof that a new product needs no core change.
- **EM-013 (shared task core integration):** the canonical job id must map to the Shared Task Core's job
  reference, with backend ids remaining provenance.
- **GAI-008 (health/resilience):** the health/attention shapes are deliberately compatible; a connector that
  needs a sign-in should surface through the same human-blocked path rather than a second vocabulary.
- **Programme integration (deferred, explicit):** real DeepSeek Harness and Codex smoke tests are **not**
  performed here; the acceptance report carries
  `REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION` and must be discharged by the EM merge
  workbook against the real installed products.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a runtime whose `probe` reports `installed: true` but an empty version
   (currently `version: 'UNKNOWN'`, `version_known: false`, readiness `READY` if auth is ready — confirm that
   is acceptable); an `attach` after the session was cancelled (the session is `CLOSED`, so a new one is
   started — confirm the canonical-job invariant still holds); a `submit` whose operation is supported but
   whose backend throws; an event list with duplicate sequences; and a runtime that returns evidence with
   `real: true` but terminal state `FAILED` (currently accepted as genuine evidence — confirm whether a failed
   terminal should count as acceptance).
2. Confirm D3 (no auto-install) and D8 (partial or non-real evidence can never be acceptance).
3. The `FAILED` terminal-evidence case in item 1 is the sharpest ambiguity and should be decided explicitly:
   this implementation treats "genuine evidence exists" as acceptance, not "the run succeeded".

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
