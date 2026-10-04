# Research Evidence Protocol / 研究素材强制留存

> **状态：ACTIVE / NORMATIVE FOR REX PROGRAMME**
>
> 目标：把 Research Fabric 的开发过程和它产生的实验数据都变成未来论文、artifact、PhD research statement 可复查的证据。

## 1. 两类素材必须同时保存

### A. 工程过程素材

包括：

- command/runtime error；
- test / CI failure；
- browser / Android / Windows failure；
- race / timeout / stale state；
- wrong assumption；
- design conflict；
- Development / Review disagreement；
- rejected design；
- measurement-tool defect；
- repair before/after；
- exact SHA / configuration。

### B. 研究实验素材

包括：

- experiment manifest；
- topology；
- independent/dependent variables；
- run seed；
- repetition index；
- software/config SHA；
- device/provider/model identity；
- start/end timestamps；
- task/action/event refs；
- latency；
- retry；
- handoff；
- failure/recovery；
- Owner intervention；
- resource observations；
- outcome；
- exclusion reason；
- normalized row；
- artifact digest。

## 2. 存储层次

### Raw runtime

```text
Utopia/.runtime/evidence/mission-book/<REX-ID>/<run-id>/
```

保存完整但本机 git-ignored 的原始证据。

### Selected shared evidence

```text
Utopia/evidence/raw/mission-book/<REX-ID>/
```

只提交有界、非敏感、可复查的：

- failing/passing pair；
- structured receipts；
- experiment samples；
- fault campaign results；
- timing tables；
- review falsification；
- replay diff；
- screenshots。

### Evolution events

继续使用现有 event contract，不私造 eventType。

### City research index

每个任务必须：

```text
Digital-City/mission-book/reports/<REX-ID>/PAPER_MATERIAL_INDEX.md
```

programme 最终必须：

```text
Digital-City/mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md
```

## 3. 不允许只保留成功实验

每个 campaign 必须保留：

- successful runs；
- failed runs；
- excluded runs；
- infrastructure failures；
- measurement failures。

数据排除必须有机器可读 reason，不能因为“不好看”删除。

## 4. Measurement defect 独立分类

若错误来自：

- test harness；
- clock；
- trace collector；
- parser；
- stale log；
- replay driver；

必须标：

`MEASUREMENT_DEFECT`

不得算成 product defect，也不得静默修掉。

## 5. Quantitative minimum

能量化时必须记录数值，不接受只写：

> improved / faster / stable

应记录例如：

- completion_time_ms；
- recovery_time_ms；
- handoff_time_ms；
- owner_intervention_count；
- retry_count；
- failure_rate；
- duplicate_execution_count；
- lost_event_count；
- convergence_time_ms；
- successful_runs / total_runs。

指标不存在或无法测量时也要写 `NOT_MEASURED + reason`，不得填 0 冒充。

## 6. Defect chain

所有有价值 defect 尽量保存完整链：

```text
OBSERVATION
→ REPRODUCTION
→ ROOT CAUSE
→ REPAIR
→ REGRESSION GUARD
→ OPPOSITE-HOST VERIFICATION
```

## 6A. Long-Horizon Agent Context Lifecycle / 长时 Agent 上下文生命周期

REX programme 若自身使用长时间/异步 Agent 施工，或实验对象涉及 Agent autonomy，必须同时遵守 `mission-book/CONSTRUCTION_RULES.md §14B`。

重点保留：

- compaction / context reset / resume 的触发原因与时机；
- token/context occupancy（若 harness 暴露）；
- task phase / semantic boundary；
- compaction 前后 authoritative task state；
- summary/checkpoint artifact ref；
- Mission Book / report / exact SHA / CI receipt 等 external-state refs；
- post-compaction state reconstruction error；
- Owner intervention；
- duplicate/regression work；
- false completion；
- stale-state/stale-SHA error；
- autonomous work span / successful task transitions（若可测）。

专题研究问题与字段定义见 Research Institute：

`paper-materials/{zh-CN,en}/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md`

工具未暴露的数据必须写 `NOT_OBSERVABLE + reason`；不得猜测。

研究证据仅限 observable execution state / behavior；**不得要求、推断或保存隐藏 chain-of-thought / private reasoning**。


## 6B. State Identity, Provenance & Freshness / 状态身份、来源与时效性

当 REX 任务涉及长时 Agent、并发施工、resume/compaction、handoff、CI/Review evidence 或 branch movement 时，除了 §6A，还必须观察 external execution state 的 **identity / provenance / freshness**。

重点 failure modes：

```text
MUTABLE_REFERENCE_STATE_DRIFT
EVIDENCE_POINTER_MISMATCH
BASELINE_ANCESTRY_MISMATCH
STALE_EXECUTION_IDENTITY
PROVENANCE_RELATION_MISMATCH
```

优先保留：

```text
expected_identity
observed_symbolic_ref
resolved_identity_at_use
evidence_identity
required_ancestor_or_dependency_refs
critical_transition
freshness_revalidation_event
mismatch_detected
consequence_if_not_detected
reconciliation_action
owner_intervention_required
```

研究比较不应停留在“branch vs SHA”，而应区分：

```text
L0 conversational symbolic state
L1 persistent mutable symbolic refs
L2 immutable exact identity
L3 immutable identity + provenance/dependency
L4 immutable identity + provenance + critical-point revalidation
```

尤其检查 compaction / summary 是否把 exact SHA、run id、artifact digest、task id、claim owner、dependency SHA 等 execution-semantic identifier 降级成模糊 symbolic state。

专题材料：

`paper-materials/{zh-CN,en}/LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md`

“Git branch 是 mutable ref”本身不作为新颖性主张；真正的研究对象是 long-horizon Agent 的 temporal state drift、evidence binding 与恢复可靠性。

## 6C. Capability Exposure Gap & Registry / 能力暴露缺口与登记册

当任何 REX task 自身新增/修改 capability，或实验对象涉及 Agent 软件开发流程，必须同时观察：

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

重点 failure labels：

```text
IMPLEMENTED_BUT_UNREACHABLE
VISIBLE_BUT_NOT_WIRED
VISIBLE_WRONG_SEMANTICS
DISCOVERABILITY_GAP
SURFACE_PARITY_GAP
CAPABILITY_REGISTRY_STALE
CAPABILITY_REGISTRY_REALITY_MISMATCH
DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE
```

能测量时保留：

```text
capability_id
implementation_completed_at
first_surface_available_at
reachability_verified_at
intent_validated_at
user_steps_to_reach
owner_intervention_count
rework_required
duplicate_implementation_detected
registry_reconciliation_result
exact_implementation_sha
ui_or_e2e_evidence_ref
```

候选观察指标：

```text
Exposure Lag =
  T(reachability_verified)
  - T(implementation_complete)
```

如果后续做 controlled study，应区分：

```text
implementation-first
UI-shell-first
user-reachable thin vertical slice first
```

并同时比较有/无 durable Capability Registry。

专题材料：

`paper-materials/{zh-CN,en}/CAPABILITY_EXPOSURE_GAP_USER_REACHABLE_VERTICAL_SLICES_2026-10-05.md`

经典 vertical-slice / discoverability 工程实践本身不作为 novelty；研究对象是 Agentic development 的 implementation-to-exposure gap、Registry 辅助效果、返工与 Owner intervention。

## 6D. Research Priority Triage / 研究优先级分流

REX 不再把所有可测现象当成同等论文机会。

权威 watchlist：

`mission-book/RESEARCH_SIGNAL_WATCHLIST.yaml`

策略：

```text
G1_MATURE        → MINIMAL
G2_CROWDED       → STANDARD
G3_SPARSE_ACTIVE → PRIORITY
G4_RARE_SYSTEMIC → MAXIMUM_BOUNDED
```

### 当前 G3 重点

- repository-resident executable work state；
- exact identity / provenance / freshness；
- structured handoff with exact continuation state；
- dynamic liveness / eligibility / wake semantics；
- independent Review as state/evidence boundary；
- Registry-assisted Agent onboarding/localization；
- naturalistic Owner intervention taxonomy。

### 当前 G4 重点

- unified repository-native control plane；
- capability implementation→wiring→reachability→intent state；
- autonomy survival until Owner intervention；
- MissionBook/Registry/Git/CI/UI reality drift；
- user-reachable completion as termination condition；
- passive normal-development → research-evidence pipeline。

### REX 数据要求

G3/G4 campaign 除普通 experiment manifest 外，应尽量包含：

```text
research_signal_id
research_grade_snapshot
control_plane_rule_version
before_state
after_state
authority_surfaces
event_order
exact SHA/run/artifact ids
agent/model/harness
owner_intervention
task_transition_count
handoff/resume state
wake/eligibility state
user_reachability state
conflicting_truths
independent_review_result
ablation_or_replay_candidate
```

如果字段无法观察，写 `NOT_OBSERVABLE + reason`。

G1/G2 不得为了论文而制造额外 workload。G3/G4 也只能做 bounded instrumentation；专门 fault injection / controlled ablation 必须由对应 REX workbook 明确授权。

研究院策略快照：

`paper-materials/{zh-CN,en}/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md`

所有 grade 只代表当前采集优先级；投稿前必须刷新 literature review。

## 7. Completion gate

任一 REX task 缺以下任一项不得 complete：

- DEVELOPMENT_REPORT；
- REVIEW_REPORT；
- PAPER_MATERIAL_INDEX；
- required evolution events；
- exact-head CI；
- exposure-decision evidence；
- required experiment/raw pointers。

REX-890 必须生成 programme synthesis，归纳可直接用于论文的方法学、失败分类和 quantitative findings。
