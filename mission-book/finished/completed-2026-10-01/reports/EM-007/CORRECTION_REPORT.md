# EM-007 Correction Report — Remote Sub-worker Execution + Automatic Return / Control

```text
MISSION              = EM-007 (Engineering Manager programme, task 7 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-007-remote-subworker-return-control.md
CLAIM_COMMIT         = 4c75531 (Digital-City main, claim of EM-007 Correction by Alien)
CLAIMED_AT           = 2026-10-01T02:26:38Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 3bd9f556616dbaccfd00cb4620144fdcc669baf1
DEVELOPMENT_CI       = 36730656520-success
CORRECTION_BRANCH    = engineering-manager/EM-007-remote-subworker-return-control
CORRECTION_HEAD_SHA  = cf263372b3bbeb4d6134ac37459ff96c319d96a4
BRANCH_CI            = 36806817787-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-007 23 pass (7 author + 16 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   3bd9f55 (Mech)   run 36730656520   success
corrected head     cf26337 (Alien)  run 36806817787   gateway-web success / android success
```

The corrected head executed the real `V0.2 checks` workflow on GitHub-hosted runners. No billing refusal
occurred in this task's runs.

## 2. Independent review method

The Development head was exported with `git archive` (`D:\A-Utopia\.runtime\evidence\mission-book\EM-007\frozen-3bd9f55\`)
and all four branch blobs were verified against their Git objects before any review started:

```text
contracts/engineering-return-control-v1/index.mjs                    MATCH 36bd4ab2b062fe236d53f458d0be583d73a38134
contracts/engineering-return-control-v1/return-control.mjs           MATCH e1b4dbf44b560cb43a258d9079e43f1c7c50669e
contracts/engineering-return-control-v1/tests/conformance.test.mjs    MATCH 5fe22dfc7ea89cfda3ad4d4b7c6a9dacafe84f15
tests/engineering-return-control.test.mjs                            MATCH cfe50272a20994c3d72b67f5c46ef9a7eeb49e35
```

An independent adversarial reviewer was pointed only at that frozen export, after being told to read the
workbook first. It returned 17 probes and `probes/FINDINGS.md` with 13 reproduced mechanisms
(`MATERIAL_DEFECTS_FOUND`, confidence 0.95). My own probe (`probes-alien/probe-alien-em007.mjs`) covered 12
mechanisms independently; the two sets were merged by mechanism, and every repair below is backed by a
regression that fails on the Development head.

Two integrity notes about that review: the reviewer observed the frozen *test* file change while it was
running (I appended the Alien regressions to the worktree copy at 12:30), and it reported its own
`node --test` result accordingly (20 tests / 7 pass / 13 fail at that moment). The frozen *module* bytes were
never touched for the whole review, and the reviewer confirmed the module hash stayed constant. The frozen
export directory now deliberately carries the corrected suite so it can serve as the pre-fix baseline.

## 3. Defects found and repaired

16 mechanisms, grouped by the invariant they broke. "Class" refers to the shared taxonomy used across this
programme's Corrections (1 own-key/prototype, 2 opt-in or literal-only guard, 3 caller-controlled limit,
4 authority not bound to its subject, 5 state mutated before a refusal, 6 unvalidated instants/bounds,
7 validated-but-unread, 8 hardcoded claim, 9 recursion/clone failure, 10 dropped or re-read fields,
11 mutable-key idempotency, 12 accessor TOCTOU).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **Any caller-named device could become the return surface.** `applyRemoteEvent` adopted `interactionSurface.interaction_device_ref` verbatim, so state/attention/result/artifacts could be delivered to `device-stranger` (or a bare `device:attacker`), and `authorised_device_refs` was never consulted. The reviewer's probe-04/07 also showed a job dispatched with no surface delivering all eight channels to the *executor* while the invariant assertion still returned `normal_operation_remote_free: true` | 4 | a surface is admissible only when it is the output of `resolveInteractionSurface` (a module-owned `WeakSet` brand), for the same owner, naming a device that surface itself authorises; otherwise `UNAUTHORIZED_INTERACTION_DEVICE` / `OWNER_CHANGE_FORBIDDEN` | yes |
| 2 | **A refused replay still moved the delivery target.** `job.interaction_device_ref` was assigned before the stale/duplicate refusal, so a rejected event relocated where every later return went | 5 | the surface is admitted (validated) up front but adopted only for an event that is actually applied; the next applied event carries the move | yes |
| 3 | **A device belonging to another owner resolved as this owner's surface** (`owner_ref` on a device was never compared with the requested owner) | 4 | devices are scoped to the owner; a device may declare no owner but may not declare a different one | yes |
| 4 | **The bridge itself never rejected a duplicate dispatch.** `DUPLICATE_EXECUTION` existed only in the port double; with any other conforming port the second dispatch replaced the live record, reset `last_sequence` to 0 and re-applied already-applied events (`probe-02` of the review; my probe P5 reproduced it with a permissive port) | 2, 8 | the bridge refuses a second dispatch for a known job before any port call, so the live ledger and sequence space survive | yes |
| 5 | **An explicit refusal from the execution port was reported as success.** `port.dispatch`/`port.control` results were discarded and `applied: true` was returned and recorded in `control_applied` even for `{accepted: false, reason: 'EXECUTOR_GONE'}` | 8 | an explicit `dispatched: false` / `accepted: false` is a typed refusal (`DUPLICATE_EXECUTION` for dispatch, `CONTROL_ALREADY_APPLIED` for control) and is not recorded as applied | yes |
| 6 | **The physical-action block blocked nothing.** No job state changed, `status()` exposed nothing, the declared `PHYSICAL_ACTION_CANNOT_SUCCEED` code was never thrown, and a later `RESULT` with `status: 'SUCCEEDED'` was applied as a success — the exact "fabricated success" the workbook forbids | 8 (with 7) | the block sets an observable `blocking_state` surfaced by `status()`, and a `RESULT` claiming `SUCCEEDED` while blocked is refused with `PHYSICAL_ACTION_CANNOT_SUCCEED` | yes |
| 7 | **An attention reply never reached the originating worker.** `RESPOND` was forwarded as a bare `port.control('RESPOND')`; `attentionId` and `response` were not even parameters, and a `RESPOND` without an `attentionId` was applied | 7, 8 | `applyControl` accepts `attentionId`/`response` and delivers the reply through the port's `respond` method (a declared method that was previously dead), refusing a malformed reply | yes |
| 8 | **A missing `commandId` swallowed every later command.** The first keyless command stored `undefined`, so every subsequent `PAUSE`/`CANCEL` with no id was answered `{applied: false, idempotent: true}` and never reached the executor | 2, 11 | a control command requires a non-empty `commandId`; without one, two different commands are not distinguishable from a retry | yes |
| 9 | **An untransferable payload consumed the sequence and lost the event.** `last_sequence` was advanced before `structuredClone(event.payload)` threw (`DataCloneError`, an untyped error), so the ledger recorded nothing, the return never existed and a resend of the same sequence was refused as `STALE_EVENT` | 5, 9 | the payload is cloned and refused (`INVALID_ENVELOPE`) before any sequence or ledger state moves | yes |
| 10 | **Context staging advertised a bound it did not enforce.** `max_entries: 64` and per-entry `bounded: true` were hardcoded while 200 (review: 1000) entries staged fine; the cleanup policy was also unvalidated, so `bounded cleanup policy` accepted `FOREVER` | 8, 3 | the entry count is bounded by the advertised constant and the cleanup policy must be a known one | yes |
| 11 | **The executor reference and the capability list were unvalidated.** An absent `executionDeviceRef` could match a host that names no device (a job "dispatched" with an undefined executor), and a string `required_capabilities` reached the port and crashed with an untyped `TypeError` | 6, 9 | both are validated up front (`INVALID_REQUEST`) | yes |
| 12 | **Instants were never validated and `isIsoInstant` was shape-only.** The exported helper returned `true` for `2026-13-45T99:99:99Z` (`Date.parse` = `NaN`) and was called by nothing; `at` was recorded verbatim (`'not-an-instant'`, a number, a backwards instant) into the return ledger and the blocker envelope | 6, 7 | the exported helper also requires a finite parse, and every recorded instant must survive a component round trip; `null` still means "no instant supplied" | yes |
| 13 | **The approval gate read the proposal's prototype.** `isPlainObject` accepted any non-array object, so `Object.create({status: 'APPROVED', job_ref, owner_ref})` and a class instance both dispatched without an own approval — "no remote dispatch occurs before explicit approval" | 1, 12 | canonical records must be plain (prototype `Object.prototype` or `null`) | yes |
| 14 | **The owner-change guard was opt-in.** `proposal.owner_ref !== undefined && …` meant a proposal that named no owner skipped the check entirely, while the record still reported `owner_preserved: true` | 2 | a fallback proposal must name the owner it was approved for, and that owner must be the job's owner | yes |
| 15 | **`assertNoRemoteHostInteraction` compared against the mutable current surface**, so a legitimate mid-run surface move retroactively branded earlier ATTENTION returns as remote-bound, while a return delivered to nobody (`null`) passed as "normal remote-free operation" | 8 | the assertion is bound to the execution host and to a real delivery target: attention must have been delivered somewhere that is not the executor | yes |
| 16 | **Accessor TOCTOU.** `event.origin_device_ref`/`channel`/`sequence`, a device's `device_ref`, and a staged entry's `digest`/`cleanup` were validated once and read again for projection, so an own getter could pass as the recorded executor and project a foreign device or an unknown channel | 12 | every such field is read exactly once into a local/snapshot, and the validated value is the value used | yes |

## 4. The review's findings, mapped

| Review | Disposition |
| --- | --- |
| D1 surface not checked (and the assertion re-comparing the field it overwrote) | repaired — #1, #15 |
| D2 duplicate dispatch only in the port double | repaired — #4 |
| D3 opt-in owner guard / `owner_preserved: true` hardcoded | repaired — #14, #3. `owner_preserved: true` remains a constructed fact: `job.owner_ref` is recorded once and no path reassigns it, so it is true by construction rather than a claim about an unchecked field |
| D4 surface written before the stale refusal | repaired — #2 |
| D5 port answer discarded | repaired — #5 |
| D6 `max_entries`/`bounded` hardcoded | repaired — #10 |
| D7 `isIsoInstant` unused and shape-only; `at` verbatim | repaired — #12 |
| D8 `RESPOND` never reaches `port.respond` | repaired — #7 |
| D9 prototype approval gate + envelope re-read | repaired — #13, #16 |
| D10 `commandId` unvalidated | repaired — #8 |
| D11 physical-action block blocks nothing | repaired — #6 |
| D12 only 3 of 6 declared port methods referenced | **boundary** — see §5 |
| D13 accessor-backed fields (SUSPECTED) | repaired — #16 |
| `DUPLICATE_EVENT` branch unreachable | coverage — see §5 |
| `conformance.test.mjs:122` (`stale_or_duplicate === 2`) | coverage — see §5 |
| `conformance.test.mjs:139-142` (idempotency by `commandId`, key never required) | repaired — #8, without contradicting the encoded assertion (the author always supplies a key) |

## 5. Deliberate boundaries (not silently repaired)

| Boundary | Reasoning |
| --- | --- |
| **Only 3 of the 6 declared port methods are referenced by the bridge.** `subscribe` and `collectArtifacts` remain unused (the reviewer's D12); `respond` is now used (#7), and `listEligibleRemoteHosts`/`dispatch`/`control` always were | Ingestion is caller-driven through `applyRemoteEvent`, which is what makes nine channels testable in a pure module. Wiring a subscription pump would mean inventing a scheduler and an ingestion loop that this workbook does not scope to the bridge, and would add product surface rather than repair a defect. The coordinator that owns the run drives the port; the bridge owns the canonical projection. |
| **A surface must now come from `resolveInteractionSurface`.** A hand-built or re-serialised surface object is refused with `UNAUTHORIZED_INTERACTION_DEVICE` | Judgement call, recorded: the alternative (accept a plain object and check it against the job's dispatch-time authorised list) was rejected because it cannot distinguish an authorised device from a caller's assertion about one, and the mid-run surface move that the workbook *requires* comes from the resolver anyway. The cost is that a surface which crossed a process or JSON boundary must be re-resolved; that is a contract tightening on a caller, not a behaviour loss for the user. |
| **`proposal.owner_ref` is now required** (#14) | The author's helper always supplies it (`conformance.test.mjs:30`), so no encoded assertion is contradicted. The alternative — keep it optional and treat "absent" as "no declared change" — leaves an approval that cannot be checked against the job's owner, which is the gate the workbook's first acceptance criterion is about. |
| **The `DUPLICATE_EVENT` ledger branch is unreachable.** `sequence <= last_sequence` already returns `STALE_EVENT`, so the `ledger.some(sequence && channel)` branch can never fire for a duplicate | The reviewer disproved its own duplicate-re-application hypothesis and reported this as coverage. Removing the branch would change the emitted reason vocabulary; leaving it is inert. The *reachable* duplicate hazard — a second dispatch reopening the sequence space — is repaired (#4). |
| **`status().stale_or_duplicate` counts ledger rows whose `result` no decision reads** (author-encoded at `conformance.test.mjs:122`) | The count *is* derived from `result`, so the field is read by the reported aggregate; it is not policy input, and the author asserts the aggregate. Kept as encoded. |
| **Device identity, trust, transport and presence remain the port's** | Workbook out-of-scope ("do not implement independent node trust, transport, presence or physical-device identity here"), and the port contract records `owns_node_trust/owns_transport/owns_device_identity: false`. |

## 6. Local test summary

```text
corrected module                    23 tests / 23 pass / 0 fail
development head 3bd9f55            23 tests /  7 pass / 16 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 7 tests are unchanged and all 7 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\EM-007\`: `frozen-3bd9f55/` (byte-verified export),
`prefix-test.log` (the corrected suite against the Development head), `gate-EM-007.log`,
`probes/FINDINGS.md` + 17 probes + `RUN-LOG.md` (the independent review), `probes-alien/probe-alien-em007.mjs`
(Alien's own reachability probe).

## 7. Disclosure

- The first gate run in this task failed `root-tests` and `city-test-all` because the fresh Correction
  worktree had no installed dependencies (`city-test-all` reported `YAML_PARSER_UNAVAILABLE: Cannot find
  package 'yaml'`). After `pnpm install --frozen-lockfile` (root and `city/`) exactly as the sibling
  Corrections do, all five gates exit 0. Recorded as an environment seam, not a code result — local checks
  never substitute for hosted CI.
- One of my own assertions was wrong and was fixed in the test, not the module: I first asserted
  `isIsoInstant('2026-02-30T00:00:00Z') === false`. The exported helper is shape + parseable; the
  calendar round trip is enforced by the decision-level validator, so the assertion was moved to the
  recording path where the refusal actually belongs.
- My own regression suite found 12 mechanisms; the independent review found 13 (11 overlapping, plus the
  surface-write-before-refusal and the accessor re-read, and the `DUPLICATE_EVENT` coverage question). It
  also reported the two author-encoded contracts in §5 that I deliberately did not "fix" as bugs.
- No billing refusal was recorded as a code failure; every hosted run in this task that started executed
  real steps.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
