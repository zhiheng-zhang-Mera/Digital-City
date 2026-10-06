# GAI-001 Correction Report — Core Contracts + Action Vocabulary

```text
MISSION              = GAI-001 (General AI Gateway programme)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-001-core-contracts-action-vocabulary.md
CLAIM_COMMIT         = 0124df5 (Digital-City main, claim of GAI-001 Correction by Alien)
CLAIMED_AT           = 2026-09-30T13:02:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 57915d05906f17d244bc48bbe07dc37ea5e0a89e
CORRECTION_BRANCH    = general-ai/GAI-001-core-contracts-action-vocabulary
CORRECTION_HEAD_SHA  = c01cd60dd9e0fa42c4126a921240d81e408a3e35
BRANCH_CI            = 36719793897 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 135 pass, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two independent reviews were run, deliberately with different eyes, reusing none of the
author's tests as the source of truth:

1. **This host's own probe**, aimed at the seam between `decideRoute` and the two appliers
   (`applyApiEscalation`, `applyDeviceSwitch`), and at the two checks whose sibling
   contracts in BA-001 / BA-002 / EM-001 had already failed in this session: the
   secret-shaped-name scan and the inherited-property-name lookup.
2. **A separate-context review agent**, given the guarantees Mech's report names as
   falsifiable (its §6 hand-off) and asked for reproducible findings only. It wrote six
   probe scripts plus a consolidated one under `.scratch/` and a review report, and modified
   no tracked file (verified: `git status --porcelain` empty).

Both found real defects, and the overlap was partial — which is the argument for running
two. Between them, **eight** confirmed defects; the Development suite caught none.

## 2. Independent review findings

### DEFECT 1 (high) — undeclared envelope keys inherited from `Object.prototype` were accepted

`checkShape` used `if (!(key in spec))` to reject unknown fields. `in` walks the prototype
chain, so every name on `Object.prototype` was "part of the canonical contract":

```text
{...validProviderDescriptor, toString: 'SMUGGLED'}          -> ok: true
{...validProviderDescriptor, valueOf: 'SMUGGLED'}           -> ok: true
{...validProviderDescriptor, hasOwnProperty: 'SMUGGLED'}    -> ok: true
{...validProviderDescriptor, constructor: 'SMUGGLED'}       -> ok: true
{...validProviderDescriptor, isPrototypeOf: 'SMUGGLED'}     -> ok: true
{...validProviderDescriptor, propertyIsEnumerable: ...}     -> ok: true
{...validProviderDescriptor, toLocaleString: ...}           -> ok: true
JSON.parse('{"__proto__":{"isAdmin":true},...}')            -> ok: true
```

**Why it matters:** the strict envelope check is this module's central claim — every
canonical document is exactly its declared fields and nothing else. It was false for
precisely the names an attacker would choose. This is the same defect this host repaired in
BA-001 (`!(key in port.default())`), reached here through a different function.

**Repair:** own-key lookup (`Object.hasOwn`), plus reserved prototype keys
(`__proto__` / `prototype` / `constructor`) refused at every depth of every envelope.

### DEFECT 2 (high) — the secret scan compared raw key spellings

`SECRET_KEY_PATTERN` requires a `[._-]` boundary after the secret word, so every compound
and plural spelling of the same concept was missed:

| field | before | after |
|---|---|---|
| `token`, `credential`, `apiKey`, `accessToken`, `bearer` | caught | caught |
| `credentials`, `tokens`, `secrets`, `passwords` | **missed** | caught |
| `apiKeys`, `api_keys`, `privateKeys`, `sessionKeys`, `refreshTokens` | **missed** | caught |
| `authToken`, `bearerToken`, `clientSecret`, `accountCredential`, `tokenValue`, `passwordHash` | **missed** | caught |
| `credential_ref`, `api_key_handle`, `access_token_id`, `secret_refs`, `token_id` | allowed | allowed (unchanged) |

**Repair:** names are normalised (camelCase split into words, every non-alphanumeric run
collapsed to one `_`, lowercased) with a trailing-plural tolerance, while the reference
suffixes stay exempt. The rule is value-aware in one direction only: a secret-shaped name
holding a **number** is a usage quantity, not credential bytes, so the legitimate
`input_tokens` / `output_tokens` of a usage record are not false positives — a distinction
that only became visible because the author's own suite failed when the plural rule was
first applied bluntly. This host's first attempt at this fix was itself wrong in that way
and is recorded rather than hidden.

### DEFECT 3 (high) — raw credential bytes passed through fields the name scan never inspects

The scan is name-only, so a real secret in a *declared* field was invisible. Confirmed:

```text
validateProviderDescriptor({..., credential_ref: 'sk-live-9f8e…'})   -> ok: true
validateProviderAccount({..., credential_ref: 'sk-live-9f8e…'})      -> ok: true
validateResultEnvelope({..., provenance.source: '<raw key>'})        -> ok: true
validateGeneralAiRequest({..., input_bundle.text: '<raw key>'})      -> ok: true
```

That contradicts the module's own comment — "`credential_ref` is a handle; `credential` is
bytes and is refused" — and the published guarantee
`raw_secrets_in_canonical_state: false`.

**Repair:** values are scanned for recognisably raw credential shapes (PEM private-key
blocks, JWTs, provider key prefixes) wherever they appear, in `seal()` and in
`validateGeneralAiRequest`. The fix is deliberately about *content that is recognisable as a
credential*, not a claim to distinguish every handle from every secret by shape: a short
opaque string is indistinguishable from a handle, and pretending otherwise would either
break legitimate references or give false assurance.

### DEFECT 4 (med-high) — a partial result could claim a terminal status

The rule compared the caller-supplied free-text `source`:

```text
nextActionStatus('RUNNING', {status:'SUCCEEDED', source:'PARTIAL'})  -> throws (correct)
nextActionStatus('RUNNING', {status:'SUCCEEDED'})                    -> 'SUCCEEDED'  ← bypass
nextActionStatus('RUNNING', {status:'SUCCEEDED', source:'partial'})  -> 'SUCCEEDED'  ← bypass
… 'Partial', 'PARTIAL ', 'STREAM'                                     -> 'SUCCEEDED'  ← bypass
```

`validatePartialResult` refuses a terminal status in the same module, so "the single place
both rules are decided" disagreed with itself.

**Repair:** `ACTION_UPDATE_SOURCES` is a closed vocabulary (`CHANNEL` / `PARTIAL` /
`RECONCILE`), the value is trimmed and upper-cased, and an absent or unknown source is
refused outright rather than being read as "not partial".

### DEFECT 5 (medium) — `UNAVAILABLE` could later claim success

`nextActionStatus('UNAVAILABLE', {status:'SUCCEEDED', …})` returned `SUCCEEDED`. The
module's own D8 records that `UNAVAILABLE` is "terminal for *this* attempt, retryable by a
new action with a new key", which is why it is kept out of `ACTION_TERMINAL_STATUSES`. The
code permitted the opposite, so an Action already reported unavailable could subsequently
report success — and a client that followed the documented advice would hold two
contradictory results for one action.

**Repair:** `UNAVAILABLE` is final for this action (`RETRYABLE_STATUS_IS_FINAL_FOR_THIS_ACTION`),
while *entering* it from an in-flight status remains legal so the D8 distinction is preserved.

### DEFECT 6 (medium) — `asAdvisoryAssessment` spread the untrusted classifier output

`{...assessment, advisory: true, …}` copied every key the classifier returned, so the
"advisory" object could carry `channel: 'API'`, `route: 'API_SUBMIT'`,
`requires_user_confirmation: true`, `confirmedByRef: 'owner'` and
`budgetDecision: 'APPROVED'` alongside the three safety flags.
`JEV_ASSESSMENT_FIELDS` was declared and never enforced.

Routing itself is not fooled — `decideRoute` reads only `jev.degraded` — but any future
consumer branching on those names would read a "user-confirmed, API, budget-approved"
assessment that nothing ever confirmed.

**Repair:** undeclared keys are refused and the declared assessment fields are projected, so
an advisory assessment carries only advisory fields.

### DEFECT 7 (high, for the D5 claim) — the linkage scanner had 13 real false negatives

The report's D5 argues at length that "no dependency on the historical product" is proved by
a scanner needing no exclusion list. That claim was load-bearing and partly false. Every one
of these produced **zero** findings:

```text
package.json      {"pnpm":{"overrides":{"boss-client":"2"}}}
package.json      {"workspaces":{"packages":["packages/boss-core"]}}     (the documented npm form)
package.json      {"bundleDependencies":["boss-client"]}
package.json      {"packageManager":"pnpm@9+boss"}
package-lock.json {"packages":{"node_modules/boss-client":{…}}}
tsconfig.json     {"compilerOptions":{"paths":{"boss-client":["./x"]}}}
src.mjs           const m = await import(`boss-client`);
src.mjs           const r = createRequire(import.meta.url)("boss-client");
src.mjs           const p = require.resolve('boss-client/x');
.npmrc            @scope:registry=https://npm.boss.example/
pnpm-workspace.yaml   packages:\n  - packages/boss-core
```

Root causes: a fixed six-name dependency-block list, a quote-requiring module pattern, and a
file filter that dropped `.npmrc`.

**Repair:** JSON is walked structurally, with container keys compared in normalised form and
nested dependency maps (`pnpm.overrides`, the lockfile `packages` map, tsconfig `paths`)
covered at any depth; the call forms of `import`/`require`/`createRequire`/`require.resolve`
are matched; `.npmrc` and workspace-line shapes are scanned; duplicate findings are
de-duplicated. **The author's no-false-positive property is preserved deliberately**: the
container gate is what keeps `DONOR.json` provenance prose a record rather than an edge, and
the static `from '…'` form still requires its quotes for exactly the reason D5 recorded —
this host's first attempt dropped that requirement and immediately re-flagged nine real
`DONOR.json` records, which is recorded as a self-caught error rather than quietly reverted.

One remaining limitation is recorded rather than papered over: a `.gitmodules` entry writes
`submodule` and its path on *different* lines, and the rule is per-line. Adding an INI parser
for one shape was judged out of proportion; the limitation is stated in the report instead.

### DEFECT 8 (medium, PRE-EXISTING at the frozen baseline) — a finished Action could be re-opened

`services/dev-gateway/actions.mjs` `reconcile()` wrote `TASK_STATUS_MAP[task.state]` with no
finality guard, and `nextActionStatus` — the function that states the rule — was never
imported. Consequences: a `SUCCEEDED` Action became `CANCELLED` or `FAILED` once the City
task moved on, and a `REFUSED`/`UNAVAILABLE` Action became `SUCCEEDED`. This is
**pre-existing**: it is identical at baseline `82ed3693` and was not introduced by GAI-001.

It is in scope because it is a false-success path for the same Action lifecycle this task's
contract governs, in the same file this branch already modified, and the fix is small.

**Repair:** the decision is a pure exported `reconcileStatus(currentStatus, observedStatus)`
— extracted so the rule is testable for the first time, since `reconcile` is reachable only
through a CITY_TASK Action backed by a live City task and no test in this repository set one
up. A late observation is kept in `provenance.lateObservations` and the recorded status
stands; nothing throws, so the gateway stays robust.

## 3. Attacked and found sound (no repair needed)

Recorded so the review is auditable and so a later reader does not re-litigate them.

| Attack | Result |
|---|---|
| exhaustive 192-state lattice over `localResult × webCurrent × webOther × lastWebFailed × apiAvailable × userConfirmedApi × budget` | **0** states chose the API channel without user consent; **0** silent Web→API escalations; budget-as-consent never reaches API; **0** other-device proposals without `requires_user_confirmation` |
| input reordering, `undefined` vs `null`, type variants in the idempotency fingerprint | correctly replay or correctly refuse |
| the same idempotency key bound to a different payload | refused |
| a legacy record with no stored fingerprint | still refuses a different request |
| `applyApiEscalation` with budget approval but no user reference | refused (`USER_CONSENT_REQUIRED`) |
| `applyApiEscalation` with a rejected budget | refused (`BUDGET_REJECTED`) |
| `applyDeviceSwitch` with no confirmation | refused (`USER_CONSENT_REQUIRED`) |
| `applyDeviceSwitch` with confirmation | `interaction_follows_execution: false` |
| route spoofing: `BOSS`, `boss`, `HNS`, `general_ai`, `'GENERAL_AI '`, `''`, `null` | all refused; `GENERAL_AI`/`ROOM`/`CITY_TASK` accepted |
| JEV cannot choose a channel (decision identical with and without an advisory assessment), all six failure modes degrade without throwing, frozen advisory resists mutation | sound |
| `validatePartialResult` with a terminal status | refused |
| GENERAL_AI through the live facade | always `UNAVAILABLE`, never success, never reaches the City-task branch, keeps history and idempotency on replay |
| deep-nested authority/secret names inside an extension value | caught (the scan is recursive) |

Three deliberate **non-findings**:

- A provider product name inside an arbitrary string *value* is accepted. `PROVIDER_PRODUCT_PATTERN`
  contains the bare token `hns`, so applying it to values would refuse ordinary paths and prose.
  The rule is enforced where it means something — routes and the one field allowed to name a
  provider — not by a substring search over user data.
- A short opaque string in `credential_ref` is accepted. It is indistinguishable from a handle by
  shape; only recognisable credential *content* is refused (Defect 3).
- A unicode lookalike authority name is descriptive data that no code path reads, and it cannot
  grant anything because the routing policy never consults a profile.

## 4. Decisions not specified by the book

**C1 — Two reviews, not one.** The workbook requires an independent review; it does not say how
many. Running a second review in a separate context was justified by the result: the overlap was
partial. This host found Defects 1, 5 (and the shape of 2); the agent found 3, 4, 6, 7, and D5's
pre-existing half.

**C2 — How far to take the "no raw secrets" rule.** The rule cannot be made absolute by shape;
the honest version is: refuse secret-*shaped names* (normalised, plural-tolerant), refuse
recognisable credential *content* anywhere, and state the residual limitation. Chosen over a
handle-format rule that would either break legitimate references or give false assurance.

**C3 — Whether to fix a pre-existing baseline defect (Defect 8).** Yes. It is a false-success path
in the same lifecycle and the same file, the rule already exists in the contract this task owns,
and the repair cannot fire on a legitimate transition. Recorded as pre-existing so its provenance
is not confused with this branch's work.

**C4 — Whether to keep the plural tolerance that broke `input_tokens`.** Keep it, and make the
check value-aware in the one direction where a type genuinely settles the question: a number
cannot be credential bytes. Rejected alternatives: dropping the plural rule (reopens Defect 2) and
special-casing `input_tokens` (unprincipled, and the next usage field would trip it again).

**C5 — Whether to publish the new error codes in `GAI_ERROR_CODES`.** Yes where a caller may need
to branch on them: `PARTIAL_RESULT_CANNOT_COMPLETE` and `IDEMPOTENCY_KEY_REUSED` were already
there; the new source-validation verdict reuses `UNKNOWN_STATUS` deliberately, because it is a
malformed update rather than a new lifecycle outcome.

**C6 — Evolution-feed record.** Not written, consistent with BA-001 D11 / BA-002 C5 / EM-001 D13 /
RF-001 D8 / RF-002 D13: the `contracts/evolution` event schema pins `missionId` to
`^MB-[0-9]{3}$` and the roles to `MIGRATION|VERIFICATION`, so no GAI event validates and extending
it would touch the frozen `contracts/**` surface.

## 5. Defects fixed, with regression tests

| File | Change |
|---|---|
| `contracts/general-ai-gateway-v1/contracts.mjs` | own-key envelope check; reserved prototype keys; `normalizeFieldName` / `isSecretFieldName` with plural tolerance; `findRawSecretValues`; `findReservedKeyPaths`; value-aware secret scan; closed `ACTION_UPDATE_SOURCES`; `UNAVAILABLE` finality |
| `contracts/general-ai-gateway-v1/routing.mjs` | advisory whitelist projection instead of a spread; structural JSON dependency walk with normalised container keys; call-form module rules; `.npmrc` and workspace-line coverage; de-duplicated findings |
| `services/dev-gateway/actions.mjs` | `FINAL_ACTION_STATUSES` + exported pure `reconcileStatus`; `reconcile` keeps the recorded status and records late observations |
| `contracts/general-ai-gateway-v1/tests/conformance.test.mjs` | 7 regression tests |
| `tests/gateway-actions-status.test.mjs` (new) | 4 regression tests, and the first permanent coverage of `reconcile` and of the reserved `GENERAL_AI` route |

Regression tests added:

1. `undeclared keys inherited from Object.prototype are refused, and a prototype key never is canonical`
2. `a secret-shaped name is refused in its plural and compound spellings, and a quantity is not a secret`
3. `raw credential bytes are refused in any field, not only in a secret-shaped one`
4. `a partial result cannot claim a terminal status by relabelling or omitting its source`
5. `UNAVAILABLE is final for this action, and entering it is still allowed`
6. `an advisory assessment carries advisory fields and nothing else`
7. `the linkage scanner catches real dependency shapes it used to miss, and still ignores provenance prose`
8. `a finished Action is never re-opened by a later observation`
9. `an in-flight Action still follows the City task it is reporting on`
10. `the reserved GENERAL_AI route answers a typed UNAVAILABLE and never becomes a City task`
11. `a reordered idempotency key is the same request, and a different one is refused`

Every negative assertion is paired with a legitimate neighbour that must still pass — the handle
forms for the secret scan, `handle://1` for the credential scan, a non-terminal partial marker, a
legitimate advisory assessment, `DONOR.json` provenance prose and the author's comment case for
the scanner, and every in-flight status transition for the finality rule — so no guard can be
satisfied by refusing everything.

## 6. Test summary

| Check | Result |
|---|---|
| hostile probes (this host's two + the review agent's seven) | every confirmed defect reproduced before repair and refused after |
| `node --test contracts/general-ai-gateway-v1/tests/conformance.test.mjs` | 30 pass / 0 fail (23 Development + 7 new) |
| `node --test tests/gateway-actions-status.test.mjs` | 4 pass / 0 fail |
| `node --test tests/*.test.mjs` | 135 pass / 0 fail |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass / 0 fail |
| `node city/test-all.mjs` | 1801 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 record(s) verified against local Git history at 57915d05906f |
| `node scripts/check-bilingual.mjs` | docs / evidence / data-records PAIRED |
| GitHub CI 36719793897 on c01cd60dd9e0fa42c4126a921240d81e408a3e35 | **gateway-web success, android success** |

FAILURE_REPAIR_SUMMARY: all 23 Development tests passed unchanged after every repair, which is
the evidence that the fixes strengthened the contract without weakening it. Two of this host's own
first attempts were wrong and are recorded rather than hidden: the blunt plural rule flagged
`input_tokens` (fixed by making the check value-aware), and dropping the quote requirement in the
module rule re-flagged nine real `DONOR.json` records (fixed by keeping the static-`from` quote
requirement and gating array linkage on a dependency container).

## 7. Cross-task seams recorded (not solved here)

- **GAI-002 (provider/model/account registry)** must declare provider credentials as handles and
  may not put key material in `credential_ref`. Defect 3 means it now cannot, but the registry
  should also state which handle form it issues.
- **GAI-004 (API channel + consent + budget)** is the first consumer of `nextActionStatus` and of
  the escalation appliers. It must pass an explicit `source`, expect `UNAVAILABLE` to be final for
  an action, and treat `budgetDecision: NOT_EVALUATED` as "wait", which is what `decideRoute`
  already returns. The applier accepting `NOT_EVALUATED` is deliberate (consent is recorded
  before the budget step in the documented order) but is a seam worth a second look in that task.
- **GAI-005 (triage/JEV routing)** must not branch on advisory keys: after Defect 6 the advisory
  object carries only the declared assessment fields, so a consumer that wants `channel` or
  `budgetDecision` must read the routing decision, never the classifier output.
- **Any later task adding an envelope field** inherits the own-key check; `toString`,
  `constructor` and friends can no longer be smuggled in as declared fields.
- **The `.gitmodules` two-line shape** (Defect 7's recorded limitation) remains unscanned.

## 8. Open items for the Owner

1. Confirm D2 of the Development report (the contract layer stays under `contracts/` while the
   City building `00-foundation/06-general-ai-gateway` stays reserved) or direct the promotion.
2. Confirm whether the reserved `GENERAL_AI` route should be visible to Web/Android clients now
   that it has a test: it answers a typed `UNAVAILABLE`, which is honest but user-visible.
3. The evolution-feed question (C6) remains open for the Owner.

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = c01cd60dd9e0fa42c4126a921240d81e408a3e35
BRANCH_CI           = 36719793897 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

语言配对 / Language pair: [原文 / Source](./CORRECTION_REPORT.md) · [译本 / Translation](./zh-CN/CORRECTION_REPORT.md)
