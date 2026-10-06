# 历史任务索引：迁移队列已关闭／Assistant之前产品收尾

[英文历史索引](../MISSION_INDEX-LEGACY.md)。本文完整中文读本无领取authority。文中“当前”指原稿当时；当前任务以活动工作书为准，不重启历史迁移或产品系列。

当时运行事实：每本Mission最新frontmatter、[README](../README.md)、[9月30日裁决](../../completed-2026-10-01/response-9-30.md)、未被取代的[9月29日裁决](../../completed-2026-10-01/response-9-29.md)。历史规则/索引在[past-rules](../../completed-2026-10-01/past-rules)。

## 原稿阶段：Owner裁决R12

```text
MIGRATION_QUEUE = CLOSED
CLAIMABLE_MB = NONE
CURRENT_WORK = ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md
AUTHORIZED_ORDER = T0 -> T1 -> T2 -> T3 -> T4 -> STOP
```

迁移队列关闭，无可领取MB，施工为ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT；授权顺序T0→T1→T2→T3→T4→STOP。是产品集成，不是新增MB迁移。[R12](../../completed-2026-10-01/response-9-30.md#r12--migration-only-正式结束进入-pre-assistant-product-closeout)与[绑定工程书](../ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md)为当时依据。

## 当时状态

| 顺序/任务 | Enabled | 迁移 | 复检 | 迁移主机 | 资格／下一步 |
|---|:---:|---|---|---|---|
| [MB001](../MB-001-core-os.md) | YES | COMPLETE | COMPLETE | Alien | 已关闭。 |
| [MB002](../MB-002-capability-fabric.md) | YES | COMPLETE | COMPLETE | Mech | 已关闭。 |
| [MB003](../MB-003-worker-gateway.md) | YES | COMPLETE | COMPLETE | Alien | ROUTE_B_CONTINUE；迁入worker-runner，Mech MEGA-REP与Alien MERA-ALIANWARE各有receipt，真实链经迁入seam重跑。Episode MB-003:5c0ab438d20476d1、merge756c7d7、CI36671850064；R10豁免主机分离并记入episode。 |
| [MB004](../MB-004-project-foreman.md) | YES | COMPLETE | COMPLETE | Mech | 已关闭；R2接受历史MB003路由条款为非阻塞。 |
| [MB005](../MB-005-host-health.md) | YES | COMPLETE | COMPLETE | Mech | 已关闭。 |
| [MB006](../MB-006-restart-recovery.md) | YES | COMPLETE | COMPLETE | Alien | 已关闭。 |
| [MB007](../MB-007-research-institute.md) | YES | COMPLETE / OWNER_ACCEPTED | COMPLETE + REPAIR STEP1 | Alien | 修复关闭；finalizer f25cdb4、merged850d73、episode MB-007:553ab7ba1c4b0902。 |
| [MB008](../MB-008-computer-use.md) | YES | COMPLETE / OWNER_ACCEPTED | COMPLETE + REPAIR STEP2 | Alien | episode MB-008:6ae0bbd46e425c9f、merge168182c、CI36663813362 PASS。 |
| [MB009](../MB-009-theme-relocation.md) | YES | COMPLETE | COMPLETE | Mech | 已关闭；R8接受building-level kind。 |
| [MB010](../MB-010-node-fabric.md) | YES | SKIPPED_COMPLETE / NO_VALUE | NOT_REQUIRED_SKIPPED_COMPLETE | Mech | Alien按R11独立确认NO_VALUE；mission/MB-010-node-fabric@8380c38仅provenance合并6e9781c并保留远端，无实现合并，merged_main_sha=null正确。 |
| [MB011](../MB-011-customs.md) | YES | SKIPPED_COMPLETE / NO_VALUE | NOT_REQUIRED_SKIPPED_COMPLETE | Mech | Alien按R11独立确认NO_VALUE；mission/MB-011-customs@82b6ac4仅provenance合并f22273c并保留远端，无实现合并，merged_main_sha=null正确。 |
| [MB012](../MB-012-runtime-compliance.md) | YES | SKIPPED_COMPLETE / NO_VALUE | NOT_REQUIRED_SKIPPED_COMPLETE | Mech | Alien按R11独立确认NO_VALUE；mission/MB-012-runtime-compliance@d071328仅provenance合并e0d9470并保留远端，无实现合并，merged_main_sha=null正确。 |

## 原稿即时派发队列

迁移调度已关闭。下块保留最终迁移轨迹作provenance；只有R12 CURRENT/FORBIDDEN当时可执行，今天不激活新系列。

```text
COMPLETE. MB-007 — implementation + Owner-override episode closed
COMPLETE. MB-008 — bounded verification + owner-override episode + merge `168182c`; merged-main CI PASS
COMPLETE. MB-003 — step 3 closed 2026-09-30. Value = `ROUTE_B_CONTINUE`; the deferred donor execution
          seam was migrated as `worker-runner`; the two-host gate is satisfied by Mech's and Alien's
          own receipts, and the real chain was re-run through the ported seam (5/5 verdicts). Episode
          `MB-003:5c0ab438d20476d1`, merge `756c7d7`, merged-main CI `36671850064`. Host separation is
          OWNER_WAIVED under response-9-30 R10 and is recorded in the episode, with Mech's historical
          VERIFICATION events and BLOCKED finding preserved under their own host.
THEN.     Utopia main final integration sweep (MB-007 + MB-008 + MB-003 all merged) — VERIFIED:
          every mission branch measured AheadOfMain = 0 against utopia@756c7d7
COMPLETE. MB-010 — assessment verdict `NO_VALUE` (Host Mech, 2026-09-30). 5/5 capabilities
          already equivalent-or-superior; MB-001 had migrated the donor's live node logic
          from the same frozen `8df428e`; the donor remainder is production-dead at the
          baseline. 0 migrated, 0 implementation code, branch `mission/MB-010-node-fabric`
          @ `8380c38` later provenance-merged under R11 as `6e9781c` and retained remotely.
          Green completion basis `SKIPPED_NOT_REQUIRED`; no implementation merge.
COMPLETE. MB-011 — assessment verdict `NO_VALUE` (Host Mech, 2026-09-30). Assessed as the
          named owner of MB-002's deferred Hns plugin/adapter platform. The donor's
          coherent admission design (app/core/plugin-install/*, 960 lines) has ZERO app
          consumers; the donor neither verifies provenance nor refuses on isolation nor
          gates on permissions. 0 migrated, 0 implementation code, branch
          `mission/MB-011-customs` @ `82b6ac4` later provenance-merged under R11 as `f22273c`
          and retained remotely. Green completion basis `SKIPPED_NOT_REQUIRED`; no implementation merge.
COMPLETE. MB-012 — assessment verdict `NO_VALUE` (Host Mech, 2026-09-30). Assessed as the
          named owner of MB-002's deferred Codex-Boss permission/authorization
          resolution. The deferred layer has ZERO non-test production callers and the
          composition root builds `ExecutionGate` with no authorizer; the runtime-policy
          JSON is parsed by nothing; escalation rejection is CI-script-only; the audit
          ledger is read only by tests. 0 migrated, 0 implementation code, branch
          `mission/MB-012-runtime-compliance` @ `d071328` later provenance-merged under R11 as `e0d9470`
          and retained remotely. Green completion basis `SKIPPED_NOT_REQUIRED`; no implementation merge.

MIGRATION QUEUE CLOSED. Every enabled Mission (MB-001..MB-012) has verification_complete = true.
          R11 provenance closeout is merged and the recorded Utopia branch audit has unmerged = 0.
CURRENT.  Execute ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md only:
          T0 migration closeout/freeze -> T1 Rooms shell integration -> T2 Action facade ->
          T3 deterministic Ask/Do -> T4 independent acceptance/merge -> STOP.
FORBIDDEN. Do not auto-create MB-013, reopen a closed Mission, add Boss/Hns connectors,
          add an assistant/persona layer, add an LLM router, or create a new Room.
```

完整中文对应：MB007实现与Owner override episode关闭；MB008 bounded verification、Owner override、merge168182c与merged-main CI PASS；MB003于2026-09-30完成Step3，价值ROUTE_B_CONTINUE，worker-runner补迁入，两主机各自receipt与真实链5/5裁决。Episode、merge、CI如上，R10豁免主机分离，Mech历史VERIFICATION与BLOCKED事件保留在自身主机。随后集成清扫确认MB007/008/003已合入，针对utopia756c7d7各Mission AheadOfMain=0。

MB010由Mech于2026-09-30判NO_VALUE：5/5能力已等价或更好，MB001从同冻结8df428e迁入存活节点逻辑，其余在基线生产不可达；迁入0、实现代码0，评估分支8380c38后按R11仅溯源合并6e9781c并保留，绿色SKIPPED_NOT_REQUIRED，无实现合并。

MB011判NO_VALUE：评估MB002暂缓Hns插件/适配平台所有者；app/core/plugin-install/*设计960行但应用消费者0，既不验provenance，也不因隔离拒绝或按权限gate。迁入0、实现0，82b6ac4后仅溯源合并f22273c并保留，绿色SKIPPED_NOT_REQUIRED。

MB012判NO_VALUE：评估MB002暂缓Codex-Boss权限/授权解析；无非测试生产caller，composition root用无authorizer的ExecutionGate，runtime-policy JSON无人解析，escalation拒绝只在CI脚本，audit ledger只有测试读。迁入0、实现0，d071328后仅溯源合并e0d9470并保留，绿色SKIPPED_NOT_REQUIRED。

全部enabled MB001..012 verification_complete=true，R11溯源收尾已合并，branch audit unmerged0。当时只执行工程书T0迁移freeze→T1 Rooms shell→T2 Action facade→T3 deterministic Ask/Do→T4独立验收/合并→STOP；禁止自动新建MB013、重开关闭Mission、Boss/Hns connector、assistant/persona、LLM router或新Room。

SKIPPED_NOT_REQUIRED是绿色完成依据，不是永久红色/未开始。历史不活动备注：Owner较早快照要求MB007/008逐项对当时最新main同步；二者现已关闭合并，不能据此重启。

## 历史迁移领取规则：除Owner重开外不活动

当时产品执行者遵循绑定工程书，不用这个历史selector；保留其规则作provenance：

```text
1. eligible verification/integration work first
   → stale/shared-control-plane pressure first
   → sequence ASC
2. only if no eligible P0:
   eligible assessment-first claim
   → sequence ASC
3. after FULL/PARTIAL assessment:
   same host continues eligible migration
   → only while unmerged substantive WIP < 2
4. NO_VALUE → SKIPPED_NOT_REQUIRED → Mission COMPLETE
5. blocked / disabled / claimed by another host
   → skip
```

1先eligible verification/integration，优先stale/shared-control-plane压力，再序号升序；2无eligible P0才assessment-first升序；3FULL/PARTIAL后同主机继续eligible migration，仅未合并实质WIP<2；4NO_VALUE→SKIPPED_NOT_REQUIRED→COMPLETE；5blocked/disabled/其他主机claimed跳过。

依赖：除工作书另定，只有实现经Verification接受并进入目标main才满足；未合并分支migration_complete=true不够。

## 已解决Owner裁决

最新9月30日，9月29日未被替代的仍有效：IMPLEMENTED_COMPLETE、OWNER_ACCEPTED_COMPLETE、SKIPPED_NOT_REQUIRED都可作迁移完成；MB010/011/012先assessment，NO_VALUE为保留/不迁移/绿色跳过，无需Verification；capability matrix、当时Utopia main SHA、正负选择证据必须留作研究。

MB003若Step2后仍有价值，真实provider不豁免，donor-backed完成修复可沿原任务身份不新编号。MB004真实Engineering job+donor零耦合已接受，不重开。capabilityProvider:false是城市级机制。两主机默认指Migration Host+Verification Host。MB005 bandKeyOf保留donor bug，语义修复另项。MB007/008接受边界，没有等价产品seam时bounded真实链可满足验收。MB009 building-level kind作为城市机制接受。

## 当时非阻塞backlog

以下不阻碍Mission验收、不拖延MB007/008集成：1OPEN，manifest不反查未声明文件模块；2OPEN，DONOR.json顶层/donors[]历史混合，规范历史前先兼容reader/schema；3RESOLVED，绝对catalog.length===6不再是main断言；4RESOLVED，Foreman不可用capability通过capabilityProvider:false处理；5NON-BLOCKING，promotion hub规范记录是历史位置，用manifest/DONOR.json看现位置；6NON-BLOCKING UX，promotion-history verifier读Git HEAD而非未提交工作树；7ENV，观察Windows无pwsh时用powershell.exe；8OPERATIONS，改registry/adapter后真实消费前重启共享gateway/services。

## 历史报告解释

旧报告“migration优先verification”“MB007/008等Owner”“MB009第三产品消费阻塞”“MB004可能被MB003阻塞”和规则1..16，只描述撰写时状态，不是现调度指令。参考past-rules和9月29日Owner裁决。

## MB010/011/012独立重验：Alien2026-09-30

Owner要求三assessment-first任务不用既有测试重验，允许真实Android操作。三NO_VALUE均独立确认，证据各报告新§9。

MB010：冻结donor的TenxNodeRegistry/TenxNetworkRegistry没有构造点，tenx/不在main.ts/bootstrap/host；存活node-capability-registry、inspectDevice已由MB001迁入。真实PERM00 Android12经LAN配对Gateway，渲染nodes、ONLINE/OFFLINE·Cached、CPU/memory及capability；内存18.4GB精确对应19740823552bytes。

MB011：无人导入/调用plugin-install admission状态机。新篡改探针：5坏manifest逐项命名拒绝，正常接受；promotion provenance验真实Git，fabric拒绝同capability第二owner。修正CU04：plugin-adapters其实由live app/plugin-host.cjs可达，决定性原因是Utopia没有插件平台可供Customs准入，而非简单不可达。

MB012：electron/capability/*无应用importer，仅两CI脚本；live gate new ExecutionGate()无authorizer，hook无法触发。真实路径重新证明非法operation→OPERATION_BLOCKED，过大input→INPUT_TOO_LARGE。

当时无实现合并、裁决不变：三评估分支各1ahead/0behind，单commit只有events及assessment证据，无实现；merged_main_sha:null仍正确。MB001..009所有实现分支0ahead已合并。

R11于2026-09-30随后要求三provenance分支仍合入main、保留操作/SHA，并强制在Alien名下记NO_VALUE确认。README223本来要求保留未合评估分支；R11仅对这三分支覆盖。assessment_result=NO_VALUE、migration_completion_basis=SKIPPED_NOT_REQUIRED、merged_main_sha:null不变，溯源合并不能变成实现合并。Alien自写VERIFICATION事件，assessment主机原事件原样保留。

```text
utopia main at re-verification : 756c7d760c605e33ba386e87605e078fe24b82ca
MB-010 assessment branch       : mission/MB-010-node-fabric        @ 8380c38f93a5c1d1ec5d1991fe63a5fb0f0ba526  (1 ahead / 0 behind)
MB-011 assessment branch       : mission/MB-011-customs           @ 82b6ac486d024efcfcc64703b58cc136b546caf9  (1 ahead / 0 behind)
MB-012 assessment branch       : mission/MB-012-runtime-compliance @ d071328d8f68ba1ddd5e8a1fde11718e75fd6672  (1 ahead / 0 behind)
merged_main_sha                : null for all three (SKIPPED_NOT_REQUIRED - no implementation was merged)
```

上述为独立重验时main全SHA、三分支全SHA及各1ahead/0behind，三merged_main_sha为空（没有实现）。

R11使用--no-ff，第二parent为各branch tip，三项无冲突、远端保留：

```text
MB-010 mission/MB-010-node-fabric        @ 8380c38  -> merge 6e9781cb5c42b88f2b9bcdb2e7fb096c4fc8b85a  (parents 756c7d7, 8380c38)
MB-011 mission/MB-011-customs            @ 82b6ac4  -> merge f22273c37af1ebff6c95d49972b5d26a222f2ed2  (parents 6e9781c, 82b6ac4)
MB-012 mission/MB-012-runtime-compliance @ d071328  -> merge e0d9470e2a5b5479c1614071d8f43af3d1d93248  (parents f22273c, d071328)
Alien's forced NO_VALUE record  : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e (9 VERIFICATION events, 3 per Mission)
utopia main after everything    : d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
files added per merge           : 5 (events.jsonl + 4 assessment evidence files) - NO IMPLEMENTATION CODE
branch audit after the merges   : 34 origin refs checked, unmerged = 0
                                  (MB-010..012 are now 0 ahead / 6 behind main, i.e. fully merged;
                                   every other branch, including MB-001..MB-009 and all alien/*,
                                   codex/*, mech/*, docs/*, infra/* and repair/* branches, is 0 ahead)
merged-main CI                  : run 36678805229 on d0dea7b - gateway-web success, android success
city main (this record)         : 247f20264cd1c0085f068f61ab0eaa18b2825ffd
```

每次新增5文件（events.jsonl+4assessment证据）无实现代码；Alien强制记录9VERIFICATION事件，每Mission3。34origin refs审计unmerged0，MB010..012为0ahead/6behind，其他MB/alien/codex/mech/docs/infra/repair全0ahead。merged-main CI36678805229两jobs成功；精确合并链、主分支SHA与控制仓库SHA保留上块。
