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
