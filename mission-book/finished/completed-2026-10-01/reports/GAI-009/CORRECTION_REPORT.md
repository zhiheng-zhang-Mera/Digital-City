# GAI-009 Correction Report — General AI inside the Utopia Ask/Do and Action surface

```text
MISSION              = GAI-009 (General AI Gateway programme, task 9 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-009-utopia-surface-integration.md
CLAIM_COMMIT         = 0824d8e (Digital-City main, claim of GAI-009 Correction by Alien)
CLAIMED_AT           = 2026-10-01T05:14:22Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 8dfdf9edcf6f525797de964650b383a916271371
DEVELOPMENT_CI       = 36753891511-success-attempt-3
CORRECTION_BRANCH    = general-ai/GAI-009-utopia-surface-integration
CORRECTION_HEAD_SHA  = 4e65e265eba4bb346924d1c078955a587e9e199f
BRANCH_CI            = 36820218698-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = GAI-009 18 pass (7 author + 11 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   8dfdf9e (Mech)   run 36753891511   success
corrected head     4e65e26 (Alien)  run 36820218698   gateway-web success / android success
superseded head    c7155b3 (pass 1) run 36819337360   success (superseded by the second pass)
superseded head    96f3696 (pass 2) run 36819885150   success (superseded by the third pass)
```

The Development run id is the one the workbook recorded as `BLOCKED_GITHUB_ACCOUNT_BILLING`; it concluded
success once the Owner cleared the billing refusal, which is what made this Correction eligible
(`mission-book/reports/DEVELOPMENT_CI_RECOVERY_2026-10-01.md`). Three passes were pushed because the second
and third passes found further over-claims; each superseded head had its own green hosted run, and only the
final head is claimed as the Correction result.

## 2. Independent review method

The Development head was exported with `git archive`
(`D:\A-Utopia\.runtime\evidence\mission-book\GAI-009\frozen-8dfdf9e\`) and the branch blobs were verified
against their Git objects (`git hash-object` of each blob equal to `git rev-parse HEAD:<path>`) before any
review started. An independent adversarial reviewer was pointed only at that frozen export, told to read the
workbook first, and briefed that a false success and a false shared-state claim are the defects that matter
here (the module's own headline promise is "only a terminal accepted result is success" and "Action truth is
shared"). It returned 13 probes (`probes/probe-01..13*.mjs`), `probes/ALL-PROBES-OUTPUT.txt` and
`probes/FINDINGS.md` (`MATERIAL_DEFECTS_FOUND`, confidence high). My own pass-1 probe reproduced the
execution/provenance/instant mechanisms; the reviewer's non-overlapping findings drove the second and third
passes. The merged set is below, with the author-encoded ones recorded as boundaries.

## 3. Defects found and repaired — 13 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU,
13 audit not bound to its actor, 14 a claim not backed by the data).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **Nothing is reported as executed without a channel.** An admitted API call returned `executed: true` even when no execution port existed or the port threw | 8 | `executed: true` requires a configured execution port that actually ran; a missing port or a crashed port is a typed `BACKEND_NOT_READY` with `executed: false` | yes (`nothing is reported as executed without a channel…`) |
| 2 | **The API proposal's confirmation was not backed by the consent that authorised the run.** `confirmed` stayed `false` while the module reported the run executed | 10, 14 | the proposal is confirmed and applied from the admission consent (`confirmed_by_consent_ref`, `applied_at`) | yes (same test) |
| 3 | **The confirmed execution device was silently rewritten to the interaction device** in the executed payload | 10, 4 | `execution_device_ref` and `executed_on_device_ref` report the confirmed device while the UI endpoint stays the current device | yes (same test) |
| 4 | **A terminal result could be rewritten and a cancelled action resumed.** A late result turned a FAILED/CANCELLED action into a success | 14, 5 | the first terminal result is the action truth (`ACTION_TRUTH_IS_SHARED`), and a terminal action cannot be resumed | yes (`the first terminal result is the action truth…`) |
| 5 | **Provenance was checked with enumerable-key thinking.** Non-enumerable own secret fields and symbol-keyed secrets passed the secret scan, and class instances were accepted as provenance records | 1 | the scan uses own-key and symbol enumeration with a cycle-safe walk, and only a plain record may be stored | yes (`the advanced view keeps real identifiers…`) |
| 6 | **The policy, the clock and the freezer were unvalidated.** `web_first: 'yes'` was accepted, a shape-only instant was stored as evidence, an uncloneable value could reach storage before validation, and a crashing routing port escaped as a raw error | 3, 6, 9, 8 | the policy is validated (booleans, known keys, lists, `policy_ref`), instants must be real ISO-8601 round trips through one `atFrom` helper, the freezer is cycle-safe, and every port crash is a typed refusal | yes (`a crashing port is a typed refusal and instants are real`) |
| 7 | **Cancel was not absorbing.** A cancelled action could still be advanced by a device-switch proposal/confirmation, an API proposal, an attention projection or an API execution, and the API execution could run after cancellation | 5, 4 | one `requireLiveAction` guard on every state-advancing call (`proposeDeviceSwitch`, `confirmDeviceSwitch`, `proposeApiSwitch`, `projectAttention`, `executeApi`) refuses a terminal action | yes (`a cancelled action cannot be advanced…`, `a device-switch confirmation cannot revive a cancelled action`) |
| 8 | **One approved API proposal could execute twice.** The proposal was never consumed, so a second `executeApi` admitted and ran the API again | 11 | the approved proposal is single use: a second execution is refused `ACTION_TRUTH_IS_SHARED` before any admission or execution port call | yes (`an approved API proposal is consumed by its one execution`) |
| 9 | **An attention projection was claimed as canonical shared state even when the shared port returned nothing or refused.** `from_shared_state: true` / `gai_only_store: false` were published regardless, and the action was mutated before the port's answer was even read | 8, 5, 9 | the port's answer must be a plain object that is not `projected: false`; a crashed port is a typed refusal; the action is mutated only after the answer is accepted, and the claim follows it | yes (`a shared Attention port that refuses is refused…`) |
| 10 | **Success was claimable while canonical attention was outstanding.** The success guard keyed on the state name only, so an action resumed to RUNNING after projecting attention could be reported as a success while the backend was waiting for the user | 8, 2 | a success is refused while the attention ledger is non-empty (`backend_attention_required`), which is the module's own doc-stated rule ("unavailable/attention/failed states never are [success]") | yes (`success is refused while canonical attention is outstanding…`) |
| 11 | **The routing policy was decoration.** `deterministic_first` and `web_first` were validated, reported by `surfaceContract()` and read by no decision; `web_first_default_path` was a hardcoded `true` | 7, 8 | `deterministic_first: false` now skips the local matcher so the request enters GAI routing, and `web_first_default_path` is derived from the policy instead of asserted | yes (`the routing policy decides whether the local matcher runs first`) |
| 12 | **The canonical history did not name the device that acted.** `ASK_ACCEPTED` and `CONTROL_*` events recorded no actor, so the shared audit could not answer who did it | 13 | the acting device is recorded on both event families | yes (`the canonical history names the device that acted`) |
| 13 | **A device-switch confirmation could revive a finished action** (found while re-reviewing #7): the guard was applied to the proposal but not to its confirmation, which still set `RUNNING` and moved the execution device | 5 | the confirmation is guarded by the same terminal rule | yes (`a device-switch confirmation cannot revive a cancelled action`) |

## 4. Local test summary

```text
corrected module (4e65e26)           18 tests / 18 pass / 0 fail
development head 8dfdf9e             18 tests /  7 pass / 11 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 7 tests are unchanged and all 7 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\GAI-009\`: `frozen-8dfdf9e/` (byte-verified export),
`pre-fix-baseline.txt` (the 7/11 split above), `gate-root.log`, `gate-rooms.log`, `gate-city.log`,
`gate-promotion.log`, `gate-bilingual.log`, `ci-watch-4e65e26.txt`, the anchor-guarded repair scripts
(`patch-ask-do-facade.mjs`, `patch-ask-do-facade-2.mjs`, `fix-regressions.mjs`, `fix-import.mjs`,
`fix-plain-provenance.mjs`), `revert-ref-sequence.mjs`, the regression blocks (`regressions.block.txt`,
`regressions2.block.txt`, `regressions3.block.txt`), and the independent review's `probes/FINDINGS.md` with
13 probes and their combined output.

## 5. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **Canonical refs collide across facades** (`action:gai:<n>` / `history:gai:<n>` are minted per facade) | Author-encoded: the original suite pins the ref shape (`conformance.test.mjs:91`, `/^action:gai:\d+$/`) and *depends* on the collision — `:301` resolves `second.action_ref`, minted by a different facade, through `facade` and expects a frozen action, not `UNKNOWN_ACTION`. I implemented the module-wide sequence repair, it passed 17/18 and broke `:301`, so it was reverted (`revert-ref-sequence.mjs`). The finding is real and is recorded for the integration owner: two facades in one process can publish the same canonical ref. |
| **`confirmDeviceSwitch` carries no acting device** (reviewer defect 5) | Author-encoded: the original suite confirms a device switch with no `by_device_ref` (`conformance.test.mjs:133`). Repairing #13 records the actor where the contract passes one (ask and control); a device-switch confirmation still has no actor in the contract, so it is recorded rather than invented. |
| **`budget_shown_before_execution: true` is a literal** (reviewer defect 6) | Author-encoded at `conformance.test.mjs:157` and in the module's proposal payload. The flag is the contract's promise that the budget verdict is shown before execution; with no `checkBudget` port the verdict is `null` and the flag still reports the promise. Making it conditional would change the encoded contract, so the literal is recorded here as an over-claim of the *author's* contract, not of this repair. |
| **`SECRET_KEY_SHAPE` misses `authorization` / `cookie`** (reviewer defect 3 at `:105`) | The author's suite names `access_token` as the secret shape under test. Widening the key vocabulary is a security-contract decision (which header names are secret) owned by the Shared Core security policy, not by this module's Correction; recorded for that owner. |
| **`advanced()` may record provenance after a terminal result** | Deliberate: provenance is a record of what happened (provider/model/backend identifiers), never a state or a result. The terminal *result* is immutable (#4), and the author's suite records provenance after a run (`:108`, `:357`). A state advance is refused; a post-hoc evidence record is not. |
| **`partial_refs`, `history` and the journal are unbounded** | Retention is not scoped by the workbook; all accessors return frozen copies and the journal is a diagnostic. A retention policy would be a new surface, not a repair. |
| **Dead codes and unreachable states**: `DETERMINISTIC_MUST_STAY_LOCAL`, `BUDGET_MUST_PRECEDE_EXECUTION` are never thrown; `UNAVAILABLE` / `UNKNOWN` are not reachable through the current calls | Coverage evidence, not behaviour. `ACTION_TRUTH_IS_SHARED` was in this group and is now thrown by #4 and #8. |
| **The admission, execution, routing and attention ports are Core-owned** | This module neither owns nor can verify them; it validates what they return (plain answers, no crash escaping as a raw error) and refuses to claim canonical state when a port does not answer (#9). |

## 6. Review-integrity note

The reviewer reported that the *frozen* export's test file changed after it started. That is expected and
explained: the Correction host appends its regression block to the frozen export to produce the pre-fix
baseline (`pre-fix-baseline.txt`). The **module** bytes it judged were hash-verified stable across every
probe. Its 13-test run against the superset is the same 7 pass baseline reproduced here as 7 pass / 11 fail
once all eleven regressions were in place.

## 7. Disclosure

- Three passes were pushed. Pass 1 (6 mechanisms) came from my own probe; pass 2 (6 mechanisms) came from
  the independent review's non-overlapping findings (cancel not absorbing, replayable API proposal, false
  shared-state claim, success under outstanding attention, decorative policy, actorless history); pass 3
  (1 mechanism) came from re-reading my own pass-2 guard for the same class of hole.
- My own errors are recorded, not hidden: one pass-2 regression asserted the refusal detail of the
  `WAITING_CONFIRMATION` path, and my new attention guard ran before it — the module was arranged so the
  author's original refusal path still fires and the new guard covers the resumed case; the ref-sequence
  repair broke the author's `:301` and was reverted rather than forced. Both were fixed in the module or
  reverted, never by weakening an author assertion.
- Two repair scripts aborted before writing on a mismatched anchor count (the `TERMINAL_STATES` helper and an
  instant-site count); the counts were corrected and the scripts re-run. The `append-regressions.mjs`
  byte-preserving helper is used for every regression block, after two earlier PowerShell text round trips
  corrupted a suite in this session.
- No billing refusal was recorded as a code failure; every hosted run in this task that started executed real
  steps, and the final head's run shows `gateway-web` and `android` success with real steps.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
