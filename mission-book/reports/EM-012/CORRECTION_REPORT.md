# EM-012 Correction Report — Connector SDK + Claude Code / WorkBuddy extension paths

```text
MISSION              = EM-012 (Engineering Manager programme, task 12 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-012-connector-sdk-claude-workbuddy.md
CLAIM_COMMIT         = 3dc4608 (Digital-City main, claim of EM-012 Correction by Alien)
CLAIMED_AT           = 2026-10-01T05:35:27Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 364c5160952039d31074af3bfae843c1d0f4be24
DEVELOPMENT_CI       = 36751919772-success-attempt-3
CORRECTION_BRANCH    = engineering-manager/EM-012-connector-sdk-claude-workbuddy
CORRECTION_HEAD_SHA  = e4afd5ea5a822b481a93771b4b33041d64e29cb8
BRANCH_CI            = 36821442088-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-012 26 pass (7 author + 19 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   364c516 (Mech)   run 36751919772   success
corrected head     e4afd5e (Alien)  run 36821442088   gateway-web success / android success
```

The Development run id is the one the workbook recorded as `BLOCKED_GITHUB_ACCOUNT_BILLING`; it concluded
success once the Owner cleared the billing refusal, which is what made this Correction eligible
(`mission-book/reports/DEVELOPMENT_CI_RECOVERY_2026-10-01.md`).

## 2. Independent review method

The Development head was exported with `git archive --format=tar -o …` and extracted
(`D:\A-Utopia\.runtime\evidence\mission-book\EM-012\frozen-364c516\`); all four branch blobs were verified
against their Git objects (`git hash-object` == `git rev-parse <head>:<path>`, all MATCH) before any review
started. Note: the first attempt piped `git archive` straight into `tar` through PowerShell, which corrupted
the stream (`Damaged tar archive (bad header checksum)`, all four hashes MISMATCH); the archive was written to
a file instead and the hashes then matched. An independent adversarial reviewer was pointed only at the frozen
export, told to read the control book first, and briefed that a **fabricated real-provider acceptance** and a
**vacuous conformance certificate** are the defects that matter here, because the SDK's whole product claim is
"a new connector is proven without touching core". It returned 13 probes, `probes/ALL-PROBES-OUTPUT.txt` and
`probes/FINDINGS.md`: `MATERIAL_DEFECTS_FOUND: 11`, confidence high (0.9). My own read had already produced
seven of them; the merged set is repaired below, and the reviewer's non-material notes are recorded.

## 3. Defects found and repaired — 14 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU,
13 audit not bound to its actor, 14 a claim not backed by the data).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **Instants were shape-only.** `isIsoInstant` accepted `2026-13-45T99:99:99Z` and `2026-02-30T00:00:00Z`, so `defineConnector({ at })`, `runConformanceHarness({ at })` and every adapter clock could store an impossible instant as evidence | 6 | one real-instant round trip (`isRealInstant`) behind `isIsoInstant`, and one validated `atFrom` helper for every caller-supplied instant | yes |
| 2 | **The freezer was cycle-unsafe and re-read accessors**: a cyclic handler value escaped as an untyped `RangeError`, and `Object.values` invoked getters | 9, 12 | a `WeakSet`-guarded freezer that walks own descriptors instead of values | yes |
| 3 | **`supported_controls` was unvalidated** (a string spread into characters, `null` threw a raw `TypeError`, mixed lists passed) and `optional: 'yes'` silently became `false` | 3 | canonical control-name list, deduplicated, and a boolean opt-in | yes |
| 4 | **The conformance harness certified connectors that silently accept unsupported operations.** The check pushed `{ typed_refusal: false }` with `passed: true`, the control expectation was skipped by default, `result.state` was never validated (`'BANANA'` passed) and declared capabilities were never cross-checked with the reported ones | 8, 7, 2 | a silent acceptance now fails the check, the control check runs by default, `RESULT_STATES`/`TERMINAL_RESULT_STATES` are enforced, and a declared capability the connector does not report fails | yes |
| 5 | **A non-cloneable port result was handed out live.** `snapshotResult` swallowed the clone failure and returned the adapter's own object, so a caller could mutate adapter state | 12, 8 | a typed `MALFORMED_RESULT` refusal (which also faults and isolates the adapter); nothing leaves the boundary unfrozen | yes |
| 6 | **A hostile error escaped `invoke`'s catch.** Reading `error.code` unguarded meant an object with a throwing `code` getter propagated raw, recorded no fault and left the adapter `ENABLED` | 3, 4 | the fault is recorded before anything else can fail (state first, tolerant clock), and `code`/`message` are read defensively with `code_readable: false` when unreadable | yes |
| 7 | **Handlers were validated by prototype lookup but stored by spread.** An inherited or non-enumerable method satisfied `MINIMUM_CONNECTOR_METHODS` while the stored record was empty, and `minimum_methods_satisfied: true` was a literal | 4, 8 | `handlers` must be a plain own-method record, and the stored record is built from the validated methods with the flag derived from that record | yes |
| 8 | **Availability was only the caller's flag.** `probe().installed === false` was read by no decision, so an uninstalled optional product was `ENABLED`, listed `usable` and selected for capability routing | 2, 4, 7 | `installState()` reads the adapter's own probe without mutating state; `startupReport` reports `install_state` and only a product that is not `NOT_INSTALLED` is usable; `selectForCapability` excludes it | yes |
| 9 | **`clearFaults()` revived anything and erased the ledger**, and `enable()` silently revived a faulted adapter | 5, 13 | only a `FAULTED` adapter may be cleared, the faults move to a retained `faultHistory()`, and `enable` refuses a faulted adapter (clearing is the only revival path) | yes |
| 10 | **An acceptance was stamped from a caller's self-declaration.** `component_stage_acceptance: true` with `evidence_source: 'HOST_RUNTIME'` came from a runtime that merely returned `real: true` plus two strings; `fabricated_*` were hardcoded `false` | 7, 8, 1 | a product reporting itself uninstalled cannot be accepted, a class instance or a throwing runtime is not evidence, and every report now carries `acceptance_verified_here: false` and `evidence_declared_by`; the summary counts unverified acceptances instead of hardcoding `0` | yes |
| 11 | **The registry accepted any object with `connectorKind()`**, so a forged adapter bypassed isolation | 4 | a module-private brand stamped by `createSdkAdapter`; only SDK-wrapped adapters register (`isolation_wrapped`) | yes |
| 12 | **One breaking adapter could kill every registry report** with a raw, untyped error | 3 | per-adapter guards in `startupReport`, `selectForCapability` and `acceptanceSummary` (a broken acceptance becomes a pending report) plus a `safeKind` reader | yes |
| 13 | **The harness emitted core-edit certificates for non-conformant connectors.** `core_edits_required: 0`, `foreman_core_edited: false` and the port-version claim were literals | 7, 8 | the certificate is withheld (`null` + `claims_withheld: true`) unless every check passed | yes |
| 14 | **Fault identities collided** across two adapters of the same kind in one process, and no fault named its recorder | 8, 13 | a process-wide fault sequence plus `recorded_by: 'SDK_ADAPTER'` | yes |

## 4. Local test summary

```text
corrected module (e4afd5e)           26 tests / 26 pass / 0 fail
development head 364c516             26 tests /  7 pass / 19 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 7 tests are unchanged and all 7 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\EM-012\`: `frozen-364c516/` (byte-verified export),
`pre-fix-baseline.txt` (the 7/19 split above), `gate-sdk.log`, `gate-root.log`, `gate-rooms.log`,
`gate-city.log`, `gate-promotion.log`, `gate-bilingual.log`, the anchor-guarded repair scripts
(`patch-connector-sdk-1.mjs`, `patch-connector-sdk-2.mjs`, `patch-connector-sdk-3.mjs`,
`fix-regression-inherited.mjs`), the regression blocks (`regressions.block.txt`, `regressions2.block.txt`),
and the independent review's `probes/FINDINGS.md` with 13 probes and their combined output.

## 5. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **`evidence_source: 'HOST_RUNTIME'` and the minimal evidence shape** (`real`, `submit_ref`, `terminal_ref`) stay as they are (reviewer defect 1) | Author-encoded: `conformance.test.mjs:250-251` asserts the literal `'HOST_RUNTIME'` and `assert.deepEqual(real_evidence, { submit_ref, terminal_ref })`. The repair therefore labels the declaration (`acceptance_verified_here: false`, `evidence_declared_by: 'CALLER_SUPPLIED_RUNTIME'`, `real_evidence_verified_here: false`) instead of renaming the author's field. A host-verified acceptance would need a host artifact contract this task does not own. |
| **`family` is validated but decides nothing, and `OPTIONAL_FAMILIES` is dead** (reviewer defect 9) | Coverage evidence, and a deliberate constraint: making an optional family imply `optional: true` would refuse definitions the author's own suite builds from one helper (`conformance.test.mjs:176-193`, where the optional flags are set per adapter). Recorded for the programme owner. |
| **`UNPROVEN` is a declared adapter state that no path sets** | Coverage evidence: the state vocabulary is published data; `DISABLED`/`UNAVAILABLE` are the states an absent product reaches. |
| **The harness cannot verify an installation or a run** | It can only check shapes, typing and refusal behaviour. "probe reports installation honestly" remains the adapter author's declaration; the payload now reports `install_state` from the adapter's own probe and the acceptance carries the declaration flags, so a reader can tell what was verified here (`nothing`) from what was declared. |
| **`startup_blocked: false` / `unrelated_connectors_blocked: []`** | Structural truths of a report that only reads adapters and starts nothing. They are claims about this call, and the report now also carries the per-adapter `install_state` that makes its `usable` list honest. |
| **The fault and history ledgers are unbounded** | Retention is not scoped by the workbook; accessors return frozen copies, `faults()` is the active ledger and `faultHistory()` the retained record. A retention policy would be a new surface. |
| **A connector's own handlers are trusted code** (the SDK isolates their faults, not their honesty) | The adapter runs in-process by construction; the SDK's job is to bound and isolate, which the fault ledger, installation state and typed refusals now do. |

## 6. Review-integrity note

The reviewer reported that the copy of the author's suite inside the frozen export changed at 15:38:50 while
it was working. That is expected and explained: the Correction host appends its regression block to that copy
to produce the pre-fix baseline (`pre-fix-baseline.txt`). The reviewer's own run reproduced exactly that
baseline (7 pass / 10 fail at the time; 7 pass / 19 fail once both blocks were in place). The **module** bytes
it judged were identical before and after every probe
(`connector-sdk.mjs` sha256 `3BCEBCE26B13D82FEF548BB308E8FD5B28C8431E5466643B10EFC40E187E0402`), and it
edited nothing in the frozen export.

## 7. Disclosure

- Three passes were pushed before the hosted run. Pass 1 repaired instants, the freezer, definition
  validation, the harness refusal checks, the result snapshot and the fault path; pass 2 repaired
  availability, acceptance provenance, fault revival and registry gating; pass 3 repaired the reviewer's
  residuals (hostile error reading, the withheld certificate, the stored handler record, per-adapter report
  isolation, fault identity). All eleven of the reviewer's material findings are either repaired above or
  recorded as an author-encoded boundary; nothing material was left open.
- My own errors are recorded, not hidden: the first `git archive | tar` freeze corrupted all four blobs and
  was redone with an archive file; and my inherited-handlers regression expected `MISSING_METHOD` where the
  plain-record rule correctly refuses with `INVALID_DEFINITION`, so the test was corrected and the
  discriminating case (a non-enumerable own method must still be stored and validated) was added.
- Repair scripts are anchor-guarded; each aborted cleanly on a mismatched anchor at least once before
  writing, and the byte-preserving `append-regressions.mjs` helper was used for every regression block.
- No billing refusal was recorded as a code failure; every hosted run in this task that started executed real
  steps.
