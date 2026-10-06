# Owner Response — 2026-09-30

> 本文件是 2026-09-30 的最新 Owner ruling，覆盖 MB-010..012 assessment-first 与 MB-007→008→003 收口修补。与 [response-9-29.md](./response-9-29.md) 冲突时，本文件优先；9-29 其余未冲突裁决继续有效。

## R1 — MB-010..012 从 disabled placeholder 改为 assessment-first auto-claim

Owner 决定：

1. **MB-010 Node Fabric、MB-011 Customs、MB-012 Runtime Compliance 全部设置 `execution_enabled=true`。**
2. 自动施工机可以领取，但领取后的第一阶段不是直接迁移，而是 **donor ↔ 领取时 Utopia 最新 `main` 的价值评估**。
3. Assessment 结果只能是：
   - `FULL_MIGRATION`
   - `PARTIAL_MIGRATION`
   - `NO_VALUE`
4. 只有 FULL/PARTIAL 才允许写迁移实现；PARTIAL 只迁 capability matrix 明确批准的 gap-closing 子集。
5. NO_VALUE 时：
   - 不写实现代码；
   - City 必须报告 **“判断无价值，任务保留，未迁移”**；
   - `migration_complete=true`；
   - `migration_status=SKIPPED_COMPLETE`；
   - `migration_completion_basis=SKIPPED_NOT_REQUIRED`；
   - `verification_complete=true` / `verification_status=NOT_REQUIRED_SKIPPED_COMPLETE`；
   - 不生成假的 verified implementation episode；
   - 任务和证据保留，但自动调度以后视为已完成，除非 Owner reopen。
6. Assessment Host 若继续迁移，自动成为 Migration Host；Verification 仍必须由不同实际主机完成。
7. Assessment-only branch 在没有实质实现提交前不计入 `UNMERGED_WIP_LIMIT`。

## R2 — Claim-time capability inventory 是强制证据

每个 MB-010..012 在领取后都必须在 Mission 文件与 Assessment Report 中记录：

- 本 Mission 计划迁移的 capability；
- 领取时 Utopia 最新 `main` SHA；
- Utopia 当前已经存在的语义等价/相关 capability；
- 哪些 donor capability 不需要迁移以及理由；
- 哪些 capability 只迁移一部分即可补足 Utopia 缺陷；
- donor/Utopia 的 source/test/runtime/evidence anchors。

不得用目录名是否存在代替语义能力核对。

## R3 — 论文 / research material

所有 verdict 都是研究素材，包括“不迁移”的负结果。至少保留：

- planned / equivalent / superior / gap / selected / abandoned capability counts；
- reason-code 分布；
- parity/runtime checks 与真实失败；
- baseline/head SHA；
- 若迁移，保留 change/test/CI/real-consumption/failure-recovery；
- 若不迁移，保留为何复制 donor 会造成重复、错误 ownership、旧语义或不值得独立拆分的证据。

素材继续进入既有位置：

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

NO_VALUE 不得伪造 verified episode；assessment branch 保留并由 City report 钉住 immutable HEAD。**完全跳过仍视为 Mission 完成。**


---

## R4 — Completion basis：实现、Owner 接受、完全跳过均可完成

从本裁决起，`migration_complete=true` 必须配套 `migration_completion_basis`：

1. `IMPLEMENTED_COMPLETE` — Migration Host 自身完成并记录 PASS；
2. `OWNER_ACCEPTED_COMPLETE` — Migration Host 诚实记录 blocker/negative result，Owner 后续明确接受边界并声明完成；
3. `SKIPPED_NOT_REQUIRED` — 完整比较后确认当前 Utopia 已等价/更优覆盖或该迁移没有独立价值，因此完全不迁。

第三类不是失败，也不是“永远未迁移”。它是一个**绿色完成结论**：保留任务、Assessment Report 与 branch/evidence，但 `migration_complete=true`、`verification_complete=true`，不要求实现 merge/episode。

## R5 — 禁止为 Owner override 伪造 Migration Host PASS

MB-007/008 的 Alien 历史 blocker 必须保留。任何 verifier 都不得写一条假装由 Alien 当时发出的 `MIGRATION_COMPLETE/PASS`。

Utopia finalizer 必须增加显式 owner-override completion path，并在 episode 里保存：

- migration-side blocker；
- Owner ruling reference；
- Verification Host 的 `OWNER_INTERVENTION`；
- independent verifier finding；
- CI / verification complete；
- completion basis = `OWNER_ACCEPTED_COMPLETE`。

## R6 — 当前修补顺序固定为 7 → 8 → 3

本轮 Owner-directed repair queue：

1. **MB-007**：只修 process closeout / finalizer / verified episode；已经进入 Utopia main 的实现不回滚、不重迁。
2. **MB-008**：必须等 Step 1 完成并进入 Utopia main 后，再同步最新 main。开始实质合并前允许重新判断当前价值：
   - 全部无价值 → `SKIPPED_NOT_REQUIRED` 直接闭环；
   - 仍有价值 → 完成 bounded verification、owner-override finalize、final CI、merge。
3. **MB-003**：必须等 Step 2 完成后重新评估当前 Utopia：
   - 若整体已无迁移价值 → `SKIPPED_NOT_REQUIRED`；
   - 若仍有价值 → real provider / runner execution seam 仍是硬门槛，不得 mock/waive。

前一步 `repair_status=COMPLETE` 前，后一步不得 finalize/merge。

## R7 — MB-008 两主机 bounded-action 历史条款的解释

MB-008 Migration Host 已经诚实记录旧 product-consumption gate 的 blocker，R7（9-29）随后接受该边界并开放 Verification。

因此本轮不要求 Alien **追溯性重演**一次它当时没有合法消费面的 bounded action。Mech 作为 Verification Host 必须完成真实 bounded Computer-Use chain、postcondition、至少一个 refusal/error path 和 recovery/stabilization path；Alien 的 blocker + Owner ruling + Mech 的真实验证共同构成完整证据。

这不扩大 MB-008 的 runtime plane，也不把 deferred controllers/drivers 写成已完成。

## R8 — MB-003 completion repair 可留在原 Mission 身份

9-29 R1 中“superseding/completion Mission”的目的，是防止在 MB-003 Verification 里偷偷新增非 donor 能力。本轮现明确：

- 若 Step 3 评估后 MB-003 仍有价值，允许在 **MB-003 原 Mission 身份与原 verification claim** 下做显式 completion repair；
- 不强制再创建新的 MB 编号；
- 只能迁入 frozen donor 已存在的 provider/runner execution seam、registry/supervisor wiring；
- planner、vendor UI、新 provider 语义仍禁止；
- 若没有 donor-supported real provider 环境且 MB-003 仍有价值，则保持 `BLOCKED`，不能用“跳过完成”掩盖环境阻塞。

## R9 — City 状态是施工事务的一部分

7 → 8 → 3 每一步都必须：

```text
City pre-state commit
→ Utopia work/evidence
→ City milestone update
→ CI/finalize/merge or SKIPPED_COMPLETE
→ City final closeout commit
```

至少同步：
- Mission front matter；
- Mission 正文 closeout/repair section；
- `README.md` 进度表；
- `MISSION_INDEX.md`；
- 对应 Assessment/Migration/Verification Report。

不得等所有代码做完后一次性补 City 状态。

---

## R10 — MB-003 host-separation waiver（Owner 指示，2026-09-30）

**背景.** MB-003 的 two-host gate 已由两台真实主机各自留下 donor-backed receipt 而满足：`Mech`（`MEGA-REP`，
见 `reports/MB-003/VERIFICATION_REPORT.md` §8.3）与 `Alien`（`MERA-ALIANWARE`，`RUNTIME_PASS
MB-003:b84512cd12f80735`）。环境阻塞已解除，剩下的唯一条件是主机权限：按 [README.md](./README.md) §6
lines 233-236、§9、§11.1，完成维修与合入 `main` 属于 **Verification Host**，且
`scripts/finalize-mission-episode.mjs` 机械强制 `migrationHost != verificationHost`。本会话中 Verification
Host 无法执行该收口。

**Owner 裁决.** 允许本 Mission 的 Migration Host（`Alien`）在同一次施工中完成 verification 收口与 merge，
**仅限本 Mission 本次收口**，且必须同时满足：

1. **不得伪造历史。** `Mech` 已经发出的 VERIFICATION 事件必须原样保留其 `hostId`；不得代写任何一条假装由
   `Mech` 发出的 `MIGRATION_COMPLETE` / `CI_RESULT` / `VERIFICATION_COMPLETE`。
2. **两个主机的证据都仍然算数。** `Mech` 的真实 provider receipt 与早期独立发现继续构成本 Mission
   verification 证据的一部分，不被 `Alien` 的收口覆盖或删除。
3. **必须显式记录豁免。** finalizer 增加显式的 host-separation waiver 路径，并在 episode 中写入
   `hostSeparation.mode = OWNER_WAIVED`、本裁决引用、以及每个角色**实际**出现过的 host 列表与完成主机产出的
   verification 事件数。
4. **豁免必须被需要且被引用。** 仅当完成主机确实产出了 VERIFICATION 事件、且记录中至少有一个事件引用了本裁决
   （`response-9-30.md#R10`）时才接受；完成主机已经是 Verification Host 时拒绝（无意义的豁免）。
5. **其余 verification 标准一项都不得降低。** independent finding、真实 bounded chain、`CI_RESULT=PASS`、
   在最终 CI 之后的 `VERIFICATION_COMPLETE=PASS`，以及 required CI 全绿，全部照旧。

**范围.** 这是一次显式的、被记录的、只针对 MB-003 收口的主机分离豁免，**不是**对 two-host 规则的普遍放宽；
后续 Mission 仍需两台不同真实主机，除非 Owner 再次显式裁决。

---

## R11 — MB-010/011/012 provenance merge 与 Alien 强制 NO_VALUE 记录（Owner 指示，2026-09-30）

**背景.** MB-010、MB-011、MB-012 三个 assessment-first Mission 已由 Host `Mech` 以 `NO_VALUE` 绿色闭环
（`migration_completion_basis=SKIPPED_NOT_REQUIRED`）。Owner 随后指示 Host `Alien` 在**不复用任何既有测试**的前提下
重做独立验证，并在验证通过后把 Utopia 的分支合入 `main`，保留操作历史与 SHA 追踪；本次追加指示为：
先落定本轮已决定的报告修订，再把 `NO_VALUE` 以 `Alien` 身份**强制记录**，然后继续合并。

**与既有规则的冲突（必须显式记录，不得静默处理）.** [README.md](./README.md) line 223 规定：NO_VALUE 时
assessment branch "push 后保留为 provenance/research branch，**不 merge、不删除**"。
Owner 本次的合并指示与该条**字面冲突**。处理方式：把 Owner 指示本身记为裁决，逐条限定其效力范围，
而不是默默照做、也不是默默拒绝。

**Owner 裁决.**

1. **允许合并，但只作为 provenance merge。** `mission/MB-010-node-fabric`、`mission/MB-011-customs`、
   `mission/MB-012-runtime-compliance` 三个 branch 允许以 `--no-ff` 合入 `main`，**仅因为 Owner 显式指示**；
   README line 223 对**将来**的 NO_VALUE branch 继续有效。
2. **不得被读成实现合并。** 三个 branch 各自只有一个 commit，内容只有
   `data-records/evolution/inbox/mission-book/MB-0xx/events.jsonl` 与
   `evidence/raw/mission-book/MB-0xx/assessment/**`，**不含任何实现代码**。因此
   `merged_main_sha` 保持 `null`（该字段语义是"本 Mission 的实现落在 main 的 SHA"），
   provenance merge 另立字段 `provenance_merged_at` / `provenance_merge_sha` / `provenance_merge_branch` 记录。
3. **评估结论不变。** `assessment_result=NO_VALUE`、`assessment_status=COMPLETE_NO_VALUE`、
   `migration_completion_basis=SKIPPED_NOT_REQUIRED`、`verification_status=NOT_REQUIRED_SKIPPED_COMPLETE`
   全部不变；仍不生成 verified implementation episode。
4. **分支不删除。** 合并后 `mission/MB-0xx-*` 三个 branch 在远端保留，作为 provenance 的原始参照。
5. **不得伪造历史。** `Mech` 的 assessment 事件（`MIGRATION/Mech`，每个 Mission 4 条）保持原样 `hostId`；
   `Alien` 的强制记录只能以自己的 `VERIFICATION` + `hostId=Alien` 事件形式追加，不得代写 Mech。
6. **Alien 必须留下自己的真实记录。** 以 README line 309 的事件约定，在
   `data-records/evolution/inbox/mission-book/MB-0xx/events.jsonl` 追加由 `Alien` 发出的事件：
   `OWNER_INTERVENTION`（引用本裁决，作为触碰该 Mission 的施工者义务事件）、
   `VERIFIER_FINDING`（独立复核结论）与 `VERIFICATION_COMPLETE`（结论 `PASS`，即 `NO_VALUE` 被独立确认）；
   全部 `role=VERIFICATION`、`hostId=Alien`，`sourceRef` 指向 `Digital-City/mission-book/response-9-30.md#R11`。
7. **SHA 追踪必须完整。** 记录每个 branch 的 head SHA、其父提交（必须等于合并前的 `main`）、
   合并产生的 merge commit SHA，以及合并后的 `main` SHA。

**范围.** 本次合并是**被显式裁决的 provenance 归档**，不改变任何一个 Mission 的 value verdict，
也不构成"NO_VALUE 就可以合实现"的先例。

### R11 执行记录（2026-09-30，Host `Alien`）

裁决逐条落实，全部可核对：

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

**一处必须说明的执行顺序偏差.** Owner 的措辞顺序是"先强制记录、再继续合并"。实际执行是：
City 侧的强制记录（第 1 步）确实在合并之前完成；但 Utopia 侧的事件写入（第 3 步）放在三个 merge
**之后**。理由是 provenance 保真：先合并可以让每个 branch 的内容在 `main` 中**逐字节保持原样**
（否则 `events.jsonl` 会出现 add/add 冲突，需要在 merge commit 里改写 branch 自己的文件）。
owner 要求的"保留操作历史"因此得到更强的满足，而不是更弱。记录在这里以便核对。顺序偏差之外，
第 1、2、3 步的产物与裁决要求逐条一致。

**另一处需要记录的判断.** 本轮 City 提交使用 git author `Alien <alien@digital-city.local>`，
与 `Mech <mech@digital-city.local>` 的历史约定一致（host 自署），而不是仓库默认的 Owner 身份。
上一轮 4a2cd5f 误用了默认身份，已推送因此不重写历史，仅作记录。


---

## R12 — Migration-only 正式结束；进入 Pre-Assistant Product Closeout（Owner 指示，2026-09-30）

**当前事实。** MB-001..MB-012 已全部闭环；MB-010..012 的 `NO_VALUE` 已由 Alien 独立复核并按 R11 完成 provenance 归档；R11 记录的 Utopia branch audit 为 `unmerged = 0`，merged-main CI 通过。当前没有可领取的 Migration / Verification / Assessment Mission。

**Owner 裁决。**

1. **结束当前 `MIGRATION_ONLY` 施工阶段。** 不得因为队列为空而自动创建 MB-013，也不得自行 reopen/reset MB-001..012。
2. 当前下一项 Owner-directed 工作绑定到：
   [`ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md`](./ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md)。
3. 本轮只允许该工程书定义的 **T0 → T1 → T2 → T3 → T4**：
   - T0：migration phase 关账 / freeze；
   - T1：把已验收 Room Pack 接入正常 Utopia Shell；
   - T2：建立统一 Action facade；
   - T3：建立 deterministic Ask / Do；
   - T4：独立产品验收、merge、merged-main CI 后停线。
4. 这一阶段属于**产品整合**，不是 donor migration。允许为了 T1–T3 新增必要的产品层接口/UI/adapter，但不得借此重新搬 donor、扩充领域能力或修改已闭环 Mission 的完成语义。
5. **硬性排除：** 本轮不实现 personalized assistant/persona、assistant-specific memory、proactive personal agent、LLM router、Boss connector、Hns connector、新 Room、Health/Quant/Digital-Me、任意 shell、完整 deferred Computer-Use runtime plane、voice/avatar/wearable/AR/VR/cloud 等后续能力。
6. 原 README 的 migration selection/finalize/host-separation 等规则仍作为**已闭环 Mission 的历史解释和 Owner 显式 reopen 时的条件规则**保留，但不再是当前产品施工的调度器。
7. 本轮达成：
   `FINAL_STATUS = PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE`
   后必须停止。下一阶段必须等待新的 Owner 指示，不得自动继续后续 connector、workspace、resident-host 或 assistant 层。

**目的。** 先把已有 Utopia 能力收束成一个统一终端骨架，再决定后续能力；防止在产品统一之前继续横向堆模块。

---

## R13 — Pre-Assistant T4 单主机验收豁免（Owner 指示，2026-09-30）

**背景.** [PRE-ASSISTANT 工程书](./ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md) §3 与 §8 要求
T4 由 **Independent Verification Host** 执行，并"在两台都可用时使用两个不同真实主机标识"；若只有一台真实主机可用，
则必须**保持分支未合并**并如实报告该限制，除非 Owner 显式豁免。本轮可用真实主机只有 `Alien`
（`MERA-ALIANWARE`，本机）。`Mech`（`MEGA-REP`）在本会话中不可达。

**Owner 裁决.** 对本轮 Pre-Assistant 收尾**豁免第二台真实主机的要求**，`Alien` 上的独立验收即可用于 T4 放行，
但必须同时满足：

1. **验收者必须真正独立于实现者。** 验收由**未参与编写的独立 agent 会话**执行，且在读取
   `IMPLEMENTATION_REPORT.md`、实现提交信息或实现方证据脚本**之前**先写好自己的探针与发现文件；
   实现方的脚本不得作为验收证据引用。
2. **单主机限制必须如实记录。** 验收报告与本 Mission Book 必须明写"这是单主机验收"：验收进程与
   Gateway 运行在同一物理主机、同一 `provenance.host` 上。允许指出 Android 设备是真实独立硬件（设备侧确为
   多机），但**不得**把单主机验收说成双主机验收。
3. **验收结论必须可以被否决。** 验收者给出 ACCEPT / REJECT 明确结论；REJECT 时实现方必须修复**全部**
   blocking finding 并在新 SHA 上**重新验收**，不得以"大部分通过"为由放行。
4. **CI 标准不降。** 分支 required CI 与 merged-main CI 都必须全绿，才允许合并与收线。
5. **范围仅限本轮。** 这是针对 Pre-Assistant 收尾这一轮的显式、被记录的豁免，**不是**对 future Mission
   two-host 规则的普遍放宽；后续需要独立主机的阶段仍按各自工程书执行。

**范围.** 豁免只涉及"验收主机是否与实现主机不同"这一条；其余 T4 要求（真实执行、独立探针、范围审计、
独立结论）一项不降。

## Language / 语言

[English full reading](en/response-9-30.md) · 中文原文见上。
