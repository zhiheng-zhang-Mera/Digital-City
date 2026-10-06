# Capability Exposure Gap 与 User-Reachable Vertical Slice — 论文素材采集重点

> 状态：**RESEARCH MATERIAL / RECURRING FAILURE MODE / NOT YET A CAUSAL FINDING**  
> 日期：2026-10-05  
> 来源：Hns、Boss 与 Utopia 多次出现“内部实现很完整，但用户找不到 / 点不到 / 行为并非 Owner 原本意图”的重复现象。  
> 本文件记录后续开发时需要持续采集的 evidence；不把经典 vertical-slice / walking-skeleton 实践本身包装成新颖性。

## 1. 核心现象

Agent 很容易优化：

```text
architecture
→ backend logic
→ tests
→ CI
→ implementation complete
```

但用户真正需要的是：

```text
discoverable entry
→ real backend wiring
→ observable state/result
→ behavior matches user intent
```

因此：

> **Implementation complete != user-reachable complete != intent complete**

## 2. 研究问题

### RQ-A — Capability Exposure Gap

长时间 Agent 施工是否系统性地产生：

- hidden capability；
- missing entry；
- false affordance；
- backend/UI semantic mismatch；
- cross-platform parity gap？

### RQ-B — Construction order

比较：

```text
horizontal implementation-first
vs
UI-shell-first
vs
user-reachable thin vertical slice first
```

重点不是“先做 UI”本身，而是：

> **先建立一条从真实用户入口到真实后端再回到真实结果的最薄闭环，再向内部和表面扩展。**

### RQ-C — Registry-assisted development

Capability Registry 是否能够减少：

- Agent 重复实现已经存在的能力；
- 找错 canonical module；
- 找不到真实 UI 入口；
- 把 implementation complete 错当 product complete；
- 新 Agent onboarding 时的大范围 grep / architecture inference；
- Registry 与 runtime reality 漂移？

## 3. 四个 completion dimension

每个 capability 至少区分：

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

这四个状态分别回答：

1. 代码是否存在；
2. 用户/API 动作是否接到正确 backend；
3. 普通用户是否能找到并调用；
4. 实际行为是否符合已接受的用户语义。

## 4. 值得采集的自然施工字段

```text
capability_id
source_workbook_id
agent_model
agent_harness
implementation_completed_at
first_surface_available_at
backend_wiring_verified_at
reachability_verified_at
intent_validated_at

exposure_class
surface_platform
surface_location
user_steps_to_reach
hidden_capability_detected
false_affordance_detected
wrong_semantics_detected
parity_gap_detected
registry_stale_detected
registry_reality_mismatch_detected

owner_intervention_count
owner_intervention_reason
rework_required
rework_commits_or_files_if_measurable
duplicate_implementation_detected
navigation_or_discovery_failure
time_to_first_user_reachable_slice
registry_reconciliation_result

exact_implementation_sha
ui_or_e2e_evidence_ref
```

无法测量的字段写 `NOT_OBSERVABLE + reason`，不得猜。

## 5. 候选指标

### Exposure Lag

```text
Exposure Lag =
  T(reachability_verified)
  - T(implementation_complete)
```

### Intent Lag

```text
Intent Lag =
  T(intent_validated)
  - T(implementation_complete)
```

### Capability Exposure Gap

不建议只用一个简单计数定义最终指标，但至少可观察：

- implementation COMPLETE + reachability MISSING；
- wiring VERIFIED + intent MISMATCH；
- Registry CLAIMED + runtime reality mismatch；
- first-class platform parity differences。

### Time to First User-Reachable Slice

从 workbook 开始，到第一条真实用户路径可完成的时间。

## 6. 真实 failure taxonomy

推荐分类：

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

## 7. Controlled study 候选

未来 controlled replay 可比较：

| Condition | Construction strategy | Registry |
|---|---|---|
| A | implementation-first | none |
| B | implementation-first | registry |
| C | thin vertical slice first | none |
| D | thin vertical slice first | registry |

控制 task/spec/baseline/tool availability，比较：

- time to first usable feature；
- hidden-capability count；
- false-affordance count；
- owner interventions；
- rework；
- intent mismatch；
- final E2E acceptance；
- duplicate implementation；
- Agent onboarding/search cost。

## 8. 与 City Capability Registry 的关系

`capability-registry/` 是长期结构化数据源：

- Registry 保存当前 verified capability state；
- Mission Book 保存施工任务与状态变化；
- reports/evidence 保存过程与失败链；
- Research Institute 保存专题归纳。

Registry 不能替代真实 UI/E2E evidence，也不能自证正确。

## 9. 新颖性边界

不要把以下内容作为主要 novelty：

- vertical slice 比纯分层开发好；
- UI 需要可发现；
- backend 与 frontend 应该连通。

真正值得研究的是：

> **Agentic software development 是否存在稳定的 implementation-to-exposure gap，以及 durable capability registry + user-reachable vertical-slice gating 是否能降低这种 gap、人工接续和返工。**

---

语言配对 / Language pair: [中文 / Chinese](../zh-CN/CAPABILITY_EXPOSURE_GAP_USER_REACHABLE_VERTICAL_SLICES_2026-10-05.md) · [English](../en/CAPABILITY_EXPOSURE_GAP_USER_REACHABLE_VERTICAL_SLICES_2026-10-05.md)
