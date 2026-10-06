# 长时 Agent 的状态身份、来源与时效性 — SHA 锚点修订研究素材

> 状态：**RESEARCH MATERIAL / FAILURE-MODE RECORD / NOT A STANDALONE CLAIM**  
> 日期：2026-10-05  
> 起因：Mission Book 最近把可执行工程书的关键 baseline / dependency / review / CI / acceptance 锚点，从 mutable branch/head 语义修订为 immutable full commit SHA，并增加 required ancestor、exact-head evidence 与 reconciliation 规则。  
> 定位：**“branch → SHA”本身不是独立论文贡献；它是 long-horizon agent execution-state reliability 的一个真实 failure mode、设计演化证据和后续 ablation 维度。**

## 1. 核心研究抽象

真正值得研究的不是：

> Git branch 会移动，所以应该 pin commit。

而是：

> **长时、异步、多 Agent 软件工程中，持久化状态如果只保存可变 symbolic reference，仍可能在时间推进后失去身份与有效性；Agent 需要可验证的 state identity、provenance 与 freshness semantics。**

因此：

```text
Reliable External State
!= Any External State
```

候选结构：

```text
Reliable External State
= persistence
+ immutable identity
+ provenance/dependency relation
+ validity/freshness revalidation
```

## 2. RQ4 — State identity and validity

> **Which execution-state fields require immutable identity, provenance binding, and explicit validity checks during long-horizon agent execution?**

### 2.1 Identity

比较：

```text
conversation-only symbolic belief
vs
persistent branch/tag/head name
vs
immutable full commit SHA / artifact digest / run id
```

观察：

- stale-state error；
- wrong baseline；
- wrong merge source；
- wrong review target；
- duplicate/regression work。

### 2.2 Provenance

比较：

```text
SHA only
vs
SHA + required ancestor/dependency SHAs
vs
SHA + explicit evidence/run provenance
```

观察：

- dependency omission；
- accepted capability silently missing；
- incorrect green-CI attribution；
- review/evidence pointer mismatch。

### 2.3 Freshness / validity

比较：

```text
record once and trust forever
vs
revalidate before critical transition
```

重点 critical transition：

- claim；
- resume after compaction；
- handoff；
- Review；
- CI attribution；
- merge/integration；
- completion / acceptance；
- external-blocker recovery。

## 3. 真实工程 failure episode：mutable ref drift

典型轨迹：

```text
t0  Agent claims task
    baseline_symbolic_ref = main

t1  another agent / merge advances main

t2  original agent resumes
    remembered "main" now resolves to a different world state
```

关键点：

- branch 名没有“错”；
- 新的 branch tip 也可能完全健康；
- Agent 的历史推理却绑定在旧世界；
- 如果只保留 symbolic ref，恢复时可能失去“当时到底基于哪一版”的身份信息。

这应分类为：

`MUTABLE_REFERENCE_STATE_DRIFT`

而不是普通 Git failure。

## 4. Evidence Pointer Mismatch

尤其保留以下真实或未来 episode：

```text
expected task head = SHA_A
observed branch    = feature-x
current branch tip = SHA_B
CI(SHA_B)          = GREEN
```

此时：

- “CI 是绿色”可能是真的；
- “SHA_A 已被验证”仍然是假的。

分类：

`EVIDENCE_POINTER_MISMATCH`

建议记录：

```text
expected_identity
observed_symbolic_ref
resolved_identity_at_use
evidence_identity
mismatch_detected
critical_transition
consequence_if_not_detected
reconciliation_action
owner_intervention_required
```

## 5. Compaction / Resume 交叉效应

这是与 Context Lifecycle 研究最值得连接的一点。

压缩前若有：

```text
branch = integration-x
exact_sha = abc...
```

压缩后若只剩：

```text
working on integration-x
```

就可能把 **immutable identity 压缩成 mutable symbolic state**。

因此候选原则：

> **Identifiers with execution semantics should be serialized exactly, not semantically summarized.**

优先 exact-copy / structured serialization 的字段包括：

- full commit SHA；
- task/workbook id；
- claim owner / host identity；
- dependency accepted SHA；
- artifact digest；
- CI run/job id；
- experiment/run id；
- versioned schema / configuration id；
- immutable acceptance evidence ref。

这可与 State Reconstruction Accuracy 联合测量：

- semantic state 是否恢复；
- exact identity 是否恢复；
- provenance relation 是否恢复；
- freshness 是否重新验证。

## 6. 后续 controlled ablation

候选状态表示层次：

| Level | Representation |
|---|---|
| L0 | conversational symbolic state only |
| L1 | persistent mutable symbolic refs |
| L2 | immutable exact identity |
| L3 | immutable identity + provenance/dependency |
| L4 | immutable identity + provenance + critical-point revalidation |

可在并发 branch advance、resume、compaction、handoff、CI completion 等受控事件下测：

- stale-state error rate；
- evidence pointer mismatch；
- wrong completion；
- wrong merge/review target；
- duplicate/regression work；
- Owner intervention；
- recovery success；
- State Reconstruction Accuracy；
- autonomous task transitions。

## 7. 论文使用边界

### 不适合单独主张

- “commit SHA 比 branch 稳定”；
- “Git branch 是 mutable ref”；
- “关键依赖最好 pin version”。

这些属于成熟工程常识。

### 值得作为论文组成部分

- long-horizon agent failure taxonomy；
- persistent external state 并不自动等于 reliable state；
- mutable symbolic reference 在 asynchronous multi-agent execution 中导致 temporal state drift；
- exact identity + provenance + freshness 对 recovery / compaction / handoff 的影响；
- execution-semantic identifiers 是否必须 escape semantic summarization。

## 8. 与现有 Context Lifecycle 主线的关系

原主线：

> **When to compact → What to retain → What to externalize**

增加第四问：

> **What must remain immutable and be revalidated?**

因此更完整的设计问题是：

```text
When to compact
→ What to retain
→ What to externalize
→ What must preserve exact identity / provenance / freshness
```

---

语言配对 / Language pair: [中文 / Chinese](../zh-CN/LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md) · [English](../en/LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md)
