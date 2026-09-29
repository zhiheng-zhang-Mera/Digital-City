# Mission Book — Pure Migration Queue

> 本目录是 Digital-City 对 **已确认 City 归属的纯迁移工作** 的施工控制面。它描述“迁什么、迁到哪里、什么算迁完”，不保存运行代码。

## 本轮原则

```text
MODE = MIGRATION_ONLY
NEW_FEATURE_DEVELOPMENT = FORBIDDEN
IMPLEMENTATION_LANDING = Utopia
CITY_REPO = mission / claim / ownership / acceptance metadata
```

本轮只迁移 donor 中已经真实存在的能力。允许：抽取、拆分、接口适配、路径迁移、消费接线、等价重构、测试、真实 UI/使用验证、telemetry/error/evidence 补全。禁止：新增产品能力、补完设计文档中的未来模块、为了验收造新 UI、扩大权限或把 TODO 当迁移实现。

## 为什么是双阶段

每个 Mission 有两个独立完成状态：

- **MIGRATION_COMPLETE**：第一台主机完成迁移分支、测试、真实消费与 Migration Report；**不得合入目标 main**。
- **VERIFICATION_COMPLETE**：第二台不同主机先独立审查，再参考 Migration Report 二次维修/验证；CI 全绿后由验证主机合入目标 main，并提交 Verification Report。

只有两者都为 `true` 才算 Mission 完整收口。

## 领取算法

每次开始工作，先读取 Digital-City `main` 下本目录的最新任务状态：

1. 过滤 `execution_enabled=true`。
2. 优先找 `migration_complete=false`、Migration 未领取、依赖满足的任务，按 `sequence` 升序领取。
3. 若不存在可领取 Migration，再找 `migration_complete=true` 且 `verification_complete=false`、Verification 未领取，并且当前主机不是 Migration Host 的任务；按 `sequence` 升序。
4. 任一阶段已经被领取但尚未完成时，其他主机跳过该任务。
5. 领取前必须先更新对应 Mission 文件 Claim 并提交到 **Digital-City main**；写冲突意味着 Claim 失败，必须重新读状态再选。
6. 同一 Mission 只允许两个执行主机：Migration Host 与 Verification Host，各参与一次；同一主机不得领取两种角色。Hosted CI runner 不算执行主机。

### Claim 异常

自动 worker 不得清空别人的 Claim。Claim 后如果尚无任何目标仓库实现提交/报告，Owner 可以显式 reset；一旦存在实质工作而 claimant 无法结束，任务进入 `BLOCKED_OWNER_DECISION`。不要为了“继续跑”偷偷加入第三台主机。

## 分支与合并

- Migration Host：目标实现仓库 `main` → 新建 `mission/<MISSION_ID>-<slug>` → 迁移 → push → **不 merge**。
- Verification Host：领取同一任务 → **先独立看 donor/diff/code/tests/运行状态，不先看迁移报告** → 记录初步发现 → 再读 Migration Report → 在同一分支二次维修和验证 → required CI 全绿 → merge `main`。
- Digital-City 的 Claim/状态更新是任务元数据，可直接更新 City `main`，不等同于实现代码进 main。

## 报告

所有 Mission 的快速施工报告统一保存在 Digital-City：

```text
mission-book/reports/MB-xxx/
├─ MIGRATION_REPORT.md
└─ VERIFICATION_REPORT.md
```

报告采用一个 Markdown 文件内的结构化中英双语/字段化写法，避免 Hns 为快速读取同一事实重复打开两份文件。原始运行证据不复制进 City，只放证据指针、摘要和最终 SHA。

Migration Report 必须明确记录 **落地边界**，以便验证主机在独立审查后对照：donor/source SHA、source→target 路径、保留/不迁行为、接口、实际 UI/消费路径、测试、日志/错误、故障与恢复、证据位置、已知限制、branch/CI 状态。

## 当前 Mission 范围

- **可施工 MB-001..009**：Boss/Hns 核心拆分、Engineering、Host Health/Restart、Research、Computer Use、Theme ownership relocation。
- **禁领 MB-010..012**：Node Fabric optional extraction、Customs、Runtime Compliance；只有 Owner 显式修改 `execution_enabled` 后才进入队列。

### 不建立迁移 Mission 的内容

- 已迁完成：Utopia 的 Skill Intake、Evidence Engine、Knowledge Core、Ingestion Core、Document Readers 等已 ACTIVE/PROMOTED 成果。
- 独立项目继续留在自己的正常仓库：Digital-Me、Quant-ultra、Parama-Health、My_VR_Glove、Auto-Game-Bot 等；City placement 不等于必须物理搬家。
- Qualification Control Plane 已经是独立且正确的 City building/source，不需要伪造一次搬迁。
- design-only / 未实现未来能力不进入本轮：General-Logic-Engine 实现、Drug Simulator runtime、Auto-Game-Bot 尚未实现的 perception/autonomy、Parama 尚未实现模块等。


## 绑定执行条件（所有 Mission 强制）

1. **纯迁移**：`MODE=MIGRATION_ONLY`。只能搬运、拆分、接口适配、接线、等价重构、测试与证据化 donor 中已经存在的行为；不得新增 donor 中不存在的产品能力、策略或语义。
2. **两个独立完成状态**：`MIGRATION_COMPLETE` 与 `VERIFICATION_COMPLETE` 分开维护；前者不代表可进入 `main`。
3. **领取前先向 Digital-City main 报到**：领取主机必须先在本文件 Claim 区填写主机标识、角色、时间，并提交到 City 仓库。发生写冲突时必须重新读取最新状态并重新选任务。
4. **任务已被领取且对应阶段未完成时，其他主机必须跳过该任务**，不得抢占。
5. **同一 Mission 严格两台主机**：一台只承担 Migration，一台只承担 Verification；同一主机一旦出现在本 Mission 的任一 Claim 中，不得再次领取该 Mission 的任何角色。Hosted CI runner 不计入“参与主机”。
6. **选择顺序**：先选择 `EXECUTION_ENABLED=true` 且尚未迁移、无人领取、依赖满足的 Mission；按 `SEQUENCE` 升序。只有当前没有可领取迁移任务时，才选择已迁移但未验证、无人领取的 Mission；同样按 `SEQUENCE` 升序。
7. **Migration 分支**：迁移主机默认从目标实现仓库最新 `main` 新建 `mission/<MISSION_ID>-<slug>` 分支；迁移阶段不得合入目标仓库 `main`。City 仓库中的 Claim/状态元数据更新不受此限制。
8. **Migration 报告**：迁移主机必须把快速施工报告提交到 `Digital-City/mission-book/reports/<MISSION_ID>/MIGRATION_REPORT.md`，并明确记录“落地边界”：donor SHA、source→target 路径、保留行为、明确未迁内容、接口/契约、现有 UI/实际消费路径、测试、数据/错误记录摘要、已知限制、Utopia 证据指针、分支 HEAD/CI 状态。City 不保存大体量原始运行日志。
9. **Verification 必须先独立审查，后看迁移报告**：验证主机先只依据 donor、目标代码、diff、测试和运行状态完成独立 code review，并在验证报告中记录独立发现；之后才读取 Migration 报告作为二次参考。
10. **Verification 可直接维修同一迁移分支**：验证主机在对应 Migration 分支实施必要的二次维修、补测、真实 UI/使用落地验证、故障/恢复验证和证据补全，但不得扩大 Mission 功能边界。
11. **合并门禁**：验证完成后，目标实现仓库所有 required CI + 本 Mission 指定检查必须全绿，方可合入 `main`。不得用跳过/删除测试、放宽验收、修改目标语义来换绿。
12. **最终报告**：验证主机把最终报告提交到 `Digital-City/mission-book/reports/<MISSION_ID>/VERIFICATION_REPORT.md`，记录独立审查、参考 Migration 报告后的差异、维修、真机/第二机结果、失败与恢复、CI run、最终 branch SHA、merge SHA 和 Utopia 证据指针。
13. **异常领取恢复**：自动施工者不得自行清空 Claim。若 Claim 后尚未产生任何实现提交/报告，Owner 可显式 reset；若已经产生实质工作但主机无法完成，则本 Mission 标记 `BLOCKED_OWNER_DECISION`，不得引入第三台主机偷偷接力，需由 Owner 决定是否建立 superseding Mission。
14. **不允许“为了验收而造新 UI”**：真实 UI/使用落地必须复用 Utopia 已存在的 Web/Android/Services/Tasks/Activity 等消费面或 donor 已存在的 UI 行为；若现有产品面无法消费该能力，则记录为边界/阻塞，不得把新产品功能伪装成迁移。
15. **Utopia 过程狗粮为强制施工数据**：领取后、实质施工前以及每个有意义的 change/test/runtime failure/recovery/Owner intervention/verifier finding/repair/CI/completion 节点，必须在 Mission implementation branch 使用 Utopia `pnpm mission:event -- ...` 追加结构化事件。大体量现场证据写入 `.runtime/evidence/mission-book/<MISSION_ID>/<run-id>/`；只有跨主机确有需要的有界非敏感证据才选择性发布到 `evidence/raw/mission-book/<MISSION_ID>/`。
16. **Episode 收口与双 CI**：Verification 主机先让实现代码 required CI 全绿并记录 `CI_RESULT=PASS`、`VERIFICATION_COMPLETE=PASS`，再运行 Utopia `pnpm mission:finalize -- ...` 生成 verified episode 并移除当前树 inbox；提交该纯数据收口后，**最终 branch HEAD 必须再次跑 required CI 并全绿**才允许 merge。City Verification Report 同时记录 implementation CI、final branch CI、episode path/digest 与最终 merge SHA。



## Utopia evolution bootstrap

Mission 施工使用 Utopia 内置的最小经验流工具：

```text
contracts/evolution/mission-event-v1.schema.json
contracts/evolution/mission-episode-v1.schema.json
scripts/record-mission-event.mjs
scripts/finalize-mission-episode.mjs
```

命令入口：

```text
pnpm mission:event -- ...
pnpm mission:finalize -- ...
```

详细过程数据边界见 [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)。
