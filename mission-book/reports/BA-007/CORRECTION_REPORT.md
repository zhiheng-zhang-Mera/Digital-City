# BA-007 Correction Report — Assistant Settings + Interaction Surface

```text
MISSION              = BA-007 (Butler Assistant programme, task 7 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-007-settings-interaction-surface.md
CLAIM_COMMIT         = ceb20c9 (Digital-City main, claim of BA-007 Correction by Alien)
CLAIMED_AT           = 2026-10-01T04:45:32Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 8fa4686bb7acb2b57a34a00fe517f6ecaad9769f
DEVELOPMENT_CI       = 36752540378-success-attempt-3
CORRECTION_BRANCH    = assistant/BA-007-settings-interaction-surface
CORRECTION_HEAD_SHA  = f8f15af835e6ea04921142403c1c33584364d451
BRANCH_CI            = 36817491957-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = BA-007 18 pass (6 author + 12 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   8fa4686 (Mech)   run 36752540378   success
first-pass head    14272f6 (Alien)  run 36817130742   success   ← superseded by the review in §4
corrected head     f8f15af (Alien)  run 36817491957   gateway-web success / android success
```

The Development head's run was the same id the workbook had recorded as
`BLOCKED_GITHUB_ACCOUNT_BILLING`; after the Owner cleared the billing refusal it concluded success with both
jobs executing real steps, which is why the task became eligible. That recovery is recorded in
`mission-book/reports/DEVELOPMENT_CI_RECOVERY_2026-10-01.md`.

## 2. Independent review method

The Development head was exported with `git archive` (`D:\A-Utopia\.runtime\evidence\mission-book\BA-007\frozen-8fa4686\`)
and all four branch blobs were verified against their Git objects before any review started:

```text
contracts/assistant-settings-surface-v1/index.mjs                  MATCH
contracts/assistant-settings-surface-v1/settings-surface.mjs       MATCH
contracts/assistant-settings-surface-v1/tests/conformance.test.mjs MATCH
tests/assistant-settings-surface.test.mjs                          MATCH
```

An independent adversarial reviewer was pointed only at that frozen export, told to read the workbook first,
and briefed on the surface's own risk (a settings write that silently does not do what it says). It returned
13 probes and `probes/FINDINGS.md` with 12 reproduced mechanisms (`MATERIAL_DEFECTS_FOUND`, high confidence;
the module bytes were hash-verified unchanged throughout). My own probe
(`probes-alien/probe-alien-ba007.mjs`) reproduced eight. The two sets merged by mechanism: six overlapped, six
were the reviewer's own and are the second pass in §4, and three of the reviewer's are author-encoded
contracts recorded as boundaries in §6.

## 3. First pass — 8 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU,
13 audit not bound to its actor, 14 a bounded claim that is not backed by the data).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **Editable field values were never typed.** `display_name: 42`, `display_name: ''`, `verbosity: {evil: true}` and `locale: ['x']` all landed in the canonical profile, and an explicit `undefined` silently cleared a field while still being listed as changed | 2, 8 | each editable field carries the kind its name promises (nonempty text, a declared mode, a reference or null, a token or null) and an explicit `undefined` is refused | yes |
| 2 | **A change the surface could not read was dropped in silence.** A symbol key or a non-enumerable own key passed the allow-list, was dropped by the clone, and the call still returned `committed: true`; a hidden `user_name` bypassed the Digital-Me classification | 1, 8, 10 | the shape is decided on the object itself with `Reflect.ownKeys`; unreadable fields are refused, Digital-Me fields keep `DIGITAL_ME_IS_READ_ONLY` | yes |
| 3 | **The version guard was caller-switchable.** `policy.profile_version_required: false` (or any non-`true`) disabled optimistic concurrency, so two writers at version 1 both landed and the loser was never told | 3 | the policy is validated and the guard cannot be switched off | yes |
| 4 | **Re-registering a device discarded the user's binding.** It overwrote the record (reverting a foreground switch to the registered assistant and resetting an observed `STALE` state to the registered one, after which `assertFresh` reported fresh), and `executor_for`/`last_seen_at` were unvalidated | 5, 8, 10 | a conflicting re-registration is refused; a same-binding refresh keeps the binding; `executor_for` must be a list of task refs and `last_seen_at` a real instant | yes |
| 5 | **An unreadable task vanished while the view claimed nothing was hidden.** A task without a `task_ref` appeared in neither list, and `background_tasks_hidden` was the literal `false` | 8, 10 | unreadable tasks are reported in `unreadable_tasks` and the flag is derived from them | yes |
| 6 | **The committed-update cursor was unvalidated.** `since_profile_version: NaN` or `'x'` answered "nothing to synchronise" | 6 | the cursor must be a non-negative integer | yes |
| 7 | **Instants were shape-only** (`isIsoInstant('2026-13-45T99:99:99Z') === true`) and caller `at`/`last_seen_at` were recorded verbatim | 6 | the helper and the clock require a real instant and every caller instant is validated | yes |
| 8 | **Canonical records accepted non-plain objects and the freezer was cycle-unsafe**; `registerAssistant` did not validate the fields it stored | 1, 9 | plain-prototype requirement, cycle-safe freezer, and the same field rules at registration as at edit | yes |

## 4. Second pass — the independent review's non-overlapping findings

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 9 | **Freshness was the caller-declared state string alone.** `last_seen_at` was never compared with `now`, so a device observed long ago with `state: 'FRESH'` reported `stale: false` and `assertFresh().fresh_confirmed: true` | 6, 8 | freshness is the declared state **and** an observation inside `policy.stale_after_ms`; the stale indicator names the reason and the age | yes |
| 10 | **Two projections of one device disagreed about authority.** `embodimentsOf` reported `cached_view_is_authoritative: true` for the same device+state that `surfaceView` and `assertFresh` call cached | 10 | a projection never claims to be current authority; it reports the declared state and the freshness window | yes |
| 11 | **A committed update carried field names only, and the audit had no actor or before/after.** Another embodiment could not apply the propagation from the record, and `PROFILE_COMMITTED` omitted the versions and fields | 13, 14 | the update carries `changed` and `previous_values`, an optional `actor_ref` (recorded as `actor_known: false` when unnamed), and the journal entry carries the versions, fields and actor | yes |
| 12 | **A cached view could originate a handoff.** `requestHandoff` never consulted freshness, so responsibility could be moved on the strength of a stale cache; a foreground switch on a stale device was recorded as if authoritative | 4, 6 | a handoff from a non-fresh device is refused (`STALE_CACHE_IS_NOT_AUTHORITY`) and a switch taken from a cache is recorded as provisional (`binding_from_cached_view`, `requires_authoritative_revalidation`) | yes |
| 13 | **A truthy non-boolean task `foreground` was inverted to background**, and the owner/executor role was a literal even when both references were null | 7, 8 | `foreground` must be a boolean (a truthy stand-in is reported as unreadable, `NON_BOOLEAN_FOREGROUND`) and the role reflects whether the references are known | yes |
| 14 | **An untypeable value reached the registry before validation.** A function/symbol value in a stored field made `clone`/`freeze` throw an untyped `DataCloneError` **after** the record and journal were written — no rollback, a retry read as `DUPLICATE_ASSISTANT`, and `listAssistants` then threw forever; a cyclic change was an untyped `RangeError`; the refused edit had already consumed the update counter | 5, 9 | every stored value is typed before anything is written, the freezer is cycle-safe, and a refused edit consumes no update reference | yes |

## 5. Local test summary

```text
corrected module                    18 tests / 18 pass / 0 fail
development head 8fa4686            18 tests /  6 pass / 12 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 6 tests are unchanged and all 6 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\BA-007\`: `frozen-8fa4686/` (byte-verified export),
`prefix-test.log`, `gate-BA-007.log`, `patch-settings-surface.mjs` and `patch-settings-surface-2.mjs` (the
anchor-guarded repair passes), `probes-alien/probe-alien-ba007.mjs`, and the independent review's
`probes/FINDINGS.md` + 13 probes.

## 6. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **A committed update is the propagation record, but the author's suite never asserts its values** (reviewer D1) | Adding `changed`/`previous_values` was additive and is repaired (#11); what stays as the author encoded it is that `committedUpdates` is *the* propagation path, so a reader must apply `changed` rather than re-read a profile snapshot. Recorded for the integration owner. |
| **A foreground switch on a non-fresh device is allowed, a handoff is refused** | Judgement call, recorded: the workbook frames foreground switching as a UI operation that transfers nothing, so it stays usable and is marked provisional; a handoff moves responsibility, so a cached view may not originate one. The alternative (refusing both) would make an offline device unable to switch what it shows. |
| **The audit's actor is optional** (`actor_ref`, `actor_known: false` when unnamed) | The module has no caller-identity concept and the author's suite edits profiles without one (`conformance.test.mjs:66`), so requiring an actor would break the encoded contract. The record now states honestly that the actor is unknown instead of implying one. |
| **`requestHandoff` compares `task_ref` with nothing** (reviewer D7 half) | The module owns no task truth: BA-004 applies the handoff and validates the task. The record says `applied_by: 'BA_004_HANDOFF'` and `requires_recipient_acceptance: true`; those are declarations about the request, not claims that responsibility moved. |
| **`applied_by`, `transfers_no_authority`, `requires_recipient_acceptance` are literals** (reviewer D10 half) | They describe the record this module emits, not applied BA-004 state; nothing in this module mutates a task. Recorded so the integration step verifies them against BA-004 rather than trusting them. |
| **The journal and `committedUpdates` are unbounded** | Retention/pruning is a metrics decision the workbook does not scope here; the lists are exposed read-only (`journal()`, `committedUpdates()`) and a caller can page them by `since_profile_version`. |
| **Inert vocabulary**: `TASK_HANDOFF_NOT_AUTOMATIC`, `NO_COMMITTED_UPDATE` and `FOREGROUND_SWITCHED_WITHOUT_HANDOFF` are declared but never thrown | The corresponding facts are reported as fields (`produces_task_handoff: false`, `handoff_must_be_requested_separately: true`) rather than exceptions; the codes stay for a stricter revision. Coverage evidence. |

## 7. Disclosure

- The first pass (head `14272f6`, run 36817130742) was green before the independent review returned; its
  non-overlapping findings are the second pass above, and the workbook was marked complete only after both
  passes were green on the same final head.
- Two of my own tooling mistakes are recorded rather than hidden: a PowerShell string round trip corrupted an
  intermediate encoding of the suite twice during this task, and both times I restored the pristine bytes from
  Git and re-applied the change through Node scripts that preserve bytes (the regression block was salvaged
  from the corrupt copy by its ASCII marker). No test assertion or module line was lost, and the second
  occurrence is why the remaining repair passes use the byte-preserving `append-regressions.mjs` helper.
- The reviewer observed the frozen *suffix* change while it was running (I append the Alien regressions to the
  frozen export to produce the pre-fix baseline); the **module** bytes it judged were verified unchanged, and
  the module hash is quoted in its report.
- A frozen-export dependency install is part of the gate procedure in a fresh Correction worktree
  (`pnpm install --frozen-lockfile` at the root and under `city/`). No billing refusal was recorded as a code
  failure; every hosted run in this task that started executed real steps.
