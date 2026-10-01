# EM-013 Correction Report — Shared Task Core + Utopia Engineering Control Surface Integration

```text
MISSION              = EM-013 (Engineering Manager programme, task 13 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-013-utopia-task-surface-integration.md
CLAIM_COMMIT         = b8546cd (Digital-City main, claim of EM-013 Correction by Alien)
CLAIMED_AT           = 2026-10-01T05:50:03Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 5920e8076d317e15142b7d16c8531e529ce587f0
DEVELOPMENT_CI       = 36753243377-success-attempt-3
CORRECTION_BRANCH    = engineering-manager/EM-013-utopia-task-surface-integration
CORRECTION_HEAD_SHA  = 0ef455eabbdf54a7edfd975fa0fe82eb89690ca6
BRANCH_CI            = 36822830353-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-013 26 pass (6 author + 20 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   5920e80 (Mech)   run 36753243377   success
corrected head     0ef455e (Alien)  run 36822830353   gateway-web success / android success
superseded head    2430744 (pass 1) run 36822173187   success (superseded by the second and third passes)
```

The Development run id is the one the workbook recorded as `BLOCKED_GITHUB_ACCOUNT_BILLING`; it concluded
success once the Owner cleared the billing refusal, which is what made this Correction eligible
(`mission-book/reports/DEVELOPMENT_CI_RECOVERY_2026-10-01.md`).

## 2. Independent review method

The Development head was exported with `git archive --format=tar -o …` and extracted
(`D:\A-Utopia\.runtime\evidence\mission-book\EM-013\frozen-5920e80\`); all four branch blobs were verified
against their Git objects (`git hash-object` == `git rev-parse <head>:<path>`, all MATCH) before any review
started. An independent adversarial reviewer was pointed only at the frozen export, told to read the control
book first, and briefed that a **false shared-state claim**, a **false success**, **duplicate execution** and
**secret leakage** are the defects that matter here. It returned 20 probes,
`probes/ALL-PROBES-OUTPUT.txt` and `probes/FINDINGS.md`: `MATERIAL_DEFECTS_FOUND: 14`, confidence high. It also
recorded three hypotheses it had set out to prove and then **disproved** (no partial mutation in
`applyResult`, no per-device job copy, `__proto__` refused as secret), which is the kind of evidence a review
should carry. My own read produced twelve of the same findings before its report arrived; the merged set is
below.

## 3. Defects found and repaired — 16 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU,
13 audit not bound to its actor, 14 a claim not backed by the data).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **The canonical binding was switchable off.** `policy` was spread unvalidated, so `require_canonical_task: false` (or `0`, `'no'`, `null`) let a job with no canonical task be created and still report `SHARED_TASK_CORE`; the attention source list could be repointed while `attention_from_shared_state` stayed true; unknown keys were retained | 7, 3, 8 | the policy is validated (known keys, types, `policy_ref` text), the canonical binding cannot be disabled, and attention may only come from `SHARED_CORE_ATTENTION` | yes |
| 2 | **The surface asserted shared truth it never obtained.** `task_truth_source: 'SHARED_TASK_CORE'`, `manager_creates_canonical_truth: false`, `execution_responsibility: 'OBTAINED_FROM_SHARED_TASK_CORE'` and `from_shared_state: true` were literals over the surface's own maps, with unverified caller strings for the task and lease | 2, 8, 14 | an optional `taskCore.confirmBinding` seam confirms the canonical task and the lease before a job exists (a refusal or a crash refuses the job); every payload now states `canonical_binding_confirmed_by_core`, `task_truth_verified_here`, `lease_verified_here` and the responsibility source; `from_shared_state` is derived from the projected entries | yes |
| 3 | **A finished job could be re-opened for attention**, and an already acknowledged question was reset to `PENDING`, duplicated in `attention_refs` and re-delivered | 5, 2, 8 | a terminal job refuses a projection, a canonical `attention_ref` is written once (`ALREADY_ACKNOWLEDGED` / `DUPLICATE_JOB`), and `blocking` must be a boolean | yes |
| 4 | **ATTENTION_REQUIRED was not a gate.** `progress()` and `control(RESUME)` proceeded while a blocking canonical question was pending, and `status()` carried no attention fact | 1, 5, 8 | progress and resume are refused with `ATTENTION_REQUIRED` while a blocking projection is pending, and the projection carries derived `attention_required` / `shows_success` | yes |
| 5 | **Control, approval and acknowledgement authority was unbound.** Any caller-declared device — or none, or a device from the execution host — could cancel, pause, resume or approve, and an approval was an unattributed boolean | 4 | `submit` accepts `authorized_devices` (default: the interaction device); control requires an authorized device; an approval names its actor and must be connected to the job; an acknowledgement may only come from a device connected to the job | yes |
| 6 | **A terminal result was rewritable and `accepted: true` was published for failures.** A second result could rewrite SUCCEEDED → FAILED, artifacts accumulated, malformed artifacts were silently dropped while the result carried the *unfiltered* array, and `result.accepted` was true for a REFUSED job with no result | 1, 5, 8 | the first terminal result is the job truth, artifacts must be an array of canonical references (refused, not dropped), the result carries the validated artifacts, and `accepted` is true only for a success while `accepted_as_truth` carries the truth claim | yes |
| 7 | **Success was claimable while the backend was attention-required** — `applyResult(SUCCEEDED)` proceeded with a pending blocking question | 1, 8 | SUCCEEDED is refused while a blocking attention is pending (`backend_attention_required`), and `shows_success` stays false | yes |
| 8 | **Provenance was not reference-only and the secret scan was blind.** `Object.entries` missed non-enumerable and symbol-keyed secrets, Maps/Sets were not scanned, class instances and unreadable records passed, the key vocabulary missed `authorization`/`cookie`/`bearer`/`x-api-key`/`refresh_token`, and an arbitrary object under a whitelisted `*_ref` key was stored and returned while the surface reported `contains_secret_material: false` | 1, 6, 8 | a strict plain-record rule, an own-key/symbol-aware cycle-safe scan that also reads Maps (including secret-shaped keys) and Sets and *reports* records it cannot read, a widened secret vocabulary, and provenance values must be references or null | yes |
| 9 | **Instants were shape-only and a caller `at` was never validated** (`2026-13-45T99:99:99Z` was accepted at every site) | 6 | one real-instant round trip (`isRealInstant`) behind `isIsoInstant` and one validated `atFrom` helper at every site | yes |
| 10 | **The freezer was cycle-unsafe and storage errors were raw** (`RangeError` on a cycle, `DataCloneError` on an uncloneable artifact) | 9, 7 | a `WeakSet`/descriptor freezer and a `cloneOrRefuse` helper that turns a clone failure into a typed `INVALID_REQUEST` | yes |
| 11 | **Audit entries named neither subject nor actor.** Acknowledgement records carried no job, and `JOB_CONTROLLED` records carried no acting device | 13 | acknowledgement records carry `job_ref`/`subject_ref`; the control journal entry carries `by_device_ref` | yes |
| 12 | **The separation claim compared two entity kinds, and a missing execution device became the connector reference.** `owner_and_executor_separated` compared an owner ref with a *device* ref (so it was almost always true), and `executor_device_ref` defaulted to the connector ref | 8, 1, 14 | separation is derived between the logical owner and the executor connector (`executor_connector_is_logical_owner`), and an unreported execution device stays `null` | yes |
| 13 | **Canonical refs collided across surfaces** (`event_ref`/`proposal_ref` came from a per-surface counter), a re-approval was silent, and one lease could be claimed by several jobs | 8, 11 | refs come from one process-wide sequence, a re-approval reports `duplicate`, and a lease reference belongs to one job | yes |
| 14 | **An approval rewrote the local eligibility verdict** (`eligibility = 'REMOTE_REQUIRED'`), erasing the computed LOCAL_THROTTLED fact | 8, 14 | the verdict is preserved; the approval records `local_eligibility_verdict` and `effective_execution_target: 'REMOTE'` | yes |
| 15 | **Hardcoded claims that no decision reads** (`duplicate_execution: false`, `user_navigated_to_execution_host: false`, `provenance_is_secret_free: true`, …) | 8, 7 | the structural claims are scoped (`claims_scope: 'SURFACE_STRUCTURE'`, `claims_verified_here: false`, `task_truth_verified_here: false`), and control now also reports the derived `controlled_from_execution_device` so a control from the execution host is visible rather than implied away | yes |
| 16 | **The secret scan treated a secret-shaped Map key as a benign path segment** (found while repairing #8): a `Map` carrying `['token', …]` was walked without naming the key | 1 | a secret-shaped Map key is reported like a secret-shaped object key | yes |

## 4. Local test summary

```text
corrected module (0ef455e)           26 tests / 26 pass / 0 fail
development head 5920e80             26 tests /  6 pass / 20 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 6 tests are unchanged and all 6 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\EM-013\`: `frozen-5920e80/` (byte-verified export),
`pre-fix-baseline.txt` (the 6/20 split above), `gate-surface.log`, `gate-root.log`, `gate-rooms.log`,
`gate-city.log`, `gate-promotion.log`, `gate-bilingual.log`, the anchor-guarded repair scripts
(`patch-control-surface-1.mjs`, `-2.mjs`, `-3.mjs`, `-3b.mjs`, `fix-regression-refs.mjs`,
`fix-regression-secret.mjs`), the regression blocks (`regressions.block.txt`, `regressions3.block.txt`), and
the independent review's `probes/FINDINGS.md` with 20 probes and their combined output.

## 5. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **One canonical task may still be bound to two jobs** (reviewer defect 8, first half) | Author-encoded: the original suite binds the *same* `canonical_task_ref` to two jobs from one helper (`conformance.test.mjs:114` and `:209`, both using the default `task:canonical-1`) and asserts both exist. Refusing a second job for one canonical task would break the encoded contract, so the finding is recorded for the integration owner: two `job_ref`s on one canonical task is the duplicate-execution door the suite currently permits. The lease half of the same finding is repaired (#13). |
| **`execution_responsibility: 'OBTAINED_FROM_SHARED_TASK_CORE'` stays the literal label** (reviewer defect 1) | Author-encoded at `conformance.test.mjs:51`. My first attempt made the label conditional and broke that assertion, so the label is kept and the verification status is stated in the adjacent fields (`canonical_binding_confirmed_by_core`, `task_truth_verified_here`, `lease_verified_here`, `execution_responsibility_source`). |
| **The surface keeps its own jobs/attention maps and needs no core to work** (reviewer defect 1) | Structural and deliberate: this component *is* the control surface, and the workbook's rule is that it must not create competing canonical truth or a second *global* attention database. Attention may only be projected from the shared allow-list, the index is in-process and non-persistent, and the payload now distinguishes what a core confirmed from what a caller declared. A mandatory core port would break the encoded suite; the seam exists as `taskCore`. |
| **`EXECUTOR_NOT_SEPARATED` is still never thrown** | The logical owner may legitimately be the executor connector; the fact is reported (`executor_connector_is_logical_owner`) rather than refused. Coverage evidence for the declared code vocabulary. |
| **A non-blocking attention projection does not gate progress or resume** | Only a *blocking* canonical question gates the job; a non-blocking projection is a notice that is still visible as `attention_required: true` in the projection. This follows the workbook's `blocking` semantics rather than collapsing the two cases. |
| **The job/attention/fault ledgers are unbounded, and `status()` keeps its structural flags** | Retention is not scoped by the workbook; read accessors return frozen copies, and the structural flags live under the explicit `claims_scope: 'SURFACE_STRUCTURE'`. |

## 6. Review-integrity note

The reviewer reported that the copy of the author's suite inside the frozen export changed while it was
working. That is expected and explained: the Correction host appends its regression block to that copy to
produce the pre-fix baseline (`pre-fix-baseline.txt`). Its own run reproduced exactly that baseline
(6 pass / 12 fail at the time; 6 pass / 20 fail once the third block was in place). The **module** bytes it
judged were identical before and after every probe (`control-surface.mjs` sha256
`2A71A6A6085952D912B986A3BC83AC9BE6C0B7A532BD562FB370C5DD36BF928A`), and it edited nothing in the frozen
export.

## 7. Disclosure

- Three passes were pushed before the hosted run. Pass 1 repaired the policy floor, the instants, the freezer,
  the secret scan, the control authority, the retry/terminal rules, the projection honesty and the reference
  sequences; pass 2 repaired the eligibility preservation, the derived attention/success facts and the
  duplicate-approval report; pass 3 repaired the reviewer's remaining findings (terminal/re-projection guards,
  the attention gate, approval and acknowledgement authority, reference-only provenance, the task-core seam,
  typed clone failures, result acceptance honesty, claim scoping). Twelve of the reviewer's fourteen findings
  are repaired in the module; the other two (canonical-task uniqueness, the author-encoded responsibility
  label) are recorded above with their suite evidence.
- My own errors are recorded, not hidden: the first pass made `execution_responsibility` conditional and broke
  the author's encoded assertion (fixed by keeping the label and adding the verification flags); my
  ref-uniqueness regression proposed a fallback on a `LOCAL_ALLOWED` job and was corrected in the test; my
  nested-secret provenance regression asserted the wrong code and was corrected in the test; and the Map-key
  secret case needed a real fix in the scanner rather than a test change.
- Repair scripts are anchor-guarded and one aborted cleanly (the `isIsoInstant` anchor) before writing anything;
  the byte-preserving `append-regressions.mjs` helper was used for every regression block.
- No billing refusal was recorded as a code failure; every hosted run in this task that started executed real
  steps.
