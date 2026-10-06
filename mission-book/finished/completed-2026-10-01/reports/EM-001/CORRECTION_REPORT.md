# EM-001 Correction Report — Core Contracts + Engineering Ownership Boundaries

```text
MISSION              = EM-001 (Engineering Manager programme)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-001-core-contracts-boundaries.md
CLAIM_COMMIT         = ec8768b (Digital-City main, claim of EM-001 Correction by Alien)
CLAIMED_AT           = 2026-09-30T12:32:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = efa127b38e5285ec9beb25d85fc21160c13d5f7a
CORRECTION_BRANCH    = engineering-manager/EM-001-core-contracts-boundaries
CORRECTION_HEAD_SHA  = 2616dbe16d38dc82b0f15589b25a18d1e193108a
BRANCH_CI            = 36715532681 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 131 pass / 0 fail, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

The Development head efa127b was fetched into a separate worktree and attacked directly.
The author's hand-off (§6.1) listed the surfaces to try: provider identity or foreign
semantics through unenumerated paths, nested string values, arrays, `provider_ref`
overflow, case variants of foreign route names and prototype-pollution keys. That list was
used as a starting point and then extended by asking a different question: *what other
way can the same forbidden concept be written?* Every scan in `ownership.mjs` compares
key names, so the productive attack was not nesting or wrapping but **spelling**.

## 2. Independent review findings

All findings share one root cause: the boundary checks were written against raw key
strings, so a boundary was only as strong as the attacker's willingness to spell a
forbidden name exactly. All four were repaired.

### DEFECT 1 (high) — the secret scan missed every plural and camelCase spelling

**Where:** `ownership.mjs` `findSecretFields`, reached from `boundaryScans` in
`envelopes.mjs` and therefore applied to **every** canonical envelope and owned state.

`SECRET_KEY_PATTERN` required the secret word to be followed by end-of-key or a
separator, so a trailing plural `s` defeated it:

| Field | Before | After |
|---|---|---|
| `token`, `secret`, `password`, `api_key`, `apiKey`, `credential` | caught | caught |
| `credentials`, `secrets`, `tokens`, `passwords` | **missed** | caught |
| `apiKeys`, `api_keys`, `privateKeys` | **missed** | caught |
| `sessionKeys`, `refreshTokens`, `accessTokens`, `clientSecrets` | **missed** | caught |

**Why it matters:** the contract's stated rule is that canonical records carry handles and
references only. A connector or job envelope could therefore carry `credentials: { … }`
or `apiKeys: […]` with raw values, and the scan that exists to stop exactly that would
report clean. The top-level owned-state allowlist happened to refuse these names as
"not Engineering-owned state", which is why the Development suite never saw it — but that
allowlist only covers the top level, and the generic recursive scan is what protects every
nested position in every envelope.

### DEFECT 2 (high) — foreign canonical state was missed in camelCase

**Where:** `findForeignCanonicalFields`, compared with
`FOREIGN_CANONICAL_FIELDS.includes(key)` — an exact match against snake_case names.

Accepted before the repair:

```text
{ job_ref, scope: { taskGraph: { nodes: [] } } }              -> ok: true
{ job_ref, workspace: { canonicalTaskState: { x: 1 } } }       -> ok: true
{ job_ref, context_refs: [{ assistantIdentity: { a: 1 } }] }   -> ok: true
{ job_ref, scope: { 'Task-Graph': {} } }                       -> ok: true
```

`task_graph` (exact) was refused while `taskGraph` was accepted. This is the
"Engineering Manager must never become a second City task database" boundary, so the
spelling of the field name was the only thing standing between the contract and the
outcome it forbids.

### DEFECT 3 (medium) — no reserved prototype keys were refused anywhere

A nested `__proto__` key was accepted by both `validateEngineeringOwnedState` and the
envelope boundary scan; only a *top-level* `__proto__` was refused, and only incidentally,
because it fails the owned-state allowlist. There is no dynamic key assignment in this
contract, so this was not exploitable on its own — but a validated envelope carrying a
`__proto__` key is a payload that a consumer may later spread or copy, at which point the
key becomes a prototype write. Closed as defence in depth and for consistency with the
sibling BA-001 contract, which was repaired the same way in the same session.

### DEFECT 4 (medium) — provider and tombstone patterns allowed exactly one separator

`PROVIDER_PRODUCT_PATTERN` used `ds[-_ ]?hns` and `FORBIDDEN_DONOR_PATTERN` used
`codex[-_ ]?boss`, so `codex  boss` (two spaces) and `ds--hns` were not recognised as the
same identity as `codex-boss` and `ds-hns`. Both now allow a repeated separator run.

### DEFECT 5 (low) — `undefined` and `null` shared one digest

`canonicalJson` emitted an `undefined`-valued key as `null`, so `{a: undefined}` and
`{a: null}` produced the same digest and therefore the same idempotency identity, in a
contract whose whole replay model rests on "same key + different intent = refuse". Only
in-process callers can build the former (JSON round-trips drop `undefined`), so the
severity is low, but the ambiguity is real and the fix is one filter. `undefined`-valued
keys are now dropped — which is also what the sibling BA-001 canonicaliser documents — so
an absent field and an explicitly null field are distinguishable.

### The repair

`normalizeFieldName(key)` splits camelCase into words, collapses every non-alphanumeric
run to one separator and lowercases. The secret scan additionally tolerates a trailing
plural `s` while still permitting the reference forms the contract allows (`*_ref`,
`*_refs`, `*_handle`, `*_handles`, `*_id`) — so `credential_ref` remains legal and
`credentials` does not. Foreign canonical names are compared in normalised form. Reserved
prototype keys are refused by a new `findReservedKeyPaths`, wired into both
`validateEngineeringOwnedState` and the shared envelope `boundaryScans` so there is one
choke point per surface rather than a check per caller. The published schema states the
normalisation rule, the reserved keys and the digest rule in `x-ownership-boundary`, and a
test binds the schema statement to the runtime patterns.

## 3. Attacked and found sound (no repair needed)

| Attack | Result |
|---|---|
| `validateEngineeringRoute` with `HNS`, `ds-hns`, `Codex`, `CLAUDE`, `CITY_TASK`, `city_task`, `Room`, `GENERAL_AI` | all refused |
| route case variants: `engineering`, `Engineering`, `ENGINEERING `, `ENGINEERING\n` | all refused — the route is matched exactly |
| `codex-boss`, `Codex_Boss`, `CODEX BOSS`, `codexboss`, `CODEX-BOSS` | all caught |
| owned state carrying a provider name inside a string **value** | accepted — see the non-finding below |
| job identity, control transitions, terminal-job resurrection, duplicate results | behaved as documented |
| attention projection (one actionable, ≤3 recent, first-ack-wins) | behaved as documented |

**Deliberate non-finding.** A provider product name inside an arbitrary string *value*
(for example `workspace.path === '/x/hns-worker'`) is accepted, and must be:
`PROVIDER_PRODUCT_PATTERN` contains the bare token `hns`, so applying it to values would
refuse ordinary paths, prose and identifiers that merely contain those three letters. The
contract's actual rule — no provider product name is *required* by the core contract, and
none may become a route or a task identity — is enforced where it is meaningful, on routes
and on the one field allowed to name a provider (`ConnectorDescriptor.provider_ref`), not
by a substring search over user data. Recorded because "we chose not to check this" is a
judgement a later reader must be able to audit.

## 4. Decisions not specified by the book

**C1 — Fix the spelling gap at each call site, or normalise once?**
Normalising inside the scans changes `findSecretFields`/`findForeignCanonicalFields`
themselves, so every existing caller gets the stronger behaviour with no call-site change.
Chosen because the defect was in the shared scanners, and the envelope layer has exactly
one choke point (`boundaryScans`) that must not be duplicated per envelope type.

**C2 — Is the plural tolerance too aggressive?**
It is deliberately narrow: the trailing `s` is stripped only for the secret vocabulary, and
only when the result matches the whole-word pattern, and the reference-suffix exemption is
applied first. `credentials_ref` stays a reference; `credentials` does not. The regression
test asserts both directions so neither can regress silently.

**C3 — Was the published schema in scope?**
Yes, for the same reason as BA-001 C3: the contract's own D12 claims schema↔runtime
consistency, so a runtime rule the schema does not state would make that claim false.

**C4 — Evolution-feed record.**
Not written, consistent with BA-001 D11 / EM-001 D13 / RF-001 D8: the evolution-event
schema is migration-scoped (`^MB-[0-9]{3}$`, roles `MIGRATION|VERIFICATION`), so no EM event
validates and extending it would touch the frozen `contracts/**` surface.

## 5. Defects fixed, with regression tests

| File | Change |
|---|---|
| `contracts/engineering-manager-v1/ownership.mjs` | `normalizeFieldName`, `isSecretFieldName`, normalised foreign-field set, `findReservedKeyPaths`, repeated-separator provider/tombstone patterns, reserved scan in `validateEngineeringOwnedState` |
| `contracts/engineering-manager-v1/envelopes.mjs` | reserved-key scan added to the shared `boundaryScans` choke point |
| `contracts/engineering-manager-v1/canonical.mjs` | `undefined`-valued keys dropped from the canonical form |
| `contracts/engineering-manager-v1/schema.json` | `x-ownership-boundary` states name normalisation, reserved keys and the digest rule |
| `contracts/engineering-manager-v1/tests/conformance.test.mjs` | 8 regression tests |

Regression tests added:

1. `a secret-shaped field is refused in its plural and camelCase spellings too`
2. `foreign canonical state is refused in camelCase and separator variants`
3. `reserved prototype keys are refused at every depth of an owned state`
4. `an envelope refuses a reserved prototype key, so a wire payload cannot smuggle one`
5. `a codex-boss reference is caught however its separators are spelled`
6. `provider product names are caught however their separators are spelled`
7. `an absent field and an explicitly null field have different digests`
8. `the published schema states the normalisation and reserved-key rules the runtime enforces`

Each negative test asserts a legitimate neighbour that must still pass — `credential_ref`
and `api_key_handle` for the secret scan, `context_refs: ['ctx:1']` for the foreign scan,
`ENGINEERING` for the route check, ordinary prose for the tombstone check — so no guard can
be satisfied by refusing everything, and the normalised-matching change cannot silently
widen into false positives.

## 6. Test summary

| Check | Result |
|---|---|
| hostile probe against the public contract API | all attacks above refused after repair |
| `node --test contracts/engineering-manager-v1/tests/conformance.test.mjs` | 30 pass / 0 fail (22 Development + 8 new) |
| `node --test tests/*.test.mjs` | 131 pass / 0 fail |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass / 0 fail |
| `node city/test-all.mjs` | 1801 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 record(s) verified against local Git history at efa127b38e52 |
| `node scripts/check-bilingual.mjs` | docs / evidence / data-records PAIRED |
| GitHub CI 36715532681 on 2616dbe16d38dc82b0f15589b25a18d1e193108a | gateway-web success, android success |

FAILURE_REPAIR_SUMMARY: no test failed after the repair, and all 22 Development tests passed
unchanged — the evidence that the repair strengthened the contract without weakening it. As
with BA-001, the five defects were found by the independent probe rather than by a failing
test, which is precisely the value the Correction stage is supposed to add.

## 7. Cross-task seams recorded (not solved here)

- **EM-002 / EM-004 / EM-011 / EM-012** implement connectors and will now be refused if a
  descriptor or a scripted payload carries a plural/camelCase secret-shaped field name
  (`credentials`, `apiKeys`, …) or names foreign canonical state in camelCase. That is the
  intended strengthening, but it is a behaviour change: a connector author who used
  `credentials_ref` is unaffected, one who used `credentials` must switch to a handle.
- **EM-003 / EM-009** persist and replay envelopes; the digest change means a payload that
  contained an explicit `undefined` field could be assigned a different replay identity
  than before. Wire payloads cannot contain `undefined`, so this only affects in-process
  callers, and it is recorded rather than assumed harmless.
- **EM-005** attention envelopes go through the same `boundaryScans`, so they inherit the
  reserved-key refusal automatically.

## 8. Open items for the Owner

1. The normalised matching is intentionally stricter than "reject authority fields": it now
   also rejects foreign canonical state written in camelCase. If any future sibling
   programme legitimately needs a camelCase field that normalises onto a foreign canonical
   name, the foreign list (not the normalisation) is the place to change it.
2. The evolution-feed question (C4, BA-001 D11, EM-001 D13, RF-001 D8) remains open for the
   Owner: extend the event schema, or state that the mission-book reports are the complete
   construction record for BA/RF/GAI/EM component work.

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = 2616dbe16d38dc82b0f15589b25a18d1e193108a
BRANCH_CI           = 36715532681 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
