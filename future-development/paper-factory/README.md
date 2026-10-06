# Paper Factory / 证据优先的论文工厂

**Recorded / 记录日期:** 2026-10-05  
**Status / 状态:** `DESIGN_RECORDED_NOT_ACTIVATED`  
**Scope / 范围:** future-development design; no runtime implementation, active mission, experiment, payment, public release or submission is authorized. / 仅未来开发设计；不授权实现、任务领取、实验、付费、公开发布或投稿。

## Purpose / 目标

先正常开发，持续保存有界、可追溯的事实；发生问题时保留前后证据；之后从历史中提出候选问题。Owner 选题后，按证据能支持的方法形成研究，再适配具体期刊、会议轨道或预印本平台。**不是先选期刊，再把日志编成符合期刊口味的故事。**

Develop normally; preserve bounded evidence and failures; mine retrospective research candidates. After Owner selection, admit an evidence-bounded study and adapt it to a specific publication target. Venue fit changes presentation and required deliverables, never historical facts.

```text
Project facts -> coverage-aware evidence index -> research episodes
 -> signals + alternative explanations + literature search
 -> Owner-selected question -> evidence / analysis freeze
 -> canonical claim-evidence graph + manuscript IR
 -> versioned venue / article-type / stage adapter
 -> scientific review + policy preflight + Owner approval
 -> submission package [external actions disabled until separately authorized]
```

## What is strengthened / 本版强化

| Design boundary / 边界 | Required behavior / 要求 |
|---|---|
| Scientific truth / 科学事实 | One canonical evidence and claim graph; no incompatible numbers across variants. / 同一事实核心，多种投稿视图。 |
| Venue adaptation / 专项适配 | Research shape, method, scope, format, identity, artifacts, AI permissions, cost and lifecycle. / 不止换模板。 |
| Evidence quality / 证据质量 | Include successful, failed, blocked, cancelled and unobserved work; unknown denominator stays unknown. / 防止只收异常、只读成功合并。 |
| Policy provenance / 规则来源 | Each rule has scope, source, observation date, status and conflict handling. / 未核实不等于不要求。 |
| Human authority / 人工权限 | Explicit decisions for question, added experiments, venue budget, authorship, release/license and submission. / 不代签声明。 |
| Convergence / 收敛 | Bound review cycles; narrow claims or stop instead of endless engineering. / 不为凑论文返工产品。 |

## Navigation / 阅读顺序

1. [Architecture / 架构与现有系统边界](01-ARCHITECTURE.md)
2. [Evidence contract / 证据收集与持久化](02-EVIDENCE-CONTRACT.md)
3. [Research method / 回溯研究与统计边界](03-RESEARCH-METHOD.md)
4. [Workflow / 状态机与授权](04-WORKFLOW-AND-AUTHORITY.md)
5. [Venue adapter / 投稿专项适配协议](05-VENUE-ADAPTER.md)
6. [Portfolio / 论文家族、转投与扩展](06-PORTFOLIO-AND-RETARGETING.md)
7. [Review, security, UI / 审查、安全与用户入口](07-SECURITY-REVIEW-AND-UI.md)
8. [Acceptance / 未来启用与验收条件](08-ACCEPTANCE-AND-ACTIVATION.md)

Target packs / 目标包: [Journals](venues/JOURNALS.md), [Conferences](venues/CONFERENCES.md), [Preprints](venues/PREPRINTS.md), [14-target registry](VENUE-REGISTRY.json).

Contracts / 契约: [venue profile schema](contracts/venue-profile.schema.json), [candidate and freeze contract](contracts/candidate-contract.md). Illustrative profiles / 设计种子: [IEEE Access](examples/ieee-access-initial.json), [ICSE NIER](examples/icse-2027-nier-initial.json). These are incomplete, non-executable policy seeds, not submission clearance. / 这些文件不是可直接放行投稿的完整配置。

Source verification / 来源核验: [register](policies/SOURCES.md). Some official guides were inaccessible; SPE has conflicting passages. Those gaps remain explicit, not filled from old third-party templates. / 无法访问或冲突的规则保留待核实。

## Ownership and upstream compatibility / 所有权与兼容

Digital-City stores this design and compact indices. Raw evidence remains in its source project or a controlled artifact store. Actual manuscripts, analyses and publication variants remain in **Essay-Book**, or another explicitly selected independent paper repository. Paper Factory must not create a second scheduler, evidence authority or publication policy.

City 仅存设计和紧凑索引；原始证据留原项目或受控存储；正文、分析与投稿版本在 Essay-Book。优先复用 REX 的实验与 artifact 导出能力。现有 mission 的事件枚举、复检要求和状态统计不因本设计变化。

Authoritative entry points / 上游入口:
- [Process data policy](../../mission-book/PROCESS_DATA_POLICY.md)
- [Research & Evaluation Fabric](../../mission-book/research-strengthening/README.md)
- [Research signal watchlist](../../mission-book/RESEARCH_SIGNAL_WATCHLIST.yaml)
- [Essay-Book publication routing](https://github.com/zhiheng-zhang-Mera/Essay-Book/blob/main/PUBLICATION-PIPELINE.md)

Hns retains its independently governed NIER route; Boss is not assigned a new NIER deadline; Utopia remains project/demo/artifact first. / 不为 Boss/Utopia 自动新增论文期限或拆文配额。

**Completion here means a recorded design package, not an implemented factory or a submission-ready manuscript. / 此处完成仅指设计已记录。**

## 中文完整说明 / Complete Chinese explanation

### 目标与流程

记录日期 2026-10-05，状态 `DESIGN_RECORDED_NOT_ACTIVATED`。仅记录未来设计，未授权运行实现、活跃任务、实验、付款、公开发布或投稿。正常开发时保存有界事实和失败，从历史提出候选问题；Owner 选择后形成证据约束研究，再适配具体目标。投稿适配改变呈现和交付物，不改变历史事实。

流程为项目事实 → 考虑覆盖的证据索引 → 研究事件 → 信号/替代解释/文献检索 → Owner 选题 → 证据分析冻结 → 统一论点证据图和论文 IR → 版本化目标/文章类型/阶段适配 → 科学审查/政策预检/Owner 批准 → 投稿包。外部动作在另行授权前禁用。

### 设计强化与阅读入口

科学事实使用统一证据论点图，各版本不得出现不一致数字；适配涵盖研究形态、方法、范围、格式、身份、artifact、AI 权限、成本和生命周期。证据包括成功、失败、阻塞、取消、未观察工作，未知分母保持未知。每项政策有范围、来源、观察日期、状态和冲突处理。选题、新实验、预算、作者、发布许可和投稿均有明确人工决定。评审循环有界，必要时缩窄或停止，不为论文无限返工工程。

上方阅读顺序的八篇分别详述架构、证据、方法、授权、目标适配、论文家族转投、安全审查界面、启用验收。目标包包括期刊、会议、预印本及14目标登记；契约包括 venue profile schema 与候选/冻结契约。IEEE Access/ICSE NIER 示例只是未完整、不可执行的政策种子，不构成放行。来源登记明确保留无法访问的指南和 SPE 冲突，不用第三方旧模板补齐。

### 所有权与兼容

City 保存设计和紧凑索引，原始证据在来源项目或受控 artifact 存储；正文、分析、投稿版本留在 Essay-Book 或明确选择的独立论文仓库。不得建立第二调度器、证据权威或出版政策。复用实际可用 REX 实验和 artifact 导出，现有 mission 事件枚举、复检及统计不受设计改变。

上游权威入口为 process data policy、Research & Evaluation Fabric、研究信号 watchlist 和 Essay-Book publication routing。Hns 保留独立治理的 NIER 路线，Boss 没有新增 NIER 截止日，Utopia 优先项目/演示/artifact，不自动新增拆文配额。此处完成仅指设计包记录，不是工厂实现或可投稿论文。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

目录数量实测于2026-10-06；状态是既有文档记录，不是新运行验收。 / Directory counts measured on 2026-10-06; status reflects existing documentation rather than new runtime acceptance.

| 项目 / Item | 值 / Value |
|---|---|
| 直接子目录 / Direct subdirectories | 4 |
| 递归Markdown文档 / Recursive Markdown documents | 17 |
| 状态 / Status | DESIGN_RECORDED_NOT_ACTIVATED; legacy entries NOT_STARTED_BY_DESIGN / 设计未启用、遗留缺口未开工 |
| 语言 / Language | 同文中英或明确互链语言对 / Same-file bilingual explanations or linked language pairs |

### 文档与资源导航 / Documents and resources

| 入口 / Entry | 用途 / Purpose |
|---|---|
| [01-ARCHITECTURE.md](./01-ARCHITECTURE.md) | 说明文档 / Explanatory document |
| [02-EVIDENCE-CONTRACT.md](./02-EVIDENCE-CONTRACT.md) | 说明文档 / Explanatory document |
| [03-RESEARCH-METHOD.md](./03-RESEARCH-METHOD.md) | 说明文档 / Explanatory document |
| [04-WORKFLOW-AND-AUTHORITY.md](./04-WORKFLOW-AND-AUTHORITY.md) | 说明文档 / Explanatory document |
| [05-VENUE-ADAPTER.md](./05-VENUE-ADAPTER.md) | 说明文档 / Explanatory document |
| [06-PORTFOLIO-AND-RETARGETING.md](./06-PORTFOLIO-AND-RETARGETING.md) | 说明文档 / Explanatory document |
| [07-SECURITY-REVIEW-AND-UI.md](./07-SECURITY-REVIEW-AND-UI.md) | 说明文档 / Explanatory document |
| [08-ACCEPTANCE-AND-ACTIVATION.md](./08-ACCEPTANCE-AND-ACTIVATION.md) | 说明文档 / Explanatory document |
| [MANIFEST.json](./MANIFEST.json) | 禁用设计契约/示例/登记，不授权执行 / Disabled design contract/example/register; no execution authorization |
| [README.md](./README.md) | 说明文档 / Explanatory document |
| [VENUE-REGISTRY.json](./VENUE-REGISTRY.json) | 禁用设计契约/示例/登记，不授权执行 / Disabled design contract/example/register; no execution authorization |

### 子目录 / Subdirectories

| 入口 / Entry | 递归Markdown数量 / Recursive Markdown count |
|---|---|
| [contracts](./contracts/README.md) | 2 |
| [examples](./examples/) | 0 |
| [policies](./policies/README.md) | 2 |
| [venues](./venues/README.md) | 4 |

[返回未来储备 / Back to future inventory](../README.md)
