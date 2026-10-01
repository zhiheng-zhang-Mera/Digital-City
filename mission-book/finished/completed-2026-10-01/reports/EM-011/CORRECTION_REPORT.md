# EM-011 Correction Report — DeepSeek Harness + Codex Reference Connectors

```text
MISSION              = EM-011 (Engineering Manager programme, task 11 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-011-deepseek-codex-reference-connectors.md
CLAIM_COMMIT         = 0a15850 (Digital-City main, claim of EM-011 Correction by Alien)
CLAIMED_AT           = 2026-10-01T03:31:17Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = cb3cad618e0dc8a147f2afcb5c7c81b4df998f62
DEVELOPMENT_CI       = 36750007584-success
CORRECTION_BRANCH    = engineering-manager/EM-011-deepseek-codex-reference-connectors
CORRECTION_HEAD_SHA  = dbf70fb3a9669dfd8b13598d981bb67ae92615cb
BRANCH_CI            = 36811902420-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-011 20 pass (7 author + 13 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   cb3cad6 (Mech)   run 36750007584   success
first-pass head    6c31dec (Alien)  run 36811376005   success   ← superseded by the review in §4
corrected head     dbf70fb (Alien)  run 36811902420   gateway-web success / android success
```

## 2. Independent review method

The Development head was exported with `git archive` (`D:\A-Utopia\.runtime\evidence\mission-book\EM-011\frozen-cb3cad6\`)
and all four branch blobs were verified against their Git objects before any review started:

```text
contracts/engineering-reference-connectors-v1/reference-connectors.mjs   MATCH 9db9eacc4a48e38478453bad6c4855edf9433b3b
contracts/engineering-reference-connectors-v1/index.mjs                  MATCH 02265d9362aafcfc8de61944d0c4b6eab2001f64
contracts/engineering-reference-connectors-v1/tests/conformance.test.mjs MATCH 08b2b325b267eca0a6c63402f7c84202297a5841
tests/engineering-reference-connectors.test.mjs                          MATCH b3f65e6bf0fd400238acdb838eaf39226324d82d
```

An independent adversarial reviewer was pointed only at that frozen export, told to read the workbook first and
briefed on the central risk for an adapter — fake success (claiming a capability, a submit or a completion the
backend never produced). It returned 13 probes and `probes/FINDINGS.md` with 14 mechanisms
(`MATERIAL_DEFECTS_FOUND`, high confidence; module bytes unchanged throughout). My own review ran in parallel.
The two sets were merged by mechanism: seven overlapped, eight were the reviewer's own and are the second pass
in §4, and two are author-encoded contracts recorded as boundaries in §6.

The reviewer's own summary is the honest framing of this task: the module's *verification* edge (install,
auth, capability, unknown-outcome) is genuinely honest and survived every attack; its *action* edge
substituted its own success for the adapter's answer.

## 3. First pass — 8 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **A refused submit was reported as submitted.** `runtime.submit`'s answer was discarded: a backend returning `{submitted: false}`/`{accepted: false}`, or a submit channel that threw, still produced `submitted: true` and recorded a submission | 8, 12 | an explicit refusal or a throwing channel is a typed `REFUSED` and records nothing | yes |
| 2 | **A correlation reference was invented.** With no backend `result_ref`, the module synthesised `session:...:operation` and published it as the result correlation while claiming `provenance_only_backend_ids: true` | 8 | the canonical job id is the identity; `result_ref` is null unless the backend produced one (`backend_result_ref_known`) | yes |
| 3 | **A refused control was reported as applied and closed the session** | 8, 12 | a refusal or a throwing control is `REFUSED`, nothing is applied, the session stays open | yes |
| 4 | **A refused or throwing start still created a session**, and a caller-supplied `backend_run_ref` was accepted unvalidated | 5, 8 | a refusing/throwing start is `REFUSED` with no session created; the provenance ref must be text or null | yes |
| 5 | **An unreadable event stream became an empty stream**, so a failed read looked like a quiet run | 8, 10 | a non-list answer is `INVALID_RUNTIME`, a throwing channel is `REFUSED`; a genuinely empty list is still empty | yes |
| 6 | **A result about another backend run was attributed to this job** | 4 | a declared run that differs makes the outcome `UNKNOWN` with `correlation_mismatch: true` | yes |
| 7 | **Acceptance could be fabricated**: three refs that could be the same reference repeated, and an absent `terminal_state` defaulted to `SUCCEEDED` | 8 | three *distinct* stage refs and a terminal state the runtime reported; otherwise the deferred marker | yes |
| 8 | **Instants were shape-only and caller `at` was recorded verbatim** at all seven sites plus both clocks | 6 | `isIsoInstant` requires a real instant, both clocks are validated, every `at` goes through one helper | yes |

## 4. Second pass — the independent review's non-overlapping findings

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 9 | **Acceptance could be claimed for a product this host had probed `NOT_INSTALLED`** — the report never consulted the install state, so a fabricated evidence object on a host with no product was presented as component-stage acceptance | 8 | acceptance requires an `INSTALLED` install state as well as genuine evidence | yes |
| 10 | **A closed session was still reported as live work.** After a `CANCEL` the session was `CLOSED` but `result()` reported the backend's stale `RUNNING` | 4, 10 | a closed session with no terminal backend state reports `CANCELLED` (`session_closed: true`) | yes |
| 11 | **The canonical job id could not address `control`/`events`/`result`** (only `submit`), and the control response carried no backend reference — directly against the acceptance bullet "cancel/interrupt and result correlation use the canonical job ID plus backend refs" | 7, 10 | all three resolve by session ref *or* canonical job ref, and their responses carry `backend_run_ref` | yes |
| 12 | **One logical action could execute twice.** The `action_key` dedupe lived in `session.submits`, so a cancel plus re-attach created a fresh session with no memory and the same action ran the backend again | 11 | the guard lives on the connector (`action_submissions`), so it outlives one session | yes |
| 13 | **The connector kind lookup was prototype-chain membership**: `kind: 'constructor'`/`'toString'`/`'__proto__'` passed the `UNKNOWN_KIND` check and then threw an untyped `TypeError` deeper in construction | 1 | the lookup requires an own key | yes |
| 14 | **A crashing provider channel escaped as an untyped error.** A throwing `probe` reached the caller as an `Error`, so a provider crash was neither a typed failure nor attention | 9, 12 | a throwing probe degrades to `UNKNOWN` install state with `probe_failed: true` and a `PROBE_FAILED` journal entry; a throwing auth channel is `UNKNOWN`; `startOrAttach` then refuses with the typed `NOT_READY` | yes |
| 15 | **An under-specified connector poisoned the registry.** `register` guarded only `connectorKind`/`capabilities`, so a connector without `readiness`/`acceptanceReport` registered fine and later made `acceptanceSummary()`/`selectForCapability({ready_only})` throw a `TypeError` | 9 | registration requires the methods the registry actually calls | yes |
| 16 | **`acceptanceSummary().emulated_acceptance_claimed` was hardcoded `0`**, so a connector that claimed component acceptance from an emulated source was listed as accepted with the counter still at zero | 8 | the counter is derived from the reports | yes |

Also repaired as defence in depth (no dedicated regression): canonical objects must be plain (prototype
`Object.prototype` or `null`), and the freezer carries a visited set so a self-referential value cannot
overflow the stack.

## 5. Local test summary

```text
corrected module                    20 tests / 20 pass / 0 fail
development head cb3cad6            20 tests /  7 pass / 13 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 7 tests are unchanged and all 7 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\EM-011\`: `frozen-cb3cad6/` (byte-verified export),
`prefix-test.log` (the corrected suite against the Development head), `gate-EM-011.log`,
`patch-connectors.mjs` and `patch-connectors-2.mjs` (the anchor-guarded repair passes; both aborted cleanly on
a mismatched anchor at least once before writing), plus the independent review's `probes/FINDINGS.md`,
13 probes and its run log.

## 6. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **Acceptance evidence is a runtime declaration** (`real: true` plus three references) that is not correlated with a session/submission the connector performed | Author-encoded: `conformance.test.mjs:266-274` asserts acceptance for a connector that never started a session, so requiring correlation would contradict the encoded contract. What *was* repaired is everything the module can check on its own: the install state (#9), three distinct stage references and a genuinely reported terminal state (#7). Correlation needs an owner decision about what a runtime's evidence must reference. |
| **An action-keyless submit has no duplicate protection** | The action key is the caller's idempotency declaration; the author's suite asserts that a *different* key is a new submission (`conformance.test.mjs:245-246`). The duplicate path reports `duplicate: true` honestly, and #12 now makes the guard survive a re-attach. |
| **`submit` reports `state: 'RUNNING'` immediately after an accepted submission** | `result()` is the outcome authority and reports `UNKNOWN` when it cannot; the immediate `RUNNING` is the submission state the author's suite encodes (`conformance.test.mjs:162`). |
| **The connector `policy` is accepted and mostly unread** (`required_capabilities`, `max_journal_entries`) | The workbook does not define a required-capability policy for the adapter, and journal pruning belongs to a metrics decision that no acceptance bullet asks for. It is recorded as a declared-but-unread input rather than invented behaviour; the journal is exposed read-only through `journal()`. |
| **The registry's `selectForCapability({ ready_only })` is opt-in** | Resolution by capability is the documented default and the author's suite asserts it; a caller that needs a ready connector asks for one. The response now names a specific connector rather than silently implying readiness. |
| **`EMULATED_SMOKE_IS_NOT_ACCEPTANCE`, `ACCEPTANCE_NOT_PROVEN`, `OUTCOME_UNKNOWN`, `PROVENANCE_REQUIRED` and `DUPLICATE_SUBMIT` are declared and (mostly) unthrown** | The corresponding conditions are reported through flags, the deferred marker and typed `REFUSED`/`INVALID_RUNTIME` refusals instead of exceptions; the vocabulary stays for a future stricter revision. Coverage evidence. |
| **The DeepSeek descriptor names the donor repository** while `donor_is_runtime_requirement: false` | DS-Hns is donor evidence only: the module imports nothing, holds a string, and the author's suite asserts the flag (`conformance.test.mjs:294`). |

## 7. Provider acceptance status

No real-provider smoke is claimed. No DeepSeek Harness or Codex product was run on this host during the
Correction, so component-stage acceptance stays deferred
(`REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION`) and **the exact proof of a real
submit → progress → terminal run is deferred to programme integration**. The stricter rules added in #7/#9
make that deferral the honest default: an emulated or uninstalled path can no longer produce a component-stage
acceptance claim at all.

## 8. Disclosure

- The independent review's probe run finished while the first pass was being reported; its non-overlapping
  findings are the second pass above, and the workbook was marked complete only after both passes were green
  on the same head.
- My own assertions were wrong twice during this pass and were fixed in the tests, not the module: an
  assertion that called `result()` with an invalid `at` expecting a silent fallback (the module refuses it
  correctly), and a second-pass anchor that did not match the file's indentation — the anchor guard aborted
  before writing, which is what it exists for.
- One first-pass defect was found by the reviewer rather than by me in its immediate form (a control that
  closed the session on a refusal); my own probe had found the same mechanism through the submit path, so the
  merge caught the second call site.
- Dependency installation is part of the gate procedure in a fresh Correction worktree
  (`pnpm install --frozen-lockfile` at the root and under `city/`). No billing refusal was recorded as a code
  failure; every hosted run in this task that started executed real steps.
