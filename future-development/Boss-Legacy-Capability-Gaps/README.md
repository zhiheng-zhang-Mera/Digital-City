# Boss 遗留能力缺口暂存 / Boss Legacy Capability Gaps

> STATUS: **RECORDED_FOR_FUTURE_MAJOR_DEVELOPMENT**
>
> REVIEW_DATE: **2026-10-02**
>
> SOURCE_PROJECT: `zhiheng-zhang-Mera/Codex-Boss`
>
> TARGET_DECISION: **DEFERRED — NO CITY BUILDING / DISTRICT PLACEMENT DECISION IN THIS RECORD**

## 目的 / Purpose

本目录只保存一次 Boss → Digital-City / Utopia 能力清点中发现的**尚未完整转交、仅部分转交、或值得未来重新收割（harvest）的 Boss 能力**。

本记录不是施工书，不代表现在要迁移代码，也不代表这些能力已经决定归属某栋楼、某个 District 或某个 Utopia 模块。

后续只有进入新的**大型开发阶段 / major development phase**时，才重新逐项判断：

1. 该能力今天是否仍然需要；
2. 是否已经被 Utopia/City 的新机制自然替代；
3. 是否应该重新从 Boss 提取设计或代码；
4. 应归属哪里；
5. 是否需要先在 Utopia 孵化，再进入 City；
6. 是否值得施工，还是继续保留为历史参考。

## 当前冻结规则 / Hold Rules

在未来明确启动专项之前：

- **不创建对应 City Building。**
- **不决定 District 归属。**
- **不从 Boss 直接搬代码。**
- **不为这些缺口创建当前施工任务。**
- **不阻塞 Utopia 当前 UI、调度、Remote、Assistant、General AI Gateway 等主线。**
- **不因为 Boss 中存在旧实现，就把旧架构重新强加给 Utopia。**
- 后续评审必须优先判断“新架构是否已经提供更好的替代方案”，再考虑 donor harvest。

---

# 缺失 / 未完整转交能力清单

## BLG-001 — Self Cognition / 自我认知

**Boss 原能力：**

- 从 capability manifests、module ownership、composition root、authority rules 等实际结构构建 Self Model；
- 描述自身组件、能力、依赖、dependents、state ownership、authority；
- 计算 dependency path / blast radius；
- 检测 self-model drift；
- 区分 UNKNOWN / NOT_MEASURED / UNAVAILABLE，避免“查不到 = 不存在”。

**当前判断：** `MISSING_EQUIVALENT`

Utopia 已有 Capability Fabric、Root Authority、Node Fabric 等组成部分，但尚未看到一个把当前系统重新组合成“Utopia 对自身结构的可查询模型”的等价能力。

**Boss 参考：**

- `docs/self-cognition.md`
- `src/shared/self-cognition/**`
- `electron/self-cognition/**`

---

## BLG-002 — Self Diagnosis / 自我诊断

**Boss 原能力：**

- 从 Self Model + runtime observations 形成诊断；
- 区分 ROOT_CAUSE / CONTRIBUTING_FACTOR / DOWNSTREAM_SYMPTOM；
- 维护多个假设，而不是单点武断结论；
- 生成 missing evidence / diagnostic plan；
- 生成不可直接执行的 treatment proposal；
- 保持“诊断权”和“执行修复权”分离。

**当前判断：** `MISSING_EQUIVALENT`

Host Health、Restart Recovery、Public Security 等现有机制均不能等价替代系统级自我诊断。

**Boss 参考：**

- `docs/self-diagnosis.md`
- `src/shared/self-diagnosis/**`
- `electron/self-diagnosis/**`

---

## BLG-003 — Self Case Record / 自身病例与故障经验记录

**Boss 原能力：**

- append-only case timeline；
- 保存症状、观察、历史假设、假设修订、处理、验证与最终根因；
- 不允许后见之明覆盖原始判断；
- recurrence link；
- prior evidence；
- lesson candidate；
- false-high-confidence 等诊断质量指标。

**当前判断：** `MISSING_EQUIVALENT`

Utopia 的 `data-records/evolution/episodes` 是施工/任务经验记录，不能完全替代系统自己的故障病例库。

**Boss 参考：**

- `docs/self-case-record.md`
- `src/shared/self-case-record/**`
- `electron/self-case-record/**`

---

## BLG-004 — Runtime Intelligence Plane / 运行时智能平面

**Boss 原能力：**

- OBSERVE → MEASURE → MODEL → RECOMMEND → SHADOW EVALUATE；
- Model Capability Ledger；
- Skill Loadout Intelligence；
- Node Capability Profiler；
- Scheduling Advisor；
- Continuation Evaluator；
- Context / Knowledge lifecycle；
- replay / prospective / calibration；
- 失败域归因、调度建议与 shadow counterfactual。

**当前判断：** `PARTIAL_HARVEST_ONLY`

Utopia 已有 Node/Fleet、telemetry、routing 等能力，但 Boss 的完整 runtime-intelligence plane 没有被等价重建。

**特别保留的未来问题：**

- 什么时候应该继续；
- 什么时候应该停止；
- 什么时候应该切模型；
- 什么时候应该拆任务；
- 什么时候需要 reviewer；
- Skill 是否应该 HOT/WARM/COLD/RARE/REDUNDANT；
- 新模型如何 warm start；
- runtime recommendation 如何只 shadow、不直接夺权。

**Boss 参考：**

- `docs/runtime-intelligence-plane.md`
- `src/shared/runtime-intelligence/**`
- `electron/runtime-intelligence/**`

---

## BLG-005 — Adaptive Provider Intelligence / 自适应 Provider 学习闭环

**Boss 原完整链条：**

```text
Episode
→ Outcome Evaluation
→ Task Fingerprint
→ Concept Mining
→ Provider / Model Profile
→ Behaviour Epoch
→ Change-Point Detection
→ Adaptive Scoring
→ Routing Feedback
→ Policy Candidate
→ Historical Replay
→ Shadow Evaluation
→ Controlled Trial
→ Promotion
→ Rollback
```

**当前判断：** `PARTIAL`

Utopia 已有：

- evolution inbox / verified episodes；
- adaptive routing expected-utility scorer；
- provider/fleet routing 的部分新实现。

但尚未看到 Boss 等价的：

- learned provider profile store；
- concept miner / registry；
- behaviour epoch；
- change-point detector；
- routing feedback ledger；
- adaptive policy candidate；
- replay → shadow → controlled trial → promotion/rollback 闭环。

**Boss 参考：**

- `electron/learning/**`
- `electron/learning/learning-service.ts`

---

## BLG-006 — Self-Evolution Pipeline / 自我进化候选与安全晋升

**Boss 原能力：**

- self-evolution host；
- sandbox capability；
- candidate changes；
- qualification / promotion boundary；
- replay / shadow / controlled promotion；
- rollback；
- Root Trust / Owner authority 边界。

**当前判断：** `MISSING_FULL_PIPELINE`

Utopia 当前 Evolution Feed 明确仍是经验采集基础：

```text
experience / episode != authority
```

未来需要单独判断是否建立：

```text
experience
→ pattern
→ improvement candidate
→ sandbox
→ replay
→ shadow
→ independent verification
→ promotion
→ rollback
```

**Boss 参考：**

- `electron/self-evolution/**`
- `electron/promotion-gate/**`
- learning evolution modules

---

## BLG-007 — Generic State Core / 通用持久状态内核

**Boss 原能力：**

- state database；
- authoritative event journal；
- transactions；
- event consumers / cursors；
- schema / namespace migration；
- recovery；
- quarantine；
- shadow compare；
- state ownership migration bookkeeping。

**当前判断：** `MISSING_GENERIC_EQUIVALENT`

Utopia 当前已有 Root Authority、Audit Ledger、Task Lifecycle、Fleet Routing 等上层能力，但尚未看到 Boss 同等级别的通用 transactional durable state substrate。

未来多设备、多 assistant、多 provider、offline/reconnect/failover 场景扩大后再评估是否需要回收。

**Boss 参考：**

- `electron/state-core/**`

---

## BLG-008 — Personal Workspace + Artifact Backbone / 个人工作区与任务工件骨干

**Boss 原能力：**

- workspace registry / selection；
- task workspace；
- durable roots；
- artifact backbone；
- external session ledger；
- archive / restore semantics；
- workspace-scoped ownership。

**当前判断：** `PARTIAL`

Utopia 已有 assistant handoff、engineering context、job result artifacts、knowledge/document mechanisms，但尚未形成完整的用户级：

```text
current workspace
+ recent files/text/context
+ task-associated artifacts
+ external sessions
+ continuation
```

未来重新评审。

**Boss 参考：**

- `electron/workspace/**`
- workspace-related bootstrap/shared modules

---

## BLG-009 — Generic Attachment Store / 通用附件对象层

**Boss 原能力：**

- `attachment.store@1`
- 任务/对话可携带的 durable attachment objects。

**当前判断：** `MISSING_EQUIVALENT`

Utopia 的 document intake 解决“把文档解析为知识”，但不能等价替代：

- 图片；
- ZIP；
- PDF；
- 代码包；
- 任意任务附件；
- assistant / General AI / Engineering / Research 之间共享的 attachment reference。

**Boss 参考：**

- `config/capabilities/attachments.yaml`
- Boss attachment IPC/store implementation

---

## BLG-010 — Generic Plugin Runtime / 通用插件与受控扩展运行时

**Boss 原能力：**

- plugin contract；
- plugin host；
- plugin runner；
- capability broker；
- permission contract；
- credential reference；
- execution authorization；
- sandbox boundary。

**当前判断：** `MISSING_GENERIC_RUNTIME`

Utopia 已有 Capability Fabric、Engineering Skill Intake 等，但这更偏“已知/已接入能力的注册与调用”。

未来如果建设 Skill Store / Plugin Store / 网络自动抓取扩展，需要重新考虑：

```text
external extension
→ manifest
→ admission
→ permission
→ credential boundary
→ sandbox
→ capability registration
```

**Boss 参考：**

- `electron/capability/**`
- `electron/self-evolution/sandbox/**`

---

## BLG-011 — Generic Credential / Secret Vault / 通用凭据保险库

**Boss 原能力：**

- secret vault store；
- credential reference；
- GitHub credential boundary；
- 不把实际 credential payload 泄露给无权限 capability。

**当前判断：** `PARTIAL / NO_CITYWIDE_EQUIVALENT_CONFIRMED`

Utopia 当前存在局部 auth/profile/session 机制，但尚未确认存在统一 City-wide credential vault。

未来在 General AI、Engineering、remote services、plugin runtime 进一步扩张时重新评审。

**Boss 参考：**

- `electron/security/secret-vault-store.ts`
- `electron/capability/credential-reference.ts`
- `electron/credential-boundary/**`

---

## BLG-012 — Full Research Conductor / 完整自动研究执行器

**Boss 原能力：**

除了已经迁入/重建的 protocol、review、statistics、evidence/provenance、manuscript 等研究机制，还包含：

- literature retriever；
- source store；
- live research executor；
- research conductor；
- research supervisor；
- research runtime；
- environment manager；
- run recorder；
- LaTeX compiler；
- 更完整的 end-to-end research orchestration。

**当前判断：** `PARTIAL`

当前 Utopia/City 已有大量研究方法组件，但尚未看到 Boss 的完整“自动研究机器人”闭环等价实现。

未来如重新启动自动论文流水线，应先重新设计，不默认照搬 Boss。

**Boss 参考：**

- `electron/research/**`
- `docs/9-6-research-*`

---

## BLG-013 — Autonomous Environment Explorer / 自主环境探索与高层 World Model

**Boss / 旧设计相关能力：**

- world model；
- repo/world inspection；
- 未知环境探索；
- 高层 planning over environment；
- Computer Use 之上的“自己学会陌生软件/界面”的机制。

**当前判断：** `MISSING_HIGH_LEVEL_EQUIVALENT`

Utopia 已经拥有较完整的 Computer Use 执行层和 world verification，但仍不等于：

```text
unknown environment
→ observe
→ hypothesize
→ explore
→ build world model
→ plan
→ act
→ learn
```

未来真人式产品验收、自主探索、陌生软件操作时再专项设计。

---

## BLG-014 — 10x Remaining Distributed Governance / 10x 剩余分布式治理语义

Boss `electron/tenx/**` 中很多能力已经被新架构吸收，例如 Fleet / Node / Remote / Provider 等，因此**禁止整包回迁**。

仍值得未来逐项检查的语义包括：

- task lease registry；
- generic artifact ledger；
- cross-node knowledge sync；
- knowledge conflict handling 的完整语义；
- login health；
- provider matrix 的历史学习部分；
- platform-level observability；
- platform audit；
- runtime budget；
- resource controller；
- human guidance gate。

**当前判断：** `PARTIALLY_SUPERSEDED / REQUIRES_FUTURE_DIFF`

未来必须按“旧能力 vs 当时 Utopia 实际新实现”逐项 diff；如果新架构已经覆盖，则直接标记 superseded，不回迁。

**Boss 参考：**

- `electron/tenx/**`
- `electron/commander/context-manager.ts`
- `electron/commander/human-guidance-gate.ts`
- `electron/commander/resource-controller.ts`
- `electron/commander/budget-manager.ts`

---

# 明确不属于本清单的能力

以下 Boss 大能力已经存在明确的新承接者，因此本次不列为“缺失项目”：

- Root Authority / Trust；
- Audit Ledger；
- Task Lifecycle；
- Fleet Routing 基础；
- Node Fabric；
- Capability Fabric；
- Engineering Foreman；
- Worker Gateway；
- Host Health；
- Restart Recovery；
- Knowledge Core；
- Document Intake / Readers；
- Computer Use 基础执行层；
- Remote Fabric；
- General AI Gateway；
- Assistant / Handoff；
- Theme Engine；
- Research 的 Evidence / Protocol / Review / Statistics / Provenance / Manuscript 核心。

后续如果这些实现发生回退，可以另开 capability regression review；不要把它们与本目录的 legacy gaps 混在一起。

---

# 未来重新启动时的评审顺序建议

这只是未来评审顺序，不是当前施工优先级：

### Group A — 自省与自进化基础

- BLG-001 Self Cognition
- BLG-002 Self Diagnosis
- BLG-003 Self Case Record
- BLG-004 Runtime Intelligence
- BLG-005 Adaptive Provider Intelligence
- BLG-006 Self-Evolution Pipeline

### Group B — 通用平台基础设施

- BLG-007 State Core
- BLG-008 Personal Workspace / Artifact Backbone
- BLG-009 Attachment Store
- BLG-010 Plugin Runtime
- BLG-011 Credential Vault

### Group C — 高层能力增强

- BLG-012 Full Research Conductor
- BLG-013 Autonomous Environment Explorer
- BLG-014 10x Remaining Distributed Governance

---

# Future Review Gate

进入下一轮大开发阶段时，不允许直接按本清单开工。

必须先执行一次：

```text
BOSS_LEGACY_GAP_REVIEW
```

至少回答：

1. 当前 Utopia 是否已经自然补上该缺口？
2. Boss 旧实现是否仍然代表正确方向？
3. 哪些只是设计可复用，哪些代码值得 donor harvest？
4. 是否与当前 City/Utopia 架构冲突？
5. 是否需要独立孵化？
6. 是否需要真实使用数据才能证明值得实现？
7. 是否会形成新的共享底层，还是应保持局部能力？

默认结果允许是：

```text
SUPERSEDED
NO_EXTRACTION
KEEP_AS_REFERENCE
```

而不是强制迁移。

---

**当前结论：**

```text
BOSS_LEGACY_CAPABILITY_GAPS = RECORDED
PLACEMENT_DECISION          = DEFERRED
IMPLEMENTATION              = NOT_STARTED_BY_DESIGN
CURRENT_UTOPIA_WORK         = UNBLOCKED
```
