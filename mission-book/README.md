# Mission Book — Integration-First Migration & Verification Queue

> 本目录是 Digital-City 对已确认 City 归属迁移工作的**当前施工控制面**。  
> **Active rules = 本文件 + `response.md` + 各 Mission 当前 front matter / mission-specific gates。**  
> `past-rules/` 与历史报告仅用于 provenance，不得作为新任务的运行时规则来源。

## 0. 模式与边界

```text
MODE = MIGRATION_ONLY
NEW_FEATURE_DEVELOPMENT = FORBIDDEN
IMPLEMENTATION_LANDING = Utopia
CITY_REPO = mission / claim / ownership / acceptance metadata
SCHEDULER = INTEGRATION_FIRST
UNMERGED_WIP_LIMIT = 2
```

迁移只能搬运 donor 中已经存在的行为：允许抽取、拆分、接口适配、等价重构、已有消费面接线、测试与证据化；禁止把未来设计、缺失 runtime、全新 UI、全新策略或新产品能力伪装成“迁移”。

## 1. 权威来源顺序

发生冲突时按以下顺序解释：

1. Owner 的最新显式裁决：[`response.md`](./response.md)；
2. 本文件的当前规则；
3. Mission 当前 front matter + mission-specific gates；
4. 当前 Utopia `main` 的事实状态；
5. Migration / Verification Report（历史证据）；
6. [`past-rules/`](./past-rules/)（纯历史归档）。

报告中的旧 rule 编号、旧判断、旧阻塞原因不会自动覆盖后来的 Owner 裁决。

## 2. 双阶段仍然保留

每个 Mission 仍有两个独立状态：

- **MIGRATION_COMPLETE**：Migration Host 完成迁移、测试、报告与可要求的真实运行；不得自行合入实现仓库 `main`。
- **VERIFICATION_COMPLETE**：另一台不同实际主机完成独立审查、同步最新 `main`、维修/真实运行、双 CI、episode finalize，并由 Verification Host 合入 `main`。

同一 Mission 的 Migration Host 与 Verification Host 必须是**两个不同实际主机标识**；Hosted CI runner 不计入执行主机。

“要求两台主机都跑过”的默认解释是：**Migration Host 与 Verification Host 各自留下真实运行证据**，不再要求第三台机器或第二个 verifier。若某 Mission 明确要求额外物理设备，必须单独写在 mission-specific gate 中。

## 3. 新领取算法：Integration First

每次开始工作必须先读取 Digital-City 最新 `main`，并按以下顺序选择：

### P0 — Verification / Integration

优先选择：

```text
execution_enabled = true
migration_complete = true
verification_complete = false
verification stage unclaimed or already claimed by this host
current host != migration_claim_host
not BLOCKED_OWNER_DECISION (unless response.md has explicitly resolved it)
```

P0 内按以下优先级排序：

1. 已存在 substantive mission branch 且相对实现仓库 `main` 落后较多；
2. 修改共享控制面的分支；
3. sequence 升序。

以下文件/区域视为**共享控制面**，触及后自动提高 Integration 优先级：

- `city/CITY_IMPLEMENTATION_MANIFEST.json`
- `city/manifest.mjs`
- `city/tests/manifest.test.mjs`
- `services/capability-bridge/**`
- 全局 census / registry / shared contracts / promotion-history verifier

**任何 mission branch 落后实现仓库 main > 10 commits，或触及共享控制面且 main 已前进，都视为 P0 integration pressure。**

### P1 — 新 Migration

只有在**没有本机可领取的 P0**时，才允许选择新的 Migration：

```text
execution_enabled = true
migration_complete = false
migration stage unclaimed
dependencies satisfied
not BLOCKED_OWNER_DECISION
global unmerged substantive mission WIP < 2
```

然后按 sequence 升序。

### WIP Limit

`UNMERGED_WIP_LIMIT = 2`。

“WIP”指已经产生实质实现提交、但尚未进入实现仓库 `main` 的 Mission branch，包括等待 Verification 或等待 Owner 裁决的分支。历史遗留可暂时超过 2，但**只要超过上限就冻结新的 Migration**，直到 integration backlog 降回 2 以下。

不要为了让某台机器“有活干”而继续制造新分支。

## 4. Claim 与主机资格

- Claim 前先更新对应 Mission 文件并提交到 Digital-City `main`。
- 写冲突 = Claim 失败，重新读取最新状态并重选。
- 已有阶段 Claim 且尚未结束时，其他主机不得抢占。
- 自动 worker 不得自行清空别人的 Claim。
- Claim 后尚无实质实现/报告时，Owner 可 reset；已有实质工作而无法继续时，进入 `BLOCKED_OWNER_DECISION` 或由 Owner 建立 superseding Mission。
- Mission Index 应尽量显示 Migration Host / Verification eligible host；但**Mission 文件 front matter 才是 Claim 真值**。

## 5. Dependency 的统一语义

除非 Mission 明确写出更弱的依赖，`dependencies satisfied` 默认表示：

> **依赖 Mission 的所需实现已经被 Verification 接受并进入目标实现仓库 `main`。**

仅有 `migration_complete=true`、但代码仍停留在未合并 branch，不默认算依赖满足。

## 6. Branch freshness 与合并策略

### Migration

从目标实现仓库**最新 `main`**创建：

```text
mission/<MISSION_ID>-<slug>
```

Migration 阶段不合入 `main`。

### Verification / Integration

Verification Host 在开始维修和最终验证前必须重新读取最新 `main`：

- 若 mission branch 落后，**优先把最新 main merge 进 mission branch**，保留跨主机历史；默认不 force-push、不改写 Migration Host 历史。
- 先解决共享 manifest/registry/census 的并集与语义冲突，再运行 Mission-specific gate。
- 一个旧分支完成 merge 后，下一个待验分支必须**重新**基于新的 main 做同步；不得批量把多个旧分支同时按同一个旧 main 验完。

## 7. 真实消费门槛：v2

### 7.1 有等价消费面时

如果 Utopia 当前产品面已经存在与 donor 行为**语义等价**的消费 seam，Migration/Verification 必须真实走通该 seam；不得用纯 unit test 替代。

### 7.2 基础设施 / 管线模块没有等价消费面时

对于明确标记为非产品能力来源（例如 `capabilityProvider:false`）的 infrastructure / pipeline module：

- 若没有语义等价的现有 Utopia 产品消费面；
- 且接入现有 UI/服务会新增 capability、改变既有判定或跨 Building 偷接别的能力；

则**不得为了验收造新 UI / 新 capability**。此时允许：

> Verification Host 用真实、bounded、可复现的 integration chain 直接执行迁移后的模块，并记录输入、输出、failure/recovery、parity 与 evidence，作为“真实消费”门槛的满足方式。

### 7.3 关键执行能力不得借此豁免

如果 Mission 的核心产品价值本身就是**真实外部执行 seam**——例如 provider gateway、runner、device/backend execution——那么缺少真实 provider/runtime 不能用 7.2 的 bounded-chain 规则绕过。

这类 Mission 必须：

- 使用 donor 已支持的真实 provider/runtime 完成真实路径；或
- 由 Owner 授权 superseding Mission 把 donor 中 deferred 的 execution seam 一并迁入。

Mock pass 仍然禁止。

## 8. 非产品模块与 capability registry

City 级默认机制：

- 非产品能力模块可声明 `capabilityProvider:false`；
- capability enumeration 不应把这类 module 暴露成不可调用的产品 capability；
- building 可在必要时使用自己的 `kind` 覆盖 district 的默认 `kind`，由统一的 effective-kind 逻辑判断。

具体 Owner 裁决见 [`response.md`](./response.md)。

## 9. 独立 Verification

Verification Host 必须：

1. 先只看 donor、目标代码、diff、测试和运行状态，记录独立发现；
2. 再读 Migration Report 做 reconciliation；
3. 必要维修只发生在原 mission branch；
4. 不得通过删测试、跳过门禁、放宽目标语义换绿。

如果 donor 不在本机，不能把“donor 缺失导致 parity test skip”当作 parity 已通过；应明确记录缺失，并尽量重新取得冻结 donor 或把该门禁标为未验证。

## 10. 报告与 Utopia 狗粮

City 报告：

```text
mission-book/reports/MB-xxx/
├─ MIGRATION_REPORT.md
└─ VERIFICATION_REPORT.md
```

Utopia 过程数据继续遵守 [`PROCESS_DATA_POLICY.md`](./PROCESS_DATA_POLICY.md)：

- raw evidence → `.runtime/evidence/mission-book/...`
- bounded events → `data-records/evolution/inbox/mission-book/...`
- accepted episode → `data-records/evolution/episodes/mission-book/...`

Owner 裁决发生后，下一位实际触碰对应 mission branch 的施工者应追加一个 `OWNER_INTERVENTION` 事件，引用 `Digital-City/mission-book/response.md`。

## 11. Finalize / 双 CI / Merge

Verification 收口顺序：

```text
independent review
→ merge latest main into mission branch when needed
→ repair / real-use verification
→ implementation required CI GREEN
→ CI_RESULT PASS
→ VERIFICATION_COMPLETE PASS
→ pnpm mission:finalize
→ commit episode + inbox removal
→ FINAL BRANCH HEAD required CI GREEN
→ Verification Host merge main
→ City VERIFICATION_REPORT / Mission metadata
```

不得在 finalize 后跳过最终 branch HEAD CI。

## 12. 当前冻结项

- MB-010 Node Fabric：disabled，optional extraction。
- MB-011 Customs：disabled，等待 extraction gate。
- MB-012 Runtime Compliance：disabled，等待 extraction gate。

Owner 未显式启用前，不得因为前面 backlog 清空就自动启动这些 Mission。

## 13. 历史规则

旧版 migration-first rule 及旧模板已归档到 [`past-rules/`](./past-rules/)。

**现役 Mission 文件不再复制完整全局规则。** Mission-specific gates 仍然有效；全局流程统一引用本文件，避免未来规则更新后十二份文件互相漂移。
