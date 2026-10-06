# Owner Response — 2026-09-30: full English reading

[Canonical historical ruling](../response-9-30.md). This inactive reading grants no new authority. The source was the latest 2026-09-30 ruling for MB-010..012 assessment-first and MB-007→008→003 repairs; it outranked conflicting [9-29 rulings](../response-9-29.md), while other 9-29 rulings remained effective.

## R1 — MB-010..012 enabled for assessment-first automatic claiming

1. Set execution_enabled=true for MB-010 Node Fabric, MB-011 Customs and MB-012 Runtime Compliance.
2. After claim, first compare donor value against Utopia latest main at claim time, rather than migrate directly.
3. Verdicts only FULL_MIGRATION, PARTIAL_MIGRATION or NO_VALUE.
4. Implementation only for FULL/PARTIAL; PARTIAL includes only capability-matrix-approved gap-closing subsets.
5. NO_VALUE: no implementation; City reports “judged no value, task retained, not migrated”; migration_complete=true, migration_status=SKIPPED_COMPLETE, migration_completion_basis=SKIPPED_NOT_REQUIRED, verification_complete=true, verification_status=NOT_REQUIRED_SKIPPED_COMPLETE. Do not fabricate a verified implementation episode. Preserve task/evidence but scheduler treats complete unless Owner reopens.
6. An assessment host continuing migration becomes Migration Host; Verification still uses another physical host.
7. Assessment-only branches do not count toward UNMERGED_WIP_LIMIT before substantive implementation commits.

## R2 — Mandatory claim-time capability inventory

Mission and Assessment Report record planned capabilities, latest claim-time Utopia main SHA, existing equivalent/related Utopia capabilities, donor capabilities not needed and why, partial gaps worth filling, and donor/Utopia source/test/runtime/evidence anchors. Directory-name existence cannot replace semantic comparison.

## R3 — Paper / research material

Every verdict, including non-migration negatives, is research material. Preserve planned/equivalent/superior/gap/selected/abandoned counts; reason-code distribution; parity/runtime checks and real failures; baseline/head SHA. When migrating, retain changes/tests/CI/real consumption/failure recovery. When skipping, retain evidence that copying would duplicate functionality, misassign ownership, retain old semantics or lack independent value. Existing material locations:

```text
Digital-City:
  mission-book/MB-010..012
  mission-book/reports/MB-xxx/ASSESSMENT_REPORT.md
  MIGRATION_REPORT / VERIFICATION_REPORT only when migration happens

Utopia:
  .runtime/evidence/mission-book/<ID>/<run-id>/assessment/
  data-records/evolution/inbox/mission-book/<ID>/events.jsonl
  evidence/raw/mission-book/<ID>/assessment/  (bounded, non-sensitive only)
  verified episode only after real migration + independent verification
```

NO_VALUE never fabricates verified episodes. Preserve assessment branch and pin immutable HEAD in City reports. A complete skip still completes the Mission.

## R4 — Completion through implementation, Owner acceptance or full skip

migration_complete=true must specify a completion basis: IMPLEMENTED_COMPLETE (Migration Host records PASS); OWNER_ACCEPTED_COMPLETE (honest blocker/negative result, later explicit Owner acceptance of boundary and completion); SKIPPED_NOT_REQUIRED (complete comparison finds equivalent/superior coverage or no independent value). The third is green completion, not failure or eternal unmigrated status. Preserve task/assessment/branch/evidence, mark migration/verification complete, require no implementation merge/episode.

## R5 — Do not fabricate Migration Host PASS for Owner override

Preserve Alien historical MB-007/008 blockers. Verifiers cannot write MIGRATION_COMPLETE/PASS as though Alien emitted it earlier. Finalizer needs explicit Owner override, with migration blocker, ruling reference, Verification Host OWNER_INTERVENTION, independent finding, CI/verification completion and OWNER_ACCEPTED_COMPLETE basis in the episode.

## R6 — Repair order 7 → 8 → 3

1. MB-007: process closeout/finalizer/verified episode only; do not roll back or remigrate implementation already on main.
2. MB-008: wait until Step 1 completes and enters main, then sync latest main. Before substantive merge, reassess: entirely no value→SKIPPED_NOT_REQUIRED; valuable→bounded verification, override finalization, final CI and merge.
3. MB-003: reassess only after Step 2. No overall value→SKIPPED_NOT_REQUIRED; still valuable→real provider/runner seam remains mandatory, no mock/waiver.

Later steps cannot finalize/merge before preceding repair_status=COMPLETE.

## R7 — Historical MB-008 two-host bounded-action wording

Migration Host honestly recorded the old product-consumption blocker;9-29R7 accepted it and opened Verification. Alien need not retroactively replay an action with no lawful consumer then. Mech must execute real bounded Computer-Use chain, postcondition, at least one refusal/error and recovery/stabilization path. Alien blocker+Owner ruling+Mech real verification form the full record. No runtime-plane expansion or deferred controllers/drivers completion claim.

## R8 — MB-003 completion repair can keep Mission identity

9-29R1 superseding/completion wording prevented silently adding non-donor features during Verification. If Step 3 still finds value, explicit completion repair is allowed under original MB-003 identity and verification claim, without new number. Only frozen-donor provider/runner execution seam and registry/supervisor wiring may migrate. Planner/vendor UI/new provider semantics remain forbidden. Without a donor-supported real provider environment, valuable MB-003 remains BLOCKED, rather than hiding the environment behind skip-completion.

## R9 — City records are part of the construction transaction

Each 7 → 8 → 3 step follows:

```text
City pre-state commit
→ Utopia work/evidence
→ City milestone update
→ CI/finalize/merge or SKIPPED_COMPLETE
→ City final closeout commit
```

At minimum synchronize frontmatter, body closeout/repair section, README progress, MISSION_INDEX and corresponding Assessment/Migration/Verification Report. Do not defer all City updates until code is finished.

## R10 — MB-003 one-time host-separation waiver

Background: real donor-backed receipts from Mech MEGA-REP (report §8.3) and Alien MERA-ALIANWARE (RUNTIME_PASS MB-003:b84512cd12f80735) satisfy the two-host gate; environment block removed. Remaining permission requires Verification Host to repair/merge, and finalizer mechanically requires migrationHost!=verificationHost. Verification Host could not finish this session.

Owner permits Migration Host Alien to finish verification and merge in this same construction, only for this MB-003 closeout:

1. Preserve Mech historical VERIFICATION hostIds; never forge Mech MIGRATION_COMPLETE/CI_RESULT/VERIFICATION_COMPLETE.
2. Mech real provider receipt and earlier independent findings remain verification evidence, never overwritten/deleted.
3. Explicit finalizer waiver records hostSeparation.mode=OWNER_WAIVED, ruling, actual hosts per role and completing host's verification-event count.
4. Accept waiver only if completing host actually produced VERIFICATION events and at least one cites response-9-30.md#R10. Refuse meaningless waiver when completing host already is Verification Host.
5. No other standard lowered: independent finding, real bounded chain, CI_RESULT=PASS, VERIFICATION_COMPLETE=PASS after final CI, all required CI green.

Explicit recorded one-time MB-003 waiver, not general weakening. Future Missions use distinct physical hosts unless explicitly ruled again.

## R11 — Provenance merges and Alien-authored NO_VALUE confirmation

Mech completed MB-010/011/012 NO_VALUE/SKIPPED_NOT_REQUIRED. Owner ordered independent Alien verification without existing tests, then merge branches preserving history/SHA; later requested settled report corrections first, force-record NO_VALUE as Alien, then continue merging. This literally conflicts with README line 223 retaining NO_VALUE branches unmerged/undeleted. Record the ruling and its precise scope rather than silently obey/refuse.

1. Owner alone authorizes --no-ff provenance merge of mission/MB-010-node-fabric, mission/MB-011-customs, mission/MB-012-runtime-compliance. README line 223 still governs future NO_VALUE branches.
2. Each has one commit containing events.jsonl and assessment evidence, no implementation. merged_main_sha remains null because it means implementation's main SHA. Record provenance_merged_at/provenance_merge_sha/provenance_merge_branch separately.
3. Keep NO_VALUE, COMPLETE_NO_VALUE, SKIPPED_NOT_REQUIRED and NOT_REQUIRED_SKIPPED_COMPLETE; no verified implementation episode.
4. Keep all three remote branches.
5. Mech four MIGRATION events per Mission retain original hostId. Alien only appends own VERIFICATION hostId=Alien, never writes as Mech.
6. Alien appends OWNER_INTERVENTION citing ruling, VERIFIER_FINDING and VERIFICATION_COMPLETE PASS independently confirming NO_VALUE, all role=VERIFICATION/hostId=Alien/sourceRef=Digital-City/mission-book/response-9-30.md#R11, following README line 309.
7. Track branch head, parent equal to pre-merge main, merge SHA and post-merge main SHA.

This explicitly ruled provenance archive changes no value verdict and sets no precedent for merging NO_VALUE implementation.

### R11 execution — Alien 2026-09-30

Original execution ledger preserved verbatim; full English interpretation follows:

```text
0. 报告修订（先做，早于合并）
   MB-011 reports/MB-011/ASSESSMENT_REPORT.md §2.4 与 NO_VALUE 理由第 3 条就地改写：
     原表述让 "in dead code" 读成整个 app/core/plugin-adapters/ 不可达；实际
     plugin-adapters/contract.cjs 由活的 app/plugin-host.cjs（<- app/desktop-main.cjs /
     app/runtime/host.cjs）加载，并确实拒绝非法权限词表 / 非法 adapter manifest /
     adapter fault code。改写后结论落在"隔离元数据无消费者"这一准确理由上。
     提交 86e83bee4a5647adfaa6e929c6814546704d5216
   MB-010（tenx/ 零构造点）与 MB-012（runtime-policy 无解析者、无 options 的
     ExecutionGate）对应表述用新探针复核后准确，未改。

1. 强制记录（City 侧）
   response-9-30.md R11 本身 + MB-010/011/012 front matter 的
     independent_reverification_result = NO_VALUE_CONFIRMED（无保留）
     independent_reverification_record   = 引用 R11，声明为 Alien 自署
     provenance_merge_* 字段
   提交 1ad5dbbe6997925ef1803073914e7e4519f61d84

2. provenance 合并（Utopia 侧，--no-ff，合并前 main = 756c7d76）
   mission/MB-010-node-fabric        @ 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526
     -> 6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a  (parents 756c7d7, 8380c38)
   mission/MB-011-customs            @ 82b6ac486d024efcfcc64703b58cc136b546caf9
     -> f22273c37af1ebff6c95d49972b5d26a222f2ed2  (parents 6e9781c, 82b6ac4)
   mission/MB-012-runtime-compliance @ d071328d8f68ba1ddd5e8a1fde11718e75fd6672
     -> e0d9470e2a5b5479c1614071d8f43af3d1d93248  (parents f22273c, d071328)
   三个 merge 各新增 5 个文件（events.jsonl + 4 个 assessment evidence），零实现代码，零冲突。
   三个 branch 远端保留，未删除。

3. Alien 强制记录（Utopia 侧事件）
   role=VERIFICATION / hostId=Alien / sourceRef=Digital-City/mission-book/response-9-30.md#R11
   MB-010: 21cbfd606fd9f94b (OWNER_INTERVENTION), 99428c296e59d540 (VERIFIER_FINDING=PASS),
           205eb70e7cae1c07 (VERIFICATION_COMPLETE=PASS)
   MB-011: 6f7fa334c286f551, bfcf91eeae8d6093, 6b7a1f3474f14eb5
   MB-012: 9e13427671e9efe5, d2b224485905d002, aae0a20a60956136
   写入提交 d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
   Mech 的 4 条 MIGRATION 事件经字节比对原样保留。

不变量自检
   assessment_result = NO_VALUE                     三个 Mission 均未变
   migration_completion_basis = SKIPPED_NOT_REQUIRED 三个 Mission 均未变
   verification_status = NOT_REQUIRED_SKIPPED_COMPLETE 三个 Mission 均未变
   merged_main_sha = null                            三个 Mission 均保持 null
   verified implementation episode                   未生成（NO_VALUE 不得伪造）
   utopia main                                       d0dea7bcb66cf57edee73c67ddfb9526337dfb4e

合并后验证
   分支审计      34 个 origin ref，unmerged = 0（MB-010..012 现为 0 ahead / 6 behind）
                 -> Owner 指示的"全部进入 main"已达成
   merged-main CI run 36678805229 (head d0dea7b)：gateway-web success, android success
   分支 push CI   36674951238 (8380c38) / 36675728505 (82b6ac4) / 36676308185 (d071328) 均 success
   本地回归       tests 84/84、rooms 69/69、city/test-all 1807/1808（1 skipped）、
                 promotion-history 10/10、check:docs SYNCHRONIZED、android 21/21
                 合计 1981 PASS / 0 FAIL
   书内自检       12 个 Mission front matter 对 Git 事实 problems = 0
```

Step 0 before merge corrected MB-011 ASSESSMENT §2.4 / reason 3: “in dead code” wrongly implied all plugin-adapters unreachable. contract.cjs is loaded by live plugin-host.cjs from desktop-main.cjs/runtime-host.cjs and refuses illegal permissions/manifests/fault codes. Correct basis is isolation metadata has no consumer. Commit 86e83bee4a5647adfaa6e929c6814546704d5216. Fresh probes confirmed MB-010 zero tenx construction and MB-012 unparsed policy/no-options ExecutionGate, so those stayed unchanged.

Step 1 City records R11, all three independent_reverification_result=NO_VALUE_CONFIRMED without qualification, Alien self-authored reference and provenance fields; commit 1ad5dbbe6997925ef1803073914e7e4519f61d84.

Step 2 Utopia --no-ff merges from main 756c7d76: exact branch heads and merge parents are retained in the ledger. MB-010→6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a; MB-011→f22273c37af1ebff6c95d49972b5d26a222f2ed2; MB-012→e0d9470e2a5b5479c1614071d8f43af3d1d93248. Five files each (events+four assessment materials), zero code/conflicts, remote branches retained.

Step 3 Alien emits OWNER_INTERVENTION/VERIFIER_FINDING PASS/VERIFICATION_COMPLETE PASS for each; all nine exact event IDs are retained above. Commit d0dea7bcb66cf57edee73c67ddfb9526337dfb4e; byte comparison proves original four Mech MIGRATION events unchanged. All three verdicts/bases/statuses/null implementation SHA remain; no episode fabricated.

Post-merge: 34 origin refs, 0 unmerged; MB-010..012 were 0 ahead / 6 behind, all in main as directed. CI 36678805229 on exact head d0dea7b passed Android and Gateway/Web; branch CI 36674951238 / 36675728505 / 36676308185 all passed. Local results: tests 84/84, rooms 69/69, city 1807/1808 (one skip), promotion-history 10/10, docs SYNCHRONIZED, Android 21/21; total 1981 PASS / 0 FAIL. Twelve frontmatter records were checked against Git facts: 0 problems.

Ordering deviation: Owner said force-record before merge. City Step 1 did precede merge, but Utopia Step 3 events followed three merges to preserve branch files byte-for-byte rather than cause events.jsonl add/add rewrites in merge commits. Report explicitly records deviation; all artifacts otherwise satisfy the ruling. City commits use Alien <alien@digital-city.local> matching Mech self-attribution, rather than default Owner. Earlier 4a2cd5f used default incorrectly; already pushed, retained without history rewrite.

## R12 — End MIGRATION_ONLY, start historical Pre-Assistant Product Closeout

All MB-001..012 closed; Alien independently confirmed NO_VALUE and R11 archived provenance; branch audit unmerged 0 and merged-main CI green. No claimable Migration/Verification/Assessment.

1. End MIGRATION_ONLY. Empty queue never authorizes MB-013 or reopening/resetting MB-001..012.
2. Next Owner work binds [engineering book](../../replant/ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md).
3. Only T0 migration closeout/freeze→T1 accepted Room Pack into normal shell→T2 unified Action facade→T3 deterministic Ask/Do→T4 independent acceptance/merge/merged-main CI then STOP.
4. Product integration, not donor migration. Necessary T1–3 product interfaces/UI/adapters allowed; no donor remigration, domain expansion or changed closed-Mission semantics.
5. Exclude personalized assistant/persona, assistant-specific memory, proactive personal agent, LLM router, Boss/Hns connectors, new Room, Health/Quant/Digital-Me, arbitrary shell, full deferred Computer-Use plane, voice/avatar/wearable/AR/VR/cloud and later capabilities.
6. Old migration selection/finalization/host rules remain historical interpretation and conditional rules for explicit reopening, not product scheduler.
7. Stop at FINAL_STATUS=PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE. Await new Owner instruction before connectors/workspace/resident-host/assistant.

Purpose: unify existing capabilities into one terminal foundation before expanding modules. This historical phase is not reactivated by this translation.

## R13 — One-host T4 waiver for this Pre-Assistant closeout

Engineering book §3/8 requires independent Verification Host, two distinct real hosts when available, otherwise unmerged branch and honest limitation unless waived. Only Alien MERA-ALIANWARE available, Mech MEGA-REP unreachable.

1. Owner waives second physical host only for this round. A truly independent agent session uninvolved in implementation must write its probes/findings before reading IMPLEMENTATION_REPORT, implementation commit messages or author evidence scripts. Author scripts cannot be acceptance evidence.
2. Report explicitly single-host: verification and Gateway share physical host/provenance.host. Real Android is separate hardware but cannot convert this into two-host acceptance.
3. Independent ACCEPT/REJECT must be falsifiable. REJECT requires every blocker repaired and reacceptance on new SHA; majority-pass cannot release.
4. Branch required CI and merged-main CI all green; standards unchanged.
5. One recorded closeout-round waiver, never general future two-host relaxation. Other phases follow their workbooks.

Only physical-host difference is waived; real execution, independent probes, scope audit and independent verdict remain mandatory.
