# Verification Report — MB-004

Reading translation / 阅读译本：Complete historical reading translation, not a second authoritative record. Original evidence and the explicitly unexercised Worker Gateway clause are retained.

```text
MISSION = MB-004
ROLE = VERIFICATION
HOST = Alien
MIGRATION_HOST = Mech
IMPLEMENTATION_BRANCH = mission/MB-004-project-foreman
MIGRATION_HEAD = 70806ad1277904c214f29f5da52cb5c7db1d90da
FINAL_BRANCH_SHA = 4ae80785696eac1ca077a45a4a5507d3802b3995
FINAL_BRANCH_CI = PASS — run 36590188621 (V0.2 checks) on 4ae80785696eac1ca077a45a4a5507d3802b3995
MERGED_MAIN_SHA = 0eed05b58c126a70224cb4757ba12f76bbe4d4b7
VERIFICATION_COMPLETE = true
```

- Verification claimed 2026-09-29T15:02:33Z, City commit `7d0569d4e68618721fdcb9e4a7c36c1cc7caa46a`.
- Rule 5: migration Mech, verification Alien, different hosts.
- Rule 9: independent section 1 written and recorded as events before reading Migration Report; section 2 reconciles it.
- One gate clause NOT exercised, flagged to Owner in 6.1, nothing faked.

## 0. Why MB-004

Immediately before claim, selection rerun against latest Digital-City main under rule 3. No migration remained claimable: MB-010/011/012 execution_enabled:false; MB-001/002 fully complete. Choose ascending SEQUENCE among migrated/unverified: MB-003 already claimed by Mech, rule 4 skip; MB-006/007/008 closed to Alien under rules 5/13. MB-004 is lowest eligible.

## 1. Independent review

Recorded before Migration Report. Review scope only frozen donors, target code, diff, tests, runtime.

### 1.1 Scope

| Item | Value |
|---|---|
| Branch | mission/MB-004-project-foreman @70806ad1277904c214f29f5da52cb5c7db1d90da |
| Merge-base | c7ef3cd1c6be0155332d03afc3607dfdbf49c205 |
| Size | 54 files, +22039 lines; source records target 26 mjs (25 ports + DONOR.json), 21 test files |
| Donors | DS-Hns eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b, 22 modules; Boss 8df428eaa437a409368401e95194e40266b83080, 3 |
| Target | city/02-engineering/01-project-foreman/project-foreman |

### 1.2 Code/diff findings

- F1: five donor differential tests did not run as delivered. Module 19 test files, 458 cases, 452 pass/0 fail/6 skips; five skips absent local donor-hns at adapters-autonomy:86–88 and plan-parity:58–59. Strongest parity assertions silently absent on clean hosts.
- F2: no runtime/real consumer evidence: no scripts pilot, no runtime output, raw evidence directory absent. Only real-process coverage donor-derived engineering-process-real running process.execPath -e. Verification explicitly needs real Engineering job, forbids unit-only substitute.
- F3: “through MB-003 Worker Gateway” impossible here. Only wave-1 skill-intake; adapter/resilience/task-contract exist only MB-003 branch, then Mech-held incomplete verification, rule 5 prohibits Alien touching it. Port has zero matches for worker-gateway/skill-intake/capability-bridge/02-worker-gateway, only node builtins and relative modules.
- F4: two intentionally retained donor bugs truly pinned: cancelled episode leaves workspace.lock, supervisor:390–408 asserts CANCELLED and lock exists, comment says repair must fail test. Unreachable bounded retry :414–450 asserts retry-parked 0, BLOCKED, repairRounds 0, donor attribution.
- F5: sole deliberate divergence independently confirmed. Boss recovery:366 retrieves rule, :369 dereferences inapplicable without guard, unknown class raw TypeError. Port :413–416 adds only if(!rule) throw.
- F6: completion gate unchanged, result port:184/donor:165 identical failed.length===0?COMPLETED:REFUSED; same REFUSAL_REASONS, no FAILED verdict.
- F7: honest deferral: index does not re-export requirements-driven DAG/acceptance-hub, no RequirementsGraph producer as header says.
- F8: shared capability tests rewritten weaker than then main if adopted wholesale. Census-relative and at(-1), while post-MB001 main has id-located exact qualified identity. Merge must union.
- F9: manifest/census purely add one building/module with 22 Hns source paths and one row; no existing entries changed.

### 1.3 Donor parity

All 22 Hns modules and Boss recovery/ci-repair/correction ported. Union stays union: failure.mjs 16 lowercase classes + repair memory; failure-recovery.mjs 13 uppercase + class budgets, neither imports/translates the other. DONOR records 8 bugs, 5 PORT_ADAPTATION classes, 7 DEFERRED.

### 1.4 Runtime/use

Only donor-derived real case available; full job evidence missing F2. No UI/route/panel or server change. Host consumer is run({workspace,goal,contract,...}).

### 1.5 Initial verdict

PASS-with-required-evidence: faithful, sole divergence checked, donor defects pinned honestly, completion unchanged, deferrals honest. Missing runtime F2 and Gateway ruling F3 handled in sections 3 and 6.1.

## 2. Migration Report reconciliation

### 2.1 Confirmed

| Claim | Result |
|---|---|
| 2/2.1 boundary and 25 mappings | matches each diff |
| 6.1 City 586 pass/0 fail/1 skip | identical after donor:587 cases/586 pass/0 fail/1 skip |
| 6.4 REFUSED rather than FAILED | independent F6, exact expression |
| 8.1 sole divergence | F5 donor verified |
| 8.5 two bugs | F4 pinned bugs, never asserted fixed |
| 8.4 deferral not omission | F7 confirmed |
| 10.1 single-volume cross-volume skip | observation agrees; remaining named EPERM symlink skip is environment |
| 8.7 local Android unavailable, real job verifier work | agrees with roles |

### 2.2 Differences

| ID | Difference | Judgement |
|---|---|---|
| D1 | donor and run-1 logs are ignored files on other host, absent delivered branch | F1 clean-host skips; R1 supplies and executes. Recommend reproducible acquisition or absent-donor TEST_FAIL |
| D2 | 8.2 predicted three independent shared repairs, later duplication/conflict | confirmed by main MB001/002 conflict, section 5 |
| D3 | report omitted capability list 5→6 with never-invocable Foreman BRIDGE_PENDING | real product change 6.2; infrastructure MB002 filtered, domain engineering not covered |

### 2.3 Boundary

No sub-worker (MB003), engineering-host, Computer-Use, City-wide authority or capability/node global truth. Process module did not port computer-use processes/errors; retains injected registry seam with minimum local registry, agrees 3.2.

## 3. Secondary repair and verification

### 3.1 R1 — Execute differential

Create runtime donor-hns junction to D:\DS-Hns-donor. HEAD checked `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b`, exact frozen baseline. Runtime ignored, branch zero change. Five formerly skipped tests actually execute and pass:

```text
✔ the adapter port agrees with the donor module for every adapter and fixture
✔ the autonomy port agrees with the donor module decision by decision
✔ the episode port agrees with the donor module transition by transition
✔ the failure module agrees with the donor module field by field
✔ the discovery module agrees with the donor module field by field
```

Adapter fixture, autonomy decisions, episode transitions, failure fields and discovery fields all agree with donor.

### 3.2 R2 — Real end-to-end pilot

New scripts/mb004-foreman-pilot.mjs follows 20 existing pilots. Real scratch git repo, node --test subprocess, git fingerprint, workspace lock, mutation journal/ownership, checkpoint/recovery store and result gate. Evidence runtime run-001/foreman-runtime-pilot.json.

| Stage | Result |
|---|---|
| 1 real job | COMPLETED, 6 steps, patch truly on disk, real suite exit 0, 5 checkpoints; INITIALIZING→DISCOVERING→PLANNING→TESTING→EDITING→TESTING→VERIFYING |
| 2 graceful interruption | CANCELLED at step 2; readable checkpoint nextStepIndex1, verified template:reproduce:1; lock retained, real donor bug 2; resume refuses terminal episode cannot be made active by checkpoint write |
| 3 process kill/resume | Killed live episode with verified reproduce:1 and patch:3, seq6; stale lock left. Original episode id + explicit stealStaleLock resumes COMPLETED in 4 rather than 6 steps, skips EDITING because verified work not redone: continuation, not restart |
| 4 ownership refusal | User uncommitted edits target file; REFUSED because tests did not pass and unresolved critical failure remains; user bytes unchanged |

Stage 3 also confirms original episode id required, otherwise EPISODE_ID_MISMATCH; abandoned lock not stolen by default, explicit contract.stealStaleLock needed; terminal episode cannot revive from checkpoint. Only abandoned running episodes resume, gracefully cancelled ones cannot.

### 3.3 Acceptance matrix

Branch `5ef0b2c7bbf7f24b5eb4a32d2cc5c7faa59c2af6`:

| Check | Result |
|---|---|
| City |587/586 pass/0 fail/1 skip |
| Module19 files with donor |458/457 pass/0 fail/1 skip |
| Root |58/58 |
| Rooms |67/67 |
| Promotion |10 OK |
| Docs |three SYNCHRONIZED |

Merged main `0eed05b58c126a70224cb4757ba12f76bbe4d4b7`, includes concurrent MB006:

| Check | Result |
|---|---|
| Root |62/62 |
| Rooms |67/67 |
| City |810/809 pass/0 fail/1 skip |
| Promotion |10 OK |
| Docs |three SYNCHRONIZED |

### 3.4 Real use

Host run() entry, index line 132 with 59 exports; no new UI/route/panel or server modification, rule14. Android emulator not run, Android source untouched; CI Android success.

### 3.5 Failure/recovery

Stages 2/3. Resume rechecks rather than trusts: verifyResume refuse/restart/resume, plan-digest gate, executor compatibility ported and donor-tested.

## 4. Verified episode

Implementation CI 36588931173 on `5ef0b2c7bbf7f24b5eb4a32d2cc5c7faa59c2af6`, both jobs success. Episode data-records/evolution/episodes/mission-book/MB-004/episode.json, ID MB-004:d5d6498644ddb928. Inbox SHA256 `0ace61003f823fff70f5f13bee446b20767b0caba2f1d0d8a609be06cbeead65`. Closeout `4ae80785696eac1ca077a45a4a5507d3802b3995` data-only episode plus removal inbox events. VERIFIED, 18 events, 3 findings, 2 repairs, 2 ATTEMPT_STARTED, 3 TEST_PASS, 2 RUNTIME_PASS, 0 Owner interventions.

### 4.1 Event stream: 18 events

| Role/host | Type | Outcome |
|---|---|---|
| Migration/Mech |CHANGE_APPLIED/ATTEMPT_STARTED |INFO |
| Migration/Mech |REPAIR_APPLIED |REPAIRED |
| Migration/Mech |TEST_PASS/CI_RESULT/MIGRATION_COMPLETE |PASS |
| Verification/Alien |MISSION_CLAIMED/ATTEMPT_STARTED |INFO |
| Verification/Alien |VERIFIER_FINDING F1–F4 and F5–F9 |INFO |
| Verification/Alien |REPAIR_APPLIED R1 |REPAIRED |
| Verification/Alien |TEST_PASS R1 |PASS |
| Verification/Alien |RUNTIME_PASS real job and interruption/recovery |PASS |
| Verification/Alien |VERIFIER_FINDING Gateway clause |INFO |
| Verification/Alien |TEST_PASS isolation/completion |PASS |
| Verification/Alien |CI_RESULT/VERIFICATION_COMPLETE |PASS |

## 5. Merge/conflict resolution

Main advanced twice: MB002 verification 83ea44e, then MB006 ce33792. Three conflicts shared control files.

| File | Resolution |
|---|---|
| Manifest | automatic success, 16 modules = 4 MB006 + 1 MB004 + 11 existing |
| Manifest test | retain main EXPECTED_MODULES and 001/002/003/006 rows, insert 004 declaration order, update comments |
| Adapters test | retain id fixture and AVAILABLE invariants; delete absolute catalog.length===6 |
| Registry test | stronger main exact qualified id+census relative+distinct cross-building names |

Deleting 6 is not relaxing for green: three missions diagnosed census fragility, legitimate descriptor additions inevitably break it (test observed 7 after merge). Stronger replacement catalog.length===baseline.length+1, exactly future addition; AVAILABLE===5, five unaffected adapters; AVAILABLE same as baseline. Report section 8.2 recommend this. Actual merged descriptors 6, AVAILABLE 5; original observation distinctions retained.

## 6. Final gates

| Gate | Status/evidence |
|---|---|
| real job inspect/plan→result/evidence, not unit-only |PASS, section 3.2 stage 1 |
| controlled interruption/continuation |PASS, stages 2/3; killed live process resumed in 4 steps |
| isolation/worktree/ownership |PASS, stage 4; user bytes preserved |
| final acceptance |PASS, F6, donor COMPLETED/REFUSED |
| different hosts |PASS, Mech/Alien |
| independent before report |PASS, sections 1/2, event proof |
| repairs same branch |PASS, R1 ignored, R2 one pilot, no production modifications |
| no test skipping/deletion/relaxation |PASS, five skips executed,one named environment remains |
| required CI |PASS, 36588931173 / final 36590188621, both jobs |
| verifier merged main |PASS, 0eed05b58c126a70224cb4757ba12f76bbe4d4b7 |
| episode + dual CI, rule 16 |PASS, section 4 / two runs |

### 6.1 Gate clause NOT exercised

Original requirement: run a real Engineering job through MB003 Worker Gateway, inspect/plan to result/evidence, no unit-only substitute.

- Done: real complete job, stage 1, not units.
- Not done: it did not route through MB003.
- Why: three Gateway modules only unmerged branch, verification Mech-held, rule 5 forbids Alien touch. Zero coupling: Gateway provider runtimes web/codex/api/local, Foreman own process executor. Linking requires glue in neither donor, forbidden MIGRATION_ONLY.
- Choice: meet real substance with real job/process/evidence, never fake routing; explicitly raise Owner. No unverified sibling code or wider scope for acceptance.
- Owner options: accept real job+zero-coupling equivalent; after MB003 main bounded route follow-up; or superseding mission. No presumed conclusion.
- Latest when report written: MB003 Verification BLOCKED_OWNER_DECISION in index row 3, Gateway will not soon main. Follow-up option depends Owner resolving 003; same decision blocks both.

### 6.2 Cross-mission observation: one non-invocable product entry

Web/Android capabilities 5→6:

```text
planning.document.intake, planning.knowledge.query, engineering.skill.inspect,
research.evidence.review, presentation.theme.lab,
city.02-engineering/01-project-foreman/project-foreman   ← 新增，BRIDGE_PENDING，永远不可调用
```

New Foreman BRIDGE_PENDING, never callable. Both honest: Web bridgeState/cityLifecycle and disabledRun; Android canInvokeCapability likewise disabled. Not new UI built for gate, but accepted surface changed and conflicts with MB001 registry rationale that non-product kernel modules must not advertise an unavailable operation.

MB002 foundation infrastructure filtered by DISTRICT_KINDS. Foreman domain engineering not filtered, so descriptor inevitably appears. Verifier did not self-fix, requiring registry semantics/new manifest field beyond rules 10/11. Recommend Owner unified City mechanism, e.g. module capabilityProvider:false or non-capability building, not per-mission patches.

## 7. Carry-forward

1. Local-donor differential silent skip as delivered; acquisition runner or absence failure needed, otherwise parity nonexistent elsewhere.
2. Graceful cancellation terminal cannot resume; abandoned run can, explicit stealStaleLock. Host wanting later continuation must use latter donor semantics.
3. Three independent census repairs now main via002/004, future domain addition still changes descriptors. Two expressions same root, govern once.
4. Stop absolute catalog 6 assertions; three missions hit them, merge now relative.
5. Android emulator not run; source untouched/CI success, no on-device click evidence.

## 8. Evidence pointers

Migration mission-book/reports/MB-004/MIGRATION_REPORT.md; Utopia mission/MB-004-project-foreman. [Implementation CI 36588931173](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36588931173), [final 36590188621](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36590188621). Branch scripts/mb004-foreman-pilot.mjs. Ignored runtime run001/foreman-runtime-pilot.json and WORKING_STATE.md. Episode path/ID above; merge `0eed05b58c126a70224cb4757ba12f76bbe4d4b7`.

语言配对 / Language pair: [原文 / Source](../VERIFICATION_REPORT.md)
