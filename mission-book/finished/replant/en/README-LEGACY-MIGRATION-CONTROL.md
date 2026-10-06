# Mission Book — Migration Closed / Pre-Assistant Product Closeout Control Plane

[Authoritative historical source / 权威历史原稿](../README-LEGACY-MIGRATION-CONTROL.md)

Complete historical reading translation; inactive history, no new authority or activation. / 完整历史阅读译文；不产生新权威或激活历史任务。

> CURRENT MODE OVERRIDE — R12,2026-09-30: MB-001..012 migration/verification is closed. Owner-directed work is the Pre-Assistant Utopia Closeout Workbook. The old migration scheduler is authoritative only for historical interpretation or explicit Owner reopen, not current product scheduling.
>
> This is an inactive historical reading translation. “Current” below refers to the original record’s date and does not activate this historical control plane.

## Construction progress at the recorded time

Legend: green means accepted function/stage; red means incomplete, blocked or not started. Current Mission frontmatter determines claims.

- MB-007 repair step1 closed2026-09-30: repaired and merged Owner-override finalizer contract,merge d850d73; verified episode MB-007:553ab7ba1c4b0902,sha2561c5742fb…; inbox consumed. Original RUNTIME_FAIL/BLOCKED remains. Next was MB-008step2.
- MB-008step2 closed2026-09-30: value ROUTE_B_CONTINUE; synchronized main77b774c first; bounded Computer-Use chain allgreen, happy path, real refusal without side effects, real miss/recovery and successful postcondition,NO_MOCK_FACTS=true. RUNTIME_PASS/CI_RESULT/VERIFICATION_COMPLETE recorded; Owner-override episode MB-008:6ae0bbd46e425c9f,sha256a4b6e8fc…,inbox consumed; finalbranchCI36663533485PASS,merge168182c,mainCI36663813362PASS. Alien RUNTIME_FAIL/BLOCKED retained.
- MB-003step3 closed2026-09-30: Utopia work already completed and merged756c7d7,episode MB-003:5c0ab438d20476d1,mainCI36671850064PASS. This only corrects an omitted City bookkeeping synchronization, not renewed construction or evidence it had previously been incomplete.
- MB-010assessment closed2026-09-30,NO_VALUE,Mech branch mission/MB-010-node-fabric at8380c38. All five NF01..05 planned abilities already equivalently or better covered by claim-time Utopia756c7d7; zero gaps/migrations. MB001 migrated fleet-routing from the same frozen donor8df428e: fleet.ts,capability-router.ts,node-capabilities.ts,adaptive-routing.ts. Running dev-gateway/reference-node/Web owns registration,heartbeat/liveness,endpoint,telemetry and capability-host broadcast. Remaining TenxNodeRegistry/TenxNetworkRegistry/TenxObservability are not wired in frozen production: no main/bootstrap import,node.yaml modules empty. Real bounded runtime8/8,fleet28/28,rootgateway+telemetry+Web11/11,total47PASS/0FAIL. R1/R4 green completion; retain branch,no episode. LaterR11 archives provenance into main,as below. Report MB010/ASSESSMENT_REPORT,nextMB011.
- MB010/011/012 independent review,provenance archive and mandatory Alien NO_VALUE record,R11: Owner instructed independent re-verification without reusing tests, permitting real Android forMB010; after pass merge branches and retain operation/SHA history. All three NO_VALUE confirmed without reservation. MB010 frozen donor has zero newTenxNodeRegistry/newTenxNetworkRegistry construction points,tenx absent composition root; real PERM00Android12 after pairing renders node list,ONLINE versus OFFLINE·Cached and18.4GB telemetry exactly matching gateway usedBytes19740823552. MB011 neither donor consumes plugin-install; five tampered manifests individually rejected and control accepted; promotion provenance passes against realGit history;fabric refuses second owner by name. MB012 electron/capability has no in-app importer,main.ts1003 constructs ExecutionGate without options so authorizer cannot fire,runtime-policy.json only hashed never parsed; live paths refuse OPERATION_BLOCKED/INPUT_TOO_LARGE.

The only report revision: MB011§2.4 “in dead code” misleadingly suggested all plugin-adapters unreachable. Actual contract.cjs is loaded by live app/plugin-host.cjs and does reject permission vocabulary,invalidmanifest and adapterfaultcode. Rewritten in place to the accurate “isolation metadata has no consumer.” MB010/012 corresponding statements verified accurate,unchanged.

Provenance merges use --no-ff,three branches each one commit/five files/no implementation/zero conflicts: MB0108380c38→6e9781c;MB01182b6ac4→f22273c;MB012d071328→e0d9470. Alien appends nine VERIFICATION/Alien events,three perMission:OWNER_INTERVENTION,VERIFIER_FINDING=PASS,VERIFICATION_COMPLETE=PASS,all sourceRef R11, record commit d0dea7b. merged_main_sha stays null for all three because no implementation migrated. assessment_result/migration_completion_basis/verification_status unchanged. Remote branches retained;Mech assessment events retained without ghostwriting. R11 overrides READMEline223 only for these three branches.

| Project | Migration role | Migration | Verification role | Verification |
|---|---|---|---|---|
| MB001CoreOS | Alien | Accepted | Mech | Accepted |
| MB002CapabilityFabric | Mech | Accepted | Alien | Accepted |
| MB003WorkerGateway | Alien | Accepted | Mech+AlienR10closeout | Accepted |
| MB004ProjectForeman | Mech | Accepted | Alien | Accepted |
| MB005HostHealth | Mech | Accepted | Alien | Accepted |
| MB006RestartRecovery | Alien | Accepted | Mech | Accepted |
| MB007ResearchInstitute | Alien,Owneraccepted | Accepted | Mechrepair1complete | Accepted |
| MB008ComputerUse | Alien,Owneraccepted | Accepted | Mechrepair2complete | Accepted |
| MB009ThemeRelocation | Mech | Accepted | Alien | Accepted |
| MB010NodeFabric | Mechassessment | Accepted | NotrequiredNO_VALUE;Alienindependent+R11archive | Accepted |
| MB011Customs | Mechassessment | Accepted | NotrequiredNO_VALUE;Alienindependent+R11archive | Accepted |
| MB012RuntimeCompliance | Mechassessment | Accepted | NotrequiredNO_VALUE;Alienindependent+R11archive | Accepted |

The original describes this directory as the current construction control plane for confirmed City migrations. Active rules at that time are response930R12,the Pre-Assistant engineering book and this file. Earlier Mission frontmatter/migration rules reactivate only for historical interpretation or explicit Owner reopen. Past rules/reports supply provenance,not newtaskruntime rules.

## 0. Mode and boundaries

```text
MODE = PRE_ASSISTANT_PRODUCT_CLOSEOUT
MIGRATION_QUEUE = CLOSED
NEW_DONOR_MIGRATION = FORBIDDEN
MISSION_REOPEN = OWNER_ONLY
IMPLEMENTATION_LANDING = Utopia
CITY_REPO = control / decision / acceptance metadata
CURRENT_WORKBOOK = ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md
ALLOWED_PRODUCT_SCOPE = T0 + T1 + T2 + T3 + T4
ASSISTANT_LAYER = FORBIDDEN
BOSS_HNS_CONNECTORS = DEFERRED
```

Current R12 product work is not migration. T1–T3 may add necessary product UI/adapters/Action/deterministic routing strictly within the bound book. Do not label product work donor migration or expand into excluded later abilities.

Original migration/assessment/verification rules below remain for explaining MB001..012 history,or conditional revival on future explicit Owner reopen. They are not T0–T4’s scheduler.

## 1. Authority order

Interpret conflicts in order: latest explicit Owner response930; response929 rulings not overridden; this file’s current rules; Mission frontmatter and specificgates; actual current Utopia main; historical Assessment/Migration/Verification reports; purely historical past-rules. Old report rule numbers,judgements/blockers do not automatically override laterOwner rulings.

## 2. Two stages retained; selected Missions gain pre-migration Assessment

Ordinary Missions retain Migration/Verification. assessment_required=true,then MB010..012,adds a value gate with no implementation commitment. Compare donor against claim-time latest main;only FULL_MIGRATION/PARTIAL_MIGRATION/NO_VALUE. Assessment belongs to migration side;same host becomes Migration if continued.

### Migration completion semantics

migration_complete=true no longer requires copied code. Record basis:

- IMPLEMENTED_COMPLETE:actual migration and MIGRATION_COMPLETE/PASS.
- OWNER_ACCEPTED_COMPLETE:honest blocker/negative result, then Owner explicitly accepts boundary/declares complete. Never fabricate original host PASS.
- SKIPPED_NOT_REQUIRED:completeAssessment establishes entire migration valueless or already covered; fully skipping implementation still complete.

For NO_VALUE:

```text
assessment_status = COMPLETE_NO_VALUE
assessment_complete = true
assessment_result = NO_VALUE
migration_status = SKIPPED_COMPLETE
migration_complete = true
migration_completion_basis = SKIPPED_NOT_REQUIRED
verification_status = NOT_REQUIRED_SKIPPED_COMPLETE
verification_complete = true
merged_main_sha = null
```

City must still report “judged no value; task retained; not migrated.” Preserve assessment branch/report/evidence for provenance/paper;do not invent code, Verification or episode.

Actual Migration/Owner-accepted boundaries retain independent states: Migration host completes work/tests/report/required real run, may not merge main. Other physical host performs independent review, latest main synchronization, repair/real run, two CI gates, finalize and merge. Hosted runner is not an execution host.

“Both hosts must run” defaults to real evidence by Migration and Verification,not a third machine/second verifier. Additional physical device only if a specific gate says so.

## 3. Claim algorithm: Integration First

At the beginning of each round, read the latest Digital-City main and select in this order.

### P-1 — Owner-directed repair queue: temporary highest priority

```text
1. MB-007 process closeout / Owner-override finalizer repair — COMPLETE
2. MB-008 verification + closeout — COMPLETE
3. MB-003 current-value reassessment + real execution-seam repair if still valuable — COMPLETE
   · value = ROUTE_B_CONTINUE; the donor execution seam migrated as `worker-runner`; two-host gate satisfied
   · episode `MB-003:5c0ab438d20476d1`; merge `756c7d7`; host separation OWNER_WAIVED under R10
```

A later step cannot merge/finalize until the previous repair_status is COMPLETE. Read-only reconnaissance is permitted, but no out-of-order completion claim. Each repair must use this state transaction:

```text
City pre-state commit
→ Utopia work/evidence
→ City milestone update
→ CI/finalize/merge (or SKIPPED_COMPLETE)
→ City final closeout commit
```

If it fails midway, City must stop at a repair_status matching reality. Never wait until the end to reconstruct bookkeeping.

### P0 — Verification / Integration

```text
execution_enabled = true
migration_complete = true
verification_complete = false
verification stage unclaimed or already claimed by this host
current host != migration_claim_host
not BLOCKED_OWNER_DECISION (unless the latest applicable Owner ruling has explicitly resolved it)
```

Within P0, prioritize substantive Mission branches substantially behind implementation main, then branches touching shared control planes, then ascending sequence.

Shared areas are city/CITY_IMPLEMENTATION_MANIFEST.json, city/manifest.mjs, city/tests/manifest.test.mjs, services/capability-bridge/** and global census/registry/shared contracts/promotion-history verification. Touching them automatically raises integration priority. Any Mission branch more than ten commits behind main, or touching shared control while main has advanced, creates P0 integration pressure.

### P1A — Assessment-first Mission

Only when this host has no claimable P0:

```text
execution_enabled = true
assessment_required = true
assessment_complete = false
assessment stage unclaimed
dependencies satisfied
not BLOCKED_OWNER_DECISION
```

Choose ascending sequence. Create a branch containing only process records and evidence, without writing implementation first. Until product/runtime code changes, an assessment-only branch does not count as substantive WIP.

FULL_MIGRATION or PARTIAL_MIGRATION atomically transfers the same assessment host into Migration and P1B. NO_VALUE closes under SKIPPED_NOT_REQUIRED: both completion flags true, task retained/not migrated, no episode, automatically skipped unless Owner reopens.

### P1B — New Migration

Only when this host has no claimable P0:

```text
execution_enabled = true
migration_complete = false
migration_completion_basis is not SKIPPED_NOT_REQUIRED
migration stage unclaimed OR reserved by this Mission's assessment host
dependencies satisfied
not BLOCKED_OWNER_DECISION
global unmerged substantive mission WIP < 2
for assessment_required missions:
  assessment_complete = true
  assessment_result in {FULL_MIGRATION, PARTIAL_MIGRATION}
```

Then choose ascending sequence.

### WIP Limit

UNMERGED_WIP_LIMIT = 2. WIP means Mission branches with substantive implementation commits not yet in main, including branches waiting for Verification or Owner ruling. Pure assessment events/comparison evidence without implementation do not count. Historical backlog may temporarily exceed two, but new substantive Migration freezes until the integration backlog drops below two. Do not manufacture branches merely to give a machine work.

## 4. Claims and host eligibility

- Update the corresponding Mission and commit to Digital-City main before claiming.
- An assessment-required Mission first claims Assessment. FULL/PARTIAL automatically passes Migration to the same host; another host cannot race between stages.
- Pin claim-time Utopia main SHA. Comparisons must not rely on old reports or directory impressions.
- A write conflict means claim failure: reread latest state and choose again.
- Other hosts cannot preempt an unfinished stage claim.
- An automatic worker cannot clear another host’s claim.
- Owner can reset a claim with no substantive implementation/report. If substantive work exists but cannot continue, use BLOCKED_OWNER_DECISION or an Owner-created superseding Mission.
- Index should show Migration host and Verification-eligible host where practical, but Mission frontmatter remains claim truth.

## 5. Dependency semantics

Unless a Mission explicitly weakens the requirement, dependencies satisfied means the required implementation was accepted by Verification and entered the target implementation main. migration_complete=true with code still on an unmerged branch does not suffice.

## 6. Branch freshness and merge policy

### Assessment-first

Create from claim-time latest main. Before verdict, only process records, structured events and bounded research evidence; implementation is forbidden. FULL/PARTIAL makes the same branch Migration. NO_VALUE pushes and retains it as provenance/research, without merging or deleting. This historical rule is later overridden by R11 for exactly three branches.

### Migration

Create from latest main:

```text
mission/<MISSION_ID>-<slug>
```

Do not merge main during Migration.

### Verification / Integration

Reread latest main before repair and final verification. If behind, prefer merging main into the Mission branch to retain cross-host history; by default do not force-push or rewrite the Migration host’s history. Resolve shared manifest/registry/census unions and semantic conflicts before Mission gates. After one old branch merges, the next must resynchronize against the new main. Do not verify several old branches in bulk against the same stale main.

## 7. Real consumption gate: v2

### 7.1 An equivalent product consumption surface exists

Migration and Verification must really exercise the semantically equivalent existing Utopia seam. Pure unit tests cannot substitute.

### 7.2 Infrastructure/pipeline modules lack an equivalent surface

For an explicitly nonproduct capability source, such as capabilityProvider:false, if no equivalent product seam exists and wiring current UI/services would add a capability, alter existing rulings or cross Buildings, do not invent UI/capability for acceptance. Verification may directly execute the migrated module through a real, bounded, reproducible integration chain, recording inputs, outputs, failure/recovery, parity and evidence to satisfy real consumption.

### 7.3 Critical execution cannot use that exemption

When the core product value is a real external provider gateway, runner or device/backend execution seam, missing provider/runtime cannot be bypassed through §7.2. Use an actual donor-supported provider/runtime, or obtain Owner authorization for a superseding Mission to migrate the deferred execution seam. Mock pass remains forbidden.

## 8. Nonproduct modules and capability registry

City defaults: a nonproduct module may declare capabilityProvider:false. Enumeration must not expose such a module as an uncallable product capability. A Building may override its District’s default kind when necessary; unified effective-kind logic decides. Specific Owner rulings are in response-9-29.md.

## 9. Independent Verification

First inspect donor, target code, diff, tests and runtime, recording independent findings. Only then read Migration Report for reconciliation. Necessary repairs stay on the original branch. Never delete tests, skip gates or relax target semantics to obtain green.

A missing donor causing parity-test skip is not parity pass. Record the absence, reacquire the frozen donor where possible, or mark that gate unverified.

## 10. Reports and Utopia dogfooding

```text
mission-book/reports/MB-xxx/
├─ ASSESSMENT_REPORT.md    # assessment_required Mission 必填；所有 verdict 都保留
├─ MIGRATION_REPORT.md     # 仅实际迁移时
└─ VERIFICATION_REPORT.md  # 仅实际迁移时
```

Assessment Report is required for assessment-required Missions and all verdicts. Migration and Verification reports apply only to actual migration. Follow PROCESS_DATA_POLICY:

- Raw evidence: .runtime/evidence/mission-book/...
- Bounded events: data-records/evolution/inbox/mission-book/...
- Accepted episodes: data-records/evolution/episodes/mission-book/...

After an Owner ruling, the next actual worker touching the branch appends OWNER_INTERVENTION referencing the latest applicable ruling. MB-010..012 reference Digital-City/mission-book/response-9-30.md this round.

## 11. Finalize / two CI gates / Merge

### 11.1 Ordinary implementation migration

```text
independent review
→ merge latest main into mission branch when needed
→ repair / real-use verification
→ implementation required CI GREEN
→ CI_RESULT PASS
→ VERIFICATION_COMPLETE PASS
→ pnpm mission:finalize (host-pass)
→ commit episode + inbox removal
→ FINAL BRANCH HEAD required CI GREEN
→ Verification Host merge main
→ City VERIFICATION_REPORT / Mission metadata
```

### 11.2 Owner-accepted migration

If Migration honestly recorded BLOCKED and Owner explicitly accepts the boundary and declares completion, never fabricate Migration’s MIGRATION_COMPLETE/PASS. Finalizer must support explicit owner-override basis requiring the ruling, OWNER_INTERVENTION and original blocker. Episode stores migrationAcceptance.mode=OWNER_OVERRIDE and ruling reference. Verification still needs independent finding, real bounded chain where applicable, PASS CI and VERIFICATION_COMPLETE/PASS.

### 11.3 Fully skipped

SKIPPED_NOT_REQUIRED accepts no implementation: no mission:finalize, no fake verified implementation episode, no Utopia merge requirement. City Assessment Report and immutable branch/evidence close it. Both completion flags become true. Any path actually finalizing must still run final branch HEAD CI afterward.

## 12. Assessment-first candidates

Owner enabled MB-010..012 on 2026-09-30 as automatically claimable value-assessment Missions, not disabled placeholders:

- Node Fabric compares Boss against current Utopia node/host/capability truth.
- Customs compares donor admission against manifest/promotion/capability/provenance checks.
- Runtime Compliance compares donor enforcement against City Core/Capability Fabric/runtime gates.

First assess, then decide migration. Fill a capability comparison directly in the Mission. NO_VALUE explicitly means judged no value, task retained, not migrated, no implementation; mark both stages complete under SKIPPED_NOT_REQUIRED. PARTIAL permits only bounded subsets filling real gaps. Retain positive/negative results, parity, failure/abandonment reasons and measurable indicators for paper/engineering material. Utopia uses runtime evidence, evolution inbox and selective evidence/raw. Generate a verified episode only after actual migration and Verification; fully skipped Missions generate none.

## 13. Recorded 7 → 8 → 3 closeout

Binding book: ENGINEERING_BOOK-2026-09-30-MB-007-008-003-CLOSEOUT.md.

Step 1, MB-007: COMPLETE. Implementation, Owner-override finalizer, episode and repair merge closed. Further Research Institute implementation changes are forbidden.

Step 2, MB-008: COMPLETE on 2026-09-30. Value ROUTE_B_CONTINUE because main lacks 10-automation and does not cover safety/contract surfaces. First synchronized main 77b774c, reconciled CI 36655586918 PASS. Bounded chain passes happy path; real DESTRUCTIVE_FORBIDDEN refusal with zero mutation and byte-identical artefacts; real miss from genuinely deleting a file, actual facts.fileExists absent, donor postcondition failure/file; recovery through donor retry/RETRYABLE, settle stable → landed, then success. NO_MOCK_FACTS=true.

RUNTIME_PASS bbf126ea…, final CI_RESULT PASS 06f57c06…, VERIFICATION_COMPLETE PASS fd0225d1…. Owner-override episode MB-008:6ae0bbd46e425c9f, sha256 a4b6e8fc6c87d07a3ac03a767e9a12f92bdf32931f37e624e48650a5a5b87e0e, inbox consumed. Alien RUNTIME_FAIL/BLOCKED retained, no fabricated MIGRATION_COMPLETE under R5. Final branch CI 36663533485 PASS at f8f82cd; --no-ff merge 168182c; main CI 36663813362 PASS; all five merged-main gates and structural checks pass. Deferred runtime plane remains unmigrated: no real desktop/browser/UI automation.

Step 3, MB-003: COMPLETE on 2026-09-30. ROUTE_B_CONTINUE: main’s 02-worker-gateway then contained only skill-intake, WG-01..08 absent, Route A forbidden. Under response-9-29 R1 and response-9-30 R8, §13 completion repair retains the original Mission identity. The deferred real execution seam becomes city/02-engineering/02-worker-gateway/worker-runner: createRunner → startJob/killTree/childEnv/dshBin/nodeExecutable, line-equivalent except donor hard-coded D-drive host paths become injected seams. scheduler.js/gate.js/system.js remain deferred in DONOR.json.

Both actual provider receipts exist: Mech/MEGA-REP, Verification Report §8.3; Alien/MERA-ALIANWARE, RUNTIME_PASS MB-003:b84512cd12f80735, eight verdicts true including real exit 0 and model answer OK. Two-host gate met. Engineering book §4.5 reruns through the ported module itself: PORTED_SEAM_RESOLVES_RUNTIME, PORTED_SUBMIT_PROGRESS_RESULT, PORTED_CANCEL_INTERRUPT, PORTED_UNSUPPORTED_REFUSAL and PORTED_BREAKER all true; logs contain no keys.

Four main-merge conflicts resolve as unions/supersets. Registry retains main’s bilateral exclusion mechanism and resolution split. Census regenerates from the merged manifest, all 32 modules matching. Paired docs append MB-003 as §8. Host separation is OWNER_WAIVED under R10: Verification host could not close, and Owner explicitly authorized this Mission’s Migration host. Conditions: no fabricated history, Mech events and BLOCKED finding unchanged, episode explicitly records hostSeparation.mode=OWNER_WAIVED and actual role hosts, no reduction of other standards. Finalizer adds waiver with ten tests covering success and all refusal cases.

Result: episode MB-003:5c0ab438d20476d1, 27 events, digest 694b5edb…; final branch CI 36671502121, implementation CI 36671050015 and main CI 36671850064 all PASS; merge 756c7d760c605e33ba386e87605e078fe24b82ca. Every step synchronizes frontmatter, README, MISSION_INDEX and report.

## 13.1 Later assessment-first queue: MB-010 → MB-011 → MB-012

### MB-010 — Node Fabric

COMPLETE_NO_VALUE, 2026-09-30, Mech. No local P0 was claimable: MB-001..009 all verification_complete=true and every Mission branch AheadOfMain=0. Under §3 P1A, claim lowest sequence. Utopia baseline 756c7d760c605e33ba386e87605e078fe24b82ca; frozen Codex-Boss donor 8df428eaa437a409368401e95194e40266b83080. D:/Codex-Boss differs from that baseline; use read-only git show/ls-tree/archive throughout, leaving donor untouched.

NO_VALUE: judged valueless, task retained, not migrated. All five NF-01..05 equivalently or better covered; zero gaps/migrations/code. MB-001 already ported live donor fleet.ts, capability-router.ts, node-capabilities.ts and adaptive-routing.ts from the same commit to City Core fleet-routing, retaining parity vectors and defects. Running product owns registration, heartbeat/liveness, endpoint, telemetry and capability-host broadcast.

Remaining TenxNodeRegistry/TenxNetworkRegistry/TenxObservability are unwired in frozen production. git grep finds only two references, an observability type field and tests. Electron main/bootstrap/host have no tenx import; node.yaml modules, bootModules and surface are empty.

Measured 47 PASS/0 FAIL: real bounded runtime chain 8/8, live createGateway temporary port and startAgent, registration, heartbeat, measured telemetry, honest first-sample null, offline after heartbeat stops and actual NODE_OFFLINE; fleet-routing 28/28; root gateway/telemetry/web-v02 11/11. Retain branch 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526 without merge/delete under the then-applicable rule. No fake episode. Report reports/MB-010/ASSESSMENT_REPORT.md; material evidence/raw/mission-book/MB-010/assessment/ and data-records/evolution/inbox/mission-book/MB-010/events.jsonl, four events before Alien review.

### MB-011 — Customs

COMPLETE_NO_VALUE, 2026-09-30, Mech. MB-002 DONOR.json explicitly assigns Hns plugin/adapter/installer deferral to 01/01 Customs (MB-011); assess through hypothesis testing, not assumption of coverage. Same Utopia baseline 756c7d760c605e33ba386e87605e078fe24b82ca; frozen Boss 8df428e and Hns eeb57ca, both read-only, worktrees unchanged.

NO_VALUE: retained/not migrated, all five CU-01..05 equivalent or better, zero gaps/migrations/code. Donor’s fullest admission state machine app/core/plugin-install/*, 960 lines of plan/pipeline/records, has zero app consumers; only non-test reference is scripts/install-pipeline-acceptance.cjs. It is the only pin/quarantine/rollback implementation.

Donor performs no provenance validation, only regex-built records from user input. createVerify/verifySignature/publicKey/x509/contentHash/pluginHash each has zero baseline matches; seventeen admission modules lack node:crypto. CU-04 isolation preflight does not exist as a refusal: RUNTIME_KINDS is metadata, its sole consumer an advisory risk score in dead code. Permissions are not admission gates: ADAPTER_UNKNOWN_PERMISSION/ADAPTER_PERMISSION_DENIED never produced; parser belongs to MB-012 under MB-002 DONOR.json.

Live donor fragments are equivalent or weaker than Utopia manifest/promotions/promotion-history/capability-fabric/restart-recovery checks. Utopia has no plugin ecosystem; new Customs would repeat checks and create uncalled code.

Measured 1904 PASS/0 FAIL: admission chain 13/13; City 1807 pass/0 fail/1 skipped, total 1808; root 84 pass/0 fail; promotion history 10/10. Retain branch 82b6ac4 without merge/delete, no episode. Report reports/MB-011/ASSESSMENT_REPORT.md; material evidence/raw/mission-book/MB-011/assessment/ and corresponding evolution inbox events.jsonl, four events.

### MB-012 — Runtime Compliance

COMPLETE_NO_VALUE, 2026-09-30, Mech. MB-002 DONOR explicitly assigns Boss capability-broker.ts/authorization.ts/permission-contract.ts to 01/02 Public Security. Use hypothesis testing, not assumed coverage. Same Utopia baseline; frozen Boss 8df428e, 24 paths read-only, donor not modified/built/tested.

NO_VALUE: retained/not migrated, all five RC-01..05 covered, zero gaps/migrations/code. Deferred electron/capability/* never runs in production: createCapabilityBroker/invokeThroughBroker/evaluate/gateAuthorizer/authorizeExecution have zero non-test production callers. main.ts:1003 constructs ExecutionGate without options, so authorizer never fires.

runtime-policy.json has no consumer: runtime-policy.ts exports nothing, loadRuntimePolicy has zero callers and no JSON-Schema validator exists. authority-planes.ts refusal has one CI-script caller; named refuse guards are test-only. Root audit ledger is read only by tests; integrity is an unkeyed SHA-256 chain. In electron/src, createVerify/verifySignature/publicKey/x509/createHmac all have zero matches.

Live execution is already covered: MB-008 ported side-effect permission from this same named permission.ts; MB-001 ported protected-surface guard and Guardian from the same donor commit. Scope respected: Owner/Root authority sources and constitutional protected-surface definitions read as background only, never proposed for migration.

Measured 1904 PASS/0 FAIL: enforcement chain 19/19 including live temporary-port gateway and capability-bridge invoke; City 1807 pass/0 fail/1 skipped, total 1808; root 84; promotion history 10/10. Retain d071328 without merge/delete, no episode. Report reports/MB-012/ASSESSMENT_REPORT.md; evidence/raw/mission-book/MB-012/assessment/ and corresponding inbox events.jsonl, four events.

## 13.2 Assessment-first queue cleared: 2026-09-30

All three close green NO_VALUE/SKIPPED_NOT_REQUIRED in one session. Queue empty: all enabled MB-001..012 verification flags true, no P0/P1A/P1B claims.

All three use the same reusable mechanism:

```text
前一个 Mission 的 "DEFERRED ... belongs to MB-0NN" 是**指针**，不是已验证的结论。
判定它的是 **donor 调用图**，不是 donor 文件清单：
  MB-010  donor 的活节点逻辑已被 MB-001 迁走；剩余部分在冻结基线上生产未接线
          （TenxNodeRegistry/TenxNetworkRegistry 无 main/bootstrap import）
  MB-011  app/core/plugin-install/*（960 行）0 个 app consumer，而它是 pin/quarantine/
          rollback 的唯一实现
  MB-012  electron/capability/* 非测试生产调用者为 0，且 composition root 以无 options
          构造 ExecutionGate；runtime-policy JSON 无人解析
```

The original evidence block says a prior “DEFERRED belongs to MB-0NN” is a pointer, not a verified conclusion. Donor call graphs, not file lists, decide: MB-010’s live logic already migrated and remnants unwired; MB-011’s 960-line installer has no app consumer; MB-012 has no production capability caller, a no-options gate and unparsed policy JSON.

Two recurring secondary mechanisms merit future assessment: declared but never produced refusal codes, seventeen in MB-011, make donor enforcement appear stronger than reality; already ported but unconsumed Utopia modules fleetNodeStateFor/createProtectedSurfaceGuard/evaluateGuardian have only test consumers and are not assessment gaps. Wiring is not migration; inventing consumers is NEW_FEATURE_DEVELOPMENT. Record standing nonblocking backlog for future Owner-directed integration, not a reason to port more donor code.

Next work requires Owner ruling: reopen/reset a Mission, create a new Mission, or explicitly wire already migrated modules into existing consumption surfaces.

## 13.3 NO_VALUE provenance archive and mandatory Alien record: 2026-09-30

Owner appended: apply the decided report revision, forcibly record NO_VALUE as Alien, then merge Utopia branches. Results:

```text
独立复核（Alien，未复用任何既有测试）
  MB-010  NO_VALUE CONFIRMED - donor 零构造点 + 真实 Android 设备渲染链路
  MB-011  NO_VALUE CONFIRMED - donor 零消费者 + 篡改式拒绝 + 真实 Git provenance
  MB-012  NO_VALUE CONFIRMED - 零应用内 importer + 无 options 的 ExecutionGate + 活路径拒绝
报告修订  MB-011 §2.4 / §5 决定性理由改写（plugin-adapters 可达，非 dead code）
          原因是"隔离元数据无消费者"，不是"代码是死的"
          MB-010 / MB-012 对应表述复核后准确，未改

provenance 合并（Owner ruling response-9-30.md#R11，覆盖 README line 223 仅此三支）
  mission/MB-010-node-fabric        @ 8380c38  --no-ff-->  6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a
  mission/MB-011-customs            @ 82b6ac4  --no-ff-->  f22273c37af1ebff6c95d49972b5d26a222f2ed2
  mission/MB-012-runtime-compliance @ d071328  --no-ff-->  e0d9470e2a5b5479c1614071d8f43af3d1d93248
  每个 merge 5 个文件（events.jsonl + 4 assessment evidence），零实现代码，零冲突
  三个 branch 远端保留不删除

Alien 强制记录（role=VERIFICATION, hostId=Alien, sourceRef=response-9-30.md#R11）
  3 events x 3 Missions = 9：OWNER_INTERVENTION(INFO) / VERIFIER_FINDING(PASS)
                              / VERIFICATION_COMPLETE(PASS)
  记录提交 d0dea7b ; Mech 的 4 条 MIGRATION 事件原样保留

不变量（未被本次操作改变）
  assessment_result = NO_VALUE ; migration_completion_basis = SKIPPED_NOT_REQUIRED
  verification_status = NOT_REQUIRED_SKIPPED_COMPLETE ; merged_main_sha = null（三项）
  无 verified implementation episode（不得伪造）
utopia main : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e

合并后分支审计（34 个 origin ref）
  unmerged = 0
  MB-010..012 现为 0 ahead / 6 behind（即已完全合入）
  MB-001..MB-009 与全部 alien/* codex/* mech/* docs/* infra/* repair/* 分支均 0 ahead
  => Owner 指示的"全部进入 main"已达成：仓库内不存在未合入 main 的分支
```

The unchanged full evidence block records independent Alien review without reused tests. MB-010 confirms zero donor construction and real Android rendering; MB-011 zero consumers, tampered-input refusals and actual Git provenance; MB-012 zero importers, no-options ExecutionGate and live refusals. MB-011’s reason changes from dead code to unconsumed isolation metadata; MB-010/012 remain accurate and unchanged.

It preserves all three exact --no-ff merge SHAs, each five files of events plus assessment evidence, no implementation and zero conflicts; remote branches retained. Nine Alien VERIFICATION events, OWNER_INTERVENTION(INFO), VERIFIER_FINDING(PASS), VERIFICATION_COMPLETE(PASS), use R11 sourceRef. Mech’s four MIGRATION events per Mission remain. NO_VALUE, SKIPPED_NOT_REQUIRED, NOT_REQUIRED_SKIPPED_COMPLETE and null merged_main_sha stay invariant; no verified implementation episodes. Exact main d0dea7bcb66cf57edee73c67ddfb9526337dfb4e.

Audit of 34 origin refs: unmerged=0; MB-010..012 zero ahead/six behind; MB-001..009 and all alien/codex/mech/docs/infra/repair branches zero ahead. Owner’s all-branches-into-main instruction achieved at that recorded time.

Local regression on merged tree, equivalent to gateway-web workflow plus Android units: root 84/84, promotion ten records/no issues, Rooms 69/69, City 1807/1808 with one skip, three PAIR_STATUS=SYNCHRONIZED, Android21 tests/zero failures, total1981 PASS/0 FAIL. Evidence under gitignored .runtime/evidence/mission-book/MB-010-011-012/ci/.

Merged-main V0.2 run36678805229 atd0dea7b PASS, both jobs success. Each provenance push also has green run:36674951238 for MB-0108380c38,36675728505 for MB-01182b6ac4,36676308185 for MB-012d071328.

Book invariants across twelve frontmatters versus Git: problems=0. Every provenance_merge_sha exists by cat-file, is a two-parent merge, and is main ancestor. merged_main_sha is nonnull only for MB-001..009 and contains no MB-010..012 implementation. Script .runtime/evidence/mission-book/MB-010-011-012/check-book-invariants.mjs.

merged_main_sha remains null because it means the Mission’s implementation landing SHA. None of these three has implementation even after provenance archive. Record archive separately through provenance_merge_status/provenance_merge_sha/provenance_merged_at. Avoid portraying provenance merge as implementation merge, this round’s central distortion risk.

## 13.4 Recorded product closeout: Pre-Assistant Terminal Foundation

All MB-001..012 closed, migration/assessment queue empty. Owner R12 switches Mission Book from donor migration scheduler to this round’s product closeout control plane. Bound book: ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md.

The sole authorized order:

```text
T0  migration closeout / freeze
 ↓
T1  attach existing Room Pack to normal Utopia shell
 ↓
T2  canonical Action facade
 ↓
T3  deterministic Ask / Do
 ↓
T4  independent product acceptance + merge + merged-main CI
 ↓
FINAL_STATUS = PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE
 ↓
STOP
```

No automatic new MB, reopen of closed Missions, Room11, Boss/Hns, LLM router, persona/personal assistant, long-term assistant memory, proactive agent or domain expansion. After final status, wait for new Owner instruction.

## 14. Historical rules

Old migration-first rules and templates are archived in past-rules. Active Mission files no longer duplicate full global rules. Mission-specific gates remain effective; global process references this file uniformly to avoid twelve files drifting after future changes.
