# 研究优先级与数据采集策略 — 2026-10-05

> 状态：**ACTIVE RESEARCH STRATEGY / LITERATURE-SNAPSHOT-BOUND**
>
> 目标：反向审计 City 当前论文素材方向，避免把成熟工程常识当 novelty，也避免在已经高度拥挤的方向上过度采集。  
> 本策略根据截至 2026-10-05 的公开研究重新分配采集优先级；未来文献变化时允许升级/降级。

## 1. 四级研究稀缺度

### G1 — 成熟/已研究透

定义：经典软件工程实践或已经高度成熟的研究问题。

处理：

- 不主动为论文增加 instrumentation；
- 仅当它真实导致 defect / rework / Agent failure 时保存 episode；
- 论文中只能作为背景、failure cause、control 或 engineering prerequisite；
- 禁止包装成主要 novelty。

当前包括：

- branch/tag mutable，因此关键版本应 pin exact SHA；
- vertical slice / walking skeleton 本身；
- 普通 requirements → code traceability；
- 普通版本控制、branch-and-merge、CI 基础实践。

### G2 — 热门/风口浪尖且拥挤

定义：2026 年已有多组论文/benchmark/工具快速跟进，问题重要但独立做容易撞车。

处理：

- 正常采集，不额外扭曲施工；
- 优先保留能与 City 独有 G3/G4 问题交叉的数据；
- 不把单独的 threshold / generic memory / generic false-success 作为主论文押注。

当前包括：

- context compaction timing；
- compaction content / memory compression；
- generic execution-state memory；
- generic false-success / completion transparency；
- generic evolving requirements / interactive coding；
- generic asynchronous multi-agent coordination；
- generic cross-model review。

代表性 2026 工作包括 Ledger、MAGE/FlowState、AutoCompact、SWE-INTERACT、CAID、AsynCodeBench、Failure-Transparent Agents、Cross-Model LLM Code Review。

### G3 — 现象明确，但直接系统研究仍稀疏

定义：已有论文或公开系统触及邻近问题，但研究样本少、问题定义仍未稳定，或 City 的具体组合明显超出当前常见 setting。

处理：

- **重点采集**；
- 一旦发生，尽量保存完整 defect/recovery chain；
- 记录 exact identity、timeline、Owner intervention、task transitions、跨 Agent/host 变化；
- 后续优先考虑 controlled replay / ablation。

当前重点：

1. **Repository-resident executable work artifacts**
   - 不只是 plan 文档，而是可 claim、review、resume、bind evidence 的持久任务状态；
   - 2026 Agent Plans 实证扫描 36,710 个 repo 只找到 85 个 plan / 10 个 repo，说明持久 task artifact 仍罕见。

2. **Exact execution identity + provenance + freshness**
   - exact SHA / dependency ancestry / CI-review-evidence binding；
   - compaction/resume/handoff 后 exact identity 是否降级成 symbolic state；
   - Evidence Pointer Mismatch。

3. **Structured handoff beyond summary**
   - Handoff Debt 已证明 structured notes 有效，因此“handoff 有用”不是 novelty；
   - City 应关注 successor 是否恢复 exact SHA、role eligibility、dependency truth、evidence provenance、next eligible action。

4. **Dynamic asynchronous liveness semantics**
   - TEMPORARILY_UNCLAIMABLE vs STRUCTURALLY_INELIGIBLE vs GLOBAL_EXTERNAL_BLOCK vs POOL_TERMINAL；
   - event wake-up + bounded fallback re-scan；
   - waiting 不占 host / no-idle；
   - role qualification 改变后如何重新进入 ready set。
   - CAID/AsynCodeBench 已研究 dependency collaboration，但这种任务活性分类与 wake semantics 直接研究较少。

5. **Independent review as a state/evidence boundary**
   - 不研究“第二个模型审代码是否更好”本身；
   - 关注 reviewer 是否独立重建 state、验证 exact head、发现 author-path 之外的 user/runtime defect；
   - review independence 与 evidence lineage 的交互。

6. **Registry-assisted Agent onboarding / localization**
   - Capability Registry 是否降低新 Agent 的 repository exploration、重复实现、错误 ownership、错误 UI 定位；
   - repository exploration 本身已有研究，但 semantic capability → implementation → surface map 的效果仍稀疏。

7. **Naturalistic owner intervention taxonomy**
   - 为什么 Owner 必须回来；
   - intervention 发生在哪个阶段；
   - 是否因为 state loss、wrong completion、intent mismatch、eligibility deadlock、UI exposure gap；
   - real-world session 数据已有 pushback/correction 研究，但项目级连续 intervention dynamics 仍较少。

## 2. G4 — 当前案例/系统研究极少

G4 不是“保证前所未有”，而是：

> 截至当前检索，完整问题定义或真实系统级案例非常少；应最高优先保留证据，但论文前必须重新做 literature review。

### G4-A — Unified Repository Control Plane for Long-Horizon Agentic SWE

组合：

```text
repo-resident MissionBook
+ claim/role eligibility
+ exact immutable baseline
+ independent review
+ evidence-bound acceptance
+ resume/handoff
+ dynamic wake/liveness
+ Capability Registry
+ user-reachable state
```

各组成件分别已有邻近工作，但完整作为一个 repository-native software-engineering control plane 的系统研究仍很少。

重点采集：

- 每次 control-plane rule 是由什么真实 failure 推出来的；
- rule 前后的 Owner intervention / duplicate work / false completion / wrong evidence；
- 跨模型、跨 host、跨 session 的连续施工；
- rule interaction，而不是只量单个机制。

### G4-B — Capability State Across Code → Wiring → Reachability → Intent

长期结构化区分：

```text
implementation
→ backend wiring
→ user reachability
→ intent validation
```

再绑定：

```text
semantic CAP id
→ code symbols/paths
→ exact SHA
→ user surface
→ observable information
→ controls
→ E2E evidence
```

传统 requirements traceability 很成熟，但把 runtime/user-surface reachability 与 intent correctness 纳入 agent-readable live registry 的公开研究目前非常少。

### G4-C — Autonomy Survival in Real Project Work

不只统计总成功率，而观察：

```text
start autonomous run
→ task transitions
→ compaction/resume/handoff/wait
→ first required Owner intervention
```

候选指标：

- Time/Steps to Owner Intervention；
- Autonomous Task Transitions；
- Intervention-Free Survival Curve；
- intervention cause-specific hazard；
- task-pool drain before intervention。

已有 human-in-the-loop benchmark 与真实对话 pushback 数据，但这种**项目级连续自治 survival** 度量很少。

### G4-D — Control-Plane Reality Drift Across Multiple Truth Surfaces

研究以下状态之间如何产生 drift：

```text
Mission Book claimed state
Capability Registry claimed state
Git exact state
CI/review evidence state
runtime/UI observed state
```

重点不是“文档会过期”这种常识，而是：

- 哪种 drift 最容易让 Agent 做错误下一步；
- 哪个 transition 最需要 reconciliation；
- 如何确定 authority hierarchy；
- stale but internally consistent control-plane state 是否比缺失状态更危险。

### 原 G4-E — User-Reachable Completion as a First-Class Agent Termination Condition（**现降为 G3**）

不是把 E2E 测试当普通 test，而是研究：

> Agent 的 terminal condition 是否应要求“用户能从正常入口完成 intended verb”而非仅代码/测试完成。

重点比较：

```text
implementation/test terminal
vs
backend-wiring terminal
vs
user-reachable terminal
vs
intent-validated terminal
```

特别关注 Agent 是否在内部测试全绿时过早停止。

### 原 G4-F — Passive Development-to-Research Evidence Pipeline（**现降为 G3**）

City 当前施工不是为了 benchmark 人工制造任务，而是在正常工程中持续记录：

```text
failure
→ repair
→ exact evidence
→ review disagreement
→ owner intervention
→ runtime acceptance
→ research index
```

现有 Change2Task 等工作会从 repository history 重新构造 executable tasks；更少见的是从一开始就让真实 Agent development 具备**可研究的 bounded observability contract**。

值得观察：

- passive instrumentation 对正常开发负担；
- 它能否产生更可信的 longitudinal dataset；
- 与事后 Git/PR mining 相比能多保留哪些状态。

## 3. 降级处理

以下方向继续采集，但不再优先消耗开发资源：

| Topic | New priority | Reason |
|---|---|---|
| branch → SHA 本身 | G1 | mature engineering |
| vertical slice 本身 | G1 | classic SE |
| generic traceability | G1 | mature |
| compact threshold | G2 | highly crowded |
| generic compaction summary | G2 | highly crowded |
| generic execution memory | G2 | crowded in 2026 |
| generic false completion | G2 | fast-growing literature |
| generic handoff notes | G2/G3 | Handoff Debt already exists |
| generic async multi-agent | G2 | CAID + AsynCodeBench |
| generic cross-model review | G2 | direct 2026 studies exist |
| evolving user requirements | G2 | SWE-INTERACT etc. |

## 4. 数据采集预算

### G1

`MINIMAL`

仅记录：

- concrete failure；
- root cause；
- repair；
- exact evidence。

### G2

`STANDARD`

记录正常 telemetry；只有与 G3/G4 交叉时升级。

### G3

`PRIORITY`

尽量记录：

- before/after；
- exact SHA/run ids；
- timeline；
- Owner intervention；
- agent/model/harness；
- handoff/resume；
- quantitative delta；
- independent review；
- research refs。

### G4

`MAXIMUM_BOUNDED`

除 G3 外，再优先记录：

- authority surfaces；
- state transitions；
- conflicting truths；
- event order；
- wake/eligibility changes；
- user reachability path；
- exact evidence bindings；
- control-plane rule version；
- counterfactual/ablation opportunity。

仍禁止保存 hidden chain-of-thought，禁止无界 raw logs。

## 5. 论文故事优先级

### Primary

> **Reliable long-horizon coding requires a persistent software-engineering control plane, not merely a capable model or larger context.**

重点变量：

- durable work state；
- exact execution identity；
- evidence provenance；
- dynamic liveness；
- user-reachable capability state；
- human intervention。

### Secondary

- Capability Exposure / Registry；
- autonomy survival；
- cross-session/multi-agent continuity；
- control-plane reality drift。

### Supporting / stressors

- compaction；
- model switch；
- branch movement；
- CI wait；
- handoff；
- external blocker；
- evolving requirements。

这些是 stressor / experimental condition，不默认作为主 novelty。

## 6. 文献快照锚点

截至 2026-10-05，至少需要持续跟踪：

- Agent Plans: arXiv:2608.04661
- Ledger: arXiv:2608.00808
- Handoff Debt: arXiv:2606.02875
- CAID: arXiv:2603.21489
- AsynCodeBench: arXiv:2609.32662
- SWE-INTERACT: arXiv:2606.30573
- SWE-Milestone (ICML 2026)
- Failure-Transparent Agents: arXiv:2609.35732
- Cross-Model LLM Code Review: arXiv:2607.21656
- Building to the Test: arXiv:2606.28430
- Change2Task: arXiv:2607.28591
- CentaurEval (ICML 2026)

任何正式投稿前必须重新搜索最新文献，G3/G4 评级不是永久 novelty 声明。


## 7. 第二轮定向扫描补充（2026-10-05）

这一轮专门寻找新的 G3/G4 候选，并对几个看似稀缺的方向重新降级。

### 7.1 新增降级到 G2 的方向

- **generic repository instruction / AGENTS.md / rule learning**：已有 AGENTS.md 实证、Do Agent Rules Shape or Distort、RuleEvolve、AgentGuard，以及 accumulated behavioral rules；“给 Agent 写规则会不会更好”已经不是稀缺问题。
- **generic long-horizon maintenance / technical debt**：SWE-CI、SlopCodeBench、ChainSWE、SWE-Chain、EvoClaw 已经形成明显热点。
- **generic merge conflict / concurrent editing**：AgenticFlict、AgentRoom、agent-authored PR concurrency 已直接研究。
- **generic abstention / no-op / action bias**：FixedBench 与 OverEager 已直接覆盖。
- **generic logging / observability debt**：已有 4,550 个 agentic PR 的 logging 实证；普通“Agent 不会好好打日志”不再是稀缺点。
- **plain intervention count**：SWE-Together 已使用 corrective feedback turns，The Work Behind Delegation 已建立 supervision workflow framework。

这些方向继续留正常 telemetry，但不再消耗 G3/G4 的优先证据预算。

### 7.2 新增 G3 — Rule lifecycle / governance debt

自动学规则本身已经进入 G2；更稀缺的是**规则的完整生命周期**：

```text
real failure
→ rule introduced
→ scope / owner / evidence bound
→ future activations
→ prevented recurrence OR false blocking
→ conflict / stale condition
→ supersede / retire
```

建议记录：

- rule_id / governing file / exact rule version；
- source failure episode；
- introduced_at / superseded_at / retired_at；
- applies_to scope；
- conflict_with_rule_ids；
- violation recurrence；
- false_block / unnecessary restriction；
- token/context overhead（可测时）；
- tasks where the rule changed outcome；
- evidence that justified keeping/removing it。

研究问题不是“规则是否有用”，而是：

> **长期 Agent 工程里的规则会不会形成 governance debt，以及如何知道一条历史上正确的规则现在应该继续、收窄、supersede 或删除？**

### 7.3 新增 G3 — Owner attention fragmentation / escalation quality

人类监督已经是热点，因此不只数 intervention 次数。

重点记录：

```text
HIGH_VALUE_DECISION
AVOIDABLE_TECHNICAL_ESCALATION
REPEAT_CLARIFICATION
APPROVAL_ONLY
RECOVERY_REQUIRED
AMBIGUOUS_REQUIREMENT
PERMISSION_OR_VALUE_JUDGMENT
```

以及：

- escalation 是否可以由现有规则/证据自动解决；
- 是否可以与其它问题 batch；
- Owner 回复后 Agent 是否一次恢复，还是重复追问；
- escalation 前是否已经做了足够 bounded diagnosis；
- 同一 root cause 是否多次打断 Owner；
- intervention burst / clustered interruptions；
- 从第一次 escalation 到真正恢复自治的时间。

这比单纯 Owner intervention count 更贴近“甩手掌柜”的真实成本。

### 7.4 新增 G3 — Semantic integration beyond textual merge

普通 merge conflict 已经降到 G2。重点转向：

> **两个分支都通过各自 CI、Git 也能干净 merge，但 union 后产品语义不一致。**

建议 failure labels：

```text
TEXTUALLY_CLEAN_SEMANTIC_CONFLICT
ACCEPTED_CAPABILITY_OVERWRITTEN
DEPENDENCY_UNION_SEMANTIC_MISMATCH
POST_MERGE_REGISTRY_RUNTIME_MISMATCH
POST_MERGE_USER_INTENT_REGRESSION
```

优先保存：

- branch A/B exact accepted SHAs；
- 各自独立 CI/Review evidence；
- merge/union exact SHA；
- 哪个语义 invariant 在 integration 后被破坏；
- 为什么单分支测试没有捕获；
- Registry/用户入口/ownership 是否一起漂移；
- integration 修复前后证据。

### 7.5 没有新增“硬凑”的 G4

第二轮扫描没有发现一个比现有 G4-A..F 更可信的新完整问题。当前仍优先：

- unified repository control plane；
- capability implementation→wiring→reachability→intent；
- autonomy survival；
- multi-truth reality drift；
- user-reachable completion terminal；
- passive development-to-research evidence pipeline。

**不为了让列表更长而制造 G4。**

### 7.6 新增文献监控锚点

- CodeTracer — arXiv:2604.11641
- SlopCodeBench — arXiv:2603.24755
- SWE-CI — arXiv:2603.03823
- ChainSWE — arXiv:2607.02606
- EvoClaw — arXiv:2603.13428
- Do Agent Rules Shape or Distort? — arXiv:2604.11088
- RuleEvolve — arXiv:2610.00650
- AgentGuard — arXiv:2609.16287
- Instruction Adherence in Coding Agent Configuration Files — arXiv:2605.10039
- The Work Behind Delegation — arXiv:2609.24234
- SWE-Together — arXiv:2606.29957
- AgentRoom — arXiv:2608.23740
- AgenticFlict — arXiv:2604.03551
- Coding Agents Don't Know When to Act — arXiv:2605.07769
- The Working Set of a Coding Agent / Coherence Debt — arXiv:2608.16630

2026-09~10 更新速度很快，尤其 self-evolving rules、learned guardrails、intervention sentinels、multi-agent concurrency，可能数周内从 G3 滑到 G2。


## 8. 保守评级修正：G4-E / G4-F → G3

进一步核对 2026 文献后：

### User-Reachable Terminal：G4 → G3

Building to the Test 已直接展示“测试通过但用户请求的 artifact 实际未交付”，并明确指出 Agent 不会自动像用户一样验证其产物；false-success 研究也已系统分析“Agent 宣布成功但环境状态并未完成”。

因此 City 的特殊价值仍在：

- reachability / intent 作为 capability registry 的长期状态；
- 正常用户 verb 作为 Mission terminal gate；
- longitudinal project evidence；

但“completion signal ≠ 用户真正得到功能”本身已经不能视为 G4。

### Passive Evidence Pipeline：G4 → G3

SWE-chat 已持续从真实开发者公开工作流收集 coding-agent sessions；TraceLab 也从日常 Claude Code / Codex 使用中持续抽取、清洗真实 trace。

City 仍有差异：

- evidence 从一开始绑定 Mission/Registry/exact SHA/Review/Owner intervention；
- 不是只采 session trace，而是 capture software-engineering control-plane transitions；
- 可直接生成 replay/ablation candidate。

但“正常使用过程中被动积累研究数据”本身不再足够稀缺，因此降为 G3。

### 当前 G4 最终保留

```text
G4-A Unified repository control plane (full integrated system)
G4-B Capability live state: implementation→wiring→reachability→intent
G4-C Project-level autonomy survival until Owner intervention
G4-D Multi-truth control-plane reality drift
```

这四条也仍然只是 **MAXIMUM_BOUNDED evidence priority**，不是首创声明。

## 9. Monitor / Decision 观测补充

本轮 City Work Monitor / JEV / Decision 设计采用保守评级：

### G2

- generic Agent dashboard / agent tree / topology graph；
- 普通 session log / status card；
- generic observability UI；
- 单纯 progressive disclosure。

这些继续正常采集，但不作为独立 novelty。

### 新增 G3 关注

1. **Hierarchical risk bubbling**：总图折叠细节时是否仍把 active warning/block/retry/degraded state 向上冒泡。
2. **Edge-causal observability**：handoff/retry/review/device/model route 的路径是否携带可追溯 trigger/reason/evidence，而不只显示 node state。
3. **Observe–decide decoupling**：continuous sidecar observation 与 event-triggered per-task Decision 能否避免全城同步瓶颈。
4. **Decision escalation provenance**：RULE → FAST_MODEL → CRITIC → OWNER 的来源、延迟、错误、重复升级与自治恢复。

### 不新增独立 G4

全城监视器本身不自动升级为 G4。其价值优先作为已有：

- G4-A unified repository control plane；
- G4-C autonomy survival；
- G4-D multi-truth reality drift；

的 measurement / reconciliation surface。

专题材料：`CITY_WORK_MONITOR_OBSERVATION_DECISION_2026-10-05.md`。

---

语言配对 / Language pair: [中文 / Chinese](../zh-CN/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md) · [English](../en/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md)
