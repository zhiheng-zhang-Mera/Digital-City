# EM-008 Development Report — Credential References + Persistent Connector Profiles / Sessions

```text
MISSION                  = EM-008 (Engineering Manager programme, task 8 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 52cdc8d (Digital-City main, "claim(EM-008): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:01:02Z
CONTROL_REVISION_AT_CLAIM= c99b7d8 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-008-credential-profile-session
IMPLEMENTATION_HEAD_SHA  = 963b4f2e47fbb8715d1cf98cf90baee0f79a9c5d
BRANCH_CI                = 36734070041 — success
LOCAL_CHECK_SUMMARY      = 109/109 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/engineering-auth-profile-v1/` — `auth-profile.mjs` (modes, references, lifecycle/freshness,
status, attention envelopes, redaction, restart snapshot, legacy bridge), `index.mjs`, 8-test suite, root
`tests/engineering-auth-profile.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| Canonical job/connector/task state contains handles/references rather than plaintext secrets | `canonical state holds handle references, never plaintext secrets` (`credential_ref` is the handle; the value is only resolvable *from the store*; `findSecretFields(record)` is empty) |
| Secret values are absent from logs/reports under failure tests | `secret values are absent from logs and errors even when the secure store fails` (a hostile store throws with the secret in its message; the typed error, the redacted log and the diagnostic snapshot all contain no secret) |
| Expired session becomes EXPIRED/NEEDS_USER rather than READY | `an expired session becomes EXPIRED/NEEDS_USER with a job-scoped AttentionEnvelope` |
| Restart can restore an allowed persistent profile/session reference | `restart restores permitted persistent session references, and only those` |
| Missing secure-store support degrades honestly instead of falling back to plaintext shared state | `missing secure-store support degrades honestly with no plaintext fallback` |
| Legacy DeepSeek env discovery can be consumed through the abstraction without becoming the universal schema | `legacy DeepSeek env discovery is consumable through the abstraction without becoming the schema` |
| AuthMode vocabulary + credential/profile/session reference contracts + lifecycle/freshness metadata | `each auth mode maps to exactly one reference kind, and NONE needs no handle`; `the profile contract is declarative, versioned and lifecycle-honest` |
| Redact secret material from logs, reports, artifacts and diagnostic snapshots | `redact()` + `findSecretFields()` assertions in tests 1 and 3, and `diagnosticSnapshot()` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair and no eligible Correction for Mech (Alien holds
BA-004 and RF-004's Corrections; EM-003 was already corrected green). Tie-break after BA-006 (Butler) again
excluded BA, so the choice was EM-008/GAI-004/RF-005. EM-008 was taken because it is the foundation the two
real-connector tasks need (EM-011 DeepSeek Harness + Codex, EM-012 connector SDK) and because EM-004's
registry, EM-005's attention envelopes and EM-009's restart recovery all consume an auth status that must
already exist.

**D2 — Own a credential store, or consume the neutral port?** OPTIONS: (a) an Engineering-Manager-only
secure store; (b) the neutral 00-Foundation `SecureHandleStorePort`; (c) write handles into profile records.
CHOICE: (b), with the port injected and its descriptor published (`engineering_may_define_its_own_store:
false`). Reason: the workbook forbids a second domain-exclusive secure-store engine, and GAI-002 already
consumes the same neutral port with the same three methods (`putHandle`/`resolveHandle`/`revokeHandle`), so
one real implementation will satisfy both programmes at merge. (c) would make canonical state a secret
store, which the first acceptance bullet forbids.

**D3 — What happens when there is no secure store?** CHOICE: refuse to bind a secret
(`SECURE_STORE_REQUIRED`, status 503) and report `MISSING` (or `UNAVAILABLE` if a reference existed),
never writing the value into a record or a log. Reason: "degrades honestly instead of falling back to
plaintext shared state" is an acceptance bullet; the honest degradation is a typed refusal plus a status
that is visibly not READY, and the test asserts the record still holds no plaintext afterwards.

**D4 — One reference field or three?** CHOICE: three mode families with exactly one populated field —
`credential_ref` (API_KEY, OAUTH, DEVICE_CODE), `profile_ref` (BROWSER_PROFILE, DESKTOP_SESSION),
`session_ref` (CLI_SESSION) — with `handle_ref` always the underlying handle. Reason: the workbook names
credential/profile/session reference contracts separately, and making the mapping total (asserted for all
six modes) means a caller can never read a session handle as a credential handle. `NONE` maps to no
reference at all and reports `READY` / `NO_AUTH_REQUIRED`, because a local tool needing no auth is ready.

**D5 — Expiry boundary.** CHOICE: `expires_at` equal to the evaluation instant counts as **expired**, and
`freshness.fresh` is true only for an actually READY status. Reason: a boundary case must fail closed —
treating "expires now" as still fresh is exactly the stale-session bug the acceptance bullet targets. (This
decision was surfaced by a test expectation that assumed the opposite; the module's fail-closed behaviour
was kept and the expectation corrected.)

**D6 — Where does AttentionEnvelope come from?** CHOICE: an envelope is produced only when the caller
supplies the `job_ref` the envelope is scoped to; otherwise `attention` is `null` with
`attention_skipped_reason: 'ATTENTION_IS_JOB_SCOPED'`. The envelope uses EM-005's exact field set and
`kind: 'AUTHENTICATION'`, `blocking: true`. Reason: EM-005's contract requires a job reference, and
inventing a synthetic job id to satisfy a validator would be a fabricated record. Statuses are still
surfaced (`attention_required: true` + `reason`) so nothing is hidden.

**D7 — What may survive a restart?** CHOICE: only `CLI_SESSION`/`BROWSER_PROFILE`/`DESKTOP_SESSION`
profiles marked `PERSISTENT`; a bearer credential may not be marked persistent at all
(`MODE_NOT_PERSISTABLE`), and the snapshot carries references only. On restore, a reference the store can no
longer resolve is reported as a `degraded_profile` with status `MISSING`/`HANDLE_UNRESOLVABLE` rather than
READY. Reason: the workbook asks for permitted session references to survive restart; a credential value is
not a session, and "restored" must never mean "assumed still valid".

**D8 — How is the legacy DeepSeek path bridged?** CHOICE: `discoverFromLegacyEnv({ env })` accepts an env
object (no `process.env` access, so the module stays pure), reads only the declared legacy keys
(`DEEPSEEK_API_KEY`), stores the value through the handle store, and returns a **neutral** profile record
whose field set is identical to any other connector's. The env key itself is refused as a profile field
(`PLAINTEXT_REFUSED`). Reason: "consumable through the abstraction without becoming the universal schema"
is an acceptance bullet; returning a provider-specific descriptor would smuggle the old schema into the new
one, and the test asserts the neutral record shape is identical for an unrelated connector.

**D9 — Secret detection and redaction breadth.** CHOICE: redaction and scanning cover secret-shaped *keys*
(excluding `*_ref` handle references and boolean assertion flags) **and** secret-shaped *substrings inside
longer strings*, so a store error message cannot smuggle a key into the log. Reason: the failure test puts
the secret in a thrown store message; whole-string matching alone let it through, which the redaction test
caught and the module now handles.

**D10 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/engineering-auth-profile-v1/auth-profile.mjs` | new — modes, references, status, attention, redaction, restart, legacy bridge |
| `contracts/engineering-auth-profile-v1/index.mjs` | new — public surface |
| `contracts/engineering-auth-profile-v1/tests/conformance.test.mjs` | new — 8 conformance tests |
| `tests/engineering-auth-profile.test.mjs` | new — root runner entry (106 → 109 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

8 tests. Five expectations failed on first run; two were genuine module defects, three were corrected
expectations where the module was right:

1. **Defect:** `findSecretFields` flagged this module's own `secret_material_present` boolean flag, so a
   clean record looked contaminated. Fixed by skipping boolean values and renaming the flag to
   `references_only` (descriptive rather than self-flagging).
2. **Defect:** `redact()` only matched a string if the *whole* value looked like a secret, so a hostile
   store message (`store exploded while writing sk-live-…`) leaked the key into the log. Fixed with
   secret-substring redaction, and the failure test now proves the log, the error and the snapshot are all
   clean.
3. **Expectation:** `at: undefined` passed through `discoverFromLegacyEnv` was rejected as
   "must not be null". Fixed the module to treat a null/absent instant as "use the clock" (and marked the
   two `at` spec entries nullable), because an absent optional instant is not an error.
4. **Expectation:** an expiry equal to the evaluation instant was expected to be READY. Kept the module's
   fail-closed EXPIRED and moved the test's expiry to a later instant (D5).
5. **Expectations:** a secret-bearing `api_key` input was expected to be `INVALID_PROFILE`; the module
   names it `PLAINTEXT_REFUSED`, which is more specific and more useful. Split the test so plain unknown
   keys assert `INVALID_PROFILE` and secret-bearing keys assert `PLAINTEXT_REFUSED`.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 109 tests, 109 pass, 0 fail (101 baseline + 8 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36734070041 on 963b4f2e47fbb8715d1cf98cf90baee0f79a9c5d | success |

## 6. Integration seams handed to sibling tasks

- **Neutral 00-Foundation `SecureHandleStorePort`:** this module consumes `putHandle`/`resolveHandle`/
  `revokeHandle` exactly as GAI-002 does, and publishes the descriptor. Whoever ships the real port owns
  the real guarantee; both programmes must be served by one implementation, not two.
- **EM-004 (capability probe + auth registry):** `AUTH_STATUSES` is the identical seven-value vocabulary;
  an instance's `auth` block (`{status, handle_ref}`) can be filled directly from
  `authStatusFor(...)` projections, and `handle_ref` from `credential_ref`/`profile_ref`/`session_ref`.
- **EM-005 (attention):** the emitted envelope matches `ATTENTION_ENVELOPE_SPEC` field-for-field with
  `kind: 'AUTHENTICATION'`; EM-005's routing/ranking can consume it unchanged.
- **EM-009 (runtime health / restart / recovery):** `exportPersistentRefs()`/`restore()` are the auth half
  of restart recovery; EM-009 should schedule them rather than define a second snapshot format.
- **EM-011 / EM-012 (real connectors, connector SDK):** a connector declares `mode` + `persistence` and
  binds through the handle store; nothing provider-specific enters the record. The DeepSeek legacy bridge
  gives EM-011 a migration path without making `DEEPSEEK_API_KEY` a schema field.
- **GAI-002 / GAI-003 (General AI registry, web channel sessions):** same neutral port and the same
  status vocabulary; at merge the two `SECURE_HANDLE_STORE_PORT` descriptors should be one shared constant.
- **Remote Fabric (RF-002/RF-006):** profile/session references are **not** replicated to remote nodes by
  default (explicitly out of scope); RF must treat a handle reference as node-local.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a secret reaching a log through a path other than the store error (e.g.
  an `expires_at` or `profile_id` carrying a key), a snapshot that hides a secret inside a nested array,
  a restore that brings back a non-persistent profile, and a store double that returns a handle for a value
  it did not store.
2. Confirm D7 (only session-like modes may be persistent) and D8 (legacy bridge returns a neutral record,
  env object injected rather than `process.env` read).
3. Confirm D5 (expiry at the boundary counts as expired) as the intended fail-closed reading.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
