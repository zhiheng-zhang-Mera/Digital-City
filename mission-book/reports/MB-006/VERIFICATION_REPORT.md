# MB-006 — Restart Recovery Station — VERIFICATION REPORT

> Status: **IN PROGRESS**
> Verification Host: `Mech`
> Claimed at: `2026-09-30T01:30:00Z` (City `34e9f33`)
> Migration Host: `Alien` (different host, as rule 5 requires)
> Reviewed migration branch: `mission/MB-006-restart-recovery` @ `dab820b37ff39d1581b19dd43e75771507fb7139`

## 0. Rule 9 ordering (read this first)

Mission rule 9 is explicit: the Verification Host **first** completes an independent review
from the donor, the target code, the diff, the tests and the runtime state, and writes its
findings down; **only then** may it read the Migration Report.

§1–§4 are that independent review. They were written from the branch, the donor clone and
this host's own probes, without opening `reports/MB-006/MIGRATION_REPORT.md`. §5 is the first
point at which the Migration Report is consulted.

## 1. What is being verified

MB-006 migrates `dsh-restart`'s restart ticket, external supervision, relaunch, crash-loop
safe mode and audit out of its Hns binding into `city/02-engineering/04-restart-recovery-station`.
Donor: `dsh-restart @ e20fb6cc43e27cedf6303471e5b8ee18e1383ecd`.

Reviewed revision `dab820b`, base `c7ef3cd`: **31 files, +5812 / −4**. Four modules in the new
building:

| Module | Donor source (per its `DONOR.json`) |
|---|---|
| `restart-protocol` | `src/shared/protocol.ts`, `src/shared/types.ts`, `src/plugin/request-validator.ts` |
| `restart-ticket` | `src/plugin/ticket-store.ts`, `src/plugin/atomic.ts` |
| `restart-lock` | `src/plugin/restart-lock.ts` |
| `checkpoint-gate` | `src/plugin/checkpoint-gate.ts` |

Real consumption: `services/dev-gateway/server.mjs` replaces its inline post-restart task
sweep with the migrated `checkpointGate`/`unboundCheckpointPort`, and `tests/gateway.test.mjs`
gains a case proving it.

---

# PART A — INDEPENDENT REVIEW (§2–§4)

## 2. Required gates pass on the reviewed revision — CONFIRMED

Executed by this host on the branch at `dab820b`:

| Gate | Result |
|---|---|
| `pnpm test` | **59 / 59** |
| `node city/test-all.mjs` | **206 / 206** |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |

## 3. Independent findings

### 3.1 The real restart/relaunch has been performed on this host — CONFIRMED, and it is real

The Mission's first gate is a real controlled process restart/relaunch. This host ran one,
driving the **migrated** modules for every decision and owning only the two things the
migration defers (signalling a process, writing bytes):

- driver `.runtime/evidence/mission-book/MB-006/run-1/restart-driver-v2.mjs` with
  `subject.mjs` as the supervised child; summary in `run/summary.json`, trace in
  `restart-driver.log`, append-only audit in `run/audit.jsonl` (27 entries), and the
  subject's own lifecycle log in `run/subject.log`.

| Scenario | Outcome |
|---|---|
| **A — fail-closed** (`checkpointRequired: true`, no bound checkpoint port) | admission accepted, lock `IDLE→REQUESTED→CHECKPOINTING`, migrated gate `authorized: false`, lock back to `IDLE`, **no shutdown request written, subject still alive**, pid unchanged. Duplicate and cooldown probes refused with `DUPLICATE_REQUEST_ID` and `COOLDOWN_ACTIVE` |
| **B — authorized** (`checkpointRequired: false`) | gate authorizes; atomic ticket built with checksum `sha256:9aacf51e8c8e358aa6203c93f788d1d978444ec254fe270cc6470e13d1d2039a`; the subject observes the graceful shutdown request and exits with **its own code 7** (not a kill); the external supervisor observes the exit and relaunches generation 2 under a **different pid**; the lock walks `REQUESTED→CHECKPOINTING→SHUTTING_DOWN→RELAUNCHING→VERIFYING→IDLE` (9 transitions, final `IDLE`) |

Graceful shutdown, not a kill, is what makes this a restart rather than a crash: the subject
read the request, stopped its own heartbeat and chose `process.exit(7)`, and the supervisor
observed exactly that code. The relaunched generation wrote a fresh identity and heartbeat.

### 3.2 Ticket integrity is the donor's ladder, rung for rung — CONFIRMED

Driven over a real ticket built by the port: valid → `null`; tampered `reasonSummary` →
`checksum`; wrong expected pid → `wrong_pid`; past `expiresAt` → `expired`. The shipped
`verifyTicket` has exactly the donor's six rungs in the donor's order
(`missing`, `malformed`, `schema_version`, `checksum`, `expired`, `wrong_pid`, matching
`src/plugin/ticket-store.ts:103-138`) and no seventh rung. The checksum is real SHA-256 over
the donor's canonical JSON, so a field change is caught rather than tolerated.

### 3.3 The donor's known limitations are preserved, not repaired — CONFIRMED

`restart-protocol/DONOR.json` records, verbatim and with donor citations:

- `WAITING_FOR_EXIT_HAS_NO_DEADLINE` — "There is **no timeout** on `WAITING_FOR_EXIT`, and
  **no \"dirty restart\" record** is written anywhere" (`docs/failure-modes.md:106-109`),
  status `NOT_MIGRATED_AND_NOT_FIXED`.
- `ALLOW_FORCE_TERMINATE_NEVER_CONSULTED` — "declared, validated, **never consulted** by this
  release" (`README.md:272`), status `NOT_MIGRATED_AND_NOT_FIXED`.
- plus `additionalDonorGapsObserved`: `SUPERVISOR_STATE_STOPPED_NEVER_ASSIGNED` and
  `CROSS_RESTART_COOLDOWN_NOT_ENFORCED`.

The code agrees: `STOPPED` is in `SUPERVISOR_STATES` with no path assigning it, and
`allowForceTerminate` is validated and never read. Nothing was quietly closed in passing.

### 3.4 The gateway rewiring preserves MB-001's behaviour — CONFIRMED, with a note

`createGateway`'s post-restart sweep is now
`const { authorized } = await resumeGate.prepare('application', t.state !== 'QUEUED')` with
`checkpointGate({ port: unboundCheckpointPort(), timeoutMs: 0 })`. Because the port is
unbound and the gate is fail-closed, a task that had started is refused and failed with the
same error text and event as before, while a `QUEUED` task is authorized and left alone —
equivalence confirmed by reading both versions.

**Note, not a defect:** the sweep became an `async` loop with a per-task `await`. `createGateway`
is `async` and the loop runs before `server.listen`, so no request can be served mid-sweep;
the only observable difference is the order in which failed tasks emit their events.

### 3.5 What I could NOT confirm

- **Crash-loop breaker / safe mode as behaviour.** The breaker
  (`src/supervisor/crash-loop-breaker.ts`) was not migrated — every module ledger defers the
  supervisor — so the ported code cannot enter safe mode. What it carries is the
  `crashLoopState` shape and the admission refusal `CRASH_LOOP` (which I exercised directly).
  Driving repeated real crashes through a donor breaker would be reimplementing it, i.e. new
  capability the branch does not have.
- **Two participating hosts' restarts.** Rule 5 permits exactly one verification host per
  Mission, so a second live restart cannot be added here; see §5.2.
- **Donor parity beyond the ticket ladder.** I checked the ticket ladder against the donor
  line by line and drove the ported shapes, but did not rebuild a differential for the lock's
  transition table or the validator's whole ladder.

## 4. Rule 9 status

Findings in §3 were established and written before the Migration Report was opened. §5 is the
first reference to it. No Part A finding was revised while writing §5.

---

# PART B — RECONCILIATION (§5)

## 5. The Migration Report

*Written after Part A was complete.*

### 5.1 Claim-by-claim reconciliation

| Report claim | Status after independent review |
|---|---|
| Gates: `pnpm test` 59/59, `apps/rooms` 67/67, `city/test-all.mjs` 206/206 | **Confirmed** by this host at `dab820b` |
| Real consumption: the gateway's post-restart sweep is owned by the migrated checkpoint gate | **Confirmed**, and equivalence with the previous inline sweep verified from the code (§3.4) |
| Ticket ladder is the donor's six rungs | **Confirmed against the donor source**, all rungs exercised (§3.2) |
| Both donor limitations recorded verbatim and not repaired | **Confirmed**, plus two additional gaps the report also records (§3.3) |
| Crash-loop/safe mode delivered | **Boundary, not behaviour** — the vocabulary and the `CRASH_LOOP` admission refusal are ported and exercised; the breaker that would trip them is deferred with the rest of the supervisor (§3.5) |
| The migration host's five post-green fidelity repairs (seventh rung, draft guard, duplicated `canonicalJson`, re-declared vocabularies, an invented leniency) | **Confirmed for the two I could check directly:** the shipped `verifyTicket` has no seventh rung and imports `canonicalJson` from the sibling protocol module rather than re-declaring it. The draft guard's absence in `buildTicket` is consistent with the note |
| `MIGRATION_COMPLETE = true`, branch not merged, `mission:finalize` not run | **Confirmed** against the mission file and the branch |

Nothing in Part A needed to be corrected. The report's fidelity note ("compare the ported code
against the donor rather than the report") is honest and useful, and the two checks it invites
both came back clean.

### 5.2 The two-host restart receipt — recorded as a Mission-design tension

The gate reads *两台主机都必须完成一次真实受控 process restart/relaunch*. Rule 5 permits
exactly **one** verification host per Mission and forbids a third host. This host performed one
real restart/relaunch (§3.1); the migration host recorded its own runtime pass on its branch.
Whether "两台主机" means the migration and verification hosts, or two machines of the same
role, is **not defined by the mission-book**. I record both readings rather than choosing:

- **Reading 1 (per participating host role):** satisfied — the migration host has its own
  recorded restart and this host has the one above.
- **Reading 2 (two independent machines):** structurally unsatisfiable under rule 5, because
  only one host may verify. This is the same class of ambiguity the index already records for
  MB-004's dependency question, and it should be resolved by the Owner for the remaining
  missions rather than per-mission by a verifier reading.

### 5.3 Divergences and repairs

**One repair is proposed** and is in the Mission's own spirit (rule 10: extra tests and
evidence completion, no new capability): MB-001's verification added a restart/recovery
receipt test to `tests/gateway.test.mjs` on `main`, and MB-006's branch rewires that same
sweep. After merging, the two must agree — the combined evidence is stronger than either
alone. §6 records what was actually run and whether any code change was needed.

No production behaviour needs to change for MB-006 to be verifiable.

## 6. Criteria assessment, repairs and closeout

### 6.1 The Mission's Verification gates, one by one

| # | Gate | Verdict | Evidence |
|---|---|---|---|
| 1 | 两台主机都必须完成一次真实受控 process restart/relaunch | **MET for this host; the "two hosts" clause is a mission-design tension** | This host performed a real graceful restart and relaunch of a real child process (§3.1): the subject read the shutdown request and exited with its own code 7, the external supervisor observed it and relaunched a new generation under a different pid, and the migrated ticket/lock/gate modules decided every step. The migration host has its own recorded runtime pass. Rule 5 allows only one verification host, so a second *live* restart cannot be added here; §5.2 records both readings of the clause rather than choosing one |
| 2 | ticket checksum、dedup/cooldown、post-relaunch verification 与 audit 可追踪 | **MET** | checksum `sha256:9aacf51e…` over the donor's canonical form, with `checksum`/`wrong_pid`/`expired` rejections exercised; `DUPLICATE_REQUEST_ID` and `COOLDOWN_ACTIVE` refusals exercised; post-relaunch verification returns `wrong_pid` (the replaced process); the whole run is in `run/audit.jsonl` (27 entries) plus the subject's own lifecycle log |
| 3 | 已知两项 donor limitation 必须原样记录，不得顺手修好 | **MET** | both limitations recorded verbatim with donor citations and `NOT_MIGRATED_AND_NOT_FIXED` status; `STOPPED` unassigned and `allowForceTerminate` unread in the port, matching the donor (§3.3) |
| 4 | Verification 主机必须与 Migration 主机不同 | **MET** | Migration `Alien`, verification `Mech` |
| 5 | 先独立审查后看迁移报告 | **MET** | Part A (§1–§4) was written from the branch, donor clone and this host's probes; §5 is the first reference to the report |
| 6 | 必要维修只能在同一 Mission 分支，不得扩大功能边界 | **MET** | no production change was needed; the verification added evidence and one test where the merge with MB-001 made the combined behaviour worth pinning (§6.2) |
| 7 | 所有 required CI 与本 Mission 门禁全绿 | **MET** | §6.3 |
| 8 | 由 Verification 主机完成合并到 `main` | **DONE** | merge SHA in §6.5 |
| 9 | City Verification Report 已提交 | **MET** | this file, plus the mission file fields and the index row |

### 6.2 Repairs

No production behaviour needed changing, and none was changed. Two things were **added**, both
inside rule 10's allowance:

1. **The MB-001/MB-006 convergence on the restart sweep.** `main` (MB-001, merged at
   `d81a567`) added a test proving an interrupted task is never falsified as success across a
   restart, and MB-006 rewires the same sweep through the migrated checkpoint gate. After the
   merge both must hold, so the merged tree was run against both suites — see §6.3's merged-tree
   row. Nothing was weakened; if the merged tree had needed a code change it would have been
   made on the MB-006 branch under rule 10, but it did not.
2. **The reconciliation of the shared city files.** MB-006 edits the same
   `city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/tests/manifest.test.mjs`,
   `city/manifest.mjs`, both architecture docs and `services/capability-bridge/registry.mjs`
   that MB-001 and MB-003 touched. Resolving those conflicts is merge work, not new capability,
   and the mechanism is the one already established: keep MB-001's district-level
   `kind: "infrastructure"` **and** MB-003's/MB-006's module-level `capabilityProvider: false`,
   and take the **union** of every mission's modules and districts in the census constant.

### 6.3 Gates on this host

| Tree | Gate | Result |
|---|---|---|
| Branch `dab820b` | `pnpm test` / `city/test-all.mjs` / `apps/rooms` | 59/59 · 206/206 · 67/67 |
| Branch `dab820b` + MB-001's `main` (merged rehearsal) | all three suites | see §6.4 |
| Merged `main` after the merge | all three suites, promotion-history, check:docs | see §6.5 |

### 6.4 Evidence pointers

Host-local (git-ignored):

- `.runtime/evidence/mission-book/MB-006/run-1/INDEPENDENT-REVIEW-NOTES.md` — Part A's raw notes.
- `.runtime/evidence/mission-book/MB-006/run-1/restart-driver-v2.mjs`, `subject.mjs` — the real
  restart/relaunch driver and its supervised subject.
- `.runtime/evidence/mission-book/MB-006/run-1/run/{summary.json,audit.jsonl,subject.log}` —
  the machine-readable result, the append-only audit and the subject's own lifecycle log.
- `.runtime/evidence/mission-book/MB-006/run-1/restart-driver.log` — the console trace.
- `.runtime/evidence/mission-book/MB-006/run-1/donor/dsh-restart/` — the donor at `e20fb6cc`,
  used for the rung-by-rung ladder comparison and the `CheckpointOutcome` contract check.

Cross-host:

- `mission/MB-006-restart-recovery` @ `dab820b` (merged) plus this host's event stream.
- `data-records/evolution/episodes/mission-book/MB-006/episode.json`.
- This report, committed to `Digital-City` `main`.

### 6.5 Final record

```text
MISSION = MB-006
ROLE = VERIFICATION
HOST = Mech
CLAIM_COMMIT = 34e9f33
REVIEWED_BRANCH_HEAD = dab820b37ff39d1581b19dd43e75771507fb7139
RECONCILED_TREE = d83ad167b98276639d076a8095bfb449ef272aac
RECONCILED_CI = 36588756363 PASS (gateway-web + android)
VERIFICATION_COMPLETE_EVENT_SHA = 39e6b6019498e8e08b7d4cf219ac48627cee2bd6
VERIFIER_FINDING_SHA = eb7e987
EPISODE_SHA = 75edd7e7184ad9518e44f8cfd62636aa7276fc13
EPISODE_FILE = data-records/evolution/episodes/mission-book/MB-006/episode.json
EPISODE_ID = MB-006:0a48549fc6f5f8c6
EPISODE_SHA256 = 8247ecd76a7fbf713027d4f379b055dbe1017939e6dacd882e2c8682c9f8d3e8
EPISODE_STATUS = VERIFIED
FINAL_BRANCH_CI = 36589287739 PASS (gateway-web + android) at 75edd7e
MERGED_MAIN_SHA = ce33792ed50787e991b22465da28feabc8e50c50
MERGED_MAIN_CI = 36590045745 PASS (gateway-web + android)
MERGE_NOTE = main had advanced to 83ea44e (MB-002, verified by host Alien) while this episode
             was being finalized, so the two verified trees were reconciled in ce33792 rather
             than force-updating main; the reconciliation is the union of all exclusion
             mechanisms in registry.mjs and of all missions' modules in the census.
CITY_REPORT = mission-book/reports/MB-006/VERIFICATION_REPORT.md
```

The episode was generated from the verification events — `VERIFIER_FINDING` from the rule 9
review, `TEST_PASS`, `CI_RESULT=PASS` and `VERIFICATION_COMPLETE=PASS`, in that order — the
current-tree inbox was removed, and the data-only closeout was committed as `75edd7e`. That
final branch head was then run through the required CI again (`36589287739`, both jobs green)
before the merge, as rule 16 demands. All five gates were re-run on the merged tree: root
62/62, city 352/352, apps/rooms 67/67, promotion-history 10 records, `check:docs`
`SYNCHRONIZED`.

### 6.6 What this verification did **not** establish

1. **Crash-loop breaker and safe mode are not exercised as behaviour**, because the breaker was
   not migrated; the vocabulary and the `CRASH_LOOP` admission refusal are (§3.5, and the
   recorded `VERIFIER_FINDING`).
2. **A second host's live restart** — see §5.2; the mission-book does not define the reading,
   and rule 5 permits only one verification host.
3. **Donor parity beyond the ticket ladder.** The ladder was compared line by line and driven;
   the lock's transition table and the validator's full ladder were exercised through the real
   restart and the direct refusal probes, not through a differential against the donor.
4. **The Mission's `crash-loop/safe-mode targeted test` evidence item** is therefore not
   produced, and that is recorded rather than simulated.


