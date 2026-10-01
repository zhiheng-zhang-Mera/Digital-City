# Mission Book — 常驻施工规则

> **状态：ACTIVE / NORMATIVE / PERSISTENT**
>
> 本文件是 `mission-book/` 的长期施工规范。它不属于任何单次任务、programme 或阶段，**不得在任务完成、阶段冻结或项目收口时移动进 `finished/`**。
>
> 规则更新采用原路径版本化：修改本文件并通过 Git 历史追踪。归档任务只能记录当时使用的本文件 commit SHA，不复制一份“当前规则”进入归档作为新的权威来源。
>
> 当前监控看板：[README.md](./README.md)  
> 工作书模板：[MISSION_TEMPLATE.md](./MISSION_TEMPLATE.md)  
> 过程数据边界：[PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)

## 0. 权威层级

施工事实按以下层级解释：

1. Owner 明确、较新的裁决；
2. 本文件 `CONSTRUCTION_RULES.md`；
3. 当前任务工作书的 task-specific scope / gate；
4. 当前任务 frontmatter 与 reports 中的动态领取、SHA、CI、完成事实；
5. README 监控看板。

**README 只做监控，不是锁、不是调度器、不是施工规则。**  
看板过期不能改变任务真实状态；普通 claim / CI / review 变化也不要求每次同步改 README。

旧规则、旧 dashboard、旧 response 位于 `finished/`，只用于追溯，不得覆盖本文件。

## 1. 为什么恢复这些规则

本文件吸收上一轮施工中已经真实踩过的坑，尤其包括：

- 单次“现在没有可领任务”被误判为任务池结束；
- 第二台主机因暂时没有资格领取而永久睡死；
- hosted CI / 长测试等待时施工主机空等；
- GitHub Actions Billing 恢复后，City frontmatter / dashboard 没及时回填；
- 用错误 branch/head 的绿色 CI 当成当前任务证据；
- 外部 blocker 与真实代码失败混淆；
- 为了不空闲而制造无价值的新工作或过度防御性扩张；
- merge/integration 基于旧 main 施工，最终覆盖或遗漏另一条已接受工作。

历史来源仅用于本次规则恢复：
- `finished/completed-2026-10-01/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`
- `finished/completed-2026-10-01/ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md`
- `finished/completed-2026-10-01/past-rules/2026-09-29-construction-rules-v1.md`

从现在开始，**本文件才是活跃常驻规范**。

## 2. 原子领取：Claim 不能靠看板猜

动态领取真相只存在于目标工作书 frontmatter / 对应 report。

领取必须：

1. 读取最新 Digital-City `main`；
2. 重新判断依赖、角色资格和当前 claim；
3. 只修改目标任务需要的 claim 字段；
4. 使用 fast-forward 更新；
5. 若 push 因另一主机抢先而失败，重新 fetch，重新扫描，不 force-push，不覆盖对方 claim。

禁止：
- 用 README 表格当锁；
- 一次领取同时“顺手刷新”一堆无关任务；
- 抢占另一主机仍有效的 claim；
- 为解决 claim race 使用 force push。

## 3. 双主机独立性

当工作书要求 Development + Review/Correction：

- 两个角色必须由不同实体主机完成；
- Hosted CI runner 不算第二实体主机；
- 同一主机不能因为另一台暂时不可用就自行兼任独立复核；
- Review 必须独立找问题并可直接修复范围内缺陷，不是只签字或复述作者测试。

如果当前剩余工作全部因为稳定机制禁止本主机参与，应进入“结构性无资格”，而不是制造第三角色或假复核。

## 4. 等待不占主机：No-idle

一个已领取任务可以继续保持 owned，同时等待：

- hosted CI；
- 长时间本地测试；
- 插件下载/安装；
- provider/session probe；
- 外部登录；
- 非 CPU 活跃的设备/服务响应。

这些等待**不独占实体施工主机**。

主机应：

1. 保留原 claim；
2. 用独立 worktree / branch；
3. 扫描并领取另一个不冲突、已满足依赖的工作；
4. 原任务变成 actionable 时再回来。

禁止为了“保持专注”空等一个 CI，也禁止因另一个任务在等待就重复开相同实现。

## 5. 零领取结果必须分类，不能直接宣布结束

一次扫描得到 `claimable_now = 0` 只说明“现在不能领”，**不证明任务池完成**。

每次零领取必须归入且只归入以下一类：

### 5.1 `TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY`

条件：
- 仍有未完成任务；
- 当前主机未来有可能获得资格；
- 另一主机完成 Development/Review、CI 结束、Owner gate 解除、阶段冻结、provider/device 恢复等事件可能解锁工作。

动作：
- 进入低成本等待，不 busy-poll；
- **优先事件触发立即重新扫描**；
- 若事件通知缺失，默认约 **20 分钟**做一次 bounded re-scan；
- 可以连续多次 20 分钟重扫，只要任务仍未完成且未来资格合理存在。

典型：UI-000 由 Alien 施工时，Mech 暂时没有 Review 可领；Mech 应等待 UI-000 Development 完成事件，事件丢失时约 20 分钟兜底重扫。

### 5.2 `STRUCTURALLY_INELIGIBLE`

条件：
- 当前所有剩余任务都因稳定机制禁止该主机：同主机不得复核、硬件资格、身份/权限、安全策略、Owner 明确限制等。

动作：
- 记录精确原因；
- 释放主机；
- **不要求周期 20 分钟重扫**；
- 只有 governing gate / 资格条件变化时被唤醒。

### 5.3 `GLOBAL_EXTERNAL_BLOCK`

条件：
- 所有有意义的下一步都需要内部代码无法诚实解决的外部变化，例如账户 Billing、强制硬件缺失、Owner/provider 账户动作。

动作：
- 记录 typed blocker 与证据；
- 释放主机；
- 不对已知不变的外部 blocker 每 20 分钟轮询；
- 外部恢复事件到来后，先执行 §7 reconciliation，再重新扫描。

### 5.4 `POOL_TERMINAL`

只有全部相关任务按真实 completion semantics 终态后才允许使用。

**禁止把 PARKED、暂时没活、结构性无资格、外部阻塞写成“项目完成”。**

零领取至少记录：

```text
pool_incomplete
claimable_now
potentially_claimable_later
classification
structural_ineligibility_reason
global_external_blocker
wake_condition
rescan_after
terminal_reason
```

## 6. Wake-up：优先事件，20 分钟只是兜底

以下事件应触发等待主机立即重新扫描：

- 另一主机 Development / Review 完成；
- required CI 进入 terminal state；
- Owner gate resolved；
- 阶段 baseline / merge 完成；
- dependency 从 locked → open；
- provider/session/device availability 发生有效变化；
- claim 被释放或失败任务变成 owned repair；
- 外部 blocker 被明确报告恢复。

`TEMPORARILY_UNCLAIMABLE` 的约 20 分钟重扫是**低频 liveness 兜底**，不是主调度机制。

## 7. 外部恢复后必须 Reconcile，不能相信旧看板

外部系统可以在没有 Digital-City commit 的情况下改变：

- GitHub Actions billing 恢复；
- CI rerun 变绿；
- provider 恢复；
- approval 到达；
- 设备重新上线。

因此以下时点必须做 control-plane reconciliation：

1. typed external blocker 被报告恢复后立即；
2. 恢复后第一次解释 zero-claim 之前；
3. 宣布阶段/任务池 drained 之前；
4. 创建阶段 merge/integration 之前；
5. 最终项目完成声明之前。

对依赖外部证据的任务必须验证：

```text
recorded branch == evidence head_branch
recorded head   == evidence head_sha
required terminal state == evidence conclusion/status
```

规则：
- exact recorded head 的新成功 run 可以关闭旧 external block；
- 另一 branch/task 的绿色 run 不能满足当前任务，记为 `EVIDENCE_POINTER_MISMATCH`；
- 历史失败/blocked run 保留，当前 frontmatter 更新为最新已验证调度真相；
- reconciliation 只修 control-plane metadata，不制造产品代码 commit 来“刷新状态”；
- 查询不到权威外部源时保留最后已验证状态，写 `RECONCILIATION_SOURCE_UNAVAILABLE`，不得猜。

## 8. CI 与失败分类

- 本地 PASS 不能替代工作书明确要求的 hosted CI；
- Billing / runner 根本没启动 job 属于 external blocker，不是产品代码失败；
- job 已真正启动且 test step 失败，就转为普通 code defect，不得继续标 Billing；
- 修复必须针对观测到的 defect，不得因为“顺便”扩大任务边界；
- required CI 必须绑定精确 branch/head；
- 禁止删除测试、降低门槛、改成功定义来换绿。

## 9. 不制造假工作，不做防御性膨胀

当主机暂时没资格施工：

- 不新造功能；
- 不额外重构与当前 acceptance 无关的基础设施；
- 不因为“未来也许有风险”持续增加 gate、wrapper、abstraction；
- 不为保持机器繁忙而提交无验证价值的 head。

只有以下来源可以扩大工作：
1. 工作书明确范围；
2. Owner 新裁决；
3. 真实测试/运行发现的 in-scope defect；
4. 为满足现有 contract 所需的最小修复。

“没有工作可做”本身不是一个需要用代码修掉的 defect。

## 10. 缺失兄弟项目 / 外部依赖不能拖死独立施工

若 sibling programme 尚未完成：

- 优先使用稳定 contract/port + deterministic test double 完成本任务可独立部分；
- 真正需要 real provider / real device / real cross-device 的部分诚实留到 integration；
- **deferred != passed**，必须记录 exact pending seam；
- 不能为了跨项目方便复制出第二套 canonical ownership。

## 11. 合并 / Integration 也是异步阶段

每个阶段 merge/integration：

1. 从**当时最新** Utopia `main` 开始；
2. 集成已通过独立复核的 branch，冲突按显式 union/superset 处理；
3. 保留 main 已接受的其他工作；
4. 能独立跑的测试全部先跑；
5. 若只剩真实 external seam，记录 waiting external seam 并释放主机，不空等；
6. **最终 merge 前再次刷新当时最新 main**；
7. 刷新后重跑 required acceptance / CI；
8. merge 后再次验证 merged-main CI。

禁止拿阶段开始时的旧 main 一路做到最终 merge。

## 12. Claim 异常与接力

自动施工者不得擅自清空别人 claim。

- claim 后尚无实质实现/报告：可由 Owner 或明确的规则化 recovery reset；
- 已有实质工作但原主机无法继续：记录 blocker，不允许另一台主机偷偷冒充原角色接力；
- 若必须改变角色边界，使用 Owner ruling 或 superseding workbook，保留旧历史。

## 13. 工具 / 插件等待与安全

若任务工作书允许 Hns/Codex 自主安装插件或 Skill：

- 插件下载/安装等待适用 §4，不占主机；
- 来源、版本/ref 记入报告；
- 插件默认只属于施工工具链；
- 未经工作书明确授权，不得因为插件方便就改变生产 runtime/framework；
- 不向未知第三方上传 secrets、token、私有凭据或不必要代码。

## 14. 过程数据

过程证据遵守 [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)。

City 只保存：
- claim/status；
- 精确 branch/head/CI；
- 有界报告；
- blocker / reconciliation / completion 摘要。

无界 terminal log、重复截图、raw trace 不进入 City 当前施工面。

## 15. 本文件的永久生命周期

`CONSTRUCTION_RULES.md` 是 Mission Book 的常驻基础设施：

- 新任务默认继承；
- 新工作书必须显式链接本文件；
- README 只链接，不复制整套规则；
- 阶段完成时**不得移动到 `finished/`**；
- 清理 finished 时不得处理本文件；
- 规则变化直接原位更新，并在 commit message 说明原因；
- 历史版本由 Git history 保留；
- 若未来确需彻底替换规则，仍在本路径提交 replacement，而不是建立“本轮专用规则书”后再归档。

这样可以避免“刚踩完的坑，因为上一轮任务收工就把防坑规则一起收进仓库地下室”的循环。
