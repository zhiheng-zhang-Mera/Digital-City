# GAI-001 Development Report — Core Contracts + Action Vocabulary

```text
MISSION                  = GAI-001 (General AI Gateway programme, task 1 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = e285ffe (Digital-City main, "claim(GAI-001): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T12:38:59Z
CONTROL_REVISION_AT_CLAIM= e2c95e1 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-001-core-contracts-action-vocabulary
IMPLEMENTATION_HEAD_SHA  = 57915d05906f17d244bc48bbe07dc37ea5e0a89e
BRANCH_CI                = 36716761318 — gateway-web success, android success
LOCAL_CHECK_SUMMARY      = 124/124 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

| File | Purpose |
|---|---|
| `contracts/general-ai-gateway-v1/contracts.mjs` | Route/status/channel vocabularies, typed errors, raw-secret scan, strict validators for every canonical envelope, status-transition and idempotency rules |
| `contracts/general-ai-gateway-v1/routing.mjs` | Executable P0–P6 routing policy, advisory-only JEV triage, escalation/device-switch consent rules, programme ports + deterministic doubles, historical-product dependency scanner |
| `contracts/general-ai-gateway-v1/index.mjs` | Public surface + published guarantees |
| `contracts/general-ai-gateway-v1/tests/conformance.test.mjs` | 23-test conformance suite |
| `services/dev-gateway/actions.mjs` | `GENERAL_AI` reserved in the user-level route vocabulary with typed references and an honest UNAVAILABLE |
| root `tests/general-ai-gateway.test.mjs` | Registers the suite with `pnpm test` |

Acceptance mapping:

| Required acceptance | Implementation |
|---|---|
| old Action routes remain backward-compatible | `LEGACY_ACTION_ROUTES` untouched; a test asserts the gateway vocabulary equals the contract vocabulary exactly, and that `ROOM`/`CAPABILITY`/`CITY_TASK` still validate |
| `GENERAL_AI` has stable typed backend/provenance references | `backendRef.kind = 'GENERAL_AI'` with typed `providerRef`/`modelRef`/`accountRef`/`conversationId`; `ResultEnvelope.provenance` requires `source` + `channel` |
| malformed/unknown route/state/version rejected rather than guessed | `validateActionRoute`, `assertContractVersion`, `nextActionStatus`, strict envelope validators (unknown keys refused) |
| idempotency key reuse for a different request is rejected | `fingerprintGeneralAiRequest` + `checkIdempotentReuse` (order-independent fingerprint) |
| partial output cannot mark an Action terminal | `nextActionStatus(..., {source:'PARTIAL'})` → `PARTIAL_RESULT_CANNOT_COMPLETE`; terminal status is final |
| no schema contains raw credential/cookie/token bytes | `findRawSecretFields` over every envelope; handle-only references (`credential_ref`) allowed |
| repository/runtime scan finds no Boss dependency | `scanForForbiddenProductDependency` + a test that walks the real tree and falsifies the scanner |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.**
Options: (a) wait for an eligible Correction; (b) another BA/RF/EM task; (c) the untouched General AI Gateway programme.
Choice: GAI-001. Reason: the fresh scan found no owned repair and no eligible opposite-host Correction (RF-001's correction was completed by Mech, BA-002/EM-001 corrections were owned by Alien), so the unclaimed-Development tier applied. General AI Gateway was the only programme with **zero** claims from either host, so claiming it exposes a programme seam early, which the cross-programme contract explicitly prefers, and GAI-001 is that programme's foundation.

**D2 — Where the deliverable lives.**
Options: (a) `contracts/general-ai-gateway-v1/`; (b) the reserved City building `city/00-foundation/06-general-ai-gateway/`; (c) both.
Choice: (a), plus the reserved route in the existing gateway. Reason: the programme README reserves the City building but states it is "promoted only when implementation is ready", and GAI-001 is a contract/vocabulary task with no channel implementation. RF-001 chose the City tree because it *is* a foundation module with runtime semantics; a contract layer with no runtime belongs with the other versioned contracts. Recorded as an integration seam (§5) so the merge workbook or the first channel task can relocate deliberately rather than by drift.

**D3 — Touching the live gateway vocabulary.**
Options: (a) contract-only, leaving `ACTION_ROUTES` unchanged; (b) add `GENERAL_AI` to `ACTION_ROUTES` and give it honest behaviour; (c) add it and let it fall through to the City-task branch.
Choice: (b). Reason: (a) leaves the workbook's "reserve `GENERAL_AI` as the user-level route" unmet — the user-level vocabulary *is* `ACTION_ROUTES`; (c) would represent a general-AI request as a City task, which is a false statement about what happened. The route therefore carries typed null references and answers `UNAVAILABLE` with `GENERAL_AI_NOT_ATTACHED`, and `labelFor` gained a branch so the UI cannot label it as a City task. No existing route behaviour changed, and a test pins the gateway vocabulary to the contract vocabulary.

**D4 — Duplicating a validation helper that EM-001 also has.**
Options: (a) import EM-001's helper; (b) write an independent one.
Choice: (b). Reason: every component branch must be independently integrable from the frozen baseline, and EM-001 is an unmerged sibling in a *different* programme; importing it would create a cross-programme build dependency that cannot exist at merge time. The shapes are also different in substance: GAI's idempotency check is a request-fingerprint comparison, not a scoped ledger. Recorded so the merge workbook can unify them as a deliberate act.

**D5 — How to make "no Boss dependency" a repeatable check.**
Problem: a one-off grep is not evidence a later session or the merge workbook can rerun.
Choice: a runtime scanner plus a test that walks the real repository, with the scanner *falsified* in the same test. Three iterations were needed, and each is recorded because it changes what the rule means:
 1. **word scan** — flagged the detector's own vocabulary and ordinary comments. Rejected: forbidding the word makes the rule unauditable and would flag provenance prose the workbook explicitly allows.
 2. **linkage scan** — rules became dependency-shaped (module import/require, dependency block, host reference, process/endpoint invocation, submodule/symlink/workspace). This still flagged two real `DONOR.json` provenance records that merely *describe* a past donor in prose fields — a false positive that teaches nothing.
 3. **JSON-aware linkage scan** (shipped) — JSON files are parsed and only dependency blocks and `workspaces` count as edges; source files use the linkage rules; markdown is not scanned. The scanner therefore needs **no exclusion list**, which is what keeps it honest. The product token is composed at runtime in both the rule table and the fixtures so the detector does not flag itself, and the test proves the scanner still catches six real linkage shapes (import, two dependency-block forms, workspace path, process spawn, host reference, submodule).
Result: the real tree reports zero findings and the falsification set reports exactly the intended rule for each positive.

**D6 — Routing policy as code rather than documentation.**
Options: (a) describe P0–P6 in the report; (b) encode it as a decision function with typed outcomes.
Choice: (b). Reason: the programme's hardest product rules are decision rules that GAI-002..GAI-009 will each have to obey — Web is the default, Web failure never silently escalates to API, explicit consent is required for API, budget approval is not consent, another device is proposed rather than chosen, the interaction device does not follow execution. Encoding them once, with tests, is the only way they survive eight later tasks. The report keeps the prose *and* the code.

**D7 — A distinct `AWAIT_BUDGET_DECISION` outcome.**
Problem: the first draft reused `AWAIT_USER_CONSENT` with reason `API_CONSENT_GIVEN`, which is self-contradictory.
Choice: a separate outcome. Reason: "waiting for the user to agree" and "waiting for budget policy after the user agreed" are different states with different attention kinds (`USER_CONFIRMATION` vs `BUDGET_APPROVAL`); collapsing them would let a budget wait be rendered to the user as a consent question.

**D8 — Where `UNAVAILABLE` sits.**
Options: terminal, in-flight, or a third class.
Choice: a third class: terminal for *this* attempt, retryable by a new action with a new key — deliberately not in `ACTION_TERMINAL_STATUSES` (so it cannot be confused with success/failure) and not in `ACTION_IN_FLIGHT_STATUSES` (so a partial result can never claim it). Recorded because the three-way split is subtle and a later channel could otherwise get it wrong.

**D9 — JEV wrapper.**
Choice: `asAdvisoryAssessment` stamps every assessment with `advisory: true`, `grantedAuthority: false`, `executedAnything: false`, and `assessWithJevTriage` converts a missing port, a `null` answer or a thrown error into a degraded result instead of an exception. Reason: invariant 2/3 (JEV is a classifier only, and its failure must degrade to deterministic/manual routing rather than block the terminal). A confident HIGH-risk recommendation is tested to still produce a *proposal*, never an execution.

**D10 — PROCESS_DATA_POLICY evolution inbox.**
Choice: not used, consistent with BA-001 D11, EM-001 D13 and RF-001 D8; this report is the construction record.

## 3. Test summary

23 tests, all passing: route vocabulary reservation and legacy preservation; forbidden/unknown route refusal; gateway↔contract vocabulary equality; canonical request validation with typed references; unknown version/channel/state/malformed refusal; raw-secret refusal with handle allowance across five envelope kinds; provider/model/attention/usage/proposal envelope strictness; partial-cannot-complete and terminal-is-final; partial vs result status classes; idempotent replay and key-reuse refusal (including key-order independence); deterministic local short-circuit; Web default and JEV degradation; Web-failure-never-silent-API and consent requirement; budget-after-consent and budget≠consent; device proposal + interaction device does not move; escalation receipt requires a user reference; attention projection for consent/budget/refusal; advisory JEV with failure degradation; port conformance and the deterministic remote double; the repository-wide historical-dependency scan with falsification; published guarantees and error vocabulary.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 124 tests, 124 pass, 0 fail (101 baseline + 23 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail (7 skipped as in baseline) |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36716761318 on 57915d05906f17d244bc48bbe07dc37ea5e0a89e | gateway-web success, android success |

## 5. Integration seams handed to sibling tasks

- GAI-002..GAI-004 (channels/providers/accounts/conversations): depend on `GeneralAiGatewayPort`; resolve `backendRef.providerRef/modelRef/accountRef/conversationId` and replace the gateway's `GENERAL_AI_NOT_ATTACHED` UNAVAILABLE with a real channel. Nothing else in `actions.mjs` needs to change.
- GAI-005 (triage/routing): `decideRoute` is the policy to call; `JevTriagePort` is the port to implement. A triage implementation must return through `asAdvisoryAssessment` so its output cannot become authority.
- GAI-006 (stream/cancel): `validatePartialResult` + `nextActionStatus` are the only legal status paths; cancellation is a terminal transition.
- GAI-007 (device-aware execution): `RemoteExecutionPort`, `DeviceSwitchProposal`, `applyDeviceSwitch`. Remote Fabric owns transport/trust; the double here is for bounded tests only.
- GAI-008 (health/resilience): `PROVIDER_HEALTH`, `AUTH_STATUSES`, `ACTION_RETRYABLE_STATUS` (UNAVAILABLE is retryable by a new action key).
- Programme merge workbook: (a) decide the final home of the GAI contract (D2); (b) note that the gateway route is reserved but not attached, so the merged main shows a typed UNAVAILABLE for `GENERAL_AI` until a channel lands; (c) unify the contract-validation helper with EM-001's if desired (D4).

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to bypass the routing policy (a path where Web failure reaches API without consent, a budget decision used as consent, a JEV assessment becoming authority, a device switch applied without a confirmation reference) and to smuggle raw credential bytes through an envelope field not covered by the scan.
2. Confirm D2 (contract layer under `contracts/` while the City building stays reserved) or direct the City promotion.
3. Confirm whether the reserved `GENERAL_AI` route should be visible to Web/Android clients before a channel exists (it currently answers a typed UNAVAILABLE, which is honest but user-visible).
4. Confirm whether an evolution/process-data record is wanted for GAI component work (D10).

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
