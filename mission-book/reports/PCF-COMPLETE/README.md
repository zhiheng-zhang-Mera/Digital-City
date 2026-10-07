# PCF 系列完整补全（PCF-700..728）/ PCF series completion, on a dedicated cloud branch

```text
分支 / branch        pcf/PCF-series-complete-mech-20261007
起点 / base          pcf/full-flow-alien-pending-verification-20261007 @ 998440c（对侧整条流的候选）
本机角色 / role      Mech-DS（development + verification）
云端 / cloud         已推送（origin 上存在该分支）
授权边界 / bounds    不采购/不付费、不装系统服务、不改运行 profile、不启用远端执行、不伪造外部前提
```

## 1. 先量清楚：候选到底缺什么（不猜）

原作者候选的覆盖矩阵自称 `programme_complete: false`、`ready_for_physical_handoff: false`，29 本里
只有 PCF-700 是历史已验收、PCF-701 是修复候选，其余多为 `*_COMPONENT_CANDIDATE` / `PREREQUISITE_*`。
我另做了一次**机读普查**（`pcf-census.mjs`）：把 29 本工作书里**点名要求的接口**逐条与代码实际导出对照。

```text
结果：33 个点名接口中，候选**已有 14 个**，**缺 19 个**。
但抽查后必须区分"真缺"与"换了名字"：
  · 真缺（全树 grep 无任何实现）：
      PCF-702 placementProposal · PCF-703 openBoundedStream · PCF-707 toResearchEvent
      PCF-708 normalizeWorkloadEnvelope / ExecutionAttempt · PCF-709 ArtifactRef
      PCF-710 providerManifest · PCF-712 fenceEpoch · PCF-723 shadowDecision / safetyShield
  · 换了名字/在别处（census 的假阳性，已核对）：
      PCF-728 submitRemoteJob/inspectRemoteJob/cancelRemoteJob/collectRemoteResult →
      实际存在于 `services/personal-compute-fabric/engineering-tools.mjs`
      PCF-712 reconcile → `supervisor.mjs` 的 reconcileExecution；PCF-715 renderFabricPanel → `apps/web/pcf-panel.js`
      PCF-716 deployment/rollback → `deployment.mjs` 的 createDeploymentController
      PCF-724 adapter → 抽象概念，实际是 workload/capsule 组合
```

⇒ 补全工作的正确对象是**功能缺口**而非"缺文件"，且**不得重复实现已有能力**。

## 2. 本轮已完成（分支上两个增量）

```text
增量 1（7c4ece4）PCF-708 版本化 workload envelope 与 execution attempt —— 新模块 workload-envelope.mjs
  强制项：envelopeVersion 精确匹配（未知版本 typed 拒绝）、task/action/origin/parent/target/app 身份、
  executor 是**provider 合同**（providerRef/version/manifestRef，绝非命令行）、输入输出 schema、能力/输入引用/write scope、
  平台声明、四类 QoS、deadline 必须配**显式 miss policy**、独立 retry 安全能力、dataScope、**携带但不评估**的 consent、
  必须有已核实 handle 的特权请求；资源按种类声明且**单位必填**、与发布表冲突即拒绝；嵌套/数组/键长/载荷在读取前就有界，
  循环载荷被拒而不是无限遍历。
  两处**我自己的测试抓出来的缺陷**：① providerRef 曾接受任意 256 字符串 ⇒ `sh -c "rm -rf /"` 能装作 provider，
  已改为标识符校验；② 旧任务探测误把 `inputSchema/outputSchema`（legacy 也有）当作 envelope 字段 ⇒ 每个旧任务都被判成已扩展。
  测试 tests/pcf708-workload-envelope.test.mjs 9 项。

增量 2（0a9146b）PCF-709 工件引用契约与续传游标 —— 新模块 artifact-reference.mjs
  核心性质：**digest 相符是完整性，不是权限**。`verifyArtifactBytes(reference,bytes)` 刻意**不接收任何 caller 上下文**，
  因此不可能被误当作授权判定（测试直接断言它的形参个数）；`authorizeRead` 从不参考 digest。
  引用含 opaque id/digest/size/schema/owner/dataScope/副本声明/有效期/retention；**路径形状的 id 被拒**
  （store 自己通过授权适配器解析路径，引用里带路径等于让调用方指定"去哪里读"）；可用性由**已声明的副本事实**推出，
  绝不从一次失败读取去猜，且每个状态都带原因；从存储/异机读回的引用必须**重新校验**，因为解析不等于信任。
  四处**测试抓出的缺陷**：① 重新校验已归一化的引用时，其 `locationRef: null` 触发我自己的 `undefined`-only 检查
  —— 不只是崩溃，它**掩盖了真实拒绝原因**（被撤销的工件被报成"格式非法"）；② 拒绝原因优先级：撤销/过期先于 scope 判定；
  ③ 续传游标无条件要求 partial 标记，拒绝了没有进度可描述的**新游标**，现改为"一旦有进度就必须显式声明"；
  ④ 该标记的形参默认 `false`，使**调用方"未提供"与"显式 false"无法区分** —— 抹掉区别的默认值正是规则失效的方式。
  `canResume` 只在 digest 与引用契约版本**同时**匹配时续传，拒绝过期引用与"声称字节数超过工件"的游标，且游标不能后退。
  测试 tests/pcf709-artifact-reference.test.mjs 8 项。

当前合计：PCF-708 9 项 + PCF-709 8 项 + PCF-701 22 项 + PCF-726 0 项 → **39/39 通过**
（pcf708 + pcf709 + pcf701-telemetry + pcf726-capsule 四套件一起跑）。
```

## 3. 后续顺序（按依赖与可实现性，不按编号硬爬）

```text
下一步：
  PCF-710 provider 合同（providerManifest / describeExecutorBoundary 已在 725，需把 710 的 executor 能力声明补齐）
  PCF-712 监管与 fencing（fenceEpoch 显式化、幂等重放/丢失事件处理、crash 后核对）—— 本机可实现
  PCF-723 shadowDecision / safetyShield（影子决策与安全盾只在可行集内排序、不得改 trust/consent/strict target）
  PCF-703 openBoundedStream（bytes/items 上限、credit、端到端背压、取消、丢包/重连、partial 策略）—— 本机可实现
之后：PCF-702 placementProposal（成本区间 + 确定性排序 + 拒绝原因）、PCF-707 toResearchEvent（REX 适配与确定性回放）
外部硬前提（保持 typed NOT_RUN，绝不冒充）：PCF-717 许可模型运行时、PCF-722 独立存储/fencing 基座、
  PCF-718 实体 Linux worker（本机无发行版）、PCF-719 手机 worker 安装、PCF-727 真实 Codex/DeepSeek 会话闭环
```

## 4. 不声称的事

```text
· 不声称"29 本全部完成"：本轮只完成 2 本的功能缺口，其余仍在推进；任何被外部前提挡住的项目保持 NOT_RUN。
· 不把作者候选已有的 14 个接口重复实现，也不改写对侧 998440c 的既有记录。
· 不合并 main：该分支单独存在，等整系列补全后再按 REX/DGX/CHK 同样的异机验收口径交接。
```
