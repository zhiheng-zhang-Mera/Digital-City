# EM-012 Development Report — Connector SDK + Claude Code / WorkBuddy Extension Paths

```text
MISSION                  = EM-012 (Engineering Manager programme, task 12 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = c89a1e5 (Digital-City main, "claim(EM-012): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:36:20Z
CONTROL_REVISION_AT_CLAIM= b1d3840 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-012-connector-sdk-claude-workbuddy
IMPLEMENTATION_HEAD_SHA  = 364c5160952039d31074af3bfae843c1d0f4be24 (pushed)
BRANCH_CI                = 36751919772 — BLOCKED: the jobs never started
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = **false** — deliberately NOT claimed (see §0)
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 0. Blocker (unchanged from BA-009, now the second consecutive round)

GitHub Actions again refused to start both jobs — this time for run `36751919772`:

```text
X The job was not started because recent account payments have failed or your spending limit needs to be
  increased. Please check the 'Billing & plans' section in your settings
android: .github#1 … gateway-web: .github#1
```

Evidence this is the same **account-level external condition** and not this branch: jobs ran 3–4 s with zero
steps, exactly as in BA-009's `36750981300` (retried three times, identical); Alien's GAI-004 pushes
`36750532324`/`36750532665` failed the same way; and my last pre-block runs (EM-011 `36750007584`,
RF-010 `36749030367`) succeeded normally. The workbook rule requires a green CI run before
`development_complete`, so this task is *implemented + locally verified + CI unverifiable*, the claim is
retained, and the exact missing proof is "GitHub Actions must be able to start a job".

## 1. Deliverable

`contracts/engineering-connector-sdk-v1/` — `connector-sdk.mjs` (authoring helper, conformance harness,
isolating adapter wrapper, optional-adapter states, acceptance honesty, extension guide, adapter registry),
`index.mjs`, 7-test suite, root `tests/engineering-connector-sdk.test.mjs`.

Acceptance mapping (all verified locally):

| Required acceptance | Test |
|---|---|
| A synthetic third connector passes the SDK conformance harness without core edits | `a synthetic third connector passes the conformance harness without core edits` (`conformant: true`, `core_edits_required: 0`, 11 checks; a tampered connector fails with a typed diagnosis) |
| Adapter exceptions/timeouts are isolated | `adapter exceptions, timeouts and malformed results are isolated to the faulting adapter` (`ADAPTER_FAULT`/`ADAPTER_TIMEOUT`/`MALFORMED_RESULT`, `unrelated_connectors_affected: []`, healthy adapter unaffected and still selectable) |
| Optional provider absence is a typed disabled/unavailable state | `optional provider absence is a typed state that blocks nothing and fabricates nothing` (`UNAVAILABLE`/`DISABLED`, `fabricated_installation: false`, `startup_blocked: false`) |
| Any real Claude Code/WorkBuddy acceptance that is claimed includes real host evidence | `Claude Code and WorkBuddy adapters use the SDK path, and acceptance needs real host evidence` (genuine evidence ⇒ accepted with `HOST_RUNTIME`; partial/non-real ⇒ `REAL_PROVIDER_ACCEPTANCE_PENDING`) |
| Adding an adapter does not alter EngineeringManagerPort or the scheduling core | `adding an adapter alters neither the EngineeringManagerPort nor the scheduling core` (`core_edited: false`, `registry_logic_changed: false`, port version and Foreman node count unchanged) |
| SDK docs identify minimum connector methods, capability/auth semantics and test expectations | `the SDK validates a definition and documents what an author must supply` (`MINIMUM_CONNECTOR_METHODS` = 11, `CAPABILITY_SEMANTICS`, `AUTH_SEMANTICS`, 8 `TEST_EXPECTATIONS`, 5 guide steps) |
| Helpers/schema/validation/test harness around ConnectorPort | Tests 1–3 (defineConnector validation, harness, isolating wrapper) |
| Claude Code and WorkBuddy adapter modules when their interfaces are available | Test 5 (both built through the SDK path and conformant; absence is typed) |
| Optional adapter absence cannot block startup or unrelated connectors | Test 4 (`startup_blocked: false`, `unrelated_connectors_blocked: []`) |
| Documented path for a future provider without core changes | Test 6 (`core_files_to_edit: 0`, `registry_entries_required: 1`) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004…BA-008, EM-004…EM-011, GAI-003…008, RF-004…010 Corrections; GAI-004 and RF-006 in progress). Tie-break
after BA-009 excluded Butler, so EM-012 was chosen: it generalizes the connector contract EM-011 just proved,
and EM-013 (integration) consumes the SDK shape. **The contract's no-idle rule is why a second task was
claimed at all while BA-009's CI is blocked**: "hosted CI … waits never idle the host; retain the claim and
continue another eligible global stage in a separate worktree".

**D2 — What the SDK validates.** CHOICE: `defineConnector` requires all eleven port methods and, when any is
missing, fails with `MISSING_METHOD` listing exactly which ones, alongside the full minimum list. Reason: an
authoring SDK's job is to make the error actionable; a boolean "invalid" would push authors into reading core
code, which is the thing the SDK exists to prevent.

**D3 — How conformance is proven.** CHOICE: `runConformanceHarness` drives the documented expectations
(honest probe, canonical auth state, canonical capabilities, version honesty, derived readiness, health with
attention, canonical-job attach, typed unsupported submit and control, result distinguishing running/terminal/
unknown, provenance-carrying events) and reports each check with `core_edits_required: 0`. Reason: the
workbook asks for a harness "for probe/auth/capability/lifecycle/job/control/result/health and fault
isolation", and a passing synthetic connector is the acceptance evidence that a new adapter needs no core
change. The suite deliberately also runs a *tampered* connector through it and asserts a typed failure, so the
harness cannot be a rubber stamp.

**D4 — Fault isolation.** CHOICE: each adapter is wrapped; an exception, timeout or malformed return records a
`fault_ref` with its kind and marks that adapter `FAULTED`, while `unrelated_connectors_affected` stays empty,
selection skips it, and `startupReport()` never blocks. An auth failure is deliberately *not* treated as an
isolation event — it is a business state (matching EM-008/GAI-008 semantics), so it does not disable the
adapter. Reason: "adapter exceptions/timeouts are isolated" and "optional adapter absence cannot block startup
or unrelated connectors"; conflating an expired sign-in with a crash would disable a connector that only needs
a human.

**D5 — Port results.** CHOICE: `invoke` returns a frozen clone of the handler's result (with a pass-through
fallback for a non-cloneable value). Reason: a defect found by the suite — the returned capability list was
the handler's own array, so a caller could mutate adapter state. Port results crossing a boundary are
snapshots, consistent with every other module in this pool.

**D6 — Optional products.** CHOICE: `available: false` produces a typed `UNAVAILABLE` (and `DISABLED` after
`disable`), every port call refuses with `OPTIONAL_UNAVAILABLE` carrying `fabricated_installation: false` and
the pending marker, and enabling is an explicit act. Reason: the workbook forbids fabricating installation or
behaviour when an optional product is absent, and requires "REAL_PROVIDER_ACCEPTANCE_PENDING" to be recorded.

**D7 — Acceptance honesty.** CHOICE: `acceptance()` claims nothing without genuine host evidence
(`real: true` plus submit and terminal references); partial or non-real evidence stays pending, and the
registry summary reports `fabricated_acceptance_claimed: 0`. Reason: the workbook's rule for real
Claude Code/WorkBuddy acceptance; the same discipline as EM-011, and no real product was exercised here.

**D8 — No core edits.** CHOICE: the guide, the registry and the harness all publish
`core_files_to_edit: 0`, `foreman_core_edited: false`, `engineering_manager_port_version_unchanged: true`,
`provider_specific_policy_in_core: false`. Reason: "adding an adapter does not alter EngineeringManagerPort or
scheduling core" and "provider-specific policy in core" being out of scope; publishing the negatives makes the
claim checkable rather than implied by the diff.

**D9 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/engineering-connector-sdk-v1/connector-sdk.mjs` | new — authoring helper, harness, isolating adapter, optional states, acceptance, guide, registry |
| `contracts/engineering-connector-sdk-v1/index.mjs` | new — public surface |
| `contracts/engineering-connector-sdk-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/engineering-connector-sdk.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

7 tests. Two failures on first run: **one genuine gap** and one test error.

1. **Gap:** port results were returned raw, so `capabilities().capabilities.push(...)` mutated the handler's own
   array — an adapter's state was writable by its caller. Fixed by returning a frozen clone from `invoke`
   (D5), with a pass-through fallback for non-cloneable values.
2. **Test error:** sorting a frozen array in place (`startup.unavailable.sort()`), the same class of mistake
   recorded in earlier rounds; now spreads before sorting.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36751919772 on 364c5160952039d31074af3bfae843c1d0f4be24 | **BLOCKED** — jobs not started (account billing) |

## 5b. Why `development_complete` is false

Same rule as BA-009: the workbook requires a green CI run before completion, and this run never executed a
step. Marking complete would rewrite an external failure as success, which the workbook and the
cross-programme contract both forbid. The implementation is pushed and locally verified; the remaining proof
is a CI run that starts.

## 6. Integration seams handed to sibling tasks

- **EM-011 (reference connectors):** those two connectors are the first consumers of this SDK; at merge they
  should be expressed as SDK definitions so the harness covers them too (their behaviour is unchanged).
- **EM-002 / EM-004 / EM-006:** the SDK wraps the connector/process port and stays capability-based; the
  registry here should not become a second instance registry.
- **EM-010 (foreman scheduler):** scheduling is untouched by adding an adapter, which is the property the
  guide states and the test asserts; the scheduler should select adapters through this registry.
- **EM-013 (integration):** the SDK is the extension point the integration task documents for future
  providers, and its acceptance summary is the honest status of optional products.
- **Owner/ops actions (blocking):** GitHub Actions billing must be restored before any component task
  (including this one and BA-009) can reach a verified `development_complete`.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: an adapter whose `submit` returns a value containing a function (the clone
   fallback returns it raw — confirm that is acceptable); a handler that mutates its own input object (the
   wrapper passes the arguments through without cloning); `clearFaults()` on an adapter whose product is
   actually unavailable (it currently re-enables without re-probing — a likely gap); two adapters declaring the
   same capability where one is optional and unavailable (selection should prefer the usable one — covered);
   and a definition declaring `optional: true` but created with `available: true`.
2. Confirm D4 (an auth failure is not an isolation event) and D7 (acceptance only from genuine host evidence).
3. Correction cannot be claimed against this branch until CI can run: `development_complete` is false.

```text
DEVELOPMENT_COMPLETE = false (CI blocked by the account-billing condition; not a code failure)
CORRECTION_ELIGIBLE  = false until CI is green
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
