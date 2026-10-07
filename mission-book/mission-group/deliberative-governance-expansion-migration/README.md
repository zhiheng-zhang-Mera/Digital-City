> Latest Owner ruling: **8/8 DEVELOPMENT COMPLETE; WHOLE-SERIES SECOND-HOST REVIEW PENDING**. Old per-workbook acceptance constraints are suspended for development. [Ruling](../../reports/DGX/OWNER_SERIES_RULING.md). No main merge.

> Owner activated development 2026-10-07; execution_enabled=true; Alien-GPT-DGX; NO MAIN MERGE. Historical parked activation text below superseded. Domain gates remain binding.

# DGX — Deliberative Governance Expansion & Migration / 审议治理扩建迁移

> **状态：OWNER ACTIVATED / DEVELOPMENT CANDIDATE 2026-10-07**
>
> 本系列仅记录已确认的架构扩建与软迁移方案。Owner 已于 2026-10-07 明确授权 execution_enabled=true；仅在 Alien-GPT-DGX 开发，禁止合并 main。逐本正式验收不再阻塞系列开发，正式 Review 由第二机统一进行。
>
> 本轮二次融合把“复杂请求认知拆分、隔离执行、结构化汇合、独立仲裁”吸收到 DGX，但**不改写当前 Engineering Formal Review 的异机硬门槛**。Review Independence v2 若未来要替换现行规则，必须通过独立迁移系列显式完成。
>
> **开发 baseline 已按 full SHA 固定。** 内部开发依赖使用单分支实际前序提交；正式 accepted dependency SHA 不以开发候选冒充。

## 目标

在不推倒现有城市结构、不搬迁已验收能力、不建立第二套 task truth 的前提下，增加一个跨域 **Deliberative Governance / Adjudication** 制度层：

```text
Owner request
→ semantic decomposition
→ Shared Fact Snapshot
→ Problem Graph / DAG
→ bounded Task Capsules
→ capability/history + independence assignment
→ isolated execution
→ structured Result / Evidence Envelopes
→ integration
→ conflict detection
→ defence / rebuttal
→ fresh-context independent adjudication
→ appeal / minority dissent when applicable
→ participant final review
→ release gate
→ Process Capsule to Owner
```

这里的 Problem Graph 是**审议计划/问题结构**，不是第二套 Mission Book、scheduler 或 runtime task authority。只有被现有 task/runtime contract 正式接纳的动作才能成为执行事实。

## 二次融合后的核心合同

### 1. Shared Fact Snapshot

并行参与者应尽可能从同一版本化事实快照起步：

- Owner request / accepted requirement；
- canonical task/capability/runtime facts；
- exact evidence refs；
- domain constraints；
- known unknowns / unavailable evidence。

Snapshot 只包含显式可审计信息，不包含任何参与者隐藏 chain-of-thought。

### 2. Problem Graph / Task Capsule

复杂请求允许拆成 DAG，而不是强制固定树：

- node = bounded question / verification / integration task；
- edge = dependency / evidence / contradiction / prerequisite；
- node 可在发现新事实后受控扩展；
- 每个 Task Capsule 声明 scope、inputs、required capability、independence floor、expected output、stop condition。

### 3. Isolated execution + structured exchange

并行 Agent 不通过共享隐藏推理来“同步脑子”。默认交换：

- structured result；
- explicit assumptions；
- evidence refs；
- confidence/uncertainty（可观测时）；
- unresolved questions；
- proposed next action。

这样保留独立性，也允许后续集成与审计。

### 4. Independence profile

DGX 只声明任务/角色需要的独立性，不自行降低任何领域已有门槛。候选维度包括：

- role / authorship independence；
- agent / session-context independence；
- model-family independence（需要时）；
- host / environment independence；
- hardware/toolchain independence；
- conflict-of-interest / recusal。

**当前 Engineering Formal Review 仍按 `CONSTRUCTION_RULES.md §3` 执行不同实体主机要求。** 同机 fresh critic 只能做诊断，不能因 DGX 存在而升级成正式 Review。

### 5. Fresh-context adjudication

对 material conflict 的治理仲裁优先采用两阶段：

```text
Phase A: independent reconstruction
  requirement + accepted facts + evidence
  → provisional findings

Phase B: reconciliation
  open defence / rebuttal / alternative interpretation
  → final adjudication receipt
```

这是治理仲裁的独立性协议，不自动替代 Engineering/Research/Health 各自 Formal Review。

## 架构边界

### 新治理层拥有

- Constitution / invariant governance rules；
- semantic decomposition contract；
- Problem Graph / Task Capsule schema；
- independence / recusal / conflict-of-interest；
- capability/history-based participant assignment policy；
- structured result/evidence exchange；
- conflict declaration + structured defence；
- independent adjudication protocol；
- appeal / dissent retention；
- joint final acceptance / release semantics；
- domain-profile contract；
- Owner-visible bounded Process Capsule contract。

### 旧楼继续拥有专业正确性

- **00 Foundation / Capability Fabric**：task/event/evidence primitives、Agent capability/history facts；不复制 reputation truth。
- **02 Engineering**：Foreman、CI、fresh verifier、exact SHA、工程 Formal Review 与当前异机独立门槛。
- **05 Health**：medical/pharmacology evidence rules、PK/PD/DDI/safety 等专业 profile。
- **06 Research**：method/evidence/claim/reproducibility review 与 domain evidence adjudication。
- **GAI/JEV**：triage/observation/routing；不自动成为最高仲裁者。
- **City Work Monitor / Control Centre**：治理过程的用户投影；不成为第二套 task truth。

## 用户透明度原则

默认返回给 Owner 的 Process Capsule 至少回答：

1. 请求如何被拆成问题图；
2. 哪些 Agent/角色参与；
3. 为什么这样分配以及采用了什么 independence floor；
4. 各节点产出了什么显式结果/证据；
5. 是否发生 material conflict；
6. 冲突如何仲裁；
7. 做了哪些验证；
8. 还有哪些 residual uncertainty；
9. Final Release Gate 是否通过。

不得要求 Owner 阅读 routine heartbeat、重复日志、每个 token、未采用候选草稿或隐藏 chain-of-thought。深层证据通过 Monitor progressive disclosure 按需展开。

## 迁移原则

这是 **soft reclassification first**：

```text
KEEP IN PLACE
→ register canonical owner
→ expose stable contracts
→ add governance metadata / adapters
→ migrate implementation only on demonstrated ownership duplication/conflict
```

禁止为了架构整洁搬动已经通过 exact-head / opposite-host review 的实现。

## 与其他停放设计的边界

- [Review Independence v2](../review-independence-v2/README.md)：研究未来 Review Pool 的多维独立性与安全迁移；当前不生效。
- [Utopia Runtime Architecture](../utopia-runtime-architecture/README.md)：定义 Core / Platform Service / App / Connector 的产品运行时分类；不由 DGX 代替。
- [Suspend](../suspend/README.md)：保存当前不应进入 canonical 设计或施工队列、但必须保留的冲突性方案与假设。

## 工作系列

| ID | 工作 | 状态 |
|---|---|---|
| DGX-001 | Governance Ownership Audit & Capability Map | DEVELOPMENT_COMPLETE / REVIEW_NOT_RUN |
| DGX-002 | Constitution + Decomposition / Deliberation Contracts | WAITING_DEPENDENCIES |
| DGX-003 | Capability / History / Independence Assignment Policy | DEVELOPMENT_COMPLETE / REVIEW_NOT_RUN |
| DGX-004 | Domain Profile Adapters & Soft Migration | DEVELOPMENT_COMPLETE / REVIEW_NOT_RUN |
| DGX-005 | Conflict / Defence / Fresh-context Independent Adjudication | DEVELOPMENT_COMPLETE / REVIEW_NOT_RUN |
| DGX-006 | Appeal / Dissent / Joint Final Review & Release Gate | DEVELOPMENT_COMPLETE / REVIEW_NOT_RUN |
| DGX-007 | Process Capsule + Monitor Governance Projection | DEVELOPMENT_COMPLETE / REVIEW_NOT_RUN |
| DGX-990 | Cross-domain Acceptance & Freeze | WAITING_DEPENDENCIES |

## 激活条件

本系列**不会因目录存在自动启动**。至少需要：

- Owner 显式激活 DGX；
- 对当前在途 programme 做 reality reconciliation；
- 为首个可执行 workbook 重新解析当时 baseline full SHA；
- 所有依赖 SHA 从正式 accepted exact head 获取；
- 明确当前 Engineering Formal Review floor，不得被 DGX 隐式降级；
- 不得为了 DGX 打开已经冻结的旧任务 acceptance boundary。

默认优先等当前 Monitor programme 完成既定 freeze，再决定 DGX 的具体锚点与施工顺序；Owner 可另行裁决。

语言配对 / Language pair: [English reading](en/README.md)

## 2026-10-07 迁出面板 / Outgoing requirement history

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-03 | DGX-002 — 有界执行上下文与结构化结果/证据封装的通用底层 | PCF-726 | Constitution、语义拆题、ProblemGraph、领域证据规则、辩护和仲裁 |

迁出仅限表中子项，父项目保留其余目标；PCF未启用。 / Only named subscopes move; parent goals remain and PCF is not activated.

[PCF incoming history](../personal-compute-fabric/MIGRATION_HISTORY.md)

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **18**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 9 | [打开 / Open](en/README.md) |

### 本目录说明 / Local documents

- [DGX-001-governance-ownership-audit-and-capability-map.md](DGX-001-governance-ownership-audit-and-capability-map.md)
- [DGX-002-constitution-and-core-deliberation-contracts.md](DGX-002-constitution-and-core-deliberation-contracts.md)
- [DGX-003-capability-history-assignment-policy.md](DGX-003-capability-history-assignment-policy.md)
- [DGX-004-domain-profile-adapters-and-soft-migration.md](DGX-004-domain-profile-adapters-and-soft-migration.md)
- [DGX-005-conflict-defence-and-independent-adjudication.md](DGX-005-conflict-defence-and-independent-adjudication.md)
- [DGX-006-appeal-dissent-joint-final-review-release-gate.md](DGX-006-appeal-dissent-joint-final-review-release-gate.md)
- [DGX-007-process-capsule-and-monitor-governance-projection.md](DGX-007-process-capsule-and-monitor-governance-projection.md)
- [DGX-990-cross-domain-acceptance-and-freeze.md](DGX-990-cross-domain-acceptance-and-freeze.md)

<!-- DOCUMENT_NAVIGATION:END -->

## Current branch evidence / 当前分支证据

[Series report](../../reports/DGX/SERIES_REPORT.md). Owner activation supersedes historical parked activation conditions; domain gates and acceptance boundaries remain binding.

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 0/8 · 开发 / Development 8/8 · 复检 / Review 0/8 · `ACTIVE`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [DGX-001](DGX-001-governance-ownership-audit-and-capability-map.md) | DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW | YES | NO | YES |
| [DGX-002](DGX-002-constitution-and-core-deliberation-contracts.md) | DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW | YES | NO | YES |
| [DGX-003](DGX-003-capability-history-assignment-policy.md) | DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW | YES | NO | YES |
| [DGX-004](DGX-004-domain-profile-adapters-and-soft-migration.md) | DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW | YES | NO | YES |
| [DGX-005](DGX-005-conflict-defence-and-independent-adjudication.md) | DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW | YES | NO | YES |
| [DGX-006](DGX-006-appeal-dissent-joint-final-review-release-gate.md) | DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW | YES | NO | YES |
| [DGX-007](DGX-007-process-capsule-and-monitor-governance-projection.md) | DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW | YES | NO | YES |
| [DGX-990](DGX-990-cross-domain-acceptance-and-freeze.md) | DEVELOPMENT_COMPLETE_WAITING_SERIES_REVIEW | YES | NO | YES |

<!-- SERIES_DASHBOARD:END -->
