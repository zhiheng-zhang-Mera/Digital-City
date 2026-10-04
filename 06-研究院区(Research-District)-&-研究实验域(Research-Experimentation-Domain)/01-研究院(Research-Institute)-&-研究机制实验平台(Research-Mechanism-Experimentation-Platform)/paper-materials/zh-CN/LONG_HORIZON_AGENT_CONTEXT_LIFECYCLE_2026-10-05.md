# 超长时 Agent 上下文生命周期与外部执行状态 — 论文素材采集重点

> 状态：**RESEARCH MATERIAL / HYPOTHESIS-DRIVEN / NOT YET A CAUSAL FINDING**  
> 日期：2026-10-05  
> 目的：把近期 Codex / GPT-5.6 Astra 与 DeepSeek V4.1 Flash 长时间托管施工体验中出现的问题，转化为未来开发过程中的持续证据采集重点。  
> 本文件不是立即要求实现某一种 compaction 算法，而是规定未来施工时“值得留下什么证据”。

## 1. 核心研究问题

### RQ1 — When to compact
长时间软件工程 Agent 应该在什么时候压缩工作上下文？

重点不只比较固定窗口百分比，还要记录：

- context occupancy / token pressure；
- 是否靠固定阈值触发；
- 是否在 task / subtask / commit / test 等语义边界触发；
- 是否在错误密集、debug 未收敛时触发；
- 是否由 harness 自动触发、Owner 手动触发、或 Agent 主动触发；
- 从上一次 compaction / session start 到触发点之间的有效施工跨度。

候选假设：

- 单纯“到 X% 就压缩”未必最优；
- semantic boundary 可能比固定 token threshold 更适合作为压缩时机；
- debug / root-cause 未收敛阶段过早压缩可能增加状态丢失和重复探索。

### RQ2 — What survives compaction
压缩时什么必须保留、什么可以摘要、什么应该仅保留外部引用、什么可以丢弃？

重点区分：

1. **Active working context**
   - 当前目标；
   - 当前假设；
   - 最近错误；
   - 当前修改位置；
   - 紧邻的下一步。

2. **Compressed semantic state**
   - 已确认设计决策；
   - 用户/系统约束；
   - 已排除 root cause；
   - 失败方案与禁止重复路径；
   - acceptance criteria；
   - 尚未解决的 blocker。

3. **External referenced evidence**
   - 完整 CI / test logs；
   - 大型 trace；
   - 历史 diff；
   - 截图；
   - benchmark / measurement raw data。

4. **Authoritative structured execution state**
   - workbook/task id；
   - claim/host；
   - exact branch + full SHA；
   - dependency state；
   - completed / remaining work；
   - acceptance gate；
   - next eligible action。

5. **Safe-to-discard transient noise**
   - 重复 terminal 输出；
   - 已无后续价值的普通成功日志；
   - 不影响未来判断的重复查询。

核心观察方向：

> “发生了什么”的自然语言摘要，是否不如“系统现在是什么状态”的结构化 state serialization 适合超长任务恢复？

### RQ3 — What should live outside the prompt
哪些 Agent 状态不应该依赖 conversation/context 本身，而应外置到可恢复的持久执行状态？

重点观察 Mission Book / reports / exact SHA / CI receipts / task pool 对以下问题的影响：

- compaction 后能否准确恢复当前任务；
- session restart / model switch 后能否继续；
- 是否减少重复施工；
- 是否减少 stale branch / stale state；
- 是否降低错误 COMPLETE；
- 是否降低 Owner 手工接续频率；
- 是否延长连续 autonomous work span；
- 是否使弱/快模型更接近原生长时托管 harness 的连续施工能力。

### RQ4 — What must remain immutable and be revalidated
哪些 execution-state 字段不能只“记住意思”，而必须保持 exact identity、provenance 和 freshness？

这一问题来自 Mission Book 最近的真实修订：关键 baseline / dependency / review / CI / acceptance 锚点从 mutable branch/head 语义改为 immutable full commit SHA，并增加 ancestor/provenance 与 critical-point revalidation。

重点不是“Git branch 会动”这个成熟工程常识，而是观察：

- persistent external state 是否仍会因为 mutable symbolic ref 发生 temporal drift；
- compaction 是否会把 exact identity 压缩成 symbolic state；
- green CI 是否可能绑定到错误的 head；
- SHA-only、SHA+provenance、SHA+revalidation 的可靠性差异；
- resume / handoff / review / merge / completion 前重新验证 freshness 是否减少错误。

专题材料：

`LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md`

候选原则：

> **Identifiers with execution semantics should be serialized exactly, not semantically summarized.**

## 2. 未来施工时优先采集的自然实验数据

只要施工工具能够观察到，长时间/异步 Agent run 尽量记录：

```text
agent_provider
agent_model
agent_harness
harness_version_or_sha
workbook_id
run_or_session_id
start_time
end_time

context_window_limit_if_known
context_tokens_before_compaction_if_known
context_occupancy_ratio_if_known
compaction_trigger
compaction_trigger_reason
task_phase_at_compaction
semantic_boundary_type
pre_compaction_task_state
post_compaction_task_state

summary_or_checkpoint_artifact_ref
external_state_refs_used
state_fields_reconstructed
state_reconstruction_errors

owner_intervention_count
owner_intervention_reason
task_transitions_completed
duplicate_work_count
stale_state_error_count
false_completion_count
regression_or_reopened_work_count
recovery_time_if_measurable
autonomous_work_span_if_measurable
terminal_reason

expected_identity_if_applicable
observed_symbolic_ref_if_applicable
resolved_identity_at_use_if_applicable
evidence_identity_if_applicable
provenance_or_required_ancestor_refs
freshness_revalidation_event
identity_or_evidence_mismatch_type
reconciliation_action
```

若 harness 不暴露 token 数、压缩内容或 trigger，必须记录：

```text
NOT_OBSERVABLE + reason
```

不得猜测或填 0。

## 3. Compaction 前后恢复检查

若发生 compaction / context reset / session resume，优先检查 Agent 是否能正确恢复：

1. 当前 mission / workbook 是什么；
2. 当前 exact branch / full SHA 是什么；
3. 哪些工作已完成；
4. 哪些工作仍未完成；
5. 当前已知 blocker / failure 是什么；
6. 下一步应该做什么；
7. 哪些路径已经验证失败、不得无意义重做；
8. completion / acceptance 需要满足什么条件。

可据此形成 future metric：

**State Reconstruction Accuracy (SRA)**

```text
SRA = correctly reconstructed required state fields
      / all required state fields
```

字段必须来自外部 ground truth 比对，而不是由同一个 Agent 自评。

## 4. 建议重点观察的结果指标

- Owner Intervention Rate；
- Autonomous Work Span；
- time / task transitions until next owner intervention；
- compaction recovery success；
- State Reconstruction Accuracy；
- false completion rate；
- duplicate / regression work；
- stale-state / stale-SHA errors；
- task-pool drain success；
- total token / cost（若可测）；
- wall-clock completion time；
- successful autonomous task transitions。

“运行时间更久”不能单独视为成功；若 Agent 只是循环、空等、重复测试或错误扩张任务，必须单独分类。

## 5. 后续可做的 controlled comparison

自然施工日志用于发现现象与建立 longitudinal case study；因果结论应由 controlled replay / ablation 验证。

候选条件：

| Variant | Compaction | Summary/state | External persistent execution state |
|---|---|---|---|
| A | overflow / default | generic | none |
| B | fixed threshold | generic | none |
| C | semantic/task boundary | structured | none |
| D | default/controlled | structured | Mission Book |
| E | adaptive timing | structured | Mission Book |

跨模型/跨 harness 时，应尽量保持 task、repo baseline、acceptance 和可用工具一致。

## 6. 当前研究立场

当前已有体验只支持：

- 问题真实存在；
- Mission Book 建立前后人工接续模式发生了明显变化；
- DeepSeek 类长时施工对 compaction 与可持续任务队列更敏感的现象值得系统测量。

**当前不应直接宣称**：

- 某个固定压缩阈值最优；
- Mission Book 已被因果证明提升某个百分比；
- 某模型本质上比另一模型更适合长时自治。

这些需要后续受控实验排除模型版本、harness、项目成熟度、任务难度和 prompt 变化等混杂因素。

## 7. 数据边界

论文素材只采集可观察的工程证据和显式状态：

- prompt / instruction（允许保存时）；
- compaction event / checkpoint artifact；
- task state；
- logs / CI / test；
- timestamps；
- token/cost telemetry（若工具提供）；
- Owner intervention；
- branch/SHA；
- observable action sequence / result。

**不得要求、推断或保存模型隐藏 chain-of-thought / private reasoning。**

研究重点是 execution state、observable behavior 与恢复能力，而不是不可观察的内部推理文本。

## 8. 一句话研究主线

> 超长任务的目标不是让 Agent 永远记住一切，而是让它能够安全地遗忘，并从可靠的外部执行状态中准确恢复。

可进一步抽象为：

> **When to compact → What to retain → What to externalize → What must remain immutable and be revalidated.**

