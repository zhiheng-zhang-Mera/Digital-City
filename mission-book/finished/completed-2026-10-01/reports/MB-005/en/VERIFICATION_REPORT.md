# Verification Report — MB-005

Reading translation / 阅读译本：Complete historical reading translation, not a second authoritative metadata or acceptance record. Original evidence blocks and both readings of the two-host gate are retained.

```text
MISSION = MB-005
ROLE = VERIFICATION
HOST = Alien
MIGRATION_HOST = Mech
IMPLEMENTATION_BRANCH = mission/MB-005-host-health
MIGRATION_HEAD = 545d38fa6cc7023826c5a3a4a09cb2e37265eb06
FINAL_BRANCH_SHA = 75f9acd1e6e4738b46f663412935624359ea586c
FINAL_BRANCH_CI = PASS — run 36593553358 (V0.2 checks) on 75f9acd1e6e4738b46f663412935624359ea586c
MERGED_MAIN_SHA = cfe34df1109dbe6a90348f1a671bae6ff1dc3074
VERIFICATION_COMPLETE = true
```

- Verification claim:2026-09-29T15:34:43Z, City commit `03f395dc623a86e99c64076c0542d7fa0be95b6f`.
- Rule 5: migration Mech, verification Alien, different hosts.
- Rule 9: section1 written and recorded as events before opening Migration Report; section2 reconciles it.
- One gate clause is a mission-design tension, section 6.1. Both readings recorded, nothing fabricated.

## 0. Why MB-005

Selection rerun against latest Digital-City main d6969d9 immediately before claim, rule 3. No migration claimable; choose migrated/unverified by ascending SEQUENCE. MB-003 BLOCKED_OWNER_DECISION; MB-006/007/008 closed to Alien under rules 5/13; this host just completed MB-004. MB-005 lowest eligible sequence.

## 1. Independent review

This section recorded before reading Migration Report. Only frozen donor, target code, diff, tests and runtime were reviewed.

### 1.1 Scope

| Item | Value |
|---|---|
| Branch | mission/MB-005-host-health @545d38fa6cc7023826c5a3a4a09cb2e37265eb06 |
| Merge-base | c7ef3cd1c6be0155332d03afc3607dfdbf49c205 |
| Size |27 files, +9737 lines; target 19 mjs files + DONOR.json + 2 test files |
| Donor | dsh-health-scheduler @985e2b7389330db4b32ea2946e3657746c64b47b |
| Target | city/02-engineering/03-host-health-station/host-health-station |
| Dependencies | node:assert/child_process/fs/os/path/process/test/url only; zero npm |

### 1.2 Code/diff findings

- F1: strongest parity evidence never ran as delivered. Differential test requires compiled donor .runtime/evidence/mission-book/MB-005/donor-health/lib/index.js at lines 59–60/638, named skip if absent. Directory absent in delivered branch, so no comparison executed.
- F2: no real telemetry runtime. Migration tests are constructive; header says no test reads node:os. Verification needs real telemetry normal/unknown/missing/sustained pressure/debounce. No product wiring:diff only module,manifest,census,two capability tests.
- F3: existing consumer needs no dashboard. Web device panel renders city.nodes[].telemetry CPU,memory,disk,uptime,freshness. Gateway register/heartbeat validates through descriptor validateTelemetry, then nodes/city snapshots. Meets existing-surface reuse.
- F4: missing-is-unknown and no reboot execution are hard module properties. Header states both; DECISION_LADDER tops at REQUEST_SYSTEM_REBOOT request; both shipped adapters only refuse.
- F5: shared capability tests rewritten as census-relative, same MB002/004 pattern. One genuinely weakened, section 3.3.

### 1.3 Independent lexical donor parity, not differential

Comment-stripped token multisets compare compiled donor and port:

| File | Result |
|---|---|
| bands/normalize/rolling/trend/pressure/policy/maintenance/safe-point/config/scheduler/audit/adapters | tokens identical except import specifiers |
| providers.mjs | union of 8 donor providers identical, only 3 PROVIDES constants renamed |
| types.mjs | identical except removed barrel |
| presets.mjs | nothing lost;PRESET_DOCUMENTS added, byte-equal donor presets JSON |
| report.mjs | nothing lost |
| Runtime exports | none missing;CANONICAL_METRICS (42), METRICS, DECISION_LADDER, PRESSURE_DIMENSIONS, PRESETS, LEVEL_BOUNDS, resolveConfig({}) all deepEqual |

Conclusion: the only behavioural divergence identified is donor bandKeyOf bug, copied rather than repaired.

### 1.4 Runtime/use

Real telemetry absent (F2). Existing consumer present but unwired (F3). No new UI/route/panel;server.mjs untouched.

### 1.5 Initial verdict

PASS-with-required-evidence. Port faithful by lexical evidence, but no executed differential, no real telemetry and one weakened test as delivered. All repaired in section 3.

## 2. Reconciliation with Migration Report

### 2.1 Confirmed, including reproducible strong agreement

| Claim | Independent result |
|---|---|
|6.2 differential 110 scenarios / 110 agreed / 916 ticks / 3433 entries / 89 decisions / 8 restart requests / 41 refusals | bit-for-bit reproduced after supplying donor |
|6.3 root 58/58, City 212/212, Rooms 67/67, docs synchronized, promotion 10 | each reproduced |
|7 never executes restart | audit agrees:20 module source files, no reboot/shutdown primitive; only providers.mjs can spawn injected telemetry helper |
|7 real use coverage 0.6, unknown runtime/worker/computer_use_ui | verifier's real telemetry independently produced the same coverage and three unknown dimensions |
|8.1 lower-is-worse bandKeyOf never returns :warn | donor/port line comparison agrees; copy pinned by a test that would fail if“fixed” |
|8.4 two hosts are the verifier's work | consistent with allocation |

### 2.2 Differences

| ID | Difference | Judgement |
|---|---|---|
|D1 | oracle and run-1/consumption-driver pointers are git-ignore files on other host; delivered evidence empty | causes F1 silent skip; R1 supplies and executes; recommend absent donor as failure |
|D2 | real telemetry cannot be reproduced from branch | R2 committed pilot replaces it with reproducible evidence |
|D3 |6.4 same census-fragility repair | F5; fourth branch carrying the same repair, merge by union |
|D4 |source: dsh-health-scheduler retained | agree;rename breaks field parity, a contract change rather than migration |
|D5 |knownDifferences says Two donor bugs, but donorBugsFound has only 1; determinism says no node:os, but test imports tmpdir | facts corrected in 3.3; other documentation defects carried |

### 2.3 Boundary agreement

Cordis bindings src/dsh, npm/Cordis packaging, model-facing tools and lib build outputs not migrated. Reboot execution excluded both here and in the donor. Empty DEFERRED list supported lexically: nonbinding donor logic all lands in report/settings/wiring/adapters.

## 3. Secondary repair and verification

### 3.1 R1 — Actually execute differential

Clone frozen donor `985e2b7389330db4b32ea2946e3657746c64b47b` into.runtime/evidence/mission-book/MB-005/donor-health. Build using the header recipe: typescript@5.7.2 + @types/node@22, npx tsc -p tsconfig.json, producing 62 files. Runtime is git-ignored; branch has zero changes.

```text
differential: 110 scenarios compared, 110 agreed, 0 disagreed; 916 ticks,
3433 per-metric entries, 89 decisions, 8 restart requests, 41 decisions carrying a refusal reason
differential actions: PAUSE_NEW_WORK=67 REQUEST_APP_RESTART=1 REQUEST_SYSTEM_REBOOT=7 THROTTLE=14
```

83 cases including 1 skip become 83/83, 0 fail, 0 skip.

### 3.2 R2 — Real telemetry runtime pilot

New scripts/mb005-health-pilot.mjs follows 20 existing pilots. Evidence.runtime/evidence/mission-book/MB-005/run-001/host-health-pilot.json.

| Stage | Result |
|---|---|
|A normal real telemetry | The port's defaultEnvironment + HardwareProvider + RuntimeProvider samples the host: 7 real metrics, cpu_usage 0.19%, ram_total_bytes 34101420032, ram_available_bytes, ram_used_ratio, uptime_seconds 227248, process_rss_bytes, handle_count. Scheduled coverage 0.6, unknown runtime/worker/computer_use_ui honestly reported. |
|B unknown/missing |coverage 0, six unknown dimensions, zero metrics fabricated as 0 |
|C sustained pressure | ram_used_ratio above critical 0.96 beyond sustainMs 120000 gives exactly one THROTTLE escalation |
|C debounce | six threshold oscillations, zero further escalation |
|D bounded requests | ladder tops at REQUEST_SYSTEM_REBOOT, a request; shipped app/system restart adapters return accepted:false/state:rejected; 20 source files have no reboot primitive; providers is the only spawn file |
|E existing consumer | same real telemetry: register 200; nodes reads back CPU 0.2%, memory.totalBytes 34101420032, uptime 227248, online true, exact Web/Android panel fields. No dashboard |

Honest correction after this report by MB-009: the pilot's shared-Gateway restart step actually failed. It called scripts/restart-gateway.ps1 through spawnSync('pwsh',…), but the historical host PATH had only powershell.exe. The call failed with ENOENT. Evidence gatewayStartExit:null records that failure, not a timeout. Stage E therefore used the already-running Gateway.

This does not invalidate stage E: MB-005 did not modify server.mjs, where the node telemetry channel resides, so the running Gateway and branch code agree at that seam. Real telemetry acceptance and unchanged readback really occurred. It does establish that shell subprocesses on that host must use powershell.exe, not pwsh. MB-009's pilot corrected this and confirmed that the new registry loaded after restart.

### 3.3 R3 — Repair weakened existing test, BLOCKING

Migration 5fbbec6 changed the capability-registry fixture from districts[2] to at(-1), 11-entertainment with only one building:

```js
assert.equal(new Set(added.map(c=>c.capabilityId)).size, buildingCount, '… a second building …');
```

The unique-id assertion becomes a one-element check that cannot fail, though the message claims the second building must not reuse the identity. Measured:

```text
原 fixture（09-planning-knowledge，2 buildings）：2 条 parser，2 个不同 id
弱化后（11-entertainment，1 building）      ：1 条 parser，1 个不同 id
```

Original 09-planning-knowledge has two buildings, giving two parsers/two ids; weakened 11-entertainment gives one/one. This violates the ban on test skips/deletions/relaxed acceptance for green. Restore 09-planning-knowledge and assert 2, verifying qualified 01-knowledge-service/parser versus 02-document-intake/parser. Restore the stronger id-based sibling assertion. Correct DONOR to one bug rather than two, and tmpdir rather than OS telemetry reads.

### 3.4 Modified-test review

| File/change | Judgement |
|---|---|
| registry first fixture, census relative | merge union with id lookup, exact qualified id and relative-count triple assertions |
| registry second fixture at(-1) | weakened, repaired in 3.3 |
| adapters absolute → census relative | acceptable: AVAILABLE===5 still absolutely pinned at bridge.test:26; loop still calls all available adapters |
| manifest census new row | not relaxed; hardcoded census requires all real paths |

No tests skipped/deleted/todo. Module has zero skips after R1 actual differential.

### 3.5 Acceptance matrix

Branch `977cd0c3487c4f1fd11e71b1f123007829f95ef1` includes R1–R3:

| Check | Result |
|---|---|
| module 19 files including donor |83/83, 0 fail/skip |
|City |212/212 |
|root |58/58 |
|Rooms |67/67 |
|promotion |10 OK |
|docs |three SYNCHRONIZED |

Merged main `cfe34df1109dbe6a90348f1a671bae6ff1dc3074`:

| Check | Result |
|---|---|
|root |62/62 |
|Rooms |67/67 |
|City |893 cases / 892 pass / 0 fail / 1 named EPERM symlink environment skip |
|promotion |10 OK |
|docs |three SYNCHRONIZED |

### 3.6 Real use

Stage E in 3.2 reuses the existing Web device-panel telemetry channel. No UI/route/dashboard, rule 14.

## 4. Utopia verified episode

- mission:finalize implementation CI 36593090881 on `977cd0c3487c4f1fd11e71b1f123007829f95ef1`,gateway-web/Android success.
- Episode data-records/evolution/episodes/mission-book/MB-005/episode.json,IDMB-005:bc50edf4e6a626d8.
- Inbox SHA256 `34b2a598cd3b4d3c698491c0b9ad46b21e745fd260b11a56f42bdd0c23ca4493`.
- Data-only closeout `75f9acd1e6e4738b46f663412935624359ea586c`.
- VERIFIED, 25 events, 4 findings, 3 repairs, 3 RUNTIME_PASS, 0 owner intervention as recorded in the episode description.

### 4.1 Event stream (25)

| Role/host | Type | Outcome |
|---|---|---|
|MIGRATION/Mech | MISSION_CLAIMED/ATTEMPT_STARTED×2 |INFO |
|MIGRATION/Mech |TEST_FAIL |FAIL |
|MIGRATION/Mech |REPAIR_APPLIED |REPAIRED |
|MIGRATION/Mech |TEST_PASS×2 |PASS |
|MIGRATION/Mech |OWNER_INTERVENTION donor bug decision |INFO |
|MIGRATION/Mech |CI_RESULT/MIGRATION_COMPLETE |PASS |
|VERIFICATION/Alien |MISSION_CLAIMED/ATTEMPT_STARTED |INFO |
|VERIFICATION/Alien |REPAIR_APPLIED R1 |REPAIRED |
|VERIFICATION/Alien |TEST_PASS |PASS |
|VERIFICATION/Alien |RUNTIME_PASS×3 real telemetry, unknown/pressure/debounce, bounded requests/consumer |PASS |
|VERIFICATION/Alien |VERIFIER_FINDING×4 independent review, differences, two-host tension, deep review |INFO |
|VERIFICATION/Alien |REPAIR_APPLIED R3 |REPAIRED |
|VERIFICATION/Alien |CI_RESULT/VERIFICATION_COMPLETE |PASS |

The source's episode description and eventtable are preserved independently, without resolving their owner-intervention wording here.

## 5. Merge and conflict resolution

Main already contains MB-001/002/004/006 merges during verification. Four conflicts, all shared control plane:

| File | Resolution |
|---|---|
|Citymanifest | Add only 03-host-health-station in 02-engineering, ascending building-id order. First full sort changed module order in 00-foundation/04-restart-recovery-station/02-document-intake; census failed. Revert and move only this building. Minimum change, total 17 modules. |
|manifesttest |keepmainEXPECTED_MODULESandMB001/002/003/004/006rows,insertMB-005indeclarationorder |
|adaptertest |Stronger main version: census relative + absolute AVAILABLE 5 |
|registrytest |Both converged after R3, strong same-shaped assertions; take the version with explanatory comments |

No scope expansion or acceptance weakening; R3 tightens.

## 6. Final gates

| Gate | Status | Evidence |
|---|---|---|
|existing consumer real status/history/error, no new dashboard |PASS |3.2E |
|bounded requests, no reboot execution |PASS |3.2D+lexical/source audit |
|real telemetry normal/unknown/pressure/debounce |PASS |3.2A–C |
|two hosts separately |TENSION RECORDED |6.1 |
|verifier differs from migrator |PASS |Mech/Alien |
|independent review before Migration Report |PASS |section 1 then 2, event proof |
|repairs only on same mission branch |PASS |R1 ignored, R2 pilot, R3 test/docs; verifier no production changes |
|no tests skipped/deleted/relaxed |PASS |3.4, R3 repairs weakening |
|required CI green |PASS |36593090881 + final 36593553358, both jobs |
|verifier merged main |PASS |cfe34df1109dbe6a90348f1a671bae6ff1dc3074 |
|episode + dual CI, rule 16 |PASS |4 + two runs |

### 6.1 Two-host clause — mission-design tension

Original gate:“Two hosts separately ran normal, unknown/missing, sustained pressure/debounce with real telemetry.”

- Reading 1, participant roles: met. Migrator has its own runtime evidence, event and 12 live samples in report 7; verifier has 3.2 runtime.
- Reading 2, two physical machines: cannot be satisfied in this session. Rule 5 allows one verification host and forbids a third; this host has only one machine.
- Same precedent as MB-006 verification 5.2: record both readings without asserting one.
- No second machine fabricated, no single run claimed twice, and the whole mission was not blocked over this. Other gates are independent and all met.
- Owner can accept Reading 1 or require true second-machine bounded follow-up with another machine.

## 7. Carry-forward observations

1. Differential depends on a local donor, silently skipped as delivered, the second occurrence after MB-004. Recommend self-fetch of the frozen donor or absence as failure.
2. bandKeyOf for lower-is-worse never returns warn, copied and pinned, correct under MIGRATION_ONLY. Owner decision recommended: warn → critical already satisfies sustain, contrary to intuition; a two-line change is semantic and requires a ruling.
3. checkManifestAgainstTree cannot detect an existing undeclared module, same as MB-004. Recommend independent manifest repair.
4. Fourth branch carrying the census repair: absolute catalog.length===6 should stop; merge continues relative count + absolute adapter invariant.
5. Remaining DONOR documentation issues: sourcePaths omits report.ts/plugin.ts, portedFiles claims them ported and notPorted also says “ported”; adaptation 3 calls functions private although exported by submodules, just not the barrel; tests absent from machine-readable ledger. Behaviour unaffected.
6. Six donor test files not delivered; 124 donor tests against the port are not reproducible in one command. Temporary copy produced 124 pass / 22 suites; recommend delivering the suite/runner.
7. Android emulator not run. No Android source change; CI Android success.

## 8. Evidence pointers

- Migrationreport mission-book/reports/MB-005/MIGRATION_REPORT.md.
- Utopia mission/MB-005-host-health.
- [ImplementationCI36593090881](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36593090881).
- [FinalheadCI36593553358](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36593553358).
- Branchpilot scripts/mb005-health-pilot.mjs.
- Ignoredruntime .runtime/evidence/mission-book/MB-005/run-001/host-health-pilot.json and WORKING_STATE.md.
- Episode path above,MB-005:bc50edf4e6a626d8.
- Merge `cfe34df1109dbe6a90348f1a671bae6ff1dc3074`.

语言配对 / Language pair: [原文 / Source](../VERIFICATION_REPORT.md)
