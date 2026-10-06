# EM-003 Correction Report — Engineering Job / Event / Result / Artifact Protocol

```text
MISSION              = EM-003 (Engineering Manager programme, task 3 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-003-job-result-artifact-protocol.md
CLAIM_COMMIT         = 975f7c7 (Digital-City main, claim of EM-003 Correction by Alien)
CLAIMED_AT           = 2026-09-30T14:30:15Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 8c16cfc266a9869ace2c059f7959322282285663
DEVELOPMENT_CI       = 36721305141-success-both-required-jobs
CORRECTION_BRANCH    = engineering-manager/EM-003-job-result-artifact-protocol
CORRECTION_HEAD_SHA  = ffbdbce981d7dd5d8a556231e658f9cc522a31b9
BRANCH_CI            = 36731144219 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = EM-003 22 pass, root 123 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 8c16cfc2, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews. The revision under review was exported to a byte-verified immutable path **before any
review began**, and the reviewer was instructed to import only from that export:

```text
D:\A-Utopia\.runtime\evidence\mission-book\EM-003\frozen-8c16cfc\contracts\engineering-job-v1\
  envelopes.mjs            match=True
  reconcile.mjs            match=True
  index.mjs                match=True
  tests/conformance.test.mjs match=True
```

This is the fourth time this isolation has been used, and it again paid for itself: the reviewer's
highest-severity finding (D1) was one I had **not** found, and I had already pushed repairs for
eight defects while it was still reviewing.

Findings are merged **by mechanism, not by reporter**. Where both reviews hit the same mechanism it is
named once; where a mechanism was found by only one review that is stated. Repair was verified by
replaying the original reproductions against the repaired module
(`alien-verify-repair.mjs`, `alien-verify-repair2.mjs`, 63 checks total, all PASS), not only by the
new regression tests.

## 2. Confirmed defects, thirteen, all repaired

| id | found by | severity | mechanism | repair |
| --- | --- | --- | --- | --- |
| C1 | both | **high** | `key in spec` admits fields named after `Object.prototype` members | own-key check + `Reflect.ownKeys` |
| C2 | reviewer | **high** | finality gated on `record.state`, so a 100 % event finalised a job with `result: null` | finality gated on a recorded result |
| C3 | me | **high** | `applyEvent` ignores `job_version`; a superseded incarnation acts on the current job | `STALE_JOB_VERSION` refusal |
| C4 | reviewer | med-high | only shallow-frozen record: ref, ids and stored provenance were rewritable | deep freeze |
| C5 | me + reviewer | medium | result/artifact idempotency keyed on a caller-chosen `*_ref` | content comparison |
| C6 | both | medium | a record could be born terminal with no result (unearned success) | refused at record creation |
| C7 | me | low/med | a duplicate event left no trace on the durable record | recorded once, replay-idempotent |
| C8 | both | low/med | `reconcileEvents` sorted before validating: untyped `TypeError` | batch shape validated first |
| C9 | reviewer | low/med | unbounded `changed_files`/`tests`/`controller_decisions` | bounded like their siblings |
| C10 | reviewer | low/med | cyclic/deep envelope → untyped `RangeError` | cycle-safe scan + iterative depth bound |
| C11 | me | low/med | `isIsoInstant` shape-only: impossible instants were valid fields | calendar round-trip |
| C12 | reviewer | low | non-enumerable own out-of-contract field admitted | `Reflect.ownKeys` (part of C1) |
| C13 | me | low | duplicate-event audit gap reported as `DUPLICATE_EVENT` with nothing recorded | see C7 |

### C1 (high) — every field named after an `Object.prototype` member was "part of the contract"

`checkShape` scanned `Object.keys(value)` but tested membership with `key in spec`. Every spec is a
frozen object literal, so the prototype chain supplied the names `constructor`, `toString`,
`valueOf`, `hasOwnProperty`, `isPrototypeOf`, `__proto__`, … — all 12 own names of `Object.prototype`
were accepted, at **every** nesting level, while an ordinary unknown field such as `transport` was
refused.

```text
own key "constructor": admitJob.admitted=true errors=0
own key "transport"  : admitJob.admitted=false  (control)
nested result.git own "constructor"      -> validateResultEnvelope ok=true
nested event.source own "toString"       -> validateEventEnvelope ok=true
nested artifact.provenance own "valueOf" -> validateArtifactEnvelope ok=true
createJobRecord accepts it; record.job.constructor = {"rf":"STREAM"}
```

This is the exact class found in seven sibling contracts, but in a new shape: the hole is in the
*name* scan, not in the value reads (presence is checked with `Object.hasOwn`, so an inherited
*value* never satisfied a required field, and the reviewer independently confirmed no prototype
pollution — the defect is a **shape** hole, not a pollution hole).

The workbook requires that RF transport envelopes never replace the canonical Engineering record, and
the author's own test asserts that with the field name `transport` — a name that is **not** an
`Object.prototype` member, which is precisely why the guard looked sound. `transport_neutral: true`
was therefore false for 12 specific names. Repaired with `Object.hasOwn(spec, key)`, and the scan now
uses `Reflect.ownKeys` (C12) so a non-enumerable own field cannot slip past either.

### C2 (high) — a terminal *announcement* made the job final with no evidence

Found by the reviewer; the inverse of the failure I had been looking for. A 100 % progress event may
legitimately carry a terminal state (the validator blesses exactly that shape, and the workbook only
forbids *partial* events from ending a job). But `applyEvent` set `record.state` terminal, and
`applyResult` then gated finality on that state — so the job's own honest result was refused:

```text
applyEvent(state=SUCCEEDED, progress_percent=100) -> record.state SUCCEEDED, record.result null
jobSummary -> is_terminal true, terminal_status null, acceptance null
applyResult(that record, the real result) -> TERMINAL_JOB_IS_FINAL: already succeeded with undefined
```

The result was a SUCCEEDED job with no tests, no acceptance evidence and no result that could ever be
recorded — the module's own rule ("success must be evidence-backed", enforced on results) bypassed by
ordering. Finality is now gated on `record.result !== null`: an announcement is displayed as an
announcement (`terminal_status: null`), the honest result is accepted and decides the terminal status,
and once a result is recorded finality is exactly as before. A job announcing SUCCEEDED whose evidence
says FAILED now records FAILED — evidence wins over announcement.

### C3 (high) — an event from a superseded job version acted on the current job

`applyEvent` never compared `event.job_version` with `record.job_version`; the record only took
`Math.max(...)`. `sequence` is monotonic only *within* a version, so a stale-incarnation event with a
higher sequence was applied:

```text
record at job_version 2, state RUNNING
stale v1 event, sequence 9, state QUEUED  -> applied=true  -> state QUEUED  (walked backwards)
stale v1 event, sequence 10, state FAILED -> applied=true  -> state FAILED (running job terminated)
```

Repaired by refusing such an event as `STALE_JOB_VERSION`. Chosen as an *ignored decision* rather than
an exception, and recorded on the record, for the same reason the author chose to reconcile rather
than reject late events: a reordering transport must not make a replay look like a fault. The reviewer
independently falsified a neighbouring suspicion (that `job_version` could be driven backwards to
re-open a *terminal* job) — it cannot, because `Math.max` keeps the version monotonic and the terminal
check runs first; recorded as a negative result.

### C4 (med-high) — the record was immutable only at the top level

`Object.freeze` on the record left `record.job`, `event_ids`, `artifacts` and `ignored_events`
writable, so canonical state could be edited after the fact:

- rewriting `record.job.job_ref` made the record accept **another job's** event;
- pushing into `record.event_ids` made a real event look like a `DUPLICATE_EVENT` and suppressed it;
- editing `record.artifacts[0].provenance.device_ref` changed what `artifactProvenance()` reports,
  defeating the workbook's provenance guarantee.

Repaired with a cycle-safe `deepFreeze` applied in `createJobRecord` and `nextRecord`, so every level
of every record produced by this module is frozen.

### C5 (medium) — idempotency decided by a caller-chosen ref, not by content

`applyResult` compared only `result_ref`, and `attachArtifact` only `artifact_ref`:

```text
applyResult(rewritten result, same result_ref) -> applied=false reason=DUPLICATE_RESULT
   (record keeps SUCCEEDED/PASS against a valid FAILED payload)
attachArtifact(changed artifact, same artifact_ref) -> applied=false reason=DUPLICATE_ARTIFACT
   (digest, kind and size differ; the envelope even carries the digest)
```

The module's own comment says "Re-applying the *same* result is an idempotent no-op; a different one
is refused" — the implementation could not tell them apart, and reported a divergence as a harmless
replay. Both now compare canonical content; a same-ref-but-different payload is refused
(`TERMINAL_JOB_IS_FINAL` / `INVALID_ARTIFACT`) with a detail that says it is not a replay.

### C6 (medium) — a record could be born terminal with no result

Found by both reviews from two directions (a terminal `state` in the job envelope; a terminal state
reached by event). `createJobRecord` accepted a job declaring SUCCEEDED, producing
`jobSummary.is_terminal: true` with `result_ref`, `terminal_status` and `acceptance` all `null`, and
making the genuine result permanently unusable. Admission means the job is starting, so a record is
now refused at creation if it declares a terminal state; terminal state is reachable only through a
result, which is the one path that requires evidence.

### C7 / C13 (low/med) — the audit trail did not record duplicates

`reconcile.mjs`'s header states that "a decision that is ignored records *why* it was ignored", and
`DUPLICATE_EVENT` was the one decision that did not: a duplicate returned the unchanged record, so the
durable canonical state could not distinguish "arrived once" from "arrived twice", while late events
were recorded. A duplicate is now recorded once with its reason — once, because recording every replay
would make the record itself replay-sensitive; reapplication remains a strict no-op.

### C8 (low/med) — the batch was sorted before it was validated

`reconcileEvents` sorted on `left.sequence` before validating, so a `null` entry escaped as an untyped
`TypeError` — and only when the array had two or more elements, so single-element batches looked fine
(this is why my own first probe missed it and the reviewer's did not):

```text
reconcileEvents(record, [null])        -> EngineeringJobError INVALID_EVENT
reconcileEvents(record, [null, null])  -> TypeError: Cannot read properties of null (reading 'sequence')
```

The batch shape is now validated first, the error names the offending index, and the comparator is
total (equal ids compare equal instead of returning 1 both ways).

### C9 (low/med) — three result arrays were unbounded while their siblings were capped

`warnings` (32), `evidence_refs` (64), `context_refs` (64) and `operations` (64) were capped, but
`changed_files`, `tests` and `controller_decisions` had no limit: 5 000 entries of each validated
`ok: true` and were stored whole. Now bounded at 256 / 128 / 32 with a shared `objectArray` guard, the
same two-sided shape as `textArray`.

### C10 (low/med) — a cyclic or deep envelope escaped as a stack overflow

`findRawSecretFields` walks *data* (attacker-controlled) rather than the fixed schema, with no visited
set or depth bound, so a cyclic job made `admitJob` throw an untyped
`RangeError: Maximum call stack size exceeded`. Now cycle-safe via a `WeakSet`, plus an **iterative**
`envelopeDepthExceeded` bound (`MAX_ENVELOPE_DEPTH = 32`) called by all four validators — iterative so
the check cannot itself overflow, and reported through the normal error channel rather than swallowed.

### C11 (low/med) — `isIsoInstant` checked the spelling, not the instant

Same class as RF-003 D1 and GAI-002 C7, both repaired by this host earlier in the same session:
`2026-13-45T99:99:99Z` matched the regex and parsed to `NaN`; `2026-02-30T00:00:00.000Z` silently
normalised to 2 March. Now the instant must round-trip to the calendar date it claims. No ordering or
freshness arithmetic depends on these fields here, so the impact is acceptance of an impossible
timestamp rather than a stale-state bug — recorded honestly rather than inflated.

## 3. Reviewer claims reconciled

- **D1 accepted and repaired** — the reviewer's strongest finding, and one I had not found. Its
  suggested fix (gate on `record.result`) is what is implemented.
- **D3 accepted and repaired** with deep freeze.
- **D9 is the same mechanism as my C7/C13** and is repaired once.
- **"D4 = Object.keys vs Object.hasOwn disagreement"** is accepted; the reviewer is right that the
  enumerable scan and the own-property read disagree, and the fix is a single `Reflect.ownKeys`.
- **The reviewer's "falsified suspicions"** are recorded verbatim as negative results so no future
  host re-spends the effort: prototype-named keys (falsified before my repair for the *value* path —
  own enumerable keys were refused, non-enumerable were dropped by `structuredClone`), inherited
  values satisfying required fields, `{a: undefined}` vs `{a: null}` collisions, equal-sequence
  non-determinism, re-opening a job via `job_version`, and `jobSummary` leaking a mutable view.
- **Claim 2 stands**: the reviewer looked for a shape that makes a partial event terminal (including
  `NaN`, `undefined`, `100.5`) and found none. Claim 1 stands. Claim 5 holds for honest input.
  This is recorded so the merge workbook is not told a guarantee failed when it did not.

## 4. Deliberate non-fixes and boundaries

1. **An announcement without a result can persist.** With C2 repaired, a job that reaches a terminal
   state by a 100 % event and whose result never arrives stays terminal with `result: null`. This is
   visible, not hidden (`jobSummary` reports `terminal_status: null` and `result_ref: null`), and it
   is the author's D7 design that a full-progress event may be terminal. Refusing terminal
   announcements outright would exceed the workbook's acceptance line ("*partial* events cannot mark a
   job terminal") and would break the author's blessed shape; recorded as a boundary for the Owner.
2. **`ignored_events` / `event_ids` remain unbounded in count.** Pre-existing, and bounding them
   would change the auditable shape the workbook asks for. Noted, not repaired.
3. **Secret scanning is key-shaped, not value-shaped.** A raw secret stored under a benign field name
   is not detected. The Development report claims "secret-shaped field refusal", which is what is
   implemented; value scanning would be Development scope.
4. **The `_id`/`_ref` secret exemption is kept** (`password_id` is not flagged), for cross-contract
   consistency with GAI-002, where it is already an explicit Owner carry-forward.
5. **No new error codes.** A rewritten result uses `TERMINAL_JOB_IS_FINAL` with a detail saying it is
   not a replay; a conflicting artifact uses `INVALID_ARTIFACT`; a stale incarnation adds
   `STALE_JOB_VERSION` as an ignored-decision *reason* (not an exception, so the vocabulary of thrown
   codes is unchanged). Behaviour was added, vocabulary was not.
6. **Trust/transport end-to-end behaviour is not exercised.** No real RF transport or cross-device
   carriage exists on this branch, so only the envelope guards were tested. Recorded as a typed
   pending seam, exactly as the workbook instructs, not as success.

## 5. Tests and CI

Author suite: **9/9 pass unchanged** — no author test encoded a defect, so none needed correcting.
Suite extended **9 → 22 tests**; every negative assertion is paired with a legitimate neighbour that
must still pass, for example: a `constructor`-named field is refused *and* a clean job is admitted; an
announced terminal state is not final *and* a recorded result is; a stale-version event is ignored
*and* the current version still applies; a cyclic envelope is refused *and* a shallow one is admitted;
257 changed files are refused *and* 256 are accepted.

Repair verification replays the original reproductions: `alien-verify-repair.mjs` (32/32) and
`alien-verify-repair2.mjs` (31/31).

Local equivalent of the CI gate on the repaired revision:

```text
node --test tests/*.test.mjs                -> 123 pass, 0 fail  (101 baseline + 22)
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 8c16cfc2)
node scripts/check-bilingual.mjs            -> docs/evidence/data-records SYNCHRONIZED
```

Implementation CI: **36731144219 — gateway-web success, android success** on
`engineering-manager/EM-003-job-result-artifact-protocol` @ `ffbdbce`.

## 6. Unstated decisions (problem / choice / rationale)

1. **How to treat a superseded-incarnation event.** *Problem:* throw, drop silently, or ignore with a
   reason? *Choice:* ignore with `STALE_JOB_VERSION` recorded on the record. *Rationale:* the workbook
   chooses reconciliation over rejection because transport may reorder; the same argument applies
   here, and a thrown code would make a reordered replay look like a runtime fault.
2. **What establishes finality.** *Problem:* the job state, or the result? *Choice:* the recorded
   result. *Rationale:* the workbook's evidence rules attach to the result (`SUCCEEDED` requires
   `acceptance.status PASS`); an event is an announcement. Gating on state produced an evidence-free
   terminal state and permanently discarded the evidence, so the state cannot be the gate.
3. **Why a rewritten result is `TERMINAL_JOB_IS_FINAL` rather than a new code.** *Rationale:* the job
   *is* final — the finding is that the payload is not a replay of what is recorded. The detail string
   says so, and no new thrown vocabulary is introduced.
4. **Why duplicates are recorded once.** *Rationale:* two goals conflict — the audit must show a
   replay, and reapplying an event must not change the record. Recording the first occurrence and
   deduplicating the entry satisfies both.
5. **Array bounds: 256 / 128 / 32.** *Problem:* the workbook states no limit. *Choice:* generous caps
   in the same style as the existing 64/32 text caps. *Rationale:* the requirement is a two-sided
   bound, not a specific number; the values are exported so the Owner can rule on them.
6. **`MAX_ENVELOPE_DEPTH = 32` and an iterative check.** *Rationale:* the scanner walks data, so an
   attacker controls recursion depth; 32 is far deeper than any canonical envelope needs, and an
   iterative check cannot itself overflow — which a recursive bound would.
7. **Deep freeze rather than defensive copies.** *Rationale:* copies still leave the *live* record
   mutable for a caller holding a reference; freezing removes the class of defect instead of one
   instance of it.
8. **No Android device observation and no Computer-Use session.** The workbook authorises them if
   acceptance requires observation; EM-003 is a pure protocol module with no device surface, so
   nothing was observed and Android Studio was not invoked. Recorded because the authority is granted.
9. **`admitJob` stays permissive about a terminal state; `createJobRecord` refuses it.**
   *Rationale:* a job *document* may legitimately describe a finished job (the envelope carries the
   canonical current state), but a *record* is born by admission — a job that is starting.

## 7. Honest self-errors

- My probe #1 tested `reconcileEvents` with **single-element** malformed batches. A one-element array
  never invokes the sort comparator, so the crash did not appear and I nearly recorded the finding as
  unreproducible; probe #2 used two elements and confirmed it. The reviewer found it independently.
- I also missed C2 entirely — I had found the born-terminal variant (C6) and repaired it, and stopped
  one step short of the event-driven variant, which is reachable through the very shape the author's
  validator blesses.
- While adding the array bounds I deleted the `VERSION` spec constant and inserted two nonsense
  constants in its place. `node --check` on the next command caught nothing because the file still
  parsed; the constant would have failed at runtime. Restored within the same turn, before any test
  run — recorded because a slip that a syntax check cannot catch is worth naming.
- My first EM-003 probe used a falsy-sum classification bug in the **pool scanner** (`!row.dev` is
  false for the string `NOT_STARTED`), which under-reported unclaimed Development tasks; and the scan
  initially skipped six workbooks because Mech writes files from PowerShell and they carry a BOM. Both
  fixed, and the scanner now warns about unreachable workbooks instead of dropping them silently.
- My working notes cited `discovery.mjs:141` for RF-003's merge key where the frozen file had it at
  `:139`; corrected in those notes.

## 8. Result

All thirteen confirmed defects are repaired at the mechanism, with paired regression tests and a replay
of the original reproductions. No defect was closed by narrowing a test, no author test was rewritten,
and five candidate repairs/boundaries were deliberately not made and are recorded in §4 with their
reasoning. Nothing about this task required device observation, so none was performed.

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/engineering-manager/EM-003-job-result-artifact-protocol.md
```

语言配对 / Language pair: [原文 / Source](./CORRECTION_REPORT.md) · [译本 / Translation](./zh-CN/CORRECTION_REPORT.md)
