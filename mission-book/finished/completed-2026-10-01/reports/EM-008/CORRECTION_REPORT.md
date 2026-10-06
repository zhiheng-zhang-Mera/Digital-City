# EM-008 Correction Report — Credential References + Persistent Connector Profiles / Sessions

```text
MISSION              = EM-008 (Engineering Manager programme, task 8 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-008-credential-profile-session.md
CLAIM_COMMIT         = c7d6cd9 (Digital-City main, claim of EM-008 Correction by Alien)
CLAIMED_AT           = 2026-10-01T02:42:14Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 963b4f2e47fbb8715d1cf98cf90baee0f79a9c5d
DEVELOPMENT_CI       = 36734070041-success
CORRECTION_BRANCH    = engineering-manager/EM-008-credential-profile-session
CORRECTION_HEAD_SHA  = 4e1b57f9a503458775a004b7bcc32e175e0ca463
BRANCH_CI            = 36808238886-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-008 26 pass (8 author + 18 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head    963b4f2 (Mech)   run 36734070041   success
first-pass head     177deea (Alien)  run 36807612493   success   ← superseded by the review in §5
corrected head      4e1b57f (Alien)  run 36808238886   gateway-web success / android success
```

Both corrected heads executed the real `V0.2 checks` workflow on GitHub-hosted runners.

## 2. Independent review method

The Development head was exported with `git archive` (`D:\A-Utopia\.runtime\evidence\mission-book\EM-008\frozen-963b4f2\`)
and all four branch blobs were verified against their Git objects before any review started:

```text
contracts/engineering-auth-profile-v1/auth-profile.mjs                MATCH b007e659affd741f23b0f92bc11701aa5eb5bb2c
contracts/engineering-auth-profile-v1/index.mjs                       MATCH d9b7f9911a4d5efc9cf4f2e713726048ab0ea5f8
contracts/engineering-auth-profile-v1/tests/conformance.test.mjs      MATCH 5ff732ae03681c777f89b542b494c93a87fca811
tests/engineering-auth-profile.test.mjs                              MATCH bcc72f8d1e7d722832e8cb5516181fa1f89883a1
```

An independent adversarial reviewer was pointed only at that frozen export, told to read the workbook first
and briefed specifically on secret-leakage paths (a secret in the wrong field, nested, differently cased,
echoed through store error messages, surviving a clone, or reaching a log/snapshot). It returned 16 probes
and `probes/FINDINGS.md` (16 reproduced mechanisms, `MATERIAL_DEFECTS_FOUND`, high confidence; the frozen
module's SHA-256 was unchanged for the whole review). This task's own probe is
`probes-alien/probe-alien-em008.mjs` (10 mechanisms, 11 including the false `references_only` claim).

The two sets overlapped on 8 mechanisms. The reviewer's non-overlapping findings — a secret riding in a
*well-shaped* field, a redaction/detection asymmetry, hidden own keys on a snapshot entry, a partial
restore, the legacy bridge hijacking a foreign `profile:default`, an accessor-backed `mode`, rewound
freshness, an assumed store revoke and a silent expiry carry-over — are all repaired in the second pass
(§5). Every repair has a regression that fails on the Development head.

## 3. First pass — 10 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **Plaintext could enter canonical state through the reference field.** `bindSecret` accepted any text `handle_ref`, so `bindSecret({ handle_ref: 'sk-live-…' })` recorded the raw key as the profile handle and the projection returned it as `credential_ref` — **while still claiming `references_only: true`** | 4, 7, 8 | a handle reference that is secret material is refused with `PLAINTEXT_REFUSED`, and `references_only` is measured on the record actually returned rather than asserted | yes |
| 2 | **A store that hands back the value instead of a handle leaked the secret.** `putHandle`'s returned `handle_ref` was recorded unchecked | 8, 12 | the returned reference is shape-checked before it is recorded, and the refusal is a typed `PLAINTEXT_REFUSED` rather than being caught as a store failure | yes |
| 3 | **An uninterpretable expiry read as READY.** `isIsoInstant` was shape-only, so `2026-13-45T99:99:99Z` was accepted, `Date.parse` gave `NaN`, the comparison was false, and the profile reported `READY` with `freshness.fresh: true` | 6 | the exported helper and every recorded instant must survive a calendar round trip; the expiry comparison is `NaN`-safe | yes |
| 4 | **`restore` was laxer than `registerProfile`** — a snapshot entry with no `connector_kind`, a numeric `handle_ref`, an object `account_ref`, a fractional `profile_version` or an impossible `expires_at` was accepted | 1, 6, 10 | a restored entry is validated against a declarative entry spec | yes |
| 5 | **A truthy non-boolean silently cleared a user-action requirement** (`required: 'yes'` → `requires_user_action = false`, downgrading `NEEDS_USER` to `MISSING`) | 2 | `required` must be a boolean | yes |
| 6 | **The allow-list accepted prototype-chain members and could not see hidden keys** (`key in spec`, `Object.keys`, non-plain `isPlainObject`) | 1, 12 | `Object.hasOwn` over `Reflect.ownKeys` plus a plain-prototype requirement | yes |
| 7 | **A cyclic caller value crashed the layer** with an untyped `RangeError` in `findSecretFields`/`redact`/`freeze`, so the secret-scan refusal could not even run | 9 | all three walk with a `WeakSet`; redaction replaces a cycle with a marker | yes |
| 8 | **Revocation was not observable**: the lifecycle marker was written to the record and always overwritten in the projection | 7 | `revoked_at`/`revoked_reason` are projected and cleared by a re-bind | yes |
| 9 | **A rotation abandoned the handle it replaced**, leaving the superseded secret `ACTIVE` and resolvable in the store | 11 | a superseded handle the layer itself created is revoked before the new reference is recorded | yes |
| 10 | **An ambiguous bind silently dropped a secret** (`secret_value` together with `handle_ref`) | 2, 10 | the ambiguous request is refused | yes |

## 4. Second pass — the independent review's live findings

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 11 | **`PLAINTEXT_REFUSED` was gated on the shape check failing.** A *well-shaped* record carrying a secret in `profile_id`, `connector_kind` or `account_ref` skipped the scan entirely and entered canonical state, the AttentionEnvelope question and `diagnosticSnapshot`. This was the most material hole and my first pass did not close it (it only stopped the projection from *claiming* `references_only`) | 2, 8 | the scan runs on every profile input; on a bind it covers every declared field except `secret_value` (the one field that is *supposed* to carry secret material to the store) | yes |
| 12 | **Detection and redaction disagreed.** `looksLikeSecretValue` accepts hyphen-optional shapes (`ghp_…`, `AKIA…`, `sk_live_…`) while `redactString` only rewrote the hyphen-required substring form, so those tokens were classified as secrets yet survived `redact()` and reached the log through a hostile store message | 8 | detection and redaction share one substring shape, and a secret-shaped value is redacted whole | yes |
| 13 | **`findSecretFields` walked only enumerable own keys**, so a non-enumerable own `account_ref`/`handle_ref` on a snapshot entry passed the scan and was then copied into canonical state | 1, 8 | the scan walks own keys (a symbol key is treated as inadmissible material, its value still scanned) and a snapshot entry must satisfy the entry spec | yes |
| 14 | **A refused restore had already installed profiles.** `restore` validated and mutated in the same loop, so an invalid entry after a valid one left the valid one live with no `SNAPSHOT_RESTORED` record; it also silently replaced an already-live profile id | 5 | all entries are validated first and installed only afterwards; a restore that would replace a live profile is refused with `DUPLICATE_PROFILE` | yes |
| 15 | **Legacy discovery hijacked whatever owned `profile:default`.** The DeepSeek key was bound into a `profile:default` belonging to a different connector/mode — and if that profile was `PERSISTENT`, the API key was exported on restart as that connector's *session* reference — while the returned descriptor was built from the static legacy table and contradicted the mutated record | 4, 8 | a conflicting default profile is refused, and the descriptor is built from the record that was written | yes |
| 16 | **An accessor-backed `mode` was validated once and stored from a second read**, so a profile could validate as `API_KEY` and be stored as `EVIL` | 12 | every declared caller field is read exactly once into a snapshot that is both validated and stored | yes |
| 17 | **Freshness could be rewound.** `authStatusFor({ at: <earlier> })` flowed straight into the expiry comparison, so an expired session read `READY` with `attention_required: false` | 6 | a caller instant may not precede the layer's own clock: freshness cannot be asked as of a moment when an expired credential still looked valid | yes |
| 18 | **`revoke` assumed the store released the secret.** A store failure (or a store without `revokeHandle`) was swallowed, `handle_ref` was cleared unconditionally, and the caller received a clean `MISSING` record with no indication that the secret is still live | 3, 7 | the response reports `handle_released` and `store_revoke_attempted`; the layer's own authority is gone either way, but the store's answer is no longer assumed | yes |
| 19 | **A carried-over expiry was silent.** Re-binding after expiry kept the stale `expires_at`, so a brand-new credential was immediately reported `EXPIRED` with nothing to distinguish that from a genuinely expired one | 12 | the carry-over is recorded (`expiry_carried_over`) and an explicit `expires_at: null` clears it (the fail-closed default itself is kept — see §6) | yes |

## 5. Local test summary

```text
corrected module                    26 tests / 26 pass / 0 fail
development head 963b4f2            26 tests /  8 pass / 18 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 8 tests are unchanged and all 8 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\EM-008\`: `frozen-963b4f2/` (byte-verified export),
`prefix-test.log` (the corrected suite against the Development head), `gate-EM-008.log`,
`probes-alien/probe-alien-em008.mjs`, and the independent review's `probes/FINDINGS.md` +
`probe-run-output.txt`.

## 6. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **Handle ownership is not verifiable here** (reviewer D10): profile B can be bound to a reference profile A also holds, and revoking B asks the store to revoke that handle | Handles belong to the neutral `SecureHandleStorePort`; the workbook forbids this layer from growing a second store (`engineering_may_define_its_own_store: false`), and the port exposes no ownership API. The layer now tracks `handle_bound_by_layer` so a future revision can distinguish "ours" from "the caller's", and a rotation only revokes a handle this layer wrote. |
| **A bound handle is `READY` unless the caller flags a user action** (reviewer D11 half): an `OAUTH`/`DEVICE_CODE` profile with a resolvable handle does not default to `NEEDS_USER` | Author-encoded and coherent: with no handle those modes report `MISSING` (author test line 184), and a bound handle means a credential was actually obtained — `bindSecret` clearing `requires_user_action` is precisely "the user just completed the flow". The *unsafe* half of that finding (a truthy non-boolean clearing the flag) is repaired (#5). |
| **A carried expiry stays carried** (reviewer D14): re-binding without an explicit expiry keeps failing closed at the old instant | The acceptance criterion is explicit that "expired session becomes EXPIRED/NEEDS_USER rather than READY", so the alternative — treating an unspecified expiry as no expiry — would make a possibly-stale credential read `READY`. The carry-over is now observable (#19) and clearable with `expires_at: null`. |
| **Redaction cannot recognise an unlabelled secret.** A password matching no key name and no token prefix, inside a store's error text, is logged verbatim | The module's own values only ever reach the store as `secret_value` and are never logged or recorded; what was repaired is every path where *this layer* put a detected secret into canonical state or the log (#1, #2, #11, #12). A heuristic cannot recognise an arbitrary string, and the store owns its error text. |
| **A projection records a log entry on a failed handle resolve**, so repeated reads of an unresolvable reference grow the log | It is the failure evidence the acceptance criteria want and the author suite relies on its status/reason. Recorded as a read-path side effect rather than removed. |
| **Inert vocabulary**: `INVALID_MODE`, `INVALID_PERSISTENCE`, `HANDLE_REQUIRED`, `HANDLE_NOT_RESOLVABLE`, `JOB_REF_REQUIRED` are declared but never thrown; `REFRESHING`/`UNKNOWN` are never emitted | The corresponding conditions are refused or reported with other declared codes and honest statuses (`MISSING` + `HANDLE_UNRESOLVABLE`). No reachable behavioural consequence; coverage evidence, not a defect. |
| **The layer never reads `process.env`** and only bridges the pinned legacy key name | Workbook scope (`LEGACY_SOURCES` is a declared table, not an ambient read). |

## 7. Disclosure

- The first pass (head `177deea`, run 36807612493) was pushed and green **before** the independent review
  returned. The workbook was not reported complete at that point: the review's live findings are the
  second pass above. My own probe found 10 mechanisms and missed the single most material one (#11, a
  secret in a well-shaped field), which is exactly why the independent pass exists.
- Dependency installation is part of the gate procedure in a fresh Correction worktree
  (`pnpm install --frozen-lockfile` at the root and under `city/`); without it `city-test-all` fails with
  `YAML_PARSER_UNAVAILABLE`. Recorded as an environment seam, not a code result.
- One of my own regression assertions needed tightening, not the module: `expectCode('INVALID_PROFILE', …)`
  for a non-enumerable own `api_key` became `PLAINTEXT_REFUSED` once own-key scanning landed — the module's
  refusal was strictly more informative (it names the field), so the test was corrected to match, and the
  same test now also asserts that an own-but-undeclared key is refused as `INVALID_PROFILE`.
- My first-pass test also mis-counted a profile version after bind+revoke and got the module's correct
  `PROFILE_VERSION_CONFLICT`; the test was wrong, not the module.
- No billing refusal was recorded as a code failure; every hosted run in this task that started executed
  real steps.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
