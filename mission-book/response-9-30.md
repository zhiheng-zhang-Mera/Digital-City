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
5. **不得伪造历史。** `Mech` 的 assessment 事件（`MIGRATION/Mech`，各 5 条）保持原样 `hostId`；
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
